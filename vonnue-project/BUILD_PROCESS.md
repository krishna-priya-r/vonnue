 Build Process

1) How you started
I began by defining the core objective: building an Academic Course Decision Companion System centered around a Client-Side Filtering and Scoring Engine. To prioritize rapid prototyping, simplicity, and zero dependency overhead, I opted for a lightweight Vanilla HTML/CSS/JS architecture over complex frameworks. The initial focus was entirely on establishing the data models, input validation, and the core decision logic—specifically implementing a transparent two-step algorithm (Hard Constraints filtering followed by a Multi-Criteria Decision Analysis or MCDA) rather than relying on opaque AI models.

2) How your thinking evolved
- Data Scalability: Initially, I worked with standard, small static datasets. I quickly realized we needed realistic data volume to truly test the engine. This led to the creation of modular Python scripts to programmatically scale our database of Indian colleges, with a focused generation for Kerala.

- User Exploration: The conceptual application evolved from a simple linear questionnaire (Wizard) to a more open-ended exploration tool. I realized users needed flexible ways to browse, leading to the enhancements of the "Explore Colleges" feature combining dynamic location and course category filters.

- Emphasis on "Why": Transparency became the primary selling point. I heavily prioritized generating readable, logical explanations for recommended courses so users could trust the algorithm's output.

- Progressive Disclosure UI: As the data grew richer, I realized showing everything on a single result card was overwhelming. This shifted  my thinking towards progressive disclosure—navigating users from top-level matches to a dedicated, elaborated "Details" page.

3) Alternative approaches considered
- Framework vs. Vanilla: Initially considered using modern heavyweight frameworks (like React or Next.js) but chose Vanilla HTML/CSS/JS to prioritize zero-dependency simplicity and rapid prototyping.
- AI vs. Rule-based Engine: Explored using opaque AI models for course recommendations, but ultimately selected a transparent Multi-Criteria Decision Analysis (MCDA) algorithm. This ensures users understand exactly why a course was recommended.
- Syllabus Linking: Considered using generic Google Search queries for course syllabi, but found it provided a poor user experience compared to direct, reliable links (or no link at all when reliable sources aren't available).

4) Refactoring decisions
- UI/UX Overhaul: Transitioned from a basic interface to a modern, premium "glassmorphic" theme with dynamic technical backgrounds, improved typography, and micro-animations to significantly boost visual appeal and user engagement.
- Session Management: Refactored the authentication flow to use persistent local storage sessions, ensuring users remain logged in and elements like the "Sign Out" button only appear contextually.
- Navigation Improvements: Refactored authentication views to include "Back" buttons and actively hide main application features (like "Explore" or "Home") on the login/register pages to prevent navigational confusion.
- Data Generation: Shifted from hand-coded JSON datasets to automated, modular Python scripts to generate realistic, scalable college and course data for realistic testing.

5) Mistakes and corrections
- Broken Syllabus Links: Providing generic or broken PDF links for the "View Syllabus" feature damaged credibility. Correction: Removed the "View Syllabus" button entirely until highly specific, reliable sources (like KTU notes) can be perfectly integrated.
- Overwhelming Information Density: Initially tried to cram all decision analysis data onto a single result card. Correction: Adopted a "progressive disclosure" UI, forcing users to click through to a dedicated "Details" page.
- Generic Aesthetics: Early moving backgrounds were distracting and generic. Correction: Replaced them with specialized, technical background animations that align with the academic nature of the app.
- Missing Input Constraints: Authentication initially lacked basic constraints. Correction: Implemented email format validation and explicit navigation limits directly on the login forms.

6) What changed during development and why
- Shift towards Premium Aesthetics: The application shifted heavily towards modern design practices (glassmorphism, tailored color palettes) because a visually striking interface builds user trust more quickly than a utilitarian one.
- Tighter Authentication Controls: Development focused more heavily on session persistence and view restriction (e.g., hiding global navigation during login) because early testing showed users could get lost or bypass intended flows.
- Feature Pruning for Quality: Features that couldn't be delivered with high fidelity (like generic syllabus links) were actively removed during development. The "why" is strict quality control: it's better to have fewer, flawlessly working features than many incomplete ones.
