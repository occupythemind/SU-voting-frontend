/**
 * Profile Page Logic
 */

document.addEventListener('DOMContentLoaded', async () => {
  if (!requireAuth()) return;

  const header = new Header();
  header.mount();

  const profileContent = document.getElementById('profileContent');
  let user = SessionManager.getUser();
  let isEditing = false;

  async function renderProfile() {
    const formHTML = isEditing ? renderEditForm() : renderViewMode();
    profileContent.innerHTML = formHTML;
    attachEventListeners();
  }

  function renderViewMode() {
    const joinDate = new Date(user.created_at);
    return `
      <div class="profile-view">
        <div class="profile-field">
          <label>Full Name</label>
          <p class="profile-value">${user.full_name}</p>
        </div>

        <div class="profile-field">
          <label>Matric Number</label>
          <p class="profile-value">${user.matric_number}</p>
        </div>

        <div class="profile-field">
          <label>Status</label>
          <p class="profile-value">
            <span class="badge ${user.is_active ? 'badge-success' : 'badge-warning'}">
              ${user.is_active ? 'Active' : 'Inactive'}
            </span>
            ${user.is_admin ? '<span class="badge badge-info">Admin</span>' : ''}
          </p>
        </div>

        <div class="profile-field">
          <label>Member Since</label>
          <p class="profile-value">${Utils.formatDate(user.created_at)}</p>
        </div>

        <div class="profile-actions">
          <button class="btn btn-primary" id="editBtn">
            Edit Profile
          </button>
        </div>
      </div>
    `;
  }

  function renderEditForm() {
    return `
      <form id="editForm" class="profile-form">
        <div class="form-group">
          <label for="fullname">Full Name</label>
          <input
            type="text"
            id="fullname"
            name="fullname"
            value="${user.full_name}"
            required
          >
          <span class="form-error" id="fullname-error"></span>
        </div>

        <div class="form-group">
          <label for="password">New Password (Optional)</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Leave blank to keep current password"
            autocomplete="new-password"
          >
          <span class="form-error" id="password-error"></span>
          <small class="text-muted">Min 6 characters if provided</small>
        </div>

        <div id="formError" class="form-error alert-error" style="display: none;"></div>

        <div class="profile-actions">
          <button type="submit" class="btn btn-primary" id="saveBtn">
            Save Changes
          </button>
          <button type="button" class="btn btn-secondary" id="cancelBtn">
            Cancel
          </button>
        </div>
      </form>
    `;
  }

  function attachEventListeners() {
    const editBtn = document.getElementById('editBtn');
    const editForm = document.getElementById('editForm');
    const cancelBtn = document.getElementById('cancelBtn');
    const saveBtn = document.getElementById('saveBtn');

    if (editBtn) {
      editBtn.addEventListener('click', () => {
        isEditing = true;
        renderProfile();
      });
    }

    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => {
        isEditing = false;
        renderProfile();
      });
    }

    if (editForm) {
      editForm.addEventListener('submit', handleSaveProfile);
    }
  }

  async function handleSaveProfile(e) {
    e.preventDefault();

    const fullname = document.getElementById('fullname').value.trim();
    const password = document.getElementById('password').value;

    // Clear errors
    document.querySelectorAll('.form-error').forEach(el => el.textContent = '');
    document.getElementById('formError').style.display = 'none';

    // Validation
    if (!fullname) {
      document.getElementById('fullname-error').textContent = 'Full name is required';
      return;
    }

    if (password && !Utils.isValidPassword(password)) {
      document.getElementById('password-error').textContent = 'Password must be at least 6 characters';
      return;
    }

    const saveBtn = document.getElementById('saveBtn');
    Utils.setLoading(saveBtn, true);

    try {
      const updates = { full_name: fullname };
      if (password) {
        updates.password = password;
      }

      const { data } = await api.updateProfile(updates);
      user = data.user;
      SessionManager.setUser(user);

      Utils.showNotification('Profile updated successfully!', 'success');

      isEditing = false;
      renderProfile();
    } catch (error) {
      Utils.setLoading(saveBtn, false);

      const formError = document.getElementById('formError');
      formError.textContent = error.message || 'Failed to update profile';
      formError.style.display = 'block';

      Utils.showNotification(error.message, 'error');
    }
  }

  // Initial render
  renderProfile();
});
