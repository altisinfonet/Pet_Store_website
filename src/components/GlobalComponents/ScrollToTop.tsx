import { useEffect } from 'react';
import { useRouter } from 'next/router';

const ScrollToTop = () => {
    const router = useRouter();

    useEffect(() => {
        const handleRouteChange = () => {
            window.scrollTo({
                top: 0,
                left: 0,
                behavior: 'instant', // Use 'smooth' for smooth scrolling if desired
            });
        };

        router.events.on('routeChangeComplete', handleRouteChange);

        // Cleanup event listener on unmount
        return () => {
            router.events.off('routeChangeComplete', handleRouteChange);
        };
    }, [router.events]);

    return null; // This component doesn't render anything
};

export default ScrollToTop;
