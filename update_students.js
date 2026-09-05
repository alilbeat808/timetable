/**
 * update_students.js
 * 1학년(반편성 명렬표 HWP), 2학년(2-1~2-7.xlsx), 3학년(3-1~3-7.xlsx) 데이터를 통합 파싱하여
 * timetable_data.json 및 timetable_data.js에 전교생(311명) 시간표를 갱신합니다.
 */

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const projectDir = __dirname;
const XLSX = require(path.join(projectDir, 'node_modules', 'xlsx'));
const CFB = XLSX.CFB;

const days = ['월', '화', '수', '목', '금'];
const dayCols = { '월': 1, '화': 3, '수': 4, '목': 5, '금': 11 };

// 1. 1학년 학생 명렬표 파싱 (HWP 파일에서 추출)
function parseGrade1Students() {
  const filePath = path.join(projectDir, '2026학년도 전체 반편성 명렬표_260721.hwp');
  if (!fs.existsSync(filePath)) {
    console.warn(`경고: 1학년 명렬표 HWP 파일이 없습니다: ${filePath}`);
    return [];
  }

  const cfb = CFB.read(filePath, { type: 'file' });
  const secEntry = CFB.find(cfb, 'Section0') || CFB.find(cfb, 'BodyText/Section0');
  const inflated = zlib.inflateRawSync(Buffer.from(secEntry.content));

  const HWPTAG_PARA_TEXT = 0x43;
  let offset = 0;
  const paragraphs = [];

  while (offset < inflated.length) {
    if (offset + 4 > inflated.length) break;
    const header = inflated.readUInt32LE(offset);
    offset += 4;
    const tagId = header & 0x3FF;
    let size = (header >> 20) & 0xFFF;
    if (size === 0xFFF) {
      if (offset + 4 > inflated.length) break;
      size = inflated.readUInt32LE(offset);
      offset += 4;
    }
    if (offset + size > inflated.length) break;
    const data = inflated.slice(offset, offset + size);
    offset += size;

    if (tagId === HWPTAG_PARA_TEXT) {
      let text = '';
      for (let i = 0; i < data.length; i += 2) {
        if (i + 1 >= data.length) break;
        const code = data.readUInt16LE(i);
        if (code >= 32 || code === 10 || code === 13 || code === 9) {
          text += String.fromCharCode(code);
        } else {
          text += ' ';
        }
      }
      const cleanText = text.trim();
      if (cleanText) paragraphs.push(cleanText);
    }
  }

  const p1Start = paragraphs.findIndex(p => p.includes('1학년 반편성'));
  const p2Start = paragraphs.findIndex(p => p.includes('2학년 반편성'));
  const g1Paras = paragraphs.slice(p1Start, p2Start);

  // 1학년 담임교사 마지막 이름인 '배수경' 이후부터 학생 데이터 시작
  const teacherIdx = g1Paras.findIndex(p => p === '배수경');
  const studentParas = g1Paras.slice(teacherIdx + 1);

  const rawStudents = [];
  for (let i = 0; i < studentParas.length; i++) {
    const p = studentParas[i];
    const num = parseInt(p, 10);
    if (!isNaN(num) && num >= 1 && num <= 20 && i + 1 < studentParas.length) {
      const nextP = studentParas[i + 1];
      const match = nextP.match(/^([가-힣]{2,4})(\(체특\))?$/);
      if (match) {
        rawStudents.push({
          studentNum: num,
          name: match[1],
          isSpecial: !!match[2]
        });
        i++;
      }
    }
  }

  const classStudents = { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] };
  let curClass = 1;
  let lastNum = 0;

  rawStudents.forEach(s => {
    if (s.studentNum > lastNum) {
      lastNum = s.studentNum;
      curClass = 1;
    }
    s.grade = 1;
    s.classNum = curClass;
    s.id = `S_1_${curClass}_${s.studentNum}`;
    s.className = `1학년 ${curClass}반`;
    s.classRoom = `1학년 ${curClass}반`;
    classStudents[curClass].push(s);
    curClass++;
    if (curClass > 6) curClass = 1;
  });

  return Object.values(classStudents).flat();
}

function isKimJeongHyeonActive(day, period, teachers) {
  if (!teachers) return false;
  const kim = teachers.find(t => t.name === '김정현');
  if (!kim || !kim.schedule) return false;
  const cell = kim.schedule[day] && kim.schedule[day][period.toString()];
  return !!(cell && !cell.isFree && cell.subject && cell.subject !== '여유');
}

