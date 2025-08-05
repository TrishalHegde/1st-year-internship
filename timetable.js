function convertTo24Hour(timeStr) {
    timeStr = timeStr.trim();
    if (!timeStr.includes(" ")) {
        alert("Invalid time format. Please use HH:MM AM/PM.");
        return null;
    }
    let parts = timeStr.split(" ");
    if (parts.length !== 2) {
        alert("Invalid time format. Please use HH:MM AM/PM.");
        return null;
    }
    let time = parts[0];
    let modifier = parts[1]?.toLowerCase();
    if (!modifier || (modifier !== "am" && modifier !== "pm")) {
        alert("Invalid AM/PM format. Please enter either AM or PM.");
        return null;
    }
    let [hours, minutes] = time.split(":").map(Number);
    if (modifier === "pm" && hours !== 12) {
        hours += 12;
    } else if (modifier === "am" && hours === 12) {
        hours = 0;
    }
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

function formatTime(hour, minute) {
    let period = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12;
    return `${hour}:${minute.toString().padStart(2, '0')} ${period}`;
}

function generateTimetable() {
    const startTimeInput = document.getElementById("startTime").value.trim();
    const studyHours = parseInt(document.getElementById("studyHours").value.trim());

    if (!startTimeInput || isNaN(studyHours) || studyHours < 4) {
        alert("Please enter a valid start time and at least 4 hours of study.");
        return;
    }

    const startTime = convertTo24Hour(startTimeInput);
    if (!startTime) return;

    let subjects = JSON.parse(localStorage.getItem("students")) || [];
    let weakSubjects = subjects.filter(sub => sub.category === "Weak");
    let strongSubjects = subjects.filter(sub => sub.category === "Strong");

    let totalSubjects = weakSubjects.concat(strongSubjects);
    let totalTimePerSubject = (studyHours * 60) / totalSubjects.length;

    let [startHour, startMinute] = startTime.split(":").map(Number);
    let timetable = [];

    totalSubjects.forEach(subject => {
        let endMinute = startMinute + totalTimePerSubject;
        let endHour = startHour + Math.floor(endMinute / 60);
        endMinute = endMinute % 60;

        timetable.push({
            subject: subject.subject,
            start: formatTime(startHour, startMinute),
            end: formatTime(endHour, endMinute),
            category: subject.category
        });

        startHour = endHour;
        startMinute = endMinute;
    });

    localStorage.setItem("timetable", JSON.stringify(timetable));
    displayTimetable();
}

function displayTimetable() {
    const timetableTable = document.getElementById("timetableTable").querySelector("tbody");
    timetableTable.innerHTML = "";
    const timetable = JSON.parse(localStorage.getItem("timetable")) || [];

    timetable.forEach((session, index) => {
        let row = document.createElement("tr");

        row.innerHTML = `
            <td>${session.subject}</td>
            <td>${session.start}</td>
            <td>${session.end}</td>
            <td>${session.category}</td>
            <td>
                <select class="edit-dropdown" onchange="updateSubject(${index}, this.value)">
                    ${getSubjectOptions(session.category, session.subject)}
                </select>
            </td>
        `;
        timetableTable.appendChild(row);
    });
}

function getSubjectOptions(category, currentSubject) {
    let subjects = JSON.parse(localStorage.getItem("students")) || [];
    let filteredSubjects = subjects.filter(sub => sub.category === category);
    return filteredSubjects.map(sub => 
        `<option value="${sub.subject}" ${sub.subject === currentSubject ? "selected" : ""}>${sub.subject}</option>`
    ).join("");
}

function updateSubject(index, newSubject) {
    let timetable = JSON.parse(localStorage.getItem("timetable")) || [];
    timetable[index].subject = newSubject;
    localStorage.setItem("timetable", JSON.stringify(timetable));
    displayTimetable();
}


function clearTimetable() {
    localStorage.removeItem("timetable");
    displayTimetable();
}

window.onload = displayTimetable;
function saveUserData() {
const phone = document.getElementById("phone").value.trim();
if (!phone.startsWith("+")) {
alert("Enter a valid phone number in international format (+91XXXXXXXXXX)");
return;
}
localStorage.setItem("user_phone", phone);
}
document.querySelector("button").addEventListener("click", () => {
saveUserData();
generateTimetable(); 
});
function openMenu() {
document.getElementById("sidebar").style.width = "250px";
}

function closeMenu() {
document.getElementById("sidebar").style.width = "0";
}