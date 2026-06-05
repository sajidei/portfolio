const STORAGE_KEY = "trainingPlanner.v1";

const SPORTS = {
  swim: { label: "Natation", colorClass: "swim", unit: "km" },
  run: { label: "Course à pied", colorClass: "run", unit: "km" },
  bike: { label: "Vélo", colorClass: "bike", unit: "km" },
  strength: { label: "Muscu", colorClass: "strength", unit: "séance" }
};

const PERIOD_LABELS = {
  endurance: "Endurance",
  puissance: "Puissance",
  force: "Force"
};

const state = {
  view: "month",
  currentDate: new Date(),
  data: loadData()
};

const app = document.getElementById("app");
const currentTitle = document.getElementById("currentTitle");

document.querySelectorAll(".tabs button").forEach(btn => {
  btn.addEventListener("click", () => {
    state.view = btn.dataset.view;
    document.querySelectorAll(".tabs button").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    render();
  });
});

document.getElementById("prevBtn").addEventListener("click", () => move(-1));
document.getElementById("nextBtn").addEventListener("click", () => move(1));
document.getElementById("todayBtn").addEventListener("click", () => {
  state.currentDate = new Date();
  render();
});

document.getElementById("resetDataBtn").addEventListener("click", () => {
  if (!confirm("Réinitialiser toutes les périodes et tous les entraînements ?")) return;
  state.data = { periods: [], workouts: [] };
  saveData();
  render();
});

function loadData() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return { periods: [], workouts: [] };
  try {
    const parsed = JSON.parse(raw);
    return {
      periods: Array.isArray(parsed.periods) ? parsed.periods : [],
      workouts: Array.isArray(parsed.workouts) ? parsed.workouts : []
    };
  } catch {
    return { periods: [], workouts: [] };
  }
}

function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.data));
}

function move(direction) {
  const d = new Date(state.currentDate);
  if (state.view === "year") d.setFullYear(d.getFullYear() + direction);
  if (state.view === "month") d.setMonth(d.getMonth() + direction);
  if (state.view === "week") d.setDate(d.getDate() + direction * 7);
  if (state.view === "day") d.setDate(d.getDate() + direction);
  state.currentDate = d;
  render();
}

function render() {
  if (state.view === "year") renderYear();
  if (state.view === "month") renderMonth();
  if (state.view === "week") renderWeek();
  if (state.view === "day") renderDay();
}

function renderYear() {
  const year = state.currentDate.getFullYear();
  currentTitle.textContent = year;

  const start = new Date(year, 0, 1);
  const end = new Date(year, 11, 31);
  const activePeriods = getPeriodsInRange(start, end);

  app.innerHTML = `
    <section class="panel">
      <div class="toolbar">
        <div>
          <h3>Périodes de l’année</h3>
          <div class="period-pills">${periodPills(activePeriods)}</div>
        </div>
        <button id="addPeriodBtn">+ Ajouter une période</button>
      </div>
      <div id="periodFormHost"></div>
      <div class="year-grid">
        ${Array.from({ length: 12 }, (_, i) => renderYearMonthCard(year, i)).join("")}
      </div>
      <div class="period-list">
        ${activePeriods.length ? activePeriods.map(renderPeriodItem).join("") : `<div class="empty">Aucune période renseignée pour cette année.</div>`}
      </div>
    </section>
  `;

  document.getElementById("addPeriodBtn").addEventListener("click", showPeriodForm);
  bindPeriodDeletes();
  bindMonthCards();
}

function renderYearMonthCard(year, month) {
  const start = new Date(year, month, 1);
  const end = new Date(year, month + 1, 0);
  const periods = getPeriodsInRange(start, end);
  const stats = getStats(start, end);
  return `
    <article class="panel month-card clickable-month" data-month="${month}">
      <h3>${monthName(start)}</h3>
      <div class="period-pills">${periodPills(periods) || `<span class="pill">Aucune période</span>`}</div>
      <p class="muted-small">Natation ${fmt(stats.swim.planned)} / ${fmt(stats.swim.done)} km</p>
      <p class="muted-small">CAP ${fmt(stats.run.planned)} / ${fmt(stats.run.done)} km</p>
      <p class="muted-small">Vélo ${fmt(stats.bike.planned)} / ${fmt(stats.bike.done)} km</p>
      <p class="muted-small">Muscu ${stats.strength.planned} / ${stats.strength.done}</p>
    </article>
  `;
}

