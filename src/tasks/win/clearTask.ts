import fs from "fs-extra";
import path from "path";
import { ITask, TaskBase } from "tasks/common";
import { removeSpace } from "utils/string";
/**
 * 清理win构建任务
 */
export class ClearWinTask extends TaskBase implements ITask{
    constructor(){
        super("Clear win output")
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
        let winUnpackedFilename = path.join(outputName,"win-unpacked");
        let winIa32UnpackedFilename = path.join(outputName,"win-ia32-unpacked");
        let builderEffectiveConfigFilename = path.join(outputName,"builder-effective-config.yaml");
        let builderDebugFilename = path.join(outputName,"builder-debug.yml");
        fs.removeSync(winUnpackedFilename);
        fs.removeSync(winIa32UnpackedFilename);
        fs.removeSync(builderEffectiveConfigFilename);
        fs.removeSync(builderDebugFilename);
        if(this.all){
            let x64Filename = path.join(outputName, `${removeSpace(this.sourceConfig.productName)}-${this.packageConfig.version}-x64.exe`);
            let x64ResourceFilename = path.join(outputName, `${removeSpace(this.sourceConfig.productName)}-${this.packageConfig.version}-x64-resource-update.exe`);
            let x86Filename = path.join(outputName, `${removeSpace(this.sourceConfig.productName)}-${this.packageConfig.version}-x86.exe`);
            let x86ResourceFilename = path.join(outputName, `${removeSpace(this.sourceConfig.productName)}-${this.packageConfig.version}-x86-resource-update.exe`);
            fs.removeSync(x64Filename);
            fs.removeSync(x64ResourceFilename);
            fs.removeSync(x86Filename);
            fs.removeSync(x86ResourceFilename);
        }
    }
} 