const layout = require('../layout');

const getErrorMessage = (errors, prop) => {
  try {
    return errors.mapped()[prop].msg;
  } catch (err) {
    return '';
  }
};

module.exports = ({ req, errors }) => {
  return layout({
    content: `
  <div>
    Your id is : ${req.session.userId}
    <form method="POST">
      <input name="email" placeholder="email"/>
        ${getErrorMessage(errors, 'email')}
      <input name="password" placeholder="password"/>
        ${getErrorMessage(errors, 'password')}
      <input name="passwordConfirmation" placeholder="password confirmation"/>
        ${getErrorMessage(errors, 'passwordConfirmation')}
      <button>Sign Up</button>
    </form>
  </div>`
  });
};
