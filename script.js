// =====================================================
// ===================== Grade Map ======================
// =====================================================

const gradeMap = {
  "A+ (4.0)": 4.0,
  "A (3.7)": 3.7,
  "A- (3.4)": 3.4,
  "B+ (3.2)": 3.2,
  "B (3.0)": 3.0,
  "B- (2.8)": 2.8,
  "C+ (2.6)": 2.6,
  "C (2.4)": 2.4,
  "C- (2.2)": 2.2,
  "D+ (2.0)": 2.0,
  "D (1.5)": 1.5,
  "D- (1.0)": 1.0,
  "F (0.0)": 0.0
};

// =====================================================
// ===================== Subjects =======================
// =====================================================

const subjectsData = {
  "Level 1 - Semester 1": [
    "Human Rights",
    "Calculus",
    "Physics",
    "Introduction to Computer Science",
    "Computer Programming",
    "Introduction to Information Systems"
  ],
  "Level 1 - Semester 2": [
    "English Language",
    "Linear Algebra",
    "Statistics and Probabilities",
    "Object-Oriented Programming",
    "Introduction to Database",
    "Logic Design"
  ],
  "Level 2 - Semester 1": [
    "Discrete Mathematics",
    "Operations Research",
    "Data Structures",
    "Microprocessor and Assembly Language",
    "Systems Analysis and Design",
    "Web Programming"
  ],
  "Level 2 - Semester 2": [
    "Mobile Application Development",
    "Numerical Analysis",
    "Analysis of Algorithm",
    "Computer Graphics",
    "Computer Architecture",
    "Software Engineering",
    "Training 1"
  ],
  "Level 3 - Semester 1": [
    "Quality Assurance and Control",
    "Fundamentals of Multimedia",
    "Compiler Design and Theory",
    "Theory of Operating Systems",
    "Dynamic Languages",
    "Modeling and Simulation",
    "Selected Topics in Computer Science1",
    "Human Computer Interaction"
  ],
  "Level 3 - Semester 2": [
    "Computer Ethics",
    "Computer Networks",
    "Digital Image Processing",
    "Artificial Intelligence",
    "Embedded Systems",
    "Vertual Reality",
    "Digital Signal Processing",
    "Distributed Systems",
    "project Management",
    "Training 2"
  ],
  "Level 4 - Semester 1": [
    "Cloud Computing",
    "Machine Learning",
    "Selected Topics in Computer Science 2",
    "Digital Forensics",
    "Parallel Processics",
    "Graduation Project 1",
    "Internet Of Things"
  ],
  "Level 4 - Semester 2": [
    "Cyber Security",
    "Machine Learning",
    "Data Communication",
    "Graduation Project 2",
    "Computer Vision System",
    "Wireless Networks",
    "Data Science and Big Data",
    "Computer Arabization"
  ]
};

// =====================================================
// ======================= State ========================
// =====================================================

let previousGPA = 0;
let isLoading = false;
let deferredPrompt = null;

// =====================================================
// ================ Generate Grade Options ==============
// =====================================================

function generateGradeOptions() {
  return Object.keys(gradeMap)
    .map(grade => `<option value="${grade}">${grade}</option>`)
    .join("");
}

// =====================================================
// ================ Generate Subject Options =============
// =====================================================

function generateSubjectOptions() {
  let options = `<option value="" disabled selected>Select Subject</option>`;
  for (const group in subjectsData) {
    options += `<optgroup label="📘 ${group}">`;
    subjectsData[group].forEach(subject => {
      options += `<option value="${subject}">${subject}</option>`;
    });
    options += `</optgroup>`;
  }
  return options;
}

// =====================================================
// ====================== Create Row ====================
// =====================================================

