export function getFormattedDate(date: Date | undefined) : string {
    var newdate = !date ? new Date() : date;
    var dd = String(newdate.getDate()).padStart(2, '0');
    var mm = String(newdate.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = newdate.getFullYear();
    
    let formattedDate = yyyy + '-' + mm +'-' + dd;

    return formattedDate;
}