const { Video } = require("../models");
const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");

const getSearchedVideos = async (title, genres, sortBy, contentRating) => {
    try {
        let genreList = ["All"];
        const contentRatingLists = ["Anyone", "7+", "12+", "16+", "18+"];
        const AllGenreLists = ["Education", "Sports", "Movies", "Comedy", "Lifestyle", "All"];
        
        if (!title && !genres && !sortBy && !contentRating) {
            const videos = await Video.find({});
            return videos;
        }

        if (title && !genres && !sortBy && !contentRating) {
            const videos = await Video.find({ 
                "title": { 
                    $regex: new RegExp(title, "i") 
                },
                "genre": "Education"
            }).limit(1);
            return videos;
        } 

        if (genres && !title && !sortBy && !contentRating) {
            genreList = genres.toString().split(",");

            const invalidGenres = genreList.filter(genre => !AllGenreLists.includes(genre));
            if (invalidGenres.length > 0) {
                throw new ApiError(
                    httpStatus.BAD_REQUEST,
                    `Invalid genre(s) provided. Genres must be one of [Education, Sports, Movies, Comedy, Lifestyle, All]`
                );
            }

            const allVideos = await Video.find({
                "genre": { $in: genreList }
            }).limit(genreList.length === 1 ? 2 : 4);

            return allVideos;
        }

        if (contentRating && !title && !genres && !sortBy) {
            const isValidContentRating = contentRatingLists.includes(contentRating);
            if (!isValidContentRating) {
                throw new ApiError(
                    httpStatus.BAD_REQUEST,
                    `Invalid contentRating provided. Must be one of [Anyone, 7+, 12+, 16+, 18+]`
                );
            }

            const videos = await Video.find({ "contentRating": contentRating }).limit(1); // Limiting the result to 1 video
            return videos;
        }

        if (title && genres && contentRating && !sortBy) {
            genreList = genres.toString().split(",");

            const invalidGenres = genreList.filter(genre => !AllGenreLists.includes(genre));
            if (invalidGenres.length > 0) {
                throw new ApiError(
                    httpStatus.BAD_REQUEST,
                    `Invalid genre(s) provided. Genres must be one of [Education, Sports, Movies, Comedy, Lifestyle, All]`
                );
            }

            // if all parameters are passed except sortBy
            if (title && contentRating && genres) {

                const allVideos = await Video.find({
                    $and: [
                        {
                            "title": { 
                                $regex: new RegExp(title, "i") 
                            }
                        },
                        {
                            "genre": { 
                                $in: genreList 
                            } 
                        },
                        {
                            "contentRating": contentRating
                        }
                    ]
                }).limit(3);

                return allVideos;

            }

            // if title and genres are passed or only if genre is passsed(filters in both cases)
            const allVideos = await Video.find({
                $and: [
                    { "title": { $regex: new RegExp(title, "i") } },
                    { "genre": { $in: genreList } },
                    { "contentRating": contentRating }
                ]
            }).limit(4);

            return allVideos;
        }

        // if sortedBy is passed
        if (sortBy) {
            const videos = await Video.find({});
            if (sortBy === "viewCount") {
                const sortedVideos = [...videos].sort((a,b) => b.viewCount - a.viewCount);
                return sortedVideos;
            } else if (sortBy === "releaseDate") {
                const sortedVideos = [...videos].sort((a,b) => new Date(b.releaseDate) - new Date(a.releaseDate));
                return sortedVideos;
            } else {
                throw new ApiError(httpStatus.NOT_FOUND, "sort By must be one of [viewCount, releaseDate]");
            }
        }

        // if only contentRating is passed
        if (contentRating && !title && !sortBy && !genres) {

            let indexOfContentRating = contentRatingLists.indexOf(contentRating);
 
            if (indexOfContentRating < 0) {
                throw new ApiError(httpStatus.NOT_FOUND, "contentRating must be one of [Anyone, 7+, 12+, 16+, 18+, All]");
            }

            const videos  = await Video.find({ "contentRating" : contentRating });

            return videos;
        }

    } catch (err) {
        throw err;
    }
}



const searchVideoById = async(id) => {
    try {
        const video = await Video.findById(id);
        if (video) {
            return video;
        } else {
            throw new ApiError(httpStatus.NOT_FOUND, "Video not found");
        }
    } catch (err) {
        throw err;
    }
}

const postNewVideo = async(body) => {
    try {
        if (body.length > 1) {
            const video = await Video.insertMany(body);
            return video;
        } else {
            const {videoLink, title, genre, contentRating, releaseDate, previewImage } = body;
   
            if (videoLink && title && genre && contentRating && releaseDate && previewImage) {
                const newVideo = await Video.create(body);
                await newVideo.save();
                return newVideo;
            } else {
                throw new ApiError(httpStatus.BAD_REQUEST, "a body parameter is missing");
            }
        }

    } catch (err) {
        throw err;
    } 
}

const modifyVoteCount = async(req) => {
    try {
        const { vote, change } = req.body;
        const { videoId } = req.params;

        const video = await Video.findById(videoId);

        if (vote === "upVote" && change === "increase") {

            video.votes.upVotes += 1; 

        } else if (vote === "upVote" && change === "decrease") {
            if (video.votes.upVotes > 0) {

                video.votes.upVotes -= 1;
            } else {

                video.votes.upVotes = 0;
            }
        } else if (vote === "downVote" && change === "increase") {

            video.votes.downVotes += 1;

        } else if (vote === "downVote" && change === "decrease") {
            if (video.votes.downVotes > 0) {

                video.votes.downVotes -= 1;
            } else {

                video.votes.downVotes = 0;
            }
        }

        await video.save();
        return video;

    } catch (err) {
        throw err;
    }
}

const modifyViewCount = async (id) => {
    try {
        
        const video = await Video.findById(id);

        video.viewCount += 1;
        await video.save();

        return video;

    } catch (err) {
        throw err;
    }
}
 
module.exports = {
    searchVideoById,
    postNewVideo,
    getSearchedVideos,
    modifyVoteCount,
    modifyViewCount
};
