const jwt = require("jsonwebtoken");
const User = require("../models/User");
const verifyToken = (req, res, next) => {
try{

    let token = req.headers.authorization.split(" ")[1];
    console.log(token)

    !token && res.status(401).json("You are not authenticated!");

    if (token.startsWith("Bearer ")) {
        // Remove Bearer from string
        token = token.slice(7, token.length).trimLeft();
      }

      const verified = jwt.verify(token, process.env.JWT_SECRET);
      req.user = verified;
        next();



}catch(err){
    res.status(500).json(err);
}

}

module.exports = {
    verifyToken
}