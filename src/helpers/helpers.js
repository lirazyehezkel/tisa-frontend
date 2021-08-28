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