# Faculty Requirements

## 1. Overview

The AI-Guided Academic Project Progress Tracking Platform provides faculty mentors with a centralized way to monitor student academic projects. The faculty module is intended to reduce the effort required to supervise multiple teams by providing project progress, milestone status, risks, project health, and AI-generated summaries.

The Faculty Monitoring Dashboard will be implemented as part of the overall project and will use information generated and maintained by the student, backend, database, and AI-agent modules.

---

## 2. Faculty Role

The faculty mentor is responsible for supervising and monitoring student projects.

The system should allow faculty members to:

- View projects assigned to them.
- Monitor student/team project progress.
- View milestone completion status.
- Identify delayed or at-risk projects.
- Review project risks and mitigation information.
- View overall project health.
- Access AI-generated project progress summaries.

---

## 3. Functional Requirements

### FR-01: Faculty Access

The system shall provide authenticated access for faculty mentors to the faculty monitoring area.

**Priority:** High

### FR-02: View Assigned Projects

The system shall allow faculty mentors to view the projects assigned to them.

**Priority:** High

### FR-03: View Student/Team Information

The system shall allow faculty mentors to view relevant student or team information associated with each project.

**Priority:** High

### FR-04: View Project Status

The system shall display the current status of each monitored project.

Example statuses:

- Not Started
- In Progress
- On Track
- At Risk
- Completed

**Priority:** High

### FR-05: View Milestone Progress

The system shall allow faculty mentors to view the progress and completion status of project milestones.

**Priority:** High

### FR-06: View Project Risks

The system shall allow faculty mentors to view identified project risks and their current status.

**Priority:** High

### FR-07: View Project Health

The system shall provide an overall indication of project health based on factors such as progress, milestone completion, timeline, and identified risks.

**Priority:** High

### FR-08: View AI-Generated Summary

The system shall provide AI-generated summaries of project progress to help faculty mentors quickly understand the current state of a project.

**Priority:** Medium

### FR-09: View Project History

The system should allow faculty mentors to review relevant project progress history, including milestone updates and status changes.

**Priority:** Medium

---

## 4. Faculty Dashboard Requirements

The faculty dashboard should provide a summarized view of supervised projects.

The dashboard should display information such as:

- Total number of assigned projects
- Projects in progress
- Completed projects
- Delayed projects
- At-risk projects
- Overall project progress

A faculty member should be able to select a project and view more detailed information.

---

## 5. Project Monitoring Requirements

For each project, the faculty mentor should be able to view:

- Project title
- Student/team information
- Project status
- Overall progress
- Current milestone
- Completed milestones
- Pending milestones
- Identified risks
- Risk severity
- Project health
- AI-generated progress summary

---

## 6. Risk Monitoring Requirements

The system should highlight projects that require faculty attention.

Examples include:

- Missed milestone deadlines
- Low project progress
- High-severity risks
- Repeated delays
- Technology or resource-related issues

Projects requiring attention should be clearly distinguishable from projects that are progressing normally.

---

## 7. Non-Functional Requirements

### NFR-01: Usability

The faculty dashboard should be simple and easy to understand so that faculty members can quickly identify project status and issues.

### NFR-02: Performance

Project monitoring information should be displayed within a reasonable response time.

### NFR-03: Security

Faculty members should only be able to access projects and student information that they are authorized to monitor.

### NFR-04: Reliability

The system should handle invalid requests and temporary failures gracefully without losing project data.

### NFR-05: Maintainability

The faculty module should be structured so that additional monitoring features can be added in future milestones.

---

## 8. Requirement Priority

| Requirement | Priority |
|---|---|
| Faculty access | High |
| View assigned projects | High |
| View student/team information | High |
| View project status | High |
| View milestone progress | High |
| View project risks | High |
| View project health | High |
| AI-generated summary | Medium |
| View project history | Medium |

---

## 9. Acceptance Criteria

The faculty monitoring module will be considered acceptable when:

- Faculty can access the faculty monitoring area.
- Faculty can view assigned projects.
- Student/team information is displayed correctly.
- Project status is clearly displayed.
- Milestone progress can be viewed.
- Project risks can be viewed.
- Projects requiring attention can be identified.
- Project health information is displayed.
- AI-generated project summaries can be displayed when available.
- Unauthorized project information is not accessible.
