const User = require("../models/User");

 const getUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

 const getUserFriends = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    console.log(user);
    const friends = await Promise.all(
      user.followings.map((friendId) => {
        User.findById(friendId);
      })
    );
    let friendList = [];
    friends.map((friend) => {
      const {
        _id,
        firstname,
        lastName,
        picturePath,
        friends,
        location,
        occupation,
      } = friend;

      friendList.push({
        _id,
        firstname,
        lastName,
        picturePath,
        friends,
        location,
        occupation,
      });
    });
    res.status(200).json(friendList);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const addRemoveFriend = async (req, res) => {
  try {
    //get data from body

    const { friendId, id } = req.body;
    console.log(id, friendId);

    const user = await User.findById(id);
    const friend = await User.findById(friendId);

    if (user.friends.includes(friendId)) {
      user.friends = user.friends.filter((id) => id !== friendId);
      friend.friends = friend.friends.filter((id) => id !== user._id);
    } else {
      user.friends.push(friendId);
      friend.friends.push(user._id);
    }

    await user.save();
    await friend.save();

    res.status(200).json({ message: "Friend added/removed successfully" });

  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};


module.exports = {
    getUser,
    getUserFriends,
    addRemoveFriend
}