"use client"
import Link from 'next/link'
import { usePathname } from 'next/navigation';
import React from 'react'
import { GiBallerinaShoes } from "react-icons/gi";
import classnames from 'classnames';

const NavBar = () => {
    const currentPath = usePathname();
    const links = [
        { label: 'Teachers', href: '/teacher' },
        { label: 'Students', href: '/student' },
        { label: 'Exams', href: '/exam' },
        { label: 'Schools', href: '/school' },
        { label: 'Juries', href: '/jury' }];

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
            </ul>
        </nav>)
}

export default NavBar