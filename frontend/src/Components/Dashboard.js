import VideoCard from "./VideoCard";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import OndemandVideoIcon from "@mui/icons-material/OndemandVideo";
import { Link } from "react-router-dom";

const Dashboard = ({ Data, loading,videoid }) => {
  return (
    <Grid
      container
      direction="row"
      justifyContent="flex-start"
      alignItems="stretch"
      rowSpacing={5}
      columnSpacing={2}
      mt={1}
      pl={{ xs: 2, md: 8, lg: 16 }}
      pr={{ xs: 2, md: 8, lg: 16 }}
    >
      {!loading ? (
        Data.videos && Data.videos.length ? (
          Data.videos.map((VideoData) => {
            if (VideoData._id === videoid) return null;
            else {
              return (
                <Grid className="video-tile-link" item xs={12} md={4} lg={3} key={VideoData._id}>
                  <Link className="video-tile"
                    to={`/video/${VideoData._id}`}
                    style={{ textDecoration: "none", color: "white" }}
                  >
                    <VideoCard video={VideoData} />
                  </Link>
                </Grid>
              );
            }
          })
        ) : ( 
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            sx={{ height: "70vh", width: "100%" }}
          >
            <Stack
              direction="column"
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              spacing={2}
            >
              <Box>
                <SmartToyIcon sx={{ color: "#ffffff" }} fontSize="large" />
              </Box>
              <Box
                display="flex"
                flexDirection="row"
                alignItems="center"
                justifyContent="center"
                sx={{ color: "#ffffff" }}
              >
                <OndemandVideoIcon fontSize="large" />{" "}
                <Typography variant="h5" ml={2}>
                  No Video Found !!
                </Typography>
              </Box>
            </Stack>
          </Box>
        )
      ) : (
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          sx={{ height: "70vh", width: "100%" }}
        >
          <CircularProgress color="inherit" />
        </Box>
      )}
    </Grid>
  );
};
export default Dashboard;
