import React, { useEffect, useState } from 'react'
import TextField from '../../../Admin/components/TextField'
import { Autocomplete, Checkbox, Dialog, DialogContent, FormControlLabel, TextField as MuiTextField } from '@mui/material'
import ActionDrop from '../../../Admin/components/ActionDrop'
import PinkPawsbutton from '../../../Admin/components/PinkPawsbutton';
import { _get, _post, _put } from '../../../Admin/services';
import getUrlWithKey from '../../../Admin/util/_apiUrl';
import { _SUCCESS } from '../../../Admin/util/_reactToast';
import { useRouter } from 'next/router';
import { capitalize, formatDate } from '../../../Admin/util/_common';
import withProtectedRoute from '../../../Admin/services/withProtectedRoute';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { useDispatch } from 'react-redux';
import { setPageLink } from '../../../Admin/reducer/pageLinkReducer';
import moment from 'moment';

interface formState2I {
    discountFiltertypeId: number;
    condition: string;
    discountId: number;
    metadata: string;
    preFilter?: any[];
    id?: any;
    buy_q?: any;
    get_q?: any;
}

interface formState3I {
    min_q: number;
    max_q: number;
    type: string;
    value: number | undefined;
    id?: any;
    discountId: number;
}

interface formStateItemQuantity3I {
    buy_q: number;
    get_q: number;
    id?: any;
}

interface formState4I {
    max_usage: number;
    valid_from: string;
    valid_to?: string;
    discountId?: number;
}


