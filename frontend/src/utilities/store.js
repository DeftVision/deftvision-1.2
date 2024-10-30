// store.js
import { configureStore, createSlice } from '@reduxjs/toolkit';

const employeesSlice = createSlice({
    name: 'employees',
    initialState: [],
    reducers: {
        setEmployees: (state, action) => action.payload,
    },
});

const shiftAssignmentsSlice = createSlice({
    name: 'shiftAssignments',
    initialState: {},
    reducers: {
        setShiftAssignments: (state, action) => action.payload,
    },
});

export const { setEmployees } = employeesSlice.actions;
export const { setShiftAssignments } = shiftAssignmentsSlice.actions;

const store = configureStore({
    reducer: {
        employees: employeesSlice.reducer,
        shiftAssignments: shiftAssignmentsSlice.reducer,
    },
});

export default store;
