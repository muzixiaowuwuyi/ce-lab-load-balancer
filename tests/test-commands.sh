#!/bin/bash

# ==========================================================
# Project: AWS ALB High Availability Lab
# Purpose: Verification and Testing Commands
# ==========================================================

# 1. SET ENVIRONMENT VARIABLES
# Replace the value below with your actual ALB DNS Name
ALB_DNS="web-alb-26606387.eu-central-1.elb.amazonaws.com"
# Fetch Target Group ARN using the name
TG_ARN=$(aws elbv2 describe-target-groups --names web-servers-tg --query 'TargetGroups[0].TargetGroupArn' --output text)

echo "Testing Load Balancer: $ALB_DNS"
echo "Target Group ARN: $TG_ARN"

# ----------------------------------------------------------
# 2. TARGET GROUP HEALTH CHECK
# Verify the health status of all registered instances
# ----------------------------------------------------------
echo "Checking Target Health..."
aws elbv2 describe-target-health --target-group-arn $TG_ARN

# ----------------------------------------------------------
# 3. BASIC HTTP CONNECTIVITY
# Test the root path and health endpoint
# ----------------------------------------------------------
echo "Testing HTTP Connectivity..."
curl -I http://$ALB_DNS
curl -s http://$ALB_DNS/health

# ----------------------------------------------------------
# 4. LOAD DISTRIBUTION TEST
# Send 20 requests to verify traffic is being handled by the pool
# ----------------------------------------------------------
echo "Running Load Distribution Test (20 requests)..."
for i in {1..20}; do 
  curl -s http://$ALB_DNS | grep "Instance:" | sed 's/.*Instance: //'
done | sort | uniq -c

# ----------------------------------------------------------
# 5. TARGET GROUP ATTRIBUTES
# Verify stickiness and deregistration delay settings
# ----------------------------------------------------------
echo "Checking Target Group Attributes..."
aws elbv2 describe-target-group-attributes --target-group-arn $TG_ARN