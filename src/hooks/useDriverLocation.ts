import { useState, useEffect, useRef } from 'react';
import api from '../services/api';

interface LocationInfo {
    latitude: number;
    longitude: number;
    error: string | null;
}

export const useDriverLocation = (isActive: boolean) => {
    const [location, setLocation] = useState<LocationInfo>({
        latitude: 0,
        longitude: 0,
        error: null,
    });
    
    // Track if we have permissions and the interval ID
    const watchIdRef = useRef<number | null>(null);
    const intervalRef = useRef<number | null>(null);

    // Get ID dynamically from auth context/token if available, 
    // or backend will determine from Auth header for /driver/location
    const sendLocationUpdate = async (lat: number, lng: number) => {
        try {
            await api.post('/api/v1/driver/location', {
                latitude: lat,
                longitude: lng,
            });
        } catch (error) {
            console.error('Failed to send location update', error);
        }
    };

    useEffect(() => {
        // If not active (no deliveries out for delivery), ensure tracking is off
        if (!isActive) {
            if (watchIdRef.current !== null) {
                navigator.geolocation.clearWatch(watchIdRef.current);
                watchIdRef.current = null;
            }
            if (intervalRef.current !== null) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
            return;
        }

        if (!('geolocation' in navigator)) {
            setLocation(prev => ({ ...prev, error: 'Geolocation is not supported' }));
            return;
        }

        // Setup watch for immediate UI updates
        watchIdRef.current = navigator.geolocation.watchPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setLocation({ latitude, longitude, error: null });
            },
            (error) => {
                setLocation(prev => ({ ...prev, error: error.message }));
            },
            {
                enableHighAccuracy: true,
                maximumAge: 10000,
                timeout: 5000,
            }
        );

        // Setup 30-second interval for backend sync
        intervalRef.current = setInterval(() => {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    sendLocationUpdate(latitude, longitude);
                },
                (error) => {
                    console.error('Interval location error:', error);
                },
                { enableHighAccuracy: true }
            );
        }, 30000);

        // Send an initial update immediately
        navigator.geolocation.getCurrentPosition((position) => {
            sendLocationUpdate(position.coords.latitude, position.coords.longitude);
        });

        // Cleanup function
        return () => {
            if (watchIdRef.current !== null) {
                navigator.geolocation.clearWatch(watchIdRef.current);
            }
            if (intervalRef.current !== null) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isActive]);

    return location;
};
