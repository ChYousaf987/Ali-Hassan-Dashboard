// utils/LoginCheck.tsx
'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export const LoginCheck = () => {
    const { push } = useRouter();

    useEffect(() => {
        const raw = localStorage.getItem('token');
        const token = raw ? JSON.parse(raw) : null;

        if (!token || token.expiresIn < Date.now()) {
            push('/signin');
        }
    }, [push]);

    return null;
};
