
import { useState, useRef } from "react";
import "./App.css";

const API_URL = "http://127.0.0.1:5000/api/technology";

const skills = [
  { id: "Python", icon: "🐍", name: "Python" },
  { id: "Java", icon: "☕", name: "Java" },
  { id: "JavaScript", icon: "JS", name: "JavaScript" },
  { id: "React", icon: "⚛", name: "React" },
  { id: "MongoDB", icon: "◆", name: "MongoDB" },
  { id: "AI / ML", icon: "◉", name: "AI / ML" },
];

export default function App() {
  const [currentPage, setCurrentPage] = useState("profile");
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [technologyResult, setTechnologyResult] = useState(null);
  const [technologyLoading, setTechnologyLoading] = useState(false);
  const [technologyError, setTechnologyError] = useState("");
  const touchStartX = useRef(0);
  const touchCurrentX = useRef(0);

  const [formData, setFormData] = useState({
    name: "",
    department: "",
    year: "",
    interests: "",
  });

  const [projectData, setProjectData] = useState({
    title: "",
    category: "",
    description: "",
    objective: "",
  });

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchCurrentX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const delta = touchCurrentX.current - touchStartX.current;

    if (!sidebarOpen && touchStartX.current < 30 && delta > 60) {
      setSidebarOpen(true);
    }

    if (sidebarOpen && delta < -60) {
      setSidebarOpen(false);
    }

    touchStartX.current = 0;
    touchCurrentX.current = 0;
  };

  const toggleSkill = (skill) => {
    setSelectedSkills((current) =>
      current.includes(skill)
        ? current.filter((item) => item !== skill)
        : [...current, skill]
    );
  };

  const handleProfileChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleProjectChange = (e) => {
    setProjectData({
      ...projectData,
      [e.target.name]: e.target.value,
    });
  };

  const handleContinue = () => {
    if (!formData.name || !formData.department || !formData.year) {
      alert("Please complete all required fields.");
      return;
    }

    setCurrentPage("project");
  };

  const handleProjectContinue = () => {
    if (
      !projectData.title ||
      !projectData.category ||
      !projectData.description
    ) {
      alert("Please complete all required project fields.");
      return;
    }

    setTechnologyError("");
    setCurrentPage("review");
  };

  // Technology Agent runs only after View Recommendation is clicked.
  const handleViewRecommendation = async () => {
    setTechnologyLoading(true);
    setTechnologyError("");
    setTechnologyResult(null);
    setCurrentPage("technology");

    const feasibilityAnalysis =
      "The project is technically feasible based on the submitted project idea, available skills, and proposed academic scope.";

    const projectScope =
      projectData.objective ||
      `Develop ${projectData.title} with the required features described by the student.`;

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          project_idea: `${projectData.title}. ${projectData.description}`,
          feasibility_analysis: feasibilityAnalysis,
          project_scope: projectScope,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error || "Technology recommendation request failed."
        );
      }

      setTechnologyResult(data.technology_recommendation);
    } catch (error) {
      console.error("Technology Agent Error:", error);
      setTechnologyError(
        "Unable to connect to the Technology Agent. Please make sure the Flask backend is running on port 5000."
      );
    } finally {
      setTechnologyLoading(false);
    }
  };

  const handleCompleteOnboarding = () => {
    alert("Congratulations! Your project onboarding is complete!");
    setCurrentPage("dashboard");
  };

  // Displays any object returned by the backend without assuming one exact
  // response structure. This makes the frontend compatible with the current
  // Technology Agent response and future response improvements.
  const renderRecommendation = (value, level = 0) => {
    if (value === null || value === undefined || value === "") return null;

    if (typeof value === "object" && !Array.isArray(value)) {
      return (
        <div className={level === 0 ? "recommendation-object" : "recommendation-nested"}>
          {Object.entries(value).map(([key, item]) => (
            <div className="recommendation-item" key={key}>
              <h4>{formatKey(key)}</h4>
              {renderRecommendation(item, level + 1)}
            </div>
          ))}
        </div>
      );
    }

    if (Array.isArray(value)) {
      return (
        <ul className="recommendation-list">
          {value.map((item, index) => (
            <li key={index}>{renderRecommendation(item, level + 1)}</li>
          ))}
        </ul>
      );
    }

    return <p className="recommendation-value">{String(value)}</p>;
  };

  const formatKey = (key) =>
    String(key)
      .replace(/_/g, " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase());

  // Parses the Technology Agent's numbered plain-text stack
  // ("1. PROGRAMMING LANGUAGE\n\nTechnology: Python\n\nReason: ...")
  // into structured cards. Falls back to null if the text doesn't
  // match that shape, so the generic renderer can still handle it.
  const parseTechStackText = (text) => {
    if (typeof text !== "string") return null;

    const cleaned = text.replace(/\\n/g, "\n").trim();
    const blocks = cleaned
      .split(/\n?\s*\d+\.\s+/)
      .map((b) => b.trim())
      .filter(Boolean);

    if (blocks.length < 2) return null;

    const cards = blocks
      .map((block) => {
        const techMatch = block.match(/Technology:\s*([\s\S]*?)(?:\n\s*Reason:|$)/i);
        const reasonMatch = block.match(/Reason:\s*([\s\S]*)/i);
        if (!techMatch) return null;

        const labelLine = block.split(/\n/)[0].split("Technology:")[0].trim();

        return {
          label: labelLine || "Recommendation",
          tech: techMatch[1].trim().replace(/\n+/g, " "),
          reason: reasonMatch ? reasonMatch[1].trim().replace(/\n+/g, " ") : "",
        };
      })
      .filter(Boolean);

    return cards.length ? cards : null;
  };

  const renderTechStackCards = (text) => {
    const cards = parseTechStackText(text);
    if (!cards) return renderRecommendation(text);

    return (
      <div className="tech-stack-grid">
        {cards.map((card, i) => {
          const isSkipped = /not required/i.test(card.tech);
          return (
            <div
              className={`tech-stack-card${isSkipped ? " tech-stack-card--skip" : ""}`}
              key={i}
            >
              <span className="tech-stack-index">{i + 1}</span>
              <div className="tech-stack-body">
                <p className="tech-stack-label">{card.label}</p>
                <h4 className="tech-stack-name">{card.tech}</h4>
                {card.reason && (
                  <p className="tech-stack-reason">{card.reason}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <>
      <style>{`
        .tech-stack-grid {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 8px;
        }

        .tech-stack-card {
          display: grid;
          grid-template-columns: 34px 1fr;
          gap: 16px;
          background: rgba(15, 23, 55, 0.55);
          border: 1px solid rgba(120, 140, 255, 0.15);
          border-radius: 14px;
          padding: 18px 20px;
        }

        .tech-stack-card--skip {
          opacity: 0.65;
        }

        .tech-stack-index {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 13px;
          background: linear-gradient(135deg, #3ad4ff, #8a3bff);
          color: #fff;
        }

        .tech-stack-card--skip .tech-stack-index {
          background: rgba(255, 255, 255, 0.08);
          color: #8b93b8;
        }

        .tech-stack-label {
          font-size: 12px;
          letter-spacing: 0.02em;
          color: #8b93b8;
          margin: 0 0 4px;
        }

        .tech-stack-name {
          margin: 0 0 6px;
          font-size: 17px;
          font-weight: 700;
          color: #7ce0c6;
        }

        .tech-stack-card--skip .tech-stack-name {
          color: #8b93b8;
        }

        .tech-stack-reason {
          margin: 0;
          font-size: 14px;
          line-height: 1.55;
          color: #c7cdec;
        }

        .main-content .profile-card-large {
          padding: 32px;
        }

        .onboarding-steps {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 24px 32px;
          margin-bottom: 24px;
          border-radius: 16px;
          background: rgba(15, 23, 55, 0.55);
          border: 1px solid rgba(120, 140, 255, 0.15);
        }

        .onboarding-step {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          min-width: 90px;
        }

        .onboarding-step-icon {
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          font-weight: 700;
          font-size: 16px;
          background: rgba(255, 255, 255, 0.06);
          color: #8b93b8;
          border: 1px solid rgba(120, 140, 255, 0.2);
        }

        .onboarding-step.active .onboarding-step-icon,
        .onboarding-step.done .onboarding-step-icon {
          background: linear-gradient(135deg, #3ad4ff, #8a3bff);
          color: #fff;
          border-color: transparent;
        }

        .onboarding-step-title {
          font-weight: 700;
          font-size: 14px;
          color: #8b93b8;
        }

        .onboarding-step.active .onboarding-step-title,
        .onboarding-step.done .onboarding-step-title {
          color: #fff;
        }

        .onboarding-step-subtitle {
          font-size: 12px;
          color: #6c7599;
        }

        .onboarding-step-line {
          flex: 1;
          height: 2px;
          background: rgba(120, 140, 255, 0.2);
          border-radius: 2px;
          margin: 0 4px;
          align-self: flex-start;
          margin-top: 22px;
        }

        .onboarding-step-line.filled {
          background: linear-gradient(90deg, #3ad4ff, #8a3bff);
        }

        .selected-technologies-display {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .selected-technologies-display .tech-tags {
          font-weight: 600;
          color: #e6e9f7;
        }
      `}</style>

    <div
      className="app-shell"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="background-glow glow-one"></div>
      <div className="background-glow glow-two"></div>
      <div className="cyber-grid"></div>

      <button
        className="hamburger-button"
        onClick={() => setSidebarOpen(true)}
        aria-label="Open menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <button
          className="sidebar-close"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close menu"
        >
          ✕
        </button>

        <div className="brand">
          <div className="brand-icon">
            <span>AI</span>
          </div>

          <div>
            <h2>AI Project Mentor</h2>
            <p>Academic Guidance Platform</p>
          </div>
        </div>

        <div className="sidebar-line"></div>
        <div className="nav-heading">OVERVIEW</div>

        <button
          className={`nav-item ${currentPage === "dashboard" ? "active" : ""}`}
          onClick={() => {
            setCurrentPage("dashboard");
            setSidebarOpen(false);
          }}
        >
          <span className="nav-icon">▦</span>
          Dashboard
        </button>

        <div className="nav-heading onboarding-heading">ONBOARDING</div>

        <button
          className={`nav-item ${currentPage === "profile" ? "active" : ""}`}
          onClick={() => {
            setCurrentPage("profile");
            setSidebarOpen(false);
          }}
        >
          <span className="nav-icon">♙</span>
          Student Profile
        </button>

        <button
          className={`nav-item ${currentPage === "project" ? "active" : ""}`}
          onClick={() => {
            setCurrentPage("project");
            setSidebarOpen(false);
          }}
        >
          <span className="nav-icon">▤</span>
          Project Submission
        </button>

        <button
          className={`nav-item ${currentPage === "review" ? "active" : ""}`}
          onClick={() => {
            setCurrentPage("review");
            setSidebarOpen(false);
          }}
        >
          <span className="nav-icon">☑</span>
          Review & Complete
        </button>

        <div className="sidebar-bottom">
          <div className="help-card">
            <p className="help-title">NEED HELP?</p>

            <div className="help-content">
              <div className="mentor-bot">
                <svg viewBox="0 0 100 100" className="mentor-bot-svg">
                  <defs>
                    <linearGradient
                      id="botHead"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#3ad4ff" />
                      <stop offset="100%" stopColor="#8a3bff" />
                    </linearGradient>
                  </defs>

                  <line
                    x1="50"
                    y1="8"
                    x2="50"
                    y2="18"
                    stroke="url(#botHead)"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  <circle cx="50" cy="6" r="4" fill="#3ad4ff" />
                  <rect
                    x="20"
                    y="18"
                    width="60"
                    height="46"
                    rx="16"
                    fill="#0a1330"
                    stroke="url(#botHead)"
                    strokeWidth="3"
                  />
                  <rect
                    x="30"
                    y="30"
                    width="16"
                    height="18"
                    rx="8"
                    fill="#0a1330"
                    stroke="#4ce0ff"
                    strokeWidth="2.5"
                  />
                  <circle cx="38" cy="39" r="3.5" fill="#4ce0ff" />
                  <rect
                    x="54"
                    y="30"
                    width="16"
                    height="18"
                    rx="8"
                    fill="#0a1330"
                    stroke="#4ce0ff"
                    strokeWidth="2.5"
                  />
                  <circle cx="62" cy="39" r="3.5" fill="#4ce0ff" />
                  <path
                    d="M38 54 Q50 60 62 54"
                    stroke="#c86bff"
                    strokeWidth="3"
                    fill="none"
                    strokeLinecap="round"
                  />
                  <rect
                    x="12"
                    y="34"
                    width="8"
                    height="14"
                    rx="4"
                    fill="url(#botHead)"
                  />
                  <rect
                    x="80"
                    y="34"
                    width="8"
                    height="14"
                    rx="4"
                    fill="url(#botHead)"
                  />
                  <rect
                    x="28"
                    y="68"
                    width="44"
                    height="24"
                    rx="10"
                    fill="#0a1330"
                    stroke="url(#botHead)"
                    strokeWidth="3"
                  />
                  <circle cx="50" cy="80" r="4" fill="#4ce0ff" />
                </svg>
              </div>

              <p>
                Our AI Mentor is here to guide you through every step of your
                project journey.
              </p>
            </div>

            <button className="help-button" onClick={() => setAiOpen(true)}>
              Get AI Assistance <span>→</span>
            </button>
          </div>

          <div className="weather">
            <span className="weather-icon">☁️</span>
            <div>
              <strong>28°C</strong>
              <span>Mostly Clear</span>
            </div>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="top-header">
          <div className="page-heading">
            <div className="workspace-label">
              <span className="status-dot"></span>
              STUDENT WORKSPACE
            </div>

            <h1>
              {currentPage === "dashboard"
                ? "Student Dashboard"
                : "Academic Project Onboarding"}
            </h1>

            <p>
              Manage your academic project and get personalized guidance from
              our AI Mentor.
            </p>
          </div>

          <div className="header-actions">
            <div className="session">
              <span></span>
              Session Active
            </div>
            <button className="notification">🔔<i></i></button>
            <div className="avatar">ST</div>
          </div>
        </header>

        {(currentPage === "profile" || currentPage === "project") && (
          <div className="onboarding-steps">
            <div className={`onboarding-step ${currentPage === "profile" ? "active" : "done"}`}>
              <div className="onboarding-step-icon">1</div>
              <div className="onboarding-step-title">Profile</div>
              <div className="onboarding-step-subtitle">Tell us about you</div>
            </div>

            <div className={`onboarding-step-line ${currentPage === "project" ? "filled" : ""}`}></div>

            <div className={`onboarding-step ${currentPage === "project" ? "active" : ""}`}>
              <div className="onboarding-step-icon">2</div>
              <div className="onboarding-step-title">Project</div>
              <div className="onboarding-step-subtitle">Share your idea</div>
            </div>

            <div className="onboarding-step-line"></div>

            <div className="onboarding-step">
              <div className="onboarding-step-icon">✓</div>
              <div className="onboarding-step-title">Complete</div>
              <div className="onboarding-step-subtitle">Review &amp; finish</div>
            </div>
          </div>
        )}

        {/* --------------------------------------------------
            STUDENT PROFILE
        -------------------------------------------------- */}
        {currentPage === "profile" && (
          <section className="glass-card profile-card-large">
            <div className="card-heading">
              <div className="section-icon">♙</div>
              <div>
                <div className="section-number">SECTION 01</div>
                <h2>Build your academic profile</h2>
                <p>
                  Provide your academic background and technical skills so we
                  can offer relevant project guidance.
                </p>
              </div>
            </div>

            <div className="form-grid">
              <div className="input-group">
                <label>Full Name *</label>
                <div className="input-wrap">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleProfileChange}
                    placeholder="Enter your name"
                  />
                </div>
              </div>

              <div className="input-group">
                <label>Department *</label>
                <div className="input-wrap">
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleProfileChange}
                    placeholder="e.g. CSE / CSM"
                  />
                </div>
              </div>

              <div className="input-group full">
                <label>Academic Year *</label>
                <div className="input-wrap">
                  <select
                    name="year"
                    value={formData.year}
                    onChange={handleProfileChange}
                  >
                    <option value="">Select year</option>
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                  </select>
                </div>
              </div>

              <div className="input-group full">
                <label>Technical Skills</label>
                <p className="field-hint">Select the technologies you are familiar with</p>
                <div className="skill-grid">
                  {skills.map((skill) => (
                    <button
                      type="button"
                      key={skill.id}
                      className={`skill-grid ${
                        selectedSkills.includes(skill.id) ? "selected" : ""
                      }`}

                      
                      onClick={() => toggleSkill(skill.id)}
                    >
                      <span>{skill.icon}</span>
                      {skill.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="input-group full">
                <label>Academic Interests</label>
                <div className="input-wrap">
                  <input
                    type="text"
                    name="interests"
                    value={formData.interests}
                    onChange={handleProfileChange}
                    placeholder="AI, Web Development, etc."
                  />
                </div>
              </div>
            </div>

            <div className="form-footer">
              <span></span>
              <button
                type="button"
                className="primary-button"
                onClick={handleContinue}
              >
                Continue to Project
                <span className="button-arrow">→</span>
              </button>
            </div>
          </section>
        )}

        {/* --------------------------------------------------
            PROJECT SUBMISSION
        -------------------------------------------------- */}
        {currentPage === "project" && (
          <section className="glass-card">
            <div className="card-heading">
              <div className="section-icon">▤</div>
              <div>
                <div className="section-number">SECTION 02</div>
                <h2>Submit your project idea</h2>
                <p>
                  Tell us about your project idea so our AI Mentor can
                  provide personalized guidance.
                </p>
              </div>
            </div>

            <div className="form-grid">
              <div className="input-group">
                <label>Project Title *</label>
                <div className="input-wrap">
                  <input
                    type="text"
                    name="title"
                    value={projectData.title}
                    onChange={handleProjectChange}
                    placeholder="e.g. AI Based Student Attendance System"
                  />
                </div>
              </div>

              <div className="input-group">
                <label>Project Category *</label>
                <div className="input-wrap">
                  <select
                    name="category"
                    value={projectData.category}
                    onChange={handleProjectChange}
                  >
                    <option value="">Select category</option>
                    <option value="Artificial Intelligence">Artificial Intelligence</option>
                    <option value="Machine Learning">Machine Learning</option>
                    <option value="Web Development">Web Development</option>
                    <option value="Data Science">Data Science</option>
                    <option value="IoT">IoT</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="input-group selected-technologies-display">
                <label>Selected Technologies</label>
                <div className="tech-tags">
                  {selectedSkills.length > 0
                    ? selectedSkills.join(", ")
                    : "No skills selected yet"}
                </div>
              </div>

              <div className="input-group full">
                <label>Project Description *</label>
                <div className="input-wrap">
                  <textarea
                    name="description"
                    value={projectData.description}
                    onChange={handleProjectChange}
                    placeholder="Explain what your project will do..."
                    rows="5"
                  ></textarea>
                </div>
              </div>

              <div className="input-group full">
                <label>Project Objective</label>
                <div className="input-wrap">
                  <textarea
                    name="objective"
                    value={projectData.objective}
                    onChange={handleProjectChange}
                    placeholder="What is the main objective of your project?"
                    rows="4"
                  ></textarea>
                </div>
              </div>
            </div>

            {technologyError && (
              <div className="error-message">
                ⚠️ {technologyError}
              </div>
            )}

            <div className="form-footer">
              <button type="button" onClick={() => setCurrentPage("profile")}>
                ← Back to Profile
              </button>

              <button
                type="button"
                className="primary-button"
                onClick={handleProjectContinue}
              >
                Continue to Review
                <span className="button-arrow">→</span>
              </button>
            </div>
          </section>
        )}

        {/* --------------------------------------------------
            REVIEW & COMPLETE
        -------------------------------------------------- */}
        {currentPage === "review" && (
          <section className="glass-card">
            <div className="card-heading">
              <div className="section-icon">✓</div>
              <div>
                <div className="section-number">SECTION 03</div>
                <h2>Review & Complete</h2>
                <p>
                  Your academic profile and project idea are ready for review.
                </p>
              </div>
            </div>

            <div className="review-details">
              <p><strong>Student Name :</strong> {formData.name}</p>
              <p><strong>Department :</strong> {formData.department}</p>
              <p><strong>Academic Year :</strong> {formData.year}</p>
              <p><strong>Project Title :</strong> {projectData.title}</p>
              <p><strong>Project Category :</strong> {projectData.category}</p>
              <p>
                <strong>Technical Skills :</strong>{" "}
                {selectedSkills.length > 0
                  ? selectedSkills.join(", ")
                  : "No skills selected"}
              </p>
            </div>

            <div className="form-footer">
              <button type="button" onClick={() => setCurrentPage("project")}>
                ← Back to Project
              </button>

              <button
                type="button"
                className="primary-button"
                onClick={handleViewRecommendation}
              >
                View Recommendation
                <span className="button-arrow">→</span>
              </button>
            </div>
          </section>
        )}

        {/* --------------------------------------------------
            TECHNOLOGY RECOMMENDATION
        -------------------------------------------------- */}
        {currentPage === "technology" && (
          <section className="glass-card">
            <div className="card-heading">
              <div className="section-icon">⚙</div>
              <div>
                <div className="section-number">SECTION 04</div>
                <h2>Technology Recommendation</h2>
                <p>Recommended technologies generated by the Technology Stack Recommendation Agent.</p>
              </div>
            </div>

            {technologyLoading && (
              <div className="technology-result-section">
                <div className="technology-result-heading">
                  <span>🛠️</span>
                  <div>
                    <h3>Analyzing your project...</h3>
                    <p>Please wait while the Technology Agent generates your recommendation.</p>
                  </div>
                </div>
              </div>
            )}

            {!technologyLoading && technologyError && (
              <>
                <div className="error-message">⚠️ {technologyError}</div>
                <div className="form-footer">
                  <button type="button" onClick={() => setCurrentPage("review")}>
                    ← Back to Review
                  </button>
                  <button
                    type="button"
                    className="primary-button"
                    onClick={handleViewRecommendation}
                  >
                    Try Again
                    <span className="button-arrow">→</span>
                  </button>
                </div>
              </>
            )}

            {!technologyLoading && !technologyError && technologyResult && (
              <>
                <div className="review-details">
                  <p><strong>Project Title :</strong> {projectData.title}</p>
                  <p><strong>Project Category :</strong> {projectData.category}</p>
                </div>

                <div className="technology-result-section">
                  <div className="technology-result-heading">
                    <span>🛠️</span>
                    <div>
                      <h3>Recommended Technology Stack</h3>
                      <p>Generated by the Technology Stack Recommendation Agent.</p>
                    </div>
                  </div>

                  <div className="technology-result">
                    {renderTechStackCards(technologyResult)}
                  </div>
                </div>

                <div className="form-footer">
                  <button type="button" onClick={() => setCurrentPage("review")}>
                    ← Back to Review
                  </button>
                  <button
                    type="button"
                    className="primary-button"
                    onClick={handleCompleteOnboarding}
                  >
                    Complete Onboarding ✓
                  </button>
                </div>
              </>
            )}
          </section>
        )}

        {/* --------------------------------------------------
            DASHBOARD
        -------------------------------------------------- */}
        {currentPage === "dashboard" && (
          <section className="glass-card">
            <div className="card-heading">
              <div className="section-icon">▦</div>
              <div>
                <div className="section-number">DASHBOARD</div>
                <h2>Welcome, {formData.name || "Student"} 👋</h2>
                <p>Your project onboarding has been completed successfully.</p>
              </div>
            </div>

            <div className="form-grid">
              <div className="input-group">
                <label>Project Title</label>
                <div className="input-wrap">
                  <span>{projectData.title || "No project submitted"}</span>
                </div>
              </div>

              <div className="input-group">
                <label>Project Category</label>
                <div className="input-wrap">
                  <span>{projectData.category || "Not selected"}</span>
                </div>
              </div>

              <div className="input-group full">
                <label>Selected Skills</label>
                <div className="input-wrap">
                  <span>
                    {selectedSkills.length > 0
                      ? selectedSkills.join(", ")
                      : "No skills selected"}
                  </span>
                </div>
              </div>

              <div className="input-group full">
                <label>Project Status</label>
                <div className="input-wrap">
                  <span>🎉 Onboarding Completed</span>
                </div>
              </div>
            </div>

            <div className="form-footer">
              <button type="button" onClick={() => setCurrentPage("profile")}>
                ← Back to Profile
              </button>

            </div>
          </section>
        )}

        {/* --------------------------------------------------
            AI MENTOR MODAL
        -------------------------------------------------- */}
        {aiOpen && (
          <div className="ai-modal-overlay">
            <div className="ai-modal">
              <button
                className="ai-close"
                onClick={() => setAiOpen(false)}
                aria-label="Close AI Mentor"
              >
                ✕
              </button>

              <div className="ai-modal-icon">🤖</div>
              <h2>AI Mentor</h2>
              <p>
                Hi! I&apos;m your AI Project Mentor. Choose an option below to
                get guidance for your academic project.
              </p>

              <div className="ai-options">
                <button
                  type="button"
                  onClick={() =>
                    alert(
                      "AI Mentor: Start by defining your project problem, target users, and expected outcome."
                    )
                  }
                >
                  💡 Suggest Project Ideas
                </button>

                <button
                  type="button"
                  onClick={() =>
                    alert(
                      "AI Mentor: Break your project into milestones such as planning, design, development, testing, and deployment."
                    )
                  }
                >
                  📋 Create Project Plan
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentPage("project")}
                >
                  🛠️ Recommend Technologies
                </button>

                <button
                  type="button"
                  onClick={() =>
                    alert(
                      "AI Mentor: Track your project by marking each milestone as Not Started, In Progress, or Completed."
                    )
                  }
                >
                  🎯 Track Project Progress
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
    </>
  );
}
