import { requireDynamically } from "base/dynamicImport";
import chalk from 'chalk';
import { AppDmgConfig, AppPath } from "configs/common";
import { generateDmgLicenseConfig, generatePackDmgConfig_appdmg, getMacAppPaths } from "helpers/configHelper";
import { ITask, TaskBase } from "tasks/common";
import { error, info } from "utils/log";

/**
 * 打包dmg的任务
 */
export class PackDmgTask_appdmg extends TaskBase implements ITask {
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
        //由于原本的appdmg，当title超过27个字符的时候会报错，所以我把库给改了。但是不知道是否会引发什么问题，所以改回了使用 electron builder 打包dmg
        let apps = getMacAppPaths(this.sourceConfig, this.projectDir);
        let dmgLicenseConfig = generateDmgLicenseConfig(this.sourceConfig, this.projectDir);
        let outputs: AppPath[] = [];
        for (let i = 0; i < apps.length; i++) {
            let appPath = apps[i];
            let appDmgConfig = generatePackDmgConfig_appdmg(this.sourceConfig, this.packageConfig, this.projectDir, appPath);
            if (appDmgConfig) {
                info(`packaging ${chalk.blue("file")}=${appPath.path}`)
                let output = await this.pack(appDmgConfig);
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

    private pack(config: AppDmgConfig): Promise<string> {
        return new Promise((resolve, reject) => {
            let appdmg = requireDynamically("appdmg");
            const ee = appdmg(config);
            ee.on('progress', (i: any) => {
                if (i.type == "step-begin") {
                    let output = `${i.title} ${chalk.blue(`${i.current}/${i.total}`)}`;
                    info(output);
                }
            });
            ee.on('finish', () => {
                resolve(config.target);
            });
            ee.on('error', (e: any) => {
                reject(e);
            });
        });
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