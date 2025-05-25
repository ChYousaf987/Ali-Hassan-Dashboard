'use client';
import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/config/firebase';
import { useRouter } from 'next/navigation';

export const LoginCheck = () => {
    const { push } = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!user) push('/signin');
        });

        return () => unsubscribe();
    }, [push]);

    return null;
};
