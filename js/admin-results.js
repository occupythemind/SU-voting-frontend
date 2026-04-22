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
          <button class="btn btn-small" id="toggle-voters-${category.category_id}">
            View Voters ▼
          </button>
          <div class="voters-list" id="voters-${category.category_id}" style="display: none;">
            ${renderVoters(sorted)}
          </div>
        </div>
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

      if (toggleBtn) {
        toggleBtn.addEventListener('click', (e) => {
          e.preventDefault();
          const isVisible = votersList.style.display !== 'none';
          votersList.style.display = isVisible ? 'none' : 'block';
          toggleBtn.textContent = isVisible ? 'View Voters ▼' : 'Hide Voters ▲';
        });
      }
    });
  }, 100);

  // Initial load
  loadResults();
});
