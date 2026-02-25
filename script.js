// ================== Grade List ==================
const grades = [
  { letter: "A+", value: 4.0 },
  { letter: "A",  value: 3.7 },
  { letter: "A-", value: 3.4 },
  { letter: "B+", value: 3.2 },
  { letter: "B",  value: 3.0 },
  { letter: "B-", value: 2.8 },
  { letter: "C+", value: 2.6 },
  { letter: "C",  value: 2.4 },
  { letter: "C-", value: 2.2 },
  { letter: "D+", value: 2.0 },
  { letter: "D",  value: 1.5 },
  { letter: "D-", value: 1.0 },
  { letter: "F",  value: 0.0 }
];

let previousGPA = 0;

// ================== Generate Grade Options ==================
function generateGradeOptions(){
  return grades.map(g =>
    `<option value="${g.value}">\u202A${g.letter} (${g.value.toFixed(1)})\u202C</option>`
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
        ${[0,1,2,3,4].map(h=>`<option value="${h}">${h}</option>`).join("")}
      </select>
    </td>
    <td>
      <select class="grade">
        <option value="0">0</option>
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

  row.querySelector(".hours").addEventListener("change", calculate);
  row.querySelector(".grade").addEventListener("change", calculate);
  row.children[0].addEventListener("blur", calculate);
}

// ================== Calculate ==================
function calculate(){

  let totalPoints = 0;
  let totalHours = 0;

  document.querySelectorAll(".semester tbody tr").forEach(row => {

    const hours = parseFloat(row.querySelector(".hours").value) || 0;
    const gradeValue = parseFloat(row.querySelector(".grade").value) || 0;

    const total = gradeValue * hours;
    row.querySelector(".total").textContent = total.toFixed(2);

    totalPoints += total;
    totalHours += hours;
  });

  const gpa = totalHours ? totalPoints / totalHours : 0;

  document.getElementById("global-hours").textContent = totalHours;
  document.getElementById("global-points").textContent = totalPoints.toFixed(2);

  animateGPA(previousGPA, gpa);
  updateProgressBar(gpa);

  previousGPA = gpa;

  document.getElementById("global-letter").textContent =
    totalHours === 0 ? "0" : getLetter(gpa);

  saveData();
}

// ================== GPA Animation ==================
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

  if(gpa >= 3.7) bar.style.background = "#16a34a";
  else if(gpa >= 3.0) bar.style.background = "#22c55e";
  else if(gpa >= 2.0) bar.style.background = "#eab308";
  else bar.style.background = "#dc2626";
}

// ================== Letter System ==================
function getLetter(gpa){

  if (gpa >= 4.0) return "A+ ممتاز مرتفع";
  if (gpa >= 3.7) return "A ممتاز";
  if (gpa >= 3.4) return "A- ممتاز منخفض";

  if (gpa >= 3.2) return "B+ جيد جداً مرتفع";
  if (gpa >= 3.0) return "B جيد جداً";
  if (gpa >= 2.8) return "B- جيد";

  if (gpa >= 2.6) return "C+ مقبول مرتفع";
  if (gpa >= 2.4) return "C مقبول";
  if (gpa >= 2.2) return "C- مقبول منخفض";

  if (gpa >= 2.0) return "D+ ضعيف مرتفع";
  if (gpa >= 1.5) return "D ضعيف";
  if (gpa >= 1.0) return "D- ضعيف جداً";

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
        grade: row.querySelector(".grade").value
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
            ${[0,1,2,3,4].map(h=>`<option value="${h}">${h}</option>`).join("")}
          </select>
        </td>
        <td>
          <select class="grade">
            <option value="0">0</option>
            ${generateGradeOptions()}
          </select>
        </td>
        <td class="total">0.00</td>
      `;

      row.querySelector(".grade").value = subject.grade;
      row.querySelector(".hours").value = subject.hours;

      addRowEvents(row);
      tbody.appendChild(row);
    });

  });

  calculate();
}

// ================== Clear Level ==================
function clearLevel(button){

  const level = button.closest(".level");
  level.querySelectorAll("tbody").forEach(tbody=> tbody.innerHTML = "");

  calculate();
  saveData();
}
