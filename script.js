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

// ================== State ==================
let previousGPA = 0;
let isLoading = false;

// ================== Generate Options ==================
function generateGradeOptions() {
    return Object.keys(gradeMap)
        .map(g => `<option value="${g}">${g}</option>`)
        .join("");
}

// ================== Autocomplete Setup (تم حذف هذه الدالة بالكامل) ==================
// هذه الدالة تم استبدالها باستخدام datalist

// ================== Create Row ==================
function createRow(name = "", hours = "0", grade = "") {

    const row = document.createElement("tr");

    row.innerHTML = `
    <td><input type="text" value="${name}" list="materials-options" placeholder="اسم المادة" class="subject-name-input"></td>
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

    // تم إزالة استدعاء setupAutocomplete() من هنا
    // const nameCell = row.children[0];
    // setupAutocomplete(nameCell, row);

    attachRowEvents(row);

    return row;
}

// ================== Row Events ==================
function attachRowEvents(row) {

    const hoursSelect = row.querySelector(".hours");
    const gradeSelect = row.querySelector(".grade");
    const nameInput = row.querySelector(".subject-name-input"); // الحصول على حقل الإدخال الجديد

    hoursSelect.addEventListener("change", () => {
        if (!handleDuplicate(row)) calculate();
    });
    gradeSelect.addEventListener("change", () => {
        if (!handleDuplicate(row)) calculate();
    });
    // event 'blur' الآن لحقل الإدخال، ولم يعد هناك منطق للـ autocomplete-list هنا
    nameInput.addEventListener("blur", () => {
        if (!handleDuplicate(row)) calculate();
    });
    // حدث change أيضًا لحقل الإدخال لتحديث الحساب إذا تم الاختيار من الداتالست أو الكتابة
    nameInput.addEventListener("change", () => {
        if (!handleDuplicate(row)) calculate();
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

    const nameInput = row.querySelector(".subject-name-input");
    const name = nameInput.value.trim().toLowerCase(); // قراءة القيمة من input
    const hours = parseFloat(row.querySelector(".hours").value) || 0;
    const grade = row.querySelector(".grade").value;

    if (!name || hours === 0 || !grade) return false;

    const gradeValue = gradeMap[grade] || 0;

    let duplicateRow = null;

    document.querySelectorAll(".semester tbody tr").forEach(r => {

        if (r === row) return;

        const existingNameInput = r.querySelector(".subject-name-input");
        const existingName = existingNameInput.value.trim().toLowerCase(); // قراءة القيمة من input موجود

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

    row.addEventListener("transitionend", () => {
        row.remove();
        calculate();
    }, {
        once: true
    });

    return true;
}

// ================== Calculate GPA ==================
function calculate() {

    let globalPoints = 0;
    let globalHours = 0;

    document.querySelectorAll(".semester tbody tr").forEach(row => {

        const hours = parseFloat(row.querySelector(".hours").value) || 0;
        const grade = row.querySelector(".grade").value;

        const gradeValue = gradeMap[grade] || 0;

        const total = gradeValue * hours;

        row.querySelector(".total").textContent = total.toFixed(2);

        globalPoints += total;
        globalHours += hours;

    });

    const gpa = globalHours ? (globalPoints / globalHours) : 0;

    document.getElementById("global-hours").textContent = globalHours;
    document.getElementById("global-points").textContent = globalPoints.toFixed(2);

    animateGPA(previousGPA, gpa);
    updateProgressBar(gpa);

    previousGPA = gpa;

    document.getElementById("global-letter").textContent =
        globalHours === 0 ? "0" : getLetter(gpa);

    if (!isLoading) {
        saveData();
    }
}

// ================== GPA Animation ==================
function animateGPA(start, end) {

    const el = document.getElementById("global-gpa");

    const duration = 400;
    const startTime = performance.now();

    function frame(now) {

        const progress = Math.min((now - startTime) / duration, 1);

        const value = start + (end - start) * progress;

        el.textContent = value.toFixed(2);

        if (progress < 1) {
            requestAnimationFrame(frame);
        }

    }

    requestAnimationFrame(frame);
}

// ================== Progress Bar ==================
function updateProgressBar(gpa) {

    const bar = document.getElementById("gpa-bar");
    if (!bar) return;

    const percent = (gpa / 4) * 100;

    bar.style.width = percent + "%";

    bar.className = "gpa-bar";

    if (gpa >= 3.7) bar.classList.add("excellent");
    else if (gpa >= 3) bar.classList.add("verygood");
    else if (gpa >= 2) bar.classList.add("good");
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

            const nameInput = row.querySelector(".subject-name-input");
            subjects.push({
                name: nameInput.value, // قراءة القيمة من input
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

    level.querySelectorAll("tbody").forEach(tb => tb.innerHTML = "");

    calculate();
    saveData();

}

// ================== DARK MODE ==================
function applyInitialTheme() {

    const saved = localStorage.getItem("theme");

    if (saved) {
        const isDark = saved === "dark";
        setTheme(isDark);
        return;
    }

    const media = window.matchMedia("(prefers-color-scheme: dark)");

    if (media.matches !== undefined) {
        setTheme(media.matches);
        return;
    }

    const hour = new Date().getHours();
    const isNight = hour >= 18 || hour < 6;

    setTheme(isNight);
}

function toggleDarkMode() {

    const isDark = !document.body.classList.contains("dark-mode");

    setTheme(isDark);

    localStorage.setItem("theme", isDark ? "dark" : "light");
}

function setTheme(isDark) {

    document.body.classList.toggle("dark-mode", isDark);

    updateToggleButton(isDark);
}

function updateToggleButton(isDark) {

    const btn = document.getElementById("dark-mode-toggle");

    if (!btn) return;

    btn.innerHTML = isDark ? "☀️" : "🌙";
}

window.matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", e => {

        if (!localStorage.getItem("theme")) {
            setTheme(e.matches);
        }

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

function hideInstallButton() {
    installBtn.classList.remove("show");

    setTimeout(() => {
        installBtn.style.display = "none";
    }, 300);
}


// ================== Start App (معدل) ==================
// تم دمج الكود الخاص بملء الـ datalist هنا مع DOMContentLoaded الأصلي
document.addEventListener("DOMContentLoaded", () => {
    // ملء الـ datalist بقائمة المواد
    const materialsDatalist = document.getElementById('materials-options');
    if (materialsDatalist) {
        subjectsList.forEach(item => {
            const option = document.createElement('option');
            option.value = item;
            materialsDatalist.appendChild(option);
        });
    }

    applyInitialTheme();
    loadData(); // سيتم استدعاء loadData بعد ملء الـ datalist
});
