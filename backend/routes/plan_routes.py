from flask import Blueprint, request, jsonify
from services.plan_adjustment import adjust_timeline

plan_bp = Blueprint("plan", __name__)


@plan_bp.route("/plan-adjustment", methods=["POST"])
def plan_adjustment():

    try:
        data = request.get_json()

        if not data:
            return jsonify({
                "success": False,
                "message": "No plan or progress data provided"
            }), 400

        original_plan = data.get("original_plan")
        progress_data = data.get("progress_data", [])
        risk_data = data.get("risk_data", {})

        if not original_plan:
            return jsonify({
                "success": False,
                "message": "Original plan is required"
            }), 400

        result = adjust_timeline(
            original_plan,
            progress_data,
            risk_data
        )

        return jsonify({
            "success": True,
            "result": result
        }), 200

    except Exception as e:

        return jsonify({
            "success": False,
            "message": "Failed to adjust project timeline",
            "error": str(e)
        }), 500