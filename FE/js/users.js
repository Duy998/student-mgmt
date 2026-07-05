async function loadUsers() {
  const tbody = document.getElementById('users-tbody');
  tbody.innerHTML = `<tr><td colspan="6" class="text-muted" style="text-align:center; padding:30px;">Đang tải...</td></tr>`;

  try {
    const users = await api.getUsers();
    tbody.innerHTML = users.map(renderUserRow).join('');
    attachUserRowHandlers();
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="6" class="text-muted" style="text-align:center; padding:30px;">Lỗi: ${err.message}</td></tr>`;
  }
}

function renderUserRow(u) {
  const isSelf = u.id === currentUser.id;
  return `
    <tr data-id="${u.id}">
      <td class="mono">${escapeHtml(u.username)}</td>
      <td>${escapeHtml(u.full_name)}</td>
      <td>${escapeHtml(u.email)}</td>
      <td><span class="badge ${u.is_admin ? 'badge-admin' : 'badge-user'}">${u.is_admin ? 'Quản trị' : 'Người dùng'}</span></td>
      <td><span class="badge ${u.is_active ? 'badge-active' : 'badge-inactive'}">${u.is_active ? 'Hoạt động' : 'Đã khóa'}</span></td>
      <td>
        <div class="flex gap-8">
          <button class="btn btn-outline btn-sm toggle-admin-btn" ${isSelf ? 'disabled title="Không thể tự bỏ quyền admin"' : ''}>
            ${u.is_admin ? 'Bỏ quyền Admin' : 'Cấp quyền Admin'}
          </button>
          <button class="btn btn-outline btn-sm toggle-active-btn" ${isSelf ? 'disabled' : ''}>
            ${u.is_active ? 'Khóa' : 'Mở khóa'}
          </button>
          <button class="btn btn-danger btn-sm delete-user-btn" ${isSelf ? 'disabled' : ''}>Xóa</button>
        </div>
      </td>
    </tr>`;
}

function attachUserRowHandlers() {
  document.querySelectorAll('.toggle-admin-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const tr = e.target.closest('tr');
      const id = Number(tr.dataset.id);
      const isCurrentlyAdmin = btn.textContent.includes('Bỏ');
      try {
        await api.updateUser(id, { is_admin: !isCurrentlyAdmin });
        showToast('Đã cập nhật quyền', 'success');
        loadUsers();
      } catch (err) { showToast(err.message, 'error'); }
    });
  });

  document.querySelectorAll('.toggle-active-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const tr = e.target.closest('tr');
      const id = Number(tr.dataset.id);
      const isCurrentlyActive = btn.textContent.trim() === 'Khóa';
      try {
        await api.updateUser(id, { is_active: !isCurrentlyActive });
        showToast('Đã cập nhật trạng thái', 'success');
        loadUsers();
      } catch (err) { showToast(err.message, 'error'); }
    });
  });

  document.querySelectorAll('.delete-user-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const tr = e.target.closest('tr');
      const id = Number(tr.dataset.id);
      confirmDeleteUser(id);
    });
  });
}

function confirmDeleteUser(id) {
  const modalRoot = document.getElementById('modal-root');
  modalRoot.innerHTML = `
    <div class="modal-overlay" id="delete-user-overlay">
      <div class="modal-box" style="max-width: 400px;">
        <div class="modal-header">
          <h3>Xác nhận xóa người dùng</h3>
          <button class="modal-close" id="close-delete-user-modal">&times;</button>
        </div>
        <div class="modal-body">Tài khoản này sẽ bị xóa vĩnh viễn. Bạn có chắc chắn?</div>
        <div class="modal-footer">
          <button class="btn btn-outline" id="cancel-delete-user-btn">Hủy</button>
          <button class="btn btn-danger" id="confirm-delete-user-btn">Xóa</button>
        </div>
      </div>
    </div>`;

  const close = () => { modalRoot.innerHTML = ''; };
  document.getElementById('close-delete-user-modal').addEventListener('click', close);
  document.getElementById('cancel-delete-user-btn').addEventListener('click', close);
  document.getElementById('confirm-delete-user-btn').addEventListener('click', async () => {
    try {
      await api.deleteUser(id);
      showToast('Đã xóa người dùng', 'success');
      close();
      loadUsers();
    } catch (err) {
      showToast(err.message, 'error');
    }
  });
}
