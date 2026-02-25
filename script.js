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

let previousGPA = 0;

// ================== Generate Grade Options ==================
function generateGradeOptions(){
  return Object.keys(gradeMap).map(g =>
    `<option value="${g}">${g}</option>`
  ).join("");
}

// ================== Add Subject ==================
function addSubject(btn){

  const semester = btn.closest(".semester");
  const tbody = semester.querySelector("tbody");

  const row = document.createElement("tr");
  row.innerHTML = `
    <td contenteditable="true"></td>
    <td>
      <select class="hours">
        <option value="0" selected>0</option>
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

  addRowEvents(row);
  tbody.appendChild(row);
  calculate();
}

// ================== Row Events ==================
function addRowEvents(row){

  row.querySelector(".hours").addEventListener("change", ()=>{
    if(!handleDuplicate(row)) calculate();
  });

  row.querySelector(".grade").addEventListener("change", ()=>{
    if(!handleDuplicate(row)) calculate();
  });

  row.children[0].addEventListener("blur", ()=>{
    if(!handleDuplicate(row)) calculate();
  });
}

// ================== Handle Duplicate ==================
function handleDuplicate(row){

  const name = row.children[0].textContent.trim().toLowerCase();
  if(!name) return false;

  let duplicate = null;

  document.querySelectorAll(".semester tbody tr").forEach(r=>{
    if(r !== row){
      const existing = r.children[0].textContent.trim().toLowerCase();
      if(existing === name) duplicate = r;
    }
  });

  if(duplicate){

    const newGrade = gradeMap[row.querySelector(".grade").value] || 0;
    const oldGrade = gradeMap[duplicate.querySelector(".grade").value] || 0;

    if(newGrade > oldGrade){
      duplicate.querySelector(".grade").value = row.querySelector(".grade").value;
      duplicate.querySelector(".hours").value = row.querySelector(".hours").value;

      duplicate.classList.remove("final");
      duplicate.classList.add("updated-subject");

      setTimeout(()=>{
        duplicate.classList.add("final");
      },1200);
    }

    row.classList.add("fade-out");
    setTimeout(()=>{
      row.remove();
      calculate();
    },500);

    return true;
  }

  return false;
}

// ================== Calculate ==================
function calculate(){

  let totalPoints = 0;
  let totalHours = 0;

  document.querySelectorAll(".semester tbody tr").forEach(row => {

    const hours = parseFloat(row.querySelector(".hours").value) || 0;
    const grade = row.querySelector(".grade").value;
    const value = gradeMap[grade] || 0;

    const total = value * hours;
    row.querySelector(".total").textContent = total.toFixed(2);

    totalPoints += total;
    totalHours += hours;
  });

  const gpa = totalHours ? (totalPoints / totalHours) : 0;

  document.getElementById("global-hours").textContent = totalHours;
  document.getElementById("global-points").textContent = totalPoints.toFixed(2);

  animateGPA(previousGPA, gpa);
  updateProgressBar(gpa);

  previousGPA = gpa;

  document.getElementById("global-letter").textContent =
    totalHours === 0 ? "0" : getLetter(gpa);

  saveData();
}

// ================== Animated GPA ==================
function animateGPA(start, end){

  const duration = 400;
  const startTime = performance.now();
  const el = document.getElementById("global-gpa");

  function update(currentTime){
    const progress = Math.min((currentTime - startTime) / duration, 1);
    const value = start + (end - start) * progress;
    el.textContent = value.toFixed(2);

    if(progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

// ================== Progress Bar ==================
function updateProgressBar(gpa){

  const bar = document.getElementById("gpa-bar");
  const percent = (gpa / 4) * 100;
  bar.style.width = percent + "%";

  if(gpa >= 3.7){
    bar.style.background = "#16a34a";
  } else if(gpa >= 3.0){
    bar.style.background = "#22c55e";
  } else if(gpa >= 2.0){
    bar.style.background = "#eab308";
  } else {
    bar.style.background = "#dc2626";
  }
}

// ================== Letter System ==================
function getLetter(gpa){

  if (gpa >= 4.0) return "A+ ممتاز مرتفع";
  if (gpa >= 3.7) return "A ممتاز";
  if (gpa >= 3.4) return "A- ممتاز منخفض";
  if (gpa >= 3.0) return "B جيد جداً";
  if (gpa >= 2.0) return "C مقبول";
  return "F راسب";
}

// ================== Save ==================
function saveData(){

  const data = [];

  document.querySelectorAll(".semester").forEach(semester => {

    const subjects = [];

    semester.querySelectorAll("tbody tr").forEach(row => {

      subjects.push({
        name: row.children[0].textContent,
        hours: row.querySelector(".hours").value,
        grade: row.querySelector(".grade").value,
        updated: row.classList.contains("updated-subject")
      });

    });

    data.push(subjects);
  });

  localStorage.setItem("gpaData", JSON.stringify(data));
}

// ================== Load ==================
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

      row.querySelector(".grade").value = subject.grade;
      row.querySelector(".hours").value = subject.hours;

      if(subject.updated){
        row.classList.add("updated-subject","final");
      }

      addRowEvents(row);
      tbody.appendChild(row);
    });

  });

  calculate();
}

// ================== Clear Level ==================
function clearLevel(button){

  const level = button.closest(".level");

  level.querySelectorAll("tbody").forEach(tbody=>{
    tbody.innerHTML = "";
  });

  calculate();
  saveData();
}
