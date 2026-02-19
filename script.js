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

function addSubject(btn){

const semester = btn.closest(".semester");
const tbody = semester.querySelector("tbody");

const row = document.createElement("tr");

row.innerHTML = `
<td contenteditable="true"></td>

<td contenteditable="true" class="hours">0</td>

<td>
<select class="grade">
<option value="">اختر</option>
${Object.keys(gradeMap).map(g=>`<option value="${g}">${g}</option>`).join("")}
</select>
</td>

<td class="points">0</td>
`;

row.querySelector(".hours").addEventListener("input", calculate);
row.querySelector(".grade").addEventListener("change", calculate);

tbody.appendChild(row);

calculate();
}

function calculate(){

let totalHours=0;
let totalPoints=0;

document.querySelectorAll("tbody tr").forEach(row=>{

const hours=parseFloat(row.querySelector(".hours").textContent)||0;
const grade=row.querySelector(".grade").value;
const value=gradeMap[grade]||0;

const points=hours*value;
row.querySelector(".points").textContent=points.toFixed(2);

totalHours+=hours;
totalPoints+=points;
});

const gpa= totalHours? totalPoints/totalHours : 0;

document.getElementById("global-hours").textContent=totalHours;
document.getElementById("global-points").textContent=totalPoints.toFixed(2);
document.getElementById("global-gpa").textContent=gpa.toFixed(2);
document.getElementById("global-letter").textContent=getLetter(gpa);
}

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

function clearLevel(btn){
const level=btn.closest(".level");
level.querySelectorAll("tbody").forEach(t=>t.innerHTML="");
calculate();
}
