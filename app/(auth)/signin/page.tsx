import ComponentsAuthLoginForm from '@/components/auth/components-auth-login-form';
import { Metadata } from 'next';
import React from 'react';
import Image from 'next/image';

export const metadata: Metadata = {
    title: 'Login Boxed',
};

const BoxedSignIn = () => {
    return (
        <div className="relative font-manrope">
            {/* Background image */}
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-sm" />
            </div>

            {/* Centered login card */}
            <div className="relative flex min-h-screen items-center justify-center px-4 sm:px-8">
                <div className="bg-white backdrop-blur-lg border border-white/30 shadow-2xl rounded-2xl p-10 w-full max-w-md">
                    <ComponentsAuthLoginForm />
                </div>
            </div>
        </div>
    );
};

export default BoxedSignIn;
