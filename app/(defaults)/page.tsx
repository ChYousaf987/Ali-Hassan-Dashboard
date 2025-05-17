import { BlogPage } from '@/components/blogs/blogs';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
    title: 'Blogs',
};

const Blogs = () => {
    return <BlogPage />
};

export default Blogs;
