
import { useState, useEffect } from 'react';
import useRead from '../useRead';
import getUrlWithKey from '../../util/_apiUrl';
import { setMe } from '../../reducer/me';
import { useDispatch } from 'react-redux';

const useIsLogedin = () => {

    const dispatch = useDispatch()

    const [isLoged, setIsLoged]: any = useState();
    const [logedData, setLogedData]: any = useState();

    // Check me
    // get category hooks
    const { me: me_url } = getUrlWithKey("auth_apis");
    const { sendData: me, error }: any = useRead({ selectMethod: "get", url: me_url });

    useEffect(() => {
        if (error && error === "access_denied") {
            setIsLoged(false);
            localStorage.removeItem("logedId");
        }

        if (me && me?.id) {
            // if (me?.role && me?.role?.label === "guest") {
            //     localStorage.setItem("guest_username", me?.username);
            // }
            localStorage.setItem("logedId", "true");
            setIsLoged(true);
            setLogedData(me)
            dispatch(setMe(me))
        } else {
            setLogedData(null);
        }
    }, [error, me]);

    return { isLoged, logedData };
};

export default useIsLogedin;
