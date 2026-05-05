import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Users,
  ClipboardList,
  MessageCircle,
  UserPlus,
  ArrowUpRight,
  Loader2,
} from "lucide-react"
import { supabase } from "@/integrations/supabase/client"
import { Link } from "react-router-dom"

type DashboardStats = {
  waitlistCount: number
  businessAppsCount: number
  creatorAppsCount: number
  pendingAppsCount: number
  conversationsCount: number
  activeConversationsCount: number
  totalUsers: number
  recentWaitlist: { email: string; segment: string; country: string; date: string }[]
}

export function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const [
        waitlistRes,
        businessAppsRes,
        creatorAppsRes,
        pendingBusinessRes,
        pendingCreatorRes,
        convosRes,
        activeConvosRes,
        usersRes,
        recentWaitlistRes,
      ] = await Promise.all([
        supabase.from("waitlist_signups").select("id", { count: "exact", head: true }),
        supabase.from("business_applications").select("id", { count: "exact", head: true }),
        supabase.from("creator_applications").select("id", { count: "exact", head: true }),
        supabase.from("business_applications").select("id", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("creator_applications").select("id", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("conversations").select("id", { count: "exact", head: true }),
        supabase.from("conversations").select("id", { count: "exact", head: true }).eq("status", "active"),
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("waitlist_signups").select("email, segment, country_name, created_at").order("created_at", { ascending: false }).limit(5),
      ])

      setStats({
        waitlistCount: waitlistRes.count || 0,
        businessAppsCount: businessAppsRes.count || 0,
        creatorAppsCount: creatorAppsRes.count || 0,
        pendingAppsCount: (pendingBusinessRes.count || 0) + (pendingCreatorRes.count || 0),
        conversationsCount: convosRes.count || 0,
        activeConversationsCount: activeConvosRes.count || 0,
        totalUsers: usersRes.count || 0,
        recentWaitlist: (recentWaitlistRes.data || []).map((r) => ({
          email: r.email,
          segment: r.segment,
          country: r.country_name || r.segment,
          date: new Date(r.created_at).toLocaleDateString(),
        })),
      })
    } catch (err) {
      console.error("Failed to load dashboard stats:", err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your platform activity.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Waitlist Signups</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.waitlistCount || 0}</div>
            <p className="text-xs text-muted-foreground">
              Businesses, users, and drivers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Applications</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.pendingAppsCount || 0}</div>
            <p className="text-xs text-muted-foreground">
              Pending review ({stats?.businessAppsCount || 0} business, {stats?.creatorAppsCount || 0} creator)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversations</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.activeConversationsCount || 0}</div>
            <p className="text-xs text-muted-foreground">
              Active ({stats?.conversationsCount || 0} total)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Registered Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
            <p className="text-xs text-muted-foreground">
              With profiles
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Waitlist</CardTitle>
            <CardDescription>Latest signups</CardDescription>
          </CardHeader>
          <CardContent>
            {stats?.recentWaitlist.length === 0 ? (
              <p className="text-sm text-muted-foreground">No signups yet.</p>
            ) : (
              <div className="space-y-3">
                {stats?.recentWaitlist.map((entry, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <div>
                      <p className="font-medium">{entry.email}</p>
                      <p className="text-xs text-muted-foreground">{entry.country}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">{entry.segment}</Badge>
                  </div>
                ))}
              </div>
            )}
            <Button asChild variant="ghost" size="sm" className="w-full mt-4">
              <Link to="/admin/waitlist">
                View all <ArrowUpRight className="ml-1 h-3 w-3" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Pending Applications</CardTitle>
            <CardDescription>Needs your review</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Business applications</span>
              <Badge>{stats?.businessAppsCount || 0}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Creator applications</span>
              <Badge>{stats?.creatorAppsCount || 0}</Badge>
            </div>
            <Button asChild variant="ghost" size="sm" className="w-full mt-4">
              <Link to="/admin/applications">
                Review applications <ArrowUpRight className="ml-1 h-3 w-3" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Support Messages</CardTitle>
            <CardDescription>Customer conversations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Active conversations</span>
              <Badge variant="secondary">{stats?.activeConversationsCount || 0}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Total conversations</span>
              <span className="text-sm text-muted-foreground">{stats?.conversationsCount || 0}</span>
            </div>
            <Button asChild variant="ghost" size="sm" className="w-full mt-4">
              <Link to="/admin/messages">
                Open messages <ArrowUpRight className="ml-1 h-3 w-3" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
