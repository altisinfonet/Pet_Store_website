import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import getUrlWithKey from '../../util/_apiUrl';
import useIsLogedin from '../../hooks/useIsLogedin';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { setCart } from '../../reducer/getCartReducer';
import { setCoupon } from '../../reducer/couponReducer';
import { setMe } from '../../reducer/me';
import { setCartCount } from '../../reducer/cartCountReducer';
import { _SUCCESS } from '../../util/_reactToast';
import { useUpdate } from '../../hooks';

const Dashboard = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { logout } = getUrlWithKey("auth_apis");
  const { logedData } = useIsLogedin();
  const [logoutUrl, setLogoutUrl]: any = useState();
  const [showLogout, setShowLogout] = useState(false);

  const { sendData: logoutss, data: logoutData }: any = useUpdate({
    selectMethod: "post",
    url: logoutUrl,
  });

  const doLogout = () => {
    setLogoutUrl(logout);
    localStorage.clear()
  };


  useEffect(() => {
    if (logedData) {
      setShowLogout(true);
    } else {
      setShowLogout(false);
    }
  }, [logedData])

  useEffect(() => {
    if (logoutData?.success) {
      dispatch(setCart([]));
      dispatch(setCoupon({}));
      dispatch(setMe({}));
      dispatch(setCartCount(""));
      _SUCCESS(logoutData?.massage);
      router.push("/");
    }
  }, [logoutData]);
  return (
    <div className="container">
      <div className="my-account mt-3">
        <div className="tm-w-full w-100 d-flex justify-content-between ">
          <h3 style={{ paddingRight: "9px" }} className="w-fit sp-title accountHeader">Dashboard</h3>
          <button className="show-btn1 mb-3 h-fit"
            onClick={() => router.push('/myaccount')}
          >
            <i className="fa-solid fa-arrow-left-long" style={{ paddingLeft: "8px", padding: "4px" }}></i>
            <span style={{ paddingRight: "9px" }}>back</span>
          </button>
        </div>
        <div className="tm-w-full w-100 mt-2">
          <div className="tab-content" id="v-pills-tabContent">
            <div
              className="tab-pane fade show active"
              id="v-pills-home"
              role="tabpanel"
              aria-labelledby="v-pills-home-tab"
            >
              <p className="acc-para !h-[5px]">
                {logedData?.role?.label !== "guest" ? (
                  <>
                    Hello <strong> {logedData?.first_name}</strong>
                  </>
                ) : null}
                {showLogout && (
                  <>
                    ( not <strong>{logedData?.first_name}?</strong>{" "}
                    <Link
                      href="javascript:void(0);"
                      className="textLinkPink cursor-pointer"
                      onClick={() => doLogout()}
                    >
                      Log out
                    </Link>{" "}
                    )
                  </>
                )}
              </p>
              <p className="acc-para">
                From your account dashboard you can view your{" "}
                <Link
                  href="javascript:void(0);"
                  className="textLinkPink"
                onClick={() => {
                  router.push('/my-orders')
                }}
                >
                  recent orders
                </Link>{" "}
                , manage your{" "}
                <Link
                  href="javascript:void(0);"
                  className="textLinkPink"
                  onClick={() => router.push('/shipping')}
                // onClick={() => {
                //   setGetShippingAddressesUrl(
                //     get_user_shipping_addresses
                //   );
                //   setGetbillingAddressesUrl(get_user_billing_addresses);
                //   setBilling(false);
                //   orderOtherViewFalse();
                //   setOtherView("shipping");
                // }}
                >
                  shipping
                </Link>{" "}
                and{" "}
                <Link
                  href="javascript:void(0);"
                  className="textLinkPink"
                  onClick={() => {
                  router.push('/billing')
                  // setGetbillingAddressesUrl(get_user_billing_addresses);
                  // setBilling(true);
                  // orderOtherViewFalse();
                  // setOtherView("billing");
                }}
                >
                  billing addresses
                </Link>{" "}
                , and{" "}
                <Link
                  href="javascript:void(0);"
                  className="textLinkPink"
                  onClick={() => {
                    router.push('/account-details')
                  // orderOtherViewFalse();
                  // setOtherView("accountdetails");
                }}
                >
                  edit your password and account details
                </Link>{" "}
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </div >
  )
}

export default Dashboard