# Load Distribution Test Report

## 1. Test Command
Run a loop to verify how the ALB distributes 20 requests:
```bash
# Loop 20 times to fetch instance info and count unique responses
for i in {1..20}; do 
  curl -s [http://web-alb-26606387.eu-central-1.elb.amazonaws.com](http://web-alb-26606387.eu-central-1.elb.amazonaws.com) | grep "Instance:" | sed 's/.*Instance: //'
done | sort | uniq -c