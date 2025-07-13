# SpotBox Backend

## Prerequisites
- Node.js installed
- MongoDB running or accessible

## Setup
1. Navigate to the `server` directory:
   ```bash
   cd server
   ```
2. Copy `.env.example` to `.env` and set your configuration:
   ```bash
   cp .env.example .env
   # Edit .env to update MONGO_URI and PORT
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the server:
   ```bash
   npm run dev  # for development with nodemon
   npm start    # for production
   ```

## API Endpoints

### GET /api/boxes
Returns an array of boxes sorted by timestamp (descending).

### POST /api/boxes
Create a new box.
- Request Body (JSON):
  ```json
  {
    "location": { "latitude": 41.01, "longitude": 29.00 },
    "photos": ["url1","url2"],
    "timestamp": "2025-01-01T00:00:00Z",
    "userId": "user123",
    "username": "Talha"
  }
  ```
- Response: Created box object.

---

Basic Express & MongoDB backend for SpotBox application. 