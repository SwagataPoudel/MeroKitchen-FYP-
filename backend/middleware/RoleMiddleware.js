function validateRoleMiddleware(currentRole) {
  return (req, res, next) => {
    const { role } = req.user;
    if (currentRole !== role) {
      return res.status(403).json({ message: "Forbidden Request" });
    }
    next();
  };
}

const adminOnlyMiddleware = validateRoleMiddleware("admin");
const sellerOnlyMiddleware = validateRoleMiddleware("seller");
const customerOnlyMiddleware = validateRoleMiddleware("customer");

module.exports = {
  validateRoleMiddleware,
  adminOnlyMiddleware,
  sellerOnlyMiddleware,
  customerOnlyMiddleware,
};
