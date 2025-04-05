import React, { useEffect } from 'react'
import Slider from '../../../Admin/containers/slider'
import withProtectedRoute from '../../../Admin/services/withProtectedRoute'
import { useDispatch } from 'react-redux'
import { setPageLink } from '../../../Admin/reducer/pageLinkReducer'

const SliderPage = () => {

  let dispatch = useDispatch()

  dispatch(setPageLink({ key: "slider" }))

  return (
    <div>
      <Slider />
    </div>
  )
}

export default withProtectedRoute(SliderPage)