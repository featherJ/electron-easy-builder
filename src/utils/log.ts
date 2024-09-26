import chalk from 'chalk';

/**
 * 输出
 * @param data 
 */
export function log(data:string):void{
    console.log(data)
}

/**
 * 信息
 * @param data 
 */
export function info(data:any):void{
    console.log(`  ${chalk.blue('•')} ${data}`)
}

/**
 * 警告
 * @param data 
 */
export function warn(data:string):void{
    console.log(chalk.yellow(`  ! ${data}`))
}

/**
 * 错误
 * @param data 
 */
export function error(data:any):void{
    let output = "";
    if(typeof data === 'string' ){
        output = data
    }else if(typeof data === "object" && "message" in data){
        output = data.message;
    }else {
        output = data;
    }
    console.log(chalk.red(`  ⨯ ${output}`))
}