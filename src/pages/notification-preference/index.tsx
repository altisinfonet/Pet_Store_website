// import React, { useState, useEffect } from 'react';
// import { Tabs, Tab, Box } from '@mui/material';
// import { _get, _post } from '../../services';




// function TabPanel(props) {
//     const { children, value, index } = props;
//     return (
//         <div role="tabpanel" hidden={value !== index}>
//             {value === index && (
//                 <Box sx={{ p: 3 }}>
//                     {children}
//                 </Box>
//             )}
//         </div>
//     );
// }

// const NotificationPreference = () => {

//     const data = [
//         {
//             id: '1',
//             name: 'Push',
//             key: '_push',
//             sub_categories: [
//                 { id: '2', name: 'My Orders', key: '_push_my_orders', checked: true },
//                 { id: '3', name: 'Abandoned Cart', key: '_push_abandoned_cart', checked: false },
//                 { id: '4', name: 'Restock Reminders', key: '_push_restock_reminders', checked: true },
//                 { id: '5', name: 'New Offers', key: '_push_new_offers', checked: false },
//                 { id: '6', name: 'Announcement', key: '_push_announcement', checked: true }
//             ]
//         },
//         {
//             id: '7',
//             name: 'Email',
//             key: '_email',
//             sub_categories: [
//                 { id: '8', name: 'My Orders', key: '_email_my_orders', checked: false },
//                 { id: '9', name: 'Abandoned Cart', key: '_email_abandoned_cart', checked: false },
//                 { id: '10', name: 'Restock Reminders', key: '_email_restock_reminders', checked: false },
//                 { id: '11', name: 'New Offers', key: '_email_new_offers', checked: true },
//                 { id: '12', name: 'Announcement', key: '_email_announcement', checked: false }
//             ]
//         },
//         {
//             id: '13',
//             name: 'SMS',
//             key: '_sms',
//             sub_categories: [
//                 { id: '14', name: 'My Orders', key: '_sms_my_orders', checked: false },
//                 { id: '15', name: 'Abandoned Cart', key: '_sms_abandoned_cart', checked: true },
//                 { id: '16', name: 'Restock Reminders', key: '_sms_restock_reminders', checked: false },
//                 { id: '17', name: 'New Offers', key: '_sms_new_offers', checked: true },
//                 { id: '18', name: 'Announcement', key: '_sms_announcement', checked: false }
//             ]
//         },
//         {
//             id: '19',
//             name: 'WhatsApp',
//             key: '_whatsapp',
//             sub_categories: [
//                 { id: '20', name: 'My Orders', key: '_whatsapp_my_orders', checked: true },
//                 { id: '21', name: 'Abandoned Cart', key: '_whatsapp_abandoned_cart', checked: false },
//                 { id: '22', name: 'Restock Reminders', key: '_whatsapp_restock_reminders', checked: false },
//                 { id: '23', name: 'New Offers', key: '_whatsapp_new_offers', checked: true },
//                 { id: '24', name: 'Announcement', key: '_whatsapp_announcement', checked: true }
//             ]
//         }
//     ];




//     const [tabData, setTabData] = useState([]);
//     const allPref = async () => {
//         try {
//             const response = await _get(`${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_API_SLUG}/notification-preferences`);
//             // console.log(response && response.data && response.data.data);
//             setTabData(response && response.data && response.data.data);
//         } catch (error) {
//             console.log(error.message)
//         }
//     };

//     useEffect(() => {
//         allPref()
//     }, [])




//     const [selectedTab, setSelectedTab] = useState(0);


//     const handleTabChange = (index: any) => {
//         setSelectedTab(index);
//     };



//     const updatePreferenceValue = async (data) => {
//         try {
//             const updateData = await _post(`${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_API_SLUG}/update-notification-preferences`, data);
//             console.log(updateData.data)
//         } catch (error) {
//             console.log(error.message, "<======Update Preference Error======>")
//         }
//     }


//     // Handle checkbox toggle
//     const handleCheckboxChange = (tabIndex: any, subCategoryIndex: any) => {
//         setTabData(prevData => {
//             const updatedData = [...prevData];
//             const updatedSubCategory = {
//                 ...updatedData[tabIndex].sub_categories[subCategoryIndex],
//                 checked: !updatedData[tabIndex].sub_categories[subCategoryIndex].checked
//             };
//             updatedData[tabIndex].sub_categories[subCategoryIndex] = updatedSubCategory;

