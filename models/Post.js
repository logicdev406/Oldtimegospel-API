const db = require('../db/connection');
const { v4: uuidv4 } = require('uuid');
const { randomUUID } = require('crypto');

class Post {
  constructor(title, description, image) {
    this.title = title;
    this.description = description;
    this.image = image;
  }

  async save() {
    let d = new Date();
    let yyyy = d.getFullYear();
    let mm = d.getMonth() + 1;
    let dd = d.getDate();

    let createdAt = `${yyyy}-${mm}-${dd}`;
    let id = randomUUID();

    let sql = `
      INSERT INTO posts( id, title, image, description, createdAt )
      VALUES('${id}','${this.title}','${this.image}','${this.description}','${createdAt}'
      )
      `;

    const [newPost, _] = await db.execute(sql);

    return newPost;
  }

  static listPosts() {
    let sql = ` SELECT * FROM posts `;

    return db.execute(sql);
  }

  static findById(id) {
    let sql = ` SELECT * FROM posts WHERE id = ${id} `;

    return db.execute(sql);
  }

  static deleteById(id) {
    let sql = ` DELETE * FROM posts WHERE id = ${id} `;

    return db.execute(sql);
  }
}

module.exports = Post;
