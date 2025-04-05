import { useEffect } from 'react';
import { useRouter } from 'next/router';

const RemoveBrowserHistory = () => {
    const router = useRouter();

    useEffect(() => {
        const handleRouteChange = (url: string) => {
            window.history.replaceState(null, '', url); // Replace the current history entry
        };

        router.events.on('routeChangeComplete', handleRouteChange);

        return () => {
            router.events.off('routeChangeComplete', handleRouteChange);
        };
    }, [router]);

    return null; // This component doesn't render anything
};

export default RemoveBrowserHistory;
