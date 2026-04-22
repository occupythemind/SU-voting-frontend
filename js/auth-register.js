/**
 * Register Page Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  const registerForm = document.getElementById('registerForm');
  const submitBtn = document.getElementById('submitBtn');
  const fullnameInput = document.getElementById('fullname');
  const matricInput = document.getElementById('matric');
  const passwordInput = document.getElementById('password');
  const passwordConfirmInput = document.getElementById('password-confirm');

  // Redirect if already logged in
  if (SessionManager.isLoggedIn()) {
    const user = SessionManager.getUser();
    if (user.is_admin) {
      Utils.goTo('/pages/admin/dashboard.html');
    } else {
      Utils.goTo('/pages/student/categories.html');
    }
  }

  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const fullname = fullnameInput.value.trim();
    const matric = matricInput.value.trim();
    const password = passwordInput.value;
    const passwordConfirm = passwordConfirmInput.value;

    // Clear previous errors
    document.querySelectorAll('.form-error').forEach(el => el.textContent = '');
    document.getElementById('formError').textContent = '';

    // Validation
    if (!fullname) {
      document.getElementById('fullname-error').textContent = 'Full name is required';
      return;
    }

    if (!Utils.isValidMatricNumber(matric)) {
      document.getElementById('matric-error').textContent = 'Please enter a valid matric number';
      return;
    }

    if (!Utils.isValidPassword(password)) {
      document.getElementById('password-error').textContent = 'Password must be at least 6 characters';
      return;
    }

    if (password !== passwordConfirm) {
      document.getElementById('confirm-error').textContent = 'Passwords do not match';
      return;
    }

    // Submit
    Utils.setLoading(submitBtn, true);

    try {
      const { data } = await api.register(fullname, matric, password);
      const user = data.user;

      // Save user session
      SessionManager.setUser(user);

      Utils.showNotification(`Welcome, ${user.full_name}! Account created successfully.`, 'success');

      // Redirect to voting page
      setTimeout(() => {
        Utils.goTo('/pages/student/categories.html');
      }, 1000);
    } catch (error) {
      Utils.setLoading(submitBtn, false);

      if (error.status === 400) {
        document.getElementById('formError').textContent = error.message || 'Registration failed. Please check your input.';
      } else {
        document.getElementById('formError').textContent = error.message || 'Registration failed. Please try again.';
      }
      Utils.showNotification(error.message, 'error');
    }
  });
});
