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
        login: document.getElementById('login'),
        register: document.getElementById('register'),
        wizard: document.getElementById('wizard'),
        results: document.getElementById('results'),
        explore: document.getElementById('explore')
    };

    updateAuthUI();

    // Event Listeners for Navigation
    document.getElementById('start-btn').addEventListener('click', () => {
        switchScreen('login');
    });

    document.getElementById('login-back-btn').addEventListener('click', () => {
        switchScreen('landing');
    });

    document.getElementById('register-back-btn').addEventListener('click', () => {
        switchScreen('landing');
    });

    document.getElementById('link-create-account').addEventListener('click', (e) => {
        e.preventDefault();
        switchScreen('register');
    });

    document.getElementById('link-login-account').addEventListener('click', (e) => {
        e.preventDefault();
        switchScreen('login');
    });

    const validateEmailFormat = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const handleEmailInput = (e) => {
        const val = e.target.value.trim();
        if (val !== '' && !validateEmailFormat(val)) {
            e.target.style.borderColor = '#ef4444';
            e.target.style.outlineColor = '#ef4444';
        } else {
            e.target.style.borderColor = '';
            e.target.style.outlineColor = '';
        }
    };

    document.getElementById('login-email').addEventListener('input', handleEmailInput);
    document.getElementById('reg-email').addEventListener('input', handleEmailInput);

    document.getElementById('login-btn').addEventListener('click', () => {
        try {
            const email = document.getElementById('login-email').value.trim();
            const password = document.getElementById('login-password').value;
            const users = JSON.parse(localStorage.getItem('users')) || [];

            if (!email || !password) {
                alert('Please enter both email and password.');
                return;
            }

            if (!validateEmailFormat(email)) {
                alert('Please enter a valid email address.');
                return;
            }

            const user = users.find(u => u.email === email);

            if (user) {
                if (user.password === password) {
                    sessionStorage.setItem('currentUser', email);
                    updateAuthUI();
                    const name = user.name;
                    document.getElementById('user-greeting').textContent = `Top Matches`;

                    // Load saved preferences if available
                    if (user.preferences) {
                        userPreferences = {
                            ...userPreferences,
                            ...user.preferences,
                            weights: {
                                ...userPreferences.weights,
                                ...(user.preferences.weights || {})
                            }
                        };

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
        } catch (err) {
            console.error(err);
            alert('An unexpected error occurred during login: ' + err.message + '\n' + err.stack);
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

        if (!validateEmailFormat(email)) {
            alert('Please enter a valid email address.');
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

        sessionStorage.setItem('currentUser', email);
        updateAuthUI();
        document.getElementById('user-greeting').textContent = `Top Matches`;

        switchScreen('wizard');
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            const target = e.target.getAttribute('data-target');
            if (target) {
                e.preventDefault();

                if (target === 'results') {
                    // Prevent empty results if they haven't run the wizard yet this session
                    const recommendedCourses = evaluateCourses();
                    renderCourses(recommendedCourses);
                }

                switchScreen(target);

                if (target === 'explore') {
                    const categoryFilter = document.getElementById('explore-category').value;
                    renderExploreCourses(categoryFilter);
                }
            }
        });
    });

    document.querySelectorAll('.back-home-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            switchScreen('landing');
        });
    });

    document.getElementById('explore-category').addEventListener('change', () => {
        const categoryFilter = document.getElementById('explore-category').value;
        renderExploreCourses(categoryFilter);
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

    document.getElementById('signout-btn').addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('login-email').value = '';
        document.getElementById('login-password').value = '';
        sessionStorage.removeItem('currentUser');
        updateAuthUI();
        switchScreen('landing');
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
        const currentEmail = sessionStorage.getItem('currentUser') || document.getElementById('login-email').value.trim() || document.getElementById('reg-email').value.trim();
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
        if (section === 'explore') {
            const categoryFilter = document.getElementById('explore-category').value;
            renderExploreCourses(categoryFilter);
        }
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

    // Make sure the URL tracks the current section so the browser Back button works correctly
    if (window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/')) {
        const newUrl = new URL(window.location);
        newUrl.searchParams.set('section', screenId);
        window.history.replaceState({ section: screenId }, '', newUrl);
    }

    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (screenId === 'landing' || screenId === 'login' || screenId === 'register') {
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

    // Grouping by course name
    const groupedCourses = {};
    courses.forEach(course => {
        if (!groupedCourses[course.name]) {
            groupedCourses[course.name] = {
                name: course.name,
                bestMatchPercentage: course.matchPercentage,
                duration: course.duration_months,
                category: course.category,
                colleges: []
            };
        }
        groupedCourses[course.name].colleges.push(course);
    });

    sessionStorage.setItem('currentCourseMatches', JSON.stringify(groupedCourses));

    Object.values(groupedCourses).forEach((courseGroup, index) => {
        const isTopMatch = index < 3;
        const color = courseGroup.bestMatchPercentage >= 80 ? '#22c55e' : (courseGroup.bestMatchPercentage >= 60 ? '#3b82f6' : '#ef4444');

        const card = document.createElement('div');
        card.className = 'course-card' + (isTopMatch ? ' top-match' : '');

        let badgeContent = `
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            Up to ${courseGroup.bestMatchPercentage}% Match ${isTopMatch ? ' 🏆 Top Pick' : ''}
        `;

        const containerId = 'colleges-' + courseGroup.name.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-]/g, '');

        card.innerHTML = `
            <div class="match-badge" style="color: ${color}; background: ${color}20;">
                ${badgeContent}
            </div>
            <h3>${courseGroup.name}</h3>
            <h4>Category: ${courseGroup.category}</h4>
            
            <div class="course-tags">
                <span class="tag">⏱️ ${courseGroup.duration} Months</span>
                <span class="tag">🎓 ${courseGroup.colleges.length} Colleges Match</span>
            </div>
            
            <div style="margin-top: auto;">
                <button class="primary-btn" style="width: 100%; padding: 10px; border-radius: 8px;" onclick="window.location.href='details.html?course=${encodeURIComponent(courseGroup.name)}'">Details</button>
            </div>
        `;

        grid.appendChild(card);
    });
}

