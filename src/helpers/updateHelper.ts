import path from "path";
import fs from "fs";
import { ArchUpdate, Platform, UpdateConfig } from "configs/common";


/**
 * 更新配置操作
 */
export class UpdateConfigHelper{
    private filename:string;
    private platform:Platform;
    /**
     * @param config 原始配置或打包配置都可以
     * @param projectDir 
     */
    constructor(config:any,projectDir:string,platform:Platform){
        let output = config.output ? config.output : config.directories.output;
        this.platform = platform;
        this.filename = path.join(projectDir,output,`app-update.json`);
    }

    private config:any;
    /**
     * 得到当前的配置
     * @returns 
     */
    public getUpdateConfig():UpdateConfig{
        let updateConfig:any = {};
        if(fs.existsSync(this.filename)){
            try {
                updateConfig = JSON.parse(fs.readFileSync(this.filename, 'utf8'))
            } catch (error) {
            }
        }
        this.config = updateConfig;

        let platform = this.platform;
        if(!(platform in updateConfig)){
            updateConfig[platform] = {};
        }
        let targetConfig = updateConfig[platform] as UpdateConfig;
        if(!targetConfig.releaseNotes){
            targetConfig.releaseNotes = [];
        }
        return targetConfig;
    }
    
    /**
     * 保存配置
     * @param config 
     */
    public saveUpdateConfig():void{
        let configStr = JSON.stringify(this.config,null,2);
        fs.writeFileSync(this.filename,configStr,{ encoding: 'utf8' });
    }

    /**
     * 得到指定架构的配置
     * @param config 
     * @param arch 
     * @returns 
     */
    public getArchUpdateConfig(config:UpdateConfig,arch:"x64" | "arm64" | "x86"):ArchUpdate{
        if(config[arch]){
            return config[arch];
        }
        let archConfig = {
            download:{},
            minimal:{},
            full:{}
        } as ArchUpdate;
        config[arch] = archConfig;
        return archConfig;
    }
}



