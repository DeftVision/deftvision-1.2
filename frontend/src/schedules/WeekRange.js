// WeekRange.js

export function getWeekRange(date = new Date()) {
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const diffToMonday = day === 0 ? -6 : 1 - day; // Calculate days to get to Monday
    startOfWeek.setDate(startOfWeek.getDate() + diffToMonday); // Set to Monday

    const weekDates = [];
    for (let i = 0; i < 7; i++) {
        const currentDay = new Date(startOfWeek);
        currentDay.setDate(startOfWeek.getDate() + i);
        weekDates.push(currentDay);
    }

    return weekDates; // Returns an array of dates from Monday to Sunday
}
