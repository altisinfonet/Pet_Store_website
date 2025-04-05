import { _get, _put } from "../services";
import getUrlWithKey from "./_apiUrl";

export function isEmptyObject(obj: any) {
    return Object.getOwnPropertyNames(obj).length === 0;
}

export async function urlToBase64(url: string) {
    console.log("url", url)
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
            console.log('Failed to fetch image')
        }
    } catch (error) {
        console.error('Error converting URL to base64:', error);
    }
}

export function phoneRegax(num: any) {
    // Define the regex pattern
    const regexPattern = /^\d{10}$/;
    return regexPattern.test(num);
}

export function numberRegax(num: any) {
    // Extract only numeric characters from the input
    const numericString = num.toString().replace(/\D/g, '');

    // Define the regex pattern to check if the input contains only numeric characters
    const regexPattern = /^\d+$/;

    // Test the numeric string against the regex pattern
    return regexPattern.test(numericString);
}

export function validateMultipleEmailsWithComma(inputString:any) {
    // Split the input string by comma to get individual email addresses
    const emails = inputString.split(',');

    // Regular expression for basic email validation
    // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // old regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/; // new regex

    // Iterate through each email address and validate
    for (let i = 0; i < emails.length; i++) {
        let email = emails[i].trim(); // Trim whitespace around each email address
        
        if (!emailRegex.test(email)) {
            return false; // Return false if any email is invalid
        }
    }

    return true; // Return true if all emails are valid
}

export function indianPincodeRegex(pincode: any) {
    // Define the regex pattern for Indian PIN codes
    const regexPattern = /^\d{6}$/;

    // Test the pincode against the regex pattern
    return regexPattern.test(pincode);
}


export function emailRegax(email: string) {
    // Define the regex pattern
    const regexPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regexPattern.test(email);
}

export function strongPasswordRegax(password: string) {
    // Regex for strong password
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\[\]{};:'",.<>?\\|`~=_+\-])[A-Za-z\d!@#$%^&*()\[\]{};:'",.<>?\\|`~=_+\-]{8,}$/;
    return strongPasswordRegex.test(password);
}

// Validation message function
function getValidationMessage(password: string) {
    const messages = [];
    if (password.length < 8) {
        messages.push('Password must be at least 8 characters long.');
    }
    if (!/(?=.*[a-z])/.test(password)) {
        messages.push('Password must contain at least one lowercase letter.');
    }
    if (!/(?=.*[A-Z])/.test(password)) {
        messages.push('Password must contain at least one uppercase letter.');
    }
    if (!/(?=.*\d)/.test(password)) {
        messages.push('Password must contain at least one digit.');
    }
    if (!/(?=.*[@$!%*?&])/.test(password)) {
        messages.push('Password must contain at least one special character.');
    }
    return messages;
}

export function capitalize(name: string) {
    return name?.toLowerCase().replace(/\b(\w)/g, (x: any) => x.toUpperCase())
}

export function generateCouponCode(length: number) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let couponCode = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        couponCode += characters[randomIndex];
    }
    return couponCode.toUpperCase(); // To ensure the coupon code is in uppercase
}

export function searchIdPatternRegex(str: string) {
    const regexPattern = /id:\d+/;
    // Test if the string matches the regex pattern
    const isMatch: boolean = regexPattern.test(str);

    return isMatch;
}

export function formatDate(isoDateString: any) {
    if (isoDateString) {
        const date = new Date(isoDateString);
        const day = String(date.getUTCDate()).padStart(2, '0');
        const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are 0-based, so add 1
        const year = date.getUTCFullYear();
        console.log("isoDateString", `${day}-${month}-${year}`);
        return `${day}-${month}-${year}`;
    } else {
        return ``;
    }
}

export function formatNumber(num: number) {
    if (num >= 1000) {
        // Convert to K format
        const rounded = Math.floor(num / 100) / 10; // Round to 1 decimal place
        return `${rounded}K`;
    } else {
        return num.toString();
    }
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

export async function urlToFile(url: any, filename: any, mimeType: any) {
    // Fetch the image data from the URL
    const response = await fetch(url);
    // Convert the image data to a Blob
    const blob = await response.blob();

    // Get the current time as the last modified time
    const lastModified = Date.now();

    // Create a File object from the Blob
    const file = new File([blob], filename, { type: mimeType, lastModified: lastModified });

    // Log file properties to verify
    console.log('File object:', {
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified,
        lastModifiedDate: new Date(file.lastModified)
    });

    return file;
}

export async function getAdminSetting(key: string) {
    try {
        const { a_get_with_id } = getUrlWithKey("admin_setting");
        const { data } = await _get(`${a_get_with_id}/${key}`);
        if (data?.success && data?.data) {
            const sateValue: any = data?.data?.metadata ? JSON.parse(data?.data?.metadata) : null;
            return sateValue;
        }
    } catch (error: any) {
        throw new Error(error);
    }
}

export async function getStatus() {
    try {
        const { get_status } = getUrlWithKey("common");
        const { data } = await _put(`${get_status}`);
        if (data?.success && data?.data) {
            return data?.data
        }
    } catch (error: any) {
        throw new Error(error);
    }
}