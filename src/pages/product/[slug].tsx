import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { useCreate, useRead } from '../../hooks';
import Image from 'next/image';
import brandDam from "../../../public/assets/images/brandDam.png"
import useIsLogedin from '../../hooks/useIsLogedin';
import { Drawer } from '@mui/material';
import getUrlWithKey from '../../util/_apiUrl';
import { _SUCCESS, _WARNING } from '../../util/_reactToast';
import Productdetails from '../../containers/client/productdetails';
import Link from 'next/link';
import emptyBox from '../../../public/assets/images/emptyBox.png'
import axios from 'axios';
import MetaHead from '../../templates/meta';
import { isEmptyObject } from '../../util/_common';
import { _get } from '../../services';
import { htmlToText } from 'html-to-text';


const Product = ({ metaDataData, loader, meta_description, meta_key }: any) => {

  const router = useRouter();
  const { slug }: any = router.query;

  const { create_cart, get_cart_items, update_cart } = getUrlWithKey("client_apis");

  console.log(metaDataData, "metaDatzdsfaData")
  console.log(meta_description, 'meta_description')


  // const { sendData: productData, loading: loadingdetails, rawData: productRawData }: any = useRead({ selectMethod: "get", url: `${slugUrl}` });

  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [productData, setProductData]: any = useState();


  // const { sendData: getCart }: any = useRead({ selectMethod: "get", url: getCartUrl });
  // const { sendData: updateCartData }: any = useCreate({ url: updateCartUrl, callData: updateCart });


  const getProductDetails = async () => {
    let slugUrl = `${process.env.NEXT_PUBLIC_API_URL}` + `${process.env.NEXT_PUBLIC_API_SLUG}/front-get-product/` + slug
    setIsLoading(true)
    try {
      const { data }: any = await axios.get(slugUrl)
      if (data?.success) {
        setProductData(data?.data)
      }
    } catch (error) {

    } finally {
      setLoading(false)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (slug) {
      getProductDetails()
    }
    // setLoading(loader)
    // setProductData(metaDataData)
  }, [slug])

  console.log(productData, "___productData")

  if (loading && (!productData && !productData?.id)) {
    return <><MetaHead meta_title={`${metaDataData?.meta_data?.meta_title || metaDataData?.name}`} meta_description={meta_description} keywords={meta_key} /></>
  }

  return (
    <div>
      <MetaHead meta_title={`${metaDataData?.meta_data?.meta_title || metaDataData?.name}`} meta_description={meta_description} keywords={meta_key} />
      {productData?.id ?
        <Productdetails productData={productData} loadingdetails={loading} slug={slug} isLoading={isLoading} />
        :
        <div className='flex flex-col items-center justify-center w-full h-full'>
          <Image src={emptyBox} alt='no_data_ill' width={192} height={108} />
          <h4 className='flex flex-col items-center justify-center w-full h-full gap-1'>
            <span style={{ fontSize: "18px" }}>Opps! no page found</span>
            <span style={{ fontSize: "14px" }}>
              <Link href="/" className='color-e4509d'>Go to homepage</Link>
            </span>
          </h4>
        </div>}

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
    const { data: metaData }: any = await _get(`${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_API_SLUG}/front-get-product/${slugurl}`)
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

  const meta_description = htmlToText(metaDataData?.meta_data?.meta_description);
  const meta_key = htmlToText(metaDataData?.meta_data?.meta_key);


  return {
    props: {
      // newMenuArrData: notFound ? [] : newMenuArrData,
      metaDataData: metaDataData,
      meta_description,
      meta_key,
      notFound,
      compo,
      metaDataa,
      loader
    },
  };
}

export default Product