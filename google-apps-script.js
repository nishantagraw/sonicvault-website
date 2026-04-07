// ============================================
// GOOGLE APPS SCRIPT — PASTE THIS IN YOUR SHEET
// ============================================
// Steps:
// 1. Open: https://docs.google.com/spreadsheets/d/1Gq9ohKosrMs9FY_f9sA1t-Om8ahH_EQMAdLw3k9y6Cg/edit
// 2. Go to Extensions > Apps Script
// 3. Delete everything in Code.gs and paste this entire code
// 4. Click "Deploy" > "New deployment"
// 5. Choose Type: "Web app"
// 6. Set "Execute as": Me
// 7. Set "Who has access": Anyone
// 8. Click "Deploy" and copy the URL
// 9. Paste the URL in script.js where it says GOOGLE_SCRIPT_URL
// ============================================

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);
    
    // Create headers if first row is empty
    if (sheet.getLastRow() === 0) {
      var headers = [
        "Timestamp",
        "Song/Album Title",
        "Artist Name",
        "Release Type",
        "Genre",
        "Language",
        "Release Date",
        "Composer",
        "Lyricist",
        "Email",
        "Phone",
        "Description",
        "Audio File Name",
        "Album Art File Name",
        "Status"
      ];
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      
      // Style headers
      var headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setFontWeight("bold");
      headerRange.setBackground("#7C3AED");
      headerRange.setFontColor("#FFFFFF");
      headerRange.setHorizontalAlignment("center");
      sheet.setFrozenRows(1);
      
      // Auto-resize columns
      for (var i = 1; i <= headers.length; i++) {
        sheet.autoResizeColumn(i);
      }
    }
    
    // Append data row
    var row = [
      data.timestamp || new Date().toISOString(),
      data.songTitle || "",
      data.artistName || "",
      data.releaseType || "",
      data.genre || "",
      data.language || "",
      data.releaseDate || "",
      data.composer || "",
      data.lyricist || "",
      data.email || "",
      data.phone || "",
      data.description || "",
      data.audioFileName || "",
      data.artFileName || "",
      "Pending Review"
    ];
    
    sheet.appendRow(row);
    
    // Return success
    return ContentService
      .createTextOutput(JSON.stringify({ status: "success", message: "Release submitted successfully" }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: "ok", message: "RevoMusic API is running" }))
    .setMimeType(ContentService.MimeType.JSON);
}

// Run this function ONCE manually to set up the headers
function setupHeaders() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var headers = [
    "Timestamp",
    "Song/Album Title", 
    "Artist Name",
    "Release Type",
    "Genre",
    "Language",
    "Release Date",
    "Composer",
    "Lyricist",
    "Email",
    "Phone",
    "Description",
    "Audio File Name",
    "Album Art File Name",
    "Status"
  ];
  
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  var headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setFontWeight("bold");
  headerRange.setBackground("#7C3AED");
  headerRange.setFontColor("#FFFFFF");
  headerRange.setHorizontalAlignment("center");
  headerRange.setFontSize(11);
  sheet.setFrozenRows(1);
  
  for (var i = 1; i <= headers.length; i++) {
    sheet.setColumnWidth(i, 150);
  }
  sheet.setColumnWidth(1, 200);  // Timestamp wider
  sheet.setColumnWidth(2, 200);  // Song title wider
  sheet.setColumnWidth(12, 250); // Description wider
  
  SpreadsheetApp.getActiveSpreadsheet().toast("Headers created successfully!", "Setup Complete");
}
