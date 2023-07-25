const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      picturePath,
      friends,
      location,
      occupation,
    } = req.body;

    // Validate that the firstname field is present and not empty
    if (!firstName) {
      return res.status(400).json({ error: 'First name is required.' });
    }

    console.log(req.body);

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      firstName,
        lastName,
        email,
        password: hashedPassword,
        picturePath,
        friends,
        location,
        occupation,
        viewedProfile: Math.floor(Math.random() * 1000),
        impressions: Math.floor(Math.random() * 1000),
    });

    const user = await newUser.save();
    res.status(200).json(user);


  } catch (err) {
    res.status(500).json(err);
  }
};

const login = async (req, res) => {
  try{

    const {email, password} = req.body;
    const user = await User.findOne({email});

    !user && res.status(404).json("user not found");

    const validPassword = await bcrypt.compare(password, user.password);
    !validPassword && res.status(400).json("wrong password");

    const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: "1d"});
    res.status(200).json({user, token});



  } catch (err) {
    res.status(500).json(err);
  }

}


module.exports = { register, login };