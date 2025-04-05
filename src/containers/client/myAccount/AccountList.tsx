import React from 'react'
import PersonIcon from "@mui/icons-material/Person";
import WalletIcon from "@mui/icons-material/Wallet";
import LogoutIcon from "@mui/icons-material/Logout";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import HomeIcon from "@mui/icons-material/Home";
import BusinessIcon from "@mui/icons-material/Business";
import ReviewsIcon from "@mui/icons-material/Reviews";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import FavoriteIcon from "@mui/icons-material/Favorite";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import ScheduleIcon from "@mui/icons-material/Schedule";
import HistoryIcon from "@mui/icons-material/History";

const AccountList = () => {
    return (
        <>
            <section className="myaccount_wrap">
                <div className="container">
                    <div className="allbox_wrap row">
                        <div className="col-lg-4 col-md-6 col-6">
                            <button className="sing_box">
                                <div className="icon_wrap">
                                    <PersonIcon />
                                </div>
                                <div className="details_wrap">
                                    <h4 className="head">Dashboard</h4>
                                    <p className="text">Manage appointments, track services, and access offers </p>
                                </div>
                            </button>
                        </div>
                        <div className="col-lg-4 col-md-6 col-6">
                            <button className="sing_box">
                                <div className="icon_wrap">
                                    <WalletIcon />
                                </div>
                                <div className="details_wrap">
                                    <h4 className="head">My Wallet</h4>
                                    <p className="text">View and manage your payment methods and balance.</p>
                                </div>
                            </button>
                        </div>
                        <div className="col-lg-4 col-md-6 col-6">
                            <button className="sing_box">
                                <div className="icon_wrap">
                                    <Inventory2Icon />
                                </div>
                                <div className="details_wrap">
                                    <h4 className="head">Orders</h4>
                                    <p className="text">Track and manage your orders </p>
                                </div>
                            </button>
                        </div>
                        <div className="col-lg-4 col-md-6 col-6">
                            <button className="sing_box">
                                <div className="icon_wrap">
                                    <BookmarkIcon />
                                </div>
                                <div className="details_wrap">
                                    <h4 className="head">Save For Later</h4>
                                    <p className="text">Easily bookmark and revisit your favorite items or services!</p>
                                </div>
                            </button>
                        </div>
                        <div className="col-lg-4 col-md-6 col-6">
                            <button className="sing_box">
                                <div className="icon_wrap">
                                    <ScheduleIcon />
                                </div>
                                <div className="details_wrap">
                                    <h4 className="head">Recently Viewed Items</h4>
                                    <p className="text">{`Quickly revisit the products you've checked out.`}</p>
                                </div>
                            </button>
                        </div>
                        <div className="col-lg-4 col-md-6 col-6">
                            <button className="sing_box">
                                <div className="icon_wrap">
                                    <HistoryIcon />
                                </div>
                                <div className="details_wrap">
                                    <h4 className="head">Search History</h4>
                                    <p className="text">Review your recent searches </p>
                                </div>
                            </button>
                        </div>
                        <div className="col-lg-4 col-md-6 col-6">
                            <button className="sing_box">
                                <div className="icon_wrap">
                                    <ReviewsIcon />
                                </div>
                                <div className="details_wrap">
                                    <h4 className="head">My Reviews</h4>
                                    <p className="text">View and manage feedbacks </p>
                                </div>
                            </button>
                        </div>
                        <div className="col-lg-4 col-md-6 col-6">
                            <button className="sing_box">
                                <div className="icon_wrap">
                                    <FavoriteIcon />
                                </div>
                                <div className="details_wrap">
                                    <h4 className="head">My Wishlist</h4>
                                    <p className="text">Keep track of your favorite items. </p>
                                </div>
                            </button>
                        </div>
                        <div className="col-lg-4 col-md-6 col-6">
                            <button className="sing_box">
                                <div className="icon_wrap">
                                    <HomeIcon />
                                </div>
                                <div className="details_wrap">
                                    <h4 className="head">Billing Address</h4>
                                    <p className="text">Manage your billing details </p>
                                </div>
                            </button>
                        </div>
                        <div className="col-lg-4 col-md-6 col-6">
                            <button className="sing_box">
                                <div className="icon_wrap">
                                    <BusinessIcon />
                                </div>
                                <div className="details_wrap">
                                    <h4 className="head">Shipping Address</h4>
                                    <p className="text">Manage and update your delivery details </p>
                                </div>
                            </button>
                        </div>
                        <div className="col-lg-4 col-md-6 col-6">
                            <button className="sing_box">
                                <div className="icon_wrap">
                                    <ManageAccountsIcon />
                                </div>
                                <div className="details_wrap">
                                    <h4 className="head">Account Details</h4>
                                    <p className="text">View and update your personal information </p>
                                </div>
                            </button>
                        </div>
                        <div className="col-lg-4 col-md-6 col-6">
                            <button className="sing_box">
                                <div className="icon_wrap">
                                    <LogoutIcon />
                                </div>
                                <div className="details_wrap">
                                    <h4 className="head">Log Out</h4>
                                    <p className="text">Log out your Account 123....</p>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default AccountList
