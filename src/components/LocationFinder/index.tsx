import { useState, useEffect } from 'react';

const LocationFinder: React.FC = () => {
    const [pincode, setPincode] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const getLocation = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    position => {
                        const { latitude, longitude } = position.coords;
                        fetch(`https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=AIzaSyAzRGDSc2A8z3VGt5YGzdOKZPaJDY_dBcQ`)
                            .then(response => response.json())
                            .then(data => {
                                const addressComponents = data.results[0].components;
                                const userPincode = addressComponents.postcode;
                                setPincode(userPincode);
                            })
                            .catch(error => {
                                setError('Error fetching location data');
                                console.error('Error fetching location data:', error);
                            });
                    },
                    error => {
                        setError('Error getting location');
                        console.error('Error getting location:', error);
                    }
                );
            } else {
                setError('Geolocation is not supported by this browser');
            }
        };

        getLocation();
    }, []);

    return (
        <div>
            {pincode ? (
                <p>Your pincode is: {pincode}</p>
            ) : (
                <p>{error ? error : 'Loading location...'}</p>
            )}
        </div>
    );
};

export default LocationFinder;
