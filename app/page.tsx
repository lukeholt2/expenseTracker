'use client';
import { useEffect } from "react";
import { useRouter } from 'next/navigation'
import { useSession } from "next-auth/react";

export default function Page() {
    const { status } = useSession({ required: true })
    const router = useRouter();

    useEffect(() => {
        if (status == 'authenticated') {
            router.push('/budget');
        }
    }, [status, router])
}