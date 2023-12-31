import React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

export default function FilterProducts({ onFilter }) {
  const getDate = (value) => {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - value);
    return {
      date: currentDate.toLocaleDateString(),
      year: currentDate.getFullYear(),
    };
  };

  const dateFilters = [
    { value: "month", label: "This Month" },
    { value: "last_month", label: "Last Month" },
    { value: getDate(90).date, label: "Last 90 Days" },
    { value: getDate(0).year, label: "This Year" },
    { value: getDate(0).year - 1, label: getDate(0).year - 1 },
  ];

  const [dateFilter, setDateFilter] = React.useState(dateFilters[0].value);
  const [searchText, setSearchText] = React.useState("");

  // useEffect(() => {
  //   onFilter({
  //     date: getCalendarDate(30).date,
  //     text: "",
  //   });
  // }, []);

  const getFilterLabel = (val) => {
    const filteredData = dateFilters.filter((df) => df.value === val);
    if (filteredData.length > 0) return filteredData[0].label;

    return "";
  };

  const handleChange = (event) => {
    const data = event.target.value;
    setDateFilter(data);
    onFilter({
      date: data,
      text: searchText,
      label: getFilterLabel(data),
    });
  };

  return (
    <Box
      sx={{
        "& > :not(style)": { m: 1, width: "18ch" },
      }}
      noValidate
      autoComplete="off"
    >
      <TextField
        id="outlined-basic"
        label="Search products"
        variant="outlined"
        value={searchText}
        onChange={(e) => {
          setSearchText(e.target.value);
          onFilter({
            date: dateFilter,
            text: e.target.value,
            label: getFilterLabel(dateFilter),
          });
        }}
      />
      {/* <TextField id="filled-basic" label="Filled" variant="filled" />
      <TextField id="standard-basic" label="Standard" variant="standard" /> */}

      <FormControl>
        <InputLabel id="demo-simple-select-label">Filter</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={dateFilter}
          label="Filter"
          onChange={handleChange}
        >
          {/* <MenuItem value={getDate(30).date}>Last 30 days</MenuItem> */}
          {/* <MenuItem value={getDate(90).date}>Last 90 days</MenuItem> */}
          {dateFilters.map(({ value, label }) => (
            <MenuItem value={value}>{label}</MenuItem>
          ))}
          {/* <MenuItem value={"month"}>This Month</MenuItem>
          <MenuItem value={"last_month"}>Last Month</MenuItem>
          <MenuItem value={getDate(90).date}>Last 90 Days</MenuItem>
          <MenuItem value={getDate(0).year}>This Year</MenuItem>
          <MenuItem value={getDate(0).year - 1}>{getDate(0).year - 1}</MenuItem> */}
        </Select>
      </FormControl>
    </Box>
  );
}
