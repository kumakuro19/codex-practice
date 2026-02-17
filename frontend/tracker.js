const HABITS = [
  { id: "drink_1_5l", label: "1.5L飲んだ" },
  { id: "breakfast", label: "朝食を食べた" },
  { id: "stretch_10m", label: "10分以上ストレッチした" },
  { id: "walk_20m", label: "20分以上歩いた" },
  { id: "snack_limit", label: "間食を1回以内にした" },
  { id: "no_phone_before_bed", label: "就寝前30分はスマホを見なかった" },
  { id: "sleep_before_midnight", label: "0時までに就寝した" },
];

const STORAGE_KEY = "habit_tracker_v1";

function getTodayKey() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function loadStore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return typeof parsed === "object" && parsed ? parsed : {};
  } catch (error) {
    console.error("Failed to parse habit store.", error);
    return {};
  }
}

function saveStore(store) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

function formatTodayLabel(dateKey) {
  const [year, month, day] = dateKey.split("-");
  return `${year}年${month}月${day}日`;
}

function renderProgress(records) {
  const doneCount = HABITS.filter((habit) => records[habit.id]).length;
  const total = HABITS.length;
  const ratio = total === 0 ? 0 : Math.round((doneCount / total) * 100);

  const textEl = document.getElementById("trackerProgressText");
  if (textEl) {
    textEl.textContent = `達成率: ${doneCount}/${total} (${ratio}%)`;
  }

  const fillEl = document.getElementById("trackerProgressFill");
  if (fillEl) {
    fillEl.style.width = `${ratio}%`;
  }
}

function renderHabits(records, onToggle) {
  const listEl = document.getElementById("habitList");
  if (!listEl) return;

  listEl.innerHTML = "";
  HABITS.forEach((habit) => {
    const li = document.createElement("li");
    li.className = "habit-item";

    const label = document.createElement("label");
    label.className = "habit-label";
    label.setAttribute("for", habit.id);

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = habit.id;
    checkbox.checked = Boolean(records[habit.id]);
    checkbox.addEventListener("change", () => onToggle(habit.id, checkbox.checked));

    const text = document.createElement("span");
    text.textContent = habit.label;

    label.append(checkbox, text);
    li.append(label);
    listEl.append(li);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const dateKey = getTodayKey();
  const dateEl = document.getElementById("trackerDate");
  if (dateEl) {
    dateEl.textContent = `対象日: ${formatTodayLabel(dateKey)}`;
  }

  const store = loadStore();
  const todayRecords = { ...(store[dateKey] || {}) };

  function onToggle(id, checked) {
    todayRecords[id] = checked;
    store[dateKey] = todayRecords;
    saveStore(store);
    renderProgress(todayRecords);
  }

  renderHabits(todayRecords, onToggle);
  renderProgress(todayRecords);
});
