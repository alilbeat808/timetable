# [시간표 데이터 변환기]
# HML 파일을 읽어서 timetable_data.json 및 timetable_data.js를 생성합니다.
# 실행 방법: PowerShell에서 이 파일을 실행하거나, 우클릭 후 'PowerShell로 실행'

$csharpCode = @"
using System;
using System.IO;
using System.Text;
using System.Xml;
using System.Collections.Generic;
using System.Text.RegularExpressions;

namespace SchoolTimetableV6 {

public class PeriodCell {
    public string subject = "";
    public string target = "";
    public string raw = "";
    public List<string> lines = new List<string>();
    public bool isFree = true;
}

public class TimetableEntity {
    public string id = "";
    public string name = "";
    public string rawTitle = "";
    public string homeroom = "";
    public string department = "";
    public string adminDept = "";
    public string position = "";
    public string grade = "";
    public string classNum = "";
    public string gradeYear = "";
    public string type = "";
    public int totalHours = 0;
    public Dictionary<string, int> hoursByDay = new Dictionary<string, int>();
    public Dictionary<string, Dictionary<string, PeriodCell>> schedule = new Dictionary<string, Dictionary<string, PeriodCell>>();
}

public class SchoolData {
    public string schoolName = "\uBD80\uC0B0\uB3D9\uACE0\uB4F1\uD559\uAD50";
    public string schoolYear = "2026 \uD559\uB144\uB3C4";
    public string semester = "2\uD559\uAE30";
    public string generatedAt = "";
    public int teacherCount = 0;
    public int classCount = 0;
    public List<string> days = new List<string> { "\uC6D4", "\uD654", "\uC218", "\uBAA9", "\uAE08" };
    public List<int> periods = new List<int> { 1, 2, 3, 4, 5, 6, 7 };
    public List<string> subjects = new List<string>();
    public List<TimetableEntity> teachers = new List<TimetableEntity>();
    public List<TimetableEntity> classes = new List<TimetableEntity>();
}

public class TimetableDataBuilder {
    private static readonly string[] Days = new string[] { "\uC6D4", "\uD654", "\uC218", "\uBAA9", "\uAE08" };

    public static string EscapeJson(string s) {
        if (s == null) return "";
        return s.Replace("\\", "\\\\").Replace("\"", "\\\"").Replace("\r", "").Replace("\n", "\\n").Replace("\t", "\\t");
    }

    public static string ToJson(SchoolData data) {
        var sb = new StringBuilder();
        sb.Append("{\n");
        sb.Append("  \"schoolName\": \"" + EscapeJson(data.schoolName) + "\",\n");
        sb.Append("  \"schoolYear\": \"" + EscapeJson(data.schoolYear) + "\",\n");
        sb.Append("  \"semester\": \"" + EscapeJson(data.semester) + "\",\n");
        sb.Append("  \"generatedAt\": \"" + EscapeJson(data.generatedAt) + "\",\n");
        sb.Append("  \"teacherCount\": " + data.teacherCount + ",\n");
        sb.Append("  \"classCount\": " + data.classCount + ",\n");

        sb.Append("  \"days\": [");
        for (int i = 0; i < data.days.Count; i++) {
            if (i > 0) sb.Append(", ");
            sb.Append("\"" + EscapeJson(data.days[i]) + "\"");
        }
        sb.Append("],\n");

        sb.Append("  \"periods\": [1, 2, 3, 4, 5, 6, 7],\n");

        sb.Append("  \"subjects\": [");
        for (int i = 0; i < data.subjects.Count; i++) {
            if (i > 0) sb.Append(", ");
            sb.Append("\"" + EscapeJson(data.subjects[i]) + "\"");
        }
        sb.Append("],\n");

        sb.Append("  \"teachers\": [\n");
        for (int i = 0; i < data.teachers.Count; i++) {
            if (i > 0) sb.Append(",\n");
            sb.Append(EntityToJson(data.teachers[i], "    "));
        }
        sb.Append("\n  ],\n");

        sb.Append("  \"classes\": [\n");
        for (int i = 0; i < data.classes.Count; i++) {
            if (i > 0) sb.Append(",\n");
            sb.Append(EntityToJson(data.classes[i], "    "));
        }
        sb.Append("\n  ]\n");
        sb.Append("}");
        return sb.ToString();
    }

