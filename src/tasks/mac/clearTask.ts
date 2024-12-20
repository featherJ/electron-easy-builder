import fs from "fs-extra";
import path from "path";
import { ITask, TaskBase } from "tasks/common";
import { removeSpace } from "utils/string";
/**
 * 清理mac构建任务
 */
export class ClearMacTask extends TaskBase implements ITask{
    constructor(){
        super("Clear mac output")
    }

    private sourceConfig:any;
    private packageConfig:any;
    private projectDir:string;
    private all:boolean;
    public init(sourceConfig:any,packageConfig:any,projectDir:string,all:boolean): void {
        this.sourceConfig = sourceConfig;
        this.packageConfig = packageConfig;
        this.projectDir = projectDir;
        this.all = all;
    }

    public async run(): Promise<void> {
        let outputName = path.join(this.projectDir,this.sourceConfig.output);
        let macFilename = path.join(outputName,"mac");
        let macArm64Filename = path.join(outputName,"mac-arm64");
        let builderEffectiveConfigFilename = path.join(outputName,"builder-effective-config.yaml");
        let builderDebugFilename = path.join(outputName,"builder-debug.yml");
        fs.removeSync(macFilename);
        fs.removeSync(macArm64Filename);
        fs.removeSync(builderEffectiveConfigFilename);
        fs.removeSync(builderDebugFilename);
        let x64BlockMapFilename = path.join(outputName, `${removeSpace(this.sourceConfig.productName)}-${this.packageConfig.version}-intel.dmg.blockmap`);
        let arm64BlockMapFilename = path.join(outputName, `${removeSpace(this.sourceConfig.productName)}-${this.packageConfig.version}-apple-silicon.dmg.blockmap`);
        fs.removeSync(x64BlockMapFilename);
        fs.removeSync(arm64BlockMapFilename);
        let latestMacFilename = path.join(outputName,"latest-mac.yml");
        fs.removeSync(latestMacFilename);
        if(this.all){
            let x64DmgFilename = path.join(outputName, `${removeSpace(this.sourceConfig.productName)}-${this.packageConfig.version}-intel.dmg`);
            let x64ResourceFilename = path.join(outputName, `${removeSpace(this.sourceConfig.productName)}-${this.packageConfig.version}-intel-minimal-update.zip`);
            let x64FullFilename = path.join(outputName, `${removeSpace(this.sourceConfig.productName)}-${this.packageConfig.version}-intel-full-update.zip`);
            let arm64DmgFilename = path.join(outputName, `${removeSpace(this.sourceConfig.productName)}-${this.packageConfig.version}-apple-silicon.dmg`);
          
            let arm64ResourceFilename = path.join(outputName, `${removeSpace(this.sourceConfig.productName)}-${this.packageConfig.version}-apple-silicon-minimal-update.zip`);
            let arm64FullFilename = path.join(outputName, `${removeSpace(this.sourceConfig.productName)}-${this.packageConfig.version}-apple-silicon-full-update.zip`);
            fs.removeSync(x64DmgFilename);
            fs.removeSync(x64ResourceFilename);
            fs.removeSync(x64FullFilename);
            fs.removeSync(arm64DmgFilename);
            fs.removeSync(arm64ResourceFilename);
            fs.removeSync(arm64FullFilename);
        }
    }
} 