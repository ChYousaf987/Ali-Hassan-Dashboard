'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa6';

const ComponentsAuthLoginForm = () => {
    const { push } = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const ADMIN_EMAIL = 'alihassan@gmial.com';
    const ADMIN_PASSWORD = 'admin123';

    const handleSubmit = () => {
        if (email !== ADMIN_EMAIL) {
            alert('Invalid Email');
            return;
        }

        if (password !== ADMIN_PASSWORD) {
            alert('Invalid Password');
            return;
        }

        localStorage.setItem(
            'token',
            JSON.stringify({
                token: 'admin-token',
                expiresIn: Date.now() + 3 * 24 * 60 * 60 * 1000,
            }),
        );

        alert('Logged in successfully!');
        push('/');
    };

    return (
        <div className="">
            <h2 className="text-3xl font-bold text-center mb-8">Admin Login</h2>

            <div className="mb-5">
                <label className="text-sm block mb-1 font-medium">Email</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-4 py-2 rounded-lg border border-black focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
            </div>

            <div className="mb-6">
                <label className="text-sm block mb-1 font-medium">Password</label>
                <div className="flex items-center  border border-black rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-400">
                    <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="w-full px-4 py-2 bg-transparent   focus:outline-none"
                    />
                    <button type="button" onClick={() => setShowPassword((prev) => !prev)} className="px-3 ">
                        {showPassword ? <FaRegEye size={18} /> : <FaRegEyeSlash size={18} />}
                    </button>
                </div>
            </div>

            <button onClick={handleSubmit} className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition duration-200">
                Log In
            </button>
        </div>
    );
};

export default ComponentsAuthLoginForm;
