import { ITask, TaskBase } from "tasks/common";
import { Configuration } from "electron-builder"
import { requireDynamically } from "base/dynamicImport";

/**
 * mac app 构建任务
 */
export class BuildMacTask extends TaskBase implements ITask{
    constructor(){
        super("Mac builder")
    }

    private electronBuilderConfig:Configuration;
    private projectDir:string;
    public init(electronBuilderConfig:Configuration,projectDir:string): void {
        this.electronBuilderConfig = electronBuilderConfig;
        this.projectDir = projectDir;
    }

    public async run(): Promise<boolean> {
        const { build } = requireDynamically("electron-builder")
        let result = await build({
            config:this.electronBuilderConfig,
            x64: true,
            arm64: true,
            mac:[],
            projectDir:this.projectDir
        })
        console.log("fuck",result)
        return true;
    }
} 