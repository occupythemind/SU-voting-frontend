/**
 * Admin Categories Management Logic
 */

document.addEventListener('DOMContentLoaded', async () => {
  if (!requireAuth() || !requireAdmin()) return;

  const header = new Header();
  header.mount();

  const newCategoryBtn = document.getElementById('newCategoryBtn');
  const categoryFormContainer = document.getElementById('categoryFormContainer');
  const categoriesContent = document.getElementById('categoriesContent');
  const categoryForm = document.getElementById('categoryForm');
  const cancelCategoryBtn = document.getElementById('cancelCategoryBtn');

  let categories = [];
  let editingCategoryId = null;

  // Event Listeners
  newCategoryBtn.addEventListener('click', () => {
    editingCategoryId = null;
    showForm();
  });

  cancelCategoryBtn.addEventListener('click', hideForm);

  categoryForm.addEventListener('submit', handleSaveCategory);

  // Functions
  function showForm(category = null) {
    editingCategoryId = category?.id || null;
    const title = document.getElementById('categoryTitle');
    const desc = document.getElementById('categoryDesc');
    const formTitle = document.getElementById('formTitle');

    if (category) {
      formTitle.textContent = 'Edit Category';
      title.value = category.title;
      desc.value = category.description || '';
    } else {
      formTitle.textContent = 'New Category';
      title.value = '';
      desc.value = '';
    }

    categoryFormContainer.style.display = 'block';
    title.focus();
  }

  function hideForm() {
    categoryFormContainer.style.display = 'none';
    categoryForm.reset();
    editingCategoryId = null;
  }

  async function loadCategories() {
    try {
      const { data } = await api.getCategories();
      categories = data.categories || [];
      renderCategories();
    } catch (error) {
      if (error.status === 401) {
        SessionManager.logout();
        return;
      }
      renderError(error.message);
    }
  }

  function renderCategories() {
    if (categories.length === 0) {
      categoriesContent.innerHTML = `
        <div class="empty-state card">
          <div class="empty-icon">📭</div>
          <h2>No Categories Yet</h2>
          <p>Create your first category to get started</p>
        </div>
      `;
      return;
    }

    categoriesContent.innerHTML = `
      <div class="admin-table">
        <div class="table-header">
          <div class="table-cell">Title</div>
          <div class="table-cell">Description</div>
          <div class="table-cell">Created</div>
          <div class="table-cell">Actions</div>
        </div>
        ${categories.map(renderCategoryRow).join('')}
      </div>
    `;

    // Attach event listeners
    categories.forEach(category => {
      document.getElementById(`edit-btn-${category.id}`)?.addEventListener('click', () => {
        showForm(category);
      });

      document.getElementById(`delete-btn-${category.id}`)?.addEventListener('click', () => {
        handleDeleteCategory(category);
      });

      document.getElementById(`manage-btn-${category.id}`)?.addEventListener('click', () => {
        goToManageContestants(category.id);
      });
    });
  }

  function renderCategoryRow(category) {
    return `
      <div class="table-row card">
        <div class="table-cell"><strong>${category.title}</strong></div>
        <div class="table-cell">
          <span class="text-gray">${category.description || '-'}</span>
        </div>
        <div class="table-cell text-sm">
          ${Utils.formatDate(category.created_at)}
        </div>
        <div class="table-cell">
          <div class="action-buttons">
            <button class="btn btn-small btn-primary" id="edit-btn-${category.id}">
              Edit
            </button>
            <button class="btn btn-small btn-secondary" id="manage-btn-${category.id}">
              Contestants
            </button>
            <button class="btn btn-small btn-danger" id="delete-btn-${category.id}">
              Delete
            </button>
          </div>
        </div>
      </div>
    `;
  }

  function renderError(message) {
    categoriesContent.innerHTML = `
      <div class="error-state card">
        <h2>Failed to Load Categories</h2>
        <p>${message}</p>
        <button class="btn btn-primary" onclick="location.reload()">Try Again</button>
      </div>
    `;
  }

  async function handleSaveCategory(e) {
    e.preventDefault();

    const title = document.getElementById('categoryTitle').value.trim();
    const desc = document.getElementById('categoryDesc').value.trim();

    // Validation
    document.getElementById('title-error').textContent = '';
    document.getElementById('formError').style.display = 'none';

    if (!title) {
      document.getElementById('title-error').textContent = 'Title is required';
      return;
    }

    const submitBtn = document.getElementById('submitCategoryBtn');
    Utils.setLoading(submitBtn, true);

    try {
      if (editingCategoryId) {
        // Update existing category
        await api.updateCategory(editingCategoryId, title, desc);
        Utils.showNotification('Category updated successfully!', 'success');
      } else {
        // Create new category
        await api.createCategory(title, desc);
        Utils.showNotification('Category created successfully!', 'success');
      }

      hideForm();
      loadCategories();
    } catch (error) {
      Utils.setLoading(submitBtn, false);
      const formError = document.getElementById('formError');
      formError.textContent = error.message || 'Failed to save category';
      formError.style.display = 'block';
      Utils.showNotification(error.message, 'error');
    }
  }

  async function handleDeleteCategory(category) {
    if (!confirm(`Are you sure you want to delete "${category.title}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await api.deleteCategory(category.id);
      Utils.showNotification('Category deleted successfully!', 'success');
      loadCategories();
    } catch (error) {
      Utils.showNotification(error.message || 'Failed to delete category', 'error');
    }
  }

  function goToManageContestants(categoryId) {
    const category = categories.find(c => c.id === categoryId);
    const encodedTitle = encodeURIComponent(category.title);
    window.location.href = `/pages/admin/contestants.html?id=${categoryId}&title=${encodedTitle}`;
  }

  // Initial load
  loadCategories();
});
