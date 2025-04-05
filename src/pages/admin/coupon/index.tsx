import React, { useEffect } from 'react'
import CouponPage from '../../../Admin/containers/coupon'
import withProtectedRoute from '../../../Admin/services/withProtectedRoute'
import { useDispatch } from 'react-redux'
import { setPageLink } from '../../../Admin/reducer/pageLinkReducer'

const Coupon = () => {

  let dispatch = useDispatch()

  dispatch(setPageLink({ key: "couponCode" }))

  return (
    <div><CouponPage /></div>
  )
}

export default withProtectedRoute(Coupon)