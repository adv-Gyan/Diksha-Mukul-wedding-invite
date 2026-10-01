# RSVP Google Sheets Setup

The website RSVP form sends only:

- Name
- Phone Number
- Attendance
- Events

No email address is collected or stored.

## 1. Create the Google Sheet

Create a Google Sheet for the wedding RSVP.

## 2. Add the Apps Script

Open the Sheet and go to:

**Extensions → Apps Script**

Copy the contents of `google-apps-script/Code.gs` from this repository into the Apps Script editor.

## 3. Deploy

Choose:

**Deploy → New deployment → Web app**

Use:

- **Execute as:** Me
- **Who has access:** Anyone

Authorize the script when Google asks.

Copy the URL ending in:

`/exec`

## 4. Connect the website

Open `js/script.js` and replace:

`YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL`

with the Web App URL.

Commit the change to `main`.

## 5. Test

Submit the RSVP form on the GitHub Pages website.

A successful submission should:

1. Add a row to the **RSVP Responses** sheet.
2. Show **RSVP Received** on the website.
3. Show a personalized confirmation message.

If the Google Apps Script URL has not been added, the website deliberately does **not** claim that the RSVP was received.
