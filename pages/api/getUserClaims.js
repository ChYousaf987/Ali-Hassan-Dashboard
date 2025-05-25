import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import serviceAccount from '../../config/serviceAccountKey.json'; // Adjust path based on your structure

if (!getApps().length) {
    initializeApp({
        credential: cert(serviceAccount),
    });
}

export default async function handler(req, res) {
    const { email } = req.body;
    try {
        const user = await getAuth().getUserByEmail(email);
        const customClaims = (await getAuth().getUser(user.uid)).customClaims;
        res.status(200).json({ customClaims });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
