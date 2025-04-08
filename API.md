# 2DU API Documentation

## API Versioning

The API is versioned through the URL path:

```
/api/v1/...
```

Current version: v1

Versioning Strategy:

- Major version changes (v1 -> v2) indicate breaking changes
- Minor version changes (v1.1 -> v1.2) indicate new features
- Patch version changes (v1.1.1 -> 1.1.2) indicate bug fixes

## Base URL

Production: `https://api.2du.app/v1`
Staging: `https://staging-api.2du.app/v1`
Development: `http://localhost:3000/v1`

## Authentication

All API requests require authentication using JWT tokens.

### Sign Up

```http
POST /api/v1/auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword",
  "name": "John Doe"
}
```

Response:

```json
{
  "user": {
    "id": "user123",
    "email": "user@example.com",
    "name": "John Doe",
    "createdAt": "2024-03-20T12:00:00Z"
  },
  "token": "jwt_token_here",
  "refreshToken": "refresh_token_here"
}
```

### Sign In

```http
POST /api/v1/auth/signin
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword"
}
```

Response:

```json
{
  "user": {
    "id": "user123",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "token": "jwt_token_here",
  "refreshToken": "refresh_token_here"
}
```

### Sign Out

```http
POST /api/v1/auth/signout
Authorization: Bearer jwt_token_here
```

Response:

```json
{
  "message": "Successfully signed out"
}
```

### Refresh Token

```http
POST /api/v1/auth/refresh
Content-Type: application/json

{
  "refreshToken": "refresh_token_here"
}
```

Response:

```json
{
  "token": "new_jwt_token_here",
  "refreshToken": "new_refresh_token_here"
}
```

## Tasks

### Get Tasks

```http
GET /api/v1/tasks
Authorization: Bearer jwt_token_here
```

Query Parameters:

- `status`: Filter by status (pending, completed)
- `tag`: Filter by tag
- `search`: Search in title and description
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `sort`: Sort field (createdAt, dueDate, title)
- `order`: Sort order (asc, desc)

Response:

```json
{
  "tasks": [
    {
      "id": "task123",
      "title": "Complete project",
      "description": "Finish the 2DU project",
      "status": "pending",
      "dueDate": "2024-03-25T00:00:00Z",
      "tags": ["work", "important"],
      "createdAt": "2024-03-20T12:00:00Z",
      "updatedAt": "2024-03-20T12:00:00Z"
    }
  ],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "pages": 10
  }
}
```

### Create Task

```http
POST /api/v1/tasks
Authorization: Bearer jwt_token_here
Content-Type: application/json

{
  "title": "New task",
  "description": "Task description",
  "dueDate": "2024-03-25T00:00:00Z",
  "tags": ["work", "important"]
}
```

Response:

```json
{
  "id": "task123",
  "title": "New task",
  "description": "Task description",
  "status": "pending",
  "dueDate": "2024-03-25T00:00:00Z",
  "tags": ["work", "important"],
  "createdAt": "2024-03-20T12:00:00Z",
  "updatedAt": "2024-03-20T12:00:00Z"
}
```

### Update Task

```http
PUT /api/v1/tasks/:taskId
Authorization: Bearer jwt_token_here
Content-Type: application/json

{
  "title": "Updated task",
  "description": "Updated description",
  "status": "completed",
  "dueDate": "2024-03-26T00:00:00Z",
  "tags": ["work", "urgent"]
}
```

Response:

```json
{
  "id": "task123",
  "title": "Updated task",
  "description": "Updated description",
  "status": "completed",
  "dueDate": "2024-03-26T00:00:00Z",
  "tags": ["work", "urgent"],
  "createdAt": "2024-03-20T12:00:00Z",
  "updatedAt": "2024-03-20T12:00:00Z"
}
```

### Delete Task

```http
DELETE /api/v1/tasks/:taskId
Authorization: Bearer jwt_token_here
```

Response:

```json
{
  "message": "Task deleted successfully"
}
```

### Bulk Actions

#### Complete Tasks

```http
POST /api/v1/tasks/bulk/complete
Authorization: Bearer jwt_token_here
Content-Type: application/json

{
  "taskIds": ["task123", "task456"]
}
```

Response:

```json
{
  "message": "Tasks completed successfully",
  "completedCount": 2
}
```

#### Delete Tasks

```http
POST /api/v1/tasks/bulk/delete
Authorization: Bearer jwt_token_here
Content-Type: application/json

{
  "taskIds": ["task123", "task456"]
}
```

