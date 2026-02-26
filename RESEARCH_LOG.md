# Research Log

## 1) AI Prompts Used

Throughout the development of the Academic Course Decision Companion System, the following key prompts were used to guide the AI assistant:

- **Initial Architecture & Logic:** "Develop a comprehensive Academic Course Decision Companion System. Implement this system in a modular fashion, starting with data models and progressing through core engine logic, input validation, explanation generation, and a user-friendly CLI interface. Ensure it is transparent, explainable, and input-driven, avoiding complex AI dependencies for core decision-making."
- **Data Scaling:** "Populate the course selection application with a comprehensive dataset of Indian colleges. Generate and integrate a large number of college and course entries, with a specific focus on Kerala, to ensure a wide range of options for filtering."
- **Feature Enhancements (Explore):** "Enhance the 'Explore Colleges' feature by adding a course category filter. This should allow filtering colleges by both location and course category simultaneously."
- **UI & Navigation:** "Reposition the 'Back to Home' button to the top right corner of the document."
- **Progressive Disclosure:** "Navigate to a new page that displays elaborated details when top matches appear. Handle the display of search results and provide a way to access more information about each match."
- **Algorithm Investigation:** "Explain the decision algorithm being used in the current context."

## 2) Search Queries (Including Google Searches)

- "Vanilla JS SPA routing without framework"
- "Weighted Sum Model MCDA logic in JavaScript"
- "How to normalize parameters for Multi-Criteria Decision Analysis"
- "Python script to generate mock JSON data for colleges in Kerala"
- "CSS absolute positioning top right corner responsive"
- "Passing complex JSON data between HTML pages using URL parameters or LocalStorage"

## 3) References That Influenced Approaches

- **Multi-Criteria Decision Analysis (MCDA):** Researched Standard WSM (Weighted Sum Model) logic to ensure the scoring engine was mathematically sound and purely deterministic.
- **Vanilla JavaScript SPA Patterns:** Referenced MDN Web Docs for building Single Page Application flows using DOM manipulation (`display: none` / `display: block`) instead of heavy routers.
- **Progressive Disclosure UI Patterns:** Influenced by standard UX best practices for handling complex data—showing top-level summaries first, and providing a gateway to drilled-down specific details (the `details.html` approach).

## 4) What Was Accepted, Rejected, or Modified from AI Outputs

- **Accepted:** The core logic structure for the MCDA scoring engine provided by the AI was accepted, as it perfectly aligned with the need for a transparent, mathematics-based filtering system rather than a black-box AI model.
- **Accepted:** Python scripts for scaling data (`generate_courses.py` and `update_locations.py`) were largely accepted as they saved immense time in building a realistic database.
- **Rejected:** Any suggestions to use complex frontend frameworks (like React or Vue) or backend databases were rejected to stick to the MVP constraints of a zero-dependency, static Vanilla JS architecture.
- **Modified:** AI-generated UI layouts and component placements (like the "Back to Home" button) were manually modified and tweaked locally to better fit the evolving design and user flow requirements.
- **Modified:** The output `matchPercentage` calculations were modified by attaching explicit `explanation` strings to ensure the user understood exactly *why* a college scored highly, correcting early issues with opaque scoring.
