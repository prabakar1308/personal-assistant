import React, { useEffect } from "react";
import Box from "@mui/material/Box";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import RestoreIcon from "@mui/icons-material/Restore";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { Link, useLocation } from "react-router-dom";

import "./BottomNavigation.scss";

export default function BottomNavigationMenu() {
  const [value, setValue] = React.useState(0);
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/create") setValue(2);
    else if (location.pathname === "/completed") setValue(1);
    else setValue(0);
  }, []);

  return (
    <Box>
      <BottomNavigation
        className="bottom-navigation-wrapper "
        showLabels
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
        sx={{ background: "#9f2c5e", borderRadius: "8px" }}
      >
        <BottomNavigationAction
          component={Link}
          to="/"
          label="PENDING"
          icon={<RestoreIcon />}
        />
        <BottomNavigationAction
          component={Link}
          to="/completed"
          label="COMPLETED"
          icon={<TaskAltIcon />}
        />
        <BottomNavigationAction
          component={Link}
          to="/create"
          label="CREATE"
          icon={<AddCircleOutlineIcon />}
        />
      </BottomNavigation>
    </Box>
  );
}
