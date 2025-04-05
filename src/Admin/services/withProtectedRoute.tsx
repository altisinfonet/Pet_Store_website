import React, { useEffect, FunctionComponent, useState } from 'react';
import { useAuth } from './context/AuthContext';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import getUrlWithKey from '../util/_apiUrl';

const withProtectedRoute = <P extends object>(WrappedComponent: FunctionComponent<P>) => {
    const WithProtectedRoute: FunctionComponent<P> = (props) => {
        const { user } = useAuth();
        const router = useRouter();
        const { admin_me } = getUrlWithKey("users");
        const [retryCount, setRetryCount] = useState(0);

        useEffect(() => {
            // setTimeout(() => {
            //     if (!user && router) {
            //         router.push('/login');
            //     }
            // }, 1000)

            const fetch = async () => {
                try {
                    const response = await axios.get(`${admin_me}`, { withCredentials: true });
                    console.log(response)
                    console.log("withProtectedRoute-response", response)
                    // return;
                    setRetryCount(0)

                } catch (error) {
                    console.log("withProtectedRoute-response", error)
                    if (error && error.status === 401) {
                        // setRetryCount((prev: any) => prev + 1)
                        router.push("/admin/login");
                        // window.location.reload();
                    }
                    // return;
                }

                // if (retryCount >= 1) {
                //     router.push("/admin/login");
                //     window.location.reload();
                // } else {
                   
                // }

            }

            fetch();

            // If the user is not authenticated, redirect to the login page

        }, []);

        // If the user is authenticated, render the WrappedComponent
        // Otherwise, render null while the redirection is in progress
        return user ? <WrappedComponent {...props as P} /> : null;
    };

    return WithProtectedRoute;
};

export default withProtectedRoute;
