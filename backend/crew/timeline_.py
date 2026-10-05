import json
from crewai import Task


def create_timeline_task(agent, project_data):

    duration_weeks = project_data.get("duration_weeks", 8)

    project_idea = project_data.get(
        "project_idea",
        "Not provided"
    )

    feasibility = project_data.get(
        "feasibility",
        {}
    )

    scope = project_data.get(
        "scope",
        {}
    )

    technology_stack = project_data.get(
        "technology_stack",
        {}
    )

    task = Task(
        description=f"""
Create a realistic milestone-based development timeline
for the following academic software project.

PROJECT IDEA:
{project_idea}

FEASIBILITY:
{json.dumps(feasibility, indent=2)}

PROJECT SCOPE:
{json.dumps(scope, indent=2)}

TECHNOLOGY STACK:
{json.dumps(technology_stack, indent=2)}

PROJECT DURATION:
{duration_weeks} weeks

Your responsibilities:

1. Create exactly {duration_weeks} weekly milestones.
2. Start with requirements and project planning.
3. Include system design and development.
4. Include AI/agent integration where applicable.
5. Include testing and debugging.
6. Include final integration and documentation.
7. Give realistic tasks for every week.
8. Give expected deliverables for every week.
9. Mention dependencies between milestones.
10. Ensure the complete project fits within the given duration.

Return ONLY valid JSON.

Use exactly this structure:

{{
    "project_title": "Project title",
    "total_duration_weeks": {duration_weeks},
    "weekly_plan": [
        {{
            "week": 1,
            "milestone": "Milestone name",
            "tasks": [
                "Task 1",
                "Task 2"
            ],
            "deliverables": [
                "Deliverable 1",
                "Deliverable 2"
            ],
            "dependencies": []
        }}
    ]
}}
""",

        expected_output=(
            "A valid JSON object containing project_title, "
            "total_duration_weeks and weekly_plan."
        ),

        agent=agent
    )

    return task