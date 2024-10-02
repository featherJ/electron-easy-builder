import { generateNotarizeConfig } from "helpers/configHelper";
import { runTask } from "tasks/common";
import { AddBuildInfoMacTask } from "tasks/mac/addBuildInfoTask";
import { BuildMacTask } from "tasks/mac/buildTask";
import { ClearMacTask } from "tasks/mac/clearTask";
import { NotarizeMacTask } from "tasks/mac/notarizeTask";
import { PackDmgTask_electronBuilder } from "tasks/mac/packDmgTask_electronBuilder";
import { PackMacUpdaterTask } from "tasks/mac/packUpdaterTask";
import { SetUpdateConfigMacTask } from "tasks/mac/setUpdateConfigTask";
import { Initer } from "./initer";

export class MacPacker {
    private initer: Initer;
    constructor(initer: Initer) {
        this.initer = initer;
    }

    public async pack(): Promise<void> {
        //先清理输出目录
        const clearTask = new ClearMacTask();
        clearTask.init(this.initer.builderConfig, this.initer.packageConfig, this.initer.projectDir, true);
        await runTask(clearTask);

        //打包mac的app
        const buildTask = new BuildMacTask();
        buildTask.init(this.initer.builderConfig, this.initer.projectDir);
        await runTask(buildTask);

        //添加构建信息
        const addBuildInfoTask = new AddBuildInfoMacTask();
        addBuildInfoTask.init(this.initer.builderConfig, this.initer.projectDir);
        const buildConfig = await runTask(addBuildInfoTask);

        //公正与装订
        let notarizeConfig = generateNotarizeConfig(this.initer.builderConfig);
        if (notarizeConfig) {
            const notarizeMacTask = new NotarizeMacTask();
            notarizeMacTask.init(this.initer.builderConfig, notarizeConfig, this.initer.projectDir);
            await runTask(notarizeMacTask);
        }

        //打包dmg
        // 由于appdmg，当title超过27个字符的时候会报错，所以我把库给改了。但是不知道是否会引发什么问题，所以改回了使用 electron builder 打包dmg
        // const packDmgTask = new PackDmgTask_appdmg();
        const packDmgTask = new PackDmgTask_electronBuilder();
        packDmgTask.init(this.initer.builderConfig, this.initer.packageConfig, this.initer.projectDir);
        let dmgOutputs = await runTask(packDmgTask);

        //打更新包
        const packMacUpdateTask = new PackMacUpdaterTask();
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