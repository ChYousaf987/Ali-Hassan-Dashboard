'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import 'react-quill/dist/quill.snow.css';
import { db } from '../../config/firebase';
import { collection, addDoc } from 'firebase/firestore';
import axios from 'axios';
import './editor.css';
import { showMessage } from '@/utils/notify/Alert';
import ClockLoader from '../common/ClockLoader';
import { CustomSelect } from './CustomSelect';
import type { ReactQuillProps } from 'react-quill';

const ReactQuill = dynamic(() => import('react-quill'), {
    ssr: false,
}) as unknown as React.FC<ReactQuillProps>;

interface CategoryOption {
    value: string;
    label: string;
}

export const CreateBlogs = () => {
    const [value, setValue] = useState('');
    const [preview, setPreview] = useState<string | null>(null);
    const [title, setTitle] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [category, setCategory] = useState<CategoryOption | null>({
        value: 'web-development',
        label: 'Web Development',
    });
    const [loading, setLoading] = useState(false);

    const blogCategories: CategoryOption[] = [
        { value: 'web-development', label: 'Web Development' },
        { value: 'mobile-development', label: 'Mobile Development' },
        { value: 'ai-ml', label: 'AI & Machine Learning' },
        { value: 'cybersecurity', label: 'Cybersecurity' },
        { value: 'cloud-computing', label: 'Cloud Computing' },
        { value: 'data-science', label: 'Data Science' },
        { value: 'programming', label: 'Programming' },
        { value: 'tech-news', label: 'Tech News' },
        { value: 'software-engineering', label: 'Software Engineering' },
        { value: 'gadgets', label: 'Gadgets & Reviews' },
        { value: 'gaming', label: 'Gaming' },
        { value: 'productivity', label: 'Productivity & Tools' },
        { value: 'entrepreneurship', label: 'Entrepreneurship' },
        { value: 'marketing', label: 'Digital Marketing' },
        { value: 'self-improvement', label: 'Self-Improvement' },
        { value: 'finance', label: 'Finance & Investing' },
        { value: 'lifestyle', label: 'Lifestyle & Wellness' },
    ];

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setPreview(imageUrl);
            setImage(file);
        }
    };

    const handleCreate = async () => {
        if (!title || !value || !category) {
            showMessage('Please Enter All The Fields.', 'error');
            return;
        }

        setLoading(true);

        try {
            let imageURL = '';

            if (image) {
                const CLOUDINARY_URL = process.env.NEXT_PUBLIC_CLOUDINARY_URL;
                const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

                if (!CLOUDINARY_URL || !UPLOAD_PRESET) {
                    console.error('Missing Cloudinary config:', { CLOUDINARY_URL, UPLOAD_PRESET });
                    showMessage('Cloudinary configuration is missing.', 'error');
                    setLoading(false);
                    return;
                }

                const formData = new FormData();
                formData.append('file', image);
                formData.append('upload_preset', UPLOAD_PRESET);

                const response = await axios.post(CLOUDINARY_URL, formData);
                imageURL = response.data.secure_url;
            }

            await addDoc(collection(db, 'blogs'), {
                title,
                image: imageURL,
                value,
                category: category.value,
                createdAt: new Date(),
            });

            showMessage('Blog created successfully!', 'success');

            setTitle('');
            setImage(null);
            setPreview(null);
            setValue('');
            setCategory({ value: 'web-development', label: 'Web Development' });
        } catch (error: any) {
            console.error('Error creating blog:', error?.response || error.message || error);
            showMessage('Failed to create blog.', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 py-10 px-4 sm:px-10">
            {loading && <ClockLoader />}
            <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-2xl p-8 space-y-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Create New Blog</h1>

                <input
                    type="text"
                    placeholder="Enter blog title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <CustomSelect options={blogCategories} value={category} onChange={(selected) => setCategory(selected)} label="Category" placeholder="Select or type a category..." />

                <div className="bg-white rounded-md shadow-sm overflow-hidden">
                    <ReactQuill theme="snow" value={value} onChange={setValue} className="h-48 overflow-y-auto" />
                </div>

                <div className="flex flex-col space-y-2">
                    <label className="text-gray-600 font-medium">Upload Image (optional)</label>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="p-2 border border-gray-300 rounded-md file:bg-blue-100 file:text-blue-700" />
                    {preview && <img src={preview} alt="Preview" className="mt-3 h-48 object-cover rounded-md border border-gray-300" />}
                </div>

                <button
                    onClick={handleCreate}
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg text-lg font-medium hover:bg-blue-700 transition duration-200 disabled:bg-blue-400"
                >
                    {loading ? 'Creating...' : 'Create Blog'}
                </button>
            </div>
        </div>
    );
};

export default CreateBlogs;
