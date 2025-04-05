import { useState, useEffect } from 'react';

const useGetApiUrl = ({ path = "" }) => {
    const [API_URL, setUrl] = useState("");

    useEffect(() => {
        const BASE_URL = process.env.REACT_APP_API_URL_CLIENT;
        // const SLUG = process.env.REACT_APP_API_SLUG;
        const API_URL = `${BASE_URL}/${path}`;
        path && setUrl(API_URL);
    }, [path]);

    return API_URL;
};

export default useGetApiUrl;