    private static string EntityToJson(TimetableEntity e, string indent) {
        var sb = new StringBuilder();
        sb.Append(indent + "{\n");
        sb.Append(indent + "  \"id\": \"" + EscapeJson(e.id) + "\",\n");
        sb.Append(indent + "  \"name\": \"" + EscapeJson(e.name) + "\",\n");
        sb.Append(indent + "  \"rawTitle\": \"" + EscapeJson(e.rawTitle) + "\",\n");
        sb.Append(indent + "  \"homeroom\": \"" + EscapeJson(e.homeroom) + "\",\n");
        sb.Append(indent + "  \"department\": \"" + EscapeJson(e.department) + "\",\n");
        sb.Append(indent + "  \"adminDept\": \"" + EscapeJson(e.adminDept) + "\",\n");
        sb.Append(indent + "  \"position\": \"" + EscapeJson(e.position) + "\",\n");
        sb.Append(indent + "  \"grade\": \"" + EscapeJson(e.grade) + "\",\n");
        sb.Append(indent + "  \"classNum\": \"" + EscapeJson(e.classNum) + "\",\n");
        sb.Append(indent + "  \"gradeYear\": \"" + EscapeJson(e.gradeYear) + "\",\n");
        sb.Append(indent + "  \"type\": \"" + EscapeJson(e.type) + "\",\n");
        sb.Append(indent + "  \"totalHours\": " + e.totalHours + ",\n");

        sb.Append(indent + "  \"hoursByDay\": {");
        int dC = 0;
        foreach (var kvp in e.hoursByDay) {
            if (dC > 0) sb.Append(", ");
            sb.Append("\"" + EscapeJson(kvp.Key) + "\": " + kvp.Value);
            dC++;
        }
        sb.Append("},\n");

        sb.Append(indent + "  \"schedule\": {\n");
        for (int d = 0; d < Days.Length; d++) {
            string day = Days[d];
            sb.Append(indent + "    \"" + EscapeJson(day) + "\": {\n");
            if (e.schedule.ContainsKey(day)) {
                int pC = 0;
                foreach (var pKvp in e.schedule[day]) {
                    if (pC > 0) sb.Append(",\n");
                    var cell = pKvp.Value;
                    sb.Append(indent + "      \"" + pKvp.Key + "\": { ");
                    sb.Append("\"subject\": \"" + EscapeJson(cell.subject) + "\", ");
                    sb.Append("\"target\": \"" + EscapeJson(cell.target) + "\", ");
                    sb.Append("\"raw\": \"" + EscapeJson(cell.raw) + "\", ");
                    sb.Append("\"isFree\": " + (cell.isFree ? "true" : "false") + ", ");
                    sb.Append("\"lines\": [");
                    for (int l = 0; l < cell.lines.Count; l++) {
                        if (l > 0) sb.Append(", ");
                        sb.Append("\"" + EscapeJson(cell.lines[l]) + "\"");
                    }
                    sb.Append("] }");
                    pC++;
                }
                sb.Append("\n");
            }
            sb.Append(indent + "    }" + (d < Days.Length - 1 ? "," : "") + "\n");
        }
        sb.Append(indent + "  }\n");
        sb.Append(indent + "}");
        return sb.ToString();
    }

