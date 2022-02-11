const db = require('../db/connection');

class Post {
  constructor(title, description) {
    this.title = title;
    this.description = description;
  }

  async save() {
    let date = Date.now();

    console.log(date);

    let sql = `
      INSERT INTO posts( title, description, createdAt ) 
      VALUES('${this.title}','${this.description}','${date}'
      )
      `;

    const [newPost, _] = await db.execute(sql);

    return newPost;
  }

  static async listPosts() {
    let sql = ` SELECT * FROM posts `;

    return await db.execute(sql);
  }

  static async findById(id) {
    let sql = ` SELECT * FROM posts WHERE id = ${id} `;

    return await db.execute(sql);
  }
}

module.exports = Post;
