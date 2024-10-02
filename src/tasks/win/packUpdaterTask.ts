import chalk from 'chalk';
import { AppPath, WinFileAssociation, WinSign } from "configs/common";
import { generateResourceUpdateIss, generateSetupIss, generateWinSign, getWinAppPaths } from "helpers/configHelper";
import { ITask, TaskBase } from "tasks/common";
import { info } from "utils/log";
import path from "path";
import { runCommand } from 'utils/exec';
import { nodeModulesDir, signToolFilename } from 'utils/path';

/**
 * 打包exe更新包的任务
 */
export class PackExeUpdaterTask extends TaskBase implements ITask {
    constructor() {
        super("Exe updater Package")
    }

    private sourceConfig: any;
    private packageConfig: any;
    private projectDir: string;
    private winFileAssociations: WinFileAssociation[];

    /**
     * 初始化任务
     * @param sourceConfig 原始配置
     * @param packageConfig 项目的package.json
     * @param projectDir 项目的工作目录
     * @param winFileAssociations 文件关联
     */
    public init(sourceConfig: any, packageConfig: any, projectDir: string, winFileAssociations: WinFileAssociation[]): void {
        this.sourceConfig = sourceConfig;
        this.packageConfig = packageConfig;
        this.projectDir = projectDir;
        this.winFileAssociations = winFileAssociations;
    }

    public async run(): Promise<AppPath[]> {
        let apps = getWinAppPaths(this.sourceConfig, this.projectDir);
        let sign = generateWinSign(this.sourceConfig, this.projectDir);
        let outputs: AppPath[] = [];
        for (let i = 0; i < 1; i++) {
            let appPath = apps[i];
            let issFilename = generateResourceUpdateIss(this.sourceConfig, this.packageConfig, this.projectDir, appPath, this.winFileAssociations, !!sign);
            console.log(issFilename);
            if (issFilename) {
                info(`packaging ${chalk.blue("file")}=${appPath.path}`)
                await this.pack(issFilename, sign);
                outputs.push({
                    path: "",
                    arch: appPath.arch
                })
            }
        }
        return outputs;
    }

    private pack(issFilename: string, sign: WinSign): Promise<void> {
        const innoSetupPath = `${path.join(nodeModulesDir(), 'innosetup', 'bin', 'ISCC.exe')}`
        let args: string[] = [];
        if (sign) {
            if (sign.signingHashAlgorithms.indexOf("sha1") != -1) {
                args.push(`"/ssha1='${signToolFilename()}' /f '${sign.certificateFile}' /p ${sign.certificatePassword} /fd SHA1 /t ${sign.signingHashAlgorithms} /v $f"`);
            }
            if (sign.signingHashAlgorithms.indexOf("sha256") != -1) {
                args.push(`"/ssha256='${signToolFilename()}' /f '${sign.certificateFile}' /p ${sign.certificatePassword} /fd SHA256 /tr ${sign.rfc3161TimeStampServer} /td SHA256 /as /v $f"`);
            }
        }
        args.push(issFilename);
        return runCommand(innoSetupPath, args);
    }
} 