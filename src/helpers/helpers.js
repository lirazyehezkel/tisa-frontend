import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

export const formatInputRangeDate = (date) => {
    const newDate = new Date(date);
    let dd = newDate.getDate();
    let mm = newDate.getMonth()+1; //January is 0!
    const yyyy = newDate.getFullYear();
    if(dd<10){
        dd='0'+dd
    }
    if(mm<10){
        mm='0'+mm
    }

    return yyyy+'-'+mm+'-'+dd;
}

export const exportToCSV = (csvData, fileName) => {
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], {type: fileType});
    FileSaver.saveAs(data, fileName + fileExtension);
}