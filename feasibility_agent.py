import os
from openai import OpenAI


def run_feasibility_agent(
    student,
    project,
    client=None
):

    prompt = f"""
You are the Feasibility Analysis Agent
in an AI Academic Project Mentor system.

Your responsibility is to determine whether
a student's proposed project is realistic
and achievable.

STUDENT INFORMATION
-------------------
Name: {student.get("name")}
Department: {student.get("department")}
Academic Year: {student.get("academic_year")}
Skills: {student.get("skills")}
Interests: {student.get("interests")}

PROJECT INFORMATION
-------------------
Title: {project.get("title")}
Category: {project.get("category")}
Description: {project.get("description")}
Objective: {project.get("objective")}

Analyze the project using:

1. Technical feasibility
2. Student skill compatibility
3. Project complexity
4. Required resources
5. Expected challenges
6. Estimated difficulty

Give a final feasibility rating:

HIGH
MEDIUM
LOW

IMPORTANT:
Explain clearly why you selected
the feasibility rating.

Return the answer with these headings:

FEASIBILITY RATING
REASONING
SKILL COMPATIBILITY
TECHNICAL REQUIREMENTS
MAJOR CHALLENGES
RECOMMENDATIONS
"""

    if client is None:
        return fallback_feasibility(student, project)

    try:

        response = client.responses.create(
            model=os.getenv(
                "OPENAI_MODEL",
                "gpt-5.6-luna"
            ),
            input=prompt
        )

        return response.output_text

    except Exception as error:

        return (
            "Feasibility Agent Error:\n\n"
            f"{error}\n\n"
            + fallback_feasibility(
                student,
                project
            )
        )


def fallback_feasibility(student, project):

    skills = student.get("skills", "")

    project_text = (
        project.get("title", "")
        + " "
        + project.get("description", "")
    ).lower()

    ml_words = [
        "machine learning",
        "artificial intelligence",
        "ai",
        "deep learning",
        "prediction",
        "classification"
    ]

    has_ai_project = any(
        word in project_text
        for word in ml_words
    )

    if has_ai_project and (
        "Python" in skills
        or "Machine Learning" in skills
    ):

        rating = "HIGH"

        reason = (
            "The project is reasonably achievable "
            "because the student has relevant "
            "Python or Machine Learning skills."
        )

    elif has_ai_project:

        rating = "MEDIUM"

        reason = (
            "The project is possible, but the student "
            "may need to learn additional AI/ML concepts."
        )

    else:

        rating = "MEDIUM"

        reason = (
            "The project appears suitable for an "
            "academic prototype, but its final "
            "feasibility depends on the detailed "
            "requirements and available resources."
        )

    return f"""
FEASIBILITY RATING
{rating}

REASONING
{reason}

SKILL COMPATIBILITY
Student skills: {skills}

TECHNICAL REQUIREMENTS
The student should identify the required
frameworks, libraries, database and tools
before implementation.

MAJOR CHALLENGES
- Managing project scope
- Testing the complete system
- Completing the project within the academic timeline

RECOMMENDATIONS
Start with a minimum viable prototype
and add advanced features only after
the core system works.
"""