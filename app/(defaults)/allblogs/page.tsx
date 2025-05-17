import BlogList from '@/components/allblogs/allblogs';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
    title: 'Blogs',
};

const AllBlogs = () => {
    return <BlogList />
};

export default AllBlogs;
