/**
 * Admin Contestants Management Logic
 */

document.addEventListener('DOMContentLoaded', async () => {
  if (!requireAuth() || !requireAdmin()) return;

  const header = new Header();
  header.mount();

  const categoryTitle = document.getElementById('categoryTitle');
  const categoryId = Utils.getQueryParam('id');
  const title = decodeURIComponent(Utils.getQueryParam('title') || 'Category');

  if (!categoryId) {
    document.getElementById('contestantsContent').innerHTML = `
      <div class="error-state card">
        <h2>Invalid Category</h2>
        <p>Category ID is missing.</p>
        <a href="/pages/admin/categories.html" class="btn btn-primary">Back to Categories</a>
      </div>
    `;
    return;
  }

  categoryTitle.textContent = title;

  const addContestantBtn = document.getElementById('addContestantBtn');
  const addContestantContainer = document.getElementById('addContestantContainer');
  const addContestantForm = document.getElementById('addContestantForm');
  const cancelBtn = document.getElementById('cancelBtn');
  const contestantsContent = document.getElementById('contestantsContent');
  const userMatricInput = document.getElementById('userMatric');
  const studentResults = document.getElementById('studentResults');
  const selectedStudent = document.getElementById('selectedStudent');
  const selectedName = document.getElementById('selectedName');

  let contestants = [];
  let selectedUserId = null;
  let allStudents = []; // Cache of all students

  // Load all students on page load for faster search
  async function loadAllStudents() {
    try {
      const { data } = await api.getUsers();
      allStudents = data.users || [];
    } catch (error) {
      console.warn('Could not load all students for local search:', error);
      allStudents = []; // Fall back to API search only
    }
  }

  // Event Listeners
  addContestantBtn.addEventListener('click', () => {
    showAddForm();
  });

  cancelBtn.addEventListener('click', () => {
    hideAddForm();
  });

  addContestantForm.addEventListener('submit', handleAddContestant);

  userMatricInput.addEventListener('input', debounceSearch);

  let searchTimeout;
  function debounceSearch(e) {
    clearTimeout(searchTimeout);
    const query = e.target.value.trim();
    
    if (query.length < 1) {
      studentResults.innerHTML = '';
      return;
    }

    searchTimeout = setTimeout(() => {
      performSearch(query);
    }, 300); // Wait 300ms before searching
  }

  async function performSearch(query) {
    const queryLower = query.toLowerCase();

    // Try API search first (server-side)
    try {
      const { data } = await api.searchUserByMatric(query);
      const results = data.users ? [data.users] : [];
      
      // Also filter allStudents locally if available
      if (allStudents.length > 0) {
        const localResults = allStudents.filter(
          student =>
            student.matric_number.toLowerCase().includes(queryLower) ||
            student.full_name.toLowerCase().includes(queryLower)
        );
        renderStudentResults(localResults);
      } else {
        renderStudentResults(results);
      }
    } catch (error) {
      // Fall back to local search if API fails
      if (allStudents.length > 0) {
        const results = allStudents.filter(
          student =>
            student.matric_number.toLowerCase().includes(queryLower) ||
            student.full_name.toLowerCase().includes(queryLower)
        );
        renderStudentResults(results);
      } else {
        studentResults.innerHTML = `<p class="text-muted">Search failed. Try again.</p>`;
      }
    }
  }

  // Functions
  function showAddForm() {
    addContestantContainer.style.display = 'block';
    userMatricInput.focus();
  }

  function hideAddForm() {
    addContestantContainer.style.display = 'none';
    addContestantForm.reset();
    studentResults.innerHTML = '';
    selectedStudent.style.display = 'none';
    selectedUserId = null;
  }

  function renderStudentResults(results) {
    if (results.length === 0) {
      studentResults.innerHTML = '<p class="text-muted">No students found</p>';
      return;
    }

    studentResults.innerHTML = results
      .map(
        student => `
          <div class="student-result-item" data-user-id="${student.id}">
            <strong>${student.full_name}</strong>
            <span class="text-gray">${student.matric_number}</span>
          </div>
        `
      )
      .join('');

    // Attach click listeners
    document.querySelectorAll('.student-result-item').forEach(item => {
      item.addEventListener('click', () => {
        const userId = item.getAttribute('data-user-id');
        const fullName = item.querySelector('strong').textContent;
        selectStudent(userId, fullName);
      });
    });
  }

  function selectStudent(userId, fullName) {
    selectedUserId = userId;
    selectedName.textContent = fullName;
    selectedStudent.style.display = 'block';
    studentResults.innerHTML = '';
    userMatricInput.value = '';
  }

  async function loadContestants() {
    try {
      const { data } = await api.getContestants(categoryId);
      contestants = data.contestants || [];
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
      contestantsContent.innerHTML = `
        <div class="empty-state card">
          <div class="empty-icon">👥</div>
          <h2>No Contestants Yet</h2>
          <p>Add students to this category</p>
        </div>
      `;
      return;
    }

    contestantsContent.innerHTML = `
      <div class="admin-table">
        <div class="table-header">
          <div class="table-cell">Name</div>
          <div class="table-cell">Matric</div>
          <div class="table-cell">Votes</div>
          <div class="table-cell">Actions</div>
        </div>
        ${contestants.map(renderContestantRow).join('')}
      </div>
    `;

    // Attach event listeners
    contestants.forEach(contestant => {
      document.getElementById(`remove-btn-${contestant.contest_id}`)?.addEventListener('click', () => {
        handleRemoveContestant(contestant);
      });
    });
  }

  function renderContestantRow(contestant) {
    return `
      <div class="table-row card">
        <div class="table-cell">
          <strong>${contestant.full_name}</strong>
        </div>
        <div class="table-cell">
          <span class="text-gray">${contestant.matric_number}</span>
        </div>
        <div class="table-cell">
          <span class="badge badge-success">${contestant.vote_count} vote${contestant.vote_count !== 1 ? 's' : ''}</span>
        </div>
        <div class="table-cell">
          <button class="btn btn-small btn-danger" id="remove-btn-${contestant.contest_id}">
            Remove
          </button>
        </div>
      </div>
    `;
  }

  function renderError(message) {
    contestantsContent.innerHTML = `
      <div class="error-state card">
        <h2>Failed to Load Contestants</h2>
        <p>${message}</p>
        <button class="btn btn-primary" onclick="location.reload()">Try Again</button>
      </div>
    `;
  }

  async function handleAddContestant(e) {
    e.preventDefault();

    if (!selectedUserId) {
      document.getElementById('matric-error').textContent = 'Please select a student';
      return;
    }

    const submitBtn = document.getElementById('submitBtn');
    Utils.setLoading(submitBtn, true);

    try {
      await api.addContestant(selectedUserId, categoryId);
      Utils.showNotification('Contestant added successfully!', 'success');
      hideAddForm();
      loadContestants();
    } catch (error) {
      Utils.setLoading(submitBtn, false);
      const formError = document.getElementById('formError');
      formError.textContent = error.message || 'Failed to add contestant';
      formError.style.display = 'block';
      Utils.showNotification(error.message, 'error');
    }
  }

  async function handleRemoveContestant(contestant) {
    if (!confirm(`Remove ${contestant.full_name} from this category?`)) {
      return;
    }

    try {
      await api.removeContestant(contestant.contest_id);
      Utils.showNotification('Contestant removed successfully!', 'success');
      loadContestants();
    } catch (error) {
      Utils.showNotification(error.message || 'Failed to remove contestant', 'error');
    }
  }

  // Initial load
  loadAllStudents(); // Load all students for faster search
  loadContestants();
});
