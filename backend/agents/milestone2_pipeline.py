def feasibility_agent(project_idea):
    return f"""
FEASIBILITY ANALYSIS

Project: {project_idea}

Technical Feasibility: HIGH

Required Skills:
- Programming
- Database management
- API development
- Basic AI/ML knowledge if required

Resources:
- Computer
- Development environment
- Required software libraries
- Database

Complexity: MEDIUM

Possible Challenges:
- System integration
- Data management
- Testing
- Deployment

Conclusion:
The project is technically feasible for a student team with proper planning.
"""


def scope_agent(project_idea, feasibility):
    return f"""
PROJECT SCOPE

Project: {project_idea}

Objective:
Develop a functional system that solves the proposed problem efficiently.

Target Users:
- Students
- Project users
- Administrators where applicable

Core Features:
1. User interaction
2. Data input and processing
3. Main project functionality
4. Result generation
5. Data storage
6. Testing and validation

Functional Requirements:
- Accept user input
- Process project data
- Generate meaningful results
- Store required information
- Display results clearly

In Scope:
- Core project functionality
- Database integration
- User interface
- Testing

Out of Scope:
- Large-scale commercial deployment
- Advanced enterprise features
- Production-level infrastructure
"""


def technology_agent(project_idea, scope):
    return f"""
TECHNOLOGY STACK RECOMMENDATION

Project: {project_idea}

Programming Language:
Python
Reason: Easy development and strong library support.

Frontend:
React.js
Reason: Component-based and suitable for interactive interfaces.

Backend:
Flask
Reason: Lightweight and easy to integrate with Python services.

Database:
MongoDB
Reason: Flexible document-based storage.

AI/ML:
Python AI/ML libraries when required.
Reason: Provides strong support for machine learning development.

Frameworks/Libraries:
- Flask
- React.js
- Python libraries
- MongoDB driver

Development Tools:
- VS Code
- Git
- GitHub

The recommended stack is suitable for student-level development
and allows easy integration between frontend, backend and AI components.
"""


def timeline_agent(project_idea, technology):
    return f"""
MILESTONE AND TIMELINE PLAN

Project: {project_idea}

Week 1:
Milestone: Requirement Analysis
Tasks:
- Understand the problem
- Identify users
- Finalize requirements

Deliverable:
- Requirement specification

Week 2:
Milestone: System Design
Tasks:
- Design system architecture
- Design database
- Design user interface

Deliverable:
- System architecture and database design

Week 3:
Milestone: Backend Development
Tasks:
- Develop backend APIs
- Implement database operations

Deliverable:
- Working backend

Week 4:
Milestone: Frontend Development
Tasks:
- Develop user interface
- Connect frontend with backend

Deliverable:
- Working frontend

Week 5:
Milestone: AI/ML Integration
Tasks:
- Integrate required AI/ML functionality
- Connect AI components with backend

Deliverable:
- Integrated AI functionality

Week 6:
Milestone: Testing
Tasks:
- Unit testing
- Integration testing
- End-to-end testing
- Fix identified issues

Deliverable:
- Tested project

Week 7:
Milestone: Finalization
Tasks:
- Documentation
- Final deployment
- Project demonstration

Deliverable:
- Complete project blueprint and working system
"""


def run_milestone2_pipeline(project_idea):

    print("\n" + "=" * 60)
    print("MILESTONE 2 - MULTI-AGENT PIPELINE")
    print("=" * 60)

    print("\n[AGENT 1] Feasibility Analysis...")
    feasibility = feasibility_agent(project_idea)
    print("✓ Feasibility analysis completed")

    print("\n[AGENT 2] Scope Definition...")
    scope = scope_agent(project_idea, feasibility)
    print("✓ Scope definition completed")

    print("\n[AGENT 3] Technology Stack Recommendation...")
    technology = technology_agent(project_idea, scope)
    print("✓ Technology recommendation completed")

    print("\n[AGENT 4] Milestone & Timeline Planning...")
    timeline = timeline_agent(project_idea, technology)
    print("✓ Timeline planning completed")

    final_blueprint = f"""
============================================================
COMPLETE PROJECT BLUEPRINT
============================================================

{feasibility}

{scope}

{technology}

{timeline}

============================================================
END OF BLUEPRINT
============================================================
"""

    return final_blueprint