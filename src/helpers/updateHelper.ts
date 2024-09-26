import path from "path";
import fs from "fs";
import { ArchUpdate, UpdateConfig } from "configs/common";


/**
 * 更新配置操作
 */
export class UpdateConfigHelper{
    private filename:string;
    /**
     * @param config 原始配置或打包配置都可以
     * @param projectDir 
     */
    constructor(config:any,projectDir:string,platform:"mac"|"win"){
        let output = config.output ? config.output : config.directories.output;
        this.filename = path.join(projectDir,output,`app-${platform}-update.json`);
    }

    /**
     * 得到已有的配置
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
        return updateConfig as UpdateConfig;
    }
    
    /**
     * 设置新的配置
     * @param config 
     */
    public setUpdateConfig(config:UpdateConfig):void{
        let configStr = JSON.stringify(config,null,2);
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
            resource:{},
            full:{}
        } as ArchUpdate;
        config[arch] = archConfig;
        return archConfig;
    }
}