//             // Creating payload
//             const payload = { id: updatedSubCategory.id, checked: updatedSubCategory.checked };

//             // Log the payload here, where it is defined
//             console.log(payload, "<===========>");

//             payload && updatePreferenceValue(payload)
//             return updatedData;
//         });
//     };










//     return (
//         <>
//             <div className="w-full mx-auto my-20" style={{
//                 padding:"0px 30px"
//             }}>
//                 <h3 style={{ paddingRight: "9px" }} className="w-fit sp-title accountHeader">Notification Preference</h3>
//                 {/* Tab Buttons */}
//                 <div className="flex gap-2 mt-10">
//                     {data.map((item, index) => (
//                         <p
//                             key={item.id}
//                             className={`py-2 px-4 text-lg font-semibold border-none bg-white cursor-pointer ${selectedTab === index ? 'text-pink-500 border-b-2 border-blue-500' : 'text-gray-600'}`}
//                             onClick={() => handleTabChange(index)}
//                         >
//                             {item.name}
//                         </p>
//                     ))}
//                 </div>

//                 {/* Tab Panels */}
//                 <div className="mt-2 p-4">
//                     {tabData[selectedTab] && (
//                         <div>
//                             {/* <h2 className="text-xl font-semibold mb-4">{tabData[selectedTab].name} Subcategories</h2> */}
//                             <div className="space-y-1">
//                                 {tabData[selectedTab].sub_categories.map((subCategory:any, subCategoryIndex:any) => (
//                                     <div key={subCategory.id} className="flex align-items-center gap-2">
//                                         <input
//                                             type="checkbox"
//                                             id={subCategory.key}
//                                             checked={subCategory.checked}
//                                             onChange={() => handleCheckboxChange(selectedTab, subCategoryIndex)}
//                                             className="mr-2"
//                                         />
//                                         <label htmlFor={subCategory.key} className="text-gray-700">{subCategory.name}</label>
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </>
//     )
// }

// export default NotificationPreference


import React, { useState, useEffect } from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import { _get, _post } from '../../services';
import { useRouter } from 'next/router';
import { Notifications, Email, Sms, WhatsApp } from '@mui/icons-material';

