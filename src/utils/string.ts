/**
 * 移除空格
 * @param value 
 * @returns 
 */
export function removeSpace(value:string):string{
    let arr = value.split(" ");
    let newArr:string[] = [];
    for(var i = 0;i<arr.length;i++){
        let value = arr[i].trim();
        if(value){
            newArr.push(value);
        }
    }
    return newArr.join('_');
}