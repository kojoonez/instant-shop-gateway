import { useEffect, useState } from "react"
import { supabase } from "@/integrations/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Loader2, Search, UserRound } from "lucide-react"

type UserProfile = {
  id: string
  user_id: string
  display_name: string | null
  phone: string | null
  address: Record<string, unknown> | null
  preferences: Record<string, unknown> | null
  created_at: string
  updated_at: string
  email?: string
}

export function UsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false })

    if (!error && data) {
      setUsers(data)
    }
    setLoading(false)
  }

  const filtered = users.filter((u) => {
    const q = search.toLowerCase()
    return (
      (u.display_name || "").toLowerCase().includes(q) ||
      (u.email || "").toLowerCase().includes(q) ||
      (u.phone || "").toLowerCase().includes(q)
    )
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground">{users.length} registered users</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>Manage registered user accounts.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-4">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-sm"
            />
          </div>

          {filtered.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No users found.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                          <UserRound className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium">{user.display_name || "No name"}</p>
                          <p className="text-xs text-muted-foreground font-mono">{user.id.slice(0, 8)}...</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{user.email || "—"}</TableCell>
                    <TableCell>{user.phone || "—"}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{new Date(user.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">Active</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
