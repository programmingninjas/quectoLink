const asyncHandler = require("express-async-handler")
const Link = require("../models/linkModel")
const User = require("../models/userModel")
const redisClient = require("../cache/client")
const uuid = require('uuid')
const mongoose = require('mongoose')

// @desc  Get Link
// @route Get /api/Link
// @access Public

const getLink = asyncHandler( async (req,res) => {
    // Looking in Cache
    const cachedValue = await redisClient.get(req.params.hash);
    if (cachedValue) return res.status(200).json(JSON.parse(cachedValue));
    // If not in Cache, hitting DB
    const link = await Link.findOne({short:req.params.hash});
    // Storing in Cache
    await redisClient.set(req.params.hash,JSON.stringify(link));
    await redisClient.expire(req.params.hash,120);
    res.status(200).json(link)
})

// @desc  Set Link
// @route Post /api/Link
// @access Private
const setLink = asyncHandler( async (req,res) => {
    if(!req.body.longUrl){
        res.status(400)
        throw new Error("Please add longUrl field")
    }
    // Looking in Cache
    const cachedValue = await redisClient.get(req.body.longUrl);
    if (cachedValue) return res.status(200).json(JSON.parse(cachedValue));
    // If not in Cache, hitting DB
    const result = await Link.findOne({long:req.body.longUrl});
    if (result){
        // Storing in Cache
        await redisClient.set(req.body.longUrl,JSON.stringify(result));
        await redisClient.expire(req.body.longUrl,120);
        res.status(200).json(result.short);
        return;
    }
    //If not in DB, Generate it and store in DB
    const uuidGen = uuid.v4();
    const uuidString = uuidGen.toString();
    const shortUrl = uuidString.substring(0,7);
    const link = await Link.create({
        long: req.body.longUrl,
        short: shortUrl,
        expires: new Date(new Date().getTime() + (365 * 24 * 60 * 60 * 1000)),
        user: new mongoose.Types.ObjectId("65e1c9923bbda16a4a5a0277")
    })
    // Storing in Cache
    await redisClient.set(req.body.longUrl,JSON.stringify(link));
    await redisClient.expire(req.body.longUrl,120);
    res.status(200).json(link)
})

// @desc  Update Link
// @route Put /api/Link/:id
// @access Private
const updateLink = asyncHandler( async (req,res) => {
    const link = await Link.findById(req.params.id)
    if(!link){
        res.status(400)
        throw new Error("Link not found")
    }
    const user = req.user
    if(!user){
        res.status(401)
        throw new Error("User not found")
    }
    if (link.user.toString()!==user.id){
        res.status(401)
        throw new Error("User not authorized")
    }
    const updatedLink = await Link.findByIdAndUpdate(req.params.id,req.body,{new:true})
    res.status(200).json(updatedLink)
})

// @desc  Delete Link
// @route delete /api/Link/:id
// @access Private
const deleteLink = asyncHandler( async (req,res) => {
    const link = await Link.findById(req.params.id)
    if(!link){
        res.status(400)
        throw new Error("Link not found")
    }
    const user = await User.findById(req.user.id)
    if(!user){
        res.status(401)
        throw new Error("User not found")
    }
    if (link.user.toString()!==user.id){
        res.status(401)
        throw new Error("User not authorized")
    }
    await link.deleteOne()
    res.status(200).json({id:req.params.id})
})

module.exports = {
    getLink,
    setLink,
    updateLink,
    deleteLink
}