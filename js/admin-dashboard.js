/**
 * Admin Dashboard Logic
 */

document.addEventListener('DOMContentLoaded', async () => {
  if (!requireAuth() || !requireAdmin()) return;

  const header = new Header();
  header.mount();

  const categoryCountEl = document.getElementById('categoryCount');
  const totalVotesEl = document.getElementById('totalVotes');
  const statsGrid = document.getElementById('statsGrid');

  async function loadDashboardData() {
    try {
      // Load categories and results
      const [categoriesRes, resultsRes] = await Promise.all([
        api.getCategories(),
        api.getResults(),
      ]);

      const categories = categoriesRes.data.categories || [];
      const resultCategories = resultsRes.data.categories || [];

      categoryCountEl.textContent = categories.length;

      // Calculate total votes
      let totalVotes = 0;
      const categoryStats = [];

      resultCategories.forEach(category => {
        let categoryVoteCount = 0;
        const contestants = category.contestants || [];

        contestants.forEach(contestant => {
          categoryVoteCount += contestant.vote_count || 0;
        });

        totalVotes += categoryVoteCount;
        categoryStats.push({
          title: category.category_title,
          votes: categoryVoteCount,
          contestants: contestants.length,
        });
      });

      totalVotesEl.textContent = totalVotes;
      renderStats(categoryStats);
    } catch (error) {
      if (error.status === 401) {
        SessionManager.logout();
        return;
      }
      console.error('Failed to load dashboard data:', error);
      Utils.showNotification(error.message, 'error');
    }
  }

  function renderStats(stats) {
    if (stats.length === 0) {
      statsGrid.innerHTML = `
        <div class="empty-message">
          No voting data available yet
        </div>
      `;
      return;
    }

    statsGrid.innerHTML = stats
      .map(
        stat => `
          <div class="stat-item">
            <h4>${stat.title}</h4>
            <div class="stat-row">
              <span>Votes:</span>
              <strong>${stat.votes}</strong>
            </div>
            <div class="stat-row">
              <span>Contestants:</span>
              <strong>${stat.contestants}</strong>
            </div>
          </div>
        `
      )
      .join('');
  }

  await loadDashboardData();
});