// Global toggle function
window.toggleColleges = function (containerId, btnElement) {
    const container = document.getElementById(containerId);
    if (container.style.display === 'none' || container.style.display === '') {
        container.style.display = 'flex';
        btnElement.textContent = 'Hide Colleges';
    } else {
        container.style.display = 'none';
        btnElement.textContent = 'Show Colleges';
    }
}

// Initialization logic is no longer needed since data is sync

// --- Explore Logic ---
// --- Explore Logic ---
function renderExploreCourses(categoryFilter = 'Any') {
    let filteredCourses = coursesData;

    if (categoryFilter !== 'Any') {
        filteredCourses = filteredCourses.filter(c => c.category === categoryFilter);
    }

    const grid = document.getElementById('explore-grid');
    grid.innerHTML = '';

    if (filteredCourses.length === 0) {
        grid.innerHTML = `
            <div class="glass-panel" style="grid-column: 1 / -1; text-align: center;">
                <h3>No courses found for this category.</h3>
                <p>Try clearing your filters.</p>
            </div>
        `;
        return;
    }

    filteredCourses.forEach(course => {
        const card = document.createElement('div');
        card.className = 'course-card';
        card.innerHTML = `
            <h3>${course.name}</h3>
            <h4 style="color: var(--text-secondary); margin-bottom: 0.5rem; font-size: 0.95rem;">${course.university}</h4>
            <div style="margin-bottom: 1rem;">
                <span class="badge" style="background: rgba(59, 130, 246, 0.2); color: #60a5fa; padding: 4px 8px; border-radius: 4px; font-size: 0.8rem;">${course.category}</span>
            </div>
            
            <div class="course-tags" style="margin-top: auto; margin-bottom: 1rem; flex-wrap: wrap;">
                <span class="tag">📍 ${course.location}</span>
                <span class="tag">⏱️ ${course.duration_months} Months</span>
                <span class="tag">📖 ${course.format}</span>
                <span class="tag">💰 ₹${course.tuition_fees.toLocaleString('en-IN')}</span>
            </div>
            
            <div style="margin-top: 1rem;">
                <button class="primary-btn" style="width: 100%; padding: 10px; border-radius: 8px;" onclick="window.location.href='details.html?id=${course.id}'">View College Details</button>
            </div>
        `;
        grid.appendChild(card);
    });
}
