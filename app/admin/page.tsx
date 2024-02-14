import { Button } from '@radix-ui/themes'
import Link from 'next/link'
import React from 'react'

const AdminPage = () => {
    return (
        <div className="max-w-xl h-full">
            <div className='flex flex-col content-between gap-4'>
                {(<Button><Link href='/user'>View Users</Link></Button>)}
                {(<Button><Link href='/user/new'>Create New Admin User</Link></Button>)}
                {(<Button><Link href='/school'>View Schools</Link></Button>)}
                {(<Button><Link href='/school/new'>Add School</Link></Button>)}
                {(<Button><Link href='/jury'>View Juries</Link></Button>)}
                {(<Button><Link href='/jury/new'>Add Jury</Link></Button>)}
            </div>
        </div>
    )
}

export default AdminPage