function createRow(name = "", hours = "0", grade = "") {
  const row = document.createElement("tr");
  row.innerHTML = `
    <td>
      <select class="subject-select">
        ${generateSubjectOptions()}
        <option value="__custom__">Other / مادة أخرى</option>
      </select>
      <input type="text" class="custom-subject" placeholder="Write subject name" style="display:none;">
    </td>
    <td>
      <select class="hours">
        <option value="0">0</option>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
      </select>
    </td>
    <td>
      <select class="grade">
        <option value="">0</option>
        ${generateGradeOptions()}
      </select>
    </td>
    <td class="total">0.00</td>
  `;

  const hoursSelect = row.querySelector(".hours");
  const gradeSelect = row.querySelector(".grade");
  const subjectSelect = row.querySelector(".subject-select");
  const customInput = row.querySelector(".custom-subject");

  hoursSelect.value = hours || "0";
  gradeSelect.value = grade || "";

  const allSubjects = Object.values(subjectsData).flat();
  if (name && allSubjects.includes(name)) {
    subjectSelect.value = name;
    customInput.style.display = "none";
  } else if (name) {
    subjectSelect.value = "__custom__";
    customInput.style.display = "block";
    customInput.value = name;
  }

  attachRowEvents(row);
  return row;
}

// =====================================================
// ==================== Row Events ======================
// =====================================================

function attachRowEvents(row) {
  const hours = row.querySelector(".hours");
  const grade = row.querySelector(".grade");
  const subject = row.querySelector(".subject-select");
  const customInput = row.querySelector(".custom-subject");

  hours.addEventListener("change", () => {
    if (!handleDuplicate(row)) { calculate(); }
  });

  grade.addEventListener("change", () => {
    if (!handleDuplicate(row)) { calculate(); }
  });

  subject.addEventListener("change", () => {
    if (subject.value === "__custom__") {
      customInput.style.display = "block";
      customInput.focus();
    } else {
      customInput.style.display = "none";
      customInput.value = "";
    }
    if (!handleDuplicate(row)) { calculate(); }
  });

  customInput.addEventListener("input", () => {
    if (!handleDuplicate(row)) { calculate(); }
  });
}

// =====================================================
// ==================== Add Subject =====================
// =====================================================

function addSubject(button) {
  if (!button) return;
  const semester = button.closest(".semester");
  if (!semester) return;
  const tbody = semester.querySelector("tbody");
  if (!tbody) return;

  const row = createRow();
  tbody.appendChild(row);
  calculate();
}

// =====================================================
// ================= Handle Duplicate ===================
// =====================================================

function handleDuplicate(row) {
  const subjectSelect = row.querySelector(".subject-select");
  const customInput = row.querySelector(".custom-subject");

  const name = (subjectSelect.value === "__custom__" ? customInput.value : subjectSelect.value).trim().toLowerCase();
  const hours = parseFloat(row.querySelector(".hours").value) || 0;
  const grade = row.querySelector(".grade").value;

  if (!name || hours === 0 || !grade) { return false; }
  const gradeValue = gradeMap[grade] || 0;
  let duplicateRow = null;

  document.querySelectorAll(".semester tbody tr").forEach(existingRow => {
    if (existingRow === row) return;
    const existingSelect = existingRow.querySelector(".subject-select");
    const existingCustom = existingRow.querySelector(".custom-subject");
    const existingName = (existingSelect.value === "__custom__" ? existingCustom.value : existingSelect.value).trim().toLowerCase();

    if (existingName === name) { duplicateRow = existingRow; }
  });

  if (!duplicateRow) { return false; }

  const existingGrade = duplicateRow.querySelector(".grade").value;
  const existingGradeValue = gradeMap[existingGrade] || 0;

  if(gradeValue > existingGradeValue){
    duplicateRow.querySelector(".grade").value = grade;
    duplicateRow.querySelector(".hours").value = hours;
    duplicateRow.classList.remove("final");
    duplicateRow.classList.add("updated-subject");
    saveData();

    setTimeout(() => {
      duplicateRow.classList.add("final");
      setTimeout(() => {
        duplicateRow.classList.remove("updated-subject");
        duplicateRow.classList.remove("final");
        saveData();
      }, 11000);
    }, 1500);
  }

  row.classList.add("fade-out");
  row.addEventListener("transitionend", () => {
    if (row.parentNode) { row.remove(); }
    calculate();
  }, { once: true });

  return true;
}

