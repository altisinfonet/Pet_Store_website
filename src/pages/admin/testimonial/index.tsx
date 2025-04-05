import React, { useEffect } from 'react'
import Testimonial from '../../../Admin/containers/testimonial'
import withProtectedRoute from '../../../Admin/services/withProtectedRoute'
import { useDispatch } from 'react-redux'
import { setPageLink } from '../../../Admin/reducer/pageLinkReducer'

const TestimonialPage = () => {

  let dispatch = useDispatch()

  dispatch(setPageLink({ key: "testimonial" }))

  return (
    <div><Testimonial /></div>
  )
}

export default withProtectedRoute(TestimonialPage)