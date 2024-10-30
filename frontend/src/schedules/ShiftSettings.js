import { useState } from "react";

function ShiftSettings() {
    const [shiftTimes, setShiftTimes] = useState({
        morning: {startTime: '07:30', endTime: '11:30'},
        afternoon: {startTime: '12:00', endTime: '16:00'},
    });

    const handleShiftChange = (shift, field, value) => {
        setShiftTimes({
            ...shiftTimes,
            [shift]: {
                ...shiftTimes[shift],
                [field]: value,
            },
        });
    };

    return (
        <div style={{marginBottom: '16px'}}>
            <h3>Shift Settings</h3>
            {Object.entries(shiftTimes).map(([shift, times]) => (
                <div key={shift}>
                    <label>{shift} Start Time: </label>
                    <input
                        type="time"
                        value={times.startTime}
                        onChange={(e) => handleShiftChange(shift, e.target.value)} />
                </div>
            ))}
        </div>
    );
}


export default ShiftSettings;