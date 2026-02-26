// Global State
let userPreferences = {
    budget: 99999999,
    gpa: 0,
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
        auth: document.getElementById('auth'),
        wizard: document.getElementById('wizard'),
        results: document.getElementById('results'),
        explore: document.getElementById('explore')
    };

    // Event Listeners for Navigation
    document.getElementById('start-btn').addEventListener('click', () => {
        switchScreen('auth');
    });

    // Auth Tabs Logic
    const tabLogin = document.getElementById('tab-login');
    const tabRegister = document.getElementById('tab-register');
    const formLogin = document.getElementById('form-login');
    const formRegister = document.getElementById('form-register');

    tabLogin.addEventListener('click', () => {
        tabLogin.style.borderBottom = '2px solid var(--primary-color)';
        tabLogin.style.color = 'var(--text-primary)';
        tabRegister.style.borderBottom = 'none';
        tabRegister.style.color = 'var(--text-secondary)';
        formLogin.style.display = 'block';
        formRegister.style.display = 'none';
    });

    tabRegister.addEventListener('click', () => {
        tabRegister.style.borderBottom = '2px solid var(--primary-color)';
        tabRegister.style.color = 'var(--text-primary)';
        tabLogin.style.borderBottom = 'none';
        tabLogin.style.color = 'var(--text-secondary)';
        formRegister.style.display = 'block';
        formLogin.style.display = 'none';
    });

    document.getElementById('link-create-account').addEventListener('click', (e) => {
        e.preventDefault();
        tabRegister.click();
    });

    document.getElementById('login-btn').addEventListener('click', () => {
        const email = document.getElementById('login-email').value.trim();
        const password = document.getElementById('login-password').value;
        const users = JSON.parse(localStorage.getItem('users')) || [];

        if (!email || !password) {
            alert('Please enter both email and password.');
            return;
        }

        const user = users.find(u => u.email === email);

        if (user) {
            if (user.password === password) {
                const name = user.name;
                document.getElementById('user-greeting').textContent = `Top Matches`;

                // Load saved preferences if available
                if (user.preferences) {
                    userPreferences = user.preferences;

                    // Pre-fill form inputs with loaded preferences
                    document.getElementById('max-budget').value = userPreferences.budget !== 99999999 ? userPreferences.budget : '';
                    document.getElementById('min-gpa').value = userPreferences.gpa !== 0 ? userPreferences.gpa : '';
                    document.getElementById('study-format').value = userPreferences.format;
                    document.getElementById('hs-stream').value = userPreferences.hsStream;
                    document.getElementById('pref-category').value = userPreferences.prefCategory;
                    document.getElementById('pref-location').value = userPreferences.prefLocation;
                    document.getElementById('pref-duration').value = userPreferences.prefDuration;

                    document.getElementById('pref-ranking').value = userPreferences.weights.ranking;
                    document.getElementById('pref-outcomes').value = userPreferences.weights.outcomes;
                    document.getElementById('pref-cost').value = userPreferences.weights.cost;

                    document.getElementById('val-ranking').textContent = userPreferences.weights.ranking;
                    document.getElementById('val-outcomes').textContent = userPreferences.weights.outcomes;
                    document.getElementById('val-cost').textContent = userPreferences.weights.cost;
                }

                const recommendedCourses = evaluateCourses();
                renderCourses(recommendedCourses);
                switchScreen('results');
            } else {
                alert('Incorrect password.');
            }
        } else {
            alert('Invalid email. Please try again or register.');
        }
    });

    document.getElementById('register-btn').addEventListener('click', () => {
        const name = document.getElementById('reg-name').value.trim();
        const email = document.getElementById('reg-email').value.trim();
        const password = document.getElementById('reg-password').value;

        if (!name || !email || !password) {
            alert('Please fill in all fields to register.');
            return;
        }

        const users = JSON.parse(localStorage.getItem('users')) || [];

        if (users.some(u => u.email === email)) {
            alert('An account with this email already exists. Please login instead.');
            return;
        }

        // Save with current default preferences
        const newUser = {
            name,
            email,
            password,
            preferences: JSON.parse(JSON.stringify(userPreferences))
        };
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        document.getElementById('user-greeting').textContent = `Top Matches`;

        switchScreen('wizard');
    });

    document.getElementById('explore-btn').addEventListener('click', () => {
        switchScreen('explore');
        const locationFilter = document.getElementById('explore-location').value;
        const categoryFilter = document.getElementById('explore-category').value;
        renderExploreColleges(locationFilter, categoryFilter); // Initial render
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            const target = e.target.getAttribute('data-target');
            if (target) {
                e.preventDefault();
                switchScreen(target);
            }
        });
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

        // Save updated preferences to the logged-in user if available (assuming email is known or matching the active session)
        // For a more robust approach, we need the active user's email.
        const currentEmail = document.getElementById('login-email').value.trim() || document.getElementById('reg-email').value.trim();
        if (currentEmail) {
            const users = JSON.parse(localStorage.getItem('users')) || [];
            const userIndex = users.findIndex(u => u.email === currentEmail);
            if (userIndex !== -1) {
                users[userIndex].preferences = JSON.parse(JSON.stringify(userPreferences));
                localStorage.setItem('users', JSON.stringify(users));
            }
        }

        // 3. Calculate Results
        const recommendedCourses = evaluateCourses();

        // 4. Render Results
        renderCourses(recommendedCourses);
        switchScreen('results');
    });

    // Handle initial routing from Details page
    const urlParams = new URLSearchParams(window.location.search);
    const section = urlParams.get('section');
    if (section && screens[section]) {
        switchScreen(section);
        window.history.replaceState({}, document.title, window.location.pathname);
    } else {
        switchScreen('landing');
    }
});

function switchScreen(screenId) {
    if (!screens) return;
    Object.values(screens).forEach(screen => {
        screen.classList.remove('active');
    });
    screens[screenId].classList.add('active');

    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (screenId === 'landing') {
            navbar.style.display = 'none';
        } else {
            navbar.style.display = 'flex';
        }
    }
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

    courses.forEach((course, index) => {
        const totalCost = course.tuition_fees + course.cost_of_living;
        // Color-coded match levels: Green -> Excellent, Yellow -> Moderate, Red -> Weak
        const color = course.matchPercentage >= 80 ? '#22c55e' : (course.matchPercentage >= 60 ? '#eab308' : '#ef4444');
        const isTopMatch = index < 3;

        const card = document.createElement('div');
        card.className = 'course-card' + (isTopMatch ? ' top-match' : '');
        card.style.cursor = 'pointer';
        card.onclick = () => window.location.href = `details.html?id=${course.id}`;

        let badgeContent = `
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            ${course.matchPercentage}% Match ${isTopMatch ? ' 🏆 Top Pick' : ''}
        `;

        card.innerHTML = `
            <div class="match-badge" style="color: ${color}; background: ${color}20;">
                ${badgeContent}
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
        card.style.cursor = 'pointer';
        card.onclick = () => window.location.href = `details.html?id=${course.id}`;
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
