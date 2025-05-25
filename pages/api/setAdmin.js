import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
// import serviceAccount from '../../config/serviceAccountKey.json'; // Adjust path based on your structure

if (!getApps().length) {
    initializeApp({
        credential: cert(serviceAccount),
    });
}

export default async function handler(req, res) {
    const { email } = req.body;
    try {
        const user = await getAuth().getUserByEmail(email);
        await getAuth().setCustomUserClaims(user.uid, { isAdmin: true });
        res.status(200).json({ message: 'Admin claim set' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
