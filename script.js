const gradeMap = {
  "A": 4.0, "A-": 3.4,
  "B+": 3.2, "B": 3.0, "B-": 2.8,
  "C+": 2.6, "C": 2.4, "C-": 2.2,
  "D+": 2.0, "D": 1.5, "D-": 1.0,
  "F": 0.0
};

function addSubject(btn) {

  // نجيب نفس الفصل (semester أو summer)
  const container = btn.parentElement;
  const tbody = container.querySelector("tbody");

  if (!tbody) {
    alert("مش لاقي الجدول");
    return;
  }

  const row = document.createElement("tr");

  row.innerHTML = `
    <td contenteditable="true"></td>
    <td contenteditable="true" class="hours">0</td>
    <td class="grade">0</td>
    <td class="points">0</td>
  `;

  // اختيار التقدير
  row.querySelector(".grade").addEventListener("click", function () {

    const select = document.createElement("select");

    select.innerHTML =
      `<option value="0">0</option>` +
      Object.keys(gradeMap)
        .map(g => `<option value="${g}">${g}</option>`)
        .join("");

    this.innerHTML = "";
    this.appendChild(select);
    select.focus();

    select.addEventListener("change", () => {
      this.textContent = select.value;
      calculate();
    });
  });

  // تعديل الساعات
  row.querySelector(".hours").addEventListener("input", () => {
    calculate();
  });

  tbody.appendChild(row);

  calculate();
}

function calculate() {

  let globalHours = 0;
  let globalPoints = 0;

  // نلف على كل الجداول
  document.querySelectorAll("tbody").forEach(tbody => {

    tbody.querySelectorAll("tr").forEach(row => {

      const hours = parseFloat(row.querySelector(".hours").textContent) || 0;
      const gradeText = row.querySelector(".grade").textContent;
      const gradeValue = gradeMap[gradeText] ?? 0;
      const points = hours * gradeValue;

      row.querySelector(".points").textContent = points.toFixed(2);

      globalHours += hours;
      globalPoints += points;
    });
  });

  const globalGPA = globalHours ? (globalPoints / globalHours) : 0;

  const hoursEl = document.getElementById("global-hours");
  const pointsEl = document.getElementById("global-points");
  const gpaEl = document.getElementById("global-gpa");
  const letterEl = document.getElementById("global-letter");

  if (hoursEl) hoursEl.textContent = globalHours;
  if (pointsEl) pointsEl.textContent = globalPoints.toFixed(2);
  if (gpaEl) gpaEl.textContent = globalGPA.toFixed(2);
  if (letterEl) letterEl.textContent = getLetter(globalGPA);
}

function getLetter(gpa) {
  if (gpa >= 3.7) return "امتياز";
  if (gpa >= 3.0) return "جيد جداً";
  if (gpa >= 2.0) return "جيد";
  if (gpa >= 1.0) return "مقبول";
  return "راسب";
}

function clearLevel(btn) {

  // نجيب المستوى نفسه بس
  const level = btn.closest(".level");

  if (!level) return;

  level.querySelectorAll("tbody").forEach(tbody => {
    tbody.innerHTML = "";
  });

  calculate();
}

window.onload = function () {
  calculate();
};
