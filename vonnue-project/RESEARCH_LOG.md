Research Log

 1) AI Prompts Used

- "Build an intelligent, user-driven Academic Course Decision Companion System using vanilla HTML, CSS, and JS. It should gather user constraints like budget, GPA, location, and preferred stream, and use a transparent algorithmic scoring engine (Multi-Criteria Decision Analysis) to filter and rank courses instead of a backend database or opaque AI." *(Used for initial app creation and core frontend structure)*

- "Write a JavaScript algorithm that takes an array of college objects and a user preference object, filters out colleges based on hard constraints (budget,stream,higher secondary percentage,higher secondary stream,area of interest,location and duration), and then scores the rest using a weighted sum model based on user importance sliders for cost, ranking, and outcomes." *(Used for the core MCDA engine)*

- "Create a Python script that generates a realistic JSON dataset of 100+ simulated engineering and medical colleges in India, specifically focusing on Kerala, including realistic NIRF rankings, tuition fees, placement rates, and lat/lng coordinates." *(Used for generating mock data)*

- "Enhance the overall visual appeal and user experience of the web application... including enhancing the existing blue and white theme with more modern design elements suchs as improved glassmorphism, typography, and responsive CSS grid layouts." *(Used for the initial UI overhaul)*

- "Replace the static CSS background with a dynamic, animated technical background that fits an academic/technology theme without being overwhelming or distracting." *(Used for background aesthetics)*

- "Update the UI to use a 'progressive disclosure' pattern. Don't show all the scoring details on the main result card. Instead, show a summary and add a 'View Details' button that opens a new view/modal with the full explanation logic." *(Used for UX refactoring)*

- "Implement persistent login sessions using localStorage. Create login and registration forms, validate email formats, and ensure the 'Sign Out' button is only visible when a user is actually logged in." *(Used for Authentication logic and session management)*

- "Add a 'Back' button to the login and registration forms on the authentication screen that returns to the landing page. Also, ensure the main navigation (home, explore) is hidden while the user is on the auth screens." *(Used to fix navigational edge cases during authentication)*

- "Update the explore page to include dynamic dropdown filters for State/Location and Course Category. The filters should automatically update the displayed college list without requiring a page reload." *(Used for the explore functionality)*

- "Ensure that the 'View Syllabus' button on the course details page redirects to a specific, relevant website containing the syllabus, rather than just doing a generic Google search." *(Used to attempt syllabus integration—eventually rolled back)*

2) Search Queries (Including Google Searches)

- "Major problems faced by high school graduates entering college in India"
- "How do students choose engineering colleges in Kerala?"
- "Lack of transparency in college consulting algorithms"
- "Open source college recommendation datasets India"
- "Multi-Criteria Decision Analysis (MCDA) vs Machine Learning for recommendation systems"
- "MCDA (Multi-Criteria Decision Analysis) algorithm implementation in JavaScript"
- "Vanilla JS SPA routing without frameworks"
- "Glassmorphism CSS examples and best practices"
- "How to hide navigation items conditionally based on authentication state in Vanilla JS"
- "Specific KTU syllabus PDF links direct access"
- "How to implement email regex validation in HTML5"
- "Python script to generate realistic Indian college JSON data"
- "Best practices for progressive disclosure in UX design"
- "Creating dynamic animated gradient backgrounds CSS"
- "How to reset form data and UI state when hiding an SPA screen in JS"

3) References That Influenced Approaches

- **Weights and Scoring Models:** Research into formal Multi-Criteria Decision Analysis (MCDA) influenced the two-stage logic (hard constraints filtering + weighted scoring) for the recommendation engine.
- **Glassmorphism UI:** Modern UI trends on platforms like Dribbble inspired the transition to a glassmorphic aesthetic with dynamic animated backgrounds, making the app feel more premium.
- **Progressive Disclosure UX:** Established UX patterns for handling complex datasets led to the decision to hide detailed scoring metrics behind a dedicated "Details" page, rather than cramming them onto the main result cards.

4) What Was Accepted, Rejected, or Modified from AI Outputs

- **Accepted:** The core logic for `localStorage` persistent session management and the foundational CSS structures for glassmorphism and animated backgrounds were accepted largely as generated.
- **Modified:** AI-suggested UI layout components were heavily modified to ensure proper spacing, consistent typography, proper mobile responsiveness, and alignment with the specific theme.
- **Rejected:** AI attempts to use generic Google Search query endpoints as a fallback for the "View Syllabus" links were ultimately rejected. The experience was poor, so the feature was pruned entirely until reliable direct data sources can be integrated.
