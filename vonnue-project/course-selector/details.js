document.addEventListener('DOMContentLoaded', () => {
    updateAuthUI();

    const currentUser = sessionStorage.getItem('currentUser');
    const signoutBtn = document.getElementById('signout-btn');
    if (signoutBtn) {
        signoutBtn.style.display = currentUser ? '' : 'none';
        signoutBtn.addEventListener('click', () => {
            sessionStorage.removeItem('currentUser');
        });
    }

    const urlParams = new URLSearchParams(window.location.search);
    const courseName = urlParams.get('course');
    const collegeId = urlParams.get('id'); // Fallback if still using college-specific view from other places
    const container = document.getElementById('details-container');

    if (collegeId) {
        // Render single college details as before
        const course = coursesData.find(c => c.id === collegeId);
        if (!course) {
            container.innerHTML = `<h3>College course not found.</h3>`;
            return;
        }

        const pageTitle = document.getElementById('page-title');
        if (pageTitle) {
            pageTitle.textContent = 'College Details';
        }

        renderSingleCollege(course, container);
    } else if (courseName) {
        // Render course group logic
        const groupedData = JSON.parse(sessionStorage.getItem('currentCourseMatches') || '{}');
        let courseGroup = groupedData[courseName];

        // If not in session storage (e.g., direct navigation from Explore), fallback to extracting from coursesData
        if (!courseGroup) {
            const matches = coursesData.filter(c => c.name === courseName);
            if (matches.length > 0) {
                courseGroup = {
                    name: courseName,
                    category: matches[0].category,
                    duration: matches[0].duration_months,
                    colleges: matches
                };
            }
        }

        if (!courseGroup) {
            container.innerHTML = `<h3>Course details not found.</h3>`;
            return;
        }
        renderCourseDetails(courseGroup, container);
    } else {
        container.innerHTML = `<h3>No course selected.</h3>`;
    }
});

function getSubjectsForCategory(category) {
    switch (category) {
        case 'Medical': return ['Anatomy', 'Physiology', 'Biochemistry', 'Clinical Practice', 'Pharmacology'];
        case 'Engineering': return ['Mathematics', 'Physics', 'Programming', 'Core Engineering Principles', 'Project Management'];
        case 'Business': return ['Accounting', 'Management', 'Economics', 'Marketing', 'Business Law', 'Organizational Behavior'];
        case 'Science': return ['Advanced Mathematics', 'Research Methods', 'Core Scientific Principles', 'Data Analysis', 'Laboratory Techniques'];
        case 'Arts': return ['Sociology', 'Humanities', 'Literature', 'Communication', 'Critical Thinking'];
        default: return ['Core Subjects', 'Electives', 'Research Project', 'Practical Seminars'];
    }
}

