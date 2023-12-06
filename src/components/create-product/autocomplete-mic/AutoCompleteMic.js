import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import Stack from "@mui/material/Stack";

import MuiAlert from "@mui/material/Alert";
import MicIcon from "@mui/icons-material/Mic";
import IconButton from "@mui/material/IconButton";

import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

import InfoMessage from "../../generic/info-message/InfoMessage";
import { capitalizeFirstLetter } from "../../../utils";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function AutoCompleteMic({
  list,
  id,
  data,
  showError,
  onItemSelectionChange,
  label,
  disabled = false,
  onMic,
  currentMicId,
}) {
  const filter = createFilterOptions();
  const [inputOpen, setInputOpen] = useState(false);
  const [textValue, setTextValue] = useState("");

  const [selectedValue, setSelectedValue] = useState(data);

  const [showMicError, setShowMicError] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const [isMicOn, setIsMicOn] = useState(false);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const startListening = (e) => {
    SpeechRecognition.startListening({ continuous: true });
  };

  useEffect(() => {
    setSelectedValue(data);
    setTextValue(data ? data.name : "");
  }, [data]);

  useEffect(() => {
    if (currentMicId === id && transcript) {
      console.log(transcript);
      const value = capitalizeFirstLetter(transcript);
      setTextValue(value);
    }
  }, [transcript]);

  return (
    <Stack direction="row">
      <Autocomplete
        disablePortal
        open={inputOpen}
        onOpen={() => setInputOpen(true)}
        onClose={() => setInputOpen(false)}
        id={id}
        options={list.map((al) => ({ ...al, label: al.name }))}
        isOptionEqualToValue={(option, data) => option.id === data.id}
        renderInput={(params) => {
          return (
            <TextField
              {...params}
              label={label}
              error={showError && !selectedValue}
              helperText={showError && !selectedValue ? "Invalid Value!" : ""}
              onChange={(e) => setTextValue(e.target.value)}
            />
          );
        }}
        // onChange={(event, value) => onItemSelectionChange(value, "product")}
        onBlur={(e, v) => {
          if (!isSelected) {
            setTextValue("");
          }
        }}
        onChange={(event, newValue) => {
          if (typeof newValue === "string") {
            onItemSelectionChange(newValue);
            setTextValue(newValue);
            // setValue({
            //   label: newValue,
            // });
            setIsSelected(true);
          } else if (newValue && newValue.inputValue) {
            // Create a new value from the user input
            // setValue({
            //   label: newValue.inputValue,
            // });
            const { inputValue } = newValue;
            onItemSelectionChange({ name: inputValue, label: inputValue });
            setTextValue(inputValue);
            setIsSelected(true);
          } else {
            onItemSelectionChange(newValue);
            setTextValue(newValue ? newValue.name : "");
            // setValue(newValue);
            setIsSelected(!!newValue);
          }
        }}
        // defaultValue={value}
        value={selectedValue}
        inputValue={textValue}
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
        disabled={disabled}
        selectOnFocus
        clearOnBlur
        handleHomeEndKeys
      />
      {/* <UploadFileIcon onClick={() => setShowUpload(true)} /> */}
      <IconButton
        id={`icon-btn-${id}`}
        className="mic-icon-button"
        disabled={disabled}
        onTouchStart={(e) => {
          resetTranscript();
          startListening(e);
          document.getElementById(id).focus();
          setInputOpen(true);
          setIsMicOn(true);
          onMic(id);
        }}
        // onMouseDown={startListening}
        // onMouseUp={SpeechRecognition.stopListening}
        onTouchEnd={(e) => {
          SpeechRecognition.stopListening();
          e.preventDefault();
          e.stopPropagation();
          setIsMicOn(false);
          resetTranscript();
        }}
        // onMouseUp={SpeechRecognition.stopListening}
        sx={{
          background: listening && isMicOn ? "red !important" : "#9f2c5e",
          m: "20px -5px 20px 3px",
          color: "white",
        }}
      >
        <MicIcon />
      </IconButton>
      {showMicError && (
        <InfoMessage
          message="Mic option not supported here"
          onClose={() => setShowMicError(false)}
          severity="warning"
        />
      )}
    </Stack>
  );
}
