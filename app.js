/**
 * 2026학년도 2학기 학교 시간표 종합 시스템 - 핵심 스크립트
 * 모바일 최적화 & 공식 교과별/업무부서별(부장·기획) 명단 반영 & 공강 교집합 회의 추천
 */

// 1. Official Subject Departments (학교 공식 교과별 교사 명단 44명)
const OFFICIAL_DEPARTMENTS = {
  '국어과': ['최호성', '황영애', '전순옥', '이동훈', '전아린', '김지원', '이혜나'],
  '외국어과': ['정동걸', '신인철', '장충걸', '정용', '김형도', '김정은', '이상환'],
  '수학과': ['최진화', '이우석', '김주영', '황정환', '김혜정', '강정아', '박상율'],
  '사회과': ['하정우', '강연선', '정환웅', '안경철', '박태언', '정석원', '임종옥'],
  '과학과': ['양우석', '성경진', '김정현', '박성훈', '유연정', '박주현', '김은영', '박지영'],
  '예체능과': ['김동민', '강봉수', '이장훈', '배수경', '김정열', '이옥임', '정복순', '장성호'],
  '진로과': ['정종혁'],
  '정보과': ['오정훈']
};

const DEPT_ICONS = {
  '국어과': '📚',
  '외국어과': '🌐',
  '수학과': '📐',
  '사회과': '🏛️',
  '과학과': '🧪',
  '예체능과': '🎨',
  '진로과': '🎯',
  '정보과': '💻'
};

// 1-1. Detailed Subject Names per Teacher (교사별 세부 담당 과목)
const OFFICIAL_TEACHER_SUBJECTS = {
  // 외국어과: 이상환 = 일본어, 나머지 = 영어
  '이상환': '일본어',
  '정동걸': '영어',
  '신인철': '영어',
  '장충걸': '영어',
  '정용': '영어',
  '김형도': '영어',
  '김정은': '영어',
  // 예체능과: 장성호 = 체육, 배수경 = 음악, 김정열 = 미술, 나머지 = 체육
  '장성호': '체육',
  '김동민': '체육',
  '강봉수': '체육',
  '이장훈': '체육',
  '이옥임': '체육',
  '정복순': '체육',
  '배수경': '음악',
  '김정열': '미술',
  // 진로
  '정종혁': '진로',
  // 교육정보부
  '오정훈': '정보'
};

const SUBJ_ICONS = {
  '국어': '📚',
  '외국어': '🌐',
  '영어': '🌐',
  '일본어': '🗾',
  '수학': '📐',
  '사회': '🏛️',
  '과학': '🧪',
  '체육': '⚽',
  '음악': '🎵',
  '미술': '🎨',
  '예체능': '🎨',
  '진로': '🎯',
  '정보': '💻'
};

// 2. Official Administrative Departments & Positions (업무 부서별 교사 명단 - 1번째: 부장, 2번째: 기획)
const OFFICIAL_ADMIN_DEPTS = {
  '교무기획부': ['김정현', '정동걸', '강연선', '황정환', '유연정', '박주현'],
  '생활안전부': ['이상환', '이장훈', '김동민', '강봉수', '정복순', '이옥임'],
  '진로상담부': ['정종혁', '김지원', '박태언'],
  '진학지도부': ['이동훈', '김혜정', '이우석'],
  '교육정보부': ['오정훈', '정환웅'],
  '고교학점제부': ['안경철', '정석원', '김형도'],
  '교육평가부': ['박성훈', '김주영', '전아린', '이혜나', '김정은'],
  '인문사회부': ['하정우', '전순옥', '황영애'],
  '과학중점부': ['양우석', '강정아', '성경진', '박상율', '최진화'],
  '1학년부': ['신인철', '배수경'],
  '2학년부': ['장충걸', '김정열'],
  '3학년부': ['정용', '최호성']
};

// 3. Official Assigned Teacher Duties (담당업무)
const OFFICIAL_TEACHER_DUTIES = {
  '강연선': 'NEIS/생기부1',
  '황정환': '일과',
  '박주현': '학적/생기부2',
  '유연정': '출결/시상',
  '김동민': '선도/안전',
  '강봉수': '생활/안전',
  '박태언': '진로',
  '이우석': '추수',
  '김형도': '학점제',
  '전아린': '평가1',
  '이혜나': '평가2',
  '김정은': '성적1',
  '김주영': '기획',
  '황영애': '연수',
  '성경진': '메이커',
  '박상율': '과중',
  '최진화': '수학'
};

// 4. Official Subject Department Heads (교과부장)
const OFFICIAL_SUBJECT_HEADS = {
  '국어과': '최호성',
  '수학과': '최진화',
  '외국어과': '정동걸',
  '사회과': '하정우',
  '과학과': '양우석',
  '예체능과': '김동민'
};

const ADMIN_DEPT_ICONS = {
  '교무기획부': '📋',
  '생활안전부': '🛡️',
  '진로상담부': '🎯',
  '진학지도부': '🧭',
  '교육정보부': '💻',
  '고교학점제부': '🎓',
  '교육평가부': '📊',
  '인문사회부': '📖',
  '과학중점부': '🔬',
  '1학년부': '🌱',
  '2학년부': '🌿',
  '3학년부': '🌳'
};

// 5. Official Assistant Homeroom Teachers (학급별 부담임 교사 명단 20명)
const CLASS_SUB_HOMEROOMS = {
  // 1학년 (6개 학급)
  '1-1': '이장훈',
  '1-2': '이동훈',
  '1-3': '강정아',
  '1-4': '김정은',
  '1-5': '안경철',
  '1-6': '정종혁',
  // 2학년 (7개 학급)
  '2-1': '김형도',
  '2-2': '정복순',
  '2-3': '전아린',
  '2-4': '이상환',
  '2-5': '성경진',
  '2-6': '하정우',
  '2-7': '이우석',
  // 3학년 (7개 학급)
  '3-1': '오정훈',
  '3-2': '최진화',
  '3-3': '황영애',
  '3-4': '박성훈',
  '3-5': '김정현',
  '3-6': '박주현',
  '3-7': '전순옥'
};

const TEACHER_SUB_HOMEROOMS = {
  '이장훈': '1-1',
  '이동훈': '1-2',
  '강정아': '1-3',
  '김정은': '1-4',
  '안경철': '1-5',
  '정종혁': '1-6',
  '김형도': '2-1',
  '정복순': '2-2',
  '전아린': '2-3',
  '이상환': '2-4',
  '성경진': '2-5',
  '하정우': '2-6',
  '이우석': '2-7',
  '오정훈': '3-1',
  '최진화': '3-2',
  '황영애': '3-3',
  '박성훈': '3-4',
  '김정현': '3-5',
  '박주현': '3-6',
  '전순옥': '3-7'
};

function getSubHomeroomForClass(className) {
  return CLASS_SUB_HOMEROOMS[className] || '';
}

function getSubHomeroomForTeacher(teacherName) {
  return TEACHER_SUB_HOMEROOMS[teacherName] || '';
}

// 6. Official Homeroom Teachers (학급별 담임 교사 명단 20명)
const CLASS_HOMEROOMS = {
  '1-1': '신인철', '1-2': '김지원', '1-3': '황정환', '1-4': '유연정', '1-5': '정환웅', '1-6': '배수경',
  '2-1': '장충걸', '2-2': '김정열', '2-3': '이혜나', '2-4': '김동민', '2-5': '양우석', '2-6': '박태언', '2-7': '김혜정',
  '3-1': '정동걸', '3-2': '김주영', '3-3': '정석원', '3-4': '강연선', '3-5': '정용', '3-6': '박상율', '3-7': '최호성'
};

function getHomeroomForClass(className) {
  if (CLASS_HOMEROOMS[className]) return CLASS_HOMEROOMS[className];
  if (AppState.data && AppState.data.teachers) {
    const t = AppState.data.teachers.find(teacher => teacher.homeroom === className);
    if (t) return t.name;
  }
  return '';
}

function getHomeroomForTeacher(teacherName) {
  for (const [cls, tName] of Object.entries(CLASS_HOMEROOMS)) {
    if (tName === teacherName) return cls;
  }
  if (AppState.data && AppState.data.teachers) {
    const t = AppState.data.teachers.find(teacher => teacher.name === teacherName);
    if (t && t.homeroom) return t.homeroom;
  }
  return '';
}


function getTeacherDepartment(teacherName) {
  if (!teacherName) return '';
  for (const [dept, names] of Object.entries(OFFICIAL_DEPARTMENTS)) {
    if (names.includes(teacherName)) return dept;
  }
  return '';
}

function getTeacherSubject(teacherName) {
  if (!teacherName) return '';
  if (OFFICIAL_TEACHER_SUBJECTS[teacherName]) {
    return OFFICIAL_TEACHER_SUBJECTS[teacherName];
  }
  const dept = getTeacherDepartment(teacherName);
  return formatSubjShort(dept);
}

function getTeacherAdminInfo(teacherName) {
  if (!teacherName) return null;
  const duty = OFFICIAL_TEACHER_DUTIES[teacherName];
  for (const [dept, members] of Object.entries(OFFICIAL_ADMIN_DEPTS)) {
    const idx = members.indexOf(teacherName);
    if (idx === 0) return { dept, position: '부장', isHead: true, isPlan: false, isDuty: false, duty: '부장', label: `${dept} 부장` };
    if (idx === 1) return { dept, position: '기획', isHead: false, isPlan: true, isDuty: false, duty: '기획', label: `${dept} 기획` };
    if (idx > 1) {
      const pos = duty || '부원';
      return { dept, position: pos, isHead: false, isPlan: false, isDuty: !!duty, duty: pos, label: `${dept} ${pos}` };
    }
  }
  if (duty) {
    return { dept: '', position: duty, isHead: false, isPlan: false, isDuty: true, duty: duty, label: duty };
  }
  return null;
}

function formatSubjShort(dept) {
  if (!dept) return '';
  return dept.replace(/과$/, '');
}

function formatAdminShort(dept) {
  if (!dept) return '';
  return dept.replace(/부$/, '');
}

// Universal Teacher Sorting Helper
// Default: Korean Alphabetical (가나다순)
// When viewing an Administrative Dept (업무부서): 1st 부장, 2nd 기획, remaining members in 가나다순
function sortTeachersList(teachers, adminDept = null) {
  if (!teachers || teachers.length === 0) return [];
  const list = [...teachers];
  if (adminDept && OFFICIAL_ADMIN_DEPTS[adminDept]) {
    const deptMembers = OFFICIAL_ADMIN_DEPTS[adminDept];
    const headName = deptMembers[0];
    const planName = deptMembers[1];
    return list.sort((a, b) => {
      if (a.name === headName) return -1;
      if (b.name === headName) return 1;
      if (a.name === planName) return -1;
      if (b.name === planName) return 1;
      return a.name.localeCompare(b.name, 'ko');
    });
  }
  return list.sort((a, b) => a.name.localeCompare(b.name, 'ko'));
}

// Google Sheets Live Academic Calendar URLs
const GOOGLE_SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/1ggyWYYaAxecocTBJdqgY6Q7oNh1KICPuwMYHZ232NZU/export?format=csv&gid=352545300';
const GOOGLE_SHEET_VIEW_URL = 'https://docs.google.com/spreadsheets/d/1ggyWYYaAxecocTBJdqgY6Q7oNh1KICPuwMYHZ232NZU/edit?gid=352545300#gid=352545300';

// Application State
const AppState = {
  data: window.SCHOOL_TIMETABLE_DATA || null,
  currentTab: 'calendar', // 'calendar' (default) | 'teacher' | 'class' | 'meeting' | 'free' | 'matrix' | 'live' | 'calendar' | 'upload'
  selectedTeacherId: null,
  selectedClassId: null,
  selectedGrade: 'all', // 'all' | '1' | '2' | '3'
  selectedDay: '월',
  selectedPeriod: '1',

  // Academic Calendar & Changche State (학사일정 및 주차별 창체 운영계획)
  academicCalendar: (window.SCHOOL_TIMETABLE_DATA && window.SCHOOL_TIMETABLE_DATA.academicCalendar) ? window.SCHOOL_TIMETABLE_DATA.academicCalendar : null,
  calendarViewMode: 'week', // 'year' | 'month' | 'week'
  calendarYear: 2026,
  calendarMonth: 9, // 1~12
  calendarWeekDate: '2026-09-04',
  selectedFridayWeekDate: '2026-09-04',
  calendarSelectedDayDetail: null,
  lastCalendarSyncTime: null,
  matrixType: 'teacher', // 'teacher' | 'class'
  matrixFilter: 'all',
  searchQuery: '',
  theme: localStorage.getItem('timetable_theme') || 'light',
  favorites: JSON.parse(localStorage.getItem('timetable_favorites') || '[]'),
  
  // Weather State (기상청 전포동 단기예보)
  weatherDataByDate: {},
  weatherLoaded: false,
  weatherLastFetched: null,
  
  // Teacher Filters & Submenu
  teacherSubmenuOpen: false, // Collapsible submenus on click
  teacherFilterType: 'none', // 'none' | 'all' | 'admin' | 'subject' | 'homeroom' | 'head' | 'plan'
  teacherFilterValue: 'none',
  teacherChosungFilter: 'none', // 'none' (names hidden initially) | 'all' | 'ㄱ' | 'ㄴ' ...
  teacherChipsExpanded: true,

  // Class Submenu
  classSubmenuOpen: false,

  // Free Teacher Filter
  freeTeacherDeptFilter: 'all',
  freeTeacherAdminFilter: 'all',

  // Mobile View Specific State
  viewMode: window.innerWidth <= 768 ? 'card' : 'table', // 'card' | 'table'
  mobileSelectedDay: '월',

  // Meeting Finder State
  meetingPresetCategory: 'admin', // 'admin' | 'role' | 'subject' | 'grade' | 'all'
  meetingSelectedTeachers: [], // Array of teacher IDs
  meetingActivePreset: '',
  meetingActivePresetTitle: '',
  meetingSelectedSlot: null, // { day: '월', period: 1 }
  meetingRecDay: 'all', // 'all' | '월' | '화' | '수' | '목' | '금'

  // Student Timetable State ('지금 우리 학생은')
  studentSubmenuOpen: false, // Collapsible student submenus on click
  selectedStudentId: '',
  studentSearchQuery: '',
  studentSelectedGrade: 'all', // 'all' | '1' | '2' | '3'
  studentSelectedClass: 'all', // 'all' | '1' ~ '7'
  studentChosung: 'none', // 'none' (names hidden initially) | 'all' | 'ㄱ' | 'ㄴ' ...
  studentSimTime: 'real', // 'real' | '금_6' | '월_1' | '화_2' 등 시뮬레이션

  // Standard Bell Schedule (부산동고등학교 공식 일과 시간표)
  bellSchedule: [
    { period: 1, start: '08:20', end: '09:10', label: '1교시' },
    { period: 2, start: '09:20', end: '10:10', label: '2교시' },
    { period: 3, start: '10:20', end: '11:10', label: '3교시' },
    { period: 4, start: '11:20', end: '12:10', label: '4교시' },
    { period: 0, start: '12:10', end: '13:10', label: '점심시간' },
    { period: 5, start: '13:10', end: '14:00', label: '5교시' },
    { period: 6, start: '14:10', end: '15:00', label: '6교시' },
    { period: 7, start: '15:10', end: '16:00', label: '7교시' }
  ]
};

// Days of week & Periods
const DAYS = ['월', '화', '수', '목', '금'];
const PERIODS = [1, 2, 3, 4, 5, 6, 7];
const CHOSUNG_LIST = ['all', 'ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅅ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];

// Korean Initial Consonant Extraction
function getChosung(str) {
  if (!str) return '';
  const chosung = ['ㄱ','ㄲ','ㄴ','ㄷ','ㄸ','ㄹ','ㅁ','ㅂ','ㅃ','ㅅ','ㅆ','ㅇ','ㅈ','ㅉ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'];
  const code = str.charCodeAt(0) - 44032;
  if (code > -1 && code < 11172) {
    const idx = Math.floor(code / 588);
    const ch = chosung[idx];
    if (ch === 'ㄲ') return 'ㄱ';
    if (ch === 'ㄸ') return 'ㄷ';
    if (ch === 'ㅃ') return 'ㅂ';
    if (ch === 'ㅆ') return 'ㅅ';
    if (ch === 'ㅉ') return 'ㅈ';
    return ch;
  }
  return str.charAt(0);
}

function getFullChosung(str) {
  if (!str) return '';
  return Array.from(str).map(ch => getChosung(ch)).join('');
}

// Subject Category Classification
function getSubjectCategory(subject) {
  if (!subject) return '';
  const s = subject.trim();

  if (s.includes('국어') || s.includes('문학') || s.includes('독서') || s.includes('화작') || s.includes('언매')) return 'cat-korean';
  if (s.includes('수학') || s.includes('수Ⅰ') || s.includes('수Ⅱ') || s.includes('미적') || s.includes('확통') || s.includes('기하')) return 'cat-math';
  if (s.includes('영어') || s.includes('영독') || s.includes('영작')) return 'cat-english';
  if (s.includes('통과') || s.includes('과탐') || s.includes('물리') || s.includes('화학') || s.includes('생명') || s.includes('지구') || s.includes('세포') || s.includes('융합')) return 'cat-science';
  if (s.includes('통사') || s.includes('한국사') || s.includes('지리') || s.includes('역사') || s.includes('윤리') || s.includes('정법') || s.includes('경제') || s.includes('사회')) return 'cat-social';
  if (s.includes('음악') || s.includes('미술') || s.includes('체육') || s.includes('체전') || s.includes('스포츠')) return 'cat-arts';
  if (s.includes('진로') || s.includes('진직') || s.includes('창체') || s.includes('자율') || s.includes('동아리') || s.includes('봉사') || s.includes('홈베')) return 'cat-special';
  if (s.includes('감독')) return 'cat-supervision';
  if (/^[A-I][23]/.test(s) || s.includes('선택') || s.includes('일본')) return 'cat-elective';

  return 'cat-special';
}

// Extract grade number (1, 2, 3) from homeroom name
function getGradeFromHomeroom(homeroom) {
  if (!homeroom) return '';
  const m = homeroom.match(/^([1-3])/);
  return m ? m[1] : '';
}

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  setupEventListeners();
  
  if (AppState.data) {
    initDefaultSelections();
    renderApp();
  } else {
    fetch('timetable_data.json')
      .then(res => res.json())
      .then(json => {
        AppState.data = json;
        window.SCHOOL_TIMETABLE_DATA = json;
        initDefaultSelections();
        renderApp();
      })
      .catch(err => {
        console.warn('Could not load timetable_data.json automatically:', err);
        renderUploadOnlyView();
      });
  }

  setInterval(updateLiveClock, 1000);

  // Auto-sync Google Sheet in background on startup
  setTimeout(() => {
    if (typeof syncGoogleSheetCalendar === 'function') {
      syncGoogleSheetCalendar(false);
    }
  }, 300);

  // Pre-fetch today's meal from NEIS in background on startup
  setTimeout(() => {
    if (typeof loadTodayMealInfo === 'function') {
      loadTodayMealInfo();
    }
  }, 350);

  // Pre-fetch Jeonpo-dong weather from KMA in background on startup
  setTimeout(() => {
    if (typeof fetchJeonpoWeather === 'function') {
      fetchJeonpoWeather(false);
    }
  }, 400);

  // Auto-sync on window focus if > 5 minutes passed
  window.addEventListener('focus', () => {
    if (AppState.lastCalendarSyncTime && (Date.now() - AppState.lastCalendarSyncTime.getTime() > 5 * 60 * 1000)) {
      if (typeof syncGoogleSheetCalendar === 'function') {
        syncGoogleSheetCalendar(false);
      }
    }
  });

  // Auto-sync periodically every 15 minutes
  setInterval(() => {
    if (typeof syncGoogleSheetCalendar === 'function') {
      syncGoogleSheetCalendar(false);
    }
  }, 15 * 60 * 1000);
});

function initTheme() {
  document.documentElement.setAttribute('data-theme', AppState.theme);
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  if (themeToggleBtn) {
    themeToggleBtn.innerHTML = AppState.theme === 'dark' ? '☀️' : '🌙';
  }
}

function toggleTheme() {
  AppState.theme = AppState.theme === 'dark' ? 'light' : 'dark';
  localStorage.setItem('timetable_theme', AppState.theme);
  initTheme();
}

function initDefaultSelections() {
  // Keep selections null initially as requested: do not force-display any arbitrary teacher, class, or student
  AppState.selectedTeacherId = null;
  AppState.selectedClassId = null;
  AppState.selectedStudentId = null;

  // Submenus should default to CLOSED on initial load as requested
  AppState.teacherSubmenuOpen = false;
  AppState.classSubmenuOpen = false;
  AppState.studentSubmenuOpen = false;

  // Meeting tab also starts with NO preset/teachers selected initially as requested
  AppState.meetingSelectedTeachers = [];
  AppState.meetingActivePreset = '';
  AppState.meetingActivePresetTitle = '';
  
  const todayIdx = new Date().getDay();
  if (todayIdx >= 1 && todayIdx <= 5) {
    AppState.selectedDay = DAYS[todayIdx - 1];
    AppState.mobileSelectedDay = DAYS[todayIdx - 1];
  }
}

function setupEventListeners() {
  document.querySelectorAll('.nav-tab-btn, .mobile-nav-item').forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      if (!tab) return;
      if (tab === 'teacher') {
        if (AppState.currentTab === 'teacher') {
          toggleTeacherSubmenu();
          return;
        } else {
          AppState.teacherSubmenuOpen = false;
        }
      } else if (tab === 'student') {
        if (AppState.currentTab === 'student') {
          toggleStudentSubmenu();
          return;
        } else {
          AppState.studentSubmenuOpen = false;
        }
      } else if (tab === 'class') {
        if (AppState.currentTab === 'class') {
          toggleClassSubmenu();
          return;
        } else {
          AppState.classSubmenuOpen = false;
        }
      }
      switchTab(tab);
    });
  });

  const searchInput = document.getElementById('globalSearchInput');
  if (searchInput) {
    searchInput.addEventListener('input', handleSearchInput);
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        executeGlobalSearch(e.target.value);
      } else if (e.key === 'Escape') {
        closeSearchDropdown();
      }
    });
    searchInput.addEventListener('focus', (e) => {
      if (e.target.value.trim()) handleSearchInput(e);
    });
  }

  const searchClearBtn = document.getElementById('globalSearchClearBtn');
  if (searchClearBtn) {
    searchClearBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      resetGlobalSearch();
    });
  }

  document.addEventListener('click', (e) => {
    const container = document.getElementById('globalSearchContainer');
    if (container && !container.contains(e.target)) {
      closeSearchDropdown();
    }
  });

  const themeBtn = document.getElementById('themeToggleBtn');
  if (themeBtn) {
    themeBtn.addEventListener('click', toggleTheme);
  }

  const printBtn = document.getElementById('printBtn');
  if (printBtn) {
    printBtn.addEventListener('click', () => window.print());
  }

  setupDragAndDrop();
}

/* ==========================================================================
   Global Search Engine (교사 · 학반 · 과목 · 학사일정 행사 검색 및 즉각 반응 / 엔터 이동)
   ========================================================================== */

function getEventDDayBadge(dateStr, baseDate = new Date()) {
  const target = new Date(dateStr + 'T00:00:00');
  const b = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate());
  const t = new Date(target.getFullYear(), target.getMonth(), target.getDate());
  const diffTime = t.getTime() - b.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'D-Day 오늘';
  if (diffDays > 0) return `D-${diffDays}`;
  return `D+${Math.abs(diffDays)}`;
}

function searchCalendarEvents(query) {
  if (!query) return [];
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const cal = getAcademicCalendar();
  if (!cal || !cal.calendarDays) return [];

  const matched = [];
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  cal.calendarDays.forEach(d => {
    const rawEvent = d.event || '';
    const isHoliday = d.isHoliday;
    const lines = rawEvent.split('\n').map(l => l.trim()).filter(Boolean);

    // If day is holiday and query matches holiday keywords
    if (isHoliday && (q.includes('공휴일') || q.includes('휴업') || q.includes('휴일') || q === '쉬는날')) {
      const dDayText = getEventDDayBadge(d.date, today);
      matched.push({
        date: d.date,
        year: d.year,
        month: d.month,
        day: d.day,
        dayOfWeek: d.dayOfWeek,
        week: d.week,
        semester: (d.month >= 3 && d.month <= 7) ? '1학기' : '2학기',
        title: rawEvent || '공휴일 / 재량휴업일',
        originalLine: rawEvent,
        categoryBadge: { text: '공휴일', className: 'calendar-event-pill pill-holiday' },
        deptBadges: [],
        dDay: dDayText
      });
      return;
    }

    lines.forEach(line => {
      let isMatch = false;
      const lower = line.toLowerCase();
      const chosung = (typeof getChosung === 'function') ? getChosung(line) : '';
      const fullChosung = (typeof getFullChosung === 'function') ? getFullChosung(line) : '';

      if (lower.includes(q) || (chosung && chosung.includes(q)) || (fullChosung && fullChosung.includes(q))) {
        isMatch = true;
      } else if (q.includes('수능') && (lower.includes('대학수학능력시험') || lower.includes('수능'))) {
        isMatch = true;
      } else if ((q === '학평' || q === '모평' || q === '모의고사') && (lower.includes('학력평가') || lower.includes('모의평가') || lower.includes('학평') || lower.includes('모평'))) {
        isMatch = true;
      } else if ((q === '방학' || q === '방학식') && (lower.includes('방학') || lower.includes('방학식'))) {
        isMatch = true;
      } else if ((q === '개학' || q === '개학식') && (lower.includes('개학') || lower.includes('개학식') || lower.includes('시업식'))) {
        isMatch = true;
      } else if ((q === '졸업' || q === '졸업식') && (lower.includes('졸업') || lower.includes('종업'))) {
        isMatch = true;
      } else if (q === '고사' && (lower.includes('1회고사') || lower.includes('2회고사') || lower.includes('고사'))) {
        isMatch = true;
      } else if (q === '회의' && (lower.includes('교무회의') || lower.includes('협의회') || lower.includes('위원회') || lower.includes('학습공동체'))) {
        isMatch = true;
      }

      if (isMatch) {
        // Extract dept badges
        const deptBadges = (typeof extractDepartmentTagsFromText === 'function') ? extractDepartmentTagsFromText(line) : [];
        let cleanTitle = line.replace(/<[^>]+>/g, '').trim();

        // Determine category badge
        let catBadge = null;
        if (cleanTitle.includes('1회고사') || cleanTitle.includes('2회고사')) {
          catBadge = { text: '1·2회고사', className: 'calendar-event-pill pill-exam' };
        } else if (cleanTitle.includes('수능') || cleanTitle.includes('대학수학능력시험') || cleanTitle.includes('학력평가') || cleanTitle.includes('모의평가')) {
          catBadge = { text: '모의고사/수능', className: 'calendar-event-pill pill-exam-mock' };
        } else if (cleanTitle.includes('방학식') || cleanTitle.includes('개학식') || cleanTitle.includes('입학식') || cleanTitle.includes('졸업식') || cleanTitle.includes('시업식')) {
          catBadge = { text: '학사의식', className: 'school-ceremony-badge' };
        } else if (cleanTitle.includes('회의') || cleanTitle.includes('위원회') || cleanTitle.includes('협의회') || cleanTitle.includes('전학공')) {
          catBadge = { text: '교원회의', className: 'monday-meeting-badge' };
        } else if (isHoliday) {
          catBadge = { text: '공휴일', className: 'calendar-event-pill pill-holiday' };
        }

        const dDayText = getEventDDayBadge(d.date, today);

        matched.push({
          date: d.date,
          year: d.year,
          month: d.month,
          day: d.day,
          dayOfWeek: d.dayOfWeek,
          week: d.week,
          semester: (d.month >= 3 && d.month <= 7) ? '1학기' : '2학기',
          title: cleanTitle,
          originalLine: line,
          categoryBadge: catBadge,
          deptBadges: deptBadges,
          dDay: dDayText
        });
      }
    });
  });

  // Sort upcoming events first (chronological from today), then past events (most recent past first)
  matched.sort((a, b) => {
    const isAUpcoming = a.date >= todayStr;
    const isBUpcoming = b.date >= todayStr;
    if (isAUpcoming && !isBUpcoming) return -1;
    if (!isAUpcoming && isBUpcoming) return 1;
    if (isAUpcoming && isBUpcoming) return a.date.localeCompare(b.date);
    return b.date.localeCompare(a.date);
  });

  return matched;
}

function searchEntities(query) {
  if (!query || !AppState.data) return { teachers: [], classes: [], subjects: [], events: [] };
  const q = query.trim().toLowerCase();
  if (!q) return { teachers: [], classes: [], subjects: [], events: [] };

  // 1. Teachers Match
  const matchedTeachers = AppState.data.teachers.filter(t => {
    const subj = getTeacherSubject(t.name);
    const dept = getTeacherDepartment(t.name);
    const admin = getTeacherAdminInfo(t.name);
    const chosung = getChosung(t.name);
    const fullChosung = getFullChosung(t.name);
    const subH = getSubHomeroomForTeacher(t.name);
    return t.name.toLowerCase().includes(q) ||
           chosung.includes(q) ||
           fullChosung.includes(q) ||
           (t.homeroom && t.homeroom.toLowerCase().includes(q)) ||
           (subH && (subH.toLowerCase().includes(q) || `${subH} 부담임`.includes(q) || (q.includes('부담임') && subH))) ||
           (subj && subj.toLowerCase().includes(q)) ||
           (dept && dept.toLowerCase().includes(q)) ||
           (admin && admin.label.toLowerCase().includes(q)) ||
           hasTeacherSubject(t, q);
  });

  // 2. Classes Match
  const normalizedClassQuery = q.replace(/학년\s*/, '-').replace(/반$/, '');
  const matchedClasses = AppState.data.classes.filter(c => {
    const subH = getSubHomeroomForClass(c.name);
    return c.name.toLowerCase().includes(q) ||
           c.name.toLowerCase().includes(normalizedClassQuery) ||
           (c.homeroom && c.homeroom.toLowerCase().includes(q)) ||
           (subH && subH.toLowerCase().includes(q));
  });

  // 3. Subjects Match
  const subjectList = ['국어', '수학', '외국어', '영어', '일본어', '사회', '과학', '체육', '음악', '미술', '정보', '진로'];
  const matchedSubjects = subjectList.filter(s => s.toLowerCase().includes(q));

  // 4. Students Match ('지금 우리 학생은' 전교생 검색)
  let matchedStudents = [];
  if (AppState.data.students) {
    matchedStudents = AppState.data.students.filter(s => {
      const chosung = getChosung(s.name);
      const fullChosung = getFullChosung(s.name);
      return s.name.toLowerCase().includes(q) ||
             chosung.includes(q) ||
             fullChosung.includes(q) ||
             s.className.toLowerCase().includes(q) ||
             `${s.grade}-${s.classNum}`.includes(q) ||
             `${s.classNum}반`.includes(q) ||
             `${s.studentNum}번`.includes(q);
    });
  }

  // 5. Academic Calendar Events Match
  const matchedEvents = searchCalendarEvents(q);

  return {
    teachers: matchedTeachers,
    classes: matchedClasses,
    subjects: matchedSubjects,
    students: matchedStudents,
    events: matchedEvents
  };
}

function handleSearchInput(e) {
  const query = e.target.value.trim();
  AppState.searchQuery = query.toLowerCase();

  const dropdown = document.getElementById('globalSearchDropdown');
  const clearBtn = document.getElementById('globalSearchClearBtn');
  if (clearBtn) {
    clearBtn.style.display = query ? 'flex' : 'none';
  }

  if (!query) {
    if (dropdown) {
      dropdown.style.display = 'none';
      dropdown.innerHTML = '';
    }
    renderApp();
    return;
  }

  const results = searchEntities(query);
  const totalCount = results.teachers.length + results.classes.length + results.subjects.length + (results.students ? results.students.length : 0) + (results.events ? results.events.length : 0);

  if (totalCount === 0) {
    if (dropdown) {
      dropdown.innerHTML = `
        <div style="padding: 0.85rem; text-align: center; color: var(--text-muted); font-size: 0.85rem;">
          '${escapeHtml(query)}' 검색 결과가 없습니다.
        </div>
      `;
      dropdown.style.display = 'block';
    }
    renderApp();
    return;
  }

  let html = '';

  const renderEventSection = () => {
    if (!results.events || results.events.length === 0) return '';
    let sec = `<div class="search-category-title">📅 학사일정 행사 (${results.events.length})</div>`;
    sec += results.events.slice(0, 6).map(evt => {
      const dDayBadge = evt.dDay ? `<span class="chip-badge" style="font-size:0.7rem; font-weight:700; color:var(--primary); background:rgba(79, 70, 229, 0.08); border-color:rgba(79, 70, 229, 0.25);">${escapeHtml(evt.dDay)}</span>` : '';
      return `
        <div class="search-item" onclick="onSelectSearchCalendarEvent('${evt.date}', '${escapeHtml(evt.title).replace(/'/g, "\\'")}')">
          <div class="search-item-header">
            <div class="search-item-info">
              <span class="search-item-title">${escapeHtml(evt.title)}</span>
              ${evt.categoryBadge ? `<span class="${evt.categoryBadge.className}" style="font-size: 0.7rem; padding: 0.08rem 0.38rem; border-radius: 4px; font-weight: 700;">${escapeHtml(evt.categoryBadge.text)}</span>` : ''}
              ${evt.deptBadges && evt.deptBadges.length > 0 ? evt.deptBadges.map(b => `<span class="calendar-dept-badge ${b.className}" style="font-size: 0.68rem;">${escapeHtml(b.name)}</span>`).join('') : ''}
              ${dDayBadge}
              <span class="chip-badge" style="font-size: 0.72rem; font-weight: 600; background: var(--bg-hover); color: var(--text-secondary);">
                📅 ${evt.year}.${evt.month}.${evt.day}. (${evt.dayOfWeek}) · ${evt.semester} ${evt.week ? evt.week + '주차' : ''}
              </span>
            </div>
            <span class="search-item-action">주별 캘린더 이동 ➔</span>
          </div>
        </div>
      `;
    }).join('');
    if (results.events.length > 6) {
      sec += `
        <div style="padding: 0.35rem 0.85rem; font-size: 0.74rem; color: var(--text-muted); text-align: right; background: var(--bg-hover); border-radius: 0 0 var(--radius-md) var(--radius-md);">
          외 ${results.events.length - 6}건 더 있음 (더 구체적인 행사명이나 날짜로 검색하세요)
        </div>
      `;
    }
    return sec;
  };

  const renderStudentSection = () => {
    if (!results.students || results.students.length === 0) return '';
    const now = new Date();
    const state = getActivePeriodState(now);
    const curP = state.activePeriod;
    let sec = `<div class="search-category-title">🎓 학생 (${results.students.length})</div>`;
    sec += results.students.slice(0, 5).map(s => {
      let liveSummary = '시간표 보기 ➔';
      if (curP && s.schedule && s.schedule[state.todayDayName]) {
        const cell = s.schedule[state.todayDayName][curP.toString()];
        if (cell && !cell.isFree && cell.subject) {
          liveSummary = `🔔 ${curP}교시: ${cell.subject} · 위치: ${cell.room || s.classRoom}`;
        } else {
          liveSummary = `☕ ${curP}교시: 공강 (${s.grade === 3 ? '홈베이스' : s.classRoom})`;
        }
      }
      return `
        <div class="search-item" onclick="onSelectSearchStudent('${s.id}')">
          <div class="search-item-header">
            <div class="search-item-info">
              <span class="search-item-title">${escapeHtml(s.name)}</span>
              <span class="chip-badge" style="font-size: 0.72rem; padding: 0.12rem 0.45rem; font-weight: 600;">${s.className} ${s.studentNum}번</span>
              <span class="chip-badge" style="font-size: 0.72rem; padding: 0.12rem 0.45rem; background: var(--bg-hover);">${s.grade}학년</span>
            </div>
            <span class="search-item-action">시간표 보기 ➔</span>
          </div>
          <div class="search-item-live">
            <span class="live-status-pill ${state.statusBadgeClass}">
              ${liveSummary}
            </span>
          </div>
        </div>
      `;
    }).join('');
    return sec;
  };

  const renderTeacherSection = () => {
    if (!results.teachers || results.teachers.length === 0) return '';
    const now = new Date();
    let sec = `<div class="search-category-title">👨‍🏫 교사 (${results.teachers.length})</div>`;
    sec += results.teachers.slice(0, 5).map(t => {
      const subj = getTeacherSubject(t.name);
      const admin = getTeacherAdminInfo(t.name);
      const live = getTeacherLiveStatus(t, now);
      return `
        <div class="search-item" onclick="onSelectSearchTeacher('${t.name}')">
          <div class="search-item-header">
            <div class="search-item-info">
              <span class="search-item-title">${t.name}</span>
              <span class="badge-subj-${subj}" style="font-size: 0.72rem; padding: 0.12rem 0.45rem; border-radius: 4px; font-weight: 600;">${subj}</span>
              ${admin && admin.position ? `<span class="chip-badge" style="font-size: 0.72rem; padding: 0.12rem 0.45rem;">${admin.dept ? admin.dept + ' ' : ''}${admin.position}</span>` : ''}
              ${t.homeroom ? `<span class="chip-badge" style="font-size: 0.72rem; padding: 0.12rem 0.45rem; font-weight: 600; background: rgba(79, 70, 229, 0.08); color: var(--primary); border-color: rgba(79, 70, 229, 0.25);">${t.homeroom} 담임</span>` : ''}
              ${getSubHomeroomForTeacher(t.name) ? `<span class="chip-badge" style="font-size: 0.72rem; padding: 0.12rem 0.45rem; font-weight: 600; background: #f0fdf4; color: #166534; border-color: #86efac;">${getSubHomeroomForTeacher(t.name)} 부담임</span>` : ''}
            </div>
            <span class="search-item-action">시간표 보기 ➔</span>
          </div>
          ${live ? `
            <div class="search-item-live">
              <span class="live-status-pill ${live.badgeClass}">
                ${live.displayText}
              </span>
            </div>
          ` : ''}
        </div>
      `;
    }).join('');
    return sec;
  };

  const renderClassSection = () => {
    if (!results.classes || results.classes.length === 0) return '';
    let sec = `<div class="search-category-title">🏫 학반 (${results.classes.length})</div>`;
    sec += results.classes.slice(0, 4).map(c => {
      const subH = getSubHomeroomForClass(c.name);
      return `
        <div class="search-item" onclick="onSelectSearchClass('${c.name}')">
          <div class="search-item-header">
            <div class="search-item-info">
              <span class="search-item-title">${c.name}반</span>
              <span class="chip-badge" style="font-size: 0.74rem; background: var(--bg-hover);">담임: ${c.homeroom || '-'}${subH ? ` · 부담임: ${subH}` : ''}</span>
            </div>
            <span class="search-item-action">시간표 보기 ➔</span>
          </div>
        </div>
      `;
    }).join('');
    return sec;
  };

  const renderSubjectSection = () => {
    if (!results.subjects || results.subjects.length === 0) return '';
    let sec = `<div class="search-category-title">📚 교과/과목</div>`;
    sec += results.subjects.slice(0, 3).map(s => {
      return `
        <div class="search-item" onclick="executeGlobalSearch('${s}')">
          <div class="search-item-header">
            <div class="search-item-info">
              <span class="search-item-title">${s}</span>
              <span class="chip-badge" style="font-size: 0.74rem; background: var(--bg-hover);">교과 과목</span>
            </div>
            <span class="search-item-action">과목 교사 보기 ➔</span>
          </div>
        </div>
      `;
    }).join('');
    return sec;
  };

  if (AppState.currentTab === 'calendar') {
    html += renderEventSection();
    html += renderTeacherSection();
    html += renderClassSection();
    html += renderStudentSection();
    html += renderSubjectSection();
  } else if (AppState.currentTab === 'student') {
    html += renderStudentSection();
    html += renderTeacherSection();
    html += renderEventSection();
    html += renderClassSection();
    html += renderSubjectSection();
  } else {
    html += renderTeacherSection();
    html += renderEventSection();
    html += renderClassSection();
    html += renderStudentSection();
    html += renderSubjectSection();
  }

  if (dropdown) {
    dropdown.innerHTML = html;
    dropdown.style.display = 'block';
  }

  // In teacher view, auto-select first match so timetable updates in real time!
  if (AppState.currentTab === 'teacher' && results.teachers.length > 0) {
    if (!results.teachers.some(t => t.id === AppState.selectedTeacherId)) {
      AppState.selectedTeacherId = results.teachers[0].id;
    }
  }
  renderApp();
}

function onSelectSearchTeacher(teacherName) {
  closeSearchDropdown();
  // Clear search query so that the full teacher list is immediately accessible!
  AppState.searchQuery = '';
  const searchInput = document.getElementById('globalSearchInput');
  if (searchInput) searchInput.value = '';
  const clearBtn = document.getElementById('globalSearchClearBtn');
  if (clearBtn) clearBtn.style.display = 'none';

  navigateToTeacher(teacherName);
  showToast(`👨‍🏫 ${teacherName} 선생님 시간표로 이동했습니다.`);
}

function onSelectSearchClass(className) {
  closeSearchDropdown();
  AppState.searchQuery = '';
  const searchInput = document.getElementById('globalSearchInput');
  if (searchInput) searchInput.value = '';
  const clearBtn = document.getElementById('globalSearchClearBtn');
  if (clearBtn) clearBtn.style.display = 'none';

  navigateToClass(className);
  showToast(`🏫 ${className}반 시간표로 이동했습니다.`);
}

function findFridayDateForDay(dateStr) {
  const cal = getAcademicCalendar();
  if (!cal) return dateStr;
  const weeks = getAllCalendarWeeks(cal);
  if (!weeks || weeks.length === 0) return dateStr;

  const exact = weeks.find(w => w.date === dateStr);
  if (exact) return exact.date;

  const targetTime = new Date(dateStr + 'T00:00:00').getTime();
  for (const w of weeks) {
    const fri = new Date(w.date + 'T00:00:00');
    const mon = new Date(fri);
    mon.setDate(fri.getDate() - 4);
    if (targetTime >= mon.getTime() && targetTime <= fri.getTime()) {
      return w.date;
    }
  }

  // Fallback: calculate Friday date directly
  const d = new Date(dateStr + 'T00:00:00');
  const dow = d.getDay();
  let diff = 5 - dow;
  if (dow === 6) diff = -1;
  else if (dow === 0) diff = -2;
  d.setDate(d.getDate() + diff);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const calculated = `${y}-${m}-${day}`;

  const match = weeks.find(w => w.date === calculated);
  if (match) return match.date;

  return weeks[0].date;
}

function onSelectSearchCalendarEvent(dateStr, eventText) {
  closeSearchDropdown();
  AppState.searchQuery = '';
  const searchInput = document.getElementById('globalSearchInput');
  if (searchInput) searchInput.value = '';
  const clearBtn = document.getElementById('globalSearchClearBtn');
  if (clearBtn) clearBtn.style.display = 'none';

  const friDate = findFridayDateForDay(dateStr);
  AppState.calendarWeekDate = friDate;
  AppState.calendarViewMode = 'week';

  switchTab('calendar');

  const parts = dateStr.split('-');
  const m = parseInt(parts[1], 10);
  const d = parseInt(parts[2], 10);
  showToast(`📅 ${m}월 ${d}일 '${eventText || '학사일정'}' 주별 캘린더로 이동했습니다.`);

  setTimeout(() => {
    const col = document.querySelector(`.week-day-col[data-date="${dateStr}"]`);
    if (col) {
      col.classList.add('search-highlight-pulse');
      col.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      setTimeout(() => {
        col.classList.remove('search-highlight-pulse');
      }, 2800);
    }
  }, 150);
}

function closeSearchDropdown() {
  const dropdown = document.getElementById('globalSearchDropdown');
  if (dropdown) {
    dropdown.style.display = 'none';
  }
}

function resetGlobalSearch() {
  AppState.searchQuery = '';
  const searchInput = document.getElementById('globalSearchInput');
  if (searchInput) {
    searchInput.value = '';
  }
  const clearBtn = document.getElementById('globalSearchClearBtn');
  if (clearBtn) {
    clearBtn.style.display = 'none';
  }
  closeSearchDropdown();
  renderApp();
  showToast('검색어가 초기화되어 전체 목록으로 복원되었습니다.');
}


function resetClassFilters() {
  AppState.selectedGrade = 'all';
  resetGlobalSearch();
}

function executeGlobalSearch(query) {
  if (!query || !AppState.data) return;
  const q = query.trim();
  if (!q) return;

  const results = searchEntities(q);

  // Calendar tab priority: if user is on calendar tab and query matches academic event
  if (AppState.currentTab === 'calendar' && results.events && results.events.length > 0) {
    if (results.events.length === 1) {
      onSelectSearchCalendarEvent(results.events[0].date, results.events[0].title);
      return;
    }
    showToast(`📅 '${q}' 관련 행사 ${results.events.length}건이 검색되었습니다. 목록에서 원하는 날짜를 선택하세요.`);
    return;
  }

  const exactStudent = (results.students && results.students.length > 0) ? results.students.find(s => s.name === q) : null;
  const exactTeacher = (results.teachers && results.teachers.length > 0) ? results.teachers.find(t => t.name === q) : null;

  // Prioritize teacher if on teacher tab or if no student match
  if (exactTeacher && (!exactStudent || AppState.currentTab === 'teacher')) {
    AppState.searchQuery = '';
    const searchInput = document.getElementById('globalSearchInput');
    if (searchInput) searchInput.value = '';
    const clearBtn = document.getElementById('globalSearchClearBtn');
    if (clearBtn) clearBtn.style.display = 'none';

    navigateToTeacher(exactTeacher.name);
    showToast(`👨‍🏫 ${exactTeacher.name} 선생님 시간표로 이동했습니다.`);
    closeSearchDropdown();
    return;
  }

  // Exact student name match
  if (exactStudent) {
    AppState.searchQuery = '';
    const searchInput = document.getElementById('globalSearchInput');
    if (searchInput) searchInput.value = '';
    const clearBtn = document.getElementById('globalSearchClearBtn');
    if (clearBtn) clearBtn.style.display = 'none';

    navigateToStudent(exactStudent.id);
    showToast(`🎓 ${exactStudent.className} ${exactStudent.name} 학생 시간표로 이동했습니다.`);
    closeSearchDropdown();
    return;
  }

  // Exact teacher name match fallback (if student tab was active but user typed a unique teacher name)
  if (exactTeacher) {
    AppState.searchQuery = '';
    const searchInput = document.getElementById('globalSearchInput');
    if (searchInput) searchInput.value = '';
    const clearBtn = document.getElementById('globalSearchClearBtn');
    if (clearBtn) clearBtn.style.display = 'none';

    navigateToTeacher(exactTeacher.name);
    showToast(`👨‍🏫 ${exactTeacher.name} 선생님 시간표로 이동했습니다.`);
    closeSearchDropdown();
    return;
  }

  // Exact class match
  const normClass = q.replace(/학년\s*/, '-').replace(/반$/, '');
  const exactClass = results.classes.find(c => c.name === q || c.name === normClass);
  if (exactClass) {
    AppState.searchQuery = '';
    const searchInput = document.getElementById('globalSearchInput');
    if (searchInput) searchInput.value = '';
    const clearBtn = document.getElementById('globalSearchClearBtn');
    if (clearBtn) clearBtn.style.display = 'none';

    navigateToClass(exactClass.name);
    showToast(`🏫 ${exactClass.name}반 시간표로 이동했습니다.`);
    closeSearchDropdown();
    return;
  }

  // If query matches class pattern e.g. "1-", "2-", "3-", "1학년 1반":
  if (/^[1-3][\s\-가-힣0-9]*/.test(q) && results.classes.length > 0) {
    const cls = results.classes[0];
    AppState.searchQuery = '';
    const searchInput = document.getElementById('globalSearchInput');
    if (searchInput) searchInput.value = '';
    const clearBtn = document.getElementById('globalSearchClearBtn');
    if (clearBtn) clearBtn.style.display = 'none';

    navigateToClass(cls.name);
    showToast(`🏫 ${cls.name}반 시간표로 이동했습니다.`);
    closeSearchDropdown();
    return;
  }

  // Teacher match
  if (results.teachers.length > 0) {
    const t = results.teachers[0];
    AppState.searchQuery = q.toLowerCase();
    const clearBtn = document.getElementById('globalSearchClearBtn');
    if (clearBtn) clearBtn.style.display = 'flex';

    navigateToTeacher(t.name);
    showToast(`👨‍🏫 ${t.name} 선생님 시간표로 이동했습니다.`);
    closeSearchDropdown();
    return;
  }

  // Class match
  if (results.classes.length > 0) {
    const cls = results.classes[0];
    AppState.searchQuery = q.toLowerCase();
    const clearBtn = document.getElementById('globalSearchClearBtn');
    if (clearBtn) clearBtn.style.display = 'flex';

    navigateToClass(cls.name);
    showToast(`🏫 ${cls.name}반 시간표로 이동했습니다.`);
    closeSearchDropdown();
    return;
  }

  // Subject match
  if (results.subjects.length > 0) {
    const subj = results.subjects[0];
    const subjTeachers = AppState.data.teachers.filter(t => getTeacherSubject(t.name) === subj || getTeacherDepartment(t.name).includes(subj));
    AppState.searchQuery = subj.toLowerCase();
    const clearBtn = document.getElementById('globalSearchClearBtn');
    if (clearBtn) clearBtn.style.display = 'flex';

    if (subjTeachers.length > 0) {
      navigateToTeacher(subjTeachers[0].name);
      showToast(`📚 '${subj}' 과목 담당 교사 목록을 표시합니다.`);
      closeSearchDropdown();
      return;
    }
  }

  // Academic Event match fallback (if query matches calendar events)
  if (results.events && results.events.length > 0) {
    if (results.events.length === 1) {
      onSelectSearchCalendarEvent(results.events[0].date, results.events[0].title);
      return;
    }
    showToast(`📅 '${q}' 관련 행사 ${results.events.length}건이 검색되었습니다. 목록에서 원하는 날짜를 선택하세요.`);
    return;
  }

  showToast(`'${q}'에 대한 검색 결과를 찾을 수 없습니다.`);
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function onSelectSearchStudent(studentId) {
  closeSearchDropdown();
  AppState.searchQuery = '';
  const searchInput = document.getElementById('globalSearchInput');
  if (searchInput) searchInput.value = '';
  const clearBtn = document.getElementById('globalSearchClearBtn');
  if (clearBtn) clearBtn.style.display = 'none';

  navigateToStudent(studentId);
  if (AppState.data && AppState.data.students) {
    const student = AppState.data.students.find(s => s.id === studentId);
    if (student) {
      showToast(`🎓 ${student.className} ${student.studentNum}번 ${student.name} 학생 시간표로 이동했습니다.`);
    }
  }
}

function switchTab(tab) {
  // Clear active searches when navigating to any menu
  AppState.searchQuery = '';
  const searchInput = document.getElementById('globalSearchInput');
  if (searchInput) searchInput.value = '';
  const clearBtn = document.getElementById('globalSearchClearBtn');
  if (clearBtn) clearBtn.style.display = 'none';
  closeSearchDropdown();

  // Clear student search
  AppState.studentSearchQuery = '';
  const studentSearchInput = document.getElementById('studentSearchInput');
  if (studentSearchInput) studentSearchInput.value = '';
  const studentClearBtn = document.getElementById('studentSearchClearBtn');
  if (studentClearBtn) studentClearBtn.style.display = 'none';

  // Reset matrix filter
  AppState.matrixFilter = 'all';

  // Submenus should start closed when navigating to any tab
  AppState.teacherSubmenuOpen = false;
  AppState.classSubmenuOpen = false;
  AppState.studentSubmenuOpen = false;

  // Note: AppState.meetingSelectedTeachers (공강 교집합 선택 교사 목록) is intentionally
  // preserved as requested, allowing users to keep their mutual free period intersection setup.

  AppState.currentTab = tab;
  if (tab === 'calendar') {
    AppState.calendarViewMode = 'week';
  }
  
  document.querySelectorAll('.nav-tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tab);
  });
  
  document.querySelectorAll('.mobile-nav-item').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tab);
  });

  window.scrollTo({ top: 0, behavior: 'smooth' });
  renderApp();
}

function renderApp() {
  const container = document.getElementById('mainContentArea');
  if (!container) return;

  switch (AppState.currentTab) {
    case 'teacher':
      renderTeacherView(container);
      break;
    case 'class':
      renderClassView(container);
      break;
    case 'student':
      renderStudentView(container);
      break;
    case 'meeting':
      renderMeetingView(container);
      break;
    case 'matrix':
      renderMatrixView(container);
      break;
    case 'free':
      renderFreeTeacherView(container);
      break;
    case 'live':
      renderLiveView(container);
      break;
    case 'upload':
      renderUploadView(container);
      break;
    case 'calendar':
      renderCalendarView(container);
      break;
    default:
      renderTeacherView(container);
  }
}

/* ==========================================================================
   1. 교사별 시간표 뷰 (Teacher View - Mobile & Department Filter)
   ========================================================================== */
function renderTeacherView(container) {
  if (!AppState.data || !AppState.data.teachers) {
    container.innerHTML = `<div class="control-card"><p>시간표 데이터가 없습니다.</p></div>`;
    return;
  }

  const allTeachers = AppState.data.teachers;
  let filteredTeachers = [];

  const isChosungSelected = AppState.teacherChosungFilter && AppState.teacherChosungFilter !== 'none';
  const isTypeSelected = AppState.teacherFilterType && AppState.teacherFilterType !== 'none';

  // Filter logic: Only display names if search query is active OR a category/chosung is selected
  if (AppState.searchQuery) {
    filteredTeachers = allTeachers.filter(t => 
      t.name.toLowerCase().includes(AppState.searchQuery) ||
      (t.homeroom && t.homeroom.toLowerCase().includes(AppState.searchQuery)) ||
      (getTeacherDepartment(t.name) && getTeacherDepartment(t.name).toLowerCase().includes(AppState.searchQuery)) ||
      (getTeacherAdminInfo(t.name) && getTeacherAdminInfo(t.name).label.toLowerCase().includes(AppState.searchQuery)) ||
      hasTeacherSubject(t, AppState.searchQuery)
    );
  } else if (isChosungSelected || isTypeSelected) {
    filteredTeachers = allTeachers;
    if (AppState.teacherFilterType === 'admin') {
      const adminMembers = OFFICIAL_ADMIN_DEPTS[AppState.teacherFilterValue] || [];
      filteredTeachers = filteredTeachers.filter(t => adminMembers.includes(t.name));
    } else if (AppState.teacherFilterType === 'subject') {
      const deptNames = OFFICIAL_DEPARTMENTS[AppState.teacherFilterValue] || [];
      filteredTeachers = filteredTeachers.filter(t => deptNames.includes(t.name));
    } else if (AppState.teacherFilterType === 'homeroom') {
      filteredTeachers = filteredTeachers.filter(t => t.homeroom);
    } else if (AppState.teacherFilterType === 'head') {
      const headNames = Object.values(OFFICIAL_ADMIN_DEPTS).map(m => m[0]);
      filteredTeachers = filteredTeachers.filter(t => headNames.includes(t.name));
    } else if (AppState.teacherFilterType === 'plan') {
      const planNames = Object.values(OFFICIAL_ADMIN_DEPTS).map(m => m[1]);
      filteredTeachers = filteredTeachers.filter(t => planNames.includes(t.name));
    }

    if (AppState.teacherChosungFilter && AppState.teacherChosungFilter !== 'all' && AppState.teacherChosungFilter !== 'none') {
      filteredTeachers = filteredTeachers.filter(t => getChosung(t.name) === AppState.teacherChosungFilter);
    }
  } else {
    // Both are 'none' initially: names are hidden to improve readability!
    filteredTeachers = [];
  }

  // Universal Teacher Sorting (가나다순 / 부서별 부장-기획-가나다순)
  const sortAdminDept = (AppState.teacherFilterType === 'admin' && AppState.teacherFilterValue !== 'all') ? AppState.teacherFilterValue : null;
  filteredTeachers = sortTeachersList(filteredTeachers, sortAdminDept);

  let currentTeacher = AppState.selectedTeacherId ? allTeachers.find(t => t.id === AppState.selectedTeacherId) : null;

  const now = new Date();
  const state = getActivePeriodState(now);
  const todayName = state.todayDayName || getTodayDayName();
  const liveStatus = currentTeacher ? getTeacherLiveStatus(currentTeacher, now) : null;
  const isFavorite = currentTeacher ? AppState.favorites.includes(currentTeacher.id) : false;
  const currentDept = currentTeacher ? getTeacherDepartment(currentTeacher.name) : '';
  const currentDeptIcon = DEPT_ICONS[currentDept] || '👨‍🏫';
  const currentAdmin = currentTeacher ? getTeacherAdminInfo(currentTeacher.name) : null;
  const currentSubj = currentTeacher ? getTeacherSubject(currentTeacher.name) : '';

  let html = '';

    // 1. Top Controls Bar (Compact Title & Actions)
    html += `
      <div class="control-card" style="margin-bottom: 0.85rem; padding: 0.85rem 1.15rem;">
        <div class="control-header" style="margin-bottom: 0; flex-wrap: wrap; gap: 0.75rem;">
          <div class="control-title" style="font-size: 1.15rem;">
            <span>👨‍🏫</span>
            <span><strong>${currentTeacher ? `${currentTeacher.name} 선생님` : '교사별'}</strong> 시간표</span>
            ${currentTeacher && currentTeacher.homeroom ? `<span class="chip-badge">${currentTeacher.homeroom} 담임</span>` : ''}
            ${currentTeacher && getSubHomeroomForTeacher(currentTeacher.name) ? `<span class="chip-badge" style="background: #f0fdf4; color: #166534; border-color: #86efac;">${getSubHomeroomForTeacher(currentTeacher.name)} 부담임</span>` : ''}
            ${currentTeacher ? `
              <button class="icon-btn" onclick="toggleFavorite('${currentTeacher.id}')" title="즐겨찾기" style="font-size: 1.1rem; padding: 0.1rem 0.35rem;">
                ${isFavorite ? '⭐' : '☆'}
              </button>
            ` : ''}
          </div>
          <div class="control-tools">
            <button type="button" class="btn ${AppState.teacherSubmenuOpen ? 'btn-primary' : 'btn-secondary'} toggle-submenu-btn" onclick="toggleTeacherSubmenu()" title="교사 선택 및 부서/초성 메뉴 펼치기/접기">
              ${AppState.teacherSubmenuOpen ? '▲ 교사 목록 닫기' : '👥 교사 목록 펼치기 ▾'}
            </button>
            <div class="view-mode-switcher">
              <button class="view-mode-btn ${AppState.viewMode === 'card' ? 'active' : ''}" onclick="setViewMode('card')">
                📱 요일별 카드
              </button>
              <button class="view-mode-btn ${AppState.viewMode === 'table' ? 'active' : ''}" onclick="setViewMode('table')">
                🌐 전체 5일 표
              </button>
            </div>
            <button class="btn btn-secondary" onclick="window.print()" title="시간표 인쇄 / PDF 출력">
              🖨️ 인쇄
            </button>
            ${currentTeacher ? `
              <button class="btn btn-secondary" onclick="exportCurrentTimetableToCsv('${currentTeacher.name}')" title="CSV 다운로드">
                📥 CSV
              </button>
            ` : ''}
          </div>
        </div>

        <!-- Search Active Indicator & Reset Button -->
        ${AppState.searchQuery ? `
          <div class="search-result-banner" style="margin-top: 0.75rem;">
            <div class="search-result-info">
              <span>🔍</span>
              <span>'<strong>${escapeHtml(AppState.searchQuery)}</strong>' 검색 결과 (<strong>${filteredTeachers.length}명</strong>)</span>
            </div>
            <button class="btn-clear-search" onclick="resetGlobalSearch()" title="검색어 초기화 후 전체 교사 목록 보기">
              ✕ 검색 초기화 (전체 목록)
            </button>
          </div>
        ` : ''}
      </div>

      <!-- Collapsible Teacher Selector & Filter Submenu Drawer -->
      ${AppState.teacherSubmenuOpen ? `
        <div class="control-card teacher-submenu-drawer" id="teacherSubmenuDrawer" style="margin-bottom: 1.25rem;">
          <div class="control-header" style="border-bottom: 1px solid var(--border-color); padding-bottom: 0.65rem; margin-bottom: 0.75rem;">
            <div class="control-title">
              <span>👥</span>
              <span>교사 선택 (부서·초성별 명단)</span>
              ${filteredTeachers.length > 0 ? `<span class="chip-badge">${filteredTeachers.length}명</span>` : ''}
            </div>
            <button type="button" class="btn btn-secondary" onclick="toggleTeacherSubmenu()" style="font-size: 0.78rem; padding: 0.25rem 0.65rem;">
              ▲ 닫기
            </button>
          </div>

          <!-- Filter Group Tabs -->
          <div class="grade-tabs" style="margin-bottom: 0.65rem;">
            <button class="grade-tab-btn ${AppState.teacherFilterType === 'all' || AppState.teacherChosungFilter === 'all' ? 'active' : ''}" onclick="resetTeacherFilters()">
              전체 교사 (${allTeachers.length}명)
            </button>
            <button class="grade-tab-btn ${AppState.teacherFilterType === 'head' ? 'active' : ''}" onclick="setTeacherFilter('head', 'head')">
              👑 부장단 (${Object.keys(OFFICIAL_ADMIN_DEPTS).length}명)
            </button>
            <button class="grade-tab-btn ${AppState.teacherFilterType === 'plan' ? 'active' : ''}" onclick="setTeacherFilter('plan', 'plan')">
              📝 기획단 (${Object.keys(OFFICIAL_ADMIN_DEPTS).length}명)
            </button>
            <button class="grade-tab-btn ${AppState.teacherFilterType === 'homeroom' ? 'active' : ''}" onclick="setTeacherFilter('homeroom', 'homeroom')">
              🏫 담임교사 (20명)
            </button>
          </div>

          <!-- Administrative & Subject Department Tabs -->
          <div style="display: flex; gap: 0.4rem; overflow-x: auto; scrollbar-width: none; padding-bottom: 0.45rem; margin-bottom: 0.5rem;">
            <span style="font-size: 0.75rem; font-weight: 700; color: var(--text-muted); display: flex; align-items: center; white-space: nowrap;">🏢 업무부서:</span>
            ${Object.keys(OFFICIAL_ADMIN_DEPTS).map(dept => `
              <button class="preset-category-btn badge-admin-${dept} ${AppState.teacherFilterType === 'admin' && AppState.teacherFilterValue === dept ? 'active' : ''}" onclick="setTeacherFilter('admin', '${dept}')">
                ${ADMIN_DEPT_ICONS[dept] || ''} ${formatAdminShort(dept)}
              </button>
            `).join('')}
          </div>

          <div style="display: flex; gap: 0.4rem; overflow-x: auto; scrollbar-width: none; padding-bottom: 0.45rem; margin-bottom: 0.65rem;">
            <span style="font-size: 0.75rem; font-weight: 700; color: var(--text-muted); display: flex; align-items: center; white-space: nowrap;">📚 교과부서:</span>
            ${Object.keys(OFFICIAL_DEPARTMENTS).map(dept => `
              <button class="preset-category-btn badge-subj-${dept} ${AppState.teacherFilterType === 'subject' && AppState.teacherFilterValue === dept ? 'active' : ''}" onclick="setTeacherFilter('subject', '${dept}')">
                ${DEPT_ICONS[dept] || ''} ${formatSubjShort(dept)}
              </button>
            `).join('')}
          </div>

          <!-- Chosung Filter Bar -->
          <div class="chosung-filter-bar">
            ${CHOSUNG_LIST.map(ch => `
              <button class="chosung-btn ${AppState.teacherChosungFilter === ch ? 'active' : ''}" onclick="setTeacherChosung('${ch}')">
                ${ch === 'all' ? '전체' : ch}
              </button>
            `).join('')}
          </div>
          
          <!-- Teacher Chips or Empty State Hint -->
          ${filteredTeachers.length > 0 ? `
            <div class="chips-group expanded" style="margin-top: 0.75rem;">
              ${filteredTeachers.map(t => {
                const dept = getTeacherDepartment(t.name);
                const subj = getTeacherSubject(t.name);
                const admin = getTeacherAdminInfo(t.name);
                return `
                  <button class="chip-btn ${t.id === AppState.selectedTeacherId ? 'active' : ''}" onclick="selectTeacher('${t.id}')">
                    ${t.name}
                    ${admin && admin.isHead ? `<span class="role-badge-head">부장</span>` : ''}
                    ${admin && admin.isPlan ? `<span class="role-badge-plan">기획</span>` : ''}
                    ${admin && admin.isDuty ? `<span class="role-badge-duty badge-admin-${admin.dept}">${admin.duty}</span>` : ''}
                    ${subj ? `<span class="chip-badge badge-subj-${subj}" style="font-size:0.7rem;">${subj}</span>` : ''}
                    ${t.homeroom ? `<span class="chip-badge badge-grade-${getGradeFromHomeroom(t.homeroom)}" style="font-size:0.7rem;">${t.homeroom}</span>` : ''}
                    ${getSubHomeroomForTeacher(t.name) ? `<span class="chip-badge" style="font-size:0.68rem; background:#f0fdf4; color:#166534; border: 1px solid #86efac;">${getSubHomeroomForTeacher(t.name)} 부</span>` : ''}
                  </button>
                `;
              }).join('')}
            </div>
          ` : `
            <div class="chosung-hint-box">
              <span style="font-size: 1.1rem; display: block; margin-bottom: 0.25rem;">👆</span>
              <span>위의 <strong>'전체 교사'</strong> 또는 찾으시는 교사의 <strong>'초성(ㄱ, ㄴ, ㄷ...)'</strong>이나 <strong>'부서'</strong>를 누르시면 교사 명단이 나타납니다.</span>
            </div>
          `}
        </div>
      ` : ''}
    `;

    if (currentTeacher) {
      html += `
        <!-- 2. TEACHER LIVE HERO STATUS & CURRENT LOCATION CARD (JEIL SANGDAN!) -->
        ${renderTeacherLiveHeroCard(currentTeacher, todayName, state, now, liveStatus)}

        <!-- 3. Teacher Info Banner -->
        <div class="entity-info-bar">
          <div class="entity-main-meta">
            <div class="entity-avatar">${currentTeacher.name[0]}</div>
            <div class="entity-title-wrap">
              <h2>
                <span>${currentTeacher.name} 선생님</span>
                <button class="icon-btn" onclick="toggleFavorite('${currentTeacher.id}')" title="즐겨찾기">
                  ${isFavorite ? '⭐' : '☆'}
                </button>
              </h2>
              <div style="display: flex; gap: 0.45rem; align-items: center; margin-top: 0.25rem; flex-wrap: wrap;">
                <span class="entity-tag">${AppState.data.schoolYear || '2026학년도'} ${AppState.data.semester || '2학기'}</span>
                
                <!-- Admin Dept & Role / Duty Badge -->
                ${currentAdmin ? `
                  <span class="${currentAdmin.isHead ? 'role-badge-head' : (currentAdmin.isPlan ? 'role-badge-plan' : (currentAdmin.isDuty ? `role-badge-duty badge-admin-${currentAdmin.dept}` : `role-badge-dept badge-admin-${currentAdmin.dept}`))}" style="font-size:0.8rem; padding:0.25rem 0.65rem;">
                    ${ADMIN_DEPT_ICONS[currentAdmin.dept] || '🏢'} ${currentAdmin.dept ? `${currentAdmin.dept} ` : ''}${currentAdmin.position !== '부원' ? `<strong>${currentAdmin.position}</strong>` : ''}
                  </span>
                ` : ''}

                <!-- Subject Dept Badge -->
                ${currentSubj ? `
                  <span class="entity-tag badge-subj-${currentSubj}" style="font-weight: 700;">
                    ${SUBJ_ICONS[currentSubj] || currentDeptIcon || '📚'} ${currentSubj}${currentDept && currentDept !== currentSubj + '과' && currentDept !== currentSubj ? ` (${currentDept})` : ''}
                  </span>
                ` : (currentDept ? `
                  <span class="entity-tag badge-subj-${currentDept}" style="font-weight: 700;">
                    ${currentDeptIcon} ${currentDept}
                  </span>
                ` : '')}

                <!-- Homeroom Badge -->
                ${currentTeacher.homeroom ? `
                  <button class="entity-tag badge-grade-${getGradeFromHomeroom(currentTeacher.homeroom)}" style="border: none; cursor: pointer;" onclick="navigateToClass('${currentTeacher.homeroom}')">
                    🏫 ${currentTeacher.homeroom} 담임 ➔
                  </button>
                ` : ''}

                <!-- Sub-Homeroom Badge -->
                ${getSubHomeroomForTeacher(currentTeacher.name) ? `
                  <button class="entity-tag badge-grade-${getGradeFromHomeroom(getSubHomeroomForTeacher(currentTeacher.name))}" style="background: #f0fdf4; color: #166534; border: 1px solid #86efac; cursor: pointer;" onclick="navigateToClass('${getSubHomeroomForTeacher(currentTeacher.name)}')">
                    🏫 ${getSubHomeroomForTeacher(currentTeacher.name)} 부담임 ➔
                  </button>
                ` : ''}
              </div>
            </div>
          </div>

          <div class="entity-stats">
            <div class="stat-item">
              <div class="stat-val">${currentTeacher.totalHours}</div>
              <div class="stat-label">주당 총 시수</div>
            </div>
            ${DAYS.map(d => `
              <div class="stat-item">
                <div class="stat-val" style="font-size: 1.1rem;">${currentTeacher.hoursByDay[d] || 0}</div>
                <div class="stat-label">${d}요일</div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- 4. Teacher Timetable (Card View or Table View) -->
        ${AppState.viewMode === 'card' ? renderTeacherCardView(currentTeacher, todayName, liveStatus) : renderTeacherTableView(currentTeacher, todayName, liveStatus)}

        <!-- 5. Bottom quick toggle button -->
        <div style="text-align: center; margin-top: 1.5rem; margin-bottom: 1.5rem;">
          <button type="button" class="btn btn-secondary toggle-submenu-btn" onclick="toggleTeacherSubmenu()" style="font-size: 0.88rem; padding: 0.55rem 1.25rem; font-weight: 700; border-radius: var(--radius-full);">
            ${AppState.teacherSubmenuOpen ? '▲ 교사 목록 닫기' : '👥 교사 목록 펼치기 ▾'}
          </button>
        </div>
      `;
    } else {
      html += `
        <div class="empty-selection-card">
          <div class="empty-selection-icon">👨‍🏫</div>
          <div class="empty-selection-title">선택된 선생님이 없습니다</div>
          <div class="empty-selection-desc">
            상단 검색창에서 교사 이름을 검색하시거나, 아래 <strong>[교사 목록 펼치기]</strong> 버튼을 눌러 시간표를 확인하실 선생님을 선택해 주세요.
          </div>
          <button type="button" class="btn btn-primary toggle-submenu-btn" onclick="toggleTeacherSubmenu()" style="font-size: 0.95rem; padding: 0.65rem 1.4rem;">
            ${AppState.teacherSubmenuOpen ? '▲ 교사 목록 닫기' : '👥 교사 목록 펼치기 ▾'}
          </button>
        </div>
      `;
    }

  container.innerHTML = html;
}

/* ==========================================================================
   Active Period State Engine (실시간 교시 / 점심시간 / 쉬는시간 종합 판별)
   ========================================================================== */
function getActivePeriodState(now = new Date()) {
  const curTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  const todayIdx = now.getDay();
  const isWeekday = todayIdx >= 1 && todayIdx <= 5;
  const todayDayName = isWeekday ? DAYS[todayIdx - 1] : null;

  let activePeriod = null;
  let isLunchTime = false;
  let isBreakTime = false;
  let nextPeriod = null;
  let statusText = '';
  let statusBadgeClass = 'status-idle';

  if (!isWeekday) {
    return {
      todayDayName,
      activePeriod: null,
      isLunchTime: false,
      isBreakTime: false,
      nextPeriod: null,
      statusText: '☕ 주말(휴일)입니다.',
      statusBadgeClass: 'status-idle',
      isWeekday: false,
      curTime
    };
  }

  // 1. Check if currently inside a bell schedule period
  for (let b of AppState.bellSchedule) {
    if (curTime >= b.start && (b.period === 7 ? curTime <= b.end : curTime < b.end)) {
      if (b.period === 0) {
        isLunchTime = true;
        statusText = `🍱 점심시간 (${b.start} ~ ${b.end}) 진행 중 · 다음: 5교시 (13:10 시작)`;
        statusBadgeClass = 'status-lunch';
      } else {
        activePeriod = b.period;
        statusText = `🔔 ${b.label} (${b.start} ~ ${b.end}) 수업 진행 중`;
        statusBadgeClass = 'status-active';
      }
      break;
    }
  }

  // 2. If between periods or before/after school
  if (!activePeriod && !isLunchTime) {
    const firstPeriod = AppState.bellSchedule[0];
    const lastPeriod = AppState.bellSchedule[AppState.bellSchedule.length - 1];

    if (curTime < firstPeriod.start) {
      nextPeriod = 1;
      statusText = `🌅 등교 시간 · 1교시 (${firstPeriod.start}) 시작 전`;
      statusBadgeClass = 'status-break';
    } else if (curTime > lastPeriod.end) {
      statusText = `🌙 오늘(${todayDayName}요일) 모든 정규 수업이 종료되었습니다.`;
      statusBadgeClass = 'status-idle';
    } else {
      const next = AppState.bellSchedule.find(b => b.start > curTime);
      if (next) {
        isBreakTime = true;
        nextPeriod = next.period;
        if (next.period === 0) {
          statusText = `☕ 쉬는 시간 · 곧 점심시간 (${next.start} 시작)`;
          statusBadgeClass = 'status-break';
        } else {
          statusText = `☕ 쉬는 시간 · 다음: ${next.label} (${next.start} 곧 시작)`;
          statusBadgeClass = 'status-break';
        }
      }
    }
  }

  return {
    todayDayName,
    activePeriod,
    isLunchTime,
    isBreakTime,
    nextPeriod,
    statusText,
    statusBadgeClass,
    isWeekday,
    curTime
  };
}

// Teacher Special Classroom Resolution Rules (15 Special Location Rules)
const TEACHER_SPECIAL_ROOM_RULES = {
  '이우석': '3층 수학실',
  '최진화': '4층 수학전용실',
  '박성훈': '5층 생물실',
  '김정현': '5층 지구과학실',
  '양우석': '5층 화학실',
  '이상환': '3층 영어전용실',
  '오정훈': '4층 컴퓨터실',
  '성경진': '4층 무한상상실',
  '박주현': '5층 물리실'
};

function isTeacherActive(teacherName, day, period) {
  if (!AppState.data || !AppState.data.teachers) return false;
  const teacher = AppState.data.teachers.find(t => t.name === teacherName);
  if (!teacher || !teacher.schedule) return false;
  const cell = teacher.schedule[day] && teacher.schedule[day][period.toString()];
  return !!(cell && !cell.isFree && cell.subject && cell.subject !== '여유');
}

let _teacherStudentScheduleMap = null;

function getTeacherStudentScheduleMap() {
  if (_teacherStudentScheduleMap) return _teacherStudentScheduleMap;
  if (!AppState.data || !AppState.data.students) return {};

  const map = {};
  AppState.data.students.forEach(s => {
    for (const d of DAYS) {
      for (const p of PERIODS) {
        const sc = s.schedule[d] && s.schedule[d][p.toString()];
        let tName = sc && sc.teacher;
        if (tName === '이상균') tName = '전아린';
        if (tName && !sc.isFree) {
          if (!map[tName]) map[tName] = {};
          if (!map[tName][d]) map[tName][d] = {};
          if (!map[tName][d][p]) map[tName][d][p] = [];
          map[tName][d][p].push({ grade: s.grade, subject: sc.subject, room: sc.room });
        }
      }
    }
  });
  _teacherStudentScheduleMap = map;
  return _teacherStudentScheduleMap;
}

function getTeacherActualRoom(teacherName, day, period, cell) {
  if (!cell || cell.isFree) return null;
  const tName = (teacherName || '').trim();

  // 1. Teacher-based special room rules (전체 학년)
  for (const [t, room] of Object.entries(TEACHER_SPECIAL_ROOM_RULES)) {
    if (tName.includes(t)) {
      // 금요일 5, 6, 7교시 창체/동아리/자율/진로인 경우 학급 교실 우선
      if (day === '금' && (period === 5 || period === 6 || period === 7)) {
        if (cell.subject === '창체' || cell.subject === '동아리' || cell.subject === '진로' || cell.subject === '자율') {
          return null;
        }
      }
      return room;
    }
  }

  // 강봉수 선생님 체전실기 수업은 운동장에서 함
  if (tName.includes('강봉수') && (cell.subject || '').includes('체전실기')) {
    return '운동장';
  }

  // 김정열 선생님 1학년 미술 수업은 3층 미술실에서 함
  if (tName.includes('김정열') && ((cell.subject || '').includes('미술') || (cell.target || '').startsWith('1-'))) {
    return '3층 미술실';
  }

  // 전체 학년 유연정 선생님 수업:
  // 같은 시간에 김정현 선생님 수업이 겹치지 않는다면 5층 지구과학실에서 하고, 김정현 선생님과 겹치는 시간에는 시간표에 표기된 교실에서 수업함
  if (tName.includes('유연정')) {
    if (day === '금' && (period === 5 || period === 6 || period === 7)) {
      return null;
    }
    const kimActive = isTeacherActive('김정현', day, period);
    if (!kimActive) {
      return '5층 지구과학실';
    } else {
      return null; // 겹칠 때는 시간표 교실이므로 차이 없음
    }
  }

  // 2. Look up student schedule data for this teacher at this slot
  const map = getTeacherStudentScheduleMap();
  const stList = map[tName] && map[tName][day] && map[tName][day][period];
  if (stList && stList.length > 0) {
    for (const item of stList) {
      const r = item.room || '';
      if (r.includes('층') || r.includes('운동장') || r.includes('실')) {
        return r;
      }
    }
  }

  // 3. Fallback to Grade / Subject rules based on cell info
  const subj = (cell.subject || '').replace(/\s+/g, '');
  const target = (cell.target || '').trim();
  const gradeMatch = target.match(/^([1-3])-/);
  const grade = gradeMatch ? parseInt(gradeMatch[1], 10) : null;

  if (grade === 1) {
    if (subj.includes('음악')) return '5층 음악실';
    if (subj.includes('체육')) return '운동장';
    if (subj.includes('미술')) return '3층 미술실';
  }
  if (grade === 2 || subj.includes('음악과미디어') || subj.includes('운동과건강') || subj.includes('기초체육전공실기') || subj.includes('미술과매체')) {
    if (subj.includes('음악과미디어')) return '5층 음악실';
    if (subj.includes('운동과건강') || subj.includes('기초체육전공실기')) return '운동장';
    if (subj.includes('미술과매체')) return '3층 미술실';
  }
  if (grade === 3 || subj.includes('스포츠생활') || subj.includes('체전실기')) {
    if (subj.includes('스포츠생활') || subj.includes('체전실기')) return '운동장';
  }

  return null;
}

function isDifferentFromTimetable(target, actualRoom) {
  if (!actualRoom) return false;
  const t = (target || '').trim();
  const a = actualRoom.trim();
  if (!t) return true;
  if (t === a) return false;
  if (a === `${t}반`) return false;
  const m = t.match(/^([1-3])-(\d+)$/);
  if (m && a === `${m[1]}학년 ${m[2]}반`) return false;
  return true;
}

// Track code to real subject resolution helper
function resolveTrackSubject(rawSubject, teacherName, roomName, day, period) {
  const code = (rawSubject || '').trim();
  if (!code || !/^[A-I][23]/.test(code)) {
    return {
      realSubject: code,
      groupCode: '',
      isCoded: false
    };
  }

  // 3학년 화/수/목 7교시 H3
  if (code.startsWith('H3')) {
    return {
      realSubject: '자율/공강',
      groupCode: code,
      isCoded: true
    };
  }

  let tName = (teacherName || '').trim();
  if (tName === '이상균') tName = '전아린';
  let rName = (roomName || '').trim();
  const slot = (day && period) ? `${day}${period}` : '';

  // 1. From student schedules at (teacher, day, period)
  if (tName && day && period) {
    const map = getTeacherStudentScheduleMap();
    const stList = map[tName] && map[tName][day] && map[tName][day][period];
    if (stList && stList.length > 0) {
      for (const item of stList) {
        if (item.subject && !/^[A-I][23]/.test(item.subject)) {
          return {
            realSubject: item.subject,
            groupCode: code,
            isCoded: true
          };
        }
      }
    }
  }

  // 2. From trackSubjectMap in AppState.data
  const trackMap = (AppState.data && AppState.data.trackSubjectMap) || {};
  let found = null;
  if (tName) {
    if (slot) found = trackMap[`${code}|${slot}|${tName}`];
    if (!found) found = trackMap[`${code}|${tName}`];
  }
  if (!found && rName) {
    if (slot) found = trackMap[`${code}|${slot}|${rName}`];
    if (!found) found = trackMap[`${code}|${rName}`];
  }

  if (found) {
    return {
      realSubject: found,
      groupCode: code,
      isCoded: true
    };
  }

  // 3. If no teacher and class view (students dispersed)
  if (!tName) {
    return {
      realSubject: '이동수업',
      groupCode: code,
      isCoded: true
    };
  }

  return {
    realSubject: code,
    groupCode: code,
    isCoded: false
  };
}

/* ==========================================================================
   Teacher Live Status & Current Location Engine
   ========================================================================== */
function getTeacherLiveStatus(teacher, now = new Date()) {
  if (!teacher) return null;
  const state = getActivePeriodState(now);
  const todayName = state.todayDayName || getTodayDayName();
  const curPeriod = state.activePeriod;

  // Check Academic Calendar Holiday
  const todayHolidayEvt = getTodayAcademicEvent(now);
  if (todayHolidayEvt && todayHolidayEvt.isHoliday) {
    return {
      statusType: 'holiday',
      badgeClass: 'status-idle',
      badgeText: '🌴 학사 휴업일',
      periodText: '휴일',
      subjectText: '',
      locationText: todayHolidayEvt.event || '공휴일/휴업일',
      displayText: `🌴 학사 휴업일입니다: ${todayHolidayEvt.event}`,
      subNote: '💡 학사일정에 따른 공식 휴업일로 정규 수업이 진행되지 않습니다.'
    };
  }

  if (!state.isWeekday) {
    return {
      statusType: 'weekend',
      badgeClass: 'status-idle',
      badgeText: '☕ 주말 휴일',
      periodText: '주말',
      subjectText: '',
      locationText: '휴일 (수업 없음)',
      displayText: '☕ 주말(휴일)입니다.',
      subNote: '💡 주말 및 공휴일에는 정규 수업이 없습니다.'
    };
  }

  if (state.isLunchTime) {
    const nextB = AppState.bellSchedule.find(b => b.period === 5);
    const nextCell = (teacher.schedule[todayName] && nextB) ? teacher.schedule[todayName]['5'] : null;
    let nextLoc = '';
    if (nextCell && !nextCell.isFree) {
      const actualRoom = getTeacherActualRoom(teacher.name, todayName, 5, nextCell);
      const trackInfo = resolveTrackSubject(nextCell.subject, teacher.name, nextCell.target, todayName, 5);
      nextLoc = `다음 5교시: ${nextCell.target ? `${nextCell.target}반 ` : ''}(${actualRoom || nextCell.target}) · ${trackInfo.realSubject}`;
    }
    return {
      statusType: 'lunch',
      badgeClass: 'status-lunch',
      badgeText: '🍱 점심 시간',
      periodText: '점심시간',
      subjectText: '',
      locationText: '교내 휴식',
      displayText: `🍱 점심시간 진행 중${nextLoc ? ` · ${nextLoc}` : ''}`,
      subNote: nextLoc || '💡 5교시 수업 준비 및 점심시간 휴식'
    };
  }

  if (curPeriod && curPeriod >= 1 && curPeriod <= 7) {
    const timeInfo = AppState.bellSchedule.find(b => b.period === curPeriod);
    const cell = teacher.schedule[todayName] ? teacher.schedule[todayName][curPeriod.toString()] : null;
    const isFree = !cell || cell.isFree;

    if (isFree) {
      return {
        statusType: 'free',
        badgeClass: 'status-break',
        badgeText: '☕ 공강 시간',
        periodText: `${curPeriod}교시`,
        subjectText: '공강',
        locationText: '교무실 / 교과연구실',
        displayText: `☕ ${curPeriod}교시 (${timeInfo ? `${timeInfo.start}~${timeInfo.end}` : ''}) 공강 · 교무실/연구실`,
        subNote: '💡 현재 공강 시간으로 정규 수업이 없습니다.'
      };
    }

    const actualRoom = getTeacherActualRoom(teacher.name, todayName, curPeriod, cell);
    const trackInfo = resolveTrackSubject(cell.subject, teacher.name, cell.target, todayName, curPeriod);
    const realSubject = trackInfo.realSubject;
    const hasDiffRoom = actualRoom && isDifferentFromTimetable(cell.target, actualRoom);

    let locStr = '';
    if (actualRoom === '운동장') {
      locStr = cell.target ? `${cell.target}반 (운동장)` : '운동장';
    } else if (hasDiffRoom) {
      locStr = `${cell.target}반 (${actualRoom})`;
    } else if (cell.target) {
      locStr = `${cell.target} 교실`;
    } else if (actualRoom) {
      locStr = actualRoom;
    } else {
      locStr = '지정 교실';
    }

    return {
      statusType: 'active',
      badgeClass: 'status-active',
      badgeText: '🔔 수업 진행 중',
      periodText: `${curPeriod}교시`,
      subjectText: realSubject,
      targetClass: cell.target || '',
      actualRoom: actualRoom || cell.target || '',
      locationText: locStr,
      displayText: `🔔 ${curPeriod}교시 (${timeInfo ? `${timeInfo.start}~${timeInfo.end}` : ''}) 수업 진행 중 · 현재 위치: ${locStr} (${realSubject})`,
      subNote: `💡 ${cell.target ? `${cell.target}반 ` : ''}${locStr}에서 '${realSubject}' 수업 진행 중`
    };
  }

  if (state.nextPeriod) {
    const nextB = AppState.bellSchedule.find(b => b.period === state.nextPeriod);
    const nextCell = (teacher.schedule[todayName] && nextB) ? teacher.schedule[todayName][state.nextPeriod.toString()] : null;
    let nextInfo = '';
    let nextLoc = '';
    if (nextCell && !nextCell.isFree) {
      const actualRoom = getTeacherActualRoom(teacher.name, todayName, state.nextPeriod, nextCell);
      const trackInfo = resolveTrackSubject(nextCell.subject, teacher.name, nextCell.target, todayName, state.nextPeriod);
      nextLoc = `${nextCell.target ? `${nextCell.target}반 ` : ''}(${actualRoom || nextCell.target})`;
      nextInfo = `다음 ${state.nextPeriod}교시: ${nextLoc} · ${trackInfo.realSubject}`;
    } else {
      nextInfo = `다음 ${state.nextPeriod}교시: 공강`;
    }
    return {
      statusType: 'break',
      badgeClass: 'status-break',
      badgeText: '⏰ 쉬는 시간',
      periodText: '쉬는시간',
      subjectText: '',
      locationText: nextLoc ? `${nextLoc} 이동 준비` : '교무실 / 연구실',
      displayText: `⏰ 쉬는 시간 · ${nextInfo}`,
      subNote: nextInfo
    };
  }

  return {
    statusType: 'idle',
    badgeClass: 'status-idle',
    badgeText: '🌙 일과 종료',
    periodText: '일과종료',
    subjectText: '',
    locationText: '퇴근 / 일과 후',
    displayText: `🌙 오늘(${todayName}요일) 모든 정규 수업이 종료되었습니다.`,
    subNote: '💡 오늘의 모든 정규 수업 일과가 종료되었습니다.'
  };
}

function renderTeacherLiveHeroCard(teacher, todayName, state, now, liveStatus) {
  if (!liveStatus) liveStatus = getTeacherLiveStatus(teacher, now);
  const isTeaching = liveStatus.statusType === 'active';
  const isFree = liveStatus.statusType === 'free';
  const subj = getTeacherSubject(teacher.name);
  const admin = getTeacherAdminInfo(teacher.name);

  return `
    <div class="student-live-hero-card teacher-live-hero-card" style="background: linear-gradient(135deg, rgba(79, 70, 229, 0.08) 0%, rgba(16, 185, 129, 0.08) 100%); border-color: rgba(79, 70, 229, 0.28); margin-bottom: 1.25rem;">
      <div class="student-hero-header">
        <div class="student-hero-title">
          <span>📍</span>
          <span><strong>${teacher.name}</strong> 선생님 실시간 위치 및 수업 현황</span>
        </div>
        <div class="student-hero-live-badge ${liveStatus.badgeClass}">
          <span class="live-status-dot"></span>
          <span>${liveStatus.badgeText}</span>
          <span class="live-seconds-clock" id="teacherLiveClock">${formatTime(now)}</span>
        </div>
      </div>

      <div class="student-hero-body">
        <div class="student-hero-info">
          <div class="student-hero-status-main">
            <span>${isTeaching ? `🔔 ${liveStatus.periodText}:` : (isFree ? `☕ ${liveStatus.periodText}:` : '')}</span>
            ${isTeaching ? `
              <span class="subject-pill ${getSubjectCategory(liveStatus.subjectText)}" style="font-size: 1.1rem; padding: 0.35rem 0.85rem;">
                ${escapeHtml(liveStatus.subjectText)}
              </span>
              <span class="student-hero-room-badge" style="font-size: 1.05rem; padding: 0.35rem 0.85rem; background: var(--bg-surface-elevated); border: 1.5px solid var(--primary); color: var(--primary); font-weight: 800; border-radius: 8px;">
                📍 현재 위치: <strong>${liveStatus.locationText}</strong>
              </span>
            ` : (isFree ? `
              <span class="subject-pill cat-free" style="font-size: 1.05rem; padding: 0.35rem 0.85rem;">공강 (수업 없음)</span>
              <span class="student-hero-room-badge" style="font-size: 1rem; padding: 0.35rem 0.85rem; background: var(--bg-surface-elevated); border: 1px solid var(--border-color); color: var(--text-secondary); border-radius: 8px;">
                📍 예상 위치: <strong>교무실 / 교과연구실</strong>
              </span>
            ` : `
              <span style="font-size: 1rem; font-weight: 700; color: var(--text-primary);">${liveStatus.displayText}</span>
            `)}
          </div>
          <div class="student-hero-sub">
            <span>담당: <strong>${subj || '교과'}</strong></span>
            ${teacher.homeroom ? `<span>•</span><span><strong>${teacher.homeroom} 담임</strong></span>` : ''}
            ${getSubHomeroomForTeacher(teacher.name) ? `<span>•</span><span style="color:#166534;"><strong>${getSubHomeroomForTeacher(teacher.name)} 부담임</strong></span>` : ''}
            ${admin && admin.position ? `<span>•</span><span>${admin.dept ? admin.dept + ' ' : ''}${admin.position}</span>` : ''}
            <span>•</span>
            <span>${liveStatus.subNote}</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderTeacherCardView(teacher, todayName, liveStatus) {
  const currentDay = AppState.mobileSelectedDay;
  const now = new Date();
  const state = getActivePeriodState(now);
  if (!liveStatus) liveStatus = getTeacherLiveStatus(teacher, now);

  return `
    <!-- Timetable Live Status Banner -->
    <div class="timetable-live-status-bar">
      <span class="live-status-dot"></span>
      <span>⏰ <strong>현재 실시간:</strong> <span id="timetableLiveDateText">${now.getMonth() + 1}월 ${now.getDate()}일 (${todayName}요일)</span> <span id="timetableLiveClock" class="live-seconds-clock">${formatTime(now)}</span></span>
      <span id="timetableLiveStatusPill" class="live-status-pill ${liveStatus ? liveStatus.badgeClass : state.statusBadgeClass}">
        ${liveStatus ? liveStatus.displayText : state.statusText}
      </span>
    </div>

    ${renderFridayChangcheSelectorBar()}
    <div class="mobile-day-tabs">
      ${DAYS.map(day => `
        <button class="mobile-day-tab ${day === currentDay ? 'active' : ''} ${day === todayName ? 'today-marker' : ''}" onclick="setMobileDay('${day}')">
          <span>${day}요일</span>
          <span style="font-size: 0.72rem; font-weight: 500;">${teacher.hoursByDay[day] || 0}시간</span>
        </button>
      `).join('')}
    </div>

    <div class="mobile-period-list">
      ${PERIODS.map(period => {
        const timeInfo = AppState.bellSchedule.find(b => b.period === period);
        const cell = teacher.schedule[currentDay] ? teacher.schedule[currentDay][period.toString()] : null;

        // Dynamic Friday Changche for Teacher Card
        let isTeacherChangche = false;
        let teacherChangcheInfo = null;
        if (currentDay === '금' && period >= 5) {
          teacherChangcheInfo = getTeacherFridayChangche(teacher, period, AppState.selectedFridayWeekDate);
          if (teacherChangcheInfo) isTeacherChangche = true;
        }

        const isFree = isTeacherChangche ? false : (!cell || cell.isFree);
        const trackInfo = (!isFree && !isTeacherChangche) ? resolveTrackSubject(cell.subject, teacher.name, cell.target, currentDay, period) : null;
        const cat = isTeacherChangche ? teacherChangcheInfo.category : (!isFree ? getSubjectCategory(trackInfo.realSubject) : '');
        const isToday = (currentDay === todayName);
        const actualRoom = (!isFree && !isTeacherChangche) ? getTeacherActualRoom(teacher.name, currentDay, period, cell) : null;
        const hasDiffRoom = actualRoom && isDifferentFromTimetable(cell ? cell.target : '', actualRoom);
        
        let isCurrentSlot = false;
        let isUpcomingSlot = false;
        let badgeHtml = '';

        if (isToday) {
          if (state.activePeriod === period) {
            isCurrentSlot = true;
            badgeHtml = `<div style="margin-bottom:0.25rem;"><span class="current-slot-badge">🔔 지금 (${period}교시 진행 중)</span></div>`;
          } else if (state.isBreakTime && state.nextPeriod === period) {
            isUpcomingSlot = true;
            badgeHtml = `<div style="margin-bottom:0.25rem;"><span class="upcoming-slot-badge">☕ 곧 시작 (${period}교시)</span></div>`;
          } else if (state.isLunchTime && period === 5) {
            isUpcomingSlot = true;
            badgeHtml = `<div style="margin-bottom:0.25rem;"><span class="upcoming-slot-badge">다음 수업 (5교시 13:10 시작)</span></div>`;
          }
        }

        let itemHtml = `
          <div class="mobile-period-card ${isCurrentSlot ? 'is-current is-current-slot' : ''} ${isUpcomingSlot ? 'is-upcoming-slot' : ''}">
            <div class="mobile-period-left">
              <div class="mobile-period-badge">
                <span>${period}</span>
                <span class="mobile-period-time">${timeInfo ? timeInfo.start : ''}</span>
              </div>
              <div>
                ${badgeHtml}
                ${isTeacherChangche ? `
                  <div class="mobile-period-subject">
                    <span class="subject-pill ${cat}">${teacherChangcheInfo.subject}</span>
                  </div>
                  <div style="font-size: 0.78rem; color: var(--text-muted); margin-top: 0.15rem;">
                    ${timeInfo ? `${timeInfo.start} ~ ${timeInfo.end}` : ''} · ${teacherChangcheInfo.note}
                  </div>
                ` : (isFree ? `
                  <div class="mobile-period-subject" style="color: var(--text-muted); font-size: 0.95rem;">
                    <span>${currentDay === '금' && period >= 5 ? '🎯' : '🌿'}</span>
                    <span>${currentDay === '금' && period >= 5 ? '창체·동아리 활동' : (cell && cell.subject === '여유' ? '여유 시간' : '공강 (수업 없음)')}</span>
                  </div>
                ` : `
                  <div class="mobile-period-subject">
                    <span class="subject-pill ${cat}">${trackInfo.realSubject}${trackInfo.isCoded ? ` <span class="group-code-tag">(${trackInfo.groupCode})</span>` : ''}</span>
                  </div>
                  <div style="font-size: 0.78rem; color: var(--text-muted); margin-top: 0.15rem;">
                    ${timeInfo ? `${timeInfo.start} ~ ${timeInfo.end}` : ''}
                  </div>
                `)}
              </div>
            </div>

            <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 0.25rem;">
              ${isTeacherChangche ? `
                <button class="target-badge" style="font-size: 0.88rem; padding: 0.35rem 0.75rem;" onclick="navigateToClass('${teacherChangcheInfo.target}')">
                  🏫 ${teacherChangcheInfo.target}반 ➔
                </button>
              ` : (!isFree && cell && cell.target ? `
                <button class="target-badge" style="font-size: 0.88rem; padding: 0.35rem 0.75rem;" onclick="navigateToClass('${cell.target}')">
                  🏫 ${cell.target}반 ➔
                </button>
              ` : '')}
              ${hasDiffRoom ? `
                <span class="teacher-actual-room" title="실제 수업 장소: ${actualRoom}">(${actualRoom})</span>
              ` : ''}
            </div>
          </div>
        `;

        if (period === 4) {
          const isLunchNow = isToday && state.isLunchTime;
          itemHtml += `
            <div class="mobile-period-card ${isLunchNow ? 'is-current is-current-lunch' : ''}" style="background: var(--bg-hover); padding: 0.65rem 1rem; border: 1px dashed var(--border-color);">
              <div style="display:flex; align-items:center; justify-content:space-between; width:100%;">
                <span style="font-weight:700; font-size:0.88rem;">🍱 점심시간 (12:10 ~ 13:10)</span>
                ${isLunchNow ? '<span class="current-lunch-badge">🔔 지금 진행 중</span>' : ''}
              </div>
            </div>
          `;
        }

        return itemHtml;
      }).join('')}
    </div>
  `;
}

function renderTeacherTableView(teacher, todayName, liveStatus) {
  const now = new Date();
  const state = getActivePeriodState(now);
  const curPeriodNum = state.activePeriod;
  if (!liveStatus) liveStatus = getTeacherLiveStatus(teacher, now);

  return `
    <!-- Timetable Live Status Banner -->
    <div class="timetable-live-status-bar">
      <span class="live-status-dot"></span>
      <span>⏰ <strong>현재 실시간:</strong> <span id="timetableLiveDateText">${now.getMonth() + 1}월 ${now.getDate()}일 (${todayName}요일)</span> <span id="timetableLiveClock" class="live-seconds-clock">${formatTime(now)}</span></span>
      <span id="timetableLiveStatusPill" class="live-status-pill ${liveStatus ? liveStatus.badgeClass : state.statusBadgeClass}">
        ${liveStatus ? liveStatus.displayText : state.statusText}
      </span>
    </div>

    ${renderFridayChangcheSelectorBar()}
    <div class="timetable-card">
      <table class="timetable-grid">
        <thead>
          <tr>
            <th class="period-col">교시</th>
            ${DAYS.map(day => `
              <th class="day-col ${day === todayName ? 'today' : ''}">
                ${day}요일 ${day === todayName ? '<span style="font-size:0.75rem; color:var(--primary); font-weight:800;">(오늘)</span>' : ''}
              </th>
            `).join('')}
          </tr>
        </thead>
        <tbody>
          ${PERIODS.map(period => {
            const timeInfo = AppState.bellSchedule.find(b => b.period === period);
            const isCurPeriodRow = (curPeriodNum === period);

            let rowHtml = `
              <tr>
                <td class="period-col ${isCurPeriodRow ? 'current-period-head' : ''}">
                  <div class="period-cell-header">
                    <span class="period-num">${period}</span>
                    <span class="period-time">${timeInfo ? timeInfo.start : ''}</span>
                    ${isCurPeriodRow ? '<span style="font-size:0.65rem; color:var(--primary); font-weight:800;">지금</span>' : ''}
                  </div>
                </td>
                ${DAYS.map(day => {
                  const cell = teacher.schedule[day] ? teacher.schedule[day][period.toString()] : null;
                  const isToday = day === todayName;
                  
                  let isCurrentSlot = false;
                  let isUpcomingSlot = false;
                  let slotBadge = '';

                  if (isToday) {
                    if (state.activePeriod === period) {
                      isCurrentSlot = true;
                      slotBadge = `<span class="current-slot-badge">🔔 지금 (${period}교시)</span>`;
                    } else if (state.isBreakTime && state.nextPeriod === period) {
                      isUpcomingSlot = true;
                      slotBadge = `<span class="upcoming-slot-badge">☕ 곧 시작 (${period}교시)</span>`;
                    } else if (state.isLunchTime && period === 5) {
                      isUpcomingSlot = true;
                      slotBadge = `<span class="upcoming-slot-badge">다음 수업 (13:10)</span>`;
                    }
                  }

                  const cellClass = `timetable-cell ${isToday ? 'is-today' : ''} ${isCurrentSlot ? 'is-current-slot' : ''} ${isUpcomingSlot ? 'is-upcoming-slot' : ''}`;

                  // Dynamic Friday Changche Override for Teachers
                  if (day === '금' && period >= 5) {
                    const changcheInfo = getTeacherFridayChangche(teacher, period, AppState.selectedFridayWeekDate);
                    if (changcheInfo) {
                      return `
                        <td class="${cellClass}">
                          <div class="cell-content">
                            ${slotBadge}
                            <span class="subject-pill ${changcheInfo.category}">${changcheInfo.subject}</span>
                            <button class="target-badge" onclick="navigateToClass('${changcheInfo.target}')" title="${changcheInfo.target}반 시간표로 이동">
                              🏫 ${changcheInfo.target}반
                            </button>
                          </div>
                        </td>
                      `;
                    } else {
                      return `
                        <td class="${cellClass}">
                          <div class="cell-content">
                            ${slotBadge}
                            <span class="free-period">창체·동아리</span>
                          </div>
                        </td>
                      `;
                    }
                  }
                  
                  if (!cell || cell.isFree) {
                    return `
                      <td class="${cellClass}">
                        <div class="cell-content">
                          ${slotBadge}
                          <span class="free-period">${cell && cell.subject === '여유' ? '여유시간' : '공강'}</span>
                        </div>
                      </td>
                    `;
                  }

                  const actualRoom = !cell.isFree ? getTeacherActualRoom(teacher.name, day, period, cell) : null;
                  const hasDiffRoom = actualRoom && isDifferentFromTimetable(cell.target, actualRoom);
                  const trackInfo = resolveTrackSubject(cell.subject, teacher.name, cell.target, day, period);
                  const categoryClass = getSubjectCategory(trackInfo.realSubject);
                  return `
                    <td class="${cellClass}">
                      <div class="cell-content">
                        ${slotBadge}
                        <span class="subject-pill ${categoryClass}">${trackInfo.realSubject}${trackInfo.isCoded ? ` <span class="group-code-tag">(${trackInfo.groupCode})</span>` : ''}</span>
                        ${cell.target ? `
                          <button class="target-badge" onclick="navigateToClass('${cell.target}')" title="${cell.target} 학반 시간표로 이동">
                            🏫 ${cell.target}
                          </button>
                        ` : ''}
                        ${hasDiffRoom ? `
                          <span class="teacher-actual-room" title="실제 수업 장소: ${actualRoom}">(${actualRoom})</span>
                        ` : ''}
                      </div>
                    </td>
                  `;
                }).join('')}
              </tr>
            `;

            // Insert Lunch Row between 4교시 and 5교시
            if (period === 4) {
              const isLunchNow = state.isLunchTime && state.isWeekday;
              rowHtml += `
                <tr class="lunch-divider-row ${isLunchNow ? 'is-current-lunch' : ''}">
                  <td class="lunch-col-head" style="font-weight: 700;">🍱</td>
                  <td colspan="5">
                    <div class="lunch-content">
                      <span>🍱 점심시간 (12:10 ~ 13:10)</span>
                      ${isLunchNow ? '<span class="current-lunch-badge">🔔 지금 점심시간 진행 중</span>' : ''}
                    </div>
                  </td>
                </tr>
              `;
            }

            return rowHtml;
          }).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function setViewMode(mode) {
  AppState.viewMode = mode;
  renderApp();
}

function setMobileDay(day) {
  AppState.mobileSelectedDay = day;
  renderApp();
}

function toggleTeacherSubmenu() {
  AppState.teacherSubmenuOpen = !AppState.teacherSubmenuOpen;
  renderApp();
  if (AppState.teacherSubmenuOpen) {
    const el = document.getElementById('teacherSubmenuDrawer');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

function setTeacherFilter(type, val) {
  if (AppState.teacherFilterType === type && AppState.teacherFilterValue === val) {
    AppState.teacherFilterType = 'none';
    AppState.teacherFilterValue = 'none';
  } else {
    AppState.teacherFilterType = type;
    AppState.teacherFilterValue = val;
    AppState.teacherChosungFilter = 'none';
  }
  renderApp();
}

function setTeacherChosung(ch) {
  if (AppState.teacherChosungFilter === ch) {
    AppState.teacherChosungFilter = 'none';
  } else {
    AppState.teacherChosungFilter = ch;
    AppState.teacherFilterType = 'none';
  }
  renderApp();
}

function resetTeacherFilters() {
  if (AppState.teacherFilterType === 'all' || AppState.teacherChosungFilter === 'all') {
    AppState.teacherFilterType = 'none';
    AppState.teacherFilterValue = 'none';
    AppState.teacherChosungFilter = 'none';
  } else {
    AppState.teacherFilterType = 'all';
    AppState.teacherFilterValue = 'all';
    AppState.teacherChosungFilter = 'all';
  }
  AppState.searchQuery = '';
  const searchInput = document.getElementById('globalSearchInput');
  if (searchInput) searchInput.value = '';
  const clearBtn = document.getElementById('globalSearchClearBtn');
  if (clearBtn) clearBtn.style.display = 'none';
  renderApp();
}

function toggleTeacherChipsExpanded() {
  AppState.teacherChipsExpanded = !AppState.teacherChipsExpanded;
  renderApp();
}

function selectTeacher(id) {
  AppState.selectedTeacherId = id;
  AppState.teacherSubmenuOpen = false; // Close submenu on selection so timetable is right at top!
  renderApp();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function navigateToTeacher(teacherName) {
  if (!AppState.data || !AppState.data.teachers) return;
  const teacher = AppState.data.teachers.find(t => t.name === teacherName);
  if (teacher) {
    AppState.selectedTeacherId = teacher.id;
    AppState.teacherSubmenuOpen = false; // Close submenu on navigation
    switchTab('teacher');
  }
}

function hasTeacherSubject(teacher, query) {
  for (let d of DAYS) {
    if (teacher.schedule[d]) {
      for (let p of Object.values(teacher.schedule[d])) {
        if (p.subject && p.subject.toLowerCase().includes(query)) return true;
        if (p.target && p.target.toLowerCase().includes(query)) return true;
      }
    }
  }
  return false;
}

/* ==========================================================================
   2. 학반별 시간표 뷰 (Class View)
   ========================================================================== */
function renderClassView(container) {
  if (!AppState.data || !AppState.data.classes) {
    container.innerHTML = `<div class="control-card"><p>시간표 데이터가 없습니다.</p></div>`;
    return;
  }

  let filteredClasses = AppState.data.classes;
  if (AppState.selectedGrade !== 'all') {
    filteredClasses = filteredClasses.filter(c => c.grade === AppState.selectedGrade);
  }

  if (AppState.searchQuery) {
    filteredClasses = filteredClasses.filter(c =>
      c.name.toLowerCase().includes(AppState.searchQuery) ||
      (c.homeroom && c.homeroom.toLowerCase().includes(AppState.searchQuery)) ||
      hasClassSubject(c, AppState.searchQuery)
    );
  }

  let currentClass = null;
  if (AppState.searchQuery && filteredClasses.length > 0) {
    currentClass = filteredClasses.find(c => c.id === AppState.selectedClassId) || filteredClasses[0];
  } else if (AppState.selectedClassId) {
    currentClass = AppState.data.classes.find(c => c.id === AppState.selectedClassId);
  }

  const isFavorite = currentClass ? AppState.favorites.includes(currentClass.id) : false;
  const todayName = getTodayDayName();

  let html = `
    <!-- Class Top Controls Bar (Compact) -->
    <div class="control-card" style="margin-bottom: 0.85rem; padding: 0.85rem 1.15rem;">
      <div class="control-header" style="margin-bottom: 0; flex-wrap: wrap; gap: 0.75rem;">
        <div class="control-title" style="font-size: 1.15rem;">
          <span>🏫</span>
          <span><strong>${currentClass ? currentClass.name : '학반별'}</strong> 시간표</span>
          ${currentClass && currentClass.homeroom ? `<span class="chip-badge">담임: ${currentClass.homeroom} 선생님</span>` : ''}
          ${currentClass && getSubHomeroomForClass(currentClass.name) ? `<span class="chip-badge" style="background: #f0fdf4; color: #166534; border-color: #86efac;">부담임: ${getSubHomeroomForClass(currentClass.name)} 선생님</span>` : ''}
          ${currentClass ? `
            <button class="icon-btn" onclick="toggleFavorite('${currentClass.id}')" title="즐겨찾기" style="font-size: 1.1rem; padding: 0.1rem 0.35rem;">
              ${isFavorite ? '⭐' : '☆'}
            </button>
          ` : ''}
        </div>
        <div class="control-tools">
          <button type="button" class="btn ${AppState.classSubmenuOpen ? 'btn-primary' : 'btn-secondary'} toggle-submenu-btn" onclick="toggleClassSubmenu()" title="학반 선택 메뉴 펼치기/접기">
            ${AppState.classSubmenuOpen ? '▲ 학반 목록 닫기' : '🏫 학반 목록 펼치기 ▾'}
          </button>
          <div class="view-mode-switcher">
            <button class="view-mode-btn ${AppState.viewMode === 'card' ? 'active' : ''}" onclick="setViewMode('card')">
              📱 요일별 카드
            </button>
            <button class="view-mode-btn ${AppState.viewMode === 'table' ? 'active' : ''}" onclick="setViewMode('table')">
              🌐 전체 5일 표
            </button>
          </div>
          <button class="btn btn-secondary" onclick="window.print()" title="시간표 인쇄 / PDF 출력">
            🖨️ 인쇄
          </button>
          ${currentClass ? `
            <button class="btn btn-secondary" onclick="exportCurrentTimetableToCsv('${currentClass.name}')" title="CSV 다운로드">
              📥 CSV
            </button>
          ` : ''}
        </div>
      </div>

      <!-- Search Active Indicator & Reset Button -->
      ${AppState.searchQuery ? `
        <div class="search-result-banner" style="margin-top: 0.75rem;">
          <div class="search-result-info">
            <span>🔍</span>
            <span>'<strong>${escapeHtml(AppState.searchQuery)}</strong>' 검색 결과 (<strong>${filteredClasses.length}개 반</strong>)</span>
          </div>
          <button class="btn-clear-search" onclick="resetGlobalSearch()" title="검색어 초기화 후 전체 학반 목록 보기">
            ✕ 검색 초기화 (전체 목록)
          </button>
        </div>
      ` : ''}
    </div>

    <!-- Collapsible Class Selector Drawer -->
    ${AppState.classSubmenuOpen ? `
      <div class="control-card submenu-drawer class-submenu-drawer" id="classSelectorDrawer" style="margin-bottom: 1.25rem;">
        <div class="control-header" style="border-bottom: 1px solid var(--border-color); padding-bottom: 0.65rem; margin-bottom: 0.75rem;">
          <div class="control-title">
            <span>🏫</span>
            <span>학반 선택</span>
            <span class="chip-badge">${filteredClasses.length}개 반</span>
          </div>
          <button type="button" class="btn btn-secondary" onclick="toggleClassSubmenu()" style="font-size: 0.78rem; padding: 0.25rem 0.65rem;">
            ▲ 닫기
          </button>
        </div>

        <!-- Grade Tabs -->
        <div class="grade-tabs" style="margin-bottom: 0.65rem;">
          <button class="grade-tab-btn ${AppState.selectedGrade === 'all' && !AppState.searchQuery ? 'active' : ''}" onclick="resetClassFilters()">전체 학년</button>
          <button class="grade-tab-btn ${AppState.selectedGrade === '1' ? 'active' : ''}" onclick="selectGrade('1')">1학년</button>
          <button class="grade-tab-btn ${AppState.selectedGrade === '2' ? 'active' : ''}" onclick="selectGrade('2')">2학년</button>
          <button class="grade-tab-btn ${AppState.selectedGrade === '3' ? 'active' : ''}" onclick="selectGrade('3')">3학년</button>
        </div>

        <div class="chips-group">
          ${filteredClasses.map(c => `
            <button class="chip-btn ${c.id === AppState.selectedClassId ? 'active' : ''}" onclick="selectClass('${c.id}')">
              ${c.name}
              ${c.homeroom ? `<span class="chip-badge">${c.homeroom}</span>` : ''}
              ${getSubHomeroomForClass(c.name) ? `<span class="chip-badge" style="background:#f0fdf4; color:#166534; font-size:0.68rem; border:1px solid #86efac;">부: ${getSubHomeroomForClass(c.name)}</span>` : ''}
            </button>
          `).join('')}
        </div>
      </div>
    ` : ''}
  `;

  if (currentClass) {
    html += `
      <!-- Class Info Banner -->
      <div class="entity-info-bar">
        <div class="entity-main-meta">
          <div class="entity-avatar" style="background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%);">
            ${currentClass.name}
          </div>
          <div class="entity-title-wrap">
            <h2>
              <span>${currentClass.name} 시간표</span>
              <button class="icon-btn" onclick="toggleFavorite('${currentClass.id}')" title="즐겨찾기">
                ${isFavorite ? '⭐' : '☆'}
              </button>
            </h2>
            <div style="display: flex; gap: 0.5rem; align-items: center; margin-top: 0.25rem; flex-wrap: wrap;">
              <span class="entity-tag">${AppState.data.schoolYear || '2026학년도'} ${AppState.data.semester || '2학기'}</span>
              ${currentClass.homeroom ? `
                <button class="entity-tag" style="background: #eef2ff; color: #4338ca; border: none; cursor: pointer;" onclick="navigateToTeacher('${currentClass.homeroom}')">
                  👨‍🏫 담임: ${currentClass.homeroom} 선생님 ➔
                </button>
              ` : ''}
              ${getSubHomeroomForClass(currentClass.name) ? `
                <button class="entity-tag" style="background: #f0fdf4; color: #166534; border: 1px solid #86efac; cursor: pointer;" onclick="navigateToTeacher('${getSubHomeroomForClass(currentClass.name)}')">
                  👨‍🏫 부담임: ${getSubHomeroomForClass(currentClass.name)} 선생님 ➔
                </button>
              ` : ''}
            </div>
          </div>
        </div>

        <div class="entity-stats">
          <div class="stat-item">
            <div class="stat-val">${currentClass.totalHours}</div>
            <div class="stat-label">주당 수업 시수</div>
          </div>
          ${DAYS.map(d => `
            <div class="stat-item">
              <div class="stat-val" style="font-size: 1.1rem;">${currentClass.hoursByDay[d] || 0}</div>
              <div class="stat-label">${d}요일</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    if (AppState.viewMode === 'card') {
      html += renderClassCardView(currentClass, todayName);
    } else {
      html += renderClassTableView(currentClass, todayName);
    }

    html += `
      <!-- Bottom Quick Navigation Toggle -->
      <div style="text-align: center; margin: 1.75rem 0 0.5rem 0;">
        <button type="button" class="btn btn-secondary toggle-submenu-btn" onclick="toggleClassSubmenu();" style="font-size: 0.92rem; padding: 0.6rem 1.4rem; border-radius: 9999px; box-shadow: 0 2px 6px rgba(0,0,0,0.06);">
          ${AppState.classSubmenuOpen ? '▲ 학반 목록 닫기' : '🏫 학반 목록 펼치기 ▾'}
        </button>
      </div>
    `;
  } else {
    html += `
      <div class="empty-selection-card">
        <div class="empty-selection-icon">🏫</div>
        <div class="empty-selection-title">선택된 학반이 없습니다</div>
        <div class="empty-selection-desc">
          상단 검색창에서 학반을 검색하시거나, 아래 <strong>[학반 목록 펼치기]</strong> 버튼을 눌러 시간표를 확인하실 학급을 선택해 주세요.
        </div>
        <button type="button" class="btn btn-primary toggle-submenu-btn" onclick="toggleClassSubmenu()" style="font-size: 0.95rem; padding: 0.65rem 1.4rem;">
          ${AppState.classSubmenuOpen ? '▲ 학반 목록 닫기' : '🏫 학반 목록 펼치기 ▾'}
        </button>
      </div>
    `;
  }

  container.innerHTML = html;
}

function renderClassCardView(classObj, todayName) {
  const currentDay = AppState.mobileSelectedDay;
  const now = new Date();
  const state = getActivePeriodState(now);

  return `
    <!-- Timetable Live Status Banner -->
    <div class="timetable-live-status-bar">
      <span class="live-status-dot"></span>
      <span>⏰ <strong>현재 실시간:</strong> <span id="timetableLiveDateText">${now.getMonth() + 1}월 ${now.getDate()}일 (${todayName}요일)</span> <span id="timetableLiveClock" class="live-seconds-clock">${formatTime(now)}</span></span>
      <span id="timetableLiveStatusPill" class="live-status-pill ${state.statusBadgeClass}">
        ${state.statusText}
      </span>
    </div>

    ${renderFridayChangcheSelectorBar()}
    <div class="mobile-day-tabs">
      ${DAYS.map(day => `
        <button class="mobile-day-tab ${day === currentDay ? 'active' : ''} ${day === todayName ? 'today-marker' : ''}" onclick="setMobileDay('${day}')">
          <span>${day}요일</span>
          <span style="font-size: 0.72rem; font-weight: 500;">${classObj.hoursByDay[day] || 0}시간</span>
        </button>
      `).join('')}
    </div>

    <div class="mobile-period-list">
      ${PERIODS.map(period => {
        const timeInfo = AppState.bellSchedule.find(b => b.period === period);
        const cell = classObj.schedule[currentDay] ? classObj.schedule[currentDay][period.toString()] : null;
        // Dynamic Friday Changche for Class Mobile Card
        let isChangcheSlot = false;
        let changcheSlotData = null;
        if (currentDay === '금' && period >= 5) {
          const [gNum, cNum] = classObj.name.split('-').map(Number);
          changcheSlotData = resolveChangcheSlot(gNum, cNum, period, AppState.selectedFridayWeekDate);
          if (changcheSlotData) isChangcheSlot = true;
        }

        const isFree = isChangcheSlot ? false : (!cell || cell.isFree);
        const trackInfo = (!isFree && !isChangcheSlot) ? resolveTrackSubject(cell.subject, cell.target, classObj.name, currentDay, period) : null;
        const cat = isChangcheSlot ? changcheSlotData.category : (!isFree ? getSubjectCategory(trackInfo.realSubject) : '');
        const isToday = (currentDay === todayName);

        let isCurrentSlot = false;
        let isUpcomingSlot = false;
        let badgeHtml = '';

        if (isToday) {
          if (state.activePeriod === period) {
            isCurrentSlot = true;
            badgeHtml = `<div style="margin-bottom:0.25rem;"><span class="current-slot-badge">🔔 지금 (${period}교시 진행 중)</span></div>`;
          } else if (state.isBreakTime && state.nextPeriod === period) {
            isUpcomingSlot = true;
            badgeHtml = `<div style="margin-bottom:0.25rem;"><span class="upcoming-slot-badge">☕ 곧 시작 (${period}교시)</span></div>`;
          } else if (state.isLunchTime && period === 5) {
            isUpcomingSlot = true;
            badgeHtml = `<div style="margin-bottom:0.25rem;"><span class="upcoming-slot-badge">다음 수업 (5교시 13:10 시작)</span></div>`;
          }
        }

        let itemHtml = `
          <div class="mobile-period-card ${isCurrentSlot ? 'is-current is-current-slot' : ''} ${isUpcomingSlot ? 'is-upcoming-slot' : ''}">
            <div class="mobile-period-left">
              <div class="mobile-period-badge">
                <span>${period}</span>
                <span class="mobile-period-time">${timeInfo ? timeInfo.start : ''}</span>
              </div>
              <div>
                ${badgeHtml}
                ${isChangcheSlot ? `
                  <div class="mobile-period-subject">
                    <span class="subject-pill ${cat}">${changcheSlotData.subject}</span>
                  </div>
                  <div style="font-size: 0.78rem; color: var(--text-muted); margin-top: 0.15rem;">
                    ${timeInfo ? `${timeInfo.start} ~ ${timeInfo.end}` : ''} · ${changcheSlotData.note}
                  </div>
                ` : (isFree ? `
                  <div class="mobile-period-subject" style="color: var(--text-muted); font-size: 0.95rem;">
                    <span>수업 없음</span>
                  </div>
                ` : `
                  <div class="mobile-period-subject">
                    <span class="subject-pill ${cat}">${trackInfo.realSubject}${trackInfo.isCoded ? ` <span class="group-code-tag">(${trackInfo.groupCode})</span>` : ''}</span>
                  </div>
                  <div style="font-size: 0.78rem; color: var(--text-muted); margin-top: 0.15rem;">
                    ${timeInfo ? `${timeInfo.start} ~ ${timeInfo.end}` : ''}
                  </div>
                `)}
              </div>
            </div>

            <div>
              ${isChangcheSlot ? `
                <button class="target-badge" style="font-size: 0.88rem; padding: 0.35rem 0.75rem;" ${changcheSlotData.teacherName ? `onclick="navigateToTeacher('${changcheSlotData.teacherName}')"` : 'style="cursor:default;"'} title="${changcheSlotData.note}">
                  👨‍🏫 ${changcheSlotData.teacher}
                </button>
              ` : (!isFree && cell && cell.target ? `
                <button class="target-badge" style="font-size: 0.88rem; padding: 0.35rem 0.75rem;" onclick="navigateToTeacher('${cell.target}')">
                  👨‍🏫 ${cell.target} ➔
                </button>
              ` : '')}
            </div>
          </div>
        `;

        if (period === 4) {
          const isLunchNow = isToday && state.isLunchTime;
          itemHtml += `
            <div class="mobile-period-card ${isLunchNow ? 'is-current is-current-lunch' : ''}" style="background: var(--bg-hover); padding: 0.65rem 1rem; border: 1px dashed var(--border-color);">
              <div style="display:flex; align-items:center; justify-content:space-between; width:100%;">
                <span style="font-weight:700; font-size:0.88rem;">🍱 점심시간 (12:10 ~ 13:10)</span>
                ${isLunchNow ? '<span class="current-lunch-badge">🔔 지금 진행 중</span>' : ''}
              </div>
            </div>
          `;
        }

        return itemHtml;
      }).join('')}
    </div>
  `;
}

function renderClassTableView(classObj, todayName) {
  const now = new Date();
  const state = getActivePeriodState(now);
  const curPeriodNum = state.activePeriod;

  return `
    <!-- Timetable Live Status Banner -->
    <div class="timetable-live-status-bar">
      <span class="live-status-dot"></span>
      <span>⏰ <strong>현재 실시간:</strong> <span id="timetableLiveDateText">${now.getMonth() + 1}월 ${now.getDate()}일 (${todayName}요일)</span> <span id="timetableLiveClock" class="live-seconds-clock">${formatTime(now)}</span></span>
      <span id="timetableLiveStatusPill" class="live-status-pill ${state.statusBadgeClass}">
        ${state.statusText}
      </span>
    </div>

    <div class="timetable-card">
      <table class="timetable-grid">
        <thead>
          <tr>
            <th class="period-col">교시</th>
            ${DAYS.map(day => `
              <th class="day-col ${day === todayName ? 'today' : ''}">
                ${day}요일 ${day === todayName ? '<span style="font-size:0.75rem; color:var(--primary); font-weight:800;">(오늘)</span>' : ''}
              </th>
            `).join('')}
          </tr>
        </thead>
        <tbody>
          ${PERIODS.map(period => {
            const timeInfo = AppState.bellSchedule.find(b => b.period === period);
            const isCurPeriodRow = (curPeriodNum === period);

            let rowHtml = `
              <tr>
                <td class="period-col ${isCurPeriodRow ? 'current-period-head' : ''}">
                  <div class="period-cell-header">
                    <span class="period-num">${period}</span>
                    <span class="period-time">${timeInfo ? timeInfo.start : ''}</span>
                    ${isCurPeriodRow ? '<span style="font-size:0.65rem; color:var(--primary); font-weight:800;">지금</span>' : ''}
                  </div>
                </td>
                ${DAYS.map(day => {
                  const cell = classObj.schedule[day] ? classObj.schedule[day][period.toString()] : null;
                  const isToday = day === todayName;

                  let isCurrentSlot = false;
                  let isUpcomingSlot = false;
                  let slotBadge = '';

                  if (isToday) {
                    if (state.activePeriod === period) {
                      isCurrentSlot = true;
                      slotBadge = `<span class="current-slot-badge">🔔 지금 (${period}교시)</span>`;
                    } else if (state.isBreakTime && state.nextPeriod === period) {
                      isUpcomingSlot = true;
                      slotBadge = `<span class="upcoming-slot-badge">☕ 곧 시작 (${period}교시)</span>`;
                    } else if (state.isLunchTime && period === 5) {
                      isUpcomingSlot = true;
                      slotBadge = `<span class="upcoming-slot-badge">다음 수업 (13:10)</span>`;
                    }
                  }

                  const cellClass = `timetable-cell ${isToday ? 'is-today' : ''} ${isCurrentSlot ? 'is-current-slot' : ''} ${isUpcomingSlot ? 'is-upcoming-slot' : ''}`;

                  if (!cell || cell.isFree) {
                    return `
                      <td class="${cellClass}">
                        <div class="cell-content">
                          ${slotBadge}
                          <span class="free-period">수업 없음</span>
                        </div>
                      </td>
                    `;
                  }

                  // Dynamic Friday Changche Override (금요일 5~7교시 여유·진로·동아리 동적 반영)
                  if (day === '금' && period >= 5) {
                    const [gNum, cNum] = classObj.name.split('-').map(Number);
                    const changcheSlot = resolveChangcheSlot(gNum, cNum, period, AppState.selectedFridayWeekDate);
                    if (changcheSlot) {
                      return `
                        <td class="${cellClass}">
                          <div class="cell-content">
                            ${slotBadge}
                            <span class="subject-pill ${changcheSlot.category}">${changcheSlot.subject}</span>
                            <button class="target-badge" ${changcheSlot.teacherName ? `onclick="navigateToTeacher('${changcheSlot.teacherName}')" title="${changcheSlot.teacherName} 선생님 시간표로 이동"` : 'style="cursor:default;"'} title="${changcheSlot.note}">
                              👨‍🏫 ${changcheSlot.teacher}
                            </button>
                          </div>
                        </td>
                      `;
                    }
                  }

                  const trackInfo = resolveTrackSubject(cell.subject, cell.target, classObj.name, day, period);
                  const categoryClass = getSubjectCategory(trackInfo.realSubject);
                  return `
                    <td class="${cellClass}">
                      <div class="cell-content">
                        ${slotBadge}
                        <span class="subject-pill ${categoryClass}">${trackInfo.realSubject}${trackInfo.isCoded ? ` <span class="group-code-tag">(${trackInfo.groupCode})</span>` : ''}</span>
                        ${cell.target ? `
                          <button class="target-badge" onclick="navigateToTeacher('${cell.target}')" title="${cell.target} 선생님 시간표로 이동">
                            👨‍🏫 ${cell.target}
                          </button>
                        ` : ''}
                      </div>
                    </td>
                  `;
                }).join('')}
              </tr>
            `;

            // Insert Lunch Row between 4교시 and 5교시
            if (period === 4) {
              const isLunchNow = state.isLunchTime && state.isWeekday;
              rowHtml += `
                <tr class="lunch-divider-row ${isLunchNow ? 'is-current-lunch' : ''}">
                  <td class="lunch-col-head" style="font-weight: 700;">🍱</td>
                  <td colspan="5">
                    <div class="lunch-content">
                      <span>🍱 점심시간 (12:10 ~ 13:10)</span>
                      ${isLunchNow ? '<span class="current-lunch-badge">🔔 지금 점심시간 진행 중</span>' : ''}
                    </div>
                  </td>
                </tr>
              `;
            }

            return rowHtml;
          }).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function toggleClassSubmenu() {
  AppState.classSubmenuOpen = !AppState.classSubmenuOpen;
  renderApp();
  if (AppState.classSubmenuOpen) {
    const el = document.getElementById('classSelectorDrawer');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

function selectGrade(grade) {
  AppState.selectedGrade = grade;
  renderApp();
}

function selectClass(id) {
  AppState.selectedClassId = id;
  AppState.classSubmenuOpen = false; // Close drawer on selection
  renderApp();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function navigateToClass(className) {
  if (!AppState.data || !AppState.data.classes) return;
  const cls = AppState.data.classes.find(c => c.name === className);
  if (cls) {
    AppState.selectedClassId = cls.id;
    AppState.classSubmenuOpen = false; // Close drawer on navigation
    switchTab('class');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

function hasClassSubject(classObj, query) {
  for (let d of DAYS) {
    if (classObj.schedule[d]) {
      for (let p of Object.values(classObj.schedule[d])) {
        if (p.subject && p.subject.toLowerCase().includes(query)) return true;
        if (p.target && p.target.toLowerCase().includes(query)) return true;
      }
    }
  }
  return false;
}

/* ==========================================================================
   2-2. 🎓 지금 우리 학생은 (1·2·3학년 전교생 시간표 & 실시간 위치/강의실 안내)
   ========================================================================== */

function getFilteredStudentsList() {
  if (!AppState.data || !AppState.data.students) return [];
  const all = AppState.data.students;

  const q = (AppState.studentSearchQuery || '').trim().toLowerCase();

  // If no search query and chosung is 'none' and no grade/class filter selected, return empty list initially!
  if (!q && (AppState.studentChosung === 'none' || !AppState.studentChosung) && AppState.studentSelectedGrade === 'all' && AppState.studentSelectedClass === 'all') {
    return [];
  }

  let list = all;

  // 1. Grade filter
  if (AppState.studentSelectedGrade !== 'all') {
    const g = parseInt(AppState.studentSelectedGrade, 10);
    list = list.filter(s => s.grade === g);
  }

  // 2. Class filter
  if (AppState.studentSelectedClass !== 'all') {
    const c = parseInt(AppState.studentSelectedClass, 10);
    list = list.filter(s => s.classNum === c);
  }

  // 3. Chosung filter
  if (AppState.studentChosung && AppState.studentChosung !== 'all' && AppState.studentChosung !== 'none') {
    list = list.filter(s => getChosung(s.name) === AppState.studentChosung);
  }

  // 4. Search Query filter
  if (q) {
    list = list.filter(s => {
      const chosung = getChosung(s.name);
      const fullChosung = getFullChosung(s.name);
      return s.name.toLowerCase().includes(q) ||
             chosung.includes(q) ||
             fullChosung.includes(q) ||
             s.className.toLowerCase().includes(q) ||
             `${s.grade}-${s.classNum}`.includes(q) ||
             `${s.classNum}반`.includes(q) ||
             `${s.studentNum}번`.includes(q);
    });
  }

  return list;
}

function renderStudentChipsHtml(filtered, currentStudent, nameToCount) {
  if (filtered.length === 0) {
    const q = (AppState.studentSearchQuery || '').trim();
    if (q) {
      return `
        <div style="padding: 1.25rem 1rem; color: var(--text-muted); font-size: 0.88rem; text-align: center; width: 100%;">
          '${escapeHtml(q)}' 검색 조건에 맞는 학생이 없습니다.
        </div>
      `;
    }
    return `
      <div class="chosung-hint-box" style="width: 100%; margin: 0.5rem 0;">
        <span style="font-size: 1.1rem; display: block; margin-bottom: 0.25rem;">👆</span>
        <span>위의 <strong>'전체'</strong>, 특정 <strong>'학년/학반'</strong> 또는 <strong>'초성(ㄱ, ㄴ, ㄷ...)'</strong>을 클릭하시면 학생 목록이 표시됩니다.</span>
      </div>
    `;
  }
  return filtered.map(s => {
    const isDupe = nameToCount[s.name] > 1;
    const isSelected = currentStudent && s.id === currentStudent.id;
    const gradeBadgeClass = `grade-badge-${s.grade}`;
    return `
      <button type="button" class="student-chip ${isSelected ? 'active' : ''}" onclick="selectStudent('${s.id}')">
        <span>${escapeHtml(s.name)}</span>
        <span class="chip-class-badge ${gradeBadgeClass}">${s.grade}-${s.classNum} (${s.studentNum}번)</span>
        ${isDupe ? '<span style="font-size:0.65rem; color:#d97706;" title="동명이인 학생">👥</span>' : ''}
      </button>
    `;
  }).join('');
}

function renderDuplicateAlertHtml(filtered, currentStudent, nameToCount, query) {
  if (!AppState.data || !AppState.data.students) return '';
  const allStudents = AppState.data.students;
  const q = (query || '').trim().toLowerCase();

  let dupeStudents = [];
  if (q) {
    const matchedDupeNames = Object.keys(nameToCount).filter(name => nameToCount[name] > 1 && (name.includes(q) || getChosung(name).includes(q)));
    if (matchedDupeNames.length > 0) {
      dupeStudents = allStudents.filter(s => matchedDupeNames.includes(s.name));
    }
  } else if (currentStudent && nameToCount[currentStudent.name] > 1) {
    dupeStudents = allStudents.filter(s => s.name === currentStudent.name);
  }

  if (dupeStudents.length > 1) {
    const dupeName = dupeStudents[0].name;
    return `
      <div class="duplicate-student-alert">
        <div class="duplicate-alert-title">
          <span>⚠️</span>
          <span><strong>'${escapeHtml(dupeName)}'</strong> 학생은 동명이인(${dupeStudents.length}명)입니다. 확인하실 학반을 선택해 주세요.</span>
        </div>
        <div class="duplicate-choices-grid">
          ${dupeStudents.map(s => `
            <button type="button" class="duplicate-choice-btn ${currentStudent && s.id === currentStudent.id ? 'active' : ''}" onclick="selectStudent('${s.id}')">
              <span>🏫</span>
              <span><strong class="grade-badge-tag grade-badge-${s.grade}">${s.className} ${s.studentNum}번</strong> ${escapeHtml(s.name)}</span>
              ${currentStudent && s.id === currentStudent.id ? '<span style="font-size:0.72rem; color:#ffffff; background:#d97706; padding:0.15rem 0.45rem; border-radius:4px; font-weight:700;">현재 선택됨</span>' : ''}
            </button>
          `).join('')}
        </div>
      </div>
    `;
  }
  return '';
}

function renderStudentView(container) {
  if (!AppState.data || !AppState.data.students || AppState.data.students.length === 0) {
    container.innerHTML = `
      <div class="control-card" style="text-align:center; padding:3rem 1.5rem;">
        <div style="font-size: 3rem; margin-bottom: 1rem;">🎓</div>
        <h3>등록된 전교생 시간표 데이터가 없습니다.</h3>
        <p style="color: var(--text-muted); margin-top: 0.5rem;">
          명렬표 파일 및 엑셀 파일이 정상적으로 로드되었는지 확인해 주세요.
        </p>
      </div>
    `;
    return;
  }

  const allStudents = AppState.data.students;

  // Grade Counts
  const g1Count = allStudents.filter(s => s.grade === 1).length;
  const g2Count = allStudents.filter(s => s.grade === 2).length;
  const g3Count = allStudents.filter(s => s.grade === 3).length;

  const filtered = getFilteredStudentsList();

  // Name duplicate counts map
  const nameToCount = {};
  allStudents.forEach(s => { nameToCount[s.name] = (nameToCount[s.name] || 0) + 1; });

  // Selection logic: Do not default to allStudents[0] (Kang Ye-in) if not selected!
  let currentStudent = null;
  if (AppState.studentSearchQuery && filtered.length > 0) {
    currentStudent = filtered.find(s => s.id === AppState.selectedStudentId) || filtered[0];
  } else if (AppState.selectedStudentId) {
    currentStudent = allStudents.find(s => s.id === AppState.selectedStudentId);
  }

  // Real-time calculation & Simulation support
  const now = new Date();
  let state = getActivePeriodState(now);
  let todayName = state.todayDayName;

  if (AppState.studentSimTime && AppState.studentSimTime !== 'real') {
    const simParts = AppState.studentSimTime.split('_');
    if (simParts.length === 2) {
      todayName = simParts[0];
      const pNum = parseInt(simParts[1], 10);
      const bInfo = AppState.bellSchedule.find(b => b.period === pNum);
      state = {
        todayDayName: todayName,
        activePeriod: pNum,
        isLunchTime: false,
        isBreakTime: false,
        nextPeriod: pNum < 7 ? pNum + 1 : null,
        statusText: `[시뮬레이션 모드] ${todayName}요일 ${pNum}교시 (${bInfo ? `${bInfo.start}~${bInfo.end}` : ''})`,
        statusBadgeClass: 'status-active',
        isWeekday: true,
        curTime: bInfo ? bInfo.start : '09:00'
      };
    }
  }

  // Determine Class Buttons based on selected Grade
  let classButtonsHtml = '';
  if (AppState.studentSelectedGrade === '1') {
    classButtonsHtml = `
      <button type="button" class="student-class-btn ${AppState.studentSelectedClass === 'all' ? 'active' : ''}" onclick="setStudentClassFilter('all')">
        1학년 전체 (${g1Count}명)
      </button>
      ${[1, 2, 3, 4, 5, 6].map(c => `
        <button type="button" class="student-class-btn ${AppState.studentSelectedClass === c.toString() ? 'active' : ''}" onclick="setStudentClassFilter('${c}')">
          1-${c}반
        </button>
      `).join('')}
    `;
  } else if (AppState.studentSelectedGrade === '2') {
    classButtonsHtml = `
      <button type="button" class="student-class-btn ${AppState.studentSelectedClass === 'all' ? 'active' : ''}" onclick="setStudentClassFilter('all')">
        2학년 전체 (${g2Count}명)
      </button>
      ${[1, 2, 3, 4, 5, 6, 7].map(c => `
        <button type="button" class="student-class-btn ${AppState.studentSelectedClass === c.toString() ? 'active' : ''}" onclick="setStudentClassFilter('${c}')">
          2-${c}반
        </button>
      `).join('')}
    `;
  } else if (AppState.studentSelectedGrade === '3') {
    classButtonsHtml = `
      <button type="button" class="student-class-btn ${AppState.studentSelectedClass === 'all' ? 'active' : ''}" onclick="setStudentClassFilter('all')">
        3학년 전체 (${g3Count}명)
      </button>
      ${[1, 2, 3, 4, 5, 6, 7].map(c => `
        <button type="button" class="student-class-btn ${AppState.studentSelectedClass === c.toString() ? 'active' : ''}" onclick="setStudentClassFilter('${c}')">
          3-${c}반
        </button>
      `).join('')}
    `;
  } else {
    // All grades
    classButtonsHtml = `
      <button type="button" class="student-class-btn ${AppState.studentSelectedClass === 'all' ? 'active' : ''}" onclick="setStudentClassFilter('all')">
        전체 학반
      </button>
      <button type="button" class="student-class-btn" onclick="setStudentGradeFilter('1')">
        1학년 (1~6반)
      </button>
      <button type="button" class="student-class-btn" onclick="setStudentGradeFilter('2')">
        2학년 (1~7반)
      </button>
      <button type="button" class="student-class-btn" onclick="setStudentGradeFilter('3')">
        3학년 (1~7반)
      </button>
    `;
  }

  let html = `
    <!-- Top View Control Bar (Compact & Unified Layout) -->
    <div class="control-card" style="margin-bottom: 0.85rem; padding: 0.85rem 1.15rem;">
      <div class="control-header" style="margin-bottom: 0; flex-wrap: wrap; gap: 0.75rem;">
        <div class="control-title" style="font-size: 1.15rem;">
          <span>🎓</span>
          <span><strong>${currentStudent ? `${currentStudent.className} ${currentStudent.name}` : '학생별'}</strong> 시간표</span>
          ${currentStudent ? `<span class="chip-badge">${currentStudent.studentNum}번</span>` : ''}
          ${currentStudent ? `
            <button class="icon-btn" onclick="toggleFavorite('${currentStudent.id}')" title="즐겨찾기" style="font-size: 1.1rem; padding: 0.1rem 0.35rem;">
              ${AppState.favorites.includes(currentStudent.id) ? '⭐' : '☆'}
            </button>
          ` : ''}
        </div>

        <div class="control-tools">
          <button type="button" class="btn ${AppState.studentSubmenuOpen ? 'btn-primary' : 'btn-secondary'} toggle-submenu-btn" onclick="toggleStudentSubmenu()" title="학생 목록 및 학반/초성 필터 펼치기/접기">
            ${AppState.studentSubmenuOpen ? '▲ 학생 목록 닫기' : '👥 학생 목록 펼치기 ▾'}
          </button>
          <div class="view-mode-switcher">
            <button class="view-mode-btn ${AppState.viewMode === 'card' ? 'active' : ''}" onclick="setViewMode('card')">
              📱 요일별 카드
            </button>
            <button class="view-mode-btn ${AppState.viewMode === 'table' ? 'active' : ''}" onclick="setViewMode('table')">
              🌐 전체 5일 표
            </button>
          </div>
          <button class="btn btn-secondary" onclick="window.print()" title="시간표 인쇄 / PDF 출력">
            🖨️ 인쇄
          </button>
          ${currentStudent ? `
            <button class="btn btn-secondary" onclick="exportCurrentTimetableToCsv('${currentStudent.name}')" title="CSV 다운로드">
              📥 CSV
            </button>
          ` : ''}
        </div>
      </div>

      <!-- Search Active Indicator & Reset Button if global search -->
      ${AppState.searchQuery ? `
        <div class="search-result-banner" style="margin-top: 0.75rem;">
          <div class="search-result-info">
            <span>🔍</span>
            <span>'<strong>${escapeHtml(AppState.searchQuery)}</strong>' 검색 결과</span>
          </div>
          <button class="btn-clear-search" onclick="resetGlobalSearch()" title="검색어 초기화">
            ✕ 검색 초기화
          </button>
        </div>
      ` : ''}
    </div>

    <!-- Collapsible Student Catalog & Filter Card (펼침/접힘 드로어) -->
    ${AppState.studentSubmenuOpen ? `
      <div class="control-card student-control-card student-submenu-drawer" id="studentSelectorCard" style="margin-bottom: 1.25rem;">
        <div class="control-header" style="border-bottom: 1px solid var(--border-color); padding-bottom: 0.65rem; margin-bottom: 0.75rem;">
          <div class="control-title">
            <span>👥</span>
            <span>학생 선택 (학반·초성별 전체 학생 목록)</span>
            ${filtered.length > 0 ? `<span id="studentCountBadge" class="chip-badge">${filtered.length}명</span>` : ''}
          </div>
          <button type="button" class="btn btn-secondary" onclick="toggleStudentSubmenu()" style="font-size: 0.78rem; padding: 0.25rem 0.65rem;">
            ▲ 닫기
          </button>
        </div>

        <!-- Student In-Drawer Search Box -->
        <div style="margin-bottom: 0.75rem;">
          <div class="search-container" style="max-width: 100%;">
            <span class="search-icon">🔍</span>
            <input type="text" id="studentSearchInput" class="search-input" placeholder="학생 이름 검색 (초성 ㄱ, ㄴ, ㄷ 가능)..." value="${escapeHtml(AppState.studentSearchQuery)}" oninput="handleStudentSearch(event)" onkeydown="handleStudentSearchKeyDown(event)">
            <button type="button" id="studentSearchClearBtn" class="search-clear-btn" onclick="clearStudentSearch()" style="display: ${AppState.studentSearchQuery ? 'flex' : 'none'};">✕</button>
          </div>
        </div>

        <!-- Grade Filter Tabs -->
        <div class="student-grade-tabs-wrapper">
          <div class="student-grade-tabs">
            <button type="button" class="student-grade-btn ${AppState.studentSelectedGrade === 'all' ? 'active' : ''}" onclick="setStudentGradeFilter('all')">
              <span>전체 (${allStudents.length})</span>
            </button>
            <button type="button" class="student-grade-btn grade-1 ${AppState.studentSelectedGrade === '1' ? 'active' : ''}" onclick="setStudentGradeFilter('1')">
              <span>🌱 1학년 (${g1Count})</span>
            </button>
            <button type="button" class="student-grade-btn grade-2 ${AppState.studentSelectedGrade === '2' ? 'active' : ''}" onclick="setStudentGradeFilter('2')">
              <span>🌿 2학년 (${g2Count})</span>
            </button>
            <button type="button" class="student-grade-btn grade-3 ${AppState.studentSelectedGrade === '3' ? 'active' : ''}" onclick="setStudentGradeFilter('3')">
              <span>🌳 3학년 (${g3Count})</span>
            </button>
          </div>
        </div>

        <!-- Class Filter Chips -->
        <div class="student-class-chips-wrapper">
          <div class="student-class-chips">
            ${classButtonsHtml}
          </div>
        </div>

        <!-- Chosung Fast Filter Buttons -->
        <div class="chosung-filter" style="margin-top: 0.5rem;">
          ${CHOSUNG_LIST.map(ch => `
            <button type="button" class="chosung-btn ${AppState.studentChosung === ch ? 'active' : ''}" onclick="setStudentChosung('${ch}')">
              ${ch === 'all' ? '전체' : ch}
            </button>
          `).join('')}
        </div>

        <div id="studentChipsContainer" class="student-chips-container" style="margin-top: 0.75rem;">
          ${renderStudentChipsHtml(filtered, currentStudent, nameToCount)}
        </div>
      </div>
    ` : ''}
  `;

  if (currentStudent) {
    html += `
      <!-- 1. Duplicate Student Alert Container (동명이인 안내) -->
      <div id="duplicateAlertContainer">
        ${renderDuplicateAlertHtml(filtered, currentStudent, nameToCount, AppState.studentSearchQuery)}
      </div>

      <!-- 2. Student Timetable Detail Area (현재 위치 Hero Card + Info Bar + Timetable) -->
      <div id="studentTimetableDetailArea">
        ${renderStudentDetailAreaHtml(currentStudent, todayName, state, now)}
      </div>

      <!-- 3. Bottom Quick Toggle Button -->
      <div style="text-align: center; margin-top: 1.5rem; margin-bottom: 1.5rem;">
        <button type="button" class="btn btn-secondary toggle-submenu-btn" onclick="toggleStudentSubmenu()" style="font-size: 0.88rem; padding: 0.55rem 1.25rem; font-weight: 700; border-radius: var(--radius-full);">
          ${AppState.studentSubmenuOpen ? '▲ 학생 목록 닫기' : '👥 학생 목록 펼치기 ▾'}
        </button>
      </div>
    `;
  } else {
    html += `
      <div class="empty-selection-card">
        <div class="empty-selection-icon">🎓</div>
        <div class="empty-selection-title">선택된 학생이 없습니다</div>
        <div class="empty-selection-desc">
          상단 검색창에서 학생 이름을 검색하시거나, 아래 <strong>[학생 목록 펼치기]</strong> 버튼을 눌러 시간표를 확인하실 학생을 선택해 주세요.
        </div>
        <button type="button" class="btn btn-primary toggle-submenu-btn" onclick="toggleStudentSubmenu()" style="font-size: 0.95rem; padding: 0.65rem 1.4rem;">
          ${AppState.studentSubmenuOpen ? '▲ 학생 목록 닫기' : '👥 학생 목록 펼치기 ▾'}
        </button>
      </div>
    `;
  }

  container.innerHTML = html;
}

function renderStudentDetailAreaHtml(currentStudent, todayName, state, now) {
  if (!now) now = new Date();
  if (!state) state = getActivePeriodState(now);
  if (!todayName) todayName = state.todayDayName;

  return `
    <!-- Student Live Hero Status Card ('지금 우리 학생은?') -->
    ${renderStudentLiveHeroCard(currentStudent, todayName, state, now)}

    <!-- Student Info Bar -->
    <div class="entity-info-bar">
      <div class="entity-main-meta">
        <div class="entity-avatar" style="background: ${currentStudent.grade === 1 ? 'linear-gradient(135deg, #059669 0%, #10b981 100%)' : (currentStudent.grade === 2 ? 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)' : 'linear-gradient(135deg, #6366f1 0%, #3b82f6 100%)')}; font-size: 1.05rem;">
          ${currentStudent.grade}-${currentStudent.classNum}
        </div>
        <div class="entity-title-wrap">
          <h2>
            <span>${escapeHtml(currentStudent.name)} 학생 시간표</span>
            <span style="font-size: 0.85rem; font-weight: 500; color: var(--text-muted);">
              (${currentStudent.className} ${currentStudent.studentNum}번)
            </span>
          </h2>
          <div style="display: flex; gap: 0.5rem; align-items: center; margin-top: 0.25rem; flex-wrap: wrap;">
            <span class="entity-tag">2026학년도 2학기</span>
            <span class="entity-tag" style="background: #eef2ff; color: #4338ca;">
              🏫 기본 교실: ${currentStudent.classRoom}
            </span>
            ${currentStudent.grade === 1 ? `
              <span class="entity-tag" style="background: #ecfdf5; color: #065f46; font-weight: 700;">
                🏫 1학년 전 과목 학급 교실 수업
              </span>
            ` : ''}
            <button type="button" class="entity-tag" style="background: #f0fdf4; color: #166534; border: none; cursor: pointer;" onclick="navigateToClass('${currentStudent.grade}-${currentStudent.classNum}')">
              🏫 ${currentStudent.className} 학반 시간표 ➔
            </button>
          </div>
        </div>
      </div>

      <div class="entity-stats">
        <div class="stat-item">
          <div class="stat-val">${currentStudent.totalHours}</div>
          <div class="stat-label">주당 수업 시수</div>
        </div>
        ${DAYS.map(d => `
          <div class="stat-item">
            <div class="stat-val" style="font-size: 1.1rem;">${currentStudent.hoursByDay[d] || 0}</div>
            <div class="stat-label">${d}요일</div>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Timetable View (Card or Table) -->
    ${AppState.viewMode === 'card' ? renderStudentCardView(currentStudent, todayName, state) : renderStudentTableView(currentStudent, todayName, state)}
  `;
}

function renderStudentLiveHeroCard(student, todayName, state, now) {
  const isSim = AppState.studentSimTime && AppState.studentSimTime !== 'real';
  const curPeriodNum = state.activePeriod;

  // 1. Current Period Active (수업 진행 중)
  if (curPeriodNum && curPeriodNum >= 1 && curPeriodNum <= 7) {
    const cell = student.schedule[todayName] ? student.schedule[todayName][curPeriodNum.toString()] : null;
    const timeInfo = AppState.bellSchedule.find(b => b.period === curPeriodNum);
    
    let displaySubject = cell && cell.subject ? cell.subject : '수업 없음';
    let displayTeacher = cell && cell.teacher ? cell.teacher : '';
    let displayRoom = cell && cell.room ? cell.room : student.classRoom;

    // Special rule checks
    const isFri567 = todayName === '금' && (curPeriodNum === 5 || curPeriodNum === 6 || curPeriodNum === 7);
    const isMon1 = todayName === '월' && curPeriodNum === 1;
    const isG3Twt7 = student.grade === 3 && (todayName === '화' || todayName === '수' || todayName === '목') && curPeriodNum === 7;
    const isFree = !cell || cell.isFree || cell.subject === '공강' || displaySubject === '수업 없음';

    let subNote = '이동수업 수강 중';

    if (isFri567) {
      displayRoom = `${student.classRoom} (본인 학급 교실)`;
      const curChangche = resolveChangcheSlot(student.grade, student.classNum, curPeriodNum, AppState.selectedFridayWeekDate);
      if (curChangche) {
        displaySubject = curChangche.subject;
        displayTeacher = curChangche.teacher;
        subNote = `💡 금요일 5~7교시 창체 활동: ${curChangche.note}`;
      } else {
        displaySubject = cell && cell.subject ? cell.subject : '창체활동';
        displayTeacher = cell && cell.teacher ? cell.teacher : '담임';
        subNote = '💡 금요일 5~7교시 창체(자율/진로/동아리) 활동은 본인 학급 교실에서 진행됩니다.';
      }
    } else if (isMon1) {
      displayRoom = `${student.classRoom} (본인 학급 교실)`;
      displaySubject = '자율활동';
      displayTeacher = '담임';
      subNote = '💡 월요일 1교시는 자율활동 시간으로 본인 학급 교실에 있습니다.';
    } else if (isG3Twt7) {
      displayRoom = `${student.classRoom} (본인 학급 교실)`;
      displaySubject = '공강 (자습)';
      displayTeacher = '';
      subNote = '💡 3학년 화·수·목 7교시는 공강 시간으로 본인 학급 교실에 있습니다.';
    } else if (isFree) {
      if (student.grade === 3) {
        displayRoom = '홈베이스';
        displaySubject = '공강 (자습)';
        displayTeacher = '';
        subNote = '💡 공강 시간으로 홈베이스에 위치하고 있습니다.';
      } else {
        displayRoom = `${student.classRoom} (본인 학급 교실)`;
        displaySubject = '공강';
        displayTeacher = '';
        subNote = '💡 공강 시간으로 본인 학급 교실에 위치하고 있습니다.';
      }
    } else {
      if (displayRoom.includes(student.classRoom)) {
        displayRoom = `${student.classRoom} (본인 학급 교실)`;
        subNote = '💡 본인 학급 교실에서 수업 진행 중';
      } else if (displayRoom === '운동장') {
        subNote = '💡 운동장에서 야외 체육 수업 진행 중';
      } else if (displayRoom.includes('음악실') || displayRoom.includes('수학실') || displayRoom.includes('생물실') || displayRoom.includes('지구과학실') || displayRoom.includes('화학실') || displayRoom.includes('영어전용실') || displayRoom.includes('미술실') || displayRoom.includes('컴퓨터실') || displayRoom.includes('실')) {
        subNote = `💡 특별실(${displayRoom})에서 이동수업 진행 중`;
      } else {
        subNote = `💡 이동수업 수강 중 (${displayRoom})`;
      }
    }

    const cat = isFree ? 'cat-free' : getSubjectCategory(displaySubject);

    return `
      <div class="student-live-hero-card">
        <div class="student-hero-header">
          <div class="student-hero-title">
            <span>📍</span>
            <span><strong>${escapeHtml(student.name)}</strong> 학생의 현재 실시간 수업 및 위치</span>
          </div>
          <div class="student-hero-live-badge status-active">
            <span class="live-status-dot"></span>
            <span>${isSim ? '⚡ 시뮬레이션 수업 진행' : '🔔 실시간 수업 진행 중'}</span>
            <span class="live-seconds-clock" id="studentLiveClock">${formatTime(now)}</span>
          </div>
        </div>

        <div class="student-hero-body">
          <div class="student-hero-info">
            <div class="student-hero-status-main">
              <span>🔔 ${curPeriodNum}교시 (${timeInfo ? `${timeInfo.start} ~ ${timeInfo.end}` : ''}):</span>
              <span class="subject-pill ${cat}" style="font-size: 1.1rem; padding: 0.35rem 0.85rem;">${escapeHtml(displaySubject)}</span>
              ${displayTeacher ? `
                <button type="button" class="target-badge" style="font-size: 0.95rem; padding: 0.3rem 0.75rem; border: none; cursor: pointer;" onclick="navigateToTeacher('${displayTeacher}')">
                  👨‍🏫 ${escapeHtml(displayTeacher)} 선생님 ➔
                </button>
              ` : ''}
            </div>
            <div class="student-hero-sub">
              <span>소속: <strong>${student.className} ${student.studentNum}번</strong></span>
              <span>•</span>
              <span>${subNote}</span>
            </div>
          </div>

          <div>
            <div class="student-hero-room-badge">
              <span>📍 현재 강의실:</span>
              <span>${escapeHtml(displayRoom)}</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // 2. Break Time (쉬는 시간)
  if (state.isBreakTime && state.nextPeriod) {
    const nextP = state.nextPeriod;
    const nextCell = student.schedule[todayName] ? student.schedule[todayName][nextP.toString()] : null;
    const nextTime = AppState.bellSchedule.find(b => b.period === nextP);
    let nextRoom = nextCell && nextCell.room ? nextCell.room : student.classRoom;
    if (todayName === '금' && [5, 6, 7].includes(nextP)) nextRoom = `${student.classRoom} (학급 교실)`;
    else if (todayName === '월' && nextP === 1) nextRoom = `${student.classRoom} (학급 교실)`;
    else if (student.grade === 3 && ['화', '수', '목'].includes(todayName) && nextP === 7) nextRoom = `${student.classRoom} (학급 교실)`;
    else if (student.grade === 3 && nextCell && nextCell.isFree) nextRoom = '홈베이스';
    else if (nextRoom.includes(student.classRoom)) nextRoom = `${student.classRoom} (학급 교실)`;

    return `
      <div class="student-live-hero-card">
        <div class="student-hero-header">
          <div class="student-hero-title">
            <span>☕</span>
            <span><strong>${escapeHtml(student.name)}</strong> 학생 - 쉬는 시간</span>
          </div>
          <div class="student-hero-live-badge status-break">
            <span class="live-status-dot"></span>
            <span>쉬는 시간 (다음: ${nextP}교시)</span>
            <span class="live-seconds-clock" id="studentLiveClock">${formatTime(now)}</span>
          </div>
        </div>
        <div class="student-hero-body">
          <div class="student-hero-info">
            <div class="student-hero-status-main">
              <span>☕ 쉬는 시간 진행 중 · 다음: <strong>${nextP}교시</strong> (${nextTime ? nextTime.start : ''} 시작)</span>
            </div>
            <div class="student-hero-sub">
              <span>다음 수업: <strong>${nextCell ? escapeHtml(nextCell.subject) : '수업'}</strong> ${nextCell && nextCell.teacher ? `(${escapeHtml(nextCell.teacher)} 선생님)` : ''}</span>
            </div>
          </div>
          <div>
            <div class="student-hero-room-badge" style="background: linear-gradient(135deg, #059669 0%, #10b981 100%);">
              <span>📍 다음 강의실:</span>
              <span>${escapeHtml(nextRoom)}</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // 3. Lunch Time (점심시간)
  if (state.isLunchTime) {
    const nextP = 5;
    const nextCell = student.schedule[todayName] ? student.schedule[todayName]['5'] : null;
    let nextRoom = nextCell && nextCell.room ? nextCell.room : student.classRoom;
    if (todayName === '금') nextRoom = `${student.classRoom} (학급 교실)`;
    else if (student.grade === 3 && nextCell && nextCell.isFree) nextRoom = '홈베이스';
    else if (nextRoom.includes(student.classRoom)) nextRoom = `${student.classRoom} (학급 교실)`;

    return `
      <div class="student-live-hero-card">
        <div class="student-hero-header">
          <div class="student-hero-title">
            <span>🍱</span>
            <span><strong>${escapeHtml(student.name)}</strong> 학생 - 점심시간</span>
          </div>
          <div class="student-hero-live-badge status-lunch">
            <span class="live-status-dot"></span>
            <span>점심시간 (12:10 ~ 13:10)</span>
            <span class="live-seconds-clock" id="studentLiveClock">${formatTime(now)}</span>
          </div>
        </div>
        <div class="student-hero-body">
          <div class="student-hero-info">
            <div class="student-hero-status-main">
              <span>🍱 즐거운 점심시간입니다. (5교시 13:10 시작)</span>
            </div>
            <div class="student-hero-sub">
              <span>5교시 수업: <strong>${nextCell ? escapeHtml(nextCell.subject) : '수업'}</strong> ${nextCell && nextCell.teacher ? `(${escapeHtml(nextCell.teacher)} 선생님)` : ''}</span>
            </div>
          </div>
          <div>
            <div class="student-hero-room-badge" style="background: linear-gradient(135deg, #d97706 0%, #f59e0b 100%);">
              <span>📍 5교시 강의실:</span>
              <span>${escapeHtml(nextRoom)}</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // 4. Outside School Hours / Weekend
  return `
    <div class="student-live-hero-card">
      <div class="student-hero-header">
        <div class="student-hero-title">
          <span>🌙</span>
          <span><strong>${escapeHtml(student.name)}</strong> 학생 - 일과 시간 외</span>
        </div>
        <div class="student-hero-live-badge status-idle">
          <span>${state.statusText}</span>
          <span class="live-seconds-clock" id="studentLiveClock">${formatTime(now)}</span>
        </div>
      </div>
      <div class="student-hero-body">
        <div class="student-hero-info">
          <div class="student-hero-status-main">
            <span>${state.statusText}</span>
          </div>
          <div class="student-hero-sub">
            <span>기본 소속 교실: <strong>${student.classRoom}</strong></span>
            <span>•</span>
            <span>상단의 [⏰ 시간 기준] 선택 상자에서 특정 교시를 선택하시면 해당 시간대 강의실 위치를 시뮬레이션으로 미리 확인하실 수 있습니다.</span>
          </div>
        </div>
        <div>
          <div class="student-hero-room-badge" style="background: #475569;">
            <span>기본 교실:</span>
            <span>${escapeHtml(student.classRoom)}</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderStudentTableView(student, todayName, state) {
  const curPeriodNum = state.activePeriod;

  return `
    ${renderFridayChangcheSelectorBar()}
    <div class="timetable-card">
      <table class="timetable-grid">
        <thead>
          <tr>
            <th class="period-col">교시</th>
            ${DAYS.map(day => `
              <th class="day-col ${day === todayName ? 'today' : ''}">
                ${day}요일 ${day === todayName ? '<span style="font-size:0.75rem; color:var(--primary); font-weight:800;">(오늘)</span>' : ''}
              </th>
            `).join('')}
          </tr>
        </thead>
        <tbody>
          ${PERIODS.map(period => {
            const timeInfo = AppState.bellSchedule.find(b => b.period === period);
            const isCurPeriodRow = (curPeriodNum === period);

            let rowHtml = `
              <tr>
                <td class="period-col ${isCurPeriodRow ? 'current-period-head' : ''}">
                  <div class="period-cell-header">
                    <span class="period-num">${period}</span>
                    <span class="period-time">${timeInfo ? timeInfo.start : ''}</span>
                    ${isCurPeriodRow ? '<span style="font-size:0.65rem; color:var(--primary); font-weight:800;">지금</span>' : ''}
                  </div>
                </td>
                ${DAYS.map(day => {
                  const cell = student.schedule[day] ? student.schedule[day][period.toString()] : null;
                  const isToday = (day === todayName);

                  let isCurrentSlot = false;
                  let isUpcomingSlot = false;
                  let slotBadge = '';

                  if (isToday) {
                    if (curPeriodNum === period) {
                      isCurrentSlot = true;
                      slotBadge = `<span class="current-slot-badge">🔔 지금 (${period}교시 수강 중)</span>`;
                    } else if (state.isBreakTime && state.nextPeriod === period) {
                      isUpcomingSlot = true;
                      slotBadge = `<span class="upcoming-slot-badge">☕ 곧 시작 (${period}교시)</span>`;
                    } else if (state.isLunchTime && period === 5) {
                      isUpcomingSlot = true;
                      slotBadge = `<span class="upcoming-slot-badge">다음 수업 (13:10)</span>`;
                    }
                  }

                  const cellClass = `timetable-cell ${isToday ? 'is-today' : ''} ${isCurrentSlot ? 'is-current-slot' : ''} ${isUpcomingSlot ? 'is-upcoming-slot' : ''}`;

                  const isFri567 = day === '금' && (period === 5 || period === 6 || period === 7);
                  const isMon1 = day === '월' && period === 1;
                  const isG3Twt7 = student.grade === 3 && (day === '화' || day === '수' || day === '목') && period === 7;

                  // Dynamic Friday Changche for Student Table View
                  if (isFri567) {
                    const changcheSlot = resolveChangcheSlot(student.grade, student.classNum, period, AppState.selectedFridayWeekDate);
                    if (changcheSlot) {
                      return `
                        <td class="${cellClass}">
                          ${slotBadge}
                          <div class="student-cell-subject">
                            <span class="subject-pill ${changcheSlot.category}">${escapeHtml(changcheSlot.subject)}</span>
                          </div>
                          <div class="student-cell-teacher">
                            <button type="button" class="target-badge" style="font-size: 0.76rem; padding: 0.15rem 0.45rem; border-radius: 4px;" ${changcheSlot.teacherName ? `onclick="navigateToTeacher('${changcheSlot.teacherName}')" title="${changcheSlot.teacherName} 선생님 시간표로 이동"` : 'style="cursor:default;"'} title="${changcheSlot.note}">
                              👨‍🏫 ${escapeHtml(changcheSlot.teacher)}
                            </button>
                          </div>
                          <div class="student-cell-room">
                            <span class="room-pill is-homeroom">
                              📍 ${escapeHtml(student.classRoom)}
                            </span>
                          </div>
                        </td>
                      `;
                    }
                  }

                  const isFree = !cell || cell.isFree || cell.subject === '공강';

                  if (isFree) {
                    let freeRoom = student.classRoom;
                    if (isG3Twt7) {
                      freeRoom = student.classRoom;
                    } else if (student.grade === 3) {
                      freeRoom = '홈베이스';
                    } else {
                      freeRoom = student.classRoom;
                    }

                    const isHomebase = (freeRoom === '홈베이스');
                    const isHomeroom = (freeRoom.includes(student.classRoom));

                    return `
                      <td class="${cellClass} is-free-cell">
                        ${slotBadge}
                        <div class="student-cell-subject">
                          <span class="subject-pill cat-free">공강</span>
                        </div>
                        <div class="student-cell-room ${isCurrentSlot ? 'highlight-room' : ''}">
                          <span class="room-pill ${isHomebase ? 'is-homebase' : (isHomeroom ? 'is-homeroom' : '')}">
                            📍 ${escapeHtml(freeRoom)} ${isHomeroom ? '<span style="font-size:0.68rem; opacity:0.85;">(학급)</span>' : ''}
                          </span>
                        </div>
                      </td>
                    `;
                  }

                  const cat = getSubjectCategory(cell.subject);
                  const isHomeroom = student.grade === 1 || isFri567 || isMon1;

                  return `
                    <td class="${cellClass}">
                      ${slotBadge}
                      <div class="student-cell-subject">
                        <span class="subject-pill ${cat}">${escapeHtml(cell.subject)}</span>
                      </div>
                      ${cell.teacher ? `
                        <div class="student-cell-teacher">
                          <button type="button" class="target-badge" style="font-size: 0.76rem; padding: 0.15rem 0.45rem; border: none; cursor: pointer;" onclick="navigateToTeacher('${cell.teacher}')">
                            👨‍🏫 ${escapeHtml(cell.teacher)} ➔
                          </button>
                        </div>
                      ` : ''}
                      <div class="student-cell-room ${isCurrentSlot ? 'highlight-room' : ''}">
                        <span class="room-pill ${isHomeroom ? 'is-homeroom' : ''}">
                          📍 ${escapeHtml(cell.room)} ${isHomeroom ? '<span style="font-size:0.68rem; opacity:0.85;">(학급)</span>' : ''}
                        </span>
                      </div>
                    </td>
                  `;
                }).join('')}
              </tr>
            `;

            if (period === 4) {
              const isLunchNow = (todayName === state.todayDayName) && state.isLunchTime;
              rowHtml += `
                <tr class="lunch-divider-row ${isLunchNow ? 'is-current-lunch' : ''}">
                  <td class="lunch-col-head" style="font-weight: 700;">🍱</td>
                  <td colspan="5">
                    <div class="lunch-content">
                      <span>🍱 점심시간 (12:10 ~ 13:10)</span>
                      ${isLunchNow ? '<span class="current-lunch-badge">🔔 지금 점심시간 진행 중</span>' : ''}
                    </div>
                  </td>
                </tr>
              `;
            }

            return rowHtml;
          }).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function renderStudentCardView(student, todayName, state) {
  const currentDay = AppState.mobileSelectedDay;

  return `
    ${renderFridayChangcheSelectorBar()}
    <div class="mobile-day-tabs">
      ${DAYS.map(day => `
        <button type="button" class="mobile-day-tab ${day === currentDay ? 'active' : ''} ${day === todayName ? 'today-marker' : ''}" onclick="setMobileDay('${day}')">
          <span>${day}요일</span>
          <span style="font-size: 0.72rem; font-weight: 500;">${student.hoursByDay[day] || 0}시간</span>
        </button>
      `).join('')}
    </div>

    <div class="mobile-period-list">
      ${PERIODS.map(period => {
        const timeInfo = AppState.bellSchedule.find(b => b.period === period);
        const cell = student.schedule[currentDay] ? student.schedule[currentDay][period.toString()] : null;
        const isToday = (currentDay === todayName);

        let isCurrentSlot = false;
        let isUpcomingSlot = false;
        let badgeHtml = '';

        if (isToday) {
          if (state.activePeriod === period) {
            isCurrentSlot = true;
            badgeHtml = `<div style="margin-bottom:0.25rem;"><span class="current-slot-badge">🔔 지금 (${period}교시 수강 중)</span></div>`;
          } else if (state.isBreakTime && state.nextPeriod === period) {
            isUpcomingSlot = true;
            badgeHtml = `<div style="margin-bottom:0.25rem;"><span class="upcoming-slot-badge">☕ 곧 시작 (${period}교시)</span></div>`;
          } else if (state.isLunchTime && period === 5) {
            badgeHtml = `<div style="margin-bottom:0.25rem;"><span class="upcoming-slot-badge">다음 수업 (13:10)</span></div>`;
          }
        }

        const isFri567 = currentDay === '금' && (period === 5 || period === 6 || period === 7);
        const isMon1 = currentDay === '월' && period === 1;
        const isG3Twt7 = student.grade === 3 && (currentDay === '화' || currentDay === '수' || currentDay === '목') && period === 7;

        // Dynamic Friday Changche for Student Mobile Card
        let isStudentChangche = false;
        let studentChangcheSlot = null;
        if (isFri567) {
          studentChangcheSlot = resolveChangcheSlot(student.grade, student.classNum, period, AppState.selectedFridayWeekDate);
          if (studentChangcheSlot) isStudentChangche = true;
        }

        const isFree = isStudentChangche ? false : (!cell || cell.isFree || cell.subject === '공강');
        const cat = isStudentChangche ? studentChangcheSlot.category : (!isFree && cell ? getSubjectCategory(cell.subject) : '');

        let freeRoom = student.classRoom;
        if (isG3Twt7) {
          freeRoom = student.classRoom;
        } else if (student.grade === 3) {
          freeRoom = '홈베이스';
        } else {
          freeRoom = student.classRoom;
        }

        const isHomebase = (freeRoom === '홈베이스');
        const isHomeroom = (freeRoom.includes(student.classRoom)) || student.grade === 1 || isFri567 || isMon1;

        let itemHtml = `
          <div class="mobile-period-card ${isCurrentSlot ? 'is-current is-current-slot' : ''} ${isUpcomingSlot ? 'is-upcoming-slot' : ''} ${isFree ? 'is-free-period-card' : ''}">
            <div class="mobile-period-left">
              <div class="mobile-period-badge">
                <span>${period}</span>
                <span class="mobile-period-time">${timeInfo ? timeInfo.start : ''}</span>
              </div>
              <div>
                ${badgeHtml}
                ${isFree ? `
                  <div class="mobile-period-subject">
                    <span class="subject-pill cat-free">공강</span>
                  </div>
                  <div style="font-size: 0.78rem; color: var(--text-muted); margin-top: 0.15rem;">
                    ${timeInfo ? `${timeInfo.start} ~ ${timeInfo.end}` : ''}
                  </div>
                  <div class="student-cell-room ${isCurrentSlot ? 'highlight-room' : ''}" style="margin-top: 0.25rem;">
                    <span class="room-pill ${isHomebase ? 'is-homebase' : (isHomeroom ? 'is-homeroom' : '')}">
                      📍 위치: <strong>${escapeHtml(freeRoom)}</strong> ${isHomeroom ? '<span style="font-size:0.68rem; opacity:0.85;">(학급)</span>' : ''}
                    </span>
                  </div>
                ` : `
                  <div class="mobile-period-subject">
                    <span class="subject-pill ${cat}">${isStudentChangche ? escapeHtml(studentChangcheSlot.subject) : escapeHtml(cell ? cell.subject : '')}</span>
                  </div>
                  <div style="font-size: 0.78rem; color: var(--text-muted); margin-top: 0.15rem;">
                    ${timeInfo ? `${timeInfo.start} ~ ${timeInfo.end}` : ''} ${isStudentChangche ? `· ${studentChangcheSlot.note}` : ''}
                  </div>
                  <div class="student-cell-room ${isCurrentSlot ? 'highlight-room' : ''}" style="margin-top: 0.25rem;">
                    <span class="room-pill ${isHomeroom ? 'is-homeroom' : ''}">
                      📍 ${isStudentChangche ? '위치' : '강의실'}: <strong>${isStudentChangche ? escapeHtml(student.classRoom) : escapeHtml(cell.room)}</strong> ${isHomeroom ? '<span style="font-size:0.68rem; opacity:0.85;">(학급)</span>' : ''}
                    </span>
                  </div>
                `}
              </div>
            </div>

            <div>
              ${isStudentChangche ? `
                <button type="button" class="target-badge" style="font-size: 0.82rem; padding: 0.3rem 0.65rem; border:none; cursor:pointer;" ${studentChangcheSlot.teacherName ? `onclick="navigateToTeacher('${studentChangcheSlot.teacherName}')"` : 'style="cursor:default;"'} title="${studentChangcheSlot.note}">
                  👨‍🏫 ${escapeHtml(studentChangcheSlot.teacher)}
                </button>
              ` : (!isFree && cell && cell.teacher ? `
                <button type="button" class="target-badge" style="font-size: 0.82rem; padding: 0.3rem 0.65rem; border:none; cursor:pointer;" onclick="navigateToTeacher('${cell.teacher}')">
                  👨‍🏫 ${escapeHtml(cell.teacher)} ➔
                </button>
              ` : '')}
            </div>
          </div>
        `;

        if (period === 4) {
          const isLunchNow = isToday && state.isLunchTime;
          itemHtml += `
            <div class="mobile-period-card ${isLunchNow ? 'is-current is-current-lunch' : ''}" style="background: var(--bg-hover); padding: 0.65rem 1rem; border: 1px dashed var(--border-color);">
              <div style="display:flex; align-items:center; justify-content:space-between; width:100%;">
                <span style="font-weight:700; font-size:0.88rem;">🍱 점심시간 (12:10 ~ 13:10)</span>
                ${isLunchNow ? '<span class="current-lunch-badge">🔔 지금 진행 중</span>' : ''}
              </div>
            </div>
          `;
        }

        return itemHtml;
      }).join('')}
    </div>
  `;
}

// Fixed Korean IME search handler: updates chips and duplicate alert WITHOUT re-rendering input!
function handleStudentSearch(e) {
  AppState.studentSearchQuery = e.target.value;
  const clearBtn = document.getElementById('studentSearchClearBtn');
  if (clearBtn) clearBtn.style.display = AppState.studentSearchQuery ? 'flex' : 'none';

  updateStudentFilterResults();
}

function handleStudentSearchKeyDown(e) {
  if (e.key === 'Enter') {
    e.preventDefault();
    const filtered = getFilteredStudentsList();
    if (filtered.length > 0) {
      selectStudent(filtered[0].id);
    }
  }
}

function updateStudentFilterResults() {
  const allStudents = AppState.data.students || [];
  const nameToCount = {};
  allStudents.forEach(s => { nameToCount[s.name] = (nameToCount[s.name] || 0) + 1; });

  const filtered = getFilteredStudentsList();
  const q = (AppState.studentSearchQuery || '').trim();

  // If searching and current selection is not in filtered list, auto-select first match!
  let currentStudent = allStudents.find(s => s.id === AppState.selectedStudentId);
  if (q && filtered.length > 0 && (!currentStudent || !filtered.some(s => s.id === currentStudent.id))) {
    AppState.selectedStudentId = filtered[0].id;
    currentStudent = filtered[0];
  } else if (!currentStudent) {
    currentStudent = filtered[0] || allStudents[0];
  }

  const chipsContainer = document.getElementById('studentChipsContainer');
  if (chipsContainer) {
    chipsContainer.innerHTML = renderStudentChipsHtml(filtered, currentStudent, nameToCount);
  }

  const alertContainer = document.getElementById('duplicateAlertContainer');
  if (alertContainer) {
    alertContainer.innerHTML = renderDuplicateAlertHtml(filtered, currentStudent, nameToCount, AppState.studentSearchQuery);
  }

  const countBadge = document.getElementById('studentCountBadge');
  if (countBadge) {
    countBadge.textContent = `${filtered.length}명`;
  }

  // Update top hero card & timetable detail area in real-time as user types!
  const detailArea = document.getElementById('studentTimetableDetailArea');
  if (detailArea && currentStudent) {
    const now = new Date();
    let state = getActivePeriodState(now);
    let todayName = state.todayDayName;

    if (AppState.studentSimTime && AppState.studentSimTime !== 'real') {
      const simParts = AppState.studentSimTime.split('_');
      if (simParts.length === 2) {
        todayName = simParts[0];
        const pNum = parseInt(simParts[1], 10);
        const bInfo = AppState.bellSchedule.find(b => b.period === pNum);
        state = {
          todayDayName: todayName,
          activePeriod: pNum,
          isLunchTime: false,
          isBreakTime: false,
          nextPeriod: pNum < 7 ? pNum + 1 : null,
          statusText: `[시뮬레이션 모드] ${todayName}요일 ${pNum}교시 (${bInfo ? `${bInfo.start}~${bInfo.end}` : ''})`,
          statusBadgeClass: 'status-active',
          isWeekday: true,
          curTime: bInfo ? bInfo.start : '09:00'
        };
      }
    }
    detailArea.innerHTML = renderStudentDetailAreaHtml(currentStudent, todayName, state, now);
  }
}

function clearStudentSearch() {
  AppState.studentSearchQuery = '';
  const input = document.getElementById('studentSearchInput');
  if (input) input.value = '';
  const clearBtn = document.getElementById('studentSearchClearBtn');
  if (clearBtn) clearBtn.style.display = 'none';

  updateStudentFilterResults();
}

function setStudentGradeFilter(grade) {
  AppState.studentSelectedGrade = grade;
  AppState.studentSelectedClass = 'all';
  renderApp();
}

function setStudentClassFilter(classNum) {
  AppState.studentSelectedClass = classNum;
  renderApp();
}

function toggleStudentSubmenu() {
  AppState.studentSubmenuOpen = !AppState.studentSubmenuOpen;
  renderApp();
  if (AppState.studentSubmenuOpen) {
    const el = document.getElementById('studentSelectorCard');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

function setStudentChosung(ch) {
  if (AppState.studentChosung === ch) {
    AppState.studentChosung = 'none';
  } else {
    AppState.studentChosung = ch;
  }
  renderApp();
}

function selectStudent(studentId) {
  AppState.selectedStudentId = studentId;
  AppState.studentSubmenuOpen = false; // Close submenu on selection so timetable is right at top!
  renderApp();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function setStudentSimTime(val) {
  AppState.studentSimTime = val;
  renderApp();
}

function navigateToStudent(studentId) {
  AppState.selectedStudentId = studentId;
  AppState.studentSearchQuery = '';
  AppState.studentSubmenuOpen = false;
  switchTab('student');
}

/* ==========================================================================
   3. 🤝 공강 교집합 & 회의 시간 추천 (Meeting Finder Engine - Categorized Presets)
   ========================================================================== */
function renderMeetingView(container) {
  if (!AppState.data || !AppState.data.teachers) {
    container.innerHTML = `<div class="control-card"><p>교사 데이터가 없습니다.</p></div>`;
    return;
  }

  const allTeachers = sortTeachersList(AppState.data.teachers);
  const selectedTeacherObjs = sortTeachersList(allTeachers.filter(t => AppState.meetingSelectedTeachers.includes(t.id)));

  // Compute Categorized Presets
  const presets = getCategorizedPresets(AppState.meetingPresetCategory);

  // Run Meeting Intersection Analysis
  const analysisResult = analyzeMeetingAvailability(selectedTeacherObjs);

  let html = `
    <!-- Meeting Setup Card -->
    <div class="control-card">
      <div class="control-header">
        <div class="control-title">
          <span>🤝</span>
          <span>공강 시간 교집합 · 회의 시간 추천</span>
          <span class="chip-badge">${selectedTeacherObjs.length}명 선택됨</span>
        </div>
        <div class="control-tools">
          <button class="btn btn-secondary" onclick="window.print()" title="회의 일정 및 히트맵 인쇄">
            🖨️ 인쇄
          </button>
          <button class="btn btn-primary" onclick="copyMeetingProposal()" title="회의 가능 시간 클립보드 복사">
            📋 회의 추천 시간 복사
          </button>
          <button class="btn btn-secondary" onclick="clearMeetingTeachers()">
            초기화
          </button>
        </div>
      </div>

      <!-- Preset Category Selector Tabs -->
      <div class="preset-category-tabs">
        <button class="preset-category-btn ${AppState.meetingPresetCategory === 'committee' ? 'active' : ''}" onclick="setMeetingPresetCategory('committee')">
          🏛️ 위원회 회의
        </button>
        <button class="preset-category-btn ${AppState.meetingPresetCategory === 'admin' ? 'active' : ''}" onclick="setMeetingPresetCategory('admin')">
          🏢 업무 부서별 (12개 부서)
        </button>
        <button class="preset-category-btn ${AppState.meetingPresetCategory === 'role' ? 'active' : ''}" onclick="setMeetingPresetCategory('role')">
          👑 부장단 회의 (12명)
        </button>
        <button class="preset-category-btn ${AppState.meetingPresetCategory === 'subject' ? 'active' : ''}" onclick="setMeetingPresetCategory('subject')">
          📚 교과 부서별 (6개 교과)
        </button>
        <button class="preset-category-btn ${AppState.meetingPresetCategory === 'grade' ? 'active' : ''}" onclick="setMeetingPresetCategory('grade')">
          🏫 학년 담임 (1~3학년)
        </button>
        <button class="preset-category-btn ${AppState.meetingPresetCategory === 'all' ? 'active' : ''}" onclick="setMeetingPresetCategory('all')">
          👥 전체 교사
        </button>
      </div>

      <!-- Quick Preset Buttons for Selected Category -->
      <div class="meeting-preset-bar">
        ${presets.map(p => {
          let extraClass = '';
          if (p.name.startsWith('admin_')) {
            const dept = p.name.replace('admin_', '');
            extraClass = `badge-admin-${dept}`;
          } else if (p.name.startsWith('dept_')) {
            const dept = p.name.replace('dept_', '');
            extraClass = `badge-subj-${dept}`;
          } else if (p.name.startsWith('grade')) {
            const gr = p.name.replace('grade', '');
            extraClass = `badge-grade-${gr}`;
          }
          return `
            <button class="preset-btn ${extraClass} ${AppState.meetingActivePreset === p.name ? 'active' : ''}" onclick="applyMeetingPreset('${p.name}', '${p.label}')">
              ${p.icon ? `${p.icon} ` : ''}${p.label} <span class="chip-badge">${p.teacherIds.length}명</span>
            </button>
          `;
        }).join('')}
      </div>

      <!-- Selected Teachers Tag Cloud -->
      ${selectedTeacherObjs.length > 0 ? `
        <div class="selected-teachers-wrap">
          <div style="font-size: 0.85rem; font-weight: 700; color: var(--text-primary);">
            선택된 교사 (${selectedTeacherObjs.length}명)${AppState.meetingActivePresetTitle ? ` - <span style="color:var(--primary);">${AppState.meetingActivePresetTitle}</span>` : ''}:
          </div>
          <div class="selected-tags-list">
            ${selectedTeacherObjs.map(t => {
              const admin = getTeacherAdminInfo(t.name);
              const subj = getTeacherSubject(t.name);
              return `
                <span class="selected-tag-item">
                  <span>${t.name}</span>
                  ${admin && admin.isHead ? `<span class="role-badge-head" style="margin-left:0.15rem;">부장</span>` : ''}
                  ${admin && admin.isPlan ? `<span class="role-badge-plan" style="margin-left:0.15rem;">기획</span>` : ''}
                  ${admin && admin.isDuty ? `<span class="role-badge-duty badge-admin-${admin.dept}" style="margin-left:0.15rem;">${admin.duty}</span>` : ''}
                  ${subj ? `<span class="chip-badge badge-subj-${subj}" style="font-size:0.68rem; margin-left:0.2rem;">${subj}</span>` : ''}
                  ${t.homeroom ? `<span class="chip-badge badge-grade-${getGradeFromHomeroom(t.homeroom)}" style="font-size:0.68rem; margin-left:0.2rem;">${t.homeroom}</span>` : ''}
                  ${getSubHomeroomForTeacher(t.name) ? `<span class="chip-badge" style="font-size:0.68rem; margin-left:0.2rem; background:#f0fdf4; color:#166534; border:1px solid #86efac;">${getSubHomeroomForTeacher(t.name)} 부</span>` : ''}
                  <button class="selected-tag-remove" onclick="removeMeetingTeacher('${t.id}')">✕</button>
                </span>
              `;
            }).join('')}
          </div>
        </div>
      ` : `
        <div style="padding: 0.85rem; background: var(--warning-light); border-radius: var(--radius-md); color: var(--warning-text); font-size: 0.88rem; margin-bottom: 1rem;">
          ⚠️ 회의에 참석할 부서/교사를 위의 프리셋 버튼을 누르거나 아래 교사 목록에서 2명 이상 선택해주세요.
        </div>
      `}

      <!-- Teacher Multi-Select Chips (가나다순) -->
      <div style="font-size: 0.82rem; font-weight: 700; color: var(--text-muted); margin-bottom: 0.35rem;">
        전체 교사 목록 (가나다순, 클릭하여 개별 추가/제거):
      </div>
      <div class="chips-group" style="max-height: 140px;">
        ${allTeachers.map(t => {
          const isSelected = AppState.meetingSelectedTeachers.includes(t.id);
          const admin = getTeacherAdminInfo(t.name);
          const subj = getTeacherSubject(t.name);
          return `
            <button class="chip-btn ${isSelected ? 'active' : ''}" onclick="toggleMeetingTeacher('${t.id}')">
              <span>${isSelected ? '✓' : '+'}</span>
              <span>${t.name}</span>
              ${admin && admin.isHead ? `<span class="role-badge-head">부장</span>` : ''}
              ${admin && admin.isPlan ? `<span class="role-badge-plan">기획</span>` : ''}
              ${admin && admin.isDuty ? `<span class="role-badge-duty badge-admin-${admin.dept}">${admin.duty}</span>` : ''}
              ${subj ? `<span class="chip-badge badge-subj-${subj}" style="font-size:0.7rem;">${subj}</span>` : ''}
              ${t.homeroom ? `<span class="chip-badge badge-grade-${getGradeFromHomeroom(t.homeroom)}" style="font-size:0.7rem;">${t.homeroom}</span>` : ''}
              ${getSubHomeroomForTeacher(t.name) ? `<span class="chip-badge" style="font-size:0.7rem; background:#f0fdf4; color:#166534; border:1px solid #86efac;">${getSubHomeroomForTeacher(t.name)} 부</span>` : ''}
            </button>
          `;
        }).join('')}
      </div>
    </div>
  `;

  if (selectedTeacherObjs.length >= 2) {
    html += `
      <!-- TOP Recommended Meeting Times with Day Filter Tabs -->
      <div class="control-card" style="border-color: var(--primary);">
        <div class="control-header" style="flex-wrap: wrap; gap: 0.5rem;">
          <div class="control-title">
            <span>🏆</span>
            <span>추천 회의 시간 TOP 순위</span>
          </div>
          
          <!-- Day Tabs (월, 화, 수, 목, 금, 전체) -->
          <div style="display: flex; gap: 0.4rem; align-items: center; flex-wrap: wrap;">
            <span style="font-size: 0.8rem; font-weight: 700; color: var(--text-muted);">요일별 보기:</span>
            <div class="grade-tabs" style="margin-bottom: 0;">
              <button class="grade-tab-btn ${AppState.meetingRecDay === 'all' ? 'active' : ''}" onclick="setMeetingRecDay('all')">
                전체 요일
              </button>
              ${DAYS.map(d => `
                <button class="grade-tab-btn ${AppState.meetingRecDay === d ? 'active' : ''}" onclick="setMeetingRecDay('${d}')">
                  ${d}요일
                </button>
              `).join('')}
            </div>
          </div>
        </div>

        <div class="rec-cards-grid">
          ${(() => {
            let displayRecs = analysisResult.recommendations;
            if (AppState.meetingRecDay !== 'all') {
              const daySlots = Object.values(analysisResult.matrix[AppState.meetingRecDay] || {});
              daySlots.sort((a, b) => {
                if (a.tier !== b.tier) return a.tier - b.tier;
                if (a.freeCount !== b.freeCount) return b.freeCount - a.freeCount;
                return a.period - b.period;
              });
              displayRecs = daySlots;
            }

            if (!displayRecs || displayRecs.length === 0) {
              return `<p style="color: var(--text-muted); padding: 1rem;">해당 조건의 추천 회의 가능 시간이 없습니다.</p>`;
            }

            return displayRecs.map((rec, idx) => {
              const rankIcon = idx === 0 ? '🥇 1순위' : (idx === 1 ? '🥈 2순위' : (idx === 2 ? '🥉 3순위' : `${idx + 1}순위`));
              const tierClass = rec.tier === 1 ? 'tier-1' : 'tier-2';
              const timeInfo = AppState.bellSchedule.find(b => b.period === rec.period);

              return `
                <div class="meeting-rec-card ${tierClass}" onclick="openSlotDetails('${rec.day}', ${rec.period})">
                  <div class="rec-rank-badge ${tierClass}">
                    <span>${rankIcon}</span>
                    <span>· ${rec.matchRate}% 참석 가능</span>
                  </div>
                  <div class="rec-time-title">${rec.day}요일 ${rec.period}교시</div>
                  <div class="rec-time-sub">${timeInfo ? `${timeInfo.start} ~ ${timeInfo.end}` : ''}</div>
                  
                  <div class="rec-status-line" style="color: ${rec.tier === 1 ? 'var(--success-text)' : 'var(--warning-text)'};">
                    ${rec.tier === 1 
                      ? `<span>🎉 선택 교사 ${selectedTeacherObjs.length}명 전원 공강</span>` 
                      : `<span>⚠️ ${rec.freeCount}/${selectedTeacherObjs.length}명 공강 (${rec.busyTeachers.map(b => b.name).join(', ')} 수업 중)</span>`
                    }
                  </div>
                </div>
              `;
            }).join('');
          })()}
        </div>
      </div>

      <!-- Weekly Availability Heatmap Matrix -->
      <div class="control-card">
        <div class="control-header">
          <div class="control-title">
            <span>🗺️</span>
            <span>주간 회의 가능 시간 히트맵 (Weekly Availability Heatmap)</span>
          </div>
          <div style="display: flex; gap: 0.75rem; font-size: 0.78rem; flex-wrap: wrap;">
            <span style="display: inline-flex; align-items: center; gap: 0.25rem;">
              <span style="width:12px; height:12px; background:var(--heat-100-bg); border:1px solid var(--heat-100-border); border-radius:2px;"></span> 전원 가능 (100%)
            </span>
            <span style="display: inline-flex; align-items: center; gap: 0.25rem;">
              <span style="width:12px; height:12px; background:var(--heat-almost-bg); border:1px solid var(--heat-almost-border); border-radius:2px;"></span> 1명 수업 (차선책)
            </span>
            <span style="display: inline-flex; align-items: center; gap: 0.25rem;">
              <span style="width:12px; height:12px; background:var(--heat-busy-bg); border:1px solid var(--heat-busy-border); border-radius:2px;"></span> 다수 수업 중
            </span>
          </div>
        </div>

        <div style="overflow-x: auto;">
          <table class="heatmap-table">
            <thead>
              <tr>
                <th style="width: 80px;">교시</th>
                ${DAYS.map(d => `<th>${d}요일</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${PERIODS.map(period => {
                const timeInfo = AppState.bellSchedule.find(b => b.period === period);
                return `
                  <tr>
                    <td style="background: var(--bg-hover); font-weight: 700;">
                      <div>${period}교시</div>
                      <div style="font-size: 0.68rem; color: var(--text-muted);">${timeInfo ? timeInfo.start : ''}</div>
                    </td>
                    ${DAYS.map(day => {
                      const slot = analysisResult.matrix[day][period];
                      let cellClass = 'heatmap-busy';
                      if (slot.isAllFree) cellClass = 'heatmap-all-free';
                      else if (slot.isAlmostFree) cellClass = 'heatmap-almost-free';

                      return `
                        <td class="heatmap-cell ${cellClass}" onclick="openSlotDetails('${day}', ${period})" title="${day}요일 ${period}교시: ${slot.freeCount}/${selectedTeacherObjs.length}명 공강">
                          <div class="heatmap-ratio">${slot.freeCount} / ${selectedTeacherObjs.length}</div>
                          <div class="heatmap-label">${slot.matchRate}%</div>
                        </td>
                      `;
                    }).join('')}
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>

        <!-- Selected Slot Detail Box -->
        ${AppState.meetingSelectedSlot ? renderSlotDetailBox(AppState.meetingSelectedSlot, analysisResult, selectedTeacherObjs) : `
          <div style="text-align: center; color: var(--text-muted); font-size: 0.82rem; margin-top: 1rem;">
            👆 위 히트맵 표에서 특정 교시 칸을 클릭하면 참석 가능/불가 교사 상세 내역을 확인할 수 있습니다.
          </div>
        `}
      </div>
    `;
  }

  container.innerHTML = html;
}

function setMeetingRecDay(day) {
  AppState.meetingRecDay = day;
  renderApp();
}

// Compute Presets Categorized (Committee, Admin, Roles, Subjects, Grades)
function getCategorizedPresets(category) {
  if (!AppState.data || !AppState.data.teachers) return [];
  const teachers = AppState.data.teachers;
  const presets = [];

  // Subject Heads (교과부장 6명)
  const subjHeadNames = ['최호성', '최진화', '정동걸', '하정우', '양우석', '김동민'];
  const subjHeadIds = sortTeachersList(teachers.filter(t => subjHeadNames.includes(t.name))).map(t => t.id);

  if (category === 'committee') {
    // 학업성적관리위원회 (8명)
    const commNames = ['박성훈', '이상환', '이혜나', '전아린', '김정은', '김주영', '김정현', '강연선'];
    const commIds = sortTeachersList(teachers.filter(t => commNames.includes(t.name))).map(t => t.id);
    presets.push({
      name: 'comm_academic',
      label: '학업성적관리위원회',
      icon: '📝',
      teacherIds: commIds
    });
  } else if (category === 'admin') {
    for (const [dept, members] of Object.entries(OFFICIAL_ADMIN_DEPTS)) {
      // Admin dept preset: [부장, 기획, 나머지 가나다순]
      const teacherIds = sortTeachersList(teachers.filter(t => members.includes(t.name)), dept).map(t => t.id);
      presets.push({
        name: 'admin_' + dept,
        label: dept,
        icon: ADMIN_DEPT_ICONS[dept] || '🏢',
        teacherIds: teacherIds
      });
    }
  } else if (category === 'role') {
    // Heads meeting (부장단 12명)
    const headNames = Object.values(OFFICIAL_ADMIN_DEPTS).map(m => m[0]);
    const headIds = sortTeachersList(teachers.filter(t => headNames.includes(t.name))).map(t => t.id);
    presets.push({
      name: 'role_heads',
      label: '부장단 회의',
      icon: '👑',
      teacherIds: headIds
    });
  } else if (category === 'subject') {
    // 교과부장 회의 preset (6명)
    presets.push({
      name: 'role_subj_heads',
      label: '교과부장 회의 (6명)',
      icon: '📚',
      teacherIds: subjHeadIds
    });

    for (const [dept, names] of Object.entries(OFFICIAL_DEPARTMENTS)) {
      const teacherIds = sortTeachersList(teachers.filter(t => names.includes(t.name))).map(t => t.id);
      presets.push({
        name: 'dept_' + dept,
        label: dept,
        icon: DEPT_ICONS[dept] || '📚',
        teacherIds: teacherIds
      });
    }
  } else if (category === 'grade') {
    const g1 = sortTeachersList(teachers.filter(t => t.homeroom && t.homeroom.startsWith('1-'))).map(t => t.id);
    if (g1.length > 0) presets.push({ name: 'grade1', label: '1학년 담임', icon: '🌱', teacherIds: g1 });

    const g1sub = sortTeachersList(teachers.filter(t => getSubHomeroomForTeacher(t.name) && getSubHomeroomForTeacher(t.name).startsWith('1-'))).map(t => t.id);
    if (g1sub.length > 0) presets.push({ name: 'grade1_sub', label: '1학년 부담임', icon: '🌱', teacherIds: g1sub });

    const g2 = sortTeachersList(teachers.filter(t => t.homeroom && t.homeroom.startsWith('2-'))).map(t => t.id);
    if (g2.length > 0) presets.push({ name: 'grade2', label: '2학년 담임', icon: '🌿', teacherIds: g2 });

    const g2sub = sortTeachersList(teachers.filter(t => getSubHomeroomForTeacher(t.name) && getSubHomeroomForTeacher(t.name).startsWith('2-'))).map(t => t.id);
    if (g2sub.length > 0) presets.push({ name: 'grade2_sub', label: '2학년 부담임', icon: '🌿', teacherIds: g2sub });

    const g3 = sortTeachersList(teachers.filter(t => t.homeroom && t.homeroom.startsWith('3-'))).map(t => t.id);
    if (g3.length > 0) presets.push({ name: 'grade3', label: '3학년 담임', icon: '🌳', teacherIds: g3 });

    const g3sub = sortTeachersList(teachers.filter(t => getSubHomeroomForTeacher(t.name) && getSubHomeroomForTeacher(t.name).startsWith('3-'))).map(t => t.id);
    if (g3sub.length > 0) presets.push({ name: 'grade3_sub', label: '3학년 부담임', icon: '🌳', teacherIds: g3sub });
  } else {
    // All (가나다순)
    presets.push({ name: 'all_teachers', label: '전체 교사', icon: '👥', teacherIds: sortTeachersList(teachers).map(t => t.id) });
  }

  return presets;
}

function setMeetingPresetCategory(cat) {
  AppState.meetingPresetCategory = cat;
  renderApp();
}

function applyMeetingPreset(presetName, presetTitle) {
  const presets = getCategorizedPresets(AppState.meetingPresetCategory);
  const found = presets.find(p => p.name === presetName);
  if (found) {
    AppState.meetingSelectedTeachers = [...found.teacherIds];
    AppState.meetingActivePreset = presetName;
    AppState.meetingActivePresetTitle = presetTitle || found.label;
    renderApp();
  }
}

// Meeting Intersection Analysis Engine
function analyzeMeetingAvailability(teachers) {
  const total = teachers.length;
  const matrix = {};
  const slotsList = [];

  for (let day of DAYS) {
    matrix[day] = {};
    for (let p of PERIODS) {
      const pStr = p.toString();
      const freeTeachers = [];
      const busyTeachers = [];

      for (let t of teachers) {
        const cell = t.schedule[day] ? t.schedule[day][pStr] : null;
        if (!cell || cell.isFree) {
          freeTeachers.push(t);
        } else {
          busyTeachers.push({
            id: t.id,
            name: t.name,
            subject: cell.subject,
            target: cell.target,
            raw: cell.raw
          });
        }
      }

      const freeCount = freeTeachers.length;
      const matchRate = total > 0 ? Math.round((freeCount / total) * 100) : 0;
      const isAllFree = (freeCount === total && total > 0);
      const isAlmostFree = (freeCount === total - 1 && total > 1);

      let tier = 3;
      if (isAllFree) tier = 1;
      else if (isAlmostFree) tier = 2;

      const slotObj = {
        day,
        period: p,
        total,
        freeCount,
        matchRate,
        isAllFree,
        isAlmostFree,
        tier,
        freeTeachers,
        busyTeachers
      };

      matrix[day][p] = slotObj;
      slotsList.push(slotObj);
    }
  }

  // Sort slots: Tier 1 (전원 공강) first, then Tier 2 (차선책), then chronological order (월~금, 1~7교시)
  slotsList.sort((a, b) => {
    if (a.tier !== b.tier) return a.tier - b.tier;
    if (a.freeCount !== b.freeCount) return b.freeCount - a.freeCount;
    const dayDiff = DAYS.indexOf(a.day) - DAYS.indexOf(b.day);
    if (dayDiff !== 0) return dayDiff;
    return a.period - b.period;
  });

  // If there are Tier 1 (100% 전원 공강) slots, include all Tier 1 slots so none are omitted, plus top Tier 2 slots
  const tier1Slots = slotsList.filter(s => s.tier === 1);
  const tier2Slots = slotsList.filter(s => s.tier === 2);

  let recommendations = [];
  if (tier1Slots.length > 0) {
    // Show all 100% free slots (or at least top 8 if fewer)
    recommendations = tier1Slots.length < 8 ? tier1Slots.concat(tier2Slots.slice(0, 8 - tier1Slots.length)) : tier1Slots;
  } else {
    recommendations = slotsList.slice(0, 8);
  }

  return { matrix, recommendations, tier1Slots, tier2Slots };
}

function renderSlotDetailBox(slot, analysisResult, selectedTeachers) {
  const slotData = analysisResult.matrix[slot.day][slot.period];
  if (!slotData) return '';
  const timeInfo = AppState.bellSchedule.find(b => b.period === slot.period);

  return `
    <div class="slot-detail-box">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem;">
        <h3 style="font-size: 1.1rem; font-weight: 700; color: var(--text-primary);">
          📍 ${slot.day}요일 ${slot.period}교시 (${timeInfo ? `${timeInfo.start} ~ ${timeInfo.end}` : ''}) 상세 분석
        </h3>
        <span class="chip-badge" style="background: ${slotData.isAllFree ? 'var(--success-light)' : 'var(--warning-light)'}; color: ${slotData.isAllFree ? 'var(--success-text)' : 'var(--warning-text)'}; font-size: 0.85rem; font-weight: 700;">
          ${slotData.freeCount}/${selectedTeachers.length}명 참석 가능 (${slotData.matchRate}%)
        </span>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1rem;">
        <!-- Available Teachers List -->
        <div style="background: var(--bg-surface); padding: 0.85rem; border-radius: var(--radius-md); border: 1px solid var(--success-border);">
          <div style="font-weight: 700; color: var(--success-text); margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.35rem;">
            <span>🟢 참석 가능 (공강 교사 ${slotData.freeTeachers.length}명):</span>
          </div>
          <div style="display: flex; flex-wrap: wrap; gap: 0.35rem;">
            ${sortTeachersList(slotData.freeTeachers).map(t => {
              const admin = getTeacherAdminInfo(t.name);
              const subj = getTeacherSubject(t.name);
              return `
                <span class="chip-btn" style="background: var(--success-light); color: var(--success-text); border: none; cursor: default;">
                  ${t.name}
                  ${admin && admin.isHead ? `<span class="role-badge-head" style="margin-left:0.15rem;">부장</span>` : ''}
                  ${admin && admin.isPlan ? `<span class="role-badge-plan" style="margin-left:0.15rem;">기획</span>` : ''}
                  ${admin && admin.isDuty ? `<span class="role-badge-duty badge-admin-${admin.dept}" style="margin-left:0.15rem;">${admin.duty}</span>` : ''}
                  ${subj ? `<span class="chip-badge badge-subj-${subj}" style="font-size:0.68rem; margin-left:0.15rem;">${subj}</span>` : ''}
                </span>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Busy Teachers List -->
        <div style="background: var(--bg-surface); padding: 0.85rem; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
          <div style="font-weight: 700; color: var(--danger-text); margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.35rem;">
            <span>🔴 수업 중 (참석 불가 ${slotData.busyTeachers.length}명):</span>
          </div>
          ${slotData.busyTeachers.length > 0 ? `
            <div style="display: flex; flex-direction: column; gap: 0.35rem;">
              ${slotData.busyTeachers.slice().sort((a, b) => a.name.localeCompare(b.name, 'ko')).map(b => {
                const admin = getTeacherAdminInfo(b.name);
                const trackInfo = resolveTrackSubject(b.subject, b.name, b.target, slot.day, slot.period);
                const displaySubj = trackInfo.isCoded ? `${trackInfo.realSubject} (${trackInfo.groupCode})` : trackInfo.realSubject;
                return `
                  <div style="font-size: 0.85rem; display: flex; justify-content: space-between; padding: 0.35rem 0.6rem; background: var(--bg-hover); border-radius: var(--radius-sm); align-items: center;">
                    <div style="display:flex; align-items:center; gap:0.3rem;">
                      <strong style="color: var(--text-primary);">${b.name} 선생님</strong>
                      ${admin && admin.isHead ? `<span class="role-badge-head" style="font-size:0.65rem;">부장</span>` : ''}
                      ${admin && admin.isPlan ? `<span class="role-badge-plan" style="font-size:0.65rem;">기획</span>` : ''}
                      ${admin && admin.isDuty ? `<span class="role-badge-duty badge-admin-${admin.dept}" style="font-size:0.65rem;">${admin.duty}</span>` : ''}
                    </div>
                    <span style="color: var(--text-secondary); font-size:0.82rem;">${displaySubj} (${b.target})</span>
                  </div>
                `;
              }).join('')}
            </div>
          ` : `
            <p style="font-size: 0.85rem; color: var(--text-muted);">수업 중인 교사가 없습니다! 전원 참석 가능합니다.</p>
          `}
        </div>
      </div>
    </div>
  `;
}

function openSlotDetails(day, period) {
  AppState.meetingSelectedSlot = { day, period };
  renderApp();
}

function toggleMeetingTeacher(id) {
  if (AppState.meetingSelectedTeachers.includes(id)) {
    AppState.meetingSelectedTeachers = AppState.meetingSelectedTeachers.filter(t => t !== id);
  } else {
    AppState.meetingSelectedTeachers.push(id);
  }
  AppState.meetingActivePreset = '';
  AppState.meetingActivePresetTitle = '';
  renderApp();
}

function removeMeetingTeacher(id) {
  AppState.meetingSelectedTeachers = AppState.meetingSelectedTeachers.filter(t => t !== id);
  AppState.meetingActivePreset = '';
  AppState.meetingActivePresetTitle = '';
  renderApp();
}

function clearMeetingTeachers() {
  AppState.meetingSelectedTeachers = [];
  AppState.meetingActivePreset = '';
  AppState.meetingActivePresetTitle = '';
  renderApp();
}

function copyMeetingProposal() {
  if (!AppState.data) return;
  const selectedTeachers = AppState.data.teachers.filter(t => AppState.meetingSelectedTeachers.includes(t.id));
  if (selectedTeachers.length < 2) {
    showToast('교사를 2명 이상 선택해주세요.');
    return;
  }

  const analysis = analyzeMeetingAvailability(selectedTeachers);
  const teacherDetails = selectedTeachers.map(t => {
    const admin = getTeacherAdminInfo(t.name);
    return `${t.name}${admin && admin.position ? `(${admin.position})` : ''}`;
  }).join(', ');

  const titlePrefix = AppState.meetingActivePresetTitle ? `[📅 부산동고 ${AppState.meetingActivePresetTitle} 회의 일정 추천]` : `[📅 부산동고등학교 회의 일정 추천]`;

  let text = `${titlePrefix}\n`;
  text += `* 참석 대상: ${teacherDetails} (총 ${selectedTeachers.length}명)\n\n`;
  
  const tier1 = analysis.tier1Slots || analysis.recommendations.filter(r => r.tier === 1);
  const tier2 = analysis.tier2Slots || analysis.recommendations.filter(r => r.tier === 2);

  if (tier1.length > 0) {
    text += `🌟 [전원 공강 추천 시간 (1순위)]\n`;
    tier1.forEach(r => {
      const timeInfo = AppState.bellSchedule.find(b => b.period === r.period);
      text += ` - ${r.day}요일 ${r.period}교시 (${timeInfo ? `${timeInfo.start}~${timeInfo.end}` : ''}) : ${selectedTeachers.length}명 전원 공강\n`;
    });
    text += `\n`;
  }

  if (tier2.length > 0) {
    text += `🟢 [차선책 추천 시간 (1명 수업)]\n`;
    tier2.slice(0, 3).forEach(r => {
      const timeInfo = AppState.bellSchedule.find(b => b.period === r.period);
      const busyName = r.busyTeachers.map(b => b.name).join(', ');
      text += ` - ${r.day}요일 ${r.period}교시 (${timeInfo ? `${timeInfo.start}~${timeInfo.end}` : ''}) : ${busyName} 선생님 제외 전원 참석 가능\n`;
    });
  }

  text += `\n※ 2026학년도 2학기 부산동고등학교 시간표 기준 자동 산출됨`;

  navigator.clipboard.writeText(text).then(() => {
    showToast('📋 회의 추천 일정이 클립보드에 복사되었습니다!');
  }).catch(err => {
    console.error('Failed to copy: ', err);
    showToast('복사 실패 (브라우저 권한을 확인하세요)');
  });
}

function showToast(msg) {
  let toast = document.getElementById('globalToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'globalToast';
    toast.className = 'toast-msg';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

/* ==========================================================================
   4. 전체 종합 현황판 뷰 (Matrix Overview)
   ========================================================================== */

// Teacher grade caching helper
const _teacherGradeCache = {};
function isTeacherInGrade(t, gradeStr) {
  if (!_teacherGradeCache[t.name]) {
    const grades = new Set();
    if (t.homeroom && /^[123]-/.test(t.homeroom)) {
      grades.add(t.homeroom[0]);
    }
    if (t.schedule) {
      for (const day of Object.values(t.schedule)) {
        for (const s of Object.values(day)) {
          if (!s) continue;
          if (s.target && /^[123]-/.test(s.target)) grades.add(s.target[0]);
          if (s.subject && /[123]/.test(s.subject)) {
            const m = s.subject.match(/([123])/);
            if (m) grades.add(m[1]);
          }
        }
      }
    }
    if (AppState.data && AppState.data.students) {
      AppState.data.students.forEach(st => {
        const g = String(st.grade);
        if (grades.has(g)) return;
        const hasT = Object.values(st.schedule || {}).some(d =>
          Object.values(d || {}).some(slot => slot && slot.teacher === t.name)
        );
        if (hasT) grades.add(g);
      });
    }
    _teacherGradeCache[t.name] = grades;
  }
  return _teacherGradeCache[t.name].has(String(gradeStr));
}

// Compact Short Subject Name Helper for Mobile (Max 2~3 characters)
function getMatrixShortSubject(realSubject) {
  if (!realSubject) return '';
  const s = realSubject.trim();
  
  const map = {
    '독서와 작문': '독서',
    '실용 국어': '실국',
    '심화 국어': '심국',
    '현대문학 감상': '현문',
    '고전 읽기': '고전',
    '수학과제 탐구': '수탐',
    '미적분Ⅰ': '미적Ⅰ',
    '미적분': '미적',
    '확률과 통계': '확통',
    '심화 수학Ⅰ': '심수Ⅰ',
    '영어Ⅱ': '영Ⅱ',
    '영어Ⅰ': '영Ⅰ',
    '영어권 문화': '영문',
    '진로 영어': '진영',
    '심화 영어Ⅱ': '심영Ⅱ',
    '법과 사회': '법사',
    '고전과 윤리': '고윤',
    '사회문제 탐구': '사탐',
    '한국지리 탐구': '한지',
    '여행지리': '여지',
    '한국사': '한사',
    '한국사1': '한사',
    '윤리와 사상': '윤사',
    '역학과 에너지': '역학',
    '생활과 과학': '생과',
    '물질과 에너지': '물질',
    '고급 화학': '고화',
    '생명과학Ⅱ': '생Ⅱ',
    '생명과학Ⅰ': '생Ⅰ',
    '생명과학': '생명',
    '세포와 물질대사': '세포',
    '지구과학Ⅱ': '지Ⅱ',
    '지구과학Ⅰ': '지Ⅰ',
    '지구과학': '지학',
    '행성우주과학': '우주',
    '융합과학': '융과',
    '기초 체육 전공 실기': '체전',
    '체육 전공 실기 심화': '체전',
    '체전실기A': '체전',
    '기초체육전공실기': '체전',
    '운동과 건강': '운건',
    '운동과건강': '운건',
    '스포츠 생활': '스포츠',
    '스포츠생활': '스포츠',
    '음악과 미디어': '음악',
    '음악과미디어': '음악',
    '미술과 매체': '미술',
    '미술과매체': '미술',
    '창의 경영': '창경',
    '일본 문화': '일문',
    '일본문화': '일문',
    '일본문화B': '일문',
    '일본어Ⅰ': '일어',
    '일본어': '일어',
    '과탐실': '과탐',
    '자율·자치활동': '자율',
    '자율활동': '자율',
    '봉사활동': '봉사',
    '자율/공강': '자율',
    '이동수업': '이동',
    '1층감독': '감독',
    '2층감독': '감독',
    '홈베이스+동맥꿈터': '홈베',
    '홈베이스': '홈베'
  };

  if (map[s]) return map[s];

  if (/^자율/.test(s)) return '자율';
  if (/^봉사/.test(s)) return '봉사';
  if (/^창체/.test(s)) return '창체';
  if (/^융합/.test(s)) return '융합';
  if (/^세포/.test(s)) return '세포';
  if (/^홈베/.test(s)) return '홈베';
  if (/감독/.test(s)) return '감독';

  return s.length > 3 ? s.slice(0, 3) : s;
}

// Compact Short Room/Target Helper for Mobile
function getMatrixShortRoom(target, actualRoom) {
  const displayRoom = actualRoom || target || '';
  if (!displayRoom) return '';
  const roomMap = {
    '운동장': '운동장',
    '3층 미술실': '미술실',
    '5층 음악실': '음악실',
    '5층 생물실': '생물실',
    '5층 화학실': '화학실',
    '5층 지구과학실': '지학실',
    '5층 물리실': '물리실',
    '4층 컴퓨터실': '컴터실',
    '4층 무한상상실': '상상실',
    '3층 수학실': '수학실',
    '4층 수학전용실': '수학실',
    '3층 영어전용실': '영어실',
    '무상실': '상상실',
    '물리실': '물리실',
    '지구실': '지학실',
    '컴터실': '컴터실',
    '영어실': '영어실'
  };
  if (roomMap[displayRoom]) return roomMap[displayRoom];
  return displayRoom;
}

function renderMatrixView(container) {
  if (!AppState.data) return;

  const currentFilter = AppState.matrixFilter || 'all';

  const html = `
    <div class="control-card">
      <div class="control-header">
        <div class="control-title">
          <span>📊</span>
          <span>전체 종합 현황판</span>
        </div>
        <div class="control-tools">
          <div class="grade-tabs" style="margin-bottom: 0;">
            <button class="grade-tab-btn ${AppState.matrixType === 'teacher' ? 'active' : ''}" onclick="setMatrixType('teacher')">
              👨‍🏫 전체 교사 현황
            </button>
            <button class="grade-tab-btn ${AppState.matrixType === 'class' ? 'active' : ''}" onclick="setMatrixType('class')">
              🏫 전체 학반 현황
            </button>
          </div>
          
          <select id="matrixDaySelect" class="filter-select" style="min-width: 105px;" onchange="setMatrixDay(this.value)">
            ${DAYS.map(d => `<option value="${d}" ${d === AppState.selectedDay ? 'selected' : ''}>${d}요일</option>`).join('')}
          </select>

          <button class="btn btn-secondary" onclick="window.print()" title="전체 종합 현황판 인쇄">
            🖨️ 인쇄
          </button>
        </div>
      </div>

      <div class="matrix-filter-bar">
        ${AppState.matrixType === 'teacher' ? `
          <button class="matrix-filter-chip ${currentFilter === 'all' ? 'active' : ''}" onclick="setMatrixFilter('all')">전체 (${AppState.data.teachers.length})</button>
          <button class="matrix-filter-chip ${currentFilter === 'grade1' ? 'active' : ''}" onclick="setMatrixFilter('grade1')">1학년</button>
          <button class="matrix-filter-chip ${currentFilter === 'grade2' ? 'active' : ''}" onclick="setMatrixFilter('grade2')">2학년</button>
          <button class="matrix-filter-chip ${currentFilter === 'grade3' ? 'active' : ''}" onclick="setMatrixFilter('grade3')">3학년</button>
          <button class="matrix-filter-chip ${currentFilter === '국어과' ? 'active' : ''}" onclick="setMatrixFilter('국어과')">국어</button>
          <button class="matrix-filter-chip ${currentFilter === '수학과' ? 'active' : ''}" onclick="setMatrixFilter('수학과')">수학</button>
          <button class="matrix-filter-chip ${currentFilter === '외국어과' ? 'active' : ''}" onclick="setMatrixFilter('외국어과')">외국어</button>
          <button class="matrix-filter-chip ${currentFilter === '사회과' ? 'active' : ''}" onclick="setMatrixFilter('사회과')">사회</button>
          <button class="matrix-filter-chip ${currentFilter === '과학과' ? 'active' : ''}" onclick="setMatrixFilter('과학과')">과학</button>
          <button class="matrix-filter-chip ${currentFilter === '예체능과' ? 'active' : ''}" onclick="setMatrixFilter('예체능과')">예체능</button>
          <button class="matrix-filter-chip ${currentFilter === '진로과' ? 'active' : ''}" onclick="setMatrixFilter('진로과')">진로</button>
          <button class="matrix-filter-chip ${currentFilter === '정보과' ? 'active' : ''}" onclick="setMatrixFilter('정보과')">정보</button>
        ` : `
          <button class="matrix-filter-chip ${currentFilter === 'all' ? 'active' : ''}" onclick="setMatrixFilter('all')">전체 학반 (${AppState.data.classes.length})</button>
          <button class="matrix-filter-chip ${currentFilter === '1' ? 'active' : ''}" onclick="setMatrixFilter('1')">1학년 (1-1~1-6)</button>
          <button class="matrix-filter-chip ${currentFilter === '2' ? 'active' : ''}" onclick="setMatrixFilter('2')">2학년 (2-1~2-7)</button>
          <button class="matrix-filter-chip ${currentFilter === '3' ? 'active' : ''}" onclick="setMatrixFilter('3')">3학년 (3-1~3-7)</button>
        `}
      </div>

      <div class="matrix-container">
        <table class="matrix-table">
          <thead>
            <tr>
              <th class="entity-col">
                <span class="matrix-header-desktop">${AppState.matrixType === 'teacher' ? '교사' : '학반'}</span>
                <span class="matrix-header-mobile">${AppState.matrixType === 'teacher' ? '교사' : '학반'}</span>
              </th>
              ${PERIODS.map(p => `<th>${p}교시</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${AppState.matrixType === 'teacher' ? renderTeacherMatrixRows() : renderClassMatrixRows()}
          </tbody>
        </table>
      </div>
    </div>
  `;

  container.innerHTML = html;
}

function renderTeacherMatrixRows() {
  const day = AppState.selectedDay;
  let teachers = sortTeachersList(AppState.data.teachers);

  const filter = AppState.matrixFilter || 'all';
  if (filter === 'grade1') {
    teachers = teachers.filter(t => isTeacherInGrade(t, '1'));
  } else if (filter === 'grade2') {
    teachers = teachers.filter(t => isTeacherInGrade(t, '2'));
  } else if (filter === 'grade3') {
    teachers = teachers.filter(t => isTeacherInGrade(t, '3'));
  } else if (OFFICIAL_DEPARTMENTS[filter]) {
    const deptNames = OFFICIAL_DEPARTMENTS[filter];
    teachers = teachers.filter(t => deptNames.includes(t.name));
  }

  if (teachers.length === 0) {
    return `
      <tr>
        <td colspan="8" style="text-align: center; padding: 2rem; color: var(--text-muted);">
          선택된 조건에 해당하는 교사가 없습니다.
        </td>
      </tr>
    `;
  }

  return teachers.map(t => {
    const dept = getTeacherDepartment(t.name);
    const subj = getTeacherSubject(t.name);
    const admin = getTeacherAdminInfo(t.name);
    const dayHours = t.hoursByDay[day] || 0;
    return `
      <tr>
        <td class="entity-col">
          <div class="matrix-entity-desktop" title="${t.name}${admin ? ` [${admin.dept} ${admin.duty}]` : ''}${subj ? ` [${subj}]` : ''}${t.homeroom ? ` [${t.homeroom} 담임]` : ''}">
            <span style="font-weight: 700; cursor: pointer; color: var(--primary);" onclick="navigateToTeacher('${t.name}')">${t.name}</span>
            ${t.homeroom ? `<span style="font-size: 0.75rem; color: var(--text-muted); font-weight: normal; margin-left: 0.2rem;">(${t.homeroom})</span>` : ''}
          </div>
          <div class="matrix-entity-mobile">
            <span class="matrix-name-mobile" onclick="navigateToTeacher('${t.name}')">${t.name}</span>
            <span class="matrix-meta-mobile">${t.homeroom ? t.homeroom : (dayHours > 0 ? `${dayHours}h` : '공강')}</span>
          </div>
        </td>
        ${PERIODS.map(p => {
          const cell = t.schedule[day] ? t.schedule[day][p.toString()] : null;
          if (!cell || cell.isFree) {
            return `<td class="matrix-cell-free" style="color: var(--text-muted); background: var(--bg-surface);">-</td>`;
          }
          const actualRoom = !cell.isFree ? getTeacherActualRoom(t.name, day, p, cell) : null;
          const hasDiffRoom = actualRoom && isDifferentFromTimetable(cell.target, actualRoom);
          const trackInfo = resolveTrackSubject(cell.subject, t.name, cell.target, day, p);
          const cat = getSubjectCategory(trackInfo.realSubject);
          const displaySubj = trackInfo.isCoded ? `${trackInfo.realSubject} (${trackInfo.groupCode})` : trackInfo.realSubject;
          const shortSubj = getMatrixShortSubject(trackInfo.realSubject);
          const shortRoom = getMatrixShortRoom(cell.target, actualRoom);
          return `
            <td class="matrix-period-cell">
              <span class="subject-pill ${cat} matrix-cell-pill" onclick="navigateToClass('${cell.target}')" title="${displaySubj}${cell.target ? ` (${cell.target})` : ''}${hasDiffRoom ? ` [실제 장소: ${actualRoom}]` : ''}">
                <span class="matrix-desktop-text">
                  ${trackInfo.realSubject}${cell.target ? ` (${cell.target})` : ''}
                </span>
                <span class="matrix-mobile-compact">
                  <span class="matrix-short-subj">${shortSubj}</span>
                  <span class="matrix-short-room">${shortRoom}</span>
                </span>
              </span>
            </td>
          `;
        }).join('')}
      </tr>
    `;
  }).join('');
}

function renderClassMatrixRows() {
  const day = AppState.selectedDay;
  let classes = AppState.data.classes;

  const filter = AppState.matrixFilter || 'all';
  if (filter === '1') {
    classes = classes.filter(c => c.name.startsWith('1-'));
  } else if (filter === '2') {
    classes = classes.filter(c => c.name.startsWith('2-'));
  } else if (filter === '3') {
    classes = classes.filter(c => c.name.startsWith('3-'));
  }

  if (classes.length === 0) {
    return `
      <tr>
        <td colspan="8" style="text-align: center; padding: 2rem; color: var(--text-muted);">
          선택된 조건에 해당하는 학반이 없습니다.
        </td>
      </tr>
    `;
  }

  return classes.map(c => {
    return `
      <tr>
        <td class="entity-col">
          <div class="matrix-entity-desktop">
            <span style="font-weight: 700; cursor: pointer; color: var(--primary);" onclick="navigateToClass('${c.name}')">${c.name}</span>
            <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: normal; margin-left: 0.2rem;">(${c.homeroom || ''})</span>
          </div>
          <div class="matrix-entity-mobile">
            <span class="matrix-name-mobile" onclick="navigateToClass('${c.name}')">${c.name}</span>
            <span class="matrix-meta-mobile">${c.homeroom || ''}</span>
          </div>
        </td>
        ${PERIODS.map(p => {
          const cell = c.schedule[day] ? c.schedule[day][p.toString()] : null;
          if (!cell || cell.isFree) {
            return `<td class="matrix-cell-free" style="color: var(--text-muted); background: var(--bg-surface);">-</td>`;
          }
          const trackInfo = resolveTrackSubject(cell.subject, cell.target, c.name, day, p);
          const cat = getSubjectCategory(trackInfo.realSubject);
          const displaySubj = trackInfo.isCoded ? `${trackInfo.realSubject} (${trackInfo.groupCode})` : trackInfo.realSubject;
          const shortSubj = getMatrixShortSubject(trackInfo.realSubject);
          const shortRoom = getMatrixShortRoom(cell.target, null);
          return `
            <td class="matrix-period-cell">
              <span class="subject-pill ${cat} matrix-cell-pill" onclick="navigateToTeacher('${cell.target}')" title="${displaySubj}${cell.target ? ` (${cell.target})` : ''}">
                <span class="matrix-desktop-text">
                  ${trackInfo.realSubject}${cell.target ? ` (${cell.target})` : ''}
                </span>
                <span class="matrix-mobile-compact">
                  <span class="matrix-short-subj">${shortSubj}</span>
                  <span class="matrix-short-room">${shortRoom}</span>
                </span>
              </span>
            </td>
          `;
        }).join('')}
      </tr>
    `;
  }).join('');
}

function setMatrixType(type) {
  AppState.matrixType = type;
  AppState.matrixFilter = 'all';
  renderApp();
}

function setMatrixFilter(filter) {
  AppState.matrixFilter = filter;
  renderApp();
}

function setMatrixDay(day) {
  AppState.selectedDay = day;
  renderApp();
}

/* ==========================================================================
   5. 공강 교사 검색 / 보강 도우미 (Free Teacher Finder - With Department Filters)
   ========================================================================== */
function renderFreeTeacherView(container) {
  if (!AppState.data) return;

  const day = AppState.selectedDay;
  const period = AppState.selectedPeriod;

  let freeTeachers = AppState.data.teachers.filter(t => {
    const cell = t.schedule[day] ? t.schedule[day][period] : null;
    return !cell || cell.isFree;
  });

  // Filter by subject department
  if (AppState.freeTeacherDeptFilter !== 'all') {
    const deptNames = OFFICIAL_DEPARTMENTS[AppState.freeTeacherDeptFilter] || [];
    freeTeachers = freeTeachers.filter(t => deptNames.includes(t.name));
  }

  // Filter by administrative department
  if (AppState.freeTeacherAdminFilter !== 'all') {
    const adminMembers = OFFICIAL_ADMIN_DEPTS[AppState.freeTeacherAdminFilter] || [];
    freeTeachers = freeTeachers.filter(t => adminMembers.includes(t.name));
  }

  if (AppState.freeTeacherAdminFilter !== 'all') {
    const adminMembers = OFFICIAL_ADMIN_DEPTS[AppState.freeTeacherAdminFilter] || [];
    const headName = adminMembers[0];
    const planName = adminMembers[1];
    freeTeachers.sort((a, b) => {
      if (a.name === headName) return -1;
      if (b.name === headName) return 1;
      if (a.name === planName) return -1;
      if (b.name === planName) return 1;
      const hDiff = (a.hoursByDay[day] || 0) - (b.hoursByDay[day] || 0);
      if (hDiff !== 0) return hDiff;
      return a.name.localeCompare(b.name, 'ko');
    });
  } else {
    freeTeachers.sort((a, b) => {
      const hDiff = (a.hoursByDay[day] || 0) - (b.hoursByDay[day] || 0);
      if (hDiff !== 0) return hDiff;
      return a.name.localeCompare(b.name, 'ko');
    });
  }

  const html = `
    <div class="control-card">
      <div class="control-header">
        <div class="control-title">
          <span>🔍</span>
          <span>공강 교사 검색 / 보강 배정 도우미</span>
        </div>
        <div class="control-tools">
          <div class="filter-controls-wrap">
            <div class="filter-field">
              <label class="filter-label">교과:</label>
              <select class="filter-select" style="min-width: 125px;" onchange="setFreeDeptFilter(this.value)">
                <option value="all" ${AppState.freeTeacherDeptFilter === 'all' ? 'selected' : ''}>전체 교과</option>
                ${Object.keys(OFFICIAL_DEPARTMENTS).map(dept => `
                  <option value="${dept}" ${AppState.freeTeacherDeptFilter === dept ? 'selected' : ''}>${dept}</option>
                `).join('')}
              </select>
            </div>

            <div class="filter-field">
              <label class="filter-label">업무부서:</label>
              <select class="filter-select" style="min-width: 145px;" onchange="setFreeAdminFilter(this.value)">
                <option value="all" ${AppState.freeTeacherAdminFilter === 'all' ? 'selected' : ''}>전체 부서</option>
                ${Object.keys(OFFICIAL_ADMIN_DEPTS).map(dept => `
                  <option value="${dept}" ${AppState.freeTeacherAdminFilter === dept ? 'selected' : ''}>${dept}</option>
                `).join('')}
              </select>
            </div>

            <div class="filter-field">
              <label class="filter-label">요일:</label>
              <select class="filter-select" style="min-width: 95px;" onchange="setFreeSearchDay(this.value)">
                ${DAYS.map(d => `<option value="${d}" ${d === day ? 'selected' : ''}>${d}요일</option>`).join('')}
              </select>
            </div>
            
            <div class="filter-field">
              <label class="filter-label">교시:</label>
              <select class="filter-select" style="min-width: 92px;" onchange="setFreeSearchPeriod(this.value)">
                ${PERIODS.map(p => `<option value="${p}" ${p.toString() === period ? 'selected' : ''}>${p}교시</option>`).join('')}
              </select>
            </div>

            <button class="btn btn-secondary" onclick="window.print()" title="공강/보강 명단 인쇄">
              🖨️ 인쇄
            </button>
          </div>
        </div>
      </div>

      <div style="margin-top: 1rem; padding: 0.75rem 1rem; background: var(--bg-hover); border-radius: var(--radius-md); font-size: 0.9rem;">
        📌 <strong>${day}요일 ${period}교시</strong>에 수업이 없는 공강 교사는 총 <strong>${freeTeachers.length}명</strong>입니다. (당일 수업 시수가 적은 순으로 정렬)
      </div>

      <div class="finder-grid">
        ${freeTeachers.map(t => {
          const dayHours = t.hoursByDay[day] || 0;
          const dept = getTeacherDepartment(t.name);
          const subj = getTeacherSubject(t.name);
          const admin = getTeacherAdminInfo(t.name);
          let loadClass = 'load-light';
          let loadText = '여유';
          if (dayHours >= 4) { loadClass = 'load-heavy'; loadText = '과중'; }
          else if (dayHours >= 2) { loadClass = 'load-medium'; loadText = '보통'; }

          return `
            <div class="finder-card" onclick="navigateToTeacher('${t.name}')" title="${t.name} 선생님 전체 시간표 보기">
              <div>
                <div class="finder-name" style="display:flex; align-items:center; gap:0.35rem; flex-wrap:wrap;">
                  <span>${t.name} 선생님</span>
                  ${admin && admin.isHead ? `<span class="role-badge-head">부장</span>` : ''}
                  ${admin && admin.isPlan ? `<span class="role-badge-plan">기획</span>` : ''}
                  ${admin && admin.isDuty ? `<span class="role-badge-duty badge-admin-${admin.dept}">${admin.duty}</span>` : ''}
                </div>
                <div class="finder-meta" style="margin-top:0.3rem; display:flex; align-items:center; gap:0.35rem; flex-wrap:wrap;">
                  ${admin ? `<span class="chip-badge badge-admin-${admin.dept}">${admin.dept ? `${admin.dept} ` : ''}${admin.position}</span>` : ''}
                  ${subj ? `<span class="chip-badge badge-subj-${subj}">${subj}</span>` : (dept ? `<span class="chip-badge badge-subj-${dept}">${dept}</span>` : '')}
                  ${t.homeroom ? `<span class="chip-badge badge-grade-${getGradeFromHomeroom(t.homeroom)}">${t.homeroom} 담임</span>` : ''}
                  <span style="font-size:0.75rem; color:var(--text-muted);">주당 ${t.totalHours}시수</span>
                </div>
              </div>
              <div>
                <span class="finder-hours-tag ${loadClass}">
                  오늘 ${dayHours}시간 (${loadText})
                </span>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;

  container.innerHTML = html;
}

function setFreeDeptFilter(dept) {
  AppState.freeTeacherDeptFilter = dept;
  renderApp();
}

function setFreeAdminFilter(admin) {
  AppState.freeTeacherAdminFilter = admin;
  renderApp();
}

function setFreeSearchDay(d) {
  AppState.selectedDay = d;
  renderApp();
}

function setFreeSearchPeriod(p) {
  AppState.selectedPeriod = p;
  renderApp();
}

/* ==========================================================================
   6. 실시간 일과 시간표 (Live Schedule View)
   ========================================================================== */
function renderLiveView(container) {
  if (!AppState.data) return;

  const now = new Date();
  const todayIdx = now.getDay();
  const isWeekend = todayIdx === 0 || todayIdx === 6;
  const todayDayName = isWeekend ? '월' : DAYS[todayIdx - 1];

  const currentPeriodInfo = getCurrentPeriodInfo(now);
  const liveStatus = getLiveStatusInfo(now, currentPeriodInfo);

  const html = `
    <!-- Live Clock Banner -->
    <div class="live-clock-card">
      <div>
        <div style="font-size: 0.9rem; opacity: 0.85; margin-bottom: 0.25rem;">
          📅 ${now.getFullYear()}년 ${now.getMonth() + 1}월 ${now.getDate()}일 (${todayDayName}요일)
        </div>
        <div class="live-time-display" id="liveClockDisplay">
          ${formatTime(now)}
        </div>
      </div>
      <div style="text-align: right;">
        <div class="live-period-badge" id="livePeriodBadge">
          ${liveStatus.badgeText}
        </div>
        <div id="livePeriodSubText" style="font-size: 0.82rem; opacity: 0.9; margin-top: 0.35rem;">
          ${liveStatus.subText}
        </div>
      </div>
    </div>

    <!-- Official Bell Schedule Timetable Card -->
    <div class="control-card" style="margin-bottom: 1rem;">
      <div class="control-header">
        <div class="control-title">
          <span>⏰</span>
          <span>부산동고등학교 일과 시간표</span>
        </div>
      </div>
      <div id="liveBellScheduleGrid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 0.5rem; margin-top: 0.5rem;">
        ${AppState.bellSchedule.map(b => {
          const isCurrent = currentPeriodInfo && currentPeriodInfo.label === b.label;
          const isLunch = b.period === 0;
          return `
            <div class="bell-schedule-item" data-period="${b.period}" style="padding: 0.6rem 0.75rem; border-radius: var(--radius-md); border: ${isCurrent ? '2px solid var(--primary)' : '1px solid var(--border-color)'}; background: ${isCurrent ? 'var(--primary-light)' : (isLunch ? 'var(--bg-hover)' : 'var(--bg-surface)')}; text-align: center; transition: all 0.2s ease;">
              <div style="font-size: 0.82rem; font-weight: 700; color: ${isCurrent ? 'var(--primary)' : (isLunch ? 'var(--warning-text)' : 'var(--text-primary)')}; margin-bottom: 0.2rem;">
                ${isLunch ? '🍱 ' : ''}${b.label}
              </div>
              <div style="font-size: 0.78rem; color: var(--text-secondary); font-family: monospace;">
                ${b.start} ~ ${b.end}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>

    <!-- Live Classes Overview -->
    <div class="control-card">
      <div class="control-header">
        <div class="control-title">
          <span>🔔</span>
          <span id="liveClassesTitle">지금 진행 중인 학반별 수업 (${currentPeriodInfo ? currentPeriodInfo.label : (isWeekend ? '월요일 1교시 기준 미리보기' : '1교시 기준')})</span>
        </div>
        <div class="control-tools">
          <button class="btn btn-secondary" onclick="window.print()" title="실시간 일과 현황 인쇄">
            🖨️ 인쇄
          </button>
        </div>
      </div>

      <div id="liveClassesContainer">
        ${renderLiveClassesCards(todayDayName, currentPeriodInfo)}
      </div>
    </div>
  `;

  container.innerHTML = html;
  AppState._lastLivePeriodKey = `${todayDayName}_${currentPeriodInfo ? currentPeriodInfo.label : 'none'}`;
}

function renderLiveClassesCards(todayDayName, currentPeriodInfo) {
  if (!AppState.data || !AppState.data.classes) return '';
  const period = currentPeriodInfo && currentPeriodInfo.period > 0 ? currentPeriodInfo.period.toString() : '1';

  const grades = [
    { grade: '1', title: '1학년', icon: '🌱', badgeClass: 'live-grade-badge-1' },
    { grade: '2', title: '2학년', icon: '🌿', badgeClass: 'live-grade-badge-2' },
    { grade: '3', title: '3학년', icon: '🌳', badgeClass: 'live-grade-badge-3' }
  ];

  return grades.map(gInfo => {
    const gradeClasses = AppState.data.classes.filter(c => c.grade === gInfo.grade || c.name.startsWith(`${gInfo.grade}-`));
    if (gradeClasses.length === 0) return '';

    return `
      <div class="live-grade-section">
        <div class="live-grade-header">
          <span class="live-grade-badge ${gInfo.badgeClass}">
            <span>${gInfo.icon}</span>
            <span>${gInfo.title} (${gradeClasses.length}개 반)</span>
          </span>
          <span class="live-grade-count">${gInfo.grade}-1반 ~ ${gInfo.grade}-${gradeClasses.length}반</span>
        </div>
        <div class="finder-grid">
          ${gradeClasses.map(c => {
            const pNum = parseInt(period, 10);
            let isChangche = false;
            let changcheData = null;
            if (todayDayName === '금' && pNum >= 5) {
              const [gNum, cNum] = c.name.split('-').map(Number);
              changcheData = resolveChangcheSlot(gNum, cNum, pNum, AppState.selectedFridayWeekDate);
              if (changcheData) isChangche = true;
            }

            const cell = c.schedule[todayDayName] ? c.schedule[todayDayName][period] : null;
            const isFree = isChangche ? false : (!cell || cell.isFree);
            const trackInfo = (!isFree && !isChangche) ? resolveTrackSubject(cell.subject, cell.target, c.name, todayDayName, pNum) : null;
            const cat = isChangche ? changcheData.category : (!isFree ? getSubjectCategory(trackInfo.realSubject) : '');
            const displaySubj = isChangche ? changcheData.subject : (trackInfo ? (trackInfo.isCoded ? `${trackInfo.realSubject} (${trackInfo.groupCode})` : trackInfo.realSubject) : '');

            return `
              <div class="finder-card" onclick="navigateToClass('${c.name}')">
                <div>
                  <div class="finder-name">${c.name}</div>
                  <div class="finder-meta">담임: ${c.homeroom || '-'}</div>
                </div>
                <div>
                  ${isFree ? `
                    <span class="free-period">수업 없음</span>
                  ` : `
                    <span class="subject-pill ${cat}">
                      ${displaySubj} ${cell.target ? `(${cell.target})` : ''}
                    </span>
                  `}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }).join('');
}

function getLiveStatusInfo(now, currentPeriodInfo) {
  const todayIdx = now.getDay();
  const isWeekend = todayIdx === 0 || todayIdx === 6;
  if (isWeekend) {
    return {
      badgeText: '주말 (월요일 기준 표시)',
      subText: '주말에는 월요일 1교시 시간표가 표시됩니다.'
    };
  }

  const curHM = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  const curTotalSec = (now.getHours() * 3600) + (now.getMinutes() * 60) + now.getSeconds();

  if (currentPeriodInfo) {
    const [endH, endM] = currentPeriodInfo.end.split(':').map(Number);
    const endTotalSec = (endH * 3600) + (endM * 60);
    const diffSec = Math.max(0, endTotalSec - curTotalSec);
    const remM = Math.floor(diffSec / 60);
    const remS = diffSec % 60;
    const timeStr = `${currentPeriodInfo.start} ~ ${currentPeriodInfo.end}`;
    const isLunch = currentPeriodInfo.period === 0;

    return {
      badgeText: isLunch ? '🍱 점심시간 진행 중' : `🔔 ${currentPeriodInfo.label} 진행 중`,
      subText: `${timeStr} · ⏱️ 종료까지 ${remM}분 ${String(remS).padStart(2, '0')}초`
    };
  }

  // Between periods or before/after school
  const nextPeriod = AppState.bellSchedule.find(b => b.start > curHM);
  if (nextPeriod) {
    const [startH, startM] = nextPeriod.start.split(':').map(Number);
    const startTotalSec = (startH * 3600) + (startM * 60);
    const diffSec = Math.max(0, startTotalSec - curTotalSec);
    const remM = Math.floor(diffSec / 60);
    const remS = diffSec % 60;

    if (curHM < AppState.bellSchedule[0].start) {
      return {
        badgeText: '🌅 등교 시간 (일과 시작 전)',
        subText: `다음: ${nextPeriod.label} (${nextPeriod.start} 시작, ⏱️ ${remM}분 ${String(remS).padStart(2, '0')}초 전)`
      };
    } else {
      return {
        badgeText: '☕ 쉬는 시간',
        subText: `다음: ${nextPeriod.label} (${nextPeriod.start} 시작, ⏱️ ${remM}분 ${String(remS).padStart(2, '0')}초 전)`
      };
    }
  }

  return {
    badgeText: '🌙 일과 시간 외',
    subText: '오늘 학교 일과가 모두 종료되었습니다.'
  };
}

function getCurrentPeriodInfo(date = new Date()) {
  const curTime = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  
  for (let b of AppState.bellSchedule) {
    if (curTime >= b.start && (b.period === 7 ? curTime <= b.end : curTime < b.end)) {
      return b;
    }
  }
  return null;
}

/* ==========================================================================
   Easter Egg: "by 동글동글" -> 정동걸 교사 시간표 바로가기
   ========================================================================== */
function triggerDongleEasterEgg(event) {
  if (event) {
    event.stopPropagation();
    event.preventDefault();
  }

  // Switch to teacher tab
  switchTab('teacher');

  // Select teacher 정동걸 (T_정동걸)
  AppState.selectedTeacherId = 'T_정동걸';
  AppState.teacherViewMode = AppState.teacherViewMode || 'table';

  renderApp();
  showToast('👨‍🏫 정동걸 교사 시간표로 이동했습니다.');
}

function formatTime(date) {
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
}

function updateLiveClock() {
  const now = new Date();
  // 0. Header Live Date & Clock Display
  const headerDateElem = document.getElementById('headerClockDateText');
  if (headerDateElem) {
    const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
    headerDateElem.textContent = `${now.getFullYear()}. ${now.getMonth() + 1}. ${now.getDate()}. (${dayNames[now.getDay()]})`;
  }
  const headerTimeElem = document.getElementById('headerClockTimeText');
  if (headerTimeElem) {
    headerTimeElem.textContent = formatTime(now);
  }

  
  // 1. Digital Clock
  const clock = document.getElementById('liveClockDisplay');
  if (clock) {
    clock.textContent = formatTime(now);
  }

  // 1-1. Auto-refresh meal menu if target meal date rolled over (e.g. crossing 19:00 or midnight)
  if (AppState.lastMealTargetYmd && typeof getTodayMealTargetDate === 'function') {
    const curTarget = getTodayMealTargetDate(now);
    if (AppState.lastMealTargetYmd !== curTarget.ymd) {
      if (typeof loadTodayMealInfo === 'function') {
        loadTodayMealInfo();
      }
    }
  }

  // 2. Real-time Live Tab Update
  if (AppState.currentTab === 'live' && AppState.data) {
    const todayIdx = now.getDay();
    const isWeekend = todayIdx === 0 || todayIdx === 6;
    const todayDayName = isWeekend ? '월' : DAYS[todayIdx - 1];
    const currentPeriodInfo = getCurrentPeriodInfo(now);
    const currentPeriodKey = `${todayDayName}_${currentPeriodInfo ? currentPeriodInfo.label : 'none'}`;

    // Period / Status changed: re-render the live view completely!
    if (currentPeriodKey !== AppState._lastLivePeriodKey) {
      const container = document.getElementById('mainContentArea');
      if (container) {
        renderLiveView(container);
        return;
      }
    }

    // Within same period: smoothly update countdown and badge
    const liveStatus = getLiveStatusInfo(now, currentPeriodInfo);
    const badgeElem = document.getElementById('livePeriodBadge');
    const subTextElem = document.getElementById('livePeriodSubText');
    if (badgeElem && badgeElem.textContent.trim() !== liveStatus.badgeText.trim()) {
      badgeElem.textContent = liveStatus.badgeText;
    }
    if (subTextElem) {
      subTextElem.textContent = liveStatus.subText;
    }
  }

  // 3. Timetable Real-time Clock & Period Transition (시간표 교사별/학반별/학생별 화면 실시간 시계 및 하이라이트 갱신)
  if ((AppState.currentTab === 'teacher' || AppState.currentTab === 'class' || AppState.currentTab === 'student') && AppState.data) {
    // 3-1. 매 초마다 시간표 상단 디지털 시계 실시간 갱신
    const timetableClockElem = document.getElementById('timetableLiveClock');
    if (timetableClockElem) {
      timetableClockElem.textContent = formatTime(now);
    }
    const teacherClockElem = document.getElementById('teacherLiveClock');
    if (teacherClockElem) {
      teacherClockElem.textContent = formatTime(now);
    }
    const studentClockElem = document.getElementById('studentLiveClock');
    if (studentClockElem) {
      studentClockElem.textContent = formatTime(now);
    }

    const state = getActivePeriodState(now);

    // 3-2. 일과 상태 뱃지 텍스트 갱신
    const timetablePillElem = document.getElementById('timetableLiveStatusPill');
    if (timetablePillElem) {
      if (AppState.currentTab === 'teacher') {
        const curT = AppState.data.teachers.find(t => t.id === AppState.selectedTeacherId);
        const tLive = getTeacherLiveStatus(curT, now);
        if (tLive && timetablePillElem.textContent.trim() !== tLive.displayText.trim()) {
          timetablePillElem.textContent = tLive.displayText;
          timetablePillElem.className = `live-status-pill ${tLive.badgeClass}`;
        }
      } else if (timetablePillElem.textContent.trim() !== state.statusText.trim()) {
        timetablePillElem.textContent = state.statusText;
        timetablePillElem.className = `live-status-pill ${state.statusBadgeClass}`;
      }
    }

    // 3-3. 교시 / 점심시간 / 쉬는시간 상태 전환 시 테이블 하이라이트 자동 재렌더링
    const timetableKey = `${state.todayDayName}_${state.activePeriod}_${state.isLunchTime}_${state.isBreakTime ? state.nextPeriod : 'none'}`;
    if (AppState._lastTimetableSlotKey && AppState._lastTimetableSlotKey !== timetableKey) {
      AppState._lastTimetableSlotKey = timetableKey;
      renderApp();
    } else if (!AppState._lastTimetableSlotKey) {
      AppState._lastTimetableSlotKey = timetableKey;
    }
  }
}

/* ==========================================================================
   7. 파일 업로드 & 브라우저 실시간 HML 파서 (File Upload View - Password Protected)
   ========================================================================== */
function renderUploadView(container) {
  const isAuth = sessionStorage.getItem('timetable_upload_auth') === 'true';

  if (!isAuth) {
    container.innerHTML = `
      <div class="control-card" style="max-width: 520px; margin: 2rem auto; text-align: center; padding: 2.2rem 1.8rem; box-shadow: var(--shadow-lg);">
        <div style="font-size: 3.2rem; margin-bottom: 1rem; filter: drop-shadow(0 4px 8px rgba(0,0,0,0.1));">🔒</div>
        <h2 style="font-size: 1.35rem; font-weight: 800; color: var(--text-primary); margin-bottom: 0.5rem;">
          관리자 인증 필요
        </h2>
        <p style="font-size: 0.9rem; color: var(--text-secondary); line-height: 1.5; margin-bottom: 1.5rem;">
          시간표 데이터 업로드 및 교체는 관리자 전용 기능입니다.<br>
          접근을 위해 관리자 비밀번호를 입력해주세요.
        </p>

        <div style="display: flex; gap: 0.5rem; justify-content: center; align-items: center; max-width: 360px; margin: 0 auto;">
          <input type="password" id="uploadPasswordInput" class="search-input" placeholder="비밀번호 입력..." 
            style="padding-left: 1rem; width: 200px; text-align: center; letter-spacing: 0.1em;" onkeyup="if(event.key==='Enter') checkUploadPassword()" autofocus>
          <button class="btn btn-primary" onclick="checkUploadPassword()" style="padding: 0.55rem 1.1rem; font-weight: 700;">
            🔓 인증 해제
          </button>
        </div>
        <div id="uploadPasswordError" style="margin-top: 0.85rem; font-size: 0.85rem; color: var(--danger); font-weight: 700; min-height: 1.2rem;"></div>
      </div>
    `;
    return;
  }

  const html = `
    <div class="control-card">
      <div class="control-header">
        <div class="control-title">
          <span>🔄</span>
          <span>새로운 시간표 파일 (HML / HWP) 업로드 및 교체</span>
        </div>
        <div class="control-tools">
          <span class="chip-badge" style="background: var(--success-light); color: var(--success-text); font-weight: 700; padding: 0.25rem 0.65rem;">
            🔒 관리자 인증됨
          </span>
          <button class="btn btn-secondary" onclick="lockUploadView()" title="관리자 잠금">
            🔒 잠그기
          </button>
        </div>
      </div>

      <div class="dropzone" id="fileDropzone" onclick="document.getElementById('hmlFileInput').click()">
        <div class="dropzone-icon">📁</div>
        <div class="dropzone-title">HML 시간표 파일을 여기에 드래그하거나 클릭하여 선택하세요</div>
        <div class="dropzone-desc">교사별시간표.HML 및 학반별시간표.HML 파일을 지원합니다. 브라우저에서 즉시 파싱됩니다.</div>
        <input type="file" id="hmlFileInput" multiple accept=".hml,.xml,.hwp" style="display: none;" onchange="handleFileSelect(event)">
      </div>

      <div id="uploadStatusMsg" style="margin-top: 1rem;"></div>
    </div>
  `;

  container.innerHTML = html;
}

function checkUploadPassword() {
  const input = document.getElementById('uploadPasswordInput');
  const errorDiv = document.getElementById('uploadPasswordError');
  if (!input) return;

  if (input.value.trim() === 'ehdrhdigh') {
    sessionStorage.setItem('timetable_upload_auth', 'true');
    showToast('🔓 관리자 인증이 완료되었습니다.');
    renderApp();
  } else {
    if (errorDiv) {
      errorDiv.textContent = '❌ 비밀번호가 올바르지 않습니다. 다시 입력해주세요.';
    }
    input.value = '';
    input.focus();
  }
}

function lockUploadView() {
  sessionStorage.removeItem('timetable_upload_auth');
  showToast('🔒 관리자 모드가 잠겼습니다.');
  renderApp();
}

function renderUploadOnlyView() {
  const container = document.getElementById('mainContentArea');
  if (container) renderUploadView(container);
}

function setupDragAndDrop() {
  window.addEventListener('dragover', (e) => {
    e.preventDefault();
    const dropzone = document.getElementById('fileDropzone');
    if (dropzone) dropzone.classList.add('dragover');
  });

  window.addEventListener('dragleave', (e) => {
    e.preventDefault();
    const dropzone = document.getElementById('fileDropzone');
    if (dropzone) dropzone.classList.remove('dragover');
  });

  window.addEventListener('drop', (e) => {
    e.preventDefault();
    const dropzone = document.getElementById('fileDropzone');
    if (dropzone) dropzone.classList.remove('dragover');

    if (e.dataTransfer && e.dataTransfer.files.length > 0) {
      processUploadedFiles(e.dataTransfer.files);
    }
  });
}

function handleFileSelect(event) {
  if (event.target.files && event.target.files.length > 0) {
    processUploadedFiles(event.target.files);
  }
}

function processUploadedFiles(fileList) {
  const statusDiv = document.getElementById('uploadStatusMsg');
  if (statusDiv) {
    statusDiv.innerHTML = `<p style="color: var(--primary);">파일을 분석하고 파싱 중입니다...</p>`;
  }

  let teacherTables = [];
  let classTables = [];
  let filesRead = 0;

  for (let file of fileList) {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target.result;
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/xml');
        
        const tables = Array.from(doc.getElementsByTagName('TABLE'));
        if (tables.length > 0) {
          const firstRow = tables[0].querySelector('ROW');
          const firstRowText = firstRow ? firstRow.textContent : '';

          if (firstRowText.includes('학반') || file.name.includes('학반')) {
            classTables = classTables.concat(tables);
          } else {
            teacherTables = teacherTables.concat(tables);
          }
        }
      } catch (err) {
        console.error('Error parsing file:', err);
      }

      filesRead++;
      if (filesRead === fileList.length) {
        finishBrowserParsing(teacherTables, classTables, statusDiv);
      }
    };
    reader.readAsText(file, 'utf-8');
  }
}

function finishBrowserParsing(teacherTables, classTables, statusDiv) {
  try {
    const teachers = parseHmlTeacherTablesInBrowser(teacherTables);
    const classes = parseHmlClassTablesInBrowser(classTables);

    if (teachers.length > 0 || classes.length > 0) {
      if (!AppState.data) {
        AppState.data = {
          schoolYear: '2026학년도',
          semester: '2학기',
          generatedAt: new Date().toLocaleString(),
          teacherCount: teachers.length,
          classCount: classes.length,
          days: DAYS,
          periods: PERIODS,
          teachers: teachers,
          classes: classes
        };
      } else {
        if (teachers.length > 0) AppState.data.teachers = teachers;
        if (classes.length > 0) AppState.data.classes = classes;
      }

      initDefaultSelections();
      if (statusDiv) {
        statusDiv.innerHTML = `<p style="color: var(--success); font-weight: 700;">성공적으로 파싱되었습니다! (교사: ${teachers.length}명, 학반: ${classes.length}개 반)</p>`;
      }
      setTimeout(() => switchTab('teacher'), 1200);
    } else {
      if (statusDiv) {
        statusDiv.innerHTML = `<p style="color: var(--danger);">유효한 시간표 테이블을 찾을 수 없습니다. 올바른 HML 파일인지 확인하세요.</p>`;
      }
    }
  } catch (err) {
    if (statusDiv) {
      statusDiv.innerHTML = `<p style="color: var(--danger);">파싱 중 오류 발생: ${err.message}</p>`;
    }
  }
}

function parseHmlTeacherTablesInBrowser(tables) {
  const result = [];
  for (let t of tables) {
    const rows = Array.from(t.querySelectorAll('ROW'));
    if (rows.length < 10) continue;

    const r1Cells = Array.from(rows[1].querySelectorAll('CELL'));
    let teacherName = '';
    let gradeYear = '';

    for (let c of r1Cells) {
      const txt = c.textContent.trim();
      if (txt.includes('학년도')) gradeYear = txt;
      else if (txt && !txt.includes('시간표')) teacherName = txt;
    }

    if (!teacherName) continue;
    if (teacherName === '이상균') teacherName = '전아린';

    const entity = {
      id: 'T_' + teacherName,
      name: teacherName,
      rawTitle: teacherName,
      gradeYear: gradeYear,
      type: 'teacher',
      totalHours: 0,
      hoursByDay: { '월': 0, '화': 0, '수': 0, '목': 0, '금': 0 },
      schedule: { '월': {}, '화': {}, '수': {}, '목': {}, '금': {} }
    };

    let totalHours = 0;
    for (let r = 3; r <= 9 && r < rows.length; r++) {
      const cells = Array.from(rows[r].querySelectorAll('CELL'));
      const periodNum = r - 2;

      for (let dIdx = 0; dIdx < 5; dIdx++) {
        const cIdx = 1 + dIdx;
        if (cIdx >= cells.length) break;
        const day = DAYS[dIdx];
        const cell = cells[cIdx];

        const pNodes = Array.from(cell.querySelectorAll('P'));
        const lines = pNodes.map(p => p.textContent.trim().replace(/이상균/g, '전아린')).filter(Boolean);
        const raw = lines.join(' ');

        const isFree = lines.length === 0 || raw === '여유';
        const periodCell = {
          subject: lines.length > 0 ? lines[0] : (raw === '여유' ? '여유' : ''),
          target: lines.length >= 2 ? lines[1] : '',
          raw: raw,
          isFree: isFree,
          lines: lines
        };

        entity.schedule[day][periodNum.toString()] = periodCell;
        if (!isFree) {
          totalHours++;
          entity.hoursByDay[day]++;
        }
      }
    }

    entity.totalHours = totalHours;
    result.push(entity);
  }
  return result;
}

function parseHmlClassTablesInBrowser(tables) {
  const result = [];
  for (let t of tables) {
    const rows = Array.from(t.querySelectorAll('ROW'));
    if (rows.length < 10) continue;

    const r1Cells = Array.from(rows[1].querySelectorAll('CELL'));
    let titleText = '';
    let gradeYear = '';

    for (let c of r1Cells) {
      const txt = c.textContent.trim();
      if (txt.includes('학년도')) gradeYear = txt;
      else if (txt && !txt.includes('시간표')) titleText = txt;
    }

    if (!titleText) continue;

    let className = titleText;
    let homeroom = '';
    let grade = '';
    let classNum = '';

    const match = titleText.match(/^(\d+)-(\d+)(?:\s+(.+))?/);
    if (match) {
      grade = match[1];
      classNum = match[2];
      className = `${grade}-${classNum}`;
      if (match[3]) {
        homeroom = match[3].trim();
        if (homeroom === '이상균') homeroom = '전아린';
      }
    }

    const entity = {
      id: 'C_' + className,
      name: className,
      rawTitle: titleText.replace(/이상균/g, '전아린'),
      homeroom: homeroom,
      grade: grade,
      classNum: classNum,
      gradeYear: gradeYear,
      type: 'class',
      totalHours: 0,
      hoursByDay: { '월': 0, '화': 0, '수': 0, '목': 0, '금': 0 },
      schedule: { '월': {}, '화': {}, '수': {}, '목': {}, '금': {} }
    };

    let totalHours = 0;
    for (let r = 3; r <= 9 && r < rows.length; r++) {
      const cells = Array.from(rows[r].querySelectorAll('CELL'));
      const periodNum = r - 2;

      for (let dIdx = 0; dIdx < 5; dIdx++) {
        const cIdx = 1 + dIdx;
        if (cIdx >= cells.length) break;
        const day = DAYS[dIdx];
        const cell = cells[cIdx];

        const pNodes = Array.from(cell.querySelectorAll('P'));
        const lines = pNodes.map(p => p.textContent.trim().replace(/이상균/g, '전아린')).filter(Boolean);
        const raw = lines.join(' ');

        const isFree = lines.length === 0;
        const periodCell = {
          subject: lines.length > 0 ? lines[0] : '',
          target: lines.length >= 2 ? (lines[1] === '이상균' ? '전아린' : lines[1]) : '',
          raw: raw,
          isFree: isFree,
          lines: lines
        };

        entity.schedule[day][periodNum.toString()] = periodCell;
        if (!isFree) {
          totalHours++;
          entity.hoursByDay[day]++;
        }
      }
    }

    entity.totalHours = totalHours;
    result.push(entity);
  }
  return result;
}


/* ==========================================================================
   Academic Calendar & Friday Changche Dynamic System (학사일정 & 금요일 창체 시스템)
   ========================================================================== */

function getAcademicCalendar() {
  if (AppState.academicCalendar) return AppState.academicCalendar;
  if (window.SCHOOL_TIMETABLE_DATA && window.SCHOOL_TIMETABLE_DATA.academicCalendar) {
    AppState.academicCalendar = window.SCHOOL_TIMETABLE_DATA.academicCalendar;
    return AppState.academicCalendar;
  }
  return null;
}

// RFC 4180 CSV parser
function parseCSV(text) {
  const rows = [];
  let row = [];
  let current = '';
  let insideQuotes = false;
  
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];
    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        current += '"';
        i++;
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === ',' && !insideQuotes) {
      row.push(current);
      current = '';
    } else if ((char === '\r' || char === '\n') && !insideQuotes) {
      if (char === '\r' && nextChar === '\n') i++;
      row.push(current);
      current = '';
      if (row.length > 1 || row[0] !== '') rows.push(row);
      row = [];
    } else {
      current += char;
    }
  }
  if (current !== '' || row.length > 0) {
    row.push(current);
    rows.push(row);
  }
  return rows;
}


/* Department Color Palette & Badge Formatter (교사별 시간표 업무부서 필터 스타일 완벽 연동 & 간결 명칭 표기) */
const ACADEMIC_DEPT_CONFIG = {
  // 12 공식 업무부서 매핑 (라벨: 유저 지정 간결 명칭, 클래스: 교사별 시간표 업무부서 필터 스타일)
  '교무기획부': { name: '교무', className: 'badge-admin-교무기획부' },
  '교무': { name: '교무', className: 'badge-admin-교무기획부' },
  '교무부': { name: '교무', className: 'badge-admin-교무기획부' },
  '교무기획': { name: '교무', className: 'badge-admin-교무기획부' },

  '생활안전부': { name: '생활', className: 'badge-admin-생활안전부' },
  '생활': { name: '생활', className: 'badge-admin-생활안전부' },
  '생안': { name: '생활', className: 'badge-admin-생활안전부' },
  '생안부': { name: '생활', className: 'badge-admin-생활안전부' },
  '생활안전': { name: '생활', className: 'badge-admin-생활안전부' },

  '진로상담부': { name: '진로', className: 'badge-admin-진로상담부' },
  '진로': { name: '진로', className: 'badge-admin-진로상담부' },
  '진로부': { name: '진로', className: 'badge-admin-진로상담부' },
  '진로상담': { name: '진로', className: 'badge-admin-진로상담부' },

  '진학지도부': { name: '진학', className: 'badge-admin-진학지도부' },
  '진학': { name: '진학', className: 'badge-admin-진학지도부' },
  '진학부': { name: '진학', className: 'badge-admin-진학지도부' },
  '진학지도': { name: '진학', className: 'badge-admin-진학지도부' },

  '교육정보부': { name: '정보', className: 'badge-admin-교육정보부' },
  '정보': { name: '정보', className: 'badge-admin-교육정보부' },
  '교육정보': { name: '정보', className: 'badge-admin-교육정보부' },

  '고교학점제부': { name: '학점제', className: 'badge-admin-고교학점제부' },
  '학점제': { name: '학점제', className: 'badge-admin-고교학점제부' },
  '학점': { name: '학점제', className: 'badge-admin-고교학점제부' },
  '연구': { name: '학점제', className: 'badge-admin-고교학점제부' },
  '고교학점': { name: '학점제', className: 'badge-admin-고교학점제부' },
  '고교학점제': { name: '학점제', className: 'badge-admin-고교학점제부' },

  '교육평가부': { name: '평가', className: 'badge-admin-교육평가부' },
  '평가': { name: '평가', className: 'badge-admin-교육평가부' },
  '교육평가': { name: '평가', className: 'badge-admin-교육평가부' },

  '인문사회부': { name: '인문', className: 'badge-admin-인문사회부' },
  '인문': { name: '인문', className: 'badge-admin-인문사회부' },
  '인문사회': { name: '인문', className: 'badge-admin-인문사회부' },

  '과학중점부': { name: '과중', className: 'badge-admin-과학중점부' },
  '과중': { name: '과중', className: 'badge-admin-과학중점부' },
  '영재': { name: '과중', className: 'badge-admin-과학중점부' },
  '과중,영재': { name: '과중', className: 'badge-admin-과학중점부' },
  '과학중점': { name: '과중', className: 'badge-admin-과학중점부' },

  '1학년부': { name: '1학년', className: 'badge-admin-1학년부' },
  '1학년': { name: '1학년', className: 'badge-admin-1학년부' },

  '2학년부': { name: '2학년', className: 'badge-admin-2학년부' },
  '2학년': { name: '2학년', className: 'badge-admin-2학년부' },

  '3학년부': { name: '3학년', className: 'badge-admin-3학년부' },
  '3학년': { name: '3학년', className: 'badge-admin-3학년부' },

  // 기타 부서 (행정실, 운동부 등)
  '행정실': { name: '행정실', className: 'badge-admin-행정실' },
  '행정': { name: '행정실', className: 'badge-admin-행정실' },

  '운동부': { name: '운동부', className: 'badge-admin-운동부' },

  '보건': { name: '보건', className: 'badge-admin-보건' },

  '도서관': { name: '도서관', className: 'badge-admin-도서관' },

  '방송부': { name: '방송부', className: 'badge-admin-방송부' },

  '교장': { name: '교장', className: 'badge-admin-교장' },
  '교감': { name: '교감', className: 'badge-admin-교감' },

  '영어': { name: '영어', className: 'badge-admin-영어' }
};

function getDepartmentStyleInfo(deptName) {
  let clean = deptName.replace(/[<>()]/g, '').trim();
  if (ACADEMIC_DEPT_CONFIG[clean]) {
    return { ...ACADEMIC_DEPT_CONFIG[clean] };
  }
  return {
    name: clean,
    className: 'badge-admin-' + clean
  };
}

function formatEventLineWithDeptBadges(line) {
  let text = line;
  const badges = [];

  // 1. Match angle brackets <부서>
  text = text.replace(/<([^>]+)>/g, (m, g1) => {
    const parts = g1.split(/[,/]/).map(x => x.trim()).filter(Boolean);
    parts.forEach(p => {
      const info = getDepartmentStyleInfo(p);
      if (info && !badges.some(b => b.name === info.name)) {
        badges.push(info);
      }
    });
    return '';
  });

  // 2. Match parenthesized known department keywords (교육평가부, 평가, 고교학점제부, 학점제, 3학년부, 3학년, 행정실 등)
  text = text.replace(/\s*\(\s*(교육평가부|고교학점제부|진학지도부|진로상담부|교무기획부|생활안전부|교육정보부|인문사회부|과학중점부|1학년부|2학년부|3학년부|평가|학점제|학점|과중|진로|진학|교무|생활|생안|생안부|행정실|행정|보건|진학부|1학년|2학년|3학년|연구|정보|도서관|방송부|운동부|인문사회|인문사회부|인문)\s*\)/g, (m, g1) => {
    const info = getDepartmentStyleInfo(g1);
    if (info && !badges.some(b => b.name === info.name)) {
      badges.push(info);
    }
    return '';
  });

  // 3. Auto-tag '운동부' for badminton-related events if not already tagged
  if (/배드민턴/.test(text) && !badges.some(b => b.name === '운동부')) {
    badges.push(getDepartmentStyleInfo('운동부'));
  }

  // 4. Auto-tag '평가' for 원안, 고사감독, 성적이의, 수업나눔, 시험범위 공지, 학부모대상 공개수업
  const isEvaluation = /원안|고사\s*감독|성적\s*이의|수업\s*나눔|시험범위\s*공지|학부모\s*대상\s*공개\s*수업/.test(text);
  if (isEvaluation && !badges.some(b => b.name === '평가' || b.name === '교육평가부')) {
    badges.push(getDepartmentStyleInfo('평가'));
  }

  // 5. Auto-tag '학점제' for 수강신청, 교육과정
  const isCreditSystem = /수강\s*신청|교육\s*과정/.test(text);
  if (isCreditSystem && !badges.some(b => b.name === '학점제' || b.name === '고교학점제부')) {
    badges.push(getDepartmentStyleInfo('학점제'));
  }

  // 6. Auto-tag '진학' for 수능접수, 수시접수, 지함관, 학부모 상담주간, 진학설명회
  const isAdmissions = /(?:지함관|수시\s*접수|수시.*원서\s*접수|대입\s*수시.*접수|수능\s*접수|수능.*원서\s*접수|수능원서\s*접수|학부모\s*상담\s*주간|진학\s*설명회)/.test(text);
  if (isAdmissions && !badges.some(b => b.name === '진학' || b.name === '진학지도부')) {
    badges.push(getDepartmentStyleInfo('진학'));
  }

  // 7. Auto-tag '인문' for 방과후, 동아리활동 related events if not already tagged
  if (/(?:방과\s*후|동아리\s*활동)/.test(text) && !badges.some(b => b.name === '인문' || b.name === '인문사회' || b.name === '인문사회부')) {
    badges.push(getDepartmentStyleInfo('인문'));
  }

  // 8. Auto-tag '3학년' for 수능원서 작성 related events if not already tagged
  if (/수능원서\s*작성/.test(text) && !badges.some(b => b.name === '3학년' || b.name === '3학년부')) {
    badges.push(getDepartmentStyleInfo('3학년'));
  }

  text = text.trim();
  const escapedText = escapeHtml(text);
  const badgeHtml = badges.map(b => 
    `<span class="calendar-dept-badge ${escapeHtml(b.className)}" data-dept="${escapeHtml(b.name)}">${escapeHtml(b.name)}</span>`
  ).join('');

  return escapedText + badgeHtml;
}

function parseGoogleSheetCalendarCSV(csvText) {
  const rows = parseCSV(csvText);
  const calendarDays = [];
  const fridaySchedule = [];

  const weekdays = [
    { name: '월', dayIdx: 3, eventIdx: 4, lessonIdx: [5, 6, 7], dow: 1 },
    { name: '화', dayIdx: 11, eventIdx: 12, lessonIdx: [13, 14, 15], dow: 2 },
    { name: '수', dayIdx: 19, eventIdx: 20, lessonIdx: [21, 22, 23], dow: 3 },
    { name: '목', dayIdx: 27, eventIdx: 28, lessonIdx: [29, 30, 31], dow: 4 },
    { name: '금', dayIdx: 35, eventIdx: 36, lessonIdx: [37, 38, 39], dow: 5 }
  ];

  let currentMonth = 3;

  rows.forEach((r, idx) => {
    const col0 = r[0]?.trim();
    const col1 = r[1]?.trim();

    // Row-based month transitions in official sheet
    if (idx === 5) currentMonth = 3;
    else if (idx === 10) currentMonth = 4;
    else if (idx === 16) currentMonth = 5;
    else if (idx === 21) currentMonth = 6;
    else if (idx === 27) currentMonth = 7;
    else if (idx === 38 || idx === 39) currentMonth = 8;
    else if (idx === 46) currentMonth = 8;
    else if (idx === 49) currentMonth = 9;
    else if (idx === 54 || idx === 55 || idx === 57) currentMonth = 10;
    else if (idx === 60) currentMonth = 11;
    else if (idx === 65 || idx === 67) currentMonth = 12;
    else if (idx === 71) currentMonth = 2;
    else if (col0 && /^\d+$/.test(col0)) {
      currentMonth = parseInt(col0);
    }

    const weekNum = parseInt(col1) || null;

    weekdays.forEach(wd => {
      const dayStr = r[wd.dayIdx]?.trim();
      if (dayStr && /^\d+$/.test(dayStr)) {
        const dayNum = parseInt(dayStr);
        const eventRaw = r[wd.eventIdx]?.trim() || '';

        let actualMonth = currentMonth;
        let actualYear = (actualMonth >= 3) ? 2026 : 2027;
        if (idx === 70 && wd.name === '금' && dayNum === 1) {
          actualMonth = 1;
          actualYear = 2027;
        }

        const dateStr = `${actualYear}-${String(actualMonth).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;

        const lessonDays = wd.lessonIdx.map(i => r[i]?.trim() || '');
        const isZeroLesson = lessonDays.length > 0 && lessonDays.every(l => l === '0');

        let isHoliday = isZeroLesson || 
                        eventRaw.includes('공휴일') || 
                        eventRaw.includes('휴업일') || 
                        eventRaw.includes('개교기념 재량휴업일') ||
                        eventRaw.includes('추석') || 
                        eventRaw.includes('설날') ||
                        eventRaw.includes('어린이날') || 
                        eventRaw.includes('현충일') || 
                        eventRaw.includes('광복절') ||
                        eventRaw.includes('개천절') || 
                        eventRaw.includes('한글날') || 
                        eventRaw.includes('성탄절') || 
                        eventRaw.includes('신정') || 
                        eventRaw.includes('삼일절') || 
                        eventRaw.includes('노동절');

        let isExam = false;
        let examTitle = '';
        const eventLines = eventRaw.split('\n').map(l => l.trim()).filter(Boolean);
        for (const line of eventLines) {
          if (line === '1회고사' || line.startsWith('1회고사(') || line.startsWith('1회고사 ')) {
            isExam = true;
            examTitle = '1회고사';
            break;
          } else if (line === '2회고사' || line.startsWith('2회고사(') || line.startsWith('2회고사 ')) {
            isExam = true;
            examTitle = '2회고사';
            break;
          } else if (line.startsWith('대학수학능력시험') || line === '수능시험') {
            isExam = true;
            examTitle = '대학수학능력시험';
            break;
          } else if (line.startsWith('학평') || line.startsWith('모평') || line.startsWith('모의평가') || line.startsWith('전국연합학력평가')) {
            isExam = true;
            examTitle = '학력평가';
            break;
          }
        }

        calendarDays.push({
          date: dateStr,
          year: actualYear,
          month: actualMonth,
          day: dayNum,
          dayOfWeek: wd.name,
          week: weekNum,
          event: eventRaw,
          isHoliday,
          isExam,
          examTitle
        });
      }
    });

    const friDayStr = r[35]?.trim();
    const c1 = [r[48]?.trim() || '', r[49]?.trim() || '', r[50]?.trim() || ''];
    const c2 = [r[51]?.trim() || '', r[52]?.trim() || '', r[53]?.trim() || ''];
    const c3 = [r[54]?.trim() || '', r[55]?.trim() || '', r[56]?.trim() || ''];

    if (friDayStr && /^\d+$/.test(friDayStr)) {
      const friDay = parseInt(friDayStr);
      let actualMonth = currentMonth;
      let actualYear = (actualMonth >= 3) ? 2026 : 2027;
      if (idx === 70 && friDay === 1) {
        actualMonth = 1;
        actualYear = 2027;
      }
      const dateStr = `${actualYear}-${String(actualMonth).padStart(2, '0')}-${String(friDay).padStart(2, '0')}`;
      const friEvent = r[36]?.trim() || '';

      if (c1.some(x => x && x !== '5' && x !== '1학년')) {
        fridaySchedule.push({
          date: dateStr,
          year: actualYear,
          month: actualMonth,
          day: friDay,
          week: weekNum,
          event: friEvent,
          grade1: c1,
          grade2: c2,
          grade3: c3
        });
      }
    }
  });

  return {
    calendarDays: calendarDays,
    fridaySchedule: fridaySchedule
  };
}

async function syncGoogleSheetCalendar(isManual = false) {
  try {
    const res = await fetch(GOOGLE_SHEET_CSV_URL, { cache: 'no-cache' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const csvText = await res.text();
    const parsed = parseGoogleSheetCalendarCSV(csvText);
    if (parsed && parsed.calendarDays && parsed.calendarDays.length > 0) {
      AppState.academicCalendar = parsed;
      AppState.lastCalendarSyncTime = new Date();
      try {
        localStorage.setItem('timetable_academic_calendar', JSON.stringify(parsed));
        localStorage.setItem('timetable_calendar_sync_time', AppState.lastCalendarSyncTime.toISOString());
      } catch (e) {}
      if (isManual) {
        if (typeof fetchJeonpoWeather === 'function') {
          fetchJeonpoWeather(true);
        }
        showToast('✅ 구글 시트 학사일정 및 날씨 실시간 동기화 완료!');
      }
      renderApp();
      return true;
    }
  } catch (err) {
    console.warn('Google Sheet live sync failed, using bundled cache:', err);
    if (isManual) {
      showToast('⚠️ 구글 시트 연결 실패. 내장된 최신 학사일정을 사용합니다.');
    }
    return false;
  }
}

function getFridayChangcheByDate(dateStr) {
  const cal = getAcademicCalendar();
  if (!cal || !cal.fridaySchedule) return null;
  return cal.fridaySchedule.find(f => f.date === dateStr) || null;
}

function resolveChangcheSlot(grade, classNum, period, dateStr) {
  const changche = getFridayChangcheByDate(dateStr);
  if (!changche) return null;

  const gradeKey = `grade${grade}`;
  const acts = changche[gradeKey];
  if (!acts) return null;

  const actIdx = period - 5;
  if (actIdx < 0 || actIdx >= acts.length) return null;

  const code = acts[actIdx];
  const className = `${grade}-${classNum}`;
  const homeroom = getHomeroomForClass(className);
  const subHomeroom = getSubHomeroomForClass(className);

  if (code === '동') {
    return {
      subject: '동아리',
      shortSubject: '동아리',
      teacher: '동아리 담당교사',
      teacherName: '',
      room: '동아리실 / 교실',
      category: 'category-art',
      code: '동',
      note: '동아리 지도교사 지도'
    };
  } else if (code === '진') {
    return {
      subject: '진로',
      shortSubject: '진로',
      teacher: homeroom ? `${homeroom} (담임)` : '학급 담임',
      teacherName: homeroom || '',
      room: `${className}교실`,
      category: 'category-career',
      code: '진',
      note: '학급 담임교사 지도'
    };
  } else if (code === '여유' || code === '자') {
    return {
      subject: '여유 (자율)',
      shortSubject: '여유',
      teacher: subHomeroom ? `${subHomeroom} (부담임)` : '학급 부담임',
      teacherName: subHomeroom || '',
      room: `${className}교실`,
      category: 'category-sub',
      code: '여유',
      note: '학급 부담임교사 지도'
    };
  } else if (code === '봉') {
    return {
      subject: '봉사활동',
      shortSubject: '봉사',
      teacher: homeroom ? `${homeroom} (담임)` : '담임/부담임',
      teacherName: homeroom || '',
      room: `${className}교실 / 교내`,
      category: 'category-etc',
      code: '봉',
      note: '봉사활동 지도'
    };
  }
  return null;
}

function getTeacherFridayChangche(teacher, period, dateStr) {
  if (!teacher || period < 5 || period > 7) return null;
  const changche = getFridayChangcheByDate(dateStr);
  if (!changche) return null;

  // 1. Check if teacher is Homeroom teacher (담임)
  if (teacher.homeroom) {
    const parts = teacher.homeroom.split('-');
    if (parts.length === 2) {
      const g = parseInt(parts[0], 10);
      const c = parseInt(parts[1], 10);
      const slot = resolveChangcheSlot(g, c, period, dateStr);
      if (slot && slot.code === '진') {
        return {
          subject: '진로',
          target: teacher.homeroom,
          category: 'category-career',
          note: `${teacher.homeroom} 담임 진로 지도`
        };
      }
    }
  }

  // 2. Check if teacher is Sub-Homeroom teacher (부담임)
  const subClass = getSubHomeroomForTeacher(teacher.name);
  if (subClass) {
    const parts = subClass.split('-');
    if (parts.length === 2) {
      const g = parseInt(parts[0], 10);
      const c = parseInt(parts[1], 10);
      const slot = resolveChangcheSlot(g, c, period, dateStr);
      if (slot && (slot.code === '여유' || slot.code === '자')) {
        return {
          subject: '여유 (자율)',
          target: subClass,
          category: 'category-sub',
          note: `${subClass} 부담임 여유 지도`
        };
      }
    }
  }

  return null;
}

function getExamDDays(targetDateStr, baseDate = new Date()) {
  const target = new Date(targetDateStr);
  const b = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate());
  const t = new Date(target.getFullYear(), target.getMonth(), target.getDate());
  const diffTime = t.getTime() - b.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'D-Day (오늘)';
  if (diffDays > 0) return `D-${diffDays}`;
  return `D+${Math.abs(diffDays)}`;
}

function getTodayAcademicEvent(now = new Date()) {
  const cal = getAcademicCalendar();
  if (!cal || !cal.calendarDays) return null;
  const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  return cal.calendarDays.find(d => d.date === dateStr) || null;
}

function renderFridayChangcheSelectorBar() {
  const cal = getAcademicCalendar();
  if (!cal || !cal.fridaySchedule || cal.fridaySchedule.length === 0) return '';
  const selectedDate = AppState.selectedFridayWeekDate || '2026-09-04';

  return `
    <div class="friday-changche-selector-bar">
      <div class="changche-selector-label">
        <span>🎯</span>
        <span>금요일 5~7교시 창체 주차 선택:</span>
      </div>

      <div class="changche-week-controls">
        <button type="button" class="btn btn-secondary btn-sm" onclick="stepFridayWeek(-1)" title="이전 주차">◀</button>
        <select class="filter-select changche-week-select" onchange="onSelectFridayWeek(this.value)">
          ${cal.fridaySchedule.map(f => `
            <option value="${f.date}" ${f.date === selectedDate ? 'selected' : ''}>
              ${formatFridayWeekDropdownText(f)}
            </option>
          `).join('')}
        </select>
        <button type="button" class="btn btn-secondary btn-sm" onclick="stepFridayWeek(1)" title="다음 주차">▶</button>
        <button type="button" class="btn btn-sm ${selectedDate === '2026-09-04' ? 'btn-primary' : 'btn-secondary'}" onclick="onSelectFridayWeek('2026-09-04')" title="현재 주차(9월 4일)로 재설정">
          현재주차 (9/4)
        </button>
      </div>
    </div>
  `;
}

function getFridaySemester(f) {
  if (!f) return '2학기';
  const m = f.month || (new Date(f.date).getMonth() + 1);
  return (m >= 3 && m <= 7) ? '1학기' : '2학기';
}

function getFridayWeekNumber(f) {
  if (!f) return 1;
  if (typeof f.week === 'number' && f.week >= 1) return f.week;
  return 1;
}

function formatFridayWeekDropdownText(f) {
  if (!f) return '';
  const sem = getFridaySemester(f);
  const wk = getFridayWeekNumber(f);
  const m = f.month || (new Date(f.date).getMonth() + 1);
  const d = f.day || (new Date(f.date).getDate());
  return `${sem} ${wk}주차 (${m}월 ${d}일 금)`;
}

function formatCalendarWeekRangeText(f) {
  if (!f || !f.date) return '';
  const sem = getFridaySemester(f);
  const wk = getFridayWeekNumber(f);
  const parts = f.date.split('-');
  if (parts.length === 3) {
    const y = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10);
    const d = parseInt(parts[2], 10);
    const fri = new Date(y, m - 1, d);
    const mon = new Date(y, m - 1, d - 4);
    const monM = mon.getMonth() + 1;
    const monD = mon.getDate();
    const friM = fri.getMonth() + 1;
    const friD = fri.getDate();
    return `${sem} ${wk}주차 (${monM}.${monD} ~ ${friM}.${friD})`;
  }
  return f.date;
}

function onSelectFridayWeek(dateStr) {
  AppState.selectedFridayWeekDate = dateStr;
  renderApp();
}

function stepFridayWeek(step) {
  const cal = getAcademicCalendar();
  if (!cal || !cal.fridaySchedule || cal.fridaySchedule.length === 0) return;
  const list = cal.fridaySchedule;
  const curIdx = list.findIndex(f => f.date === AppState.selectedFridayWeekDate);
  let newIdx = curIdx + step;
  if (newIdx < 0) newIdx = 0;
  if (newIdx >= list.length) newIdx = list.length - 1;
  AppState.selectedFridayWeekDate = list[newIdx].date;
  renderApp();
}


function generate5DayMonthRows(y, m) {
  const daysInMonth = new Date(y, m, 0).getDate();
  const rows = [];
  let currentRow = [];

  let firstWeekday = 1;
  while (firstWeekday <= daysInMonth) {
    const dow = new Date(y, m - 1, firstWeekday).getDay();
    if (dow >= 1 && dow <= 5) break;
    firstWeekday++;
  }

  const firstDow = new Date(y, m - 1, firstWeekday).getDay();
  for (let i = 1; i < firstDow; i++) {
    currentRow.push({ type: 'empty' });
  }

  for (let d = firstWeekday; d <= daysInMonth; d++) {
    const dow = new Date(y, m - 1, d).getDay();
    if (dow === 0 || dow === 6) continue; // Skip Sat & Sun

    currentRow.push({ type: 'day', day: d, dow: dow });

    if (dow === 5) {
      rows.push(currentRow);
      currentRow = [];
    }
  }

  if (currentRow.length > 0) {
    while (currentRow.length < 5) {
      currentRow.push({ type: 'empty' });
    }
    rows.push(currentRow);
  }

  return rows;
}

/* ==========================================================================
   Calendar Renderers (연간, 월별, 주별 캘린더 독립 뷰)
   ========================================================================== */
function renderCalendarView(container) {
  const cal = getAcademicCalendar();
  if (!cal || !cal.calendarDays) {
    container.innerHTML = `
      <div class="control-card" style="text-align: center; padding: 3rem 1.5rem;">
        <div style="font-size: 3rem; margin-bottom: 1rem;">📅</div>
        <h2>2026학년도 학사일정</h2>
        <p style="color: var(--text-muted); margin: 0.75rem 0 1.5rem;">학사일정 데이터를 불러오는 중이거나 데이터가 없습니다.</p>
        <button class="btn btn-primary" onclick="syncGoogleSheetCalendar(true)">🔄 구글 시트에서 불러오기</button>
      </div>
    `;
    return;
  }

  const now = new Date();
  const d1 = getExamDDays('2026-10-13', now);
  const d2 = getExamDDays('2026-12-07', now);
  const dSuneung = getExamDDays('2026-11-19', now);
  const dVac = getExamDDays('2026-12-30', now);

  let html = `
    <!-- Top Calendar Card -->
    <div class="calendar-view-card">
      <div class="calendar-header-toolbar">
        <!-- Left Side: Title & Sync Time (Top) + View Mode Switcher (Bottom) -->
        <div class="calendar-title-and-modes">
          <div class="calendar-title-group">
            <span style="font-size: 1.5rem; flex-shrink: 0;">📅</span>
            <h2>2026학년도 학사일정</h2>
            <div class="calendar-sync-time-sub">
              <span class="sync-dot">●</span> 동기화 시간: <span class="sync-time-val">${AppState.lastCalendarSyncTime ? formatTime(AppState.lastCalendarSyncTime) : '연결됨 (실시간)'}</span>
            </div>
          </div>

          <!-- Mode Switcher -->
          <div class="view-mode-switcher">
            <button class="view-mode-btn ${AppState.calendarViewMode === 'year' ? 'active' : ''}" onclick="setCalendarViewMode('year')">
              🗓️ 연간 캘린더
            </button>
            <button class="view-mode-btn ${AppState.calendarViewMode === 'month' ? 'active' : ''}" onclick="setCalendarViewMode('month')">
              📆 월별 캘린더
            </button>
            <button class="view-mode-btn ${AppState.calendarViewMode === 'week' ? 'active' : ''}" onclick="setCalendarViewMode('week')">
              📋 주별 캘린더
            </button>
          </div>
        </div>

        <!-- Right Side: 1-Column 4-Row D-Day + School Meal Cards (Lunch & Dinner), identical height, stuck to right! -->
        <div class="calendar-header-right-widgets">
          <!-- 1-Column 4-Row D-Day Widget (Height identical to meal cards) -->
          <div class="calendar-dday-1col" title="주요 학사일정 D-Day (클릭 시 해당 주차 캘린더로 이동)">
            <button type="button" class="dday-1col-item" onclick="onSelectCalendarMonthDay('2026-10-13')" title="2학기 1회고사: 2026. 10. 13.(화) ~ 10. 19.(월)">
              <span class="dday-1col-name">1회고사</span>
              <span class="dday-1col-badge exam">${d1}</span>
            </button>
            <button type="button" class="dday-1col-item" onclick="onSelectCalendarMonthDay('2026-12-07')" title="2학기 2회고사: 2026. 12. 07.(월) ~ 12. 11.(금)">
              <span class="dday-1col-name">2회고사</span>
              <span class="dday-1col-badge exam">${d2}</span>
            </button>
            <button type="button" class="dday-1col-item" onclick="onSelectCalendarMonthDay('2026-11-19')" title="2027 대학수학능력시험: 2026. 11. 19.(목)">
              <span class="dday-1col-name">수능</span>
              <span class="dday-1col-badge suneung">${dSuneung}</span>
            </button>
            <button type="button" class="dday-1col-item" onclick="onSelectCalendarMonthDay('2026-12-30')" title="2학기 겨울방학식: 2026. 12. 30.(수)">
              <span class="dday-1col-name">방학식</span>
              <span class="dday-1col-badge vac">${dVac}</span>
            </button>
          </div>

          <!-- School Meal Menu Cards (Lunch & Dinner) -->
          ${(() => {
            const sm = getCachedTodayMealSummary();
            return `
              <div class="meal-card-compact lunch" onclick="openMealDetailModal('lunch')" title="${sm.dateLabel} 점심(중식) 메뉴 상세 보기 (클릭)">
                <div class="meal-card-head">
                  <div class="meal-card-title-wrap">
                    <span class="meal-card-badge lunch">🍱 점심</span>
                    <span class="meal-card-date-badge" id="mealLunchDate">${sm.dateLabel}</span>
                  </div>
                  <span class="meal-card-cal" id="mealLunchCal">${sm.lunchCal}</span>
                </div>
                <div class="meal-card-dishes" id="mealLunchMenu">${escapeHtml(sm.lunchText)}</div>
              </div>
              <div class="meal-card-compact dinner" onclick="openMealDetailModal('dinner')" title="${sm.dateLabel} 저녁(석식) 메뉴 상세 보기 (클릭)">
                <div class="meal-card-head">
                  <div class="meal-card-title-wrap">
                    <span class="meal-card-badge dinner">🌙 저녁</span>
                    <span class="meal-card-date-badge" id="mealDinnerDate">${sm.dateLabel}</span>
                  </div>
                  <span class="meal-card-cal" id="mealDinnerCal">${sm.dinnerCal}</span>
                </div>
                <div class="meal-card-dishes" id="mealDinnerMenu">${escapeHtml(sm.dinnerText)}</div>
              </div>
            `;
          })()}
        </div>
      </div>

      <!-- Render Selected Mode -->
      <div id="calendarContentArea">
        ${AppState.calendarViewMode === 'year' ? renderCalendarYearView(cal) : ''}
        ${AppState.calendarViewMode === 'month' ? renderCalendarMonthView(cal) : ''}
        ${AppState.calendarViewMode === 'week' ? renderCalendarWeekView(cal) : ''}
      </div>
    </div>
  `;

  container.innerHTML = html;
  loadTodayMealInfo();
}

// 1. Year View (연간 캘린더)
function renderCalendarYearView(cal) {
  cal = cal || getAcademicCalendar();
  const months = [
    { y: 2026, m: 3, label: '3월' },
    { y: 2026, m: 4, label: '4월' },
    { y: 2026, m: 5, label: '5월' },
    { y: 2026, m: 6, label: '6월' },
    { y: 2026, m: 7, label: '7월' },
    { y: 2026, m: 8, label: '8월' },
    { y: 2026, m: 9, label: '9월' },
    { y: 2026, m: 10, label: '10월' },
    { y: 2026, m: 11, label: '11월' },
    { y: 2026, m: 12, label: '12월' },
    { y: 2027, m: 1, label: '1월' },
    { y: 2027, m: 2, label: '2월' }
  ];

  const now = new Date();
  const curY = now.getFullYear();
  const curM = now.getMonth() + 1;

  let html = `
    <div style="margin-bottom: 1rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.75rem;">
      <div style="display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap;">
        <h3 style="font-size: 1.1rem; font-weight: 700; color: var(--text-primary); margin: 0; white-space: nowrap;">
          🗓️ 2026학년도 연간 학사일정 전체 보기
        </h3>
        <div style="display: flex; align-items: center; gap: 0.4rem;">
          <button type="button" class="btn btn-primary btn-sm week-sync-btn" onclick="syncGoogleSheetCalendar(true)" title="구글 스프레드시트의 최신 내용을 지금 즉시 동기화합니다">
            🔄 지금 즉시 동기화
          </button>
          <a class="btn btn-secondary btn-sm week-nav-action-btn" href="${GOOGLE_SHEET_VIEW_URL}" target="_blank" rel="noopener noreferrer" title="구글 스프레드시트 원본 열기">
            🔗 시트 원본 열기
          </a>
          <button class="btn btn-secondary btn-sm week-nav-action-btn" onclick="window.print()" title="학사일정 인쇄">
            🖨️ 인쇄
          </button>
        </div>
      </div>
      <div style="display: flex; align-items: center; gap: 0.85rem; font-size: 0.82rem; flex-wrap: wrap;">
        <span style="display:inline-flex; align-items:center; gap:0.25rem;"><span style="width:10px; height:10px; background:#dc2626; border-radius:2px;"></span> 공휴일</span>
        <span style="display:inline-flex; align-items:center; gap:0.25rem;"><span style="width:10px; height:10px; background:#7c3aed; border-radius:2px;"></span> 1·2회고사</span>
        <span style="display:inline-flex; align-items:center; gap:0.25rem;"><span style="width:10px; height:10px; background:#0284c7; border-radius:2px;"></span> 모의고사 / 수능</span>
        <span style="display:inline-flex; align-items:center; gap:0.25rem;"><span style="width:10px; height:10px; background:#f59e0b; border-radius:2px;"></span> 방학·개학·졸업식</span>
        <span style="display:inline-flex; align-items:center; gap:0.25rem;"><span style="width:10px; height:10px; background:#6ee7b7; border:1px solid #10b981; border-radius:2px;"></span> 오늘</span>
      </div>
    </div>

    <div class="calendar-year-grid">
      ${months.map(item => {
        const isCurMonth = (item.y === curY && item.m === curM);
        const daysInMonth = new Date(item.y, item.m, 0).getDate();

        // 5-day week empty prefix calculation
        let firstWeekday = 1;
        while (firstWeekday <= daysInMonth) {
          const dow = new Date(item.y, item.m - 1, firstWeekday).getDay();
          if (dow >= 1 && dow <= 5) break;
          firstWeekday++;
        }
        const firstDow = new Date(item.y, item.m - 1, firstWeekday).getDay(); // 1~5
        const emptyCount = Math.max(0, firstDow - 1);

        const monthEvents = cal.calendarDays.filter(d => d.year === item.y && d.month === item.m);

        return `
          <div class="mini-month-card ${isCurMonth ? 'is-current-month' : ''}" onclick="selectCalendarMonth(${item.y}, ${item.m})">
            <div class="mini-month-header">
              <span>${item.y}년 ${item.label}</span>
              ${isCurMonth ? '<span class="chip-badge" style="background:#059669; color:#fff; font-size:0.68rem;">이번 달</span>' : ''}
            </div>

            <div class="mini-month-grid">
              <span class="mini-month-th">월</span>
              <span class="mini-month-th">화</span>
              <span class="mini-month-th">수</span>
              <span class="mini-month-th">목</span>
              <span class="mini-month-th">금</span>

              ${Array(emptyCount).fill(0).map(() => '<span class="mini-day-cell other-month"></span>').join('')}

              ${Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                const dow = new Date(item.y, item.m - 1, day).getDay();
                if (dow === 0 || dow === 6) return ''; // Skip Sat & Sun!

                const dateStr = `${item.y}-${String(item.m).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                const dayEvent = monthEvents.find(d => d.date === dateStr);
                const isHoliday = dayEvent && dayEvent.isHoliday;
                const isExam = dayEvent && dayEvent.isExam;
                const isRegularExam = isExam && (dayEvent.examTitle === '1회고사' || dayEvent.examTitle === '2회고사' || /1회고사|2회고사/.test(dayEvent.event || ''));
                const isMockOrCsat = isExam && !isRegularExam;
                const isCeremony = !isHoliday && !isExam && /(?:방학식|개학식|졸업식)/.test(dayEvent && dayEvent.event ? dayEvent.event : '');
                const isToday = isCurMonth && (day === now.getDate());
                const eventText = dayEvent && dayEvent.event ? dayEvent.event.replace(/\n/g, ' ') : '';
                const tooltipTitle = escapeHtml(eventText ? `${item.m}월 ${day}일: ${eventText}` : `${item.m}월 ${day}일`);

                const examClass = isRegularExam ? 'is-exam is-regular-exam' : isMockOrCsat ? 'is-exam is-mock-exam' : '';
                const ceremonyClass = isCeremony ? 'is-ceremony' : '';

                return `
                  <span class="mini-day-cell ${isToday ? 'is-today' : ''} ${isHoliday ? 'is-holiday' : ''} ${examClass} ${ceremonyClass}" title="${tooltipTitle}">
                    ${day}
                  </span>
                `;
              }).join('')}
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;

  return html;
}

// 교원 회의(정례/임시 교무회의, 전문적 학습 공동체, 교과협의회, 다모임 등) 및 주요 학사 의식(방학식, 개학식, 졸업식 등) 뱃지 추출 공통 함수
function extractTeacherMeetingBadges(rawEventText, isHoliday, isExam) {
  if (!rawEventText || isHoliday || isExam) {
    return {
      meetingBadges: [],
      ceremonyBadges: [],
      allHeaderBadges: [],
      remainingLines: rawEventText ? rawEventText.split('\n').map(l => l.trim()).filter(Boolean) : []
    };
  }

  const rawLines = rawEventText.split('\n').map(l => l.trim()).filter(Boolean);
  const meetingBadges = [];
  const ceremonyBadges = [];
  const allHeaderBadges = [];
  const remainingLines = [];

  const meetingRegex = /^(?:임시\s*)?(?:교무회의|교과\s*협의회|전문적\s*학습\s*공동체|다모임)/;
  const ceremonyRegex = /(?:방학식|개학식|졸업식)/;

  for (let line of rawLines) {
    // 1. 주요 학사 의식 행사 추출 (방학식, 개학식, 졸업식 등)
    if (ceremonyRegex.test(line)) {
      const cleanCeremony = line.replace(/^[\s\(\[]+/, '').replace(/[\s\)\]]+$/, '').trim();
      if (!ceremonyBadges.includes(cleanCeremony)) {
        ceremonyBadges.push(cleanCeremony);
        allHeaderBadges.push({ type: 'ceremony', text: cleanCeremony });
      }
      continue;
    }

    // 2. 단독 또는 쉼표 구분 회의 항목 처리 (예: "전문적 학습 공동체, 임시 교무회의", "교무회의", "임시 교무회의(08시)-교생 소개")
    if (meetingRegex.test(line)) {
      if (line.includes(',')) {
        const parts = line.split(',').map(p => p.trim()).filter(Boolean);
        for (const p of parts) {
          if (meetingRegex.test(p)) {
            if (!meetingBadges.includes(p)) {
              meetingBadges.push(p);
              allHeaderBadges.push({ type: 'meeting', text: p });
            }
          } else {
            remainingLines.push(p);
          }
        }
      } else {
        if (!meetingBadges.includes(line)) {
          meetingBadges.push(line);
          allHeaderBadges.push({ type: 'meeting', text: line });
        }
      }
      continue;
    }

    // 3. 행사 텍스트 내 포함된 임시 교무회의 / 교무회의 추출 (예: "배드민턴 전국체전 출정 인사(임시 교무회의)<운동부>")
    if (/(?:임시\s*교무회의)/.test(line)) {
      if (!meetingBadges.includes('임시 교무회의')) {
        meetingBadges.push('임시 교무회의');
        allHeaderBadges.push({ type: 'meeting', text: '임시 교무회의' });
      }
      line = line.replace(/\s*[\(\[]?임시\s*교무회의[\)\]]?\s*/g, ' ').replace(/\s+/g, ' ').replace(/\s*</g, '<').trim();
      if (line) {
        remainingLines.push(line);
      }
      continue;
    }

    if (/(?:교무회의)/.test(line)) {
      if (!meetingBadges.includes('교무회의')) {
        meetingBadges.push('교무회의');
        allHeaderBadges.push({ type: 'meeting', text: '교무회의' });
      }
      line = line.replace(/\s*[\(\[]?교무회의[\)\]]?\s*/g, ' ').replace(/\s+/g, ' ').replace(/\s*</g, '<').trim();
      if (line) {
        remainingLines.push(line);
      }
      continue;
    }

    remainingLines.push(line);
  }

  return { meetingBadges, ceremonyBadges, allHeaderBadges, remainingLines };
}

// 2. Month View (월별 캘린더 - 토·일 제외 월~금 5열 학사일정)
function renderCalendarMonthView(cal) {
  cal = cal || getAcademicCalendar();
  const y = AppState.calendarYear || 2026;
  const m = AppState.calendarMonth || 9;
  const now = new Date();
  const isCurrentMonth = (y === now.getFullYear() && m === (now.getMonth() + 1));

  const monthOptions = [
    { y: 2026, m: 3, label: '2026년 3월' },
    { y: 2026, m: 4, label: '2026년 4월' },
    { y: 2026, m: 5, label: '2026년 5월' },
    { y: 2026, m: 6, label: '2026년 6월' },
    { y: 2026, m: 7, label: '2026년 7월' },
    { y: 2026, m: 8, label: '2026년 8월' },
    { y: 2026, m: 9, label: '2026년 9월' },
    { y: 2026, m: 10, label: '2026년 10월' },
    { y: 2026, m: 11, label: '2026년 11월' },
    { y: 2026, m: 12, label: '2026년 12월' },
    { y: 2027, m: 1, label: '2027년 1월' },
    { y: 2027, m: 2, label: '2027년 2월' }
  ];

  const rows = generate5DayMonthRows(y, m);

  let html = `
    <!-- Month Controls -->
    <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.75rem; margin-bottom: 1rem;">
      <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
        <button type="button" class="btn btn-secondary btn-sm week-nav-btn" onclick="stepCalendarMonth(-1)" title="이전 달">◀ 이전 달</button>
        <select class="filter-select calendar-month-select" onchange="const [sy, sm] = this.value.split('-').map(Number); selectCalendarMonth(sy, sm);" title="월 선택">
          ${monthOptions.map(opt => `
            <option value="${opt.y}-${opt.m}" ${opt.y === y && opt.m === m ? 'selected' : ''}>
              ${opt.label}
            </option>
          `).join('')}
        </select>
        <button type="button" class="btn btn-secondary btn-sm week-nav-btn" onclick="stepCalendarMonth(1)" title="다음 달">다음 달 ▶</button>
        <button type="button" class="btn btn-sm ${isCurrentMonth ? 'btn-primary' : 'btn-secondary'} week-today-btn" onclick="selectCalendarMonth(${now.getFullYear()}, ${now.getMonth() + 1})" title="현재 월(${now.getMonth() + 1}월)로 이동">
          이번 달로 이동
        </button>
        <button type="button" class="btn btn-primary btn-sm week-sync-btn" onclick="syncGoogleSheetCalendar(true)" title="구글 스프레드시트의 최신 내용을 지금 즉시 동기화합니다">
          🔄 지금 즉시 동기화
        </button>
        <a class="btn btn-secondary btn-sm week-nav-action-btn" href="${GOOGLE_SHEET_VIEW_URL}" target="_blank" rel="noopener noreferrer" title="구글 스프레드시트 원본 열기">
          🔗 시트 원본 열기
        </a>
        <button class="btn btn-secondary btn-sm week-nav-action-btn" onclick="window.print()" title="학사일정 인쇄">
          🖨️ 인쇄
        </button>
      </div>
    </div>

    <!-- Month Table (5 Columns: Mon ~ Fri) -->
    <div style="overflow-x: auto;">
      <table class="month-calendar-table">
        <thead>
          <tr>
            <th style="width: 20%;">월 (Mon)</th>
            <th style="width: 20%;">화 (Tue)</th>
            <th style="width: 20%;">수 (Wed)</th>
            <th style="width: 20%;">목 (Thu)</th>
            <th style="width: 20%;">금 (Fri)</th>
          </tr>
        </thead>
        <tbody>
  `;

  rows.forEach(r => {
    html += '<tr>';
    r.forEach(cell => {
      if (cell.type === 'empty') {
        html += '<td class="month-day-cell other-month"></td>';
        return;
      }

      const dayNum = cell.day;
      const dateStr = `${y}-${String(m).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
      const dayEvent = cal.calendarDays.find(d => d.date === dateStr);
      const isToday = isCurrentMonth && (dayNum === now.getDate());
      const isFri = (cell.dow === 5);
      const isHoliday = (dayEvent && dayEvent.isHoliday);
      const isExam = (dayEvent && dayEvent.isExam);

      // Extract teacher meeting & school ceremony badges (교무회의, 방학식, 개학식, 졸업식 등)
      const { meetingBadges, ceremonyBadges, allHeaderBadges, remainingLines: monthEventLines } = extractTeacherMeetingBadges(dayEvent ? dayEvent.event : '', isHoliday, isExam);

      const friChangche = isFri ? cal.fridaySchedule.find(f => f.date === dateStr) : null;
      const eventSummary = dayEvent && dayEvent.event ? ` · ${dayEvent.event.replace(/\n/g, ' ')}` : '';
      const tooltipTitle = escapeHtml(`${m}월 ${dayNum}일${eventSummary} (클릭 시 주별 캘린더로 이동)`);

      html += `
        <td class="month-day-cell ${isToday ? 'is-today' : ''} ${isHoliday ? 'is-holiday' : ''}" onclick="onSelectCalendarMonthDay('${dateStr}')" title="${tooltipTitle}">
          <div class="day-header-num">
            <div class="day-header-left">
              <span class="day-number" ${isHoliday ? 'style="color:#ef4444; flex-shrink:0;' : 'style="flex-shrink:0;'} ${allHeaderBadges.length > 1 ? 'margin-top:0.05rem;' : ''}">${dayNum}</span>
              ${getWeatherBadgeForDate(dateStr, false)}
              ${allHeaderBadges.length > 0 ? `
                <div class="month-meeting-badges-col">
                  ${allHeaderBadges.map(b => `
                    <span class="${b.type === 'ceremony' ? 'school-ceremony-badge month-ceremony-badge' : 'monday-meeting-badge month-meeting-badge'}" title="${escapeHtml(b.text)}">
                      ${escapeHtml(b.text)}
                    </span>
                  `).join('')}
                </div>
              ` : ''}
            </div>
            ${isToday ? '<span style="font-size:0.68rem; font-weight:800; color:#059669; flex-shrink:0; margin-left:0.2rem;">오늘</span>' : ''}
          </div>

          <div class="day-events-list">
            ${friChangche && !isHoliday ? `
              <span class="calendar-event-pill pill-changche" title="금 5~7교시 창체: 1학년 [${friChangche.grade1.map(toChangcheShortCode).join('/')}] · 2학년 [${friChangche.grade2.map(toChangcheShortCode).join('/')}] · 3학년 [${friChangche.grade3.map(toChangcheShortCode).join('/')}]">
                🎯 창체 1:${toChangcheShortCode(friChangche.grade1[0])}·2:${toChangcheShortCode(friChangche.grade2[0])}·3:${toChangcheShortCode(friChangche.grade3[0])}
              </span>
            ` : ''}
            ${monthEventLines.map(e => {
              const isRegularExam = (e === '1회고사' || e === '2회고사' || e.startsWith('1회고사') || e.startsWith('2회고사'));
              const isMockOrCsat = (e.startsWith('대학수학능력시험') || e.startsWith('학평') || e.startsWith('모의평가'));
              const pillClass = isRegularExam ? 'pill-exam' : isMockOrCsat ? 'pill-exam-mock' : isHoliday ? 'pill-holiday' : 'pill-general';
              return `
                <span class="calendar-event-pill ${pillClass}" title="${escapeHtml(e)}">
                  ${formatEventLineWithDeptBadges(e)}
                </span>
              `;
            }).join('')}
          </div>
        </td>
      `;
    });
    html += '</tr>';
  });

  html += `
        </tbody>
      </table>
    </div>
  `;

  return html;
}

function getAllCalendarWeeks(cal) {
  cal = cal || getAcademicCalendar();
  if (!cal || !cal.calendarDays) return [];

  const friDays = cal.calendarDays.filter(d => d.dayOfWeek === '금');
  const changcheMap = new Map();
  if (cal.fridaySchedule) {
    cal.fridaySchedule.forEach(cs => changcheMap.set(cs.date, cs));
  }

  return friDays.map(fd => {
    const cs = changcheMap.get(fd.date);
    return {
      date: fd.date,
      year: fd.year,
      month: fd.month,
      day: fd.day,
      week: fd.week,
      event: fd.event,
      isHoliday: fd.isHoliday,
      isExam: fd.isExam,
      examTitle: fd.examTitle,
      hasChangche: !!(cs && cs.grade1 && cs.grade1.some(x => x && x !== '5' && x !== '1학년')),
      grade1: cs ? cs.grade1 : null,
      grade2: cs ? cs.grade2 : null,
      grade3: cs ? cs.grade3 : null
    };
  });
}

// 3. Week View (주별 캘린더 - 월~금 5열 및 금요 창체 카드)
function renderCalendarWeekView(cal) {
  cal = cal || getAcademicCalendar();
  const weekList = getAllCalendarWeeks(cal);
  const selectedDate = AppState.calendarWeekDate || '2026-09-04';
  let selectedFri = weekList.find(f => f.date === selectedDate);
  if (!selectedFri) {
    selectedFri = weekList.find(f => f.date === '2026-09-04') || weekList[0];
  }

  const friDate = new Date(selectedFri.date);
  const weekDays = [];
  for (let i = 4; i >= 0; i--) {
    const d = new Date(friDate);
    d.setDate(friDate.getDate() - i);
    const y = d.getFullYear();
    const m = d.getMonth() + 1;
    const day = d.getDate();
    const dateStr = `${y}-${String(m).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
    weekDays.push({
      date: dateStr,
      year: y,
      month: m,
      day: day,
      dayOfWeek: dayNames[d.getDay()],
      eventData: cal.calendarDays.find(cd => cd.date === dateStr)
    });
  }

  const now = new Date();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  let html = `
    <!-- Week Navigation Bar (Clean, Unified & Space-Efficient) -->
    <div class="calendar-week-nav-bar">
      <div class="week-nav-left">
        <button type="button" class="btn btn-secondary btn-sm week-nav-btn" onclick="stepCalendarWeek(-1)" title="이전 주차">◀ 이전 주</button>
        <select class="filter-select calendar-week-select" onchange="selectCalendarWeek(this.value)" title="주차 선택">
          ${weekList.map(f => `
            <option value="${f.date}" ${f.date === selectedFri.date ? 'selected' : ''}>
              ${formatCalendarWeekRangeText(f)}
            </option>
          `).join('')}
        </select>
        <button type="button" class="btn btn-secondary btn-sm week-nav-btn" onclick="stepCalendarWeek(1)" title="다음 주차">다음 주 ▶</button>
        <button type="button" class="btn btn-sm ${selectedFri.date === '2026-09-04' ? 'btn-primary' : 'btn-secondary'} week-today-btn" onclick="selectCalendarWeek('2026-09-04')" title="현재 주차(9월 4일 주)로 이동">
          이번 주로 이동
        </button>
        <button type="button" class="btn btn-primary btn-sm week-sync-btn" onclick="syncGoogleSheetCalendar(true)" title="구글 스프레드시트의 최신 내용을 지금 즉시 동기화합니다">
          🔄 지금 즉시 동기화
        </button>
        <a class="btn btn-secondary btn-sm week-nav-action-btn" href="${GOOGLE_SHEET_VIEW_URL}" target="_blank" rel="noopener noreferrer" title="구글 스프레드시트 원본 열기">
          🔗 시트 원본 열기
        </a>
        <button class="btn btn-secondary btn-sm week-nav-action-btn" onclick="window.print()" title="학사일정 인쇄">
          🖨️ 인쇄
        </button>
      </div>

      <div class="week-changche-compact-tag" title="${escapeHtml(selectedFri.hasChangche ? `1학년 [${selectedFri.grade1.join(' ')}] / 2학년 [${selectedFri.grade2.join(' ')}] / 3학년 [${selectedFri.grade3.join(' ')}]` : (selectedFri.event || '금요 창체 없음'))}">
        ${selectedFri.hasChangche ? `
          <span class="changche-tag-icon">🎯</span>
          <span class="changche-tag-label">금요 창체:</span>
          <span class="changche-tag-val">1학년 [${selectedFri.grade1.map(toChangcheShortCode).join('/')}] · 2학년 [${selectedFri.grade2.map(toChangcheShortCode).join('/')}] · 3학년 [${selectedFri.grade3.map(toChangcheShortCode).join('/')}]</span>
        ` : `
          <span class="changche-tag-icon">🎯</span>
          <span class="changche-tag-label">금요 창체:</span>
          <span class="changche-tag-val changche-none">${selectedFri.event ? selectedFri.event.replace(/\n/g, ', ') : '일정 없음 (휴업/고사)'}</span>
        `}
      </div>
    </div>

    <!-- Week Grid (5 Columns: Mon ~ Fri) -->
    <div class="calendar-week-grid">
      ${weekDays.map(wd => {
        const isToday = (wd.date === todayStr);
        const dayEvt = wd.eventData;
        const isHoliday = dayEvt && dayEvt.isHoliday;
        const isExam = dayEvt && dayEvt.isExam;
        const isFri = (wd.dayOfWeek === '금');
        const isMon = (wd.dayOfWeek === '월');
        const isTue = (wd.dayOfWeek === '화');

        // Extract teacher meeting & school ceremony badges (월요일 정례회의, 방학식, 개학식, 졸업식 등)
        const { meetingBadges, ceremonyBadges, allHeaderBadges, remainingLines: eventLines } = extractTeacherMeetingBadges(dayEvt ? dayEvt.event : '', isHoliday, isExam);

        return `
          <div class="week-day-col ${isToday ? 'is-today' : ''}" data-date="${wd.date}">
            <div class="week-day-header">
              <div style="display: flex; align-items: ${allHeaderBadges.length > 1 ? 'flex-start' : 'center'}; gap: 0.35rem; min-width: 0; flex: 1;">
                <div style="display: flex; align-items: baseline; gap: 0.25rem; white-space: nowrap; flex-shrink: 0; ${allHeaderBadges.length > 1 ? 'margin-top: 0.1rem;' : ''}">
                  <span class="week-day-title">${wd.dayOfWeek}요일</span>
                  <span style="font-size:0.78rem; color:var(--text-muted);">(${wd.month}/${wd.day})</span>
                  ${getWeatherBadgeForDate(wd.date, true)}
                </div>
                ${allHeaderBadges.length > 0 ? `
                  <div class="week-meeting-badges-col">
                    ${allHeaderBadges.map(b => `
                      <span class="${b.type === 'ceremony' ? 'school-ceremony-badge' : 'monday-meeting-badge'}" title="${b.type === 'ceremony' ? '주요 학사 의식 행사' : (isMon ? '매주 월요일 1교시 교원 정례 회의' : '교원 회의 (휴일 대체/임시)')}">
                        ${escapeHtml(b.text)}
                      </span>
                    `).join('')}
                  </div>
                ` : ''}
              </div>
              ${isToday ? '<span class="chip-badge" style="background:#059669; color:#fff; font-size:0.68rem; padding: 0.1rem 0.35rem; flex-shrink:0; margin-left: 0.25rem;">오늘</span>' : ''}
            </div>

            <div class="week-day-body">
              ${isHoliday ? `
                <div class="calendar-event-pill pill-holiday" style="padding:0.45rem 0.5rem; text-align:center; font-size:0.82rem; font-weight:700;">
                  🌴 ${escapeHtml(dayEvt.event || '공휴일 / 재량휴업일')}
                </div>
              ` : `
                <!-- Daily Events -->
                <div style="flex:1;">
                  <div style="font-size:0.72rem; font-weight:700; color:var(--text-muted); margin-bottom:0.25rem;">📌 학사 일정:</div>
                  ${eventLines.length > 0 ? `
                    <div style="display:flex; flex-direction:column; gap:0.28rem;">
                      ${eventLines.map(e => {
                        const isRegularExam = (e === '1회고사' || e === '2회고사' || e.startsWith('1회고사') || e.startsWith('2회고사'));
                        const isMockOrCsat = (e.startsWith('대학수학능력시험') || e.startsWith('학평') || e.startsWith('모의평가'));
                        const pillClass = isRegularExam ? 'pill-exam' : isMockOrCsat ? 'pill-exam-mock' : 'pill-general';
                        return `
                          <div class="calendar-event-pill ${pillClass}" style="padding:0.22rem 0.45rem; font-size:0.78rem;" title="${escapeHtml(e)}">
                            ${formatEventLineWithDeptBadges(e)}
                          </div>
                        `;
                      }).join('')}
                    </div>
                  ` : `
                    <span style="font-size:0.78rem; color:var(--text-muted);">정규 수업</span>
                  `}
                </div>
              `}

              <!-- Friday Changche Highlight -->
              ${isFri && !isHoliday && selectedFri && selectedFri.hasChangche ? `
                <div class="friday-changche-highlight-card">
                  <div style="font-weight:800; font-size:0.8rem; color:#065f46; margin-bottom:0.25rem; display:flex; align-items:center; gap:0.3rem;">
                    <span>🎯</span>
                    <span>5~7교시 창체 운영</span>
                  </div>
                  <div class="changche-grade-box">
                    <div class="changche-grade-top">
                      <div style="display: flex; align-items: center; gap: 0.3rem; min-width: 0;">
                        <span class="changche-grade-num">1학년:</span>
                        <span class="changche-activity-code">${formatChangcheActivityLine(selectedFri.grade1)}</span>
                      </div>
                      <span class="changche-teacher-tag">${getChangcheTeacherLabel(selectedFri.grade1)}</span>
                    </div>
                  </div>
                  <div class="changche-grade-box">
                    <div class="changche-grade-top">
                      <div style="display: flex; align-items: center; gap: 0.3rem; min-width: 0;">
                        <span class="changche-grade-num">2학년:</span>
                        <span class="changche-activity-code">${formatChangcheActivityLine(selectedFri.grade2)}</span>
                      </div>
                      <span class="changche-teacher-tag">${getChangcheTeacherLabel(selectedFri.grade2)}</span>
                    </div>
                  </div>
                  <div class="changche-grade-box">
                    <div class="changche-grade-top">
                      <div style="display: flex; align-items: center; gap: 0.3rem; min-width: 0;">
                        <span class="changche-grade-num">3학년:</span>
                        <span class="changche-activity-code">${formatChangcheActivityLine(selectedFri.grade3)}</span>
                      </div>
                      <span class="changche-teacher-tag">${getChangcheTeacherLabel(selectedFri.grade3)}</span>
                    </div>
                  </div>
                </div>
              ` : ''}
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;

  return html;
}

function toChangcheShortCode(code) {
  if (!code) return '';
  if (code === '여유' || code === '여') return '여';
  if (code === '동아리' || code === '동') return '동';
  if (code === '진로' || code === '진') return '진';
  if (code === '자율' || code === '자') return '자';
  if (code === '봉사' || code === '봉') return '봉';
  return code;
}

function formatChangcheActivityLine(arr) {
  if (!arr || !Array.isArray(arr) || arr.length === 0) return '-';
  return arr.map(toChangcheShortCode).join(' · ');
}

function getChangcheTeacherLabel(val) {
  if (Array.isArray(val)) {
    const roles = Array.from(new Set(val.map(c => {
      if (c === '동' || c === '동아리') return '동아리 담당교사';
      if (c === '진' || c === '진로') return '학급 담임교사';
      if (c === '여유' || c === '여' || c === '자' || c === '자율') return '학급 부담임교사';
      if (c === '봉' || c === '봉사') return '학급 담임교사';
      return c;
    })));
    if (roles.length === 1) return roles[0];
    if (roles.length > 1) return '교시별 담당교사';
    return '-';
  }
  const code = val;
  if (code === '동' || code === '동아리') return '동아리 담당교사';
  if (code === '진' || code === '진로') return '학급 담임교사';
  if (code === '여유' || code === '여' || code === '자' || code === '자율') return '학급 부담임교사';
  if (code === '봉' || code === '봉사') return '학급 담임교사';
  return code || '-';
}

function setCalendarViewMode(mode) {
  AppState.calendarViewMode = mode;
  renderApp();
}

function selectCalendarMonth(y, m) {
  AppState.calendarYear = y;
  AppState.calendarMonth = m;
  AppState.calendarViewMode = 'month';
  renderApp();
}

function stepCalendarMonth(step) {
  let y = AppState.calendarYear || 2026;
  let m = (AppState.calendarMonth || 9) + step;
  if (m < 1) {
    m = 12;
    y--;
  } else if (m > 12) {
    m = 1;
    y++;
  }
  // Clamp between 2026.3 and 2027.2
  if (y < 2026 || (y === 2026 && m < 3)) {
    y = 2026; m = 3;
  } else if (y > 2027 || (y === 2027 && m > 2)) {
    y = 2027; m = 2;
  }
  AppState.calendarYear = y;
  AppState.calendarMonth = m;
  renderApp();
}

function selectCalendarWeek(dateStr) {
  AppState.calendarWeekDate = dateStr;
  AppState.calendarViewMode = 'week';
  renderApp();
}

function stepCalendarWeek(step) {
  const cal = getAcademicCalendar();
  const list = getAllCalendarWeeks(cal);
  if (!list || list.length === 0) return;
  const curDate = AppState.calendarWeekDate || '2026-09-04';
  const curIdx = list.findIndex(f => f.date === curDate);
  let newIdx = (curIdx === -1 ? 0 : curIdx) + step;
  if (newIdx < 0) newIdx = 0;
  if (newIdx >= list.length) newIdx = list.length - 1;
  AppState.calendarWeekDate = list[newIdx].date;
  renderApp();
}

/**
 * 월별 캘린더 날짜 클릭 또는 D-Day 칩 클릭 시 해당 주차의 주별 캘린더로 이동하고 해당 일자를 펄스 강조
 */
function onSelectCalendarMonthDay(dateStr) {
  const friDate = findFridayDateForDay(dateStr);
  AppState.currentTab = 'calendar';
  AppState.calendarWeekDate = friDate;
  AppState.calendarViewMode = 'week';

  document.querySelectorAll('.nav-tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === 'calendar');
  });
  document.querySelectorAll('.mobile-nav-item').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === 'calendar');
  });

  renderApp();

  const parts = dateStr.split('-');
  const m = parseInt(parts[1], 10);
  const d = parseInt(parts[2], 10);
  showToast(`📅 ${m}월 ${d}일 주별 캘린더로 이동했습니다.`);

  setTimeout(() => {
    const col = document.querySelector(`.week-day-col[data-date="${dateStr}"]`);
    if (col) {
      col.classList.add('search-highlight-pulse');
      col.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      setTimeout(() => {
        col.classList.remove('search-highlight-pulse');
      }, 2500);
    }
  }, 120);
}

function openCalendarDayDetailModal(dateStr) {
  const cal = getAcademicCalendar();
  if (!cal) return;
  const dayEvt = cal.calendarDays.find(d => d.date === dateStr);
  const friChangche = cal.fridaySchedule.find(f => f.date === dateStr);

  const parts = dateStr.split('-');
  const y = parseInt(parts[0], 10);
  const m = parseInt(parts[1], 10);
  const d = parseInt(parts[2], 10);
  const dateObj = new Date(y, m - 1, d);
  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
  const dowName = dayNames[dateObj.getDay()];
  const isMon = (dateObj.getDay() === 1);
  const isTue = (dateObj.getDay() === 2);

  // Extract teacher meeting & school ceremony badges (월요일 정례회의, 방학식, 개학식, 졸업식 등)
  const { meetingBadges, ceremonyBadges, allHeaderBadges, remainingLines: modalEventLines } = extractTeacherMeetingBadges(dayEvt ? dayEvt.event : '', dayEvt ? dayEvt.isHoliday : false, dayEvt ? dayEvt.isExam : false);

  let modalElem = document.getElementById('calendarDayDetailModal');
  if (!modalElem) {
    modalElem = document.createElement('div');
    modalElem.id = 'calendarDayDetailModal';
    document.body.appendChild(modalElem);
  }

  modalElem.innerHTML = `
    <div class="calendar-modal-backdrop" onclick="closeCalendarDayDetailModal(event)">
      <div class="calendar-modal-card" onclick="event.stopPropagation()">
        <div style="padding: 1.25rem 1.5rem; border-bottom: 1px solid var(--border-color); display: flex; align-items: center; justify-content: space-between;">
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <span style="font-size: 1.5rem;">📅</span>
            <div>
              <h3 style="font-size: 1.15rem; font-weight: 800; margin: 0; color: var(--text-primary); display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
                <span>${y}년 ${m}월 ${d}일 (${dowName}요일)</span>
                ${allHeaderBadges.map(b => `
                  <span class="${b.type === 'ceremony' ? 'school-ceremony-badge' : 'monday-meeting-badge'}" title="${b.type === 'ceremony' ? '주요 학사 의식 행사' : (isMon ? '매주 월요일 1교시 교원 정례 회의' : '교원 회의 (휴일 대체/임시)')}">
                    ${escapeHtml(b.text)}
                  </span>
                `).join('')}
              </h3>
              <span style="font-size: 0.8rem; color: var(--text-muted);">2026학년도 공식 학사일정 상세</span>
            </div>
          </div>
          <button type="button" class="btn btn-secondary btn-sm" onclick="closeCalendarDayDetailModal()" style="border-radius: 50%; width: 32px; height: 32px; padding: 0; display: flex; align-items: center; justify-content: center;">✕</button>
        </div>

        <div style="padding: 1.5rem; max-height: 70vh; overflow-y: auto;">
          ${dayEvt && dayEvt.isHoliday ? `
            <div class="calendar-event-pill pill-holiday" style="margin-bottom: 1rem; font-size: 0.95rem; font-weight: 700; padding: 0.6rem 0.8rem; text-align: center;">
              🌴 ${escapeHtml(dayEvt.event || '공식 공휴일 / 재량휴업일')}
            </div>
          ` : ''}

          ${meetingBadges.map(b => `
            <div style="display: flex; align-items: center; justify-content: space-between; background: #eff6ff; border: 1px solid #bfdbfe; padding: 0.7rem 1rem; border-radius: var(--radius-md); margin-bottom: 0.75rem;">
              <div style="display: flex; align-items: center; gap: 0.5rem;">
                <span style="font-size: 1.2rem;">🏢</span>
                <div>
                  <div style="font-size: 0.75rem; font-weight: 800; color: #2563eb;">${isMon ? '매주 월요일 1교시 교원 정례 회의' : '교원 회의 (휴일 대체/임시)'}</div>
                  <div style="font-size: 0.98rem; font-weight: 700; color: #1e40af;">${escapeHtml(b)}</div>
                </div>
              </div>
            </div>
          `).join('')}

          ${ceremonyBadges.map(b => `
            <div class="modal-ceremony-card">
              <div style="display: flex; align-items: center; gap: 0.5rem;">
                <span style="font-size: 1.2rem;">🎓</span>
                <div>
                  <div class="ceremony-title" style="font-size: 0.75rem; font-weight: 800; color: #b45309;">주요 학사 의식 행사</div>
                  <div class="ceremony-name" style="font-size: 0.98rem; font-weight: 700; color: #92400e;">${escapeHtml(b)}</div>
                </div>
              </div>
            </div>
          `).join('')}

          ${dayEvt && dayEvt.isHoliday ? '' : `
            <div style="margin-bottom: 1.25rem;">
              <div style="font-size: 0.8rem; font-weight: 700; color: var(--text-muted); margin-bottom: 0.35rem;">주요 학사 행사:</div>
              ${modalEventLines.length > 0 ? `
                <div style="font-size: 0.95rem; color: var(--text-primary); line-height: 1.6; background: var(--bg-hover); padding: 0.85rem; border-radius: var(--radius-md); display: flex; flex-direction: column; gap: 0.5rem;">
                  ${modalEventLines.map(line => {
                    const isRegularExam = (line === '1회고사' || line === '2회고사' || line.startsWith('1회고사') || line.startsWith('2회고사'));
                    const isMockOrCsat = (line.startsWith('대학수학능력시험') || line.startsWith('학평') || line.startsWith('모의평가'));
                    const bulletColor = isRegularExam ? '#7c3aed' : isMockOrCsat ? '#0284c7' : 'var(--primary)';
                    const textColor = isRegularExam ? '#6d28d9' : isMockOrCsat ? '#0369a1' : 'inherit';
                    return `
                      <div style="display: flex; align-items: baseline; gap: 0.4rem;">
                        <span style="color: ${bulletColor}; font-weight: bold;">•</span>
                        <span ${isRegularExam || isMockOrCsat ? `style="font-weight:700; color:${textColor};"` : ''}>${formatEventLineWithDeptBadges(line)}</span>
                      </div>
                    `;
                  }).join('')}
                </div>
              ` : `
                <div style="color: var(--text-muted); font-size: 0.88rem; font-style: italic;">별도의 특별 학사 일정이 없는 정규 일과일입니다.</div>
              `}
            </div>
          `}

          ${!dayEvt?.isHoliday && friChangche ? `
            <div class="friday-changche-highlight-card" style="margin-top: 1rem;">
              <div style="font-weight: 800; font-size: 0.9rem; color: #065f46; margin-bottom: 0.6rem; display: flex; align-items: center; gap: 0.35rem;">
                <span>🎯</span>
                <span>금요일 5~7교시 창체 운영계획</span>
              </div>
              <div class="changche-grade-box">
                <div class="changche-grade-top">
                  <div style="display: flex; align-items: center; gap: 0.35rem; min-width: 0;">
                    <span class="changche-grade-num">1학년 :</span>
                    <span class="changche-activity-code">${formatChangcheActivityLine(friChangche.grade1)}</span>
                  </div>
                  <span class="changche-teacher-tag">${getChangcheTeacherLabel(friChangche.grade1)}</span>
                </div>
              </div>
              <div class="changche-grade-box">
                <div class="changche-grade-top">
                  <div style="display: flex; align-items: center; gap: 0.35rem; min-width: 0;">
                    <span class="changche-grade-num">2학년 :</span>
                    <span class="changche-activity-code">${formatChangcheActivityLine(friChangche.grade2)}</span>
                  </div>
                  <span class="changche-teacher-tag">${getChangcheTeacherLabel(friChangche.grade2)}</span>
                </div>
              </div>
              <div class="changche-grade-box">
                <div class="changche-grade-top">
                  <div style="display: flex; align-items: center; gap: 0.35rem; min-width: 0;">
                    <span class="changche-grade-num">3학년 :</span>
                    <span class="changche-activity-code">${formatChangcheActivityLine(friChangche.grade3)}</span>
                  </div>
                  <span class="changche-teacher-tag">${getChangcheTeacherLabel(friChangche.grade3)}</span>
                </div>
              </div>
              <div style="font-size: 0.76rem; color: var(--text-muted); margin-top: 0.6rem; line-height: 1.5; border-top: 1px dashed rgba(16,185,129,0.25); padding-top: 0.5rem;">
                * 여(여유): 학급 부담임교사 교실 입실 지도<br>
                * 진(진로): 학급 담임교사 교실 입실 지도<br>
                * 동(동아리): 동아리 담당교사 지도
              </div>
            </div>
          ` : ''}
        </div>

        <div style="padding: 0.85rem 1.5rem; border-top: 1px solid var(--border-color); background: var(--bg-hover); display: flex; justify-content: flex-end;">
          <button type="button" class="btn btn-secondary btn-sm" onclick="closeCalendarDayDetailModal()">닫기</button>
        </div>
      </div>
    </div>
  `;
}

function closeCalendarDayDetailModal(e) {
  if (e && e.target && !e.target.classList.contains('calendar-modal-backdrop') && !e.target.classList.contains('btn')) {
    return;
  }
  const modalElem = document.getElementById('calendarDayDetailModal');
  if (modalElem) {
    modalElem.remove();
  }
}

/* ==========================================================================
   NEIS School Meal Service Integration (부산동고등학교 급식 식단 실시간 연동)
   ========================================================================== */
const NEIS_CONFIG = {
  ATPT_OFCDC_SC_CODE: 'C10',                            // 부산광역시교육청
  SD_SCHUL_CODE: '7150138',                              // 부산동고등학교
  SCHUL_NM: '부산동고등학교',
  API_KEY: 'ff357fd0b9b646788ef7fe2c12088a9c',           // 부산동고등학교 NEIS Open API 인증키
  API_BASE_URL: 'https://open.neis.go.kr/hub/mealServiceDietInfo'
};

/**
 * Calculates today's target date for meal service (auto-adjusts weekend to Friday/Monday)
 */
function getTodayMealTargetDate(baseDate = new Date()) {
  const dow = baseDate.getDay(); // 0: Sun, 1: Mon, 2: Tue, 3: Wed, 4: Thu, 5: Fri, 6: Sat
  const hour = baseDate.getHours();
  let daysToAdd = 0;
  let isNextDay = false;
  let isNextWeek = false;

  if (dow === 5) {
    // 금요일: 19시 이후에는 다음 월요일(+3일), 19시 이전에는 당일 금요일(+0일)
    if (hour >= 19) {
      daysToAdd = 3;
      isNextWeek = true;
      isNextDay = true;
    } else {
      daysToAdd = 0;
    }
  } else if (dow === 6) {
    // 토요일: 주말 동안에는 다음 월요일(+2일)
    daysToAdd = 2;
    isNextWeek = true;
    isNextDay = true;
  } else if (dow === 0) {
    // 일요일: 주말 동안에는 다음 월요일(+1일)
    daysToAdd = 1;
    isNextWeek = true;
    isNextDay = true;
  } else {
    // 월요일 ~ 목요일: 19시 이후에는 다음날(+1일), 19시 이전에는 당일(+0일)
    if (hour >= 19) {
      daysToAdd = 1;
      isNextDay = true;
    } else {
      daysToAdd = 0;
    }
  }

  const target = new Date(baseDate);
  target.setDate(baseDate.getDate() + daysToAdd);

  const y = target.getFullYear();
  const m = String(target.getMonth() + 1).padStart(2, '0');
  const d = String(target.getDate()).padStart(2, '0');
  const dowNames = ['일', '월', '화', '수', '목', '금', '토'];
  const dowName = dowNames[target.getDay()];
  const dateLabel = `${target.getMonth() + 1}/${target.getDate()}(${dowName})`;

  return {
    ymd: `${y}${m}${d}`,
    dateStr: `${y}-${m}-${d}`,
    isWeekend: false,
    isNextDay,
    isNextWeek,
    daysToAdd,
    dow: target.getDay(),
    dowName,
    dateLabel,
    targetDate: target
  };
}

/**
 * Returns cached meal summary string for instant zero-delay rendering in toolbar
 */
function getCachedTodayMealSummary() {
  const target = getTodayMealTargetDate();
  const cached = AppState.mealCache && AppState.mealCache[target.ymd];
  if (cached) {
    const lunchText = cached.lunch && cached.lunch.dishes.length > 0
      ? cached.lunch.dishes.map(x => x.name).join(', ')
      : (target.isWeekend ? '주말 급식 없음' : '급식 없음');
    const lunchCal = cached.lunch && cached.lunch.cal ? cached.lunch.cal.replace(/\s*Kcal/i, '') + ' kcal' : '';
    const dinnerText = cached.dinner && cached.dinner.dishes.length > 0
      ? cached.dinner.dishes.map(x => x.name).join(', ')
      : (target.isWeekend ? '주말 급식 없음' : '급식 없음');
    const dinnerCal = cached.dinner && cached.dinner.cal ? cached.dinner.cal.replace(/\s*Kcal/i, '') + ' kcal' : '';
    return { lunchText, lunchCal, dinnerText, dinnerCal, dateLabel: target.dateLabel, target };
  }
  return {
    lunchText: '식단 불러오는 중...',
    lunchCal: '',
    dinnerText: '식단 불러오는 중...',
    dinnerCal: '',
    dateLabel: target.dateLabel,
    target
  };
}

/**
 * Parses raw DDISH_NM into clean array of dishes with allergy numbers
 */
function parseMealDishes(rawText) {
  if (!rawText) return [];
  return rawText.split('<br/>').map(item => {
    const trimmed = item.trim();
    if (!trimmed) return null;
    const match = trimmed.match(/^(.+?)(?:\s*\(([\d\.\s]+)\))?$/);
    const name = match ? match[1].trim() : trimmed;
    const allergies = match && match[2] ? match[2].trim() : '';
    return { name, allergies, raw: trimmed };
  }).filter(Boolean);
}

/**
 * Fetch meal data for YYYY-MM-DD or YYYYMMDD from NEIS API using authenticated API key
 */
async function fetchNeisMeal(dateStr) {
  if (!AppState.mealCache) AppState.mealCache = {};
  const ymd = String(dateStr).replace(/[^0-9]/g, '');
  if (AppState.mealCache[ymd]) {
    return AppState.mealCache[ymd];
  }

  const url = `${NEIS_CONFIG.API_BASE_URL}?Type=json&pIndex=1&pSize=10&KEY=${NEIS_CONFIG.API_KEY}&ATPT_OFCDC_SC_CODE=${NEIS_CONFIG.ATPT_OFCDC_SC_CODE}&SD_SCHUL_CODE=${NEIS_CONFIG.SD_SCHUL_CODE}&MLSV_YMD=${ymd}`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    let lunch = null;
    let dinner = null;

    if (data.mealServiceDietInfo && data.mealServiceDietInfo[1] && data.mealServiceDietInfo[1].row) {
      const rows = data.mealServiceDietInfo[1].row;
      const lunchRow = rows.find(r => r.MMEAL_SC_CODE === '2');
      const dinnerRow = rows.find(r => r.MMEAL_SC_CODE === '3');

      if (lunchRow) {
        lunch = {
          code: '2',
          name: '중식 (점심)',
          cal: lunchRow.CAL_INFO || '',
          dishes: parseMealDishes(lunchRow.DDISH_NM),
          origin: lunchRow.ORPLC_INFO ? lunchRow.ORPLC_INFO.replace(/<br\/>/g, '\n') : '',
          raw: lunchRow
        };
      }

      if (dinnerRow) {
        dinner = {
          code: '3',
          name: '석식 (저녁)',
          cal: dinnerRow.CAL_INFO || '',
          dishes: parseMealDishes(dinnerRow.DDISH_NM),
          origin: dinnerRow.ORPLC_INFO ? dinnerRow.ORPLC_INFO.replace(/<br\/>/g, '\n') : '',
          raw: dinnerRow
        };
      }
    }

    const result = { ymd, lunch, dinner, hasMeal: !!(lunch || dinner) };
    AppState.mealCache[ymd] = result;
    return result;
  } catch (err) {
    console.warn('NEIS Meal fetch error for', ymd, err);
    return { ymd, lunch: null, dinner: null, hasMeal: false, error: err };
  }
}

/**
 * Loads today's meal info and updates the header meal boxes in real-time
 */
async function loadTodayMealInfo(force = false) {
  const lunchMenuEl = document.getElementById('mealLunchMenu');
  const dinnerMenuEl = document.getElementById('mealDinnerMenu');
  const lunchCalEl = document.getElementById('mealLunchCal');
  const dinnerCalEl = document.getElementById('mealDinnerCal');
  const lunchDateEl = document.getElementById('mealLunchDate');
  const dinnerDateEl = document.getElementById('mealDinnerDate');

  const target = getTodayMealTargetDate();
  AppState.lastMealTargetYmd = target.ymd;
  if (lunchDateEl) lunchDateEl.textContent = target.dateLabel;
  if (dinnerDateEl) dinnerDateEl.textContent = target.dateLabel;

  const mealData = await fetchNeisMeal(target.ymd);

  if (!lunchMenuEl || !dinnerMenuEl) return;

  // Update lunch (전체 메뉴 안 잘리고 다 표시)
  if (mealData.lunch && mealData.lunch.dishes.length > 0) {
    const fullDishes = mealData.lunch.dishes.map(x => x.name).join(', ');
    lunchMenuEl.textContent = fullDishes;
    lunchMenuEl.title = `점심: ${fullDishes} (${mealData.lunch.cal || ''})`;
    if (lunchCalEl) lunchCalEl.textContent = mealData.lunch.cal ? mealData.lunch.cal.replace(/\s*Kcal/i, '') + ' kcal' : '';
  } else {
    lunchMenuEl.textContent = target.isWeekend ? '주말 급식 없음' : '급식 없음';
    lunchMenuEl.title = target.isWeekend ? '주말에는 급식이 운영되지 않습니다.' : '오늘 점심 급식 일정이 없습니다.';
    if (lunchCalEl) lunchCalEl.textContent = '';
  }

  // Update dinner (전체 메뉴 안 잘리고 다 표시)
  if (mealData.dinner && mealData.dinner.dishes.length > 0) {
    const fullDishes = mealData.dinner.dishes.map(x => x.name).join(', ');
    dinnerMenuEl.textContent = fullDishes;
    dinnerMenuEl.title = `저녁: ${fullDishes} (${mealData.dinner.cal || ''})`;
    if (dinnerCalEl) dinnerCalEl.textContent = mealData.dinner.cal ? mealData.dinner.cal.replace(/\s*Kcal/i, '') + ' kcal' : '';
  } else {
    dinnerMenuEl.textContent = target.isWeekend ? '주말 급식 없음' : '급식 없음';
    dinnerMenuEl.title = target.isWeekend ? '주말에는 급식이 운영되지 않습니다.' : '오늘 저녁 급식 일정이 없습니다.';
    if (dinnerCalEl) dinnerCalEl.textContent = '';
  }
}

/**
 * Open Meal Detail Modal with Date Navigation
 */
async function openMealDetailModal(initialType = 'lunch', specificDateStr = null) {
  let targetDate = specificDateStr 
    ? new Date(specificDateStr + 'T00:00:00') 
    : (typeof getTodayMealTargetDate === 'function' ? getTodayMealTargetDate().targetDate : new Date());

  const y = targetDate.getFullYear();
  const m = targetDate.getMonth() + 1;
  const d = targetDate.getDate();
  const dateStr = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  AppState.mealModalActiveDate = dateStr;

  let modalElem = document.getElementById('calendarMealDetailModal');
  if (!modalElem) {
    modalElem = document.createElement('div');
    modalElem.id = 'calendarMealDetailModal';
    document.body.appendChild(modalElem);
  }

  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
  const dowName = dayNames[targetDate.getDay()];

  modalElem.innerHTML = `
    <div class="calendar-modal-backdrop" onclick="closeMealDetailModal(event)">
      <div class="calendar-modal-card meal-modal-card" onclick="event.stopPropagation()">
        <!-- Header -->
        <div style="padding: 0.85rem 1.15rem; border-bottom: 1px solid var(--border-color); display: flex; align-items: center; justify-content: space-between; background: var(--bg-surface);">
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <span style="font-size: 1.35rem;">🍱</span>
            <div>
              <h3 style="font-size: 1.05rem; font-weight: 800; margin: 0; color: var(--text-primary);">
                부산동고등학교 급식 식단
              </h3>
              <p style="font-size: 0.72rem; color: #10b981; font-weight: 700; margin: 0.1rem 0 0;">
                교육부 NEIS 개방포털 실시간 연동 (인증 완료)
              </p>
            </div>
          </div>
          <button type="button" class="btn btn-secondary btn-sm" onclick="closeMealDetailModal()" style="padding: 0.2rem 0.55rem; font-size: 0.8rem;">✕</button>
        </div>

        <!-- Date Navigation Bar -->
        <div class="meal-modal-date-bar">
          <button type="button" class="btn btn-secondary btn-sm" onclick="stepMealDetailDate(-1)">◀ 이전 날</button>
          <div class="meal-modal-cur-date">
            📅 <strong>${y}년 ${m}월 ${d}일 (${dowName}요일)</strong>
          </div>
          <button type="button" class="btn btn-secondary btn-sm" onclick="stepMealDetailDate(1)">다음 날 ▶</button>
          <button type="button" class="btn btn-primary btn-sm" onclick="stepMealDetailDate(0)">오늘</button>
        </div>

        <!-- Meal Content Area -->
        <div class="meal-modal-body" id="mealModalBody">
          <div style="text-align:center; padding: 2rem; color: var(--text-muted);">
            ⏳ NEIS에서 ${m}월 ${d}일 급식 식단을 가져오는 중입니다...
          </div>
        </div>

        <!-- Clean Footer (No Key Prompt) -->
        <div class="meal-modal-footer" style="display: flex; justify-content: flex-end;">
          <button type="button" class="btn btn-secondary btn-sm" onclick="closeMealDetailModal()">닫기</button>
        </div>
      </div>
    </div>
  `;

  // Fetch and update body
  const mealData = await fetchNeisMeal(dateStr);
  const bodyEl = document.getElementById('mealModalBody');
  if (!bodyEl) return;

  if (!mealData.lunch && !mealData.dinner) {
    bodyEl.innerHTML = `
      <div class="meal-empty-state">
        <div style="font-size: 2.2rem; margin-bottom: 0.5rem;">🏖️</div>
        <h4 style="margin: 0 0 0.35rem; color: var(--text-primary); font-size: 1rem;">급식 일정이 없습니다</h4>
        <p style="margin: 0; color: var(--text-muted); font-size: 0.82rem;">
          ${m}월 ${d}일(${dowName})은 주말, 공휴일, 방학 또는 급식 미실시 일자입니다.
        </p>
      </div>
    `;
    return;
  }

  let bodyHtml = `<div class="meal-cards-row">`;

  // Lunch Card
  bodyHtml += `
    <div class="meal-detail-card lunch">
      <div class="meal-detail-header">
        <div style="display:flex; align-items:center; justify-content:space-between; width:100%;">
          <span class="meal-card-pill lunch">🍱 점심 (중식)</span>
          ${mealData.lunch && mealData.lunch.cal ? `<span class="meal-card-cal">${mealData.lunch.cal}</span>` : ''}
        </div>
      </div>
      <div class="meal-detail-content">
        ${mealData.lunch && mealData.lunch.dishes.length > 0 ? `
          <ul class="meal-dish-list">
            ${mealData.lunch.dishes.map(d => `
              <li class="meal-dish-item">
                <span class="dish-name">${escapeHtml(d.name)}</span>
                ${d.allergies ? `<span class="dish-allergy" title="알레르기 번호: ${d.allergies}">(${d.allergies})</span>` : ''}
              </li>
            `).join('')}
          </ul>
        ` : `<p class="meal-none-text">점심 급식 정보가 없습니다.</p>`}
      </div>
    </div>
  `;

  // Dinner Card
  bodyHtml += `
    <div class="meal-detail-card dinner">
      <div class="meal-detail-header">
        <div style="display:flex; align-items:center; justify-content:space-between; width:100%;">
          <span class="meal-card-pill dinner">🌙 저녁 (석식)</span>
          ${mealData.dinner && mealData.dinner.cal ? `<span class="meal-card-cal">${mealData.dinner.cal}</span>` : ''}
        </div>
      </div>
      <div class="meal-detail-content">
        ${mealData.dinner && mealData.dinner.dishes.length > 0 ? `
          <ul class="meal-dish-list">
            ${mealData.dinner.dishes.map(d => `
              <li class="meal-dish-item">
                <span class="dish-name">${escapeHtml(d.name)}</span>
                ${d.allergies ? `<span class="dish-allergy" title="알레르기 번호: ${d.allergies}">(${d.allergies})</span>` : ''}
              </li>
            `).join('')}
          </ul>
        ` : `<p class="meal-none-text">저녁 급식 정보가 없습니다.</p>`}
      </div>
    </div>
  `;

  bodyHtml += `</div>`;

  // Allergy reference note
  bodyHtml += `
    <div class="meal-allergy-legend">
      <strong>* 알레르기 유발물질:</strong> 
      ①난류 ②우유 ③메밀 ④땅콩 ⑤대두 ⑥밀 ⑦고등어 ⑧게 ⑨새우 ⑩돼지고기 ⑪복숭아 ⑫토마토 ⑬아황산염 ⑭호두 ⑮닭고기 ⑯쇠고기 ⑰오징어 ⑱조개류 ⑲잣
    </div>
  `;

  bodyEl.innerHTML = bodyHtml;
}

function closeMealDetailModal(e) {
  if (e && e.target && !e.target.classList.contains('calendar-modal-backdrop') && !e.target.classList.contains('btn')) {
    return;
  }
  const modalElem = document.getElementById('calendarMealDetailModal');
  if (modalElem) modalElem.remove();
}

function stepMealDetailDate(step) {
  let cur = AppState.mealModalActiveDate ? new Date(AppState.mealModalActiveDate + 'T00:00:00') : new Date();
  if (step === 0) {
    cur = typeof getTodayMealTargetDate === 'function' ? getTodayMealTargetDate().targetDate : new Date();
  } else {
    cur.setDate(cur.getDate() + step);
  }
  const y = cur.getFullYear();
  const m = String(cur.getMonth() + 1).padStart(2, '0');
  const d = String(cur.getDate()).padStart(2, '0');
  const newDateStr = `${y}-${m}-${d}`;
  openMealDetailModal('lunch', newDateStr);
}

/* ==========================================================================
   Helper Functions
   ========================================================================== */
function getTodayDayName() {
  const d = new Date().getDay();
  if (d >= 1 && d <= 5) return DAYS[d - 1];
  return '월';
}

function toggleFavorite(id) {
  if (AppState.favorites.includes(id)) {
    AppState.favorites = AppState.favorites.filter(f => f !== id);
  } else {
    AppState.favorites.push(id);
  }
  localStorage.setItem('timetable_favorites', JSON.stringify(AppState.favorites));
  renderApp();
}

function exportCurrentTimetableToCsv(entityName) {
  if (!AppState.data) return;
  const isTeacher = AppState.currentTab === 'teacher';
  const entity = isTeacher 
    ? AppState.data.teachers.find(t => t.id === AppState.selectedTeacherId)
    : AppState.data.classes.find(c => c.id === AppState.selectedClassId);

  if (!entity) return;

  let csv = '\uFEFF교시,월,화,수,목,금\n';
  for (let p of PERIODS) {
    const row = [p + '교시'];
    for (let d of DAYS) {
      const cell = entity.schedule[d] ? entity.schedule[d][p.toString()] : null;
      if (cell && !cell.isFree) {
        row.push(`"${cell.subject}${cell.target ? ' ' + cell.target : ''}"`);
      } else {
        row.push('""');
      }
    }
    csv += row.join(',') + '\n';
  }

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${entity.name}_시간표.csv`;
  link.click();
}

/* ==========================================================================
   KMA Jeonpo-dong Weather Service (기상청 부산광역시 부산진구 전포동 단기예보)
   ========================================================================== */
const KMA_SERVICE_KEY = 'oHMyoRaJRwSlkrbmMHISJTQYZ7nifgvtEvYAO%2BH5d3GPR9rqItfIhqDDz0kbulVeezxAhscExc%2Fcxof0Eos84A%3D%3D';
const KMA_NX = 98; // 부산광역시 부산진구 전포동 (부산동고등학교) 격자 X
const KMA_NY = 75; // 부산광역시 부산진구 전포동 (부산동고등학교) 격자 Y
const KMA_CACHE_KEY = 'bdhs_kma_jeonpo_weather_cache_v2';
const KMA_CACHE_TTL_MS = 60 * 60 * 1000; // 1시간 캐시

/**
 * Calculates latest available base_date and base_time for KMA VilageFcst
 * KMA 단기예보 발표 시각: 02:10, 05:10, 08:10, 11:10, 14:10, 17:10, 20:10, 23:10
 */
function getKmaBaseDateTime(now = new Date()) {
  const kst = new Date(now.getTime() + (now.getTimezoneOffset() * 60000) + (9 * 3600000));
  const hour = kst.getHours();
  const min = kst.getMinutes();
  const timeVal = hour * 100 + min;

  const baseTimes = [
    { t: 2315, time: '2300' },
    { t: 2015, time: '2000' },
    { t: 1715, time: '1700' },
    { t: 1415, time: '1400' },
    { t: 1115, time: '1100' },
    { t: 815,  time: '0800' },
    { t: 515,  time: '0500' },
    { t: 215,  time: '0200' }
  ];

  let matched = baseTimes.find(b => timeVal >= b.t);
  let targetDate = kst;
  let baseTime = '2000';

  if (!matched) {
    targetDate = new Date(kst.getTime() - 86400000);
    baseTime = '2300';
  } else {
    baseTime = matched.time;
  }

  const yyyy = targetDate.getFullYear();
  const mm = String(targetDate.getMonth() + 1).padStart(2, '0');
  const dd = String(targetDate.getDate()).padStart(2, '0');

  return {
    baseDate: `${yyyy}${mm}${dd}`,
    baseTime: baseTime
  };
}

/**
 * Parses KMA forecast item list and computes daily summaries, focusing on rain analysis
 */
function parseKmaWeatherItems(items) {
  if (!Array.isArray(items) || items.length === 0) return {};

  const byDate = {};
  for (const it of items) {
    const fDate = it.fcstDate; // YYYYMMDD
    const fTime = it.fcstTime; // HHMM
    if (!byDate[fDate]) byDate[fDate] = {};
    if (!byDate[fDate][fTime]) byDate[fDate][fTime] = {};
    byDate[fDate][fTime][it.category] = it.fcstValue;
  }

  const resultByDate = {};

  for (const ymd of Object.keys(byDate)) {
    const times = Object.keys(byDate[ymd]).sort();
    const dateFormatted = `${ymd.slice(0, 4)}-${ymd.slice(4, 6)}-${ymd.slice(6, 8)}`;

    let minTmp = Infinity;
    let maxTmp = -Infinity;
    let maxPop = 0;
    const rainHours = [];
    const hourlyList = [];

    // Dominant daytime sky (12:00 ~ 15:00 if available, else first time)
    let daytimeSky = '1';
    let daytimePty = '0';

    for (const t of times) {
      const entry = byDate[ymd][t];
      const hourNum = parseInt(t.slice(0, 2), 10);
      const tmp = entry.TMP !== undefined ? parseFloat(entry.TMP) : null;
      const pop = entry.POP !== undefined ? parseInt(entry.POP, 10) : 0;
      const pty = entry.PTY || '0';
      const sky = entry.SKY || '1';
      const pcp = entry.PCP || '강수없음';

      if (tmp !== null && !isNaN(tmp)) {
        if (tmp < minTmp) minTmp = tmp;
        if (tmp > maxTmp) maxTmp = tmp;
      }
      if (entry.TMN !== undefined) minTmp = parseFloat(entry.TMN);
      if (entry.TMX !== undefined) maxTmp = parseFloat(entry.TMX);

      if (pop > maxPop) maxPop = pop;

      // Prefer 12:00 ~ 15:00 for general daytime icon
      if (hourNum >= 12 && hourNum <= 15) {
        daytimeSky = sky;
        daytimePty = pty;
      } else if (daytimeSky === '1' && (sky === '3' || sky === '4')) {
        daytimeSky = sky;
      }

      // Check rain conditions
      const isRain = (pty === '1' || pty === '2' || pty === '4') ||
                     (pcp && pcp !== '강수없음' && pcp !== '0' && pcp !== '0.0' && pcp !== '0mm');

      if (isRain) {
        rainHours.push({
          hour: hourNum,
          timeStr: `${hourNum}시`,
          pty,
          pcp,
          pop,
          tmp
        });
      }

      hourlyList.push({
        time: t,
        hour: hourNum,
        tmp,
        pop,
        sky,
        pty,
        pcp
      });
    }

    // Format rain time ranges & precipitation amounts
    const hasRain = rainHours.length > 0;
    let rainSummary = '';
    let rainPcpSummary = '';

    if (hasRain) {
      // Group contiguous hours
      const ranges = [];
      let startH = rainHours[0].hour;
      let prevH = startH;

      for (let i = 1; i < rainHours.length; i++) {
        const curH = rainHours[i].hour;
        if (curH === prevH + 1) {
          prevH = curH;
        } else {
          ranges.push(startH === prevH ? `${startH}시` : `${startH}~${prevH}시`);
          startH = curH;
          prevH = curH;
        }
      }
      ranges.push(startH === prevH ? `${startH}시` : `${startH}~${prevH}시`);

      const timeRangeText = ranges.join(', ');

      // Summarize precipitation amounts
      const pcpSet = new Set(rainHours.map(r => r.pcp).filter(p => p && p !== '강수없음' && p !== '0'));
      let pcpText = '';
      if (pcpSet.size === 1) {
        pcpText = Array.from(pcpSet)[0];
      } else if (pcpSet.size > 1) {
        let sum = 0;
        let hasUnder1 = false;
        let purelyNumeric = true;
        for (const p of pcpSet) {
          if (p.includes('미만')) {
            hasUnder1 = true;
          } else {
            const m = parseFloat(p);
            if (!isNaN(m)) {
              sum += m;
            } else {
              purelyNumeric = false;
            }
          }
        }
        if (purelyNumeric && sum > 0) {
          pcpText = `총 ${sum.toFixed(1)}mm`;
        } else if (hasUnder1 && sum === 0) {
          pcpText = '1mm 미만';
        } else {
          pcpText = Array.from(pcpSet).slice(0, 2).join('/');
        }
      } else {
        pcpText = '비';
      }

      rainSummary = `${timeRangeText} (${pcpText})`;
      rainPcpSummary = pcpText;
    }

    // Weather icon selection
    let skyIcon = '☀️';
    let skyText = '맑음';

    if (hasRain) {
      skyIcon = '🌧️';
      skyText = '비';
    } else if (daytimePty === '3') {
      skyIcon = '❄️';
      skyText = '눈';
    } else if (daytimeSky === '4') {
      skyIcon = '☁️';
      skyText = '흐림';
    } else if (daytimeSky === '3') {
      skyIcon = '⛅';
      skyText = '구름많음';
    } else {
      skyIcon = '☀️';
      skyText = '맑음';
    }

    const minT = minTmp !== Infinity ? Math.round(minTmp) : null;
    const maxT = maxTmp !== -Infinity ? Math.round(maxTmp) : null;

    let tooltip = `📍 부산진구 전포동 (부산동고)\n날씨: ${skyText} ${skyIcon}\n기온: ${minT !== null ? minT + '℃' : ''}${maxT !== null ? ' ~ ' + maxT + '℃' : ''}\n강수확률: 최대 ${maxPop}%`;
    if (hasRain) {
      tooltip = `🌧️ 부산진구 전포동 비 예보\n• 비 올 시간: ${rainSummary}\n• 예상 강수량: ${rainPcpSummary}\n• 최고 강수확률: ${maxPop}%\n• 기온: ${minT !== null ? minT + '℃' : ''} ~ ${maxT !== null ? maxT + '℃' : ''}`;
    }

    const dayWeather = {
      date: dateFormatted,
      ymd,
      skyIcon,
      skyText,
      minTmp: minT,
      maxTmp: maxT,
      hasRain,
      rainSummary,
      rainPcpSummary,
      maxPop,
      tooltip,
      hourlyList
    };

    resultByDate[dateFormatted] = dayWeather;
    resultByDate[ymd] = dayWeather;
  }

  return resultByDate;
}

/**
 * Fetches Jeonpo-dong weather from KMA Open API with localStorage caching
 */
async function fetchJeonpoWeather(force = false) {
  try {
    // 1. Check local cache
    if (!force) {
      try {
        const cachedRaw = localStorage.getItem(KMA_CACHE_KEY);
        if (cachedRaw) {
          const cached = JSON.parse(cachedRaw);
          if (cached && cached.timestamp && (Date.now() - cached.timestamp < KMA_CACHE_TTL_MS)) {
            if (cached.weatherDataByDate && Object.keys(cached.weatherDataByDate).length > 0) {
              AppState.weatherDataByDate = cached.weatherDataByDate;
              AppState.weatherLoaded = true;
              AppState.weatherLastFetched = new Date(cached.timestamp);
              return AppState.weatherDataByDate;
            }
          }
        }
      } catch (e) {}
    }

    // 2. Fetch from KMA Open API
    const dt = getKmaBaseDateTime();
    const url = `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?serviceKey=${KMA_SERVICE_KEY}&pageNo=1&numOfRows=1000&dataType=JSON&base_date=${dt.baseDate}&base_time=${dt.baseTime}&nx=${KMA_NX}&ny=${KMA_NY}`;

    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    const items = json.response?.body?.items?.item || [];

    if (items.length > 0) {
      const parsed = parseKmaWeatherItems(items);
      AppState.weatherDataByDate = parsed;
      AppState.weatherLoaded = true;
      AppState.weatherLastFetched = new Date();

      try {
        localStorage.setItem(KMA_CACHE_KEY, JSON.stringify({
          timestamp: Date.now(),
          baseDate: dt.baseDate,
          baseTime: dt.baseTime,
          weatherDataByDate: parsed
        }));
      } catch (e) {}

      // If currently on calendar tab, refresh view to show new weather
      if (AppState.currentTab === 'calendar') {
        renderApp();
      }

      return parsed;
    }
  } catch (err) {
    console.warn('KMA Weather fetch failed:', err);
  }
  return AppState.weatherDataByDate;
}

/**
 * Returns weather HTML badge for Monthly or Weekly calendar
 */
function getWeatherBadgeForDate(dateStr, isWeekly = false) {
  if (!AppState.weatherDataByDate || !dateStr) return '';
  const w = AppState.weatherDataByDate[dateStr];
  if (!w) return '';

  const escapedTooltip = escapeHtml(w.tooltip || '');

  if (isWeekly) {
    // Weekly calendar header tag (N요일 (M/D) 우측)
    if (w.hasRain) {
      return `<span class="week-weather-tag rain-alert" title="${escapedTooltip}">🌧️ 비: ${escapeHtml(w.rainSummary)} (${w.maxPop}%)</span>`;
    } else {
      const tempRange = (w.maxTmp !== null && w.minTmp !== null) ? ` ${w.maxTmp}°/${w.minTmp}°` : (w.maxTmp !== null ? ` ${w.maxTmp}°` : '');
      return `<span class="week-weather-tag" title="${escapedTooltip}">${w.skyIcon}${tempRange}</span>`;
    }
  } else {
    // Monthly calendar day cell badge (일자 옆)
    if (w.hasRain) {
      return `<span class="weather-day-badge rain-alert" title="${escapedTooltip}">🌧️ ${escapeHtml(w.rainSummary)}</span>`;
    } else {
      const maxT = w.maxTmp !== null ? ` ${w.maxTmp}°` : '';
      return `<span class="weather-day-badge" title="${escapedTooltip}">${w.skyIcon}${maxT}</span>`;
    }
  }
}
