import { exec, ExecFileOptions } from 'child_process';


// /**
//  * 运行windows脚本，支持在mac下运行
//  * @param file 
//  * @param file64 
//  * @param appArgs 
//  * @param options 
//  * @returns 
//  */
// export function exe(file: string, file64?: string | null, appArgs?: Array<string>, options?: ExecFileOptions): Promise<string> {
//     return exec(file, file64, appArgs, options);
// }


export function runCommand(command: string[]): void {
    // 构建完整的命令字符串
    const fullCommand = command.join(" ");
  
    exec(fullCommand, (error, stdout, stderr) => {
      if (error) {
        console.error(`执行命令时出错: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`命令错误输出: ${stderr}`);
        return;
      }
      console.log(`命令输出: ${stdout}`);
    });
  }
  