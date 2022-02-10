const db = require('../db/connection');

class Posts {
  constructor(title, description) {
    this.title = title;
    this.description = description;
  }

  async save() {}

  static listPosts() {}
}
