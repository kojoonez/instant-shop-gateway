import { useEffect, useState } from "react"
import { supabase } from "@/integrations/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Users } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type WaitlistEntry = {
  id: string
  segment: string
  email: string
  phone: string | null
  full_name: string | null
  business_name: string | null
  vehicle_type: string | null
  notes: string | null
  country_code: string | null
  country_name: string | null
  created_at: string
}

const segmentColors: Record<string, string> = {
  business: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  user: "bg-green-500/20 text-green-400 border-green-500/30",
  driver: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
}

export function WaitlistPage() {
  const [entries, setEntries] = useState<WaitlistEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    void (async () => {
      const { data, error } = await supabase
        .from("waitlist_signups")
        .select("*")
        .order("created_at", { ascending: false })

      if (!error && data) {
        setEntries(data)
      }
      setLoading(false)
    })()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center gap-3 py-16 justify-center text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span>Loading waitlist...</span>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Waitlist</h1>
          <p className="text-muted-foreground">
            {entries.length} {entries.length === 1 ? "signup" : "signups"} total
          </p>
        </div>
        <Badge variant="outline" className="gap-1 font-normal border-white/20">
          <Users className="h-4 w-4" />
          {entries.length}
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Signups</CardTitle>
          <CardDescription>Businesses, users, and delivery drivers who joined the waitlist.</CardDescription>
        </CardHeader>
        <CardContent>
          {entries.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No signups yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Segment</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={segmentColors[entry.segment] || "bg-muted text-muted-foreground border-white/20"}
                      >
                        {entry.segment}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{entry.email}</TableCell>
                    <TableCell>{entry.phone || "—"}</TableCell>
                    <TableCell>{entry.full_name || entry.business_name || "—"}</TableCell>
                    <TableCell>{entry.country_name || entry.country_code || "—"}</TableCell>
                    <TableCell>{entry.vehicle_type || "—"}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{entry.notes || "—"}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {new Date(entry.created_at).toLocaleDateString()}
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
