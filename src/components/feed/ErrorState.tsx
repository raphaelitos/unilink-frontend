"use client"

import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ErrorStateProps {
  message: string
}

export function ErrorState({ message }: ErrorStateProps) {
  const handleRetry = () => {
    window.location.reload()
  }

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="rounded-full bg-destructive/10 p-6 mb-4">
        <AlertCircle className="h-12 w-12 text-destructive" />
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-2">Something went wrong</h3>
      <p className="text-muted-foreground max-w-md mb-6">{message}</p>
      <Button onClick={handleRetry} variant="outline">
        Try again
      </Button>
    </div>
  )
}
