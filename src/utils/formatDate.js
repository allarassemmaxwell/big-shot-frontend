export default function formatDate(dateString) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // Create a Date object from the dateString
    const date = new Date(dateString);

    // Extract day, month, year, hours, and minutes
    const day = date.getDate();
    const monthIndex = date.getMonth();
    const month = months[monthIndex];
    const year = date.getFullYear().toString().slice(-2); // Get last two digits of the year
    const hours = date.getHours().toString().padStart(2, '0'); // Ensure 2 digits for hours
    const minutes = date.getMinutes().toString().padStart(2, '0'); // Ensure 2 digits for minutes

    // Format the date as "day Month year, hour:minute"
    const formattedDate = `${day} ${month} ${year}, ${hours}:${minutes}`;

    return formattedDate;
}

// Example usage:
const date = '2024-12-19T00:02:57.785556Z'; // Assuming the date string is in ISO 8601 format
const formattedDate = formatDate(date);
console.log(formattedDate); // Output: "19 Dec 24, 00:02"