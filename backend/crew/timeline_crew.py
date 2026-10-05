import os

from dotenv import load_dotenv
from crewai import Agent, Crew, Process, LLM

from crew.timeline_ import create_timeline_task


load_dotenv()


def create_timeline_crew(project_data):

    # Get Gemini API key
    api_key = os.getenv("GEMINI_API_KEY")

    if not api_key:
        raise ValueError(
            "GEMINI_API_KEY is not set in the .env file."
        )

    # Create Gemini LLM for CrewAI
    llm = LLM(
        model="gemini/gemini-2.5-flash",
        api_key=api_key
    )

    # Create Timeline Agent
    timeline_agent = Agent(

        role="Academic Project Timeline Planner",

        goal=(
            "Create a realistic and structured milestone "
            "timeline for academic software projects."
        ),

        backstory=(
            "You are an experienced academic project planning "
            "mentor. You analyze project scope, feasibility, "
            "technology stack and available duration to create "
            "realistic weekly milestones."
        ),

        llm=llm,

        verbose=True
    )

    # Create Timeline Task
    timeline_task = create_timeline_task(
        timeline_agent,
        project_data
    )

    # Create CrewAI Crew
    crew = Crew(

        agents=[
            timeline_agent
        ],

        tasks=[
            timeline_task
        ],

        process=Process.sequential,

        verbose=True
    )

    return crew