// Special classroom resolution based on user requirements
function resolveSpecialRoom(grade, subject, teacher, defaultRoom, day = null, period = null, teachers = null) {
  const normSubj = (subject || '').replace(/\s+/g, '');
  const tName = (teacher || '').trim();

  // 1. Teacher-based rules (전체 학년)
  // 전체 학년에서 이우석 선생님 수업은 3층 수학실에서 함
  if (tName.includes('이우석')) return '3층 수학실';
  // 전체 학년에서 최진화 선생님 수업은 4층 수학전용실에서 함
  if (tName.includes('최진화')) return '4층 수학전용실';
  // 전체 학년에서 박성훈 선생님 수업은 5층 생물실에서 함
  if (tName.includes('박성훈')) return '5층 생물실';
  // 전체 학년에서 김정현 선생님 수업은 5층 지구과학실에서 함
  if (tName.includes('김정현')) return '5층 지구과학실';
  // 전체 학년에서 양우석 선생님 수업은 5층 화학실에서 함
  if (tName.includes('양우석')) return '5층 화학실';
  // 전체 학년에서 이상환 선생님 수업은 3층 영어전용실에서 함
  if (tName.includes('이상환')) return '3층 영어전용실';
  // 전체 학년 오정훈 선생님 수업은 4층 컴퓨터실에서 함
  if (tName.includes('오정훈')) return '4층 컴퓨터실';
  // 전체 학년 성경진 선생님 수업은 4층 무한상상실에서 함
  if (tName.includes('성경진')) return '4층 무한상상실';
  // 전체 학년 박주현 선생님 수업은 5층 물리실에서 함
  if (tName.includes('박주현')) return '5층 물리실';
  // 강봉수 선생님 체전실기 수업은 운동장에서 함
  if (tName.includes('강봉수') && normSubj.includes('체전실기')) return '운동장';
  // 김정열 선생님 1학년 미술 수업은 3층 미술실에서 함
  if (tName.includes('김정열') && (normSubj.includes('미술') || grade === 1)) return '3층 미술실';

  // 전체 학년 유연정 선생님 수업:
  // 같은 시간에 김정현 선생님 수업이 겹치지 않는다면 5층 지구과학실에서 하고, 김정현 선생님과 겹치는 시간에는 시간표에 표기된 교실에서 수업함
  if (tName.includes('유연정')) {
    if (day === '금' && (period === 5 || period === 6 || period === 7)) {
      return defaultRoom;
    }
    if (day && period && teachers) {
      const kimActive = isKimJeongHyeonActive(day, period, teachers);
      if (kimActive) {
        return defaultRoom; // 김정현 선생님과 겹치는 시간에는 시간표에 표기된 교실
      } else {
        return '5층 지구과학실'; // 겹치지 않는다면 5층 지구과학실
      }
    }
    return '5층 지구과학실';
  }

  // 2. Grade 1 subject-based rules
  if (grade === 1) {
    // 1학년 음악 수업은 5층 음악실에서 함
    if (normSubj.includes('음악')) return '5층 음악실';
    // 1학년 체육 수업은 운동장에서 함
    if (normSubj.includes('체육')) return '운동장';
    // 1학년 미술 수업은 3층 미술실에서 함
    if (normSubj.includes('미술')) return '3층 미술실';
  }

  // 3. Grade 2 subject-based rules
  if (grade === 2) {
    // 2학년 음악과미디어 수업은 5층 음악실에서 함
    if (normSubj.includes('음악과미디어')) return '5층 음악실';
    // 2학년 운동과건강, 기초체육전공실기 수업은 운동장에서 함
    if (normSubj.includes('운동과건강') || normSubj.includes('기초체육전공실기')) return '운동장';
    // 2학년 미술과매체 수업은 3층 미술실에서 함
    if (normSubj.includes('미술과매체')) return '3층 미술실';
  }

  // 4. Grade 3 subject-based rules
  if (grade === 3) {
    // 3학년 스포츠생활 및 체전실기 수업은 운동장에서 함
    if (normSubj.includes('스포츠생활') || normSubj.includes('체전실기')) return '운동장';
  }

  return defaultRoom;
}

