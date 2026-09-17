from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
import os

# Load environment variables from .env
load_dotenv()

# Temporary check for API key
print("API KEY FOUND:", bool(os.getenv("OPENAI_API_KEY")))

from database.mongodb import test_connection
from services.technology_agent import recommend_technology_stack


# Create Flask app
app = Flask(__name__)

# Allow React frontend to communicate with Flask
CORS(app)


# --------------------------------------------------
# Home Route
# --------------------------------------------------

@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "message": "AI Project Mentor Backend is running"
    })


# --------------------------------------------------
# Health Check Route
# --------------------------------------------------

@app.route("/api/health", methods=["GET"])
def health():
    try:
        mongodb_status = test_connection()

        return jsonify({
            "backend": "running",
            "mongodb": mongodb_status,
            "success": True
        })

    except Exception as e:
        return jsonify({
            "backend": "running",
            "mongodb": "error",
            "error": str(e),
            "success": False
        }), 500


# --------------------------------------------------
# Technology Stack Recommendation Agent
# --------------------------------------------------

@app.route("/api/technology", methods=["POST"])
def technology_recommendation():

    try:
        # Get JSON data from Postman / React
        data = request.get_json()

        if not data:
            return jsonify({
                "error": "Request body is required",
                "success": False
            }), 400

        # Get required inputs
        project_idea = data.get("project_idea")
        feasibility_analysis = data.get("feasibility_analysis")
        project_scope = data.get("project_scope")

        # Check required fields
        if not project_idea:
            return jsonify({
                "error": "project_idea is required",
                "success": False
            }), 400

        if not feasibility_analysis:
            return jsonify({
                "error": "feasibility_analysis is required",
                "success": False
            }), 400

        if not project_scope:
            return jsonify({
                "error": "project_scope is required",
                "success": False
            }), 400

        # Call Technology Stack Recommendation Agent
        result = recommend_technology_stack(
            project_idea=project_idea,
            feasibility_analysis=feasibility_analysis,
            project_scope=project_scope
        )

        # Return agent result
        return jsonify({
            "success": True,
            "technology_recommendation": result
        }), 200

    except Exception as e:

        print("Technology Agent Error:", str(e))

        return jsonify({
            "error": str(e),
            "success": False
        }), 500


# --------------------------------------------------
# Run Flask Server
# --------------------------------------------------

if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=5000,
        debug=False
    )