import { exec } from 'child_process';
import { platform } from 'os';
import { warn } from './log';

// 检查是否拥有管理员权限
function isElevated() {
    return new Promise((resolve, reject) => {
        if (platform() === 'win32') {
            exec('net session', (error) => {
                resolve(!error); // 如果没有错误，表示有管理员权限
            });
        } else {
            resolve(true); // 非 Windows 平台默认拥有权限
        }
    });
}

// 如果没有管理员权限，则重新以管理员身份运行当前脚本
export async function ensureElevated():Promise<void>{
    const isAdmin = await isElevated();
    return new Promise<void>((resolve,reject)=>{
        if (!isAdmin) {
            warn("Administrator privileges not detected. Rerunning the script with elevated privileges...")
            // 使用 PowerShell 重新启动当前脚本，并申请管理员权限
            const scriptPath = process.argv[1]; // 当前脚本路径
            const args = process.argv.slice(2).join(' '); // 传递的参数
            const fullCommand = `node "${scriptPath}" ${args}`;
            exec(`powershell -Command "Start-Process cmd -ArgumentList '/k ${fullCommand}' -Verb RunAs"`);
        } else {
            resolve();
        }
    });
   
}