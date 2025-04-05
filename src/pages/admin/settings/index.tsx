import React, { useEffect } from 'react'
import Options from '../../../Admin/containers/options/Options'
import withProtectedRoute from '../../../Admin/services/withProtectedRoute'
import { useDispatch } from 'react-redux'
import { setPageLink } from '../../../Admin/reducer/pageLinkReducer'

const OptionsPage = () => {

  let dispatch = useDispatch()

  dispatch(setPageLink({ key: "settings" }))

  return (
    <div><Options /></div>
  )
}

export default withProtectedRoute(OptionsPage)