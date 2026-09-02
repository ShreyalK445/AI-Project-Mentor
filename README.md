# AI-Project-Mentor

### AI-Guided Academic Project Progress Tracking Platform with Planning & Mentorship Assistance

AI Project Mentor is an academic project management platform designed to help students plan, monitor, and improve their project development journey.

The platform combines project progress tracking, student skill assessment, milestone planning, and AI-assisted mentorship into a unified system.

---

## 🎯 Problem Statement

Academic project development often becomes difficult for students because of:

- Lack of structured project planning
- Unclear milestones and deadlines
- Difficulty identifying required technical skills
- Limited access to continuous project guidance
- Poor visibility of individual and team progress
- Delayed identification of project risks

AI Project Mentor aims to address these challenges by providing a centralized platform for project planning, progress tracking, and intelligent mentorship assistance.

---

## 💡 Proposed Solution

The system provides a structured workflow in which students can:

1. Create and manage their project profile
2. Assess their existing technical skills
3. Define project requirements and milestones
4. Track project progress
5. Submit project-related information
6. Receive planning and mentorship assistance
7. Identify potential delays, risks, and skill gaps

The platform is designed to evolve toward an AI-assisted multi-agent architecture using CrewAI.

---

## ✨ Key Features

### Student Management
- Student profile management
- Academic/project information
- Skill assessment

### Project Management
- Project submission
- Project information management
- Milestone-based planning
- Progress tracking

### AI-Assisted Mentorship
- AI-guided project assistance
- Planning recommendations
- Progress analysis
- Risk identification
- Skill-gap assistance

### Team & Progress Monitoring
- Milestone tracking
- Task/progress monitoring
- Project status visibility
- Future support for team-level project management

---

## 🏗️ System Architecture

```text
                    ┌─────────────────────┐
                    │       Student       │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   React Frontend    │
                    │                     │
                    │ • Student Profile   │
                    │ • Skill Assessment  │
                    │ • Project Submission│
                    │ • Progress Tracking │
                    └──────────┬──────────┘
                               │
                         HTTP / REST API
                               │
                               ▼
                    ┌─────────────────────┐
                    │   Flask Backend     │
                    │                     │
                    │ • API Management    │
                    │ • Validation        │
                    │ • Business Logic    │
                    │ • AI Integration    │
                    └──────┬───────┬──────┘
                           │       │
                           ▼       ▼
                  ┌────────────┐ ┌──────────────┐
                  │  MongoDB   │ │ CrewAI / AI  │
                  │  Database  │ │   Agents     │
                  └────────────┘ └──────────────┘
