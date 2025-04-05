import React, { useEffect } from 'react'
import HomePage from '../../../../Admin/containers/cmspages/home'
import { useDispatch } from 'react-redux'
import { setPageLink } from '../../../../Admin/reducer/pageLinkReducer'

const HomePages = () => {

    let dispatch = useDispatch()

      dispatch(setPageLink({ key: "pages" }))

    return (
        <div>
            <HomePage />
        </div>
    )
}

export default HomePages