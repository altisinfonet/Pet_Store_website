import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'
import logo from "../../../../../public/assets/images/favicon.png"
import icon from "../../../../../public/assets/icon/mobile.png"
import icon1 from "../../../../../public/assets/icon/email1.png"
import icon2 from "../../../../../public/assets/icon/mobile-number.png"
import icon3 from "../../../../../public/assets/icon/email.png"
import icon4 from "../../../../../public/assets/icon/indian-flag-icon.png"
import { emailRegax, isEmptyObject, phoneRegax } from '../../../../util/_common'
import { setOpenAuth } from '../../../../reducer/openAuthReducer'
import { useDispatch } from 'react-redux'
import axios from 'axios'
// import OtpInput from '../otpInput'
// rafce
const BeforeAuth = ({ handleCheckAuth }: any) => {
  const defaultFieldSet = {
    email: "",
    mobileNumber: "",
  }

  const dispatch = useDispatch()

  // const [email, setEmail] = useState('');
  // const [mobileNumber, setMobileNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [byCondition, setByCondition] = useState<any>("byOtp");

  const [fields, setFields] = useState(defaultFieldSet);
  const [fieldsErrors, setFieldsErrors] = useState<{ [x: string]: any }>(new Object());

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

    if ("email" === stateName) {
      runTimeValidationObject[stateName] = {
        v: stateValue,
        regax: emailRegax,
        m: "Invalid email address"
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
              [key]: "This fields are required!"
            }));
            valid = false;
          }
          if (fieldsErrors[key]) {
            valid = false;
          }
        }
      }
    } else {
      required_fields.forEach((item: any) => setFieldsErrors(pre => ({
        ...pre,
        [item]: "This fields are required!"
      })));
    }

    return valid;
  }

  // const handleEmailChange = (e: any) => {
  //   setEmail(e.target.value);
  // }

  // const handleMobileNumberChange = (e: any) => {
  //   setMobileNumber(e.target.value);
  // };

  const handleCountryCodeChange = (e: any) => {
    setCountryCode(e.target.value);
  };

  // const handleFormSubmit = (e: any) => {
  //   e.preventDefault();
  //   // Do something with the form data, like sending it to the server
  //   handleCheckAuth({ data: mobileNumber })
  // };
  const handleFormMobileSubmit = async (e?: any) => {
    let valid = false;
    valid = validation(fields, ["mobileNumber"]);

    if (valid) {
      handleCheckAuth({ data: fields?.mobileNumber, type: "loginMob" });
      //Send to whatsapp also
      // console.log("Sent to whatsapp");
      // try{
      //   const res=await axios.get("/send-test");
      //   console.log("This is my response",res);
      // }
      // catch(error){
      //   console.log(error.message);
      // }
    }
  }

  const handleFormEmailSubmit = (e?: any) => {
    let valid = false;
    valid = validation(fields, ["email"]);

    if (valid) {
      handleCheckAuth({ data: fields?.email, type: "loginEmail", condition: byCondition })
    }
  }

  const handleKeyDown = (event: any) => {
    if (fields?.mobileNumber !== "") {
      if (event.key === 'Enter') {
        handleFormMobileSubmit();
      }
    }
  }

  const handleKeyDownEmail = (event: any) => {
    if (fields?.email !== "") {
      if (event.key === 'Enter') {
        handleFormEmailSubmit();
      }
    }
  }


  const [authType, setAuthType] = useState("phone")

  return (
    <>
      {/* <div>
        <Image src={logo} alt="logo" width={110} height={56} className={`logo-m`} />
      </div> */}

      <ul className="nav nav-tabs mt-3" id="myTab" role="tablist">
        <li className="nav-item" role="presentation">
          {/* <button onClick={() => setAuthType("phone")} className={`B_Auth_hover nav-link ${authType === "phone" ? "active" : ""}`} type="button" > */}
          <button onClick={() => setAuthType("phone")} className={`${authType === "phone" ? "B_Auth_Open" : "B_Auth_Close"}`} type="button" >
            <div className='flex items-cnter'>
              <div >
                <Image src={icon} alt="icon" className={`icon-m`} />
              </div><div>Mobile Number <span>*</span></div>
            </div>
          </button>
        </li>
        <li className="nav-item" role="presentation">
          {/* <button onClick={() => setAuthType("email")} className={`B_Auth_hover nav-link ${authType === "email" ? "active" : ""}`} type="button"> */}
          <button onClick={() => setAuthType("email")} className={`${authType === "email" ? "B_Auth_Open" : "B_Auth_Close"}`} type="button">
            <div className='flex items-center mx-2'>
              <div>
                <Image src={icon1} alt="icon1" className={`icon-m`} />
              </div><div>By Email <span>*</span></div>
            </div>
          </button>
        </li>
        <div className="bor-nav"></div>
      </ul>
      <div className="tab-content" id="myTabContent">
        {/* mob */}
        {authType === "phone" ?
          <div>
            {/* <form onSubmit={handleFormSubmit}> */}
            <div className="frm mb-3 mt-3">
              <label htmlFor="exampleInputEmail1" className="form-label">Mobile Number <span>*</span></label>
              <div className="row gx-2">
                <div className="flag col-md-4 col-4">
                  <input disabled type="text" className="form-control" id="countryCode" value={countryCode} onChange={handleCountryCodeChange} placeholder='+91' />
                  {/* You may want to replace the Image component with an img tag if not using Next.js */}
                  <span><Image src={icon4} alt="icon2" className={`icon4-m`} /></span>
                </div>
                <div className="col-md-8 col-8">
                  <input type="tel" className="form-control" id="mobileNumber" value={fields?.mobileNumber} name='mobileNumber' onKeyDown={handleKeyDown} onChange={handelOnChange} aria-describedby="tel" placeholder='Mobile Number' />
                  <span><Image src={icon2} alt="icon2" className={`icon2-m`} /></span>
                </div>
                <div className='row mt-1'>
                  <span className='col-md-4 col-4'></span>
                  <span className="col-md-8 col-8 ps-3" style={{ color: "red", fontSize: "65%" }}>{fieldsErrors?.mobileNumber}</span>
                </div>
              </div>
            </div>
            <button type="submit" className="btn1" onClick={handleFormMobileSubmit}>Sign In</button>


            {/* </form> */}
          </div> : null}

        {/* email */}
        {authType === "email" ?
          <div>
            {/* <form> */}
            <div className="frm mb-2 mt-3">
              <label htmlFor="exampleInputEmail1" className="form-label">Email address <span>*</span></label>
              <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder='Enter Email Id' name='email' value={fields?.email} onKeyDown={handleKeyDownEmail} onChange={handelOnChange} />
              <span><Image src={icon3} alt="icon3" className={`icon3-m`} /></span>
            </div>
            <span style={{ color: "red", fontSize: "65%" }}>{fieldsErrors?.email}</span>

            <div className="row">
              <div className="col-md-4 col-5 pe-1">
                <div className="form-check authC flex items-center gap-2">
                  <input className="form-check-input cursor-pointer" type="radio" name="flexRadioDefault" id="flexRadioDefault1" value={"byPassword"} checked={byCondition === 'byPassword'} onChange={(e: any) => setByCondition(e.target.value)} />
                  <label className="form-check-label" htmlFor="flexRadioDefault1">
                    By Password
                  </label>
                </div>
              </div>
              <div className="col-md-4 col-4 ">
                <div className="form-check authC flex items-center gap-2">
                  <input className="form-check-input cursor-pointer" type="radio" name="flexRadioDefault" id="flexRadioDefault2" value={"byOtp"} checked={byCondition === 'byOtp'} onChange={(e: any) => setByCondition(e.target.value)} />
                  <label className="form-check-label" htmlFor="flexRadioDefault2">
                    By OTP
                  </label>
                </div>
              </div>
              <div className="col-md-4 col-3"></div>
            </div>


            <button type="submit" className="btn1 mt-1" onClick={handleFormEmailSubmit}>Sign In</button>
            {/* </form> */}
          </div> : null}
        <div className='flex justify-between'>
          <p className="para pt-2">By signing in you agree to our <Link href={"/terms-of-use"}>
            Terms & Conditions
          </Link></p>

          {/* <p className="para pt-2"
            onClick={() => {
              handleCheckAuth({ data: !fields?.mobileNumber ? "0" : fields?.mobileNumber, type: "loginMob" });
              console.log(fields?.mobileNumber, typeof (fields?.mobileNumber), "s4eeeed513")
            }}
            style={{ cursor: "pointer", fontWeight: "bold", textDecoration: "underline", fontSize: "14px", color: "#e4509d" }}>
            Sign Up
          </p> */}
        </div>
      </div>
    </>
  )
}

export default BeforeAuth