import User from '../models/User.js';

/* GET */
export const getUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
}

export const getUserFriends = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);

        /* USING PROMISE FOR CALLING MULTIPLE APIS FROM DATABASE */
        const friends = await Promise.all(
            user.friends.map((id) => User.findById(id))
        );
        /* FORMAT THE FRIENDS IN PROPER WAY FOR FRONTEND */
        const formattedFriends = friends.map(
            ({ _id, firstName, lastName, occupation, location, picturePath }) => {
                return { _id, firstName, lastName, occupation, location, picturePath };
            }
        );
        res.status(200).json(formattedFriends);
    } catch (error) {
        next(error);
    }
}

/* UPDATE */
export const addRemoveFriend = async (req, res, next) => {
    try {
        const { id, friendId } = req.params;
        const user = await User.findById(id);
        const friend = await User.findById(friendId);

        if (user.friends.includes(friendId)) {
            user.friends = user.friends.filter((id) => id !== friendId);
            friend.friends = friend.friends.filter((id) => id !== id);
        } else {
            user.friends.push(friendId);
            friend.friends.push(id);
        }

        await user.save();
        await friend.save();

        /* FORMAT THE FRIENDS IN PROPER WAY FOR FRONTEND */
        const formattedFriends = friends.map(
            ({ _id, firstName, lastName, occupation, location, picturePath }) => {
                return { _id, firstName, lastName, occupation, location, picturePath };
            }
        );
        res.status(200).json(formattedFriends);
    } catch (error) {
        next(error);
    }
}