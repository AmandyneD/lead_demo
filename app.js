const LS_KEY = "lead-demo:custom";

let baseLeads = [];
let customLeads = loadCustom();

const tbody = document.querySelector("#tbody");
const state = document.querySelector("#state");

function loadCustom() {
  try { return JSON.parse(localStorage.getItem(LS_KEY) || "[]"); }
  catch { return []; }
}
function saveCustom() {
  localStorage.setItem(LS_KEY, JSON.stringify(customLeads));
}

function uid() {
  return "L-" + Math.floor(1000 + Math.random() * 9000);
}

async function fetchBaseLeads() {
  state.textContent = "Chargement des leads (API Python)…";
  const res = await fetch("/api/leads");
  const data = await res.json();
  baseLeads = data.leads.map(l => ({ ...l, score: "-" }));
  state.textContent = "OK ✅";
}

function getAllLeads() {
  return [...baseLeads, ...customLeads];
}

function render() {
  const q = document.querySelector("#search").value.trim().toLowerCase();
  const statusFilter = document.querySelector("#filterStatus").value;

  const rows = getAllLeads()
    .filter(l => !q || l.name.toLowerCase().includes(q) || l.id.toLowerCase().includes(q))
    .filter(l => !statusFilter || l.status === statusFilter);

  tbody.innerHTML = rows.map(l => `
    <tr>
      <td>${l.id}</td>
      <td>${escapeHtml(l.name)}</td>
      <td>${l.source}</td>
      <td>${l.status}</td>
      <td>${l.score ?? "-"}</td>
    </tr>
  `).join("");
}

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;" }[c]));
}

async function computeScore(lead) {
  const res = await fetch("/api/score", {
    method: "POST",
    headers: { "Content-Type":"application/json" },
    body: JSON.stringify(lead),
  });
  const data = await res.json();
  return data.score;
}

document.querySelector("#leadForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.querySelector("#name").value.trim();
  const source = document.querySelector("#source").value;
  const statusVal = document.querySelector("#status").value;

  if (!name) return;

  state.textContent = "Calcul du score via l’API Python…";
  const score = await computeScore({ name, source, status: statusVal });

  const lead = { id: uid(), name, source, status: statusVal, score };
  customLeads = [lead, ...customLeads];
  saveCustom();

  document.querySelector("#name").value = "";
  state.textContent = "Ajouté ✅";
  render();
});

document.querySelector("#search").addEventListener("input", render);
document.querySelector("#filterStatus").addEventListener("change", render);

document.querySelector("#resetDemo").addEventListener("click", () => {
  customLeads = [];
  saveCustom();
  state.textContent = "Démo réinitialisée ✅";
  render();
});

(async function init() {
  await fetchBaseLeads();
  render();
})();