    public static void Run(string dirPath) {
        Console.WriteLine("Scanning: " + dirPath);
        string[] files = Directory.GetFiles(dirPath, "*.HML");
        var allTeachers = new List<TimetableEntity>();
        var allClasses = new List<TimetableEntity>();

        foreach (string f in files) {
            XmlDocument doc = new XmlDocument();
            using (var reader = new StreamReader(f, Encoding.UTF8)) {
                doc.Load(reader);
            }

            var tables = doc.GetElementsByTagName("TABLE");
            if (tables.Count == 0) continue;

            var r0 = tables[0].SelectSingleNode(".//ROW");
            string title = "";
            if (r0 != null) {
                var chars = r0.SelectNodes(".//CHAR");
                StringBuilder sb = new StringBuilder();
                foreach (XmlNode ch in chars) sb.Append(ch.InnerText);
                title = sb.ToString().Trim();
            }

            Console.WriteLine("File: " + Path.GetFileName(f) + " Title: [" + title + "] Tables: " + tables.Count);

            if (f.Contains("\uD559\uBC18") || f.Contains("\uD559\uAE09") || title.Contains("\uD559\uBC18") || title.Contains("\uD559\uAE09")) {
                allClasses = ParseClasses(tables);
            } else {
                allTeachers = ParseTeachers(tables);
            }
        }

        Console.WriteLine("Parsed " + allTeachers.Count + " teachers and " + allClasses.Count + " classes.");

        foreach (var c in allClasses) {
            if (!string.IsNullOrEmpty(c.homeroom)) {
                foreach (var t in allTeachers) {
                    if (t.name == c.homeroom) {
                        t.homeroom = c.name;
                    }
                }
            }
        }

        var deptMap = new Dictionary<string, string[]>() {
            { "\uAD6D\uC5B4\uACFC", new string[] { "\uCD5C\uD638\uC131", "\uD669\uC601\uC560", "\uC804\uC21C\uC625", "\uC774\uB3D9\uD6C8", "\uC804\uC544\uB9B0", "\uAE40\uC9C0\uC6D0", "\uC774\uD61C\uB098" } },
            { "\uC678\uAD6D\uC5B4\uACFC", new string[] { "\uC815\uB3D9\uAC78", "\uC2E0\uC778\uCCA0", "\uC815\uC6A9", "\uAE40\uD615\uB3C4", "\uAE40\uC815\uC740", "\uC774\uC0C1\uD658" } },
            { "\uC218\uD559\uACFC", new string[] { "\uCD5C\uC9C4\uD654", "\uC774\uC6B0\uC11D", "\uAE40\uC8FC\uC601", "\uD669\uC815\uD658", "\uAE40\uD61C\uC815", "\uAC15\uC815\uC544", "\uBC15\uC0C1\uC728" } },
            { "\uC0AC\uD68C\uACFC", new string[] { "\uD558\uC815\uC6B0", "\uAC15\uC5F0\uC120", "\uC815\uD658\uC6C5", "\uC548\uACBD\uCCA0", "\uBC15\uD0DC\uC5B8", "\uC815\uC11D\uC6D0", "\uC784\uC885\uC625", "\uC815\uC885\uD601" } },
            { "\uACFC\uD559\uACFC", new string[] { "\uC591\uC6B0\uC11D", "\uC131\uACBD\uC9C4", "\uAE40\uC815\uD604", "\uBC15\uC131\uD6C8", "\uC720\uC5F0\uC815", "\uBC15\uC8FC\uD604", "\uAE40\uC740\uC601", "\uBC15\uC9C0\uC601" } },
            { "\uC608\uCCB4\uB2A5\uACFC", new string[] { "\uAE40\uB3D9\uBBFC", "\uAC15\uBD09\uC218", "\uC774\uC7A5\uD6C8", "\uBC30\uC218\uACBD", "\uAE40\uC815\uC5F4", "\uC774\uC625\uC784", "\uC815\uBCF5\uC21C", "\uC7A5\uCDA9\uAC78", "\uC7A5\uC131\uD638" } }
        };

        if (!allTeachers.Exists(t => t.name == "\uC624\uC815\uD6C8")) {
            var ojh = new TimetableEntity {
                id = "T_\uC624\uC815\uD6C8",
                name = "\uC624\uC815\uD6C8",
                rawTitle = "\uC624\uC815\uD6C8",
                department = "",
                adminDept = "\uAD50\uC721\uC815\uBCF4\uBD80",
                position = "\uBD80\uC7A5",
                gradeYear = allTeachers.Count > 0 ? allTeachers[0].gradeYear : "2026 \uD559\uB144\uB3C4",
                type = "teacher",
                totalHours = 0
            };
            foreach (var d in Days) {
                ojh.schedule[d] = new Dictionary<string, PeriodCell>();
                ojh.hoursByDay[d] = 0;
                for (int p = 1; p <= 7; p++) {
                    ojh.schedule[d][p.ToString()] = new PeriodCell { isFree = true, raw = "" };
                }
            }
            allTeachers.Add(ojh);
        }

        foreach (var t in allTeachers) {
            foreach (var kvp in deptMap) {
                if (Array.IndexOf(kvp.Value, t.name) >= 0) {
                    t.department = kvp.Key;
                    break;
                }
            }
        }

        var adminDeptMap = new Dictionary<string, string[]>() {
            { "\uAD50\uBB34\uAE30\uD68D\uBD80", new string[] { "\uAE40\uC815\uD604", "\uC815\uB3D9\uAC78", "\uAC15\uC5F0\uC120", "\uD669\uC815\uD658", "\uC720\uC5F0\uC815", "\uBC15\uC8FC\uD604" } },
            { "\uC0DD\uD65C\uC548\uC804\uBD80", new string[] { "\uC774\uC0C1\uD658", "\uC774\uC7A5\uD6C8", "\uAE40\uB3D9\uBBFC", "\uAC15\uBD09\uC218", "\uC815\uBCF5\uC21C", "\uC774\uC625\uC784" } },
            { "\uC9C4\uB85C\uC0C1\uB2F4\uBD80", new string[] { "\uC815\uC885\uD601", "\uAE40\uC9C0\uC6D0", "\uBC15\uD0DC\uC5B8" } },
            { "\uC9C4\uD559\uC9C0\uB3C4\uBD80", new string[] { "\uC774\uB3D9\uD6C8", "\uAE40\uD61C\uC815", "\uC774\uC6B0\uC11D" } },
            { "\uAD50\uC721\uC815\uBCF4\uBD80", new string[] { "\uC624\uC815\uD6C8", "\uC815\uD658\uC6C5" } },
            { "\uACE0\uAD50\uD559\uC810\uC81C\uBD80", new string[] { "\uC548\uACBD\uCCA0", "\uC815\uC11D\uC6D0", "\uAE40\uD615\uB3C4" } },
            { "\uAD50\uC721\uD3C9\uAC00\uBD80", new string[] { "\uBC15\uC131\uD6C8", "\uC774\uD61C\uB098", "\uAE40\uC815\uC740", "\uAE40\uC8FC\uC601", "\uC804\uC544\uB9B0" } },
            { "\uC778\uBB38\uC0AC\uD68C\uBD80", new string[] { "\uD558\uC815\uC6B0", "\uC804\uC21C\uC625", "\uD669\uC601\uC560" } },
            { "\uACFC\uD559\uC911\uC810\uBD80", new string[] { "\uC591\uC6B0\uC11D", "\uAC15\uC815\uC544", "\uC131\uACBD\uC9C4", "\uBC15\uC0C1\uC728", "\uCD5C\uC9C4\uD654" } },
            { "1\uD559\uB144\uBD80", new string[] { "\uC2E0\uC778\uCCA0", "\uBC30\uC218\uACBD" } },
            { "2\uD559\uB144\uBD80", new string[] { "\uC7A5\uCDA9\uAC78", "\uAE40\uC815\uC5F4" } },
            { "3\uD559\uB144\uBD80", new string[] { "\uC815\uC6A9", "\uCD5C\uD638\uC131" } }
        };

        var dutyMap = new Dictionary<string, string>() {
            { "\uAC15\uC5F0\uC120", "NEIS/\uC0DD\uAE30\uBD801" },
            { "\uD669\uC815\uD658", "\uC77C\uACFC" },
            { "\uBC15\uC8FC\uD604", "\uD559\uC801/\uC0DD\uAE30\uBD802" },
            { "\uC720\uC5F0\uC815", "\uCD9C\uACB0/\uC2DC\uC0C1" },
            { "\uAE40\uB3D9\uBBFC", "\uC120\uB3C4/\uC548\uC804" },
            { "\uAC15\uBD09\uC218", "\uC0DD\uD65C/\uC548\uC804" },
            { "\uBC15\uD0DC\uC5B8", "\uC9C4\uB85C" },
            { "\uC774\uC6B0\uC11D", "\uCD94\uC218" },
            { "\uAE40\uD615\uB3C4", "\uD559\uC810\uC81C" },
            { "\uC804\uC544\uB9B0", "\uD3C9\uAC002" },
            { "\uAE40\uC815\uC740", "\uC131\uC8011" },
            { "\uAE40\uC8FC\uC601", "\uC131\uC8012" },
            { "\uD669\uC601\uC560", "\uC5F0\uC218" },
            { "\uC131\uACBD\uC9C4", "\uBA54\uC774\uCEE4" },
            { "\uBC15\uC0C1\uC728", "\uACFC\uC911" },
            { "\uCD5C\uC9C4\uD654", "\uC218\uD559" }
        };

        foreach (var t in allTeachers) {
            foreach (var kvp in adminDeptMap) {
                int idx = Array.IndexOf(kvp.Value, t.name);
                if (idx >= 0) {
                    t.adminDept = kvp.Key;
                    if (idx == 0) t.position = "\uBD80\uC7A5";
                    else if (idx == 1) t.position = "\uAE30\uD68D";
                    else if (dutyMap.ContainsKey(t.name)) t.position = dutyMap[t.name];
                    else t.position = "\uBD80\uC6D0";
                    break;
                }
            }
            if (string.IsNullOrEmpty(t.position) && dutyMap.ContainsKey(t.name)) {
                t.position = dutyMap[t.name];
            }
        }

        var subjectSet = new HashSet<string>();
        foreach (var t in allTeachers) {
            foreach (var d in Days) {
                if (t.schedule.ContainsKey(d)) {
                    foreach (var p in t.schedule[d].Values) {
                        if (!p.isFree && !string.IsNullOrEmpty(p.subject)) {
                            subjectSet.Add(p.subject);
                        }
                    }
                }
            }
        }
        foreach (var c in allClasses) {
            foreach (var d in Days) {
                if (c.schedule.ContainsKey(d)) {
                    foreach (var p in c.schedule[d].Values) {
                        if (!p.isFree && !string.IsNullOrEmpty(p.subject)) {
                            subjectSet.Add(p.subject);
                        }
                    }
                }
            }
        }

        var subjectList = new List<string>(subjectSet);
        subjectList.Sort();

        var data = new SchoolData();
        data.generatedAt = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
        data.teacherCount = allTeachers.Count;
        data.classCount = allClasses.Count;
        data.teachers = allTeachers;
        data.classes = allClasses;
        data.subjects = subjectList;
        if (allTeachers.Count > 0 && !string.IsNullOrEmpty(allTeachers[0].gradeYear)) {
            data.schoolYear = allTeachers[0].gradeYear;
        }

        string json = ToJson(data);
        string jsonPath = Path.Combine(dirPath, "timetable_data.json");
        string jsPath = Path.Combine(dirPath, "timetable_data.js");

        File.WriteAllText(jsonPath, json, Encoding.UTF8);
        File.WriteAllText(jsPath, "window.SCHOOL_TIMETABLE_DATA = " + json + ";", Encoding.UTF8);

        Console.WriteLine("SUCCESS: Generated " + jsonPath + " and " + jsPath);
    }

