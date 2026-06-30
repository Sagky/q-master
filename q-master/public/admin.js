const queueList = document.getElementById("queueList");
const historyList = document.getElementById("historyList");
const currentWaiting = document.getElementById("currentWaiting");
const totalServed = document.getElementById("totalServed");
const totalSkipped = document.getElementById("totalSkipped");
const totalRemoved = document.getElementById("totalRemoved");
const adminCurrentServing = document.getElementById("adminCurrentServing");
const callNextButton = document.getElementById("callNextButton");
const pauseButton = document.getElementById("pauseButton");
const resumeButton = document.getElementById("resumeButton");

function formatTime(isoDate) {
  return new Date(isoDate).toLocaleString([], {
    hour: "2-digit",
    minute: "2-digit",
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}

function renderQueue(waitingQueue) {
  queueList.innerHTML = "";

  if (waitingQueue.length === 0) {
    queueList.innerHTML = '<p class="empty-state">No customers are waiting.</p>';
    return;
  }

  waitingQueue.forEach((ticket, index) => {
    const row = document.createElement("div");
    row.className = "queue-row";

    const details = document.createElement("div");
    const ticketNumber = document.createElement("strong");
    const customerName = document.createElement("span");
    const position = document.createElement("small");

    ticketNumber.textContent = ticket.ticketNumber;
    customerName.textContent = ticket.customerName;
    position.textContent = `Position ${index + 1}`;

    details.append(ticketNumber, customerName, position);

    const actions = document.createElement("div");
    actions.className = "row-actions";

    const skipButton = document.createElement("button");
    skipButton.type = "button";
    skipButton.dataset.action = "skip";
    skipButton.dataset.ticket = ticket.ticketNumber;
    skipButton.textContent = "Skip";

    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.dataset.action = "remove";
    removeButton.dataset.ticket = ticket.ticketNumber;
    removeButton.textContent = "Remove";

    actions.append(skipButton, removeButton);
    row.append(details, actions);
    queueList.appendChild(row);
  });
}

function renderHistory(history) {
  historyList.innerHTML = "";

  if (history.length === 0) {
    historyList.innerHTML = '<p class="empty-state">No queue history yet.</p>';
    return;
  }

  history.forEach((entry) => {
    const row = document.createElement("div");
    row.className = "history-row";

    const ticketDetails = document.createElement("div");
    const ticketNumber = document.createElement("strong");
    ticketNumber.textContent = entry.ticketNumber;
    ticketDetails.append(ticketNumber);

    const customerDetails = document.createElement("div");
    const customerName = document.createElement("span");
    customerName.textContent = entry.customerName;
    customerDetails.append(customerName);

    const statusDetails = document.createElement("div");
    const status = document.createElement("span");
    status.className = "status-pill";
    status.textContent = entry.status;
    statusDetails.append(status);

    const timeDetails = document.createElement("div");
    const actionTime = document.createElement("small");
    actionTime.textContent = formatTime(entry.actionTime);
    timeDetails.append(actionTime);

    row.append(ticketDetails, customerDetails, statusDetails, timeDetails);
    historyList.appendChild(row);
  });
}

function updateAdminView(data) {
  const waitingQueue = data.waitingQueue || [];
  const history = data.history || [];
  const statistics = data.statistics || {};

  currentWaiting.textContent = waitingQueue.length;
  totalServed.textContent = statistics.totalServed || 0;
  totalSkipped.textContent = statistics.totalSkipped || 0;
  totalRemoved.textContent = statistics.totalRemoved || 0;
  adminCurrentServing.textContent = data.currentServing || "None";
  pauseButton.disabled = data.isPaused;
  resumeButton.disabled = !data.isPaused;
  callNextButton.disabled = waitingQueue.length === 0;

  renderQueue(waitingQueue);
  renderHistory(history);
}

async function fetchQueue() {
  const response = await fetch("/api/queue");
  const data = await response.json();
  updateAdminView(data);
}

async function postAction(url) {
  const response = await fetch(url, { method: "POST" });
  const data = await response.json();

  if (response.ok) {
    updateAdminView(data);
  }
}

callNextButton.addEventListener("click", () => postAction("/api/call-next"));
pauseButton.addEventListener("click", () => postAction("/api/pause"));
resumeButton.addEventListener("click", () => postAction("/api/resume"));

queueList.addEventListener("click", (event) => {
  const button = event.target.closest("button");

  if (!button) {
    return;
  }

  const ticket = button.dataset.ticket;

  if (button.dataset.action === "skip") {
    postAction(`/api/skip/${ticket}`);
  }

  if (button.dataset.action === "remove") {
    postAction(`/api/remove/${ticket}`);
  }
});

fetchQueue();
setInterval(fetchQueue, 3000);
