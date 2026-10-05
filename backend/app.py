from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
import os

# ==================================================
# LOAD ENVIRONMENT VARIABLES
# ==================================================

load_dotenv()

print("API KEY FOUND:", bool(os.getenv("OPENAI_API_KEY")))


# ==================================================
# IMPORT DATABASE
# ==================================================

from database.mongodb import (
    test_connection,
    progress_collection,
    timeline_collection
)


# ==================================================
# IMPORT AGENTS
# ==================================================

from services.technology_agent import (
    recommend_technology_stack
)

from services.timeline_agent import (
    generate_timeline
)


# ==================================================
# CREATE FLASK APP
# ==================================================

app = Flask(__name__)

CORS(app)


# ==================================================
# HOME ROUTE
# ==================================================

@app.route("/", methods=["GET"])
def home():

    return jsonify({
        "message": "AI Project Mentor Backend is running",
        "success": True
    }), 200


# ==================================================
# HEALTH CHECK ROUTE
# ==================================================

@app.route("/api/health", methods=["GET"])
def health():

    try:

        mongodb_status = test_connection()

        return jsonify({

            "backend": "running",
            "mongodb": mongodb_status,
            "success": True

        }), 200

    except Exception as e:

        return jsonify({

            "backend": "running",
            "mongodb": "error",
            "error": str(e),
            "success": False

        }), 500


# ==================================================
# TECHNOLOGY STACK RECOMMENDATION AGENT
# ==================================================

@app.route("/api/technology", methods=["POST"])
def technology_recommendation():

    try:

        data = request.get_json()

        if not data:

            return jsonify({

                "error": "Request body is required",
                "success": False

            }), 400

        project_idea = data.get("project_idea")

        feasibility_analysis = data.get(
            "feasibility_analysis"
        )

        project_scope = data.get(
            "project_scope"
        )

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

        result = recommend_technology_stack(

            project_idea=project_idea,
            feasibility_analysis=feasibility_analysis,
            project_scope=project_scope

        )

        return jsonify({

            "success": True,
            "technology_recommendation": result

        }), 200

    except Exception as e:

        print(
            "Technology Agent Error:",
            str(e)
        )

        return jsonify({

            "error": str(e),
            "success": False

        }), 500


# ==================================================
# MILESTONE & TIMELINE AGENT
# ==================================================

@app.route(
    "/api/milestone-timeline",
    methods=["POST"]
)
def create_milestone_timeline():

    try:

        project_data = request.get_json()

        if not project_data:

            return jsonify({

                "success": False,
                "message": "No project data provided"

            }), 400

        print(
            "\n===== MILESTONE & TIMELINE AGENT STARTED ====="
        )

        print(
            "Project data received:"
        )

        print(project_data)

        timeline = generate_timeline(
            project_data
        )

        # ------------------------------------------
        # Save generated Timeline for M3 Progress
        # Tracking
        # ------------------------------------------

        timeline_document = {
            "project_title": timeline.get(
                "project_title",
                project_data.get("project_idea")
            ),
            "total_duration_weeks": timeline.get(
                "total_duration_weeks"
            ),
            "weekly_plan": timeline.get(
                "weekly_plan",
                []
            )
        }

        timeline_collection.insert_one(
            timeline_document
        )

        print(
            "\n===== TIMELINE GENERATED AND SAVED SUCCESSFULLY ====="
        )

        return jsonify({

            "success": True,
            "timeline": timeline

        }), 200

    except Exception as e:

        print(
            "\n===== TIMELINE AGENT ERROR ====="
        )

        print(str(e))

        return jsonify({

            "success": False,
            "message": "Failed to generate project timeline",
            "error": str(e)

        }), 500


# ==================================================
# MILESTONE 3 - PROGRESS TRACKING
# ==================================================

@app.route(
    "/api/progress",
    methods=["POST"]
)
def track_progress():

    try:

        data = request.get_json()

        if not data:

            return jsonify({

                "error": "Request body is required",
                "success": False

            }), 400

        week = data.get("week")

        current_task = data.get(
            "current_task"
        )

        completed_tasks = data.get(
            "completed_tasks",
            ""
        )

        pending_tasks = data.get(
            "pending_tasks",
            ""
        )

        problems = data.get(
            "problems",
            ""
        )

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

        if (
            not completed_tasks
            and not pending_tasks
        ):

            return jsonify({

                "error": (
                    "At least completed_tasks "
                    "or pending_tasks is required"
                ),
                "success": False

            }), 400

        completed_list = [

            task.strip()

            for task in str(
                completed_tasks
            )
            .replace("\n", ",")
            .split(",")

            if task.strip()

        ]

        pending_list = [

            task.strip()

            for task in str(
                pending_tasks
            )
            .replace("\n", ",")
            .split(",")

            if task.strip()

        ]

        completed_count = len(
            completed_list
        )

        pending_count = len(
            pending_list
        )

        total_tasks = (
            completed_count
            + pending_count
        )

        if total_tasks > 0:

            progress = round(

                (
                    completed_count
                    / total_tasks
                ) * 100

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

        progress_collection.insert_one(
            progress_document
        )

        return jsonify({

            "success": True,

            "message": (
                "Progress calculated and "
                "saved successfully"
            ),

            "progress": {

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

        }), 200

    except Exception as e:

        print(
            "Progress Tracking Error:",
            str(e)
        )

        return jsonify({

            "error": str(e),
            "success": False

        }), 500


# ==================================================
# GET PROGRESS HISTORY
# ==================================================

@app.route(
    "/api/progress",
    methods=["GET"]
)
def get_progress():

    try:

        progress_data = list(

            progress_collection.find(
                {},
                {
                    "_id": 0
                }
            )

        )

        return jsonify({

            "success": True,
            "progress": progress_data

        }), 200

    except Exception as e:

        print(
            "Get Progress Error:",
            str(e)
        )

        return jsonify({

            "success": False,
            "error": str(e)

        }), 500


# ==================================================
# GET LATEST TIMELINE FOR M3
# ==================================================

@app.route(
    "/api/timeline",
    methods=["GET"]
)
def get_timeline():

    try:

        timeline = timeline_collection.find_one(
            {},
            {
                "_id": 0
            },
            sort=[
                ("_id", -1)
            ]
        )

        if not timeline:

            return jsonify({

                "success": False,
                "message": "No timeline found"

            }), 404

        return jsonify({

            "success": True,
            "timeline": timeline

        }), 200

    except Exception as e:

        print(
            "Get Timeline Error:",
            str(e)
        )

        return jsonify({

            "success": False,
            "error": str(e)

        }), 500


# ==================================================
# RUN FLASK SERVER
# ==================================================

if __name__ == "__main__":

    app.run(

        host="0.0.0.0",
        port=5000,
        debug=False

    )
