const fs = require('fs');
const crypto = require('crypto');

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
    //{email: 'abc@gmail.com',password:'abc123'}
    const records = await this.getAll(); // this will give list of users
    records.push(attrs); // push new user
    await this.writeAll(records);
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
}
const test = async () => {
  const repo = new UsersRepository('users.json');
  const user = await repo.getOne('4640523a');
  console.log(user);
};

test();
