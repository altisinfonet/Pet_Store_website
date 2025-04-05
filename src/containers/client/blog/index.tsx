import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import blog from "../../../../public/assets/icon/Tips-for-Setting-a-Daily-Schedule-That-Benefits-You-and-Your-Pet.jpg"
import { useSelector } from 'react-redux'
import axios from 'axios'
import getUrlWithKey from '../../../util/_apiUrl'
import moment from 'moment'

const Blog = () => {

    const getLinlName = useSelector((state: any) => state?.linkNameReducer?.value);
    const { get_blog } = getUrlWithKey("client_apis")

    const [blogData, setBlogData]: any = useState([])

    const getBlogs = async () => {
        try {
            const { data }: any = await axios.put(get_blog)
            if (data?.success) {
                setBlogData(data?.data)
            }
        } catch (error) {
            console.log(error, "__error__")
        }
    }

    useEffect(() => {
        getBlogs()
    }, [])

    // const [truncatedText, setTruncatedText] = useState('');

    const description = (value: any) => {
        if (value.length > 0) {
            // Get the first paragraph
            const firstParagraph = value.slice(3, 200);
            // Limit to 195 characters
            const truncatedContent = firstParagraph.length > 195
                ? firstParagraph.substring(0, 195) + '...'
                : firstParagraph;
            return (truncatedContent);
        }
    }

    return (
        <>
            <section className='blog mt-4'>
                <div className="container">

                    <div className=" flex items-center justify-center w-full uppercase font-medium ppsL"><h1 className="sp-title" style={{ fontSize: "150%" }}>{getLinlName || "BLOG"}</h1></div>

                    <div className="row">

                        {blogData?.length ? blogData.map((v: any, e: number) =>
                            <Link href={`/blog/${v?.slug}`} key={e} className="col-lg-4" style={{ paddingTop: "30px" }} data-aos="zoom-out">
                                <div className="blog-card">
                                    <div className="card-body">
                                        {(v?.blogImage && v?.blogImage?.length) ? (v?.blogImage[0]?.src && (v?.blogImage[0]?.src != '')) ? <Image src={v?.blogImage[0]?.src} height={800} width={800} alt={v?.blogImage?.length ? v?.blogImage[0]?.name : "blog_image_break"} className={`blog-img`} /> : null : null}
                                        <p className='blog-para pt-3'>{v?.created_at ? moment(v?.created_at).format("MMM DD, YYYY") : null}</p>
                                        <h4 className='blog-title'>{v?.title}</h4>
                                        <p className='blog-para1'>{description(v?.description)}</p>
                                        {/* <div className='blog-para1 blogdescription' dangerouslySetInnerHTML={{ __html: truncatedText ? truncatedText : v?.description }} /> */}
                                        <Link href={`/blog/${v?.slug}`}><button className='blog-btn'>Read More</button></Link>
                                    </div>
                                </div>
                            </Link>) : null}

                    </div>
                </div>
            </section>

        </>
    )
}

export default Blog