import { Droppable, Draggable } from '@hello-pangea/dnd';

function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function DayShiftSlot({ date, shifts }) {
    return (
        <div className="day-slot">
            <h4>{formatDate(date)}</h4>
            {shifts.map(shift => (
                <Droppable key={shift.id} droppableId={`${date}-${shift.id}`}>
                    {(provided) => (
                        <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            style={{ padding: '8px', backgroundColor: '#e0e0e0', marginTop: '8px' }}
                        >
                            <h5>{shift.label} ({shift.startTime} - {shift.endTime})</h5>
                            {shift.employees.map((employee, index) => (
                                <Draggable key={employee._id} draggableId={employee._id} index={index}>
                                    {(provided) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            style={{
                                                padding: '8px',
                                                margin: '4px',
                                                backgroundColor: '#cce7ff',
                                                ...provided.draggableProps.style
                                            }}
                                        >
                                            {employee.name}
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            ))}
        </div>
    );
}

export default DayShiftSlot;
