import ProviderComponent from '@/components/layouts/provider-component';
import '../styles/tailwind.css';
import './global.css';
import { Metadata } from 'next';
import { Manrope, Barlow } from 'next/font/google';
import f from "../public/favicon.ico"

export const metadata: Metadata = {
    title: {
        template: '%s | AliHassan',
        default: 'AliHassan - Admin Dashboard',
    }
};

const manrope = Manrope({
    subsets: ['latin'],
    weight: ['400', '600', '700', '800'],

    variable: '--font-manrope',
});
const barlow = Barlow({
    subsets: ['latin'],
    weight: ['400', '600', '700', '800', '900'],
    variable: '--font-barlow',
});
export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className={`${manrope.variable} bg-white font-manrope  ${barlow.variable}`}>
                {' '}
                <ProviderComponent>{children}</ProviderComponent>
            </body>
        </html>
    );
}
