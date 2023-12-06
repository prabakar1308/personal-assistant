import React, { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";

export default function UpdateModal({ open, onClose }) {
  const { title, id } = open || {};
  const [selectedValue, setSelectedValue] = useState(0);
  const handleClose = (value, canIncrease) => {
    onClose({ value, id, canIncrease });
  };

  const list = [
    // { label: "0", value: 0 },
    { label: "50", value: 0.05 },
    { label: "100", value: 0.1 },
    { label: "200", value: 0.2 },
    { label: "250", value: 0.25 },
    { label: "300", value: 0.3 },
    { label: "400", value: 0.4 },
    { label: "500", value: 0.5 },
    { label: "750", value: 0.75 },
  ];

  return (
    <React.Fragment>
      <Dialog open={!!open} onClose={() => handleClose(null)}>
        <DialogTitle>Update {title}</DialogTitle>
        <DialogContent>
          <Stack
            spacing={{ xs: 2, sm: 2 }}
            direction="row"
            useFlexGap
            flexWrap="wrap"
          >
            {list.map(({ label, value }) => (
              <Chip
                sx={{ width: "50px", fontWeight: "bold" }}
                label={label}
                onClick={() => setSelectedValue(value)}
                color={selectedValue === value ? "success" : "default"}
                variant={"contained"}
              />
            ))}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", padding: "20px" }}>
          <Button
            variant="outlined"
            color="success"
            onClick={() => handleClose(null)}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => handleClose(selectedValue, false)}
          >
            Remove
          </Button>
          <Button
            disabled={!selectedValue}
            variant="contained"
            color="success"
            onClick={() => handleClose(selectedValue, true)}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
