import { ITask, TaskBase } from "tasks/common";
import { Configuration } from "electron-builder"
import { requireDynamically } from "base/dynamicImport";
// import { build } from "electron-builder"

/**
 * win 应用构建任务
 */
export class BuildWinTask extends TaskBase implements ITask {
    constructor() {
        super("Win builder")
    }

    private electronBuilderConfig: Configuration;
    private projectDir: string;
    public init(electronBuilderConfig: Configuration, projectDir: string): void {
        this.electronBuilderConfig = electronBuilderConfig;
        this.projectDir = projectDir;
    }

    public async run(): Promise<boolean> {
        const { build } = requireDynamically("electron-builder")
        await build({
            config: this.electronBuilderConfig,
            x64: true,
            ia32: true,
            win: [],
            projectDir: this.projectDir
        })
        return true;
    }
} 