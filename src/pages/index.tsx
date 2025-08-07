// src/pages/index.tsx
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">
            Welcome
          </h1>
          <p className="text-gray-600 text-lg">
            Get started with your account
          </p>
        </div>
        
        <div className="space-y-4">
          <Link href="/login" className="block">
            <Button className="w-full bg-primary hover:bg-primary/90 text-white">
              Sign In
            </Button>
          </Link>
          
          <p className="text-sm text-gray-500">
            New here? Create an account to get started
          </p>
        </div>
      </div>
    </div>
  )
}