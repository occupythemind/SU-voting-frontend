/**
 * Student Categories List Page
 */

document.addEventListener('DOMContentLoaded', async () => {
  if (!requireAuth()) return;

  const header = new Header();
  header.mount();

  const categoriesContent = document.getElementById('categoriesContent');
  let categories = [];

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
        <div class="empty-state">
          <div class="empty-icon">📭</div>
          <h2>No Categories Available</h2>
          <p>There are no voting categories available at the moment. Check back later!</p>
        </div>
      `;
      return;
    }

    categoriesContent.innerHTML = `
      <div class="categories-grid">
        ${categories.map(category => renderCategoryCard(category)).join('')}
      </div>
    `;

    // Attach event listeners
    categories.forEach(category => {
      const btn = document.getElementById(`view-btn-${category.id}`);
      if (btn) {
        btn.addEventListener('click', () => {
          navigateToCategory(category.id, category.title);
        });
      }
    });
  }

  function renderCategoryCard(category) {
    return `
      <div class="category-card card">
        <div class="category-header">
          <h3>${category.title}</h3>
        </div>
        <div class="category-body">
          <p class="category-description">${category.description || 'No description available'}</p>
          <p class="category-date">Created ${Utils.formatDate(category.created_at)}</p>
        </div>
        <div class="category-footer">
          <button class="btn btn-primary" id="view-btn-${category.id}">
            View Contestants
          </button>
        </div>
      </div>
    `;
  }

  function renderError(message) {
    categoriesContent.innerHTML = `
      <div class="error-state">
        <div class="error-icon">⚠️</div>
        <h2>Failed to Load Categories</h2>
        <p>${message}</p>
        <button class="btn btn-primary" onclick="location.reload()">Try Again</button>
      </div>
    `;
  }

  function navigateToCategory(categoryId, categoryTitle) {
    const encodedTitle = encodeURIComponent(categoryTitle);
    window.location.href = `/pages/student/vote.html?id=${categoryId}&title=${encodedTitle}`;
  }

  // Initial load
  loadCategories();
});
