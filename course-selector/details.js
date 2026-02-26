document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const courseId = urlParams.get('id');

    const course = coursesData.find(c => c.id === courseId);
    const container = document.getElementById('details-container');

    if (!course) {
        container.innerHTML = `<h3>Course not found.</h3>`;
        return;
    }

    const totalCost = course.tuition_fees + course.cost_of_living;

    container.innerHTML = `
        <h1 style="color: var(--primary-color); margin-bottom: 0.5rem; font-size: 2.5rem;">${course.name}</h1>
        <h3 style="color: var(--text-secondary); margin-bottom: 2rem; font-size: 1.2rem;">${course.university} • ${course.location}, ${course.country}</h3>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 2rem;">
            <div style="background: rgba(15, 23, 42, 0.4); padding: 1.5rem; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.05);">
                <h4 style="margin-bottom: 1rem; color: #58a6ff;">Academic Info</h4>
                <p style="margin-bottom: 0.5rem;"><strong>Category:</strong> ${course.category}</p>
                <p style="margin-bottom: 0.5rem;"><strong>Format:</strong> ${course.format}</p>
                <p style="margin-bottom: 0.5rem;"><strong>Duration:</strong> ${course.duration_months} Months</p>
                <p style="margin-bottom: 0.5rem;"><strong>Eligible Streams:</strong> ${course.allowed_hs_streams.join(', ')}</p>
                <p style="margin-bottom: 0.5rem;"><strong>Min HS Percentage:</strong> ${course.min_hs_percentage}%</p>
                ${course.ielts_required > 0 ? `<p style="margin-bottom: 0.5rem;"><strong>IELTS Required:</strong> ${course.ielts_required}</p>` : ''}
            </div>

            <div style="background: rgba(15, 23, 42, 0.4); padding: 1.5rem; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.05);">
                <h4 style="margin-bottom: 1rem; color: #3fb950;">Outcomes & Rankings</h4>
                <p style="margin-bottom: 0.5rem;"><strong>NIRF Ranking:</strong> #${course.ranking}</p>
                <p style="margin-bottom: 0.5rem;"><strong>Employability Rate:</strong> ${course.employability_rate}%</p>
                <p style="margin-bottom: 0.5rem;"><strong>Avg Starting Salary:</strong> ₹${course.avg_starting_salary.toLocaleString('en-IN')}</p>
                <p style="margin-bottom: 0.5rem;"><strong>Alumni Rating:</strong> ${course.alumni_rating} / 5.0</p>
            </div>
            
            <div style="grid-column: 1 / -1; background: rgba(15, 23, 42, 0.4); padding: 1.5rem; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.05);">
                <h4 style="margin-bottom: 1rem; color: #f0883e;">Financials (Total Estimated)</h4>
                <div style="display: flex; justify-content: space-around; text-align: center; flex-wrap: wrap; gap: 1rem;">
                    <div>
                        <p style="color: var(--text-secondary); margin-bottom: 0.5rem;">Tuition Fees</p>
                        <p style="font-size: 1.5rem; font-weight: bold;">₹${course.tuition_fees.toLocaleString('en-IN')}</p>
                    </div>
                    <div>
                        <p style="color: var(--text-secondary); margin-bottom: 0.5rem;">Cost of Living</p>
                        <p style="font-size: 1.5rem; font-weight: bold;">₹${course.cost_of_living.toLocaleString('en-IN')}</p>
                    </div>
                    <div>
                        <p style="color: var(--text-secondary); margin-bottom: 0.5rem;">Total Cost</p>
                        <p style="font-size: 1.5rem; font-weight: bold; color: #f0883e;">₹${totalCost.toLocaleString('en-IN')}</p>
                    </div>
                </div>
            </div>
        </div>
        
        <div style="text-align: center; margin-top: 2rem;">
            <button id="apply-btn" class="primary-btn">Visit the Site</button>
        </div>
    `;

    document.getElementById('apply-btn').addEventListener('click', () => {
        const query = encodeURIComponent('!ducky ' + course.university + ' official website');
        window.open('https://duckduckgo.com/?q=' + query, '_blank');
    });
});
