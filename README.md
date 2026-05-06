# AWS High Availability Web Architecture Lab

## Project Overview
This project demonstrates the implementation of a highly available and load-balanced web architecture on AWS. It involves deploying multiple web server instances across different Availability Zones (AZs) within a custom VPC, managed by an Application Load Balancer (ALB). The setup ensures that the application remains accessible even if individual instances or an entire AZ experiences a failure.

---

## Architecture Components
*   **VPC**: Custom network with public subnets in `eu-central-1a` and `eu-central-1b`.
*   **EC2 Instances**: Three web servers running Node.js.
*   **Target Group**: Logic group for health monitoring and instance registration.
*   **ALB**: Internet-facing Load Balancer distributing traffic via Round Robin.

---

## Q&A - Key Concepts

### 1. How does the load balancer know if an instance is healthy?
The ALB performs **Active Health Checks**. It periodically sends HTTP requests (as defined in our configuration: every 10 seconds) to a specific path (e.g., `/health`) on the registered instances. If the instance returns a `200 OK` status code within the timeout period, it is considered healthy.

### 2. What happens when an instance fails a health check?
When an instance fails the required number of consecutive health checks (2 in our lab), the ALB marks it as **Unhealthy**. The ALB immediately **stops routing new traffic** to that instance. Traffic is redirected to the remaining healthy instances in the target group until the failing instance passes the health checks again.

### 3. Why deploy instances across multiple Availability Zones?
Deploying across multiple AZs provides **High Availability and Fault Tolerance**. If a single AZ suffers a catastrophic failure (like a power outage or natural disaster), the instances in the other AZ(s) continue to operate. This ensures the service remains online even during a regional data center outage.

### 4. What is the purpose of the /health endpoint?
The `/health` endpoint is a dedicated route in the application specifically designed for monitoring. It allows the ALB to verify not just if the server is "up," but if the **application logic** is responding correctly. By returning a JSON status, it provides a lightweight way to confirm the app is ready to handle user requests.

### 5. How would you implement sticky sessions? When would you need them?
*   **Implementation**: You enable "Stickiness" in the **Target Group attributes** and define a duration (cookie-based). 
*   **When to use**: You need them when your application is **stateful**—for example, if a user's shopping cart or login session is stored in the local memory of a specific server rather than a central database. Sticky sessions ensure a user is repeatedly routed to the same backend instance for the duration of their session.

---
