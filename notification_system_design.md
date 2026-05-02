# Stage 1: Notification System Design

## Objective
Design a scalable backend system for campus notifications (Events, Results, Placements).

## Core Features
- Send notification
- Get notifications
- Mark as read
- Bulk notify students
- Real-time updates

## API Design

### 1. Get Notifications
GET /notifications

Headers:
Authorization: Bearer <token>

Response:
{
  "notifications": [
    {
      "id": "string",
      "type": "Event | Result | Placement",
      "message": "string",
      "timestamp": "datetime",
      "isRead": false
    }
  ]
}

### 2. Send Notification
POST /notifications

Request Body:
{
  "studentId": "string",
  "type": "Event",
  "message": "Workshop tomorrow"
}

Response:
{
  "status": "success"
}

### 3. Mark as Read
PATCH /notifications/:id/read

Response:
{
  "status": "updated"
}

### 4. Bulk Notify
POST /notifications/bulk

Request Body:
{
  "type": "Placement",
  "message": "Company visiting campus",
  "students": ["id1", "id2"]
}

## Real-Time System
- Use WebSocket for real-time updates
- Client subscribes after login
- Server pushes notifications instantly
- Alternative: Server-Sent Events (SSE)

## Architecture Overview
Client → API Gateway → Notification Service → Database  
                                ↓  
                           Message Queue  
                                ↓  
                        Email/SMS Service  

## Scalability Considerations
- Horizontal scaling of services
- Load balancer for API traffic
- Use message queues for async processing
- Separate read/write databases if needed

## Security
- JWT-based authentication
- Role-based access control
- Rate limiting on APIs

---------------------------------------------------------------------------------

# Stage 2: Database Design

## Database Choice
PostgreSQL is used for structured storage and reliability.

## Table Schema

notifications(
  id UUID PRIMARY KEY,
  studentId VARCHAR,
  type VARCHAR,
  message TEXT,
  isRead BOOLEAN,
  createdAt TIMESTAMP
)

## Challenges
- High read volume for notifications
- Large number of users

## Solutions
- Add indexing on frequently queried fields
- Partition data based on time or user

---

# Stage 3: Query Optimization

## Problem Query
SELECT * FROM notifications 
WHERE studentId = ? AND isRead = false 
ORDER BY createdAt DESC;

## Issues
- Full table scan if no index
- Slow response for large data

## Optimization

Create index:
CREATE INDEX idx_notifications 
ON notifications(studentId, isRead, createdAt DESC);

## Benefit
- Faster retrieval
- Reduced query time

---

# Stage 4: Performance Optimization

## Problems
- Repeated database calls
- High latency for large data

## Solutions

1. Caching:
- Use Redis to cache recent notifications

2. Pagination:
- Limit results using OFFSET and LIMIT

3. Lazy Loading:
- Load notifications in batches

## Result
- Reduced DB load
- Faster response time

---

# Stage 5: notify_all Fix

## Problem
- Sending notifications sequentially is slow
- Failure in one request blocks others

## Solution

1. Use Message Queue:
- Kafka / RabbitMQ for async processing

2. Worker Services:
- Process notifications in parallel

3. Retry Mechanism:
- Retry failed deliveries

## Flow
API → Queue → Worker → Send Notification

## Benefit
- Scalable
- Fault tolerant
- Faster execution