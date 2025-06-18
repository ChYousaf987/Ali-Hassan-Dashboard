'use client';

import { useEffect, useState } from 'react';
import { db } from '@/config/firebase';
import { collection, getDocs, updateDoc, doc, deleteDoc, addDoc, Timestamp } from 'firebase/firestore';
import axios from 'axios';
import { useQuill } from 'react-quilljs'; // Replace react-quill with react-quilljs
import 'quill/dist/quill.snow.css';
import '../create/editor.css';
import ClockLoader from '../common/ClockLoader';
import { showMessage } from '@/utils/notify/Alert';
import CreatableSelect from 'react-select/creatable';

const CLOUDINARY_URL = process.env.NEXT_PUBLIC_CLOUDINARY_URL!;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;

interface Option {
    label: string;
    value: string;
}

interface CustomSelectProps {
    options: Option[];
    value: Option | null;
    onChange: (selected: Option | null) => void;
    placeholder?: string;
    label?: string;
    disabled?: boolean;
}

const CustomSelect: React.FC<CustomSelectProps> = ({ onChange, value, options, label, placeholder, disabled }) => {
    const handleCreateOption = (inputValue: string) => {
        const newOption: Option = {
            value: inputValue.toLowerCase().replace(/\s+/g, '-'),
            label: inputValue,
        };
        onChange(newOption);
    };

    return (
        <div className="flex flex-col">
            {label && (
                <label htmlFor="category" className="font-semibold text-[0.8rem] text-neutral-500 w-full">
                    {label}
                </label>
            )}
            <CreatableSelect
                options={options}
                isDisabled={disabled}
                onChange={onChange}
                onCreateOption={handleCreateOption}
                isSearchable
                value={value}
                placeholder={placeholder}
                classNames={{
                    option: (state) => `py-2 px-4 cursor-pointer rounded-md ${state.isFocused ? 'bg-neutral-100' : ''} ${state.isSelected ? 'bg-blue-100 text-blue-700' : ''}`,
                    control: () => 'text-[0.9rem] font-manrope',
                    menu: () => 'bg-white rounded-md shadow-lg',
                }}
                styles={{
                    control: (baseStyles, state) => ({
                        ...baseStyles,
                        border: '1px solid #11111133',
                        borderRadius: '12px',
                        padding: '0.5rem 0.75rem',
                        backgroundColor: state.isDisabled ? '#f5f5f5' : 'white',
                        color: state.isDisabled ? '#B3B0B0' : '#0E1726',
                        boxShadow: state.isFocused ? '0 0 0 2px rgba(59, 130, 246, 0.5)' : 'none',
                        '&:hover': {
                            borderColor: '#3b82f6',
                        },
                    }),
                    menu: (baseStyles) => ({
                        ...baseStyles,
                        zIndex: 9999,
                        marginTop: '4px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '10px',
                        backgroundColor: 'white',
                    }),
                    menuList: (baseStyles) => ({
                        ...baseStyles,
                        padding: '8px',
                        maxHeight: '200px',
                        overflowY: 'auto',
                    }),
                    option: (baseStyles) => ({
                        ...baseStyles,
                        fontSize: '0.9rem',
                        color: '#0E1726',
                    }),
                    placeholder: (baseStyles) => ({
                        ...baseStyles,
                        fontSize: '0.8rem',
                        color: '#B0B0B0',
                        fontFamily: 'Manrope, sans-serif',
                    }),
                }}
            />
        </div>
    );
};

