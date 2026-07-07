// ═══════════════════════════════════════════════════════════════════════════
// i18n.js — Internationalization Utility
// Layer  : Utility (không phụ thuộc file nào, được load đầu tiên)
// Dùng   : t('key') để dịch, applyLang() để áp lên DOM, toggleLang() để đổi
// ═══════════════════════════════════════════════════════════════════════════

// ── 1. Trạng thái ngôn ngữ hiện tại ────────────────────────────────────────
// Mặc định là tiếng Việt. Không lưu localStorage theo yêu cầu.
let currentLang = 'vi';

// ── 2. Từ điển ──────────────────────────────────────────────────────────────
// Cấu trúc: { vi: { key: 'text VN' }, en: { key: 'text EN' } }
// Thêm ngôn ngữ mới: thêm 1 block ngang hàng với 'vi' và 'en'
const DICT = {
  vi: {
    // ── Navigation ──
    'nav.students'       : 'Danh sách học sinh',
    'nav.quiz'           : 'Làm bài trắc nghiệm',
    'nav.admin'          : 'Quản trị',
    'nav.users'          : 'Quản lý người dùng',
    'nav.questions'      : 'Ngân hàng câu hỏi',
    'nav.results'        : 'Kết quả bài thi',

    // ── Role ──
    'role.admin'         : 'Quản trị viên',
    'role.user'          : 'Người dùng',

    // ── Students page ──
    'students.title'     : 'Danh sách học sinh',
    'students.subtitle'  : 'Quản lý thông tin và theo dõi kết quả học tập',
    'students.search'    : 'Tìm theo tên, mã số, email, lớp...',
    'students.add'       : '+ Thêm học sinh',
    'students.template'  : '⬇ Mẫu Excel',
    'students.import'    : '⬆ Import Excel',
    'students.exportXls' : '⬇ Excel',
    'students.exportPdf' : '⬇ PDF',

    // ── Stats cards ──
    'stat.total'         : 'Tổng số học sinh',
    'stat.active'        : 'Đang học',
    'stat.inactive'      : 'Tạm nghỉ',
    'stat.gpa'           : 'Điểm TB chung',

    // ── Table headers ──
    'th.code'            : 'Mã số',
    'th.name'            : 'Họ tên',
    'th.dob'             : 'Ngày sinh',
    'th.gender'          : 'Giới tính',
    'th.class'           : 'Lớp',
    'th.gpa'             : 'Điểm TB',
    'th.status'          : 'Trạng thái',
    'th.username'        : 'Tên đăng nhập',
    'th.fullname'        : 'Họ tên',
    'th.email'           : 'Email',
    'th.role'            : 'Vai trò',

    // ── Filter ──
    'filter.allStatus'   : 'Tất cả trạng thái',
    'filter.allGrade'    : 'Tất cả khối',

    // ── Status values (dữ liệu từ DB) ──
    'status.active'      : 'Đang học',
    'status.inactive'    : 'Tạm nghỉ',
    'status.graduated'   : 'Đã tốt nghiệp',

    // ── Gender values (dữ liệu từ DB) ──
    'gender.Nam'         : 'Nam',
    'gender.Nữ'          : 'Nữ',
    'gender.Khác'        : 'Khác',

    // ── Quiz level values (dữ liệu từ DB) ──
    'level.Nhận biết'    : 'Nhận biết',
    'level.Thông hiểu'   : 'Thông hiểu',
    'level.Vận dụng'     : 'Vận dụng',
    'level.Vận dụng cao' : 'Vận dụng cao',

    // ── Quiz page ──
    'quiz.title'         : 'Bài tập trắc nghiệm',
    'quiz.subtitle'      : 'Chọn bộ lọc rồi bắt đầu làm bài',
    'quiz.grade'         : 'Khối lớp (để trống = tất cả)',
    'quiz.count'         : 'Số câu hỏi',
    'quiz.time'          : 'Thời gian làm bài (phút)',
    'quiz.start'         : 'Bắt đầu làm bài',
    'quiz.submit'        : 'Nộp bài',
    'quiz.retry'         : 'Làm bài khác',
    'quiz.result.title'  : 'Kết quả của bạn',
    'quiz.loading'       : 'Đang rút câu hỏi...',
    'quiz.answered'      : 'Đã trả lời',
    'quiz.of'            : '/',
    'quiz.questions'     : 'câu',

    // ── Questions bank ──
    'qbank.title'        : 'Ngân hàng câu hỏi',
    'qbank.subtitle'     : 'Quản lý câu hỏi trắc nghiệm',
    'qbank.search'       : 'Tìm theo mã, nội dung...',
    'qbank.template'     : '⬇ Mẫu câu hỏi',
    'qbank.import'       : '⬆ Import câu hỏi',
    'th.qcode'           : 'Mã',
    'th.grade'           : 'Khối',
    'th.topic'           : 'Chủ đề',
    'th.level'           : 'Mức độ',
    'th.content'         : 'Câu hỏi',
    'th.answer'          : 'Đáp án',

    // ── Results page ──
    'results.title'      : 'Kết quả bài thi',
    'results.subtitle'   : 'Xem điểm số của tất cả học sinh',
    'results.search'     : 'Tìm theo tên đăng nhập...',
    'th.score'           : 'Điểm',
    'th.correct'         : 'Đúng',
    'th.total'           : 'Tổng câu',
    'th.duration'        : 'Thời gian làm',
    'th.submittedAt'     : 'Nộp lúc',

    // ── Users page ──
    'users.title'        : 'Quản lý người dùng',
    'users.subtitle'     : 'Cấp quyền và quản lý tài khoản truy cập hệ thống',

    // ── Buttons chung ──
    'btn.edit'           : 'Sửa',
    'btn.delete'         : 'Xóa',
    'btn.save'           : 'Lưu',
    'btn.cancel'         : 'Hủy',
    'btn.close'          : 'Đóng',
    'btn.confirm'        : 'Xác nhận',
    'btn.logout'         : 'Đăng xuất',
    'btn.prev'           : '← Trước',
    'btn.next'           : 'Sau →',

    // ── Toast messages ──
    'toast.saveOk'       : 'Lưu thành công',
    'toast.deleteOk'     : 'Đã xóa',
    'toast.importOk'     : 'Import thành công',
    'toast.exportFail'   : 'Xuất file thất bại',
    'toast.noQuestions'  : 'Không có câu hỏi nào phù hợp',
    'toast.submitFail'   : 'Nộp bài thất bại',
    'toast.timeUp'       : 'Hết giờ! Bài thi đã được tự động nộp.',
    'toast.importFail'   : 'Import thất bại',

    // ── Pagination ──
    'page.info'          : 'Trang',
    'page.results'       : 'kết quả',

    // ── Lang toggle ──
    'lang.toggle'        : 'EN',
  },

  en: {
    // ── Navigation ──
    'nav.students'       : 'Student List',
    'nav.quiz'           : 'Take Quiz',
    'nav.admin'          : 'Administration',
    'nav.users'          : 'User Management',
    'nav.questions'      : 'Question Bank',
    'nav.results'        : 'Exam Results',

    // ── Role ──
    'role.admin'         : 'Administrator',
    'role.user'          : 'User',

    // ── Students page ──
    'students.title'     : 'Student List',
    'students.subtitle'  : 'Manage student information and track academic results',
    'students.search'    : 'Search by name, code, email, class...',
    'students.add'       : '+ Add Student',
    'students.template'  : '⬇ Excel Template',
    'students.import'    : '⬆ Import Excel',
    'students.exportXls' : '⬇ Excel',
    'students.exportPdf' : '⬇ PDF',

    // ── Stats cards ──
    'stat.total'         : 'Total Students',
    'stat.active'        : 'Active',
    'stat.inactive'      : 'On Leave',
    'stat.gpa'           : 'Average GPA',

    // ── Table headers ──
    'th.code'            : 'Code',
    'th.name'            : 'Full Name',
    'th.dob'             : 'Date of Birth',
    'th.gender'          : 'Gender',
    'th.class'           : 'Class',
    'th.gpa'             : 'GPA',
    'th.status'          : 'Status',
    'th.username'        : 'Username',
    'th.fullname'        : 'Full Name',
    'th.email'           : 'Email',
    'th.role'            : 'Role',

    // ── Filter ──
    'filter.allStatus'   : 'All statuses',
    'filter.allGrade'    : 'All grades',

    // ── Status values ──
    'status.active'      : 'Active',
    'status.inactive'    : 'On Leave',
    'status.graduated'   : 'Graduated',

    // ── Gender values ──
    'gender.Nam'         : 'Male',
    'gender.Nữ'          : 'Female',
    'gender.Khác'        : 'Other',

    // ── Quiz level values ──
    'level.Nhận biết'    : 'Recall',
    'level.Thông hiểu'   : 'Comprehension',
    'level.Vận dụng'     : 'Application',
    'level.Vận dụng cao' : 'Higher-Order',

    // ── Quiz page ──
    'quiz.title'         : 'Multiple Choice Quiz',
    'quiz.subtitle'      : 'Set filters then start the quiz',
    'quiz.grade'         : 'Grade (leave blank = all)',
    'quiz.count'         : 'Number of questions',
    'quiz.time'          : 'Time limit (minutes)',
    'quiz.start'         : 'Start Quiz',
    'quiz.submit'        : 'Submit',
    'quiz.retry'         : 'Try Another Quiz',
    'quiz.result.title'  : 'Your Result',
    'quiz.loading'       : 'Drawing questions...',
    'quiz.answered'      : 'Answered',
    'quiz.of'            : '/',
    'quiz.questions'     : 'questions',

    // ── Questions bank ──
    'qbank.title'        : 'Question Bank',
    'qbank.subtitle'     : 'Manage multiple choice questions',
    'qbank.search'       : 'Search by code, content...',
    'qbank.template'     : '⬇ Question Template',
    'qbank.import'       : '⬆ Import Questions',
    'th.qcode'           : 'Code',
    'th.grade'           : 'Grade',
    'th.topic'           : 'Topic',
    'th.level'           : 'Level',
    'th.content'         : 'Question',
    'th.answer'          : 'Answer',

    // ── Results page ──
    'results.title'      : 'Exam Results',
    'results.subtitle'   : 'View scores of all students',
    'results.search'     : 'Search by username...',
    'th.score'           : 'Score',
    'th.correct'         : 'Correct',
    'th.total'           : 'Total',
    'th.duration'        : 'Duration',
    'th.submittedAt'     : 'Submitted At',

    // ── Users page ──
    'users.title'        : 'User Management',
    'users.subtitle'     : 'Grant permissions and manage system accounts',

    // ── Buttons chung ──
    'btn.edit'           : 'Edit',
    'btn.delete'         : 'Delete',
    'btn.save'           : 'Save',
    'btn.cancel'         : 'Cancel',
    'btn.close'          : 'Close',
    'btn.confirm'        : 'Confirm',
    'btn.logout'         : 'Logout',
    'btn.prev'           : '← Prev',
    'btn.next'           : 'Next →',

    // ── Toast messages ──
    'toast.saveOk'       : 'Saved successfully',
    'toast.deleteOk'     : 'Deleted',
    'toast.importOk'     : 'Import successful',
    'toast.exportFail'   : 'Export failed',
    'toast.noQuestions'  : 'No matching questions found',
    'toast.submitFail'   : 'Submission failed',
    'toast.timeUp'       : 'Time\'s up! Quiz auto-submitted.',
    'toast.importFail'   : 'Import failed',

    // ── Pagination ──
    'page.info'          : 'Page',
    'page.results'       : 'results',

    // ── Lang toggle ──
    'lang.toggle'        : 'VI',
  },
};

