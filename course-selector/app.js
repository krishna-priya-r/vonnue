// Global State
let userPreferences = {
    budget: null,
    gpa: null,
    format: 'Any',
    hsStream: 'Science',
    prefCategory: 'Any',
    prefLocation: 'Any',
    prefDuration: 'Any',
    weights: {
        ranking: 3,
        outcomes: 4,
        cost: 3
    }
};

let screens;

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    screens = {
        landing: document.getElementById('landing'),
        wizard: document.getElementById('wizard'),
        results: document.getElementById('results'),
        explore: document.getElementById('explore')
    };

    // Event Listeners for Navigation
    document.getElementById('start-btn').addEventListener('click', () => {
        switchScreen('wizard');
    });

    document.getElementById('explore-btn').addEventListener('click', () => {
        switchScreen('explore');
        const locationFilter = document.getElementById('explore-location').value;
        const categoryFilter = document.getElementById('explore-category').value;
        renderExploreColleges(locationFilter, categoryFilter); // Initial render
    });

    document.querySelectorAll('.back-home-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            switchScreen('landing');
        });
    });

    document.getElementById('explore-location').addEventListener('change', () => {
        const locationFilter = document.getElementById('explore-location').value;
        const categoryFilter = document.getElementById('explore-category').value;
        renderExploreColleges(locationFilter, categoryFilter);
    });

    document.getElementById('explore-category').addEventListener('change', () => {
        const locationFilter = document.getElementById('explore-location').value;
        const categoryFilter = document.getElementById('explore-category').value;
        renderExploreColleges(locationFilter, categoryFilter);
    });

    document.querySelectorAll('.next-btn, .prev-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const nextStep = e.target.getAttribute('data-next');
            const prevStep = e.target.getAttribute('data-prev');

            if (nextStep) {
                document.querySelectorAll('.wizard-step').forEach(el => el.classList.remove('active'));
                document.getElementById(`step-${nextStep}`).classList.add('active');
                document.getElementById('progress-fill').style.width = '100%';
            } else if (prevStep) {
                document.querySelectorAll('.wizard-step').forEach(el => el.classList.remove('active'));
                document.getElementById(`step-${prevStep}`).classList.add('active');
                document.getElementById('progress-fill').style.width = '50%';
            }
        });
    });

    // Syncing range sliders with span values
    document.querySelectorAll('input[type=range]').forEach(slider => {
        slider.addEventListener('input', (e) => {
            const valSpan = document.getElementById(`val-${e.target.id.split('-')[1]}`);
            if (valSpan) valSpan.textContent = e.target.value;
        });
    });

    document.getElementById('restart-btn').addEventListener('click', () => {
        switchScreen('wizard');
    });

    // Logic: Process user inputs and navigate to results
    document.getElementById('find-courses-btn').addEventListener('click', () => {
        // 1. Gather constraints
        const maxBudgetInput = document.getElementById('max-budget').value;
        const minGpaInput = document.getElementById('min-gpa').value;
        const formatInput = document.getElementById('study-format').value;
        const hsStreamInput = document.getElementById('hs-stream').value;
        const prefCategoryInput = document.getElementById('pref-category').value;
        const prefLocationInput = document.getElementById('pref-location').value;
        const prefDurationInput = document.getElementById('pref-duration').value;

        userPreferences.budget = maxBudgetInput ? parseFloat(maxBudgetInput) : 99999999;
        userPreferences.gpa = minGpaInput ? parseFloat(minGpaInput) : 0;
        userPreferences.format = formatInput;
        userPreferences.hsStream = hsStreamInput;
        userPreferences.prefCategory = prefCategoryInput;
        userPreferences.prefLocation = prefLocationInput;
        userPreferences.prefDuration = prefDurationInput;

        // 2. Gather preferences
        userPreferences.weights.ranking = parseInt(document.getElementById('pref-ranking').value);
        userPreferences.weights.outcomes = parseInt(document.getElementById('pref-outcomes').value);
        userPreferences.weights.cost = parseInt(document.getElementById('pref-cost').value);

        // 3. Calculate Results
        const recommendedCourses = evaluateCourses();

        // 4. Render Results
        renderCourses(recommendedCourses);
        switchScreen('results');
    });
});

function switchScreen(screenId) {
    if (!screens) return;
    Object.values(screens).forEach(screen => {
        screen.classList.remove('active');
    });
    screens[screenId].classList.add('active');
}


