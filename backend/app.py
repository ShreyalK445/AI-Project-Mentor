from flask import Flask, jsonify
from flask_cors import CORS

from database.mongodb import test_connection

app = Flask(__name__)

# Allow React frontend to communicate with Flask
CORS(app)


@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "message": "AI Project Mentor Backend is running"
    })


@app.route("/api/health", methods=["GET"])
def health():
    mongodb_status = test_connection()

    return jsonify({
        "backend": "running",
        "mongodb": "connected" if mongodb_status else "not connected"
    })


if __name__ == "__main__":
    app.run(debug=True, port=5000)