import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import Slider from 'react-slick'
import pageimg from "../../../../public/assets/icon/Screenshot-2023-07-06-135449.jpg"


const Page = () => {

    var settings1 = {
        margin: 30,
        infinite: true,
        speed: 500,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
    };
    return (
        <>
            <div className="container">
                <div className="row mt-5">
                    <div className="col-lg-6">
                        <h3 className='page-title'>German Shepherd</h3>
                        <p className='page-para2'>During the 1890s, attempts were being made to standardise dog breeds.Dogs were being bred to preserve traits that assisted in their job of herding sheep and protecting their flocks from predators. In Germany this was practised within local communities, where shepherds selected and bred dogs. It was recognised that the breed had the necessary skills for herding sheep, such as intelligence, speed, strength and keen senses of smell.The results were dogs that were able to do such things, but that differed significantly, both in appearance and ability, from one locality to another. To combat these differences, the Phylax Society was formed in 1891 with the intention of creating standardised development plans for native dog breeds in Germany.The society disbanded after only three years due to ongoing internal conflicts regarding the traits in dogs that the society should promote;[4] some members believed dogs should be bred solely for working purposes, while others believed dogs should be bred also for appearance. While unsuccessful in their goal, the Phylax Society had inspired people to pursue standardising dog breeds independently</p>
                    </div>
                    <div className="col-lg-6 mt-4 mt-lg-0">
                        <Image src={pageimg} alt="page-image" className={`page-img`} />
                    </div>
                </div>
            </div>

            <div className="container mt-5">
                <div className="row gx-1 mb-5">
                    <div className="col-md-10 col-8">
                        <h3 className='page-title2'>Shop For German Shepherd</h3>
                    </div>
                    <div className="col-md-2 col-4">
                        <button className='view'>View All</button>
                    </div>
                </div>
                <Slider className='pps' {...settings1} slidesToShow={4}>
                    <div className="item">
                        <div className="product-box">
                            <div className="thumb-wrap">
                                <h5 className="offer">12% Off</h5>
                                <div className="thumb"><Link href="javascript:void(0);"><img src="/assets/images/product-image1.png" alt="product-image" width={257} height={257} /></Link></div>
                                <ul className="thumb-list">
                                    <li><Link href="javascript:void(0);"><img src="/assets/images/product-image1.png" alt="product-image" width={45} height={45} /></Link></li>
                                    <li><Link href="javascript:void(0);"><img src="/assets/images/product-image1.png" alt="product-image" width={45} height={45} /></Link></li>
                                </ul>
                                <ul className="plinks">
                                    <li><Link href="javascript:void(0);"><i className="fa-solid fa-heart"></i></Link></li>
                                    <li><Link href="javascript:void(0);"><i className="fa-solid fa-cart-shopping"></i></Link></li>
                                    {/* <li><Link href="javascript:void(0);"><i className="fa-solid fa-magnifying-glass"></i></Link></li> */}
                                </ul>
                            </div>
                            <div className="rating">
                                <i className="fa-solid fa-star active"></i>
                                <i className="fa-solid fa-star active"></i>
                                <i className="fa-solid fa-star active"></i>
                                <i className="fa-solid fa-star active"></i>
                                <i className="fa-solid fa-star"></i>
                            </div>
                            <h3 className="ptitle"><Link href="javascript:void(0);">Royal Canin – Kitten 36</Link></h3>
                            <div className="price pt-0"><span>₹</span>396.50  <del><span>₹</span>450.00</del></div>
                        </div>
                    </div>
                    <div className="item">
                        <div className="product-box">
                            <div className="thumb-wrap">
                                <h5 className="offer">12% Off</h5>
                                <div className="thumb"><Link href="javascript:void(0);"><img src="/assets/images/product-image2.png" alt="product-image" width={257} height={257} /></Link></div>
                                <ul className="thumb-list">
                                    <li><Link href="javascript:void(0);"><img src="/assets/images/product-image2.png" alt="product-image" width={45} height={45} /></Link></li>
                                    <li><Link href="javascript:void(0);"><img src="/assets/images/product-image2.png" alt="product-image" width={45} height={45} /></Link></li>
                                </ul>
                                <ul className="plinks">
                                    <li><Link href="javascript:void(0);"><i className="fa-solid fa-heart"></i></Link></li>
                                    <li><Link href="javascript:void(0);"><i className="fa-solid fa-cart-shopping"></i></Link></li>
                                    {/* <li><Link href="javascript:void(0);"><i className="fa-solid fa-magnifying-glass"></i></Link></li> */}
                                </ul>
                            </div>
                            <div className="rating">
                                <i className="fa-solid fa-star active"></i>
                                <i className="fa-solid fa-star active"></i>
                                <i className="fa-solid fa-star active"></i>
                                <i className="fa-solid fa-star active"></i>
                                <i className="fa-solid fa-star"></i>
                            </div>
                            <h3 className="ptitle"><Link href="javascript:void(0);">Royal Canin – Maxi Adult</Link></h3>
                            <div className="price pt-0"><span>₹</span>792.50  <del><span>₹</span>900.00</del></div>
                        </div>
                    </div>
                    <div className="item">
                        <div className="product-box">
                            <div className="thumb-wrap">
                                <h5 className="offer">12% Off</h5>
                                <div className="thumb"><Link href="javascript:void(0);"><img src="/assets/images/product-image1.png" alt="product-image" width={257} height={257} /></Link></div>
                                <ul className="thumb-list">
                                    <li><Link href="javascript:void(0);"><img src="/assets/images/product-image1.png" alt="product-image" width={45} height={45} /></Link></li>
                                    <li><Link href="javascript:void(0);"><img src="/assets/images/product-image1.png" alt="product-image" width={45} height={45} /></Link></li>
                                </ul>
                                <ul className="plinks">
                                    <li><Link href="javascript:void(0);"><i className="fa-solid fa-heart"></i></Link></li>
                                    <li><Link href="javascript:void(0);"><i className="fa-solid fa-cart-shopping"></i></Link></li>
                                    {/* <li><Link href="javascript:void(0);"><i className="fa-solid fa-magnifying-glass"></i></Link></li> */}
                                </ul>
                            </div>
                            <div className="rating">
                                <i className="fa-solid fa-star active"></i>
                                <i className="fa-solid fa-star active"></i>
                                <i className="fa-solid fa-star active"></i>
                                <i className="fa-solid fa-star active"></i>
                                <i className="fa-solid fa-star"></i>
                            </div>
                            <h3 className="ptitle"><Link href="javascript:void(0);">Royal Canin – Kitten 36</Link></h3>
                            <div className="price pt-0"><span>₹</span>396.50  <del><span>₹</span>450.00</del></div>
                        </div>
                    </div>
                    <div className="item">
                        <div className="product-box">
                            <div className="thumb-wrap">
                                <h5 className="offer">12% Off</h5>
                                <div className="thumb"><Link href="javascript:void(0);"><img src="/assets/images/product-image2.png" alt="product-image" width={257} height={257} /></Link></div>
                                <ul className="thumb-list">
                                    <li><Link href="javascript:void(0);"><img src="/assets/images/product-image2.png" alt="product-image" width={45} height={45} /></Link></li>
                                    <li><Link href="javascript:void(0);"><img src="/assets/images/product-image2.png" alt="product-image" width={45} height={45} /></Link></li>
                                </ul>
                                <ul className="plinks">
                                    <li><Link href="javascript:void(0);"><i className="fa-solid fa-heart"></i></Link></li>
                                    <li><Link href="javascript:void(0);"><i className="fa-solid fa-cart-shopping"></i></Link></li>
                                    <li><Link href="javascript:void(0);"><i className="fa-solid fa-magnifying-glass"></i></Link></li>
                                </ul>
                            </div>
                            <div className="rating">
                                <i className="fa-solid fa-star active"></i>
                                <i className="fa-solid fa-star active"></i>
                                <i className="fa-solid fa-star active"></i>
                                <i className="fa-solid fa-star active"></i>
                                <i className="fa-solid fa-star"></i>
                            </div>
                            <h3 className="ptitle"><Link href="javascript:void(0);">Royal Canin – Maxi Adult</Link></h3>
                            <div className="price pt-0"><span>₹</span>792.50  <del><span>₹</span>900.00</del></div>
                        </div>
                    </div>
                    <div className="item">
                        <div className="product-box">
                            <div className="thumb-wrap">
                                <h5 className="offer">12% Off</h5>
                                <div className="thumb"><Link href="javascript:void(0);"><img src="/assets/images/product-image1.png" alt="product-image" width={257} height={257} /></Link></div>
                                <ul className="thumb-list">
                                    <li><Link href="javascript:void(0);"><img src="/assets/images/product-image1.png" alt="product-image" width={45} height={45} /></Link></li>
                                    <li><Link href="javascript:void(0);"><img src="/assets/images/product-image1.png" alt="product-image" width={45} height={45} /></Link></li>
                                </ul>
                                <ul className="plinks">
                                    <li><Link href="javascript:void(0);"><i className="fa-solid fa-heart"></i></Link></li>
                                    <li><Link href="javascript:void(0);"><i className="fa-solid fa-cart-shopping"></i></Link></li>
                                    {/* <li><Link href="javascript:void(0);"><i className="fa-solid fa-magnifying-glass"></i></Link></li> */}
                                </ul>
                            </div>
                            <div className="rating">
                                <i className="fa-solid fa-star active"></i>
                                <i className="fa-solid fa-star active"></i>
                                <i className="fa-solid fa-star active"></i>
                                <i className="fa-solid fa-star active"></i>
                                <i className="fa-solid fa-star"></i>
                            </div>
                            <h3 className="ptitle"><Link href="javascript:void(0);">Royal Canin – Kitten 36</Link></h3>
                            <div className="price pt-0"><span>₹</span>396.50  <del><span>₹</span>450.00</del></div>
                        </div>
                    </div>
                </Slider>
            </div>




        </>
    )
}

export default Page