import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import Chip from "@mui/material/Chip";
import BackspaceIcon from "@mui/icons-material/Backspace";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";

import BackdropLoader from "../generic/backdrop-loader/BackdropLoader";
import {
  resetCreateProductMessage,
  fetchAvailableProducts,
  createAvailableProducts,
  createAvailableCategories,
  createProducts,
  fetchAvailableCategories,
  fetchProducts,
} from "../../store/reducer";
import InfoMessage from "../generic/info-message/InfoMessage";
import RadioGroup from "../generic/radio-group/RadioGroup";
import UploadExcelData from "./upload-excel-data/UploadExcelData";
import AutoCompleteMic from "./autocomplete-mic/AutoCompleteMic";
import "./CreateProduct.scss";

const radioInputs = [
  { label: "Kgs", value: "kgs" },
  { label: "Gms", value: "gms" },
  { label: "Ltr", value: "ltr" },
  { label: "Other", value: "other" },
];

const theme = "secondary";

export default function CreateProduct() {
  const availableProducts = useSelector((state) => state.availableProducts);
  const availableCategories = useSelector((state) => state.availableCategories);
  const loading = useSelector((state) => state.loading);
  const products = useSelector((state) => state.items);
  const createProductMessage = useSelector(
    (state) => state.createProductMessage
  );
  const dispatch = useDispatch();
  const [showError, setShowError] = useState(false);
  const [formData, setFormData] = useState({
    product: null,
    category: null,
    dueDate: dayjs(new Date()),
    quantity: 1,
    unit: "kgs",
  });

  const [open, setOpen] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [currentMic, setCurrentMic] = useState("");

  useEffect(() => {
    dispatch(fetchAvailableProducts());
    dispatch(fetchAvailableCategories());

    if (products.length === 0) {
      dispatch(fetchProducts());
    }
  }, []);

  useEffect(() => {
    if (createProductMessage) {
      setOpen(true);
      setTimeout(() => {
        setOpen(false);
        dispatch(resetCreateProductMessage());
      }, 3000);
    }
  }, [createProductMessage]);

  const onItemSelectionChange = (value, field) => {
    let updatedValue = value;
    if (field === "dueDate") {
      updatedValue = new Date(value);
    } else if (field === "quantity" && value) {
      updatedValue = parseInt(value, 10);
    }

    let filteredCategory = null;
    const isOldProduct = !!(updatedValue && updatedValue.categoryId);
    if (field === "product" && isOldProduct && updatedValue) {
      const cat = availableCategories.filter(
        (ac) => ac.id === updatedValue.categoryId
      );

      filteredCategory =
        cat && cat.length > 0 ? { ...cat[0], label: cat[0].name } : null;
    }

    let defaultCategory =
      field === "category" ? updatedValue : formData.category;

    // make catefory as null when product is cleared or new product is added
    defaultCategory =
      field === "product" && (!updatedValue || !isOldProduct)
        ? null
        : defaultCategory;

    setFormData((prev) => ({
      ...prev,
      [field]: updatedValue,
      category:
        field === "product" && isOldProduct
          ? filteredCategory
          : defaultCategory,
    }));
  };

  const transformId = (value) => value?.toLowerCase().replace(/ /g, "_");

  const onCreate = () => {
    const { product, category, dueDate, quantity, unit } = formData;
    if (product && category && dueDate && quantity) {
      const categoryId = category.id || transformId(category.name);
      const productId =
        product.id || `${transformId(product.name)}_${categoryId}`;

      if (!product.id) {
        dispatch(
          createAvailableProducts({
            id: productId,
            name: product.name,
            categoryId,
          })
        );
      }

      if (!category.id) {
        dispatch(
          createAvailableCategories({
            id: categoryId,
            name: category.name,
          })
        );
      }

      dispatch(
        createProducts({
          id: `${productId}_${new Date().getTime()}`,
          price: 0,
          quantity,
          unit,
          name: product.name,
          categoryId,
          category: category.name,
          date: new Date(dueDate).toLocaleDateString(),
          purchasedDate: 0,
          isCompleted: false,
        })
      );
      // setOpen(true);
      setFormData({
        product: null,
        category: null,
        dueDate: dayjs(new Date()),
        quantity: 1,
        unit: "kgs",
      });
    } else setShowError(true);
  };

  const disableCreateButton = () => {
    const { product, category, dueDate, quantity } = formData;
    // console.log(product, category, dueDate, quantity);
    return !(product && category && dueDate && quantity);
  };

  return (
    <div className="create-product-wrapper">
      <AutoCompleteMic
        list={availableProducts}
        id="product"
        showError={showError}
        data={formData.product}
        onItemSelectionChange={(val) => onItemSelectionChange(val, "product")}
        label="Products"
        onMic={(id) => setCurrentMic(id)}
        currentMicId={currentMic}
      />
      <AutoCompleteMic
        list={availableCategories}
        id="category"
        showError={showError}
        data={formData.category}
        onItemSelectionChange={(val) => onItemSelectionChange(val, "category")}
        label="Category"
        onMic={(id) => setCurrentMic(id)}
        currentMicId={currentMic}
        disabled={
          !formData.product || (formData.product && !!formData.product.id)
        }
      />

      <RadioGroup
        title={"Units"}
        value={"kgs"}
        onChange={(value) => onItemSelectionChange(value, "unit")}
        inputs={radioInputs}
        theme={theme}
        sx={{ backgroundColor: "#9f2c5e" }}
      />
      <div className="date-picker-container">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={["DatePicker"]}>
            <DatePicker
              label="Due Date"
              inputFormat="dd-MM-yyyy"
              onChange={(event) => onItemSelectionChange(event, "dueDate")}
              value={formData.dueDate}
              slotProps={{
                textField: {
                  helperText:
                    showError && !formData.dueDate ? "Invalid Value!" : "",
                  error: showError && !formData.dueDate,
                },
              }}
            />
          </DemoContainer>
        </LocalizationProvider>
      </div>
      <TextField
        className="quantity-field"
        id={`quantity`}
        type="number"
        label="Quantity"
        variant="outlined"
        InputProps={{
          endAdornment: (
            <Stack direction="row">
              <InputAdornment sx={{ mt: "20px" }} position="start">
                <Chip
                  label={formData.unit}
                  sx={{
                    backgroundColor: "#9f2c5e",
                    color: "white",
                    fontSize: "15px",
                  }}
                />
              </InputAdornment>
              <Divider
                sx={{ height: 30, m: "6px", borderRightWidth: "medium" }}
                orientation="vertical"
              />
              <IconButton
                onClick={() =>
                  onItemSelectionChange(
                    parseInt(formData.quantity) - 1,
                    "quantity"
                  )
                }
                disabled={parseInt(formData.quantity) <= 0}
                type="button"
                sx={{ p: "2px", color: "#9f2c5e" }}
                aria-label="search"
              >
                <ArrowDownwardIcon />
              </IconButton>
              <IconButton
                onClick={() =>
                  onItemSelectionChange(
                    parseInt(formData.quantity) + 1,
                    "quantity"
                  )
                }
                type="button"
                sx={{ p: "2px", color: "#9f2c5e" }}
                aria-label="search"
              >
                <ArrowUpwardIcon />
              </IconButton>
              <Divider
                sx={{ height: 30, m: "6px", borderRightWidth: "medium" }}
                orientation="vertical"
              />
              <IconButton
                onClick={() => onItemSelectionChange(0, "quantity")}
                type="button"
                sx={{ p: "2px", color: "#9f2c5e" }}
                aria-label="search"
              >
                <BackspaceIcon />
              </IconButton>
            </Stack>
          ),
        }}
        error={showError && !formData.quantity}
        helperText={showError && !formData.quantity ? "Invalid Value!" : ""}
        value={formData.quantity}
        onChange={(event) =>
          onItemSelectionChange(event.target.value, "quantity")
        }
      />
      <Button
        className="create-button"
        variant="contained"
        onClick={() => onCreate()}
        disabled={disableCreateButton()}
        color={theme}
      >
        Create
      </Button>
      {open && createProductMessage && (
        <InfoMessage
          message={
            createProductMessage === "error"
              ? "Product is already available"
              : "Product is successfully created"
          }
          onClose={() => setOpen(false)}
          severity={createProductMessage}
        />
      )}
      {showUpload && <UploadExcelData onClose={() => {}} />}

      <BackdropLoader open={loading} />
    </div>
  );
}
