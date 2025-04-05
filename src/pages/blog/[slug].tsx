import React, { useEffect, useState } from 'react'
import Blog1 from '../../containers/client/blog1'
import { useRouter } from 'next/router';
import getUrlWithKey from '../../util/_apiUrl';
import axios from 'axios';
import MetaHead from '../../templates/meta';
import { isEmptyObject } from '../../util/_common';
import { _get, _put } from '../../services';

const Blogdetails = ({ metaDataData }: any) => {

    const router = useRouter();
    const { slug }: any = router.query;

    const { get_blog, get_client_blog } = getUrlWithKey("client_apis");

    let slugUrl = get_client_blog + `/` + slug
    const [blogDetails, setBlogDetails] = useState();

    const getBlogDetails = async () => {
        try {
            const { data }: any = await axios.get(slugUrl)
            if (data?.success) {
                setBlogDetails(data?.data)
            }
        } catch (error) {
            console.log(error, "__error__")
        }
    }

    useEffect(() => {
        if (slug) {
            getBlogDetails()
        }
    }, [slug])

    return (
        <div>
            <MetaHead meta_title={metaDataData?.value?.mata_title} meta_description={metaDataData?.value?.meta_description} keywords={metaDataData?.value?.meta_key} />
            <Blog1 blogDetails={blogDetails} />
        </div>
    )
}

export const getServerSideProps = async (context: any) => {

    const { resolvedUrl } = context;

    // const [resolvedUrld, setResolvedUrld] = useState();
    let resolvedUrlNew = resolvedUrl.split("/");
    let slugurl = resolvedUrlNew[resolvedUrlNew?.length - 1]


    const { sitemap_items, get_page_meta } = getUrlWithKey("commons");

    let compo = null;
    let notFound = false;
    // let newMenuArrData = null;
    let metaDataData = null;
    let metaDataa = null;
    let loader = true;


    try {
        // const { data: sitemapData }: any = await _get(sitemap_items)
        // `${process.env.NEXT_PUBLIC_API_URL}` + `${process.env.NEXT_PUBLIC_API_SLUG}/front-get-product/` +
        const { data: metaData }: any = await _put(`${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_API_SLUG}/get-slug-by-meta`, { table_name: "blog", table_slug: slugurl })
        metaDataa = metaData;
        if (metaData?.success && !isEmptyObject(metaData?.data)) {
            if (metaData?.data?._not_page) {
                notFound = true;
            } else {
                loader = false;
                metaDataData = metaData?.data;
                if (metaData?.data?._redirect) {
                    context.res.writeHead(302, { Location: metaData?.data?._redirect });
                    context.res.end();
                    return { props: {} };
                } else if (!metaData?.data?._redirect && metaData?.data?.component && metaData?.data?.template_system) {
                    compo = metaData?.data?.component;
                }
            }
        } else {
            notFound = true;
        }
    } catch (error) {
        console.log(error, "__error")
    }

    return {
        props: {
            // newMenuArrData: notFound ? [] : newMenuArrData,
            metaDataData: metaDataData,
            notFound,
            compo,
            metaDataa,
            loader,
            slugurl
        },
    };
}

export default Blogdetails