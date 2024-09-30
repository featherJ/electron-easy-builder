import { exec, spawn } from 'child_process';
import { platform } from 'os';
import path from 'path';

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
export async function ensureElevated():Promise<void> {
    const isAdmin = await isElevated();
    return new Promise<void>((resolve,reject)=>{
        if (!isAdmin) {
            console.log('当前没有管理员权限，正在重新以管理员身份运行脚本...');
             // 使用 PowerShell 重新启动当前脚本，并申请管理员权限，同时保持输出到当前控制台
             const scriptPath = process.argv[1]; // 当前脚本路径
             const args = process.argv.slice(2); // 传递的参数
    
            const elevatedProcess = spawn('powershell', [
                '-Command',
                `Start-Process node -ArgumentList '${[scriptPath, ...args].join(' ')}' -Verb RunAs -Wait -NoNewWindow`
            ], { stdio: ['inherit','inherit','inherit'] });
            elevatedProcess.on('close', (code) => {
                console.log(`脚本以管理员权限执行完毕，退出码: ${code}`);
                process.exit(code ?? 0);
            });
            // 退出当前进程，等管理员权限的进程启动
        } else {
            console.log('已经有管理员权限，继续执行脚本...');
            resolve();
        }
    });
   
}