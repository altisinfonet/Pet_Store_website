// src/components/Geocode.tsx

import React, { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';

interface Coordinates {
    lat: number;
    lng: number;
}

const Geocode: any = ({ setCoordinates }: any) => {
    const [address, setAddress] = useState<string>('');
    // const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
    const [error, setError] = useState<string>('');

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setAddress(e.target.value);
        getCoordinates(e.target.value);
    };

    const getCoordinates = async (address?: any) => {
        const apiKey = 'AIzaSyCnp8T1z8Jv9o5E3QfIhs25crKoiUZxlVU';
        const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;

        try {
            const response = await axios.get(url);
            if (response.data.status === 'OK') {
                const location = response.data.results[0].geometry.location;
                setCoordinates(location);
                setError('');
            } else {
                setError('Error fetching coordinates. Please try again.');
            }
        } catch (error) {
            setError('Error fetching coordinates. Please try again.');
        }
    };

    return (
        <div>
            <input type="text" id="inputtxt" className="form-control cont" aria-describedby="" placeholder='Find a Store or Spa' value={address} onChange={handleInputChange} />
        </div>
    );
};

export default Geocode;
