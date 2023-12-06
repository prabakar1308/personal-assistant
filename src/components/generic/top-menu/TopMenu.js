import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import SpeakerNotesIcon from "@mui/icons-material/SpeakerNotes";

const pages = [];
const settings = ["Profile", "Account", "Dashboard", "Logout"];

function TopMenu() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar
      position="static"
      sx={{
        background: "#9f2c5e",
        borderRadius: "4px",
        position: "fixed",
        zIndex: 2,
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <SpeakerNotesIcon
            sx={{
              display: { xs: "none", md: "flex" },
              mr: 1,
              justifyContent: "center",
            }}
          />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
              justifyContent: "center",
            }}
          >
            NOTES
          </Typography>
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
              justifyContent: "center",
            }}
          >
            <SpeakerNotesIcon
              sx={{
                display: { xs: "flex", md: "none" },
                mr: 1,
                mt: "5px",
                justifyContent: "center",
              }}
            />
            NOTES{" "}
          </Typography>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default TopMenu;
