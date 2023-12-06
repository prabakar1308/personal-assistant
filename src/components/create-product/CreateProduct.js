import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

import MuiAlert from "@mui/material/Alert";
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

import {
  resetCreateProductMessage,
  fetchAvailableProducts,
  createAvailableProducts,
  createAvailableCategories,
  createProducts,
  fetchAvailableCategories,
} from "../../store/reducer";
import InfoMessage from "../generic/info-message/InfoMessage";
import RadioGroup from "../generic/radio-group/RadioGroup";
import UploadExcelData from "./upload-excel-data/UploadExcelData";
import AutoCompleteMic from "./autocomplete-mic/AutoCompleteMic";
import "./CreateProduct.scss";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

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
  const createProductMessage = useSelector(
    (state) => state.createProductMessage
  );
  const dispatch = useDispatch();
  // const [productOpen, setProductOpen] = useState(false);
  // const [productInput, setProductInput] = useState("");
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

  // const {
  //   transcript,
  //   listening,
  //   resetTranscript,
  //   browserSupportsSpeechRecognition,
  // } = useSpeechRecognition();

  // const startListening = (e) => {
  //   SpeechRecognition.startListening({ continuous: true });
  // };

  useEffect(() => {
    dispatch(fetchAvailableProducts());
    dispatch(fetchAvailableCategories());

    // axios.get(
    //   "https://my-deployment-88217c.es.us-central1.gcp.cloud.es.io/_search",
    //   {
    //     headers: {
    //       "Content-Type": "application/json",
    //       Authorization:
    //         "ApiKey essu_WjFwRU9VOUpkMEpUVFRodmNtOVRORzlLTnpnNlgxWnlkVmRDT1ZOUldFOUlSVTF1VlRNd1pESmtVUT09AAAAAKXce4g=",
    //     },
    //   }
    // );
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
    // else if (field === "product" || field === "category") {
    //   updatedValue = { ...value };
    //   // delete updatedValue.label;
    // }

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

      // let updatedQuantity = quantity;
      // if (unit.toLowerCase() === "gms"){
      //   updatedQuantity = parseFloat(quantity/1000)
      // }

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
      {/* <Stack direction="row">
        <Autocomplete
          open={productOpen}
          onOpen={() => setProductOpen(true)}
          onClose={() => setProductOpen(false)}
          id="product"
          options={availableProducts.map((al) => ({ ...al, label: al.name }))}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          renderInput={(params) => {
            return (
              <TextField
                {...params}
                label="Products"
                error={showError && !formData.product}
                helperText={
                  showError && !formData.product ? "Invalid Value!" : ""
                }
              />
            );
          }}
          // onChange={(event, value) => onItemSelectionChange(value, "product")}
          onChange={(event, newValue) => {
            if (typeof newValue === "string") {
              onItemSelectionChange(newValue, "product");
              // setValue({
              //   label: newValue,
              // });
            } else if (newValue && newValue.inputValue) {
              // Create a new value from the user input
              // setValue({
              //   label: newValue.inputValue,
              // });
              const { inputValue } = newValue;
              onItemSelectionChange(
                { name: inputValue, label: inputValue },
                "product"
              );
            } else {
              onItemSelectionChange(newValue, "product");
              // setValue(newValue);
            }
          }}
          value={formData.product}
          inputValue={productInput}
          filterOptions={(options, params) => {
            const filtered = filter(options, params);

            const { inputValue } = params;
            // Suggest the creation of a new value
            const isExisting = options.some(
              (option) => inputValue === option.label
            );
            if (inputValue !== "" && !isExisting) {
              filtered.push({
                inputValue,
                label: `Add "${inputValue}"`,
              });
            }

            return filtered;
          }}
          selectOnFocus
          clearOnBlur
          handleHomeEndKeys
        />
        <IconButton
          className="mic-icon-button"
          onTouchStart={(e) => {
            startListening(e);
            document.getElementById("product").focus();
            setProductOpen(true);
          }}
          // onMouseDown={startListening}
          // onMouseUp={SpeechRecognition.stopListening}
          onTouchEnd={(e) => {
            SpeechRecognition.stopListening();
            console.log("Sddsdsddsd");
            resetTranscript();
            e.preventDefault();
            e.stopPropagation();
          }}
          // onMouseUp={SpeechRecognition.stopListening}
          sx={{
            background: listening ? "red" : "#9f2c5e",
            m: "20px -5px 20px 3px",
            color: "white",
          }}
        >
          <MicIcon />
        </IconButton>
      </Stack> */}

      {/* <Autocomplete
        disablePortal
        id="category"
        value={formData.category}
        options={availableCategories.map((al) => ({ ...al, label: al.name }))}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Category"
            error={showError && !formData.category}
            helperText={showError && !formData.category ? "Invalid Value!" : ""}
          />
        )}
        // onChange={(event, value) => onItemSelectionChange(value, "category")}
        onChange={(event, newValue) => {
          if (typeof newValue === "string") {
            onItemSelectionChange(newValue, "category");
            // setValue({
            //   label: newValue,
            // });
          } else if (newValue && newValue.inputValue) {
            // Create a new value from the user input
            // setValue({
            //   label: newValue.inputValue,
            // });
            const { inputValue } = newValue;
            onItemSelectionChange(
              { name: inputValue, label: inputValue },
              "category"
            );
          } else {
            onItemSelectionChange(newValue, "category");
            // setValue(newValue);
          }
        }}
        disabled={
          !formData.product || (formData.product && !!formData.product.id)
        }
        filterOptions={(options, params) => {
          const filtered = filter(options, params);

          const { inputValue } = params;
          // Suggest the creation of a new value
          const isExisting = options.some(
            (option) => inputValue === option.label
          );
          if (inputValue !== "" && !isExisting) {
            filtered.push({
              inputValue,
              label: `Add "${inputValue}"`,
            });
          }

          return filtered;
        }}
        selectOnFocus
        clearOnBlur
        handleHomeEndKeys
      /> */}
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
      {/* <DatePicker
        selected={startDate}
        onChange={(date) => setStartDate(date)}
      /> */}
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
    </div>
  );
}
