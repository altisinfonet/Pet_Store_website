import { GoogleMap, Marker, LoadScript } from '@react-google-maps/api';
import Image from 'next/image';

interface Store {
    name: string;
    lat: number;
    lng: number;
}

interface MapProps {
    stores: Store[];
    latitudeTo?: number;
    longitudeTo?: number;
    locationId?: string;
    loading?: boolean
}

const Map: React.FC<MapProps> = ({ stores, latitudeTo, longitudeTo, locationId, loading }: any) => {
    return (
        <LoadScript googleMapsApiKey="AIzaSyAzRGDSc2A8z3VGt5YGzdOKZPaJDY_dBcQ">
            <GoogleMap
                mapContainerStyle={{ width: '100%', height: '400px' }}
                center={{ lat: latitudeTo, lng: longitudeTo }}
                zoom={9}
                options={{
                    restriction: {
                        latLngBounds: {
                            north: 35.513327, // Northernmost point of India
                            south: 6.462700,  // Southernmost point of India
                            west: 68.109700,  // Westernmost point of India
                            east: 97.395358,  // Easternmost point of India
                        },
                        strictBounds: true, // Disables panning outside the restricted area
                    },
                }}
            >
                <Marker position={{ lat: latitudeTo, lng: longitudeTo }} />
                {!loading && stores?.length
                    ? stores.map((store: any, index: number) => (
                        <Marker
                            key={index}
                            animation={store?.id === locationId ? 1 : undefined}
                            icon={"/assets/icon/pin-custom.png"}
                            position={{ lat: +store?.latitude, lng: +store?.longitude }}
                            title={store.name}
                        />
                    ))
                    : "Loading..."}
            </GoogleMap>
        </LoadScript>

    );
};

export default Map;
