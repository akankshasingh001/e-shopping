const layout = require('../layout');
const { getErrorMessage } = require('../../helper');

module.exports = ({ errors }) => {
  return layout({
    content: `
    <div>
      <form method="POST">
        <input name="email" placeholder="email"/>
          ${getErrorMessage(errors, 'email')}
        <input name="password" placeholder="password"/>
          ${getErrorMessage(errors, 'password')}
        <button>Sign In</button>
      </form>
    </div>`
  });
};
