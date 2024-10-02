import { extractElectronBuilderConfig, extractNotarizeConfig, generateSetupIss } from "helpers/configHelper";
import { runTask } from "tasks/common";
import { AddBuildInfoMacTask } from "tasks/mac/addBuildInfoTask";
import { BuildMacTask } from "tasks/mac/buildTask";
import { ClearMacTask } from "tasks/mac/clearMacTask";
import { NotarizeMacTask } from "tasks/mac/notarizeTask";
import { PackDmgTask } from "tasks/mac/packDmgTask";
import { Initer } from "./initer";
import { PackMacUpdaterTask } from "tasks/mac/packUpdaterTask";
import { SetUpdateConfigMacTask } from "tasks/mac/setUpdateConfigTask";
import { BuildWinTask } from "tasks/win/buildTask";
import { AddBuildInfoWinTask } from "tasks/win/addBuildInfoTask";
import { PackExeTask } from "tasks/win/packExeTask";
import { AddFileAssociationsTask } from "tasks/win/addFileAssociationsTask";
import { WinFileAssociation } from "configs/common";
import { PackExeUpdaterTask } from "tasks/win/packUpdaterTask";

export class WinPacker {
    private initer: Initer;
    constructor(initer: Initer) {
        this.initer = initer;
    }

    public async pack(): Promise<void> {
        //先清理输出目录
        // const clearMacTask = new ClearMacTask();
        // clearMacTask.init(this.initer.builderConfig, this.initer.packageConfig, this.initer.projectDir, true);
        // await runTask(clearMacTask);

        const electronBuilderConfig = extractElectronBuilderConfig(this.initer.builderConfig,"win");
        //打包win的app
        const buildTask = new BuildWinTask();
        buildTask.init(electronBuilderConfig, this.initer.projectDir);
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



        // //打更新包
        // const packMacUpdateTask = new PackMacUpdateTask();
        // packMacUpdateTask.init(this.initer.builderConfig, this.initer.packageConfig, this.initer.projectDir);
        // let updateOutputs = await runTask(packMacUpdateTask);

        // //设置更新配置文件
        // let setUpdateConfigTask = new SetUpdateConfigMacTask();
        // setUpdateConfigTask.init(this.initer.builderConfig, this.initer.packageConfig, this.initer.projectDir, dmgOutputs.concat(updateOutputs), buildConfig);
        // await runTask(setUpdateConfigTask);

        // //清理过程文件
        // const clearMacAllTask = new ClearMacTask();
        // clearMacAllTask.init(this.initer.builderConfig, this.initer.packageConfig, this.initer.projectDir, false);
        // await runTask(clearMacAllTask);
    }
}