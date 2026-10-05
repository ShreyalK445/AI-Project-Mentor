import os
import json

from dotenv import load_dotenv
from google import genai


# Load environment variables from .env
load_dotenv()


# Get Gemini API key
api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise ValueError(
        "GEMINI_API_KEY is not set in the .env file."
    )


# Create Gemini client
client = genai.Client(api_key=api_key)


def generate_timeline(project_data):
    """
    Generate an AI-based milestone and project timeline
    using Gemini.
    """

    # Extract project information
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

    duration_weeks = project_data.get(
        "duration_weeks",
        8
    )

    # Create prompt for Gemini
    prompt = f"""
You are an AI Academic Project Planning and Timeline Mentor.

Your task is to create a realistic milestone-based development
timeline for a student's academic software project.

PROJECT INFORMATION

Project Idea:
{project_idea}

Feasibility Assessment:
{json.dumps(feasibility, indent=2)}

Project Scope:
{json.dumps(scope, indent=2)}

Technology Stack:
{json.dumps(technology_stack, indent=2)}

Available Duration:
{duration_weeks} weeks


TASK

Based on the information above, create a structured project
development timeline.

The timeline should:

1. Divide the project into logical weekly milestones.
2. Consider the project scope and feasibility.
3. Consider the given technology stack.
4. Assign realistic tasks to every week.
5. Provide expected deliverables for every week.
6. Mention dependencies between milestones where applicable.
7. Make sure the complete project can be completed within
   the specified number of weeks.
8. Maintain a logical development sequence from requirements
   to design, development, integration, testing and completion.


OUTPUT FORMAT

Return ONLY valid JSON.

Do not add explanations before or after the JSON.

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
                "Task 2",
                "Task 3"
            ],
            "deliverables": [
                "Deliverable 1",
                "Deliverable 2"
            ],
            "dependencies": []
        }}
    ]
}}

Make sure every week from Week 1 to Week {duration_weeks}
is included.
"""


    try:
        # Call Gemini API
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )

        # Get Gemini response
        result = response.text.strip()

        # Remove Markdown JSON code fences if Gemini adds them
        if result.startswith("```json"):
            result = result[7:]

        elif result.startswith("```"):
            result = result[3:]

        if result.endswith("```"):
            result = result[:-3]

        result = result.strip()

        # Convert AI response into Python JSON
        try:
            return json.loads(result)

        except json.JSONDecodeError:
            return {
                "error": "AI returned invalid JSON",
                "raw_response": result
            }

    except Exception as e:
        return {
            "error": "Gemini API request failed",
            "details": str(e)
        }


# ---------------------------------------------------------
# TESTING
# ---------------------------------------------------------

if __name__ == "__main__":

    sample_project = {

        "project_idea":
            "AI based student attendance system",

        "feasibility": {
            "status": "Feasible",
            "reasoning":
                "The project can be developed within "
                "an academic project timeline."
        },

        "scope": {

            "objective":
                "Develop an AI-based attendance system.",

            "in_scope": [
                "Student registration",
                "Face-based attendance",
                "Attendance records",
                "Attendance dashboard"
            ],

            "out_of_scope": [
                "Biometric hardware integration"
            ]
        },

        "technology_stack": {

            "frontend": "ReactJS",
            "backend": "Python Flask",
            "database": "MongoDB",
            "ai": "Python computer vision"
        },

        "duration_weeks": 8
    }


    print("\n==========================================")
    print("MILESTONE & TIMELINE AGENT TEST")
    print("==========================================\n")

    timeline = generate_timeline(sample_project)

    print(
        json.dumps(
            timeline,
            indent=4
        )
    )

    print("\n==========================================")
    print("TEST COMPLETED")
    print("==========================================")