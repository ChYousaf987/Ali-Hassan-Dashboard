'use client';

import { useState, useEffect } from 'react';
import { useQuill } from 'react-quilljs';
import 'quill/dist/quill.snow.css';
import { db } from '../../config/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, query, where } from 'firebase/firestore';
import { Timestamp } from 'firebase/firestore';
import axios from 'axios';
import './editor.css';
import { showMessage } from '@/utils/notify/Alert';
import ClockLoader from '../common/ClockLoader';
import { CustomSelect, Option } from './CustomSelect';

export const CreateBlogs = () => {
    const { quill, quillRef } = useQuill({
        theme: 'snow',
        modules: {
            toolbar: true,
        },
    });
    const [value, setValue] = useState('');
    const [preview, setPreview] = useState<string | null>(null);
    const [title, setTitle] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [category, setCategory] = useState<Option | null>(null);
    const [loading, setLoading] = useState(false);
    const [blogCategories, setBlogCategories] = useState<Option[]>([]);

    useEffect(() => {
        if (quill) {
            quill.on('text-change', () => {
                setValue(quill.root.innerHTML);
            });
        }
    }, [quill]);

    const fetchCategories = async (): Promise<Option[]> => {
        try {
            const querySnapshot = await getDocs(collection(db, 'categories'));
            const firestoreCategories = querySnapshot.docs.map((doc) => {
                const data = doc.data();
                return {
                    value: data.value || data.label || doc.id,
                    label: data.label || data.value || doc.id,
                };
            });
            return firestoreCategories;
        } catch (error) {
            console.error('Error fetching categories:', error);
            return [];
        }
    };

    const addCategory = async (newCat: string): Promise<Option> => {
        const newOption: Option = {
            label: newCat,
            value: newCat.toLowerCase().replace(/\s+/g, '-'),
        };
        try {
            if (!blogCategories.some((cat) => cat.value === newOption.value)) {
                await addDoc(collection(db, 'categories'), newOption);
                setBlogCategories((prev) => [...prev, newOption]);
            }
            return newOption;
        } catch (error) {
            console.error('Error adding category to Firestore:', error);
            return newOption;
        }
    };

    const deleteCategory = async (value: string) => {
        try {
            const blogsQuery = query(collection(db, 'blogs'), where('category', '==', value));
            const blogsSnapshot = await getDocs(blogsQuery);
            if (!blogsSnapshot.empty) {
                showMessage('Cannot delete category: it is used by one or more blogs.', 'error');
                return;
            }

            const categoryQuery = query(collection(db, 'categories'), where('value', '==', value));
            const categorySnapshot = await getDocs(categoryQuery);
            if (categorySnapshot.empty) {
                console.warn(`Category with value ${value} not found in Firestore`);
                return;
            }

            const categoryDoc = categorySnapshot.docs[0];
            await deleteDoc(doc(db, 'categories', categoryDoc.id));

            setBlogCategories((prev) => prev.filter((cat) => cat.value !== value));
            if (category?.value === value) {
                setCategory(null);
            }
            showMessage('Category deleted successfully!', 'success');
        } catch (error) {
            console.error('Error deleting category:', error);
            showMessage('Failed to delete category.', 'error');
        }
    };

    useEffect(() => {
        const loadCategories = async () => {
            setLoading(true);
            try {
                const categories = await fetchCategories();
                setBlogCategories(categories);
            } finally {
                setLoading(false);
            }
        };
        loadCategories();
    }, []);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setPreview(imageUrl);
            setImage(file);
        }
    };

    const handleCreate = async () => {
        if (!title || !value || !category || !image) {
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

            if (category && !blogCategories.some((cat) => cat.value === category.value)) {
                await addCategory(category.label);
            }

            await addDoc(collection(db, 'blogs'), {
                title,
                image: imageURL,
                value,
                category: category.value,
                createdAt: Timestamp.fromDate(new Date()),
            });

            showMessage('Blog created successfully!', 'success');

            setTitle('');
            setImage(null);
            setPreview(null);
            setValue('');
            setCategory(null);
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

                <CustomSelect
                    options={blogCategories}
                    value={category}
                    onChange={(selected) => setCategory(selected)}
                    label="Category"
                    placeholder="Select or type a category..."
                    onDeleteCategory={deleteCategory}
                />

                <div className="bg-white rounded-md shadow-sm overflow-hidden">
                    <div ref={quillRef} className="h-48 overflow-y-auto" />
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
