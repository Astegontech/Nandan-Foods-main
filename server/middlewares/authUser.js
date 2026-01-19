import jwt from "jsonwebtoken";

const authUser = (req, res, next) => {
  let { token } = req.cookies;

  // Check Authorization header (Bearer <token>)
  if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
    console.log("Auth Middleware - Found token in Header");
  }

  console.log("Auth Middleware - Cookies:", req.cookies, "Token:", token ? "Present" : "Missing");

  if (!token) {
    return res.json({ success: false, message: "Unauthorized" });
  }

  try {
    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
    if (tokenDecode.id) {
      req.userId = tokenDecode.id;
    } else {
      return res.json({ success: false, message: "Not Authorized" });
    }

    next();
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export default authUser;