function TabPanel(props) {
    const { children, value, index } = props;
    return (
        <div role="tabpanel" hidden={value !== index}>
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

const NotificationPreference = () => {
    const data = [
        {
            id: '1',
            name: 'Push',
            key: '_push',
            icon: <Notifications />,
            sub_categories: [
                { id: '2', name: 'My Orders', key: '_push_my_orders', checked: true },
                { id: '3', name: 'Abandoned Cart', key: '_push_abandoned_cart', checked: false },
                { id: '4', name: 'Restock Reminders', key: '_push_restock_reminders', checked: true },
                { id: '5', name: 'New Offers', key: '_push_new_offers', checked: false },
                { id: '6', name: 'Announcement', key: '_push_announcement', checked: true }
            ]
        },
        {
            id: '7',
            name: 'Email',
            key: '_email',
            icon: <Email />,
            sub_categories: [
                { id: '8', name: 'My Orders', key: '_email_my_orders', checked: false },
                { id: '9', name: 'Abandoned Cart', key: '_email_abandoned_cart', checked: false },
                { id: '10', name: 'Restock Reminders', key: '_email_restock_reminders', checked: false },
                { id: '11', name: 'New Offers', key: '_email_new_offers', checked: true },
                { id: '12', name: 'Announcement', key: '_email_announcement', checked: false }
            ]
        },
        {
            id: '13',
            name: 'SMS',
            key: '_sms',
            icon: <Sms />,
            sub_categories: [
                { id: '14', name: 'My Orders', key: '_sms_my_orders', checked: false },
                { id: '15', name: 'Abandoned Cart', key: '_sms_abandoned_cart', checked: true },
                { id: '16', name: 'Restock Reminders', key: '_sms_restock_reminders', checked: false },
                { id: '17', name: 'New Offers', key: '_sms_new_offers', checked: true },
                { id: '18', name: 'Announcement', key: '_sms_announcement', checked: false }
            ]
        },
        {
            id: '19',
            name: 'WhatsApp',
            key: '_whatsapp',
            icon: <WhatsApp />,
            sub_categories: [
                { id: '20', name: 'My Orders', key: '_whatsapp_my_orders', checked: true },
                { id: '21', name: 'Abandoned Cart', key: '_whatsapp_abandoned_cart', checked: false },
                { id: '22', name: 'Restock Reminders', key: '_whatsapp_restock_reminders', checked: false },
                { id: '23', name: 'New Offers', key: '_whatsapp_new_offers', checked: true },
                { id: '24', name: 'Announcement', key: '_whatsapp_announcement', checked: true }
            ]
        }
    ];
    const router = useRouter();
    const [tabData, setTabData] = useState([]);
    const allPref = async () => {
        try {
            const response = await _get(`${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_API_SLUG}/notification-preferences`);
            setTabData(response?.data?.data);
        } catch (error) {
            console.log(error.message);
        }
    };

    useEffect(() => {
        allPref();
    }, []);

    const [selectedTab, setSelectedTab] = useState(0);

    const handleTabChange = (index: any) => {
        setSelectedTab(index);
    };

    const updatePreferenceValue = async (data) => {
        try {
            const updateData = await _post(`${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_API_SLUG}/update-notification-preferences`, data);
            console.log(updateData.data);
        } catch (error) {
            console.log(error.message, "<======Update Preference Error======>");
        }
    }

    const handleCheckboxChange = (tabIndex: any, subCategoryIndex: any) => {
        setTabData(prevData => {
            const updatedData = [...prevData];
            const updatedSubCategory = {
                ...updatedData[tabIndex].sub_categories[subCategoryIndex],
                checked: !updatedData[tabIndex].sub_categories[subCategoryIndex].checked
            };
            updatedData[tabIndex].sub_categories[subCategoryIndex] = updatedSubCategory;

            const payload = { id: updatedSubCategory.id, checked: updatedSubCategory.checked };
            payload && updatePreferenceValue(payload);
            return updatedData;
        });
    };

    return (
        <div className="container mx-auto px-4">
            <div className="my-account mt-3">
                <div className="flex justify-between items-center mb-3">
                    <h3 className="w-fit sp-title accountHeader text-xl md:text-3xl font-semibold text-gray-900">Notification Preference</h3>
                    <button className="show-btn1 mb-3 h-fit flex items-center gap-2 text-sm md:text-base"
                        onClick={() => router.push('/myaccount')}
                    >
                        <i className="fa-solid fa-arrow-left-long" style={{ paddingLeft: "8px", padding: "4px" }}></i>
                        <span>back</span>
                    </button>
                </div>

                {/* Tab Buttons */}
                <div className="flex flex-wrap gap-4 mt-6 mb-3">
                    {data.map((item, index) => (
                        <p
                            key={item.id}
                            className={`flex items-center justify-center gap-1 px-3 py-1 rounded-md text-lg font-semibold cursor-pointer transition-all ease-in-out duration-200 ${selectedTab === index ? 'bg-pink-500 text-white shadow' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                            onClick={() => handleTabChange(index)}
                        >
                            {/* {item.name} */}
                            <span className='-mt-1'>{item.icon}</span>
                            <span className='mt-1'>{item.name}</span>
                        </p>
                    ))}
                </div>

                {/* Tab Panels */}
                <div className="mt-6">
                    {tabData[selectedTab] && (
                        <div>
                            <div className="space-y-4">
                                {tabData[selectedTab].sub_categories.map((subCategory: any, subCategoryIndex: any) => (
                                    <div key={subCategory.id} className="flex items-center gap-4">
                                        <input
                                            type="checkbox"
                                            id={subCategory.key}
                                            checked={subCategory.checked}
                                            onChange={() => handleCheckboxChange(selectedTab, subCategoryIndex)}
                                            className="form-checkbox h-5 w-5 text-pink-500 rounded transition-colors ease-in-out duration-200 cursor-pointer"
                                        />
                                        <label htmlFor={subCategory.key} className="text-lg text-gray-500 font-semibold">{subCategory.name}</label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>

    );
}

export default NotificationPreference;
