// ================== قائمة المواد ==================
const subjectsList = [
  "Human rights",
  "Calculus",
  "Physics",
  "Introduction to computer science",
  "Introduction to information system",
  "English language",
  "Linear Algebra",
  "Statistics and probability",
  "Object-oriented programming",
  "Introduction to database",
  "Logic design",
  "Discrete mathematics",
  "Operation research",
  "Data structures",
  "Microprocessor and assembly language",
  "System analysis and design",
  "Web programming",
  "Human computer introduction",
  "Mobile application development",
  "Numerical analysis",
  "Analysis of algorithms",
  "Computer graphics",
  "Computer architecture",
  "Software engineering",
  "Computer ethics",
  "Quality Assurance and Control",
  "Fundamentals of Multimedia",
  "Computer Design and Theory",
  "Embedded Systems",
  "Theory of Operating system",
  "Computer Networks",
  "Digital Image Processing",
  "Selected Topic in Computer Science 2",
  "Artificial Intelligence",
  "Cloud Computing",
  "Machine Learning",
  "Graduation Project 1",
  "Cyber Security",
  "Data Communication",
  "Graduation Project 2"
];

// ================== Grade Map ==================
const gradeMap = {
  "A+ (4.0)":4.0,
  "A (3.7)":3.7,
  "A- (3.4)":3.4,
  "B+ (3.2)":3.2,
  "B (3.0)":3.0,
  "B- (2.8)":2.8,
  "C+ (2.6)":2.6,
  "C (2.4)":2.4,
  "C- (2.2)":2.2,
  "D+ (2.0)":2.0,
  "D (1.5)":1.5,
  "D- (1.0)":1.0,
  "F (0.0)":0.0
};

// ================== State ==================
let previousGPA = 0;
let isLoading = false;

// ================== Generate Options ==================
function generateGradeOptions(){
  return Object.keys(gradeMap)
  .map(g=>`<option value="${g}">${g}</option>`)
  .join("");
}

// ================== Autocomplete Setup ==================
function setupAutocomplete(cell, row) {
  let autocompleteList = null;

  cell.addEventListener("input", function() {
    const value = this.textContent.trim();

    // إزالة القائمة القديمة
    if (autocompleteList) {
      autocompleteList.remove();
      autocompleteList = null;
    }

    // إذا كان الحقل فارغ
    if (!value) return;

    // تصفية المواد
    const filtered = subjectsList.filter(subject =>
      subject.toLowerCase().startsWith(value.toLowerCase())
    );

    // لا توجد نتائج
    if (filtered.length === 0) return;

    // إنشاء قائمة الاقتراحات
    autocompleteList = document.createElement("ul");
    autocompleteList.className = "autocomplete-list";
    autocompleteList.style.position = "absolute";
    autocompleteList.style.top = "100%";
    autocompleteList.style.right = "0";
    autocompleteList.style.left = "0";
    autocompleteList.style.zIndex = "1000";

    filtered.slice(0, 8).forEach(subject => {
      const li = document.createElement("li");
      li.textContent = subject;
      li.style.cursor = "pointer";
      li.style.padding = "10px 12px";
      li.style.borderBottom = "1px solid #f3f4f6";
      li.style.transition = "background 0.15s";
      
      li.addEventListener("mouseenter", function() {
        this.style.background = "#f1f5f9";
      });
      
      li.addEventListener("mouseleave", function() {
        this.style.background = "transparent";
      });
      
      li.addEventListener("click", function() {
        cell.textContent = subject;
        if (autocompleteList) {
          autocompleteList.remove();
          autocompleteList = null;
        }
        if (!handleDuplicate(row)) calculate();
      });
      
      autocompleteList.appendChild(li);
    });

    // إضافة القائمة
    cell.parentElement.style.position = "relative";
    cell.parentElement.appendChild(autocompleteList);
  });

  // إغلاق عند الضغط بعيداً
  document.addEventListener("click", function(e) {
    if (e.target !== cell && autocompleteList) {
      autocompleteList.remove();
      autocompleteList = null;
    }
  });

  // إغلاق عند Escape
  cell.addEventListener("keydown", function(e) {
    if (e.key === "Escape" && autocompleteList) {
      autocompleteList.remove();
      autocompleteList = null;
    }
  });
}

