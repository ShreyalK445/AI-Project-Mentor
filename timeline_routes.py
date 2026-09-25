from flask import Blueprint, request, jsonify

from services.timeline_agent import generate_timeline


timeline_bp = Blueprint("timeline", __name__)


@timeline_bp.route("/milestone-timeline", methods=["POST"])
def create_milestone_timeline():

    try:
        project_data = request.get_json()

        if not project_data:
            return jsonify({
                "success": False,
                "message": "No project data provided"
            }), 400

        print("\n===== MILESTONE & TIMELINE AGENT STARTED =====")
        print("Project data received:")
        print(project_data)

        timeline = generate_timeline(project_data)

        print("\n===== TIMELINE GENERATED SUCCESSFULLY =====")

        return jsonify({
            "success": True,
            "timeline": timeline
        }), 200

    except Exception as e:

        print("\n===== TIMELINE AGENT ERROR =====")
        print(str(e))

        return jsonify({
            "success": False,
            "message": "Failed to generate project timeline",
            "error": str(e)
        }), 500