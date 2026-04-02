const { verify } = require("jsonwebtoken");

function validateTokenMiddleware(req, res, next) {
  const rawAccessToken = req.headers.authorization;

  console.log("Authorization Header:", rawAccessToken); // ← log 1

  if (!rawAccessToken) {
    return res.status(401).json({
      message: "User is not Authenticated",
    });
  }

  const accessToken = req.headers.authorization.split(" ")[1];

  console.log("Extracted Token:", accessToken); // ← log 2

  if (!accessToken || accessToken === "null") {
    return res.status(401).json({
      message: "User is not Authenticated",
    });
  }

  try {
    const verifyToken = verify(accessToken, process.env.AUTH_SECRET_KEY);
    console.log("Decoded Token:", verifyToken); // ← log 3
    req.user = verifyToken;
    next();
  } catch (err) {
    console.error("JWT Error:", err.message); // ← log 4: will show exact problem
    return res.status(401).json({
      message: "User is not Authenticated",
    });
  }
}

module.exports = {
  validateTokenMiddleware,
};