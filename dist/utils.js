"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatTimestamp = void 0;
function formatTimestamp(timestamp) {
    if (!timestamp)
        return "Date not found";
    const date = new Date(timestamp);
    // Format day with suffix (st, nd, rd, th)
    const day = date.getDate();
    const daySuffix = day % 10 === 1 && day !== 11 ? 'st' :
        day % 10 === 2 && day !== 12 ? 'nd' :
            day % 10 === 3 && day !== 13 ? 'rd' : 'th';
    const month = date.toLocaleString('default', { month: 'long' }); // Full month name
    const year = date.getFullYear();
    // Format hours, minutes, and AM/PM
    const hours = date.getHours() % 12 || 12; // Convert to 12-hour format
    const minutes = String(date.getMinutes()).padStart(2, '0'); // Pad with zero
    const ampm = date.getHours() >= 12 ? 'PM' : 'AM';
    return `${day}${daySuffix} ${month} ${year} ${hours}:${minutes} ${ampm}`;
}
exports.formatTimestamp = formatTimestamp;
