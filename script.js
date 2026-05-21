// ================== Grade Map ==================

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

// ================== Subjects ==================

const subjectsData = [

  { name: "Human rights", hours: "2" },

  { name: "Calcuse", hours: "3" },

  { name: "Physecs", hours: "3" },

  { name: "Introduction to computer science", hours: "3" },

  { name: "Computer programing", hours: "3" },

  { name: "Introduction to information system", hours: "3" },

  { name: "English language", hours: "2" },

  { name: "Linear Algebra", hours: "3" },

  { name: "Statistics and probability", hours: "3" },

  { name: "Object-oriented programming", hours: "3" },

  { name: "Introduction to database", hours: "3" },

  { name: "Logic design", hours: "3" },

  { name: "Discrart mathematics", hours: "3" },

  { name: "Operation research", hours: "3" },

  { name: "Data structures", hours: "3" },

  { name: "Microprocessor and assembly language", hours: "3" },

  { name: "System analysis and design", hours: "3" },

  { name: "Web programing", hours: "3" },

  { name: "Human computer introduction", hours: "3" },

  { name: "Mobile application development", hours: "3" },

  { name: "Numerical analysis", hours: "3" },

  { name: "Analysis of algorithms", hours: "3" },

  { name: "Computer graphic", hours: "3" },

  { name: "Computer architecture", hours: "3" },

  { name: "Software engineering", hours: "3" },

  { name: "Computer ethics", hours: "2" },

  { name: "Quality Assurance and Control", hours: "3" },

  { name: "Fundamentals of Multimedia", hours: "3" },

  { name: "Computer Design and Theory", hours: "3" },

  { name: "Embedded Systems", hours: "3" },

  { name: "Theory of Operating system", hours: "3" },

  { name: "Computer Networks", hours: "3" },

  { name: "Digital Image Processing", hours: "3" },

  { name: "Selected Topic in Computer Science", hours: "3" },

  { name: "Artificial Intelligence", hours: "3" },

  { name: "Cloud Computing", hours: "3" },

  { name: "Machine Learning", hours: "3" },

  { name: "Graduation Project 1", hours: "3" },

  { name: "Cyber Security", hours: "3" },

  { name: "Data Communication", hours: "3" },

  { name: "Graduation Project 2", hours: "3" }

];

// ================== State ==================

let previousGPA = 0;

let isLoading = false;

// ================== Generate Grade Options ==================

function generateGradeOptions() {

  return Object.keys(gradeMap)

    .map(g => `<option value="${g}">${g}</option>`)

    .join("");

}

// ================== Create Row ==================

