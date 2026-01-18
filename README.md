# SCIC Store - Express API Server

Simple Express.js API server for managing product data.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm run dev    # Development mode with nodemon
npm start      # Production mode
```

## API Endpoints

- `GET /api/items` - Get all items
- `GET /api/items/:id` - Get single item by ID
- `POST /api/items` - Create new item
- `GET /api/health` - Health check

## Data

Products are stored in `data.json` file for simplicity.