// ── Quiz state ─────────────────────────────────────────────────────────────
let quizQuestions = [];       // questions drawn from server
let quizAnswers = {};         // { question_id: 'A'|'B'|'C'|'D' }
let quizTimerInterval = null;
let quizTimeLeft = 0;         // seconds

// ── Questions bank pagination ───────────────────────────────────────────────
let qPage = 0;
const Q_PAGE_SIZE = 20;
let qSearch = '';
let qGrade = '';

// ── Results pagination ──────────────────────────────────────────────────────
let resultSearch = '';

// ── Helpers ─────────────────────────────────────────────────────────────────

function escapeQ(str) {
  const d = document.createElement('div');
  d.textContent = str ?? '';
  return d.innerHTML;
}

function fmtTime(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

function fmtDuration(seconds) {
  if (seconds == null) return '—';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m ? `${m}p ${s}s` : `${s}s`;
}

function fmtDatetime(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('vi-VN');
}

// ══════════════════════════════════════════════════════════════════════════════
// STUDENT – QUIZ FLOW
// ══════════════════════════════════════════════════════════════════════════════

document.getElementById('start-quiz-btn').addEventListener('click', startQuiz);
document.getElementById('submit-quiz-btn').addEventListener('click', () => confirmSubmitQuiz());
document.getElementById('retry-quiz-btn').addEventListener('click', resetQuizToSetup);

async function startQuiz() {
  const grade = document.getElementById('quiz-grade-select').value;
  const count = parseInt(document.getElementById('quiz-count-input').value) || 10;
  const minutes = parseInt(document.getElementById('quiz-time-input').value) || 15;

  const btn = document.getElementById('start-quiz-btn');
  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span> Đang rút câu hỏi...';

  try {
    quizQuestions = await api.drawQuestions({ grade: grade || null, count });
  } catch (err) {
    showToast('Không thể tải câu hỏi: ' + err.message, 'error');
    btn.disabled = false;
    btn.textContent = 'Bắt đầu làm bài';
    return;
  }

  quizAnswers = {};
  quizTimeLeft = minutes * 60;

  // Render questions
  renderQuizQuestions();
  document.getElementById('quiz-setup-panel').style.display = 'none';
  document.getElementById('quiz-in-progress').style.display = '';
  document.getElementById('quiz-result-panel').style.display = 'none';

  updateQuizProgress();
  startTimer();

  btn.disabled = false;
  btn.textContent = 'Bắt đầu làm bài';
}

function renderQuizQuestions() {
  const container = document.getElementById('quiz-questions-list');
  container.innerHTML = quizQuestions.map((q, i) => `
    <div class="card quiz-question-card" id="qcard-${q.id}" style="margin-bottom:16px; padding:20px;">
      <div style="font-weight:600; margin-bottom:12px;">
        <span class="badge" style="margin-right:8px; background:var(--primary,#1E3A5F); color:#fff;">${i + 1}</span>
        ${escapeQ(q.content)}
      </div>
      <div class="quiz-options">
        ${['A','B','C','D'].map(letter => `
          <label class="quiz-option" id="opt-${q.id}-${letter}">
            <input type="radio" name="q${q.id}" value="${letter}"
              onchange="selectAnswer(${q.id}, '${letter}')">
            <span class="opt-letter">${letter}</span>
            <span>${escapeQ(q['option_' + letter.toLowerCase()])}</span>
          </label>
        `).join('')}
      </div>
    </div>
  `).join('');
}

window.selectAnswer = function(questionId, letter) {
  quizAnswers[questionId] = letter;
  updateQuizProgress();
  // Highlight selected option
  ['A','B','C','D'].forEach(l => {
    const el = document.getElementById(`opt-${questionId}-${l}`);
    if (el) el.classList.toggle('selected', l === letter);
  });
};

function updateQuizProgress() {
  const answered = Object.keys(quizAnswers).length;
  const total = quizQuestions.length;
  document.getElementById('quiz-progress-label').textContent = `Đã trả lời: ${answered} / ${total} câu`;
}

function startTimer() {
  clearInterval(quizTimerInterval);
  updateTimerDisplay();
  quizTimerInterval = setInterval(() => {
    quizTimeLeft--;
    updateTimerDisplay();
    if (quizTimeLeft <= 0) {
      clearInterval(quizTimerInterval);
      showToast('Hết giờ! Bài thi đã được tự động nộp.', 'warning');
      submitQuiz(true);
    }
  }, 1000);
}

function updateTimerDisplay() {
  const el = document.getElementById('quiz-timer');
  if (!el) return;
  el.textContent = fmtTime(quizTimeLeft);
  el.style.color = quizTimeLeft <= 60
    ? 'var(--danger, #e53e3e)'
    : 'var(--text, #1a202c)';
}

function confirmSubmitQuiz() {
  const answered = Object.keys(quizAnswers).length;
  const total = quizQuestions.length;
  if (answered < total) {
    const modalRoot = document.getElementById('modal-root');
    modalRoot.innerHTML = `
      <div class="modal-overlay" id="submit-confirm-overlay">
        <div class="modal-box" style="max-width:380px;">
          <div class="modal-header">
            <h3>Xác nhận nộp bài</h3>
            <button class="modal-close" id="close-submit-confirm">&times;</button>
          </div>
          <div class="modal-body">
            Bạn mới trả lời <strong>${answered}/${total}</strong> câu.
            Các câu chưa trả lời sẽ bị tính sai. Bạn có chắc muốn nộp không?
          </div>
          <div class="modal-footer">
            <button class="btn btn-outline" id="cancel-submit-btn">Làm tiếp</button>
            <button class="btn btn-danger" id="confirm-submit-btn">Nộp bài</button>
          </div>
        </div>
      </div>`;
    const close = () => { modalRoot.innerHTML = ''; };
    document.getElementById('close-submit-confirm').addEventListener('click', close);
    document.getElementById('cancel-submit-btn').addEventListener('click', close);
    document.getElementById('confirm-submit-btn').addEventListener('click', () => { close(); submitQuiz(false); });
  } else {
    submitQuiz(false);
  }
}

async function submitQuiz(autoSubmit = false) {
  clearInterval(quizTimerInterval);
  const timeSpent = quizQuestions.length > 0
    ? (parseInt(document.getElementById('quiz-time-input').value) * 60 - quizTimeLeft)
    : null;

  const answers = quizQuestions.map(q => ({
    question_id: q.id,
    chosen: quizAnswers[q.id] || 'X',   // 'X' = not answered → will be wrong
  })).filter(a => a.chosen !== 'X');

  // include unanswered as wrong by sending all
  const allAnswers = quizQuestions.map(q => ({
    question_id: q.id,
    chosen: quizAnswers[q.id] || '-',
  }));

  try {
    const result = await api.submitQuiz({ answers: allAnswers, time_spent: timeSpent });
    showQuizResult(result);
  } catch (err) {
    showToast('Nộp bài thất bại: ' + err.message, 'error');
  }
}

function showQuizResult(result) {
  document.getElementById('quiz-in-progress').style.display = 'none';
  document.getElementById('quiz-result-panel').style.display = '';
  document.getElementById('quiz-result-score').textContent = `${result.score.toFixed(1)} / 10`;
  document.getElementById('quiz-result-detail').innerHTML =
    `Đúng <strong>${result.correct}</strong> / ${result.total} câu &nbsp;·&nbsp; Thời gian: ${fmtDuration(result.time_spent)}`;
}

function resetQuizToSetup() {
  quizQuestions = [];
  quizAnswers = {};
  clearInterval(quizTimerInterval);
  document.getElementById('quiz-setup-panel').style.display = '';
  document.getElementById('quiz-in-progress').style.display = 'none';
  document.getElementById('quiz-result-panel').style.display = 'none';
  document.getElementById('quiz-questions-list').innerHTML = '';
}

// ══════════════════════════════════════════════════════════════════════════════
// ADMIN – QUESTION BANK
// ══════════════════════════════════════════════════════════════════════════════

async function loadQuestions() {
  const tbody = document.getElementById('questions-tbody');
  if (!tbody) return;
  tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:30px;">Đang tải...</td></tr>`;
  try {
    const data = await api.getQuestions({
      skip: qPage * Q_PAGE_SIZE,
      limit: Q_PAGE_SIZE,
      search: qSearch || null,
      grade: qGrade || null,
    });
    if (!data.length) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:30px;">Không có câu hỏi nào</td></tr>`;
    } else {
      tbody.innerHTML = data.map(q => `
        <tr data-qid="${q.id}">
          <td class="mono">${escapeQ(q.code)}</td>
          <td>${q.grade}</td>
          <td>${escapeQ(q.topic)}</td>
          <td>${escapeQ(q.level)}</td>
          <td style="max-width:320px; white-space:normal;">${escapeQ(q.content)}</td>
          <td><strong>${escapeQ(q.answer)}</strong></td>
          <td><button class="btn btn-danger btn-sm del-q-btn">Xóa</button></td>
        </tr>`).join('');
      tbody.querySelectorAll('.del-q-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const id = Number(e.target.closest('tr').dataset.qid);
          confirmDeleteQuestion(id);
        });
      });
    }
    document.getElementById('q-pagination-info').textContent =
      `Trang ${qPage + 1} — ${data.length} kết quả`;
    document.getElementById('q-prev-btn').disabled = qPage === 0;
    document.getElementById('q-next-btn').disabled = data.length < Q_PAGE_SIZE;
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;color:red;">${escapeQ(err.message)}</td></tr>`;
  }
}

