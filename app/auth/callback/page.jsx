'use client'
 
import { useSearchParams } from 'next/navigation'
import { Suspense, useEffect } from 'react'
 
function Callback() {
  const searchParams = useSearchParams();
  useEffect(() => {
    localStorage.setItem('token', searchParams.get('token'));
    window.location.href = '/speaking'
    return null;
  })
}
 
export default function AuthCallback() {
  return (
    // You could have a loading skeleton as the `fallback` too
    <Suspense>
      <Callback />
    </Suspense>
  )
}