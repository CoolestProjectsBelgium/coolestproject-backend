class FunctionalError extends Error {
  constructor(message, options) {
    super(message, options);
  }
}

module.exports = FunctionalError;