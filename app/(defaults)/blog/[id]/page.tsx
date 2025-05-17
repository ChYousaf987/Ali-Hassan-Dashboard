import BlogDetail from '@/components/detailsPage/details';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
    title: 'Blogs',
};

const DetailPage = () => {
    return <BlogDetail />
};

export default DetailPage;
