import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import ProductDetailsSlug from '../shop/[slug]';
import MetaHead from '../../templates/meta';
import { isEmptyObject } from '../../util/_common';
import { _put } from '../../services';

const ProductCategorySlug = ({ metaDataData }: any) => {

    const router = useRouter();
    const { slug }: any = router.query;

    const [actualSlug, setActualSlug] = useState(null);

    useEffect(() => {
        if (Array.isArray(slug)) {
            setActualSlug(slug[slug.length - 1]);
        }
    }, [slug])
console.log(metaDataData, 'metaDataData')
    return (
        <>
            <MetaHead meta_title={metaDataData?.value?.mata_title} meta_description={metaDataData?.value?.meta_descriptions} keywords={metaDataData?.value?.meta_key} />
            {actualSlug && <ProductDetailsSlug force_slug={{ type: "category", slug: actualSlug }} />}
        </>
    )
}

export const getServerSideProps = async (context: any) => {

    const { resolvedUrl } = context;

    // const [resolvedUrld, setResolvedUrld] = useState();
    let resolvedUrlNew = resolvedUrl.split("/");
    let slugurl = resolvedUrlNew[resolvedUrlNew?.length - 1]



    let compo = null;
    let notFound = false;
    // let newMenuArrData = null;
    let metaDataData = null;
    let metaDataa = null;
    let loader = true;


    try {
        const { data: metaData }: any = await _put(`${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_API_SLUG}/get-slug-by-meta`, { table_name: "productCategory", table_slug: slugurl })
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

export default ProductCategorySlug
