import { ITask, TaskBase } from "tasks/common";
import { Configuration } from "electron-builder"
import { notarize } from '@electron/notarize';
import path from "path";
import fs from "fs";
import { info } from "utils/log";
import chalk from 'chalk';
import { NotarizeConfig } from "configs/NotarizeConfig";

/**
 * mac app 公证任务
 */
export class NotarizeMacTask extends TaskBase implements ITask {
    constructor() {
        super("Mac notarizer")
    }

    private electronBuilderConfig: Configuration;
    private projectDir: string;
    private notarizeConfig: NotarizeConfig;

    /**
     * 初始化任务
     * @param electronBuilderConfig electron打包配置
     * @param notarizeConfig 公证配置
     * @param projectDir 项目的工作目录
     */
    public init(electronBuilderConfig: Configuration, notarizeConfig: NotarizeConfig, projectDir: string): void {
        this.electronBuilderConfig = electronBuilderConfig;
        this.projectDir = projectDir;
        this.notarizeConfig = notarizeConfig;
    }

    public async run(): Promise<boolean> {
        let cwd = this.projectDir ? this.projectDir : __dirname;
        let pathX64 = path.join(cwd, this.electronBuilderConfig.directories.output, "mac", this.electronBuilderConfig.productName + ".app")
        let pathArm64 = path.join(cwd, this.electronBuilderConfig.directories.output, "mac-arm64", this.electronBuilderConfig.productName + ".app")
        let apps: string[] = [];
        if (fs.existsSync(pathX64)) {
            apps.push(pathX64);
        }
        if (fs.existsSync(pathArm64)) {
            apps.push(pathArm64);
        }
        for (var i = 0; i < apps.length; i++) {
            let appPath = apps[i];
            info(`notarizing ${chalk.blue("file")}=${appPath}`)
            await notarize({
                appPath,
                appleId: this.notarizeConfig.appleId, // Login name of your Apple Developer account
                appleIdPassword: this.notarizeConfig.appleIdPassword, // App-specific password
                teamId: this.notarizeConfig.teamId, // Team ID for your developer team
                notarytoolPath: this.notarizeConfig.notarytoolPath
            });
        }
        return true;
    }
} 