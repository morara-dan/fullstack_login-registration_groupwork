# Modern Fullstack Auth App (Flask + React)

A simple demonstration of a full-stack user authentication application featuring registration and login functionalities using Python (Flask/SQLAlchemy) for the backend API and React for the frontend user interface.

## Features

*   User Registration (Username, Email, Password)
*   User Login (using Username or Email)
*   Password Hashing (using Werkzeug)
*   Stateless Authentication using JSON Web Tokens (JWT)
*   Protected Routes on the Backend
*   Frontend protected routes using React Router
*   Responsive and Dark Futuristic UI Theme

## Technologies Used

**Backend:**

*   Python
*   Flask
*   Flask-SQLAlchemy
*   Flask-Migrate (for database migrations)
*   Werkzeug (for password hashing)
*   PyJWT (for JWT handling)
*   python-dotenv (for environment variables)
*   Flask-CORS (for enabling cross-origin requests)

**Frontend:**

*   React
*   React Router DOM
*   Axios (for HTTP requests)
*   jwt-decode (optional client-side JWT decoding)
*   CSS (with Media Queries for responsiveness)

## Setup and Installation

**Prerequisites:**

*   Python 3.7+
*   Node.js & npm (or yarn)

**Steps:**

1.  **Clone the Repository:**
    ```bash
    git clone <repository_url> # Replace with your repository URL if applicable
    cd modern-auth-app
    ```

2.  **Backend Setup:**

    *   Navigate to the `backend` directory:
        ```bash
        cd backend
        ```
    *   Create and activate a Python virtual environment:
        ```bash
        python -m venv venv
        # On Windows:
        # venv\Scripts\activate
        # On macOS/Linux:
        source venv/bin/activate
        ```
    *   Install backend dependencies:
        ```bash
        pip install -r requirements.txt
        # OR if you didn't create requirements.txt initially, run:
        # pip install Flask Flask-SQLAlchemy Flask-Migrate Flask-CORS Werkzeug PyJWT python-dotenv
        # pip freeze > requirements.txt # Good practice to generate this after installing
        ```
    *   Set up Environment Variables:
        *   Create a file named `.env` in the `backend` directory if it doesn't exist.
        *   Add essential variables (replace placeholder values):
            ```env
            SECRET_KEY='your_flask_secret_key_here'
            JWT_SECRET_KEY='your_jwt_secret_key_here'
            DATABASE_URL='sqlite:///app.db' # Or your PostgreSQL/MySQL connection string
            ```
            *Note: Use strong, random strings for the secret keys in production.*
    *   Set up Flask environment variables:
        *   Create a file named `.flaskenv` in the `backend` directory if it doesn't exist.
        *   Add the following:
            ```env
            FLASK_APP=app.py
            FLASK_ENV=development
            ```
    *   Initialize and run database migrations:
        ```bash
        flask db init   # Run only ONCE
        flask db migrate -m "Initial migration" # Create migration script
        flask db upgrade # Apply the migration to the database
        ```

3.  **Frontend Setup:**

    *   Open a **new terminal window** (or a new tab in your existing terminal).
    *   Navigate to the `frontend` directory:
        ```bash
        cd ../frontend # If you are currently in the backend directory
        # Or navigate directly: cd modern-auth-app/frontend
        ```
    *   Install frontend dependencies:
        ```bash
        npm install
        # Or if you prefer yarn:
        # yarn install
        ```

## Running the Application

You need to run the backend and frontend separately.

1.  **Run the Backend:**

    *   In your backend terminal (from the `backend` directory, with `venv` active):
        ```bash
        flask run --port=5001
        ```
    *   You should see output indicating the Flask server is running on `http://127.0.0.1:5001`.

2.  **Run the Frontend:**

    *   In your frontend terminal (from the `frontend` directory):
        ```bash
        npm start
        # Or
        # yarn start
        ```
    *   This will usually open the React app in your browser at `http://localhost:3000`.

## Usage

1.  Open your browser to `http://localhost:3000`.
2.  Use the "Register" link/button to create a new user account.
3.  Use the "Login" link/button with your registered credentials.
4.  Once logged in, you should see navigation options for "Home," "Profile," and "Protected." These are protected routes.

Enjoy!