import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import getCartSlice from './getCartReducer';
import meSlice from './me';
import getCouponSlice from './couponReducer';
import openCartSlice from './openCartReducer';
import getCartCountSlice from './cartCountReducer';
import listingTypeSlice from './listingTypeReducer';
import thankyouSlice from './thankyouReducer';
import linkNameSlice from './linkNameReducer'
import openAuthSlice from './openAuthReducer';
import openCartDiscountSlice from './openCartForDiscountReducer';
import getCartHoldingSlice from './getCartHolding';
import openCartDisableSlice from './openCartReducerForDisable';
import breadcrumbsSlice from './breadcrumbsReaducer';
import thankyouAddressSlice from './thankyouAddressReducer';

// Define your slice and reducers
// import myReducer from './mySlice';

const store = configureStore({
  reducer: {
    meReducer: meSlice,
    getCartReducer: getCartSlice,
    getCartHoldingReducer: getCartHoldingSlice,
    couponReducer: getCouponSlice,
    openCartReducer: openCartSlice,
    openCartDisableReducer: openCartDisableSlice,
    getCartCountReducer: getCartCountSlice,
    listingTypeReducer: listingTypeSlice,
    thankyouReducer: thankyouSlice,
    thankyouAddressReducer: thankyouAddressSlice,
    linkNameReducer: linkNameSlice,
    openAuthReducer: openAuthSlice,
    openCartDiscountReducer: openCartDiscountSlice,
    breadcrumbsReaducer: breadcrumbsSlice
  },
});

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();

export default store;
