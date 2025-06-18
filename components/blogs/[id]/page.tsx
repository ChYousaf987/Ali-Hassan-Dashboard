'use client';

import { useEffect, useState } from 'react';
import { db } from '@/config/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useParams } from 'next/navigation';
import ClockLoader from '../../common/ClockLoader';

interface Blog {
    id: string;
    title: string;
    image: string | null; // Allow null for image
    value: string; // CKEditor outputs HTML string
    category: string;
    createdAt: any;
    userId: string;
}

export default function BlogDetail() {
    const params = useParams();
    const id = params?.id ? (Array.isArray(params.id) ? params.id[0] : params.id) : undefined;

    const [blog, setBlog] = useState<Blog | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) {
            setLoading(false);
            return;
        }

        const fetchBlog = async () => {
            try {
                const docRef = doc(db, 'blogs', id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setBlog({ id: docSnap.id, ...(docSnap.data() as Omit<Blog, 'id'>) });
                } else {
                    console.error('Blog not found');
                    setBlog(null);
                }
            } catch (error: any) {
                console.error('Error fetching blog:', error.message);
                setBlog(null);
            } finally {
                setLoading(false);
            }
        };

        fetchBlog();
    }, [id]);

    if (loading) return <ClockLoader />;
    if (!blog) return <p className="text-center">Blog not found.</p>;

    return (
        <div className="min-h-screen mx-auto p-6">
            {blog.image && <img src={blog.image} alt={blog.title} className="w-full h-64 object-cover rounded-md mb-4" />}
            <h1 className="text-3xl font-bold mb-4">{blog.title}</h1>
            <p className="text-sm italic text-gray-600 mb-2">{blog.category}</p>
            <p className="text-sm text-gray-500 mb-4">{formatDate(blog.createdAt)}</p>
            <div className="p-3">
                <div dangerouslySetInnerHTML={{ __html: blog.value }} className="w-full prose prose-lg" />
            </div>
        </div>
    );
}

function formatDate(timestamp: any): string {
    if (!timestamp || !timestamp.toDate) return 'No date available';
    const date = timestamp.toDate();
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}
