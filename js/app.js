const MONTHS_PL = [
  "styczeń",
  "luty",
  "marzec",
  "kwiecień",
  "maj",
  "czerwiec",
  "lipiec",
  "sierpień",
  "wrzesień",
  "październik",
  "listopad",
  "grudzień",
];

const WEEKDAYS_PL = ["pon.", "wt.", "śr.", "czw.", "pt.", "sob.", "niedz."];

let viewDate = new Date();

const monthTitle = document.getElementById("month-title");
const calendarEl = document.getElementById("calendar");
const btnPrev = document.getElementById("btn-prev");
const btnNext = document.getElementById("btn-next");
const btnToday = document.getElementById("btn-today");
const btnSettings = document.getElementById("btn-settings");
const btnCloseSettings = document.getElementById("btn-close-settings");
const sidebar = document.getElementById("sidebar");
const menuItems = document.querySelectorAll(".menu__item[data-view]");

function formatMonthYear(date) {
  const month = MONTHS_PL[date.getMonth()];
  const year = date.getFullYear();
  return `${month} ${year}`;
}

function isSameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function renderCalendar() {
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const today = new Date();

  monthTitle.textContent = formatMonthYear(viewDate);
  calendarEl.innerHTML = "";

  WEEKDAYS_PL.forEach((name) => {
    const label = document.createElement("div");
    label.className = "calendar__weekday";
    label.textContent = name;
    label.setAttribute("spellcheck", "false");
    calendarEl.appendChild(label);
  });

  const firstDay = new Date(year, month, 1);
  let startOffset = firstDay.getDay() - 1;
  if (startOffset < 0) startOffset = 6;

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let i = 0; i < startOffset; i++) {
    const empty = document.createElement("div");
    empty.className = "calendar__day calendar__day--empty";
    empty.setAttribute("aria-hidden", "true");
    calendarEl.appendChild(empty);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const cell = document.createElement("div");
    cell.className = "calendar__day";
    cell.textContent = String(day);
    cell.setAttribute("role", "gridcell");
    cell.setAttribute("spellcheck", "false");

    const cellDate = new Date(year, month, day);
    if (isSameDay(cellDate, today)) {
      cell.classList.add("calendar__day--today");
      cell.setAttribute("aria-current", "date");
    }

    calendarEl.appendChild(cell);
  }
}

function setActiveMenu(view) {
  menuItems.forEach((btn) => {
    btn.classList.toggle("menu__item--active", btn.dataset.view === view);
  });
}

btnPrev.addEventListener("click", () => {
  viewDate.setMonth(viewDate.getMonth() - 1);
  renderCalendar();
});

btnNext.addEventListener("click", () => {
  viewDate.setMonth(viewDate.getMonth() + 1);
  renderCalendar();
});

btnToday.addEventListener("click", () => {
  viewDate = new Date();
  renderCalendar();
  setActiveMenu("month");
});

btnSettings.addEventListener("click", () => {
  sidebar.hidden = false;
});

btnCloseSettings.addEventListener("click", () => {
  sidebar.hidden = true;
});

menuItems.forEach((btn) => {
  btn.addEventListener("click", () => {
    setActiveMenu(btn.dataset.view);
    if (btn.dataset.view === "month") {
      renderCalendar();
    }
  });
});

renderCalendar();
