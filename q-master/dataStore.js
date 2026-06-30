const queueState = {
  isPaused: false,
  ticketCounter: 0,
  currentServing: null,
  waitingQueue: [],
  history: []
};

module.exports = queueState;
