import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import { useSnackbar } from "notistack";
import { Grid, Box, Typography, Stack, Button } from "@mui/material";
import CircleIcon from "@mui/icons-material/Circle";
import moment from "moment";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import { config } from "../App";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./VideoPlayerView.css";

const VideoPlayerView = ({ video, getVideoData }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [votesChange, setVotesChange] = useState({
    upVote: false,
    downVote: false,
  });
  const params = useParams();
  const videoId = params.id;
  // console.log(videoId);

  const ThumbButton = styled(Button)({
    textTransform: "capitalize",
    color: "#ffffff",
    fontsize: "12px",
    lineHeight: "14px",
    backgroundColor: "#313131",
    borderRadius: "16px",
    boxShadow: "none",
    fontWeight: "400",
    "&:hover": {
      backgroundColor: "#545454",
      color: "#ffffff",
      borderRadius: "16px",
    },
    "&:active": {
      backgroundColor: "#545454",
      color: "#ffffff",
      borderRadius: "16px",
    },
    "&:focus": {
      backgroundColor: "#545454",
      color: "#ffffff",
      borderRadius: "16px",
    },
  });

  const performPatchCall = async (URL, data = {}) => {
    try {
      if (data) {
        await axios.patch(URL, data);
      } else {
        await axios.patch(URL);
      }
      return true;
    } catch (e) {
      if (e.response && e.response.data.message) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar("Something went wrong", { variant: "error" });
      }
    }
  };

  const updateVote = async (name, id) => {
    const URL = `${config.endpoint}/videos/${id}/votes`;
    const data = {
      vote: name,
      change: "increase",
    };
    let response = await performPatchCall(URL, data);
    if (response) {
      setVotesChange({ ...votesChange, [name]: true });
      getVideoData(`${config.endpoint}/videos/${videoId}`);
    }
  };

  const increaseViewCount = async (id) => {
    const URL = `${config.endpoint}/videos/${id}/views`;
    await performPatchCall(URL);
  };

  useEffect(() => {
    if (videoId) {
      increaseViewCount(videoId);
    }
    // eslint-disable-next-line
  }, [video]);

  return (
    <>
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
        spacing={2}
        mt={2}
        pl={{ xs: 4, md: 8, lg: 16 }}
        pr={{ xs: 4, md: 8, lg: 16 }}
      >
        <Grid container>
          <Grid item xs={12} md={12}>
            <Box className="video-iframe" component="div">
              <iframe
                width="100%"
                height="100%"
                src={`https://${video.videoLink}`}
                frameBorder=""
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="video"
              />
            </Box>
          </Grid>
        </Grid>

        <Grid container mt={2}>
          <Grid item sx={{ color: "#ffffff" }}>
            <Stack spacing={1} pl={1}>
              <Typography fontSize={{ xs: "1.2rem", md: "2rem" }}>
                {video.title}
              </Typography>
            </Stack>
          </Grid>
        </Grid>

        <Grid container mt={1}>
          <Grid
            container
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{
              display: "flex",
              flexDirection: "row",
            }}
          >
            <Stack pl={1}>
              <Typography
                fontSize={{ xs: "0.8rem", md: "1rem" }}
                justifyContent="center"
                alignItems="center"
              >
                {video.viewCount} Views{" "}
                <CircleIcon sx={{ fontSize: "0.5rem" }} /> {video.contentRating}{" "}
                <CircleIcon sx={{ fontSize: "0.5rem" }} />{" "}
                {moment(video.releaseDate).fromNow()}
              </Typography>
            </Stack>
            <Stack pr={1}
              direction="row"
              justifyContent="flex-end"
              alignItems="flex-end"
              mt={{xs: 2, md:0}}
              spacing={2}
            >
              <ThumbButton
                contained
                startIcon={<ThumbUpIcon />}
                onClick={(e) => {
                  updateVote("upVote", videoId);
                }}
              >
                {video.votes && video.votes.upVotes}
              </ThumbButton>
              <ThumbButton
                contained
                startIcon={<ThumbDownIcon />}
                onClick={(e) => {
                  updateVote("downVote", videoId);
                }}
              >
                {video.votes && video.votes.downVotes}
              </ThumbButton>
            </Stack>
          </Grid>
        </Grid>
        <Box
            component="div"
            sx={{
              width: "100%",
              height: "0.75px",
              backgroundColor: "rgba(216, 216, 216, 0.5)",
              marginTop: "1rem",
              display: "flex",
              alignItems: "center",
            }}
          ></Box>
      </Grid>
    </>
  );
};
export default VideoPlayerView;
