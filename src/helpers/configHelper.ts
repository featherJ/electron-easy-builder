import { NotarizeConfig } from "configs/NotarizeConfig";
import { Configuration } from "electron-builder";

/**
 * 提取electron-builder使用的yml配置
 * @param sourceConfig 
 * @returns 
 */
export function extractElectronBuilderConfig(sourceConfig: any): Configuration {
    let config: any = {};
    //base info
    config.appId = sourceConfig.appId; //必须
    config.productName = sourceConfig.productName; //必须
    config.copyright = sourceConfig.copyright;

    //asar info
    config.asar = sourceConfig.asar;
    config.asarUnpack = sourceConfig.asarUnpack;

    //build info
    config.buildDependenciesFromSource = sourceConfig.buildDependenciesFromSource;
    config.nodeGypRebuild = sourceConfig.nodeGypRebuild;
    config.npmRebuild = sourceConfig.npmRebuild;

    //files info
    config.files = sourceConfig.files; //必须
    config.directories = { output: sourceConfig.output } //必须

    //file associations
    if (sourceConfig.fileAssociations) {
        config.fileAssociations = (sourceConfig.fileAssociations as any[]).concat();
    }

    //mac config
    if (sourceConfig.mac) {
        config.mac = {
            category: sourceConfig.mac.category,
            icon: sourceConfig.mac.icon,
            type: "distribution",
            target: ["dir"]
        }
        if (sourceConfig.mac.sign) {
            config.mac.identity = sourceConfig.mac.sign.identity;
            config.mac.entitlements = sourceConfig.mac.sign.entitlements;
            config.mac.entitlementsInherit = sourceConfig.mac.sign.entitlements;
        }
    }

    //win config
    if (sourceConfig.win) {
        config.win = {
            icon: sourceConfig.win.appIcon,
            target: ["dir"]
        }
        if (sourceConfig.win.sign) {
            config.win.certificateFile = sourceConfig.win.sign.certificateFile;
            config.win.certificatePassword = sourceConfig.win.sign.certificatePassword;
            config.win.timeStampServer = sourceConfig.win.sign.timeStampServer;
            config.win.rfc3161TimeStampServer = sourceConfig.win.sign.rfc3161TimeStampServer;
            config.win.signingHashAlgorithms = sourceConfig.win.sign.signingHashAlgorithms;
        }
    }

    return config;
}

/**
 * 生成公证用的配置
 * @param sourceConfig 
 */
export function extractNotarizeConfig(sourceConfig: any): NotarizeConfig {
    if(sourceConfig.mac?.notarize){
        let config:NotarizeConfig = {
            appleId: sourceConfig.mac.notarize.appleId,
            appleIdPassword: sourceConfig.mac.notarize.appleIdPassword,
            teamId:  sourceConfig.mac.notarize.teamId,
            notarytoolPath: sourceConfig.mac.notarize.notarytoolPath,
        };
        return config;
    }
    return null;
}