    private static List<TimetableEntity> ParseTeachers(XmlNodeList tables) {
        var list = new List<TimetableEntity>();
        foreach (XmlNode table in tables) {
            var rows = table.SelectNodes(".//ROW");
            if (rows.Count < 10) continue;

            var r1Cells = rows[1].SelectNodes(".//CELL");
            string teacherName = "";
            string gradeYear = "";

            foreach (XmlNode c in r1Cells) {
                var chars = c.SelectNodes(".//CHAR");
                StringBuilder sb = new StringBuilder();
                foreach (XmlNode ch in chars) sb.Append(ch.InnerText);
                string text = sb.ToString().Trim();
                if (text.Contains("\uD559\uB144\uB3C4")) {
                    gradeYear = text;
                } else if (!string.IsNullOrEmpty(text) && !text.Contains("\uC2DC\uAC04\uD45C")) {
                    teacherName = text;
                }
            }

            if (string.IsNullOrEmpty(teacherName)) continue;
            if (teacherName == "\uC774\uC0C1\uADE0") teacherName = "\uC804\uC544\uB9B0";

            var entity = new TimetableEntity {
                id = "T_" + teacherName,
                name = teacherName,
                rawTitle = teacherName,
                gradeYear = gradeYear,
                type = "teacher"
            };

            foreach (var d in Days) {
                entity.schedule[d] = new Dictionary<string, PeriodCell>();
                entity.hoursByDay[d] = 0;
            }

            int totalHours = 0;
            for (int r = 3; r <= 9 && r < rows.Count; r++) {
                XmlNode row = rows[r];
                var cells = row.SelectNodes(".//CELL");
                int periodNum = r - 2;

                for (int dIdx = 0; dIdx < 5; dIdx++) {
                    int cIdx = 1 + dIdx;
                    if (cIdx >= cells.Count) break;
                    string dayName = Days[dIdx];
                    XmlNode cell = cells[cIdx];

                    var periodCell = ParseTeacherPeriod(cell);
                    entity.schedule[dayName][periodNum.ToString()] = periodCell;

                    if (!periodCell.isFree) {
                        totalHours++;
                        entity.hoursByDay[dayName]++;
                    }
                }
            }

            entity.totalHours = totalHours;
            list.Add(entity);
        }

        return list;
    }

