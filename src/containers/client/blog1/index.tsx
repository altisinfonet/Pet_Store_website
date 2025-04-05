import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import blog from "../../../../public/assets/icon/Tips-for-Setting-a-Daily-Schedule-That-Benefits-You-and-Your-Pet.jpg"
import moment from 'moment'
import getUrlWithKey from '../../../util/_apiUrl'
import axios from 'axios'

const Blog1 = ({ blogDetails }: any) => {


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
            <section className='blog1'>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8" data-aos="zoom-in">
                            <div className="blog-card">
                                <div className="card-body">
                                    <Image src={blogDetails?.blogImage?.length ? blogDetails?.blogImage[0]?.src : blog} alt={blogDetails?.blogImage?.length ? blogDetails?.blogImage[0]?.name : "blog_image_break"} className={`blog-img`} height={900} width={900} />
                                    <p className='blog-para pt-3'>{blogDetails?.created_at ? moment(blogDetails?.created_at).format("MMM DD, YYYY") : null}</p>
                                    <h4 className='blog-title'>{blogDetails?.title}</h4>
                                    <div className='blog-para1' dangerouslySetInnerHTML={{ __html: blogDetails?.description }} />
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4 mt-4 mt-lg-0" >
                            <h3 className='store-title'>Recent Posts</h3>

                            {blogData?.length ? blogData.slice(0, 6).map((v: any, e: number) =>
                                <div key={e} className="row mt-3" data-aos="fade-down">
                                    <div className="col-md-3 col-3">
                                        <Image src={v?.blogImage?.length ? v?.blogImage[0]?.src : blog} width={71} height={71} alt="tri" className={`blog-img`} />
                                    </div>
                                    <div className="col-md-9 col-9">
                                        <h5 className='blog-title'><Link href={v?.slug} className='blog1-anc'>{v?.title}</Link> </h5>
                                        <p className='blog-para'>{v?.created_at ? moment(v?.created_at).format("MMM DD, YYYY") : null}</p>
                                    </div>
                                </div>) : null}

                           
                        </div>
                    </div>
                </div>
            </section>

        </>
    )
}

export default Blog1