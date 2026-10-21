variable "aws_region" {
  description = "AWS region for deployment"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Deployment environment (dev, staging, prod)"
  type        = string
  default     = "prod"
}

variable "ecr_repository_name" {
  description = "Name of Amazon ECR repository"
  type        = string
  default     = "secureid"
}

variable "instance_type" {
  description = "EC2 instance sizing"
  type        = string
  default     = "t3.small"
}

variable "ec2_ami_id" {
  description = "Ubuntu 22.04 LTS AMI ID for chosen region"
  type        = string
  default     = "ami-0c7217cdde317cfec" # Ubuntu 22.04 LTS us-east-1
}

variable "key_name" {
  description = "Name of AWS SSH Key Pair"
  type        = string
  default     = "secureid-devsecops-key"
}

variable "allowed_ssh_cidr" {
  description = "CIDR block permitted for SSH management access"
  type        = string
  default     = "0.0.0.0/0" # In strict production, restrict to college/VPN IP
}