// =====================================================
// ==================== Calculate GPA ===================
// =====================================================

function calculate() {
  let globalPoints = 0;
  let globalHours = 0;
  let passedHours = 0;

  document.querySelectorAll(".semester tbody tr").forEach(row => {
    const hours = parseFloat(row.querySelector(".hours").value) || 0;
    const grade = row.querySelector(".grade").value;
    const gradeValue = gradeMap[grade] || 0;
    const total = gradeValue * hours;

    const totalCell = row.querySelector(".total");
    if (totalCell) { totalCell.textContent = total.toFixed(2); }

    globalPoints += total;
    globalHours += hours;

    if (grade !== "F (0.0)" && grade !== "") { passedHours += hours; }
  });

  const gpa = globalHours ? globalPoints / globalHours : 0;
  const passedHoursElement = document.getElementById("passed-hours");
  if (passedHoursElement) { passedHoursElement.textContent = passedHours; }

  const remainingHours = 136 - passedHours;
  const globalHoursElement = document.getElementById("global-hours");
  if (globalHoursElement) { globalHoursElement.textContent = remainingHours > 0 ? remainingHours : 0; }

  const globalPointsElement = document.getElementById("global-points");
  if (globalPointsElement) { globalPointsElement.textContent = globalPoints.toFixed(2); }

  animateGPA(previousGPA, gpa);
  updateProgressBar(gpa);
  previousGPA = gpa;

  const letterElement = document.getElementById("global-letter");
  if (letterElement) { letterElement.textContent = globalHours === 0 ? "0" : getLetter(gpa); }

  if (!isLoading) { saveData(); }
}

// =====================================================
// ==================== GPA Animation ==================
// =====================================================

function animateGPA(start, end) {
  const el = document.getElementById("global-gpa");
  if (!el) return;

  const duration = 400;
  const startTime = performance.now();

  function frame(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const value = start + (end - start) * progress;
    el.textContent = value.toFixed(2);
    if (progress < 1) { requestAnimationFrame(frame); }
  }
  requestAnimationFrame(frame);
}

// =====================================================
// ================= Progress Bar ======================
// =====================================================

function updateProgressBar(gpa) {
  const bar = document.getElementById("gpa-bar");
  if (!bar) return;

  const percent = Math.max(0, Math.min(100, (gpa / 4) * 100));
  bar.style.width = percent + "%";
  bar.className = "gpa-bar";

  if (gpa >= 3.7) { bar.classList.add("excellent"); }
  else if (gpa >= 3) { bar.classList.add("verygood"); }
  else if (gpa >= 2) { bar.classList.add("good"); }
  else { bar.classList.add("danger"); }
}

// =====================================================
// ====================== Letter =======================
// =====================================================

function getLetter(gpa) {
  if (gpa >= 4) return "A+ ممتاز مرتفع";
  if (gpa >= 3.7) return "A ممتاز";
  if (gpa >= 3.4) return "A- ممتاز منخفض";
  if (gpa >= 3.2) return "B+ جيد جداً مرتفع";
  if (gpa >= 3) return "B جيد جداً";
  if (gpa >= 2.8) return "B- جيد جداً منخفض";
  if (gpa >= 2.6) return "C+ جيد مرتفع";
  if (gpa >= 2.4) return "C جيد";
  if (gpa >= 2.2) return "C- جيد منخفض";
  if (gpa >= 2) return "D+ مقبول مرتفع";
  if (gpa >= 1.5) return "D مقبول";
  if (gpa >= 1) return "D- مقبول منخفض";
  return "F راسب";
}

// =====================================================
// ===================== Save Data =====================
// =====================================================

function saveData() {
  const data = [];
  document.querySelectorAll(".semester").forEach(semester => {
    const subjects = [];
    semester.querySelectorAll("tbody tr").forEach(row => {
      const subjectSelect = row.querySelector(".subject-select");
      const customInput = row.querySelector(".custom-subject");
      const subjectName = subjectSelect.value === "__custom__" ? customInput.value.trim() : subjectSelect.value;

      subjects.push({
        name: subjectName,
        hours: row.querySelector(".hours").value,
        grade: row.querySelector(".grade").value,
        updated: row.classList.contains("updated-subject")
      });
    });
    data.push(subjects);
  });
  localStorage.setItem("gpaData", JSON.stringify(data));
}

