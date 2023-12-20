const authorize = (req, res, next) => {
    const secretKey = req.body.secretKey;
    const admin = req.body.is_user_admin;
  
    // Check if the API key is valid (this is a simple example)
    if (admin && secretKey !== "3141592653589793236264") {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  
    next();
}

module.exports = authorize;