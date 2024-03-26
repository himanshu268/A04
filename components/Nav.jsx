"use client";
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import { signIn, signOut, useSession, getProviders } from 'next-auth/react';

const Nav = () => {
    const router = useRouter();
    const { data: session } = useSession();
    const [providers, setproviders] = useState(null);
    const [toggleDropdown, settoggleDropdown] = useState(false)
            useEffect(() => {
                if (!session) {
                    // If session is null (user is not authenticated), redirect to main page
                    router.push('/');
                  }
            const setUpproviders = async () => {
                const response = await getProviders();
                setproviders(response);
            }
            setUpproviders();
        
    },[session, router]);
    const handleLogout = async () => {
        await signOut(); // Sign out the user
        router.push('/'); // Redirect to main page
    };
                return (
            <nav className="flex-between w-full mb-16 pt-3">
                <Link href="/" className="flex gap-2 flex-center">
                    <Image src="/assets/images//o4.svg" alt="promptopia Logo" width={80} height={80} className="object-contain" />
                    <p className="logo_text">Arcane04</p>
                </Link>
                {/* Desktop navigation */}
                <div className="sm:flex hidden">
                    {session?.user ? (
                        <div className="flex gap-3 md:gap-5">
                            <Link href="/create-prompt" className="black_btn">
                                Create post
                            </Link>
                            <button type="button" onClick={handleLogout} className="outline_btn">Sign out</button>
                            <Link href="/profile">
                                <Image src={session?.user.image} alt="Profile" width={37} height={37} className="rounded-full" />
                            </Link>
                        </div>
                    ) : (
                        <>
                            {providers &&
                                Object.values(providers).map((provider) => (
                                    <button type="button" key={provider.name} onClick={() => signIn(provider.id)}
                                        className='black_btn'>
                                        sign In

                                    </button>
                                ))}
                        </>
                    )}
                </div>
                {/* mobile navigation */}
                <div className="sm:hidden flex relative">
                    {session?.user ? (
                        <div className="flex">
                            <Image src={session?.user.image} alt="Profile" width={37} height={37} className="rounded-full" onClick={()=>settoggleDropdown((prev)=>!prev)} />
                            {toggleDropdown && (
                                <div className="dropdown">
                                    <Link href="/profile" className="dropdown_link"
                                        onClick={()=>settoggleDropdown(false)}>
                                        my profile
                                    </Link>
                                    <Link href="/profile" className="dropdown_link"
                                        onClick={()=>settoggleDropdown(false)}>
                                        create prompt
                                    </Link>
                                    <button type="button" className="mt-5 w-full black_btn"onClick={handleLogout}
                                        
                                    >sign out</button>
                                </div>
                            )}


                        </div>
                    ) : (
                        <>
                            {providers &&
                                Object.values(providers).map((provider) => (
                                    <button type="button" key={provider.name} onClick={() => signIn(provider.id)}
                                        className='black_btn'>
                                        sign In

                                    </button>
                                ))}
                        </>
                    )}
                </div>
            </nav>
        )
    }

    export default Nav