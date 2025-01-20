import { useEffect, useState } from 'react';

export const useOrigin = (): string => {
    const [mounted, setMounted] = useState<boolean>(false); // Explicitly typed as boolean

    useEffect(() => {
        setMounted(true); // Set mounted to true after the component mounts
    }, []);

    if (!mounted) return ''; // Ensure the hook returns an empty string before mounting

    // Safely access window.location.origin
    const origin: string = typeof window !== 'undefined' ? window.location.origin : '';

    return origin; // Return the origin after mounting
};
