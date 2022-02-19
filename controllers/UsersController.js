const response = require('../helper/response');
const User = require('../models/User');
// const bycrypt = require('bc');

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

  // Register user
  static async createAdminUser(req, res) {
    try {
      const { firstName, lastName, email, role, password } = req.body;

      let user = new User({
        firstName: firstName,
        lastName: lastName,
        role: role,
        email: email,
        password: bcrypt.hashSync(password, 10)
      });
      user = await user.save();

      if (!user)
        return res
          .status(500)
          .send(response('The user can not be created', {}, false));

      res.send(response('User was created successfully', user));
    } catch (error) {
      res.send(response(error.message, {}, false));
    }
  }

  // Update user by id
  static async updateUserById(req, res) {
    // Check if the given id is valide

    const update = {
      ...req.body
    };
    const filter = { _id: req.user.userId };

    try {
      const user = await User.findOneAndUpdate(filter, update, {
        new: true
      }).select('-passwordHash');

      if (!user)
        return res
          .status(500)
          .send(response('The user can not be updated', {}, false));

      return res
        .status(200)
        .send(response('User was successfullly updated', user));
    } catch (error) {
      res.status(409).send(response(error.message, {}, false));
      console.log(error.message);
    }
  }

  // Login user
  static async loginUser(req, res) {
    try {
      const user = await User.findOne({ email: req.body.email });

      if (!user) {
        return res.status(400).send(response('user not found', {}, false));
      }

      if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
        const token = jwt.sign(
          {
            userId: user.id,
            role: user.role
          },
          secret,
          { expiresIn: '1d' }
        );

        return res.status(200).send(
          response('Login successful', {
            user: user.email,
            token: token
          })
        );
      } else {
        res.status(400).send(response('password is wrong!', {}, false));
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  // Delete user
}

module.exports = UserController;