function renderCourseDetails(courseGroup, container) {
    const subjects = getSubjectsForCategory(courseGroup.category);

    // Sort colleges by match percentage if available, otherwise by ranking
    const sortedColleges = [...courseGroup.colleges].sort((a, b) => {
        if (a.matchPercentage && b.matchPercentage) return b.matchPercentage - a.matchPercentage;
        return a.ranking - b.ranking;
    });

    // Define districts for Kerala (as the dataset primarily uses Kerala locations for physical colleges)
    const keralaDistricts = [
        "Thiruvananthapuram", "Kollam", "Pathanamthitta", "Alappuzha", "Kottayam",
        "Idukki", "Ernakulam", "Thrissur", "Palakkad", "Malappuram", "Kozhikode",
        "Wayanad", "Kannur", "Kasaragod"
    ];

    // Check if we need "Online" as a location option based on matches
    const hasOnline = sortedColleges.some(c => c.location === "Online");

    // Aggregate stats
    const totalTuition = sortedColleges.reduce((sum, c) => sum + c.tuition_fees, 0);
    const avgTuition = Math.round(totalTuition / sortedColleges.length);

    const totalSalary = sortedColleges.reduce((sum, c) => sum + c.avg_starting_salary, 0);
    const avgSalary = Math.round(totalSalary / sortedColleges.length);

    const totalEmployability = sortedColleges.reduce((sum, c) => sum + c.employability_rate, 0);
    const avgEmployability = Math.round(totalEmployability / sortedColleges.length);

    const uniqueFormats = [...new Set(sortedColleges.map(c => c.format))].join(', ');



    container.innerHTML = `
        <h1 style="color: var(--accent-color); margin-bottom: 0.5rem; font-size: 2.5rem; text-align: center;">${courseGroup.name}</h1>
        <h3 style="color: var(--text-secondary); margin-bottom: 2.5rem; font-size: 1.2rem; text-align: center;">Category: ${courseGroup.category}</h3>
        
        <div style="display: grid; grid-template-columns: 1fr; gap: 2rem; margin-bottom: 3rem;">
            <!-- Course Details Card -->
            <div style="background: rgba(15, 23, 42, 0.4); padding: 2rem; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.1);">
                <h4 style="margin-bottom: 1.5rem; color: #60a5fa; font-size: 1.3rem; border-bottom: 1px solid rgba(59, 130, 246, 0.3); padding-bottom: 0.5rem;">Course Overview</h4>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 2rem;">
                    <div>
                        <p style="color: var(--text-secondary); margin-bottom: 0.3rem;">Standard Duration</p>
                        <p style="font-size: 1.5rem; font-weight: 600;">${courseGroup.duration} Months</p>
                    </div>
                    <div>
                        <p style="color: var(--text-secondary); margin-bottom: 0.3rem;">Total Matches Found</p>
                        <p style="font-size: 1.5rem; font-weight: 600;" id="colleges-count">${courseGroup.colleges.length} Colleges</p>
                    </div>
                    <div>
                        <p style="color: var(--text-secondary); margin-bottom: 0.3rem;">Study Formats</p>
                        <p style="font-size: 1.5rem; font-weight: 600;">${uniqueFormats}</p>
                    </div>
                    <div>
                        <p style="color: var(--text-secondary); margin-bottom: 0.3rem;">Avg Tuition Fees</p>
                        <p style="font-size: 1.5rem; font-weight: 600;">₹${avgTuition.toLocaleString('en-IN')}</p>
                    </div>
                    <div>
                        <p style="color: var(--text-secondary); margin-bottom: 0.3rem;">Avg Starting Salary</p>
                        <p style="font-size: 1.5rem; font-weight: 600;">₹${avgSalary.toLocaleString('en-IN')}</p>
                    </div>
                    <div>
                        <p style="color: var(--text-secondary); margin-bottom: 0.3rem;">Avg Employability</p>
                        <p style="font-size: 1.5rem; font-weight: 600;">${avgEmployability}%</p>
                    </div>
                </div>

                <div style="margin-top: 2rem;">
                    <h5 style="color: var(--text-primary); margin-bottom: 1rem; font-size: 1.1rem;">Subjects Involved</h5>
                    <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                        ${subjects.map(s => `<span class="tag" style="background: rgba(59, 130, 246, 0.1); color: #60a5fa; border: 1px solid rgba(59, 130, 246, 0.3); padding: 0.4rem 0.8rem;">${s}</span>`).join('')}
                    </div>
                </div>
            </div>
        </div>

        <div id="show-colleges-btn-container" style="text-align: center; margin-bottom: 2rem; margin-top: 2rem;">
            <button id="show-colleges-btn" class="primary-btn">Show list of colleges</button>
        </div>

        <div id="colleges-section" style="display: none;">
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255, 255, 255, 0.1); padding-bottom: 0.5rem; margin-bottom: 1.5rem;">
                <h3 style="color: var(--text-primary); font-size: 1.5rem;">Colleges Offering This Course</h3>
                <div>
                    <label for="location-filter" style="color: var(--text-secondary); margin-right: 0.5rem; font-size: 0.9rem;">Filter Location:</label>
                    <select id="location-filter" style="background: #1e293b; color: var(--text-primary); border: 1px solid rgba(59, 130, 246, 0.3); padding: 0.5rem; border-radius: 8px; outline: none;">
                        <option value="Any">All Locations</option>
                        ${hasOnline ? `<option value="Online">Online</option>` : ''}
                        ${keralaDistricts.map(dist => `<option value="${dist}">${dist}</option>`).join('')}
                    </select>
                </div>
            </div>
            
            <p style="color: var(--text-secondary); margin-bottom: 2rem;">Click on any college below to view its specific admission and financial details.</p>
            
            <div class="colleges-list" id="colleges-list-container">
                <!-- Rendered via JS based on filter -->
            </div>
        </div>
    `;

    // Function to render the list based on filter
    const renderCollegesList = (filterLocation) => {
        const listContainer = document.getElementById('colleges-list-container');
        const countDisplay = document.getElementById('colleges-count');

        let filteredColleges = sortedColleges;
        if (filterLocation !== 'Any') {
            filteredColleges = filteredColleges.filter(c => c.location === filterLocation);
        }

        countDisplay.textContent = `${filteredColleges.length} Colleges`;

        if (filteredColleges.length === 0) {
            listContainer.innerHTML = `<p style="text-align: center; color: var(--text-secondary);">No colleges match the selected location.</p>`;
            return;
        }

        let collegesHtml = '';
        filteredColleges.forEach(college => {
            const totalCost = college.tuition_fees + college.cost_of_living;
            const matchLabel = college.matchPercentage ? `<span style="color: #3b82f6; font-weight: 600; font-size: 0.9rem;">${college.matchPercentage}% Match</span>` : '';

            collegesHtml += `
                <div style="background: rgba(15, 23, 42, 0.4); padding: 1.5rem; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.05); margin-bottom: 1rem; cursor: pointer; transition: transform 0.2s;" onmouseover="this.style.transform='translateY(-3px)'" onmouseout="this.style.transform='translateY(0)'" onclick="window.location.href='details.html?id=${college.id}'">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
                        <h4 style="margin: 0; color: #58a6ff; font-size: 1.1rem;">${college.university}</h4>
                        ${matchLabel}
                    </div>
                    <div style="color: var(--text-secondary); margin-bottom: 1rem; font-size: 0.9rem;">📍 ${college.location} • ${college.country}</div>
                    
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem; font-size: 0.85rem;">
                        <div>
                            <span style="color: var(--text-secondary);">Ranking:</span> 
                            <strong>#${college.ranking}</strong>
                        </div>
                        <div>
                            <span style="color: var(--text-secondary);">Employability:</span> 
                            <strong>${college.employability_rate}%</strong>
                        </div>
                        <div>
                            <span style="color: var(--text-secondary);">Total Est. Cost:</span> 
                            <strong>₹${totalCost.toLocaleString('en-IN')}</strong>
                        </div>
                        <div>
                            <span style="color: var(--text-secondary);">Avg. Salary:</span> 
                            <strong>₹${college.avg_starting_salary.toLocaleString('en-IN')}</strong>
                        </div>
                    </div>
                </div>
            `;
        });

        listContainer.innerHTML = collegesHtml;
    };

    // Initial render
    renderCollegesList('Any');

    // Attach event listener to filter
    document.getElementById('location-filter').addEventListener('change', (e) => {
        renderCollegesList(e.target.value);
    });

    // Attach event listener to show colleges button
    document.getElementById('show-colleges-btn').addEventListener('click', () => {
        document.getElementById('colleges-section').style.display = 'block';
        document.getElementById('show-colleges-btn-container').style.display = 'none';

        // Ensure the list renders just in time
        renderCollegesList(document.getElementById('location-filter').value);
    });
}

