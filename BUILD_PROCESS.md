# Build Process

## How you started
We began by defining the core objective: building an Academic Course Decision Companion System centered around a **Client-Side Filtering and Scoring Engine**. To prioritize rapid prototyping, simplicity, and zero dependency overhead, we opted for a lightweight Vanilla HTML/CSS/JS architecture over complex frameworks. The initial focus was entirely on establishing the data models, input validation, and the core decision logic—specifically implementing a transparent two-step algorithm (Hard Constraints filtering followed by a Multi-Criteria Decision Analysis or MCDA) rather than relying on opaque AI models.

## How your thinking evolved
- **Data Scalability:** Initially, we worked with standard, small static datasets. We quickly realized we needed realistic data volume to truly test the engine. This led to the creation of modular Python scripts (`generate_courses.py`, `update_locations.py`) to programmatically scale our database of Indian colleges, with a focused generation for Kerala.
- **User Exploration:** The conceptual application evolved from a simple linear questionnaire (Wizard) to a more open-ended exploration tool. We realized users needed flexible ways to browse, leading to the enhancements of the "Explore Colleges" feature combining dynamic location and course category filters.
- **Emphasis on "Why":** Transparency became the primary selling point. We heavily prioritized generating readable, logical explanations for recommended courses so users could trust the algorithm's output.
- **Progressive Disclosure UI:** As the data grew richer, we realized showing everything on a single result card was overwhelming. This shifted our thinking towards progressive disclosure—navigating users from top-level matches to a dedicated, elaborated "Details" page.

## Alternative approaches considered
- **Backend API vs. Local Client-Side Engine:** We seriously considered building a Node.js/Database backend to serve the courses. We decided against it for the minimum viable product (MVP) to ensure zero hosting costs, immediate deployment, and lightning-fast instantaneous filtering directly in the user's browser memory.
- **Machine Learning vs. Weighted Sum Model (WSM):** We debated using AI/ML algorithms to generate recommendations based on patterns. However, we explicitly chose a mathematical WSM. A deterministic mathematical model ensures total transparency—we can easily trace and explain *why* a college scored 95% based on exactly what the user inputted.
- **React/Vue vs. Vanilla JS:** While React would have made state management simpler, Vanilla JS was chosen to keep the project completely lightweight and accessible for straightforward static hosting without a build step.

## Refactoring decisions
- **Data Pipeline Separation:** Instead of maintaining massive manual JSON structures in the project, we refactored our data generation out of the core application. We built Python scripts to handle dataset generation, data cleaning, and stream mapping, pushing the finalized `courses.js` payload to the web app.
- **SPA-Like Navigation:** The frontend logic was refactored into modular screens (Landing, Wizard, Results, Explore). We utilized JavaScript DOM manipulation to toggle visibility (`switchScreen()`), creating a Single Page Application (SPA) experience without needing an actual router.
- **Dedicated Detail Views:** We refactored the UI flow to extract heavy entity data (like deep college descriptions and specific placement metrics) out of the Results screen and into a newly created `details.html` scope.

## Mistakes and corrections
- **Opaque Early Scoring:** Early iterations of the decision engine produced percentage scores that confused users. We corrected this by deeply investigating the scoring output and explicitly attaching generated `explanation` strings to every match, ensuring the UI could justify the recommendation.
- **Rigid Filtering:** Initially, users could not easily cross-filter different aspects of the data. We corrected this by enhancing our filtering functions to apply multiple simultaneous constraints (e.g., matching a location *and* a specific course category).
- **Suboptimal Layout Flow:** Several UI layout issues, such as the initial placement of the "Back to Home" buttons, interrupted the user journey. We corrected these by jumping back into the CSS and layout structure to intuitively reposition core navigation elements.

## What changed during development and why
- **The Dataset Pipeline:** What started as a static code file became an automated pipeline. We had to introduce dataset generation tools (Python scripts) to successfully populate the app with the thousands of data points required for a realistic college selector.
- **Navigation Depth:** The project grew from a single-page list into a multi-layered application (Home -> Wizard -> Results -> Details). This change happened because top matches alone were insufficient for a final decision; users needed a dedicated view to inspect elaborated details of a selected college.
- **Version Control and Deployment readiness:** As the codebase grew across HTML, CSS, multiple JS files, and Python scripts, we formalized the code with proper Git commits and GitHub repository synchronization to ensure the code was safely tracked and ready to share.
