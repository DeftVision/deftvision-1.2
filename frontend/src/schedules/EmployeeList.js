import { Draggable, Droppable } from '@hello-pangea/dnd';

function EmployeeList({ employees }) {
    return (
        <Droppable droppableId="availableEmployees">
            {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps} style={{ minWidth: '200px', padding: '16px', backgroundColor: '#f0f0f0' }}>
                    <h3>Available Employees</h3>
                    {employees.map((employee, index) => (
                        <Draggable key={employee._id} draggableId={employee._id} index={index}>
                            {(provided) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    style={{
                                        padding: '8px',
                                        margin: '4px',
                                        backgroundColor: '#eee',
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
    );
}

export default EmployeeList;
