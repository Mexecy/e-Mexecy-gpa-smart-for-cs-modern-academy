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

// ================== Generate Grade Options ==================
function generateGradeOptions(){
  return Object.keys(gradeMap).map(g => {
    return `<option value="${g}">${g}</option>`;
  }).join("");
}

// ================== Handle Duplicate (Professional Way) ==================
function handleDuplicate(row){

  const name = row.children[0].textContent.trim().toLowerCase();
  const hours = parseFloat(row.querySelector(".hours").value) || 0;
  const grade = row.querySelector(".grade").value;

  // ✅ متتحركش غير لما البيانات تبقى كاملة
  if(!name || hours === 0 || !grade) return false;

  const gradeValue = gradeMap[grade] || 0;

  let duplicateRow = null;

  document.querySelectorAll(".semester tbody tr").forEach(r=>{
    if(r === row) return;

    const existingName = r.children[0].textContent.trim().toLowerCase();
    if(existingName === name){
      duplicateRow = r;
    }
  });

  if(duplicateRow){

  const existingGrade = duplicateRow.querySelector(".grade").value;
  const existingGradeValue = gradeMap[existingGrade] || 0;

  if(gradeValue > existingGradeValue){

    duplicateRow.querySelector(".grade").value = grade;
    duplicateRow.querySelector(".hours").value = hours;

    // الصف القديم يبقى أخضر دائم
    duplicateRow.classList.add("updated-subject");
  }

  // الصف الجديد يتلاشى
  row.classList.add("fade-out");

  setTimeout(()=>{
    row.remove();
    calculate();
  },400);

  return true;
}

  return false;
}
// ================== Add Subject ==================
function addSubject(btn){

  const semester = btn.closest(".semester");
  const tbody = semester.querySelector("tbody");

  const row = document.createElement("tr");

  row.innerHTML = `
    <td contenteditable="true"></td>
    <td>
      <input type="number" class="hours" value="0" min="0" step="1">
    </td>
    <td>
      <select class="grade">
        <option value="">0</option>
        ${generateGradeOptions()}
      </select>
    </td>
    <td class="total">0.00</td>
  `;

  row.querySelector(".hours").addEventListener("input", ()=>{
    if(!handleDuplicate(row)){
      calculate();
    }
  });

  row.querySelector(".grade").addEventListener("change", ()=>{
    if(!handleDuplicate(row)){
      calculate();
    }
  });

  row.children[0].addEventListener("blur", ()=>{
    if(!handleDuplicate(row)){
      calculate();
    }
  });

  tbody.appendChild(row);
  calculate();
}


// ================== Calculate ==================
function calculate(){

  let globalPoints = 0;
  let globalHours = 0;

  const rows = document.querySelectorAll(".semester tbody tr");

  rows.forEach(row => {

    const hours = parseFloat(row.querySelector(".hours").value) || 0;
    const grade = row.querySelector(".grade").value;
    const gradeValue = gradeMap[grade] || 0;

    const total = gradeValue * hours;

    row.querySelector(".total").textContent = total.toFixed(2);

    globalPoints += total;
    globalHours += hours;

  });

  const globalGPA = globalHours ? (globalPoints / globalHours) : 0;

  document.getElementById("global-hours").textContent = globalHours;
  document.getElementById("global-points").textContent = globalPoints.toFixed(2);
  document.getElementById("global-gpa").textContent = globalGPA.toFixed(2);
  document.getElementById("global-letter").textContent =
    globalHours === 0 ? "0" : getLetter(globalGPA);

  saveData();
}

// ================== Letter System ==================
function getLetter(gpa){

  if (gpa >= 4.0) return "A+ ممتاز مرتفع";
  if (gpa >= 3.7) return "A ممتاز";
  if (gpa >= 3.4) return "A- ممتاز منخفض";
  if (gpa >= 3.2) return "B+ جيد جداً مرتفع";
  if (gpa >= 3.0) return "B جيد جداً";
  if (gpa >= 2.8) return "B- جيد جداً منخفض";
  if (gpa >= 2.6) return "C+ جيد مرتفع";
  if (gpa >= 2.4) return "C جيد";
  if (gpa >= 2.2) return "C- جيد منخفض";
  if (gpa >= 2.0) return "D+ مقبول مرتفع";
  if (gpa >= 1.5) return "D مقبول";
  if (gpa >= 1.0) return "D- مقبول منخفض";

  return "F راسب";
}

// ================== Save Data ==================
function saveData(){

  const data = [];

  document.querySelectorAll(".semester").forEach(semester => {

    const subjects = [];

    semester.querySelectorAll("tbody tr").forEach(row => {

      subjects.push({
        name: row.children[0].textContent,
        hours: row.querySelector(".hours").value,
        grade: row.querySelector(".grade").value
      });

    });

    data.push(subjects);
  });

  localStorage.setItem("gpaData", JSON.stringify(data));
}

// ================== Load Data ==================
function loadData(){

  const saved = localStorage.getItem("gpaData");
  if(!saved) return;

  const data = JSON.parse(saved);

  document.querySelectorAll(".semester").forEach((semester,index)=>{

    const tbody = semester.querySelector("tbody");
    tbody.innerHTML = "";

    if(!data[index]) return;

    data[index].forEach(subject=>{

      const row = document.createElement("tr");

      row.innerHTML = `
        <td contenteditable="true">${subject.name}</td>
        <td>
          <input type="number" class="hours" value="${subject.hours}" min="0" step="1">
        </td>
        <td>
          <select class="grade">
            <option value="">0</option>
            ${generateGradeOptions()}
          </select>
        </td>
        <td class="total">0.00</td>
      `;

      row.querySelector(".grade").value = subject.grade;

      row.querySelector(".hours").addEventListener("input", ()=>{
        if(!handleDuplicate(row)){
          calculate();
        }
      });

      row.querySelector(".grade").addEventListener("change", ()=>{
        if(!handleDuplicate(row)){
          calculate();
        }
      });

      row.children[0].addEventListener("blur", ()=>{
        if(!handleDuplicate(row)){
          calculate();
        }
      });

      tbody.appendChild(row);
    });

  });

  calculate();
}

// ================== Clear Level ==================
function clearLevel(btn){
  const level = btn.closest(".level");
  level.querySelectorAll("tbody").forEach(tbody => tbody.innerHTML = "");
  calculate();
}

// ================== On Load ==================
window.onload = function () {
  loadData();
};
