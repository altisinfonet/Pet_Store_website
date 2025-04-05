import React, { useEffect } from 'react'
import RepeaterTable from '../../../Admin/components/repeaterTable'
import withProtectedRoute from '../../../Admin/services/withProtectedRoute'
import getUrlWithKey from '../../../Admin/util/_apiUrl';
import { useDispatch } from 'react-redux';
import { setPageLink } from '../../../Admin/reducer/pageLinkReducer';

const Offer = () => {

  const { get_offer, create_offer_rank, create_offer_product, update_offer, delete_offer } = getUrlWithKey("offer");
  

  let dispatch = useDispatch()

  dispatch(setPageLink({ key: "products", subKey: "offer" }))

  return (
    <div>
      <RepeaterTable
        repeaterType={"Offer"}
        repeaterHeader={"Offer"}
        name={"Product's"}
        listedProductGetUrl={get_offer}
        listedProductCreateUrl={create_offer_rank}
        listedProductUpdateUrl={update_offer}
        addProductToListUrl={create_offer_product}
        listedProductDeleteUrl={delete_offer}
      />
    </div>
  )
}

export default withProtectedRoute(Offer)