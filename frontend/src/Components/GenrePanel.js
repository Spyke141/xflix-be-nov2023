import React, { useState } from "react";
import { useSnackbar } from "notistack";
import "./GenrePanel.css";
import { config } from "../App";
import axios from "axios";
import { Grid } from "@mui/material";


const GenrePanel = ({
  allGenres,
  selectedGenres,
  allContentRatings,
  selectedContentRatings,
  handleGenre,
  handleContentRating,
  setVideoData,
}) => {

  const { enqueueSnackbar } = useSnackbar();
  const [sort, setSort] = useState("releaseDate");

  const handleChange = (event) => {
    setSort(event.target.value);
    sortBy(event.target.value);
  };

  const sortBy = async (sort) => {
    try {
      if (sort === "viewCount") {
        const res = await axios.get(`${config.endpoint}/videos?sortBy=${sort}`);
        console.log(res.data);
        setVideoData(res.data);
        return res.data;
      } else {
        const res = await axios.get(`${config.endpoint}/videos`);
        console.log(res.data);
        setVideoData(res.data);
        return res.data;
      }
    } catch (e) {
      if (e.response && e.response.data.message) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar("Something went wrong", { variant: "error" });
      }
    }
  };

  //To remove the arrow in the release date swap button.
  const removeArrow = {
    appearance: "none"
  };

  return (
    
    <>
      <Grid
        container
        direction="column"
        alignItems="center"
        className="tool-bar"
      >
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
        >
          {allGenres.map((genre) => (
            <Grid
              item
              mt={{xs:2, md:1}}
              ml={{ xs: 1, md: 2, lg: 4 }}
              key={genre.value}
              className={
                selectedGenres.includes(genre.value)
                  ? "genre-btn active-toolbar-button"
                  : "genre-btn"
              }
              onClick={() => handleGenre(genre, selectedGenres)}
            >
              {genre.value}
            </Grid>
          ))}

          <Grid
            item
            mt={{xs:2, md:1}}
            ml={{ xs: 1, md: 2, lg: 4 }}
            className="sort-by active-toolbar-button swapIcon category-form"
          >
            <select
              className="sort-select "
              style={removeArrow}
              value={sort}
              IconComponent={""}
              defaultValue={"releaseDate"}
              onChange={handleChange}
            >
              <option id="release-date-option" value={"releaseDate"}>Release Date</option>
              <option id="view-count-option" value={"viewCount"}>View Count</option>
            </select>
          </Grid>
        </Grid>

        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
        >
          {allContentRatings.map((contentRating) => (
            <Grid
              item
              mt={{xs:3, md:3}}
              ml={{ xs: 2, md: 4, lg: 6 }}
              key={contentRating.value}
              className={
                selectedContentRatings.includes(contentRating.value)
                  ? "content-rating-btn active-toolbar-button"
                  : "content-rating-btn"
              }
              onClick={() =>
                handleContentRating(contentRating, selectedContentRatings)
              }
            >
              {contentRating.label}
            </Grid>
          ))}
        </Grid>
      </Grid>
    </>
  );
};
export default GenrePanel;
