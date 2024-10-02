import { generateElectronBuilderConfig } from "helpers/configHelper";
import { runTask } from "tasks/common";
import { AddBuildInfoWinTask } from "tasks/win/addBuildInfoTask";
import { AddFileAssociationsTask } from "tasks/win/addFileAssociationsTask";
import { BuildWinTask } from "tasks/win/buildTask";
import { ClearWinTask } from "tasks/win/clearTask";
import { PackExeTask } from "tasks/win/packExeTask";
import { PackExeUpdaterTask } from "tasks/win/packUpdaterTask";
import { SetUpdateConfigWinTask } from "tasks/win/setUpdateConfigTask";
import { Initer } from "./initer";

export class WinPacker {
    private initer: Initer;
    constructor(initer: Initer) {
        this.initer = initer;
    }

    public async pack(): Promise<void> {
        //先清理输出目录
        const clearWinTask = new ClearWinTask();
        clearWinTask.init(this.initer.builderConfig, this.initer.packageConfig, this.initer.projectDir, true);
        await runTask(clearWinTask);

        //打包win的app
        const buildTask = new BuildWinTask();
        buildTask.init(this.initer.builderConfig, this.initer.projectDir);
        await runTask(buildTask);

        //添加构建信息
        const addBuildInfoTask = new AddBuildInfoWinTask();
        addBuildInfoTask.init(this.initer.builderConfig, this.initer.projectDir);
        const buildConfig = await runTask(addBuildInfoTask);

        //添加图标资源
        const addFileAssociationsTask = new AddFileAssociationsTask();
        addFileAssociationsTask.init(this.initer.builderConfig, this.initer.projectDir);
        let winFileAssociations = await runTask(addFileAssociationsTask);

        //打包exe 安装包
        const packExeTask = new PackExeTask();
        packExeTask.init(this.initer.builderConfig, this.initer.packageConfig, this.initer.projectDir,winFileAssociations);
        let exeOutputs = await runTask(packExeTask);

        //打包exe 更新包
        const packExeUpdaterTask = new PackExeUpdaterTask();
        packExeUpdaterTask.init(this.initer.builderConfig, this.initer.packageConfig, this.initer.projectDir,winFileAssociations);
        let exeUpdaterOutputs = await runTask(packExeUpdaterTask);

        //设置更新配置文件
        let setUpdateConfigTask = new SetUpdateConfigWinTask();
        setUpdateConfigTask.init(this.initer.builderConfig, this.initer.packageConfig, this.initer.projectDir, exeOutputs.concat(exeUpdaterOutputs), buildConfig);
        await runTask(setUpdateConfigTask);

        //清理过程文件
        const clearWinAllTask = new ClearWinTask();
        clearWinAllTask.init(this.initer.builderConfig, this.initer.packageConfig, this.initer.projectDir, false);
        await runTask(clearWinAllTask);
    }
}