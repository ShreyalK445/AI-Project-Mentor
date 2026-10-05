from agents.milestone2_pipeline import run_milestone2_pipeline
from services.documentation_service import (
    generate_synopsis,
    generate_methodology,
    generate_progress_report
)


def generate_project_blueprint(project_idea):
    return run_milestone2_pipeline(project_idea)


def generate_project_synopsis(project_idea):
    blueprint = run_milestone2_pipeline(project_idea)

    return generate_synopsis(project_idea, blueprint)


def generate_project_methodology(project_idea):
    blueprint = run_milestone2_pipeline(project_idea)

    return generate_methodology(project_idea, blueprint)

def generate_project_progress_report(project_idea):
    completed_tasks = [
        "Student onboarding",
        "Project idea submission",
        "Feasibility analysis",
        "Scope definition",
        "Technology stack recommendation",
        "Milestone and timeline planning"
    ]

    pending_tasks = [
        "Risk assessment",
        "AI Mentor integration",
        "Progress tracking",
        "Plan adjustment",
        "Final testing"
    ]

    current_progress = "Milestone 2 completed. Milestone 3 is currently in progress."

    risks = [
        "System integration",
        "Data management",
        "Testing and validation"
    ]

    problems = [
        "No major problems reported yet."
    ]

    next_week_plan = [
        "Complete Risk Assessment Agent",
        "Integrate AI Mentor",
        "Implement Progress Tracking",
        "Continue system integration"
    ]

    return generate_progress_report(
        project_idea,
        completed_tasks,
        pending_tasks,
        current_progress,
        risks,
        problems,
        next_week_plan
    )