const DiscountContainer = () => {
    const router = useRouter();
    const { id }: any = router.query;

    const actionArray = [
        { value: 1, name: "Bulk Discount" },
    ]
    const [discountType, setDiscountType] = useState([]);
    const [discountFilterType, setDiscountFilterType] = useState([]);
    const [confirmStatus, setConfirmStatus]: any = useState(false);
    const [confirmStatus2, setConfirmStatus2]: any = useState(false);
    const [deleteIndex, setDeleteIndex]: any = useState();
    const [deleteIndex2, setDeleteIndex2]: any = useState();
    const [reload, setReload] = useState(false);
    const [filterTypeItem, setFilterTypeItem] = useState("");
    const [minDateFrom, setMinDateFrom] = useState('');
    const [maxDateFrom, setMaxDateFrom] = useState('');

    const [filteredSearchList, setFilteredSearchList] = useState<any[]>([]);
    const [inputValue, setInputValue]: any = useState<any>({ 0: '', 1: '' });
    const [checkUseIds, setCheckedUseIds] = useState<string[]>([]);
    // const [filteredItems, setFilterItems] = useState<any[]>([]);

    console.log("inputValue", inputValue)


    const { createDiscount, getDiscountType, getDiscountFilterType, getDiscountById, createDiscounyFilter, deleteDiscountFilter, createDiscountRange, deleteDiscountRange, craeteDiscountRuleLimit, create_discount_item_quantity } = getUrlWithKey("discount");

    const { product_search, product_category_search, get_product_search } = getUrlWithKey("products");
    const { category_search } = getUrlWithKey("category");

    const [filter_rule_valid_option, setFRVOption] = useState(true);

    const [formState, setFormState] = useState({
        title: '',
        isEnableChecked: false,
        isRuleChecked: false,
        selectedAction: null,
    });

    const [formState2, setFormState2] = useState<formState2I[]>([]);
    const [formState3, setFormState3] = useState<formState3I[]>([]);
    const [formStateItemQuantity3, setFormStateItemQuantity3]: any = useState<formStateItemQuantity3I>();
    const [formState4, setFormState4] = useState<formState4I>({
        max_usage: 0,
        valid_from: '',
        valid_to: ''
    });
    const [daaata, setdaaata]: any = useState([])

    useEffect(() => {
        const today = new Date();
        const dd = String(today.getDate()).padStart(2, '0');
        const mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
        const yyyy = today.getFullYear();

        setMinDateFrom(`${yyyy}-${mm}-${dd}`);
        setMaxDateFrom(`${yyyy}-${mm}-${dd}`);
    }, []);

    const defaultChecked = (rawValue: any[], directId?: boolean) => {
        let am = rawValue.map((item: any, i: number) => {
            return !directId ? item?.id : item;
        });
        let a: any[] = [...checkUseIds, ...am];
        // Removing duplicates
        let uniqueArray = [...new Set(a)];
        console.log("setCheckedUseIds", uniqueArray);

        setCheckedUseIds(uniqueArray);
    }

    console.log(formState4, "daaata__")
    console.log(filteredSearchList, "filteredSearchList")
    const autoPreSelected = (DiscountFilter: any, metadata?: any, index?: number, pre?: boolean) => {
        let rawValue = [];
        const mapOporation = (type: any, v: any) => {

            console.log(type, "type")
            if (v?.DiscountFilterMetaData && v.DiscountFilterMetaData?.id) {
                const meta = metadata ? metadata : v.DiscountFilterMetaData.metadata ? JSON.parse(v.DiscountFilterMetaData.metadata) : null;
                console.log("metadata__", meta);
                rawValue = [...rawValue, ...meta];
                if (meta && meta?.length) {
                    v['metadata'] = metadata ? JSON.stringify(metadata) : v.DiscountFilterMetaData.metadata || null;
                    v['preFilter'] = pre ? v?.DiscountFilterMetaData?.preFilter?.length ? v?.DiscountFilterMetaData?.preFilter : [] : [];
                    pre && setFilteredSearchList(v['preFilter']);
                    for (let m = 0; m < meta.length; m++) {
                        if (meta[m]) {
                            // try {
                            //     const { data } = await _get(`${get_product_search}/${+meta[m]}`);
                            //     console.log('vi: ', data);
                            //     if (data?.success && data?.data) {
                            //         // setFilteredSearchList(data.data);
                            //         // setFilterItems(pre => )
                            //         v['preFilter'].push(data.data)
                            //     }
                            // } catch (error: any) {
                            //     console.log(error);
                            // }
                            for (let a = 0; a < filteredSearchList?.length; a++) {
                                if (filteredSearchList[a]['id'] == meta[m]) {
                                    console.log("count_meta", filteredSearchList[a]['id'], a);
                                    v['preFilter'].push(filteredSearchList[a])
                                }
                            }
                        }

                        console.log('v: ', v['preFilter'])
                    }
                } else {
                    v['preFilter'] = [];
                }

                if (v.DiscountFilterMetaData?.buy_q) {
                    v['buy_q'] = String(v.DiscountFilterMetaData?.buy_q);
                }

                if (v.DiscountFilterMetaData?.get_q) {
                    v['get_q'] = String(v.DiscountFilterMetaData?.get_q);
                }
            }
            return v;
        }

        if (DiscountFilter && DiscountFilter?.length) {
            if (!index && index !== 0) {
                DiscountFilter = DiscountFilter.map((v: any, i: number) => {
                    return mapOporation(1, v);
                });
            } else {
                const v = DiscountFilter[index];
                if (v && v?.discountFiltertype && v?.discountFiltertype?.name) {
                    setFilterTypeItem(v?.discountFiltertype?.name.toLowerCase())
                }
                return mapOporation(0, v);
            }
            DiscountFilter.map((v: any, i: number) => {
                setInputValue(((pre: any) => ({
                    ...pre,
                    [index]: ''
                })));
            });
            setFormState2(DiscountFilter);
            defaultChecked(rawValue, true);
        }
    }

    const handleChange = (field: string, value: any) => {
        setFormState(prevState => ({ ...prevState, [field]: value }));
    };

    const handleChangeRuleLimit = (field: string, value: any) => {
        console.log('handleChangeRuleLimit', field, value, formState4)
        const getValue = () => {
            let v = value;
            // if (field === 'valid_from' || field === 'valid_to') {
            return new Date(value);
            // }
            return v
        }
        function isValidDate(validForm: any) {
            // Check if the date string is in YYYY-MM-DD format
            // const regex = /^\d{4}-\d{2}-\d{2}$/;
            // if (!regex.test(validForm)) {
            //     return false;
            // }

            const date = new Date(validForm);
            if (isNaN(date.getTime())) {
                return false;
            }
            return true;
        }

        if (field === "valid_to") {
            let isValid = isValidDate(formState4.valid_from);
            if (isValid) {
                const validFrom = new Date(formState4?.valid_from);
                let validTo = new Date(value);

                if (validFrom > validTo) {
                    setFormState4(prevState => ({ ...prevState, [field]: `` }));
                } else {
                    // setFormState4(prevState => ({ ...prevState, [field]: `${validTo}` }));
                    setFormState4(prevState => ({ ...prevState, [field]: getValue() }));
                }
            }
        }

        if (field === "valid_from") {
            let validFrom = new Date(value);

            const tomorrow = new Date(validFrom);
            tomorrow.setDate(validFrom.getDate() + 1);

            const year = tomorrow.getFullYear();
            const month = String(tomorrow.getMonth() + 1).padStart(2, '0'); // Month is zero-indexed
            const day = String(tomorrow.getDate()).padStart(2, '0');

            let afterOneDay = `${year}-${month}-${day}`;

            // setFormState4(prevState => ({ ...prevState, [field]: `${validFrom}` }));
            setFormState4(prevState => ({ ...prevState, [field]: getValue() }));
            setFormState4(prevState => ({ ...prevState, ["valid_to"]: `` }));
            setMaxDateFrom(moment(`${afterOneDay}`).format("YYYY-MM-DD"));
        }

        // setFormState4(prevState => ({ ...prevState, [field]: value }));
    };
    console.log(formState2, "formState2__")
    const handleChange2 = (field: string, value: any, index: number, rawValue?: any) => {
        console.log(field, value, index, rawValue, "handleChange2-value");
        if (rawValue?.length) {
            defaultChecked(rawValue);
        }
        const array: any = [...formState2];
        array[index][field] = value;
        if (field === "discountFiltertypeId") {
            array[index]["preFilter"] = []
        } else {
            // if (field == "metadata" && array[index]['id']) {
            if (field == "metadata") {
                autoPreSelected(array, JSON.parse(value), index, false);
                // setdaaata(rawValue)
                array[index]["preFilter"] = rawValue
            }
        }
        // setFilteredSearchList([])
        setFormState2(array);
        setInputValue(((pre: any) => ({
            ...pre,
            [index]: ''
        })));
        console.log(array[index][field], value, field, array, "__array")
    }



    const handleChangeRange = (field: string, value: any, index: number) => {
        const array: any = [...formState3];
        array[index][field] = field !== "type" ? value && +value : value;
        setFormState3(array);
    }

    const handleChangeItemQuantity = (field: string, value: any, index: number) => {
        console.log("handleChangeItemQuantity", index)
        const array: any = { ...formStateItemQuantity3 };
        array[field] = value;
        setFormStateItemQuantity3(array);

        if (selectedAction !== "1") {
            const arr = [...formState2];
            if (arr[index]) {
                arr[index] = {
                    ...arr[index],
                    [field]: value
                }
            }
            setFormState2(arr);
        }
    }

    console.log("formState2>>>>>>>>>>>>>", formState2)

    const handleAddFilter = () => {
        const array: any = [...formState2];
        console.log('arr: ', array)
        array.push({
            discountFiltertypeId: 0,
            condition: "INLIST",
            discountId: id,
            metadata: '[]',
            preFilter: []
        })
        setFormState2(array);
        setInputValue(((pre: any) => ({
            ...pre,
            [array.length - 1]: ''
        })))
    }

    const handleAddRange = () => {
        const array: any[] = [...formState3];
        // array.push({
        //     min_q: array.length ? array[array.length - 1]['max_q'] + 1 : 1,
        //     max_q: null,
        //     type: '',
        //     value: null,
        //     discountId: +id
        // })
        array.push({
            min_q: 1,
            max_q: 100,
            type: '',
            value: null,
            discountId: +id
        })
        setFormState3(array);
    }

    const handleAddRangeBuyGet = () => {
        try {
            const { data }: any = _post(create_discount_item_quantity, { dataSet: { buy_q: +formStateItemQuantity3?.buy_q, get_q: +formStateItemQuantity3?.get_q, discount_id: +id } })
            console.log(data, "_datalog")
        } catch (error) {
            console.log(error, "__error")
        }
    }

    const handleRemoveFilter = async (index: number) => {
        const dataSet = formState2[index];
        if (dataSet?.id) {
            try {
                const { data: discountData } = await _post(deleteDiscountFilter, { id: dataSet?.id });
                if (discountData?.success) {
                    _SUCCESS("Discount deleted Successfully!");
                    setFRVOption(discountData?.data?.id || false);
                }
            } catch (error) {
                console.error(error)
            }
        }
        setFormState2(pre => (pre.filter((item: any, fIndex: number) => index !== fIndex)));
        onCloseDilog();
    }

    const handleRemoveRange = async (index: number) => {
        const dataSet = formState3[index];
        if (dataSet?.id) {
            try {
                const { data: discountData } = await _post(deleteDiscountRange, { id: dataSet?.id });
                if (discountData?.success) {
                    _SUCCESS("Discount deleted Successfully!");
                }
            } catch (error) {
                console.error(error)
            }
        }
        setFormState3(pre => (pre.filter((item: any, fIndex: number) => index !== fIndex)));
        onCloseDilog();
    }

    const { title, isEnableChecked, isRuleChecked, selectedAction } = formState;
    console.log("selectedAction", selectedAction)

    const handleSubmit = async () => {
        try {
            console.log("formState3", formState3);
            let dataSet: any = {}
            if (formState) {
                dataSet['title'] = formState.title;
                dataSet['discountTypeId'] = formState.selectedAction;
                dataSet['enable'] = formState.isEnableChecked;
                dataSet['ignore_all_rules'] = formState.isRuleChecked || false;
            }
            const { data: discountData } = await _post(createDiscount, { ...dataSet, id });

            if (discountData?.success) {
                // _SUCCESS("Discount updated Successfully!");
                setFRVOption(discountData?.data?.id || false);
            }

            // createDiscounyFilter
            const { data } = await _post(createDiscounyFilter, { dataSet: formState2 });
            if (data?.success) {
                // _SUCCESS("Discount Filter updated Successfully!");
            }

            // createDiscountRange
            const { data: discountRange } = await _post(createDiscountRange, { dataSet: formState3 });
            if (discountRange?.success) {
                // _SUCCESS("Discount Range Successfully!");
                // setFRVOption(discountData?.data?.id || false);
            }

            // craeteDiscountRuleLimit
            let discountRuleLimitSuccess = false
            if (formState4.valid_from) {
                let ruleData: formState4I = { ...formState4 };
                if (!ruleData['valid_to']) {
                    delete ruleData['valid_to'];
                }
                const { data: discountRuleLimit } = await _post(craeteDiscountRuleLimit, { ...ruleData, discountId: +id });
                if (discountRuleLimit?.success) {
                    // _SUCCESS("Discount Rule Limit Updated Successfully!");
                    discountRuleLimitSuccess = discountRuleLimit?.success;
                    // setFRVOption(discountData?.data?.id || false);
                }
            }

            // if (discountData?.success && data?.success && discountRange?.success && discountRuleLimitSuccess) {
            if (discountData?.success) {
                _SUCCESS("Discount Updated Successfully!");
                router.push("/admin/discount")
            }

            setReload(true);
        } catch (error) {
            console.error(error);
        }
    }
    const flexColGap2 = "flex flex-col gap-2"
    const flexCenterWFull = "flex items-center gap-2 w-full"
    const textFieldCls = "!w-full py-0.5 px-1 border border-solid border-[#c4c4c4] rounded"
    const h1Txt = "text-lg text-gray-700 font-semibold"
    console.log(selectedAction, "selectedAction")
    const stepOneHtml = () => {
        return (
            <div className={`${flexColGap2}`}>
                <div className={`${flexCenterWFull}`}>
                    <TextField
                        textFieldRoot={`w-1/2`}
                        className={`${textFieldCls}`}
                        placeholder='Enter Discount Title'
                        name='title'
                        value={title}
                        handelState={(e: any) => handleChange('title', e.target.value)}
                    />
                    <ActionDrop
                        btnValue="Apply"
                        className={`w-1/2`}
                        selectFieldRootCls={`!w-full`}
                        handleChange={(e: any) => handleChange('selectedAction', e.target.value)}
                        menuItemArray={discountType}
                        value={selectedAction}
                        handleClick={() => { }}
                        btn={true}
                    />
                </div>
                <div className={`${flexColGap2}`}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={isEnableChecked}
                                className='px-[9px] !py-0'
                                onClick={() => handleChange('isEnableChecked', !isEnableChecked)}
                            />
                        }
                        label="Enable ?"
                    />
                    {/* <FormControlLabel
                        control={
                            <Checkbox
                                checked={isRuleChecked}
                                className='px-[9px] !py-0'
                                onClick={() => handleChange('isRuleChecked', !isRuleChecked)}
                            />
                        }
                        label="Apply this rule if matched and ignore all other rules"
                    /> */}
                </div>
            </div>
        )
    }

    // const autocompleteSelect = [
    //     { label: 'dog0 1994', id: "0_id" },
    //     { label: 'cat0 1972', id: "1_id" },
    //     { label: 'dog1 1974', id: "2_id" },
    //     { label: 'cat1 2008', id: "3_id" },
    //     { label: 'dog2 1957', id: "4_id" },
    //     { label: 'cat2 1993', id: "5_id" },
    //     { label: 'dog3 1994', id: "6_id" },
    //     { label: 'cat3 1996', id: "7_id" },
    // ]

    const stepTwoHtml = (buyAndGet: boolean = false) => {

        const conditions = [
            { name: 'In List', value: "INLIST" },
            { name: 'Not In List', value: "NOTINLIST" },
        ]

        const handelOptionArrayValue = (v: any[]) => {
            console.log('filter: ', v);
            if (v.length) {
                v = v.map((item: any, i: number) => {
                    if (item && item?.id) {
                        return item?.id;
                    }
                })
                console.log("v>>>>", v)
            }
            return JSON.stringify(v);
        }


        const handleGetSearch = async (typeId: number, value: any, index: number) => {
            let url = typeId === 1 ? product_search : category_search;
            setInputValue(((pre: any) => ({
                ...pre,
                [index]: value
            })));
            try {
                const { data } = await _get(`${url}?search=${value}`);
                if (data?.success && data?.data && data?.data?.length) {
                    let arr = [...data?.data];
                    let arr1 = [];

                    arr1 = arr.filter((itm: any, i: number) => {
                        if (!checkUseIds.includes(itm?.id)) {
                            return itm;
                        }
                    })
                    setFilteredSearchList(arr1);
                }
            } catch (error: any) {
                console.log(error);
            }
        }
        // useEffect(() => {
        //     const fetchDiscountType = async () => {
        //         try {
        //             const { data } = await _get(getDiscountType);
        //             if (data?.success && data?.data && data?.data?.length) {
        //                 setDiscountType(data.data);
        //             }
        //             console.log("data>>>>>", data);
        //         } catch (error) {
        //             console.error(error);
        //         }
        //     }
        //     getDiscountType && fetchDiscountType();
        //     const fetchDiscountFilterType = async () => {
        //         try {
        //             const { data } = await _get(getDiscountFilterType);
        //             if (data?.success && data?.data && data?.data?.length) {
        //                 setDiscountFilterType(data.data);
        //             }
        //             console.log("data>>>>>", data);
        //         } catch (error) {
        //             console.error(error);
        //         }
        //     }
        //     getDiscountFilterType && fetchDiscountFilterType();
        // }, []);

        const filterData = (vArr: any) => {
            console.log(vArr, "vArr__")
            let seenIds = new Set();
            let filteredArray: any[] = [];
            if (vArr && vArr?.length) {

                filteredArray = vArr?.filter((item: { id: string, label: string }) => {
                    if (seenIds.has(item.id)) {
                        return false;
                    } else {
                        seenIds.add(item.id);
                        return true;
                    }
                });
            }

            return filteredArray;
        }

        return (
            <>
                {
                    formState2.length ? formState2.map((v: formState2I, i: number) => {
                        console.log('vvv ', v);
                        return (
                            <div key={i} className={`${flexColGap2} mb-2`}>
                                {
                                    buyAndGet && stepThreeItemQuantityHtml(i)
                                }
                                <div className={`${flexCenterWFull}`}>
                                    <ActionDrop
                                        btnValue="Apply"
                                        className={`w-1/2`}
                                        selectFieldRootCls={`!w-full`}
                                        handleChange={(e: any) => handleChange2('discountFiltertypeId', e.target.value, i)}
                                        menuItemArray={discountFilterType}
                                        value={v.discountFiltertypeId}
                                        handleClick={() => { }}
                                        btn={true}
                                    />
                                    <ActionDrop
                                        btnValue="Apply"
                                        className={`w-1/2`}
                                        selectFieldRootCls={`!w-full`}
                                        handleChange={(e: any) => handleChange2('condition', e.target.value, i)}
                                        menuItemArray={conditions}
                                        value={v.condition}
                                        handleClick={() => { }}
                                        btn={true}
                                    />
                                </div>
                                <div className={`${flexColGap2} items-end`}>

                                    {/* <div className='flex gap-1 flex-wrap'>


                                        <div key={i} className='p-0.5 px-1.5 text-sm bg-slate-200 rounded-full flex items-center gap-1'>
                                            {v?.preFilter && capitalize('hhhhh')}
                                            <HighlightOffIcon className='text-lg cursor-pointer' onClick={() => { }} />
                                        </div>

                                    </div> */}

                                    {/* {formState2 &&  formState2?.length ?
                                        <div className='flex gap-1 flex-wrap'>
                                            
                                            {formState2?.map((f: any, i: number) =>
                                                <div key={i} className='p-0.5 px-1.5 text-sm bg-slate-200 rounded-full flex items-center gap-1'>
                                                    {capitalize(f?.preFilter?.label)}
                                                    <HighlightOffIcon className='text-lg cursor-pointer' onClick={() => handleDeleteTerms(value?.id, v?.id)} />
                                                </div>)
                                            }
                                        </div>
                                        : null} */}
                                    <Autocomplete
                                        multiple
                                        id="tags"
                                        options={filteredSearchList}
                                        getOptionLabel={(option) => option.label}
                                        filterSelectedOptions={true}
                                        className='atocompleteCls w-full'
                                        renderInput={(params) => (<MuiTextField {...params} placeholder={`Select Items`} onChange={(e: any) => handleGetSearch(+v.discountFiltertypeId, e.target.value, i)} />)}
                                        onChange={(e: any, v: any) => { console.log(v, "anyV"); handleChange2('metadata', handelOptionArrayValue(v), i, v) }}
                                        value={filterData(v?.preFilter)}
                                        inputValue={inputValue[i]}
                                    />
                                    <PinkPawsbutton
                                        variant={"solid"}
                                        name={"Remove Filter"}
                                        icon={""}
                                        handleClick={() => { setConfirmStatus(true); setDeleteIndex(i) }}
                                        pinkPawsButtonExtraCls={""}
                                        style={{}}
                                        disabled={false}
                                        title={""}
                                    />
                                </div>

                            </div>
                        )
                    }) : null
                }
            </>
        )
    }

    const stepThreeHtml = () => {
        const actionArray = [
            {
                value: "parsentage", name: "Parsentage"
            },
            {
                value: "fixed", name: "Fixed"
            }
        ]
        return (
            <>
                {
                    formState3?.length ? formState3.map((v: formState3I, i: number) => {
                        return (
                            <div key={i} className={`${flexColGap2} items-end mb-2`}>
                                {/* <div className={`${flexCenterWFull}`}>
                                    <TextField
                                        textFieldRoot={`w-1/2`}
                                        className={`${textFieldCls}`}
                                        placeholder='Minimum Quantity'
                                        name='min_q'
                                        value={v.min_q}
                                        handelState={(e: any) => handleChangeRange('min_q', e.target.value, i)}
                                        type='number'
                                    />
                                    <TextField
                                        textFieldRoot={`w-1/2`}
                                        className={`${textFieldCls}`}
                                        placeholder='Maximum Quantity'
                                        name='max_q'
                                        value={v.max_q}
                                        handelState={(e: any) => handleChangeRange('max_q', e.target.value, i)}
                                        type='number'
                                    />
                                </div> */}
                                <div className={`${flexCenterWFull}`}>
                                    <ActionDrop
                                        btnValue="Apply"
                                        className={`w-1/2`}
                                        selectFieldRootCls={`!w-full`}
                                        handleChange={(e: any) => handleChangeRange('type', e.target.value, i)}
                                        menuItemArray={actionArray}
                                        value={v.type}
                                        handleClick={() => { }}
                                        btn={true}
                                    />
                                    <TextField
                                        textFieldRoot={`w-1/2`}
                                        className={`${textFieldCls}`}
                                        placeholder='Discount Value'
                                        name='value'
                                        value={v.value}
                                        handelState={(e: any) => handleChangeRange('value', e.target.value, i)}
                                        type='number'
                                    />
                                </div>
                                {/* <PinkPawsbutton
                                    variant={"solid"}
                                    name={"Remove Range"}
                                    icon={""}
                                    handleClick={() => { setConfirmStatus2(true); setDeleteIndex2(i) }}
                                    pinkPawsButtonExtraCls={""}
                                    style={{}}
                                    disabled={false}
                                    title={""}
                                /> */}
                            </div>
                        )
                    }) : null
                }
            </>

        )
    }

    console.log(formStateItemQuantity3, "formStateItemQuantity3")
    const stepThreeItemQuantityHtml = (index?: number) => {
        return (
            <>
                <div key={1} className={`${flexCenterWFull}`}>
                    <TextField
                        textFieldRoot={`w-1/2`}
                        className={`${textFieldCls}`}
                        placeholder='Buy Quantity'
                        name='buy_q'
                        value={formState2[index]?.buy_q}
                        handelState={(e: any) => handleChangeItemQuantity('buy_q', e.target.value, index)}
                        type='number'
                    />
                    <TextField
                        textFieldRoot={`w-1/2`}
                        className={`${textFieldCls}`}
                        placeholder='Get Quantity'
                        name='get_q'
                        value={formState2[index]?.get_q}
                        handelState={(e: any) => handleChangeItemQuantity('get_q', e.target.value, index)}
                        type='number'
                    />
                </div>
            </>
        )
    }

    const stepFourHtml = () => {
        return (
            <div className={`${flexColGap2}`}>
                {/* <TextField
                    textFieldRoot={`w-full`}
                    className={`${textFieldCls}`}
                    placeholder='Maximum usage limit'
                    name='max_usage'
                    value={formState4.max_usage}
                    handelState={(e: any) => handleChangeRuleLimit('max_usage', +e.target.value)}
                    type='number'
                /> */}
                <div className={`${flexCenterWFull}`}>
                    <TextField
                        textFieldRoot={`w-1/2`}
                        className={`${textFieldCls}`}
                        placeholder='Vaild from'
                        name='valid_from'
                        // value={formState4.valid_from}
                        value={moment(formState4.valid_from).format("YYYY-MM-DD")}
                        // value={formatDate(formState4.valid_from)}
                        handelState={(e: any) => handleChangeRuleLimit('valid_from', e.target.value)}
                        type='date'
                        min={minDateFrom}
                    />
                    <TextField
                        textFieldRoot={`w-1/2`}
                        className={`${textFieldCls}`}
                        placeholder='Vaild to'
                        name='valid_to'
                        value={moment(formState4.valid_to).format("YYYY-MM-DD")}
                        // value={formatDate(formState4.valid_to)}
                        handelState={(e: any) => handleChangeRuleLimit('valid_to', e.target.value)}
                        type='date'
                        min={maxDateFrom}
                    />
                </div>
            </div>
        )
    }

    const onCloseDilog = () => {
        setConfirmStatus(false)
        setConfirmStatus2(false)
    }

    useEffect(() => {
        const fetchDiscountType = async () => {
            try {
                const { data } = await _get(getDiscountType);
                if (data?.success && data?.data && data?.data?.length) {
                    setDiscountType(data.data);
                }
                console.log("data>>>>>", data);
            } catch (error) {
                console.error(error);
            }
        }
        getDiscountType && fetchDiscountType();
        const fetchDiscountFilterType = async () => {
            try {
                const { data } = await _get(getDiscountFilterType);
                if (data?.success && data?.data && data?.data?.length) {
                    setDiscountFilterType(data.data);
                }
                console.log("data>>>>>", data);
            } catch (error) {
                console.error(error);
            }
        }
        getDiscountFilterType && fetchDiscountFilterType();
    }, [getDiscountType, getDiscountFilterType]);

    useEffect(() => {
        const fetchDicountById = async (d_id: number) => {
            try {
                const { data } = await _put(getDiscountById, { id: d_id });
                if (data?.success && data?.data) {
                    // setDiscountFilterType(data.data);
                    setFormState({
                        title: data?.data?.title || "",
                        isEnableChecked: data?.data?.enable,
                        isRuleChecked: data?.data?.ignore_all_rules,
                        selectedAction: data?.data?.discountTypeId,
                    });

                    // autocompleteSelect
                    autoPreSelected(data?.data?.DiscountFilter, null, undefined, true);
                    console.log(data?.data?.DiscountFilter, "__DiscountFilter__")

                    // Range Pre Set
                    // setFormState3(data?.data?.DiscountRange || []);

                    setFormState3((data?.data?.DiscountRange && data?.data?.DiscountRange?.length) ? data?.data?.DiscountRange : [{
                        min_q: 1,
                        max_q: 100,
                        type: '',
                        value: null,
                        discountId: +id
                    }])

                    console.log('forrmMMM', formState3)
                    // Rule Limit Set
                    if (data?.data?.DiscountRuleLimit) {
                        let ruleLimit = data?.data?.DiscountRuleLimit;
                        let valid_from = ruleLimit?.valid_from;
                        let valid_to = ruleLimit?.valid_to;
                        // console.log('afterOneDay1', "afterOneDay")
                        setFormState4(data?.data?.DiscountRuleLimit);

                        let fromDate = new Date(valid_from);
                        const tomorrow1 = new Date(fromDate);
                        tomorrow1.setDate(fromDate.getDate() + 1);

                        const year = tomorrow1.getFullYear();
                        const month = String(tomorrow1.getMonth() + 1).padStart(2, '0'); // Month is zero-indexed
                        const day = String(tomorrow1.getDate()).padStart(2, '0');

                        let afterOneDay = `${year}-${month}-${day}`;

                        // setMinDateFrom(moment(`${valid_from}`).format("YYYY-MM-DD"));
                        setMaxDateFrom(moment(`${afterOneDay}`).format("YYYY-MM-DD"));
                    }
                    // data?.data?.DiscountRuleLimit && setFormState4(data?.data?.DiscountRuleLimit);
                    data?.data?.DiscountItemQuantity?.length && setFormStateItemQuantity3(data?.data?.DiscountItemQuantity[0]);
                }
            } catch (error) {
                console.error(error);
            }
        }
        if (id && !reload) {
            console.log("id", id);
            setFRVOption(id || false);
            fetchDicountById(id);
        }
        if (reload) {
            fetchDicountById(id);
            setReload(false);
        }
    }, [id, reload])

    console.log("fetchDicountById>>>>>", formState2);


    let dispatch = useDispatch()

    dispatch(setPageLink({ key: "discountRules" }))

    return (
        <>
            {/* Step 1 */}
            <div className={`${flexColGap2} shadow-ppa-6xl p-4 mb-4`}>
                {/* <h1 className={`${h1Txt}`}>Step 1</h1>
                <hr className='mb-2 border-gray-400' /> */}
                {stepOneHtml()}
            </div>

            {/* Step 2 */}
            <div className={`${flexColGap2} shadow-ppa-6xl p-4 mb-4`}>
                <div className='flex items-center justify-between'>
                    <h1 className={`${h1Txt}`}>Filter</h1>
                    <PinkPawsbutton
                        variant={"solid"}
                        name={"Add Filter"}
                        icon={""}
                        handleClick={handleAddFilter}
                        pinkPawsButtonExtraCls={""}
                        style={{}}
                        disabled={false}
                        title={""}
                    />
                </div>
                {formState2.length ? <hr className='mb-2 border-gray-400' /> : null}
                {stepTwoHtml((selectedAction === "2" || selectedAction === 2) ? true : false)}
            </div>


            {/* Step 3 */}
            {(selectedAction === "1" || selectedAction === 1) ?
                <div className={`${flexColGap2} shadow-ppa-6xl p-4 mb-4`}>
                    <div className='flex items-center justify-between'>
                        <h1 className={`${h1Txt}`}>Discount</h1>
                        {/* <PinkPawsbutton
                            variant={"solid"}
                            name={"Add Range"}
                            icon={""}
                            handleClick={handleAddRange}
                            pinkPawsButtonExtraCls={""}
                            style={{}}
                            disabled={false}
                            title={""}
                        /> */}
                    </div>
                    {formState3.length ? <hr className='mb-2 border-gray-400' /> : null}
                    {stepThreeHtml()}
                </div>
                :
                null}

            {/* Step 4 */}
            <div className={`${flexColGap2} shadow-ppa-6xl p-4`}>
                <h1 className={`${h1Txt}`}>Rules (Optional)</h1>
                <hr className='mb-2 border-gray-400' />
                {stepFourHtml()}
            </div>

            <div className='my-4 w-full flex justify-end'>
                <PinkPawsbutton
                    variant={"solid"}
                    name={"Save Discount"}
                    icon={""}
                    handleClick={handleSubmit}
                    pinkPawsButtonExtraCls={""}
                    style={{}}
                    disabled={false}
                    title={""}
                />
            </div>

            {confirmStatus && <Dialog
                open={confirmStatus}
                // onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogContent className='w-80 h-40 p-4'>
                    <div className='bg-white flex flex-col justify-between h-full'>
                        <p className='flex flex-col items-center justify-center'>
                            <span>Do you want to delete this record?</span>
                        </p>
                        <div className='flex items-center gap-4'>
                            <PinkPawsbutton name='Confirm' pinkPawsButtonExtraCls='w-full' handleClick={() => { handleRemoveFilter(deleteIndex) }} />
                            <PinkPawsbutton variant='outlined' name='Cancel' pinkPawsButtonExtraCls='w-full' handleClick={() => onCloseDilog()} />
                        </div>
                    </div>
                </DialogContent>
            </Dialog>}
            {
                confirmStatus2 && <Dialog
                    open={confirmStatus2}
                    // onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogContent className='w-80 h-40 p-4'>
                        <div className='bg-white flex flex-col justify-between h-full'>
                            <p className='flex flex-col items-center justify-center'>
                                <span>Do you want to delete this record?</span>
                            </p>
                            <div className='flex items-center gap-4'>
                                <PinkPawsbutton name='Confirm' pinkPawsButtonExtraCls='w-full' handleClick={() => { handleRemoveRange(deleteIndex2) }} />
                                <PinkPawsbutton variant='outlined' name='Cancel' pinkPawsButtonExtraCls='w-full' handleClick={() => onCloseDilog()} />
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            }
        </>
    )
}

export default withProtectedRoute(DiscountContainer)
