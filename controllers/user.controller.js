exports.getData = (req, res) => {
  res.json({ message: `Welcome ${req.session.user.username}, here is your data.` });
};