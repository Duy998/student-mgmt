if (!requireAuth()) { /* redirected */ }

const currentUser = storage.getUser();

function initShell() {
  if (!currentUser) return;

  document.getElementById('user-name').textContent = currentUser.full_name;
  document.getElementById('user-role').textContent = currentUser.is_admin ? 'Quản trị viên' : 'Người dùng';
  document.getElementById('user-avatar').textContent = currentUser.full_name.charAt(0).toUpperCase();

  if (currentUser.is_admin) {
    document.getElementById('admin-section').style.display = 'block';
    document.getElementById('users-nav-item').style.display = 'flex';
  }

  document.getElementById('logout-btn').addEventListener('click', () => {
    storage.clearAll();
    window.location.href = 'login.html';
  });

  // Nav switching
  document.querySelectorAll('.nav-item[data-view]').forEach(item => {
    item.addEventListener('click', () => switchView(item.dataset.view));
  });

  // Mobile sidebar toggle
  const sidebar = document.getElementById('sidebar');
  document.getElementById('sidebar-toggle')?.addEventListener('click', () => {
    sidebar.classList.toggle('open');
  });
}

function switchView(view) {
  document.querySelectorAll('.nav-item[data-view]').forEach(i => i.classList.toggle('active', i.dataset.view === view));
  document.getElementById('view-students').style.display = view === 'students' ? 'block' : 'none';
  document.getElementById('view-users').style.display = view === 'users' ? 'block' : 'none';
  document.getElementById('sidebar')?.classList.remove('open');

  if (view === 'users' && currentUser.is_admin) {
    loadUsers();
  }
}

initShell();
loadStudents();
loadStatistics();
