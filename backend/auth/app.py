from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime, timedelta
import jwt
import bcrypt
from typing import Optional
from pymongo import MongoClient
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI()

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# JWT Configuration
JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY')
JWT_ALGORITHM = os.getenv('JWT_ALGORITHM')
JWT_ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv('JWT_ACCESS_TOKEN_EXPIRE_MINUTES'))

# MongoDB Configuration
MONGO_URI = 'mongodb+srv://sam:123@cluster0.lsn1n.mongodb.net/Arun-v1'
client = MongoClient(MONGO_URI)
db = client['Arun-v1']
users_collection = db['users']

# Pydantic models for request/response
class UserSignup(BaseModel):
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=JWT_ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)
    return encoded_jwt

def verify_token(token: str):
    try:
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.JWTError:
        return None

async def get_current_user(token: str):
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    payload = verify_token(token)
    if payload is None:
        raise credentials_exception
    email: str = payload.get("sub")
    if email is None:
        raise credentials_exception
    return email

@app.post("/api/signup")
async def signup(user: UserSignup):
    try:
        print(f"Processing signup for email: {user.email}")

        # Check if email already exists
        if users_collection.find_one({'email': user.email}):
            raise HTTPException(status_code=400, detail="EMAIL_EXISTS")

        # Hash the password
        salt = bcrypt.gensalt()
        hashed_password = bcrypt.hashpw(user.password.encode('utf-8'), salt)

        # Add new user with hashed password
        new_user = {
            'email': user.email,
            'password': hashed_password.decode('utf-8'),
            'salt': salt.decode('utf-8'),
            'created_at': datetime.utcnow()
        }
        
        users_collection.insert_one(new_user)
        print("User successfully added to MongoDB")

        return {"success": True}

    except Exception as e:
        print(f"Error in signup: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/login")
async def login(user: UserLogin):
    try:
        print(f"Attempting login with email: {user.email}")

        # Find user in MongoDB
        db_user = users_collection.find_one({'email': user.email})
        
        if not db_user:
            print(f"Email {user.email} not found in database")
            raise HTTPException(status_code=401, detail="EMAIL_NOT_FOUND")

        # Verify password using bcrypt
        if bcrypt.checkpw(user.password.encode('utf-8'), db_user['password'].encode('utf-8')):
            print(f"Login successful for {user.email}")
            # Create access token
            access_token = create_access_token({"sub": user.email})
            return {
                "success": True,
                "email": user.email,
                "access_token": access_token,
                "token_type": "bearer"
            }
        else:
            print(f"Invalid password for {user.email}")
            raise HTTPException(status_code=401, detail="INVALID_PASSWORD")

    except Exception as e:
        print(f"Server error during login: {str(e)}")
        raise HTTPException(status_code=500, detail="SERVER_ERROR")

@app.post("/api/verify-token")
async def verify_token_endpoint(token: str):
    try:
        if not token:
            raise HTTPException(status_code=401, detail="No token provided")
            
        payload = verify_token(token)
        if payload:
            return {"valid": True, "email": payload['sub']}
        else:
            raise HTTPException(status_code=401, detail="Invalid or expired token")
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000) 