// Decision Engine
function evaluateCourses() {
    const filtered = coursesData.filter(course => {
        const totalCost = course.tuition_fees + course.cost_of_living;

        // Hard Constraint Checks
        if (totalCost > userPreferences.budget) return false;
        if (userPreferences.gpa < course.min_hs_percentage) return false;
        if (userPreferences.format !== 'Any' && course.format !== userPreferences.format) return false;
        if (!course.allowed_hs_streams.includes(userPreferences.hsStream)) return false;
        if (userPreferences.prefCategory !== 'Any' && course.category !== userPreferences.prefCategory) return false;
        if (userPreferences.prefLocation !== 'Any' && course.location !== userPreferences.prefLocation) return false;

        if (userPreferences.prefDuration === 'Short' && course.duration_months > 24) return false;
        if (userPreferences.prefDuration === 'Long' && course.duration_months <= 24) return false;

        return true;
    });

    // MCDA Scoring
    const scoredCourses = filtered.map(course => {
        // Data Normalization (Simple min-max approximation based on known bounds)
        // Ranking: lower is better (cap 400)
        let rankScore = Math.max(0, 100 - (course.ranking / 400 * 100));
        // Outcomes: Employability (0-100) + Salary factor (Max scaling around 20 LPA)
        let outcomeScore = (course.employability_rate * 0.6) + (Math.min(100, course.avg_starting_salary / 20000) * 0.4);
        // Cost: lower is better (cap 50 Lakhs)
        let totalCost = course.tuition_fees + course.cost_of_living;
        let costScore = Math.max(0, 100 - (totalCost / 5000000 * 100));

        // Applying weights
        const totalWeight = userPreferences.weights.ranking + userPreferences.weights.outcomes + userPreferences.weights.cost;
        let matchPercentage = (
            (rankScore * userPreferences.weights.ranking) +
            (outcomeScore * userPreferences.weights.outcomes) +
            (costScore * userPreferences.weights.cost)
        ) / totalWeight;

        return {
            ...course,
            matchPercentage: Math.round(matchPercentage),
            explanation: {
                costFit: totalCost <= userPreferences.budget ? `Fits budget (₹${totalCost.toLocaleString('en-IN')})` : '',
                academicFit: userPreferences.gpa >= course.min_hs_percentage ? `Meets academic requirement (${course.min_hs_percentage}%)` : '',
                streamFit: userPreferences.prefCategory !== 'Any' ? `Matches preferred category: ${course.category}` : `Eligible with ${userPreferences.hsStream} background`,
                locationFit: userPreferences.prefLocation !== 'Any' ? `Located in preferred region (${course.location})` : '',
                durationFit: userPreferences.prefDuration !== 'Any' ? `Matches preferred duration (${course.duration_months} Months)` : '',
                outcomeStrength: course.employability_rate > 90 ? `High employability (${course.employability_rate}%)` : `Good outcomes (${course.employability_rate}%)`,
                rankingStrength: course.ranking < 50 ? `Top 50 NIRF ranking (#${course.ranking})` : `Ranked #${course.ranking} NIRF`
            }
        };
    });

    // Sort by Match Percentage Descending
    return scoredCourses.sort((a, b) => b.matchPercentage - a.matchPercentage);
}

// Rendering Logic
function renderCourses(courses) {
    const grid = document.getElementById('courses-grid');
    grid.innerHTML = '';

    if (courses.length === 0) {
        grid.innerHTML = `
            <div class="glass-panel" style="grid-column: 1 / -1; text-align: center;">
                <h3>No perfect matches found.</h3>
                <p>Try adjusting your constraints, like increasing your budget or changing the study format.</p>
            </div>
        `;
        return;
    }

    courses.forEach(course => {
        const totalCost = course.tuition_fees + course.cost_of_living;
        const color = course.matchPercentage >= 80 ? '#58a6ff' : (course.matchPercentage >= 60 ? '#f0883e' : '#8b949e');

        const card = document.createElement('div');
        card.className = 'course-card';
        card.innerHTML = `
            <div class="match-badge" style="color: ${color}; background: ${color}20;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                ${course.matchPercentage}% Match
            </div>
            <h3>${course.name}</h3>
            <h4>${course.university} • ${course.country}</h4>
            
            <div class="course-tags">
                <span class="tag">⏱️ ${course.duration_months} Months</span>
                <span class="tag">📍 ${course.location}</span>
                <span class="tag">💰 ₹${totalCost.toLocaleString('en-IN')}</span>
            </div>
            
            <div class="explanation">
                <strong>Why this course?</strong>
                <ul>
                    <li>${course.explanation.costFit}</li>
                    <li>${course.explanation.academicFit}</li>
                    <li>${course.explanation.streamFit}</li>
                    ${course.explanation.locationFit ? `<li>${course.explanation.locationFit}</li>` : ''}
                    ${course.explanation.durationFit ? `<li>${course.explanation.durationFit}</li>` : ''}
                    <li>${course.explanation.outcomeStrength}</li>
                    <li>${course.explanation.rankingStrength}</li>
                </ul>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Initialization logic is no longer needed since data is sync

// --- Explore Logic ---
// --- Explore Logic ---
function renderExploreColleges(locationFilter = 'Any', categoryFilter = 'Any') {
    let filteredCourses = coursesData;

    // Filter by location
    if (locationFilter !== 'Any') {
        filteredCourses = filteredCourses.filter(c => c.location === locationFilter);
    }

    // Filter by category
    if (categoryFilter !== 'Any') {
        filteredCourses = filteredCourses.filter(c => c.category === categoryFilter);
    }

    // Sort by NIRF ranking (Ascending: 1 is best)
    filteredCourses.sort((a, b) => a.ranking - b.ranking);

    const grid = document.getElementById('explore-grid');
    grid.innerHTML = '';

    if (filteredCourses.length === 0) {
        grid.innerHTML = `
            <div class="glass-panel" style="grid-column: 1 / -1; text-align: center;">
                <h3>No colleges found in this state.</h3>
                <p>Try selecting a different location.</p>
            </div>
        `;
        return;
    }

    filteredCourses.forEach(course => {
        const totalCost = course.tuition_fees + course.cost_of_living;

        const card = document.createElement('div');
        card.className = 'course-card';
        card.innerHTML = `
            <h3>${course.name}</h3>
            <h4>${course.university} • ${course.country}</h4>
            
            <div class="course-tags" style="margin-top: 1rem;">
                <span class="tag">🏆 Rank #${course.ranking}</span>
                <span class="tag">📊 Employability: ${course.employability_rate}%</span>
            </div>
            
            <div class="course-tags">
                <span class="tag">⏱️ ${course.duration_months} Months</span>
                <span class="tag">📍 ${course.location}</span>
                <span class="tag">💰 ₹${totalCost.toLocaleString('en-IN')}</span>
            </div>
        `;
        grid.appendChild(card);
    });
}
