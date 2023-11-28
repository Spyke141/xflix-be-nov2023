import React, { useState } from "react";
import axios from "axios";
import { useSnackbar } from "notistack";
import { Box, Stack, Button, TextField } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import ClearIcon from "@mui/icons-material/Clear";
import Modal from "@mui/material/Modal";
import { config } from "../App";
import moment from "moment";
import "./UploadModal.css";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  background: "linear-gradient( 0deg, rgba(255, 255, 255, 0.16), rgba(255, 255, 255, 0.16)),#121212",
  boxShadow:
    " 0px 24px 38px rgba(0, 0, 0, 0.14), 0px 9px 46px rgba(0, 0, 0, 0.12), 0px 11px 15px rgba(0, 0, 0, 0.2)",
  borderRadius: "4px",
  p: 4,
};

const UploadModal = ({
  fetchVideos,
  genres,
  contentRatings,
  handleClose,
  open,
  uploadData,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const initialData = {
    videoLink: "",
    title: "",
    previewImage: "",
    genre: "",
    contentRating: "",
    releaseDate: "",
  };

  const [formData, setFormData] = useState(initialData);

  const handleInputChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setFormData((formData) => ({ ...formData, [name]: value }));
  };

  const UploadData = async (Data) => {
    const postData = {
      ...Data,
      releaseDate: moment(Data.releaseDate).format("DD MMM YYYY"),
    };
    validateInput(postData);
    try {
      console.log(postData);
      const res = await axios.post(`${config.endpoint}/videos`, postData);
      console.log(res.data);
      if (res.status === 201) {
        enqueueSnackbar("Video Uploaded Successfully", { variant: "success" });
        setFormData(initialData);
        handleClose();
        // uploadData();
      }
    } catch (e) {
      if (e && e.response && e.response.data) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar("Something went wrong", { variant: "error" });
      }
    }
  };



  const validateInput = (data) => {
    let validData = { ...data };

    if (!validData.videoLink) {
      enqueueSnackbar("Video link is required!", {
        variant: "warning",
      });
      return false;
    }
    if (!validData.title) {
      enqueueSnackbar("Title is required!", {
        variant: "warning",
      });
      return false;
    }
    if (!validData.genre) {
      enqueueSnackbar("Genre is required!", {
        variant: "warning",
      });
      return false;
    }
    if (!validData.contentRating) {
      enqueueSnackbar("Age group is required!", {
        variant: "warning",
      });
      return false;
    }
    if (!validData.releaseDate) {
      enqueueSnackbar("Upload and Publish date is required!", {
        variant: "warning",
      });
      return false;
    }
    return true;
  };
  
  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Stack
            sx={{ color: "#ffffff" }}
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>Upload Video</Box>
            <ClearIcon sx={{ cursor: "pointer" }} onClick={handleClose} />
          </Stack>

          <Stack spacing={2} mt={3}>
            <TextField
              required
              className="textfield"
              name="videoLink"
              variant="outlined"
              label="Video Link"
              helperText="This link will be used to derive the video"
              fullWidth
              value={formData.videoLink}
              onChange={handleInputChange}
            />
            <TextField
              required
              className="textfield"
              name="previewImage"
              variant="outlined"
              label="Thumbnail Image"
              helperText="This link will be used to preview the thumbnail image"
              fullWidth
              value={formData.previewImage}
              onChange={handleInputChange}
            />
            <TextField
              required
              className="textfield"
              name="title"
              variant="outlined"
              label="Title"
              helperText="The title will be the representative text for video"
              fullWidth
              value={formData.title}
              onChange={handleInputChange}
            />
            <TextField
              select
              required
              className="textfield"
              name="genre"
              label="Genre"
              helperText="Genre will help in categorizing your videos"
              fullWidth
              value={formData.genre}
              onChange={handleInputChange}
            >
              {genres
                .filter((genre) => genre.value !== "All Genre")
                .map((genre) => (
                  <MenuItem key={genre.value} value={genre.value}>
                    {genre.label}
                  </MenuItem>
                ))}
            </TextField>
            <TextField
              select
              required
              name="contentRating"
              className="textfield"
              label="Suitable age group for the clip"
              helperText="This will be used to filter videos on age group suitability"
              value={formData.contentRating}
              onChange={handleInputChange}
            >
              {contentRatings.map((contentRating) => (
                <MenuItem key={contentRating.value} value={contentRating.label}>
                  {contentRating.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              type="date"
              className="textfield"
              name="releaseDate"
              variant="outlined"
              label="Release Date"
              helperText="This will be used to sort videos"
              fullWidth
              onChange={handleInputChange}
              value={formData.releaseDate}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Stack>
          <Stack
            mt={2}
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Button
              id="upload-btn-submit"
              variant="contained"
              color="error"
              onClick={() => UploadData(formData)}
            >
              Upload Video
            </Button>
            <Button
              id="upload-btn-cancel"
              variant="text"
              sx={{ color: "#ffffff" }}
              onClick={handleClose}
            >
              Cancel
            </Button>
          </Stack>
        </Box>
      </Modal>
    </>
  );
};
export default UploadModal;
