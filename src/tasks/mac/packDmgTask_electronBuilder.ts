import { requireDynamically } from "base/dynamicImport";
import chalk from "chalk";
import { AppPath } from "configs/common";
import { Configuration } from "electron-builder";
import { generateDmgLicenseConfig, generatePackDmgConfig_electronBuilder, getMacAppPaths } from "helpers/configHelper";
import path from "path";
import { ITask, TaskBase } from "tasks/common";
import { error, info } from "utils/log";

/**
 * 打包dmg的任务
 */
export class PackDmgTask_electronBuilder extends TaskBase implements ITask {
    constructor() {
        super("Dmg Package")
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
        let apps = getMacAppPaths(this.sourceConfig, this.projectDir);
        let dmgLicenseConfig = generateDmgLicenseConfig(this.sourceConfig, this.projectDir);
        let outputs: AppPath[] = [];
        for (let i = 0; i < apps.length; i++) {
            let appPath = apps[i];
            let appDmgConfig = generatePackDmgConfig_electronBuilder(this.sourceConfig, this.packageConfig, this.projectDir, appPath);
            if (appDmgConfig) {
                info(`packaging ${chalk.blue("file")}=${appPath.path}`)
                let output = await this.pack(appDmgConfig,appPath);
                if(dmgLicenseConfig){
                    info(`adding license ${chalk.blue("file")}=${output}`)
                    await this.addLicense(dmgLicenseConfig,output);
                }
                outputs.push({
                    path: output,
                    arch: appPath.arch
                })
            }
        }
        return outputs;
    }

    private async pack(config: Configuration,appPath:AppPath): Promise<string> {
        const { build } = requireDynamically("electron-builder")
        await build({
            config:config,
            x64:appPath.arch == "x64",
            arm64: appPath.arch == "arm64",
            mac:["dmg"],
            projectDir:this.projectDir,
            prepackaged:appPath.path
        })
        let artifactName = config.dmg.artifactName;
        return path.join(this.projectDir,this.sourceConfig.output,artifactName);
    }

    private addLicense(config: any, target: string): Promise<void> {
        let dmgLicense = requireDynamically("dmg-license");
        return dmgLicense.dmgLicenseFromJSON(target, config,
            {
                onNonFatalError: (e: any) => {
                    error(e);
                }
            }
        )
    }

} 