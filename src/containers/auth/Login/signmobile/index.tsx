import Image from 'next/image'
import Link from 'next/link'
import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import iconp from "../../../../../public/assets/icon/pencil.png"
import iconpass from "../../../../../public/assets/icon/password.png"

const Signmobile = ({ handleSignInMobile, loggedPhone, loginOtpData, resendOtp }: any) => {

    const myRef = useRef;

    const numDigits = 4;
    // const [num1, setNum1] = useState<number>(null);
    // const [num2, setNum2] = useState<number>(null);
    // const [num3, setNum3] = useState<number>(null);
    // const [num4, setNum4] = useState<number>(null);
    const [otp, setOtp] = useState<string[]>(Array(numDigits).fill(''));
    const otpFields = Array(numDigits).fill(0).map(() => myRef<HTMLInputElement>(null));
    const [verifyButtonOff, setVerifyButtonOff] = useState(false);

    const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
        const { value } = e.target;
        if (value.length > 1) return; // Limit to one character per field

        // Update OTP state
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Move focus to the next input field
        // if (value && index < numDigits - 1 && otpFields[index + 1].current) {
        //     otpFields[index + 1].current.focus();
        // }
        // Move focus to the next input field if the value is not empty
        if (value) {
            if (index < numDigits - 1 && otpFields[index + 1].current) {
                otpFields[index + 1].current.focus();
            }
        } else {
            // Move focus to the previous input field if the value is empty
            if (index > 0 && otpFields[index - 1].current) {
                otpFields[index - 1].current.focus();
            }
        }

        // console.log("handleKeyDown", index, value); return;

        // if (index === 3 && value) {
        //     setVerifyButtonOff(true);
        // }
    };

    // useEffect(() => {
    //     if (verifyButtonOff) {
    //         handleFormSubmit();
    //         setVerifyButtonOff(false);
    //     }
    // }, [verifyButtonOff])

    const handleKeyDown = (e: any, index: number) => {

        if (e.key === 'Backspace' && otp[index] === '') {
            if (index > 0 && otpFields[index - 1].current) {
                otpFields[index - 1].current.focus();
            }
        }
    };

    const handleFormSubmit = (e?: any) => {
        if (otp.length === 4) {
            const submittedOtp = `${otp[0]}${otp[1]}${otp[2]}${otp[3]}`;
            handleSignInMobile({ submittedOtp });
        }
        // Do something with the form data, like sending it to the server
        // handleCheckAuth({ data: mobileNumber })
    };


    // const [seconds, setSeconds] = useState<number>(0)

    // useEffect(() => {
    //     if (loginOtpData) {
    //         setSeconds(loginOtpData?.difference_in_seconds);

    //         const intervalId = setInterval(() => {
    //             // Update the seconds every second
    //             setSeconds(prevSeconds => prevSeconds - 1);
    //         }, 1000);

    //         return () => clearInterval(intervalId);
    //     }
    // }, [loginOtpData]);

    // // Convert seconds to minutes and seconds
    // const minutes: number = Math.floor(seconds / 60);
    // const remainingSeconds: number = Math.floor(seconds % 60);

    // const timeCounter = () => {
    //     let m = minutes < 10 ? `0${minutes}:` : `${minutes}:`
    //     let s = remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;
    //     return seconds < 0 ? "Time Out" : (m + s);
    // }


    return (
        <>

            <p className='para1'>VERIFY YOUR MOBILE NUMBER TO SIGN IN</p>

            <div>
                <Image src={iconpass} alt="iconpass" className={`logo-m`} />
            </div>
            <p className='para1 pt-3'>ENTER OTP SENT ON    <strong>+91 {loggedPhone} </strong>
                {/* <span><Image src={iconp} alt="iconp" className={``} /></span> */}
                 via WhatsApp and SMS
            </p>

            <div className="otp-input-fields">
                {otp.map((digit, index) => (
                    <input
                        key={index}
                        type="text"
                        className="otp__digit"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleChange(e, index)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        ref={otpFields[index]}
                    />
                ))}
                {/* <input type="text" className="otp__digit otp__field__1" maxLength={1} value={num1} onChange={(e) => setNum1(+(e.target.value))} />
                <input type="text" className="otp__digit otp__field__2" maxLength={1} value={num2} onChange={(e) => setNum2(+(e.target.value))} />
                <input type="text" className="otp__digit otp__field__3" maxLength={1} value={num3} onChange={(e) => setNum3(+(e.target.value))} />
                <input type="text" className="otp__digit otp__field__4" maxLength={1} value={num4} onChange={(e) => setNum4(+(e.target.value))} /> */}


            </div>
            {loginOtpData === "Time Out" ?
                resendOtp
                :
                <p className='para-new'>{loginOtpData}</p>
            }

            <form>

            </form>





            <button disabled={verifyButtonOff} type="button" className="btn1 mt-4" onClick={handleFormSubmit}>Verify</button>

        </>

    )
}

export default Signmobile