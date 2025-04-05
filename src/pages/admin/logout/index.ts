import React, { useEffect } from 'react'
import { useAuth } from '../../../Admin/services/context/AuthContext';

const LogOut = () => {
    const { logout } = useAuth()


    useEffect(() => {

        const fetchData = async () => {
            try {
                const response = await logout();
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);
}

export default LogOut
