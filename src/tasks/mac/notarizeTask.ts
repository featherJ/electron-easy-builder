import { notarize } from '@electron/notarize';
import chalk from 'chalk';
import { NotarizeConfig } from "configs/common";
import { Configuration } from "electron-builder";
import { getMacAppPaths } from "helpers/configHelper";
import { ITask, TaskBase } from "tasks/common";
import { info } from "utils/log";

/**
 * mac app 公证任务
 */
export class NotarizeMacTask extends TaskBase implements ITask {
    constructor() {
        super("Mac notarizer")
    }

    private sourceConfig: any;
    private projectDir: string;
    private notarizeConfig: NotarizeConfig;

    /**
     * 初始化任务
     * @param electronBuilderConfig electron打包配置
     * @param notarizeConfig 公证配置
     * @param projectDir 项目的工作目录
     */
    public init(sourceConfig: any, notarizeConfig: NotarizeConfig, projectDir: string): void {
        this.sourceConfig = sourceConfig;
        this.projectDir = projectDir;
        this.notarizeConfig = notarizeConfig;
    }

    public async run(): Promise<void> {
        let apps = getMacAppPaths(this.sourceConfig, this.projectDir);
        for (var i = 0; i < apps.length; i++) {
            let appPath = apps[i];
            info(`notarizing ${chalk.blue("file")}=${appPath.path}`)
            await notarize({
                appPath: appPath.path,
                appleId: this.notarizeConfig.appleId, // Login name of your Apple Developer account
                appleIdPassword: this.notarizeConfig.appleIdPassword, // App-specific password
                teamId: this.notarizeConfig.teamId, // Team ID for your developer team
                notarytoolPath: this.notarizeConfig.notarytoolPath
            });
        }
    }
} 