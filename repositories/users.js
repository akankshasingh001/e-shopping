const fs = require('fs');

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
  async getAll() {
    return JSON.parse(
      await fs.promises.readFile(this.filename, {
        encoding: 'utf8'
      })
    );
  }

  async create(attrs) {
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
}
const test = async () => {
  const repo = new UsersRepository('users.json');
  await repo.create({ email: 'test@test.com', password: 'password' });
  const users = await repo.getAll();
  console.log(users);
};

test();
