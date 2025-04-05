import React, { useEffect, useState } from 'react'
import ProductListing from '../../containers/client/productListing'
import getUrlWithKey from '../../util/_apiUrl';
import { useRead } from '../../hooks';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import useTabView from '../../hooks/useTabView';
import MetaHead from '../../templates/meta';
import Link from 'next/link';
import { _get } from '../../services';
import { isEmptyObject } from '../../util/_common';
import { htmlToText } from 'html-to-text';

const BestSelling = ({ metaDataData, newMenuArrData, URL, meta_description, meta_key }: any) => {

  const router = useRouter()
  const { get_best_selling } = getUrlWithKey("client_apis")
  const { tabView, mobView } = useTabView()

  const [productPagetion, setProductPagetion]: any = useState({ page: 1, rowsPerPage: 10 })
  const [productData, setProductData]: any = useState([])
  const [more, setMore] = useState(false)
  // const [bestSellingMeta, setBestSellingMeta]: any = useState({ all: true })

  // getBestSelling

  const { sendData: getBestSelling, loading: productsLoading, rawData: productsRaw }: any = useRead({ selectMethod: "put", url: get_best_selling, callData: productPagetion });
  const getLinlName = useSelector((state: any) => state?.linkNameReducer?.value);

  useEffect(() => {
    setProductPagetion({ page: 1, rowsPerPage: 10, all: true })
  }, [router.pathname])

  const perPageList = [
    { number: 5 },
    { number: 10 },
    { number: 20 },
    { number: 30 },
    { number: 40 },
    { number: 50 },
  ]

  const [isScrolledToBottom, setIsScrolledToBottom] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight; // More reliable for content height
      const scrollTop = window.scrollY;
      const isNearBottom = mobView ? scrollTop + windowHeight >= documentHeight - 250 : tabView ? scrollTop + windowHeight >= documentHeight - 500 : scrollTop + windowHeight >= documentHeight - 800; // Allow for buffer (customizable)

      setIsScrolledToBottom(isNearBottom);
    };

    window.addEventListener('scroll', handleScroll);

    // Cleanup function to remove event listener on unmount
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isScrolledToBottom === true) {
      // if (products?.total_page !== productPagetion?.page) {
      setProductPagetion((pre: any) => ({
        ...pre,
        page: pre?.page + 1
      }));
      setMore(true)
      // }

    }
  }, [isScrolledToBottom])


  useEffect(() => {
    if (productsLoading && more === false) {
      setProductData([])
    }
  }, [productsLoading, more])

  useEffect(() => {
    if (getBestSelling?.products?.length && more === false) {
      setProductData(getBestSelling?.products.map((v: any) => v?.product_details))
    }
    if (productsRaw?.success && more === true && getBestSelling?.previous_page === productPagetion?.page) {
      setProductData((pre: any) => pre?.length ? [...pre, ...getBestSelling?.products.map((v: any) => v?.product_details)] : getBestSelling?.products.map((v: any) => v?.product_details))
    }
  }, [getBestSelling, more])

  let pmetaDataData = metaDataData?.meta_data && { meta_data: JSON.parse(metaDataData?.meta_data) }

  console.log(pmetaDataData, "metaDataData")

  console.log(metaDataData, 'metaDataData')

  if (productsLoading && productPagetion?.page === 1) {
    return (
      <>
        {newMenuArrData?.product_slugs?.length ? newMenuArrData?.product_slugs.map((slug: any, idx: number) => <Link key={idx} href={`${URL}/product/${slug}`}></Link>) : null}
        {newMenuArrData?.product_category_slugs?.length ? newMenuArrData?.product_category_slugs.map((slug: any, idx: number) => <Link key={idx} href={`${URL}/product_category${slug}`}></Link>) : null}
        {newMenuArrData?.product_attribute_terms?.length ? newMenuArrData?.product_attribute_terms.map((slug: any, idx: number) => <Link key={idx} href={`${URL}/shop${slug}`}></Link>) : null}
        {newMenuArrData?.page_slugs?.length ? newMenuArrData?.page_slugs.map((slug: any, idx: number) => <Link key={idx} href={`${URL}${slug}`}></Link>) : null}
        <MetaHead meta_title={pmetaDataData?.meta_data?.meta_title} meta_description={meta_description} keywords={meta_key} />
        <div className='flex w-full items-center justify-center cli' style={{ height: "70vh" }}>
          <div className="spinner"></div>
        </div>
      </>)
  } else {
    null;
  }

  return (
    <>
      <MetaHead meta_title={pmetaDataData?.meta_data?.meta_title} meta_description={meta_description} keywords={meta_key} />
      {/* <MetaHead meta_title="best selling" meta_description="best selling" /> */}
      {/* <ProductListing products={products} products={productData} productsAll={products} perPageList={perPageList} dataPerPage={dataPerPage} setDataPerPage={setDataPerPage} pageCount={productPagetion?.page} linkname={getLinlName ? getLinlName : linkName} /> */}
      {/* {!false ?  */}
      <ProductListing
        products={productData}
        productsLoading={productsLoading}
        pageCount={productPagetion?.page}
        linkname={"Best Selling"}
        showSide={false}
        showTop={false}
        more={more}
        productsByFilters={{ url: "/", callData: productPagetion, selectMethod: "put" }}
      />
      {/* : "PLEASE WAIT"} */}
    </>
  )
}

export const getServerSideProps = async (context: any) => {

  const { resolvedUrl } = context;

  const { sitemap_items, get_page_meta } = getUrlWithKey("commons");

  let compo = null;
  let notFound = false;
  let newMenuArrData = null;
  let metaDataData = null;
  const URL = "https://pinkstore.altisinfonet.in";

  try {
    const { data: sitemapData }: any = await _get(sitemap_items)
    const { data: metaData }: any = await _get(`${get_page_meta}${resolvedUrl}`)

    if (metaData?.success && !isEmptyObject(metaData?.data)) {
      if (metaData?.data?._not_page) {
        notFound = true;
      } else {
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

    if (sitemapData?.success && !isEmptyObject(sitemapData?.data)) {
      if (sitemapData?.data?._not_page) {
        notFound = true;
      } else {
        newMenuArrData = sitemapData?.data;
        if (sitemapData?.data?._redirect) {
          context.res.writeHead(302, { Location: sitemapData?.data?._redirect });
          context.res.end();
          return { props: {} };
        } else if (!sitemapData?.data?._redirect && sitemapData?.data?.component && sitemapData?.data?.template_system) {
          compo = sitemapData?.data?.component;
        }
      }
    } else {
      notFound = true;
    }
  } catch (error) {
    console.error('Error Fetching Data:', error);
    notFound = true;
  }

  let metaDataDataP = metaDataData?.meta_data && { meta_data: JSON.parse(metaDataData?.meta_data) }

  const meta_description = htmlToText(metaDataDataP?.meta_data?.meta_description);
  const meta_key = htmlToText(metaDataDataP?.meta_data?.keywords);

  return {
    props: {
      newMenuArrData: notFound ? [] : newMenuArrData,
      metaDataData: metaDataData,
      notFound,
      meta_description,
      meta_key,
      compo,
      URL: URL,
    },
  };
};

export default BestSelling