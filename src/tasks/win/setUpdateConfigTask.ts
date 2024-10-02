import chalk from "chalk";
import { AppPath, BaseBuildConfig, MacArch, MacArchUpdate, WinArch, WinArchUpdate } from "configs/common";
import fs from "fs";
import { UpdateConfigHelper } from "helpers/updateHelper";
import path from "path";
import { ITask, TaskBase } from "tasks/common";
import { info } from "utils/log";

/**
 * 更新配置文件
 */
export class SetUpdateConfigWinTask extends TaskBase implements ITask {
    constructor() {
        super("Win update config")
    }

    private sourceConfig: any;
    private packageConfig: any;
    private projectDir: string;
    private apps:AppPath[];
    private buildConfig:BaseBuildConfig;

    /**
     * 初始化任务
     * @param sourceConfig 原始配置
     * @param packageConfig 项目的package.json
     * @param projectDir 项目的工作目录
     * @param apps 打包结果
     * @param buildConfig 构建信息
     */
    public init(sourceConfig: any, packageConfig: any, projectDir: string,apps:AppPath[],buildConfig:BaseBuildConfig): void {
        this.sourceConfig = sourceConfig;
        this.packageConfig = packageConfig;
        this.projectDir = projectDir;
        this.apps = apps;
        this.buildConfig = buildConfig;
    }

    public async run(): Promise<void> {
        var helper = new UpdateConfigHelper(this.sourceConfig,this.projectDir,"win");
        let updateConfig = helper.getUpdateConfig();
        updateConfig.electron = this.buildConfig.electron;
        updateConfig.build = this.buildConfig.build;
        updateConfig.version = this.packageConfig.version;
        for(var i = 0;i<this.apps.length;i++){
            var appPath = this.apps[i];
            let arch = appPath.arch as (WinArch | WinArchUpdate);
            const stats = fs.statSync(appPath.path);
            const fileSizeInBytes = stats.size;
            if(arch == "x64"){
                info(`setting ${chalk.blue("arch")}=x64 ${chalk.blue("type")}=download`)
                let archConfig = helper.getArchUpdateConfig(updateConfig,"x64");
                archConfig.download.url = path.basename(appPath.path);
                archConfig.download.size = fileSizeInBytes;
                info(`setting ${chalk.blue("arch")}=x64 ${chalk.blue("type")}=full`)
                archConfig = helper.getArchUpdateConfig(updateConfig,"x64");
                archConfig.full.url = path.basename(appPath.path);
                archConfig.full.size = fileSizeInBytes;
            }
            if(arch == "x64-resource-update"){
                info(`setting ${chalk.blue("arch")}=x64 ${chalk.blue("type")}=resource`)
                let archConfig = helper.getArchUpdateConfig(updateConfig,"x64");
                archConfig.resource.url = path.basename(appPath.path);
                archConfig.resource.size = fileSizeInBytes;
            }
            if(arch == "x86"){
                info(`setting ${chalk.blue("arch")}=x86 ${chalk.blue("type")}=download`)
                let archConfig = helper.getArchUpdateConfig(updateConfig,"x86");
                archConfig.download.url = path.basename(appPath.path);
                archConfig.download.size = fileSizeInBytes;
                info(`setting ${chalk.blue("arch")}=x86 ${chalk.blue("type")}=full`)
                archConfig = helper.getArchUpdateConfig(updateConfig,"x86");
                archConfig.full.url = path.basename(appPath.path);
                archConfig.full.size = fileSizeInBytes;
            }
            if(arch == "x86-resource-update"){
                info(`setting ${chalk.blue("arch")}=x86 ${chalk.blue("type")}=resource`)
                let archConfig = helper.getArchUpdateConfig(updateConfig,"x86");
                archConfig.resource.url = path.basename(appPath.path);
                archConfig.resource.size = fileSizeInBytes;
            }
        }
        helper.setUpdateConfig(updateConfig);
    }
} 