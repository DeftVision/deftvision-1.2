import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { getWeekRange } from './WeekRange';

function WeekSelector({ onWeekChange }) {
    return (
        <DatePicker
            onChange={(date) => onWeekChange(getWeekRange(date))}
            label="Select Week"
        />
    );
}

export default WeekSelector;
