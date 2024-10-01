import chalk from 'chalk';
import { AppPath, WinFileAssociation } from "configs/common";
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
    private winFileAssociations:WinFileAssociation[];

    /**
     * 初始化任务
     * @param sourceConfig 原始配置
     * @param packageConfig 项目的package.json
     * @param projectDir 项目的工作目录
     * @param winFileAssociations 文件关联
     */
    public init(sourceConfig: any, packageConfig: any, projectDir: string,winFileAssociations:WinFileAssociation[]): void {
        this.sourceConfig = sourceConfig;
        this.packageConfig = packageConfig;
        this.projectDir = projectDir;
        this.winFileAssociations = winFileAssociations;
    }

    public async run(): Promise<AppPath[]> {
        let apps = getWinAppPaths(this.sourceConfig, this.projectDir);
        let outputs: AppPath[] = [];
        for (let i = 0; i < 1; i++) {
            let appPath = apps[i];
            let issFilename = generateIss(this.sourceConfig, this.packageConfig, this.projectDir, appPath,this.winFileAssociations);
            console.log(issFilename);
            if (issFilename) {
                info(`packaging ${chalk.blue("file")}=${appPath.path}`)
                await this.pack(issFilename);
                outputs.push({
                    path: "",
                    arch: appPath.arch
                })
            }
        }
        return outputs;
    }

    private pack(issFilename: string): Promise<void> {
        //todo 签名 文件关联
        const innoSetupPath = `${path.join(nodeModulesDir(),'innosetup', 'bin', 'ISCC.exe')}`
        const args = [
            issFilename
        ];
        return runCommand(innoSetupPath,args);
    }
} 