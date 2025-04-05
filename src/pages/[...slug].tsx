import React from 'react';
import Dashboard from '../Admin/containers/dashboard';
import { useRouter } from 'next/router';
import DefaultPage from '../components/DefaultPage';
import { component_match_id } from '../components/shortcodeComponent/settings/config';
import Link from 'next/link';
import emptyBox from '../../public/assets/images/emptyBox.png';
import { _get } from '../services';
import getUrlWithKey from '../util/_apiUrl';
import { isEmptyObject } from '../util/_common';
import Image from 'next/image';
import Head from 'next/head'; // Import Head for setting metadata
import MetaHead from '../templates/meta';



const MainSlugIndex = ({ pageData, compo, notFound, newMenuArrData, URL }: any) => {
  const router = useRouter();

  const notFoundShow = () => {
    return (
      <div className='flex flex-col items-center justify-center w-full h-full'>
        <Image src={emptyBox} alt='no_data_ill' width={192} height={108} />
        <h4 className='flex flex-col items-center justify-center w-full h-full gap-1'>
          <span style={{ fontSize: '18px' }}>Oops! No page found</span>
          <span style={{ fontSize: '14px' }}>
            <Link href='/' className='color-e4509d'>Go to homepage</Link>
          </span>
        </h4>
      </div>
    );
  };

  const renderDynamic = () => {
    if (compo) {
      const ComponentToRender = component_match_id[compo]?.component as React.FC<any> | undefined;
      if (ComponentToRender) {
        const propsForComponent = {
          ...pageData,
        };
        return <ComponentToRender {...propsForComponent} />;
      } else {
        return (
          <span>
            [{compo} this component not found]
          </span>
        );
      }
    }
  };

  return (
    <div>
      {newMenuArrData?.product_slugs?.length ? newMenuArrData?.product_slugs.map((slug: any, idx: number) => <Link key={idx} href={`${URL}/product/${slug}`}></Link>) : null}
      {newMenuArrData?.product_category_slugs?.length ? newMenuArrData?.product_category_slugs.map((slug: any, idx: number) => <Link key={idx} href={`${URL}/product_category${slug}`}></Link>) : null}
      {newMenuArrData?.product_attribute_terms?.length ? newMenuArrData?.product_attribute_terms.map((slug: any, idx: number) => <Link key={idx} href={`${URL}/shop${slug}`}></Link>) : null}
      {newMenuArrData?.page_slugs?.length ? newMenuArrData?.page_slugs.map((slug: any, idx: number) => <Link key={idx} href={`${URL}${slug}`}></Link>) : null}

      <MetaHead meta_title={pageData?.title} meta_description={pageData?.description} keywords={pageData?.keywords} />

      {!notFound && pageData && !compo && <DefaultPage {...pageData} />}
      {!notFound && compo && pageData && renderDynamic()}
      {notFound && notFoundShow()}
    </div>
  );
};

export const getServerSideProps: any = async (context: any) => {
  const { slug } = context.params;
  const { get_page_by_slug_web } = getUrlWithKey('pages');
  const { sitemap_items } = getUrlWithKey("commons");


  let pageData = null;
  let compo = null;
  let notFound = false;
  let newMenuArrData = null;
  const URL = "https://pinkstore.altisinfonet.in";

  try {
    const { data } = await _get(`${get_page_by_slug_web}/${slug}`);

    const { data: sitemapData }: any = await _get(sitemap_items)

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


    if (data?.success && !isEmptyObject(data?.data)) {
      if (data?.data?._not_page) {
        notFound = true;
      } else {
        pageData = data?.data;
        if (data?.data?._redirect) {
          context.res.writeHead(302, { Location: data?.data?._redirect });
          context.res.end();
          return { props: {} };
        } else if (!data?.data?._redirect && data?.data?.component && data?.data?.template_system) {
          compo = data?.data?.component;
        }
      }
    } else {
      notFound = true;
    }
  } catch (error) {
    console.error('Error Fetching Page');
    notFound = true;
  }

  return {
    props: {
      pageData,
      compo,
      notFound,
      newMenuArrData: newMenuArrData,
      URL: URL
    },
  };
};

export default MainSlugIndex;
