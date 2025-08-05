function convertTo24Hour(timeStr) {
    let parts = timeStr.trim().split(/[: ]/);
    let hour = parseInt(parts[0]);
    let minute = parseInt(parts[1]);
    let ampm = parts[2].toLowerCase();

    if (ampm === "pm" && hour !== 12) hour += 12;
    if (ampm === "am" && hour === 12) hour = 0;

    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  }

  function getTodayKey() {
    const today = new Date();
    return today.toISOString().split("T")[0]; // YYYY-MM-DD
  }

  function toggleComplete(key) {
    let completedToday = JSON.parse(localStorage.getItem("completed_today")) || [];
    if (!completedToday.includes(key)) {
      completedToday.push(key);
    }
    localStorage.setItem("completed_today", JSON.stringify(completedToday));

    let weekly = JSON.parse(localStorage.getItem("weekly_report")) || {};
    let today = getTodayKey();
    if (!weekly[today]) weekly[today] = [];
    if (!weekly[today].includes(key.split("_")[1])) {
      weekly[today].push(key.split("_")[1]);
    }
    localStorage.setItem("weekly_report", JSON.stringify(weekly));
  }

  function notifyUser(subject) {
    if (Notification.permission === "granted") {
      new Notification("Session Completed!", {
        body: `Time to mark "${subject}" as completed.`,
        icon: "https://cdn-icons-png.flaticon.com/512/190/190411.png"
      });
    }
  }

  function playSound() {
    const sound = document.getElementById("alertSound");
    sound.play().catch(err => console.log("Sound play failed:", err));
  }

  function updateReminders() {
    const reminderList = document.getElementById("reminderList");
    reminderList.innerHTML = "";

    const timetable = JSON.parse(localStorage.getItem("timetable")) || [];
    const completedToday = JSON.parse(localStorage.getItem("completed_today")) || [];
    const notified = JSON.parse(localStorage.getItem("notified")) || [];

    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    timetable.forEach((session, index) => {
      const endTime24 = convertTo24Hour(session.end);
      const sessionKey = `${getTodayKey()}_${session.subject}`;
      const isCompleted = completedToday.includes(sessionKey);

      if (currentTime >= endTime24) {
        if (!notified.includes(sessionKey)) {
          notifyUser(session.subject);
          playSound();
          notified.push(sessionKey);
          localStorage.setItem("notified", JSON.stringify(notified));
        }

        const sessionDiv = document.createElement("div");
        sessionDiv.className = "reminder";

        sessionDiv.innerHTML = `
          <strong>${session.subject}</strong><br>
          ${session.start} - ${session.end} (${session.category})
        `;

        const btn = document.createElement("button");
        btn.className = `toggle-btn ${isCompleted ? "completed" : ""}`;
        btn.textContent = isCompleted ? "Completed" : "Mark as Completed";
        btn.onclick = () => {
          if (!isCompleted) {
            toggleComplete(sessionKey);
            updateReminders();
            updateReports();
          }
        };
        sessionDiv.appendChild(btn);

        if (isCompleted) {
          const quizBtn = document.createElement("button");
          quizBtn.className = "toggle-btn quiz-btn";
          quizBtn.textContent = "Take Quiz";
          quizBtn.onclick = () => {
            localStorage.setItem("current_quiz_subject", session.subject);
            window.location.href = "Quiz.html";
          };
          sessionDiv.appendChild(quizBtn);
        }

        reminderList.appendChild(sessionDiv);
      }
    });
  }

  function updateReports() {
    const daily = JSON.parse(localStorage.getItem("completed_today")) || [];
    const dailyReport = document.getElementById("dailyReport");
    dailyReport.innerHTML = "";

    daily.forEach(entry => {
      const subject = entry.split("_")[1];
      const li = document.createElement("li");
      li.textContent = subject;
      dailyReport.appendChild(li);
    });

    const weekly = JSON.parse(localStorage.getItem("weekly_report")) || {};
    const weeklyReport = document.getElementById("weeklyReport");
    weeklyReport.innerHTML = "";

    for (let date in weekly) {
      const li = document.createElement("li");
      li.textContent = `${date}: ${weekly[date].join(", ")}`;
      weeklyReport.appendChild(li);
    }
  }

  setInterval(updateReminders, 60000); // check every 60 sec

  window.onload = () => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }
    updateReminders();
    updateReports();
  };
  function openMenu() {
      document.getElementById("sidebar").style.width = "250px";
  }
  
  function closeMenu() {
      document.getElementById("sidebar").style.width = "0";
  }

