const response = require('../helper/response');
const User = require('../models/User');

class UserController {
  // List users
  static async listUsers(req, res) {
    try {
      const users = await User.findAll();

      if (!users) {
        return res
          .status(404)
          .send(response('Faild to fetch users', {}, false));
      }

      res.send(response('Featched users successfully', users));
    } catch (err) {
      console.log(err.message);
    }
  }
}

module.exports = UserController;
