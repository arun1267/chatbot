from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
import traceback
import bcrypt
import jwt
from datetime import datetime, timedelta
from functools import wraps
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)  # This allows cross-origin requests from your React frontend

# Get JWT secret key from environment variable
SECRET_KEY = os.getenv('JWT_SECRET_KEY')
if not SECRET_KEY:
    raise ValueError("No JWT_SECRET_KEY set in environment variables")

# Path to your data.json file - using absolute path
DATA_FILE = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "frontend", "src", "pages", "data.json"))

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'error': 'Token is missing'}), 401
        try:
            token = token.split(' ')[1]  # Remove 'Bearer ' prefix
            data = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            current_user = data['email']
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token has expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Token is invalid'}), 401
        return f(current_user, *args, **kwargs)
    return decorated

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

        # Check if email already exists
        if any(user['email'] == email for user in users):
            return jsonify({'error': 'EMAIL_EXISTS'}), 400

        # Hash the password before storing
        salt = bcrypt.gensalt()
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt)

        # Add new user with hashed password
        users.append({
            'email': email,
            'password': hashed_password.decode('utf-8')  # Store as string
        })

        # Save updated users
        write_users(users)
        print("User successfully added with hashed password")

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

        try:
            with open(DATA_FILE, 'r') as f:
                users = json.load(f)
        except FileNotFoundError:
            print(f"Data file not found at: {DATA_FILE}")
            return jsonify({'error': 'EMAIL_NOT_FOUND'}), 401
        except json.JSONDecodeError as e:
            print(f"Error reading JSON file: {e}")
            return jsonify({'error': 'SERVER_ERROR'}), 500

        # Check if user exists and password matches
        for user in users:
            if user['email'] == email:
                # Verify password
                if bcrypt.checkpw(password.encode('utf-8'), user['password'].encode('utf-8')):
                    # Generate JWT token with expiration
                    token = jwt.encode({
                        'email': email,
                        'exp': datetime.utcnow() + timedelta(hours=24),
                        'iat': datetime.utcnow()  # Token creation time
                    }, SECRET_KEY, algorithm="HS256")

                    print(f"Login successful for {email}")
                    return jsonify({
                        'success': True,
                        'email': email,
                        'token': token
                    }), 200
                else:
                    print(f"Invalid password for {email}")
                    return jsonify({'error': 'INVALID_PASSWORD'}), 401

        print(f"Email {email} not found in database")
        return jsonify({'error': 'EMAIL_NOT_FOUND'}), 401

    except Exception as e:
        print(f"Server error during login: {str(e)}")
        return jsonify({'error': 'SERVER_ERROR'}), 500

if __name__ == '__main__':
    print(f"Initializing server... Data file path: {DATA_FILE}")
    initialize_json_file()
    app.run(port=5000, debug=True) 