function confirmDeleteQuestion(id) {
  const modalRoot = document.getElementById('modal-root');
  modalRoot.innerHTML = `
    <div class="modal-overlay" id="del-q-overlay">
      <div class="modal-box" style="max-width:380px;">
        <div class="modal-header"><h3>Xóa câu hỏi</h3>
          <button class="modal-close" id="close-del-q">&times;</button></div>
        <div class="modal-body">Bạn có chắc muốn xóa câu hỏi này?</div>
        <div class="modal-footer">
          <button class="btn btn-outline" id="cancel-del-q">Hủy</button>
          <button class="btn btn-danger" id="confirm-del-q">Xóa</button>
        </div>
      </div>
    </div>`;
  const close = () => { modalRoot.innerHTML = ''; };
  document.getElementById('close-del-q').addEventListener('click', close);
  document.getElementById('cancel-del-q').addEventListener('click', close);
  document.getElementById('confirm-del-q').addEventListener('click', async () => {
    try {
      await api.deleteQuestion(id);
      showToast('Đã xóa câu hỏi', 'success');
      close();
      loadQuestions();
    } catch (err) {
      showToast(err.message, 'error');
    }
  });
}

let qSearchDebounce;
document.getElementById('q-search-input').addEventListener('input', (e) => {
  clearTimeout(qSearchDebounce);
  qSearchDebounce = setTimeout(() => {
    qSearch = e.target.value.trim();
    qPage = 0;
    loadQuestions();
  }, 350);
});