// ================== Create Row ==================
function createRow(name="",hours="0",grade=""){
  
  const row = document.createElement("tr");

  row.innerHTML = `
  <td contenteditable="true">${name}</td>
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

  // تفعيل Autocomplete
  const nameCell = row.children[0];
  setupAutocomplete(nameCell, row);

  attachRowEvents(row);

  return row;
}

// ================== Row Events ==================
function attachRowEvents(row){

  const hours = row.querySelector(".hours");
  const grade = row.querySelector(".grade");
  const name = row.children[0];

  hours.addEventListener("change",()=>{ if(!handleDuplicate(row)) calculate(); });
  grade.addEventListener("change",()=>{ if(!handleDuplicate(row)) calculate(); });
  name.addEventListener("blur",()=>{ if(!handleDuplicate(row)) calculate(); });

}

// ================== Add Subject ==================
function addSubject(btn){

  const semester = btn.closest(".semester");
  const tbody = semester.querySelector("tbody");

  const row = createRow();

  tbody.appendChild(row);

  calculate();
}

// ================== Handle Duplicate ==================
function handleDuplicate(row){

  const name = row.children[0].textContent.trim().toLowerCase();
  const hours = parseFloat(row.querySelector(".hours").value)||0;
  const grade = row.querySelector(".grade").value;

  if(!name || hours===0 || !grade) return false;

  const gradeValue = gradeMap[grade]||0;

  let duplicateRow = null;

  document.querySelectorAll(".semester tbody tr").forEach(r=>{

    if(r===row) return;

    const existingName = r.children[0].textContent.trim().toLowerCase();

    if(existingName===name){
      duplicateRow = r;
    }

  });

  if(!duplicateRow) return false;

  const existingGrade = duplicateRow.querySelector(".grade").value;
  const existingGradeValue = gradeMap[existingGrade]||0;

  if(gradeValue>existingGradeValue){

    duplicateRow.querySelector(".grade").value = grade;
    duplicateRow.querySelector(".hours").value = hours;

    duplicateRow.classList.remove("final");
    duplicateRow.classList.add("updated-subject");

    setTimeout(()=>{
      duplicateRow.classList.add("final");
      saveData();
    },1500);

  }

  row.classList.add("fade-out");

  row.addEventListener("transitionend",()=>{
    row.remove();
    calculate();
  },{once:true});

  return true;
}

// ================== Calculate GPA ==================
function calculate(){

  let globalPoints = 0;
  let globalHours = 0;

  document.querySelectorAll(".semester tbody tr").forEach(row=>{

    const hours = parseFloat(row.querySelector(".hours").value)||0;
    const grade = row.querySelector(".grade").value;

    const gradeValue = gradeMap[grade]||0;

    const total = gradeValue*hours;

    row.querySelector(".total").textContent = total.toFixed(2);

    globalPoints += total;
    globalHours += hours;

  });

  const gpa = globalHours ? (globalPoints/globalHours) : 0;

  document.getElementById("global-hours").textContent = globalHours;
  document.getElementById("global-points").textContent = globalPoints.toFixed(2);

  animateGPA(previousGPA,gpa);
  updateProgressBar(gpa);

  previousGPA = gpa;

  document.getElementById("global-letter").textContent =
    globalHours===0 ? "0" : getLetter(gpa);

  if(!isLoading){
    saveData();
  }
}

// ================== GPA Animation ==================
function animateGPA(start,end){

  const el = document.getElementById("global-gpa");

  const duration = 400;
  const startTime = performance.now();

  function frame(now){

    const progress = Math.min((now-startTime)/duration,1);

    const value = start + (end-start)*progress;

    el.textContent = value.toFixed(2);

    if(progress<1){
      requestAnimationFrame(frame);
    }

  }

  requestAnimationFrame(frame);
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
function getLetter(gpa){

  if(gpa>=4) return "A+ ممتاز مرتفع";
  if(gpa>=3.7) return "A ممتاز";
  if(gpa>=3.4) return "A- ممتاز منخفض";
  if(gpa>=3.2) return "B+ جيد جداً مرتفع";
  if(gpa>=3) return "B جيد جداً";
  if(gpa>=2.8) return "B- جيد جداً منخفض";
  if(gpa>=2.6) return "C+ جيد مرتفع";
  if(gpa>=2.4) return "C جيد";
  if(gpa>=2.2) return "C- جيد منخفض";
  if(gpa>=2) return "D+ مقبول مرتفع";
  if(gpa>=1.5) return "D مقبول";
  if(gpa>=1) return "D- مقبول منخفض";

  return "F راسب";

}

// ================== Save Data ==================
function saveData(){

  const data = [];

  document.querySelectorAll(".semester").forEach(semester=>{

    const subjects = [];

    semester.querySelectorAll("tbody tr").forEach(row=>{

      subjects.push({

        name: row.children[0].textContent,
        hours: row.querySelector(".hours").value,
        grade: row.querySelector(".grade").value,
        updated: row.classList.contains("updated-subject")

      });

    });

    data.push(subjects);

  });

  localStorage.setItem("gpaData",JSON.stringify(data));

}

// ================== Load Data ==================
function loadData(){

  isLoading = true;

  const saved = localStorage.getItem("gpaData");

  if(!saved){
    isLoading=false;
    return;
  }

  const data = JSON.parse(saved);

  document.querySelectorAll(".semester").forEach((semester,index)=>{

    const tbody = semester.querySelector("tbody");
    tbody.innerHTML="";

    if(!data[index]) return;

    data[index].forEach(sub=>{

      const row = createRow(sub.name,sub.hours,sub.grade);

      if(sub.updated){
        row.classList.add("updated-subject","final");
      }

      tbody.appendChild(row);

    });

  });

  calculate();

  isLoading=false;

}

// ================== Clear Level ==================
function clearLevel(button){

  const level = button.closest(".level");

  level.querySelectorAll("tbody").forEach(tb=>tb.innerHTML="");

  calculate();
  saveData();

}

// ================== DARK MODE ==================
function applyInitialTheme(){

  const saved = localStorage.getItem("theme");

  if(saved){
    const isDark = saved === "dark";
    setTheme(isDark);
    return;
  }

  const media = window.matchMedia("(prefers-color-scheme: dark)");

  if(media.matches !== undefined){
    setTheme(media.matches);
    return;
  }

  const hour = new Date().getHours();
  const isNight = hour >= 18 || hour < 6;

  setTheme(isNight);
}

function toggleDarkMode(){

  const isDark = !document.body.classList.contains("dark-mode");

  setTheme(isDark);

  localStorage.setItem("theme", isDark ? "dark" : "light");
}

function setTheme(isDark){

  document.body.classList.toggle("dark-mode", isDark);

  updateToggleButton(isDark);
}

function updateToggleButton(isDark){

  const btn = document.getElementById("dark-mode-toggle");

  if(!btn) return;

  btn.innerHTML = isDark ? "☀️" : "🌙";
}

window.matchMedia("(prefers-color-scheme: dark)")
.addEventListener("change", e => {

  if(!localStorage.getItem("theme")){
    setTheme(e.matches);
  }

});

// ================== Start App ==================
document.addEventListener("DOMContentLoaded",()=>{

  applyInitialTheme();
  loadData();

});

// ================== PWA INSTALL ==================
let deferredPrompt;

const installBtn = document.getElementById("install-btn");

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;

  installBtn.style.display = "inline-flex";

  setTimeout(() => {
    installBtn.classList.add("show");
  }, 50);
});

installBtn.addEventListener("click", async () => {

  if (!deferredPrompt) return;

  deferredPrompt.prompt();

  const choice = await deferredPrompt.userChoice;

  if (choice.outcome === "accepted") {
    hideInstallButton();
  }

  deferredPrompt = null;

});

window.addEventListener("appinstalled", () => {
  hideInstallButton();
});

function hideInstallButton(){
  installBtn.classList.remove("show");

  setTimeout(() => {
    installBtn.style.display = "none";
  }, 300);
}
