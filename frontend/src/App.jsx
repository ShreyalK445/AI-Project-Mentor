import { useState, useRef } from "react";
import "./App.css";

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
  const touchStartX = useRef(0);
  const touchCurrentX = useRef(0);

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

    setCurrentPage("review");
  };

  const handleCompleteOnboarding = () => {
    alert("Congratulations! Your project onboarding is complete!");
    setCurrentPage("dashboard");
  };

  return (
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
                  <linearGradient id="botHead" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3ad4ff" />
                    <stop offset="100%" stopColor="#8a3bff" />
                  </linearGradient>
                </defs>

                <line x1="50" y1="8" x2="50" y2="18" stroke="url(#botHead)" strokeWidth="3" strokeLinecap="round" />
                <circle cx="50" cy="6" r="4" fill="#3ad4ff" />

                <rect x="20" y="18" width="60" height="46" rx="16" fill="#0a1330" stroke="url(#botHead)" strokeWidth="3" />

                <rect x="30" y="30" width="16" height="18" rx="8" fill="#0a1330" stroke="#4ce0ff" strokeWidth="2.5" />
                <circle cx="38" cy="39" r="3.5" fill="#4ce0ff" />

                <rect x="54" y="30" width="16" height="18" rx="8" fill="#0a1330" stroke="#4ce0ff" strokeWidth="2.5" />
                <circle cx="62" cy="39" r="3.5" fill="#4ce0ff" />

                <path d="M38 54 Q50 60 62 54" stroke="#c86bff" strokeWidth="3" fill="none" strokeLinecap="round" />

                <rect x="12" y="34" width="8" height="14" rx="4" fill="url(#botHead)" />
                <rect x="80" y="34" width="8" height="14" rx="4" fill="url(#botHead)" />

                <rect x="28" y="68" width="44" height="24" rx="10" fill="#0a1330" stroke="url(#botHead)" strokeWidth="3" />
                <circle cx="50" cy="80" r="4" fill="#4ce0ff" />
              </svg>
            </div>

              <p>
                Our AI Mentor is here to guide you through every step of your
                project journey.
              </p>
            </div>

            <button className="help-button">
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

            <button className="notification">
              🔔
              <i></i>
            </button>

            <div className="avatar">ST</div>
          </div>
        </header>

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
              <span>Your project journey is ready to begin!</span>

              <button
                className="primary-button"
                onClick={() => setCurrentPage("profile")}
              >
                Edit Profile
                <span className="button-arrow">→</span>
              </button>
            </div>
          </section>
        )}

        {currentPage === "profile" && (
          <>
            <section className="progress-panel">
              <div className="progress-item">
                <div className="step-shape">1</div>
                <strong>Profile</strong>
                <span>Tell us about you</span>
              </div>

              <div className="progress-line filled"></div>

              <div className="progress-item">
                <div className="step-shape">2</div>
                <strong>Project</strong>
                <span>Share your idea</span>
              </div>

              <div className="progress-line"></div>

              <div className="progress-item">
                <div className="step-shape">✓</div>
                <strong>Complete</strong>
                <span>Review & finish</span>
              </div>
            </section>

            <section className="glass-card">
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
                  <label>
                    Full Name <b>*</b>
                  </label>

                  <div className="input-wrap">
                    <span className="field-icon">👤</span>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleProfileChange}
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label>
                    Department <b>*</b>
                  </label>

                  <div className="input-wrap">
                    <span className="field-icon">🏛</span>
                    <input
                      type="text"
                      name="department"
                      value={formData.department}
                      onChange={handleProfileChange}
                      placeholder="Example: Computer Science"
                    />
                  </div>
                </div>

                <div className="input-group full">
                  <label>
                    Academic Year <b>*</b>
                  </label>

                  <div className="select-wrap">
                    <select
                      name="year"
                      value={formData.year}
                      onChange={handleProfileChange}
                    >
                      <option value="">Select your academic year</option>
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="4th Year">4th Year</option>
                      <option value="Postgraduate">Postgraduate</option>
                    </select>
                    <span className="select-arrow">▾</span>
                  </div>
                </div>

                <div className="input-group full">
                  <label>Technical Skills</label>

                  <p className="field-description">
                    Select the technologies you are familiar with
                  </p>

                  <div className="skills-grid">
                    {skills.map((skill) => {
                      const selected = selectedSkills.includes(skill.id);

                      return (
                        <button
                          type="button"
                          key={skill.id}
                          className={`skill-card ${
                            selected ? "selected" : ""
                          }`}
                          onClick={() => toggleSkill(skill.id)}
                        >
                          <span className="skill-icon">{skill.icon}</span>
                          <span>{skill.name}</span>

                          {selected && (
                            <span className="skill-check">✓</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="input-group full academic-interests">
                  <label>Academic Interests</label>

                  <textarea
                    name="interests"
                    value={formData.interests}
                    onChange={handleProfileChange}
                    placeholder="Example: Artificial Intelligence, Web Development, Data Science..."
                  ></textarea>
                </div>
              </div>

              <div className="form-footer">
                <span>
                  <b>*</b> Required fields
                </span>

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
          </>
        )}

        {currentPage === "project" && (
          <section className="glass-card">
            <div className="card-heading">
              <div className="section-icon">▤</div>

              <div>
                <div className="section-number">SECTION 02</div>
                <h2>Submit your project idea</h2>
                <p>
                  Tell us about your project idea so our AI Mentor can provide
                  personalized guidance.
                </p>
              </div>
            </div>

            <div className="form-grid">
              <div className="input-group full">
                <label>
                  Project Title <b>*</b>
                </label>

                <div className="input-wrap">
                  <input
                    type="text"
                    name="title"
                    value={projectData.title}
                    onChange={handleProjectChange}
                    placeholder="Example: AI Based Student Project Recommendation System"
                  />
                </div>
              </div>

              <div className="input-group">
                <label>
                  Project Category <b>*</b>
                </label>

                <div className="select-wrap">
                  <select
                    name="category"
                    value={projectData.category}
                    onChange={handleProjectChange}
                  >
                    <option value="">Select project category</option>
                    <option value="Artificial Intelligence">
                      Artificial Intelligence
                    </option>
                    <option value="Web Development">Web Development</option>
                    <option value="Machine Learning">
                      Machine Learning
                    </option>
                    <option value="Data Science">Data Science</option>
                    <option value="Full Stack Development">
                      Full Stack Development
                    </option>
                  </select>
                  <span className="select-arrow">▾</span>
                </div>
              </div>

              <div className="input-group">
                <label>Selected Technologies</label>

                <div className="input-wrap">
                  <span>
                    {selectedSkills.length > 0
                      ? selectedSkills.join(", ")
                      : "No skills selected"}
                  </span>
                </div>
              </div>

              <div className="input-group full">
                <label>
                  Project Description <b>*</b>
                </label>

                <textarea
                  name="description"
                  value={projectData.description}
                  onChange={handleProjectChange}
                  placeholder="Explain your project idea, the problem you want to solve, and how your application will work..."
                ></textarea>
              </div>

              <div className="input-group full">
                <label>Project Objective</label>

                <textarea
                  name="objective"
                  value={projectData.objective}
                  onChange={handleProjectChange}
                  placeholder="What do you want to achieve with this project?"
                ></textarea>
              </div>
            </div>

            <div className="form-footer">
              <button
                type="button"
                onClick={() => setCurrentPage("profile")}
              >
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
              <p>
                <strong>Student Name :</strong> {formData.name}
              </p>

              <p>
                <strong>Department :</strong> {formData.department}
              </p>

              <p>
                <strong>Academic Year :</strong> {formData.year}
              </p>

              <p>
                <strong>Project Title :</strong> {projectData.title}
              </p>

              <p>
                <strong>Project Category :</strong> {projectData.category}
              </p>

              <p>
                <strong>Technical Skills :</strong>{" "}
                {selectedSkills.join(", ")}
              </p>
            </div>

            <div className="form-footer">
              <button
                type="button"
                onClick={() => setCurrentPage("project")}
              >
                ← Back to Project
              </button>

              <button
                type="button"
                className="primary-button"
                onClick={handleCompleteOnboarding}
              >
                Complete Onboarding ✓
              </button>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
