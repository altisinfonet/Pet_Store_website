import React, { useEffect } from 'react'
import DiscountContainer from '../../../Admin/containers/discount'
import withProtectedRoute from '../../../Admin/services/withProtectedRoute'
import { useDispatch } from 'react-redux'
import { setPageLink } from '../../../Admin/reducer/pageLinkReducer'

const Discount = () => {

  let dispatch = useDispatch()

  dispatch(setPageLink({ key: "discountRules" }))

  return (
    <div>
      <DiscountContainer />
    </div>
  )
}

export default withProtectedRoute(Discount)
