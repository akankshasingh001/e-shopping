const fs = require('fs');
const crypto = require('crypto');
const util = require('util');

const scrypt = util.promisify(crypto.scrypt);

class UsersRepository {
  constructor(filename) {
    //check if file exist or not
    if (!filename) {
      throw new Error('Creating a repository requires a filename');
    }
    this.filename = filename;
    //if file exits access with file name otehrwise create a new file
    try {
      fs.accessSync(this.filename);
    } catch (err) {
      fs.writeFileSync(this.filename, '[]');
    }
  }
  //access all users
  async getAll() {
    return JSON.parse(
      await fs.promises.readFile(this.filename, {
        encoding: 'utf8'
      })
    );
  }
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

    return hashed === hashedSupplied;
  }
  async writeAll(records) {
    //Write the updated 'records' array back to this.filename
    await fs.promises.writeFile(
      this.filename,
      JSON.stringify(records, null, 2)
    );
  }
  //Created random ID using crypto(randomBytes)
  randomId() {
    return crypto.randomBytes(4).toString('hex');
  }
  //getsingle user by id
  async getOne(id) {
    const records = await this.getAll();
    return records.find(record => record.id === id);
  }
  //delete user by id
  async delete(id) {
    const records = await this.getAll();
    const filteredRecords = records.filter(record => record.id !== id);
    await this.writeAll(filteredRecords);
  }
  //update users
  async update(id, attrs) {
    const records = await this.getAll();
    const record = records.find(record => record.id === id);

    if (!record) {
      throw new Error(`Record with id ${id} not found`);
    }
    Object.assign(record, attrs);
    await this.writeAll(records);
  }
  //filter user
  async getOneBy(filters) {
    const records = await this.getAll();
    for (let record of records) {
      let found = true;

      for (let key in filters) {
        if (record[key] !== filters[key]) {
          found = false;
        }
      }
      if (found) {
        return record;
      }
    }
  }
}
module.exports = new UsersRepository('users.json');
