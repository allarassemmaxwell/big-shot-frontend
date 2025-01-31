// src/components/ExportToExcel.js
import React from "react";
import * as XLSX from "xlsx";

const ExportToExcel = ({ data, filename = 'export.xlsx' }) => {
  const exportToExcel = () => {
    // Convert data into an Excel worksheet
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = { Sheets: { 'Data': ws }, SheetNames: ['Data'] };
    
    // Write the workbook into binary format
    const excelFile = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });

    // Create an ArrayBuffer to hold the file content
    const buffer = new ArrayBuffer(excelFile.length);
    const view = new Uint8Array(buffer);
    for (let i = 0; i < excelFile.length; i++) {
      view[i] = excelFile.charCodeAt(i) & 0xFF;
    }

    // Create a Blob from the ArrayBuffer, and trigger a download
    const blob = new Blob([buffer], { type: 'application/octet-stream' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename; // Set filename to 'bets.xlsx' or any custom filename passed in the prop
    a.click();
  };

  return (
    <button onClick={exportToExcel} className="btn btn-primary">
      Export to Excel
    </button>
  );
};

export default ExportToExcel;
