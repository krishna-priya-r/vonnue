 Academic Course Decision Companion



## Your understanding of the problem

The objective is to build an intelligent, user-driven Academic Course Decision Companion System. The system needs to go beyond simple keyword matching and help prospective students navigate the overwhelming number of college and course options in India. It must act transparently as an "advisor," gathering user constraints (like budget, GPA, location, and preferred stream) and subjective preferences (how much they care about ranking vs. cost vs. outcomes), to score, filter, and recommend the best academic paths based on their specific situation.

## Assumptions made

- **Data Availability & Integrity:** We assume that the dataset (`courses.js` / `courses.json`) contains relatively standard, clean data with unified formats for tuition fees, duration, placement rates, and NIRF rankings.
- **User Inputs:** We assume users have a basic understanding of their constraints, such as their maximum budget (including living costs), minimum expected outcomes, and personal weighting between cost, ranking, and employability.
- **Client-Side Processing:** The application assumes the dataset of colleges is small enough to be loaded and processed efficiently entirely on the client-side (browser), avoiding the need for backend APIs or databases.

## Why you structured the solution the way you did

The application follows a standard, lightweight **HTML/CSS/Vanilla JS** architecture.
- **No Build Tools:** A Vanilla JS setup (without complex frameworks like React/Angular) was chosen for simplicity, ease of setup, and zero dependency overhead, making it straightforward to run and deploy.
- **Modular Frontend:** The UI is structured into different logically separated "screens" (Landing, Wizard, Results, Explore) that are toggled on and off via JavaScript (`switchScreen`), creating a Single Page Application (SPA)-like experience without needing a frontend router.
- **In-Memory Data Engine:** The decision engine and college data reside directly in the browser's memory for instantaneous filtering, scoring, and UI updates.

## Design decisions and trade-offs

- **Algorithm Choice (Hard Constraints + MCDA WSM):** I chose a two-step algorithm. First, hard constraints (Budget, GPA, Streams, etc.) are used to completely filter out ineligible options. Second, a Multiple-Criteria Decision Analysis (MCDA) using a Weighted Sum Model scores the remaining options based on user-defined weights (Ranking, Outcomes, Cost).
  - *Trade-off:* While this algorithm is highly transparent and explainable (unlike Blackbox AI models), it requires careful tuning of the normalization functions (e.g., capping maximum acceptable costs or ranks) to ensure the scores are proportional and meaningful.
- **Client-Side Filtering:** All filtering happens in JS.
  - *Trade-off:* Provides excellent performance and zero backend costs, but the dataset size is strictly limited to what can be reasonably transferred over the network and stored in the user's browser memory (a few megabytes).
- **Explainability First:** The system explicitly attaches an `explanation` object to each recommended course during the scoring phase, allowing the UI to display exactly *why* a course was recommended ("Fits budget", "High employability", etc.), focusing on transparency.

## Edge cases considered

- **Empty Result Sets:** Users might input overly restrictive constraints (e.g., a very low budget combined with a demand for top 5 ranked colleges). This is handled via a gracefully degrading fallback UI state (`"No perfect matches found. Try adjusting your constraints..."`).
- **Missing or Extreme Data:** The scoring mathematical models cap edge values to ensure an extreme data point (like missing salary or very poor rank) doesn't produce `NaN` or completely skew the percentage score.
- **Filter Resetting/Changes:** Addressed by recalculating the entire result array dynamically every time the user reaches the "Results" screen or changes dropdowns in the "Explore" screen to prevent stale data.

## How to run the project

1. Clone or download the repository to your local machine.
2. Navigate to the `course-selector` directory.
3. Because this is a static Vanilla JS project, you can simply open the `index.html` file in any modern web browser to view and interact with the application.
4. *(Optional)* For a better development experience, run a local development server to serve the files (e.g., using VS Code Live Server extension, or Python's `python -m http.server`).

## What you would improve with more time

(To be updated as the project evolves)
