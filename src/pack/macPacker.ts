import { extractElectronBuilderConfig, extractNotarizeConfig } from "helpers/configHelper";
import { runTask } from "tasks/common";
import { AddBuildInfoMacTask } from "tasks/mac/addBuildInfoTask";
import { BuildMacTask } from "tasks/mac/buildTask";
import { ClearMacTask } from "tasks/mac/clearMacTask";
import { NotarizeMacTask } from "tasks/mac/notarizeTask";
import { PackDmgTask } from "tasks/mac/packDmgTask";
import { Initer } from "./initer";
import { PackMacUpdateTask } from "tasks/mac/packUpdateTask";
import { SetUpdateConfigMacTask } from "tasks/mac/setUpdateConfigTask";

export class MacPacker {
    private initer: Initer;
    constructor(initer: Initer) {
        this.initer = initer;
    }

    public async pack(): Promise<void> {
        //先清理输出目录
        const clearMacTask = new ClearMacTask();
        clearMacTask.init(this.initer.builderConfig, this.initer.packageConfig, this.initer.projectDir, true);
        await runTask(clearMacTask);

        const electronBuilderConfig = extractElectronBuilderConfig(this.initer.builderConfig);

        //打包mac的app
        const buildMacTask = new BuildMacTask();
        buildMacTask.init(electronBuilderConfig, this.initer.projectDir);
        await runTask(buildMacTask);

        //添加构建信息
        const addBuildInfoMacTask = new AddBuildInfoMacTask();
        addBuildInfoMacTask.init(this.initer.builderConfig, this.initer.projectDir);
        const buildConfig = await runTask(addBuildInfoMacTask);

        //公正与装订
        let notarizeConfig = extractNotarizeConfig(this.initer.builderConfig);
        if (notarizeConfig) {
            const notarizeMacTask = new NotarizeMacTask();
            notarizeMacTask.init(electronBuilderConfig, notarizeConfig, this.initer.projectDir);
            await runTask(notarizeMacTask);
        }

        //打包dmg
        const packDmgTask = new PackDmgTask();
        packDmgTask.init(this.initer.builderConfig, this.initer.packageConfig, this.initer.projectDir);
        let dmgOutputs = await runTask(packDmgTask);

        //打更新包
        const packMacUpdateTask = new PackMacUpdateTask();
        packMacUpdateTask.init(this.initer.builderConfig, this.initer.packageConfig, this.initer.projectDir);
        let updateOutputs = await runTask(packMacUpdateTask);

        //设置更新配置文件
        let setUpdateConfigTask = new SetUpdateConfigMacTask();
        setUpdateConfigTask.init(this.initer.builderConfig, this.initer.packageConfig, this.initer.projectDir, dmgOutputs.concat(updateOutputs), buildConfig);
        await runTask(setUpdateConfigTask);

        //清理过程文件
        const clearMacAllTask = new ClearMacTask();
        clearMacAllTask.init(this.initer.builderConfig, this.initer.packageConfig, this.initer.projectDir, false);
        await runTask(clearMacAllTask);
    }
}