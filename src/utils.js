export const getCalendarDate = (value) => {
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() - value);
  return {
    date: currentDate.toLocaleDateString(),
    year: currentDate.getFullYear(),
  };
};

export const capitalizeFirstLetter = (string) => {
  return string
    ? string
        .split(" ")
        .map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`)
        .join(" ")
    : "";
};
