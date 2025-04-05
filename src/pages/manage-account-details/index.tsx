import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react'
import useIsLogedin from '../../hooks/useIsLogedin';
import { strongPasswordRegax } from '../../Admin/util/_common';
import getUrlWithKey from '../../util/_apiUrl';
import { useUpdate } from '../../hooks';
import { _ERROR, _SUCCESS, _WARNING } from '../../util/_reactToast';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { _get, _post, _put } from '../../services';
import Cropper from "react-easy-crop";
import { Point, Area } from "react-easy-crop/types";
import NoImage from "../../../public/assets/images/dummy_profile.jpg"
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Tooltip, Box, InputAdornment, TextField, IconButton, Typography, Modal } from '@mui/material';
import { getCroppedImg } from "../../components/cropImageUtils"
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import EmailIcon from "@mui/icons-material/Email";
import { toast } from 'react-toastify';
import VerifiedIcon from '@mui/icons-material/Verified';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import PhoneIcon from '@mui/icons-material/Phone';
import { useDispatch } from 'react-redux';
import { setCart } from '../../reducer/getCartReducer';
import { setCoupon } from '../../reducer/couponReducer';
import { setMe } from '../../reducer/me';
import { setCartCount } from '../../reducer/cartCountReducer';
interface FormData {
    address_1?: string;
    address_type?: string;
    landmark?: string;
    city?: string;
    first_name?: string;
    last_name?: string;
    locality?: string;
    phone?: string;
    postcode?: string;
    state?: string;
    display_name?: string;
    email?: string;
    mobile_no?: string;
    old_assword?: string;
    new_password?: string;
    confirm_new_password?: string;
    default?: boolean;
}

const initialAcDetailsFormData: FormData = {
    first_name: "",
    last_name: "",
    display_name: "",
    email: "",
    mobile_no: "",
};

const initialAcDetailsFormDataError: FormData = {
    first_name: "",
    last_name: "",
    display_name: "",
    email: "",
    mobile_no: "",
};

