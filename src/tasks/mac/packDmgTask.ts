import { requireDynamically } from "base/dynamicImport";
import chalk from 'chalk';
import { AppDmgConfig, AppPath } from "configs/common";
import { generateDmgLicenseConfig, generatePackDmgConfig, getAppPaths } from "helpers/configHelper";
import { ITask, TaskBase } from "tasks/common";
import { error, info } from "utils/log";

/**
 * 打包dmg的任务
 */
export class PackDmgTask extends TaskBase implements ITask {
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
        let apps = getAppPaths(this.sourceConfig, this.projectDir);
        let dmgLicenseConfig = generateDmgLicenseConfig(this.sourceConfig, this.projectDir);
        let outputs: AppPath[] = [];
        for (let i = 0; i < apps.length; i++) {
            let appPath = apps[i];
            let appDmgConfig = generatePackDmgConfig(this.sourceConfig, this.packageConfig, this.projectDir, appPath);
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