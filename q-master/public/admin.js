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

function renderQueue(data) {
  queueList.innerHTML = "";

  if (data.waitingQueue.length === 0) {
    queueList.innerHTML = '<p class="empty-state">No customers are waiting.</p>';
    return;
  }

  data.waitingQueue.forEach((ticket, index) => {
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

function renderHistory(data) {
  historyList.innerHTML = "";

  if (data.history.length === 0) {
    historyList.innerHTML = '<p class="empty-state">No queue history yet.</p>';
    return;
  }

  data.history.forEach((entry) => {
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

  currentWaiting.textContent = waitingQueue.length;
  totalServed.textContent = history.filter((entry) => entry.status === "Served").length;
  totalSkipped.textContent = history.filter((entry) => entry.status === "Skipped").length;
  totalRemoved.textContent = history.filter((entry) => entry.status === "Removed").length;
  adminCurrentServing.textContent = data.currentServing || "None";
  pauseButton.disabled = data.isPaused;
  resumeButton.disabled = !data.isPaused;
  callNextButton.disabled = waitingQueue.length === 0;

  renderQueue({ ...data, waitingQueue });
  renderHistory({ ...data, history });
}

async function fetchQueue() {
  const response = await fetch("/api/queue", { cache: "no-store" });
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
setInterval(fetchQueue, 3000);    const position = document.createElement("small");

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

function renderHistory(data) {
  historyList.innerHTML = "";

  if (data.history.length === 0) {
    historyList.innerHTML = '<p class="empty-state">No queue history yet.</p>';
    return;
  }

  data.history.forEach((entry) => {
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
  currentWaiting.textContent = data.statistics.currentWaiting;
  totalServed.textContent = data.statistics.totalServed;
  totalSkipped.textContent = data.statistics.totalSkipped;
  totalRemoved.textContent = data.statistics.totalRemoved;
  adminCurrentServing.textContent = data.currentServing || "None";
  pauseButton.disabled = data.isPaused;
  resumeButton.disabled = !data.isPaused;
  callNextButton.disabled = data.waitingQueue.length === 0;

  renderQueue(data);
  renderHistory(data);
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
setInterval(fetchQueue, 3000);    const position = document.createElement("small");

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

function renderHistory(data) {
  historyList.innerHTML = "";

  if (data.history.length === 0) {
    historyList.innerHTML = '<p class="empty-state">No queue history yet.</p>';
    return;
  }

  data.history.forEach((entry) => {
    const row = document.createElement("div");
    row.className = "history-row";

    const details = document.createElement("div");
    const ticketNumber = document.createElement("strong");
    const customerName = document.createElement("span");

    ticketNumber.textContent = entry.ticketNumber;
    customerName.textContent = entry.customerName;
    details.append(ticketNumber, customerName);

    const statusDetails = document.createElement("div");
    const status = document.createElement("span");
    const actionTime = document.createElement("small");

    status.className = "status-pill";
    status.textContent = entry.status;
    actionTime.textContent = formatTime(entry.actionTime);
    statusDetails.append(status, actionTime);

    row.append(details, statusDetails);
    historyList.appendChild(row);
  });
}

function updateAdminView(data) {
  currentWaiting.textContent = data.statistics.currentWaiting;
  totalServed.textContent = data.statistics.totalServed;
  totalSkipped.textContent = data.statistics.totalSkipped;
  totalRemoved.textContent = data.statistics.totalRemoved;
  adminCurrentServing.textContent = data.currentServing || "None";
  pauseButton.disabled = data.isPaused;
  resumeButton.disabled = !data.isPaused;
  callNextButton.disabled = data.waitingQueue.length === 0;

  renderQueue(data);
  renderHistory(data);
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
