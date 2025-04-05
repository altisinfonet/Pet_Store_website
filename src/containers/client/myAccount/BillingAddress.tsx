import React from 'react'

const BillingAddress = () => {
    const addressbox = [
        {
            id: 1,
            name: "Shiltu Kumar Ghosh",
            adderss: "Subarnaprova, Flat-2A.2nd Floor. 18/1/1, Dakshinpara road, Baguihati, Kolkata, West Bengal 700028, India",
            Phone: "9881215456",
        },

        {
            id: 2,
            name: "Shiltu Kumar Ghosh",
            adderss: "Subarnaprova, Flat-2A.2nd Floor. 18/1/1, Dakshinpara road, Baguihati, Kolkata, West Bengal 700028, India",
            Phone: "9881215456",
        },
        {
            id: 3,
            name: "Shiltu Kumar Ghosh",
            adderss: "Subarnaprova, Flat-2A.2nd Floor. 18/1/1, Dakshinpara road, Baguihati, Kolkata, West Bengal 700028, India",
            Phone: "9881215456",
        },
        {
            id: 4,
            name: "Shiltu Kumar Ghosh",
            adderss: "Subarnaprova, Flat-2A.2nd Floor. 18/1/1, Dakshinpara road, Baguihati, Kolkata, West Bengal 700028, India",
            Phone: "9881215456",
        },
        {
            id: 5,
            name: "Shiltu Kumar Ghosh",
            adderss: "Subarnaprova, Flat-2A.2nd Floor. 18/1/1, Dakshinpara road, Baguihati, Kolkata, West Bengal 700028, India",
            Phone: "9881215456",
        },
        {
            id: 6,
            name: "Shiltu Kumar Ghosh",
            adderss: "Subarnaprova, Flat-2A.2nd Floor. 18/1/1, Dakshinpara road, Baguihati, Kolkata, West Bengal 700028, India",
            Phone: "9881215456",
        },
        {
            id: 7,
            name: "Shiltu Kumar Ghosh",
            adderss: "Subarnaprova, Flat-2A.2nd Floor. 18/1/1, Dakshinpara road, Baguihati, Kolkata, West Bengal 700028, India",
            Phone: "9881215456",
        },
    ];
    return (
        <>
            <section className='BillingAddress_sec'>
                <div className='container'>
                    <div className='allbilling_address'>

                        <div className='singAddress_box deshborder'>
                            <button className='address_addbtn'>
                                <span className='icon'><i className="fa-solid fa-plus"></i></span>
                                <h4 className='head'>Add address</h4>
                            </button>
                        </div>

                        {addressbox.map((items, index) => {
                            return (
                                <div className='singAddress_box' key={index}>
                                    <h4 className='name'>{items.name}</h4>
                                    <p className='adderss'>{items.adderss}</p>
                                    <p className='phone'>Phone Number: <span>{items.Phone}</span></p>

                                    <ul className='bottom_area'>
                                        <li><button className='hero_btn'>Edit</button></li>
                                        <li><button className='hero_btn'>Remove</button></li>
                                        <li><button className='hero_btn'>Set as Default</button></li>
                                    </ul>
                                </div>
                            )
                        })}

                    </div>
                </div>
            </section>
        </>
    )
}

export default BillingAddress
