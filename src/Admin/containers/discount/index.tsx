import React, { useEffect, useState } from 'react'
import TextField from '../../components/TextField'
import { Autocomplete, Checkbox, FormControlLabel, MenuItem, TextField as MuiTextField, Select, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material'
import ActionDrop from '../../components/ActionDrop'
import PinkPawsbutton from '../../components/PinkPawsbutton';
import { _get, _post } from '../../../services';
import getUrlWithKey from '../../util/_apiUrl';
import { _SUCCESS } from '../../util/_reactToast';
import { useRouter } from 'next/router';
import IOSSwitch from '../../components/SwitchButtonMui';
import RightSideModal from '../../components/RightSideModal';
import Pageination from '../../components/Pageination';
import SearchAndAddNewComponent from '../../components/searchAddNewComponent';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import TextAreaField from '../../components/TextAreaField';
import Image from 'next/image';
import DiscountList from './List';

interface formState2I {
    discountFiltertypeId: number;
    condition: string;
    discountId: number;
    metadata: string;
}

const DiscountContainer = () => {
    const router = useRouter();
    const actionArray = [
        { value: 1, name: "Bulk Discount" },
    ]

    const [discountType, setDiscountType] = useState([])

    const [discountFilterType, setDiscountFilterType] = useState([])

    const { createDiscount, getDiscountType, getDiscountFilterType, getDiscountById } = getUrlWithKey("discount");

    const [filter_rule_valid_option, setFRVOption] = useState(false);

    const [formState, setFormState] = useState({
        title: '',
        isEnableChecked: false,
        isRuleChecked: false,
        selectedAction: null,
    });

    const [formState2, setFormState2] = useState<formState2I[]>([]);

    const handleChange = (field: string, value: any) => {
        setFormState(prevState => ({ ...prevState, [field]: value }));
    };

    const handleChange2 = (field: string, value: any, index: number) => {
        const array: any = [...formState2];
        array[index][field] = value;
        setFormState2(array);
    }

    const handleAddFilter = () => {
        const array: any = [...formState2];
        array.push({
            discountFiltertypeId: 0,
            condition: "INLIST",
            discountId: 1,
            metadata: null
        })
        setFormState2(array);
    }

    const handleRemoveFilter = (index: number) => {
        setFormState2(pre => (pre.filter((item: any, fIndex: number) => index !== fIndex)));
    }

    const { title, isEnableChecked, isRuleChecked, selectedAction } = formState;

    const handleSubmit = async () => {
        try {
            let dataSet: any = {}
            if (formState) {
                dataSet['title'] = formState.title;
                dataSet['discountTypeId'] = formState.selectedAction;
                dataSet['enable'] = formState.isEnableChecked;
                dataSet['ignore_all_rules'] = formState.isRuleChecked || false;
            }
            const { data } = await _post(createDiscount, dataSet);
            if (data?.success) {
                _SUCCESS("Discount Created Successfully!");
                // setFRVOption(data?.data?.id || false);
                router.push(`/admin/discount/${data?.data?.id}`);
            }
            console.log("formState", formState, data);
        } catch (error) {
            console.error(error);
        }
    }

    const stepOneHtml = () => {
        return (
            <div className='flex flex-col w-full gap-2'>
                <div className='flex items-start gap-4'>
                    <TextField
                        textFieldRoot={`w-full`}
                        className='!w-full p-1 border border-solid border-[#c4c4c4] rounded'
                        placeholder='Enter Discount Title'
                        name='title'
                        value={title}
                        handelState={(e: any) => handleChange('title', e.target.value)}
                    />
                    <ActionDrop
                        btnValue="Apply"
                        className={`w-full`}
                        selectFieldRootCls={`!w-full`}
                        handleChange={(e: any) => handleChange('selectedAction', e.target.value)}
                        menuItemArray={discountType}
                        value={selectedAction}
                        handleClick={() => { }}
                        btn={true}
                    />
                </div>
                <div className='flex items-start gap-4'>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={isEnableChecked}
                                className='px-[9px] py-0'
                                onClick={() => handleChange('isEnableChecked', !isEnableChecked)}
                            />
                        }
                        label="Enable ?"
                    />
                    {/* <FormControlLabel
                        control={
                            <Checkbox
                                checked={isRuleChecked}
                                className='px-[9px] py-0'
                                onClick={() => handleChange('isRuleChecked', !isRuleChecked)}
                            />
                        }
                        label="Apply this rule if matched and ignore all other rules"
                    /> */}
                </div>
            </div>
        )
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

    return (
        <>
            {/* <div>
                <h1>Step 1</h1>
                {stepOneHtml()}
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
            </div> */}
            <DiscountList>
                <div className='flex flex-col w-full gap-2 items-end'>
                    {stepOneHtml()}
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
            </DiscountList>
        </>
    )
}

export default DiscountContainer
