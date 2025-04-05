import React, { HtmlHTMLAttributes, useEffect, useState } from 'react';
import SimpleCard from '../../../Admin/components/SimpleCard';
import ActionDrop from '../../../Admin/components/ActionDrop';
import { Checkbox, Dialog, DialogContent } from '@mui/material';
import PinkPawsbutton from '../../../Admin/components/PinkPawsbutton';
import { useCreate, useDelete, useRead } from '../../../Admin/hooks';
import getUrlWithKey from '../../../Admin/util/_apiUrl';
import TextField from '../../../Admin/components/TextField';
import { isEmptyObject } from '../../../Admin/util/_common';
import Link from 'next/link';
import RightSideModal from '../../../Admin/components/RightSideModal';
import { _ERROR, _SUCCESS } from '../../util/_reactToast';
import DeleteIcon from '@mui/icons-material/Delete';
import { _post, _put } from '../../services';

const Menue = () => {
    const [confirmStatus, setConfirmStatus]: any = useState("")

    // Types & default
    type defaultFieldSetType = {
        name: string;
        code: number | undefined;
    }
    const defaultFieldSet: defaultFieldSetType = {
        name: "",
        code: undefined
    }
    const fieldBorder = "border border-solid border-gray-400 rounded";

    // State
    const [actionValue, setActionValue] = useState("")
    const [actionName, setActionName] = useState("")
    const [data, setData] = useState<any[]>([]);
    const [customLink, setCustomLink]: any = useState({});
    const [isEditCustomLink, setIsEditCustomLink] = useState<boolean>(false)
    const [customMenuUpdateId, setCustomMenuUpdateId] = useState("")
    const [current_menu_code, setCurrentMenuCode] = useState<number | undefined>();
    const [current_menu_id, setCurrentMenuId] = useState<number | undefined>();
    const [getCategory, setGetCategory]: any = useState({ dropdown: true });
    const [getListParams, setGetListParams] = useState<any>({
        "all": true,
        "options": {
            "id": true,
            "name": true
        }
    });
    console.log(data, "dg4d65data")
    const [menuItemsParams, setMenuItemsParams] = useState({
        "code": [1]
    });
    const [getMenuItemUrl, setGetMenuItemUrl] = useState("");
    const [customMenuCreateUrl, setCustomMenuCreateUrl] = useState<string>("");
    const [customMenuCreatePayload, setCustomMenuCreatePayload] = useState<any>({
        link: "",
        name: ""
    });
    const [menuItemAddedUrl, setMenuItemAddedUrl] = useState<string>("");
    const [menuItemAddedPayload, setMenuItemAddedPayload] = useState<any>({
        "menu_item_id": 1,
        "menu_item_type": "customMenu",
        "menu_type": {
            "connect": {
                "id": 1
            }
        }
    });
    const [menuItemDeleteUrl, setMenuItemDeleteUrl] = useState<string>("");
    const [menuItemDeletePayload, setMenuItemDeletePayload] = useState<any>({
        "menu_type_id": 0,
        "menu_item_id": 0,
    });
    const [rightSideBarOpen, setOpen] = useState<boolean>(false);
    const [fields, setFields] = useState<defaultFieldSetType>(defaultFieldSet);
    const [codeErr, setCodeErr] = useState("");
    const [nameErr, setNameErr] = useState("");

    // Url get setup
    const { get_product_category } = getUrlWithKey("products_categories");
    const { get_all_pages } = getUrlWithKey("pages");
    const { get_all_menu_types, get_menu_items, custom_menu_create, add_menu_item, menu_item_delete, add_menu_type, delete_menu_type, remove_menu_item, update_menu_type, get_custom_menu_type } = getUrlWithKey("menus");

    // get category hooks
    const { sendData: category }: any = useRead({ selectMethod: "put", url: get_product_category, callData: getCategory });

    // get all pages
    const { sendData: pages }: any = useRead({
        selectMethod: "put", url: get_all_pages, callData: getListParams
    });

    console.log(pages, "pages__")

    // get all menu types name
    const { sendData: actionArray }: any = useRead({ selectMethod: "get", url: get_all_menu_types });


    useEffect(() => {
        if (actionArray?.length) {
            setActionValue(actionArray[0]?.value)
            let codeId = actionArray[0]?.value.split("#");
            const name = actionArray.filter((item: any) => item.value == actionArray[0]?.value);
            setActionName(name[0].name);
            callMenuItems(+codeId[1])
            setCurrentMenuCode(+codeId[1]);
            setCurrentMenuId(+codeId[0]);
        }
    }, [actionArray?.length])

    // get menu items
    const { sendData: menuItems }: any = useRead({ selectMethod: "put", url: getMenuItemUrl, callData: menuItemsParams });
    console.log(menuItems, data, "dffft3d523")
    // add custom menu
    const { sendData: customMenu }: any = useCreate({ url: customMenuCreateUrl, callData: customMenuCreatePayload });

    // add menu item
    const { sendData: addesMenuItem }: any = useCreate({ url: menuItemAddedUrl, callData: menuItemAddedPayload });

    // add menu type
    const [addMenuTypeUrl, setMenuTypeUrl] = useState<string>("");
    let { sendData: addesMenuType, error: addMenuError }: any = useCreate({ url: addMenuTypeUrl, callData: fields });

    // delete menu item
    const { sendData: deleteMenuItem }: any = useDelete({ selectMethod: "post", url: menuItemDeleteUrl, callData: menuItemDeletePayload });

    // Any const array push object dynamicly. use carefuly.
    const forceEntry = ({ dataSet, data }: any) => {
        dataSet.push(data)
    }

    // handel all custom hookes returns.
    useEffect(() => {
        // menu item checked and data set for show existing data.
        if (menuItems && !isEmptyObject(menuItems) && getMenuItemUrl) {
            console.log("menuItems, entry", data);
            const menus = menuItems[String(current_menu_code)] ? menuItems[String(current_menu_code)]['menus'] : null;
            if (menus && menus.length) {
                let dataArr = [];
                for (let i = 0; i < menus.length; i++) {
                    const menu_Id = menus[i]["id"]
                    // const customMenu_Id = 
                    const id = menus[i]['menu_item_id']['id'];
                    const type = menus[i]['menu_item_type'];
                    const name = menus[i]['menu_item_type'] == "pages" ? menus[i]['menu_item_id']['title'] : menus[i]['menu_item_id']['name'];

                    if (type == "pages") {
                        dataArr.push({ name, id: `P` + id, from: "page", menuId: menu_Id });
                    } else if (type == "productCategory") {
                        dataArr.push({ name, id: `C` + id, from: "category", menuId: menu_Id });
                    } else if (type == "customMenu") {
                        dataArr.push({ name, id: `CS` + id, from: "custom", menuId: id });
                    }
                    console.log(dataArr, menus, menu_Id, "6s5fd6df35132")
                }
                setData(dataArr);
                setGetMenuItemUrl("");
            } else {
                setData([]);
            }
        }

        // custom menu added
        if (customMenu && customMenu?.id) {
            if (customLink?.name && customLink?.url) {
                setData([...data, { name: customMenu?.name, url: customMenu?.link, id: (`CS` + (customMenu?.id)), from: "custom" }]);
                setMenuItemAddedPayload({
                    menu_item_id: +customMenu?.id,
                    menu_item_type: "customMenu",
                    menu_type: {
                        connect: {
                            id: current_menu_id
                        }
                    }
                });
                setMenuItemAddedUrl(add_menu_item);
                setCustomMenuCreateUrl("");
            }
        }

        // get menu items
        if (addesMenuItem && addesMenuItem?.id) {
            setMenuItemAddedUrl("");
        }

        // get menu type
        if (addesMenuType && addesMenuType?.id && !addMenuError) {
            setMenuTypeUrl("");
            handelRightSideBar();
            const data = {
                name: addesMenuType?.name,
                value: `${addesMenuType?.id}#${addesMenuType?.code}`
            }
            forceEntry({ dataSet: actionArray, data });
            _SUCCESS("New menu type created");
        } else if (addMenuError) {
            setMenuTypeUrl("");
            console.log("setMenuTypeUrl", addMenuError)
            if (addMenuError && addMenuError?.response && addMenuError?.response?.data && addMenuError?.response?.data?.massage) {
                addMenuError?.response?.data?.code === 2 && setCodeErr(addMenuError?.response?.data?.massage);
                addMenuError?.response?.data?.code === 1 && setNameErr(addMenuError?.response?.data?.massage);
            }
            addMenuError = null;
        }
    }, [menuItems, customMenu, addesMenuItem, addesMenuType, addMenuError]);

    // removed deleteurl from state
    useEffect(() => {
        if (deleteMenuItem) {
            setMenuItemDeleteUrl("");
        }
    }, [deleteMenuItem])

    const getMenuTypesAfterChecked = async () => {
        try {
            const res = await _put(get_menu_items, menuItemsParams)
        } catch (error) {
            console.log(error)
        }
    }

    // checkbox handel check box, for pages section checked
    const onCheckToSetPages = async (itm: any, e: any) => {
        console.log(itm, e, "35f5g6h56gf")
        if (e === true) {
            setData([...data, { name: itm?.name, id: `P` + itm?.id, from: "page" }]);
            setMenuItemAddedPayload({
                menu_item_id: +itm?.id,
                menu_item_type: "pages",
                menu_type: {
                    connect: {
                        id: current_menu_id
                    }
                }
            });

            const checkedData = {
                menu_item_id: +itm?.id,
                menu_item_type: "pages",
                menu_type: {
                    connect: {
                        id: current_menu_id
                    }
                }
            }
            // setMenuItemAddedUrl(add_menu_item);
            const res = await _post(add_menu_item, checkedData)
            if (res?.status) {
                console.log(res?.data?.data, data, "d5f4g56fd1")
                setData([...data, { name: itm?.name, id: `P` + itm?.id, from: "page", menuId: res?.data?.data?.id }]);
                getMenuTypesAfterChecked()
            }
            // setGetMenuItemUrl(get_menu_items);
        } else {
            const removeData = data.filter((item: any) => item?.id !== (`P` + itm?.id));
            setData(removeData);
            setMenuItemDeleteUrl(menu_item_delete);
            setMenuItemDeletePayload({
                "menu_type_id": current_menu_id,
                "menu_item_id": +itm?.id,
                "menu_item_type": "pages"
            });
        }
    }

    // checkbox handel check, for category section
    const onCheckToSetProductCategories = async (itm: any, e: any) => {
        if (e === true) {
            setData([...data, { name: itm?.name, id: `C` + itm?.id, from: "category" }]);
            setMenuItemAddedPayload({
                menu_item_id: +itm?.id,
                menu_item_type: "productCategory",
                menu_type: {
                    connect: {
                        id: current_menu_id
                    }
                }
            });

            const checkedData = {
                menu_item_id: +itm?.id,
                menu_item_type: "productCategory",
                menu_type: {
                    connect: {
                        id: current_menu_id
                    }
                }
            }
            const res = await _post(add_menu_item, checkedData)
            if (res?.status) {
                console.log(res?.data?.data, data, "d5f4g56fd1")
                setData([...data, { name: itm?.name, id: `C` + itm?.id, from: "category", menuId: res?.data?.data?.id }]);
                getMenuTypesAfterChecked()
            }
            // setMenuItemAddedUrl(add_menu_item);
        } else {
            const removeData = data.filter((item: any) => item?.id !== (`C` + itm?.id));
            setData(removeData);
            setMenuItemDeleteUrl(menu_item_delete);
            setMenuItemDeletePayload({
                "menu_type_id": current_menu_id,
                "menu_item_id": +itm?.id,
                "menu_item_type": "productCategory"
            });
        }
    }

    // select menu type, drop down onchage handel
    const handleChangeAction = (e: any) => {
        console.log(e.target)
        setActionValue(e.target.value);
        let codeId = e.target.value.split("#");
        const name = actionArray.filter((item: any) => item.value == e.target.value);
        setActionName(name[0].name);
        callMenuItems(+codeId[1])
        setCurrentMenuCode(+codeId[1]);
        setCurrentMenuId(+codeId[0]);
    }

    const clearMenuSelectedOptions = () => {
        setActionValue("");
        setActionName("");
        callMenuItems()
        setCurrentMenuCode(undefined);
        setCurrentMenuId(undefined);
    }

    // call menu items for common function
    const callMenuItems = (code?: number) => {
        setGetMenuItemUrl(get_menu_items);
        setMenuItemsParams((pre: any) => ({
            ...pre,
            code: [code ? code : current_menu_code]
        }));
    }

    // checked or not handel functions
    const checkFilter: any = (itm: any, type: string) => {
        const check = data.filter((item: any) => item?.id == (type + itm?.id));
        return check.length;
    }

    // custom menu hadeler for create and add menu.
    const addToMenuHandler = () => {
        setCustomMenuCreateUrl(custom_menu_create);
        setCustomMenuCreatePayload({ link: customLink?.url, name: customLink?.name });
    }
    const updateToMenuHandler = async () => {
        try {
            const data = {
                id: customMenuUpdateId,
                link: customLink?.url,
                name: customLink?.name
            };
            const res = await _post(update_menu_type, data);
            if (res && res?.status) {
                _SUCCESS(res?.data?.massage || "Custom item updated successfully.")
                setCustomLink((prev: any) => ({
                    ...prev,
                    url: '',
                    name: ''
                }));
                setIsEditCustomLink(false);
                setGetMenuItemUrl(get_menu_items);
            }
        } catch (error) {
            console.error("Errormenu", error);
        }
    };


    // handel create new menu type
    const handelRightSideBar = () => {
        setOpen(!rightSideBarOpen);
        setFields(defaultFieldSet);
    }

    // Handel Menu Type Form handel
    const handelOnChange = (e: any) => {
        const stateName = e.target.name;
        const stateValue = stateName == "code" ? e.target.value && +e.target.value : e.target.value;

        setFields(pre => ({
            ...pre,
            [stateName]: stateValue
        }));
        stateName !== "code" ? setNameErr("") : setCodeErr("");
    }

    // Handel submit
    const handleSubmit = () => {
        let valid = true;
        if (fields.name === "") {
            setNameErr("This field is required!");
            valid = false;
        }
        if (fields.code === undefined) {
            setCodeErr("This field is required!");
            valid = false;
        }
        valid && setMenuTypeUrl(add_menu_type);
    }

    // init function
    useEffect(() => {
        setCustomLink({})
    }, [data])

    // Category section html functions.
    const ProductCategories = ({ dynArr }: any) => {
        return (
            <div className='flex flex-col'>
                {dynArr && dynArr?.length ? dynArr?.map((itm: any, i: number) =>
                    <div key={i} className='flex flex-col gap-2'>
                        <div className='flex items-center justify-start gap-2'>
                            <Checkbox className='p-0' checked={checkFilter(itm, 'C')} disabled={!actionValue} onClick={(e: any) => onCheckToSetProductCategories(itm, e.target.checked)} />
                            <div className=''>{itm?.name}</div>
                        </div>
                        <div className='pl-4'>
                            <ProductCategories dynArr={itm?.sub_categories} />
                        </div>
                    </div>
                ) : null}
            </div>
        );
    }

    // Custom menu removed.
    const customMenuDelete = (v: any) => {
        let id = v.id;
        id = id.replace("CS", "");
        const removeData = data.filter((item: any) => item?.id !== v.id);
        setData(removeData);
        setMenuItemDeleteUrl(menu_item_delete);
        setMenuItemDeletePayload({
            "menu_type_id": current_menu_id,
            "menu_item_id": +id,
            "menu_item_type": "customMenu"
        });
    }

    const updateCustomMenu = async (v: any) => {
        try {
            const res = await _put(get_custom_menu_type, { id: +v?.menuId })
            console.log(v, res?.data, "updateCustomMenu21");
            const { link, name } = res?.data?.data || {};
            setCustomLink((prev: any) => ({
                ...prev,
                url: link || '',
                name: name || ''
            }));
            setIsEditCustomLink(true)
            setCustomMenuUpdateId(v?.menuId)
        } catch (error) {
            console.log(error)
            setIsEditCustomLink(false)
        }
    }

    // const updateCustomMenu = (v: any) => {
    //     console.log(v, "updateCustomMenu21");
    // }
    const otherMenuDelete = async (v: any) => {
        try {
            const res = await _post(remove_menu_item, { menu_id: +v?.menuId });
            if (res?.status && res?.data) {
                console.log(res, res?.data, "5df6gf3")
                _SUCCESS("Menu type deleted successfully!");
                const removeData = data.filter((item: any) => item?.menuId !== v.menuId);
                setData(removeData);
                // setGetMenuItemUrl(get_menu_items);
                setMenuItemDeletePayload({
                    "menu_type_id": res?.data?.data?.menu_item_id,
                    "menu_item_id": +res?.data?.data?.id,
                    "menu_item_type": res?.data?.data?.menu_item_type
                });
            }
        } catch (error) {
            console.error(error, "s56d4tg65sf1");
        }
    }

    // Delete menu
    const handleApplyDelete = async (id: string) => {
        console.log("id", id);
        try {
            const { data } = await _post(delete_menu_type, { id: current_menu_id });
            if (data?.success && data?.data) {
                setConfirmStatus("");
                _SUCCESS("Menu type deleted successfully!");
                clearMenuSelectedOptions();
            }
        } catch (error) {
            console.error(error);
        }
    }

    // main render.
    return (
        <div className='flex flex-col gap-8'>
            {/* Select a menu to edit: */}
            <div className='w-full flex items-center gap-1 p-4 border border-solid border-gray-300 bg-white shadow-md'>
                <span>Select a menu to edit:</span>
                <ActionDrop
                    btnValue="Apply"
                    selectFieldRootCls='w-80'
                    handleChange={handleChangeAction}
                    menuItemArray={actionArray}
                    value={actionValue}
                    btn
                />
                <Link href="#;" className='text-blue-600' onClick={handelRightSideBar}>Create Menu Types</Link>
            </div>

            {/* section for menu main part */}
            <div className={`flex w-full gap-4 `}>
                <div className={`flex flex-col gap-2 tabView:w-[30%] w-2/4`}>
                    {/* Pages */}
                    <SimpleCard className={`h-fit`} childrenClassName='flex flex-col items-end justify-between' heading={<><span>Pages</span><div></div></>}>
                        <div className='w-full flex flex-col gap-2 h-60 overflow-y-auto'>
                            {pages.map((itm: any, i: number) => {
                                console.log(pages, itm, "5gf4h6fg")
                                return (
                                    <div key={i} className='flex items-center justify-start gap-2' id={itm?.id}>
                                        <Checkbox className='p-0' checked={checkFilter(itm, 'P')} disabled={!actionValue} onClick={(e: any) => onCheckToSetPages(itm, e.target.checked)} />
                                        <div className=''>{itm.name}</div>
                                    </div>
                                )
                            }
                            )}
                        </div>
                    </SimpleCard>

                    {/* Product categories */}
                    <SimpleCard className={`h-fit`} childrenClassName='flex flex-col items-end justify-between' heading={<><span>Product categories</span><div></div></>}>
                        <div className='w-full h-60 overflow-y-auto'>
                            <ProductCategories dynArr={category} />
                        </div>
                    </SimpleCard>

                    {/* Custom Links */}
                    <SimpleCard className={`h-fit`} childrenClassName='flex flex-col items-end justify-between' heading={<><span>Custom Links</span><div></div></>}>
                        <div className='w-full flex flex-col items-end gap-2'>
                            <div className='w-full flex flex-col gap-2'>
                                <TextField
                                    name='url'
                                    label='URL'
                                    placeholder='https://'
                                    className='w-full py-2 px-4 border border-solid border-slate-600'
                                    value={customLink.url || ''}
                                    handelState={(e: any) => setCustomLink((pre: any) => ({ ...pre, url: e.target.value }))}
                                    disabled={!actionValue}
                                />
                                <TextField
                                    name='linktext'
                                    label='Link text'
                                    placeholder='Enter link Text'
                                    className='w-full py-2 px-4 border border-solid border-slate-600'
                                    value={customLink.name || ''}
                                    handelState={(e: any) => setCustomLink((pre: any) => ({ ...pre, name: e.target.value }))}
                                    disabled={!actionValue}
                                />
                            </div>
                            <PinkPawsbutton name={`${isEditCustomLink ? "Update menu" : "Add to menu"}`} pinkPawsButtonExtraCls='mt-2' handleClick={() => {
                                if (isEditCustomLink) {
                                    updateToMenuHandler()
                                } else {
                                    addToMenuHandler()
                                }
                            }} />
                        </div>
                    </SimpleCard>
                </div>

                {/* menu setup view */}
                <SimpleCard className={`tabView:w-[70%] w-2/4`} childrenClassName='flex justify-between' heading={<><div className='flex items-center justify-between cursor-pointer'><span>Menu Name: {actionName}</span><div className='cursor-pointer'>{!actionValue ? null : <DeleteIcon className='w-6 h-6 text-red-500 cursor-pointer' onClick={() => { setConfirmStatus(1) }} />}</div></div></>}>
                    <div id='right' className='w-full flex flex-col gap-4  max-h-full min-h-96'>
                        {data?.length ? data.map((v: any, i: number) => (
                            <div key={i} className='flex items-center justify-between w-full bg-slate-300 rounded p-2' id={v?.id}>
                                <div className='w-full'>{v?.name}
                                    {v.from == "custom" ?
                                        <>
                                            {/* <i className="fa-solid fa-pen-to-square text-red-500"></i> */}
                                            <span className='cursor-pointer text-red-500 ml-2' onClick={() => customMenuDelete(v)}>[Remove]</span>
                                            <span className='cursor-pointer text-blue-800 ml-2' onClick={() => updateCustomMenu(v)}>[Edit]</span>
                                        </>
                                        :
                                        // null
                                        <span className='cursor-pointer text-red-500 ml-2' onClick={() => otherMenuDelete(v)}>[Remove]</span>
                                    }
                                </div>
                                <div className='text-sm'>{v?.from}</div>
                            </div>
                        )) : null}
                    </div>
                </SimpleCard>
            </div>

            {/* Right Side bar Modal */}
            <RightSideModal widthClss={'lg:w-[30vw]'} modalStat={rightSideBarOpen} handleClose={handelRightSideBar} heading='Add New Menu Type'>
                <div className=' flex items-start gap-2.5'>
                    <div className='flex w-[100%] flex-col gap-4'>

                        <div className='flex items-start gap-4'>
                            <div className='flex flex-col items-start gap-1 w-full'>
                                <span className='font-medium'>Name:</span>
                                <span className='w-full'>
                                    <TextField className={`!w-full p-1 ${fieldBorder}`} placeholder='Enter Menu Type Name' name='name' handelState={handelOnChange} value={fields?.name} helperText={nameErr} />
                                    {/* <SelectField selectFieldRootCls='w-full ' handleChange={() => { }} menuItemArray={getOrderState} /> */}
                                </span>
                            </div>



                            <div className='flex flex-col items-start gap-1 w-full'>
                                <span className='font-medium'>Code:</span>
                                <span className='w-full'>
                                    <TextField type='number' className={`!w-full p-1 ${fieldBorder}`} placeholder='Enter Menu Code' name='code' handelState={handelOnChange} value={fields?.code} helperText={codeErr} />
                                    {/* <SelectField selectFieldRootCls='w-full ' handleChange={() => { }} menuItemArray={getOrderState} /> */}
                                </span>
                            </div>
                        </div>

                        <div className='flex items-center justify-end '>
                            <PinkPawsbutton
                                variant={"solid"}
                                name={"Add New Menu Type"}
                                icon={""}
                                handleClick={handleSubmit}
                                pinkPawsButtonExtraCls={""}
                                style={{}}
                                disabled={false}
                                title={""}
                            />
                        </div>
                    </div>
                </div>
            </RightSideModal>

            {/* Dialog for delete confirmation */}
            <Dialog
                open={confirmStatus !== ""}
                // onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogContent className='w-80 h-40 p-4'>
                    <div className='bg-white flex flex-col justify-between h-full'>
                        <p className='flex flex-col items-center justify-center'>
                            <span>Do you want to delete this recode?</span>
                        </p>
                        <div className='flex items-center gap-4'>
                            <PinkPawsbutton name='Confirm' pinkPawsButtonExtraCls='w-full' handleClick={() => { handleApplyDelete(confirmStatus); }} />
                            <PinkPawsbutton variant='outlined' name='Cancel' pinkPawsButtonExtraCls='w-full' handleClick={() => { setConfirmStatus("") }} />
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Menue;
