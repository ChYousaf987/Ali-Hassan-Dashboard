'use client';
import { useEffect, useState } from 'react';
import { db } from '../../config/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useParams } from 'next/navigation';
import ClockLoader from '../common/ClockLoader';

interface Blog {
    id: string;
    title: string;
    image: string;
    value: any;
}

export default function BlogDetail() {
    // useParams returns Record<string, string | string[] | undefined>
    const params = useParams();
    // Safely extract `id` if it exists and is a string or string array
    const id = params?.id ? (Array.isArray(params.id) ? params.id[0] : params.id) : undefined;

    const [blog, setBlog] = useState<Blog | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;

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
            } catch (error) {
                console.error('Error fetching blog:', error);
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
            <img src={blog.image} alt={blog.title} className="w-full h-64 object-cover rounded-md mb-4" />
            <h1 className="text-3xl font-bold mb-4">{blog.title}</h1>
            <div className="p-3">
                <div dangerouslySetInnerHTML={{ __html: blog.value }} className="w-full" />
            </div>
        </div>
    );
}
