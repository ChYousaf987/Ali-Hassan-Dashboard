// scripts/createAdminUser.js
import { db } from '../config/firebase';
import { collection, addDoc } from 'firebase/firestore';
import bcrypt from 'bcryptjs';

const createAdminUser = async () => {
    const password = await bcrypt.hash('12345', 10);

    await addDoc(collection(db, 'users'), {
        email: 'alihassan@gmail.com',
        password,
    });

    console.log('Admin user created.');
};

createAdminUser();
