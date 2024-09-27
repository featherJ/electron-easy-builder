import chalk from "chalk";
import { AppPath, BaseBuildConfig, MacArch, MacArchUpdate } from "configs/common";
import fs from "fs";
import { UpdateConfigHelper } from "helpers/updateHelper";
import { ITask, TaskBase } from "tasks/common";
import { info } from "utils/log";

/**
 * 更新配置文件
 */
export class SetUpdateConfigMacTask extends TaskBase implements ITask {
    constructor() {
        super("Mac update config")
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
        var helper = new UpdateConfigHelper(this.sourceConfig,this.projectDir,"mac");
        let updateConfig = helper.getUpdateConfig();
        updateConfig.electron = this.buildConfig.electron;
        updateConfig.build = this.buildConfig.build;
        updateConfig.version = this.packageConfig.version;
        for(var i = 0;i<this.apps.length;i++){
            var appPath = this.apps[i];
            let arch = appPath.arch as (MacArch | MacArchUpdate);
            const stats = fs.statSync(appPath.path);
            const fileSizeInBytes = stats.size;
            if(arch == "x64"){
                info(`setting ${chalk.blue("arch")}=x64 ${chalk.blue("type")}=download`)
                let archConfig = helper.getArchUpdateConfig(updateConfig,"x64");
                archConfig.download.url = appPath.path;
                archConfig.download.size = fileSizeInBytes;
            }
            if(arch == "x64-full-update"){
                info(`setting ${chalk.blue("arch")}=x64 ${chalk.blue("type")}=full`)
                let archConfig = helper.getArchUpdateConfig(updateConfig,"x64");
                archConfig.full.url = appPath.path;
                archConfig.full.size = fileSizeInBytes;
            }
            if(arch == "x64-resource-update"){
                info(`setting ${chalk.blue("arch")}=x64 ${chalk.blue("type")}=resource`)
                let archConfig = helper.getArchUpdateConfig(updateConfig,"x64");
                archConfig.resource.url = appPath.path;
                archConfig.resource.size = fileSizeInBytes;
            }

            if(arch == "arm64"){
                info(`setting ${chalk.blue("arch")}=arm64 ${chalk.blue("type")}=download`)
                let archConfig = helper.getArchUpdateConfig(updateConfig,"arm64");
                archConfig.download.url = appPath.path;
                archConfig.download.size = fileSizeInBytes;
            }
            if(arch == "x64-full-update"){
                info(`setting ${chalk.blue("arch")}=arm64 ${chalk.blue("type")}=full`)
                let archConfig = helper.getArchUpdateConfig(updateConfig,"arm64");
                archConfig.full.url = appPath.path;
                archConfig.full.size = fileSizeInBytes;
            }
            if(arch == "x64-resource-update"){
                info(`setting ${chalk.blue("arch")}=arm64 ${chalk.blue("type")}=resource`)
                let archConfig = helper.getArchUpdateConfig(updateConfig,"arm64");
                archConfig.resource.url = appPath.path;
                archConfig.resource.size = fileSizeInBytes;
            }
        }
        helper.setUpdateConfig(updateConfig);
    }
} 