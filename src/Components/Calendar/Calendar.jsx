import React, { useContext } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { DataContext } from "../../Helpers/DataContext";

const Calendar = () => {
  const { selectedDate, setSelectedDate } = useContext(DataContext);
  return (
    <DatePicker
      showIcon={true}
      wrapperClassName="datePicker"
      selected={selectedDate}
      onChange={(date) => {
        const selectedDateInUTC = new Date(
          date.getTime() - date.getTimezoneOffset() * 60000
        );
        setSelectedDate(selectedDateInUTC);
      }}
    />
  );
};

export default Calendar;
