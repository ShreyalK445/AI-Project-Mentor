from agents.milestone2_pipeline import run_milestone2_pipeline

project_idea = """
I want to build an AI-based system that helps students
predict their academic performance using machine learning.
"""

print("\n========================================")
print("   AI PROJECT MENTOR - MILESTONE 2")
print("========================================\n")

print("Project Idea:")
print(project_idea)

print("\nRunning four-agent pipeline...\n")

result = run_milestone2_pipeline(project_idea)

print("\n========================================")
print("        FINAL PROJECT BLUEPRINT")
print("========================================\n")

print(result)