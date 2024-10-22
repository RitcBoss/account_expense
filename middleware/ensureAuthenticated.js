function ensureAuthenticated(req, res, next) {
  const user = req.user || null;
  if (user) {
    return next();
  }
  res.redirect('/login');
}

module.exports = {
  ensureAuthenticated,
};
