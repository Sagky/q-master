const queueState = {
  isPaused: false,
  ticketCounter: 0,
  currentServing: null,
  waitingQueue: [],
  history: [],
  statistics: {
    totalServed: 0,
    totalSkipped: 0,
    totalRemoved: 0
  }
};

module.exports = queueState;
