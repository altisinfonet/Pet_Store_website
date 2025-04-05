import React, { useEffect } from 'react'
import AttributePage from '../../../Admin/containers/attributes'
import withProtectedRoute from '../../../Admin/services/withProtectedRoute'
import { useDispatch } from 'react-redux'
import { setPageLink } from '../../../Admin/reducer/pageLinkReducer'

const Attributes = () => {

  let dispatch = useDispatch()

  useEffect(() => {
      dispatch(setPageLink({ key: "products", subKey: "attributes" }))
  }, [])

  return (
    <div><AttributePage /></div>

  )
}

export default withProtectedRoute(Attributes)