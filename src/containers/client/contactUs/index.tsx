import React, { useEffect, useState } from 'react';
import getUrlWithKey from '../../../util/_apiUrl';
import { useCreate } from '../../../hooks';
import { _ERROR, _SUCCESS } from '../../../util/_reactToast';
import { useSelector } from 'react-redux';

interface FormData {
    name: string;
    email: string;
    subject: string;
    message: string;
}

const ContactUs: React.FC = () => {
    const { create_contact_us } = getUrlWithKey("client_apis");
    const getLinlName = useSelector((state: any) => state?.linkNameReducer?.value);

    const [createUrl, setCreateUrl]: any = useState("");
    const [errors, setErrors] = useState<Partial<FormData>>({})

    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    console.log(getLinlName, "create_contact_us")
    const { sendData: createContact, error: createContactError }: any = useCreate({ url: createUrl, callData: formData });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
        // setErrors(prevErrors => ({
        //     ...prevErrors,
        //     [name]: value ? '' : `Please enter your ${name}`
        // }));
        setErrors((prevErrors) => {
            const newErrors = { ...prevErrors };
            if (name === "name" && !/^[A-Za-z\s]+$/.test(value)) {
                newErrors.name = "Name must contain only alphabets.";
            } else if (name === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                newErrors.email = "Please enter a valid email address.";
            } else if ((name === "subject" || name === "message") && value.trim() === "") {
                newErrors[name] = `Please enter a ${name}.`;
            } else {
                newErrors[name] = "";
            }
            return newErrors;
        });
    };

    const handleSubmit = (e: React.FormEvent<HTMLButtonElement>) => {
        e.preventDefault();
        // Validate form before submission
        let isValid = true;
        const newErrors: Partial<FormData> = {};

        // Name validation
        if (!formData.name || !/^[A-Za-z\s]+$/.test(formData.name)) {
            newErrors.name = "Name cannot be empty.";
            isValid = false;
        }

        // Email validation
        if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Please enter a valid email address.";
            isValid = false;
        }

        // Subject and message validation
        if (!formData.subject.trim()) {
            newErrors.subject = "Subject cannot be empty.";
            isValid = false;
        }
        if (!formData.message.trim()) {
            newErrors.message = "Message cannot be empty.";
            isValid = false;
        }

        setErrors(newErrors);

        console.log('uuuuuuuuuuuuuu', isValid)
        if (isValid) {
            // Form submission logic
            setCreateUrl(create_contact_us);
        }
    };

    const clear = (error: boolean = false) => {
        setCreateUrl("");
        setFormData({
            name: '',
            email: '',
            subject: '',
            message: ''
        });
        !error ? _SUCCESS("Contact form submitted successfully!") : _ERROR("Something went to wrong");
    }

    useEffect(() => {
        if (!createContactError && createContact && createContact?.id) {
            clear();
        }

        if (createContactError) {
            clear(true);
        }

    }, [createContact, createContactError]);

    return (
        <>
            <section className='contact mt-4'>
                <div className="container">

                    <div className=" flex items-center justify-center w-full uppercase font-medium ppsL"><h1 className="sp-title" style={{ fontSize: "150%" }}>{getLinlName || "Contact us"}</h1></div>

                    <div className="contact-card mt-3">
                        <div className="card-body">
                            <div className="row" style={{ paddingTop: "30px" }}>
                                <div className="col-lg-5">
                                    <div className="">
                                        <div className="">
                                            <h3 className='store-title mign' data-aos="fade-down">Mignonne Pinkpaws Pet Care Private Limited</h3>
                                            <h3 className='store-title salt pt-3' data-aos="fade-down">SaltLake Branch</h3>
                                            <div className="media address-box" data-aos="fade-down">
                                                <div className="thumb"><img src="/assets/images/location.png" alt="location" className='thu-icn1' /></div>
                                                <div className="media-body">
                                                    <p>Main Office Address:<br />
                                                        AC 102, Salt Lake Sector 1, <br /> Kolkata, West Bengal 700064
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="responsive-map mt-4" data-aos="zoom-out">
                                                <iframe
                                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3683.846709253038!2d88.40061!3d22.5938764!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a0275f5539aebe1%3A0xb91555df13fe66fe!2sPink%20Paws%20Corporate%20Office!5e0!3m2!1sen!2sin!4v1693822123487!5m2!1sen!2sin"
                                                    width="600"
                                                    height="550"
                                                    // style={{ border: "0" }}
                                                    loading="lazy"
                                                    className='border-0'
                                                ></iframe>
                                            </div>
                                            <div className="media address-box items-center mt-4" data-aos="fade-down">
                                                <div className="thumb">
                                                    <img src="/assets/images/phone.png" alt="phone" className='thu-icn' /></div>
                                                <div className="media-body custo">
                                                    <p className='mb-0'><a href="tel:+919147182149">+91 9147182149</a></p>
                                                </div>
                                            </div>

                                            <div className="media address-box items-center" data-aos="fade-down">
                                                <div className="thumb"><img src="/assets/images/envlop.png" alt="envlop" className='thu-icn' style={{width:"150px", height:"150px"}} /></div>
                                                <div className="media-body custo">
                                                    <p className='mb-0'><a href="mailto:customercare@pinkpaws.co.in">customercare@pinkpaws.co.in</a>
                                                    </p>
                                                </div>
                                            </div>
                                            {/* <div className="blink pt-3">We deliver across Eastern India region.</div> */}



                                        </div>
                                    </div>

                                </div>
                                <div className="col-lg-7 mt-4 mt-lg-0 ps-lg-5" data-aos="fade-left">
                                    <div className="" >
                                        <div className="">
                                            <div className="mb-3">
                                                <label htmlFor="name" className="col-form-label stor pt-0">Name</label>
                                                <input type="text" id="name" name="name" className="form-control cont" aria-describedby="" placeholder='Enter Your Name..' value={formData.name} onChange={handleChange} />
                                                {errors.name && <span className="error">{errors.name}</span>}
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="email" className="col-form-label stor pt-0">Email</label>
                                                <input type="text" id="email" name="email" className="form-control cont" aria-describedby="" placeholder='Enter Your Email' value={formData.email} onChange={handleChange} />
                                                {errors.email && <span className="error">{errors.email}</span>}
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="subject" className="col-form-label stor pt-0">Subject</label>
                                                <input type="text" id="subject" name="subject" className="form-control cont" aria-describedby="" placeholder='Enter Your Subject' value={formData.subject} onChange={handleChange} />
                                                {errors.subject && <span className="error">{errors.subject}</span>}
                                            </div>
                                            <div className="mb-4">
                                                <label htmlFor="message" className="col-form-label stor pt-0"> Message</label>
                                                <textarea className="form-control textarea" id="message" name="message" rows={6} placeholder='Enter Your Messages' value={formData.message} onChange={handleChange}></textarea>
                                                {errors.message && <span className="error">{errors.message}</span>}
                                            </div>
                                            <button className='show-btn mt-lg-0' onClick={handleSubmit}>Submit</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>




                    {/* <div className="contact-map mt-5">
                        <div className="responsive-map">
                            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2822.7806761080233!2d-93.29138368446431!3d44.96844997909819!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x52b32b6ee2c87c91%3A0xc20dff2748d2bd92!2sWalker+Art+Center!5e0!3m2!1sen!2sus!4v1514524647889" width="100%" height="420" frameBorder="0" allowFullScreen></iframe>
                        </div>
                    </div> */}
                </div>
            </section>
        </>
    )
}

export default ContactUs