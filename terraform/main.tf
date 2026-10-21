# ==============================================================================
# Terraform Infrastructure as Code (IaC) - SecureID AWS Deployment
# DevSecOps Lab CIAP Microproject
# ==============================================================================

terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# ------------------------------------------------------------------------------
# 1. Amazon Elastic Container Registry (ECR)
# ------------------------------------------------------------------------------
resource "aws_ecr_repository" "secureid_ecr" {
  name                 = var.ecr_repository_name
  image_tag_mutability = "IMMUTABLE" # Prevents overwriting released image tags

  image_scanning_configuration {
    scan_on_push = true # Automated AWS vulnerability scanning upon image push
  }

  encryption_configuration {
    encryption_type = "AES256"
  }

  tags = {
    Project     = "SecureID"
    Course      = "DevSecOps Lab"
    Environment = var.environment
    SDG         = "SDG-9"
  }
}

# ------------------------------------------------------------------------------
# 2. Virtual Private Cloud Security Group
# ------------------------------------------------------------------------------
resource "aws_security_group" "secureid_sg" {
  name        = "${var.environment}-secureid-sg"
  description = "Security group for SecureID application server"

  # Port 80 (HTTP / Ingress Reverse Proxy)
  ingress {
    description = "HTTP Public Access"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Port 443 (HTTPS Secure Ingress)
  ingress {
    description = "HTTPS Public Access"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Port 3000 (Application Direct Port)
  ingress {
    description = "SecureID Web Port"
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Port 22 (SSH Management)
  ingress {
    description = "SSH Access"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = [var.allowed_ssh_cidr]
  }

  # Egress: Allow outbound connectivity for package updates and ECR pulling
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name        = "${var.environment}-secureid-sg"
    Project     = "SecureID"
    Course      = "DevSecOps Lab"
  }
}

# ------------------------------------------------------------------------------
# 3. AWS EC2 Ubuntu Instance
# ------------------------------------------------------------------------------
resource "aws_instance" "secureid_ec2" {
  ami           = var.ec2_ami_id
  instance_type = var.instance_type
  key_name      = var.key_name

  vpc_security_group_ids = [aws_security_group.secureid_sg.id]

  root_block_device {
    volume_size           = 25
    volume_type           = "gp3"
    encrypted             = true
    delete_on_termination = true
  }

  user_data = <<-EOF
              #!/bin/bash
              set -e
              apt-get update -y
              apt-get install -y ca-certificates curl gnupg lsb-release
              
              # Install Docker
              mkdir -p /etc/apt/keyrings
              curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
              echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
              apt-get update -y
              apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
              
              usermod -aG docker ubuntu
              mkdir -p /var/data/secureid /etc/secureid
              chown -R 1000:1000 /var/data/secureid
              echo "EC2 provisioning complete."
              EOF

  tags = {
    Name        = "${var.environment}-secureid-server"
    Project     = "SecureID"
    Course      = "DevSecOps Lab"
    Environment = var.environment
  }
}
