import chalk from "chalk";
import { BaseBuildConfig, BuildConfig, MacArch, WinArch } from "configs/common";
import fs from "fs";
import { getWinAppPaths } from "helpers/configHelper";
import path from "path";
import { ITask, TaskBase } from "tasks/common";
import { hashString } from "utils/hash";
import { info } from "utils/log";

/**
 * win打包信息的任务，用户更新时候来判断是全量更新还是只更新resource
 */
export class AddBuildInfoWinTask extends TaskBase implements ITask {
    constructor() {
        super("Win build info")
    }

    private sourceConfig: any;
    private projectDir: string;

    /**
     * 初始化任务
     * @param sourceConfig 原始配置
     * @param projectDir 项目的工作目录
     */
    public init(sourceConfig: any,  projectDir: string): void {
        this.sourceConfig = sourceConfig;
        this.projectDir = projectDir;
    }

    public async run(): Promise<BaseBuildConfig> {
        let iconPath = this.sourceConfig.win?.icon;
        if(iconPath){
            iconPath = path.join(this.projectDir,iconPath);
        }

        let configString = "";
        if(iconPath && fs.existsSync(iconPath)){
            configString += fs.readFileSync(iconPath, 'utf8')
        }
        let configHash = hashString(configString);

        let electronPackagePath = path.join(this.projectDir,"node_modules/electron/package.json");
        const electronPackageConfig = JSON.parse(fs.readFileSync(electronPackagePath, 'utf8')) 
        let electronVersion = electronPackageConfig.version

        let baseBuildInfo:BaseBuildConfig = {
            electron:electronVersion,
            build:configHash,
        };

        let apps = getWinAppPaths(this.sourceConfig, this.projectDir);
        for (let i = 0; i < apps.length; i++) {
            let appPath = apps[i];
            let buildInfo:BuildConfig = {
                electron:electronVersion,
                build:configHash,
                arch:appPath.arch as MacArch | WinArch
            };
            let buildInfoStr = JSON.stringify(buildInfo,null, 2)
            let updateInfoPath = path.join(appPath.path,"resources","app-build.json");
            info(`create build info ${chalk.blue("file")}=${updateInfoPath}`)
            fs.writeFileSync(updateInfoPath,buildInfoStr,{ encoding: 'utf8' });
        }
        return baseBuildInfo;
    }
} 