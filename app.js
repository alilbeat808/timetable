/**
 * 2026학년도 2학기 학교 시간표 종합 시스템 - 핵심 스크립트
 * 모바일 최적화 & 공식 교과별/업무부서별(부장·기획) 명단 반영 & 공강 교집합 회의 추천
 */

// 1. Official Subject Departments (학교 공식 교과별 교사 명단 44명)
const OFFICIAL_DEPARTMENTS = {
  '국어과': ['최호성', '황영애', '전순옥', '이동훈', '이상균', '김지원', '이혜나'],
  '외국어과': ['정동걸', '신인철', '장충걸', '정용', '김형도', '김정은', '이상환'],
  '수학과': ['최진화', '이우석', '김주영', '황정환', '김혜정', '강정아', '박상율'],
  '사회과': ['하정우', '강연선', '정환웅', '안경철', '박태언', '정석원', '임종옥', '정종혁'],
  '과학과': ['양우석', '성경진', '김정현', '박성훈', '유연정', '박주현', '김은영', '박지영'],
  '예체능과': ['김동민', '강봉수', '이장훈', '배수경', '김정열', '이옥임', '정복순']
};

const DEPT_ICONS = {
  '국어과': '📚',
  '외국어과': '🌐',
  '수학과': '📐',
  '사회과': '🏛️',
  '과학과': '🧪',
  '예체능과': '🎨'
};

// 2. Official Administrative Departments & Positions (업무 부서별 교사 명단 - 1번째: 부장, 2번째: 기획)
const OFFICIAL_ADMIN_DEPTS = {
  '교무기획부': ['김정현', '정동걸', '강연선', '황정환', '유연정', '박주현'],
  '생활안전부': ['이상환', '이장훈', '김동민', '강봉수', '정복순', '이옥임'],
  '진로상담부': ['정종혁', '김지원', '박태언'],
  '고교학점제부': ['안경철', '정석원', '김형도'],
  '교육평가부': ['박성훈', '이혜나', '김정은', '김주영'],
  '인문사회부': ['하정우', '전순옥', '황영애'],
  '과학중점부': ['양우석', '강정아', '성경진', '박상율', '최진화'],
  '1학년부': ['신인철', '배수경'],
  '2학년부': ['장충걸', '김정열'],
  '3학년부': ['정용', '최호성']
};

const ADMIN_DEPT_ICONS = {
  '교무기획부': '📋',
  '생활안전부': '🛡️',
  '진로상담부': '🎯',
  '고교학점제부': '🎓',
  '교육평가부': '📊',
  '인문사회부': '📖',
  '과학중점부': '🔬',
  '1학년부': '🌱',
  '2학년부': '🌿',
  '3학년부': '🌳'
};

function getTeacherDepartment(teacherName) {
  if (!teacherName) return '';
  for (const [dept, names] of Object.entries(OFFICIAL_DEPARTMENTS)) {
    if (names.includes(teacherName)) return dept;
  }
  return '';
}

function getTeacherAdminInfo(teacherName) {
  if (!teacherName) return null;
  for (const [dept, members] of Object.entries(OFFICIAL_ADMIN_DEPTS)) {
    const idx = members.indexOf(teacherName);
    if (idx === 0) return { dept, position: '부장', isHead: true, isPlan: false, label: `${dept} 부장` };
    if (idx === 1) return { dept, position: '기획', isHead: false, isPlan: true, label: `${dept} 기획` };
    if (idx > 1) return { dept, position: '부원', isHead: false, isPlan: false, label: dept };
  }
  return null;
}

// Application State
const AppState = {
  data: window.SCHOOL_TIMETABLE_DATA || null,
  currentTab: 'teacher', // 'teacher' | 'class' | 'meeting' | 'free' | 'matrix' | 'live' | 'upload'
  selectedTeacherId: null,
  selectedClassId: null,
  selectedGrade: 'all', // 'all' | '1' | '2' | '3'
  selectedDay: '월',
  selectedPeriod: '1',
  matrixType: 'teacher', // 'teacher' | 'class'
  searchQuery: '',
  theme: localStorage.getItem('timetable_theme') || 'light',
  favorites: JSON.parse(localStorage.getItem('timetable_favorites') || '[]'),
  
  // Teacher Filters
  teacherFilterType: 'all', // 'all' | 'admin' | 'subject' | 'homeroom' | 'head' | 'plan'
  teacherFilterValue: 'all',
  teacherChosungFilter: 'all',
  teacherChipsExpanded: false,

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

  // Standard Bell Schedule
  bellSchedule: [
    { period: 1, start: '08:50', end: '09:40', label: '1교시' },
    { period: 2, start: '09:50', end: '10:40', label: '2교시' },
    { period: 3, start: '10:50', end: '11:40', label: '3교시' },
    { period: 4, start: '11:50', end: '12:40', label: '4교시' },
    { period: 0, start: '12:40', end: '13:40', label: '점심시간' },
    { period: 5, start: '13:40', end: '14:30', label: '5교시' },
    { period: 6, start: '14:40', end: '15:30', label: '6교시' },
    { period: 7, start: '15:40', end: '16:30', label: '7교시' }
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
  if (AppState.data && AppState.data.teachers && AppState.data.teachers.length > 0) {
    AppState.selectedTeacherId = AppState.data.teachers[0].id;
    // Default meeting teachers preset: 교무기획부
    if (AppState.meetingSelectedTeachers.length === 0) {
      const gyoNames = OFFICIAL_ADMIN_DEPTS['교무기획부'];
      AppState.meetingSelectedTeachers = AppState.data.teachers
        .filter(t => gyoNames.includes(t.name))
        .map(t => t.id);
      AppState.meetingActivePreset = 'admin_교무기획부';
      AppState.meetingActivePresetTitle = '교무기획부';
    }
  }
  if (AppState.data && AppState.data.classes && AppState.data.classes.length > 0) {
    AppState.selectedClassId = AppState.data.classes[0].id;
  }
  
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
      if (tab) switchTab(tab);
    });
  });

  const searchInput = document.getElementById('globalSearchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      AppState.searchQuery = e.target.value.trim().toLowerCase();
      renderApp();
    });
  }

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

