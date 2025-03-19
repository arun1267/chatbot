from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
import traceback
from datetime import datetime, timedelta
import jwt
import bcrypt
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# JWT Configuration
JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY')
JWT_ALGORITHM = os.getenv('JWT_ALGORITHM')
JWT_ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv('JWT_ACCESS_TOKEN_EXPIRE_MINUTES'))

# Path to your data.json file
DATA_FILE = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "frontend", "src", "pages", "data.json"))

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

def initialize_json_file():
    """Create data.json if it doesn't exist"""
    try:
        os.makedirs(os.path.dirname(DATA_FILE), exist_ok=True)
        if not os.path.exists(DATA_FILE):
            with open(DATA_FILE, 'w') as f:
                json.dump([], f)
        print(f"Data file initialized at: {DATA_FILE}")
    except Exception as e:
        print(f"Error initializing data file: {str(e)}")
        print(traceback.format_exc())

def read_users():
    """Read users from JSON file"""
    try:
        if not os.path.exists(DATA_FILE):
            initialize_json_file()
            return []
        with open(DATA_FILE, 'r') as f:
            return json.load(f)
    except Exception as e:
        print(f"Error reading users: {str(e)}")
        print(traceback.format_exc())
        return []

def write_users(users):
    """Write users to JSON file"""
    try:
        with open(DATA_FILE, 'w') as f:
            json.dump(users, f, indent=2)
        print(f"Successfully wrote {len(users)} users to file")
    except Exception as e:
        print(f"Error writing users: {str(e)}")
        print(traceback.format_exc())
        raise

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

        # Read existing users
        users = read_users()
        print(f"Current number of users: {len(users)}")

        # Check if email already exists
        if any(user['email'] == email for user in users):
            return jsonify({'error': 'EMAIL_EXISTS'}), 400

        # Hash the password
        salt = bcrypt.gensalt()
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt)

        # Add new user with hashed password
        users.append({
            'email': email,
            'password': hashed_password.decode('utf-8'),
            'salt': salt.decode('utf-8')
        })

        # Save updated users
        write_users(users)
        print("User successfully added")

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

        # Read the data.json file
        try:
            with open(DATA_FILE, 'r') as f:
                users = json.load(f)
                print(f"Current users in database: {users}")
        except FileNotFoundError:
            print(f"Data file not found at: {DATA_FILE}")
            return jsonify({'error': 'EMAIL_NOT_FOUND'}), 401
        except json.JSONDecodeError as e:
            print(f"Error reading JSON file: {e}")
            return jsonify({'error': 'SERVER_ERROR'}), 500

        # Check if user exists and password matches
        for user in users:
            if user['email'] == email:
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

        print(f"Email {email} not found in database")
        return jsonify({'error': 'EMAIL_NOT_FOUND'}), 401

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
    print(f"Initializing server... Data file path: {DATA_FILE}")
    initialize_json_file()
    app.run(port=5000, debug=True) 