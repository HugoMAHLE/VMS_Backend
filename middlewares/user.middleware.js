import jwt from 'jsonwebtoken';

export const verifyUserType = (requiredType) => {
  return (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Token not provided" });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.userid = decoded.userid;

      if (decoded.type !== requiredType) {
        return res.status(403).json({ error: "Access denied" });
      }

      next();
    } catch (error) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }
  };
};
