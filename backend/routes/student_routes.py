from flask import Blueprint, request, jsonify
from services.ai_service import (
    generate_project_blueprint,
    generate_project_synopsis,
    generate_project_methodology,
    generate_project_progress_report
)

student_bp = Blueprint("student", __name__)


@student_bp.route("/project/analyze", methods=["POST"])
def analyze_project():

    data = request.get_json() or {}

    project_idea = data.get("project_idea", "").strip()

    if not project_idea:
        return jsonify({
            "success": False,
            "error": "Project idea is required"
        }), 400

    try:
        result = generate_project_blueprint(project_idea)

        return jsonify({
            "success": True,
            "result": str(result)
        })

    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


@student_bp.route("/project/synopsis", methods=["POST"])
def generate_project_synopsis_route():

    data = request.get_json() or {}

    project_idea = data.get("project_idea", "").strip()

    if not project_idea:
        return jsonify({
            "success": False,
            "error": "Project idea is required"
        }), 400

    try:
        synopsis = generate_project_synopsis(project_idea)

        return jsonify({
            "success": True,
            "synopsis": synopsis
        })

    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500
@student_bp.route("/project/methodology", methods=["POST"])
def generate_project_methodology_route():

    data = request.get_json() or {}

    project_idea = data.get("project_idea", "").strip()

    if not project_idea:
        return jsonify({
            "success": False,
            "error": "Project idea is required"
        }), 400

    try:
        methodology = generate_project_methodology(project_idea)

        return jsonify({
            "success": True,
            "methodology": methodology
        })

    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@student_bp.route("/project/progress-report", methods=["POST"])
def generate_project_progress_report_route():

    data = request.get_json() or {}

    project_idea = data.get("project_idea", "").strip()

    if not project_idea:
        return jsonify({
            "success": False,
            "error": "Project idea is required"
        }), 400

    try:
        report = generate_project_progress_report(project_idea)

        return jsonify({
            "success": True,
            "progress_report": report
        })

    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500