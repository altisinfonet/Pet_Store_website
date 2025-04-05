import Link from 'next/link'
import React from 'react'
import { shortCodeMiddleware } from '../shortcodeComponent/settings/function'
import MetaHead from '../../templates/meta'

const DefaultPage = ({ title, description: content, keywords, slug, status_id, id, page_metas }: any) => {

    const getContentWithFilter = () => {
        // console.log(content, "content")
        const st_c = shortCodeMiddleware({ request: content });
        // console.log("shortCodeMiddleware", st_c);
        return st_c;
    }

    return (
        <>
            <MetaHead meta_title={title} meta_description={content} keywords={keywords} />
            <div className='container ppl'>
                <div className='mt-4 w-full'>
                    <div className="flex items-center justify-center w-full uppercase font-medium ppsL">
                        <h1 className="sp-title" style={{ fontSize: "150%" }}>{title}</h1>
                    </div>
                </div>

                <div className='mt-4'>
                    {getContentWithFilter()}
                    {/* <div className='pp_content_cls' dangerouslySetInnerHTML={{ __html: content }} /> */}
                </div>
            </div>
        </>
    )
}

export default DefaultPage
