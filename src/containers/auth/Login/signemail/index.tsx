import Image from 'next/image'
import Link from 'next/link'
import React, { ChangeEvent, useRef, useState } from 'react'
import iconp from "../../../../../public/assets/icon/pencil.png"
import iconpass from "../../../../../public/assets/icon/password.png"
import iconmail from "../../../../../public/assets/icon/emai-otp.png"


const Signemail = ({ handleSignInEmailByOtp, loggedEmail, loginOtpData, resendOtp }: any) => {

    const myRef = useRef;

    // const [num1, setNum1] = useState<number>(null);
    // const [num2, setNum2] = useState<number>(null);
    // const [num3, setNum3] = useState<number>(null);
    // const [num4, setNum4] = useState<number>(null);
    const numDigits = 4;
    const [otp, setOtp] = useState<string[]>(Array(numDigits).fill(''));
    const otpFields = Array(numDigits).fill(0).map(() => myRef<HTMLInputElement>(null));

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
    };

    const handleKeyDown = (e: any, index: number) => {
        if (e.key === 'Backspace' && otp[index] === '') {
            if (index > 0 && otpFields[index - 1].current) {
                otpFields[index - 1].current.focus();
            }
        }
    };

    const handleFormSubmit = (e: any) => {

        if (otp.length === 4) {
            const submittedOtp = `${otp[0]}${otp[1]}${otp[2]}${otp[3]}`;
            // const submittedOtp = `${num1}${num2}${num3}${num4}`;
            handleSignInEmailByOtp({ submittedOtp });
        }
        // Do something with the form data, like sending it to the server
        // handleCheckAuth({ data: mobileNumber })
    };



    return (
        <>
            <p className='para1'>VERIFY YOUR EMAIL TO COMPLETE YOUR <br /> REGISTRATION</p>
            <p className='para1'>ENTER OTP SENT ON    <strong>{loggedEmail} </strong>
                {/* <span><Image src={iconp} alt="iconp" className={``} /></span>  */}
                {/* Your Email Id */}
            </p>

            <div>
                <Image src={iconmail} alt="iconpass" className={`logo-m`} />
            </div>

            <div className="otp-input-fields">
                {otp.map((digit, index) => (
                    <input
                        key={index}
                        type="text"
                        className="otp__digit"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleChange(e, index)}
                        ref={otpFields[index]}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                    />
                ))}
                {/* <input type="text" className="otp__digit otp__field__1" value={num1} onChange={(e) => setNum1(+(e.target.value))} />
                <input type="text" className="otp__digit otp__field__2" value={num2} onChange={(e) => setNum2(+(e.target.value))} />
                <input type="text" className="otp__digit otp__field__3" value={num3} onChange={(e) => setNum3(+(e.target.value))} />
                <input type="text" className="otp__digit otp__field__4" value={num4} onChange={(e) => setNum4(+(e.target.value))} /> */}


            </div>
            {loginOtpData === "Time Out" ?
                resendOtp
                :
                <p className='para-new'>{loginOtpData}</p>
            }

            <form>

            </form>





            <button type="submit" className="btn1 mt-4" onClick={handleFormSubmit}>Verify</button>

        </>

    )
}

export default Signemail