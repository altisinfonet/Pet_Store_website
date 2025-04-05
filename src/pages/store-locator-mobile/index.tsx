import React, { useEffect, useState } from 'react'
import Storelocator from '../../containers/client/storeLocator'
import getUrlWithKey from '../../util/_apiUrl'
import { useRead } from '../../hooks';
import LocationFinder from '../../components/LocationFinder';
import MetaHead from '../../templates/meta';
import Link from 'next/link';
import { _get } from '../../services';
import { isEmptyObject } from '../../util/_common';
import { htmlToText } from 'html-to-text';

const StoreLocatorMobile = ({ metaDataData, newMenuArrData, URL, meta_description, meta_key }: any) => {
    // const { get_store_locator } = getUrlWithKey("client_apis");

    // const [payload, setPayload] = useState(null);

    // const { sendData, loading, error }: any = useRead({ selectMethod: "put", url: get_store_locator, callData: payload });


    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);
    const [errorLatLng, setErrorLatLng] = useState(null);
    const [address, setAddress] = useState<string | null>(null);
    const [errors, setError] = useState<string | null>(null);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (position: any) => {
                const { latitude, longitude } = position.coords;
                setLatitude(latitude);
                setLongitude(longitude);
                fetchAddress(latitude, longitude);
            },
            (error: any) => setErrorLatLng(error.message),
            { enableHighAccuracy: true } // Optional for higher accuracy
        );

        const fetchAddress = async (latitude: number, longitude: number) => {
            try {
                const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyCnp8T1z8Jv9o5E3QfIhs25crKoiUZxlVU`);
                const data = await response.json();
                if (data.results && data.results[0]) {
                    setAddress(data.results[0].address_components[data.results[0].address_components.length - 1]['long_name']);
                } else {
                    setError('No address found for this location');
                }
            } catch (error) {
                setError('Error fetching address');
                console.error('Error fetching address:', error);
            }
        };
    }, []);

    const fetchAddress = async (latitude: number, longitude: number) => {
        try {
            const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyCnp8T1z8Jv9o5E3QfIhs25crKoiUZxlVU`);
            const data = await response.json();
            if (data.results && data.results[0]) {
                setAddress(data.results[0].formatted_address);
            } else {
                setError('No address found for this location');
            }
        } catch (error) {
            setError('Error fetching address');
            console.error('Error fetching address:', error);
        }
    };

    // const getResponse = (data: any) => {
    //   // setPayload(data);
    // }

    let pmetaDataData = metaDataData?.meta_data && { meta_data: JSON.parse(metaDataData?.meta_data) }

    console.log(pmetaDataData, "metaDataData")

    return (
        <div>
            {newMenuArrData?.product_slugs?.length ? newMenuArrData?.product_slugs.map((slug: any, idx: number) => <Link key={idx} href={`${URL}/product/${slug}`}></Link>) : null}
            {newMenuArrData?.product_category_slugs?.length ? newMenuArrData?.product_category_slugs.map((slug: any, idx: number) => <Link key={idx} href={`${URL}/product_category${slug}`}></Link>) : null}
            {newMenuArrData?.product_attribute_terms?.length ? newMenuArrData?.product_attribute_terms.map((slug: any, idx: number) => <Link key={idx} href={`${URL}/shop${slug}`}></Link>) : null}
            {newMenuArrData?.page_slugs?.length ? newMenuArrData?.page_slugs.map((slug: any, idx: number) => <Link key={idx} href={`${URL}${slug}`}></Link>) : null}
            <MetaHead meta_title={pmetaDataData?.meta_data?.meta_title} meta_description={meta_description} keywords={meta_key} />
            <Storelocator latTo={latitude} lngTo={longitude} address={address} />
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
            meta_description,
            meta_key,
            notFound,
            compo,
            URL: URL,
        },
    };
};

export default StoreLocatorMobile