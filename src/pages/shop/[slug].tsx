import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import ProductListing from '../../containers/client/productListing';
import getUrlWithKey from '../../util/_apiUrl';
import { useRead } from '../../hooks';
import { useSearchParams } from 'next/navigation';
import { useSelector } from 'react-redux';
import useTabView from '../../hooks/useTabView';
import MetaHead from '../../templates/meta';
import { _put } from '../../services';
import { isEmptyObject } from '../../util/_common';

const ProductDetailsSlug = ({ force_slug, metaDataData }: any) => {

    const [meta, setMeta]: any = useState()

    const router = useRouter();
    const { slug }: any = router.query;
    const searchParams = useSearchParams()
    const search = searchParams.get('type')
    const { tabView, mobView } = useTabView()
    // const searchLinkName = useSearchParams()
    // const linkName = searchLinkName.get('name')

    const { get_products_by_category, get_products_by_attribute_term, product_list } = getUrlWithKey("client_apis")
    const getLinklName = useSelector((state: any) => state?.linkNameReducer?.value);

    const [priceStack, setPriceStack] = useState({ minPrice: 0, maxPrice: 0 })
    const [dataPerPage, setDataPerPage]: any = useState(8)
    const [sortby, setSortby]: any = useState('')
    const [productPagetion, setProductPagetion]: any = useState({ page: 1, rowsPerPage: 8, sorting: "default" })
    const [prodLstSlug, setProdLstSlug]: any = useState()
    const [productData, setProductData]: any = useState([])
    const [more, setMore] = useState(false)
    const [category, setCategory]: any = useState([])
    const [attributes, setAttributes]: any = useState([])
    const [price, setPrice] = React.useState<number[]>([]);
    // const [productSearchUrl, setProductSearchUrl] = useState<any>(
    //     { selectMethod: "", url: "", callData: null }
    // );
    console.log(productData, "productData")
    console.log(slug, sortby, "slug")

    useEffect(() => {
        setPrice([priceStack?.minPrice, priceStack?.maxPrice])
    }, [priceStack])

    const { sendData: products, loading: productsLoading, rawData: productsRaw }: any = useRead({ selectMethod: "put", url: prodLstSlug, callData: productPagetion });
    // const { sendData: getSearchProduct, error: userFindError, rawData: productsSearchRaw, loading: productsSearchLoading }: any = useRead({ selectMethod: "put", url: prodLstSlug, callData: productPagetion });

    let linkName = (search === "attribute" || force_slug?.type === "attribute") ? products?.attributeTitle : products?.categoryTitle
    let linkId = (search === "attribute" || force_slug?.type === "attribute") ? products?.attributeId : products?.categoryId


    useEffect(() => {
        linkName = (search === "attribute" || force_slug?.type === "attribute") ? products?.attributeTitle : products?.categoryTitle;
        linkId = (search === "attribute" || force_slug?.type === "attribute") ? products?.attributeId : products?.categoryId;
    }, [products?.attributeTitle, products?.categoryTitle, products?.attributeId, products?.categoryId])


    // useEffect(() => {

    // }, [slug])

    // useEffect(() => {
    //     // router.push(`/shop?data=${JSON.stringify(getSearchProduct?.products)}`)
    //     if (getSearchProduct?.products?.length && search === "search" && more === false && slug) {
    //         setProductData(getSearchProduct?.products)
    //         setMore(false)
    //     }
    // }, [getSearchProduct])


    useEffect(() => {
        if (slug) {
            if (search !== "search") {
                setProdLstSlug(search === "attribute" ? `${get_products_by_attribute_term}` + slug : `${get_products_by_category}` + slug)
                setProductPagetion({ page: 1, rowsPerPage: 8, sorting: "default" })
            }
            setMore(false)
            setCategory([])
            setAttributes([])
        }
        if (search === "search") {
            const newProdLstSlug = `${product_list}?search=${slug}`;
            if (prodLstSlug !== newProdLstSlug) { // Prevent unnecessary updates
                setProdLstSlug(newProdLstSlug);
                setProductPagetion({ page: 1, rowsPerPage: 8, sorting: "default" });
                setIsScrolledToBottom(false);
            }
            // setProdLstSlug(`${"product_list"}?search=${slug}`)
            // setProductPagetion({ page: 1, rowsPerPage: 8, sorting: "default" })
            // setIsScrolledToBottom(false)
        }
    }, [slug, search, prodLstSlug])

    useEffect(() => {

        const getMeta = async ({ slugurl, type }: any) => {
            try {
                const { data: metaData }: any = await _put(`${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_API_SLUG}/get-slug-by-meta`, { table_name: type ? type : "productCategory", table_slug: slugurl })
                if (metaData?.success) {
                    setMeta(metaData?.data)
                }
            } catch (error) {
                console.log(error, "_error")
            }
        }

        if (force_slug) {
            if (force_slug?.type == "attribute") {
                setProdLstSlug(`${get_products_by_attribute_term}` + force_slug?.slug)
                setProductPagetion({ page: 1, rowsPerPage: 8, sorting: "default" })
                getMeta({ slugurl: force_slug?.slug, type: "productAttributeTerm" });
            }

            if (force_slug?.type == "category") {
                setProdLstSlug(`${get_products_by_category}` + force_slug?.slug)
                setProductPagetion({ page: 1, rowsPerPage: 8, sorting: "default" })
                getMeta({ slugurl: force_slug?.slug });
            }

            setMore(false)
            setCategory([])
            setAttributes([])
        }
    }, [force_slug]);

    useEffect(() => {
        if (sortby) {
            setProductPagetion({
                page: 1,
                rowsPerPage: dataPerPage,
                category_ids: category?.length ? category : null,
                attribute_term_ids: attributes.length ? attributes : null,
                sorting: sortby
            })
        }
    }, [sortby])

    useEffect(() => {
        if (dataPerPage > 5) {
            setProductPagetion({
                page: 1,
                rowsPerPage: dataPerPage,
                category_ids: category?.length ? category : null,
                attribute_term_ids: attributes.length ? attributes : null
            })
        }
    }, [dataPerPage])

    // useEffect(() => {
    //     if (productsLoading && more === false) {
    //         setProductData([])
    //     }
    // }, [productsLoading, more])

    useEffect(() => {

        // if (getSearchProduct?.products?.length && more === false && slug) {
        //     setProductData(getSearchProduct?.products)
        //     setMore(false)
        // }

        if (products?.products?.length && more === false && (slug || force_slug?.slug)) {
            setProductData(products?.products)
        }
        if (productsRaw?.success && more === true && products?.previous_page === productPagetion?.page) {
            setProductData((pre: any) => pre?.length ? [...pre, ...products?.products] : products?.products)
        }
        if (productsRaw?.success && !products?.products?.length && products?.previous_page === 1) {
            setMore(false);
            setProductData([]);
        }
        setScrollMoreOff(false);
    }, [products, more, slug, force_slug?.slug])

    const perPageList = [
        { number: 5 },
        { number: 10 },
        { number: 20 },
        { number: 30 },
        { number: 40 },
        { number: 50 },
    ]

    const sortItemList = [
        { name: "Default", value: "default" },
        { name: "Sort by price: low to high", value: "lowPrice" },
        { name: "Sort by price: high to low", value: "highPrice" },
        { name: "Sort by latest", value: "latest" },
    ]

    const handleFilter = (e: any) => {
        let value = e.target.value
        let name = e.target.name

        if (name === "category") {
            if (category.includes(+value)) {
                const filteredCategory = category.filter((item: any) => item !== +value);
                setCategory(filteredCategory);
                setProductPagetion({
                    page: 1,
                    rowsPerPage: 8,
                    category_ids: filteredCategory?.length ? filteredCategory : null,
                    attribute_term_ids: attributes.length ? attributes : null
                })
            } else {
                setCategory((pre: any) => [+value, ...pre]);
                setProductPagetion({
                    page: 1,
                    rowsPerPage: 8,
                    category_ids: [...category, +value]?.length ? [...category, +value] : null,
                    attribute_term_ids: attributes.length ? attributes : null
                })
            }
        }

        if (name === "attributes") {
            if (attributes.includes(+value)) {
                const filteredAttributes = attributes.filter((item: any) => item !== +value);
                setAttributes(filteredAttributes);
                setProductPagetion({
                    page: 1,
                    rowsPerPage: 8,
                    category_ids: category?.length ? category : null,
                    attribute_term_ids: filteredAttributes?.length ? filteredAttributes : null
                })
            } else {
                setAttributes((pre: any) => [+value, ...pre]);
                setProductPagetion({
                    page: 1,
                    rowsPerPage: 8,
                    category_ids: category?.length ? category : null,
                    attribute_term_ids: [...attributes, +value]?.length ? [...attributes, +value] : null
                })
            }
        }

        setMore(false)
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    const handleChangePrice = (event: Event, newValue: number | number[]) => {
        setPrice(newValue as number[]);
    };

    const [scrollMopreOff, setScrollMoreOff] = useState(false);
    const doFilter = () => {
        setProductPagetion({
            page: 1,
            rowsPerPage: 8,
            category_ids: category?.length ? category : null,
            attribute_term_ids: attributes.length ? attributes : null,
            min_price: price?.length ? price[0] : null,
            max_price: price?.length ? price[1] : null,
        });
        setMore(false)
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        setScrollMoreOff(true)
    }


    const [isScrolledToBottom, setIsScrolledToBottom] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight; // More reliable for content height
            const scrollTop = window.scrollY;
            const isNearBottom = mobView ? scrollTop + windowHeight >= documentHeight - 250 : tabView ? scrollTop + windowHeight >= documentHeight - 500 : scrollTop + windowHeight >= documentHeight - 1050; // Allow for buffer (customizable)

            setIsScrolledToBottom(isNearBottom);
        };

        window.addEventListener('scroll', handleScroll);

        // Cleanup function to remove event listener on unmount
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (isScrolledToBottom === true && !scrollMopreOff) {
            if (products?.total_page !== productPagetion?.page) {
                setProductPagetion((pre: any) => ({
                    ...pre,
                    page: pre?.page + 1
                }));
                setMore(true)
            }

        }
    }, [isScrolledToBottom])

    useEffect(() => {
        setProductData([])
    }, [sortby]);
    useEffect(() => {
        setSortby()
    }, [slug]);

    console.log(meta?.value?.mata_title, metaDataData, metaDataData?.value?.mata_title, "metaDatzdsfaData")
    if (productsLoading && productPagetion?.page === 1) {
        return (
            <>
                <MetaHead meta_title={meta?.value?.mata_title || metaDataData?.value?.mata_title} meta_description={meta?.value?.meta_descriptions || metaDataData?.value?.meta_descriptions} keywords={meta?.value?.meta_key || metaDataData?.value?.meta_key} />
                <div className='flex w-full items-center justify-center cli' style={{ height: "70vh" }}>
                    <div className="spinner"></div>
                </div>
            </>)
    } else {
        null;
    }

    console.log(metaDataData, 'metaDataData111')

    // if (metaDataData) {
    //     return (
    //         <>
    //             <MetaHead meta_title={metaDataData?.value?.mata_title} meta_description={meta?.value?.meta_descriptions || metaDataData?.value?.meta_descriptions} keywords={meta?.value?.meta_key || metaDataData?.value?.meta_key} />
    //         </>
    //     )
    // }

    return (
        <>
            <MetaHead meta_title={meta?.value?.mata_title || metaDataData?.value?.mata_title} meta_description={meta?.value?.meta_descriptions || metaDataData?.value?.meta_descriptions} keywords={meta?.value?.meta_key || metaDataData?.value?.meta_key} />
            {/* {!false ? */}
            <ProductListing
                products={productData}
                productsAll={products}
                productsLoading={productsLoading}
                perPageList={perPageList}
                sortItemList={sortItemList}
                dataPerPage={dataPerPage}
                setSortby={setSortby}
                sortby={sortby}
                setDataPerPage={setDataPerPage}
                pageCount={productPagetion?.page}
                linkname={search === "search" ? "search products" : linkName ? linkName : getLinklName}
                linkId={linkId}
                showSide={true}
                showTop={true}
                productsRaw={productsRaw}
                more={more}
                search={search}
                // bySlug={true}
                handleFilter={handleFilter}
                handleChangePrice={handleChangePrice}
                price={price}
                setPriceStack={setPriceStack}
                doFilter={doFilter}
                category={category}
                attributes={attributes}
                productsByFilters={{ url: prodLstSlug, callData: productPagetion, selectMethod: "put" }}
            />
            {/* : "PLEASE WAIT"} */}
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

export default ProductDetailsSlug