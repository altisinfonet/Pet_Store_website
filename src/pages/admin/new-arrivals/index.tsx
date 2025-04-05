import React, { useEffect } from 'react'
import RepeaterTable from '../../../Admin/components/repeaterTable'
import getUrlWithKey from '../../../Admin/util/_apiUrl';
import withProtectedRoute from '../../../Admin/services/withProtectedRoute';
import { useDispatch } from 'react-redux';
import { setPageLink } from '../../../Admin/reducer/pageLinkReducer';

const NewArrivals = () => {

  const { get_arrival, create_arrival_rank, create_arrival_product, update_arrival, delete_arrival } = getUrlWithKey("new_arrivals");

  let dispatch = useDispatch()

  dispatch(setPageLink({ key: "products", subKey: "newArrivals" }))

  return (
    <div>
      <RepeaterTable
        repeaterType={"newArrivals"}
        repeaterHeader={"New Arrivals"}
        name={"Product's"}
        listedProductGetUrl={get_arrival}
        listedProductCreateUrl={create_arrival_rank}
        addProductToListUrl={create_arrival_product}
        listedProductUpdateUrl={update_arrival}
        listedProductDeleteUrl={delete_arrival}
      />
    </div>
  )
}

export default withProtectedRoute(NewArrivals)