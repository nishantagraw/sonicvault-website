// ============================================
// GOOGLE APPS SCRIPT — REVOMUSIC (WITH FILE UPLOAD)
// ============================================
// Saves actual audio & art files to Google Drive
// and puts Drive links in the Google Sheet.
//
// AFTER PASTING: Deploy > Manage deployments >
// Edit > Version: "New version" > Deploy
// ============================================

// Google Drive folder to store uploads
var DRIVE_FOLDER_NAME = "RevoMusic Uploads";

function getOrCreateFolder() {
  var folders = DriveApp.getFoldersByName(DRIVE_FOLDER_NAME);
  if (folders.hasNext()) {
    return folders.next();
  }
  return DriveApp.createFolder(DRIVE_FOLDER_NAME);
}

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.openById('1Gq9ohKosrMs9FY_f9sA1t-Om8ahH_EQMAdLw3k9y6Cg').getActiveSheet();
    var data = JSON.parse(e.postData.contents);
    
    // Create headers if sheet is empty
    if (sheet.getLastRow() === 0) {
      setupHeaders();
    }
    
    var folder = getOrCreateFolder();
    
    // Create a subfolder for this release
    var artistName = data.artistName || "Unknown";
    var songTitle = data.songTitle || "Untitled";
    var subFolderName = artistName + " - " + songTitle + " (" + new Date().toLocaleDateString('en-IN') + ")";
    var subFolder = folder.createFolder(subFolderName);
    
    var audioLink = "";
    var artLink = "";
    
    // Save audio file to Drive
    if (data.audioBase64 && data.audioFileName) {
      try {
        var audioBlob = Utilities.newBlob(
          Utilities.base64Decode(data.audioBase64),
          data.audioMimeType || "audio/mpeg",
          data.audioFileName
        );
        var audioFile = subFolder.createFile(audioBlob);
        audioFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
        audioLink = audioFile.getUrl();
      } catch(err) {
        audioLink = "Upload failed: " + err.toString();
      }
    }
    
    // Save album art to Drive
    if (data.artBase64 && data.artFileName) {
      try {
        var artBlob = Utilities.newBlob(
          Utilities.base64Decode(data.artBase64),
          data.artMimeType || "image/jpeg",
          data.artFileName
        );
        var artFile = subFolder.createFile(artBlob);
        artFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
        artLink = artFile.getUrl();
      } catch(err) {
        artLink = "Upload failed: " + err.toString();
      }
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
      audioLink || data.audioFileName || "",
      artLink || data.artFileName || "",
      subFolder.getUrl(),
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
  
  // Clear existing content
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
  
  SpreadsheetApp.getActiveSpreadsheet().toast("Headers created!", "Setup Complete");
}
