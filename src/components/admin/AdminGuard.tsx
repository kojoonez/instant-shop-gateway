import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { Loader2 } from "lucide-react"

export function AdminGuard() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/auth?redirect=/admin" replace />
  }

  const isAdmin = user.user_metadata?.is_admin === true

  if (!isAdmin) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
