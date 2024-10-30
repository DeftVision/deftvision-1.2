import DayShiftSlot from './DayShiftSlot';
import { DragDropContext } from '@hello-pangea/dnd';

function CalendarGrid({ weekDates, shiftAssignments, onDragEnd }) {
    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="calendar-grid">
                {weekDates.map(date => (
                    <DayShiftSlot key={date} date={date} shifts={shiftAssignments[date] || []} />
                ))}
            </div>
        </DragDropContext>
    );
}

export default CalendarGrid;

