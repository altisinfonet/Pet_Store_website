import React, { useEffect, useState } from 'react'
import PinkPawsbutton from '../PinkPawsbutton'
import SearchField from '../SearchField'
import ButtonField from '../ButtonField'

const SearchAndAddNewComponent = ({ addNewProduct, name, buttonTxt, res, addButtonOff, customValue, placeholder, listDataChield }: any) => {
    const [searchValue, setSearchValue] = useState("");

    const handelSearchValue = (value: any) => {
        if (value) {
            setSearchValue(value)
        } else {
            setSearchValue(value)
            res("");
        }
    }

    const handelSearch = () => {
        res(searchValue);
    }

    useEffect(() => {
        if (customValue) {
            setSearchValue(customValue);
        }
    }, [customValue])

    // const getSearchDataService = async () => {
    //     try {
    //         // 
    //     } catch (error) {
    //         console.error(error);
    //     }
    // }


    return (
        <>
            {listDataChield ?
                <div className='flex flex-col gap-2 items-start justify-between w-full'>
                    {!addButtonOff ? <PinkPawsbutton
                        variant={"solid"}
                        name={name}
                        icon={""}
                        handleClick={addNewProduct}
                        pinkPawsButtonExtraCls={""}
                        style={{}}
                        disabled={false}
                        title={""}
                    /> : <div></div>}
                    <div className='flex items-center justify-between w-full'>
                        {listDataChield}
                        <div className='flex items-center gap-2'>
                            <SearchField handleState={handelSearchValue} value={searchValue} placeholder={placeholder ? placeholder : ""} />
                            <ButtonField buttonTxt={buttonTxt ? buttonTxt : 'Search products'} buttonCls={`!text-[14px]`} handleClick={handelSearch} />
                        </div>
                    </div>
                </div>
                :
                <div className='flex gap-2 items-start justify-between w-full'>
                    {!addButtonOff ? <PinkPawsbutton
                        variant={"solid"}
                        name={name}
                        icon={""}
                        handleClick={addNewProduct}
                        pinkPawsButtonExtraCls={""}
                        style={{}}
                        disabled={false}
                        title={""}
                    /> : <div></div>}
                    <div className='flex items-center gap-2'>
                        <SearchField handleState={handelSearchValue} value={searchValue} placeholder={placeholder ? placeholder : ""} />
                        <ButtonField buttonTxt={buttonTxt ? buttonTxt : 'Search products'} buttonCls={`!text-[14px]`} handleClick={handelSearch} />
                    </div>
                </div>
            }
        </>
    )
}

export default SearchAndAddNewComponent
