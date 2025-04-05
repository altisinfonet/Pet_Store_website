import Link from 'next/link'
import React from 'react'
import { shortCodeMiddleware } from '../shortcodeComponent/settings/function'

const DefaultPage = ({ title, description: content, slug, status_id, id }: any) => {

    const getContentWithFilter = () => {
        console.log(content, "content")
        const st_c = shortCodeMiddleware({ request: content });
        console.log("shortCodeMiddleware", st_c);
        return st_c;
    }

    return (
        <div className='container ppl'>
            <div className='mt-4 w-full'>
                <div className="flex items-center justify-center w-full uppercase font-medium ppsL">
                    <h2 className="sp-title" style={{ fontSize: "150%" }}>{title}</h2>
                </div>
            </div>

            <div className='mt-4'>
                {getContentWithFilter()}
                {/* <div className='pp_content_cls' dangerouslySetInnerHTML={{ __html: content }} /> */}
            </div>
        </div>
    )
}

export default DefaultPage
