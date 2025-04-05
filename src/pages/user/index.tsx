import React, { useState } from 'react'
import TextField from '../../Admin/components/TextField';
import PinkPawsbutton from '../../Admin/components/PinkPawsbutton';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useRouter } from 'next/router';
import { isEmptyObject } from '../../util/_common';
import { _ERROR, _SUCCESS } from '../../util/_reactToast';
import { _post } from '../../services';

const ForgotPassword = () => {

  const router = useRouter();

  const defaultFieldSet = {
    credential: "",
  }

  const [invalid, setInvalid] = useState<boolean>(false);
  const [fieldsErrors, setFieldsErrors] = useState<{ [x: string]: any }>(new Object());
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [fields, setFields] = useState(defaultFieldSet);

  const [isMailsent, setIsMailSent] = useState(false);


  const invalidHtml = () => {
    return (
      <div className="css-haw22i absolute top-[8%]">
        <section data-testid="form-error" className="css-17m1kaw">
          <div className="css-1trnsdp flex items-center gap-2">
            <div className="css-14zxvl1">
              <span aria-hidden="true" className="css-1afrefi">
                <svg width="24" height="24" viewBox="0 0 24 24" role="presentation">
                  <g fill-rule="evenodd">
                    <path d="M12.938 4.967c-.518-.978-1.36-.974-1.876 0L3.938 18.425c-.518.978-.045 1.771 1.057 1.771h14.01c1.102 0 1.573-.797 1.057-1.771L12.938 4.967z" fill="red"></path>
                    <path d="M12 15a1 1 0 01-1-1V9a1 1 0 012 0v5a1 1 0 01-1 1m0 3a1 1 0 010-2 1 1 0 010 2" fill="#ffffff"></path>
                  </g>
                </svg>
              </span>
            </div>
            <div data-testid="form-error--content" className="css-t8lj6l">
              <span className="css-xal9c7 text-red-500">Incorrect email address and / or password.</span>
            </div>
          </div>
        </section>
      </div>
    )
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

  const handleKeyPress = (e: any) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const clearValidation = (stateName: string) => {
    setFieldsErrors(pre => ({
      ...pre,
      [stateName]: ""
    }));
  }

  const handelOnChange = (e: any) => {
    // console.log('llg: ', e.target.checked);
    const stateName = e.target.name;
    const stateValue = e.target.value;

    setFields(pre => ({
      ...pre,
      [stateName]: stateValue
    }));

    clearValidation(stateName);
  }


  const handleSubmit = async () => {
    try {
      let valid = false;

      valid = validation(fields, ["credential"]);

      if (valid) {
        console.log(fields);
        try {
          const response = await _post(`${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_API_SLUG}/set-reset-password-token`, {
            "email": fields.credential
          });
          setIsMailSent(response && response.data && response.data.success === true && true)
        } catch (error) {
          console.log(error.message, "Faild to send token");
          setIsMailSent(false);
        }

        setInvalid(false);
      }

      //   else {
      //     setButtonDisabled(false);
      //     setInvalid(false);
      //   }
    } catch (error: any) {
      _ERROR(error?.response?.data?.massage);
      // setButtonDisabled(false);
      // console.log('error: ', error);
      // setInvalid(true);
    }
  }




  // get token from query
  const { reset_password_token } = router.query;
  console.log(reset_password_token, "============")


  const [showPass, setShowPass] = useState<boolean>(false)

  const [passwordDetails, setPasswordDetails] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [passwordError, setPasswordError] = useState({
    newPasswordError: "",
    confirmPasswordError: "",
  });

  const passwordOnChangeHandler = (e: any) => {
    setPasswordDetails({ ...passwordDetails, [e.target.name]: e.target.value });
  };

  const restPasswordSubmit = async () => {

    if (!passwordDetails.newPassword) {
      setPasswordError({ ...passwordError, newPasswordError: "Please enter new password" });
      return;
    }
    if (!passwordDetails.confirmPassword) {
      setPasswordError({ ...passwordError, confirmPasswordError: "Please enter new password" });
      return;
    }
    if (passwordDetails.newPassword !== passwordDetails.confirmPassword) {
      setPasswordError({ ...passwordError, confirmPasswordError: "Both password should be same" });
      return;
    }

    try {
      const response = await _post(`${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_API_SLUG}/reset-password`, {
        "reset_password_token": reset_password_token,
        "new_password": passwordDetails.newPassword
      });
      if(response && response.data && response.data.success === true){
        _SUCCESS("Password reset successfully!");
        router.push("/admin/login");
      }
    } catch (error) {
      _ERROR(error?.response?.data?.massage);
      console.log(error);
    }

  }







  return (
    <>
      {
        !reset_password_token && !isMailsent && (
          <div className='flex container h-[70vh] items-center justify-center relative'>
            <div className='lg:w-[40%] w-[70%] h-fit sm:p-16 p-8 shadow-ppa-6xl rounded-2xl bg-white z-10 relative'>
              {invalid && invalidHtml()}
              <div className='text-xl font-semibold text-gray-900 flex items-center gap-2'>
                <div className='relative flex'>
                  <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-pink-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-pink-500"></span>
                </div>
                Forgot Password
              </div>
              <div className=''>
                <p className='py-2'>Email</p>
                <div className='flex flex-col gap-2'>
                  <div className='w-full border border-solid border-offWhite-02'>
                    <TextField className='!w-full p-1' placeholder='Enter email' name='credential' handelState={handelOnChange} onKeyDown={handleKeyPress} value={fields?.credential} />
                  </div>
                  <span style={{ color: "red" }}>{fieldsErrors?.credential}</span>
                </div>
              </div>

              {/* <div className=''>
            <p className='py-2'>Password</p>
            <div className='flex flex-col gap-2'>
              <div className='w-full border border-solid border-offWhite-02 relative'>
                <TextField className='!w-full p-1' placeholder='Enter password' type={showPass ? 'text' : 'password'} name='password' handelState={handelOnChange} onKeyDown={handleKeyPress} value={fields?.password} />
                <div className='absolute top-1 right-2 cursor-pointer' onClick={() => setShowPass(!showPass)}>{showPass ? <RemoveRedEyeIcon fontSize='small' className='text-gray-500' /> : <VisibilityOffIcon fontSize='small' className='text-gray-500' />}</div>
              </div>
              <span style={{ color: "red" }}>{fieldsErrors?.password}</span>
            </div>
          </div> */}
              <div className='w-full flex items-center justify-end py-2'>
                <PinkPawsbutton
                  variant={"solid"}
                  name={"Submit"}
                  icon={""}
                  handleClick={handleSubmit}
                  pinkPawsButtonExtraCls={""}
                  style={{}}
                  disabled={buttonDisabled}
                  title={""}
                />
              </div>
            </div>
            <div className='lg:w-[42%] w-[72%] h-[23rem] shadow-ppa-6xl rounded-2xl absolute -rotate-[8deg] bg-gradient-to-r from-pink-400 to-pink-500'></div>
          </div>
        )
      }

      {
        reset_password_token && (
          <>
            <div className='flex container h-[70vh] items-center justify-center relative'>
              <div className='lg:w-[40%] w-[70%] h-fit sm:p-16 p-8 shadow-ppa-6xl rounded-2xl bg-white z-10 relative'>
                <div className='text-xl font-semibold text-gray-900 flex items-center gap-2'>
                  <div className='relative flex'>
                    <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-pink-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-pink-500"></span>
                  </div>
                  Generate new password
                </div>

                <div className=''>
                  <p className='py-2'>Password</p>
                  <div className='flex flex-col gap-2'>
                    <div className='w-full border border-solid border-offWhite-02 relative'>
                      <TextField className='!w-full p-1' placeholder='Enter password' name='newPassword' type={showPass ? 'text' : 'password'} handelState={passwordOnChangeHandler} value={passwordDetails.newPassword} />
                      <div className='absolute top-1 right-2 cursor-pointer' onClick={() => setShowPass(!showPass)}>{showPass ? <RemoveRedEyeIcon fontSize='small' className='text-gray-500' /> : <VisibilityOffIcon fontSize='small' className='text-gray-500' />}</div>
                    </div>
                    <span style={{ color: "red" }}>{passwordError && passwordError.newPasswordError && passwordError.newPasswordError}</span>
                  </div>
                </div>
                <div className=''>
                  <p className='py-2'>Confirm Password</p>
                  <div className='flex flex-col gap-2'>
                    <div className='w-full border border-solid border-offWhite-02 relative'>
                      <TextField className='!w-full p-1' placeholder='Enter confirm password' name='confirmPassword' type={showPass ? 'text' : 'password'} handelState={passwordOnChangeHandler} value={passwordDetails.confirmPassword} />
                      <div className='absolute top-1 right-2 cursor-pointer' onClick={() => setShowPass(!showPass)}>{showPass ? <RemoveRedEyeIcon fontSize='small' className='text-gray-500' /> : <VisibilityOffIcon fontSize='small' className='text-gray-500' />}</div>
                    </div>
                    <span style={{ color: "red" }}>{passwordError && passwordError.confirmPasswordError && passwordError.confirmPasswordError}</span>
                  </div>
                </div>


                <div className='w-full flex items-center justify-end py-2'>
                  <PinkPawsbutton
                    variant={"solid"}
                    name={"Submit"}
                    icon={""}
                    handleClick={restPasswordSubmit}
                    pinkPawsButtonExtraCls={""}
                    style={{}}
                    disabled={buttonDisabled}
                    title={""}
                  />
                </div>
              </div>
              <div className='lg:w-[42%] w-[72%] h-[23rem] shadow-ppa-6xl rounded-2xl absolute -rotate-[8deg] bg-gradient-to-r from-pink-400 to-pink-500'></div>
            </div>
          </>
        )
      }


      {
        isMailsent &&
        <div className='flex container h-[70vh] items-center justify-center relative'>
          <div className='lg:w-[40%] w-[70%] h-fit sm:p-16 p-8 shadow-ppa-6xl rounded-2xl bg-white z-10 relative'>
            <div className='text-xl font-semibold text-gray-900 flex items-center gap-2'>
              <div className='relative flex'>
                <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-pink-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-pink-500"></span>
              </div>
              Reset password link sent to your email
            </div>
          </div>
          <div className='lg:w-[42%] w-[72%] h-[23rem] shadow-ppa-6xl rounded-2xl absolute -rotate-[8deg] bg-gradient-to-r from-pink-400 to-pink-500'></div>
        </div>
      }
    </>
  )
}

export default ForgotPassword