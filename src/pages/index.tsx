import { Inter } from "next/font/google";
import HomePage from "../containers/client/home";
import Head from "next/head";
import getUrlWithKey from "../util/_apiUrl";
import { isEmptyObject } from "../util/_common";
import axios from "axios";
import LayoutCli from "../components/layout";
import MetaHead from "../templates/meta";
import { _get, _put } from "../services";
import Link from "next/link";
import { useState } from "react";
import { htmlToText } from 'html-to-text';

const inter = Inter({ subsets: ["latin"] });

const Home = ({ metaDataData,
  newMenuArrData,
  URL,
  meta_description,
  meta_key,
  getHomePageBanner,
  getHomePageBestSellerBanner,
  getHomePageCategoryData,
  getHomePage,
  getArrivalData,
  getBestSellingData
}: any) => {


  let parseMetaDataData: any = metaDataData?.meta_data && { meta_data: JSON.parse(metaDataData?.meta_data) }
  console.log(getHomePageBanner, "getHomePageBannersss")

  return (
    <>

      {newMenuArrData?.product_slugs?.length ? newMenuArrData?.product_slugs.map((slug: any, idx: number) => <Link key={idx} href={`${URL}/product/${slug}`}></Link>) : null}
      {newMenuArrData?.product_category_slugs?.length ? newMenuArrData?.product_category_slugs.map((slug: any, idx: number) => <Link key={idx} href={`${URL}/product_category${slug}`}></Link>) : null}
      {newMenuArrData?.product_attribute_terms?.length ? newMenuArrData?.product_attribute_terms.map((slug: any, idx: number) => <Link key={idx} href={`${URL}/shop${slug}`}></Link>) : null}
      {newMenuArrData?.page_slugs?.length ? newMenuArrData?.page_slugs.map((slug: any, idx: number) => <Link key={idx} href={`${URL}${slug}`}></Link>) : null}

      <MetaHead meta_title={parseMetaDataData?.meta_data?.meta_title} meta_description={meta_description} keywords={meta_key} />

      {/* <LayoutCli > */}
      <div className="">

        {/* {getHomePageBanner?.home_banners?.length ? */}
          <HomePage
            getHomePageBanner={getHomePageBanner}
            getHomePageBestSellerBanner={getHomePageBestSellerBanner}
            getHomePageCategoryData={getHomePageCategoryData}
            getHomePage={getHomePage}
            getArrivalData={getArrivalData}
            getBestSellingData={getBestSellingData}
          />
          {/* : <div className="fullpageLoader cli">
            <div className="spinner"></div>
          </div>} */}
      </div>
      {/* </LayoutCli> */}
    </>
  );
}

