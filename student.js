let students = JSON.parse(localStorage.getItem('students')) || [];
let chart;

function addSubject() {
    let container = document.getElementById('subjectContainer');
    let newSubject = document.createElement('div');
    newSubject.innerHTML = `
        <label>Subject: <input type="text" class="subject" required></label>
        <label>Marks: <input type="number" class="marks" required></label>
    `;
    container.appendChild(newSubject);
}

function addStudent() {
    let name = document.getElementById('name').value;
    let passingMarks = parseInt(document.getElementById('passingMarks').value);
    let totalMarks = parseInt(document.getElementById('totalMarks').value);
    let subjectInputs = document.querySelectorAll('.subject');
    let markInputs = document.querySelectorAll('.marks');

    students = [];

    subjectInputs.forEach((subjectInput, index) => {
        let subject = subjectInput.value.trim();
        let mark = parseInt(markInputs[index].value.trim());
        let category = mark < passingMarks ? 'Weak' : 'Strong';

        students.push({ name, subject, marks: mark, passingMarks, totalMarks, category });
    });

    localStorage.setItem('students', JSON.stringify(students));
    displayStudents();
    updateChart();
}

function displayStudents() {
    let tbody = document.querySelector('#studentTable tbody');
    tbody.innerHTML = '';

    students.forEach(s => {
        let row = `<tr>
            <td>${s.name}</td>
            <td>${s.subject}</td>
            <td>${s.marks}</td>
            <td>${s.passingMarks}</td>
            <td>${s.totalMarks}</td>
            <td>${s.category}</td>
        </tr>`;
        tbody.innerHTML += row;
    });
}

function updateChart() {
    let weakCount = students.filter(s => s.category === 'Weak').length;
    let strongCount = students.length - weakCount;
    let ctx = document.getElementById('subjectChart').getContext('2d');

    if (chart) {
        chart.destroy();
    }

    chart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Weak Subjects', 'Strong Subjects'],
            datasets: [{
                data: [weakCount, strongCount],
                backgroundColor: ['red', 'green']
            }]
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    displayStudents();
    updateChart();
});
function openMenu() {
document.getElementById("sidebar").style.width = "250px";
}

function closeMenu() {
document.getElementById("sidebar").style.width = "0";
}