import { requireDynamically } from "base/dynamicImport";
import { Configuration } from "electron-builder";
import { generateElectronBuilderConfig } from "helpers/configHelper";
import { ITask, TaskBase } from "tasks/common";

/**
 * win 应用构建任务
 */
export class BuildWinTask extends TaskBase implements ITask {
    constructor() {
        super("Win builder")
    }

    private sourceConfig: any;
    private projectDir: string;
    public init(sourceConfig: any, projectDir: string): void {
        this.sourceConfig = sourceConfig;
        this.projectDir = projectDir;
    }

    public async run(): Promise<boolean> {
        let electronBuilderConfig = generateElectronBuilderConfig(this.sourceConfig,"win");
        const { build } = requireDynamically("electron-builder")
        await build({
            config: electronBuilderConfig,
            x64: true,
            ia32: true,
            win: [],
            projectDir: this.projectDir
        })
        return true;
    }
} 