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
    //open the file called this.filename
    const contents = await fs.promises.readFile(this.filename, {
      encoding: 'utf8'
    });
    //Read its content
    console.log(contents);
    //parse the content
    //Return the parsed data
  }
}
const test = async () => {
  const repo = new UsersRepository('users.json');
  await repo.getAll();
};

test();
