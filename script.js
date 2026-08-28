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


// ================== State ==================

let previousGPA = 0;
let isLoading = false;


// ================== Generate Grade Options ==================

function generateGradeOptions(){

  return Object.keys(gradeMap)
    .map(g => `<option value="${g}">${g}</option>`)
    .join("");

}


// ================== Generate Subject Options ==================

function generateSubjectOptions(){

  let options = `
    <option value="" disabled selected>
      Select Subject
    </option>
  `;

  for(const group in subjectsData){

    options += `
      <optgroup label="📘 ${group}">
    `;

    subjectsData[group].forEach(subject => {

      options += `
        <option value="${subject}">${subject}</option>
      `;

    });

    options += `</optgroup>`;

  }

  options += `
    <option value="__custom__">
      Other / مادة أخرى
    </option>
  `;

  return options;

}


// ================== Create Row ==================

function createRow(name = "", hours = "0", grade = ""){

  const row = document.createElement("tr");

  row.innerHTML = `

    <td class="subject-cell">

      <select class="subject-select">
        ${generateSubjectOptions()}
      </select>

      <input
        type="text"
        class="custom-subject"
        placeholder="Write subject name"
        style="display:none; margin-top:6px;"
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


  const hoursSelect = row.querySelector(".hours");
  const gradeSelect = row.querySelector(".grade");
  const subjectSelect = row.querySelector(".subject-select");
  const customInput = row.querySelector(".custom-subject");


  hoursSelect.value = hours || "0";
  gradeSelect.value = grade || "";


  // ================================
  // تحميل اسم المادة
  // ================================

  const allSubjects = Object.values(subjectsData).flat();

  if(name && allSubjects.includes(name)){

    subjectSelect.value = name;

  }

  else if(name){

    subjectSelect.value = "__custom__";

    customInput.style.display = "block";
    customInput.value = name;

  }

  else{

    subjectSelect.value = "";

  }


  // ================================
  // تحسين اتجاه اسم المادة
  // ================================

  subjectSelect.style.direction = "ltr";
  subjectSelect.style.textAlign = "left";
  subjectSelect.style.textAlignLast = "left";


  attachRowEvents(row);

  return row;

}


// ================== Row Events ==================

function attachRowEvents(row){

  const hours = row.querySelector(".hours");
  const grade = row.querySelector(".grade");
  const subject = row.querySelector(".subject-select");
  const customInput = row.querySelector(".custom-subject");


  // ================================
  // الساعات
  // ================================

  hours.addEventListener("change", () => {

    if(!handleDuplicate(row)){
      calculate();
    }

  });


  // ================================
  // التقدير
  // ================================

  grade.addEventListener("change", () => {

    if(!handleDuplicate(row)){
      calculate();
    }

  });


  // ================================
  // اسم المادة
  // ================================

  subject.addEventListener("change", () => {

    if(subject.value === "__custom__"){

      customInput.style.display = "block";

      setTimeout(() => {
        customInput.focus();
      }, 50);

    }

    else{

      customInput.style.display = "none";
      customInput.value = "";

    }


    if(!handleDuplicate(row)){
      calculate();
    }

  });


  // ================================
  // المادة اليدوية
  // ================================

  customInput.addEventListener("input", () => {

    if(!handleDuplicate(row)){
      calculate();
    }

  });

}


// ================== Add Subject ==================

function addSubject(btn){

  const semester = btn.closest(".semester");

  if(!semester) return;

  const tbody = semester.querySelector("tbody");

  if(!tbody) return;

  const row = createRow();

  tbody.appendChild(row);

  calculate();

}


// ================== Get Subject Name ==================

function getSubjectName(row){

  const subjectSelect = row.querySelector(".subject-select");
  const customInput = row.querySelector(".custom-subject");

  if(!subjectSelect) return "";

  let name = "";

  if(subjectSelect.value === "__custom__"){

    name = customInput ? customInput.value : "";

  }

  else{

    name = subjectSelect.value;

  }

  return name.trim();

}


// ================== Handle Duplicate ==================

function handleDuplicate(row){

  const name = getSubjectName(row)
    .toLowerCase();

  const hours =
    parseFloat(row.querySelector(".hours").value) || 0;

  const grade =
    row.querySelector(".grade").value;


  if(!name || hours === 0 || !grade){
    return false;
  }


  const gradeValue =
    gradeMap[grade] || 0;


  let duplicateRow = null;


  document
    .querySelectorAll(".semester tbody tr")
    .forEach(r => {

      if(r === row) return;

      const existingName =
        getSubjectName(r)
          .toLowerCase();

      if(existingName === name){

        duplicateRow = r;

      }

    });


  if(!duplicateRow){
    return false;
  }


  const existingGrade =
    duplicateRow.querySelector(".grade").value;

  const existingGradeValue =
    gradeMap[existingGrade] || 0;


  // ================================
  // الاحتفاظ بأعلى تقدير
  // ================================

  if(gradeValue > existingGradeValue){

    duplicateRow
      .querySelector(".grade")
      .value = grade;

    duplicateRow
      .querySelector(".hours")
      .value = hours;


    duplicateRow.classList.remove("final");

    duplicateRow.classList.add(
      "updated-subject"
    );


    setTimeout(() => {

      duplicateRow.classList.add("final");

      saveData();

    }, 1500);

  }


  // ================================
  // حذف الصف المكرر
  // ================================

  row.classList.add("fade-out");


  row.addEventListener(
    "transitionend",
    () => {

      row.remove();

      calculate();

    },
    {once:true}
  );


  return true;

}


// ================== Calculate GPA ==================

function calculate(){

  let globalPoints = 0;

  let globalHours = 0;

  let passedHours = 0;


  document
    .querySelectorAll(".semester tbody tr")
    .forEach(row => {

      const hours =
        parseFloat(
          row.querySelector(".hours").value
        ) || 0;


      const grade =
        row.querySelector(".grade").value;


      const gradeValue =
        gradeMap[grade] || 0;


      const total =
        gradeValue * hours;


      const totalCell =
        row.querySelector(".total");


      if(totalCell){

        totalCell.textContent =
          total.toFixed(2);

      }


      globalPoints += total;

      globalHours += hours;


      // المادة ناجحة

      if(
        grade !== "F (0.0)" &&
        grade !== ""
      ){

        passedHours += hours;

      }

    });


  const gpa =
    globalHours
      ? globalPoints / globalHours
      : 0;


  const passedElement =
    document.getElementById("passed-hours");

  if(passedElement){

    passedElement.textContent =
      passedHours;

  }


  const remainingHours =
    136 - passedHours;


  const globalHoursElement =
    document.getElementById("global-hours");

  if(globalHoursElement){

    globalHoursElement.textContent =
      remainingHours > 0
        ? remainingHours
        : 0;

  }


  const globalPointsElement =
    document.getElementById("global-points");

  if(globalPointsElement){

    globalPointsElement.textContent =
      globalPoints.toFixed(2);

  }


  animateGPA(previousGPA, gpa);

  updateProgressBar(gpa);

  previousGPA = gpa;


  const letterElement =
    document.getElementById("global-letter");

  if(letterElement){

    letterElement.textContent =
      globalHours === 0
        ? "0"
        : getLetter(gpa);

  }


  if(!isLoading){

    saveData();

  }

}


// ================== GPA Animation ==================

function animateGPA(start, end){

  const el =
    document.getElementById("global-gpa");

  if(!el) return;


  const duration = 400;

  const startTime =
    performance.now();


  function frame(now){

    const progress =
      Math.min(
        (now - startTime) / duration,
        1
      );


    const value =
      start +
      (end - start) * progress;


    el.textContent =
      value.toFixed(2);


    if(progress < 1){

      requestAnimationFrame(frame);

    }

  }


  requestAnimationFrame(frame);

}


// ================== Progress Bar ==================

function updateProgressBar(gpa){

  const bar =
    document.getElementById("gpa-bar");

  if(!bar) return;


  const percent =
    Math.max(
      0,
      Math.min(
        100,
        (gpa / 4) * 100
      )
    );


  bar.style.width =
    percent + "%";


  bar.className =
    "gpa-bar";


  if(gpa >= 3.7){

    bar.classList.add("excellent");

  }

  else if(gpa >= 3){

    bar.classList.add("verygood");

  }

  else if(gpa >= 2){

    bar.classList.add("good");

  }

  else{

    bar.classList.add("danger");

  }

}


// ================== Letter ==================

function getLetter(gpa){

  if(gpa >= 4)
    return "A+ ممتاز مرتفع";

  if(gpa >= 3.7)
    return "A ممتاز";

  if(gpa >= 3.4)
    return "A- ممتاز منخفض";

  if(gpa >= 3.2)
    return "B+ جيد جداً مرتفع";

  if(gpa >= 3)
    return "B جيد جداً";

  if(gpa >= 2.8)
    return "B- جيد جداً منخفض";

  if(gpa >= 2.6)
    return "C+ جيد مرتفع";

  if(gpa >= 2.4)
    return "C جيد";

  if(gpa >= 2.2)
    return "C- جيد منخفض";

  if(gpa >= 2)
    return "D+ مقبول مرتفع";

  if(gpa >= 1.5)
    return "D مقبول";

  if(gpa >= 1)
    return "D- مقبول منخفض";

  return "F راسب";

}


// ================== Save Data ==================

function saveData(){

  const data = [];


  document
    .querySelectorAll(".semester")
    .forEach(semester => {

      const subjects = [];


      semester
        .querySelectorAll("tbody tr")
        .forEach(row => {

          subjects.push({

            name: getSubjectName(row),

            hours:
              row.querySelector(".hours").value,

            grade:
              row.querySelector(".grade").value,

            updated:
              row.classList.contains(
                "updated-subject"
              )

          });

        });


      data.push(subjects);

    });


  localStorage.setItem(
    "gpaData",
    JSON.stringify(data)
  );

}


// ================== Load Data ==================

function loadData(){

  isLoading = true;


  const saved =
    localStorage.getItem("gpaData");


  if(!saved){

    isLoading = false;

    return;

  }


  let data;


  try{

    data = JSON.parse(saved);

  }

  catch(error){

    console.error(
      "Invalid saved GPA data",
      error
    );

    isLoading = false;

    return;

  }


  document
    .querySelectorAll(".semester")
    .forEach((semester,index) => {

      const tbody =
        semester.querySelector("tbody");


      if(!tbody) return;


      tbody.innerHTML = "";


      if(!data[index]) return;


      data[index].forEach(sub => {

        const row =
          createRow(
            sub.name,
            sub.hours,
            sub.grade
          );


        if(sub.updated){

          row.classList.add(
            "updated-subject",
            "final"
          );

        }


        tbody.appendChild(row);

      });

    });


  calculate();


  isLoading = false;

}


// ================== Clear Level ==================

function clearLevel(button){

  const level =
    button.closest(".level");

  if(!level) return;


  level
    .querySelectorAll("tbody")
    .forEach(tb => {

      tb.innerHTML = "";

    });


  calculate();

  saveData();

}


// ================== DARK MODE ==================

function applyInitialTheme(){

  const saved =
    localStorage.getItem("theme");


  if(saved){

    const isDark =
      saved === "dark";

    setTheme(isDark);

    return;

  }


  const media =
    window.matchMedia(
      "(prefers-color-scheme: dark)"
    );


  if(media.matches !== undefined){

    setTheme(media.matches);

    return;

  }


  const hour =
    new Date().getHours();


  const isNight =
    hour >= 18 ||
    hour < 6;


  setTheme(isNight);

}


// ================== Toggle Dark Mode ==================

function toggleDarkMode(){

  const isDark =
    !document.body.classList.contains(
      "dark-mode"
    );


  setTheme(isDark);


  localStorage.setItem(
    "theme",
    isDark
      ? "dark"
      : "light"
  );

}


// ================== Set Theme ==================

function setTheme(isDark){

  document.body.classList.toggle(
    "dark-mode",
    isDark
  );


  updateToggleButton(isDark);

}


// ================== Toggle Button ==================

function updateToggleButton(isDark){

  const btn =
    document.getElementById(
      "dark-mode-toggle"
    );


  if(!btn) return;


  btn.innerHTML =
    isDark
      ? "☀️"
      : "🌙";

}


// ================== System Theme Change ==================

const themeMedia =
  window.matchMedia(
    "(prefers-color-scheme: dark)"
  );


themeMedia.addEventListener(
  "change",
  e => {

    if(
      !localStorage.getItem("theme")
    ){

      setTheme(e.matches);

    }

  }
);


// ================== Start App ==================

document.addEventListener(
  "DOMContentLoaded",
  () => {

    applyInitialTheme();

    loadData();

  }
);


// ================== PWA INSTALL ==================

let deferredPrompt = null;


function getInstallButton(){

  return document.getElementById(
    "install-btn"
  );

}


// ================== Before Install ==================

window.addEventListener(
  "beforeinstallprompt",
  e => {

    e.preventDefault();

    deferredPrompt = e;


    const installBtn =
      getInstallButton();


    if(!installBtn) return;


    installBtn.style.display =
      "inline-flex";


    setTimeout(() => {

      installBtn.classList.add(
        "show"
      );

    },50);

  }
);


// ================== Install Click ==================

document.addEventListener(
  "click",
  async e => {

    const installBtn =
      e.target.closest(
        "#install-btn"
      );


    if(!installBtn) return;


    if(!deferredPrompt) return;


    deferredPrompt.prompt();


    try{

      const choice =
        await deferredPrompt.userChoice;


      if(
        choice &&
        choice.outcome === "accepted"
      ){

        hideInstallButton();

      }

    }

    catch(error){

      console.error(
        "Install error:",
        error
      );

    }


    deferredPrompt = null;

  }
);


// ================== App Installed ==================

window.addEventListener(
  "appinstalled",
  () => {

    hideInstallButton();

  }
);


// ================== Hide Install Button ==================

function hideInstallButton(){

  const installBtn =
    getInstallButton();


  if(!installBtn) return;


  installBtn.classList.remove(
    "show"
  );


  setTimeout(() => {

    installBtn.style.display =
      "none";

  },300);

}
