import chalk from "chalk";
import fs from "fs";
import { getAppPaths } from "helpers/configHelper";
import path from "path";
import { ITask, TaskBase } from "tasks/common";
import { hashString } from "utils/hash";
import { info } from "utils/log";

/**
 * mac打包信息的任务，用户更新时候来判断是全量更新还是只更新resource
 */
export class BuildInfoMacTask extends TaskBase implements ITask {
    constructor() {
        super("Mac build info")
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

    public async run(): Promise<void> {
        let entitlementsPath = this.sourceConfig.mac?.sign?.entitlements;
        let entitlementsInheritPath = this.sourceConfig.mac?.sign?.entitlementsInherit;
        let extendInfo = this.sourceConfig.mac?.extendInfo;

        if(entitlementsPath){
            entitlementsPath = path.join(this.projectDir,entitlementsPath);
        }
        if(entitlementsInheritPath){
            entitlementsInheritPath = path.join(this.projectDir,entitlementsInheritPath);
        }

        let configString = "";
        if(entitlementsPath && fs.existsSync(entitlementsPath)){
            configString += fs.readFileSync(entitlementsPath, 'utf8')
        }
        if(entitlementsInheritPath && fs.existsSync(entitlementsInheritPath)){
            configString += fs.readFileSync(entitlementsInheritPath, 'utf8')
        }
        if(extendInfo){
            configString += JSON.stringify(extendInfo);
        }
        let configHash = hashString(configString);



        let electronPackagePath = path.join(this.projectDir,"node_modules/electron/package.json");
        const electronPackageConfig = JSON.parse(fs.readFileSync(electronPackagePath, 'utf8')) 
        let electronVersion = electronPackageConfig.version
        let updateInfo = {
            "electron":electronVersion,
            "build":configHash
        };
        let updateInfoStr = JSON.stringify(updateInfo,null, 2)

        let apps = getAppPaths(this.sourceConfig, this.projectDir);
        for (let i = 0; i < apps.length; i++) {
            let appPath = apps[i];
            let updateInfoPath = path.join(appPath.path,"Contents/Resources","app-update.json");
            info(`create build info ${chalk.blue("file")}=${updateInfoPath}`)
            fs.writeFileSync(updateInfoPath,updateInfoStr,{ encoding: 'utf8' });
        }

    }
} 