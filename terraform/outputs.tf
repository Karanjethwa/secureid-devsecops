output "ecr_repository_url" {
  description = "Amazon ECR Repository URI for container pushes"
  value       = aws_ecr_repository.secureid_ecr.repository_url
}

output "instance_public_ip" {
  description = "Public IPv4 address of the deployed EC2 server"
  value       = aws_instance.secureid_ec2.public_ip
}

output "instance_public_dns" {
  description = "Public DNS hostname of the EC2 instance"
  value       = aws_instance.secureid_ec2.public_dns
}

output "application_url" {
  description = "Direct HTTP endpoint for SecureID"
  value       = "http://${aws_instance.secureid_ec2.public_ip}:3000"
}

output "ssh_command" {
  description = "Command to connect to the deployed instance via SSH"
  value       = "ssh -i ${var.key_name}.pem ubuntu@${aws_instance.secureid_ec2.public_ip}"
}
