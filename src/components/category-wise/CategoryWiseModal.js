import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import ListItemText from "@mui/material/ListItemText";
import ListItem from "@mui/material/ListItem";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";

import Chip from "@mui/material/Chip";
import Slide from "@mui/material/Slide";
import FilterProducts from "../filter-products/FilterProducts";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const groupBy = function (items, key) {
  return items.reduce(function (rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};

export default function CategoryWiseModal({ list, onClose, filterLabel }) {
  const [products, setProducts] = useState(list);
  const [categories, setCategories] = useState(groupBy(list, "category"));

  useEffect(() => {
    setProducts(list);
    setCategories(groupBy(list, "category"));
  }, [list]);
  const handleClose = () => {
    onClose(false);
  };

  const getListItem = () => {
    const items = Object.keys(categories).map((key) => {
      const data = categories[key];
      console.log(data);
      let amount = 0;
      data.forEach((d) => (amount = amount + d.price));
      return { key, amount };
    });

    return (
      <>
        {items
          .sort((a, b) => b.amount - a.amount)
          .map(({ key, amount }, index) => (
            <>
              <ListItem button>
                <ListItemText
                  primary={
                    <Typography
                      sx={{ textTransform: "capitalize" }}
                      variant="h6"
                      gutterBottom
                    >
                      {key}
                    </Typography>
                  }
                />

                <Chip
                  sx={{
                    background: "#098073",
                    fontSize: "16px",
                    fontWeight: "bold",
                  }}
                  label={amount}
                  size="large"
                  color="success"
                  variant="contained"
                />
              </ListItem>
              {/* {index < items.length && <Divider />} */}
              <Divider />
            </>
          ))}
      </>
    );
  };

  return (
    <>
      <Dialog
        fullScreen
        open
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: "relative", backgroundColor: "#9f2c5e" }}>
          <Toolbar>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Categories {`${filterLabel ? `(${filterLabel})` : ""}`}
            </Typography>
            {/* <Button autoFocus color="inherit" onClick={handleClose}>
              save
            </Button> */}
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <List>{getListItem()}</List>
      </Dialog>
    </>
  );
}