function switchTab(tab) {
  AppState.currentTab = tab;
  
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

  let filteredTeachers = AppState.data.teachers;

  // Filter by Type
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

  // Chosung initial consonant filter
  if (AppState.teacherChosungFilter !== 'all') {
    filteredTeachers = filteredTeachers.filter(t => getChosung(t.name) === AppState.teacherChosungFilter);
  }

  // Global search filter
  if (AppState.searchQuery) {
    filteredTeachers = filteredTeachers.filter(t => 
      t.name.toLowerCase().includes(AppState.searchQuery) ||
      (t.homeroom && t.homeroom.toLowerCase().includes(AppState.searchQuery)) ||
      (getTeacherDepartment(t.name) && getTeacherDepartment(t.name).toLowerCase().includes(AppState.searchQuery)) ||
      (getTeacherAdminInfo(t.name) && getTeacherAdminInfo(t.name).label.toLowerCase().includes(AppState.searchQuery)) ||
      hasTeacherSubject(t, AppState.searchQuery)
    );
  }

  let currentTeacher = AppState.data.teachers.find(t => t.id === AppState.selectedTeacherId) || filteredTeachers[0];
  if (!currentTeacher && AppState.data.teachers.length > 0) {
    currentTeacher = AppState.data.teachers[0];
  }
  if (currentTeacher) {
    AppState.selectedTeacherId = currentTeacher.id;
  }

  const isFavorite = AppState.favorites.includes(currentTeacher ? currentTeacher.id : '');
  const todayName = getTodayDayName();
  const currentDept = currentTeacher ? getTeacherDepartment(currentTeacher.name) : '';
  const currentDeptIcon = DEPT_ICONS[currentDept] || '👨‍🏫';
  const currentAdmin = currentTeacher ? getTeacherAdminInfo(currentTeacher.name) : null;

  let html = `
    <!-- Selector Card -->
    <div class="control-card">
      <div class="control-header">
        <div class="control-title">
          <span>👨‍🏫</span>
          <span>교사 선택</span>
          <span class="chip-badge">${filteredTeachers.length}명</span>
        </div>
        <div class="control-tools">
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
          <button class="btn btn-secondary" onclick="exportCurrentTimetableToCsv('${currentTeacher ? currentTeacher.name : ''}')" title="CSV 다운로드">
            📥 CSV
          </button>
        </div>
      </div>

      <!-- Filter Group Tabs -->
      <div class="grade-tabs" style="margin-bottom: 0.65rem;">
        <button class="grade-tab-btn ${AppState.teacherFilterType === 'all' ? 'active' : ''}" onclick="setTeacherFilter('all', 'all')">
          전체 교사
        </button>
        <button class="grade-tab-btn ${AppState.teacherFilterType === 'head' ? 'active' : ''}" onclick="setTeacherFilter('head', 'head')">
          👑 부장단 (10명)
        </button>
        <button class="grade-tab-btn ${AppState.teacherFilterType === 'plan' ? 'active' : ''}" onclick="setTeacherFilter('plan', 'plan')">
          📝 기획단 (10명)
        </button>
        <button class="grade-tab-btn ${AppState.teacherFilterType === 'homeroom' ? 'active' : ''}" onclick="setTeacherFilter('homeroom', 'homeroom')">
          🏫 담임교사 (20명)
        </button>
      </div>

      <!-- Administrative & Subject Department Tabs -->
      <div style="display: flex; gap: 0.4rem; overflow-x: auto; scrollbar-width: none; padding-bottom: 0.45rem; margin-bottom: 0.5rem;">
        <span style="font-size: 0.75rem; font-weight: 700; color: var(--text-muted); display: flex; align-items: center; white-space: nowrap;">🏢 업무부서:</span>
        ${Object.keys(OFFICIAL_ADMIN_DEPTS).map(dept => `
          <button class="preset-category-btn ${AppState.teacherFilterType === 'admin' && AppState.teacherFilterValue === dept ? 'active' : ''}" onclick="setTeacherFilter('admin', '${dept}')">
            ${ADMIN_DEPT_ICONS[dept] || ''} ${dept.replace('부','')}
          </button>
        `).join('')}
      </div>

      <div style="display: flex; gap: 0.4rem; overflow-x: auto; scrollbar-width: none; padding-bottom: 0.45rem; margin-bottom: 0.65rem;">
        <span style="font-size: 0.75rem; font-weight: 700; color: var(--text-muted); display: flex; align-items: center; white-space: nowrap;">📚 교과부서:</span>
        ${Object.keys(OFFICIAL_DEPARTMENTS).map(dept => `
          <button class="preset-category-btn ${AppState.teacherFilterType === 'subject' && AppState.teacherFilterValue === dept ? 'active' : ''}" onclick="setTeacherFilter('subject', '${dept}')">
            ${DEPT_ICONS[dept] || ''} ${dept.replace('과','')}
          </button>
        `).join('')}
      </div>

      <!-- Chosung Filter Bar -->
      <div class="chosung-filter-bar">
        ${CHOSUNG_LIST.map(ch => `
          <button class="chosung-btn ${AppState.teacherChosungFilter === ch ? 'active' : ''}" onclick="setTeacherChosung('${ch}')">
            ${ch === 'all' ? '전체 초성' : ch}
          </button>
        `).join('')}
      </div>
      
      <!-- Teacher Chips -->
      <div class="chips-group ${AppState.teacherChipsExpanded ? 'expanded' : ''}">
        ${filteredTeachers.map(t => {
          const dept = getTeacherDepartment(t.name);
          const admin = getTeacherAdminInfo(t.name);
          return `
            <button class="chip-btn ${t.id === AppState.selectedTeacherId ? 'active' : ''}" onclick="selectTeacher('${t.id}')">
              ${t.name}
              ${admin && admin.isHead ? `<span class="role-badge-head">부장</span>` : ''}
              ${admin && admin.isPlan ? `<span class="role-badge-plan">기획</span>` : ''}
              ${dept ? `<span class="chip-badge" style="font-size:0.7rem;">${dept.replace('과','')}</span>` : ''}
              ${t.homeroom ? `<span class="chip-badge" style="background:#e0e7ff; color:#3730a3;">${t.homeroom}</span>` : ''}
            </button>
          `;
        }).join('')}
      </div>

      ${filteredTeachers.length > 18 ? `
        <div style="text-align: center; margin-top: 0.5rem;">
          <button class="btn btn-secondary" style="font-size: 0.78rem; padding: 0.25rem 0.75rem;" onclick="toggleTeacherChipsExpanded()">
            ${AppState.teacherChipsExpanded ? '▲ 교사 목록 접기' : '▼ 전체 교사 목록 펼쳐보기 (' + filteredTeachers.length + '명)'}
          </button>
        </div>
      ` : ''}
    </div>
  `;

  if (currentTeacher) {
    html += `
      <!-- Teacher Info Banner -->
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
              
              <!-- Admin Dept & Role Badge -->
              ${currentAdmin ? `
                <span class="${currentAdmin.isHead ? 'role-badge-head' : (currentAdmin.isPlan ? 'role-badge-plan' : 'role-badge-dept')}" style="font-size:0.8rem; padding:0.25rem 0.65rem;">
                  ${ADMIN_DEPT_ICONS[currentAdmin.dept] || '🏢'} ${currentAdmin.dept} ${currentAdmin.position !== '부원' ? `<strong>${currentAdmin.position}</strong>` : ''}
                </span>
              ` : ''}

              <!-- Subject Dept Badge -->
              ${currentDept ? `
                <span class="entity-tag" style="background: var(--primary-light); color: var(--primary-text); font-weight: 700;">
                  ${currentDeptIcon} ${currentDept}
                </span>
              ` : ''}

              <!-- Homeroom Badge -->
              ${currentTeacher.homeroom ? `
                <button class="entity-tag" style="background: #e0e7ff; color: #3730a3; border: none; cursor: pointer;" onclick="navigateToClass('${currentTeacher.homeroom}')">
                  🏫 ${currentTeacher.homeroom} 담임 ➔
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
    `;

    if (AppState.viewMode === 'card') {
      html += renderTeacherCardView(currentTeacher, todayName);
    } else {
      html += renderTeacherTableView(currentTeacher, todayName);
    }
  }

  container.innerHTML = html;
}

function renderTeacherCardView(teacher, todayName) {
  const currentDay = AppState.mobileSelectedDay;
  const currentPeriodInfo = getCurrentPeriodInfo();

  return `
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
        const isFree = !cell || cell.isFree;
        const cat = !isFree ? getSubjectCategory(cell.subject) : '';
        const isCurrentSlot = (currentDay === todayName && currentPeriodInfo && currentPeriodInfo.period === period);

        return `
          <div class="mobile-period-card ${isCurrentSlot ? 'is-current' : ''}">
            <div class="mobile-period-left">
              <div class="mobile-period-badge">
                <span>${period}</span>
                <span class="mobile-period-time">${timeInfo ? timeInfo.start : ''}</span>
              </div>
              <div>
                ${isFree ? `
                  <div class="mobile-period-subject" style="color: var(--text-muted); font-size: 0.95rem;">
                    <span>🌿</span>
                    <span>${cell && cell.subject === '여유' ? '여유 시간' : '공강 (수업 없음)'}</span>
                  </div>
                ` : `
                  <div class="mobile-period-subject">
                    <span class="subject-pill ${cat}">${cell.subject}</span>
                  </div>
                  <div style="font-size: 0.78rem; color: var(--text-muted); margin-top: 0.15rem;">
                    ${timeInfo ? `${timeInfo.start} ~ ${timeInfo.end}` : ''}
                  </div>
                `}
              </div>
            </div>

            <div>
              ${!isFree && cell.target ? `
                <button class="target-badge" style="font-size: 0.88rem; padding: 0.35rem 0.75rem;" onclick="navigateToClass('${cell.target}')">
                  🏫 ${cell.target}반 ➔
                </button>
              ` : ''}
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

function renderTeacherTableView(teacher, todayName) {
  return `
    <div class="timetable-card">
      <table class="timetable-grid">
        <thead>
          <tr>
            <th class="period-col">교시</th>
            ${DAYS.map(day => `
              <th class="day-col ${day === todayName ? 'today' : ''}">
                ${day}요일 ${day === todayName ? '<span style="font-size:0.75rem; color:var(--primary);">(오늘)</span>' : ''}
              </th>
            `).join('')}
          </tr>
        </thead>
        <tbody>
          ${PERIODS.map(period => {
            const timeInfo = AppState.bellSchedule.find(b => b.period === period);
            return `
              <tr>
                <td class="period-col">
                  <div class="period-cell-header">
                    <span class="period-num">${period}</span>
                    <span class="period-time">${timeInfo ? timeInfo.start : ''}</span>
                  </div>
                </td>
                ${DAYS.map(day => {
                  const cell = teacher.schedule[day] ? teacher.schedule[day][period.toString()] : null;
                  const isToday = day === todayName;
                  
                  if (!cell || cell.isFree) {
                    return `
                      <td class="timetable-cell ${isToday ? 'is-today' : ''}">
                        <div class="cell-content">
                          <span class="free-period">${cell && cell.subject === '여유' ? '여유시간' : '공강'}</span>
                        </div>
                      </td>
                    `;
                  }

                  const categoryClass = getSubjectCategory(cell.subject);
                  return `
                    <td class="timetable-cell ${isToday ? 'is-today' : ''}">
                      <div class="cell-content">
                        <span class="subject-pill ${categoryClass}">${cell.subject}</span>
                        ${cell.target ? `
                          <button class="target-badge" onclick="navigateToClass('${cell.target}')" title="${cell.target} 학반 시간표로 이동">
                            🏫 ${cell.target}
                          </button>
                        ` : ''}
                      </div>
                    </td>
                  `;
                }).join('')}
              </tr>
            `;
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

function setTeacherFilter(type, val) {
  AppState.teacherFilterType = type;
  AppState.teacherFilterValue = val;
  renderApp();
}

function setTeacherChosung(ch) {
  AppState.teacherChosungFilter = ch;
  renderApp();
}

function toggleTeacherChipsExpanded() {
  AppState.teacherChipsExpanded = !AppState.teacherChipsExpanded;
  renderApp();
}

function selectTeacher(id) {
  AppState.selectedTeacherId = id;
  renderApp();
}

function navigateToTeacher(teacherName) {
  if (!AppState.data || !AppState.data.teachers) return;
  const teacher = AppState.data.teachers.find(t => t.name === teacherName);
  if (teacher) {
    AppState.selectedTeacherId = teacher.id;
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

  let currentClass = AppState.data.classes.find(c => c.id === AppState.selectedClassId) || filteredClasses[0];
  if (!currentClass && AppState.data.classes.length > 0) {
    currentClass = AppState.data.classes[0];
  }
  if (currentClass) {
    AppState.selectedClassId = currentClass.id;
  }

  const isFavorite = AppState.favorites.includes(currentClass ? currentClass.id : '');
  const todayName = getTodayDayName();

  let html = `
    <!-- Class Selector Card -->
    <div class="control-card">
      <div class="control-header">
        <div class="control-title">
          <span>🏫</span>
          <span>학반 선택</span>
          <span class="chip-badge">${filteredClasses.length}개 반</span>
        </div>
        <div class="control-tools">
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
          <button class="btn btn-secondary" onclick="exportCurrentTimetableToCsv('${currentClass ? currentClass.name : ''}')" title="CSV 다운로드">
            📥 CSV
          </button>
        </div>
      </div>

      <!-- Grade Tabs -->
      <div class="grade-tabs">
        <button class="grade-tab-btn ${AppState.selectedGrade === 'all' ? 'active' : ''}" onclick="selectGrade('all')">전체 학년</button>
        <button class="grade-tab-btn ${AppState.selectedGrade === '1' ? 'active' : ''}" onclick="selectGrade('1')">1학년</button>
        <button class="grade-tab-btn ${AppState.selectedGrade === '2' ? 'active' : ''}" onclick="selectGrade('2')">2학년</button>
        <button class="grade-tab-btn ${AppState.selectedGrade === '3' ? 'active' : ''}" onclick="selectGrade('3')">3학년</button>
      </div>

      <div class="chips-group">
        ${filteredClasses.map(c => `
          <button class="chip-btn ${c.id === AppState.selectedClassId ? 'active' : ''}" onclick="selectClass('${c.id}')">
            ${c.name}
            ${c.homeroom ? `<span class="chip-badge">${c.homeroom}</span>` : ''}
          </button>
        `).join('')}
      </div>
    </div>
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
  }

  container.innerHTML = html;
}

function renderClassCardView(classObj, todayName) {
  const currentDay = AppState.mobileSelectedDay;
  const currentPeriodInfo = getCurrentPeriodInfo();

  return `
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
        const isFree = !cell || cell.isFree;
        const cat = !isFree ? getSubjectCategory(cell.subject) : '';
        const isCurrentSlot = (currentDay === todayName && currentPeriodInfo && currentPeriodInfo.period === period);

        return `
          <div class="mobile-period-card ${isCurrentSlot ? 'is-current' : ''}">
            <div class="mobile-period-left">
              <div class="mobile-period-badge">
                <span>${period}</span>
                <span class="mobile-period-time">${timeInfo ? timeInfo.start : ''}</span>
              </div>
              <div>
                ${isFree ? `
                  <div class="mobile-period-subject" style="color: var(--text-muted); font-size: 0.95rem;">
                    <span>수업 없음</span>
                  </div>
                ` : `
                  <div class="mobile-period-subject">
                    <span class="subject-pill ${cat}">${cell.subject}</span>
                  </div>
                  <div style="font-size: 0.78rem; color: var(--text-muted); margin-top: 0.15rem;">
                    ${timeInfo ? `${timeInfo.start} ~ ${timeInfo.end}` : ''}
                  </div>
                `}
              </div>
            </div>

            <div>
              ${!isFree && cell.target ? `
                <button class="target-badge" style="font-size: 0.88rem; padding: 0.35rem 0.75rem;" onclick="navigateToTeacher('${cell.target}')">
                  👨‍🏫 ${cell.target} ➔
                </button>
              ` : ''}
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

function renderClassTableView(classObj, todayName) {
  return `
    <div class="timetable-card">
      <table class="timetable-grid">
        <thead>
          <tr>
            <th class="period-col">교시</th>
            ${DAYS.map(day => `
              <th class="day-col ${day === todayName ? 'today' : ''}">
                ${day}요일 ${day === todayName ? '<span style="font-size:0.75rem; color:var(--primary);">(오늘)</span>' : ''}
              </th>
            `).join('')}
          </tr>
        </thead>
        <tbody>
          ${PERIODS.map(period => {
            const timeInfo = AppState.bellSchedule.find(b => b.period === period);
            return `
              <tr>
                <td class="period-col">
                  <div class="period-cell-header">
                    <span class="period-num">${period}</span>
                    <span class="period-time">${timeInfo ? timeInfo.start : ''}</span>
                  </div>
                </td>
                ${DAYS.map(day => {
                  const cell = classObj.schedule[day] ? classObj.schedule[day][period.toString()] : null;
                  const isToday = day === todayName;

                  if (!cell || cell.isFree) {
                    return `
                      <td class="timetable-cell ${isToday ? 'is-today' : ''}">
                        <div class="cell-content">
                          <span class="free-period">수업 없음</span>
                        </div>
                      </td>
                    `;
                  }

                  const categoryClass = getSubjectCategory(cell.subject);
                  return `
                    <td class="timetable-cell ${isToday ? 'is-today' : ''}">
                      <div class="cell-content">
                        <span class="subject-pill ${categoryClass}">${cell.subject}</span>
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
          }).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function selectGrade(grade) {
  AppState.selectedGrade = grade;
  renderApp();
}

function selectClass(id) {
  AppState.selectedClassId = id;
  renderApp();
}

function navigateToClass(className) {
  if (!AppState.data || !AppState.data.classes) return;
  const cls = AppState.data.classes.find(c => c.name === className);
  if (cls) {
    AppState.selectedClassId = cls.id;
    switchTab('class');
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
   3. 🤝 공강 교집합 & 회의 시간 추천 (Meeting Finder Engine - Categorized Presets)
   ========================================================================== */
function renderMeetingView(container) {
  if (!AppState.data || !AppState.data.teachers) {
    container.innerHTML = `<div class="control-card"><p>교사 데이터가 없습니다.</p></div>`;
    return;
  }

  const allTeachers = AppState.data.teachers;
  const selectedTeacherObjs = allTeachers.filter(t => AppState.meetingSelectedTeachers.includes(t.id));

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
        <button class="preset-category-btn ${AppState.meetingPresetCategory === 'admin' ? 'active' : ''}" onclick="setMeetingPresetCategory('admin')">
          🏢 업무 부서별 (10개 부서)
        </button>
        <button class="preset-category-btn ${AppState.meetingPresetCategory === 'role' ? 'active' : ''}" onclick="setMeetingPresetCategory('role')">
          👑 부장단 / 기획단 회의
        </button>
        <button class="preset-category-btn ${AppState.meetingPresetCategory === 'subject' ? 'active' : ''}" onclick="setMeetingPresetCategory('subject')">
          📚 교과 부서별 (6개 교과)
        </button>
        <button class="preset-category-btn ${AppState.meetingPresetCategory === 'grade' ? 'active' : ''}" onclick="setMeetingPresetCategory('grade')">
          🏫 학년 담임 (1~3학년)
        </button>
        <button class="preset-category-btn ${AppState.meetingPresetCategory === 'all' ? 'active' : ''}" onclick="setMeetingPresetCategory('all')">
          👥 전체
        </button>
      </div>

      <!-- Quick Preset Buttons for Selected Category -->
      <div class="meeting-preset-bar">
        ${presets.map(p => `
          <button class="preset-btn ${AppState.meetingActivePreset === p.name ? 'active' : ''}" onclick="applyMeetingPreset('${p.name}', '${p.label}')">
            ${p.icon || ''} ${p.label} <span class="chip-badge">${p.teacherIds.length}명</span>
          </button>
        `).join('')}
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
              const dept = getTeacherDepartment(t.name);
              return `
                <span class="selected-tag-item">
                  <span>${t.name}</span>
                  ${admin && admin.isHead ? `<span class="role-badge-head" style="margin-left:0.15rem;">부장</span>` : ''}
                  ${admin && admin.isPlan ? `<span class="role-badge-plan" style="margin-left:0.15rem;">기획</span>` : ''}
                  ${dept ? `<span style="font-size:0.7rem; opacity:0.85;">(${dept.replace('과','')})</span>` : ''}
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

      <!-- Teacher Multi-Select Chips -->
      <div style="font-size: 0.82rem; font-weight: 700; color: var(--text-muted); margin-bottom: 0.35rem;">
        전체 교사 목록 (클릭하여 개별 추가/제거):
      </div>
      <div class="chips-group" style="max-height: 140px;">
        ${allTeachers.map(t => {
          const isSelected = AppState.meetingSelectedTeachers.includes(t.id);
          const admin = getTeacherAdminInfo(t.name);
          const dept = getTeacherDepartment(t.name);
          return `
            <button class="chip-btn ${isSelected ? 'active' : ''}" onclick="toggleMeetingTeacher('${t.id}')">
              <span>${isSelected ? '✓' : '+'}</span>
              <span>${t.name}</span>
              ${admin && admin.isHead ? `<span class="role-badge-head">부장</span>` : ''}
              ${admin && admin.isPlan ? `<span class="role-badge-plan">기획</span>` : ''}
              ${dept ? `<span class="chip-badge" style="font-size:0.7rem;">${dept.replace('과','')}</span>` : ''}
              ${t.homeroom ? `<span class="chip-badge" style="background:#e0e7ff; color:#3730a3;">${t.homeroom}</span>` : ''}
            </button>
          `;
        }).join('')}
      </div>
    </div>
  `;

  if (selectedTeacherObjs.length >= 2) {
    html += `
      <!-- TOP Recommended Meeting Times -->
      <div class="control-card" style="border-color: var(--primary);">
        <div class="control-header">
          <div class="control-title">
            <span>🏆</span>
            <span>추천 회의 시간 TOP 순위</span>
          </div>
          <div style="font-size: 0.82rem; color: var(--text-muted);">
            전원 공강 (1순위) 및 최소 결손 시간대 자동 선별
          </div>
        </div>

        <div class="rec-cards-grid">
          ${analysisResult.recommendations.length > 0 ? analysisResult.recommendations.map((rec, idx) => {
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
          }).join('') : `
            <p style="color: var(--text-muted); padding: 1rem;">가능한 추천 시간대가 없습니다.</p>
          `}
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

// Compute Presets Categorized (Admin, Roles, Subjects, Grades)
function getCategorizedPresets(category) {
  if (!AppState.data || !AppState.data.teachers) return [];
  const teachers = AppState.data.teachers;
  const presets = [];

  if (category === 'admin') {
    for (const [dept, members] of Object.entries(OFFICIAL_ADMIN_DEPTS)) {
      const teacherIds = teachers.filter(t => members.includes(t.name)).map(t => t.id);
      presets.push({
        name: 'admin_' + dept,
        label: dept,
        icon: ADMIN_DEPT_ICONS[dept] || '🏢',
        teacherIds: teacherIds
      });
    }
  } else if (category === 'role') {
    // Heads meeting (부장단 10명)
    const headNames = Object.values(OFFICIAL_ADMIN_DEPTS).map(m => m[0]);
    const headIds = teachers.filter(t => headNames.includes(t.name)).map(t => t.id);
    presets.push({
      name: 'role_heads',
      label: '👑 부장단 회의',
      icon: '👑',
      teacherIds: headIds
    });

    // Planning meeting (기획단 10명)
    const planNames = Object.values(OFFICIAL_ADMIN_DEPTS).map(m => m[1]);
    const planIds = teachers.filter(t => planNames.includes(t.name)).map(t => t.id);
    presets.push({
      name: 'role_plans',
      label: '📝 기획단 회의',
      icon: '📝',
      teacherIds: planIds
    });
  } else if (category === 'subject') {
    for (const [dept, names] of Object.entries(OFFICIAL_DEPARTMENTS)) {
      const teacherIds = teachers.filter(t => names.includes(t.name)).map(t => t.id);
      presets.push({
        name: 'dept_' + dept,
        label: dept,
        icon: DEPT_ICONS[dept] || '📚',
        teacherIds: teacherIds
      });
    }
  } else if (category === 'grade') {
    const g1 = teachers.filter(t => t.homeroom && t.homeroom.startsWith('1-')).map(t => t.id);
    if (g1.length > 0) presets.push({ name: 'grade1', label: '1학년 담임', icon: '🏫', teacherIds: g1 });

    const g2 = teachers.filter(t => t.homeroom && t.homeroom.startsWith('2-')).map(t => t.id);
    if (g2.length > 0) presets.push({ name: 'grade2', label: '2학년 담임', icon: '🏫', teacherIds: g2 });

    const g3 = teachers.filter(t => t.homeroom && t.homeroom.startsWith('3-')).map(t => t.id);
    if (g3.length > 0) presets.push({ name: 'grade3', label: '3학년 담임', icon: '🏫', teacherIds: g3 });
  } else {
    // All
    presets.push({ name: 'all_teachers', label: '전체 교사', icon: '👥', teacherIds: teachers.map(t => t.id) });
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

  // Sort slots to find top recommendations
  slotsList.sort((a, b) => {
    if (a.tier !== b.tier) return a.tier - b.tier;
    if (a.freeCount !== b.freeCount) return b.freeCount - a.freeCount;
    return b.period - a.period;
  });

  const recommendations = slotsList.slice(0, 6);

  return { matrix, recommendations };
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
            ${slotData.freeTeachers.map(t => {
              const admin = getTeacherAdminInfo(t.name);
              const dept = getTeacherDepartment(t.name);
              return `
                <span class="chip-btn" style="background: var(--success-light); color: var(--success-text); border: none; cursor: default;">
                  ${t.name} ${admin && (admin.isHead || admin.isPlan) ? `[${admin.position}]` : (dept ? `[${dept.replace('과','')}]` : '')}
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
              ${slotData.busyTeachers.map(b => {
                const admin = getTeacherAdminInfo(b.name);
                return `
                  <div style="font-size: 0.85rem; display: flex; justify-content: space-between; padding: 0.25rem 0.5rem; background: var(--bg-hover); border-radius: var(--radius-sm);">
                    <strong style="color: var(--text-primary);">
                      ${b.name} 선생님 ${admin && (admin.isHead || admin.isPlan) ? `(${admin.position})` : ''}
                    </strong>
                    <span style="color: var(--text-secondary);">${b.subject} (${b.target})</span>
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
    return `${t.name}${admin && (admin.isHead || admin.isPlan) ? `(${admin.position})` : ''}`;
  }).join(', ');

  const titlePrefix = AppState.meetingActivePresetTitle ? `[📅 부산동고 ${AppState.meetingActivePresetTitle} 회의 일정 추천]` : `[📅 부산동고등학교 회의 일정 추천]`;

  let text = `${titlePrefix}\n`;
  text += `* 참석 대상: ${teacherDetails} (총 ${selectedTeachers.length}명)\n\n`;
  
  const tier1 = analysis.recommendations.filter(r => r.tier === 1);
  const tier2 = analysis.recommendations.filter(r => r.tier === 2);

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
function renderMatrixView(container) {
  if (!AppState.data) return;

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
          
          <select id="matrixDaySelect" class="search-input" style="width: 120px;" onchange="setMatrixDay(this.value)">
            ${DAYS.map(d => `<option value="${d}" ${d === AppState.selectedDay ? 'selected' : ''}>${d}요일</option>`).join('')}
          </select>

          <button class="btn btn-secondary" onclick="window.print()" title="전체 종합 현황판 인쇄">
            🖨️ 인쇄
          </button>
        </div>
      </div>

      <div class="matrix-container">
        <table class="matrix-table">
          <thead>
            <tr>
              <th style="min-width: 140px; text-align: left; padding-left: 1rem;">
                ${AppState.matrixType === 'teacher' ? '교사명 (직책/시수)' : '학반명 (담임)'}
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
  return AppState.data.teachers.map(t => {
    const dept = getTeacherDepartment(t.name);
    const admin = getTeacherAdminInfo(t.name);
    return `
      <tr>
        <td class="entity-col">
          <span style="font-weight: 700; cursor: pointer; color: var(--primary);" onclick="navigateToTeacher('${t.name}')">${t.name}</span>
          ${admin && admin.isHead ? `<span class="role-badge-head" style="font-size:0.65rem;">부장</span>` : ''}
          ${admin && admin.isPlan ? `<span class="role-badge-plan" style="font-size:0.65rem;">기획</span>` : ''}
          ${dept ? `<span style="font-size:0.7rem; color:var(--text-muted);">[${dept.replace('과','')}]</span>` : ''}
          <span style="font-size: 0.72rem; color: var(--text-muted);">(${t.hoursByDay[day] || 0}h)</span>
        </td>
        ${PERIODS.map(p => {
          const cell = t.schedule[day] ? t.schedule[day][p.toString()] : null;
          if (!cell || cell.isFree) {
            return `<td style="color: var(--text-muted); background: var(--bg-surface);">-</td>`;
          }
          const cat = getSubjectCategory(cell.subject);
          return `
            <td>
              <span class="subject-pill ${cat}" style="font-size: 0.75rem; padding: 0.15rem 0.4rem;" onclick="navigateToClass('${cell.target}')" title="${cell.raw}">
                ${cell.subject} ${cell.target ? `(${cell.target})` : ''}
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
  return AppState.data.classes.map(c => {
    return `
      <tr>
        <td class="entity-col">
          <span style="font-weight: 700; cursor: pointer; color: var(--primary);" onclick="navigateToClass('${c.name}')">${c.name}</span>
          <span style="font-size: 0.72rem; color: var(--text-muted);">(${c.homeroom || ''})</span>
        </td>
        ${PERIODS.map(p => {
          const cell = c.schedule[day] ? c.schedule[day][p.toString()] : null;
          if (!cell || cell.isFree) {
            return `<td style="color: var(--text-muted); background: var(--bg-surface);">-</td>`;
          }
          const cat = getSubjectCategory(cell.subject);
          return `
            <td>
              <span class="subject-pill ${cat}" style="font-size: 0.75rem; padding: 0.15rem 0.4rem;" onclick="navigateToTeacher('${cell.target}')" title="${cell.raw}">
                ${cell.subject} ${cell.target ? `(${cell.target})` : ''}
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

  freeTeachers.sort((a, b) => (a.hoursByDay[day] || 0) - (b.hoursByDay[day] || 0));

  const html = `
    <div class="control-card">
      <div class="control-header">
        <div class="control-title">
          <span>🔍</span>
          <span>공강 교사 검색 / 보강 배정 도우미</span>
        </div>
        <div class="control-tools">
          <div style="display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap;">
            <label style="font-size: 0.88rem; font-weight: 600;">교과:</label>
            <select class="search-input" style="width: 110px;" onchange="setFreeDeptFilter(this.value)">
              <option value="all" ${AppState.freeTeacherDeptFilter === 'all' ? 'selected' : ''}>전체 교과</option>
              ${Object.keys(OFFICIAL_DEPARTMENTS).map(dept => `
                <option value="${dept}" ${AppState.freeTeacherDeptFilter === dept ? 'selected' : ''}>${dept}</option>
              `).join('')}
            </select>

            <label style="font-size: 0.88rem; font-weight: 600; margin-left: 0.25rem;">업무부서:</label>
            <select class="search-input" style="width: 110px;" onchange="setFreeAdminFilter(this.value)">
              <option value="all" ${AppState.freeTeacherAdminFilter === 'all' ? 'selected' : ''}>전체 부서</option>
              ${Object.keys(OFFICIAL_ADMIN_DEPTS).map(dept => `
                <option value="${dept}" ${AppState.freeTeacherAdminFilter === dept ? 'selected' : ''}>${dept}</option>
              `).join('')}
            </select>

            <label style="font-size: 0.88rem; font-weight: 600; margin-left: 0.25rem;">요일:</label>
            <select class="search-input" style="width: 90px;" onchange="setFreeSearchDay(this.value)">
              ${DAYS.map(d => `<option value="${d}" ${d === day ? 'selected' : ''}>${d}요일</option>`).join('')}
            </select>
            
            <label style="font-size: 0.88rem; font-weight: 600; margin-left: 0.25rem;">교시:</label>
            <select class="search-input" style="width: 90px;" onchange="setFreeSearchPeriod(this.value)">
              ${PERIODS.map(p => `<option value="${p}" ${p.toString() === period ? 'selected' : ''}>${p}교시</option>`).join('')}
            </select>

            <button class="btn btn-secondary" onclick="window.print()" title="공강/보강 명단 인쇄" style="margin-left: 0.35rem;">
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
          const admin = getTeacherAdminInfo(t.name);
          let loadClass = 'load-light';
          let loadText = '여유';
          if (dayHours >= 4) { loadClass = 'load-heavy'; loadText = '과중'; }
          else if (dayHours >= 2) { loadClass = 'load-medium'; loadText = '보통'; }

          return `
            <div class="finder-card" onclick="navigateToTeacher('${t.name}')" title="${t.name} 선생님 전체 시간표 보기">
              <div>
                <div class="finder-name" style="display:flex; align-items:center; gap:0.35rem;">
                  <span>${t.name} 선생님</span>
                  ${admin && admin.isHead ? `<span class="role-badge-head">부장</span>` : ''}
                  ${admin && admin.isPlan ? `<span class="role-badge-plan">기획</span>` : ''}
                </div>
                <div class="finder-meta" style="margin-top:0.2rem;">
                  ${admin ? `<span style="color:var(--primary); font-weight:600;">${admin.dept}</span> | ` : ''}
                  ${dept ? `<span>${dept}</span> | ` : ''}
                  ${t.homeroom ? `<span>${t.homeroom} 담임 | </span>` : ''}
                  <span>주당 ${t.totalHours}시수</span>
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

  const currentPeriodInfo = getCurrentPeriodInfo();

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
        <div class="live-period-badge">
          ${isWeekend ? '주말 (월요일 기준 표시)' : (currentPeriodInfo ? currentPeriodInfo.label : '일과 시간 외')}
        </div>
        <div style="font-size: 0.82rem; opacity: 0.85; margin-top: 0.35rem;">
          ${currentPeriodInfo ? `${currentPeriodInfo.start} ~ ${currentPeriodInfo.end}` : '학교 일과 시작 전/후'}
        </div>
      </div>
    </div>

    <!-- Live Classes Overview -->
    <div class="control-card">
      <div class="control-header">
        <div class="control-title">
          <span>🔔</span>
          <span>지금 진행 중인 학반별 수업</span>
        </div>
        <div class="control-tools">
          <button class="btn btn-secondary" onclick="window.print()" title="실시간 일과 현황 인쇄">
            🖨️ 인쇄
          </button>
        </div>
      </div>

      <div class="finder-grid">
        ${AppState.data.classes.map(c => {
          const period = currentPeriodInfo && currentPeriodInfo.period > 0 ? currentPeriodInfo.period.toString() : '1';
          const cell = c.schedule[todayDayName] ? c.schedule[todayDayName][period] : null;
          const isFree = !cell || cell.isFree;
          const cat = !isFree ? getSubjectCategory(cell.subject) : '';

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
                    ${cell.subject} (${cell.target})
                  </span>
                `}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;

  container.innerHTML = html;
}

function getCurrentPeriodInfo() {
  const now = new Date();
  const curTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  
  for (let b of AppState.bellSchedule) {
    if (curTime >= b.start && curTime <= b.end) {
      return b;
    }
  }
  return null;
}

function formatTime(date) {
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
}

function updateLiveClock() {
  const clock = document.getElementById('liveClockDisplay');
  if (clock) {
    clock.textContent = formatTime(new Date());
  }
}

/* ==========================================================================
   7. 파일 업로드 & 브라우저 실시간 HML 파서 (File Upload View)
   ========================================================================== */
function renderUploadView(container) {
  const html = `
    <div class="control-card">
      <div class="control-header">
        <div class="control-title">
          <span>🔄</span>
          <span>새로운 시간표 파일 (HML / HWP) 업로드 및 교체</span>
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
        const lines = pNodes.map(p => p.textContent.trim()).filter(Boolean);
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
      if (match[3]) homeroom = match[3].trim();
    }

    const entity = {
      id: 'C_' + className,
      name: className,
      rawTitle: titleText,
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
        const lines = pNodes.map(p => p.textContent.trim()).filter(Boolean);
        const raw = lines.join(' ');

        const isFree = lines.length === 0;
        const periodCell = {
          subject: lines.length > 0 ? lines[0] : '',
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
