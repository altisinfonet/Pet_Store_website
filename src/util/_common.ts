export function isEmptyObject(obj: any) {
    return Object.getOwnPropertyNames(obj).length === 0;
}

export async function urlToBase64(url: string) {
    try {
        const response = await fetch(url);
        if (response.ok) {
            const blob = await response.blob();
            const reader = new FileReader();
            return new Promise((resolve, reject) => {
                reader.onload = () => {
                    resolve(reader.result);
                };
                reader.onerror = reject;
                reader.readAsDataURL(blob);
            });
        } else {
            throw new Error('Failed to fetch image');
        }
    } catch (error) {
        console.error('Error converting URL to base64:', error);
        throw error;
    }
}

export function phoneRegax(num: any) {
    // Define the regex pattern
    const regexPattern = /^\d{10}$/;
    return regexPattern.test(num);
}

// for india
export function zipCodeRegax(num: any) {
    // Define the regex pattern
    const regexPattern = /^\d{6}$/;
    return regexPattern.test(num);
}

export function emailRegax(email: string) {
    // Define the regex pattern
    // const regexPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    // const regexPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|in|co|org|net)$/;
    const regexPattern = /^[^\s@]+@[a-zA-Z]+\.[a-zA-Z.]+$/;
    return regexPattern.test(email);
}

export function capitalize(name: string) {
    return name?.toLowerCase().replace(/\b(\w)/g, (x: any) => x.toUpperCase())
}

export function lowerCase(name: string) {
    return name?.toLowerCase().replace(/\b(\w)/g, (x: any) => x.toLowerCase());
}

export function navigateToGoogleMaps(latTo: any, lngTo: any, latFrom: any, lngFrom: any) {
    const url = `https://www.google.com/maps/dir/${latTo},${lngTo}/${latFrom},${lngFrom}`;
    // window.open(url, '_blank');
    return url;
}

export function trimmedTxt(txt: string, charToShow: number) {
    return txt.substring(0, 80);
}

const slugModifier = (v: any, i: number, p_slug: string) => {
    if (p_slug) {
        if (v?.slug) {
            v['slug_url'] = `${p_slug}/${v.slug}`
        }
        if (v?.sub_categories && v.sub_categories?.length) {
            v.sub_categories = v.sub_categories.map(createSlugModifier(v['slug_url']))
        }
    }
    return v;
}

export const createSlugModifier = (p_slug: string) => {
    return (v: any, i: number) => slugModifier(v, i, p_slug);
}

// Function to convert a database date string to "Month Day, Year" format
export function convertDateString(dbDateString: any) {
    // Convert the string to a Date object
    const date = new Date(dbDateString);

    // Define an array of month names
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    // Extract the day, month, and year from the Date object
    const day = date.getDate();
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();

    // Format the date into "Month Day, Year"
    return `${month} ${day}, ${year}`;
}

export function formatDateForDtdcTrcaking(dateStr: string) {
    // Extract day, month, and year from the input string
    const day = dateStr.substring(0, 2);
    const month = dateStr.substring(2, 4);
    const year = dateStr.substring(4, 8);

    // Convert month number to month name
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const monthName = monthNames[parseInt(month, 10) - 1];

    // Determine the day suffix
    const dayInt = parseInt(day, 10);
    let daySuffix = "th";
    if (dayInt === 1 || dayInt === 21 || dayInt === 31) {
        daySuffix = "st";
    } else if (dayInt === 2 || dayInt === 22) {
        daySuffix = "nd";
    } else if (dayInt === 3 || dayInt === 23) {
        daySuffix = "rd";
    }

    // Construct the formatted date string
    const formattedDate = `${dayInt}${daySuffix} ${monthName}, ${year}`;
    return formattedDate;
}

export function formatTimeForDtdcTracking(timeStr: string) {
    // Extract hours and minutes from the input string
    const hours = parseInt(timeStr.substring(0, 2), 10);
    const minutes = timeStr.substring(2, 4);

    // Determine AM/PM and adjust hours for 12-hour format
    const period = hours >= 12 ? 'PM' : 'AM';
    const adjustedHours = hours % 12 || 12;

    // Pad the hours to ensure two digits
    const formattedHours = String(adjustedHours).padStart(2, '0');

    // Construct the formatted time string
    const formattedTime = `${formattedHours}:${minutes} ${period}`;
    return formattedTime;
}

export function persentageCalculate(price: any, sale_price: any) {
    return Math.round((price - sale_price) * 100 / price)
}
// // Example usage
// const dbDateString = "2024-06-03T10:33:57.674Z";
// const formattedDate = convertDateString(dbDateString);

export const separator = (price: number | string) => {
    let priceNew = +price;
    let formattedPrice = priceNew.toLocaleString('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 2
    });

    return formattedPrice;
} 