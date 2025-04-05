import React, { useEffect, useState } from 'react'
import getUrlWithKey from '../../../util/_apiUrl';
import Image from 'next/image';
import { useCreate, useRead } from '../../../hooks/index';
import BeforeMobile from './beforeAuth';
import RegitrationMobile from './regitrationMobile';
import Signmobile from './signmobile';
import RegistrationEmail from './registrationEmail';
import BeforeAuth from './beforeAuth';
import PasswordField from './registrationEmailPassword';
import Signemail from './signemail';
import RegistrationEmailPassword from './registrationEmailPassword';
import SignEmailPassword from './signEmailPassword';
import { _ERROR, _SUCCESS } from '../../../util/_reactToast';
import { useDispatch } from 'react-redux';
import { setMe } from '../../../reducer/me';
import useIsLogedin from '../../../hooks/useIsLogedin';
import { _post, _put } from '../../../services';
import CryptoJS from "crypto-js";
import { decryptPayload, encryptPayload } from '../../../util/_encryption_api_payload';
const Login = ({ handleClickExtra, setOpen }: Props) => {

    const dispatch = useDispatch()
    const { logedData } = useIsLogedin()

    const { signin, user_find, send_otp, signin_with_otp, signup_mobile_email_otp, signin_with_password, signup_mobile_email_password } = getUrlWithKey("auth_apis")

    const [auth, setAuth] = useState<any>({});
    const [logDetails, setLogDetails] = useState<any>({});
    const [sendOtpUrl, setSendOtpUrl] = useState("");
    // const [otp, setOtp] = useState<number>();
    // const [submittedOtp, setSubmittedOtp] = useState<number>();
    const [emailCheckType, setEmailCheckType] = useState("");
    const [signinUrl, setSigninUrl]: any = useState<any>();
    const [goSign, setGoSign]: any = useState("");
    const [user_find_url, setUserFind] = useState<string>("");
    const [loginType, setLoginType] = useState<string>("");
    console.log(loginType, "5gf41h56fg6")
    const [loggedCredential, setLoggedCredential] = useState(null);
    const [userFindPayload, setUserFindPayload] = useState<{ credential: string }>({
        credential: ""
    });
    const [userfindnewurl, setUserFindUrlNew] = useState({
        path: "",
        payload: null
    });

    const [urlSetupForOtp, seturlSetupForOtp] = useState<any>(
        { selectMethod: "", url: "", callData: null }
    );

    const [urlSetup, seturlSetup] = useState<any>(
        { selectMethod: "", url: "", callData: null }
    );
    const [loginOtp, setLoginOtp]: any = useState();

    const { sendData: findUser, error: userFindError }: any = useRead(urlSetup);

    const { sendData: loginDataOtp }: any = useCreate(urlSetupForOtp);

    const { sendData: logedIn, error: logedInError }: any = useCreate(logDetails);
    console.log(loginOtp, goSign, logedIn, "logfgdxfinOtp")

    useEffect(() => {
        if (logedIn) {
            localStorage.setItem("logedId", logedIn?.id);
            _SUCCESS("Login Successfull!")
            dispatch(setMe(logedIn))
            console.log(logedIn, "logedIn")
            setOpen(false);
            if (logDetails?.url) {
                setLogDetails({ url: "" })
            }
        }

        if (logedInError) {
            if (logDetails?.callData?.password == "" || logDetails?.callData?.password) {
                _ERROR("Please provide a valid password.")
                if (logDetails?.url) {
                    setLogDetails({ url: "" })
                }
            } else {
                _ERROR(logedInError?.massage)
                if (logDetails?.url) {
                    setLogDetails({ url: "" })
                }
            }
        }
    }, [logedIn, logedInError]);

    console.log(logDetails, "logDetails")


    // useEffect(() => {
    //     if (loginOtp && loginOtp?.id && !loginOtpError) {
    //         setOtp(+(loginOtp?.OTP));
    //     }

    //     if (loginOtpError) {
    //     }
    // }, [loginOtp, loginOtpError]);
    // console.log(findUser, "findUser")
    useEffect(() => {
        if (findUser && findUser?.id && !userFindError) {
            let payload = {};
            // setGoSign(type)
            if (loginType === "loginMob") {
                payload = { credential: loggedCredential, type: 1, otp_type: "login" };
                // seturlSetupForOtp({ selectMethod: "post", url: send_otp, callData: { credential: loggedCredential, type: 1, otp_type: "login" } })
                setGoSign("loginMob");
            } else if (loginType === "loginEmail") {
                if (emailCheckType === "byPassword") {
                    setGoSign("loginEmailByPassword");
                } else {
                    payload = { credential: loggedCredential, type: 2, otp_type: "login" };
                    // seturlSetupForOtp({ selectMethod: "post", url: send_otp, callData: { credential: loggedCredential, type: 2, otp_type: "login" } })
                    setGoSign("loginEmailByOtp");
                }
            }
            const encryptedPayload = encryptPayload(payload);

            // if (!encryptedPayload) {
            //     return;
            // }
            console.log(encryptedPayload, payload, "dfg5f6dg46")
            seturlSetupForOtp({
                selectMethod: "post",
                url: send_otp,
                callData: { data: encryptedPayload }
            });
            const deCrypteData = decryptPayload(encryptedPayload)
            console.log(encryptedPayload, deCrypteData, "dddsdfds")


        } else if (!Array.isArray(findUser) && findUser === null) {
            if (loginType === "loginMob") {
                // seturlSetupForOtp({ selectMethod: "post", url: send_otp, callData: { credential: loggedCredential, type: 1, otp_type: "register" } })
                setGoSign("registerMob");
            } else if (loginType === "loginEmail") {
                if (emailCheckType === "byPassword") {
                    setGoSign("registerEmailByPassword");
                } else {
                    // seturlSetupForOtp({ selectMethod: "post", url: send_otp, callData: { credential: loggedCredential, type: 2, otp_type: "register" } })
                    setGoSign("registerEmailByOtp");
                }

            }
        }

        if (userFindError) {
        }
    }, [findUser, userFindError]);

    // const handleSubmit = () => {
    //     if (signinUrl !== signin) {
    //         setSigninUrl(signin)
    //         setLogDetails(auth)
    //     }
    // }
    // useEffect(() => {
    //     setSigninUrl()
    // }, [signinUrl])


    // const handleSignInMobile = ({ submittedOtp }) => {
    //     console.log("handleSignInMobile", submittedOtp)
    //     // setSubmittedOtp(submittedOtp);
    //     if (logedData && logedData?.role && logedData?.role?.label === "guest") {
    //         console.log("handleSignInMobile-guest", { url: signin_with_otp, callData: { credential: (loginOtp && loginOtp?.phone), OTP: submittedOtp, guest_id: logedData?.id } })

    //         submittedOtp && setLogDetails({ url: signin_with_otp, callData: { credential: (loginOtp && loginOtp?.phone), OTP: submittedOtp, guest_id: logedData?.id } })
    //     } else {
    //         console.log("handleSignInMobile-normal", { url: signin_with_otp, callData: { credential: (loginOtp && loginOtp?.phone), OTP: submittedOtp } })

    //         submittedOtp && setLogDetails({ url: signin_with_otp, callData: { credential: (loginOtp && loginOtp?.phone), OTP: submittedOtp } })
    //     }
    // }

    const handleSignInMobile = ({ submittedOtp }: { submittedOtp: string }) => {
        console.log("handleSignInMobile", submittedOtp);

        if (!submittedOtp) return;
        const payload: Record<string, any> = {
            credential: loginOtp?.phone,
            OTP: submittedOtp
        };
        if (logedData?.role?.label === "guest") {
            payload.guest_id = logedData.id;
        }
        const encryptedPayload = encryptPayload(payload);
        if (!encryptedPayload) {
            return;
        }
        setLogDetails({ url: signin_with_otp, callData: { data: encryptedPayload } });
    };


    const handleSendOtpForRegistration = (type: string) => {
        let payload: Record<string, any> = {};
        // if (type === "mob") {
        //     seturlSetupForOtp({ selectMethod: "post", url: send_otp, callData: { credential: auth.phone, type: 1, otp_type: "register" } })
        // } else {
        //     seturlSetupForOtp({ selectMethod: "post", url: send_otp, callData: { credential: loggedCredential, type: 2, otp_type: "register" } })
        // }
        if (type === "mob") {
            payload = {
                credential: auth.phone,
                type: 1,
                otp_type: "register"
            };
        } else {
            payload = {
                credential: loggedCredential,
                type: 2,
                otp_type: "register"
            };
        }
        const encryptedPayload = encryptPayload(payload);
        if (!encryptedPayload) {
            return;
        }
        seturlSetupForOtp({ selectMethod: "post", url: send_otp, callData: { data: encryptedPayload } });
    }

    const handleRegitrationMobile = (data: any) => {
        console.log("handleSignInMobile", "handleRegitrationMobile")
        if (logedData && logedData?.role && logedData?.role?.label === "guest") {
            data && setLogDetails({ url: signup_mobile_email_otp, callData: { ...data, credential: (loginOtp && loginOtp?.email), guest_id: logedData?.id } })
        } else {
            data && setLogDetails({ url: signup_mobile_email_otp, callData: { ...data, credential: (loginOtp && loginOtp?.email) } })
        }
    }

    // const handleSignInEmailByOtp = ({ submittedOtp }) => {
    //     console.log("handleSignInMobile", "handleSignInEmailByOtp")
    //     // setSubmittedOtp(submittedOtp);
    //     if (!submittedOtp) return;
    //     const payload: Record<string, any> = {
    //         credential: loginOtp?.email,
    //         OTP: submittedOtp
    //     };
    //     if (logedData && logedData?.role && logedData?.role?.label === "guest") {
    //         payload.guest_id = logedData.id;
    //         submittedOtp && setLogDetails({ url: signin_with_otp, callData: { credential: (loginOtp && loginOtp?.email), OTP: submittedOtp, guest_id: logedData?.id } })
    //     } else {
    //         submittedOtp && setLogDetails({ url: signin_with_otp, callData: { credential: (loginOtp && loginOtp?.email), OTP: submittedOtp } })
    //     }
    //     const encryptedPayload = encryptPayload(payload);
    //     if (!encryptedPayload) {
    //         // console.error("Failed to encrypt signin_with_otp payload!");
    //         return;
    //     }
    //     setLogDetails({ url: signin_with_otp, callData: { data: encryptedPayload } });
    // }

    const handleSignInEmailByOtp = ({ submittedOtp }: { submittedOtp: string }) => {
        console.log("handleSignInEmailByOtp");

        if (!submittedOtp) return;

        const payload: Record<string, any> = {
            credential: loginOtp?.email,
            OTP: submittedOtp
        };

        if (logedData?.role?.label === "guest") {
            payload.guest_id = logedData.id;
        }
        const encryptedPayload = encryptPayload(payload);
        if (!encryptedPayload) {
            return;
        }
        setLogDetails({ url: signin_with_otp, callData: { data: encryptedPayload } });
    };

    const handleRegitrationEmailByOtp = (data: any) => {
        console.log(data, "handleRegitrationEmailByOtp")
        if (logedData && logedData?.role && logedData?.role?.label === "guest") {
            data && setLogDetails({ url: signup_mobile_email_otp, callData: { ...data, credential: (loggedCredential && loggedCredential), guest_id: logedData?.id } })
        } else {
            data && setLogDetails({ url: signup_mobile_email_otp, callData: { ...data, credential: (loggedCredential && loggedCredential) } })
        }
    }

    const handleSignInEmailByPassword = ({ password }) => {
        console.log("handleSignInMobile", "handleSignInEmailByPassword")
        // setSubmittedOtp(submittedOtp);
        if (logedData && logedData?.role && logedData?.role?.label === "guest") {
            (loggedCredential && password) && setLogDetails({ url: signin_with_password, callData: { credential: loggedCredential, password: password, guest_id: logedData?.id } })
        } else {
            (loggedCredential && password) && setLogDetails({ url: signin_with_password, callData: { credential: loggedCredential, password: password } })
        }
    }

    const handleRegitrationEmailByPassword = (data: any) => {
        console.log("handleSignInMobile", "handleRegitrationEmailByPassword")

        if (logedData && logedData?.role && logedData?.role?.label === "guest") {
            (loggedCredential && data) && setLogDetails({ url: signup_mobile_email_password, callData: { ...data, credential: loggedCredential, guest_id: logedData?.id } })
        } else {
            (loggedCredential && data) && setLogDetails({ url: signup_mobile_email_password, callData: { ...data, credential: loggedCredential } })
        }
    }



    const handleCheckAuth = async ({ data, type, condition = null, manual = false }: any) => {
        console.log("handleCheckAuth", { data, type, condition })
        setLoginType(type);
        setLoggedCredential(data);
        condition && setEmailCheckType(condition);
        // (data && !manual) && seturlSetup({ selectMethod: "put", url: user_find, callData: { credential: data } });

        if (data && !manual) {
            const encryptedPayload = encryptPayload({ credential: data });
            console.log(encryptedPayload, "65df4g6fd4")

            if (!encryptedPayload) {
                // console.error("Failed to encrypt payload!");
                return;
            }

            seturlSetup({
                selectMethod: "put",
                url: user_find,
                callData: { data: encryptedPayload }
            });
            console.log(encryptedPayload, "df54g56fd3g23df")
        }

        if (data && manual) {
            let type = loginType === "loginMob" ? 1 : 2;
            let resendData = await _post(send_otp, { credential: loggedCredential, type, otp_type: "login" });
            if (resendData?.data?.success) {
                setLoginOtp(resendData?.data?.data)
            }
        }
    }

    useEffect(() => {
        console.log("loginOtp", loginDataOtp)
        setLoginOtp(loginDataOtp)
        // seturlSetupForOtp({ selectMethod: "", url: "", callData: null })
        // seturlSetup({ selectMethod: "", url: "", callData: null })
    }, [loginDataOtp])

    // useEffect(() => {
    //     console.log("logDetails", logDetails);
    //     if (logDetails?.url) {
    //         setLogDetails({ url: "" })
    //     }
    // }, [logDetails])

    const [seconds, setSeconds] = useState<number>(0)

    useEffect(() => {
        if (loginOtp) {
            setSeconds(loginOtp?.difference_in_seconds);

            const intervalId = setInterval(() => {
                // Update the seconds every second
                setSeconds(prevSeconds => prevSeconds - 1);
            }, 1000);

            return () => clearInterval(intervalId);
        }
    }, [loginOtp]);

    // Convert seconds to minutes and seconds
    const minutes: number = Math.floor(seconds / 60);
    const remainingSeconds: number = Math.floor(seconds % 60);

    const timeCounter = () => {
        let m = minutes < 10 ? `0${minutes}:` : `${minutes}:`
        let s = remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;
        return seconds < 0 ? "Time Out" : (m + s);
    }

    useEffect(() => {
        if (timeCounter() === "Time Out") {
            seturlSetupForOtp({})
        }
    }, [timeCounter()])

    return (
        // <div style={{ background: "#ffffff", display: "flex", flexDirection: "column", gap: "8px", alignItems: "center" }}>
        //     <img src="/assets/images/logo.png" alt="logo" width={110} height={56} />
        //     <hr />
        //     <input type='email' name='credential' style={{width: "100%"}} placeholder="Email" value={auth?.email}
        //         onChange={(e: any) => setAuth((pre: any) => ({ ...pre, credential: e.target.value }))}
        //     />
        //     <input type='password' name='password' style={{width: "100%"}} placeholder="Password" value={auth?.password}
        //         onChange={(e: any) => setAuth((pre: any) => ({ ...pre, password: e.target.value }))}
        //     />
        //     <button style={{width: "50%"}} onClick={() => { handleSubmit(), logedIn?.id && handleClickExtra() }}>Login</button>
        // </div>
        <>
            {
                goSign === "loginMob" ?
                    <Signmobile
                        handleSignInMobile={handleSignInMobile}
                        loggedPhone={loggedCredential}
                        loginOtpData={timeCounter()}
                        resendOtp={
                            <div className='resend_cls_root'>
                                <span className='resend_cls' onClick={() => handleCheckAuth({ data: loggedCredential, type: loginType, manual: true })}>Resend OTP</span>
                            </div>
                        } /> :
                    goSign === "registerMob" ?
                        <RegitrationMobile
                            handleRegitrationMobile={handleRegitrationMobile}
                            loggedPhone={loggedCredential}
                            loginOtpData={timeCounter()}
                            handleSendOtpForRegistration={handleSendOtpForRegistration}
                            resendOtp={
                                <div className='resend_cls_root'>
                                    <span className='resend_cls' onClick={() => { handleCheckAuth({ data: loggedCredential, type: loginType }); handleSendOtpForRegistration("mob") }}>Resend OTP</span>
                                </div>
                            } /> :
                        goSign === "loginEmailByOtp" ?
                            <Signemail
                                handleSignInEmailByOtp={handleSignInEmailByOtp}
                                loggedEmail={loggedCredential}
                                loginOtpData={timeCounter()}
                                resendOtp={
                                    <div className='resend_cls_root'>
                                        <span className='resend_cls' onClick={() => handleCheckAuth({ data: loggedCredential, type: loginType })}>Resend OTP</span>
                                    </div>
                                } /> :
                            goSign === "registerEmailByOtp" ?
                                <RegistrationEmail
                                    handleRegitrationEmailByOtp={handleRegitrationEmailByOtp}
                                    loggedEmail={loggedCredential}
                                    loginOtpData={timeCounter()}
                                    handleSendOtpForRegistration={handleSendOtpForRegistration}
                                    resendOtp={
                                        <div className='resend_cls_root'>
                                            <span className='resend_cls' onClick={() => { handleCheckAuth({ data: loggedCredential, type: loginType }); handleSendOtpForRegistration("email") }}>Resend OTP</span>
                                        </div>
                                    } /> :
                                goSign === "loginEmailByPassword" ?
                                    <SignEmailPassword handleSignInEmailByPassword={handleSignInEmailByPassword} loggedEmail={loggedCredential} /> :
                                    goSign === "registerEmailByPassword" ?
                                        <RegistrationEmailPassword handleRegitrationEmailByPassword={handleRegitrationEmailByPassword} loggedEmail={loggedCredential} /> :
                                        <BeforeAuth handleCheckAuth={handleCheckAuth} />
            }

            {/* <Signmobile /> */}
            {/* <RegistrationEmail/> */}
            {/* <RegitrationMobile /> */}
        </>
    )
}

interface Props {
    handleClickExtra?: any;
    setOpen: any;
}

export default Login