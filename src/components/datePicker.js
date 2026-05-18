import * as React from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

export default function Calendar({ DateValue, handleSelectDate }) {
  // If DateValue is not provided, default to the current date
  const [selectedDate, setSelectedDate] = React.useState(DateValue || dayjs());

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
    if (handleSelectDate) {
      handleSelectDate(newDate);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DatePicker']}>
        <DatePicker
          value={selectedDate}
          onChange={handleDateChange}  
          format="DD/MM/YYYY"
          shouldDisableDate={(date) => date.isBefore(dayjs(), 'day')}
        />
      </DemoContainer>
    </LocalizationProvider>
  );
}

