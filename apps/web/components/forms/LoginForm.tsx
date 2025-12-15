'use client'

import { useState, FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button, Input } from '@/components/ui'
import { useLogin } from '@/hooks/useAuth'
import { authApi } from '@/lib/auth'

interface LoginFormProps {
    onSuccess?: () => void
}

export function LoginForm({ onSuccess }: LoginFormProps) {
    const router = useRouter()
    const { login, isLoading, error } = useLogin()

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    })
    const [formErrors, setFormErrors] = useState<Record<string, string>>({})

    const validateForm = () => {
        const errors: Record<string, string> = {}

        if (!formData.email) {
            errors.email = 'Email is required'
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = 'Please enter a valid email'
        }

        if (!formData.password) {
            errors.password = 'Password is required'
        }

        setFormErrors(errors)
        return Object.keys(errors).length === 0
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()

        if (!validateForm()) return

        const result = await login(formData)

        if (result.success) {
            onSuccess?.()
            router.push('/')
        }
    }

    const handleGoogleLogin = () => {
        window.location.href = authApi.getGoogleAuthUrl()
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error Alert */}
            {error && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                    {error}
                </div>
            )}

            {/* Email */}
            <Input
                label="Email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                error={formErrors.email}
                leftIcon={<MailIcon />}
            />

            {/* Password */}
            <Input
                label="Password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                error={formErrors.password}
                leftIcon={<LockIcon />}
            />

            {/* Forgot Password Link */}
            <div className="flex justify-end">
                <Link
                    href="/forgot-password"
                    className="text-sm text-violet-400 hover:text-violet-300 transition-colors"
                >
                    Forgot password?
                </Link>
            </div>

            {/* Submit Button */}
            <Button
                type="submit"
                isLoading={isLoading}
                className="w-full"
                size="lg"
            >
                Sign In
            </Button>

            {/* Divider */}
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-slate-900 text-white/40">Or continue with</span>
                </div>
            </div>

            {/* Google Login */}
            <Button
                type="button"
                variant="secondary"
                className="w-full"
                size="lg"
                onClick={handleGoogleLogin}
                leftIcon={<GoogleIcon />}
            >
                Google
            </Button>

            {/* Register Link */}
            <p className="text-center text-white/50 text-sm">
                Don&apos;t have an account?{' '}
                <Link
                    href="/register"
                    className="text-violet-400 hover:text-violet-300 font-medium transition-colors"
                >
                    Sign up
                </Link>
            </p>
        </form>
    )
}

// Icons
function MailIcon() {
    return (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
    )
}

function LockIcon() {
    return (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
    )
}

function GoogleIcon() {
    return (
        <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
        </svg>
    )
}
