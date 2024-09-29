import chalk from 'chalk';
import { AppPath } from "configs/common";
import { generateIss, getWinAppPaths } from "helpers/configHelper";
import { ITask, TaskBase } from "tasks/common";
import { info } from "utils/log";
import path from "path";
import {  runCommand } from 'utils/exec';
import { nodeModulesDir } from 'utils/path';

/**
 * 打包exe安装包的任务
 */
export class PackExeTask extends TaskBase implements ITask {
    constructor() {
        super("Exe installer Package")
    }

    private sourceConfig: any;
    private packageConfig: any;
    private projectDir: string;

    /**
     * 初始化任务
     * @param sourceConfig 原始配置
     * @param packageConfig 项目的package.json
     * @param projectDir 项目的工作目录
     */
    public init(sourceConfig: any, packageConfig: any, projectDir: string): void {
        this.sourceConfig = sourceConfig;
        this.packageConfig = packageConfig;
        this.projectDir = projectDir;
    }

    public async run(): Promise<AppPath[]> {
        let apps = getWinAppPaths(this.sourceConfig, this.projectDir);
        let outputs: AppPath[] = [];
        for (let i = 0; i < apps.length; i++) {
            let appPath = apps[i];
            let issFilename = generateIss(this.sourceConfig, this.packageConfig, this.projectDir, appPath);
            if (issFilename) {
                info(`packaging ${chalk.blue("file")}=${appPath.path}`)
                let output = await this.pack(issFilename);
                outputs.push({
                    path: output,
                    arch: appPath.arch
                })
            }
        }
        return outputs;
    }

    private pack(issFilename: string): Promise<string> {
        // const innoSetupPath = path.join(path.dirname(path.dirname(require.resolve('innosetup'))), 'bin', 'ISCC.exe');
        const innoSetupPath = path.join(nodeModulesDir(),'innosetup', 'bin', 'ISCC.exe');
        const args = [
            // "WINEARCH=win32 WINEPREFIX=~/.wine32",
            // "wine",
            innoSetupPath,
            issFilename
        ];
        return new Promise((resolve, reject) => {
            runCommand(args);
        });
    }
} 