// const fs = require('fs');
const crypto = require('crypto');
const util = require('util');
const repository = require('./repository');

const scrypt = util.promisify(crypto.scrypt);

class UsersRepository extends repository {
  //create user
  async create(attrs) {
    attrs.id = this.randomId();

    const salt = crypto.randomBytes(8).toString('hex');
    const hashed = await scrypt(attrs.password, salt, 64);
    //{email: '',password:''}
    const records = await this.getAll(); // this will give list of users
    const record = { ...attrs, password: `${hashed.toString('hex')}.${salt}` };
    records.push(record); // push new user and password is hashed & salted

    await this.writeAll(records);

    return record;
  }
  async comparePasswords(saved, supplied) {
    //saved -> passsword saved in our database. 'hashed.salt'
    //supplied -> password given to us by a user trying signIn

    const [hashed, salt] = saved.split('.'); //Destructring Array
    const hashedSupplied = await scrypt(supplied, salt, 64);

    return hashed === hashedSupplied.toString('hex');
  }
}
module.exports = new UsersRepository('users.json');
