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

// Dopełniacz – używany w datach typu „12 stycznia 2026".
const MONTHS_PL_GENITIVE = [
  "stycznia",
  "lutego",
  "marca",
  "kwietnia",
  "maja",
  "czerwca",
  "lipca",
  "sierpnia",
  "września",
  "października",
  "listopada",
  "grudnia",
];

const WEEKDAYS_PL = ["pon.", "wt.", "śr.", "czw.", "pt.", "sob.", "niedz."];

const WEEKDAYS_PL_FULL = [
  "poniedziałek",
  "wtorek",
  "środa",
  "czwartek",
  "piątek",
  "sobota",
  "niedziela",
];

const VIEW_NOUNS = {
  month: { prev: "Poprzedni miesiąc", next: "Następny miesiąc" },
  week: { prev: "Poprzedni tydzień", next: "Następny tydzień" },
  day: { prev: "Poprzedni dzień", next: "Następny dzień" },
};

let currentView = "month";
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

function isSameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

// Indeks dnia tygodnia z poniedziałkiem jako 0 (niedziela = 6).
function mondayIndex(date) {
  return (date.getDay() + 6) % 7;
}

// Poniedziałek tygodnia, w którym znajduje się podana data.
function startOfWeek(date) {
  const start = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  start.setDate(start.getDate() - mondayIndex(start));
  return start;
}

function formatMonthYear(date) {
  return `${MONTHS_PL[date.getMonth()]} ${date.getFullYear()}`;
}

function formatDayLong(date) {
  const weekday = WEEKDAYS_PL_FULL[mondayIndex(date)];
  return `${weekday}, ${date.getDate()} ${MONTHS_PL_GENITIVE[date.getMonth()]} ${date.getFullYear()}`;
}

function formatWeekRange(monday) {
  const sunday = new Date(monday);
  sunday.setDate(sunday.getDate() + 6);

  const startMonth = MONTHS_PL_GENITIVE[monday.getMonth()];
  const endMonth = MONTHS_PL_GENITIVE[sunday.getMonth()];

  if (monday.getFullYear() !== sunday.getFullYear()) {
    return `${monday.getDate()} ${startMonth} ${monday.getFullYear()} – ${sunday.getDate()} ${endMonth} ${sunday.getFullYear()}`;
  }
  if (monday.getMonth() !== sunday.getMonth()) {
    return `${monday.getDate()} ${startMonth} – ${sunday.getDate()} ${endMonth} ${sunday.getFullYear()}`;
  }
  return `${monday.getDate()}–${sunday.getDate()} ${endMonth} ${sunday.getFullYear()}`;
}

function appendWeekdayHeaders() {
  WEEKDAYS_PL.forEach((name) => {
    const label = document.createElement("div");
    label.className = "calendar__weekday";
    label.textContent = name;
    label.setAttribute("spellcheck", "false");
    calendarEl.appendChild(label);
  });
}

function createDayCell(date, referenceMonth, today) {
  const cell = document.createElement("div");
  cell.className = "calendar__day";
  cell.textContent = String(date.getDate());
  cell.setAttribute("role", "gridcell");
  cell.setAttribute("spellcheck", "false");

  if (referenceMonth !== null && date.getMonth() !== referenceMonth) {
    cell.classList.add("calendar__day--other-month");
  }
  if (isSameDay(date, today)) {
    cell.classList.add("calendar__day--today");
    cell.setAttribute("aria-current", "date");
  }
  return cell;
}

function renderMonth(today) {
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  monthTitle.textContent = formatMonthYear(viewDate);
  appendWeekdayHeaders();

  const firstDay = new Date(year, month, 1);
  const startOffset = mondayIndex(firstDay);
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let i = 0; i < startOffset; i++) {
    const empty = document.createElement("div");
    empty.className = "calendar__day calendar__day--empty";
    empty.setAttribute("aria-hidden", "true");
    calendarEl.appendChild(empty);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    calendarEl.appendChild(createDayCell(new Date(year, month, day), month, today));
  }
}

function renderWeek(today) {
  const monday = startOfWeek(viewDate);
  monthTitle.textContent = formatWeekRange(monday);
  appendWeekdayHeaders();

  for (let i = 0; i < 7; i++) {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    calendarEl.appendChild(createDayCell(date, null, today));
  }
}

function renderDay(today) {
  monthTitle.textContent = formatDayLong(viewDate);
  calendarEl.appendChild(createDayCell(viewDate, null, today));
}

function renderCalendar() {
  const today = new Date();
  calendarEl.innerHTML = "";
  calendarEl.className = `calendar calendar--${currentView}`;

  const labels = VIEW_NOUNS[currentView] || VIEW_NOUNS.month;
  btnPrev.setAttribute("aria-label", labels.prev);
  btnNext.setAttribute("aria-label", labels.next);

  if (currentView === "week") {
    renderWeek(today);
  } else if (currentView === "day") {
    renderDay(today);
  } else {
    renderMonth(today);
  }
}

function setActiveMenu(view) {
  menuItems.forEach((btn) => {
    btn.classList.toggle("menu__item--active", btn.dataset.view === view);
  });
}

function setView(view) {
  currentView = view;
  setActiveMenu(view);
  renderCalendar();
}

// Przesuwa widok o jeden krok w zależności od aktywnego widoku.
// Tworzenie nowej daty z dniem 1 dla miesiąca zapobiega przeskakiwaniu
// miesięcy (np. 31 stycznia + miesiąc dawałby 3 marca).
function navigate(step) {
  if (currentView === "month") {
    viewDate = new Date(viewDate.getFullYear(), viewDate.getMonth() + step, 1);
  } else if (currentView === "week") {
    viewDate = new Date(viewDate);
    viewDate.setDate(viewDate.getDate() + step * 7);
  } else {
    viewDate = new Date(viewDate);
    viewDate.setDate(viewDate.getDate() + step);
  }
  renderCalendar();
}

btnPrev.addEventListener("click", () => navigate(-1));
btnNext.addEventListener("click", () => navigate(1));

btnToday.addEventListener("click", () => {
  viewDate = new Date();
  renderCalendar();
});

btnSettings.addEventListener("click", () => {
  sidebar.hidden = false;
});

btnCloseSettings.addEventListener("click", () => {
  sidebar.hidden = true;
});

menuItems.forEach((btn) => {
  btn.addEventListener("click", () => setView(btn.dataset.view));
});

renderCalendar();
