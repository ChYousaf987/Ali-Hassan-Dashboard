'use client';

import { useEffect, useState } from 'react';
import { db } from '@/config/firebase';
import { collection, getDocs, updateDoc, doc, deleteDoc, Timestamp } from 'firebase/firestore';
import axios from 'axios';
import dynamic from 'next/dynamic';
import ClockLoader from '../common/ClockLoader';
import { showMessage } from '@/utils/notify/Alert';

import 'quill/dist/quill.snow.css';
import '../create/editor.css';

// Cloudinary config from .env
const CLOUDINARY_URL = process.env.NEXT_PUBLIC_CLOUDINARY_URL!;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;

// Define Option interface with only label and value for compatibility
interface Option {
    label: string;
    value: string;
}

// Minimal CustomSelect component implementation
interface CustomSelectProps {
    options: Option[];
    value: Option | null;
    onChange: (selected: Option | null) => void;
    placeholder?: string;
}
const CustomSelect = ({ options, value, onChange, placeholder }: CustomSelectProps) => {
    return (
        <select
            value={value?.value || ''}
            onChange={(e) => {
                const selectedValue = e.target.value;
                const selectedOption = options.find((opt) => opt.value === selectedValue) || null;
                onChange(selectedOption);
            }}
            className="border p-2 rounded w-full"
        >
            <option value="">{placeholder || 'Select...'}</option>
            {options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                    {opt.label}
                </option>
            ))}
        </select>
    );
};

// Dynamically import ReactQuill for rich text editing
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

