import React, { useEffect, useState } from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

import "./RadioGroup.scss";

export default function RadioInputGroup({
  title,
  inputs,
  onChange,
  value,
  theme,
}) {
  const [data, setData] = useState(value);

  useEffect(() => {
    setData(value);
  }, [value]);

  const onValueChange = (e) => {
    setData(e.target.value);
    onChange(e.target.value);
  };
  return (
    <FormControl className="radio-group-wrapper">
      <FormLabel id="demo-row-radio-buttons-group-label">{title}</FormLabel>
      <RadioGroup
        row
        aria-labelledby="demo-row-radio-buttons-group-label"
        name="row-radio-buttons-group"
        value={data}
        onChange={(e) => onValueChange(e)}
      >
        {inputs.map((input) => (
          <FormControlLabel
            value={input.value}
            control={<Radio color={theme} />}
            label={input.label}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
}
