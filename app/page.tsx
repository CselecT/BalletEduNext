'use client'
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation'
import { useEffect } from 'react';

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
      router.push('/admin');
      router.refresh();
    }
  }, [status, session]);
  return (
    <main className="h-full">
      <h1>Welcome</h1>
    </main>
  )
}
