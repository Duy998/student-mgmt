async function loadUsers() {
  const tbody = document.getElementById('users-tbody');
  tbody.innerHTML = `<tr><td colspan="6" class="text-muted" style="text-align:center; padding:30px;">Loading...</td></tr>`;

  try {
    const users = await api.getUsers();
    tbody.innerHTML = users.map(renderUserRow).join('');
    attachUserRowHandlers();
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="6" class="text-muted" style="text-align:center; padding:30px;">Error: ${err.message}</td></tr>`;
  }
}

function renderUserRow(u) {
  const isSelf = u.id === currentUser.id;
  return `
    <tr data-id="${u.id}">
      <td class="mono">${escapeHtml(u.username)}</td>
      <td>${escapeHtml(u.full_name)}</td>
      <td>${escapeHtml(u.email)}</td>
      <td><span class="badge ${u.is_admin ? 'badge-admin' : 'badge-user'}">${u.is_admin ? 'Administration' : 'User'}</span></td>
      <td><span class="badge ${u.is_active ? 'badge-active' : 'badge-inactive'}">${u.is_active ? 'Activity' : 'Locked'}</span></td>
      <td>
        <div class="flex gap-8">
          <button class="btn btn-outline btn-sm toggle-admin-btn" ${isSelf ? 'disabled title="Cannot remove own admin rights."' : ''}>
            ${u.is_admin ? 'Remove admin rights' : 'Grant admin privileges'}
          </button>
          <button class="btn btn-outline btn-sm toggle-active-btn" ${isSelf ? 'disabled' : ''}>
            ${u.is_active ? 'Lock' : 'Unlock'}
          </button>
          <button class="btn btn-danger btn-sm delete-user-btn" ${isSelf ? 'disabled' : ''}>Delete</button>
        </div>
      </td>
    </tr>`;
}

function attachUserRowHandlers() {
  document.querySelectorAll('.toggle-admin-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const tr = e.target.closest('tr');
      const id = Number(tr.dataset.id);
      const isCurrentlyAdmin = btn.textContent.includes('Remove');
      try {
        await api.updateUser(id, { is_admin: !isCurrentlyAdmin });
        showToast('Permissions updated', 'success');
        loadUsers();
      } catch (err) { showToast(err.message, 'error'); }
    });
  });

  document.querySelectorAll('.toggle-active-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const tr = e.target.closest('tr');
      const id = Number(tr.dataset.id);
      const isCurrentlyActive = btn.textContent.trim() === 'Lock';
      try {
        await api.updateUser(id, { is_active: !isCurrentlyActive });
        showToast('Status updated successfully', 'success');
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
          <h3>Confirm user deletion</h3>
          <button class="modal-close" id="close-delete-user-modal">&times;</button>
        </div>
        <div class="modal-body">This account will be permanently deleted. Are you sure?</div>
        <div class="modal-footer">
          <button class="btn btn-outline" id="cancel-delete-user-btn">Cancel</button>
          <button class="btn btn-danger" id="confirm-delete-user-btn">Delete</button>
        </div>
      </div>
    </div>`;

  const close = () => { modalRoot.innerHTML = ''; };
  document.getElementById('close-delete-user-modal').addEventListener('click', close);
  document.getElementById('cancel-delete-user-btn').addEventListener('click', close);
  document.getElementById('confirm-delete-user-btn').addEventListener('click', async () => {
    try {
      await api.deleteUser(id);
      showToast('User deleted', 'success');
      close();
      loadUsers();
    } catch (err) {
      showToast(err.message, 'error');
    }
  });
}
