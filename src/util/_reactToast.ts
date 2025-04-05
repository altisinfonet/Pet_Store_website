import { toast } from 'react-toastify';
// import { POSITION } from 'react-toastify'; // Add this line 

const autoClose = 1000;
const autoWarningClose = 1000;
const position = 'top-right';

const dismissToast = () => {
    toast.dismiss();
}
const _INFO = (msg = "INFO's TOAST!") => {
    dismissToast()
    toast.info(msg, { position, autoClose });
}

const _ERROR = (msg = "ERROR's TOAST!") => { // Change the default message 
    dismissToast()
    toast.error(msg, { position, autoClose });
}

const _SUCCESS = (msg = "SUCCESS's TOAST!") => { // Change the default message 
    dismissToast()
    toast.success(msg, { position, autoClose });
}

const _WARNING = (msg = "WARNING's TOAST!") => { // Fix the typo in function name 
    dismissToast()
    toast.warn(msg, { position, autoClose: autoWarningClose }); // Fix the typo in function name
}

export {
    _INFO,
    _ERROR,
    _SUCCESS,
    _WARNING // Update the export name 
}


