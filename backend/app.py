from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import jwt 
import datetime
from functools import wraps 

from config import Config
from models import db, User

app = Flask(__name__)
app.config.from_object(Config)

#
db.init_app(app) 
migrate = Migrate(app, db)
CORS(app) 


def create_access_token(user_id):
    payload = {
        'user_id': user_id,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1) 
    }
    token = jwt.encode(payload, app.config['JWT_SECRET_KEY'], algorithm='HS256')
    return token

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            try:
                token = auth_header.split(" ")[1] 
            except IndexError:
                return jsonify({'message': 'Bearer token malformed'}), 401

        if not token:
            return jsonify({'message': 'Token is missing!'}), 401

        try:
            data = jwt.decode(token, app.config['JWT_SECRET_KEY'], algorithms=['HS256'])
            current_user = User.query.get(data['user_id'])
            if not current_user:
                return jsonify({'message': 'Token is invalid or user does not exist'}), 401
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token has expired!'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Token is invalid!'}), 401

        return f(current_user, *args, **kwargs)
    return decorated

# --- Routes ---
@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    app.logger.info(f"Registration attempt data: {data}")
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if not username or not email or not password:
        return jsonify({'message': 'Missing username, email, or password'}), 400

    if User.query.filter_by(username=username).first():
        return jsonify({'message': 'Username already exists'}), 409 

    if User.query.filter_by(email=email).first():
        return jsonify({'message': 'Email already exists'}), 409

    new_user = User(username=username, email=email)
    new_user.set_password(password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'User registered successfully!'}), 201

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    identifier = data.get('identifier') 
    password = data.get('password')

    if not identifier or not password:
        return jsonify({'message': 'Missing identifier or password'}), 400

    user = User.query.filter((User.username == identifier) | (User.email == identifier)).first()

    if user and user.check_password(password):
        token = create_access_token(user_id=user.id)
        return jsonify({
            'message': 'Login successful!',
            'token': token,
            'user': user.to_dict() 
        }), 200
    else:
        return jsonify({'message': 'Invalid credentials'}), 401

@app.route('/api/profile', methods=['GET'])
@token_required
def profile(current_user):
    
    return jsonify({
        'message': 'Profile data',
        'user': current_user.to_dict()
    }), 200

@app.route('/api/protected', methods=['GET'])
@token_required
def protected_route(current_user):
    return jsonify({'message': f'Hello {current_user.username}! This is a protected route.'}), 200
@app.route('/', methods=['GET'])
def home():
    return jsonify({'message': 'Welcome to the Flask application!'}), 200

if __name__ == '__main__':
    
    with app.app_context():
        db.create_all()
    app.run(debug=True, port=5001) # Run on a different port than React