import os

from dotenv import load_dotenv
from crewai import Agent, Task, Crew, LLM

load_dotenv()


# ---------------------------------------------------------
# CREATE RISK AGENT
# ---------------------------------------------------------

def create_risk_agent():

    api_key = os.getenv("GROQ_API_KEY")

    if not api_key:
        raise ValueError(
            "GROQ_API_KEY not found. Please check your .env file."
        )

    llm = LLM(
        model="openai/" + os.getenv(
            "GROQ_MODEL",
            "openai/gpt-oss-120b"
        ),
        api_key=api_key,
        base_url="https://api.groq.com/openai/v1"
    )

    risk_agent = Agent(
        role="Project Risk Assessment and Mitigation Expert",

        goal=(
            "Analyze the feasibility of an academic project, "
            "identify realistic project risks, assess their severity "
            "and provide practical mitigation strategies."
        ),

        backstory=(
            "You are an experienced project risk analyst specializing "
            "in academic software, AI, ML, IoT and technology projects. "
            "You analyze feasibility reports carefully and identify "
            "technical, data, timeline, resource, integration, "
            "API and AI/ML related risks."
        ),

        llm=llm,

        verbose=True,

        allow_delegation=False
    )

    return risk_agent


# ---------------------------------------------------------
# CREATE RISK TASK
# ---------------------------------------------------------

def create_risk_task(risk_agent, feasibility_output):

    risk_task = Task(

        description=f"""
You are performing Risk Assessment for an academic project.

The Feasibility Agent has already analyzed the project.

Use the following Feasibility Assessment as your input:

--------------------------------------------------
FEASIBILITY ASSESSMENT
--------------------------------------------------

{feasibility_output}

--------------------------------------------------
YOUR TASK
--------------------------------------------------

Analyze the feasibility assessment and identify realistic
risks that may affect the academic project.

For every important risk provide:

1. Risk
2. Category
3. Probability
4. Impact
5. Severity
6. Reason
7. Possible Effect
8. Mitigation
9. Recommended Action

Use these risk categories when applicable:

- Technical Risk
- Data Risk
- Timeline Risk
- Resource Risk
- Integration Risk
- AI/ML Model Risk
- API/External Service Risk
- Security Risk

Probability must be one of:

LOW
MEDIUM
HIGH

Impact must be one of:

LOW
MEDIUM
HIGH

Severity must be one of:

LOW
MEDIUM
HIGH

IMPORTANT RULES:

- Only identify risks relevant to the project.
- Do not create unrealistic risks.
- Do not repeat the same risk.
- Give practical solutions that students can actually follow.
- Keep the explanation clear and understandable.
- Consider the feasibility assessment carefully before identifying risks.

--------------------------------------------------
REQUIRED OUTPUT FORMAT
--------------------------------------------------

RISK ASSESSMENT REPORT

Risk 1:
Category:
Risk:
Probability:
Impact:
Severity:
Reason:
Possible Effect:
Mitigation:
Recommended Action:

Risk 2:
Category:
Risk:
Probability:
Impact:
Severity:
Reason:
Possible Effect:
Mitigation:
Recommended Action:

Risk 3:
Category:
Risk:
Probability:
Impact:
Severity:
Reason:
Possible Effect:
Mitigation:
Recommended Action:

Continue with additional important risks if required.

--------------------------------------------------
OVERALL PROJECT RISK
--------------------------------------------------

OVERALL PROJECT RISK:
HIGH / MEDIUM / LOW

--------------------------------------------------
TOP PRIORITY ACTIONS
--------------------------------------------------

1.
2.
3.

--------------------------------------------------
FINAL RECOMMENDATION
--------------------------------------------------

Give a short final recommendation for the student
about how to reduce the major project risks.
""",

        expected_output=(
            "A clear and structured Risk Assessment Report "
            "containing realistic project risks, risk categories, "
            "probability, impact, severity, reasons, possible effects, "
            "mitigation strategies, recommended actions, overall risk "
            "and top priority actions."
        ),

        agent=risk_agent
    )

    return risk_task


# ---------------------------------------------------------
# RUN RISK ASSESSMENT
# ---------------------------------------------------------

def run_risk_assessment(feasibility_output):

    try:

        if not feasibility_output:
            return {
                "success": False,
                "error": "Feasibility output is empty."
            }

        # Create Risk Agent
        risk_agent = create_risk_agent()

        # Create Risk Task
        risk_task = create_risk_task(
            risk_agent,
            feasibility_output
        )

        # Create Crew
        crew = Crew(
            agents=[risk_agent],
            tasks=[risk_task],
            verbose=True
        )

        # Run Crew
        result = crew.kickoff()

        # Convert CrewAI output to string
        risk_report = str(result)

        return {
            "success": True,
            "risk_assessment": risk_report
        }

    except Exception as error:

        print("\n======================================")
        print("RISK AGENT ERROR")
        print("======================================")
        print(error)
        print("======================================\n")

        return {
            "success": False,
            "error": str(error)
        }