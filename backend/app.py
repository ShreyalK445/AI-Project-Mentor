from flask import Flask, jsonify, request
from flask_cors import CORS
from routes.student_routes import student_bp
from database.mongodb import test_connection, progress_collection, timeline_collection
from routes.timeline_routes import timeline_bp
from routes.plan_routes import plan_bp

app = Flask(__name__)

# Allow React frontend to communicate with Flask
CORS(app)

app.register_blueprint(student_bp, url_prefix="/api")
app.register_blueprint(timeline_bp, url_prefix="/api")
app.register_blueprint(plan_bp, url_prefix="/api")
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

@app.route("/api/progress", methods=["POST"])
def track_progress():

    try:
        data = request.get_json()

        if not data:
            return jsonify({
                "error": "Request body is required",
                "success": False
            }), 400

        week = data.get("week")
        current_task = data.get("current_task")
        completed_tasks = data.get("completed_tasks", "")
        pending_tasks = data.get("pending_tasks", "")
        problems = data.get("problems", "")

        if not week:
            return jsonify({
                "error": "week is required",
                "success": False
            }), 400

        if not current_task:
            return jsonify({
                "error": "current_task is required",
                "success": False
            }), 400

        if not completed_tasks and not pending_tasks:
            return jsonify({
                "error": "At least completed_tasks or pending_tasks is required",
                "success": False
            }), 400

        completed_list = [
            task.strip()
            for task in str(completed_tasks)
            .replace("\n", ",")
            .split(",")
            if task.strip()
        ]

        pending_list = [
            task.strip()
            for task in str(pending_tasks)
            .replace("\n", ",")
            .split(",")
            if task.strip()
        ]

        completed_count = len(completed_list)
        pending_count = len(pending_list)

        total_tasks = completed_count + pending_count

        if total_tasks > 0:
            progress = round(
                (completed_count / total_tasks) * 100
            )
        else:
            progress = 0

        if progress >= 80:
            status = "On Track"
        elif progress >= 50:
            status = "In Progress"
        else:
            status = "Needs Attention"

        progress_document = {
            "week": week,
            "current_task": current_task,
            "completed_tasks": completed_list,
            "pending_tasks": pending_list,
            "completed_count": completed_count,
            "pending_count": pending_count,
            "total_tasks": total_tasks,
            "progress_percentage": progress,
            "status": status,
            "problems": problems
        }

        result = progress_collection.insert_one(progress_document)

        progress_document["_id"] = str(result.inserted_id)

        return jsonify({
            "success": True,
            "message": "Progress calculated and saved successfully",
            "progress": progress_document
        }), 200

    except Exception as e:
        print("Progress Tracking Error:", str(e))

        return jsonify({
            "error": str(e),
            "success": False
        }), 500


if __name__ == "__main__":
    app.run(debug=True, port=5000)