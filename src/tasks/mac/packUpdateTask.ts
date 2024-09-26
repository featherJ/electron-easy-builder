import { requireDynamically } from "base/dynamicImport";
import chalk from 'chalk';
import { AppDmgConfig, AppPath, MacArch, ArchAll } from "configs/common";
import { generateDmgLicenseConfig, generatePackDmgConfig, getAppPaths } from "helpers/configHelper";
import { ITask, TaskBase } from "tasks/common";
import { error, info } from "utils/log";
import * as fs from 'fs-extra';
import * as path from 'path';
import archiver from "archiver";

/**
 * 打包mac更新包的任务
 */
export class PackMacUpdateTask extends TaskBase implements ITask {
    constructor() {
        super("Mac update Package")
    }

    private sourceConfig: any;
    private packageConfig: any;
    private projectDir: string;

    /**
     * 初始化任务
     * @param sourceConfig 原始配置
     * @param packageConfig 项目的package.json
     * @param projectDir 
     */
    public init(sourceConfig: any, packageConfig: any, projectDir: string): void {
        this.sourceConfig = sourceConfig;
        this.packageConfig = packageConfig;
        this.projectDir = projectDir;
    }

    public async run(): Promise<AppPath[]> {
        let apps = getAppPaths(this.sourceConfig, this.projectDir);
        let outputDir = path.join(this.projectDir, this.sourceConfig.output);
        let outputs: AppPath[] = [];
        for (var i = 0; i < apps.length; i++) {
            let appPath = apps[i];
            let output = await this.packUpdate(appPath.path, appPath.arch, outputDir,false);
            outputs.push({
                path:output,
                arch:appPath.arch == "x64" ? "x64-resource-update" : "arm64-resource-update"
            })
            output = await this.packUpdate(appPath.path, appPath.arch, outputDir,true);
            outputs.push({
                path:output,
                arch:appPath.arch == "x64" ? "x64-full-update" : "arm64-full-update"
            })
        }
        return outputs;
    }

    private async packUpdate(appPath: string, arch: ArchAll, outputDir: string, full: boolean): Promise<string> {
        info(`packaging update ${chalk.blue("arch")}=${arch} ${chalk.blue("type")}=${full ? "full" : "resource"}`)
        let archName = arch == "x64" ? "intel" : "apple-silicon";
        let contentsDir = path.join(appPath, "Contents");
        let files = fs.readdirSync(contentsDir);
        let outputName = path.join(outputDir, `${this.sourceConfig.productName}-${this.packageConfig.version}-${archName}-${full ? "full" : "resource"}-update.zip`);
        const output = fs.createWriteStream(outputName);
        const archive = archiver('zip', {
            zlib: { level: 9 },
        });
        archive.on('error', (err) => {
            throw err;
        });
        archive.pipe(output);
        for (const fileName of files) {
            let canAdd = false;
            if(full){
                canAdd = true;
            }else if(fileName.toLocaleLowerCase() == "resources"){
                canAdd = true;
            }
            if (canAdd) {
                const fullName = path.join(contentsDir, fileName); // 将 cwd 和 source 组合成绝对路径
                const stats = fs.statSync(fullName);
                if (stats.isDirectory()) {
                    archive.directory(fullName, fileName);
                } else {
                    archive.file(fullName, { name: fileName });
                }
            }
        }
        await archive.finalize();
        info(`packaged ${chalk.blue("file")}=${path.basename(outputName)} ${chalk.blue("size")}=${archive.pointer()} bytes`);
        return outputName;
    }
} 