export function formaTime(val) {
    var str = "";
    var date = new Date(val * 1000);
    
    str += date.getFullYear() + '-';
    str += (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    str += (date.getDate() < 10 ? '0' + date.getDate(): date.getDate()) + ' ';
    str += (date.getHours() < 10 ? '0' + date.getHours(): date.getHours()) + ':';
    str += (date.getMinutes() < 10 ? '0' + date.getMinutes(): date.getMinutes()) + ':';
    str += (date.getSeconds() < 10 ? '0' + date.getSeconds(): date.getSeconds());
    return str;
}