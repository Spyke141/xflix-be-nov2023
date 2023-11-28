const mongoose = require('mongoose');

const VideoSchema = new mongoose.Schema(
    {
        // _id : {
        //     type: String
        // },
        videoLink: {
            type: String,
            required: true,
            trim: true,
        },
        title: {
            type: String,
            required: true, 
        },
        genre: {
            type: String,
            required: true
        },
        contentRating: {
            type: String,
            required: true,
            trim: true
        },
        releaseDate: {
            type: Date,
            default: Date.now()
        },
        previewImage: {
            type: String,
            required: true,
            trim: true
        },
        votes: {
            upVotes: {
                type: Number,
                default: 0
            },
            downVotes: {
                type: Number,
                default: 0
            }
        },
        viewCount: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: false
    }
);

/**
 * Check if title is taken
 * @param {string} ttile - The title of video
 * @returns {Promise<boolean>}
 */

 VideoSchema.static.isTitleTaken = async (title) => {
     const video = await this.findOne({ title });
     return !!video;
 }

/*
 * Create a Mongoose model out of userSchema and export the model as "Video"
 * Note: The model should be accessible in a different module when imported like below
 * const Video = require("<video.model file path>").Video;
 */
/**
 * @typedef Video
 */
const Video = mongoose.model("Video", VideoSchema);
module.exports = { Video } ;