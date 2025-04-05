import React, { useEffect } from 'react'
import ReviewPage from '../../../Admin/containers/reviews'
import withProtectedRoute from '../../../Admin/services/withProtectedRoute'
import { useDispatch } from 'react-redux'
import { setPageLink } from '../../../Admin/reducer/pageLinkReducer'

const Reviews = () => {

  let dispatch = useDispatch()

  dispatch(setPageLink({ key: "reviews", subKey: "allReviews" }))

  return (
    <div><ReviewPage /></div>
  )
}

export default withProtectedRoute(Reviews)