import React, { useEffect, useState } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import Chip from "@mui/material/Chip";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Badge from "@mui/material/Badge";
import Alert from "@mui/material/Alert";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import Checkbox from "@mui/material/Checkbox";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import Fab from "@mui/material/Fab";
import VerticalSplitIcon from "@mui/icons-material/VerticalSplit";
import PrivacyTipIcon from "@mui/icons-material/PrivacyTip";
import { useDispatch, useSelector } from "react-redux";

import "./CompletedProducts.scss";
import {
  // updateItems,
  // updateQuantity,
  fetchProducts,
  updateProducts,
  updateProductQuantity,
} from "../../store/reducer";
import UpdateModal from "../generic/update-modal/UpdateModal";
import FilterProducts from "../filter-products/FilterProducts";
import { getCalendarDate } from "../../utils";
import BackdropLoader from "../generic/backdrop-loader/BackdropLoader";
import { deepOrange, deepPurple } from "@mui/material/colors";
import CategoryWiseModal from "../category-wise/CategoryWiseModal";

const style = {
  margin: 0,
  top: "auto",
  right: 8,
  bottom: 64,
  left: "auto",
  position: "fixed",
};

export default function CompletedProducts({ isCompleted = true }) {
  const items = useSelector((state) => state.items);
  const loading = useSelector((state) => state.loading);
  const [checked, setChecked] = React.useState([]);

  const [completedList, setCompletedList] = useState([]);
  const [pendingList, setPendingList] = useState([]);
  const [showModal, setShowModal] = useState(null);
  const [showCatModal, setShowCatModal] = useState(null);
  const [filterLabel, setFilterLabel] = useState("");

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchProducts(true));
  }, []);

  useEffect(() => {
    handleSorting();
  }, [items]);

  const handleSorting = () => {
    const month = new Date().getMonth();
    const year = new Date().getFullYear();

    const sortedData = [...items].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );
    const filteredData = sortedData.filter(
      (a) => a.isCompleted && new Date(a.date) >= new Date(year, month, 1)
    );
    setPendingList(filteredData);
    setCompletedList(sortedData);
  };

  const handleToggle = (product, enableCheck = true, updatePrice = 0) => {
    const currentIndex = checked.findIndex((item) => item.id === product.id);
    const newChecked = [...checked];

    // update price
    let updatedProduct = { ...product };
    if (updatePrice > 0) {
      updatedProduct = { ...product, price: updatePrice };
    }

    if (currentIndex === -1 && enableCheck) {
      newChecked.push(updatedProduct);
    } else if (!enableCheck) {
      newChecked.splice(currentIndex, 1);
    } else {
      newChecked.splice(currentIndex, 1, updatedProduct);
    }

    setChecked([...newChecked]);
  };

  const handleChange = (event, product) => {
    const value = event.target.value;
    if (value && value.trim() && parseInt(value.trim())) {
      handleToggle(product, true, parseInt(value.trim()));
    } else {
      handleToggle(product, false);
    }
  };

  const getDays = (date) => {
    // const diffInMs = new Date(date) - new Date();
    // console.log("diffInMs", diffInMs);
    // return Math.round(diffInMs / (1000 * 60 * 60 * 24));

    if (date === new Date().toLocaleDateString()) return 0;

    const diffTime = new Date(date) - new Date();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getBackgroundColor = (days) => {
    if (days < 0 && !isCompleted)
      return { background: "#f1c6c6", color: "error" };
    else if (days === 0 && !isCompleted)
      return { background: "#f2dcb0", color: "warning" };
    return { background: "#b2ebc8", color: "success" };
  };

  const getListItem = (details) => {
    const { id, name, category, unit, price, quantity, date, categoryId } =
      details;
    const days = getDays(date);
    return (
      <ListItem
        key={`item-${id}`}
        sx={{ background: getBackgroundColor(days).background }}
      >
        {/* <ListItemButton key={`item-button-${id}`} role={undefined}> */}
        {/* <ListItemAvatar>
          <Avatar>
            <ImageIcon />
          </Avatar>
        </ListItemAvatar> */}
        <ListItemText
          primary={
            <>
              <Typography
                sx={{ display: "inline" }}
                component="span"
                variant="h6"
                color="text.primary"
              >
                {name}
              </Typography>{" "}
              {quantity > 0 && (
                <div className="quantity-section">
                  <Chip
                    className="quantity-chip"
                    component="span"
                    label={quantity}
                    size="small"
                    color="secondary"
                    variant="outlined"
                    onClick={() => setShowModal(id)}
                  />
                  {/* <Badge
                    sx={{ margin: "12px 30px 0 0" }}
                    badgeContent={price}
                    color="success"
                  >
                    <CurrencyRupeeIcon />
                  </Badge> */}
                  <Avatar
                    sx={{
                      width: "auto",
                      height: 24,
                      fontSize: "14px",
                      ml: "8px",
                      p: "0 5px",
                      bgcolor: deepPurple[500],
                    }}
                    variant="rounded"
                  >
                    {price / quantity}
                  </Avatar>
                </div>
              )}
            </>
          }
          secondary={
            <>
              {/* <Typography
                sx={{ display: "inline" }}
                component="span"
                variant="body2"
                color="text.primary"
              >
                {category}
              </Typography> */}
              <Chip
                component="span"
                label={unit}
                size="small"
                color="primary"
                sx={{ textTransform: "capitalize" }}
              />{" "}
              <Chip
                component="span"
                label={category}
                size="small"
                color="warning"
              />{" "}
              <Chip
                component="span"
                label={`${days === 0 ? "Today" : `${Math.abs(days)} days`}`}
                size="small"
                color={getBackgroundColor(days).color}
              />
            </>
          }
        />
        {/* <ListItemText>
        </ListItemText> */}
        <ListItemIcon>
          {isCompleted ? (
            // <ListItemAvatar>30</ListItemAvatar>
            <>
              {/* <Badge
                sx={{ margin: "12px 30px 0 0" }}
                badgeContent={price}
                color="success"
                max={999}
              >
                <CurrencyRupeeIcon />
              </Badge> */}
              <Tooltip title={price}>
                <Avatar
                  sx={{
                    marginRight: "30px",
                    bgcolor: deepOrange[500],
                    fontSize: "16px",
                  }}
                >
                  {price}
                </Avatar>
              </Tooltip>
            </>
          ) : (
            <TextField
              type="number"
              className="price-field"
              id="standard-basic"
              label="Price"
              variant="outlined"
              defaultValue={price}
              onChange={(event) => handleChange(event, details)}
            />
          )}

          <Checkbox
            edge="start"
            checked={checked.filter((pro) => pro.id === id).length > 0}
            tabIndex={-1}
            disableRipple
            onChange={() =>
              handleToggle(
                details,
                checked.filter((pro) => pro.id === id).length === 0
              )
            }
            inputProps={{ "aria-labelledby": `${name}-${id}` }}
          />
        </ListItemIcon>
        {/* <ListItemText id={labelId} primary={`Line item ${value + 1}`} /> */}
        {/* </ListItemButton> */}
      </ListItem>
    );
  };

  const onFilterProducts = ({ date, text, label }) => {
    setFilterLabel(label);
    const sortedData = [...items].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );
    const isYear = !isNaN(date);

    const filteredData = sortedData.filter((a) => {
      let dateFilter = new Date(a.date) >= new Date(date);
      if (isYear) {
        dateFilter =
          new Date(a.date) >= new Date(date, 0, 1) &&
          new Date(a.date) <= new Date(date, 11, 31);
      } else if (date === "month") {
        const month = new Date().getMonth();
        const year = new Date().getFullYear();
        dateFilter = new Date(a.date) >= new Date(year, month, 1);
      } else if (date === "last_month") {
        const currentDate = new Date();
        const monthIndex = new Date(
          currentDate.setMonth(currentDate.getMonth() - 1)
        ).getMonth();
        const year = currentDate.getFullYear();
        dateFilter =
          new Date(a.date) >= new Date(year, monthIndex, 1) &&
          new Date(a.date) <= new Date(year, monthIndex, 31);
      }
      if (text && date) {
        return a.isCompleted && a.name.includes(text) && dateFilter;
      } else if (text) return a.isCompleted && a.name.includes(text);
      else if (date) {
        return a.isCompleted && dateFilter;
      } else return a.isCompleted;
    });

    setPendingList(filteredData);
  };

  const onButtonClick = () => {
    dispatch(updateProducts({ items: checked, isCompleted }));
    setChecked([]);
  };

  return (
    <div className="completed-products-wrapper">
      {completedList.length > 0 && !loading && (
        <div className="filter-section">
          <FilterProducts onFilter={(filter) => onFilterProducts(filter)} />
          <PrivacyTipIcon
            sx={{
              color: "#b21068",
              p: "20px 0",
              pointerEvents: pendingList.length === 0 ? "none" : "fill",
              opacity: pendingList.length === 0 ? "0.4" : "1",
            }}
            onClick={() => setShowCatModal(true)}
          />
        </div>
      )}
      {pendingList.length > 0 ? (
        <>
          <List
            sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
          >
            {pendingList.map((list, index) => {
              const days = getDays(list.date);
              return <>{getListItem({ ...list })}</>;
            })}
            {/* <ListItem>
        {getListItem({ price: 30, name: "briyani", category: "food" })}
      </ListItem>
      <ListItem></ListItem>
      <ListItem>
        <ListItemAvatar>
          <Avatar>
            <WorkIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary="Work" secondary="Jan 7, 2014" />
      </ListItem>
      <ListItem>
        <ListItemAvatar>
          <Avatar>
            <BeachAccessIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary="Vacation" secondary="July 20, 2014" />
      </ListItem> */}
          </List>
          {/* <Button
            className="complete-button"
            variant="contained"
            disabled={checked.length === 0}
            onClick={() => onButtonClick()}
          >
            {isCompleted ? "Move Back" : "Complete"}
          </Button> */}

          <Fab
            style={style}
            size="large"
            color="error"
            aria-label="add"
            disabled={checked.length === 0}
            onClick={() => onButtonClick()}
            variant="extended"
          >
            <RemoveCircleOutlineIcon sx={{ mr: 1 }} /> Move Back
          </Fab>
        </>
      ) : (
        <Alert severity="warning">No produts available!</Alert>
      )}
      <UpdateModal
        open={showModal}
        onClose={(status) => {
          setShowModal(null);
        }}
      />
      {showCatModal && (
        <CategoryWiseModal
          list={pendingList}
          filterLabel={filterLabel}
          onClose={() => setShowCatModal(false)}
        />
      )}
      <BackdropLoader open={loading} />
    </div>
  );
}
