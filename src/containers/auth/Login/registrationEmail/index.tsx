import Image from 'next/image'
import Link from 'next/link'
import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import iconp from "../../../../../public/assets/icon/pencil.png"
import iconmail from "../../../../../public/assets/icon/emai-otp.png"
import icon5 from "../../../../../public/assets/icon/full-name.png"
import icon6 from "../../../../../public/assets/icon/email-id.png"
import { isEmptyObject, phoneRegax } from '../../../../util/_common'

const RegistrationEmail = ({ handleRegitrationEmailByOtp, loggedEmail, loginOtpData, resendOtp, handleSendOtpForRegistration }) => {

  const myRef = useRef;

  const defaultFieldSet = {
    mobileNumber: "",
    name: "",
  }

  const numDigits = 4;
  const [fields, setFields] = useState(defaultFieldSet);
  const [fieldsErrors, setFieldsErrors] = useState<{ [x: string]: any }>(new Object());
  const [sendOtpForRegistration, setSendOtpForRegistration] = useState<boolean>(false);


  // const [num1, setNum1] = useState<number>(null);
  // const [num2, setNum2] = useState<number>(null);
  // const [num3, setNum3] = useState<number>(null);
  // const [num4, setNum4] = useState<number>(null);
  const [otp, setOtp] = useState<string[]>(Array(numDigits).fill(''));
  const otpFields = Array(numDigits).fill(0).map(() => myRef<HTMLInputElement>(null));
  // const [name, setName] = useState<string>("");
  // const [phone, setPhone] = useState<string>("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const { value } = e.target;
    if (value.length > 1) return; // Limit to one character per field

    // Update OTP state
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move focus to the next input field
    // if (value && index < numDigits - 1 && otpFields[index + 1].current) {
    //   otpFields[index + 1].current.focus();
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

  const handelOnChange = (e: any) => {
    const stateName = e.target.name;
    const stateValue = e.target.value;

    setFields(pre => ({
      ...pre,
      [stateName]: stateValue
    }));

    let runTimeValidationObject: any = {};

    if ("mobileNumber" === stateName) {
      runTimeValidationObject[stateName] = {
        v: stateValue,
        regax: phoneRegax,
        m: "Invalid phone number"
      }
    }

    if (isEmptyObject(runTimeValidationObject)) {
      clearValidation(stateName);
    } else {
      runTimeValidationField(runTimeValidationObject);
    }

    // clearValidation(stateName);
  }

  const runTimeValidationField = (dataSet: { [x: string]: any }) => {
    if (!isEmptyObject(dataSet)) {
      for (const key in dataSet) {
        const value = dataSet[key]?.v;
        const regax = dataSet[key]?.regax;
        const message = dataSet[key]?.m;
        if (!regax(value)) {
          setFieldsErrors(pre => ({
            ...pre,
            [key]: message
          }));

        } else {
          setFieldsErrors(pre => ({
            ...pre,
            [key]: ""
          }));
        }
      }
    }
  }

  const clearValidation = (stateName: string) => {
    setFieldsErrors(pre => ({
      ...pre,
      [stateName]: ""
    }));
  }

  const validation = (stateHandler: { [x: string]: any }, required_fields: string[] = []) => {
    let valid = true;
    if (!isEmptyObject(stateHandler) && required_fields.length) {
      for (let i = 0; i < required_fields.length; i++) {
        if (!stateHandler[required_fields[i]]) {
          setFieldsErrors(pre => ({
            ...pre,
            [required_fields[i]]: "This fields is required!"
          }));
          valid = false;
        }

        for (let key in stateHandler) {
          if (key == required_fields[i] && !stateHandler[key]) {
            setFieldsErrors(pre => ({
              ...pre,
              [key]: "This fields is required!"
            }));
            valid = false;
          }
          if (fieldsErrors[key]) {
            valid = false;
          }
        }
      }
    } else {
      required_fields.forEach(item => setFieldsErrors(pre => ({
        ...pre,
        [item]: "This fields is required!"
      })));
    }

    return valid;
  }

  const handleFormSubmit = () => {
    let valid = false;
    valid = validation(fields, ["name", "mobileNumber"]);

    if ((otp.length === 4) && valid) {
      // const submittedOtp = `${num1}${num2}${num3}${num4}`;
      const submittedOtp = `${otp[0]}${otp[1]}${otp[2]}${otp[3]}`;

      const splitName = fields?.name.split(" ");
      const first_name = splitName[0];
      const last_name = splitName.length > 1 ? splitName[1] : "";
      const type = 'e';

      handleRegitrationEmailByOtp({ first_name, last_name, type, otp: submittedOtp, common_credential: fields?.mobileNumber });
    }
    // Do something with the form data, like sending it to the server
    // handleCheckAuth({ data: mobileNumber })
  };

  const hanndleSubmitRegistration = () => {
    let errors: Record<string, string> = {};
    const regexPattern = /^\d{10}$/;

    if (!fields?.name || fields.name.trim() === "") {
      errors.name = "Please enter your name!";
    }

    if (!fields?.mobileNumber) {
      errors.mobileNumber = "Please enter your mobile number!";
    } else if (!regexPattern.test(fields.mobileNumber)) {
      errors.mobileNumber = "Invalid mobile number!";
    }

    if (Object.keys(errors).length > 0) {
      setFieldsErrors(errors);

      setTimeout(() => {
        setFieldsErrors({});
      }, 3000);
    } else {
      setSendOtpForRegistration(true)
      handleSendOtpForRegistration("email");
    }

  }

  return (
    <>

      <p className='para1'>VERIFY YOUR EMAIL TO COMPLETE YOUR <br /> REGISTRATION</p>
      <p className='para1'>ENTER OTP SENT ON    <strong>{loggedEmail}</strong>
        {/* <span><Image src={iconp} alt="iconp" className={``} /></span> */}
      </p>

      <div>
        <Image src={iconmail} alt="iconpass" className={`logo-m`} />
      </div>
      {sendOtpForRegistration ?
        <>
          <div className="otp-input-fields mt-3">
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
        </>
        :
        <form>
          <div className="row">
            <div className="col-md-6">
              <div className="frm">
                <label htmlFor="exampleInputName1" className="form-label new">Name </label>
                <input type="text" className="form-control new" placeholder="*Full Name" name="name" value={fields?.name} onChange={handelOnChange} />
                <span><Image src={icon5} alt="icon5" className={`icon2-m`} /></span>
              </div>
              <span style={{ color: "red", fontSize: "0.6rem" }}>{fieldsErrors?.name}</span>
            </div>
            <div className="col-md-6">
              <div className="frm">
                <label htmlFor="exampleInputPhone1" className="form-label new">Mobile Number <span>*</span></label>
                <input type="phone" className="form-control new" placeholder="*Enter mobile number" name="mobileNumber" value={fields?.mobileNumber} onChange={handelOnChange} />
                <span><Image src={icon6} alt="icon6" className={`icon2-m`} /></span>
              </div>
              <span style={{ color: "red", fontSize: "0.6rem" }}>{fieldsErrors?.mobileNumber}</span>
            </div>
          </div>
        </form>}

      {sendOtpForRegistration ?
        <button className="btn1 mt-4" onClick={() => handleFormSubmit()}>{"Verify"}</button>
        :
        <button className="btn1 mt-4" onClick={() => hanndleSubmitRegistration()}>{"Submit"}</button>
      }

    </>

  )
}

export default RegistrationEmail