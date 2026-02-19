const gradeMap = {
A:4, "A-":3.7,
"B+":3.3, B:3, "B-":2.7,
"C+":2.3, C:2, "C-":1.7,
"D+":1.3, D:1,
F:0
};

function addSubject(btn){

const semester = btn.closest(".semester");
const tbody = semester.querySelector("tbody");

const row = document.createElement("tr");

row.innerHTML = `
<td contenteditable="true"></td>
<td contenteditable="true" class="hours">0</td>
<td class="grade">اختر</td>
<td class="points">0</td>
`;

row.querySelector(".grade").addEventListener("click",function(){

const select = document.createElement("select");
select.innerHTML = `<option>اختر</option>` +
Object.keys(gradeMap).map(g=>`<option>${g}</option>`).join("");

this.innerHTML="";
this.appendChild(select);
select.focus();

select.addEventListener("change",()=>{
this.textContent=select.value;
calculate();
});
});

row.querySelector(".hours").addEventListener("input",calculate);

tbody.appendChild(row);
calculate();
}

function calculate(){

let totalHours=0;
let totalPoints=0;

document.querySelectorAll("tbody tr").forEach(row=>{

const hours=parseFloat(row.querySelector(".hours").textContent)||0;
const grade=row.querySelector(".grade").textContent;
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
if(gpa>=3.7)return "امتياز";
if(gpa>=3)return "جيد جداً";
if(gpa>=2)return "جيد";
if(gpa>=1)return "مقبول";
return "راسب";
}

function clearLevel(btn){
const level=btn.closest(".level");
level.querySelectorAll("tbody").forEach(t=>t.innerHTML="");
calculate();
}
