module.exports = {
  getErrorMessage(errors, prop) {
    try {
      return errors.mapped()[prop].msg;
    } catch (err) {
      return '';
    }
  }
};
