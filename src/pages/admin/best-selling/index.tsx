import React, { useEffect } from 'react'
import RepeaterTable from '../../../Admin/components/repeaterTable'
import getUrlWithKey from '../../../Admin/util/_apiUrl';
import withProtectedRoute from '../../../Admin/services/withProtectedRoute';
import { useDispatch } from 'react-redux';
import { setPageLink } from '../../../Admin/reducer/pageLinkReducer';

const BestSelling = () => {

  const { get_best_selling, create_best_selling_rank, create_best_selling_product, update_best_selling, delete_best_selling } = getUrlWithKey("best_selling");

  let dispatch = useDispatch()

  useEffect(() => {
      dispatch(setPageLink({ key: "products", subKey: "bestSelling" }))
  }, [])

  return (
    <div>
      <RepeaterTable
        repeaterType={"bestSelling"}
        repeaterHeader={"Best Selling"}
        name={"Product's"}
        listedProductGetUrl={get_best_selling}
        listedProductCreateUrl={create_best_selling_rank}
        listedProductUpdateUrl={update_best_selling}
        addProductToListUrl={create_best_selling_product}
        listedProductDeleteUrl={delete_best_selling}
      />
    </div>
  )
}

export default withProtectedRoute(BestSelling)