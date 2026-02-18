const gradeMap = {
  "A": 4.0, "A-": 3.4,
  "B+": 3.2, "B": 3.0, "B-": 2.8,
  "C+": 2.6, "C": 2.4, "C-": 2.2,
  "D+": 2.0, "D": 1.5, "D-": 1.0,
  "F": 0.0
};

function addSubject(btn) {
  const semester = btn.parentElement;
  const tbody = semester.querySelector("tbody");

  const row = document.createElement("tr");

  row.innerHTML = `
    <td contenteditable="true"></td>
    <td contenteditable="true" class="hours">0</td>
    <td class="grade">0</td>
    <td class="points">0</td>
  `;

  row.querySelector(".grade").addEventListener("click", function () {
    const select = document.createElement("select");
    select.innerHTML = `<option value="0">0</option>` +
      Object.keys(gradeMap).map(g => `<option value="${g}">${g}</option>`).join("");

    this.innerHTML = "";
    this.appendChild(select);
    select.focus();

    select.addEventListener("change", () => {
      this.textContent = select.value;
      calculate();
      
    
  });

  row.querySelector(".hours").addEventListener("input", () => {
    calculate();
    
  });

  tbody.appendChild(row);
}

function calculate() {
  let globalHours = 0;
  let globalPoints = 0;

  document.querySelectorAll(".level").forEach(level => {
    let totalHours = 0;
    let totalPoints = 0;

    const subjects = {};

    level.querySelectorAll("tbody tr").forEach(row => {
      const name = row.children[0].textContent.trim();
      const hours = parseFloat(row.querySelector(".hours").textContent) || 0;
      const gradeText = row.querySelector(".grade").textContent;
      const gradeValue = gradeMap[gradeText] ?? 0;
      const points = hours * gradeValue;

      row.querySelector(".points").textContent = points.toFixed(2);

      if (!subjects[name] || subjects[name] < gradeValue) {
        subjects[name] = gradeValue;
      }

      totalHours += hours;
      totalPoints += points;
    });

    const gpa = totalHours ? (totalPoints / totalHours) : 0;

    level.querySelector(".total-hours")?.textContent = totalHours;
    level.querySelector(".total-points")?.textContent = totalPoints.toFixed(2);
    level.querySelector(".gpa")?.textContent = gpa.toFixed(2);
    level.querySelector(".gpa-letter")?.textContent = getLetter(gpa);

    globalHours += totalHours;
    globalPoints += totalPoints;
  });

  const globalGPA = globalHours ? (globalPoints / globalHours) : 0;

  document.getElementById("global-hours").textContent = globalHours;
  document.getElementById("global-points").textContent = globalPoints.toFixed(2);
  document.getElementById("global-gpa").textContent = globalGPA.toFixed(2);
  document.getElementById("global-letter").textContent = getLetter(globalGPA);
}

function getLetter(gpa) {
  if (gpa >= 3.7) return "امتياز";
  if (gpa >= 3.0) return "جيد جداً";
  if (gpa >= 2.0) return "جيد";
  if (gpa >= 1.0) return "مقبول";
  return "راسب";
}

function clearLevel(btn) {
  const level = btn.closest(".level");
  level.querySelectorAll("tbody").forEach(t => t.innerHTML = "");
  calculate();
}

window.onload = function () {
  calculate();
};

