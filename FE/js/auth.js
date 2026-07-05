redirectIfAuthed();

function showAlert(msg) {
  const alertBox = document.getElementById('alert');
  if (!alertBox) return;
  alertBox.textContent = msg;
  alertBox.classList.add('show');
}

function setLoading(btn, loading, label) {
  btn.disabled = loading;
  btn.innerHTML = loading ? `<span class="spinner"></span> Đang xử lý...` : label;
}

// ── Login ─────────────────────────────────────────────────────
const loginForm = document.getElementById('login-form');
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('login-btn');
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;

    setLoading(btn, true, 'Đăng nhập');
    try {
      const data = await api.login(username, password);
      storage.setToken(data.access_token);
      storage.setUser(data.user);
      window.location.href = 'dashboard.html';
    } catch (err) {
      showAlert(err.message || 'Đăng nhập thất bại');
      setLoading(btn, false, 'Đăng nhập');
    }
  });
}

// ── Register ──────────────────────────────────────────────────
const registerForm = document.getElementById('register-form');
if (registerForm) {
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('register-btn');

    const payload = {
      full_name: document.getElementById('full_name').value.trim(),
      username: document.getElementById('username').value.trim(),
      email: document.getElementById('email').value.trim(),
      password: document.getElementById('password').value,
    };

    setLoading(btn, true, 'Đăng ký');
    try {
      await api.register(payload);
      showToast('Đăng ký thành công! Vui lòng đăng nhập.', 'success');
      setTimeout(() => { window.location.href = 'login.html'; }, 1200);
    } catch (err) {
      showAlert(err.message || 'Đăng ký thất bại');
      setLoading(btn, false, 'Đăng ký');
    }
  });
}
