"use client"
import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { FaMoon, FaSun } from 'react-icons/fa'
import { IoSunnyOutline, IoMoonOutline } from "react-icons/io5";

const DarkModeButton = () => {
    const [mounted, setMounted] = useState(false)
    const { theme, setTheme } = useTheme()

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return null
    }

    return (
        <button className='absolute right-1 ' onClick={e => theme === 'dark' ? setTheme('light') : setTheme('dark')}>
            {theme === 'dark' ? <IoMoonOutline size='25' /> : <IoSunnyOutline size='25' />}
        </button>
    )
}

export default DarkModeButton