    private static List<TimetableEntity> ParseClasses(XmlNodeList tables) {
        var list = new List<TimetableEntity>();
        foreach (XmlNode table in tables) {
            var rows = table.SelectNodes(".//ROW");
            if (rows.Count < 10) continue;

            var r1Cells = rows[1].SelectNodes(".//CELL");
            string titleText = "";
            string gradeYear = "";

            foreach (XmlNode c in r1Cells) {
                var chars = c.SelectNodes(".//CHAR");
                StringBuilder sb = new StringBuilder();
                foreach (XmlNode ch in chars) sb.Append(ch.InnerText);
                string text = sb.ToString().Trim();
                if (text.Contains("\uD559\uB144\uB3C4")) {
                    gradeYear = text;
                } else if (!string.IsNullOrEmpty(text) && !text.Contains("\uC2DC\uAC04\uD45C")) {
                    titleText = text;
                }
            }

            if (string.IsNullOrEmpty(titleText)) continue;

            string className = titleText;
            string homeroom = "";
            string grade = "";
            string classNum = "";

            var match = Regex.Match(titleText, @"^(\d+)-(\d+)(?:\s+(.+))?");
            if (match.Success) {
                grade = match.Groups[1].Value;
                classNum = match.Groups[2].Value;
                className = grade + "-" + classNum;
                if (match.Groups[3].Success) {
                    homeroom = match.Groups[3].Value.Trim();
                    if (homeroom == "\uC774\uC0C1\uADE0") homeroom = "\uC804\uC544\uB9B0";
                }
            }

            var entity = new TimetableEntity {
                id = "C_" + className,
                name = className,
                rawTitle = titleText.Replace("\uC774\uC0C1\uADE0", "\uC804\uC544\uB9B0"),
                homeroom = homeroom,
                grade = grade,
                classNum = classNum,
                gradeYear = gradeYear,
                type = "class"
            };

            foreach (var d in Days) {
                entity.schedule[d] = new Dictionary<string, PeriodCell>();
                entity.hoursByDay[d] = 0;
            }

            int totalHours = 0;
            for (int r = 3; r <= 9 && r < rows.Count; r++) {
                XmlNode row = rows[r];
                var cells = row.SelectNodes(".//CELL");
                int periodNum = r - 2;

                for (int dIdx = 0; dIdx < 5; dIdx++) {
                    int cIdx = 1 + dIdx;
                    if (cIdx >= cells.Count) break;
                    string dayName = Days[dIdx];
                    XmlNode cell = cells[cIdx];

                    var periodCell = ParseClassPeriod(cell);
                    entity.schedule[dayName][periodNum.ToString()] = periodCell;

                    if (!periodCell.isFree) {
                        totalHours++;
                        entity.hoursByDay[dayName]++;
                    }
                }
            }

            entity.totalHours = totalHours;
            list.Add(entity);
        }
        return list;
    }

