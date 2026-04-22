/**
 * Admin Results Page Logic
 */

document.addEventListener('DOMContentLoaded', async () => {
  if (!requireAuth() || !requireAdmin()) return;

  const header = new Header();
  header.mount();

  const resultsContent = document.getElementById('resultsContent');
  let results = [];

  async function loadResults() {
    try {
      const { data } = await api.getResults();
      results = data.categories || [];
      renderResults();
    } catch (error) {
      if (error.status === 401) {
        SessionManager.logout();
        return;
      }
      renderError(error.message);
    }
  }

  function renderResults() {
    if (results.length === 0) {
      resultsContent.innerHTML = `
        <div class="empty-state card">
          <div class="empty-icon">📊</div>
          <h2>No Results Yet</h2>
          <p>Voting results will appear here</p>
        </div>
      `;
      return;
    }

    resultsContent.innerHTML = results.map(renderCategory).join('');
  }

  function renderCategory(category) {
    const contestants = category.contestants || [];

    if (contestants.length === 0) {
      return '';
    }

    // Sort by vote count
    const sorted = [...contestants].sort((a, b) => b.vote_count - a.vote_count);

    return `
      <div class="results-category card">
        <div class="card-header">
          <h3>${category.category_title}</h3>
          <p class="text-gray">${category.category_description || ''}</p>
        </div>

        <div class="results-table">
          <div class="results-header">
            <div class="rank">Rank</div>
            <div class="candidate">Candidate</div>
            <div class="votes">Votes</div>
            <div class="percentage">%</div>
          </div>

          ${sorted.map((contestant, index) => {
            const totalVotes = contestants.reduce((sum, c) => sum + (c.vote_count || 0), 0);
            const percentage = totalVotes > 0 ? ((contestant.vote_count / totalVotes) * 100).toFixed(1) : 0;

            return `
              <div class="results-row" data-contestant-id="${contestant.contest_id}">
                <div class="rank">#${index + 1}</div>
                <div class="candidate">
                  <strong>${contestant.candidate_name}</strong>
                  <span class="text-gray">${contestant.candidate_id}</span>
                </div>
                <div class="votes">${contestant.vote_count}</div>
                <div class="percentage">
                  <div class="percentage-bar">
                    <div class="percentage-fill" style="width: ${percentage}%"></div>
                  </div>
                  <span>${percentage}%</span>
                </div>
              </div>
            `;
          })}
        </div>

        <div class="voters-section">
          <div class="section-buttons">
            <button class="btn btn-small" id="toggle-voters-${category.category_id}">
              View Voters ▼
            </button>
            <button class="btn btn-small" id="toggle-chart-${category.category_id}">
              Generate Bar Chart
            </button>
          </div>
          <div class="voters-list" id="voters-${category.category_id}" style="display: none;">
            ${renderVoters(sorted)}
          </div>
          <div class="chart-container" id="chart-${category.category_id}" style="display: none; margin-top: var(--spacing-lg);">
            ${generateBarChart(sorted)}
          </div>
        </div>
      </div>
    `;
  }

  function generateBarChart(contestants) {
    if (!contestants || contestants.length === 0) {
      return '<p class="text-gray">No contestants to display</p>';
    }

    // Find max votes for scaling
    const maxVotes = Math.max(...contestants.map(c => c.vote_count || 0));
    const chartHeight = 300;
    const chartWidth = Math.min(600, window.innerWidth - 60);
    const barWidth = Math.floor(chartWidth / contestants.length);
    const padding = 60;
    const totalWidth = chartWidth + padding * 2;
    const totalHeight = chartHeight + padding * 2;

    // Create SVG chart
    let svg = `<svg width="${totalWidth}" height="${totalHeight}" class="bar-chart-svg" viewBox="0 0 ${totalWidth} ${totalHeight}">`;

    // Background grid lines
    for (let i = 0; i <= 4; i++) {
      const y = padding + (chartHeight / 4) * i;
      const value = Math.round((maxVotes / 4) * (4 - i));
      svg += `
        <line x1="${padding}" y1="${y}" x2="${totalWidth - padding}" y2="${y}" 
              stroke="#e5e7eb" stroke-width="1" stroke-dasharray="5,5"/>
        <text x="${padding - 10}" y="${y + 4}" text-anchor="end" font-size="12" fill="#6b7280">
          ${value}
        </text>
      `;
    }

    // Draw bars
    contestants.forEach((contestant, index) => {
      const votes = contestant.vote_count || 0;
      const barHeight = (votes / maxVotes) * chartHeight || 5;
      const x = padding + index * barWidth + barWidth * 0.15;
      const y = padding + chartHeight - barHeight;
      const width = barWidth * 0.7;

      // Bar with hover effect
      svg += `
        <g class="bar-group">
          <rect x="${x}" y="${y}" width="${width}" height="${barHeight}" 
                fill="#10b981" rx="4" ry="4"
                class="bar-rect" data-votes="${votes}"/>
          <text x="${x + width / 2}" y="${y - 10}" 
                text-anchor="middle" font-size="14" font-weight="700" 
                fill="#1f2937" class="bar-value">
            ${votes}
          </text>
        </g>
      `;
    });

    // X-axis labels
    contestants.forEach((contestant, index) => {
      const x = padding + index * barWidth + barWidth / 2;
      const y = padding + chartHeight + 30;
      const name = contestant.candidate_name || 'Unknown';
      const nameShort = name.length > 15 ? name.substring(0, 12) + '...' : name;

      svg += `
        <text x="${x}" y="${y}" text-anchor="middle" 
              font-size="12" fill="#6b7280" class="x-label"
              title="${name}">
          ${nameShort}
        </text>
      `;
    });

    // Y-axis label
    svg += `
      <text x="20" y="${padding + chartHeight / 2}" text-anchor="middle" 
            font-size="12" fill="#6b7280" transform="rotate(-90 20 ${padding + chartHeight / 2})">
        Number of Votes
      </text>
    `;

    svg += `</svg>`;

    return `
      <div class="bar-chart-wrapper">
        <div class="chart-info">
          <p><strong>Vote Distribution Chart</strong></p>
          <p class="text-gray text-sm">Participants ranked by vote count</p>
        </div>
        ${svg}
      </div>
    `;
  }

  function renderVoters(contestants) {
    const votersList = [];

    contestants.forEach(contestant => {
      const voters = contestant.voters || [];
      if (voters.length > 0) {
        votersList.push(`
          <div class="voter-group">
            <h5>${contestant.candidate_name}</h5>
            <div class="voter-items">
              ${voters
                .map(
                  voter => `
                    <div class="voter-item">
                      <span><strong>${voter.full_name}</strong> (${voter.matric_number})</span>
                      <span class="text-gray text-sm">${Utils.formatDateTime(voter.voted_at)}</span>
                    </div>
                  `
                )
                .join('')}
            </div>
          </div>
        `);
      }
    });

    return votersList.length > 0
      ? votersList.join('')
      : '<p class="text-gray">No voters yet</p>';
  }

  function renderError(message) {
    resultsContent.innerHTML = `
      <div class="error-state card">
        <h2>Failed to Load Results</h2>
        <p>${message}</p>
        <button class="btn btn-primary" onclick="location.reload()">Try Again</button>
      </div>
    `;
  }

  // Wait a moment then set up toggle buttons
  setTimeout(() => {
    results.forEach(category => {
      const toggleBtn = document.getElementById(`toggle-voters-${category.category_id}`);
      const votersList = document.getElementById(`voters-${category.category_id}`);
      const chartToggleBtn = document.getElementById(`toggle-chart-${category.category_id}`);
      const chartContainer = document.getElementById(`chart-${category.category_id}`);

      if (toggleBtn) {
        toggleBtn.addEventListener('click', (e) => {
          e.preventDefault();
          const isVisible = votersList.style.display !== 'none';
          votersList.style.display = isVisible ? 'none' : 'block';
          toggleBtn.textContent = isVisible ? 'View Voters ▼' : 'Hide Voters ▲';
        });
      }

      if (chartToggleBtn) {
        chartToggleBtn.addEventListener('click', (e) => {
          e.preventDefault();
          const isVisible = chartContainer.style.display !== 'none';
          chartContainer.style.display = isVisible ? 'none' : 'block';
          chartToggleBtn.textContent = isVisible ? 'Generate Bar Chart' : 'Hide Bar Chart';
        });
      }
    });
  }, 100);

  // Initial load
  loadResults();
});
