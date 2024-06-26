const User = require('../models/User');
const Post = require('../models/Post');

const getUserFeed = async (req, res, next) => {
    const {page = 1, size = 25} = req.query;
    const userId = req.user.userId;
    try {
        const user = await User.findById(userId)

        user.followings.push(req.user.userId);

        if (user.followings.length === 0) return res.status(400).json({message:"You don't have any followings"});

        const feed = await Post.find({userId: {$in: user.followings}}).populate('likes')
            .populate({path: 'userId', select: 'username avatar name' })
            .limit(size)
            .skip((page - 1) * size)
            .sort({createdAt: -1});


        res.status(200).json({posts: feed, page: +page, limit: +size});
    } catch (e) {
        console.log(e);
        next({statusCode: 500, message: 'Something went wrong.'});
    }
}


module.exports = {
    getUserFeed
}