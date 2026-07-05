const PAGE_SIZE = 10;
let currentPage = 0;
let currentSearch = '';
let currentStatusFilter = '';
let editingStudentId = null;

const statusLabels = {
  active: { text: 'Đang học', cls: 'badge-active' },
  inactive: { text: 'Tạm nghỉ', cls: 'badge-inactive' },
  graduated: { text: 'Đã tốt nghiệp', cls: 'badge-graduated' },
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
  tbody.innerHTML = `<tr><td colspan="8" class="text-muted" style="text-align:center; padding:30px;">Đang tải...</td></tr>`;

  try {
    const params = { skip: currentPage * PAGE_SIZE, limit: PAGE_SIZE };
    if (currentSearch) params.search = currentSearch;
    if (currentStatusFilter) params.status = currentStatusFilter;

    const students = await api.getStudents(params);

    if (students.length === 0) {
      tbody.innerHTML = `<tr><td colspan="8">
        <div class="empty-state">
          <div class="empty-icon">📭</div>
          <div>Không tìm thấy học sinh nào</div>
        </div>
      </td></tr>`;
    } else {
      tbody.innerHTML = students.map(renderStudentRow).join('');
      attachRowHandlers();
    }

    document.getElementById('pagination-info').textContent =
      `Hiển thị ${students.length} kết quả — Trang ${currentPage + 1}`;
    document.getElementById('prev-page-btn').disabled = currentPage === 0;
    document.getElementById('next-page-btn').disabled = students.length < PAGE_SIZE;

  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="8" class="text-muted" style="text-align:center; padding:30px;">Lỗi: ${escapeHtml(err.message)}</td></tr>`;
  }
}

function renderStudentRow(s) {
  const status = statusLabels[s.status] || { text: s.status, cls: '' };
  return `
    <tr data-id="${s.id}">
      <td class="mono">${escapeHtml(s.student_code)}</td>
      <td>${escapeHtml(s.full_name)}</td>
      <td>${formatDate(s.date_of_birth)}</td>
      <td>${escapeHtml(s.gender)}</td>
      <td>${escapeHtml(s.class_name || '—')}</td>
      <td class="mono">${(s.gpa ?? 0).toFixed(1)}</td>
      <td><span class="badge ${status.cls}">${status.text}</span></td>
      <td>
        <div class="flex gap-8">
          <button class="btn btn-outline btn-sm edit-btn">Sửa</button>
          ${currentUser.is_admin ? '<button class="btn btn-danger btn-sm delete-btn">Xóa</button>' : ''}
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
    showToast('Không thể tải thống kê: ' + err.message, 'error');
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
    student_code: '', full_name: '', date_of_birth: '', gender: 'Nam',
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

  const modalRoot = document.getElementById('modal-root');
  modalRoot.innerHTML = `
    <div class="modal-overlay" id="student-modal-overlay">
      <div class="modal-box">
        <div class="modal-header">
          <h3>${studentId ? 'Sửa thông tin học sinh' : 'Thêm học sinh mới'}</h3>
          <button class="modal-close" id="close-student-modal">&times;</button>
        </div>
        <form id="student-form">
          <div class="modal-body">
            <div class="field-row">
              <div class="field">
                <label>Mã số học sinh</label>
                <input type="text" id="f-student_code" value="${escapeHtml(student.student_code)}" required>
              </div>
              <div class="field">
                <label>Họ và tên</label>
                <input type="text" id="f-full_name" value="${escapeHtml(student.full_name)}" required>
              </div>
            </div>
            <div class="field-row">
              <div class="field">
                <label>Ngày sinh</label>
                <input type="date" id="f-date_of_birth" value="${student.date_of_birth || ''}" required>
              </div>
              <div class="field">
                <label>Giới tính</label>
                <select id="f-gender">
                  <option value="Nam" ${student.gender === 'Nam' ? 'selected' : ''}>Nam</option>
                  <option value="Nữ" ${student.gender === 'Nữ' ? 'selected' : ''}>Nữ</option>
                  <option value="Khác" ${student.gender === 'Khác' ? 'selected' : ''}>Khác</option>
                </select>
              </div>
            </div>
            <div class="field-row">
              <div class="field">
                <label>Email</label>
                <input type="email" id="f-email" value="${escapeHtml(student.email)}" required>
              </div>
              <div class="field">
                <label>Số điện thoại</label>
                <input type="text" id="f-phone" value="${escapeHtml(student.phone || '')}">
              </div>
            </div>
            <div class="field-row">
              <div class="field">
                <label>Lớp</label>
                <input type="text" id="f-class_name" value="${escapeHtml(student.class_name || '')}">
              </div>
              <div class="field">
                <label>Điểm trung bình</label>
                <input type="number" id="f-gpa" min="0" max="10" step="0.1" value="${student.gpa ?? 0}">
              </div>
            </div>
            <div class="field">
              <label>Địa chỉ</label>
              <input type="text" id="f-address" value="${escapeHtml(student.address || '')}">
            </div>
            <div class="field">
              <label>Trạng thái</label>
              <select id="f-status">
                <option value="active" ${student.status === 'active' ? 'selected' : ''}>Đang học</option>
                <option value="inactive" ${student.status === 'inactive' ? 'selected' : ''}>Tạm nghỉ</option>
                <option value="graduated" ${student.status === 'graduated' ? 'selected' : ''}>Đã tốt nghiệp</option>
              </select>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline" id="cancel-student-btn">Hủy</button>
            <button type="submit" class="btn btn-primary" id="save-student-btn">Lưu</button>
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
  btn.innerHTML = '<span class="spinner"></span> Đang lưu...';

  const payload = {
    student_code: document.getElementById('f-student_code').value.trim(),
    full_name: document.getElementById('f-full_name').value.trim(),
    date_of_birth: document.getElementById('f-date_of_birth').value,
    gender: document.getElementById('f-gender').value,
    email: document.getElementById('f-email').value.trim(),
    phone: document.getElementById('f-phone').value.trim() || null,
    address: document.getElementById('f-address').value.trim() || null,
    class_name: document.getElementById('f-class_name').value.trim() || null,
    gpa: parseFloat(document.getElementById('f-gpa').value) || 0,
    status: document.getElementById('f-status').value,
  };

  try {
    if (editingStudentId) {
      await api.updateStudent(editingStudentId, payload);
      showToast('Cập nhật học sinh thành công', 'success');
    } else {
      await api.createStudent(payload);
      showToast('Thêm học sinh thành công', 'success');
    }
    closeStudentModal();
    loadStudents();
    loadStatistics();
  } catch (err) {
    showToast(err.message, 'error');
    btn.disabled = false;
    btn.textContent = 'Lưu';
  }
}

// ── Delete ────────────────────────────────────────────────────

function confirmDeleteStudent(id) {
  const modalRoot = document.getElementById('modal-root');
  modalRoot.innerHTML = `
    <div class="modal-overlay" id="delete-modal-overlay">
      <div class="modal-box" style="max-width: 400px;">
        <div class="modal-header">
          <h3>Xác nhận xóa</h3>
          <button class="modal-close" id="close-delete-modal">&times;</button>
        </div>
        <div class="modal-body">
          Bạn có chắc muốn xóa học sinh này? Hành động này không thể hoàn tác.
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline" id="cancel-delete-btn">Hủy</button>
          <button class="btn btn-danger" id="confirm-delete-btn">Xóa</button>
        </div>
      </div>
    </div>`;

  const close = () => { modalRoot.innerHTML = ''; };
  document.getElementById('close-delete-modal').addEventListener('click', close);
  document.getElementById('cancel-delete-btn').addEventListener('click', close);
  document.getElementById('confirm-delete-btn').addEventListener('click', async () => {
    try {
      await api.deleteStudent(id);
      showToast('Đã xóa học sinh', 'success');
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
    showToast('Đã xuất file Excel', 'success');
  } catch (err) {
    showToast('Xuất Excel thất bại: ' + err.message, 'error');
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
    showToast('Đã xuất file PDF', 'success');
  } catch (err) {
    showToast('Xuất PDF thất bại: ' + err.message, 'error');
  } finally {
    btn.disabled = false;
  }
});

// ── Import from Excel ────────────────────────────────────────

document.getElementById('download-template-btn').addEventListener('click', async (e) => {
  const btn = e.currentTarget;
  btn.disabled = true;
  try {
    const blob = await api.downloadImportTemplate();
    downloadBlob(blob, 'mau-import-hoc-sinh.xlsx');
    showToast('Đã tải file mẫu', 'success');
  } catch (err) {
    showToast('Tải file mẫu thất bại: ' + err.message, 'error');
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
  e.target.value = ''; // allow re-selecting the same file later

  const btn = document.getElementById('import-excel-btn');
  const originalText = btn.textContent;
  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span> Đang import...';

  try {
    const imported = await api.importExcel(file);
    showToast(`Import thành công ${imported.length} học sinh`, 'success');
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
  // err.detail is the structured FastAPI detail object { message, errors: [] }
  // for 422 import failures, set by apiRequest in config.js.
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
          <h3>Import thất bại</h3>
          <button class="modal-close" id="close-import-error">&times;</button>
        </div>
        <div class="modal-body">
          <p style="margin-bottom:12px;">${escapeHtml(message)}</p>
          ${errorList.length ? `
            <div style="max-height:260px; overflow-y:auto; border:1px solid var(--border, #e2e2e2); border-radius:6px; padding:10px;">
              <ul style="margin:0; padding-left:18px;">
                ${errorList.map(e => `<li style="margin-bottom:4px;">${escapeHtml(e)}</li>`).join('')}
              </ul>
            </div>` : ''}
        </div>
        <div class="modal-footer">
          <button class="btn btn-primary" id="close-import-error-2">Đã hiểu</button>
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