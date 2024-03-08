const asyncHandler = require("express-async-handler");
const Link = require("../models/linkModel");
const User = require("../models/userModel");
const redisClient = require("../cache/client");
const { range, base62encoding, getTokenRange } = require('../zookeeper/zookeeper');

// @desc  Get Link
// @route Get /api/Link/:hash
// @access Public

const getLink = asyncHandler(async (req, res) => {
    // Looking in Cache
    const cachedValue = JSON.parse(await redisClient.get(req.params.hash)); 
    if (cachedValue) {
        await redisClient.incr(cachedValue.id); // Incrementing the visit count
        await redisClient.expire(cachedValue.id, 21600); // Expire in 6 hours
        return res.status(200).json(cachedValue);
    }
    // If not in Cache, hitting DB
    const link = await Link.findOne({ short: req.params.hash });
    if (!link) {
        res.status(404)
        throw new Error("Link not found")
    }
    // Storing in Cache
    await redisClient.set(req.params.hash, JSON.stringify({ long: link.long , id: link._id,}));
    await redisClient.expire(req.params.hash, 1200); // Expire in 20 minutes
    res.status(200).json(link)
})

// @desc  Set Link
// @route Post /api/Link
// @access Private
const setLink = asyncHandler(async (req, res) => {
    if (!req.body.longUrl) {
        res.status(400)
        throw new Error("Please add longUrl field")
    }
    // [Old] Collisions can occur

    /*const uuidGen = uuid.v4();
    const uuidString = uuidGen.toString();
    const shortUrl = uuidString.substring(0,7);
    const link = await Link.create({
        long: req.body.longUrl,
        short: shortUrl,
        expires: new Date(new Date().getTime() + (365 * 24 * 60 * 60 * 1000)),
        user: req.body.id
    })*/

    // [New] Collisions Free

    //Checking if current counter is in the range and the range exists for the server
    if (range.cur < range.end - 1 && range.cur != 0) {
        range.cur++
    } else {
        await getTokenRange();
        range.cur++;
    }
    console.log(`Counter Value: ${range.cur}`);
    const shortUrl = base62encoding(range.cur - 1);
    const link = await Link.create({
        long: req.body.longUrl,
        short: shortUrl,
        visits: 0,
        expires: new Date(new Date().getTime() + (365 * 24 * 60 * 60 * 1000)),
        user: req.body.id
    });
    res.status(200).json(link)
})

// @desc  Update Link
// @route Put /api/Link/:id
// @access Private
const updateLink = asyncHandler(async (req, res) => {
    const link = await Link.findById(req.params.id)
    if (!link) {
        res.status(400)
        throw new Error("Link not found")
    }
    const user = req.user
    if (!user) {
        res.status(401)
        throw new Error("User not found")
    }
    if (link.user.toString() !== user.id) {
        res.status(401)
        throw new Error("User not authorized")
    }
    const updatedLink = await Link.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.status(200).json(updatedLink)
})

// @desc  Delete Link
// @route delete /api/Link/:id
// @access Private
const deleteLink = asyncHandler(async (req, res) => {
    const link = await Link.findById(req.params.id)
    if (!link) {
        res.status(400)
        throw new Error("Link not found")
    }
    const user = await User.findById(req.user.id)
    if (!user) {
        res.status(401)
        throw new Error("User not found")
    }
    if (link.user.toString() !== user.id) {
        res.status(401)
        throw new Error("User not authorized")
    }
    await link.deleteOne()
    res.status(200).json({ id: req.params.id })
})

module.exports = {
    getLink,
    setLink,
    updateLink,
    deleteLink
}