// =====================================================
// ===================== Load Data =====================
// =====================================================

function loadData() {
  isLoading = true;
  const saved = localStorage.getItem("gpaData");
  if (!saved) { isLoading = false; return; }

  let data;
  try { data = JSON.parse(saved); }
  catch (error) { console.error("Error loading GPA data:", error); isLoading = false; return; }

  document.querySelectorAll(".semester").forEach((semester, index) => {
    const tbody = semester.querySelector("tbody");
    if (!tbody) return;
    tbody.innerHTML = "";
    if (!data[index]) return;

    data[index].forEach(sub => {
      const row = createRow(sub.name, sub.hours, sub.grade);
      if (sub.updated) { row.classList.add("updated-subject", "final"); }
      tbody.appendChild(row);
    });
  });

  calculate();
  isLoading = false;
}

// =====================================================
// ===================== Clear Level ===================
// =====================================================

function clearLevel(button) {
  if (!button) return;
  const level = button.closest(".level");
  if (!level) return;

  level.querySelectorAll("tbody").forEach(tbody => { tbody.innerHTML = ""; });
  calculate();
  saveData();
}

// =====================================================
// ===================== THEME TOGGLER =================
// =====================================================

function applyInitialTheme() {
  const saved = localStorage.getItem("theme");
  // الوضع الافتراضي داكن (Dark) إلا لو اختار المستخدم Light يدوياً سابقاً
  if (saved === "light") {
    setTheme(false);
  } else {
    setTheme(true);
  }
}

function toggleDarkMode() {
  const isCurrentlyLight = document.body.classList.contains("light-mode");
  // إذا كان فاتحاً، نقلبه لداكن (true). وإذا كان داكناً، نقلبه لفاتح (false).
  setTheme(isCurrentlyLight);
  localStorage.setItem("theme", isCurrentlyLight ? "dark" : "light");
}

function setTheme(isDark) {
  if (isDark) {
    document.body.classList.remove("light-mode");
  } else {
    document.body.classList.add("light-mode");
  }
  updateToggleButton(isDark);
}

function updateToggleButton(isDark) {
  const btn = document.getElementById("dark-mode-toggle");
  if (!btn) return;
  // في الوضع الداكن يظهر رمز الشمس للتحويل للنهار، وفي الفاتح يظهر الهلال للعودة ليلًا
  btn.innerHTML = isDark ? "☀️" : "🌙";
}

function setupThemeListener() {
  // تم إلغاء الربط التلقائي بالنظام لتثبيت أولوية الوضع الداكن الافتراضي
}

// =====================================================
// ================= PWA INSTALL ========================
// =====================================================

function setupInstallButton() {
  const installBtn = document.getElementById("install-btn");
  if (!installBtn) return;

  window.addEventListener("beforeinstallprompt", event => {
    event.preventDefault();
    deferredPrompt = event;
    installBtn.style.display = "inline-flex";
    setTimeout(() => { installBtn.classList.add("show"); }, 50);
  });

  installBtn.addEventListener("click", async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    try {
      const choice = await deferredPrompt.userChoice;
      if (choice && choice.outcome === "accepted") { hideInstallButton(); }
    } catch (error) { console.log("Install prompt error:", error); }
    deferredPrompt = null;
  });

  window.addEventListener("appinstalled", () => {
    hideInstallButton();
    deferredPrompt = null;
  });
}

function hideInstallButton() {
  const installBtn = document.getElementById("install-btn");
  if (!installBtn) return;
  installBtn.classList.remove("show");
  setTimeout(() => { installBtn.style.display = "none"; }, 300);
}

// =====================================================
// ===================== Start App ======================
// =====================================================

document.addEventListener("DOMContentLoaded", () => {
  applyInitialTheme();
  setupInstallButton();
  loadData();
});
