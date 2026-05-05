import { useEffect, useState } from "react"
import { supabase } from "@/integrations/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Check, X, Eye } from "lucide-react"

type BusinessApp = {
  id: string
  business_name: string
  contact_name: string
  email: string
  phone: string | null
  category: string | null
  country_code: string
  country_name: string
  description: string | null
  status: string
  created_at: string
}

type CreatorApp = {
  id: string
  full_name: string
  email: string
  phone: string | null
  social_links: string | null
  content_type: string | null
  country_code: string
  country_name: string
  description: string | null
  status: string
  created_at: string
}

export function ApplicationsPage() {
  const { toast } = useToast()
  const [businessApps, setBusinessApps] = useState<BusinessApp[]>([])
  const [creatorApps, setCreatorApps] = useState<CreatorApp[]>([])
  const [loading, setLoading] = useState(true)
  const [detailApp, setDetailApp] = useState<BusinessApp | CreatorApp | null>(null)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    loadApps()
  }, [])

  const loadApps = async () => {
    const [bRes, cRes] = await Promise.all([
      supabase.from("business_applications").select("*").order("created_at", { ascending: false }),
      supabase.from("creator_applications").select("*").order("created_at", { ascending: false }),
    ])
    if (!bRes.error) setBusinessApps(bRes.data || [])
    if (!cRes.error) setCreatorApps(cRes.data || [])
    setLoading(false)
  }

  const updateStatus = async (table: "business_applications" | "creator_applications", id: string, status: string) => {
    setUpdating(true)
    const { error } = await supabase.from(table).update({ status }).eq("id", id)
    setUpdating(false)

    if (error) {
      toast({ variant: "destructive", title: "Update failed", description: error.message })
      return
    }

    toast({ title: "Updated", description: `Application ${status}` })
    loadApps()
    setDetailApp(null)
  }

  const statusBadge = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      approved: "bg-green-500/20 text-green-400 border-green-500/30",
      rejected: "bg-red-500/20 text-red-400 border-red-500/30",
    }
    return <Badge variant="outline" className={colors[status] || ""}>{status}</Badge>
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
        <h1 className="text-3xl font-bold tracking-tight">Applications</h1>
        <p className="text-muted-foreground">Review and manage business and creator applications.</p>
      </div>

      <Tabs defaultValue="business">
        <TabsList>
          <TabsTrigger value="business">Business ({businessApps.length})</TabsTrigger>
          <TabsTrigger value="creator">Creator ({creatorApps.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="business">
          <Card>
            <CardContent className="p-0">
              {businessApps.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No applications yet.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Business</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Country</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {businessApps.map((app) => (
                      <TableRow key={app.id}>
                        <TableCell className="font-medium">{app.business_name}</TableCell>
                        <TableCell>{app.contact_name}</TableCell>
                        <TableCell className="font-mono text-sm">{app.email}</TableCell>
                        <TableCell>{app.category || "—"}</TableCell>
                        <TableCell>{app.country_name}</TableCell>
                        <TableCell>{statusBadge(app.status)}</TableCell>
                        <TableCell className="text-muted-foreground text-sm">{new Date(app.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon" onClick={() => setDetailApp(app)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            {app.status === "pending" && (
                              <>
                                <Button variant="ghost" size="icon" className="text-green-500" onClick={() => updateStatus("business_applications", app.id, "approved")}>
                                  <Check className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="text-red-500" onClick={() => updateStatus("business_applications", app.id, "rejected")}>
                                  <X className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="creator">
          <Card>
            <CardContent className="p-0">
              {creatorApps.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No applications yet.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Content Type</TableHead>
                      <TableHead>Country</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {creatorApps.map((app) => (
                      <TableRow key={app.id}>
                        <TableCell className="font-medium">{app.full_name}</TableCell>
                        <TableCell className="font-mono text-sm">{app.email}</TableCell>
                        <TableCell>{app.content_type || "—"}</TableCell>
                        <TableCell>{app.country_name}</TableCell>
                        <TableCell>{statusBadge(app.status)}</TableCell>
                        <TableCell className="text-muted-foreground text-sm">{new Date(app.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon" onClick={() => setDetailApp(app)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            {app.status === "pending" && (
                              <>
                                <Button variant="ghost" size="icon" className="text-green-500" onClick={() => updateStatus("creator_applications", app.id, "approved")}>
                                  <Check className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="text-red-500" onClick={() => updateStatus("creator_applications", app.id, "rejected")}>
                                  <X className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={!!detailApp} onOpenChange={() => setDetailApp(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Application Details</DialogTitle>
            <DialogDescription>
              {detailApp && "business_name" in detailApp ? "Business Application" : "Creator Application"}
            </DialogDescription>
          </DialogHeader>
          {detailApp && (
            <div className="space-y-4">
              {"business_name" in detailApp ? (
                <>
                  <DetailRow label="Business" value={detailApp.business_name} />
                  <DetailRow label="Contact" value={detailApp.contact_name} />
                  <DetailRow label="Email" value={detailApp.email} />
                  <DetailRow label="Phone" value={detailApp.phone || "—"} />
                  <DetailRow label="Category" value={detailApp.category || "—"} />
                  <DetailRow label="Country" value={`${detailApp.country_name} (${detailApp.country_code})`} />
                  <DetailRow label="Description" value={detailApp.description || "—"} />
                </>
              ) : (
                <>
                  <DetailRow label="Name" value={detailApp.full_name} />
                  <DetailRow label="Email" value={detailApp.email} />
                  <DetailRow label="Phone" value={detailApp.phone || "—"} />
                  <DetailRow label="Social Links" value={detailApp.social_links || "—"} />
                  <DetailRow label="Content Type" value={detailApp.content_type || "—"} />
                  <DetailRow label="Country" value={`${detailApp.country_name} (${detailApp.country_code})`} />
                  <DetailRow label="Description" value={detailApp.description || "—"} />
                </>
              )}
              <DetailRow label="Status" value={<>{statusBadge(detailApp.status)}</>} />
              <DetailRow label="Submitted" value={new Date(detailApp.created_at).toLocaleString()} />

              {detailApp.status === "pending" && (
                <div className="flex gap-2 pt-4">
                  <Button className="flex-1 bg-green-600 hover:bg-green-700" onClick={() => updateStatus("business_name" in detailApp ? "business_applications" : "creator_applications", detailApp.id, "approved")} disabled={updating}>
                    {updating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Check className="h-4 w-4 mr-2" />}
                    Approve
                  </Button>
                  <Button variant="outline" className="flex-1 border-red-500 text-red-500 hover:bg-red-500/10" onClick={() => updateStatus("business_name" in detailApp ? "business_applications" : "creator_applications", detailApp.id, "rejected")} disabled={updating}>
                    {updating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <X className="h-4 w-4 mr-2" />}
                    Reject
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-4 text-sm">
      <span className="text-muted-foreground font-medium">{label}</span>
      <span className="text-right">{value}</span>
    </div>
  )
}
