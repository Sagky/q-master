let customerTicketNumber = localStorage.getItem("qMasterTicketNumber");

const joinForm = document.getElementById("joinForm");
const customerNameInput = document.getElementById("customerName");
const joinMessage = document.getElementById("joinMessage");
const ticketNumber = document.getElementById("ticketNumber");
const queuePosition = document.getElementById("queuePosition");
const estimatedWait = document.getElementById("estimatedWait");
const currentServing = document.getElementById("currentServing");
const queueStatus = document.getElementById("queueStatus");

function showMessage(text, type = "info") {
  joinMessage.textContent = text;
  joinMessage.className = `message ${type}`;
}

function updateCustomerView(data) {
  queueStatus.textContent = data.isPaused ? "Paused" : "Open";
  currentServing.textContent = data.currentServing || "None";

  if (!customerTicketNumber || !data.customerTicket) {
    ticketNumber.textContent = "No ticket yet";
    queuePosition.textContent = "-";
    estimatedWait.textContent = "-";
    return;
  }

  ticketNumber.textContent = data.customerTicket.ticketNumber;

  if (data.customerTicket.position) {
    queuePosition.textContent = data.customerTicket.position;
    estimatedWait.textContent = `${data.customerTicket.estimatedWaitMinutes} min`;
  } else {
    queuePosition.textContent = "-";
    estimatedWait.textContent = "-";
    showMessage("Your ticket is no longer waiting. Please listen for staff updates.", "success");
  }
}

async function fetchQueue() {
  const query = customerTicketNumber ? `?ticket=${customerTicketNumber}` : "";
  const response = await fetch(`/api/queue${query}`);
  const data = await response.json();
  updateCustomerView(data);
}

joinForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  try {
    const response = await fetch("/api/join", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        customerName: customerNameInput.value
      })
    });

    const data = await response.json();

    if (!response.ok) {
      showMessage(data.message || "Unable to join the queue.", "error");
      return;
    }

    customerTicketNumber = data.customerTicket.ticketNumber;
    localStorage.setItem("qMasterTicketNumber", customerTicketNumber);
    customerNameInput.value = "";
    showMessage(`You joined the queue. Your ticket is ${customerTicketNumber}.`, "success");
    updateCustomerView(data);
  } catch (error) {
    showMessage("Could not connect to Q Master. Please try again.", "error");
  }
});

fetchQueue();
setInterval(fetchQueue, 3000);
