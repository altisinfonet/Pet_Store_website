import React, { useEffect, useState } from 'react'
import ProductListing from '../../containers/client/productListing'
import { useRead } from '../../hooks'
import getUrlWithKey from '../../util/_apiUrl'
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import MetaHead from '../../templates/meta';

function valuetext(value: number) {
    return `${value}°C`;
}


const ProductDetails = () => {

    const router = useRouter()
    const { product_list } = getUrlWithKey("client_apis")

    const [priceStack, setPriceStack] = useState({ minPrice: 0, maxPrice: 0 })
    const [dataPerPage, setDataPerPage]: any = useState(8)
    const [sortby, setSortby]: any = useState("default")
    const [getProductUrl, setGetProductUrl]: any = useState(product_list)
    const [productPagetion, setProductPagetion]: any = useState({ page: 1, rowsPerPage: 8, sorting: sortby })
    const [productData, setProductData]: any = useState([])
    const [more, setMore] = useState(false)
    const [category, setCategory]: any = useState([])
    const [attributes, setAttributes]: any = useState([])
    const [price, setPrice] = React.useState<number[]>([100, 3000]);


    const { sendData: products, loading: productsLoading, rawData: productsRaw }: any = useRead({ selectMethod: "put", url: getProductUrl, callData: productPagetion });
    const getLinkName = useSelector((state: any) => state?.linkNameReducer?.value);

    console.log(productsRaw, "productData")


    useEffect(() => {
        setPrice([priceStack?.minPrice, priceStack?.maxPrice])
    }, [priceStack])

    useEffect(() => {
        if (dataPerPage > 5) {
            setProductPagetion({
                page: 1,
                rowsPerPage: dataPerPage,
                category_ids: category?.length ? category : [],
                attribute_term_ids: attributes.length ? attributes : []
            })
        }
    }, [dataPerPage])

    useEffect(() => {
        if (sortby) {
            setProductPagetion({
                page: 1,
                rowsPerPage: dataPerPage,
                category_ids: category?.length ? category : [],
                attribute_term_ids: attributes.length ? attributes : [],
                sorting: sortby
            })
        }
    }, [sortby])

    useEffect(() => {
        if (products?.products?.length && more === false) {
            setProductData(products?.products)
        }

        if (productsRaw?.success && more === true && products?.previous_page === productPagetion?.page) {
            setProductData((pre: any) => pre?.length ? [...pre, ...products?.products] : products?.products)
        }
    }, [products, more])

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


    useEffect(() => {
    }, [more])

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
                    category_ids: filteredCategory?.length ? filteredCategory : [],
                    attribute_term_ids: attributes.length ? attributes : []
                })
            } else {
                setCategory((pre: any) => [+value, ...pre]);
                setProductPagetion({
                    page: 1,
                    rowsPerPage: 8,
                    category_ids: [...category, +value]?.length ? [...category, +value] : [],
                    attribute_term_ids: attributes.length ? attributes : []
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
                    category_ids: category?.length ? category : [],
                    attribute_term_ids: filteredAttributes?.length ? filteredAttributes : []
                })
            } else {
                setAttributes((pre: any) => [+value, ...pre]);
                setProductPagetion({
                    page: 1,
                    rowsPerPage: 8,
                    category_ids: category?.length ? category : [],
                    attribute_term_ids: [...attributes, +value]?.length ? [...attributes, +value] : []
                })
            }
        }
    }

    const handleChangePrice = (event: Event, newValue: number | number[]) => {
        setPrice(newValue as number[]);
    };


    const doFilter = () => {
        setProductPagetion({
            page: 1,
            rowsPerPage: 8,
            category_ids: category?.length ? category : [],
            attribute_term_ids: attributes.length ? attributes : [],
            min_price: price?.length ? price[0] : null,
            max_price: price?.length ? price[1] : null,
        })
    }




    const [isScrolledToBottom, setIsScrolledToBottom] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight; // More reliable for content height
            const scrollTop = window.scrollY;
            const isNearBottom = scrollTop + windowHeight >= documentHeight - 1050; // Allow for buffer (customizable)

            setIsScrolledToBottom(isNearBottom);
        };

        window.addEventListener('scroll', handleScroll);

        // Cleanup function to remove event listener on unmount
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (isScrolledToBottom === true) {
            setProductPagetion((pre: any) => ({
                ...pre,
                page: pre?.page + 1
            }));
            setMore(true)
        }
    }, [isScrolledToBottom])

    if (productsLoading) {
        return <div className='flex w-full items-center justify-center cli' style={{ height: "70vh" }}>
            <div className="spinner"></div>
        </div>
    }


    return (
        <>
            <MetaHead meta_title="brand" meta_description="brand" keywords={"keywords"} />
            <ProductListing
                products={productData}
                productsAll={products}
                productsLoading={productsLoading}
                perPageList={perPageList}
                sortItemList={sortItemList}
                dataPerPage={dataPerPage}
                setDataPerPage={setDataPerPage}
                setSortby={setSortby}
                sortby={sortby}
                pageCount={productPagetion?.page}
                linkname={getLinkName || "Offer"}
                showSide={true}
                showTop={true}
                handleFilter={handleFilter}
                handleChangePrice={handleChangePrice}
                price={price}
                setPriceStack={setPriceStack}
                doFilter={doFilter}
                category={category}
                attributes={attributes}
            />

        </>
    )
}

export default ProductDetails