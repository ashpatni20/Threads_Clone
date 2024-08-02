const jwt = require("jsonwebtoken");
const ApiError = require("../utils/ApiError");

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");

    if (!authHeader) {
      return res.status(401).json(new ApiError(401, "Expired token."));
    }

    const userToken = authHeader.split(" ")[1];
    const data = await jwt.verify(userToken, process.env.SECRET_TOKEN_KEY);
    req.user = data;

    next();
  } catch (error) {
    return res
      .status(401)
      .json(new ApiError(401, "Invalid token or expired token.", [error]));
  }
};

module.exports = authMiddleware;