export const getServerSideProps = async (context: any) => {

  const { resolvedUrl } = context;

  const { sitemap_items, get_page_meta } = getUrlWithKey("commons");
  const { create_cart, home_page, get_arrival, get_best_selling, cart_item_count, create_wish_list, home_page_banner, home_page_bestSeller_banner, home_page_category_data, create_notify_me } = getUrlWithKey("client_apis")


  let compo = null;
  let notFound = false;
  let newMenuArrData = null;
  let metaDataData = null;
  let getHomePageBanner = null;
  let getHomePageBestSellerBanner = null;
  let getHomePageCategoryData = null;
  let getHomePage = null;
  let getArrivalData = null;
  let getBestSellingData = null;
  const URL = "https://pinkstore.altisinfonet.in";

  try {
    const { data: sitemapData }: any = await _get(sitemap_items)
    const { data: metaData }: any = await _get(`${get_page_meta}${resolvedUrl}`)
    const { data: getHomePageBanners }: any = await _get(home_page_banner)
    const { data: getHomePageBestSellerBanners }: any = await _get(home_page_bestSeller_banner)
    const { data: getHomePageCategoryDatas }: any = await _get(home_page_category_data)
    const { data: getHomePages }: any = await _get(home_page)
    const { data: getArrivals } = await _put(get_arrival, { all: false });
    const { data: getBestSellings } = await _put(get_best_selling, { all: false });


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

    if (getHomePageBanners?.success && !isEmptyObject(getHomePageBanners?.data)) {
      if (getHomePageBanners?.data?._not_page) {
        notFound = true;
      } else {
        getHomePageBanner = getHomePageBanners?.data;
        if (getHomePageBanners?.data?._redirect) {
          context.res.writeHead(302, { Location: getHomePageBanners?.data?._redirect });
          context.res.end();
          return { props: {} };
        } else if (!getHomePageBanners?.data?._redirect && getHomePageBanners?.data?.component && getHomePageBanners?.data?.template_system) {
          compo = getHomePageBanners?.data?.component;
        }
      }
    } else {
      notFound = true;
    }

    if (getHomePageBestSellerBanners?.success && !isEmptyObject(getHomePageBestSellerBanners?.data)) {
      if (getHomePageBestSellerBanners?.data?._not_page) {
        notFound = true;
      } else {
        getHomePageBestSellerBanner = getHomePageBestSellerBanners?.data;
        if (getHomePageBestSellerBanners?.data?._redirect) {
          context.res.writeHead(302, { Location: getHomePageBestSellerBanners?.data?._redirect });
          context.res.end();
          return { props: {} };
        } else if (!getHomePageBestSellerBanners?.data?._redirect && getHomePageBestSellerBanners?.data?.component && getHomePageBestSellerBanners?.data?.template_system) {
          compo = getHomePageBestSellerBanners?.data?.component;
        }
      }
    } else {
      notFound = true;
    }

    if (getHomePageCategoryDatas?.success && !isEmptyObject(getHomePageCategoryDatas?.data)) {
      if (getHomePageCategoryDatas?.data?._not_page) {
        notFound = true;
      } else {
        getHomePageCategoryData = getHomePageCategoryDatas?.data;
        if (getHomePageCategoryDatas?.data?._redirect) {
          context.res.writeHead(302, { Location: getHomePageCategoryDatas?.data?._redirect });
          context.res.end();
          return { props: {} };
        } else if (!getHomePageCategoryDatas?.data?._redirect && getHomePageCategoryDatas?.data?.component && getHomePageCategoryDatas?.data?.template_system) {
          compo = getHomePageCategoryDatas?.data?.component;
        }
      }
    } else {
      notFound = true;
    }

    if (getHomePages?.success && !isEmptyObject(getHomePages?.data)) {
      if (getHomePages?.data?._not_page) {
        notFound = true;
      } else {
        getHomePage = getHomePages?.data;
        if (getHomePages?.data?._redirect) {
          context.res.writeHead(302, { Location: getHomePages?.data?._redirect });
          context.res.end();
          return { props: {} };
        } else if (!getHomePages?.data?._redirect && getHomePages?.data?.component && getHomePages?.data?.template_system) {
          compo = getHomePages?.data?.component;
        }
      }
    } else {
      notFound = true;
    }

    if (getArrivals?.success && !isEmptyObject(getArrivals?.data)) {
      if (getArrivals?.data?._not_page) {
        notFound = true;
      } else {
        getArrivalData = getArrivals?.data;
        if (getArrivals?.data?._redirect) {
          context.res.writeHead(302, { Location: getArrivals?.data?._redirect });
          context.res.end();
          return { props: {} };
        } else if (!getArrivals?.data?._redirect && getArrivals?.data?.component && getArrivals?.data?.template_system) {
          compo = getArrivals?.data?.component;
        }
      }
    } else {
      notFound = true;
    }

    if (getBestSellings?.success && !isEmptyObject(getBestSellings?.data)) {
      if (getBestSellings?.data?._not_page) {
        notFound = true;
      } else {
        getBestSellingData = getBestSellings?.data;
        if (getBestSellings?.data?._redirect) {
          context.res.writeHead(302, { Location: getBestSellings?.data?._redirect });
          context.res.end();
          return { props: {} };
        } else if (!getBestSellings?.data?._redirect && getBestSellings?.data?.component && getBestSellings?.data?.template_system) {
          compo = getBestSellings?.data?.component;
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
      meta_description,
      meta_key,
      notFound,
      compo,
      URL: URL,
      getHomePageBanner,
      getHomePageBestSellerBanner,
      getHomePageCategoryData,
      getHomePage,
      getArrivalData,
      getBestSellingData
    },
  };
};


export default Home
