// ============================================
// GOOGLE APPS SCRIPT — REVOMUSIC (WITH FILE UPLOAD)
// ============================================
// AFTER PASTING: Deploy > Manage deployments >
// Edit > Version: "New version" > Deploy
// ============================================

var DRIVE_FOLDER_NAME = "RevoMusic Uploads";
var SHEET_ID = '1Gq9ohKosrMs9FY_f9sA1t-Om8ahH_EQMAdLw3k9y6Cg';

function getOrCreateFolder() {
  var folders = DriveApp.getFoldersByName(DRIVE_FOLDER_NAME);
  if (folders.hasNext()) {
    return folders.next();
  }
  return DriveApp.createFolder(DRIVE_FOLDER_NAME);
}

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet();
    
    // Parse data - handle both JSON body and form parameter
    var data;
    try {
      // Try form parameter first (from hidden form submission)
      if (e.parameter && e.parameter.data) {
        data = JSON.parse(e.parameter.data);
      }
      // Then try raw body (from fetch)
      else if (e.postData && e.postData.contents) {
        data = JSON.parse(e.postData.contents);
      }
    } catch(err) {
      // Last resort
      data = e.parameter || {};
    }
    
    if (!data || !data.timestamp) {
      return ContentService.createTextOutput(JSON.stringify({status:"error", message:"No data received"})).setMimeType(ContentService.MimeType.JSON);
    }
    
    // Create headers if sheet is empty
    if (sheet.getLastRow() === 0) {
      setupHeaders();
    }
    
    var folder = getOrCreateFolder();
    
    // Create subfolder for this release
    var artistName = data.artistName || "Unknown";
    var songTitle = data.songTitle || "Untitled";
    var subFolderName = artistName + " - " + songTitle + " (" + new Date().toLocaleDateString('en-IN') + ")";
    var subFolder = folder.createFolder(subFolderName);
    
    var audioLink = "";
    var artLink = "";
    
    // Save audio file to Drive
    if (data.audioBase64 && data.audioFileName) {
      try {
        var audioBytes = Utilities.base64Decode(data.audioBase64);
        var audioBlob = Utilities.newBlob(audioBytes, data.audioMimeType || "audio/mpeg", data.audioFileName);
        var audioFile = subFolder.createFile(audioBlob);
        audioFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
        audioLink = audioFile.getUrl();
      } catch(err) {
        audioLink = "Upload failed: " + err.toString();
      }
    } else {
      audioLink = data.audioFileName || "No file";
    }
    
    // Save album art to Drive
    if (data.artBase64 && data.artFileName) {
      try {
        var artBytes = Utilities.base64Decode(data.artBase64);
        var artBlob = Utilities.newBlob(artBytes, data.artMimeType || "image/jpeg", data.artFileName);
        var artFile = subFolder.createFile(artBlob);
        artFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
        artLink = artFile.getUrl();
      } catch(err) {
        artLink = "Upload failed: " + err.toString();
      }
    } else {
      artLink = data.artFileName || "No file";
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
      audioLink,
      artLink,
      subFolder.getUrl(),
      "Pending Review"
    ];
    
    sheet.appendRow(row);
    
    // Return HTML for iframe (hidden form approach)
    return HtmlService.createHtmlOutput("<html><body><script>window.parent.postMessage('upload_success','*');</script></body></html>");
      
  } catch (error) {
    return HtmlService.createHtmlOutput("<html><body><p>Error: " + error.toString() + "</p></body></html>");
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: "ok", message: "RevoMusic API is running" }))
    .setMimeType(ContentService.MimeType.JSON);
}

// Run this function ONCE manually to create headers
function setupHeaders() {
  var sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet();
  sheet.clear();
  
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
    "Audio File (Drive Link)",
    "Album Art (Drive Link)",
    "Release Folder",
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
  sheet.setColumnWidth(1, 180);
  sheet.setColumnWidth(2, 200);
  sheet.setColumnWidth(12, 250);
  sheet.setColumnWidth(13, 250);
  sheet.setColumnWidth(14, 250);
  sheet.setColumnWidth(15, 250);
}
