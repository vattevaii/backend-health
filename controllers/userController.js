const bcrypt = require("bcrypt");
const User = require("../models/User");
const Person = require("../models/Person");
const CustomErrorHandler = require("../services/CustomErrorHandler");

const userController = {
  create: async (req, res, next) => {
    const newPerson = new Person({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      age: req.body.age,
      address: req.body.address,
      majorId: req.body.majorId,
    });

    const savedPerson = await newPerson.save();

    res
      .status(200)
      .json({ person: savedPerson, message: "Person Created Successfully" });
  },

  update: async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isExpert) {
      if (req.body.password) {
        try {
          const salt = await bcrypt.genSalt(10);
          req.body.password = await bcrypt.hash(req.body.password, salt);
        } catch (error) {
          return res.status(500).json(error);
        }
      }
      try {
        await User.findByIdAndUpdate(req.params.id, {
          $set: req.body,
        });
        return res.status(200).json("Account has been updated");
      } catch (error) {
        return res.status(500).json(error);
      }
    } else {
      return res.status(403).json("You can update only your account");
    }
  },

  delete: async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isExpert) {
      try {
        await User.findByIdAndDelete(req.params.id);
        return res.status(200).json("Account has been deleted");
      } catch (error) {
        return res.status(500).json(error);
      }
    } else {
      return res.status(403).json("You can delete only your account");
    }
  },

  getExperts: async (req, res) => {
    try {
      const users = await User.find({ isExpert: true }).select(
        "-_v -password -isExpert -createdAt -updatedAt"
      );
      const data = users.map(async (user) => {
        const data = await Person.findById({ _id: user.person });
        const { firstName, lastName, age, address, majorId } = data._doc;
        const { email, isExpert, profilePicture, isParent, children } = user;

        return {
          email,
          isExpert,
          profilePicture,
          isParent,
          children,
          firstName,
          lastName,
          age,
          address,
          majorId,
        };
      });

      const resolvedData = await Promise.all(data);
      return res.status(200).json(resolvedData);
    } catch (error) {
      return res.status(500).json(error);
    }
  },

  getPeople: async (req, res) => {
    try {
      const users = await User.find({ isExpert: false }).select(
        "-_v -password -isExpert -createdAt -updatedAt"
      );
      const data = users.map(async (user) => {
        const data = await Person.findById({ _id: user.person });
        const { firstName, lastName, age, address, majorId } = data._doc;
        const { email, isExpert, profilePicture, isParent, children } = user;

        return {
          email,
          isExpert,
          profilePicture,
          isParent,
          children,
          firstName,
          lastName,
          age,
          address,
          majorId,
        };
      });

      const resolvedData = await Promise.all(data);
      return res.status(200).json(resolvedData);
    } catch (error) {
      return res.status(500).json(error);
    }
  },

  getPersonByMajorId: async (req, res) => {
    try {
      const person = await Person.findOne({
        majorId: req.params.majorId,
      }).select("-_v -createdAt -updatedAt");

      if (!person) return res.status(404).json({ message: "User Not Found" });

      const user = await User.findOne({ person: person._id });
      if (!user)
        return res
          .status(200)
          .json({ message: "User has not registered", person });

      const { firstName, lastName, age, address, majorId } = person;
      const { email, isExpert, profilePicture, isParent, children } = user;

      const data = {
        email,
        isExpert,
        profilePicture,
        isParent,
        children,
        firstName,
        lastName,
        age,
        address,
        majorId,
      };

      return res
        .status(200)
        .json({ person: data, message: "User has been registered" });
    } catch (error) {
      return res.status(500).json(error);
    }
  },

  getPersonById: async (req, res) => {
    try {
      // console.log("sadfasdfas", req.params)
      const person = await Person.findOne({
        _id: req.params.id,
      }).select("-_v -createdAt -updatedAt");
      // console.log("person", person)

      if (!person) return res.status(404).json({ message: "User Not Found" });

      const user = await User.findOne({ person: person._id });
      // console.log("user", user)

      if (!user)
        return res
          .status(200)
          .json({ message: "User has not registered", person });

      const { firstName, lastName, age, address, majorId } = person;
      const { email, isExpert, profilePicture, isParent, children } = user;

      const data = {
        email,
        isExpert,
        profilePicture,
        isParent,
        children,
        firstName,
        lastName,
        age,
        address,
        majorId,
      };

      return res
        .status(200)
        .json({ person: data, message: "User has been registered" });
    } catch (error) {
      console.log('errrror occurred')
      return res.status(500).json(error);
    }
  },
};

module.exports = userController;
