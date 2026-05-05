import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink, Sheet } from "lucide-react"

export function WaitlistPage() {
  const sheetsUrl = import.meta.env.VITE_GOOGLE_SHEETS_URL as string | undefined

  const viewUrl = "https://docs.google.com/spreadsheets"

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Waitlist</h1>
        <p className="text-muted-foreground">
          Signups are saved directly to Google Sheets.
        </p>
      </div>

      <Card className="max-w-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sheet className="h-5 w-5 text-green-500" />
            Google Sheets
          </CardTitle>
          <CardDescription>
            All waitlist submissions (businesses, users, and delivery drivers) are stored in your
            connected Google Sheet. Open it to view, filter, and export signups.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button asChild>
            <a href={viewUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 mr-2" />
              Open Google Sheets
            </a>
          </Button>

          <div className="rounded-lg border border-white/10 bg-muted/30 p-4 text-sm space-y-2">
            <p className="font-medium">Sheet columns</p>
            <ol className="list-decimal list-inside text-muted-foreground space-y-1">
              <li>Timestamp</li>
              <li>Segment (business / user / driver)</li>
              <li>Email</li>
              <li>Full Name</li>
              <li>Business Name</li>
              <li>Vehicle Type</li>
              <li>Country Code</li>
              <li>Country Name</li>
              <li>Notes</li>
            </ol>
          </div>

          {!sheetsUrl && (
            <p className="text-xs text-destructive">
              ⚠️ <code>VITE_GOOGLE_SHEETS_URL</code> is not set — submissions are currently not
              being saved. See <code>GOOGLE_SHEETS_SETUP.md</code> for setup instructions.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
