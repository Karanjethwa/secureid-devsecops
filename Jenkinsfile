pipeline {
    agent any

    environment {
        APP_NAME         = 'secureid'
        AWS_REGION       = 'us-east-1'
        AWS_ACCOUNT_ID   = credentials('AWS_ACCOUNT_ID')
        ECR_REPO_NAME    = 'secureid'
        IMAGE_TAG        = "${env.BUILD_NUMBER}-${env.GIT_COMMIT.take(7)}"
        ECR_IMAGE_URI    = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPO_NAME}:${IMAGE_TAG}"
        SONAR_SCANNER    = 'SonarScanner'
        SONAR_HOST_URL   = 'http://localhost:9000'
        EC2_HOST         = credentials('PROD_EC2_HOST')
        EC2_USER         = 'ubuntu'
    }

    options {
        timeout(time: 30, unit: 'MINUTES')
        buildDiscarder(logRotator(numToKeepStr: '10'))
        disableConcurrentBuilds()
    }

    stages {
        stage('Checkout') {
            steps {
                echo '=== Stage 1: Checking out source code from Git SCM ==='
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                echo '=== Stage 2: Installing dependencies reproducibly ==='
                sh '''
                    npm ci --no-audit --no-fund
                    cd backend && npm ci --no-audit --no-fund
                    cd ../frontend && npm ci --no-audit --no-fund
                '''
            }
        }

        stage('Automated Tests & Coverage') {
            steps {
                echo '=== Stage 3: Running unit tests & generating coverage reports ==='
                sh '''
                    cd backend
                    npm test -- --coverage
                '''
            }
            post {
                always {
                    junit testResults: 'backend/test-results.xml', allowEmptyResults: true
                }
            }
        }

        stage('SonarQube SAST Analysis') {
            steps {
                echo '=== Stage 4: Running SonarQube SAST static security scan ==='
                withSonarQubeEnv('SonarQubeServer') {
                    sh """
                        sonar-scanner \
                            -Dsonar.projectKey=secureid-identity-system \
                            -Dsonar.sources=backend/src,frontend/src \
                            -Dsonar.tests=backend/tests \
                            -Dsonar.javascript.lcov.reportPaths=backend/coverage/lcov.info \
                            -Dsonar.host.url=${SONAR_HOST_URL}
                    """
                }
            }
        }

        stage('Quality Gate Evaluation') {
            steps {
                echo '=== Stage 5: Evaluating SonarQube Quality Gate ==='
                timeout(time: 3, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                echo "=== Stage 6: Building multi-stage Docker image tag: ${IMAGE_TAG} ==="
                sh """
                    docker build --no-cache \
                        -t ${APP_NAME}:${IMAGE_TAG} \
                        -t ${APP_NAME}:latest .
                """
            }
        }

        stage('Trivy Container Scan') {
            steps {
                echo '=== Stage 7: Scanning container image for vulnerabilities with Trivy ==='
                sh """
                    mkdir -p reports
                    trivy image \
                        --severity HIGH,CRITICAL \
                        --format json \
                        --output reports/trivy-image-report.json \
                        ${APP_NAME}:${IMAGE_TAG}

                    # Halt pipeline if unmitigated Critical CVEs are detected
                    trivy image \
                        --severity CRITICAL \
                        --exit-code 1 \
                        ${APP_NAME}:${IMAGE_TAG}
                """
            }
            post {
                always {
                    archiveArtifacts artifacts: 'reports/trivy-image-report.json', allowEmptyArchive: true
                }
            }
        }

        stage('Publish Image to Amazon ECR') {
            steps {
                echo '=== Stage 8: Authenticating and pushing to Amazon ECR ==='
                withAWS(credentials: 'AWS_JENKINS_CREDENTIALS', region: "${AWS_REGION}") {
                    sh """
                        aws ecr get-login-password --region ${AWS_REGION} | \
                            docker login --username AWS --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com

                        docker tag ${APP_NAME}:${IMAGE_TAG} ${ECR_IMAGE_URI}
                        docker push ${ECR_IMAGE_URI}
                    """
                }
            }
        }

        stage('Deploy to AWS EC2 Instance') {
            steps {
                echo '=== Stage 9: Deploying container to production EC2 instance ==='
                sshagent(['PROD_EC2_SSH_KEY']) {
                    sh """
                        ssh -o StrictHostKeyChecking=no ${EC2_USER}@${EC2_HOST} << 'EOF'
                            aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com
                            docker pull ${ECR_IMAGE_URI}
                            docker stop ${APP_NAME}-prod || true
                            docker rm ${APP_NAME}-prod || true
                            docker run -d \
                                --name ${APP_NAME}-prod \
                                --restart unless-stopped \
                                -p 80:5000 \
                                -v /var/data/secureid:/app/backend/data \
                                --env-file /etc/secureid/.env \
                                ${ECR_IMAGE_URI}
                        EOF
                    """
                }
            }
        }

        stage('Health & Smoke Verification') {
            steps {
                echo '=== Stage 10: Verifying application health endpoint ==='
                sh """
                    sleep 10
                    curl -fsS http://${EC2_HOST}/api/health || {
                        echo 'ERROR: Health check failed on production target.'
                        exit 1
                    }
                """
            }
        }
    }

    post {
        success {
            echo "SUCCESS: SecureID release ${IMAGE_TAG} deployed and verified successfully."
        }
        failure {
            echo 'FAILURE: DevSecOps pipeline aborted due to failing quality gate, test, or security finding.'
        }
    }
}
