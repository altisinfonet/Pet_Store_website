import React, { useEffect, useState } from 'react'
import getUrlWithKey from '../../../util/_apiUrl'
import { _get, _put } from '../../../services'
import { _ERROR, _INFO, _SUCCESS } from '../../../util/_reactToast'
import customArrowLink from "../../../../public/assets/icon/customArrowLink.svg";
import Image from 'next/image'
import PinkPawsbutton from '../../../Admin/components/PinkPawsbutton';
import QuizIcon from '@mui/icons-material/Quiz';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

const Faqs = () => {

    const { faqs, get_faq_module } = getUrlWithKey("client_apis")

    const [categories, setCategories]: any = useState([])
    const [faqData, setFaqData]: any = useState([])
    const [viewAns, setViewAns]: any = useState("")


    const getFaqs = async (id: any) => {
        try {
            const { data } = await _put(faqs, { module_id: +id })
            if (data?.success) {
                console.log("get faqs:", data?.data)
                if (data?.data?.length) {
                    setFaqData(data?.data)
                    setViewAns(data?.data[0]?.id)
                } else {
                    _INFO("No Faqs available")
                }
            }
        } catch (error) {
            console.log(error, "error_")
        }
    }

    const GetCategory = async () => {
        try {
            const { data } = await _put(get_faq_module)
            if (data?.success) {
                console.log("get:", data?.data, "___data")
                setCategories(data?.data)
            }
        } catch (error) {
            _ERROR(error?.response?.data?.massage)
            console.log(error, "error_")
        }
    }

    useEffect(() => {
        GetCategory()
    }, [])

    console.log(viewAns, "__faqId")

    return (
        <div className='container faq-root'>
            <div className={`${faqData?.length ? `justify-between` : `justify-center`} flex items-center w-full uppercase font-medium ppsL my-4`}>
                <h1 className="sp-title m-0" style={{ fontSize: "150%" }}>FAQ</h1>
                {faqData?.length ? <PinkPawsbutton name={'Back'} variant={"outlined"} pinkPawsButtonExtraCls={`vPinkBtn`} handleClick={() => { setFaqData([]); setViewAns("") }} /> : null}
            </div>

            {faqData?.length ?
                <div className='flex flex-col gap-3'>
                    {faqData.map((v: any, i: number) =>
                        <div key={i} className='flex flex-col blog-card p-0' >
                            <div className={`flex items-center justify-between p-3 ${v?.id === viewAns ? `pb-2` : ``}`} style={{ borderBottom: "1px solid #efefef" }}>
                                <h1 className='faq-q m-0 p-0' ><span className='start'>Q.</span>&nbsp;{v?.question}</h1>
                                {v?.id === viewAns ?
                                    faqData[0]?.id !== viewAns ?
                                        <RemoveCircleOutlineIcon
                                            className='cursor-pointer'
                                            style={{ color: "#ff54ae", fontWeight: "400" }}
                                            onClick={() => setViewAns(faqData[0]?.id)}
                                        />
                                        : null
                                    :
                                    <AddCircleOutlineIcon
                                        className='cursor-pointer'
                                        style={{ color: "#ff54ae", fontWeight: "400" }}
                                        onClick={() => setViewAns(v?.id)}
                                    />}
                            </div>
                            {v?.id === viewAns ? <p className='faq-a m-0 p-3 pt-2'><span className='start'>Ans.</span>&nbsp;<span style={{ color: "#5b5b5b" }} className='faq_ans_root' dangerouslySetInnerHTML={{ __html: v?.anwser }} /></p> : null}
                        </div>
                    )}
                </div>
                :
                <div className="row">
                    {categories?.length ? categories.map((v: any, e: number) =>
                        <div
                            key={e}
                            className="col-lg-4 cursor-pointer"
                            style={{ paddingTop: "10px" }}
                            onClick={() => { getFaqs(v?.id) }}
                        >
                            <div className='blog-card p-0'>
                                <div className='card-body'>
                                    <div className='blog-para p-3 flex items-center justify-between'>
                                        <span style={{ fontSize: "16px" }}>{v?.name}</span>
                                        <QuizIcon />
                                    </div>
                                </div>
                            </div>
                        </div>) : null}
                </div>}

        </div>
    )
}

export default Faqs