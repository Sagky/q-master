const queueState = require("./dataStore");

const WAIT_TIME_PER_PERSON_MINUTES = 5;

function generateTicketNumber() {
  queueState.ticketCounter += 1;
  return `A${String(queueState.ticketCounter).padStart(3, "0")}`;
}

function createQueueSnapshot(ticketNumber = null) {
  const position = ticketNumber
    ? queueState.waitingQueue.findIndex((item) => item.ticketNumber === ticketNumber) + 1
    : null;

  const peopleAhead = position && position > 0 ? position - 1 : 0;

  return {
    isPaused: queueState.isPaused,
    currentServing: queueState.currentServing,
    waitingQueue: queueState.waitingQueue,
    history: queueState.history,
    statistics: {
      currentWaiting: queueState.waitingQueue.length,
      totalServed: queueState.statistics.totalServed,
      totalSkipped: queueState.statistics.totalSkipped,
      totalRemoved: queueState.statistics.totalRemoved
    },
    customerTicket: ticketNumber
      ? {
          ticketNumber,
          position: position || null,
          estimatedWaitMinutes: peopleAhead * WAIT_TIME_PER_PERSON_MINUTES,
          status: position ? "Waiting" : "Not in waiting queue"
        }
      : null
  };
}

function joinQueue(customerName) {
  if (queueState.isPaused) {
    const error = new Error("Queue is currently paused. Please try again later.");
    error.statusCode = 409;
    throw error;
  }

  const cleanName = customerName.trim();

  if (!cleanName) {
    const error = new Error("Customer name is required.");
    error.statusCode = 400;
    throw error;
  }

  const ticketNumber = generateTicketNumber();
  const newTicket = {
    ticketNumber,
    customerName: cleanName,
    joinedAt: new Date().toISOString()
  };

  queueState.waitingQueue.push(newTicket);

  return createQueueSnapshot(ticketNumber);
}

function addHistoryEntry(ticket, status) {
  queueState.history.unshift({
    ticketNumber: ticket.ticketNumber,
    customerName: ticket.customerName,
    status,
    actionTime: new Date().toISOString()
  });
}

function callNext() {
  const nextTicket = queueState.waitingQueue.shift();

  if (!nextTicket) {
    return createQueueSnapshot();
  }

  queueState.currentServing = nextTicket.ticketNumber;
  queueState.statistics.totalServed += 1;
  addHistoryEntry(nextTicket, "Served");

  return createQueueSnapshot();
}

function skipTicket(ticketNumber) {
  const ticketIndex = queueState.waitingQueue.findIndex(
    (ticket) => ticket.ticketNumber === ticketNumber
  );

  if (ticketIndex === -1) {
    const error = new Error("Ticket was not found in the waiting queue.");
    error.statusCode = 404;
    throw error;
  }

  const [ticket] = queueState.waitingQueue.splice(ticketIndex, 1);
  queueState.statistics.totalSkipped += 1;
  addHistoryEntry(ticket, "Skipped");

  return createQueueSnapshot();
}

function removeTicket(ticketNumber) {
  const ticketIndex = queueState.waitingQueue.findIndex(
    (ticket) => ticket.ticketNumber === ticketNumber
  );

  if (ticketIndex === -1) {
    const error = new Error("Ticket was not found in the waiting queue.");
    error.statusCode = 404;
    throw error;
  }

  const [ticket] = queueState.waitingQueue.splice(ticketIndex, 1);
  queueState.statistics.totalRemoved += 1;
  addHistoryEntry(ticket, "Removed");

  return createQueueSnapshot();
}

function pauseQueue() {
  queueState.isPaused = true;
  return createQueueSnapshot();
}

function resumeQueue() {
  queueState.isPaused = false;
  return createQueueSnapshot();
}

module.exports = {
  joinQueue,
  createQueueSnapshot,
  callNext,
  skipTicket,
  removeTicket,
  pauseQueue,
  resumeQueue
};
