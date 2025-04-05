import React, { useEffect } from 'react'
import PagesList from '../../../Admin/containers/cmspages/PagesList'
import withProtectedRoute from '../../../Admin/services/withProtectedRoute'
import { useDispatch } from 'react-redux'
import { setPageLink } from '../../../Admin/reducer/pageLinkReducer'

const Pagess = () => {

  let dispatch = useDispatch()

  dispatch(setPageLink({ key: "pages" }))

  return (
    <>
      <PagesList />
    </>
  )
}

export default withProtectedRoute(Pagess)