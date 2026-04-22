/**
 * Login Page Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const submitBtn = document.getElementById('submitBtn');
  const matricInput = document.getElementById('matric');
  const passwordInput = document.getElementById('password');

  // Redirect if already logged in
  if (SessionManager.isLoggedIn()) {
    const user = SessionManager.getUser();
    if (user.is_admin) {
      Utils.goTo('/pages/admin/dashboard.html');
    } else {
      Utils.goTo('/pages/student/categories.html');
    }
  }

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const matric = matricInput.value.trim();
    const password = passwordInput.value;

    // Clear previous errors
    document.querySelectorAll('.form-error').forEach(el => el.textContent = '');

    // Validation
    if (!Utils.isValidMatricNumber(matric)) {
      document.getElementById('matric-error').textContent = 'Please enter a valid matric number';
      return;
    }

    if (!password) {
      document.getElementById('password-error').textContent = 'Password is required';
      return;
    }

    // Submit
    Utils.setLoading(submitBtn, true);

    try {
      const { data } = await api.login(matric, password);
      const user = data.user;

      // Save user session
      SessionManager.setUser(user);

      Utils.showNotification(`Welcome back, ${user.full_name}!`, 'success');

      // Redirect based on role
      setTimeout(() => {
        if (user.is_admin) {
          Utils.goTo('/pages/admin/dashboard.html');
        } else {
          Utils.goTo('/pages/student/categories.html');
        }
      }, 500);
    } catch (error) {
      Utils.setLoading(submitBtn, false);

      if (error.status === 403) {
        document.getElementById('formError').textContent = 'Your account is not activated. Please contact admin.';
      } else if (error.status === 400) {
        document.getElementById('formError').textContent = 'Invalid matric number or password';
      } else {
        document.getElementById('formError').textContent = error.message || 'Login failed. Please try again.';
      }
      Utils.showNotification(error.message, 'error');
    }
  });
});
