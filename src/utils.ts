export function formatTimestamp(timestamp: string): string {
    if (!timestamp) return "Date not found";
  
    // Create a Date object
    const date = new Date(timestamp);
  
    // Format day with suffix (st, nd, rd, th)
    const day = date.getDate();
    const daySuffix = 
      (day % 10 === 1 && day !== 11) ? 'st' : 
      (day % 10 === 2 && day !== 12) ? 'nd' : 
      (day % 10 === 3 && day !== 13) ? 'rd' : 'th';
  
    // Get the full month name
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
  
    // Convert to Indian Standard Time (IST)
    const options:any = {
      timeZone: 'Asia/Kolkata', // Set timezone to IST
      hour12: true, // 12-hour clock
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    };
  
    // Get the time formatted in IST
    const timeInIST = date.toLocaleString('en-IN', options);
    const [time, ampm] = timeInIST.split(' '); // Split time and AM/PM part
  
    // Format hours, minutes, and AM/PM
    const [hours, minutes, seconds] = time.split(':');
    
    return `${day}${daySuffix} ${month} ${year} ${hours}:${minutes} ${ampm}`;
  }
  