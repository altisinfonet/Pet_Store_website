import React, { useEffect, useState } from 'react'
import ActionDrop from '../../components/ActionDrop'
import Pageination from '../../components/Pageination'
import useTabView from '../../../hooks/useTabView'
import { Checkbox, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material'
import Image from 'next/image'
import productImage from "../../../../public/assets/images/product.png"
import moment from 'moment'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useRead, useCreate } from '../../../hooks'
import getUrlWithKey from '../../util/_apiUrl'
import SearchField from '../../components/SearchField'
import ButtonField from '../../components/ButtonField'
import PinkPawsbutton from '../../components/PinkPawsbutton'
import FullpageModal from '../../components/FullPageModal'
import DynamicForm from '../../components/Form'
import Form from './form'
import RightSideModal from '../../components/RightSideModal'
import SearchAndAddNewComponent from '../../components/searchAddNewComponent'
import { _ERROR, _SUCCESS } from '../../util/_reactToast'
import axios from 'axios'
import { emailRegax, phoneRegax } from '../../util/_common'

const UsersPage = () => {

    const uploadDataSet = {
        username: "",
        email: "",
        phone_no: "",
        first_name: "",
        last_name: "",
        password: "",
        role: ""
    }

    const [actionValue, setActionValue] = useState("delete")
    const [pageNo, setPageNo] = useState(1)
    const [prodCheck, setProdCheck]: any = useState({})
    const [acordian, setAcordian]: any = useState()
    const [getProd, setGetProd]: any = useState({ page: pageNo ? pageNo : 1, rowsPerPage: 10 })
    const [openFullModal, setOpenFullModal]: any = useState(false)
    const [dataSet2, setDataSet2] = useState<any>(uploadDataSet);
    const [create_user_url, setCreateUserUrl] = useState<string>("");
    const [get_user_by_id_url, setGetUserByIDUrl] = useState<string>("");
    const [preState, setPreState] = useState<any>(new Object);
    const [totalUserGetUrl, setTotalUserGetUrl] = useState("");
    const [checked, setChecked] = useState<any[]>([]);
    // const [getUse, setGetUse] = useState()
    const defaultForm = {
        "username": {
            type: "textField",
            fieldType: "text",
            id: "username",
            name: "username",
            label: "Username (required)",
            variant: "outlined",
            helperText: "",
            // isCard: true
        },
        "email":
        {
            type: "textField",
            fieldType: "text",
            id: "email",
            name: "email",
            label: "Email (required)",
            variant: "outlined",
            helperText: "",
            // isCard: true
        },
        "phone_no":
        {
            type: "textField",
            fieldType: "text",
            id: "phone_no",
            name: "phone_no",
            label: "Phone no (required)",
            variant: "outlined",
            helperText: "",
            // isCard: true
        },
        "first_name": {
            type: "textField",
            fieldType: "text",
            id: "first_name",
            name: "first_name",
            label: "First name",
            variant: "outlined",
            helperText: "",
            // isCard: true
        },
        "last_name": {
            type: "textField",
            fieldType: "text",
            id: "last_name",
            name: "last_name",
            label: "Last name",
            variant: "outlined",
            helperText: "",
            // isCard: true
        },
        "password": {
            type: "textField",
            fieldType: "password",
            id: "password",
            name: "password",
            label: "Password (required)",
            variant: "outlined",
            helperText: "",
            // isCard: true
        },
        "role": {
            type: "dropField",
            id: "role",
            name: "role",
            label: "Role (required)",
            MenuItem: [],
            defaultVal: "",
            helperText: "",
            // isCard: true
        },
    }

    console.log('defaultForm: ', defaultForm);

    const [dynamicFormObjectVideoSchema, setDynamicFormObjectVideoSchema] = useState(defaultForm)

    // console.log(setPreState, "setPreState")

    useEffect(() => {
        setGetProd({ ...getProd, page: pageNo })
    }, [pageNo])

    const { get_users, create_user, get_user_by_id, update_user, total_items_user, delete_multiple_user } = getUrlWithKey("users")

    const { get_roles } = getUrlWithKey("roles")

    const { tabView } = useTabView()

    const [payloadOriginal, setPO] = useState<any>(null);


    const { sendData: totalUsersView }: any = useRead({ selectMethod: "get", url: totalUserGetUrl });

    const { sendData: getUses }: any = useRead({ selectMethod: "put", url: get_users, callData: getProd });

    const { sendData: getRoles } = useRead({ selectMethod: "put", url: get_roles, callData: getProd })
    const { sendData: getUser, error: get_user_error }: any = useRead({ selectMethod: "get", url: get_user_by_id_url });
    const { sendData: create_user_success, error: create_user_error }: any = useCreate({ url: create_user_url, callData: payloadOriginal });


    console.log('getRoles: ', getRoles)
    // useEffect(()=>{
    //     setGetUse(getUser)
    // })

    useEffect(() => {
        if (getRoles && getRoles?.length) {
            const dataSet: any = { ...defaultForm }
            dataSet.role.MenuItem = [];
            for (let role of getRoles) {
                dataSet?.role?.MenuItem.push(role)
            }
            console.log("dataSet>>>", dataSet);
            setDynamicFormObjectVideoSchema(dataSet)

            // defaultForm?.role?.MenuItem.push({
            //     value: role?.id,
            //     name: role?.label
            // })
        }
    }, [getRoles?.length])

    console.log("getRoles: ", defaultForm);
    useEffect(() => {
        setTotalUserGetUrl(total_items_user);
    }, []);

    useEffect(() => {
        console.log("totalUserView", totalUsersView)
        if (totalUsersView?.totalItem) {
            setTotalUserGetUrl("");
        }
    }, [totalUserGetUrl])

    const getTotalPage = (): number => {
        console.log("list?.totalPage", totalUsersView?.totalPage)
        if (totalUsersView?.totalPage && totalUsersView?.totalPage !== 0) {
            return totalUsersView?.totalPage;
        } else if (totalUsersView?.totalPage === 0) {
            return 1;
        } else {
            return 0;
        }
    }

    const handelTableCheckBox = (e: any, v: any) => {
        const arr = [...checked];
        if (e?.target?.checked) {
            arr.push(v);
            setChecked(arr);
        } else {
            setChecked(arr.filter((item: any) => item !== v))
        }
    }

    const handelAllChecked = (e: any) => {
        if (e?.target?.checked && getUses && getUses?.length) {
            const arr = [];
            for (let g = 0; g < getUses.length; g++) {
                if (getUses[g] && getUses[g]?.id) {
                    arr.push(getUses[g]?.id);
                }
            }
            setChecked(arr);
        } else {
            setChecked([]);
        }
    }

    const handelApply = async () => {
        console.log("handelApply", actionValue, checked);
        if (actionValue === 'delete' && checked?.length) {
            const { data } = await axios.post(`${delete_multiple_user}`, { user_ids: checked });
            if (data?.success) {
                console.log("handelApply-data", data);
                _SUCCESS(data?.massage);
                // setFields(defaultFieldSet);
                setPageNo(1)
                setGetProd({ page: pageNo, rowsPerPage: 10 })
                setActionValue("delete");
                setChecked([]);
                setTotalUserGetUrl(total_items_user);
            }
        }
    }

    useEffect(() => {
        // if (create_user_success && !create_user_error) {
        //     setCreateUserUrl("");
        //     console.log("create_user_success", create_user_success);
        //     setOpenFullModal(false);
        //     setPO(null);
        //     setDataSet2(uploadDataSet);
        //     setGetProd({ page: pageNo, rowsPerPage: 10 });
        //     setTotalUserGetUrl(total_items_user);
        //     closeModal(false);
        //     preState.id ? _SUCCESS("Updated User Successfully!") : _SUCCESS("Created User Successfully!")
        // } else if (create_user_error) {
        //     console.log("create_user_error", create_user_error);
        //     if (create_user_error && create_user_error?.response && create_user_error.response?.data && create_user_error.response.data?.code) {
        //         if (create_user_error.response.data?.code === 111) {
        //             setDynamicFormObjectVideoSchema(pre => ({
        //                 ...pre,
        //                 "phone_no": {
        //                     ...pre["phone_no"],
        //                     helperText: create_user_error.response.data?.massage
        //                 }
        //             }));
        //         }
        //     }
        //     _ERROR("Please Fillup Field Properly!");
        //     setCreateUserUrl("");
        // }

        if (getUser && getUser?.id && !get_user_error && get_user_by_id_url) {
            console.log("getUser_____>>>>>>>>>> rajdwip debug", getUser);
            setPreState({
                ...getUser,
                role: getUser?.role?.value
            });
            setDynamicFormObjectVideoSchema(pre => ({
                ...pre,
                "password": {
                    ...pre["password"],
                    label: "Generate New Password",
                    helperText: ""
                },
                "phone_no": {
                    ...pre["phone_no"],
                    helperText: ""
                },
                "email": {
                    ...pre["email"],
                    helperText: ""
                }
            }));
            setGetUserByIDUrl("");
        }

    }, [create_user_success, create_user_error, getUser]);

    const getUserUrlReady = (user_id: string) => {
        // setDynamicFormObjectVideoSchema(defaultForm);
        setGetUserByIDUrl(`${get_user_by_id}/${user_id}`);
        setOpenFullModal(true);
    }

    const actionArray = [
        // { value: "bulkAction", name: "Bulk action" },
        { value: "delete", name: "Delete" },
    ]

    const header = [
        { field: 'Username' },
        { field: 'Name' },
        { field: 'Email' },
        { field: 'Role' }
    ];


    const handleChangeAction = (e: any) => {
        setActionValue(e.target.value);
    }

    const handleToggle = () => {
        // setDoTrashProd(delete_product);
    }

    const onHandleAcordian = (id: number | string) => {
        if (id === acordian) {
            setAcordian(null)
        } else {
            setAcordian(id as number)
        }
    }

    const addNewUser = () => {

        let keys: any = { ...dynamicFormObjectVideoSchema };
        // ["username", "email", "phone_no", "first_name", "last_name", "password", "role"];

        for (let key in keys) {
            keys[key] = {
                ...keys[key],
                helperText: ""
            }
            // setDynamicFormObjectVideoSchema((pre: any) => ({
            //     ...pre,
            //     key: {
            //         ...pre[key],
            //         helperText: "",
            //     }
            // }))
        }

        setDynamicFormObjectVideoSchema(keys);

        setOpenFullModal(true);
        setPO(null);

        // setDynamicFormObjectVideoSchema(defaultForm);
        // setDynamicFormObjectVideoSchema(pre => ({
        //     ...pre,
        //     "password": {
        //         ...pre["password"],
        //         label: "Password (required)"
        //     }
        // }))
    }
    console.log(">>>>>>>>>>", dataSet2, ">>>>>>>>>>", dynamicFormObjectVideoSchema);

    const saveUser = async () => {
        console.log(">>>>>>>>>> rajdwip debug", dataSet2);
        // return update_user
        let valid = true;

        if (dataSet2?.username == "") {
            setDynamicFormObjectVideoSchema(pre => ({
                ...pre,
                "username": {
                    ...pre["username"],
                    helperText: "Username is required",
                    isError: true
                }
            }))
            valid = false;
        }

        if (dataSet2?.email == "") {
            setDynamicFormObjectVideoSchema(pre => ({
                ...pre,
                "email": {
                    ...pre["email"],
                    helperText: "email is required",
                    isError: true
                }
            }))
            valid = false;
        }

        if (!emailRegax(dataSet2?.email)) {
            setDynamicFormObjectVideoSchema(pre => ({
                ...pre,
                "email": {
                    ...pre["email"],
                    helperText: "Please select a valid email address",
                    isError: true
                }
            }))
            valid = false;
        }

        if (dataSet2?.phone_no == "") {
            setDynamicFormObjectVideoSchema(pre => ({
                ...pre,
                "phone_no": {
                    ...pre["phone_no"],
                    helperText: "phone no is required",
                    isError: true
                }
            }))
            valid = false;
        }

        if (!phoneRegax(dataSet2?.phone_no)) {
            setDynamicFormObjectVideoSchema(pre => ({
                ...pre,
                "phone_no": {
                    ...pre["phone_no"],
                    helperText: "Please enter a valid phone number",
                    isError: true
                }
            }))
            valid = false;
        }

        if (dataSet2?.password == "" && !preState?.id) {
            setDynamicFormObjectVideoSchema(pre => ({
                ...pre,
                "password": {
                    ...pre["password"],
                    helperText: "password is required",
                    isError: true
                }
            }))
            valid = false;
        }

        if (dataSet2?.role == "") {
            setDynamicFormObjectVideoSchema(pre => ({
                ...pre,
                "role": {
                    ...pre["role"],
                    helperText: "role is required",
                    isError: true
                }
            }))
            valid = false;
        }

        if (dataSet2?.password == "") {
            delete dataSet2["password"];
        }

        const data: any = dataSet2;
        if (data?.role) {
            data.role = {
                connect: {
                    id: +data?.role
                }
            }
        }
        setDataSet2(data);
        setPO(data);
        try {
            if (valid) {
                if (preState?.id) {
                    // setCreateUserUrl(update_user);
                    const { data: d } = await axios.post(update_user, data);
                    if (d?.success) {
                        setOpenFullModal(false);
                        setPO(null);
                        setDataSet2(uploadDataSet);
                        setGetProd({ page: pageNo, rowsPerPage: 10 });
                        setTotalUserGetUrl(total_items_user);
                        closeModal(false);
                        _SUCCESS("Updated User Successfully!");
                    }
                } else {
                    const { data: d } = await axios.post(create_user, data);
                    if (d?.success) {
                        setOpenFullModal(false);
                        setPO(null);
                        setDataSet2(uploadDataSet);
                        setGetProd({ page: pageNo, rowsPerPage: 10 });
                        setTotalUserGetUrl(total_items_user);
                        closeModal(false);
                    }
                    // setCreateUserUrl(create_user);
                    _SUCCESS("Created User Successfully!");
                }
            } else {
                console.log("valid", valid)
            }
        } catch (error: any) {
            console.log(error);
            if (error && error?.response && error.response?.data && error.response.data?.code) {
                if (error.response.data.code === 111) {
                    setDynamicFormObjectVideoSchema(pre => ({
                        ...pre,
                        "phone_no": {
                            ...pre["phone_no"],
                            helperText: error.response.data.massage,
                            isError: true
                        }
                    }));
                } else if (error.response.data.code === 222) {
                    setDynamicFormObjectVideoSchema(pre => ({
                        ...pre,
                        "email": {
                            ...pre["email"],
                            helperText: error.response.data.massage,
                            isError: true
                        }
                    }))
                }
            } else {
                _ERROR("Something Went To Wrong!");
            }
        }

    }

    const closeModal = (modal: boolean = true) => {
        modal ? setOpenFullModal(false) : null;
        if (getUser?.id) {
            setPreState({});
            setGetUserByIDUrl("");
            setDataSet2(uploadDataSet);
        }
    }

    console.log(getUses, prodCheck, "getUses", dataSet2)
    console.log(preState, "<<-preState")
    console.log(getUser, "<<-getUser")
    console.log(dataSet2, "<<-dataSet2")


    // <div className='flex items-center gap-2'>
    //                 {/* onClick={() => { setPageNo(1), setGetProd({ page: 1, rowsPerPage: 10, deleted_at: false }); setActionValue("bulkAction"), setTotalGetData("totalItem") }} 
    //                 {totalProductsView?.totalItem}*/}
    //                 <span className='text-sm'><span className='text-cyan-700' >All</span> (1)</span><span>|</span>

    //                 {/* onClick={() => { setPageNo(1), setGetProd({ page: pageNo ? pageNo : 1, rowsPerPage: 10, status_id: 1 }), setTotalGetData("totalPublished") }}
    //                 {totalProductsView?.totalPublished} */}
    //                 <span className='text-sm' ><span className='text-cyan-700'>Active</span> ()</span><span>|</span>

    //                 {/* onClick={() => { setPageNo(1), setGetProd({ page: pageNo ? pageNo : 1, rowsPerPage: 10, status_id: 3 }), setTotalGetData("totalDraft") }} 
    //                 {totalProductsView?.totalDraft}*/}
    //                 <span className='text-sm' ><span className='text-cyan-700'>Inactive</span> ()</span><span>|</span>

    //                 {/* onClick={() => { setPageNo(1), setGetProd({ ...getProd, status_id: null, deleted_at: true }); setActionValue("bulkAction"), setTotalGetData("totalTrash") }} 
    //                 {totalProductsView?.totalTrash}*/}
    //                 <span className='text-sm'><span className='text-cyan-700'>Trash</span> ()</span><span>|</span>
    //                 <span className='text-sm'><span className='text-cyan-700'>Sorting</span></span>
    //             </div>
    //             <div className='flex items-center gap-2'>
    //                 <SearchField />
    //                 <ButtonField buttonTxt='Search users' handleClick={() => { }} />
    //             </div>

    const searchRes = (value: any) => {
        console.log("searchRes", value);
        if (value) {
            setPageNo(1);
            setGetProd({ page: 1, rowsPerPage: 10, search: value });
            setTotalUserGetUrl(`${total_items_user}/${value}`);
        } else {
            setPageNo(1);
            setGetProd({ page: 1, rowsPerPage: 10 })
            setTotalUserGetUrl(`${total_items_user}`);
        }
    }

    const checkData = (v: any) => {
        console.log("checkDatacheckDatacheckDatacheckDatacheckDatacheckDatacheckData", v, dataSet2);
        setDataSet2((pre: any) => ({ ...pre, ...v }))

        if (v?.username) {
            setDynamicFormObjectVideoSchema(pre => ({
                ...pre,
                "username": {
                    ...pre["username"],
                    helperText: "",
                }
            }))
        }

        if (v?.email) {
            setDynamicFormObjectVideoSchema(pre => ({
                ...pre,
                "email": {
                    ...pre["email"],
                    helperText: "",
                }
            }))
        }

        if (v?.phone_no) {
            setDynamicFormObjectVideoSchema(pre => ({
                ...pre,
                "phone_no": {
                    ...pre["phone_no"],
                    helperText: "",
                }
            }))
        }

        if (v?.password) {
            setDynamicFormObjectVideoSchema(pre => ({
                ...pre,
                "password": {
                    ...pre["password"],
                    helperText: "",
                }
            }))
        }

        if (v?.role) {
            setDynamicFormObjectVideoSchema(pre => ({
                ...pre,
                "role": {
                    ...pre["role"],
                    helperText: "",
                }
            }))
        }
    }

    return (
        <div className='w-full flex flex-col items-start justify-center gap-2'>
            <SearchAndAddNewComponent buttonTxt={'Search Users'} addNewProduct={addNewUser} name={'Add New User'} res={searchRes} />
            <div className='flex w-full flex-wrap gap-2 items-center justify-between'>
                <ActionDrop
                    btnValue="Apply"
                    handleChange={handleChangeAction}
                    menuItemArray={actionArray}
                    value={actionValue}
                    handleClick={() => handelApply()}
                    disabled={checked.length ? false : true}
                // handleClick={() => actionValue === "restore" && handleToggle()}
                />
                <div className='flex flex-wrap items-center gap-2'>
                    {/* <PinkPawsbutton name='Add New User' variant={"solid"} handleClick={addNewUser} /> */}
                </div>
                {/* <Pageination
                    // items={totalGetData === "totalItem" ? totalProductsView?.totalItem : 0 || totalGetData === "totalPublished" ? totalProductsView?.totalPublished : 0 || totalGetData === "totalDraft" ? totalProductsView?.totalDraft : 0 || totalGetData === "totalTrash" ? totalProductsView?.totalTrash : 0}
                    value={pageNo}
                    totalpageNo={pageNo}
                    handleClickFirst={() => setPageNo(1)}
                    handleClickNext={() => setPageNo(pageNo <= 1 ? 1 : pageNo - 1)}
                    handleChange={(e: any) => setPageNo(e.target.value > 999 ? 1 : e.target.value)}
                    handleClickPrevious={() => setPageNo(pageNo > 999 ? 1 : pageNo + 1)}
                    handleClickLast={() => setPageNo(pageNo)}
                /> */}

                <Pageination
                    items={totalUsersView?.totalItem}
                    value={pageNo}
                    totalpageNo={getTotalPage()}
                    handleClickFirst={() => setPageNo(1)}
                    handleClickNext={() => setPageNo(pageNo === 1 ? 1 : (pageNo - 1))}
                    handleChange={(e: any) => setPageNo(e.target.value > getTotalPage() ? 1 : e.target.value)}
                    handleClickPrevious={() => setPageNo(pageNo == getTotalPage() ? getTotalPage() : pageNo + 1)}
                    handleClickLast={() => setPageNo(getTotalPage())}
                />
            </div>

            {!tabView ?
                (getUses?.length ?
                    <Table className='lg:table hidden table-auto w-full productTableCls '>
                        <TableHead>
                            <TableRow
                                hover
                                role="checkbox"
                                className='bg-offWhite-01'
                                sx={{ cursor: 'pointer' }}
                            >
                                <TableCell padding="checkbox">
                                    <Checkbox className='px-[9px] py-0' onClick={handelAllChecked} />
                                </TableCell>
                                {header.map((col, index) =>
                                    <TableCell key={index}>{col.field}</TableCell>
                                )}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {getUses?.map((row: any, index: number) => {
                                return (
                                    <TableRow
                                        hover
                                        key={index}
                                        sx={{ cursor: 'pointer' }}

                                    >
                                        <TableCell className='!w-[8%]' padding="checkbox">
                                            <Checkbox
                                                // checked={prodCheck?.product_id === row?.id ? true : false}
                                                checked={checked.includes(row?.id)}
                                                // onClick={() => prodCheck?.product_id !== row?.id ? setProdCheck({ product_id: row?.id }) : setProdCheck({})}
                                                onClick={(e) => handelTableCheckBox(e, row?.id)}
                                            />
                                        </TableCell>
                                        {/* <TableCell className='w-[10%]'>
                                            <Image src={row?.image ? row?.image : productImage} alt='productImage' width={80} height={40} priority />
                                        </TableCell> */}
                                        <TableCell className='w-[22%]' onClick={() => row?.id ? getUserUrlReady(row.id) : null}>{row?.username ? row?.username : "--"}</TableCell>
                                        <TableCell className='w-[22%]' onClick={() => row?.id ? getUserUrlReady(row.id) : null}>{row?.display_name ? row?.display_name : "--"}</TableCell>
                                        <TableCell className='w-full' onClick={() => row?.id ? getUserUrlReady(row.id) : null}>{row?.email ? row?.email : "--"}</TableCell>
                                        <TableCell className='w-[15%]' onClick={() => row?.id ? getUserUrlReady(row.id) : null}>{row?.role?.label ? row.role.label : "--"}</TableCell>
                                    </TableRow>
                                );
                            })
                            }
                        </TableBody>
                    </Table>
                    :
                    <div className='w-full flex items-center justify-center'>No data found</div>
                ) : (
                    <div className='border border-solid rounded text-center w-full'>
                        <div className='flex items-center justify-start bg-offWhite-01 px-4'>
                            <Checkbox />
                            <p>Name</p>
                        </div>

                        <div className='flex'>
                            <div className='flex flex-col w-full'>
                                {getUses.length ? getUses.map((row: any, index: number) => {
                                    return (
                                        <>
                                            <hr />
                                            <div
                                                key={index}
                                                className='p-4'
                                            >
                                                <div className='flex justify-between items-center gap-4' onClick={() => onHandleAcordian(row?.id)} >
                                                    <div className='flex items-center'>
                                                        <Checkbox />
                                                        {/* <Image src={row?.image ? row?.image : productImage} alt='productImage' width={40} height={40} priority /> */}
                                                        {acordian === row?.id ?
                                                            null
                                                            : <div className='flex justify-between w-full'>{row?.username ? row?.username : "--"}</div>}
                                                    </div>
                                                    <ArrowDropDownIcon className={acordian === row?.id ? 'rotate-180' : ''} />
                                                </div>
                                                <div className={`flex flex-wrap text-sm items-start gap-1  ${acordian === row?.id ? "px-10 py-2" : "pl-3"}`}>
                                                    <span className="text-cyan-700">Edit</span> |
                                                    <span className="text-cyan-700">Quick&nbsp;Edit</span> |
                                                    <span className="text-red-600">Delete</span> |
                                                    <span className="text-cyan-700">View</span> |
                                                    <span className="text-cyan-700">Make default</span>
                                                </div>
                                                {acordian === row?.id ?
                                                    <div className='pl-10'>
                                                        <div className='flex justify-between w-full'>{row?.username ? row?.username : "--"}</div>
                                                        <div className='flex justify-between w-full'><div className='text-left w-[15%]'>Name</div><div className='text-left w-[80%] flex items-start'>{row?.display_name ? row?.display_name : "--"}</div></div>
                                                        <div className='flex justify-between w-full'><div className='text-left w-[15%]'>Email</div><div className='text-left w-[80%] flex items-start'>{row?.email ? row?.email : "--"}</div></div>
                                                        <div className='flex justify-between w-full'><div className='text-left w-[15%]'>Role</div><div className='text-left w-[80%] flex items-start'>{row?.role?.label ? row?.role.label : "--"}</div></div>
                                                    </div> : null}
                                            </div>
                                        </>
                                    );
                                }) : <div className='w-full flex items-center justify-center p-4'>No data found</div>}
                            </div>
                        </div>
                    </div>
                )}

            <div className='flex w-full flex-wrap gap-2 items-center justify-between'>
                <ActionDrop
                    btnValue="Apply"
                    handleChange={handleChangeAction}
                    menuItemArray={actionArray}
                    value={actionValue}
                    handleClick={() => handelApply()}
                    disabled={checked.length ? false : true}
                // handleClick={() => actionValue === "restore" && handleToggle()}
                />
                {/* <Pageination
                    // items={totalGetData === "totalItem" ? totalProductsView?.totalItem : 0 || totalGetData === "totalPublished" ? totalProductsView?.totalPublished : 0 || totalGetData === "totalDraft" ? totalProductsView?.totalDraft : 0 || totalGetData === "totalTrash" ? totalProductsView?.totalTrash : 0}
                    value={pageNo}
                    totalpageNo={pageNo}
                    handleClickFirst={() => setPageNo(1)}
                    handleClickNext={() => setPageNo(pageNo <= 1 ? 1 : pageNo - 1)}
                    handleChange={(e: any) => setPageNo(e.target.value > 999 ? 1 : e.target.value)}
                    handleClickPrevious={() => setPageNo(pageNo > 999 ? 1 : pageNo + 1)}
                    handleClickLast={() => setPageNo(pageNo)}
                /> */}

                <Pageination
                    items={totalUsersView?.totalItem}
                    value={pageNo}
                    totalpageNo={getTotalPage()}
                    handleClickFirst={() => setPageNo(1)}
                    handleClickNext={() => setPageNo(pageNo === 1 ? 1 : (pageNo - 1))}
                    handleChange={(e: any) => setPageNo(e.target.value > getTotalPage() ? 1 : e.target.value)}
                    handleClickPrevious={() => setPageNo(pageNo == getTotalPage() ? getTotalPage() : pageNo + 1)}
                    handleClickLast={() => setPageNo(getTotalPage())}
                />
            </div>
            <RightSideModal modalStat={openFullModal} handleClose={() => closeModal()} heading={preState?.id ? 'Edit User' : 'Add New User'}>
                {/* <Form fieldsErrors={{}} fields={{}} handelOnChange={setDataSet2}/> */}
                <div className='w-full flex flex-col gap-2.5 '>
                    <h1 className='text-lg font-medium'>Personal Options</h1>
                    <DynamicForm dynOb={dynamicFormObjectVideoSchema} sendDataState={(v: any) => { checkData(v) }} preState={preState} />
                    <div className='flex items-center justify-end'>
                        <PinkPawsbutton name={preState?.id ? 'Update User' : 'Add New User'} variant={"solid"} handleClick={saveUser} />
                    </div>
                </div>
                {/* {preState?.id && <><div className='w-full flex flex-col gap-2 p-4'>
                    <h1 className='text-lg font-medium'>Customer Billing Address</h1>
                    <DynamicForm dynOb={dynamicFormObjectVideoSchema} sendDataState={setDataSet2} preState={preState} />
                </div>
                    <div className='w-full flex flex-col gap-2 p-4'>
                        <h1 className='text-lg font-medium'>Customer shipping address</h1>
                        <DynamicForm dynOb={dynamicFormObjectVideoSchema} sendDataState={setDataSet2} preState={preState} />
                        <PinkPawsbutton name='Update User' variant={"solid"} handleClick={saveUser} />
                    </div></>} */}
            </RightSideModal>
        </div>
    )
}

export default UsersPage