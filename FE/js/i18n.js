
let currentLang = 'vi';


const DICT = {
  vi: {
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
    'students.subtitle'  : 'Manage student information and track learning results',
    'students.search'    : 'Search by name, ID, email, class...',
    'students.add'       : '+ Add Student',
    'students.template'  : '⬇ Excel Template',
    'students.import'    : '⬆ Import Excel',
    'students.exportXls' : '⬇ Excel',
    'students.exportPdf' : '⬇ PDF',

    // ── Stats cards ──
    'stat.total'         : 'Total Students',
    'stat.active'        : 'Active Students',
    'stat.inactive'      : 'Inactive Students',
    'stat.gpa'           : 'Average GPA',

    // ── Table headers ──
    'th.code'            : 'Student ID',
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
    'filter.allStatus'   : 'All Statuses',
    'filter.allGrade'    : 'All Grades',

    // ── Status values (data from DB) ──
    'status.active'      : 'Active',
    'status.inactive'    : 'Inactive',
    'status.graduated'   : 'Graduated',

    // ── Gender values (data from DB) ──
    'gender.Male'        : 'Male',
    'gender.Female'      : 'Female',
    'gender.Other'       : 'Other',

    // ── Quiz level values (data from DB) ──
    'level.Recall'        : 'Recall',
    'level.Comprehension' : 'Comprehension',
    'level.Application'   : 'Application',
    'level.Higher-Order'  : 'Higher-Order',

    // ── Quiz page ──
    'quiz.title'         : 'Multiple Choice Quiz',
    'quiz.subtitle'      : 'Select filters and start the quiz',
    'quiz.grade'         : 'Grade (leave empty = all)',
    'quiz.count'         : 'Number of Questions',
    'quiz.time'          : 'Quiz Duration (minutes)',
    'quiz.start'         : 'Start Quiz',
    'quiz.submit'        : 'Submit',
    'quiz.retry'         : 'Take Another Quiz',
    'quiz.result.title'  : 'Your Result',
    'quiz.loading'       : 'Loading questions...',
    'quiz.answered'      : 'Answered',
    'quiz.of'            : '/',
    'quiz.questions'     : 'questions',

    // ── Questions bank ──
    'qbank.title'    : 'Question Bank',
    'qbank.subtitle' : 'Manage multiple-choice questions',
    'qbank.search'   : 'Search by code, content...',
    'qbank.template' : '⬇ Question Template',
    'qbank.import'   : '⬆ Import Questions',
    'th.qcode'       : 'Code',
    'th.grade'       : 'Grade',
    'th.topic'       : 'Topic',
    'th.level'       : 'Level',
    'th.content'     : 'Question',
    'th.answer'      : 'Answer',

    // ── Results page ──
    'results.title'      : 'Exam Results',
    'results.subtitle'   : 'View scores of all students',
    'results.search'     : 'Search by Username...',
    'th.score'           : 'Score',
    'th.correct'         : 'Correct',
    'th.total'           : 'Total Questions',
    'th.duration'        : 'Duration',
    'th.submittedAt'     : 'Submitted At',

    // ── Users page ──
    'users.title'    : 'User Management',
    'users.subtitle' : 'Assign permissions and manage system access accounts',

    // ── Buttons chung ──
    'btn.edit'    : 'Edit',
    'btn.delete'  : 'Delete',
    'btn.save'    : 'Save',
    'btn.cancel'  : 'Cancel',
    'btn.close'   : 'Close',
    'btn.confirm' : 'Confirm',
    'btn.logout'  : 'Logout',
    'btn.prev'    : '← Previous',
    'btn.next'    : 'Next →',

    // ── Toast messages ──
    'toast.saveOk'       : 'Saved successfully',
    'toast.deleteOk'     : 'Deleted',
    'toast.importOk'     : 'Imported successfully',
    'toast.exportFail'   : 'Failed to export file',
    'toast.noQuestions'  : 'No matching questions found',
    'toast.submitFail'   : 'Failed to submit',
    'toast.timeUp'       : 'Time is up! The test has been automatically submitted.',
    'toast.importFail'   : 'Import failed',

    // ── Pagination ──
    'page.info'    : 'Page',
    'page.results' : 'results',

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
    'gender.Male'   : 'Male',
    'gender.Female' : 'Female',
    'gender.Other'  : 'Other',

    // ── Quiz level values ──
    'level.Recall'    : 'Recall',
    'level.Comprehension'   : 'Comprehension',
    'level.Application'     : 'Application',
    'level.Higher-Order' : 'Higher-Order',

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


function t(key) {
  return (DICT[currentLang] && DICT[currentLang][key]) || key;
}


function translateValue(type, value) {
  return t(`${type}.${value}`) || value;
}


function applyLang() {
  // Text content
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    el.textContent = t(key);
  });


  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    el.placeholder = t(key);
  });


  const toggleBtn = document.getElementById('lang-toggle-btn');
  if (toggleBtn) toggleBtn.textContent = t('lang.toggle');
}


function toggleLang() {
  currentLang = currentLang === 'vi' ? 'en' : 'vi';
  applyLang();

  document.dispatchEvent(new CustomEvent('langChange', { detail: { lang: currentLang } }));
}


window.t               = t;
window.translateValue  = translateValue;
window.applyLang       = applyLang;
window.toggleLang      = toggleLang;
window.getCurrentLang  = () => currentLang;
