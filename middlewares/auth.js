const User = require("../models/User");
const CustomErrorHandler = require("../services/CustomErrorHandler");
const jwt = require("jsonwebtoken");

module.exports = isAuthenticated = async (req, res, next) => {
  try {
    console.log(req.headers)
    const authHeader = req.headers.authorization;

    console.log(authHeader)
    if (!authHeader) return next(CustomErrorHandler.unAuthenticated());

    const token = authHeader.split(" ")[1];

    const user = await jwt.verify(token, "myjwtsecret");

    if (!user) throw CustomErrorHandler.unAuthenticated("Token is invalid");

    const getUser = await User.findOne({ _id: user.id }).select(
      "-_v -password"
    );
    req.user = getUser;
    return next();
  } catch (error) {
    res.status(500).json(CustomErrorHandler.serverError());
  }
};
