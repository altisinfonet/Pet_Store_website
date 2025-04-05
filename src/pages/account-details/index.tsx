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
import { setCart } from '../../reducer/getCartReducer';
import { setCoupon } from '../../reducer/couponReducer';
import { setMe } from '../../reducer/me';
import { setCartCount } from '../../reducer/cartCountReducer';
import { useDispatch } from 'react-redux';
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
const AccountDetails = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const { logedData } = useIsLogedin();
    const { send_otp, account_verify_otp, delete_account, request_data, logout } = getUrlWithKey("auth_apis")
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

    const [isDeleteOpen, setIsDeleteOpen] = useState(false)
    const [openDownloadModal, setOpenDownloadModal] = useState(false)
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [showOtpSection, setShowOtpSection] = useState(false)
    const [code, setCode] = useState(["", "", "", ""]);
    const [otpCode, setOtpCode] = useState(["", "", "", ""]);
    const [logoutUrl, setLogoutUrl]: any = useState();
    const [codeError, setCodeError] = useState("")
    const [codeSuccessMsg, setCodeSuccessMsg] = useState("")
    const [isChecked, setIsChecked] = useState(false);
    const [resendOTPSend, setResendOTPSend] = useState(false)
    const [timeLeft, setTimeLeft] = useState(60);
    const [showTimer, setShowTiemr] = useState(false);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const [openTooltip, setOpenTooltip] = useState(false);
    const [openDataPolicy, setOpenDataPolicy] = useState(false);
    const [showPrivacyData, setShowPrivacyData] = useState(false)
    const [accountDataPolicy, setAccountDataPolicy] = useState<{ title: string; description: string } | null>(null);
    console.log(showLogout,)

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
                credential: acDetailsFormData?.mobile_no,
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
            setCode(["", "", "", ""]);
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
            console.log(response.data);

        } catch (error) {
            _ERROR(error?.response?.data?.massage)
            console.error('Error fetching data: ', error);
        }
    };

    const handleDeleteAccount = async () => {
        if (code.some((digit: string) => digit === "") || code.length !== 4) {
            return setCodeError("Please enter a 4-digit OTP!");
        }

        const codeString = code.join('');
        setCodeError(""); // Reset error before API call
        // return
        try {
            // Verify OTP
            // const res = await _post(account_verify_otp, {
            //     otp: codeString,
            //     credential: acDetailsFormData?.mobile_no,
            // });

            // if (res?.status) {

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
        setIsChecked(false)
        setIsDeleteOpen(false)
        setCode(["", "", "", ""]);
        setCodeError("")
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
            console?.log(metaDataString, "654fd6g4fsd65")
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
            return setCodeError("Please enter a 4-digit OTP!");
        }
        setCodeError("");
        try {
            const res = await _post(account_verify_otp, {
                otp: codeString,
                credential: acDetailsFormData?.mobile_no,
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
            const res = await _post(request_data, { email_id: email })
            if (res && res?.status) {
                _SUCCESS(res?.data?.massage || "Request sent successfully.")
                setTimeout(() => {
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

    const handleDownloadData = () => {
        const isValid = emailValidation();
        if (!isValid) {
            return;
        }

        sendOtp('download')
        setShowTiemr(true)
        setTimeLeft(60)
        setShowOtpSection(true)
    }

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
                            {/* <div className='dotMain m-0'>
                                                <span className='dot m-0'></span>
                                                <span className='blink m-0'></span>
                                            </div> */}
                            Currently, you are a guest. Please fill in your account
                            details to create your account.
                        </div>
                    ) : null}
                    <div className="acc-card1 mt-3 mb-4">
                        <div className="card-body">

                            {/* Delete Acoount */}
                            <div>

                                <div style={{ position: "relative", display: "flex", justifyContent: "flex-end", cursor: "pointer" }}>
                                    {/* Toggle Icon */}
                                    {!showPrivacyData ?
                                        <div
                                            onClick={() => {
                                                setOpenTooltip(!openTooltip);
                                                setOpenDataPolicy(false); // Reset submenu when reopening
                                            }}
                                            style={{ display: "flex", alignItems: "center" }}
                                        >
                                            {openTooltip ? (
                                                <CloseIcon
                                                    style={{
                                                        color: "#e4509d",
                                                        backgroundColor: "#FDEBF1",
                                                        borderRadius: "10px",
                                                        transition: "transform 0.3s ease",
                                                    }}
                                                />
                                            ) : (
                                                <MoreVertIcon
                                                    style={{
                                                        color: "#e4509d",
                                                        backgroundColor: "#FDEBF1",
                                                        borderRadius: "10px",
                                                        transition: "transform 0.3s ease",
                                                    }}
                                                />
                                            )}
                                        </div>
                                        :
                                        <div
                                            onClick={() =>
                                                setShowPrivacyData(false)
                                            }
                                            style={{ display: "flex", alignItems: "center" }}
                                        >
                                            <Tooltip title="Back">
                                                <ArrowBackIcon
                                                    style={{
                                                        color: "#e4509d",
                                                        backgroundColor: "#FDEBF1",
                                                        borderRadius: "10px",
                                                        transition: "transform 0.3s ease",
                                                        marginBottom: "4px"
                                                    }}
                                                />
                                            </Tooltip>

                                        </div>
                                    }

                                    {/* Dropdown Menu */}
                                    <div
                                        style={{
                                            position: "absolute",
                                            right: "30px",
                                            marginTop: "8px",
                                            width: "250px",
                                            backgroundColor: "white",
                                            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                                            borderRadius: "8px",
                                            padding: "8px 0",
                                            transition: "opacity 0.3s ease, transform 0.3s ease",
                                            opacity: openTooltip ? "1" : "0",
                                            transform: openTooltip ? "scale(1)" : "scale(0.95)",
                                            pointerEvents: openTooltip ? "auto" : "none",
                                            zIndex: "1000"
                                        }}
                                    >
                                        {/* Privacy & Data Menu */}
                                        <div
                                            onClick={() => setOpenDataPolicy(!openDataPolicy)}
                                            style={{
                                                padding: "8px 16px",
                                                fontWeight: "600",
                                                color: "#444",
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                                cursor: "pointer",
                                                borderRadius: "5px",
                                                backgroundColor: openDataPolicy ? "#f3f4f6" : "transparent",
                                                transition: "background-color 0.2s ease",
                                            }}
                                        >
                                            <span>Privacy & Data</span>
                                        </div>

                                        {/* Submenu - Account Data Policy */}
                                        <div
                                            onClick={() => {
                                                setOpenDataPolicy(false);
                                                setOpenTooltip(false);
                                                setShowPrivacyData(true)
                                            }}
                                            style={{
                                                padding: "6px 20px",
                                                fontSize: "14px",
                                                color: "#666",
                                                backgroundColor: "#f8f9fa",
                                                borderRadius: "5px",
                                                marginTop: "4px",
                                                cursor: "pointer",
                                                transition: "opacity 0.3s ease, max-height 0.3s ease",
                                                opacity: openDataPolicy ? "1" : "0",
                                                maxHeight: openDataPolicy ? "40px" : "0",
                                                overflow: "hidden",
                                                fontWeight: "600"
                                            }}
                                        >
                                            <ArrowRightIcon />Account Data Policy
                                        </div>
                                    </div>
                                </div>


                                <Dialog open={isDeleteOpen} onClose={onClose} className="flex justify-center items-center">
                                    <DialogTitle className="text-center flex flex-col items-center">
                                        <div className="bg-red-100 p-3 rounded-full">
                                            <DeleteIcon className="text-red-600 text-3xl" />
                                        </div>
                                        <p className="mt-2 text-lg font-semibold text-gray-800">Delete Account</p>
                                    </DialogTitle>

                                    <DialogContent className="flex flex-col items-center gap-4 p-6">
                                        <p className="text-gray-600 text-sm text-center">
                                            Are you sure you want to delete the account linked to <b>pinkpaws.altisinfonet.in</b>?
                                        </p>

                                        <div className='flex gap-1 text-sm'>
                                            <p className='font-semibold'>Enter OTP sent on :</p>
                                            <span className='text-pink-500 font-semibold'>+91 {acDetailsFormData?.mobile_no}</span>
                                        </div>

                                        {/* 4-Digit Input */}
                                        <div>
                                            <div className="flex gap-3">
                                                {code && code?.map((digit: any, index: number) => (
                                                    <input
                                                        key={index}
                                                        type="text"
                                                        maxLength={1}
                                                        value={digit}
                                                        ref={(el) => { inputRefs.current[index] = el; }}
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

                                            {showTimer && <div className="flex item-center justify-center mt-2">
                                                <p className="text-sm text-red-500 border font-bold p-1 px-3 rounded shadow-md">
                                                    <AccessTimeIcon className='mx-1' style={{ fontSize: "18px", fontWeight: "bold" }} />
                                                    {formatTime(timeLeft)}
                                                </p>
                                            </div>}
                                            {!showTimer &&
                                                (<div className="cursor-pointer flex justify-center mt-2"
                                                    onClick={() => resendOTP("delete")}
                                                >
                                                    <p className='text-md font-semibold underline text-gray-500'>Resend OTP</p>
                                                </div>)}
                                        </div>



                                        {/* Checkbox */}
                                        <div className="flex items-center gap-2 ">
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
                                    </DialogContent>

                                    <DialogActions className="flex justify-center gap-4 pb-5">
                                        <Button
                                            disabled={!isChecked}
                                            variant="outlined"
                                            startIcon={<DeleteIcon />}
                                            onClick={() => handleDeleteAccount()}
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
                                                }
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
                                            onClick={onClose}
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
                                                    border: "1px solid #e91e63"
                                                }

                                            }}

                                            onMouseEnter={(e) => {
                                                const target = e.target as HTMLElement;
                                                target.style.transform = "scale(1.03)";
                                            }}
                                            onMouseLeave={(e) => {
                                                const target = e.target as HTMLElement;
                                                target.style.transform = "scale(1)";
                                            }}
                                            startIcon={<CloseIcon />}
                                        >
                                            Cancel
                                        </Button>
                                    </DialogActions>
                                </Dialog>
                            </div>

                            {!showPrivacyData ?
                                <>
                                    <div className="profile-upload-section">
                                        <div className="profile-container">
                                            <div className="profile-picture">
                                                {profileImage ? (
                                                    <img
                                                        src={profileImage}
                                                        alt="Profile"
                                                        className="profile-image"
                                                    />
                                                ) : (

                                                    <img
                                                        src={NoImage?.src}
                                                        alt="Profile"
                                                        className="profile-image"
                                                    />
                                                )}
                                            </div>
                                            <label htmlFor="profileUpload" className="camera-icon">
                                                <i className="fas fa-camera"></i>
                                            </label>
                                            <input
                                                type="file"
                                                id="profileUpload"
                                                accept="image/*"
                                                className="file-input"
                                                onChange={handleImageUpload}
                                            />
                                        </div>
                                    </div>

                                    <Dialog open={isModalOpen} onClose={handleCloseModal} maxWidth="md">
                                        <DialogTitle>Crop Your Image</DialogTitle>
                                        <DialogContent>
                                            {imageUrl && (
                                                <div style={{
                                                    position: 'relative',
                                                    width: '400px',
                                                    height: '200px',
                                                    maxWidth: '400px',
                                                    margin: '0 auto',
                                                }}>
                                                    <Cropper
                                                        image={imageUrl}
                                                        crop={crop}
                                                        zoom={zoom}
                                                        aspect={5 / 4}
                                                        onCropChange={setCrop}
                                                        onCropComplete={onCropComplete}
                                                        onZoomChange={setZoom}
                                                    />
                                                </div>
                                            )}
                                        </DialogContent>
                                        <DialogActions>
                                            <Button onClick={handleCloseModal} color="primary">
                                                Cancel
                                            </Button>
                                            <Button onClick={handleSubmitNotification} color="primary">
                                                Confirm
                                            </Button>
                                        </DialogActions>
                                    </Dialog>

                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className=" inp-nx mb-3">
                                                <label
                                                    htmlFor="exampleFormControlInput1"
                                                    className="form-label"
                                                >
                                                    First name{" "}
                                                    <span className="color-e4509d">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="exampleFormControlInput1"
                                                    placeholder="Enter First Name "
                                                    name="first_name"
                                                    value={acDetailsFormData?.first_name}
                                                    onChange={(e: any) => handleAcDetailsChange(e)}
                                                />
                                                {acDetailsFormDataError?.first_name ===
                                                    "" ? null : (
                                                    <div
                                                        style={{
                                                            fontSize: "65%",
                                                            fontWeight: "500",
                                                            color: "red",
                                                        }}
                                                        className="form-text"
                                                    >
                                                        {acDetailsFormDataError?.first_name}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className=" inp-nx mb-3">
                                                <label
                                                    htmlFor="exampleFormControlInput1"
                                                    className="form-label"
                                                >
                                                    Last name{" "}
                                                    <span className="color-e4509d">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="exampleFormControlInput1"
                                                    placeholder="Enter Last Name "
                                                    name="last_name"
                                                    value={acDetailsFormData?.last_name}
                                                    onChange={(e: any) => handleAcDetailsChange(e)}
                                                />
                                                {acDetailsFormDataError?.last_name === "" ? null : (
                                                    <div
                                                        style={{
                                                            fontSize: "65%",
                                                            fontWeight: "500",
                                                            color: "red",
                                                        }}
                                                        className="form-text"
                                                    >
                                                        {acDetailsFormDataError?.last_name}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className=" inp-nx mb-3">
                                                <label
                                                    htmlFor="exampleFormControlInput1"
                                                    className="form-label"
                                                >
                                                    Display name{" "}
                                                    <span className="color-e4509d">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="exampleFormControlInput1"
                                                    placeholder=" Enter Display Name"
                                                    name="display_name"
                                                    value={acDetailsFormData?.display_name}
                                                    onChange={(e: any) => handleAcDetailsChange(e)}
                                                />
                                            </div>
                                            {acDetailsFormDataError?.display_name ===
                                                "" ? null : (
                                                <div
                                                    style={{
                                                        fontSize: "65%",
                                                        fontWeight: "500",
                                                        color: "red",
                                                    }}
                                                    className="form-text"
                                                >
                                                    {acDetailsFormDataError?.display_name}
                                                </div>
                                            )}
                                        </div>
                                        <div className="col-md-6">
                                            <div className=" inp-nx mb-3">
                                                <label
                                                    htmlFor="exampleFormControlInput1"
                                                    className="form-label"
                                                >
                                                    Email Address{" "}
                                                    <span className="color-e4509d">*</span>
                                                </label>
                                                <input
                                                    type="email"
                                                    className="form-control"
                                                    id="exampleFormControlInput1"
                                                    placeholder="Enter Email Address"
                                                    name="email"
                                                    value={acDetailsFormData?.email}
                                                    onChange={(e: any) => handleAcDetailsChange(e)}
                                                />
                                            </div>
                                            {acDetailsFormDataError?.email === "" ? null : (
                                                <div
                                                    style={{
                                                        fontSize: "65%",
                                                        fontWeight: "500",
                                                        color: "red",
                                                    }}
                                                    className="form-text"
                                                >
                                                    {acDetailsFormDataError?.email}
                                                </div>
                                            )}
                                        </div>
                                        <div className="col-md-6">
                                            <div className=" inp-nx mb-3">
                                                <label
                                                    htmlFor="exampleFormControlInput1"
                                                    className="form-label"
                                                >
                                                    Mobile phone{" "}
                                                    <span className="color-e4509d">*</span>
                                                </label>
                                                <input
                                                    disabled={true}
                                                    type="number"
                                                    className="form-control"
                                                    id="exampleFormControlInput1"
                                                    placeholder="Enter Phone Number"
                                                    name="mobile_no"
                                                    value={acDetailsFormData?.mobile_no}
                                                    onChange={(e: any) => handleAcDetailsChange(e)}
                                                />
                                                {acDetailsFormDataError?.mobile_no === "" ? null : (
                                                    <div
                                                        style={{
                                                            fontSize: "65%",
                                                            fontWeight: "500",
                                                            color: "red",
                                                        }}
                                                        className="form-text"
                                                    >
                                                        {acDetailsFormDataError?.mobile_no}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <h3 className="acc-title1 pt-4">Change password</h3>

                                    {showLogout && (
                                        <>
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <div className="inp-nx mb-3">
                                                        <label
                                                            htmlFor="exampleFormControlInput1"
                                                            className="form-label"
                                                        >
                                                            New password (leave blank to leave unchanged){" "}
                                                            <span className="color-e4509d"></span>
                                                        </label>
                                                        <div className='input-group' style={{ position: "relative" }}>
                                                            <input
                                                                // type="password"
                                                                type={passwordVisible ? "text" : "password"}
                                                                className="form-control"
                                                                id="exampleFormControlInput1"
                                                                placeholder="Enter New password"
                                                                name="new_password"
                                                                value={changePassFormData?.new_password}
                                                                onChange={(e: any) =>
                                                                    handleChangePassChange(e)
                                                                }
                                                                style={{ backgroundColor: "transparent" }}
                                                            />
                                                            <button
                                                                type="button"
                                                                className="input-group-text"
                                                                onClick={togglePasswordVisibility}
                                                                style={{
                                                                    backgroundColor: "transparent",
                                                                    border: "none",
                                                                    cursor: "pointer",
                                                                    padding: "0 10px",
                                                                    position: "absolute",
                                                                    top: "15px",
                                                                    right: "5px",
                                                                    zIndex: "2",
                                                                }}
                                                            >
                                                                {passwordVisible ? <FaEye /> : <FaEyeSlash />}
                                                            </button>
                                                        </div>
                                                        {!change_password_errpr1 ? null : (
                                                            <div
                                                                style={{
                                                                    fontSize: "65%",
                                                                    fontWeight: "500",
                                                                    color: "red",
                                                                }}
                                                                className="form-text"
                                                            >
                                                                {change_password_errpr1}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="col-md-6">
                                                    <div className=" inp-nx mb-3">
                                                        <label
                                                            htmlFor="exampleFormControlInput1"
                                                            className="form-label"
                                                        >
                                                            Confirm new password{" "}
                                                            <span className="color-e4509d"></span>
                                                        </label>
                                                        <div className='input-group' style={{ position: "relative" }}>
                                                            <input
                                                                type={passwordCNFVisible ? "text" : "password"}
                                                                // type="password"
                                                                className="form-control"
                                                                id="exampleFormControlInput1"
                                                                placeholder="Enter Confirm new password"
                                                                name="confirm_new_password"
                                                                value={
                                                                    changePassFormData?.confirm_new_password
                                                                }
                                                                onChange={(e: any) =>
                                                                    handleChangePassChange(e)
                                                                }
                                                                style={{ backgroundColor: "transparent" }}
                                                            />

                                                            <button
                                                                type="button"
                                                                className="input-group-text"
                                                                onClick={toggleCNFPasswordVisibility}
                                                                style={{
                                                                    backgroundColor: "transparent",
                                                                    border: "none",
                                                                    cursor: "pointer",
                                                                    padding: "0 10px",
                                                                    position: "absolute",
                                                                    top: "15px",
                                                                    right: "5px",
                                                                    zIndex: "2",
                                                                }}
                                                            >
                                                                {passwordCNFVisible ? <FaEye /> : <FaEyeSlash />}
                                                            </button>
                                                        </div>
                                                        {!change_password_errpr ? null : (
                                                            <div
                                                                style={{
                                                                    fontSize: "65%",
                                                                    fontWeight: "500",
                                                                    color: "red",
                                                                }}
                                                                className="form-text"
                                                            >
                                                                {change_password_errpr}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    {!showLogout && (
                                        <>
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <div className=" inp-nx mb-3">
                                                        <label
                                                            htmlFor="exampleFormControlInput1"
                                                            className="form-label"
                                                        >
                                                            New password (leave blank to leave unchanged){" "}
                                                            <span className="color-e4509d"></span>
                                                        </label>
                                                        <input
                                                            type="password"
                                                            className="form-control"
                                                            id="exampleFormControlInput1"
                                                            placeholder="Enter New password"
                                                            name="new_password"
                                                            value={changePassFormData?.new_password}
                                                            onChange={(e: any) =>
                                                                handleChangePassChange(e)
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className=" inp-nx mb-3">
                                                        <label
                                                            htmlFor="exampleFormControlInput1"
                                                            className="form-label"
                                                        >
                                                            Confirm new password{" "}
                                                            <span className="color-e4509d"></span>
                                                        </label>
                                                        <input
                                                            type="password"
                                                            className="form-control"
                                                            id="exampleFormControlInput1"
                                                            placeholder="Enter Confirm new password"
                                                            name="confirm_new_password"
                                                            value={
                                                                changePassFormData?.confirm_new_password
                                                            }
                                                            onChange={(e: any) =>
                                                                handleChangePassChange(e)
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <div className=" inp-nx mb-3">
                                                        <label
                                                            htmlFor="exampleFormControlInput1"
                                                            className="form-label"
                                                        >
                                                            Mobile phone{" "}
                                                            <span className="color-e4509d">*</span>
                                                        </label>
                                                        <input
                                                            type="number"
                                                            className="form-control"
                                                            id="exampleFormControlInput1"
                                                            placeholder="Enter Phone Number"
                                                            name="mobile_no"
                                                            value={acDetailsFormData?.mobile_no}
                                                            onChange={(e: any) =>
                                                                handleAcDetailsChange(e)
                                                            }
                                                        />
                                                        {acDetailsFormDataError?.mobile_no ===
                                                            "" ? null : (
                                                            <div
                                                                style={{
                                                                    fontSize: "65%",
                                                                    fontWeight: "500",
                                                                    color: "red",
                                                                }}
                                                                className="form-text"
                                                            >
                                                                {acDetailsFormDataError?.mobile_no}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                    <button
                                        className="save-btn"
                                        onClick={() => {
                                            SavedAc();
                                            SavedChangePass();
                                        }}
                                    >
                                        Save Changes
                                    </button>
                                </>
                                :
                                <>
                                    <div className="bg-gray-100 p-6 rounded-lg shadow-md max-w-2xl mx-auto">

                                        <h2 className="account-title">{accountDataPolicy?.title}</h2>
                                        <div
                                            className="account-data-policy"
                                            dangerouslySetInnerHTML={{ __html: accountDataPolicy?.description }}
                                        />

                                        <hr className='mt-3' />

                                        <div className='flex flex-wrap items-center justify-center gap-4 mt-3'>
                                            <Button startIcon={<DeleteIcon />} onClick={() => {
                                                setIsDeleteOpen(!isDeleteOpen),
                                                    sendOtp('delete')
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
                                </>
                            }

                            {/* Download Data Modal */}
                            <Modal open={openDownloadModal} onClose={() => { setCodeSuccessMsg(""), setOtpCode(['', '', '', '']), setOpenDownloadModal(false), setEmail(""), setEmailError(""), setShowOtpSection(false) }}>
                                <Box
                                    sx={{
                                        position: "absolute",
                                        top: "50%",
                                        left: "50%",
                                        transform: "translate(-50%, -50%)",
                                        width: 350,
                                        bgcolor: "white",
                                        boxShadow: 24,
                                        p: 3,
                                        borderRadius: 2,
                                    }}
                                >
                                    {/* Modal Header */}
                                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                        <Typography fontSize={18} fontWeight="600">{showOtpSection ? "Verify your mobile no." : "Download Data"}</Typography>
                                        <IconButton onClick={() => { setCodeSuccessMsg(""), setOtpCode(['', '', '', '']), setOpenDownloadModal(false), setEmail(""), setEmailError(""), setShowOtpSection(false) }}>
                                            <CloseIcon />
                                        </IconButton>
                                    </Box>

                                    {showOtpSection && acDetailsFormData?.mobile_no && <div className='flex gap-1 justify-center mb-4 text-xs'>
                                        <p className='font-semibold'>Enter OTP sent on :</p>
                                        <span className='text-pink-500 font-semibold'>+91 {acDetailsFormData?.mobile_no}</span>
                                    </div>}

                                    {/* Email Input */}
                                    {!showOtpSection &&
                                        <>
                                            <TextField
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
                                                sx={{ mb: 2 }}
                                            />
                                            {emailError && (
                                                <p style={{ position: "absolute", top: "141px" }} className="text-red-600 text-xs font-semibold mx-2 mt-0">{emailError}</p>
                                            )}
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

                                    {/* Buttons */}
                                    <div className='flex justify-between'>
                                        <Button
                                            onClick={() => { setCodeSuccessMsg(""), setOtpCode(['', '', '', '']), setShowOtpSection(false), setOpenDownloadModal(false), setEmail(""), setEmailError("") }}
                                            sx={{
                                                marginTop: "15px",
                                                backgroundColor: "#f1f1f1",
                                                color: "#475569",
                                                fontWeight: "600",
                                                "&:hover": { backgroundColor: "#e0e0e0" }
                                            }}
                                        >
                                            Cancel
                                        </Button>
                                        {!showOtpSection && <Button
                                            variant="contained"
                                            sx={{
                                                marginTop: "15px",
                                                backgroundColor: "#e4509d",
                                                color: "white",
                                                fontWeight: "600",
                                                "&:hover": { backgroundColor: "#EC4899" }
                                            }}
                                            onClick={handleDownloadData}
                                        >
                                            Submit
                                        </Button>}
                                    </div>
                                </Box>
                            </Modal>

                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default AccountDetails