function renderSingleCollege(course, container) {
    const totalCost = course.tuition_fees + course.cost_of_living;

    container.innerHTML = `
        <h1 style="color: var(--accent-color); margin-bottom: 0.5rem; font-size: 2.5rem; text-align: center;">${course.university}</h1>
        <h3 style="color: var(--text-secondary); margin-bottom: 2.5rem; font-size: 1.2rem; text-align: center;">${course.name} • ${course.location}, ${course.country}</h3>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; margin-bottom: 3rem;">
            
            <!-- Academic details -->
            <div style="background: rgba(15, 23, 42, 0.4); padding: 2rem; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.1);">
                <h4 style="margin-bottom: 1.5rem; color: #58a6ff; font-size: 1.3rem; border-bottom: 1px solid rgba(88, 166, 255, 0.3); padding-bottom: 0.5rem;">Academic Info</h4>
                <div style="display: grid; grid-template-columns: 1fr; gap: 1rem;">
                    <div style="display: flex; justify-content: space-between; border-bottom: 1px dashed rgba(255, 255, 255, 0.05); padding-bottom: 0.5rem;">
                        <span style="color: var(--text-secondary);">Category:</span>
                        <span style="font-weight: 500;">${course.category}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; border-bottom: 1px dashed rgba(255, 255, 255, 0.05); padding-bottom: 0.5rem;">
                        <span style="color: var(--text-secondary);">Format:</span>
                        <span style="font-weight: 500;">${course.format}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; border-bottom: 1px dashed rgba(255, 255, 255, 0.05); padding-bottom: 0.5rem;">
                        <span style="color: var(--text-secondary);">Duration:</span>
                        <span style="font-weight: 500;">${course.duration_months} Months</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; border-bottom: 1px dashed rgba(255, 255, 255, 0.05); padding-bottom: 0.5rem;">
                        <span style="color: var(--text-secondary);">Min HS %:</span>
                        <span style="font-weight: 500;">${course.min_hs_percentage}%</span>
                    </div>
                </div>
                <div style="margin-top: 1.5rem;">
                    <p style="color: var(--text-secondary); margin-bottom: 0.5rem; font-size: 0.9rem;">Eligible Streams</p>
                    <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                        ${course.allowed_hs_streams.map(s => `<span class="tag" style="background: rgba(88, 166, 255, 0.1); color: #58a6ff; border: 1px solid rgba(88, 166, 255, 0.3); padding: 0.3rem 0.6rem;">${s}</span>`).join('')}
                    </div>
                </div>
            </div>

            <!-- Outcomes details -->
            <div style="background: rgba(15, 23, 42, 0.4); padding: 2rem; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.1);">
                <h4 style="margin-bottom: 1.5rem; color: #3fb950; font-size: 1.3rem; border-bottom: 1px solid rgba(63, 185, 80, 0.3); padding-bottom: 0.5rem;">Outcomes & Rankings</h4>
                <div style="display: grid; grid-template-columns: 1fr; gap: 1rem;">
                    <div style="display: flex; justify-content: space-between; border-bottom: 1px dashed rgba(255, 255, 255, 0.05); padding-bottom: 0.5rem;">
                        <span style="color: var(--text-secondary);">NIRF Ranking:</span>
                        <span style="font-weight: 600; color: #3fb950;">#${course.ranking}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; border-bottom: 1px dashed rgba(255, 255, 255, 0.05); padding-bottom: 0.5rem;">
                        <span style="color: var(--text-secondary);">Employability Rate:</span>
                        <span style="font-weight: 600;">${course.employability_rate}%</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; border-bottom: 1px dashed rgba(255, 255, 255, 0.05); padding-bottom: 0.5rem;">
                        <span style="color: var(--text-secondary);">Avg Starting Salary:</span>
                        <span style="font-weight: 600;">₹${course.avg_starting_salary.toLocaleString('en-IN')}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; border-bottom: 1px dashed rgba(255, 255, 255, 0.05); padding-bottom: 0.5rem;">
                        <span style="color: var(--text-secondary);">Alumni Rating:</span>
                        <span style="font-weight: 600; color: #60a5fa;">⭐ ${course.alumni_rating} / 5.0</span>
                    </div>
                </div>
            </div>
            
            <!-- Financials -->
            <div style="grid-column: 1 / -1; background: rgba(15, 23, 42, 0.4); padding: 2rem; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.1);">
                <h4 style="margin-bottom: 1.5rem; color: #60a5fa; font-size: 1.3rem; border-bottom: 1px solid rgba(96, 165, 250, 0.3); padding-bottom: 0.5rem;">Financials (Total Estimated)</h4>
                <div style="display: flex; justify-content: space-around; text-align: center; flex-wrap: wrap; gap: 2rem;">
                    <div style="background: rgba(0, 0, 0, 0.2); padding: 1.5rem; border-radius: 8px; flex: 1; min-width: 200px;">
                        <p style="color: var(--text-secondary); margin-bottom: 0.5rem;">Tuition Fees</p>
                        <p style="font-size: 1.8rem; font-weight: bold;">₹${course.tuition_fees.toLocaleString('en-IN')}</p>
                    </div>
                    <div style="background: rgba(0, 0, 0, 0.2); padding: 1.5rem; border-radius: 8px; flex: 1; min-width: 200px;">
                        <p style="color: var(--text-secondary); margin-bottom: 0.5rem;">Cost of Living</p>
                        <p style="font-size: 1.8rem; font-weight: bold;">₹${course.cost_of_living.toLocaleString('en-IN')}</p>
                    </div>
                    <div style="background: rgba(96, 165, 250, 0.1); border: 1px solid rgba(96, 165, 250, 0.2); padding: 1.5rem; border-radius: 8px; flex: 1; min-width: 200px;">
                        <p style="color: var(--text-secondary); margin-bottom: 0.5rem;">Total Cost</p>
                        <p style="font-size: 2rem; font-weight: bold; color: #60a5fa;">₹${totalCost.toLocaleString('en-IN')}</p>
                    </div>
                </div>
            </div>
        </div>
        
        <div style="text-align: center; margin-top: 1rem; margin-bottom: 2rem;">
            <button id="apply-btn" class="primary-btn" style="padding: 1rem 3rem; font-size: 1.1rem;">Visit ${course.university} Official Site 🌍</button>
        </div>
    `;

    document.getElementById('apply-btn').addEventListener('click', () => {
        const query = encodeURIComponent('!ducky ' + course.university + ' official website');
        window.open('https://duckduckgo.com/?q=' + query, '_blank');
    });
}