function bindMonthCards() {
  document.querySelectorAll(".clickable-month").forEach(card => {
    card.addEventListener("click", () => {
      state.currentDate = new Date(state.currentDate.getFullYear(), Number(card.dataset.month), 1);
      state.view = "month";
      setActiveTab("month");
      render();
    });
  });
}

function renderMonth() {
  const y = state.currentDate.getFullYear();
  const m = state.currentDate.getMonth();
  const start = new Date(y, m, 1);
  const end = new Date(y, m + 1, 0);
  currentTitle.textContent = `${monthName(start)} ${y}`;

  const calendarStart = startOfWeek(start);
  const calendarEnd = endOfWeek(end);
  const days = datesBetween(calendarStart, calendarEnd);
  const periods = getPeriodsInRange(start, end);
  const stats = getStats(start, end);

  app.innerHTML = `
    <section class="panel">
      ${periodReminder(periods)}
      ${statsBlock(stats)}
      <div class="calendar-grid">
        ${weekdays().map(d => `<div class="weekday">${d}</div>`).join("")}
        ${days.map(day => renderDayCell(day, day.getMonth() !== m)).join("")}
      </div>
    </section>
  `;

  bindDayCells();
}

function renderWeek() {
  const start = startOfWeek(state.currentDate);
  const end = endOfWeek(state.currentDate);
  currentTitle.textContent = `${formatShortDate(start)} → ${formatShortDate(end)}`;

  const periods = getPeriodsInRange(start, end);
  const stats = getStats(start, end);
  const days = datesBetween(start, end);

  app.innerHTML = `
    <section class="panel">
      ${periodReminder(periods)}
      ${statsBlock(stats)}
      <div class="week-view">
        ${days.map(day => `
          <article class="panel week-day day-cell-week" data-date="${toISODate(day)}">
            <h3>${weekdayName(day)} ${day.getDate()}</h3>
            ${renderWorkoutMiniList(toISODate(day))}
          </article>
        `).join("")}
      </div>
    </section>
  `;

  document.querySelectorAll(".day-cell-week").forEach(el => {
    el.addEventListener("click", () => {
      state.currentDate = parseISODate(el.dataset.date);
      state.view = "day";
      setActiveTab("day");
      render();
    });
  });
}

function renderDay() {
  const date = toISODate(state.currentDate);
  currentTitle.textContent = formatLongDate(state.currentDate);
  const periods = getPeriodsInRange(state.currentDate, state.currentDate);
  const workouts = state.data.workouts.filter(w => w.date === date);

  app.innerHTML = `
    <section class="day-view">
      <div class="panel">
        <div class="toolbar">
          <div>${periodReminder(periods)}</div>
          <button id="addWorkoutBtn">+ Nouvel entraînement</button>
        </div>
        <div id="workoutFormHost"></div>
      </div>
      <div class="panel">
        <h3>Entraînements du jour</h3>
        <div class="workout-list">
          ${workouts.length ? workouts.map(renderWorkoutItem).join("") : `<div class="empty">Aucun entraînement planifié sur cette journée.</div>`}
        </div>
      </div>
    </section>
  `;

  document.getElementById("addWorkoutBtn").addEventListener("click", showWorkoutForm);
  bindWorkoutActions();
}

function showWorkoutForm() {
  const host = document.getElementById("workoutFormHost");
  host.innerHTML = document.getElementById("workoutFormTemplate").innerHTML;
  const form = document.getElementById("workoutForm");
  const sportSelect = form.elements.sport;
  const distanceField = document.getElementById("distanceTargetField");

  function refreshDistanceField() {
    distanceField.style.display = sportSelect.value === "strength" ? "none" : "grid";
  }

  sportSelect.addEventListener("change", refreshDistanceField);
  refreshDistanceField();

  document.getElementById("cancelWorkoutBtn").addEventListener("click", () => host.innerHTML = "");

  form.addEventListener("submit", e => {
    e.preventDefault();
    const sport = form.elements.sport.value;
    const targetDistance = sport === "strength" ? 0 : Number(form.elements.targetDistance.value || 0);

    state.data.workouts.push({
      id: crypto.randomUUID(),
      date: toISODate(state.currentDate),
      sport,
      targetDistance,
      actualDistance: null,
      status: "planned",
      comment: form.elements.comment.value.trim(),
      createdAt: new Date().toISOString()
    });

    saveData();
    render();
  });
}

