import Image from 'next/image'
import Link from 'next/link'
import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import iconp from "../../../../../public/assets/icon/pencil.png"
import icon5 from "../../../../../public/assets/icon/full-name.png"
import icon6 from "../../../../../public/assets/icon/email-id.png"
import { emailRegax, isEmptyObject, phoneRegax } from '../../../../util/_common'

const RegitrationMobile = ({ handleRegitrationMobile, loggedPhone, loginOtpData, resendOtp, handleSendOtpForRegistration }) => {

  const myRef = useRef;

  const defaultFieldSet = {
    email: "",
    name: "",
  }

  // const [num1, setNum1] = useState<number>(null);
  // const [num2, setNum2] = useState<number>(null);
  // const [num3, setNum3] = useState<number>(null);
  // const [num4, setNum4] = useState<number>(null);
  // const [name, setName] = useState<string>("");
  // const [email, setEmail] = useState<string>("");
  const numDigits = 4;
  const [otp, setOtp] = useState<string[]>(Array(numDigits).fill(''));
  const otpFields = Array(numDigits).fill(0).map(() => myRef<HTMLInputElement>(null));

  const [fields, setFields] = useState(defaultFieldSet);
  const [fieldsErrors, setFieldsErrors] = useState<{ [x: string]: any }>(new Object());
  const [sendOtpForRegistration, setSendOtpForRegistration] = useState<boolean>(false);

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

    // Update field values
    setFields((prev) => ({
      ...prev,
      [stateName]: stateValue,
    }));

    // Define runtime validation rules dynamically
    const runtimeValidationRules: Record<string, any> = {
      name: {
        v: stateValue,
        m: "Please enter your name!",
        validate: (val: string) => val.trim() !== "",
      },
      email: {
        v: stateValue,
        m: "Please enter your email!",
        validate: (val: string) => val.trim() !== "",
      },
    };

    // Check if the current field needs validation
    if (runtimeValidationRules[stateName]) {
      const { v, m, validate } = runtimeValidationRules[stateName];
      if (!validate(v)) {
        setFieldsErrors((prev) => ({
          ...prev,
          [stateName]: m,
        }));
      } else {
        clearValidation(stateName);
      }
    }
  };


  const runTimeValidationField = (dataSet: Record<string, any>) => {
    Object.keys(dataSet).forEach((key) => {
      const { v, regax, m } = dataSet[key];
      if (!regax?.(v)) {
        setFieldsErrors((prev) => ({
          ...prev,
          [key]: m,
        }));
      } else {
        clearValidation(key);
      }
    });
  };

  const clearValidation = (stateName: string) => {
    setFieldsErrors((prev) => ({
      ...prev,
      [stateName]: "",
    }));
  };

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

  const handleRegisterSubmit = () => {
    let errors: Record<string, string> = {};
    const emailRegax = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!fields?.name || fields.name?.trim() === "") {
      errors.name = "Please enter your name!";
    }
    if (!fields?.email || !emailRegax?.test(fields.email)) {
      errors.email = "Please enter a valid email!";
    }

    if (Object.keys(errors).length > 0) {
      setFieldsErrors(errors);
      return; // Exit the function if there are errors
    }

    setFieldsErrors({});
    setSendOtpForRegistration(true)
  }

  const handleFormSubmit = () => {
    console.log("handleFormSubmit")
    let valid = false;
    valid = validation(fields, ["name", "email"]);

    if ((otp.length === 4) && valid) {
      // const submittedOtp = `${num1}${num2}${num3}${num4}`;
      const submittedOtp = `${otp[0]}${otp[1]}${otp[2]}${otp[3]}`;

      const splitName = fields?.name.split(" ");
      const first_name = splitName[0];
      const last_name = splitName.length > 1 ? splitName[1] : "";
      const type = 'p';
      const data = {
        first_name,
        last_name,
        type,
        otp: submittedOtp,
        common_credential: fields?.email
      }
      console.log(data, "ds541g3f5d2")
      handleRegitrationMobile({ first_name, last_name, type, otp: submittedOtp, common_credential: fields?.email });
    }
    // Do something with the form data, like sending it to the server
    // handleCheckAuth({ data: mobileNumber })
  };

  useEffect(() => {
    if (sendOtpForRegistration) {
      handleSendOtpForRegistration("mbo")
    }
  }, [sendOtpForRegistration]);

  return (
    <>

      <p className='para1'>VERIFY YOUR MOBILE NUMBER TO COMPLETE YOUR <br /> REGISTRATION</p>
      <p className='para1'>ENTER OTP SENT ON    <strong >+91 {loggedPhone}</strong>
        {/* <span><Image src={iconp} alt="iconp" className={``} /></span> */}
      </p>

      {sendOtpForRegistration ?
        <>
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
          </div>

          {loginOtpData === "Time Out" ?
            resendOtp
            :
            <p className='para-new'>{loginOtpData}</p>
          }
        </>
        :

        <form>
          <div className="col">
            <div className="col-md-12">
              <div className="frm">
                <label htmlFor="exampleInputName1" className="form-label new">Name* </label>
                <input type="text" className="form-control new" placeholder="*Full Name" name="name" value={fields?.name} onChange={handelOnChange} />
                <span><Image src={icon5} alt="icon5" className={`icon2-m`} /></span>
              </div>
              <span style={{ color: "red", fontSize: "0.6rem" }}>{fieldsErrors?.name}</span>
            </div>
            <div className="col-md-12">
              <div className="frm">
                <label htmlFor="exampleInputEmail1" className="form-label new">Email <span>*</span></label>
                <input type="email" className="form-control new" placeholder="*Enter email" name="email" value={fields?.email} onChange={handelOnChange} />
                <span><Image src={icon6} alt="icon6" className={`icon2-m`} /></span>
              </div>
              <span style={{ color: "red", fontSize: "0.6rem" }}>{fieldsErrors?.email}</span>
            </div>
          </div>
        </form>
      }

      {sendOtpForRegistration ?
        <button className="btn1 mt-4" onClick={() => handleFormSubmit()}>{"Verify"}</button>
        :
        <button className="btn1 mt-4" onClick={() => handleRegisterSubmit()}>{"Submit"}</button>
      }

    </>

  )
}

export default RegitrationMobile