import React, { useState } from 'react'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

const CustomSelect = ({ dynArr, handleValue }: Props) => {

    //**  `dynArr` for listing the, `handleValue` for return the value *//

    const [selectOption, setSelectOption]: any = useState()
    const [optionOpen, setOptionOpen]: any = useState(false)

    const Productcategories = ({ dynArr }: any) => {
        return (
            <>
                {dynArr?.map((category: any, index: number) => {
                    console.log(category, "__-category")
                    return (
                        <div key={index} className='flex flex-col justify-start px-2'>
                            <div className='flex relative justify-start gap-2 items-start cursor-pointer' onClick={() => { setSelectOption(category.name), setOptionOpen(false), handleValue && handleValue({ name: category.name, id: category.id }) }} >
                                <span>{category.name}</span>
                            </div>
                            <div className='pl-[18px]'>
                                <Productcategories dynArr={category?.sub_categories} />
                            </div>
                        </div>
                    )
                })}

            </>
        )
    }

    return (
        <div className='flex flex-col gap-1 relative'>
            <div
                className={`w-full p-2 border border-solid border-slate-500 rounded flex justify-between ${selectOption ? 'text-black' : 'text-slate-400'}`}
                onClick={() => { setOptionOpen(!optionOpen) }}
            >
                <span>{selectOption ? selectOption : "select categories"}</span>
                <ArrowDropDownIcon className={`${optionOpen ? 'rotate-180' : 'rotate-0'} text-black`} />
            </div>
            {optionOpen ?
                <div className='h-64 bg-white overflow-y-auto border border-solid border-slate-500 rounded'>
                    <Productcategories dynArr={dynArr} />
                </div>
                : null}
        </div>
    )
}

interface Props {
    dynArr: [],
    handleValue?: CallableFunction
}

export default CustomSelect

//**example */
// const [setHandleValue11, setHandleValue11] = useState()
{/* <CustomSelect dynArr={category} handleValue={setHandleValue11}/> */ }
