'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { authApi } from '@/lib/auth'
import { Spinner } from '@/components/common/Spinner'
import { Button } from '@/components/ui/Button'

export default function VerifyPage() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const token = searchParams.get('token')

    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
    const [message, setMessage] = useState('')

    useEffect(() => {
        if (!token) {
            setStatus('error')
            setMessage('Invalid verification link. Please request a new one.')
            return
        }

        const verifyEmail = async () => {
            try {
                const response = await authApi.verifyEmail(token)

                if (response.success) {
                    setStatus('success')
                    setMessage(response.message || 'Email verified successfully!')
                } else {
                    setStatus('error')
                    setMessage(response.message || 'Verification failed. Please try again.')
                }
            } catch (error) {
                setStatus('error')
                setMessage('Something went wrong. Please try again.')
            }
        }

        verifyEmail()
    }, [token])

    return (
        <main className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
            {/* Background Effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-violet-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
            </div>

            {/* Card */}
            <div className="relative w-full max-w-md">
                <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl text-center">
                    {status === 'loading' && (
                        <>
                            <div className="w-20 h-20 mx-auto mb-6 bg-white/5 rounded-full flex items-center justify-center">
                                <Spinner size="lg" />
                            </div>
                            <h1 className="text-2xl font-bold text-white mb-2">Verifying your email...</h1>
                            <p className="text-white/50">Please wait while we verify your email address.</p>
                        </>
                    )}

                    {status === 'success' && (
                        <>
                            <div className="w-20 h-20 mx-auto mb-6 bg-green-500/20 rounded-full flex items-center justify-center">
                                <CheckIcon className="w-10 h-10 text-green-400" />
                            </div>
                            <h1 className="text-2xl font-bold text-white mb-2">Email Verified!</h1>
                            <p className="text-white/50 mb-6">{message}</p>
                            <Button onClick={() => router.push('/login')} className="w-full" size="lg">
                                Continue to Login
                            </Button>
                        </>
                    )}

                    {status === 'error' && (
                        <>
                            <div className="w-20 h-20 mx-auto mb-6 bg-red-500/20 rounded-full flex items-center justify-center">
                                <XIcon className="w-10 h-10 text-red-400" />
                            </div>
                            <h1 className="text-2xl font-bold text-white mb-2">Verification Failed</h1>
                            <p className="text-white/50 mb-6">{message}</p>
                            <div className="space-y-3">
                                <Button onClick={() => router.push('/login')} className="w-full" size="lg">
                                    Go to Login
                                </Button>
                                <Link
                                    href="/resend-verification"
                                    className="block text-violet-400 hover:text-violet-300 text-sm transition-colors"
                                >
                                    Resend verification email
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </main>
    )
}

function CheckIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
    )
}

function XIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
    )
}
