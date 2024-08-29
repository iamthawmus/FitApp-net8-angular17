export function getFormattedDate(date: Date | undefined | string) : string {
    if(typeof(date) === "string"){
        return date;
    }
    var newdate = !date ? new Date() : date;

    return newdate.toISOString().slice(0,10);
    ;
}

export function getDateOnly(dob: string | undefined){
    if(!dob) return;
    return new Date(dob).toISOString().slice(0,10);
  }