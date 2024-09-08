class ExpressError extends Error {
  constructor(message, status=400) {
    super();
    this.message = message;
    this.status = status;
  }
}

export default ExpressError;