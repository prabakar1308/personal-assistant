import React, { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Slider from "@mui/material/Slider";
import Typography from "@mui/material/Typography";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import AddCircleIcon from "@mui/icons-material/AddCircle";

export default function UpdateModal({ open, onClose }) {
  const { title, id, isPrice = false } = open || {};
  const [selectedValue, setSelectedValue] = useState(0);
  const [thousand, setThousand] = useState(0);
  const [hundred, setHundred] = useState(0);
  const [ten, setTen] = useState(0);
  const handleClose = (value, canIncrease) => {
    onClose({ value, id, canIncrease, isPrice });
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
            {!isPrice ? (
              list.map(({ label, value }) => (
                <Chip
                  sx={{ width: "50px", fontWeight: "bold" }}
                  label={label}
                  onClick={() => setSelectedValue(value)}
                  color={selectedValue === value ? "success" : "default"}
                  variant={"contained"}
                />
              ))
            ) : (
              <>
                <Typography variant="subtitle2" gutterBottom>
                  Thousands (0 - 100)
                </Typography>
                <Slider
                  onChange={(event) => setThousand(event.target.value)}
                  value={thousand}
                  valueLabelDisplay="auto"
                  aria-label="Default"
                  sx={{ color: "#9f2c5e" }}
                />
                <Typography variant="subtitle2" gutterBottom>
                  Hundreds (0 - 10)
                </Typography>
                <Slider
                  onChange={(event) => setHundred(event.target.value)}
                  value={hundred}
                  aria-label="Default"
                  valueLabelDisplay="auto"
                  max={10}
                  sx={{ color: "#9f2c5e" }}
                />
                <Typography variant="subtitle2" gutterBottom>
                  Tens (0 - 100)
                </Typography>
                <Slider
                  onChange={(event) => setTen(event.target.value)}
                  value={ten}
                  aria-label="Default"
                  valueLabelDisplay="auto"
                  sx={{ color: "#9f2c5e" }}
                />
                <Stack direction="row" spacing={1}>
                  <Chip
                    icon={<CurrencyRupeeIcon />}
                    sx={{ fontWeight: "bold" }}
                    color="success"
                    label={thousand * 1000}
                  />
                  <AddCircleIcon color="success" />
                  <Chip
                    icon={<CurrencyRupeeIcon />}
                    sx={{ fontWeight: "bold" }}
                    color="success"
                    label={hundred * 100}
                  />
                  <AddCircleIcon color="success" />
                  <Chip
                    icon={<CurrencyRupeeIcon />}
                    sx={{ fontWeight: "bold" }}
                    color="success"
                    label={ten}
                  />
                </Stack>
              </>
            )}
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
          {!isPrice ? (
            <>
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
            </>
          ) : (
            <Button
              variant="contained"
              color="success"
              onClick={() =>
                handleClose(thousand * 1000 + hundred * 100 + ten, true)
              }
            >
              Update Price ({thousand * 1000 + hundred * 100 + ten})
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
