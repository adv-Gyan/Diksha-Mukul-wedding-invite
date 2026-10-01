/**
 * Diksha & Mukul Wedding RSVP
 *
 * Deploy this file as a Google Apps Script Web App:
 *   Execute as: Me
 *   Who has access: Anyone
 *
 * The website sends only:
 *   name, phone, attendance, events
 */

const SHEET_NAME = "RSVP Responses";

function doPost(e) {
  try {
    if (!e || !e.parameter) {
      throw new Error("No RSVP data received.");
    }

    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    if (!spreadsheet) {
      throw new Error("This script must be bound to the RSVP Google Sheet.");
    }

    let sheet = spreadsheet.getSheetByName(SHEET_NAME);

    if (!sheet) {
      sheet = spreadsheet.insertSheet(SHEET_NAME);
    }

    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Timestamp",
        "Name",
        "Phone",
        "Attendance",
        "Events"
      ]);
      sheet.setFrozenRows(1);
    }

    const name = String(e.parameter.name || "").trim();
    const phone = String(e.parameter.phone || "").trim();
    const attendance = String(e.parameter.attendance || "").trim();
    const events = String(e.parameter.events || "").trim();

    if (!name || !phone || !attendance) {
      throw new Error("Name, phone number and attendance are required.");
    }

    const lock = LockService.getScriptLock();
    lock.waitLock(10000);

    try {
      sheet.appendRow([
        new Date(),
        name,
        phone,
        attendance,
        events
      ]);
    } finally {
      lock.releaseLock();
    }

    return jsonResponse({
      success: true
    });

  } catch (error) {
    return jsonResponse({
      success: false,
      error: error.message || String(error)
    });
  }
}

function doGet() {
  return jsonResponse({
    success: true,
    service: "Diksha & Mukul Wedding RSVP",
    status: "online"
  });
}

function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
