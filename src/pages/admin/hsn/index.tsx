import React, { useEffect } from 'react'
import HsnMaster from '../../../Admin/containers/hsnMaster'
import withProtectedRoute from '../../../Admin/services/withProtectedRoute'
import { useDispatch } from 'react-redux'
import { setPageLink } from '../../../Admin/reducer/pageLinkReducer'

const Coupon = () => {

  let dispatch = useDispatch()

  dispatch(setPageLink({ key: "couponCode" }))

  return (
    <div><HsnMaster /></div>
  )
}

export default withProtectedRoute(Coupon)