// ── 3. Hàm t(key) — tra từ điển ────────────────────────────────────────────
// Dùng: t('status.active') → 'Đang học' (VI) hoặc 'Active' (EN)
// Nếu key không tồn tại: trả về chính key đó, không bị lỗi
function t(key) {
  return (DICT[currentLang] && DICT[currentLang][key]) || key;
}

// ── 4. Hàm ttranslateValue(type, value) — dịch giá trị DB ──────────────────
// Dùng cho các giá trị động lấy từ DB như gender, status, level
// Ví dụ: translateValue('status', 'active') → 'Active' (EN)
function translateValue(type, value) {
  return t(`${type}.${value}`) || value;
}

// ── 5. Hàm applyLang() — áp ngôn ngữ lên toàn bộ DOM ──────────────────────
// Quét tất cả element có attribute [data-i18n]
// Thay textContent bằng t(data-i18n)
// Cũng xử lý placeholder nếu có [data-i18n-placeholder]
function applyLang() {
  // Text content
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    el.textContent = t(key);
  });

  // Placeholder cho input
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    el.placeholder = t(key);
  });

  // Nút toggle: cập nhật label ngược lại (đang VI → hiện "EN" và ngược lại)
  const toggleBtn = document.getElementById('lang-toggle-btn');
  if (toggleBtn) toggleBtn.textContent = t('lang.toggle');
}

// ── 6. Hàm toggleLang() — đổi ngôn ngữ ────────────────────────────────────
// Đổi currentLang vi↔en rồi gọi applyLang()
// Các file khác (students.js, quiz.js) cần re-render table sau khi đổi ngôn ngữ
// → chúng sẽ đăng ký lắng nghe event 'langChange' để biết khi nào cần re-render
function toggleLang() {
  currentLang = currentLang === 'vi' ? 'en' : 'vi';
  applyLang();
  // Phát event để các module khác (students.js, quiz.js) biết cần re-render
  document.dispatchEvent(new CustomEvent('langChange', { detail: { lang: currentLang } }));
}

// ── 7. Expose ra global scope ───────────────────────────────────────────────
// Vì project dùng plain JS (không có bundler như webpack),
// các file khác truy cập qua window.t, window.translateValue, window.toggleLang
window.t               = t;
window.translateValue  = translateValue;
window.applyLang       = applyLang;
window.toggleLang      = toggleLang;
window.getCurrentLang  = () => currentLang;