document.getElementById('q-grade-filter').addEventListener('change', (e) => {
  qGrade = e.target.value;
  qPage = 0;
  loadQuestions();
});

document.getElementById('q-prev-btn').addEventListener('click', () => {
  if (qPage > 0) { qPage--; loadQuestions(); }
});
document.getElementById('q-next-btn').addEventListener('click', () => {
  qPage++; loadQuestions();
});

// Import question buttons
document.getElementById('download-q-template-btn').addEventListener('click', async (e) => {
  const btn = e.currentTarget;
  btn.disabled = true;
  try {
    const blob = await api.downloadQuestionTemplate();
    downloadBlob(blob, 'mau-cau-hoi-trac-nghiem.xlsx');
    showToast('Đã tải file mẫu câu hỏi', 'success');
  } catch (err) {
    showToast('Lỗi: ' + err.message, 'error');
  } finally { btn.disabled = false; }
});

document.getElementById('import-q-btn').addEventListener('click', () => {
  document.getElementById('import-q-input').click();
});

document.getElementById('import-q-input').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  e.target.value = '';
  const btn = document.getElementById('import-q-btn');
  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span> Đang import...';
  try {
    const res = await api.importQuestions(file, false);
    showToast(`Import thành công: thêm ${res.added}, cập nhật ${res.updated}, bỏ qua ${res.skipped} câu`, 'success');
    loadQuestions();
  } catch (err) {
    showImportQErrors(err);
  } finally {
    btn.disabled = false;
    btn.textContent = '⬆ Import câu hỏi';
  }
});

function showImportQErrors(err) {
  let message = err.message;
  let errorList = [];
  if (err.detail && typeof err.detail === 'object') {
    message = err.detail.message || message;
    errorList = err.detail.errors || [];
  }
  const modalRoot = document.getElementById('modal-root');
  modalRoot.innerHTML = `
    <div class="modal-overlay" id="import-q-error-overlay">
      <div class="modal-box" style="max-width:560px;">
        <div class="modal-header"><h3>Import thất bại</h3>
          <button class="modal-close" id="close-q-err">&times;</button></div>
        <div class="modal-body">
          <p style="margin-bottom:12px;">${escapeQ(message)}</p>
          ${errorList.length ? `<div style="max-height:260px;overflow-y:auto;border:1px solid #e2e2e2;border-radius:6px;padding:10px;">
            <ul style="margin:0;padding-left:18px;">
              ${errorList.map(e => `<li style="margin-bottom:4px;">${escapeQ(e)}</li>`).join('')}
            </ul></div>` : ''}
        </div>
        <div class="modal-footer">
          <button class="btn btn-primary" id="close-q-err-2">Đã hiểu</button>
        </div>
      </div>
    </div>`;
  const close = () => { modalRoot.innerHTML = ''; };
  document.getElementById('close-q-err').addEventListener('click', close);
  document.getElementById('close-q-err-2').addEventListener('click', close);
  document.getElementById('import-q-error-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'import-q-error-overlay') close();
  });
}

// ══════════════════════════════════════════════════════════════════════════════
// ADMIN – RESULTS
// ══════════════════════════════════════════════════════════════════════════════

async function loadResults() {
  const tbody = document.getElementById('results-tbody');
  if (!tbody) return;
  tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:30px;">Đang tải...</td></tr>`;
  try {
    const data = await api.getResults({ username: resultSearch || null });
    if (!data.length) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:30px;">Chưa có kết quả nào</td></tr>`;
    } else {
      tbody.innerHTML = data.map(r => `
        <tr>
          <td>${escapeQ(r.username)}</td>
          <td><strong>${r.score.toFixed(1)}</strong></td>
          <td>${r.correct}</td>
          <td>${r.total}</td>
          <td>${fmtDuration(r.time_spent)}</td>
          <td>${fmtDatetime(r.submitted_at)}</td>
        </tr>`).join('');
    }
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;color:red;">${escapeQ(err.message)}</td></tr>`;
  }
}

let resultSearchDebounce;
document.getElementById('result-search-input').addEventListener('input', (e) => {
  clearTimeout(resultSearchDebounce);
  resultSearchDebounce = setTimeout(() => {
    resultSearch = e.target.value.trim();
    loadResults();
  }, 350);
});
