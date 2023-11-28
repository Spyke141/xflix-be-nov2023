import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import axios from "axios";
import { config } from "../App";
import { useSnackbar } from "notistack";
import { useParams } from "react-router-dom";
import { useHistory } from "react-router-dom";
import VideoPlayerView from "./VideoPlayerView";
import Dashboard from "./Dashboard";


const VideoViewPage = () => {
  const params = useParams();
  const videoId = params.id;
  // console.log(videoId);

  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();
  const [video, setVideo] = useState({});
  const [allVideos, setAllVideos] = useState([]);
  const [loading, setLoading] = useState(false);

  const Back = () => {
    history.push("/", { from: "VideoViewPage" });
  };

  useEffect(() => {
    const url = `${config.endpoint}/videos/${videoId}`;
    getVideoData(url);
    getAllVideos(`${config.endpoint}/videos`);
    // eslint-disable-next-line
  }, [videoId]);

  const getAllVideos = async (Url) => {
    setLoading(true);
    try {
      const res = await axios.get(Url);
      console.log(res.data);
      setAllVideos(res.data);
      setLoading(false);
      return res.data;
    } catch (e) {
      if (e.response) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Something went wrong. Check that the backend is running, reachable and returns valid JSON.",
          { variant: "error" }
        );
      }
    }
  };

  const getVideoData = async (url) => {
    try {
      const res = await axios.get(url);
      console.log(res.data);
      setVideo(res.data);
      return res.data;
    } catch (e) {
      if (e.response && e.response.data.message) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
        return null;
      } else {
        enqueueSnackbar("Something went wrong", { variant: "error" });
        return null;
      }
    }
  };
  return (
    <>
      <Box sx={{ height: "10vh", bgcolor: "#202020" }}>
        <Box className="logo" onClick={() => Back()} sx={{ padding: "1rem" }}>
          <span className="X">X</span>Flix
        </Box>
      </Box>
      <VideoPlayerView video={video} getVideoData={getVideoData}/>
      <Dashboard Data={allVideos} loading={loading} videoid={videoId}/>
    </>
  );
};

export default VideoViewPage;
