/**
 * Admin Audit Logs Page Logic
 */

document.addEventListener('DOMContentLoaded', async () => {
  if (!requireAuth() || !requireAdmin()) return;

  const header = new Header();
  header.mount();

  const logsContent = document.getElementById('logsContent');
  const filterInput = document.getElementById('filterInput');

  let allLogs = [];
  let filteredLogs = [];

  async function loadLogs() {
    try {
      const { data } = await api.getAuditLogs();
      allLogs = data.audit_logs || [];
      filteredLogs = allLogs;
      renderLogs();
    } catch (error) {
      if (error.status === 401) {
        SessionManager.logout();
        return;
      }
      renderError(error.message);
    }
  }

  function renderLogs() {
    if (filteredLogs.length === 0) {
      logsContent.innerHTML = `
        <div class="empty-state card">
          <div class="empty-icon">📋</div>
          <h2>No Logs Available</h2>
          <p>${allLogs.length === 0 ? 'No voting activity yet' : 'No logs match your search'}</p>
        </div>
      `;
      return;
    }

    logsContent.innerHTML = `
      <div class="logs-table">
        <div class="table-header">
          <div class="table-cell">Name</div>
          <div class="table-cell">Matric</div>
          <div class="table-cell">Action</div>
          <div class="table-cell">Timestamp</div>
        </div>
        ${filteredLogs.map(renderLogRow).join('')}
      </div>
    `;
  }

  function renderLogRow(log) {
    const actionLabel = getActionLabel(log.action);
    return `
      <div class="table-row card">
        <div class="table-cell">
          <strong>${log.full_name}</strong>
        </div>
        <div class="table-cell">
          <span class="text-gray">${log.matric_number}</span>
        </div>
        <div class="table-cell">
          <span class="action-badge ${log.action.startsWith('vote:') ? 'action-vote' : 'action-unvote'}">
            ${actionLabel}
          </span>
        </div>
        <div class="table-cell">
          <span class="text-gray text-sm">${Utils.formatDateTime(log.created_at)}</span>
        </div>
      </div>
    `;
  }

  function getActionLabel(action) {
    if (action.startsWith('vote:')) {
      return '✓ Voted';
    } else if (action.startsWith('unvote:')) {
      return '✕ Removed Vote';
    }
    return action;
  }

  function renderError(message) {
    logsContent.innerHTML = `
      <div class="error-state card">
        <h2>Failed to Load Logs</h2>
        <p>${message}</p>
        <button class="btn btn-primary" onclick="location.reload()">Try Again</button>
      </div>
    `;
  }

  function applyFilter() {
    const query = filterInput.value.trim().toLowerCase();

    if (!query) {
      filteredLogs = allLogs;
    } else {
      filteredLogs = allLogs.filter(
        log =>
          log.full_name.toLowerCase().includes(query) ||
          log.matric_number.toLowerCase().includes(query) ||
          getActionLabel(log.action).toLowerCase().includes(query)
      );
    }

    renderLogs();
  }

  // Event Listener
  filterInput.addEventListener('input', applyFilter);

  // Initial load
  loadLogs();
});