function showPeriodForm() {
  const host = document.getElementById("periodFormHost");
  host.innerHTML = document.getElementById("periodFormTemplate").innerHTML;
  const form = document.getElementById("periodForm");

  form.elements.startDate.value = `${state.currentDate.getFullYear()}-01-01`;
  form.elements.endDate.value = `${state.currentDate.getFullYear()}-12-31`;

  document.getElementById("cancelPeriodBtn").addEventListener("click", () => host.innerHTML = "");

  form.addEventListener("submit", e => {
    e.preventDefault();
    const startDate = form.elements.startDate.value;
    const endDate = form.elements.endDate.value;

    if (endDate < startDate) {
      alert("La date de fin doit être après la date de début.");
      return;
    }

    state.data.periods.push({
      id: crypto.randomUUID(),
      startDate,
      endDate,
      category: form.elements.category.value
    });

    saveData();
    render();
  });
}

function renderPeriodItem(p) {
  return `
    <div class="period-item">
      <span><strong>${PERIOD_LABELS[p.category]}</strong> — ${formatISODate(p.startDate)} au ${formatISODate(p.endDate)}</span>
      <button class="secondary delete-period" data-id="${p.id}">Supprimer</button>
    </div>
  `;
}

function bindPeriodDeletes() {
  document.querySelectorAll(".delete-period").forEach(btn => {
    btn.addEventListener("click", e => {
      e.stopPropagation();
      state.data.periods = state.data.periods.filter(p => p.id !== btn.dataset.id);
      saveData();
      render();
    });
  });
}

function renderWorkoutItem(w) {
  const sport = SPORTS[w.sport];
  const distanceText = w.sport === "strength"
    ? "Séance de muscu"
    : `Cible : ${fmt(w.targetDistance)} km · Réalisé : ${w.actualDistance === null ? "—" : fmt(w.actualDistance) + " km"}`;

  return `
    <article class="workout-item">
      <header>
        <strong><span class="dot ${sport.colorClass}"></span> ${sport.label}</strong>
        <span class="status ${w.status}">${statusLabel(w.status)}</span>
      </header>
      <p>${distanceText}</p>
      ${w.comment ? `<p>${escapeHtml(w.comment)}</p>` : ""}
      <div class="actions">
        <button class="mark-done" data-id="${w.id}">Entraînement réalisé</button>
        <button class="secondary mark-abandoned" data-id="${w.id}">Entraînement abandonné</button>
        <button class="ghost danger delete-workout" data-id="${w.id}">Supprimer</button>
      </div>
    </article>
  `;
}

function bindWorkoutActions() {
  document.querySelectorAll(".mark-done").forEach(btn => {
    btn.addEventListener("click", () => {
      const workout = state.data.workouts.find(w => w.id === btn.dataset.id);
      if (!workout) return;

      let actual = 0;
      if (workout.sport !== "strength") {
        const answer = prompt("Distance réellement parcourue en km :", workout.targetDistance || 0);
        if (answer === null) return;
        actual = Number(String(answer).replace(",", "."));
        if (Number.isNaN(actual) || actual < 0) {
          alert("Merci de saisir une distance valide.");
          return;
        }
      }

      workout.status = "done";
      workout.actualDistance = workout.sport === "strength" ? 1 : actual;
      saveData();
      render();
    });
  });

  document.querySelectorAll(".mark-abandoned").forEach(btn => {
    btn.addEventListener("click", () => {
      const workout = state.data.workouts.find(w => w.id === btn.dataset.id);
      if (!workout) return;
      workout.status = "abandoned";
      workout.actualDistance = 0;
      saveData();
      render();
    });
  });

  document.querySelectorAll(".delete-workout").forEach(btn => {
    btn.addEventListener("click", () => {
      state.data.workouts = state.data.workouts.filter(w => w.id !== btn.dataset.id);
      saveData();
      render();
    });
  });
}

function renderDayCell(day, muted = false) {
  const date = toISODate(day);
  const workouts = state.data.workouts.filter(w => w.date === date);
  return `
    <div class="day-cell ${muted ? "muted" : ""}" data-date="${date}">
      <div class="day-number">${day.getDate()}</div>
      <div class="dot-row">
        ${unique(workouts.map(w => w.sport)).map(s => `<span class="dot ${SPORTS[s].colorClass}" title="${SPORTS[s].label}"></span>`).join("")}
      </div>
    </div>
  `;
}

