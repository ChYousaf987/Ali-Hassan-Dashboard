'use client';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { IRootState } from '@/store';
import { toggleSidebar } from '@/store/themeConfigSlice';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { showMessage } from '@/utils/notify/Alert';
import Cookies from 'js-cookie';
import { FaChevronRight } from 'react-icons/fa6';

const Header = () => {
    const pathname = usePathname();
    const dispatch = useDispatch();
    const router = useRouter()


    useEffect(() => {
        const selector = document.querySelector('ul.horizontal-menu a[href="' + window.location.pathname + '"]');
        if (selector) {
            const all: any = document.querySelectorAll('ul.horizontal-menu .nav-link.active');
            for (let i = 0; i < all.length; i++) {
                all[0]?.classList.remove('active');
            }

            let allLinks = document.querySelectorAll('ul.horizontal-menu a.active');
            for (let i = 0; i < allLinks.length; i++) {
                const element = allLinks[i];
                element?.classList.remove('active');
            }
            selector?.classList.add('active');

            const ul: any = selector.closest('ul.sub-menu');
            if (ul) {
                let ele: any = ul.closest('li.menu').querySelectorAll('.nav-link');
                if (ele) {
                    ele = ele[0];
                    setTimeout(() => {
                        ele?.classList.add('active');
                    });
                }
            }
        }
    }, [pathname]);

    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl';

    const themeConfig = useSelector((state: IRootState) => state.themeConfig);

    const handleSignOut = async () => {
        showMessage('Logged out successfully', 'success');
        clearAllCookies();
        setTimeout(() => {
            router.push('/signin');
        }, 1000);
    };
    const cookiesToClear = ['chordnetAuthToken', 'chordnetUserName', "chordnetUseremail", "chordnetProfileImage", "chordnetRole"];

    function clearAllCookies(): void {
        cookiesToClear?.forEach((cookieName) => {
            if (Cookies?.get(cookieName)) {
                Cookies?.remove(cookieName, {});
            }
        });
    }

    return (
        <header className={`z-40 ${themeConfig.semidark && themeConfig.menu === 'horizontal' ? 'dark' : ''}`}>
            <div className="shadow-sm">
                <div className="relative flex w-full items-center bg-white px-5 py-2.5 dark:bg-black">
                    <div className="horizontal-logo flex items-center justify-between ltr:mr-2 rtl:ml-2 lg:hidden">
                        <Link href="/" className="main-logo flex shrink-0 items-center">
                          
                        </Link>
                        <button
                            type="button"
                            className="collapse-icon flex flex-none rounded-full p-2 hover:bg-white-light/90 hover:text-primary-800 ltr:ml-2 rtl:mr-2 dark:bg-dark/40 dark:text-[#d0d2d6] dark:hover:bg-dark/60 dark:hover:text-primary-800 lg:hidden"
                            onClick={() => dispatch(toggleSidebar())}
                        >
                            <FaChevronRight />
                        </button>
                    </div>

                    <div className="flex items-center space-x-1.5 ltr:ml-auto rtl:mr-auto rtl:space-x-reverse dark:text-[#d0d2d6] sm:flex-1 ltr:sm:ml-0 sm:rtl:mr-0 lg:space-x-2 justify-end">
                        <div className="dropdown flex shrink-0">
                        
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
