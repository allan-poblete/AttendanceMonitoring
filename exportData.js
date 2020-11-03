const xls = require('excel4node');
const fs = require('fs');
const path = require('path');

exports.export = async (event) => {
    const filePath = getOutputFilePath(getFileName(event));
    const wb = new xls.Workbook();
    const ws = wb.addWorksheet('Sheet 1');

    const returnValue = {
        hasError: false,
        message: ''
    };

    ws.cell(1, 1).string('Member Name');
    ws.cell(1, 2).string('Time-In');
    ws.cell(1, 3).string('Time-Out');

    for(i = 0; i < event.memberAttendance.sort(compare).length; i++) {
        const attendance = event.memberAttendance[i];

        ws.cell(i + 2, 1).string(attendance.name);
        ws.cell(i + 2, 2).string(attendance.timeIn.toString());

        if(attendance.timeOut != undefined) {
            ws.cell(i + 2, 3).string(attendance.timeOut.toString());
        }
    }

    if(fs.existsSync(filePath)) {
        try {
            fs.unlinkSync(filePath);
        } catch(err) {
            returnValue.hasError = true;
            returnValue.message = `Error deleting existing file: ${err}`;
            
            return returnValue;
        }
    }

    try {
        wb.write(filePath);
        returnValue.message = filePath;
    } catch(err) {
        returnValue.hasError = true;
        returnValue.message = `Error writing to file: ${err}`;
        
        return returnValue;
    }

    return returnValue;
};

function compare(a, b) {
    if (a.timeIn < b.timeIn) {
        return -1;
    }
    
    if (a.timeIn > b.timeIn) {
        return 1;
    }

    return 0;
}

function getOutputFilePath(fileName)
{
    const folder = path.join(__dirname, 'outputs');
    
    if(!fs.existsSync(folder))
    {
        fs.mkdirSync(folder);
    }

    return path.join(folder, fileName);
}

function getFileName(event)
{
    const date = event.startDateTime;

    return `${event.eventName}_${String(date.getMonth() + 1).padStart(2, 0)}-${String(date.getDate()).padStart(2, 0)}-${date.getFullYear()}.xlsx`;
}