// 2. 엑셀 파일(2학년 or 3학년) 파싱
function parseGradeFromExcel(grade, classCount, teachers = null) {
  const allStudents = [];

  for (let c = 1; c <= classCount; c++) {
    const filename = `${grade}-${c}.xlsx`;
    const filePath = path.join(projectDir, filename);
    if (!fs.existsSync(filePath)) {
      console.warn(`경고: ${filename} 파일이 없습니다.`);
      continue;
    }

    const wb = XLSX.readFile(filePath);
    const sheet = wb.Sheets[wb.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    let currentStudent = null;

    for (let r = 0; r < rows.length; r++) {
      const row = rows[r];
      if (!row || row.length === 0) continue;
      const cell0 = String(row[0] || '').trim();

      const match = cell0.match(/(\d+)학년\s*(\d+)반.*?(\d+)번\s+([^\s]+)/);
      if (match) {
        const g = parseInt(match[1], 10);
        const classNum = parseInt(match[2], 10);
        const studentNum = parseInt(match[3], 10);
        const name = match[4].trim();

        currentStudent = {
          id: `S_${g}_${classNum}_${studentNum}`,
          grade: g,
          classNum,
          studentNum,
          name,
          className: `${g}학년 ${classNum}반`,
          classRoom: `${g}학년 ${classNum}반`,
          totalHours: 0,
          hoursByDay: { '월': 0, '화': 0, '수': 0, '목': 0, '금': 0 },
          schedule: { '월': {}, '화': {}, '수': {}, '목': {}, '금': {} }
        };
        allStudents.push(currentStudent);
        continue;
      }

      if (currentStudent) {
        const pMatch = cell0.match(/^([1-7])교시/);
        if (pMatch) {
          const p = parseInt(pMatch[1], 10);
          const roomRow = row;
          const subjRow = rows[r + 1] || [];

          days.forEach(day => {
            const col = dayCols[day];
            let room = String(roomRow[col] || '').trim();
            let subjRaw = String(subjRow[col] || '').trim();

            let subject = subjRaw;
            let teacher = '';

            // 과목명과 교사명 분리 (예: "현대문학 감상(최호성)" -> subject: "현대문학 감상", teacher: "최호성")
            if (subjRaw && !teacher) {
              const sMatch = subjRaw.match(/^(.*?)\((.*?)\)$/);
              if (sMatch) {
                subject = sMatch[1].trim();
                teacher = sMatch[2].trim();
              }
            }

            // 이상균 -> 전아린 교체
            if (teacher === '이상균') {
              teacher = '전아린';
            }
            if (subjRaw && subjRaw.includes('이상균')) {
              subjRaw = subjRaw.replace(/이상균/g, '전아린');
            }

            // Apply special room rules
            room = resolveSpecialRoom(grade, subject, teacher, room, day, p, teachers);

            // 1) 월요일 1교시 (자율활동: 전원 자기 교실)
            // 및 1교시가 공란인 경우: 자율 시간으로 자기 교실 배정
            if (day === '월' && p === 1) {
              subject = '자율활동';
              teacher = '담임';
              subjRaw = '자율활동(담임)';
              room = currentStudent.classRoom;
            } else if (p === 1 && !subject && !room) {
              subject = '자율활동';
              teacher = '담임';
              subjRaw = '자율활동(담임)';
              room = currentStudent.classRoom;
            }

            // 2) 1, 2, 3학년 모두 금요일 5, 6, 7교시는 자기 교실 고정
            if (day === '금' && (p === 5 || p === 6 || p === 7)) {
              room = currentStudent.classRoom;
              if (!subject) {
                subject = '창체활동';
                teacher = '담임';
                subjRaw = '창체활동(담임)';
              }
            }

            const isFree = (!subject && !room) || subject === '공강' || subjRaw === '공강';

            if (isFree) {
              subject = '공강';
              teacher = '';
              subjRaw = '공강';
              if (grade === 3 && (day === '화' || day === '수' || day === '목') && p === 7) {
                // 3학년 화·수·목 7교시는 공강이라 자기 교실로 위치 지정
                room = currentStudent.classRoom;
              } else if (grade === 3) {
                // 그 외 시간에 공강 시간이 있는 3학년 학생들은 장소를 홈베이스로 지정
                room = '홈베이스';
              } else {
                // 1, 2학년은 공강 시에도 자기 교실
                room = currentStudent.classRoom;
              }
            }

            currentStudent.schedule[day][p] = {
              subject,
              teacher,
              subjectRaw: subjRaw,
              room,
              isFree
            };

            if (!isFree) {
              currentStudent.totalHours++;
              currentStudent.hoursByDay[day] = (currentStudent.hoursByDay[day] || 0) + 1;
            }
          });
        }
      }
    }
  }

  return allStudents;
}

// 3. 1학년 학생 시간표 생성 (1학년 학반별 시간표 기반)
function buildGrade1Timetables(g1Students, existingClasses, teachers = null) {
  g1Students.forEach(student => {
    student.totalHours = 0;
    student.hoursByDay = { '월': 0, '화': 0, '수': 0, '목': 0, '금': 0 };
    student.schedule = { '월': {}, '화': {}, '수': {}, '목': {}, '금': {} };

    // Find class schedule e.g. "1-1"
    const classObj = existingClasses.find(c => c.name === `1-${student.classNum}`);

    days.forEach(day => {
      for (let p = 1; p <= 7; p++) {
        let subject = '';
        let teacher = '';
        let subjRaw = '';
        let room = student.classRoom; // 기본은 자기 교실

        if (day === '월' && p === 1) {
          subject = '자율활동';
          teacher = '담임';
          subjRaw = '자율활동(담임)';
          room = student.classRoom;
        } else if (classObj && classObj.schedule && classObj.schedule[day] && classObj.schedule[day][p.toString()]) {
          const cCell = classObj.schedule[day][p.toString()];
          subject = cCell.subject || '';
          teacher = cCell.target || '';
          if (teacher === '이상균') teacher = '전아린';
          subjRaw = cCell.raw || (subject + (teacher ? `(${teacher})` : ''));
          if (subjRaw && subjRaw.includes('이상균')) {
            subjRaw = subjRaw.replace(/이상균/g, '전아린');
          }
          room = resolveSpecialRoom(1, subject, teacher, student.classRoom, day, p, teachers);
        }

        // 금요일 5, 6, 7교시 처리 (자기 교실 고정)
        if (day === '금' && (p === 5 || p === 6 || p === 7)) {
          room = student.classRoom;
        }

        const isFree = !subject && !teacher;
        student.schedule[day][p] = {
          subject,
          teacher,
          subjectRaw: subjRaw,
          room: isFree ? `${student.classRoom} (자습)` : room,
          isFree
        };

        if (!isFree) {
          student.totalHours++;
          student.hoursByDay[day] = (student.hoursByDay[day] || 0) + 1;
        }
      }
    });
  });

  return g1Students;
}

// 4. 이동수업군(배포용) 엑셀에서 과목 매핑 정보 추출
function extractTrackSubjectMap() {
  const excelPath = path.join(projectDir, '2026-2학기 이동수업군(배포용).xlsx');
  if (!fs.existsSync(excelPath)) return {};
  const wb = XLSX.readFile(excelPath);
  const map = {};

  function parseSheet(sheetName, grade) {
    const ws = wb.Sheets[sheetName];
    if (!ws) return;
    const rows = XLSX.utils.sheet_to_json(ws, { header: 1 });
    const header = rows[0] || [];
    const groups = [];
    header.forEach((val, idx) => {
      if (typeof val === 'string' && new RegExp(`^[A-I]${grade}`).test(val.trim())) {
        groups.push({ code: val.trim(), col: idx });
      }
    });

    let currentRoom = null;
    for (let r = 2; r < rows.length; r++) {
      const row = rows[r];
      if (!row) continue;
      const rVal = row[1];
      if (typeof rVal === 'string') {
        const m = rVal.match(/([1-3])-(\d+)/);
        if (m) currentRoom = `${m[1]}-${m[2]}`;
      }
      for (const g of groups) {
        const sub = row[g.col - 1];
        const subj = row[g.col];
        if (typeof sub === 'string' && ['가', '나', '다', '라', '마'].includes(sub.trim())) {
          const fullCode = `${g.code}${sub.trim()}`;
          const subject = typeof subj === 'string' ? subj.trim() : '';
          const nextRow = rows[r + 1];
          let slot = null;
          let teacher = null;
          if (nextRow) {
            const sVal = nextRow[g.col - 1];
            const tVal = nextRow[g.col];
            if (typeof sVal === 'string' && /^[월화수목금][1-7]/.test(sVal.trim())) slot = sVal.trim();
            if (typeof tVal === 'string') teacher = tVal.trim();
          }
          if (teacher === '이상균') teacher = '전아린';

          if (subject) {
            if (teacher) map[`${fullCode}|${teacher}`] = subject;
            if (currentRoom) map[`${fullCode}|${currentRoom}`] = subject;
            if (slot && currentRoom) map[`${fullCode}|${slot}|${currentRoom}`] = subject;
            if (slot && teacher) map[`${fullCode}|${slot}|${teacher}`] = subject;
          }
        }
      }
    }
  }

  parseSheet('2학년 이동그룹', 2);
  parseSheet('3학년 이동그룹', 3);
  return map;
}

// 5. 데이터 통합 및 파일 업데이트
function updateAllData() {
  const jsonPath = path.join(projectDir, 'timetable_data.json');
  const jsPath = path.join(projectDir, 'timetable_data.js');

  if (!fs.existsSync(jsonPath)) {
    console.error(`오류: ${jsonPath} 파일이 없습니다.`);
    return;
  }

  const rawJson = fs.readFileSync(jsonPath, 'utf8').replace(/^\uFEFF/, '');
  const timetableData = JSON.parse(rawJson);
  const teachers = timetableData.teachers || [];

  // 1학년 파싱 및 시간표 구성
  console.log('1. 1학년 학생 명렬표 파싱 중...');
  const g1Raw = parseGrade1Students();
  const g1Students = buildGrade1Timetables(g1Raw, timetableData.classes || [], teachers);
  console.log(`- 1학년 학생 수: ${g1Students.length}명`);

  // 2학년 파싱
  console.log('2. 2학년(2-1 ~ 2-7) 엑셀 파싱 중...');
  const g2Students = parseGradeFromExcel(2, 7, teachers);
  console.log(`- 2학년 학생 수: ${g2Students.length}명`);

  // 3학년 파싱
  console.log('3. 3학년(3-1 ~ 3-7) 엑셀 파싱 중...');
  const g3Students = parseGradeFromExcel(3, 7, teachers);
  console.log(`- 3학년 학생 수: ${g3Students.length}명`);

  const allStudents = [...g1Students, ...g2Students, ...g3Students];
  console.log(`총 ${allStudents.length}명의 전교생 시간표 데이터를 성공적으로 구축했습니다.`);

  // Safety sweep: Replace any remaining '이상균' with '전아린' across all student schedules
  allStudents.forEach(s => {
    days.forEach(d => {
      for (let p = 1; p <= 7; p++) {
        const cell = s.schedule && s.schedule[d] && s.schedule[d][p];
        if (cell) {
          if (cell.teacher === '이상균') cell.teacher = '전아린';
          if (cell.subjectRaw && cell.subjectRaw.includes('이상균')) {
            cell.subjectRaw = cell.subjectRaw.replace(/이상균/g, '전아린');
          }
        }
      }
    });
  });

  // 교사 직무 설정: 전아린 = 평가1, 이혜나 = 평가2
  if (timetableData.teachers) {
    const arin = timetableData.teachers.find(t => t.name === '전아린');
    if (arin) arin.position = '평가1';
    const hena = timetableData.teachers.find(t => t.name === '이혜나');
    if (hena) hena.position = '평가2';
  }

  // 이동수업군 엑셀에서 과목 매핑 추출
  console.log('4. 이동수업군(배포용) 엑셀 파싱 중...');
  const trackMap = extractTrackSubjectMap();
  timetableData.trackSubjectMap = trackMap;
  console.log(`- 이동수업 과목 매핑 ${Object.keys(trackMap).length}건 생성 완료`);

  timetableData.studentCount = allStudents.length;
  timetableData.students = allStudents;

  // 1. JSON 파일 저장 (UTF-8 without BOM)
  fs.writeFileSync(jsonPath, JSON.stringify(timetableData, null, 2), 'utf8');
  console.log(`timetable_data.json 업데이트 완료 (전교생 ${allStudents.length}명 저장)`);

  // 2. JS 파일 저장
  const jsContent = `window.SCHOOL_TIMETABLE_DATA = ${JSON.stringify(timetableData, null, 2)};\n`;
  fs.writeFileSync(jsPath, jsContent, 'utf8');
  console.log(`timetable_data.js 업데이트 완료.`);
}

updateAllData();
