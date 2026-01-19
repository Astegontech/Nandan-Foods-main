import jwt from "jsonwebtoken";

const authUser = (req, res, next) => {
  const { token } = req.cookies;
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
