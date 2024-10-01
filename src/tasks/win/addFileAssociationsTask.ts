import { AppPath, WinFileAssociation } from "configs/common";
import fs from "fs-extra";
import { getWinAppPaths } from "helpers/configHelper";
import path from "path";
import { ITask, TaskBase } from "tasks/common";

/**
 * win的文件关联，图标资源放到应用中
 */
export class AddFileAssociationsTask extends TaskBase implements ITask {
    constructor() {
        super("Win file associations")
    }

    private sourceConfig: any;
    private projectDir: string;

    /**
     * 初始化任务
     * @param sourceConfig 原始配置
     * @param projectDir 项目的工作目录
     */
    public init(sourceConfig: any, projectDir: string): void {
        this.sourceConfig = sourceConfig;
        this.projectDir = projectDir;
    }

    public async run(): Promise<WinFileAssociation[]> {
        if(this.sourceConfig.fileAssociations){
            let winFileAssociations:WinFileAssociation[] = [];
            let appPaths = getWinAppPaths(this.sourceConfig,this.projectDir);
            for(var i = 0;i<this.sourceConfig.fileAssociations.length;i++){
                let curFile = this.sourceConfig.fileAssociations[i];
                if("iconWin" in curFile){
                    let iconWin = curFile.iconWin as string;
                    let lastIndex = iconWin.lastIndexOf(".");
                    if(lastIndex == -1){
                        throw `The "iconWin" extension in "${curFile.name}" of "fileAssociations" must end with "ico"`;
                    }
                    let iconExt = iconWin.slice(lastIndex+1).toLocaleLowerCase();
                    if(iconExt != "ico"){
                        throw `The "iconWin" extension in "${curFile.name}" of "fileAssociations" must end with "ico"`;
                    }
                    let sourceFilename = path.join(this.projectDir,iconWin);
                    appPaths.forEach(appPath=>{
                        let outputDir = path.join(appPath.path,"resources/fileTypes");
                        fs.ensureDirSync(outputDir);
                        let outputFilename = path.join(outputDir,`${curFile.ext}.ico`);
                        fs.copyFileSync(sourceFilename,outputFilename);
                    });
                    winFileAssociations.push({
                        ext:curFile.ext,
                        name:curFile.name,
                        description:curFile.description ?  curFile.description : curFile.name,
                        icon:path.join("resources/fileTypes",`${curFile.ext}.ico`)
                    });
                }else{
                    throw `Unable to find "iconWin" in "${curFile.name}" of "fileAssociations"`;
                }
            }
            return winFileAssociations;
        }
        return null;
    }
} 