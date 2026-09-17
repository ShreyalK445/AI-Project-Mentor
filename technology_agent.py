def recommend_technology_stack(
    project_idea,
    feasibility_analysis="Not provided",
    project_scope="Not provided"
):
    """
    Technology Stack Recommendation Agent
    Free rule-based version for testing.
    No OpenAI API or CrewAI credits required.
    """

    idea = project_idea.lower()
    scope = project_scope.lower()
    combined = idea + " " + scope

    # Default recommendations
    programming_language = "Python"
    frontend = "ReactJS"
    backend = "Flask"
    database = "MongoDB"
    ai_ml = "Not required"
    libraries = "Pandas, NumPy"
    external_api = "Not required"

    # --------------------------------------------------
    # AI / ML project detection
    # --------------------------------------------------
    ai_keywords = [
        "ai", "machine learning", "ml",
        "predict", "prediction", "classification",
        "deep learning", "neural network"
    ]

    if any(keyword in combined for keyword in ai_keywords):
        ai_ml = "Scikit-learn"
        libraries = "Pandas, NumPy, Scikit-learn, Matplotlib"

    # Deep learning detection (overrides Scikit-learn if matched)
    deep_learning_keywords = [
        "deep learning", "cnn", "rnn",
        "lstm", "neural network"
    ]

    if any(keyword in combined for keyword in deep_learning_keywords):
        ai_ml = "TensorFlow / Keras"
        libraries = "NumPy, Pandas, TensorFlow, Keras, Matplotlib"

    # --------------------------------------------------
    # Chatbot / NLP detection
    # --------------------------------------------------
    chatbot_keywords = ["chatbot", "chat bot", "nlp", "natural language"]

    if any(keyword in combined for keyword in chatbot_keywords):
        ai_ml = "NLTK / spaCy"
        libraries = "NLTK, spaCy, Pandas, NumPy"

    # --------------------------------------------------
    # Mobile app detection
    # --------------------------------------------------
    mobile_keywords = ["mobile app", "android app", "ios app", "flutter", "react native"]

    if any(keyword in combined for keyword in mobile_keywords):
        frontend = "React Native"

    # --------------------------------------------------
    # E-commerce / payment detection
    # --------------------------------------------------
    ecommerce_keywords = ["e-commerce", "ecommerce", "online store", "payment", "shopping cart"]

    if any(keyword in combined for keyword in ecommerce_keywords):
        external_api = "Razorpay / Stripe (Payment Gateway)"

    # --------------------------------------------------
    # Real-time / chat app detection
    # --------------------------------------------------
    realtime_keywords = ["real-time", "real time", "live chat", "socket", "notification"]

    if any(keyword in combined for keyword in realtime_keywords):
        external_api = "Socket.IO / Firebase (Real-time updates)"

    # --------------------------------------------------
    # Reason text for AI/ML row
    # --------------------------------------------------
    if ai_ml == "Scikit-learn":
        ai_ml_reason = (
            "Scikit-learn is suitable because the project involves prediction "
            "or machine learning and it provides simple algorithms for "
            "training and evaluating models."
        )
    elif ai_ml == "TensorFlow / Keras":
        ai_ml_reason = (
            "TensorFlow / Keras is suitable because the project involves "
            "deep learning or neural-network based processing."
        )
    elif ai_ml == "NLTK / spaCy":
        ai_ml_reason = (
            "NLTK / spaCy is suitable because the project involves chatbot "
            "or natural language processing functionality."
        )
    else:
        ai_ml_reason = (
            "An AI/ML framework is not required unless the project contains "
            "an AI or machine-learning component."
        )

    # --------------------------------------------------
    # Reason text for Frontend row
    # --------------------------------------------------
    if frontend == "React Native":
        frontend_reason = (
            "React Native is recommended because the project targets a "
            "mobile app, and it allows building for Android and iOS from "
            "a single JavaScript codebase."
        )
    else:
        frontend_reason = (
            "ReactJS is recommended because it supports interactive web "
            "interfaces, has reusable components, and is suitable for "
            "building a student-friendly project dashboard."
        )

    # --------------------------------------------------
    # Reason text for External API row
    # --------------------------------------------------
    if external_api == "Not required":
        external_api_reason = (
            "An external API is not required for the basic implementation. "
            "It can be added later if the project needs third-party services."
        )
    else:
        external_api_reason = (
            f"{external_api} is recommended based on the project's needs "
            "identified from the project idea and scope."
        )

    result = f"""
RECOMMENDED TECHNOLOGY STACK

1. PROGRAMMING LANGUAGE

Technology:
{programming_language}

Reason:
Python is recommended because it is beginner-friendly, widely used
for AI/ML projects, and provides many free libraries for data
processing and machine learning.


2. FRONTEND

Technology:
{frontend}

Reason:
{frontend_reason}


3. BACKEND

Technology:
{backend}

Reason:
Flask is recommended because it is lightweight, easy to learn, and
works well for connecting the frontend with Python-based
AI/ML functionality.


4. DATABASE

Technology:
{database}

Reason:
MongoDB is recommended because it stores JSON-like documents,
works easily with web applications, and is flexible when project
data structure changes.


5. AI/ML FRAMEWORK

Technology:
{ai_ml}

Reason:
{ai_ml_reason}


6. LIBRARIES AND TOOLS

Technology:
{libraries}

Reason:
These libraries provide practical tools for data processing,
numerical calculations, machine learning/deep learning, and
visualization while remaining suitable for student projects.


7. EXTERNAL APIs

Technology:
{external_api}

Reason:
{external_api_reason}


FINAL RECOMMENDATION:

The recommended stack is Python, {frontend}, Flask, and MongoDB.
For AI/ML requirements, {ai_ml if ai_ml != "Not required" else "Scikit-learn or TensorFlow/Keras"}
can be used depending on the project complexity. This stack is practical,
student-friendly, affordable, and suitable for developing a complete
full-stack academic project.
"""

    return result