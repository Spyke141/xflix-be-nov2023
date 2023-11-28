import React from "react";
import { Typography, Box} from "@mui/material";
import moment from "moment";
import "./VideoCard.css";

const VideoCard = ({ video }) => {
  return (
    <>
      <Box  display="flex" flexDirection="column">
        <img src={video.previewImage} alt="thumbnail" className="tile-img"/>
        <Box marginTop="0.4rem">
          <Typography
            className="title"
            gutterBottom
            variant="body1"
            component="div"
            sx={{ color: "white" }}
          >
            {video.title}
          </Typography>
          <Typography
            className="video-age"
            gutterBottom
            variant="subtitle2"
            sx={{ color: "white", opacity: "0.4" }}
          >
            {moment(video.releaseDate).fromNow()}
          </Typography>
        </Box>
      </Box>
    </>
  );
};
export default VideoCard;