// Helper function to format Firebase Timestamp
const formatDate = (timestamp: any): string => {
    if (!timestamp || !timestamp.toDate) return 'No date available';
    const date = timestamp.toDate();
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

export const BlogPage = () => {
    const [blogs, setBlogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [isEditOpen, setIsEditOpen] = useState(false);
    const [selectedBlog, setSelectedBlog] = useState<any>(null);

    const [title, setTitle] = useState('');
    const [value, setValue] = useState('');
    const [preview, setPreview] = useState<string | null>(null);
    const [image, setImage] = useState<File | null>(null);

    const [blogCategories, setBlogCategories] = useState<Option[]>([
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
    ]);
    const [category, setCategory] = useState<Option | null>(null);
    const [newCategory, setNewCategory] = useState('');

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [blogToDelete, setBlogToDelete] = useState<any>(null);

    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [modalImage, setModalImage] = useState<string | null>(null);

    // Initialize Quill editor
    const { quill, quillRef } = useQuill({
        theme: 'snow',
        modules: {
            toolbar: true,
        },
    });

    // Sync Quill content with state
    useEffect(() => {
        if (quill) {
            quill.on('text-change', () => {
                setValue(quill.root.innerHTML);
            });
            // Set initial content when editing
            if (selectedBlog && isEditOpen) {
                quill.root.innerHTML = selectedBlog.value || '';
            }
        }
    }, [quill, selectedBlog, isEditOpen]);

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
            const mergedCategories = [...blogCategories, ...firestoreCategories.filter((fc) => !blogCategories.some((bc) => bc.value === fc.value))];
            return mergedCategories;
        } catch (error) {
            console.error('Error fetching categories:', error);
            return blogCategories;
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

    const deleteCategory = async (id: string) => {
        // Implement Firestore deletion if needed
        return;
    };

    useEffect(() => {
        if (isEditOpen) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = 'auto';
    }, [isEditOpen]);

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        setLoading(true);
        try {
            await fetchBlogs();
            const categories = await fetchCategories();
            setBlogCategories(categories);
        } finally {
            setLoading(false);
        }
    };

    const fetchBlogs = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'blogs'));
            let blogList = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            blogList = blogList.sort((a: any, b: any) => (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0));
            setBlogs(blogList);
        } catch (error) {
            console.error('Error fetching blogs:', error);
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

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

    const handleUpdateInit = async (blog: any) => {
        console.log('Blog category:', blog.category);
        let categories = blogCategories;
        if (categories.length === 0) {
            categories = await fetchCategories();
            setBlogCategories(categories);
        }
        console.log('Available categories:', categories);

        setSelectedBlog(blog);
        setTitle(blog.title || '');
        setValue(blog.value || '');
        setPreview(blog.image || null);
        setImage(null);

        const blogCategoryValue = blog.category?.toLowerCase()?.replace(/\s+/g, '-') || '';
        const foundCategory = categories.find((c) => c.value.toLowerCase() === blogCategoryValue || c.label.toLowerCase() === blogCategoryValue);

        console.log('Found category:', foundCategory);
        setCategory(foundCategory || (blog.category ? { value: blogCategoryValue, label: blog.category } : null));

        setIsEditOpen(true);
    };

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

            setTitle('');
            setValue('');
            setImage(null);
            setPreview(null);
            setCategory(null);
            setIsEditOpen(false);

            fetchBlogs();
        } catch (error) {
            console.error('Error updating blog:', error);
            showMessage('Failed to update blog.', 'error');
        } finally {
            setLoading(false);
        }
    };

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
                            <p className="text-sm italic text-gray-600 mb-1">{blog.category}</p>
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-gray-500"> {formatDate(blog.createdAt)}</p>

                                <div className="flex gap-3">
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
                        </div>
                    ))}
                </div>
            )}

            {/* Edit Modal */}
            {isEditOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50" onClick={() => setIsEditOpen(false)}>
                    <div className="bg-white p-6 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto relative" onClick={(e) => e.stopPropagation()}>
                        <h2 className="text-xl font-bold mb-4">Update Blog</h2>

                        {/* Title */}
                        <input className="w-full p-2 border rounded mb-4" type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />

                        {/* Rich Text Editor */}
                        <div className="mb-4">
                            <div ref={quillRef} className="h-48 overflow-y-auto" />
                        </div>

                        {/* Category Selector */}
                        <div className="mb-4">
                            <CustomSelect options={blogCategories} value={category} onChange={(selected) => setCategory(selected)} label="Category" placeholder="Select or type a category..." />
                        </div>

                        {/* Image Upload */}
                        <div className="mb-4">
                            <label className="block mb-1">Image</label>
                            <input type="file" accept="image/*" onChange={handleImageUpload} />
                            {preview && <img src={preview} alt="Preview" className="mt-2 max-h-48 object-contain rounded" />}
                        </div>

                        {/* Action Buttons */}
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