export const BlogPage = () => {
    // Blog state
    const [blogs, setBlogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Edit modal state
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [selectedBlog, setSelectedBlog] = useState<any>(null);

    // Blog form fields
    const [title, setTitle] = useState('');
    const [value, setValue] = useState('');
    const [preview, setPreview] = useState<string | null>(null);
    const [image, setImage] = useState<File | null>(null);

    // Categories with updated type
    const [blogCategories, setBlogCategories] = useState<Option[]>([]);
    const [category, setCategory] = useState<Option | null>(null);
    const [newCategory, setNewCategory] = useState('');

    // Delete modal
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [blogToDelete, setBlogToDelete] = useState<any>(null);

    // Image modal
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [modalImage, setModalImage] = useState<string | null>(null);

    // Fetch categories function (simulate fetching or import your service)
    const fetchCategories = async (): Promise<Option[]> => {
        // Example fetch categories from Firestore 'categories' collection
        try {
            const querySnapshot = await getDocs(collection(db, 'categories'));
            return querySnapshot.docs.map((doc) => {
                const data = doc.data();
                return {
                    value: data.value || data.label || doc.id,
                    label: data.label || data.value || doc.id,
                };
            });
        } catch (error) {
            console.error('Error fetching categories:', error);
            return [];
        }
    };

    // Add category stub (implement your own logic or firestore write)
    const addCategory = async (newCat: string): Promise<Option> => {
        // For example, add to Firestore and return new Option
        // Here we just return dummy option for demo
        // Replace with actual addDoc logic
        return {
            label: newCat,
            value: newCat.toLowerCase().replace(/\s+/g, '-'),
        };
    };

    // Delete category stub (implement your own logic)
    const deleteCategory = async (id: string) => {
        // Implement your deletion logic here
        return;
    };

    useEffect(() => {
        if (isEditOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }, [isEditOpen]);

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        await fetchBlogs();
        const categories = await fetchCategories();
        setBlogCategories(categories);
    };

    const fetchBlogs = async () => {
        setLoading(true);
        try {
            const querySnapshot = await getDocs(collection(db, 'blogs'));
            let blogList = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            // Sort descending by createdAt timestamp
            blogList = blogList.sort((a: any, b: any) => (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0));

            setBlogs(blogList);
        } catch (error) {
            console.error('Error fetching blogs:', error);
        } finally {
            setLoading(false);
        }
    };

    // Handle image selection & preview
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    // Upload image to Cloudinary
    const uploadToCloudinary = async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', UPLOAD_PRESET);

        try {
            const res = await axios.post(CLOUDINARY_URL, formData);
            return res.data.secure_url;
        } catch (error: any) {
            console.error('Cloudinary upload error:', error?.response?.data || error.message);
            throw new Error('Image upload failed');
        }
    };

    // Open edit modal & fill form
    const handleUpdateInit = (blog: any) => {
        setSelectedBlog(blog);
        setTitle(blog.title || '');
        setValue(blog.value || '');
        setPreview(blog.image || null);
        setCategory(blog.category ? { value: blog.category, label: blog.category } : null);
        setImage(null);
        setIsEditOpen(true);
    };

    // Save blog updates
    const handleUpdate = async () => {
        if (!title || !value || !category) {
            showMessage('Please fill all fields and select a category.', 'error');
            return;
        }

        setLoading(true);
        try {
            let imageURL = preview;
            if (image) {
                imageURL = await uploadToCloudinary(image);
            }

            const blogRef = doc(db, 'blogs', selectedBlog.id);
            await updateDoc(blogRef, {
                title,
                value,
                image: imageURL,
                category: category.value,
                createdAt: Timestamp.now(),
            });

            showMessage('Blog updated successfully!', 'success');

            // Clear form & close modal
            setTitle('');
            setValue('');
            setImage(null);
            setPreview(null);
            setCategory(null);
            setIsEditOpen(false);

            // Refresh blogs
            fetchBlogs();
        } catch (error) {
            console.error('Error updating blog:', error);
            showMessage('Failed to update blog.', 'error');
        } finally {
            setLoading(false);
        }
    };

    // Delete blog confirmation + action
    const handleDelete = async (id: string) => {
        setIsDeleteModalOpen(false);
        setLoading(true);
        try {
            await deleteDoc(doc(db, 'blogs', id));
            setBlogs((prev) => prev.filter((b) => b.id !== id));
            showMessage('Blog deleted successfully!', 'success');
        } catch (error) {
            console.error('Error deleting blog:', error);
            showMessage('Failed to delete blog.', 'error');
        } finally {
            setLoading(false);
            setBlogToDelete(null);
        }
    };

    // Add new category to DB & state
    const handleAddCategory = async () => {
        if (!newCategory.trim()) return;

        try {
            const added = await addCategory(newCategory.trim());
            setBlogCategories((prev) => [...prev, added]);
            setNewCategory('');
        } catch (error) {
            showMessage('Failed to add category.', 'error');
        }
    };

    // Delete category from DB & state
    const handleDeleteCategory = async (id: string) => {
        try {
            await deleteCategory(id);
            setBlogCategories((prev) => prev.filter((c) => c.value !== id));
        } catch (error) {
            showMessage('Failed to delete category.', 'error');
        }
    };

    if (loading) return <ClockLoader />;

    return (
        <div className="min-h-[800px] mx-auto p-6 bg-gray-100 border rounded-lg max-w-7xl">
            <h2 className="text-2xl font-bold mb-6">Blogs</h2>

            {blogs.length === 0 ? (
                <p>No blogs found.</p>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {blogs.map((blog) => (
                        <div key={blog.id} className="bg-white p-4 rounded-lg shadow-md relative">
                            <img
                                src={blog.image}
                                alt={blog.title}
                                className="w-full h-48 object-cover rounded-md border mb-2 cursor-pointer hover:opacity-80 transition"
                                onClick={() => {
                                    setModalImage(blog.image);
                                    setIsImageModalOpen(true);
                                }}
                            />

                            <h3 className="text-lg font-semibold">{blog.title}</h3>
                            <p className="text-sm italic text-gray-600 mb-3">{blog.category}</p>

                            <div className="flex justify-end gap-2">
                                <button
                                    onClick={() => {
                                        setIsDeleteModalOpen(true);
                                        setBlogToDelete(blog);
                                    }}
                                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
                                >
                                    Delete
                                </button>
                                <button onClick={() => handleUpdateInit(blog)} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition">
                                    Edit
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Edit Modal */}
            {isEditOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50" onClick={() => setIsEditOpen(false)}>
                    <div className="bg-white p-6 rounded-lg max-w-2xl w-full relative" onClick={(e) => e.stopPropagation()}>
                        <h2 className="text-xl font-bold mb-4">Update Blog</h2>

                        <input className="w-full p-2 border rounded mb-4" type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />

                        <div className="mb-4">
                            <ReactQuill theme="snow" value={value} onChange={setValue} />
                        </div>

                        <div className="mb-4">
                            <CustomSelect options={blogCategories} value={category} onChange={(selected) => setCategory(selected)} placeholder="Select category" />
                            <div className="flex gap-2 mt-2">
                                <input type="text" className="border rounded p-1 flex-grow" placeholder="Add new category" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} />
                                <button onClick={handleAddCategory} className="bg-green-500 text-white px-4 rounded hover:bg-green-600 transition">
                                    Add
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {blogCategories.map((cat) => (
                                    <div key={cat.value} className="flex items-center gap-1 bg-gray-200 px-2 rounded">
                                        <span>{cat.label}</span>
                                        <button onClick={() => handleDeleteCategory(cat.value)} className="text-red-600 font-bold hover:text-red-800">
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="block mb-1">Image</label>
                            <input type="file" accept="image/*" onChange={handleImageUpload} />
                            {preview && <img src={preview} alt="Preview" className="mt-2 max-h-48 object-contain rounded" />}
                        </div>

                        <div className="flex justify-end gap-3">
                            <button onClick={() => setIsEditOpen(false)} className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 transition">
                                Cancel
                            </button>
                            <button onClick={handleUpdate} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            {isDeleteModalOpen && blogToDelete && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50" onClick={() => setIsDeleteModalOpen(false)}>
                    <div className="bg-white p-6 rounded-lg max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
                        <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
                        <p>
                            Are you sure you want to delete <strong>{blogToDelete.title}</strong>?
                        </p>
                        <div className="flex justify-end gap-3 mt-4">
                            <button onClick={() => setIsDeleteModalOpen(false)} className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 transition">
                                Cancel
                            </button>
                            <button onClick={() => handleDelete(blogToDelete.id)} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition">
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Image Modal */}
            {isImageModalOpen && modalImage && (
                <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50" onClick={() => setIsImageModalOpen(false)}>
                    <img src={modalImage} alt="Blog Large" className="max-w-full max-h-full rounded-lg shadow-lg cursor-pointer" onClick={(e) => e.stopPropagation()} />
                </div>
            )}
        </div>
    );
};
