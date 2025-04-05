import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import getpageLinkSlice from './pageLinkReducer';
// import getpageLinkSlice from './getCartHolding';


// Define your slice and reducers
// import myReducer from './mySlice';

const store = configureStore({
    reducer: {
        getpageLinkReducer: getpageLinkSlice
    },
});

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();

export default store;
