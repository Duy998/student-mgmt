const PAGE_SIZE = 10;
let currentPage = 0;
let currentSearch = '';
let currentStatusFilter = '';
let editingStudentId = null;

// so it cannot be translated.
// ensuring the displayed text is always correct.
const statusCls = {
  active    : 'badge-active',
  inactive  : 'badge-inactive',
  graduated : 'badge-graduated',
};

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str ?? '';
  return div.innerHTML;
}

function formatDate(iso) {
  if (!iso) return '—';
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

async function loadStudents() {
  const tbody = document.getElementById('students-tbody');
  tbody.innerHTML = `<tr><td colspan="8" class="text-muted" style="text-align:center; padding:30px;">Loading...</td></tr>`;

  try {
    const params = { skip: currentPage * PAGE_SIZE, limit: PAGE_SIZE };
    if (currentSearch) params.search = currentSearch;
    if (currentStatusFilter) params.status = currentStatusFilter;

    const students = await api.getStudents(params);

    if (students.length === 0) {
      tbody.innerHTML = `<tr><td colspan="8">
        <div class="empty-state">
          <div class="empty-icon">📭</div>
          <div>No students found</div>
        </div>
      </td></tr>`;
    } else {
      tbody.innerHTML = students.map(renderStudentRow).join('');
      attachRowHandlers();
    }

    document.getElementById('pagination-info').textContent =
      `${'Page'} ${currentPage + 1} — ${students.length} ${'results'}`;
    document.getElementById('prev-page-btn').disabled = currentPage === 0;
    document.getElementById('next-page-btn').disabled = students.length < PAGE_SIZE;

  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="8" class="text-muted" style="text-align:center; padding:30px;">Error: ${escapeHtml(err.message)}</td></tr>`;
  }
}

function renderStudentRow(s) {
  const statusText = ({ active:'Active', inactive:'On Leave', graduated:'Graduated' }[s.status] || s.status);
  const statusClass = statusCls[s.status] || '';
  const genderText = s.gender;

  return `
    <tr data-id="${s.id}">
      <td class="mono">${escapeHtml(s.student_code)}</td>
      <td>${escapeHtml(s.full_name)}</td>
      <td>${formatDate(s.date_of_birth)}</td>
      <td>${escapeHtml(genderText)}</td>
      <td>${escapeHtml(s.class_name || '—')}</td>
      <td class="mono">${(s.gpa ?? 0).toFixed(1)}</td>
      <td><span class="badge ${statusClass}">${escapeHtml(statusText)}</span></td>
      <td>
        <div class="flex gap-8">
          <button class="btn btn-outline btn-sm edit-btn">${'Edit'}</button>
          ${currentUser.is_admin
            ? `<button class="btn btn-danger btn-sm delete-btn">${'Delete'}</button>`
            : ''}
        </div>
      </td>
    </tr>`;
}

function attachRowHandlers() {
  document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = Number(e.target.closest('tr').dataset.id);
      openStudentModal(id);
    });
  });
  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = Number(e.target.closest('tr').dataset.id);
      confirmDeleteStudent(id);
    });
  });
}

async function loadStatistics() {
  try {
    const stats = await api.getStatistics();
    document.getElementById('stat-total').textContent = stats.total;
    document.getElementById('stat-active').textContent = stats.active;
    document.getElementById('stat-inactive').textContent = stats.inactive;
    document.getElementById('stat-gpa').textContent = stats.average_gpa.toFixed(2);
  } catch (err) {
    showToast('Failed to load statistics: ' + err.message, 'error');
  }
}

// ── Search & Filter ───────────────────────────────────────────

let searchDebounce;
document.getElementById('search-input').addEventListener('input', (e) => {
  clearTimeout(searchDebounce);
  searchDebounce = setTimeout(() => {
    currentSearch = e.target.value.trim();
    currentPage = 0;
    loadStudents();
  }, 350);
});

document.getElementById('status-filter').addEventListener('change', (e) => {
  currentStatusFilter = e.target.value;
  currentPage = 0;
  loadStudents();
});

document.getElementById('prev-page-btn').addEventListener('click', () => {
  if (currentPage > 0) { currentPage--; loadStudents(); }
});
document.getElementById('next-page-btn').addEventListener('click', () => {
  currentPage++; loadStudents();
});

// ── Add / Edit Modal ──────────────────────────────────────────

document.getElementById('add-student-btn').addEventListener('click', () => openStudentModal(null));

async function openStudentModal(studentId) {
  editingStudentId = studentId;
  let student = {
    student_code: '', full_name: '', date_of_birth: '', gender: 'Male',
    email: '', phone: '', address: '', class_name: '', gpa: 0, status: 'active',
  };

  if (studentId) {
    try {
      student = await api.getStudent(studentId);
    } catch (err) {
      showToast(err.message, 'error');
      return;
    }
  }

      // Use t() directly when building the HTML string.
  const modalRoot = document.getElementById('modal-root');
  modalRoot.innerHTML = `
    <div class="modal-overlay" id="student-modal-overlay">
      <div class="modal-box">
        <div class="modal-header">
          <h3>${studentId ? 'Edit' + ' ' + 'Full Name'.toLowerCase() : '+ Add Student'}</h3>
          <button class="modal-close" id="close-student-modal">&times;</button>
        </div>
        <form id="student-form">
          <div class="modal-body">
            <div class="field-row">
              <div class="field">
                <label>${'Student ID'}</label>
                <input type="text" id="f-student_code" value="${escapeHtml(student.student_code)}" required>
              </div>
              <div class="field">
                <label>${'Full Name'}</label>
                <input type="text" id="f-full_name" value="${escapeHtml(student.full_name)}" required>
              </div>
            </div>
            <div class="field-row">
              <div class="field">
                <label>${'Date of Birth'}</label>
                <input type="date" id="f-date_of_birth" value="${student.date_of_birth || ''}" required>
              </div>
              <div class="field">
                <label>${'Gender'}</label>
                <select id="f-gender">
                  <option value="Male"   ${student.gender === 'Male'   ? 'selected' : ''}>Male</option>
                  <option value="Female" ${student.gender === 'Female' ? 'selected' : ''}>Female</option>
                  <option value="Other"  ${student.gender === 'Other'  ? 'selected' : ''}>Other</option>
                </select>
              </div>
            </div>
            <div class="field-row">
              <div class="field">
                <label>${'Email'}</label>
                <input type="email" id="f-email" value="${escapeHtml(student.email)}" required>
              </div>
              <div class="field">
                <label>Phone</label>
                <input type="text" id="f-phone" value="${escapeHtml(student.phone || '')}">
              </div>
            </div>
            <div class="field-row">
              <div class="field">
                <label>${'Class'}</label>
                <input type="text" id="f-class_name" value="${escapeHtml(student.class_name || '')}">
              </div>
              <div class="field">
                <label>${'GPA'}</label>
                <input type="number" id="f-gpa" min="0" max="10" step="0.1" value="${student.gpa ?? 0}">
              </div>
            </div>
            <div class="field">
              <label>Address</label>
              <input type="text" id="f-address" value="${escapeHtml(student.address || '')}">
            </div>
            <div class="field">
              <label>${'Status'}</label>
              <select id="f-status">
                <option value="active"    ${student.status === 'active'    ? 'selected' : ''}>${'Active'}</option>
                <option value="inactive"  ${student.status === 'inactive'  ? 'selected' : ''}>${'On Leave'}</option>
                <option value="graduated" ${student.status === 'graduated' ? 'selected' : ''}>${'Graduated'}</option>
              </select>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline" id="cancel-student-btn">${'Cancel'}</button>
            <button type="submit" class="btn btn-primary" id="save-student-btn">${'Save'}</button>
          </div>
        </form>
      </div>
    </div>`;

  document.getElementById('close-student-modal').addEventListener('click', closeStudentModal);
  document.getElementById('cancel-student-btn').addEventListener('click', closeStudentModal);
  document.getElementById('student-modal-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'student-modal-overlay') closeStudentModal();
  });
  document.getElementById('student-form').addEventListener('submit', submitStudentForm);
}

function closeStudentModal() {
  document.getElementById('modal-root').innerHTML = '';
  editingStudentId = null;
}

async function submitStudentForm(e) {
  e.preventDefault();
  const btn = document.getElementById('save-student-btn');
  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span> ...';

  const payload = {
    student_code : document.getElementById('f-student_code').value.trim(),
    full_name    : document.getElementById('f-full_name').value.trim(),
    date_of_birth: document.getElementById('f-date_of_birth').value,
    gender       : document.getElementById('f-gender').value,
    email        : document.getElementById('f-email').value.trim(),
    phone        : document.getElementById('f-phone').value.trim() || null,
    address      : document.getElementById('f-address').value.trim() || null,
    class_name   : document.getElementById('f-class_name').value.trim() || null,
    gpa          : parseFloat(document.getElementById('f-gpa').value) || 0,
    status       : document.getElementById('f-status').value,
  };

  try {
    if (editingStudentId) {
      await api.updateStudent(editingStudentId, payload);
      showToast('Saved successfully', 'success');   
    } else {
      await api.createStudent(payload);
      showToast('Saved successfully', 'success');   
    }
    closeStudentModal();
    loadStudents();
    loadStatistics();
  } catch (err) {
    showToast(err.message, 'error');
    btn.disabled = false;
    btn.textContent = 'Save';
  }
}

// ── Delete ────────────────────────────────────────────────────

function confirmDeleteStudent(id) {
  const modalRoot = document.getElementById('modal-root');
  modalRoot.innerHTML = `
    <div class="modal-overlay" id="delete-modal-overlay">
      <div class="modal-box" style="max-width: 400px;">
        <div class="modal-header">
          <h3>${'Confirm'}</h3>
          <button class="modal-close" id="close-delete-modal">&times;</button>
        </div>
        <div class="modal-body">
          Are you sure you want to delete this student? This action cannot be undone.
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline" id="cancel-delete-btn">${'Cancel'}</button>
          <button class="btn btn-danger"  id="confirm-delete-btn">${'Delete'}</button>
        </div>
      </div>
    </div>`;

  const close = () => { modalRoot.innerHTML = ''; };
  document.getElementById('close-delete-modal').addEventListener('click', close);
  document.getElementById('cancel-delete-btn').addEventListener('click', close);
  document.getElementById('confirm-delete-btn').addEventListener('click', async () => {
    try {
      await api.deleteStudent(id);
      showToast('Deleted', 'success');   
      close();
      loadStudents();
      loadStatistics();
    } catch (err) {
      showToast(err.message, 'error');
    }
  });
}

// ── Export ────────────────────────────────────────────────────

document.getElementById('export-excel-btn').addEventListener('click', async (e) => {
  const btn = e.currentTarget;
  btn.disabled = true;
  try {
    const blob = await api.exportExcel();
    downloadBlob(blob, `danh-sach-hoc-sinh-${new Date().toISOString().slice(0,10)}.xlsx`);
    showToast('Saved successfully', 'success');
  } catch (err) {
    showToast(`${'Export failed'}: ${err.message}`, 'error');
  } finally {
    btn.disabled = false;
  }
});

document.getElementById('export-pdf-btn').addEventListener('click', async (e) => {
  const btn = e.currentTarget;
  btn.disabled = true;
  try {
    const blob = await api.exportPdf();
    downloadBlob(blob, `danh-sach-hoc-sinh-${new Date().toISOString().slice(0,10)}.pdf`);
    showToast('Saved successfully', 'success');
  } catch (err) {
    showToast(`${'Export failed'}: ${err.message}`, 'error');
  } finally {
    btn.disabled = false;
  }
});

// ── Import from Excel ─────────────────────────────────────────

document.getElementById('download-template-btn').addEventListener('click', async (e) => {
  const btn = e.currentTarget;
  btn.disabled = true;
  try {
    const blob = await api.downloadImportTemplate();
    downloadBlob(blob, 'mau-import-hoc-sinh.xlsx');
    showToast('Saved successfully', 'success');
  } catch (err) {
    showToast(err.message, 'error');
  } finally {
    btn.disabled = false;
  }
});

document.getElementById('import-excel-btn').addEventListener('click', () => {
  document.getElementById('import-excel-input').click();
});

document.getElementById('import-excel-input').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  e.target.value = '';

  const btn = document.getElementById('import-excel-btn');
  const originalText = btn.textContent;
  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span> ...';

  try {
    const imported = await api.importExcel(file);
    showToast(`${'Import successful'}: ${imported.length}`, 'success');
    loadStudents();
    loadStatistics();
  } catch (err) {
    showImportErrors(err);
  } finally {
    btn.disabled = false;
    btn.textContent = originalText;
  }
});

function showImportErrors(err) {
  let message = err.message;
  let errorList = [];
  if (err.detail && typeof err.detail === 'object') {
    message = err.detail.message || message;
    errorList = err.detail.errors || [];
  }

  const modalRoot = document.getElementById('modal-root');
  modalRoot.innerHTML = `
    <div class="modal-overlay" id="import-error-overlay">
      <div class="modal-box" style="max-width: 560px;">
        <div class="modal-header">
          <h3>${'Import failed'}</h3>
          <button class="modal-close" id="close-import-error">&times;</button>
        </div>
        <div class="modal-body">
          <p style="margin-bottom:12px;">${escapeHtml(message)}</p>
          ${errorList.length ? `
            <div style="max-height:260px; overflow-y:auto; border:1px solid var(--border,#e2e2e2); border-radius:6px; padding:10px;">
              <ul style="margin:0; padding-left:18px;">
                ${errorList.map(e => `<li style="margin-bottom:4px;">${escapeHtml(e)}</li>`).join('')}
              </ul>
            </div>` : ''}
        </div>
        <div class="modal-footer">
          <button class="btn btn-primary" id="close-import-error-2">${'Close'}</button>
        </div>
      </div>
    </div>`;

  const close = () => { modalRoot.innerHTML = ''; };
  document.getElementById('close-import-error').addEventListener('click', close);
  document.getElementById('close-import-error-2').addEventListener('click', close);
  document.getElementById('import-error-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'import-error-overlay') close();
  });
}
