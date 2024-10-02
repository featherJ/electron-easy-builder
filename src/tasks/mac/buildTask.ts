import { ITask, TaskBase } from "tasks/common";
import { Configuration } from "electron-builder"
import { requireDynamically } from "base/dynamicImport";
import { generateElectronBuilderConfig } from "helpers/configHelper";

/**
 * mac app 构建任务
 */
export class BuildMacTask extends TaskBase implements ITask{
    constructor(){
        super("Mac builder")
    }

    private sourceConfig:Configuration;
    private projectDir:string;
    public init(sourceConfig:any,projectDir:string): void {
        this.sourceConfig = sourceConfig;
        this.projectDir = projectDir;
    }

    public async run(): Promise<void> {
        let electronBuilderConfig = generateElectronBuilderConfig(this.sourceConfig,"mac");
        const { build } = requireDynamically("electron-builder")
        await build({
            config:electronBuilderConfig,
            x64: true,
            arm64: true,
            mac:[],
            projectDir:this.projectDir
        })
    }
} 