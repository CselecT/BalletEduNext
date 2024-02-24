"use client"
import Link from 'next/link'
import { usePathname } from 'next/navigation';
import React from 'react'
import { GiBallerinaShoes } from "react-icons/gi";
import classnames from 'classnames';
import { useSession } from 'next-auth/react';
import { Box } from "@radix-ui/themes";
import DarkModeButton from './components/DarkMode';

const NavBar = () => {
    const currentPath = usePathname();
    const { status, data: session } = useSession();
    const links = [
        { label: 'Profile', href: '/user/' + session?.user.id },
        // { label: 'Teachers', href: '/teacher' },
        // { label: 'Students', href: '/student' },
        // { label: 'Exams', href: '/exam' },
        // { label: 'Schools', href: '/school' },
        // { label: 'Juries', href: '/jury' }
    ];

    return (
        <nav className="flex space-x-6 border-b mb-5 px-5 h-14 items-center">
            <Link href="/"><GiBallerinaShoes color='pink' size='3em' /></Link>
            <ul className='flex space-x-5'>
                {links.map(link => <Link key={link.href}
                    className={classnames({
                        'link-accent': link.href !== currentPath
                    })}
                    // className={`${link.href === currentPath ? '' : 'link-accent'}`} 
                    href={link.href}>
                    {link.label}</Link>)}
                <DarkModeButton />
            </ul>
            <Box className='absolute right-10 '>
                {status === "authenticated" && (
                    <Link className='link-secondary' href="/api/auth/signout">Log out</Link>
                )}
                {status === "unauthenticated" && (
                    <Link className='link-secondary' href="/api/auth/signin">Login</Link>
                )}
            </Box>

        </nav>)
}

export default NavBar