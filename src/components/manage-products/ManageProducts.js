import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import Chip from "@mui/material/Chip";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Badge from "@mui/material/Badge";
import Alert from "@mui/material/Alert";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import { deepOrange } from "@mui/material/colors";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import Checkbox from "@mui/material/Checkbox";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import Fab from "@mui/material/Fab";
import AddTaskIcon from "@mui/icons-material/AddTask";
import MapsUgcIcon from "@mui/icons-material/MapsUgc";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

import {
  fetchProducts,
  updateProducts,
  updateProductQuantity,
  deleteProducts,
} from "../../store/reducer";
import UpdateModal from "../generic/update-modal/UpdateModal";
import FilterProducts from "../filter-products/FilterProducts";
import BackdropLoader from "../generic/backdrop-loader/BackdropLoader";
import ConfirmationDialog from "../generic/confirmation-dialog/ConfirmationDialog";
import "./ManageProducts.scss";

const style = {
  margin: 0,
  top: "auto",
  right: 8,
  bottom: 64,
  left: "auto",
  position: "fixed",
};

export default function ManageProducts({ isCompleted = false }) {
  const items = useSelector((state) => state.items);
  const loading = useSelector((state) => state.loading);
  const [checked, setChecked] = React.useState([]);

  const [pendingList, setPendingList] = useState([]);
  const [showOverdue, setShowOverdue] = useState(0);
  const [showToday, setShowToday] = useState(0);
  const [showUpcoming, setShowUpcoming] = useState(0);
  const [showModal, setShowModal] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(null);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchProducts());
  }, []);

  useEffect(() => {
    const handleSorting = () => {
      const sortedData = [...items].sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      );
      // const filteredData = isCompleted
      //   ? sortedData.filter((a) => a.isCompleted)
      //   : sortedData.filter((a) => !a.isCompleted);

      setPendingList(sortedData);
      setShowOverdue(
        sortedData.findIndex((a) => new Date(a.date) < new Date())
      );
      setShowToday(
        sortedData.findIndex((a) => a.date === new Date().toLocaleDateString())
      );
      setShowUpcoming(
        sortedData.findIndex((a) => new Date(a.date) > new Date())
      );
    };
    handleSorting();
  }, [items]);

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
    const { id, name, category, price, unit, quantity, date, categoryId } =
      details;
    const days = getDays(date);
    return (
      <ListItem
        key={`item-${id}`}
        sx={{ background: getBackgroundColor(days).background }}
      >
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
                  {!isCompleted && (
                    <RemoveCircleOutlineIcon
                      sx={{
                        pointerEvents:
                          (quantity <= 50 && unit.toLowerCase() === "gms") ||
                          (parseInt(quantity) <= 1 &&
                            unit.toLowerCase() !== "gms")
                            ? "none"
                            : "fill",
                        opacity:
                          (quantity <= 50 && unit.toLowerCase() === "gms") ||
                          (parseInt(quantity) <= 1 &&
                            unit.toLowerCase() !== "gms")
                            ? "0.4"
                            : "1",
                      }}
                      color="secondary"
                      onClick={(event) => {
                        event.stopPropagation();
                        dispatch(
                          updateProductQuantity({
                            id,
                            categoryId,
                            date,
                            canIncrease: false,
                            number: unit.toLowerCase() === "gms" ? 50 : 1,
                          })
                        );
                      }}
                    />
                  )}
                  <Chip
                    className="quantity-chip"
                    component="span"
                    label={quantity}
                    size="small"
                    color="secondary"
                    variant="outlined"
                    onClick={() => setShowModal(id)}
                  />
                  {!isCompleted && (
                    <AddCircleOutlineIcon
                      sx={{
                        pointerEvents: isCompleted ? "none" : "fill",
                        opacity: isCompleted ? "0.4" : "1",
                      }}
                      color="secondary"
                      onClick={() =>
                        dispatch(
                          updateProductQuantity({
                            id,
                            categoryId,
                            date,
                            canIncrease: true,
                            number: unit.toLowerCase() === "gms" ? 50 : 1,
                          })
                        )
                      }
                    />
                  )}
                  {(unit === "kgs" || unit === "ltr") && (
                    <MapsUgcIcon
                      sx={{
                        pointerEvents: isCompleted ? "none" : "fill",
                        opacity: isCompleted ? "0.4" : "1",
                        color: "#2f6988",
                      }}
                      onClick={() =>
                        setShowModal({
                          title: unit === "kgs" ? "Grams" : "Millilitres",
                          id,
                        })
                      }
                    />
                  )}
                  <DeleteForeverIcon
                    color="error"
                    sx={{ color: "#822720" }}
                    onClick={() => setShowConfirmModal(id)}
                  />
                </div>
              )}
            </>
          }
          secondary={
            <>
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
                color="primary"
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
        <ListItemIcon>
          {isCompleted ? (
            <>
              <Badge
                sx={{ margin: "12px 30px 0 0" }}
                badgeContent={price}
                color="success"
              >
                <CurrencyRupeeIcon />
              </Badge>
              <Tooltip title={price}>
                <Avatar sx={{ marginRight: "30px", bgcolor: deepOrange[500] }}>
                  {quantity * price}
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
      </ListItem>
    );
  };

  const onFilterProducts = (filter) => {};

  const onButtonClick = () => {
    console.log(checked);
    dispatch(updateProducts({ items: checked, isCompleted }));
    setChecked([]);
  };

  return (
    <div className="manage-products-wrapper">
      {pendingList.length > 0 && !loading ? (
        <>
          {isCompleted && (
            <FilterProducts onFilter={(filter) => onFilterProducts(filter)} />
          )}
          <List
            sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
          >
            {pendingList.map((list, index) => {
              const days = getDays(list.date);
              return (
                <>
                  {/* {showOverdueText && <Divider />} */}
                  {showOverdue === index && !isCompleted && (
                    <Typography
                      key={`item-t1-${index}`}
                      variant="subtitle2"
                      display="block"
                      gutterBottom
                      className="item-title"
                    >
                      OVERDUES (LAST 30 DAYS)
                    </Typography>
                  )}
                  {showToday === index && !isCompleted && (
                    <Typography
                      key={`item-t2-${index}`}
                      variant="subtitle2"
                      display="block"
                      gutterBottom
                      className="item-title"
                    >
                      TODAY
                    </Typography>
                  )}
                  {showUpcoming === index && !isCompleted && (
                    <Typography
                      key={`item-t3-${index}`}
                      variant="subtitle2"
                      display="block"
                      gutterBottom
                      className="item-title"
                    >
                      UPCOMING
                    </Typography>
                  )}

                  {getListItem({ ...list })}
                </>
              );
            })}
          </List>
          <br />
          <br />
          <Fab
            style={style}
            size="large"
            color="success"
            aria-label="add"
            disabled={checked.length === 0}
            onClick={() => onButtonClick()}
            variant="extended"
          >
            <AddTaskIcon sx={{ mr: 1 }} />
            Complete
          </Fab>
        </>
      ) : (
        <Alert severity="warning">No produts available!</Alert>
      )}
      <UpdateModal
        open={showModal}
        onClose={({ id, value, canIncrease = false }) => {
          setShowModal(null);
          if (value) {
            dispatch(
              updateProductQuantity({
                id,
                canIncrease,
                number: value,
              })
            );
          }
        }}
      />
      <BackdropLoader open={loading} />
      {showConfirmModal && (
        <ConfirmationDialog
          confirmActionText="Delete"
          confirmText="Do you really want to delete the product?"
          onClose={(status) => {
            console.log(status);
            if (status) {
              dispatch(deleteProducts(showConfirmModal));
            }
            setShowConfirmModal(null);
          }}
        />
      )}
    </div>
  );
}
