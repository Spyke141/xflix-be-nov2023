import React, { useState } from "react";
import { Box, Button } from "@mui/material";
import UploadIcon from "@mui/icons-material/Upload";
import "./Header.css";
import UploadModal from "./UploadModal";

const Header = ({
  children,
  fetchVideos,
  genres,
  contentRatings,
  HiddenButton,
  uploadData,
}) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <>
      <UploadModal
        open={open}
        fetchVideos={fetchVideos}
        genres={genres}
        contentRatings={contentRatings}
        handleClose={handleClose}
        uploadData={uploadData}
      />
      <Box className="header">
        <Box className="logo">
          <span className="X">X</span>Flix
        </Box>
        {HiddenButton && (
          <>
            <Box>{children}</Box>
            <Box>
              <Button id="upload-btn" onClick={handleOpen} startIcon={<UploadIcon />}>
                upload
              </Button>
            </Box>
          </>
        )}
      </Box>
    </>
  );
};
export default Header;
