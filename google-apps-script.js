// ============================================
// GOOGLE APPS SCRIPT — REVOMUSIC
// ============================================
// IMPORTANT: After making changes, you MUST redeploy:
// Deploy > Manage deployments > Edit (pencil icon) >
// Version: "New version" > Deploy
// ============================================

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.openById('1Gq9ohKosrMs9FY_f9sA1t-Om8ahH_EQMAdLw3k9y6Cg').getActiveSheet();
    
    // Parse the incoming data
    var data;
    try {
      data = JSON.parse(e.postData.contents);
    } catch(err) {
      // Try parameter-based approach
      data = e.parameter;
    }
    
    // Create headers if sheet is empty
    if (sheet.getLastRow() === 0) {
      setupHeaders();
    }
    
    // Append data row
    var row = [
      data.timestamp || new Date().toLocaleString('en-IN', {timeZone: 'Asia/Kolkata'}),
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
    
    return ContentService
      .createTextOutput(JSON.stringify({ status: "success" }))
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

// Run this function ONCE manually to create headers
function setupHeaders() {
  var sheet = SpreadsheetApp.openById('1Gq9ohKosrMs9FY_f9sA1t-Om8ahH_EQMAdLw3k9y6Cg').getActiveSheet();
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
  sheet.setColumnWidth(1, 200);
  sheet.setColumnWidth(2, 200);
  sheet.setColumnWidth(12, 250);
}
