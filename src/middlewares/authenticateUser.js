// Session-based Authentication Middleware
export const authenticateUser = (req, res, next) => {
  if (req.session && req.session.user) {
    req.user = req.session.user; // Attach user to request
    next();
  } else {
    return res.status(401).json({ message: "Unauthorized: Please log in" });
  }
};

// Role-based Authorization Middleware
export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied: insufficient role" });
    }
    next();
  };
};
