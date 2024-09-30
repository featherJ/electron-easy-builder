import { spawn } from 'child_process';
import { error } from 'console';
import { info } from './log';



export function runCommand(command: string, args: string[]): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        // 构建完整的命令字符串
        const childProcess = spawn(command, args);
        // 监听标准输出，实时打印子进程的输出
        childProcess.stdout.on('data', (data) => {
            info(data.toString());
        });
        // 监听标准错误输出，实时打印错误
        childProcess.stderr.on('data', (data) => {
            error(data.toString());
        });
        // 监听子进程结束
        childProcess.on('close', (code) => {
            info(`Process exited with code ${code}`);
            if(code == 0){
                resolve();
            }else{
                reject();
            }
        });
    });

}
