
import { useState, useEffect } from 'react';
import useRead from '../useRead';
import getUrlWithKey from '../../util/_apiUrl';
import { setMe } from '../../reducer/me';
import { useDispatch } from 'react-redux';
import axios from 'axios';

const useForceIsLogedin = () => {

    const dispatch = useDispatch();

    // Check me
    // get category hooks
    const { me: me_url } = getUrlWithKey("auth_apis");

    const fetchMe = async () => {
        try {
            const { data: me }: any = axios.get(me_url);
            if (me && me?.id) {
                localStorage.setItem("logedId", "true");
                dispatch(setMe(me))
            }
        } catch (error) {
            if (error && error === "access_denied") {
                localStorage.removeItem("logedId");
            }
        }
    }

    fetchMe();

    // useEffect(() => {
    //     if (error && error === "access_denied") {
    //         setIsLoged(false);
    //         localStorage.removeItem("logedId");
    //     }

    //     if (me && me?.id) {
    //         // if (me?.role && me?.role?.label === "guest") {
    //         //     localStorage.setItem("guest_username", me?.username);
    //         // }
    //         localStorage.setItem("logedId", "true");
    //         setIsLoged(true);
    //         setLogedData(me)
    //         dispatch(setMe(me))
    //     }
    // }, [error, me]);

    // return { isLoged, logedData };
};

export default useForceIsLogedin;