    private static PeriodCell ParseTeacherPeriod(XmlNode cell) {
        var result = new PeriodCell();
        var pNodes = cell.SelectNodes(".//P");
        var lines = new List<string>();

        foreach (XmlNode pn in pNodes) {
            var chars = pn.SelectNodes(".//CHAR");
            StringBuilder sb = new StringBuilder();
            foreach (XmlNode ch in pn.SelectNodes(".//CHAR")) sb.Append(ch.InnerText);
            string line = sb.ToString().Trim().Replace("\uC774\uC0C1\uADE0", "\uC804\uC544\uB9B0");
            if (!string.IsNullOrEmpty(line)) lines.Add(line);
        }

        result.lines = lines;
        result.raw = string.Join(" ", lines);

        if (lines.Count == 0 || result.raw == "\uC5EC\uC720") {
            result.isFree = true;
            if (result.raw == "\uC5EC\uC720") {
                result.subject = "\uC5EC\uC720";
                result.isFree = true;
            }
            return result;
        }

        result.isFree = false;
        if (lines.Count >= 2) {
            result.subject = lines[0];
            result.target = lines[1]; // e.g. 1-4
        } else if (lines.Count == 1) {
            result.subject = lines[0];
        }
        return result;
    }

    private static PeriodCell ParseClassPeriod(XmlNode cell) {
        var result = new PeriodCell();
        var pNodes = cell.SelectNodes(".//P");
        var lines = new List<string>();

        foreach (XmlNode pn in pNodes) {
            var chars = pn.SelectNodes(".//CHAR");
            StringBuilder sb = new StringBuilder();
            foreach (XmlNode ch in pn.SelectNodes(".//CHAR")) sb.Append(ch.InnerText);
            string line = sb.ToString().Trim().Replace("\uC774\uC0C1\uADE0", "\uC804\uC544\uB9B0");
            if (!string.IsNullOrEmpty(line)) lines.Add(line);
        }

        result.lines = lines;
        result.raw = string.Join(" ", lines);

        if (lines.Count == 0) {
            result.isFree = true;
            return result;
        }

        result.isFree = false;
        if (lines.Count >= 2) {
            result.subject = lines[0];
            result.target = lines[1] == "\uC774\uC0C1\uADE0" ? "\uC804\uC544\uB9B0" : lines[1]; // teacher name
        } else if (lines.Count == 1) {
            result.subject = lines[0];
        }
        return result;
    }
}
}
"@

Add-Type -TypeDefinition $csharpCode -ReferencedAssemblies "System.Xml" -Language CSharp

$currentDir = Split-Path -Parent $MyInvocation.MyCommand.Path
if (-not $currentDir) { $currentDir = Get-Location }

[SchoolTimetableV6.TimetableDataBuilder]::Run($currentDir)

Write-Host "`n[DONE] Timetable data successfully updated from HML files!" -ForegroundColor Green
Write-Host "[INFO] Open index.html in your browser to view the web app.`n" -ForegroundColor Cyan
