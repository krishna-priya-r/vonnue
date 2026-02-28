 Build Process

1) How you started
I began by defining the core objective: building an Academic Course Decision Companion System centered around a Client-Side Filtering and Scoring Engine. To prioritize rapid prototyping, simplicity, and zero dependency overhead, I opted for a lightweight Vanilla HTML/CSS/JS architecture over complex frameworks. The initial focus was entirely on establishing the data models, input validation, and the core decision logic—specifically implementing a transparent two-step algorithm (Hard Constraints filtering followed by a Multi-Criteria Decision Analysis or MCDA) rather than relying on opaque AI models.

2) How your thinking evolved
- Data Scalability: Initially, I worked with standard, small static datasets. I quickly realized we needed realistic data volume to truly test the engine. This led to the creation of modular Python scripts to programmatically scale our database of Indian colleges, with a focused generation for Kerala.

- User Exploration: The conceptual application evolved from a simple linear questionnaire (Wizard) to a more open-ended exploration tool. I realized users needed flexible ways to browse, leading to the enhancements of the "Explore Colleges" feature combining dynamic location and course category filters.

- Emphasis on "Why": Transparency became the primary selling point. I heavily prioritized generating readable, logical explanations for recommended courses so users could trust the algorithm's output.

- Progressive Disclosure UI: As the data grew richer, I realized showing everything on a single result card was overwhelming. This shifted  my thinking towards progressive disclosure—navigating users from top-level matches to a dedicated, elaborated "Details" page.

3) Alternative approaches considered
(To be updated as the project evolves)

4) Refactoring decisions
(To be updated as the project evolves)

5) Mistakes and corrections
(To be updated as the project evolves)

6) What changed during development and why

(To be updated as the project evolves)
