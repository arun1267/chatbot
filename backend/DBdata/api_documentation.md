# Chat Session API Documentation

## Base URL
```
http://127.0.0.1:8000
```

## Endpoints

### 1. Root Endpoint
- **URL**: `/`
- **Method**: GET
- **Description**: Welcome message
- **Example Request**:
  ```
  GET http://127.0.0.1:8000/
  ```
- **Example Response**:
  ```json
  {
    "message": "Welcome to Chat Session API"
  }
  ```

### 2. Get All Chat Sessions
- **URL**: `/sessions`
- **Method**: GET
- **Description**: Returns all chat sessions from MongoDB
- **Example Request**:
  ```
  GET http://127.0.0.1:8000/sessions
  ```
- **Example Response**:
  ```json
  [
    {
      "sessionId": "session_1742797498731_lince5k",
      "messages": [...],
      "startTime": "2025-03-24T06:24:58.731Z",
      "endTime": "2025-03-24T06:26:34.241Z",
      "metadata": {...}
    }
  ]
  ```

### 3. Get Specific Chat Session
- **URL**: `/session/{session_id}`
- **Method**: GET
- **Description**: Returns a specific chat session by sessionId
- **Parameters**:
  - `session_id` (path parameter): The ID of the session to retrieve
- **Example Request**:
  ```
  GET http://127.0.0.1:8000/session/session_1742797498731_lince5k
  ```
- **Example Response**:
  ```json
  {
    "sessionId": "session_1742797498731_lince5k",
    "messages": [...],
    "startTime": "2025-03-24T06:24:58.731Z",
    "endTime": "2025-03-24T06:26:34.241Z",
    "metadata": {...}
  }
  ```
- **Error Response** (404):
  ```json
  {
    "detail": "Session not found"
  }
  ```

### 4. Get All Messages
- **URL**: `/messages`
- **Method**: GET
- **Description**: Returns all messages from all sessions
- **Example Request**:
  ```
  GET http://127.0.0.1:8000/messages
  ```
- **Example Response**:
  ```json
  [
    {
      "sender": "bot",
      "text": "Welcome! You can ask me about our inventory...",
      "timestamp": "2025-03-24T06:26:34.241Z"
    },
    {
      "sender": "user",
      "text": "Hello",
      "timestamp": "2025-03-24T06:26:34.241Z"
    }
  ]
  ```

### 5. Get Messages by Sender Type
- **URL**: `/messages/{sender_type}`
- **Method**: GET
- **Description**: Returns messages filtered by sender type (bot or user)
- **Parameters**:
  - `sender_type` (path parameter): Either "bot" or "user"
- **Example Requests**:
  ```
  GET http://127.0.0.1:8000/messages/bot
  GET http://127.0.0.1:8000/messages/user
  ```
- **Example Response**:
  ```json
  [
    {
      "sender": "bot",
      "text": "Welcome! You can ask me about our inventory...",
      "timestamp": "2025-03-24T06:26:34.241Z"
    }
  ]
  ```
- **Error Response** (400):
  ```json
  {
    "detail": "Invalid sender type. Use 'bot' or 'user'"
  }
  ```

### 6. Get All Products
- **URL**: `/products`
- **Method**: GET
- **Description**: Returns all product data from all sessions
- **Example Request**:
  ```
  GET http://127.0.0.1:8000/products
  ```
- **Example Response**:
  ```json
  [
    {
      "product_title": "Import MRI Machine Light Source Set - WA Parts",
      "landed_value_inr": 16276.58,
      "product_moq": "1",
      "description": "...",
      "image_link": "...",
      "suppliers": "Philips Electronics Singapore Pte Ltd, China",
      "hs_code": "90181290",
      "unit": "NOS",
      "tags": [...],
      "shipping_mode": "Air (7 to 14 days)",
      "sample_price": "20290.03",
      "product_url": "..."
    }
  ]
  ```

### 7. Get Session Metadata
- **URL**: `/metadata/{session_id}`
- **Method**: GET
- **Description**: Returns metadata for a specific session
- **Parameters**:
  - `session_id` (path parameter): The ID of the session
- **Example Request**:
  ```
  GET http://127.0.0.1:8000/metadata/session_1742797498731_lince5k
  ```
- **Example Response**:
  ```json
  {
    "sessionId": "session_1742797498731_lince5k",
    "startTime": "2025-03-24T06:24:58.731Z",
    "endTime": "2025-03-24T06:26:34.241Z",
    "metadata": {
      "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36..."
    }
  }
  ```
- **Error Response** (404):
  ```json
  {
    "detail": "Session not found"
  }
  ```

## Error Responses
All endpoints may return the following error responses:

### 500 Internal Server Error
```json
{
  "detail": "Error message describing what went wrong"
}
```

### 404 Not Found
```json
{
  "detail": "Resource not found"
}
```

### 400 Bad Request
```json
{
  "detail": "Invalid request parameters"
}
```

## Testing in Postman
1. Open Postman
2. Create a new request
3. Select the HTTP method (GET)
4. Enter the desired endpoint URL
5. Click Send

## Running the API
1. Install requirements:
```bash
pip install -r backend/requirements.txt
```

2. Start the server:
```bash
cd C:\Users\sudar\OneDrive\Desktop\chatbot-master\backend
uvicorn DBdata.data:app --reload
```

The server will start at `http://127.0.0.1:8000` 