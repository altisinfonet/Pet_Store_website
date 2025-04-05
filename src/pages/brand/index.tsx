import React from 'react'
import Brand from '../../containers/client/brand'
import MetaHead from '../../templates/meta'
import getUrlWithKey from '../../util/_apiUrl'
import { _get } from '../../services'
import { isEmptyObject } from '../../util/_common'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { htmlToText } from 'html-to-text';

const BrandPage = ({ pathname, metaDataData, newMenuArrData, URL, meta_description, meta_key, resolvedUrls }: any) => {

  let pmetaDataData = metaDataData?.meta_data && { meta_data: JSON.parse(metaDataData?.meta_data) }

  console.log(pmetaDataData, "metaDataData")

  console.log(metaDataData, "metaDataData")

  // let pmetaDataData = metaDataData?.meta_data && {meta_data: JSON.parse(metaDataData?.meta_data)}
  console.log(resolvedUrls, "resolvedUrls")

  return (
    <div>

      {newMenuArrData?.product_slugs?.length ? newMenuArrData?.product_slugs.map((slug: any, idx: number) => <Link key={idx} href={`${URL}/product/${slug}`}></Link>) : null}
      {newMenuArrData?.product_category_slugs?.length ? newMenuArrData?.product_category_slugs.map((slug: any, idx: number) => <Link key={idx} href={`${URL}/product_category${slug}`}></Link>) : null}
      {newMenuArrData?.product_attribute_terms?.length ? newMenuArrData?.product_attribute_terms.map((slug: any, idx: number) => <Link key={idx} href={`${URL}/shop${slug}`}></Link>) : null}
      {newMenuArrData?.page_slugs?.length ? newMenuArrData?.page_slugs.map((slug: any, idx: number) => <Link key={idx} href={`${URL}${slug}`}></Link>) : null}

      <MetaHead meta_title={pmetaDataData?.meta_data?.meta_title} meta_description={meta_description} keywords={meta_key} />
      <Brand />
    </div>
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
      resolvedUrls: resolvedUrl,
    },
  };
};

export default BrandPage