function bindDayCells() {
  document.querySelectorAll(".day-cell").forEach(cell => {
    cell.addEventListener("click", () => {
      state.currentDate = parseISODate(cell.dataset.date);
      state.view = "day";
      setActiveTab("day");
      render();
    });
  });
}

function renderWorkoutMiniList(date) {
  const workouts = state.data.workouts.filter(w => w.date === date);
  if (!workouts.length) return `<div class="empty">Aucun entraînement</div>`;

  return workouts.map(w => `
    <div class="workout-item">
      <strong><span class="dot ${SPORTS[w.sport].colorClass}"></span> ${SPORTS[w.sport].label}</strong>
      <p>${w.sport === "strength" ? "Muscu" : `${fmt(w.targetDistance)} km cible`}</p>
      <span class="status ${w.status}">${statusLabel(w.status)}</span>
    </div>
  `).join("");
}

function getStats(start, end) {
  const startISO = toISODate(start);
  const endISO = toISODate(end);
  const stats = {
    swim: { planned: 0, done: 0 },
    run: { planned: 0, done: 0 },
    bike: { planned: 0, done: 0 },
    strength: { planned: 0, done: 0 }
  };

  state.data.workouts
    .filter(w => w.date >= startISO && w.date <= endISO)
    .forEach(w => {
      if (w.sport === "strength") {
        stats.strength.planned += 1;
        if (w.status === "done") stats.strength.done += 1;
      } else {
        stats[w.sport].planned += Number(w.targetDistance || 0);
        if (w.status === "done") stats[w.sport].done += Number(w.actualDistance || 0);
      }
    });

  return stats;
}

function statsBlock(stats) {
  return `
    <div class="stats-grid">
      ${Object.entries(SPORTS).map(([key, sport]) => `
        <div class="stat-card">
          <strong><span class="dot ${sport.colorClass}"></span> ${sport.label}</strong>
          ${key === "strength"
            ? `<span>Planifiées : ${stats[key].planned}</span><span>Réalisées : ${stats[key].done}</span>`
            : `<span>Planifiée : ${fmt(stats[key].planned)} km</span><span>Réalisée : ${fmt(stats[key].done)} km</span>`
          }
        </div>
      `).join("")}
    </div>
  `;
}

function getPeriodsInRange(start, end) {
  const s = toISODate(start);
  const e = toISODate(end);
  return state.data.periods.filter(p => p.startDate <= e && p.endDate >= s);
}

function periodReminder(periods) {
  if (!periods.length) return `<div class="period-pills"><span class="pill">Aucune période active</span></div>`;
  return `<div class="period-pills">${periodPills(periods)}</div>`;
}

function periodPills(periods) {
  return periods.map(p => `<span class="pill ${p.category}">${PERIOD_LABELS[p.category]}</span>`).join("");
}

function setActiveTab(view) {
  document.querySelectorAll(".tabs button").forEach(b => {
    b.classList.toggle("active", b.dataset.view === view);
  });
}

function datesBetween(start, end) {
  const dates = [];
  const d = new Date(start);
  while (d <= end) {
    dates.push(new Date(d));
    d.setDate(d.getDate() + 1);
  }
  return dates;
}

function startOfWeek(date) {
  const d = new Date(date);
  const day = (d.getDay() + 6) % 7;
  d.setDate(d.getDate() - day);
  d.setHours(0, 0, 0, 0);
  return d;
}

function endOfWeek(date) {
  const d = startOfWeek(date);
  d.setDate(d.getDate() + 6);
  return d;
}

function toISODate(date) {
  const d = new Date(date);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function parseISODate(str) {
  const [y, m, d] = str.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function formatISODate(str) {
  return formatShortDate(parseISODate(str));
}

function formatShortDate(date) {
  return new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(date);
}

function formatLongDate(date) {
  return new Intl.DateTimeFormat("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(date);
}

function monthName(date) {
  return new Intl.DateTimeFormat("fr-FR", { month: "long" }).format(date);
}

function weekdayName(date) {
  return new Intl.DateTimeFormat("fr-FR", { weekday: "long" }).format(date);
}

function weekdays() {
  return ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
}

function unique(arr) {
  return [...new Set(arr)];
}

function statusLabel(status) {
  return {
    planned: "Planifié",
    done: "Réalisé",
    abandoned: "Abandonné"
  }[status] || status;
}

function fmt(n) {
  return Number(n || 0).toFixed(1).replace(".0", "");
}

function escapeHtml(text) {
  return text.replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[char]));
}

render();
