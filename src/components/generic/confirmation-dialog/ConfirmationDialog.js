import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

export default function ConfirmationDialog({
  confirmText,
  confirmActionText,
  onClose,
}) {
  return (
    <React.Fragment>
      <Dialog
        open={true}
        onClose={() => onClose(null)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Delete"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {confirmText}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ mb: "10px", mr: "10px" }}>
          <Button
            color="error"
            variant="outlined"
            onClick={() => onClose(null)}
          >
            Cancel
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={() => onClose(true)}
            autoFocus
          >
            {confirmActionText}
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
