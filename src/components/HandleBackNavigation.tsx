"use client";

import { useEffect } from "react";
import { useRouter } from "next/router";

const HandleBackNavigation = () => {
    const router = useRouter();

    useEffect(() => {
        const handlePopState = () => {
            console.log("Back button clicked");
            router.replace(router.asPath); // Ensures correct page update
        };

        window.addEventListener("popstate", handlePopState);

        return () => {
            window.removeEventListener("popstate", handlePopState);
        };
    }, [router]);

    return null;
};

export default HandleBackNavigation;
