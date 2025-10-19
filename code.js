const DATA_ENTRY_SHEET_NAME = "Sheet1";
const TIME_STAMP_COLUMN_NAME = "Timestamp";
const FOLDER_ID = "";

// == IMAGE UPLOAD CONFIGURATION ==
// Add or edit image column names here - this is the only place you need to modify
const IMAGE_COLUMNS = [
  { name: "before", label: "Before Image" },
  { name: "on process", label: "On Process Image" },
  { name: "after", label: "After Image" },
];
// == CONFIGURATION END ==

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(DATA_ENTRY_SHEET_NAME);
    if (!sheet) {
      throw new Error(`Sheet '${DATA_ENTRY_SHEET_NAME}' not found`);
    }

    const formData = e.postData.contents ? JSON.parse(e.postData.contents) : {};

    // Handle multiple image uploads if present
    let imageInfo = {};
    if (formData.imageData) {
      // Process each image type based on IMAGE_COLUMNS configuration
      IMAGE_COLUMNS.forEach((column) => {
        if (formData.imageData[column.name]) {
          imageInfo[column.name] = saveFile(formData.imageData[column.name]);
        }
      });
      delete formData.imageData; // Remove image data from form data
    }

    // Prepare data for sheet
    const rowData = {
      ...formData,
      [TIME_STAMP_COLUMN_NAME]: new Date().toISOString(),
    };

    // Add image information to row data using HYPERLINK formula
    IMAGE_COLUMNS.forEach((column) => {
      if (imageInfo[column.name]) {
        // Use HYPERLINK formula for clickable links in Google Sheets
        // Use the actual filename as the display text instead of the label
        rowData[column.name] = `=HYPERLINK("${imageInfo[column.name].url}","${imageInfo[column.name].name}")`;
      }
    });

    appendToGoogleSheet(rowData, sheet);

    return ContentService.createTextOutput(
      JSON.stringify({
        status: "success",
        message: "Data submitted successfully",
      })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    console.error(error);
    return ContentService.createTextOutput(
      JSON.stringify({
        status: "error",
        message: error.toString(),
      })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Saves a file to Google Drive
 */
function saveFile(fileData) {
  try {
    const blob = Utilities.newBlob(Utilities.base64Decode(fileData.data), fileData.mimeType, fileData.fileName);
    const folder = DriveApp.getFolderById(FOLDER_ID);
    const file = folder.createFile(blob);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    return {
      url: `https://drive.google.com/uc?export=view&id=${file.getId()}`,
      name: fileData.fileName,
    };
  } catch (error) {
    console.error("File upload error:", error);
    throw new Error("Failed to upload file: " + error.toString());
  }
}

/**
 * Appends data to the Google Sheet
 */
function appendToGoogleSheet(data, sheet) {
  let headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];

  // If sheet is empty, create headers
  if (headers.length === 0 || headers[0] === "") {
    const newHeaders = Object.keys(data);
    sheet.getRange(1, 1, 1, newHeaders.length).setValues([newHeaders]);
    headers = newHeaders;
  } else {
    // Check if we need to add new columns for the new image fields
    const existingHeaders = new Set(headers);
    const newColumns = [];

    // Add new image columns if they don't exist
    IMAGE_COLUMNS.forEach((column) => {
      if (!existingHeaders.has(column.name)) {
        newColumns.push(column.name);
      }
    });

    // Add new columns to the sheet if needed
    if (newColumns.length > 0) {
      const lastCol = sheet.getLastColumn();
      sheet.getRange(1, lastCol + 1, 1, newColumns.length).setValues([newColumns]);
      headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    }
  }

  // Map data to header columns
  const rowData = headers.map((header) => data[header] || "");
  sheet.appendRow(rowData);
}