function createRow(name = "", hours = "0", grade = "") {

  const row = document.createElement("tr");

  row.innerHTML = `

    <td>
    
   <input
type="text"
class="subject-input"
placeholder="اسم المادة"
value="${name}"
autocomplete="off"
spellcheck="false"
>
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
  
  row.querySelector(".hours").value = hours;

  row.querySelector(".grade").value = grade;

  attachRowEvents(row);

  return row;

}

// ================== Row Events ==================
function attachRowEvents(row) {

  const hours = row.querySelector(".hours");

  const grade = row.querySelector(".grade");

  const subjectInput = row.querySelector(".subject-input");

  hours.addEventListener("change", () => {

    if (!handleDuplicate(row)) calculate();

  });

  grade.addEventListener("change", () => {

    if (!handleDuplicate(row)) calculate();

  });

 subjectInput.addEventListener("input",()=>{

  const subjectName =
  subjectInput.value.trim().toLowerCase();

  if(subjectName.length < 1){

    row.querySelector(".hours").value = "0";

    calculate();
    return;
  }

  const found = subjectsData.find(
    s => s.name.toLowerCase().startsWith(subjectName)
  );

  if(found){

    subjectInput.value = found.name;

    row.querySelector(".hours").value =
    found.hours;

    // يحدد الجزء المكمل تلقائي
    setTimeout(()=>{

      subjectInput.setSelectionRange(
        subjectName.length,
        found.name.length
      );

    },0);

  }

 if(!handleDuplicate(row)) calculate();

});

} 

// ================== Add Subject ==================

function addSubject(btn) {

  const semester = btn.closest(".semester");

  const tbody = semester.querySelector("tbody");

  const row = createRow();

  tbody.appendChild(row);

  calculate();

}


// ================== Handle Duplicate ==================

function handleDuplicate(row) {

  const name = row

    .querySelector(".subject-input")

    .value

    .trim()

    .toLowerCase();

  const hours = parseFloat(row.querySelector(".hours").value) || 0;

  const grade = row.querySelector(".grade").value;

  if (!name || hours === 0 || !grade) return false;

  const gradeValue = gradeMap[grade] || 0;

  let duplicateRow = null;

  document.querySelectorAll(".semester tbody tr").forEach(r => {

    if (r === row) return;

    const existingName = r

      .querySelector(".subject-input")

      .value

      .trim()

      .toLowerCase();

    if (existingName === name) {

      duplicateRow = r;

    }

  });


  if (!duplicateRow) return false;


  const existingGrade = duplicateRow.querySelector(".grade").value;

  const existingGradeValue = gradeMap[existingGrade] || 0;

  if (gradeValue > existingGradeValue) {

    duplicateRow.querySelector(".grade").value = grade;

    duplicateRow.querySelector(".hours").value = hours;

    duplicateRow.classList.remove("final");

    duplicateRow.classList.add("updated-subject");

    setTimeout(() => {

      duplicateRow.classList.add("final");

      saveData();

    }, 1500);

  }

  row.classList.add("fade-out");

  row.addEventListener(

    "transitionend",

    () => {

      row.remove();

      calculate();

    },

    { once: true }

  );


  return true;

}


// ================== Calculate GPA ==================

function calculate() {

  let globalPoints = 0;

  let globalHours = 0;

  let passedHours = 0;

  document.querySelectorAll(".semester tbody tr").forEach(row => {

    const hours = parseFloat(row.querySelector(".hours").value) || 0;

    const grade = row.querySelector(".grade").value;

    const gradeValue = gradeMap[grade] || 0;

    const total = gradeValue * hours;

    row.querySelector(".total").textContent = total.toFixed(2);

    globalPoints += total;

    globalHours += hours;

    if (grade !== "F (0.0)" && grade !== "") {

      passedHours += hours;

    }

  });

  const gpa = globalHours ? globalPoints / globalHours : 0;

  document.getElementById("passed-hours").textContent = passedHours;

  document.getElementById("global-hours").textContent = globalHours;

  document.getElementById("global-points").textContent = globalPoints.toFixed(2);

  document.getElementById("global-gpa").textContent = gpa.toFixed(2);

 updateProgressBar(gpa);
  
  previousGPA = gpa;

  document.getElementById("global-letter").textContent =

    globalHours === 0 ? "0" : getLetter(gpa);

  if (!isLoading) {

    saveData();

  }

}

// ================== Progress Bar ==================
function updateProgressBar(gpa){

  const bar = document.getElementById("gpa-bar");
  if(!bar) return;

  const percent = (gpa/4)*100;

  bar.style.width = percent+"%";

  bar.className = "gpa-bar";

  if(gpa>=3.7) bar.classList.add("excellent");
  else if(gpa>=3) bar.classList.add("verygood");
  else if(gpa>=2) bar.classList.add("good");
  else bar.classList.add("danger");

}


// ================== Letter ==================

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


// ================== Save Data ==================

function saveData() {

  const data = [];


  document.querySelectorAll(".semester").forEach(semester => {

    const subjects = [];


    semester.querySelectorAll("tbody tr").forEach(row => {

      subjects.push({

        name: row.querySelector(".subject-input").value,

        hours: row.querySelector(".hours").value,

        grade: row.querySelector(".grade").value,

        updated: row.classList.contains("updated-subject")

      });

    });


    data.push(subjects);

  });

  localStorage.setItem("gpaData", JSON.stringify(data));

}

// ================== Load Data ==================

function loadData() {

  isLoading = true;

  const saved = localStorage.getItem("gpaData");

  if (!saved) {

    isLoading = false;

    return;

  }

  const data = JSON.parse(saved);

  document.querySelectorAll(".semester").forEach((semester, index) => {

    const tbody = semester.querySelector("tbody");

    tbody.innerHTML = "";

if (!data[index]) return;

    data[index].forEach(sub => {

      const row = createRow(sub.name, sub.hours, sub.grade);

      if (sub.updated) {

        row.classList.add("updated-subject", "final");

      }


      tbody.appendChild(row);

    });

  });

  calculate();

  isLoading = false;

}
// ================== Clear Level ==================

function clearLevel(button) {

  const level = button.closest(".level");

  level.querySelectorAll("tbody").forEach(tb => {

    tb.innerHTML = "";

  });


  calculate();

  saveData();

}



// ================== DARK MODE ==================
// ================== DARK MODE PRO ==================

function applyInitialTheme(){

  const saved = localStorage.getItem("theme");

  // 1️⃣ لو المستخدم مختار يدوي
  if(saved){
    const isDark = saved === "dark";
    setTheme(isDark);
    return;
  }

  // 2️⃣ لو الجهاز بيدعم الوضع الليلي
  const media = window.matchMedia("(prefers-color-scheme: dark)");

  if(media.matches !== undefined){
    setTheme(media.matches);
    return;
  }

  // 3️⃣ fallback: حسب الوقت
  const hour = new Date().getHours();
  const isNight = hour >= 18 || hour < 6;

  setTheme(isNight);
}


// تغيير يدوي
function toggleDarkMode(){

  const isDark = !document.body.classList.contains("dark-mode");

  setTheme(isDark);

  localStorage.setItem("theme", isDark ? "dark" : "light");
}


// تطبيق الثيم
function setTheme(isDark){

  document.body.classList.toggle("dark-mode", isDark);

  updateToggleButton(isDark);
}


// تحديث شكل الزر
function updateToggleButton(isDark){

  const btn = document.getElementById("dark-mode-toggle");

  if(!btn) return;

  btn.innerHTML = isDark ? "☀️" : "🌙";
}


// يتغير تلقائي لو نظام الجهاز اتغير
window.matchMedia("(prefers-color-scheme: dark)")
.addEventListener("change", e => {

  // لو المستخدم مختارش يدوي
  if(!localStorage.getItem("theme")){
    setTheme(e.matches);
  }

});
// ================== PWA INSTALL ==================
let deferredPrompt;

const installBtn = document.getElementById("install-btn");

// يظهر الزر لما يكون التثبيت متاح
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;

  installBtn.style.display = "inline-flex";

  setTimeout(() => {
    installBtn.classList.add("show");
  }, 50);
});

// عند الضغط على الزر
installBtn.addEventListener("click", async () => {

  if (!deferredPrompt) return;

  deferredPrompt.prompt();

  const choice = await deferredPrompt.userChoice;

  if (choice.outcome === "accepted") {
    hideInstallButton();
  }

  deferredPrompt = null;

});

// عند التثبيت من أي مكان
window.addEventListener("appinstalled", () => {
  hideInstallButton();
});

// function موحدة للإخفاء
function hideInstallButton(){
  installBtn.classList.remove("show");

  setTimeout(() => {
    installBtn.style.display = "none";
  }, 300);
}


// ================== Start App ==================

document.addEventListener("DOMContentLoaded", () => {

  createLevels();

  applyInitialTheme();

  loadData();
});
