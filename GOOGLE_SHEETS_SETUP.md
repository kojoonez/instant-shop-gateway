# Google Sheets Waitlist Setup

## 1. Create the Google Sheet

1. Go to [sheets.google.com](https://sheets.google.com) and create a new spreadsheet
2. Rename the first sheet tab to **Waitlist**
3. Add these headers in row 1:

| A | B | C | D | E | F | G | H | I |
|---|---|---|---|---|---|---|---|---|
| Timestamp | Segment | Email | Full Name | Business Name | Vehicle Type | Country Code | Country Name | Notes |

---

## 2. Create the Apps Script

1. In your sheet, go to **Extensions → Apps Script**
2. Delete any existing code and paste the following:

```javascript
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Waitlist');
    const p = e.parameter;

    sheet.appendRow([
      p.submittedAt || new Date().toISOString(),
      p.segment || '',
      p.email || '',
      p.fullName || '',
      p.businessName || '',
      p.vehicleType || '',
      p.countryCode || '',
      p.countryName || '',
      p.notes || '',
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ result: 'ok' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

3. Click **Save** (name the project anything, e.g. "Cravy Waitlist")

---

## 3. Deploy as Web App

1. Click **Deploy → New deployment**
2. Click the gear icon next to "Select type" and choose **Web app**
3. Set:
   - **Description**: Cravy Waitlist
   - **Execute as**: Me
   - **Who has access**: Anyone
4. Click **Deploy**
5. Authorize the app when prompted
6. Copy the **Web app URL** — it looks like:
   `https://script.google.com/macros/s/XXXXXXXXXX/exec`

---

## 4. Add the URL to your environment

Create or update your `.env` file in the project root:

```
VITE_GOOGLE_SHEETS_URL=https://script.google.com/macros/s/XXXXXXXXXX/exec
```

Replace the URL with the one you copied in step 3.

Then restart the dev server:
```
npm run dev
```

---

## Notes

- Submissions use `no-cors` mode (required for Apps Script), so the browser won't show a network error even if the URL is wrong — always test by checking the sheet directly.
- The old Supabase `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` env vars are no longer needed for the waitlist (they may still be used for auth).
