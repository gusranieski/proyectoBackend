export const checkRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.json({ status: "error", message: "debes estar autenticado" });
    }
    if (!roles.includes(req.user.role)) {
      return res.json({ status: "error", message: "no estás autorizado" });
    }
    next();
  };
};
