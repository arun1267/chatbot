from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict, Any
import os
from pymongo import MongoClient
from datetime import datetime
import logging
import time
from bson import ObjectId
from bson.json_util import dumps, loads

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Chat Session API", description="API to serve chat session data from MongoDB")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB connection with timeout
MONGODB_URL = "mongodb+srv://befach-user:1MZOIPoM8z7c5Vug@datalabs-ai.h7umu.mongodb.net/chatbot_db?retryWrites=true&w=majority"

try:
    client = MongoClient(MONGODB_URL, serverSelectionTimeoutMS=5000, connectTimeoutMS=5000)
    # Test the connection
    client.server_info()
    db = client.get_database("chatbot_db")
    collection = db.get_collection("chat_sessions")
    logger.info("Successfully connected to MongoDB!")
    
    # Log the count of documents in the collection
    doc_count = collection.count_documents({})
    logger.info(f"Number of documents in collection: {doc_count}")
    
except Exception as e:
    logger.error(f"Error connecting to MongoDB: {e}")
    raise

# Root endpoint
@app.get("/")
def read_root():
    return {"message": "Welcome to Chat Session API"}

# Get all chat sessions with pagination
@app.get("/sessions")
def get_sessions(limit: int = 10, skip: int = 0):
    try:
        start_time = time.time()
        logger.info("Fetching all sessions...")
        sessions = list(collection.find({}, {'_id': 0}).skip(skip).limit(limit))
        end_time = time.time()
        logger.info(f"Found {len(sessions)} sessions in {end_time - start_time:.2f} seconds")
        if not sessions:
            logger.warning("No sessions found in the database")
        return sessions
    except Exception as e:
        logger.error(f"Error fetching sessions: {e}")
        raise HTTPException(status_code=500, detail=f"Error fetching sessions: {str(e)}")

# Get specific chat session by sessionId
@app.get("/session/{session_id}")
def get_session(session_id: str):
    try:
        start_time = time.time()
        logger.info(f"Fetching session with ID: {session_id}")
        session = collection.find_one({"sessionId": session_id}, {'_id': 0})
        end_time = time.time()
        if not session:
            logger.warning(f"Session not found with ID: {session_id}")
            raise HTTPException(status_code=404, detail="Session not found")
        logger.info(f"Successfully found session: {session_id} in {end_time - start_time:.2f} seconds")
        return session
    except Exception as e:
        logger.error(f"Error fetching session: {e}")
        raise HTTPException(status_code=500, detail=f"Error fetching session: {str(e)}")

# Get all messages with pagination
@app.get("/messages")
def get_messages(limit: int = 50, skip: int = 0):
    try:
        start_time = time.time()
        logger.info("Fetching all messages...")
        # Use aggregation pipeline for better performance
        pipeline = [
            {"$unwind": "$messages"},
            {"$project": {
                "sender": "$messages.sender",
                "text": "$messages.text",
                "timestamp": "$messages.timestamp",
                "productData": "$messages.productData",
                "_id": 0
            }},
            {"$skip": skip},
            {"$limit": limit}
        ]
        messages = list(collection.aggregate(pipeline))
        end_time = time.time()
        logger.info(f"Found {len(messages)} messages in {end_time - start_time:.2f} seconds")
        if not messages:
            logger.warning("No messages found in any session")
        return messages
    except Exception as e:
        logger.error(f"Error fetching messages: {e}")
        raise HTTPException(status_code=500, detail=f"Error fetching messages: {str(e)}")

# Get messages by sender type (bot/user)
@app.get("/messages/{sender_type}")
def get_messages_by_sender(sender_type: str, limit: int = 50, skip: int = 0):
    if sender_type not in ["bot", "user"]:
        raise HTTPException(status_code=400, detail="Invalid sender type. Use 'bot' or 'user'")
    
    try:
        start_time = time.time()
        logger.info(f"Fetching messages from sender type: {sender_type}")
        # Use aggregation pipeline for better performance
        pipeline = [
            {"$unwind": "$messages"},
            {"$match": {"messages.sender": sender_type}},
            {"$project": {
                "sender": "$messages.sender",
                "text": "$messages.text",
                "timestamp": "$messages.timestamp",
                "productData": "$messages.productData",
                "_id": 0
            }},
            {"$skip": skip},
            {"$limit": limit}
        ]
        messages = list(collection.aggregate(pipeline))
        end_time = time.time()
        logger.info(f"Found {len(messages)} messages from {sender_type} in {end_time - start_time:.2f} seconds")
        if not messages:
            logger.warning(f"No messages found from sender type: {sender_type}")
        return messages
    except Exception as e:
        logger.error(f"Error fetching messages: {e}")
        raise HTTPException(status_code=500, detail=f"Error fetching messages: {str(e)}")

# Get all product data with pagination
@app.get("/products")
def get_products(limit: int = 50, skip: int = 0):
    try:
        start_time = time.time()
        logger.info("Fetching all products...")
        # Use aggregation pipeline for better performance
        pipeline = [
            {"$unwind": "$messages"},
            {"$unwind": "$messages.productData"},
            {"$project": {
                "product_title": "$messages.productData.product_title",
                "landed_value_inr": "$messages.productData.landed_value_inr",
                "product_moq": "$messages.productData.product_moq",
                "description": "$messages.productData.description",
                "image_link": "$messages.productData.image_link",
                "suppliers": "$messages.productData.suppliers",
                "hs_code": "$messages.productData.hs_code",
                "unit": "$messages.productData.unit",
                "tags": "$messages.productData.tags",
                "shipping_mode": "$messages.productData.shipping_mode",
                "sample_price": "$messages.productData.sample_price",
                "product_url": "$messages.productData.product_url",
                "_id": 0
            }},
            {"$skip": skip},
            {"$limit": limit}
        ]
        products = list(collection.aggregate(pipeline))
        end_time = time.time()
        logger.info(f"Found {len(products)} products in {end_time - start_time:.2f} seconds")
        if not products:
            logger.warning("No products found in any session")
        return products
    except Exception as e:
        logger.error(f"Error fetching products: {e}")
        raise HTTPException(status_code=500, detail=f"Error fetching products: {str(e)}")

# Get session metadata
@app.get("/metadata/{session_id}")
def get_metadata(session_id: str):
    try:
        start_time = time.time()
        logger.info(f"Fetching metadata for session: {session_id}")
        session = collection.find_one(
            {"sessionId": session_id},
            {'sessionId': 1, 'startTime': 1, 'endTime': 1, 'metadata': 1, '_id': 0}
        )
        end_time = time.time()
        if not session:
            logger.warning(f"Session not found with ID: {session_id}")
            raise HTTPException(status_code=404, detail="Session not found")
        logger.info(f"Successfully found metadata for session: {session_id} in {end_time - start_time:.2f} seconds")
        return session
    except Exception as e:
        logger.error(f"Error fetching metadata: {e}")
        raise HTTPException(status_code=500, detail=f"Error fetching metadata: {str(e)}") 