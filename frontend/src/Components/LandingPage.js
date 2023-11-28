import React, { useState, useEffect } from "react";
import { Box, TextField, InputAdornment } from "@mui/material";
import { Search } from "@mui/icons-material";
import axios from "axios";
import Header from "./Header";
import GenrePanel from "./GenrePanel";
import { config } from "../App";
import "./LandingPage.css";
import Dashboard from "./Dashboard";
import { useSnackbar } from "notistack";

const allGenres = [
  { label: "All Genre", value: "All Genre" },
  { label: "Education", value: "Education" },
  { label: "Sports", value: "Sports" },
  { label: "Comedy", value: "Comedy" },
  { label: "Lifestyle", value: "Lifestyle" },
];

const allContentRatings = [
  { label: "Any Age Group", value: "Anyone" },
  { label: "7+", value: "7%2B" },
  { label: "12+", value: "12%2B" },
  { label: "16+", value: "16%2B" },
  { label: "18+", value: "18%2B" },
];

const LandingPage = () => {
  const [videoData, setVideoData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [genres, setGenres] = useState(["All Genre"]);
  const [contentRatings, setContentRatings] = useState("Anyone");
  const [videoSearch, setVideoSearch] = useState("");
  const { enqueueSnackbar } = useSnackbar();

  const uploadData = () => {
    const Url = `${config.endpoint}/videos`;
    const res = getVideos(Url);
    setVideoData(res);
  };

  useEffect(() => {
    uploadData();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    performSearch("", genres, contentRatings);
    // eslint-disable-next-line
  }, [genres, contentRatings]);

  const changehandle = (event) => {
    setVideoSearch(event.target.value);
  };

  const getVideos = async (Url) => {
    setLoading(true);
    try {
      const res = await axios.get(Url);
      console.log(res.data);
      setVideoData(res.data);
      setLoading(false);
      return res.data;
    } catch (e) {
      setLoading(true);
      if (e.response && e.response.data.message) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
        setLoading(false);
        return null;
      } else {
        enqueueSnackbar("Something went wrong", { variant: "error" });
        setLoading(false);
        return null;
      }
    }
  };

  const performSearch = async (value, genres, contentRatings) => {
    //console.log(value);
    let url = `${config.endpoint}/videos?`;
    if (value.length) {
      url += `title=${value}`;
    }

    if (genres.length && !genres.includes("All Genre")) {
      const param = genres.join(",");
      url[url.length - 1] === "?"
        ? (url += `genres=${param}`)
        : (url += `&genres=${param}`);
    }

    if (contentRatings.length && contentRatings !== "Anyone") {
      url[url.length - 1] === "?"
        ? (url += `contentRating=${contentRatings}`)
        : (url += `&contentRating=${contentRatings}`);
    }
    getVideos(url);
  };

  const toggleGenreValueInList = (array, value) => {
    if (array.includes(value)) {
      //If true, remove the value and update the state
      const newArray = array.filter((e) => e !== value);
      return newArray;
    } else {
      //Else Add the selected value and update the state
      const newArray = [...array, value];
      return newArray;
    }
  };

  const handleGenre = (genre) => {
    const all = "All Genre";
    const newGenreValue = genre.value;

    if (newGenreValue === all) {
      setGenres([all]);
    } else {
      //return us the array of genres without "All" in it
      const genreWithoutAll = genres.filter((item) => item !== all);

      const nextGenres = toggleGenreValueInList(genreWithoutAll, newGenreValue);
      setGenres(nextGenres);

      if (nextGenres.length === 0) {
        setGenres([all]);
      }
    }
  };

  const handleContentRating = (contentRating) => {
    setContentRatings(contentRating.value);
    if (contentRatings === contentRating.value) {
      setContentRatings("Anyone");
    }
  };

  return (
    <>
      <Box>
        
        <Header
          fetchVideos={getVideos}
          genres={allGenres}
          contentRatings={allContentRatings}
          HiddenButton
          uploadData
        >
          {/* for Desktop-view */}
          <TextField
            className="search-desktop"
            size="small"
            inputProps={{ style: { fontFamily: "Arial", color: "#606060" } }}
            sx={{ color: "#ffffff" }}
            onChange={changehandle}
            InputProps={{
              className: "search",
              endAdornment: (
                <InputAdornment position="end">
                  <Search
                    className="search-bar"
                    onClick={() =>
                      performSearch(videoSearch, genres, contentRatings)
                    }
                  />
                </InputAdornment>
              ),
            }}
            placeholder="Search"
            name="search"
          />
        </Header>
      </Box>

      {/* for mobile-view */}
      <TextField
        className="search-mobile"
        size="small"
        fullWidth
        inputProps={{ style: { fontFamily: "Arial", color: "#606060" } }}
        sx={{ color: "#ffffff" }}
        onChange={changehandle}
        InputProps={{
          className: "search",
          endAdornment: (
            <InputAdornment position="end">
              <Search
                className="search-bar"
                onClick={() =>
                  performSearch(videoSearch, genres, contentRatings)
                }
              />
            </InputAdornment>
          ),
        }}
        placeholder="Search"
        name="search"
      />

      {/* Genre Panel */}
      <GenrePanel
        allGenres={allGenres}
        selectedGenres={genres}
        allContentRatings={allContentRatings}
        selectedContentRatings={contentRatings}
        handleGenre={handleGenre}
        handleContentRating={handleContentRating}
        setVideoData={setVideoData}
      />

      {/* VideoCard */}
      <Dashboard Data={videoData} loading={loading} />
    </>
  );
};
export default LandingPage;