Response:

```json
{
  "message": "Tasks deleted successfully",
  "deletedCount": 2
}
```

#### Tag Tasks

```http
POST /api/v1/tasks/bulk/tag
Authorization: Bearer jwt_token_here
Content-Type: application/json

{
  "taskIds": ["task123", "task456"],
  "tags": ["work", "important"]
}
```

Response:

```json
{
  "message": "Tasks tagged successfully",
  "taggedCount": 2
}
```

## Tags

### Get Tags

```http
GET /api/v1/tags
Authorization: Bearer jwt_token_here
```

Response:

```json
{
  "tags": [
    {
      "id": "tag123",
      "name": "work",
      "color": "#FF0000",
      "taskCount": 5
    }
  ]
}
```

### Create Tag

```http
POST /api/v1/tags
Authorization: Bearer jwt_token_here
Content-Type: application/json

{
  "name": "new-tag",
  "color": "#00FF00"
}
```

Response:

```json
{
  "id": "tag123",
  "name": "new-tag",
  "color": "#00FF00",
  "taskCount": 0
}
```

### Update Tag

```http
PUT /api/v1/tags/:tagId
Authorization: Bearer jwt_token_here
Content-Type: application/json

{
  "name": "updated-tag",
  "color": "#0000FF"
}
```

Response:

```json
{
  "id": "tag123",
  "name": "updated-tag",
  "color": "#0000FF",
  "taskCount": 5
}
```

### Delete Tag

```http
DELETE /api/v1/tags/:tagId
Authorization: Bearer jwt_token_here
```

Response:

```json
{
  "message": "Tag deleted successfully"
}
```

## WebSocket API

The WebSocket API provides real-time updates for tasks and tags.

### Connection

Connect to the WebSocket endpoint:

```
wss://api.2du.app/ws?token=jwt_token_here
```

### Events

#### Task Created

```json
{
  "type": "TASK_CREATED",
  "data": {
    "task": {
      "id": "task123",
      "title": "New task",
      "description": "Task description",
      "status": "pending",
      "dueDate": "2024-03-25T00:00:00Z",
      "tags": ["work", "important"],
      "createdAt": "2024-03-20T12:00:00Z",
      "updatedAt": "2024-03-20T12:00:00Z"
    }
  }
}
```

#### Task Updated

```json
{
  "type": "TASK_UPDATED",
  "data": {
    "task": {
      "id": "task123",
      "title": "Updated task",
      "description": "Updated description",
      "status": "completed",
      "dueDate": "2024-03-26T00:00:00Z",
      "tags": ["work", "urgent"],
      "createdAt": "2024-03-20T12:00:00Z",
      "updatedAt": "2024-03-20T12:00:00Z"
    }
  }
}
```

#### Task Deleted

```json
{
  "type": "TASK_DELETED",
  "data": {
    "taskId": "task123"
  }
}
```

#### Tag Created

```json
{
  "type": "TAG_CREATED",
  "data": {
    "tag": {
      "id": "tag123",
      "name": "new-tag",
      "color": "#00FF00",
      "taskCount": 0
    }
  }
}
```

#### Tag Updated

```json
{
  "type": "TAG_UPDATED",
  "data": {
    "tag": {
      "id": "tag123",
      "name": "updated-tag",
      "color": "#0000FF",
      "taskCount": 5
    }
  }
}
```

#### Tag Deleted

```json
{
  "type": "TAG_DELETED",
  "data": {
    "tagId": "tag123"
  }
}
```

## Error Responses

All API endpoints may return the following error responses:

### 400 Bad Request

```json
{
  "error": "Bad Request",
  "message": "Invalid input data",
  "details": {
    "field": "error description"
  }
}
```

### 401 Unauthorized

```json
{
  "error": "Unauthorized",
  "message": "Invalid or expired token"
}
```

### 403 Forbidden

```json
{
  "error": "Forbidden",
  "message": "Insufficient permissions"
}
```

### 404 Not Found

```json
{
  "error": "Not Found",
  "message": "Resource not found"
}
```

### 500 Internal Server Error

```json
{
  "error": "Internal Server Error",
  "message": "An unexpected error occurred"
}
```

## Rate Limiting

API requests are limited to:

- 100 requests per minute for authenticated users
- 20 requests per minute for unauthenticated users

Rate limit headers are included in all responses:

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1616239020
```

## Support

For API support, please contact:

- Email: api-support@2du.app
- Documentation: https://docs.2du.app
- Status page: https://status.2du.app
