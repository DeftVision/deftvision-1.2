import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import WeekSelector from './WeekSelector';
import CalendarGrid from './CalendarGrid';
import EmployeeList from './EmployeeList';
import ShiftSettings from './ShiftSettings';
import { getWeekRange } from './WeekRange';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useSelector, useDispatch } from 'react-redux';
import { setEmployees, setShiftAssignments } from '../utilities/store';

function Scheduler() {
    const dispatch = useDispatch();
    const employees = useSelector((state) => {
        console.log('Redux Employees:', state.employees);
        return state.employees;
    });
    const shiftAssignments = useSelector((state) => state.shiftAssignments);
    const [weekDates, setWeekDates] = useState([]);

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/employee/employees');
                const data = await response.json();
                dispatch(setEmployees(data.employees));
            } catch (error) {
                console.error('Error loading employees:', error);
            }
        };

        fetchEmployees();
        const weekRange = getWeekRange(new Date()); // Ensure we get an array
        console.log('Week Range:', weekRange); // Log to verify it's an array of dates
        setWeekDates(weekRange);
    }, [dispatch]);

    const handleWeekChange = (newWeek) => {
        setWeekDates(newWeek);
        dispatch(setShiftAssignments({}));
    };

    const handleOnDragEnd = (result) => {
        const { source, destination } = result;

        if (!destination) return;

        const sourceId = source.droppableId;
        const destId = destination.droppableId;

        const newShiftAssignments = { ...shiftAssignments };
        const newEmployees = [...employees];

        const [movedEmployee] = newEmployees.splice(source.index, 1);
        const [date, shiftId] = destId.split('-');

        if (!newShiftAssignments[date]) {
            newShiftAssignments[date] = [];
        }

        const targetShift = newShiftAssignments[date].find((shift) => shift.id === shiftId);
        if (targetShift) {
            targetShift.employees.push(movedEmployee);
        }

        dispatch(setEmployees(newEmployees));
        dispatch(setShiftAssignments(newShiftAssignments));
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DragDropContext onDragEnd={handleOnDragEnd}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '30px' }}>
                    <WeekSelector onWeekChange={handleWeekChange} />
                    <ShiftSettings />

                    <div style={{ display: 'flex', gap: '16px' }}>
                        <EmployeeList employees={employees} />
                        {/* Defensive check to ensure weekDates is iterable */}
                        {Array.isArray(weekDates) && (
                            <CalendarGrid
                                weekDates={weekDates}
                                shiftAssignments={shiftAssignments}
                            />
                        )}
                    </div>
                </div>
            </DragDropContext>
        </LocalizationProvider>
    );
}

export default Scheduler;
