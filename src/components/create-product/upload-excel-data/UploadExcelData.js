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
import FileUploadOutlined from "@mui/icons-material/FileUploadOutlined";
import TextField from "@mui/material/TextField";

import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

import Chip from "@mui/material/Chip";
import Slide from "@mui/material/Slide";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function UploadExcelData({ onClose }) {
  const [products, setProducts] = useState();
  const [categories, setCategories] = useState();

  const handleClose = () => {
    onClose(false);
  };

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const startListening = () =>
    SpeechRecognition.startListening({ continuous: true });

  const handleUpload = () => {
    console.log();
  };

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  // return (
  //   <div>
  //     <p>Microphone: {listening ? 'on' : 'off'}</p>
  //     <button onClick={SpeechRecognition.startListening}>Start</button>
  //     <button onClick={SpeechRecognition.stopListening}>Stop</button>
  //     <button onClick={resetTranscript}>Reset</button>
  //     <p>{transcript}</p>
  //   </div>
  // );

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
              Upload
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
        <div>
          <p>Microphone: {listening ? "on" : "off"}</p>
          <button onClick={SpeechRecognition.startListening}>Start</button>
          <button onClick={SpeechRecognition.stopListening}>Stop</button>
          <button onClick={resetTranscript}>Reset</button>
          <p>{transcript}</p>
        </div>
        {/* <TextField
          variant="standard"
          type="file"
          InputProps={{
            endAdornment: (
              <IconButton component="label">
                <FileUploadOutlined />
                <input
                  styles={{ display: "none" }}
                  type="file"
                  hidden
                  onChange={handleUpload}
                  name="[licenseFile]"
                />
              </IconButton>
            ),
          }}
        /> */}
      </Dialog>
    </>
  );
}
