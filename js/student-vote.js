/**
 * Student Voting Page Logic
 */

document.addEventListener('DOMContentLoaded', async () => {
  if (!requireAuth()) return;

  const header = new Header();
  header.mount();

  const categoryTitle = document.getElementById('categoryTitle');
  const votingContent = document.getElementById('votingContent');
  
  const categoryId = Utils.getQueryParam('id');
  const title = decodeURIComponent(Utils.getQueryParam('title') || 'Voting Category');

  if (!categoryId) {
    votingContent.innerHTML = `
      <div class="error-state">
        <h2>Invalid Category</h2>
        <p>Category ID is missing. Please go back and try again.</p>
        <a href="/pages/student/categories.html" class="btn btn-primary">Back to Categories</a>
      </div>
    `;
    return;
  }

  categoryTitle.textContent = title;

  let contestants = [];
  let userVote = null;

  async function loadContestants() {
    try {
      const { data } = await api.getContestants(categoryId);
      contestants = data.contestants || [];
      userVote = data.user_vote;
      renderContestants();
    } catch (error) {
      if (error.status === 401) {
        SessionManager.logout();
        return;
      }
      renderError(error.message);
    }
  }

  function renderContestants() {
    if (contestants.length === 0) {
      votingContent.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">🏆</div>
          <h2>No Contestants</h2>
          <p>There are no contestants in this category yet.</p>
        </div>
      `;
      return;
    }

    votingContent.innerHTML = `
      <div class="contestants-container">
        <div class="user-vote-status">
          ${userVote ? `
            <div class="alert alert-info">
              ✓ You have voted for a contestant in this category
            </div>
          ` : `
            <div class="alert alert-warning">
              You haven't voted in this category yet
            </div>
          `}
        </div>

        <div class="contestants-list">
          ${contestants.map(contestant => renderContestantCard(contestant)).join('')}
        </div>
      </div>
    `;

    // Attach event listeners
    contestants.forEach(contestant => {
      const voteBtn = document.getElementById(`vote-btn-${contestant.contest_id}`);
      const unvoteBtn = document.getElementById(`unvote-btn-${contestant.contest_id}`);

      if (voteBtn) {
        voteBtn.addEventListener('click', () => handleVote(contestant));
      }

      if (unvoteBtn) {
        unvoteBtn.addEventListener('click', () => handleUnvote());
      }
    });
  }

  function renderContestantCard(contestant) {
    const isVoted = userVote === contestant.contest_id;
    const btnClass = isVoted ? 'btn-danger' : 'btn-primary';
    const btnText = isVoted ? 'Remove Vote' : 'Vote';
    const btnId = isVoted ? `unvote-btn-${contestant.contest_id}` : `vote-btn-${contestant.contest_id}`;

    return `
      <div class="contestant-card card ${isVoted ? 'voted' : ''}">
        <div class="contestant-header">
          <h3>${contestant.full_name}</h3>
          ${isVoted ? '<span class="voted-badge">✓ Your Vote</span>' : ''}
        </div>

        <div class="contestant-body">
          <div class="contestant-info">
            <p class="contestant-matric">${contestant.matric_number}</p>
            <div class="vote-count">
              <span class="vote-number">${contestant.vote_count}</span>
              <span class="vote-label">vote${contestant.vote_count !== 1 ? 's' : ''}</span>
            </div>
          </div>
        </div>

        <div class="contestant-footer">
          <button class="btn ${btnClass}" id="${btnId}">
            ${btnText}
          </button>
        </div>
      </div>
    `;
  }

  function renderError(message) {
    votingContent.innerHTML = `
      <div class="error-state">
        <h2>Error Loading Contestants</h2>
        <p>${message}</p>
        <button class="btn btn-primary" onclick="location.reload()">Try Again</button>
      </div>
    `;
  }

  async function handleVote(contestant) {
    if (userVote) {
      Utils.showNotification('You can only vote once per category. Remove your previous vote to change it.', 'warning');
      return;
    }

    if (!confirm(`Are you sure you want to vote for ${contestant.full_name}?`)) {
      return;
    }

    const voteBtn = document.getElementById(`vote-btn-${contestant.contest_id}`);
    Utils.setLoading(voteBtn, true);

    try {
      await api.vote(categoryId, contestant.contest_id);
      userVote = contestant.contest_id;
      Utils.showNotification(`Your vote for ${contestant.full_name} has been recorded!`, 'success');
      renderContestants();
    } catch (error) {
      Utils.setLoading(voteBtn, false);

      if (error.status === 400) {
        Utils.showNotification('You have already voted in this category', 'warning');
      } else {
        Utils.showNotification(error.message || 'Failed to cast vote', 'error');
      }
    }
  }

  async function handleUnvote() {
    if (!confirm('Are you sure you want to remove your vote?')) {
      return;
    }

    const unvoteBtn = document.getElementById(`unvote-btn-${userVote}`);
    Utils.setLoading(unvoteBtn, true);

    try {
      await api.unvote(categoryId);
      userVote = null;
      Utils.showNotification('Your vote has been removed', 'success');
      renderContestants();
    } catch (error) {
      Utils.setLoading(unvoteBtn, false);
      Utils.showNotification(error.message || 'Failed to remove vote', 'error');
    }
  }

  // Initial load
  loadContestants();
});