const initialChangePasswordFormData: FormData = {
    new_password: "",
    confirm_new_password: "",
};
const LogOutDetailsPage = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const currentUrl = router.pathname
    const { logedData } = useIsLogedin();
    const { send_otp, account_verify_otp, delete_account, request_data, user_find, logout } = getUrlWithKey("auth_apis")
    const { get_page_meta, get_page_meta_account_policy } = getUrlWithKey("commons")

    const { change_account_details, change_password, upload_profile_picture } = getUrlWithKey("client_apis")
    const [otherView, setOtherView] = useState<any>("accountdetails");
    const [showLogout, setShowLogout] = useState(false);
    const [acDetailsFormData, setAcDetailsFormData] = useState<FormData>(
        initialAcDetailsFormData
    );
    const [acDetailsFormDataError, setAcDetailsFormDataError] =
        useState<FormData>(initialAcDetailsFormDataError);
    const [changePassFormData, setChangePassFormData] = useState<FormData>(
        initialChangePasswordFormData
    );
    const [change_account_details_url, setChange_account_details_url]: any =
        useState();
    const [change_password_url, setChange_password_url]: any = useState();
    const [change_password_errpr, setChange_password_error]: any = useState();
    const [change_password_errpr1, setChange_password_error1]: any = useState();
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [passwordCNFVisible, setPasswordCNFVisible] = useState(false);
    const [profileImage, setProfileImage] = useState(null);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [base64Image, setBase64Image] = useState<string | null>(null);
    const [phoneNumber, setPhoneNumber] = useState<string>('');
    const [phoneNumberError, setPhoneNumberError] = useState<string>('');
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)
    const [showBeforeDeleteModal, setShowBeforeDeleteModal] = useState(false)
    const [openDownloadModal, setOpenDownloadModal] = useState(false)
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [showOtpSection, setShowOtpSection] = useState(false)
    const [code, setCode] = useState(["", "", "", ""]);
    const [otpCode, setOtpCode] = useState(["", "", "", ""]);
    const [codeError, setCodeError] = useState("")
    const [codeSuccessMsg, setCodeSuccessMsg] = useState("")
    const [isChecked, setIsChecked] = useState(false);
    const [resendOTPSend, setResendOTPSend] = useState(false)
    const [logoutUrl, setLogoutUrl]: any = useState();
    const [timeLeft, setTimeLeft] = useState(60);
    const [showTimer, setShowTiemr] = useState(false);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const [showOtp, setShowOtp] = useState(false)
    const [otpSendData, setOtpSendData] = useState(null)
    const [openTooltip, setOpenTooltip] = useState(false);
    const [openDataPolicy, setOpenDataPolicy] = useState(false);
    const [showPrivacyData, setShowPrivacyData] = useState(false)
    const [accountDataPolicy, setAccountDataPolicy] = useState<{ title: string; description: string } | null>(null);
    console.log(accountDataPolicy, "gh52666fd")

    const { sendData: logoutss, data: logoutData }: any = useUpdate({
        selectMethod: "post",
        url: logoutUrl,
    });

    const handleChange = (index: number, value: string) => {
        if (!/^\d?$/.test(value)) return;

        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);

        // Move to next input if a number is entered
        if (value && index < code.length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handlePhoneNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPhoneNumber(event.target.value);
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !code[index] && index > 0) {
            const newCode = [...code];
            newCode[index - 1] = "";
            setCode(newCode);
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        const pasteData = e.clipboardData.getData("text").slice(0, 4).split("");
        if (pasteData.every((char) => /^\d$/.test(char))) {
            setCode(pasteData);
            inputRefs.current[pasteData.length - 1]?.focus();
        }
        e.preventDefault();
    };

    const handleOtpCodeChange = (index: number, value: string) => {
        if (!/^\d?$/.test(value)) return;

        const newCode = [...otpCode];
        newCode[index] = value;
        setOtpCode(newCode);

        // Move to next input if a number is entered
        if (value && index < code.length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDownOtpCode = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !code[index] && index > 0) {
            const newCode = [...otpCode];
            newCode[index - 1] = "";
            setOtpCode(newCode);
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePasteOtpCode = (e: React.ClipboardEvent<HTMLInputElement>) => {
        const pasteData = e.clipboardData.getData("text").slice(0, 4).split("");
        if (pasteData.every((char) => /^\d$/.test(char))) {
            setOtpCode(pasteData);
            inputRefs.current[pasteData.length - 1]?.focus();
        }
        e.preventDefault();
    };

    const sendOtp = async (key: string) => {
        // return
        try {
            const otpType = key === 'delete' ? 'delete account' : 'data request';
            const response = await _post(send_otp, {
                credential: phoneNumber || acDetailsFormData?.mobile_no,
                otp_type: otpType,
                type: 1,
            });
            setResendOTPSend(false);
            console.log(response.data, "ds5rftg4ds5rf3");
        } catch (error) {
            _ERROR(error?.response?.data?.massage)
            console.error('Error fetching login otp: ', error);
        }
    };

    useEffect(() => {
        if (isDeleteOpen) {
            setTimeLeft(60);
        }
    }, [isDeleteOpen]);

    useEffect(() => {
        if (timeLeft === 0) {
            setCodeError("OTP expired. Please try again.");
            setResendOTPSend(true);
            setShowTiemr(false)
            const timeout = setTimeout(() => {
                setCodeError("");
            }, 3000);

            return () => clearTimeout(timeout);
        }

        const timer = timeLeft > 0 && setInterval(() => {
            setTimeLeft((prev) => prev - 1);
            setShowTiemr(true)
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const resendOTP = async (key: string) => {
        // return
        try {

            const otpType = key === 'delete' ? 'delete account' : 'data request';
            const response = await _post(send_otp, {
                credential: acDetailsFormData?.mobile_no,
                otp_type: otpType,
                type: 1,
            });
            setTimeLeft(60);
            setResendOTPSend(false);
            setShowTiemr(true)
            setCodeError("")
            setOtpCode(["", "", "", ""]);
            console.log(response.data);

        } catch (error) {
            _ERROR(error?.response?.data?.massage)
            console.error('Error fetching data: ', error);
        }
    };

    const handleDeleteAccountBefore = async () => {
        if (code.some((digit: string) => digit === "") || code.length !== 4) {
            // return setCodeError("Please enter a 4-digit OTP!");
            setCodeError("Please enter a 4-digit OTP!");
            setTimeout(() => {
                setCodeError("");
            }, 3000);
            return;
        }

        const codeString = code.join('');
        setCodeError(""); // Reset error before API call

        try {
            // Delete Account
            const del_res = await _put(delete_account, {
                phone_number: otpSendData?.phone,
                OTP: codeString
            });
            if (del_res?.status) {
                _SUCCESS(del_res?.data?.massage);
                onClose();
                setCode(["", "", "", ""]);
                setResendOTPSend(false);
                setLogoutUrl(logout);
                localStorage.clear()
                router.push("/");
            } else {
                _ERROR(del_res?.data?.massage || "Failed to delete account");
            }
        } catch (error: any) {
            _ERROR(error?.response?.data?.massage || "Something went wrong");
        }
    };

    const handleDeleteAccount = async () => {
        if (code.some((digit: string) => digit === "") || code.length !== 4) {
            // return setCodeError("Please enter a 4-digit OTP!");
            setCodeError("Please enter a 4-digit OTP!");
            setTimeout(() => {
                setCodeError("");
            }, 3000);
            return
        }

        const codeString = code.join('');
        setCodeError(""); // Reset error before API call

        try {
            // Verify OTP
            // const res = await _post(account_verify_otp, {
            //     otp: codeString,
            //     credential: acDetailsFormData?.mobile_no,
            // });

            // if (res?.status) {
            //     console.log(res?.data?.massage, "6fg5h6gf")
            // Delete Account
            const del_res = await _put(delete_account, {
                phone_number: acDetailsFormData?.mobile_no,
                OTP: codeString
            });
            if (del_res?.status) {
                _SUCCESS(del_res?.data?.massage);
                onClose();
                setCode(["", "", "", ""]);
                setResendOTPSend(false);
                setLogoutUrl(logout);
                localStorage.clear()
                router.push("/");
            } else {
                _ERROR(del_res?.data?.massage || "Failed to delete account");
            }
            // } else {
            //     setCodeError(res?.data?.massage || "OTP verification failed");
            // }
        } catch (error: any) {
            _ERROR(error?.response?.data?.massage || "Something went wrong");
        }
    };


    const togglePasswordVisibility = () => {
        setPasswordVisible((prevState) => !prevState);
    };

    const toggleCNFPasswordVisibility = () => {
        setPasswordCNFVisible((prevState) => !prevState);
    };

    const {
        sendData: changeAc,
        serverData: changeAcData,
        error: chanageAcError,
    }: any = useUpdate({
        selectMethod: "post",
        url: change_account_details_url,
        callData: acDetailsFormData,
    });

    const {
        sendData: changeChangePass,
        serverData: changeChangePassData,
        error: passwError,
    }: any = useUpdate({
        selectMethod: "post",
        url: change_password_url,
        callData: { new_password: changePassFormData?.new_password },
    });

    const handleAcDetailsChange = (e: any) => {
        const name = e.target.name;
        const value = e.target.value;

        setAcDetailsFormData((pre: any) => ({
            ...pre,
            [name]: value,
        }));

        setAcDetailsFormDataError((pre: any) => ({
            ...pre,
            [name]: "",
        }));
    };

    const handleChangePassChange = (e: any) => {
        const name = e.target.name;
        const value = e.target.value;

        setChangePassFormData((pre: any) => ({
            ...pre,
            [name]: value,
        }));

        if (name === "new_password" && !strongPasswordRegax(value)) {
            setChange_password_error1(
                "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one digit, and one special character."
            );
        } else if (name === "new_password" && strongPasswordRegax(value)) {
            setChange_password_error1();
        }

        if (
            name === "confirm_new_password" &&
            changePassFormData?.new_password !== "" &&
            changePassFormData?.new_password &&
            changePassFormData?.new_password !== value
        ) {
            setChange_password_error("Confirm password is not matched");
        } else if (changePassFormData?.new_password === value) {
            setChange_password_error();
        }
    };


    const SavedAc = () => {
        let valid: boolean = true;

        if (acDetailsFormData?.first_name === "") {
            valid = false;
            setAcDetailsFormDataError((pre: any) => ({
                ...pre,
                first_name: "This field is requered*",
            }));
        }

        if (acDetailsFormData?.last_name === "") {
            valid = false;
            setAcDetailsFormDataError((pre: any) => ({
                ...pre,
                last_name: "This field is requered*",
            }));
        }

        if (acDetailsFormData?.display_name === "") {
            valid = false;
            setAcDetailsFormDataError((pre: any) => ({
                ...pre,
                display_name: "This field is requered*",
            }));
        }

        if (acDetailsFormData?.email === "") {
            valid = false;
            setAcDetailsFormDataError((pre: any) => ({
                ...pre,
                email: "This field is requered*",
            }));
        }

        if (acDetailsFormData?.mobile_no == "") {
            valid = false;
            setAcDetailsFormDataError((pre: any) => ({
                ...pre,
                mobile_no: "This field is requered*",
            }));
        } else if (!/^\d{10}$/.test(acDetailsFormData?.mobile_no)) {
            valid = false;
            setAcDetailsFormDataError((pre: any) => ({
                ...pre,
                mobile_no: "Invalid mobile phone number",
            }));
        }

        if (change_password_errpr) {
            valid = false;
        }

        if (
            changePassFormData?.new_password !== "" &&
            changePassFormData?.new_password &&
            changePassFormData?.new_password !==
            changePassFormData?.confirm_new_password
        ) {
            valid = false;
            setChange_password_error("Confirm password is not matched");
        }

        if (
            changePassFormData?.new_password !== "" &&
            !strongPasswordRegax(changePassFormData?.new_password)
        ) {
            valid = false;
            setChange_password_error1(
                "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one digit, and one special character."
            );
        }

        if (valid) {
            setChange_account_details_url(change_account_details);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setProfileImage("")
    };

    const onClose = () => {
        setIsDeleteOpen(false)
        setCode(["", "", "", ""]);
        setCodeError("")
    }

    const handleOnClosebeforeModal = () => {
        setShowBeforeDeleteModal(false)
        setPhoneNumber("")
        setShowOtp(false)
        setCode(["", "", "", ""]);
        setCodeError("")
        setIsChecked(false)
    }

    const handleImageUpload = async (e: any) => {
        const file = e.target.files[0];
        if (!file) return;

        const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            setProfileImage("");
            _ERROR('Please upload a JPG, JPEG, PNG or WEBP image.');
            return;
        }

        // const maxSize = 1 * 1024 * 1024;
        // if (file.size > maxSize) {
        //     setProfileImage("");
        //     _WARNING('The image file should be less than 1MB.');
        //     return;
        // }

        setIsModalOpen(true)
        const fileUrl = URL.createObjectURL(file);
        setImageUrl(fileUrl);
        const img = new Image();
        const reader = new FileReader();

        reader.onload = () => {
            img.onload = () => {
                if (img.width <= img.height) {
                    setProfileImage("");
                    return;
                }
            };
        };

        reader.onloadend = () => {
            setProfileImage(reader.result as string);
        }
        reader.readAsDataURL(file);
    };

    const onCropComplete = (croppedArea: any, croppedAreaPixels: any) => {
        if (!croppedAreaPixels) {
            console.error('Cropped area pixels are invalid!');
        } else {
            setCroppedAreaPixels(croppedAreaPixels);
        }
    };

    const generateBase64FromCroppedImage = (): Promise<string | null> => {
        return new Promise((resolve, reject) => {
            if (profileImage && croppedAreaPixels) {
                const imageObj = new Image();
                imageObj.src = profileImage; // Set the image source to the file

                imageObj.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');

                    if (ctx) {
                        // Set canvas dimensions based on the cropped area
                        canvas.width = croppedAreaPixels.width;
                        canvas.height = croppedAreaPixels.height;

                        // Draw the cropped image onto the canvas
                        ctx.drawImage(
                            imageObj,
                            croppedAreaPixels.x,
                            croppedAreaPixels.y,
                            croppedAreaPixels.width,
                            croppedAreaPixels.height,
                            0,
                            0,
                            croppedAreaPixels.width,
                            croppedAreaPixels.height
                        );

                        // Convert the canvas to a base64 string
                        const base64String = canvas && canvas.toDataURL('image/jpeg');
                        setBase64Image(base64String);
                        resolve(base64String)
                    } else {
                        reject('Canvas context is not available');
                    }
                };

                imageObj.onerror = (err) => {
                    reject('Error loading image: ' + err);
                };
            } else {
                reject('No image file or cropped area available');
            }
        });
    };

    const handleSubmitNotification = async (): Promise<void> => {
        try {
            if (profileImage) {
                const base64String = await generateBase64FromCroppedImage();
                if (base64String) {
                    const rawBase64String = base64String.replace(/^data:image\/[a-z]+;base64,/, "");

                    const formData = new FormData();
                    formData.append("image", rawBase64String);
                    await uploadProfileImage(formData);
                }
            }
        } catch (error: any) {
            console.log("Error: Notification send error \n", error.message);
        }
    };

    const uploadProfileImage = async (payload: any): Promise<void> => {
        try {
            const res = await _post(upload_profile_picture, payload);
            _SUCCESS(res?.data?.massage || "Profile picture uploaded successfully.");
            console.log(res, res?.data, "df54h653");
            setProfileImage(res?.data?.data?.profilePictureUrl)
            setIsModalOpen(false)
        } catch (error: any) {
            throw new Error(error.message);
        }
    };


    const SavedChangePass = () => {
        if (
            changePassFormData?.new_password !== "" &&
            !strongPasswordRegax(changePassFormData?.new_password)
        ) {
            setChange_password_error1(
                "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one digit, and one special character."
            );
        }

        // if (
        //     (changePassFormData?.new_password !== "" &&
        //         changePassFormData?.confirm_new_password !== "") ||
        //     (changePassFormData?.new_password &&
        //         changePassFormData?.new_password ===
        //         changePassFormData?.confirm_new_password)
        // ) {
        //     if (changePassFormData?.new_password !== "" &&
        //         strongPasswordRegax(changePassFormData?.new_password)) {
        //         // alert("alert")
        //         setChange_password_url(change_password);
        //     }

        // }

        if (changePassFormData?.new_password !== changePassFormData?.confirm_new_password) {
            setChange_password_error("Confirm password does not match.");
            return;
        }

        if (strongPasswordRegax(changePassFormData?.new_password)) {
            setChange_password_url(change_password);
            setChange_password_error1("");
            setChange_password_error("")
        }

        // if (
        //     changePassFormData?.new_password !== "" &&
        //     changePassFormData?.new_password &&
        //     changePassFormData?.new_password !==
        //     changePassFormData?.confirm_new_password
        // ) {
        //     setChange_password_error("Confirm password is not matched");
        // }
    };

    useEffect(() => {
        if (logoutData?.success) {
            dispatch(setCart([]));
            dispatch(setCoupon({}));
            dispatch(setMe({}));
            dispatch(setCartCount(""));
            // _SUCCESS(logoutData?.massage);
            router.push("/");
        }
    }, [logoutData]);


    useEffect(() => {
        if (logedData && logedData?.role && logedData?.role?.label !== "guest") {
            setAcDetailsFormData((pre: any) => ({
                ...pre,
                first_name: logedData?.first_name,
                last_name: logedData?.last_name,
                display_name:
                    logedData?.display_name != null
                        ? logedData?.display_name
                        : logedData?.username,
                email: logedData?.email,
                mobile_no: logedData?.phone_no,
            }));
            setProfileImage(logedData?.avatar_url)
            setShowLogout(true);
        }
    }, [logedData]);

    useEffect(() => {
        if (change_account_details_url) {
            setChange_account_details_url();
        }
        if (change_password_url) {
            setChange_password_url();
        }
    }, [change_account_details_url, change_password_url]);

    useEffect(() => {
        if (changeAcData?.success) {
            _SUCCESS(`${changeAcData?.message}`);
        }

        if (
            chanageAcError &&
            chanageAcError?.response &&
            chanageAcError?.response?.data &&
            chanageAcError?.response?.data?.success == false
        ) {
            _ERROR(`${chanageAcError?.response?.data?.massage}`);
        }
    }, [changeAc, changeAcData, chanageAcError]);

    useEffect(() => {
        if (changeChangePassData?.success) {
            setChangePassFormData(initialChangePasswordFormData);
            // _SUCCESS(`${changeChangePassData?.message}`)
        }

        if (
            passwError &&
            passwError?.response &&
            passwError?.response?.data &&
            passwError?.response?.data?.success == false
        ) {
            _ERROR(`${passwError?.response?.data?.massage}`);
        }
    }, [changeChangePass, changeChangePassData, passwError]);

    const getPageMeta = async () => {
        try {
            const res = await _get(get_page_meta_account_policy);
            const metaDataString = res?.data?.data;

            if (metaDataString) {
                // const metaData = JSON.parse(metaDataString);
                setAccountDataPolicy({
                    title: metaDataString.title,
                    description: metaDataString.description,
                });
                // console.log(res?.data, metaData, "ParsedMetaData");
            } else {
                console.log("Meta data is missing");
            }
        } catch (error) {
            console.error("Error fetching meta data:", error);
        }
    };

    const emailValidation = (): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email) {
            setEmailError("Please enter your email!");
            setTimeout(() => setEmailError(""), 3000);
            return false;
        }

        if (!emailRegex.test(email)) {
            setEmailError("Please enter a valid email!");
            setTimeout(() => setEmailError(""), 3000);
            return false;
        }

        setEmailError("");
        return true;
    };


    const handleVerifyOTP = async () => {
        const codeString = otpCode.join("");

        if (codeString.length !== 4 || otpCode.includes("")) {
            // return setCodeError("Please enter a 4-digit OTP!");
            setCodeError("Please enter a 4-digit OTP!");
            setTimeout(() => {
                setCodeError("");
            }, 3000);
            return
        }
        setCodeError("");
        try {
            const res = await _post(account_verify_otp, {
                OTP: codeString,
                credential: phoneNumber || acDetailsFormData?.mobile_no,
            });

            if (res?.status) {
                console.log(res?.data, "df1g24d1f")
                setCodeSuccessMsg(res?.data?.massage || "OTP varified.")
                DownloadDataRequest()
            } else {
                setCodeError(res?.data?.message || "OTP verification failed");
            }
        } catch (error: any) {
            _ERROR(error?.response?.data?.message || "Something went wrong");
        }
    };

    useEffect(() => {
        const codeString = otpCode.join("");
        if (codeString.length === 4 && !otpCode.includes("")) {
            handleVerifyOTP();
        }
    }, [otpCode]);

    const DownloadDataRequest = async () => {
        try {
            const res = await _post(request_data, { phone_number: phoneNumber, email_id: email })
            if (res && res?.status) {
                _SUCCESS(res?.data?.massage || "Request sent successfully.")
                setTimeout(() => {
                    setPhoneNumber("")
                    setPhoneNumberError("")
                    setEmail("")
                    setEmailError("")
                    setOtpCode(["", "", "", ""]);
                    setOpenDownloadModal(false)
                    setResendOTPSend(false);
                    setShowOtpSection(false)
                    setCodeSuccessMsg("")
                    setShowPrivacyData(false)
                }, 2000)
            } else {
                setEmail("")
                setEmailError("")
                setOtpCode(["", "", "", ""]);
                setOpenDownloadModal(false)
                setResendOTPSend(false);
                setShowOtpSection(false)
                setCodeSuccessMsg("")
                setShowPrivacyData(false)
            }
        } catch (error) {
            toast.error(error?.response?.data?.massage || "Something went wrong!", {
                autoClose: 5000,
            });
            setTimeout(() => {
                setEmail("")
                setEmailError("")
                setOtpCode(["", "", "", ""]);
                setOpenDownloadModal(false)
                setResendOTPSend(false);
                setShowOtpSection(false)
                setCodeSuccessMsg("")
                setShowPrivacyData(false)
            }, 1000)
        }
    }

    const phoneValidation = (): boolean => {
        const phoneRegex = /^\d{10}$/;

        if (!phoneNumber) {
            setPhoneNumberError('Please enter your number!');
            setTimeout(() => setPhoneNumberError(''), 3000);
            return false;
        }

        if (!phoneRegex.test(phoneNumber)) {
            setPhoneNumberError('Please enter a valid phone number!');
            setTimeout(() => setPhoneNumberError(''), 3000);
            return false;
        }

        setPhoneNumberError('');
        return true;
    };

    const handleDownloadData = async () => {
        const isPhoneValid = phoneValidation();
        const isEmailValid = emailValidation();

        if (!showLogout && !isPhoneValid) {
            return;
        }

        if (!isEmailValid) {
            return;
        }
        try {
            const res = await _put(user_find, { credential: phoneNumber })
            if (res?.status && res?.data.data !== null) {
                sendOtp('download')
                setShowTiemr(true)
                setTimeLeft(60)
                setShowOtpSection(true)
            } else {
                setPhoneNumberError("User not found, please enter valid phone number.!")
                setTimeout(() => {
                    setPhoneNumberError("");
                }, 3000);
            }
        } catch (error) {
            console.log(error)
        }

    }




    const handleSendOtp = async () => {
        const isValid = phoneValidation();
        if (!isValid) {
            return;
        }

        try {
            const res = await _put(user_find, { credential: phoneNumber })
            if (res?.data?.data !== null) {
                const response = await _post(send_otp, {
                    credential: phoneNumber,
                    otp_type: 'delete account',
                    type: 1,
                });
                if (response?.status) {
                    // setResendOTPSend(false);
                    setShowOtp(true)
                    setShowBeforeDeleteModal(true)
                    setOtpSendData(response?.data?.data)
                    setTimeLeft(60)
                } else {
                    setShowOtp(false)
                    setShowBeforeDeleteModal(false)
                    setOtpSendData(null)
                }
                console.log(res, res?.data, "6gf5h6f")
            } else {
                setPhoneNumberError("User not found, please enter valid phone number.!")
                setTimeout(() => {
                    setPhoneNumberError("");
                }, 3000);
            }
        } catch (error) {
            console.log(error, "6gf5h6f")
        }
    };

    const handleCancel = () => {
        setShowOtp(false)
        setOtpSendData(null)
        setPhoneNumber("")
        setPhoneNumberError("")
        console.log('Cancelled');
    };

    useEffect(() => {
        getPageMeta()
    }, [])
    return (
        <div className="container">
            <div className="my-account mt-3">
                <div className="tm-w-full w-100 d-flex justify-content-between ">
                    <h3 style={{ paddingRight: "9px" }} className="w-fit sp-title accountHeader">Account Details</h3>
                    <button className="show-btn1 mb-3 h-fit"
                        onClick={() => router.push('/myaccount')}
                    >
                        <i className="fa-solid fa-arrow-left-long" style={{ paddingLeft: "8px", padding: "4px" }}></i>
                        <span style={{ paddingRight: "9px" }}>back</span>
                    </button>
                </div>

                <div
                    className={`tab-pane fade ${otherView === "accountdetails" ? "show active" : ""
                        }`}
                    id="v-pills-settings3"
                    role="tabpanel"
                    aria-labelledby="v-pills-settings-tab3"
                >
                    {logedData?.role?.label === "guest" ? (
                        <div className="short_note mb-3 p-3 flex ga-4">
                            Currently, you are a guest. Please fill in your account
                            details to create your account.
                        </div>
                    ) : null}
                    <div className="acc-card1 mt-3 mb-4">
                        <div className="card-body">
                            <Dialog open={!showLogout ? showBeforeDeleteModal : isDeleteOpen} onClose={!showLogout ? handleOnClosebeforeModal : onClose} className="flex justify-center items-center"


                            >
                                <DialogTitle className="text-center flex flex-col items-center">
                                    <div className="bg-slate-100 p-3 rounded-full">
                                        {!showOtp && !isDeleteOpen ? <VerifiedIcon className="text-green-600 text-3xl" />
                                            : <DeleteIcon className="text-red-600 text-3xl" />}
                                    </div>
                                    <p className="mt-2 text-lg font-semibold text-gray-800">
                                        {(!showOtp && !isDeleteOpen) ? "OTP Verification" : "Delete Account"}
                                    </p>
                                </DialogTitle>

                                <DialogContent className="flex flex-col items-center gap-4 p-6">
                                    {(!showOtp && !isDeleteOpen) ? (
                                        <>
                                            <p className="text-gray-600 text-sm text-center">
                                                Please enter your registered phone number to receive a{" "}
                                                <b className="text-pink-500 capitalize">one-time password (OTP)</b> for verification.
                                            </p>
                                            <div className="flex flex-col items-center justify-center w-full">
                                                <TextField
                                                    type="number"
                                                    fullWidth
                                                    variant="outlined"
                                                    placeholder="Enter your phone number"
                                                    value={phoneNumber}
                                                    onChange={handlePhoneNumberChange}
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <PhoneIcon sx={{ color: '#e4509d' }} />
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                    sx={{ width: "400px", maxWidth: "350px" }}
                                                />
                                                {phoneNumberError && (
                                                    <p
                                                        className="text-red-600 text-xs font-semibold text-center w-full"
                                                    >{phoneNumberError}</p>
                                                )}
                                            </div>

                                            <div className="mt-4 flex items-center justify-center gap-4">
                                                <Button
                                                    variant="outlined"
                                                    onClick={() => handleSendOtp()}
                                                    sx={{
                                                        // width: "100%",
                                                        maxWidth: "140px",
                                                        backgroundColor: "#FFF3E0",
                                                        border: "1px solid #FF9800",
                                                        color: "#FF9800",
                                                        padding: "0.5rem 1rem",
                                                        borderRadius: "10px",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: "5px",
                                                        fontWeight: "600",
                                                        transition: "transform 0.2s ease-in-out, background-color 0.2s ease-in-out, border-color 0.2s ease-in-out",
                                                        "&:hover": {
                                                            backgroundColor: "#FFF3E0",
                                                            borderColor: "#FF9800",
                                                            color: "#FF9800",
                                                        },
                                                    }}
                                                >
                                                    Send OTP
                                                </Button>

                                                <Button
                                                    onClick={() => { setIsDeleteOpen(false), handleCancel(), handleOnClosebeforeModal() }}
                                                    variant="outlined"
                                                    sx={{
                                                        backgroundColor: "#FDEBF1",
                                                        border: "1px solid #e91e63",
                                                        color: "#e91e63",
                                                        padding: "0.5rem 1rem",
                                                        borderRadius: "10px",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: "5px",
                                                        fontWeight: "600",
                                                        transition: "transform 0.2s ease-in-out",
                                                        "&:hover": {
                                                            backgroundColor: "#FDEBF1",
                                                            border: "1px solid #e91e63",
                                                        },
                                                    }}
                                                    startIcon={<CloseIcon />}
                                                >
                                                    Cancel
                                                </Button>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <p className="text-gray-600 text-sm text-center">
                                                Are you sure you want to delete the account linked to{" "}
                                                <b>pinkpaws.altisinfonet.in</b>?
                                            </p>

                                            <div className="flex gap-1 text-sm">
                                                <p className="font-semibold">Enter OTP sent on :</p>
                                                <span className="text-pink-500 font-semibold">+91 {otpSendData?.phone || acDetailsFormData?.mobile_no}</span>
                                            </div>

                                            <div>
                                                <div className="flex gap-3">
                                                    {code &&
                                                        code.map((digit: any, index: number) => (
                                                            <input
                                                                key={index}
                                                                type="text"
                                                                maxLength={1}
                                                                value={digit}
                                                                ref={(el) => {
                                                                    inputRefs.current[index] = el;
                                                                }}
                                                                onChange={(e) => handleChange(index, e.target.value)}
                                                                onKeyDown={(e) => handleKeyDown(index, e)}
                                                                onPaste={handlePaste}
                                                                className="w-10 h-10 text-xl text-center border border-gray-300 rounded-md focus:border-red-500 focus:outline-none"
                                                                style={{ appearance: "textfield" }}
                                                            />
                                                        ))}
                                                </div>
                                                {codeError && (
                                                    <p className="text-red-600 text-sm font-semibold mx-2 mt-1">{codeError}</p>
                                                )}

                                                {showTimer && (
                                                    <div className="flex item-center justify-center mt-2">
                                                        <p className="text-sm text-red-500 border font-bold p-1 px-3 rounded shadow-md">
                                                            <AccessTimeIcon
                                                                className="mx-1"
                                                                style={{ fontSize: "18px", fontWeight: "bold" }}
                                                            />
                                                            {formatTime(timeLeft)}
                                                        </p>
                                                    </div>
                                                )}
                                                {!showTimer && (
                                                    <div
                                                        className="cursor-pointer flex justify-center mt-2"
                                                        onClick={() => resendOTP("delete")}
                                                    >
                                                        <p className="text-md font-semibold underline text-gray-500">Resend OTP</p>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Checkbox */}
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    checked={isChecked}
                                                    onChange={() => setIsChecked(!isChecked)}
                                                    className="w-5 h-5 cursor-pointer"
                                                />
                                                <span className="text-sm text-gray-700">
                                                    I understand that I won’t be able to recover my account.
                                                </span>
                                            </div>
                                        </>
                                    )}

                                </DialogContent>

                                {(showOtp || isDeleteOpen) &&
                                    (<DialogActions className="flex justify-center gap-4 pb-5">
                                        <Button
                                            disabled={!isChecked}
                                            variant="outlined"
                                            startIcon={<DeleteIcon />}
                                            onClick={() => { !showLogout ? handleDeleteAccountBefore() : handleDeleteAccount() }}
                                            sx={{
                                                backgroundColor: "#FFF3E0",
                                                border: "1px solid #FF9800",
                                                color: "#FF9800",
                                                padding: "0.5rem 1rem",
                                                borderRadius: "10px",
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "5px",
                                                fontWeight: "600",
                                                transition: "transform 0.2s ease-in-out, background-color 0.2s ease-in-out, border-color 0.2s ease-in-out",
                                                "&:hover": {
                                                    backgroundColor: "#FFF3E0",
                                                    borderColor: "#FF9800",
                                                    color: "#FF9800",
                                                },
                                            }}
                                            onMouseEnter={(e: any) => {
                                                const target = e.target as HTMLElement;
                                                target.style.transform = "scale(1.03)";
                                            }}
                                            onMouseLeave={(e) => {
                                                const target = e.target as HTMLElement;
                                                target.style.transform = "scale(1)";
                                            }}
                                        >
                                            Delete
                                        </Button>
                                        <Button
                                            onClick={() => { !showLogout ? handleOnClosebeforeModal() : onClose() }}
                                            variant="outlined"
                                            sx={{
                                                backgroundColor: "#FDEBF1",
                                                border: "1px solid #e91e63",
                                                color: "#e91e63",
                                                padding: "0.5rem 1rem",
                                                borderRadius: "10px",
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "5px",
                                                fontWeight: "600",
                                                transition: "transform 0.2s ease-in-out",
                                                "&:hover": {
                                                    backgroundColor: "#FDEBF1",
                                                    border: "1px solid #e91e63",
                                                },
                                            }}
                                            startIcon={<CloseIcon />}
                                        >
                                            Cancel
                                        </Button>
                                    </DialogActions>)
                                }
                            </Dialog>

                            <Dialog open={openDownloadModal} onClose={() => { setOpenDownloadModal(false) }} className="flex justify-center items-center">
                                <DialogTitle className="text-center flex flex-col items-center">
                                    <div className="bg-red-200 p-3 rounded-full" style={{ backgroundColor: "#DBEAFE" }}>
                                        <UploadFileIcon className="text-blue-600 text-3xl" />
                                    </div>
                                    <p className="mt-2 text-lg font-semibold text-blue-600">
                                        Request Download Data
                                    </p>
                                </DialogTitle>

                                <DialogContent className="flex flex-col items-center gap-4 px-3">
                                    <p className="text-gray-600 text-sm text-center">
                                        {showOtpSection ? (
                                            <>
                                                We have sent a one-time password <b style={{ color: "#e4509d" }}>(OTP)</b> to your registered <b style={{ color: "#e4509d", fontWeight: "500" }}>mobile number</b>.
                                                Please enter the <b style={{ color: "#e4509d" }}>OTP</b> below to verify your identity and proceed.
                                            </>
                                        ) : (
                                            <>
                                                We will send your <b style={{ color: "#e4509d", fontWeight: "500" }}>requested data file</b> to the <b style={{ color: "#e4509d", fontWeight: "500" }}>email address</b> you provide.
                                                Please enter your <b style={{ color: "#e4509d", fontWeight: "500" }}>email</b> below, and we will promptly send the <b style={{ color: "#e4509d", fontWeight: "500" }}>file</b> to you.
                                            </>
                                        )}
                                    </p>

                                    {showOtpSection && (phoneNumber || acDetailsFormData?.mobile_no) && <div className='flex gap-1 justify-center mb-1 text-xs'>
                                        <p className='font-semibold'>Enter OTP sent on :</p>
                                        <span className='text-pink-500 font-semibold'>+91 {phoneNumber || acDetailsFormData?.mobile_no}</span>
                                    </div>}

                                    {!showOtpSection &&
                                        <>
                                            <div className='flex flex-col items-center justify-center w-full'>
                                                <TextField
                                                    type="number"
                                                    fullWidth
                                                    variant="outlined"
                                                    placeholder="Enter your phone number"
                                                    value={phoneNumber}
                                                    onChange={handlePhoneNumberChange}
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <PhoneIcon color='disabled' />
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                />
                                                {phoneNumberError && (
                                                    <p
                                                        className="text-red-600 text-xs font-semibold text-center w-full"
                                                    >{phoneNumberError}</p>
                                                )}
                                            </div>

                                            <div className='flex flex-col items-center justify-center w-full'>
                                                <TextField
                                                    className='mt-0'
                                                    fullWidth
                                                    variant="outlined"
                                                    placeholder="Enter your email"
                                                    value={email}
                                                    onChange={(e: any) => setEmail(e.target.value)}
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <EmailIcon color="disabled" />
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                />
                                                {emailError && (
                                                    <p
                                                        className="text-red-600 text-xs font-semibold text-center w-full">{emailError}</p>
                                                )}
                                            </div>
                                        </>
                                    }

                                    {showOtpSection &&
                                        <>
                                            <div>
                                                <div className="flex items-center justify-center gap-3">
                                                    {otpCode && otpCode?.map((digit: any, index: number) => (
                                                        <input
                                                            key={index}
                                                            type="text"
                                                            maxLength={1}
                                                            value={digit}
                                                            ref={(el) => { inputRefs.current[index] = el; }}
                                                            onChange={(e) => handleOtpCodeChange(index, e.target.value)}
                                                            onKeyDown={(e) => handleKeyDownOtpCode(index, e)}
                                                            onPaste={handlePasteOtpCode}
                                                            className="w-10 h-10 text-xl text-center border border-gray-300 rounded-md focus:border-red-500 focus:outline-none"
                                                            style={{ appearance: "textfield" }}
                                                        />
                                                    ))}
                                                </div>
                                                {codeError && (
                                                    <p className="text-red-600 text-sm text-center font-semibold mx-2 mt-1">{codeError}</p>
                                                )}

                                                {codeSuccessMsg && (
                                                    <p className="text-green-600 text-sm text-center font-semibold mx-2 mt-1">{codeSuccessMsg}</p>
                                                )}

                                                {showTimer && !codeSuccessMsg &&
                                                    <div className="flex item-center justify-center mt-2">
                                                        <p className="text-sm text-red-500 border font-bold p-1 px-3 rounded shadow-md">
                                                            <AccessTimeIcon className='mx-1' style={{ fontSize: "18px", fontWeight: "bold" }} />
                                                            {formatTime(timeLeft)}
                                                        </p>
                                                    </div>}
                                                {!showTimer && !codeSuccessMsg &&
                                                    (<div className="cursor-pointer flex justify-center mt-2"
                                                        onClick={() => resendOTP("download")}
                                                    >
                                                        <p className='text-md font-semibold underline text-gray-500'>Resend OTP</p>
                                                    </div>)}
                                            </div>
                                        </>
                                    }
                                </DialogContent>

                                <div className='flex items-center justify-between gap-3 px-5 py-4'>
                                    {!showOtpSection &&
                                        <Button
                                            // disabled={!isChecked}
                                            variant="outlined"
                                            // startIcon={<DeleteIcon />}
                                            onClick={handleDownloadData}
                                            sx={{
                                                backgroundColor: "#FFF3E0",
                                                border: "1px solid #FF9800",
                                                color: "#FF9800",
                                                padding: "0.5rem 1rem",
                                                borderRadius: "10px",
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "5px",
                                                fontWeight: "600",
                                                transition: "transform 0.2s ease-in-out, background-color 0.2s ease-in-out, border-color 0.2s ease-in-out",
                                                "&:hover": {
                                                    backgroundColor: "#FFF3E0",
                                                    borderColor: "#FF9800",
                                                    color: "#FF9800",
                                                },
                                            }}
                                        >
                                            Submit
                                        </Button>
                                    }
                                    <Button
                                        onClick={() => { setPhoneNumber(""), setPhoneNumberError(""), setCodeSuccessMsg(""), setOtpCode(['', '', '', '']), setShowOtpSection(false), setOpenDownloadModal(false), setEmail(""), setEmailError("") }}
                                        variant="outlined"
                                        sx={{
                                            backgroundColor: "#FDEBF1",
                                            border: "1px solid #e91e63",
                                            color: "#e91e63",
                                            padding: "0.5rem 1rem",
                                            borderRadius: "10px",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "5px",
                                            fontWeight: "600",
                                            transition: "transform 0.2s ease-in-out",
                                            "&:hover": {
                                                backgroundColor: "#FDEBF1",
                                                border: "1px solid #e91e63",
                                            },
                                            width: showOtpSection ? '60%' : 'auto',
                                            margin: showOtpSection ? '0 auto' : 'initial',
                                        }}
                                        startIcon={<CloseIcon />}
                                    >
                                        Cancel
                                    </Button>
                                </div>


                            </Dialog>


                            <div className="bg-gray-100 p-6 rounded-lg shadow-md max-w-2xl mx-auto">
                           
                                <h2 className="account-title">{accountDataPolicy?.title}</h2>
                                <div
                                    className="account-data-policy"
                                    dangerouslySetInnerHTML={{ __html: accountDataPolicy?.description }}
                                />


                                <hr className='mt-3' />

                                <div className='flex flex-wrap items-center justify-center gap-4 mt-3'>
                                    <Button startIcon={<DeleteIcon />} onClick={() => {
                                        if (!showLogout) {
                                            setShowBeforeDeleteModal(true)
                                        } else {
                                            setIsDeleteOpen(true),
                                                sendOtp('delete')
                                        }
                                    }}
                                        sx={{
                                            backgroundColor: "#FFF3E0",
                                            color: "#FF9800",
                                            fontWeight: "600",
                                            padding: "8px 16px",
                                            textTransform: "none",
                                            border: "2px solid #FF9800",
                                            borderRadius: "8px",
                                            "&:hover": {
                                                backgroundColor: "#FFF3E0",
                                            },
                                        }}
                                    >Delete Account</Button>
                                    <Button startIcon={<DownloadIcon />}
                                        sx={{
                                            border: "2px solid #e4509d",
                                            color: "#e4509d",
                                            fontWeight: "700",
                                            padding: "8px 16px",
                                            textTransform: "none",
                                            borderRadius: "8px",
                                            backgroundColor: "transparent",
                                            "&:hover": {
                                                backgroundColor: "#fdebf1",
                                            },
                                        }}
                                        onClick={() => setOpenDownloadModal(!openDownloadModal)}
                                    >Download Data</Button>
                                </div>
                            </div>

                            {/* Download Data Modal */}


                        </div>
                    </div>
                </div>
                {/* } */}
            </div>
        </div >
    )
}

export default LogOutDetailsPage