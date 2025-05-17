import { CreateBlogs } from '@/components/create/create';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
    title: 'Create',
};

const Create = () => {
    return <CreateBlogs />
};

export default Create;
