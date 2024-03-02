'use client'
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation'
import { useEffect } from 'react';
import Link from 'next/link'

export default function Home() {
  const { status, data: session } = useSession();
  const router = useRouter();
  useEffect(() => {
    if (status === "authenticated" && session && session.user.role === "SCHOOL" && session?.user.schoolId !== null) {
      router.push('/school/' + session?.user.schoolId);
      router.refresh();
    }
    else if (status === "authenticated" && session && session.user.role === "JURY" && session?.user.juryId !== null) {
      router.push('/jury/' + session?.user.juryId);
      router.refresh();
    }
    else if (status === "authenticated" && session && session.user.role === "ADMIN") {
      router.push('/admin/' + session?.user.id);
      router.refresh();
    }
  }, [status, session]);
  console.log(status, session);
  return (
    <main className="h-full">
      
      {status !== 'authenticated' && <h2 className="mt-6 text-center text-3xl font-extrabold text-pink-400">
        Welcome! Please  {<Link className='link-accent' href={'/api/auth/signin'}> Log In !</Link>}
      </h2>}
      
    </main>
  )
}
