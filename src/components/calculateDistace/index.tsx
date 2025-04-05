import React from 'react'

export default function calculateDistance(latTo: number, lngTo: number, latFrom: number, lngFrom: number) {
    const earthRadius = 6371; // Radius of the Earth in kilometers

    // Convert latitude and longitude from degrees to radians
    const latToRad = toRadians(latTo);
    const lngToRad = toRadians(lngTo);
    const latFromRad = toRadians(latFrom);
    const lngFromRad = toRadians(lngFrom);

    // Calculate the differences between latitudes and longitudes
    const latDiff = latFromRad - latToRad;
    const lngDiff = lngFromRad - lngToRad;

    // Calculate the Haversine distance
    const a = Math.sin(latDiff / 2) * Math.sin(latDiff / 2) +
        Math.cos(latToRad) * Math.cos(latFromRad) *
        Math.sin(lngDiff / 2) * Math.sin(lngDiff / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = earthRadius * c;

    return distance; // Distance in kilometers
}

function toRadians(degrees: any) {
    return degrees * (Math.PI / 180);
}

