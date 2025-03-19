from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import traceback
from datetime import datetime, timedelta
import jwt
import bcrypt
from dotenv import load_dotenv
from pymongo import MongoClient

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# JWT Configuration
JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY')
JWT_ALGORITHM = os.getenv('JWT_ALGORITHM')
JWT_ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv('JWT_ACCESS_TOKEN_EXPIRE_MINUTES'))

# MongoDB Configuration
MONGO_URI = 'mongodb+srv://sam:123@cluster0.lsn1n.mongodb.net/Arun-v1'
client = MongoClient(MONGO_URI)
db = client['Arun-v1']
users_collection = db['users']

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

@app.route('/api/signup', methods=['POST'])
def signup():
    try:
        print("Received signup request")
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        print(f"Processing signup for email: {email}")

        if not email or not password:
            return jsonify({'error': 'Email and password are required'}), 400

        # Check if email already exists
        if users_collection.find_one({'email': email}):
            return jsonify({'error': 'EMAIL_EXISTS'}), 400

        # Hash the password
        salt = bcrypt.gensalt()
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt)

        # Add new user with hashed password
        new_user = {
            'email': email,
            'password': hashed_password.decode('utf-8'),
            'salt': salt.decode('utf-8'),
            'created_at': datetime.utcnow()
        }
        
        users_collection.insert_one(new_user)
        print("User successfully added to MongoDB")

        return jsonify({'success': True}), 200

    except Exception as e:
        print(f"Error in signup: {str(e)}")
        print(traceback.format_exc())
        return jsonify({'error': str(e)}), 500

@app.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        print(f"Attempting login with email: {email}")

        # Find user in MongoDB
        user = users_collection.find_one({'email': email})
        
        if not user:
            print(f"Email {email} not found in database")
            return jsonify({'error': 'EMAIL_NOT_FOUND'}), 401

        # Verify password using bcrypt
        if bcrypt.checkpw(password.encode('utf-8'), user['password'].encode('utf-8')):
            print(f"Login successful for {email}")
            # Create access token
            access_token = create_access_token({"sub": email})
            return jsonify({
                'success': True,
                'email': email,
                'access_token': access_token
            }), 200
        else:
            print(f"Invalid password for {email}")
            return jsonify({'error': 'INVALID_PASSWORD'}), 401

    except Exception as e:
        print(f"Server error during login: {str(e)}")
        return jsonify({'error': 'SERVER_ERROR'}), 500

@app.route('/api/verify-token', methods=['POST'])
def verify_token_endpoint():
    try:
        data = request.get_json()
        token = data.get('token')
        
        if not token:
            return jsonify({'error': 'No token provided'}), 401
            
        payload = verify_token(token)
        if payload:
            return jsonify({'valid': True, 'email': payload['sub']}), 200
        else:
            return jsonify({'error': 'Invalid or expired token'}), 401
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    print("Initializing server...")
    app.run(port=5000, debug=True) 