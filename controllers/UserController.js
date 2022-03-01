const response = require('../helper/response');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Config import
const { secret } = require('../config/config');

class UserController {
  // List users
  static async listUsers(req, res) {
    try {
      const users = await User.findAll({
        attributes: { exclude: ['password'] }
      });

      if (!users) {
        return res
          .status(404)
          .send(response('Faild to fetch users', {}, false));
      }

      res.send(response('Fetched users successfully', users));
    } catch (err) {
      console.log(err.message);
    }
  }

  // fetch user by id
  static async findUserbyId(req, res) {
    try {
      const id = req.params.id;

      const user = await User.findOne({
        attributes: { exclude: ['password'] },
        where: { id: id }
      });

      if (!user) {
        return res.status(404).send(response('Faild to fetch user', {}, false));
      }

      res.send(response('Fetched user successfully', user));
    } catch (err) {
      console.log(err.message);
    }
  }

  // Register user
  static async createUser(req, res) {
    try {
      const { firstName, lastName, email, password } = req.body;

      // Check if the given id is valide
      const emailExists = await User.findOne({
        where: {
          email: email
        }
      });

      if (emailExists)
        return res
          .status(500)
          .send(
            response(' User with the given email already exists', {}, false)
          );

      const user = await User.create({
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: bcrypt.hashSync(password, 10)
      });

      if (!user)
        return res
          .status(500)
          .send(response('The user can not be created', {}, false));

      res.send(response('User was created successfully', user));
    } catch (err) {
      console.log(err.message);
    }
  }

  // Update user by id
  static async updateUserById(req, res) {
    try {
      const { firstName, lastName, role } = req.body;
      const id = req.params.id;

      // Check if the given id is valide
      const userExists = await User.findOne({
        where: {
          id: id
        }
      });

      if (!userExists)
        return res
          .status(500)
          .send(response(' User with the given ID does not exists', {}, false));

      const user = await User.update(
        {
          firstName: firstName,
          lastName: lastName,
          role: role
        },
        { where: { id: id } }
      );

      if (!user)
        return res
          .status(500)
          .send(response('The user can not be updated', {}, false));

      return res.send(response('User was successfullly updated', user));
    } catch (err) {
      console.log(err.message);
    }
  }

  // Login user
  static async loginUser(req, res) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ where: { email: email } });

      if (!user) {
        return res.status(404).send(response('user not found', {}, false));
      }

      if (user && bcrypt.compareSync(password, user.password)) {
        const token = jwt.sign(
          {
            id: user.id,
            role: user.role
          },
          secret,
          { expiresIn: '1d' }
        );

        return res.send(
          response('Login successful', {
            user: user.email,
            token: token
          })
        );
      } else {
        res.status(403).send(response('password is wrong!', {}, false));
      }
    } catch (err) {
      console.log(err.message);
    }
  }

  // Here we are not deleting the actual user but we are changing the accountStatus field of the user from active to notActive
  static async deleteUserById(req, res) {
    try {
      const id = req.params.id;

      const userExists = await User.findOne({ where: { id: id } });

      if (!userExists) {
        return res.status(404).send(response('user not found', {}, false));
      }

      const user = await User.update(
        {
          accountStatus: 'notActive'
        },
        { where: { id: id } }
      );

      if (!user)
        return res
          .status(500)
          .send(response(' User can not be deleted ', {}, false));

      return res.send(response('User was successfullly deleted', user));
    } catch (err) {
      console.log(err.message);
    }
  }
}

module.exports = UserController;
