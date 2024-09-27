import { AppDmgConfig, AppPath, NotarizeConfig } from "configs/common";
import { Configuration } from "electron-builder";
import path from "path";
import fs from "fs";
import YAML from 'yaml';

/**
 * 提取electron-builder使用的yml配置
 * @param builderConfig 
 * @returns 
 */
export function extractElectronBuilderConfig(builderConfig: any): Configuration {
    let config: any = {};
    //base info
    config.appId = builderConfig.appId; //必须
    config.productName = builderConfig.productName; //必须
    config.copyright = builderConfig.copyright;

    //asar info
    config.asar = builderConfig.asar;
    config.asarUnpack = builderConfig.asarUnpack;

    //build info
    config.buildDependenciesFromSource = builderConfig.buildDependenciesFromSource;
    config.nodeGypRebuild = builderConfig.nodeGypRebuild;
    config.npmRebuild = builderConfig.npmRebuild;

    //files info
    config.files = builderConfig.files; //必须
    config.directories = { output: builderConfig.output } //必须

    //file associations
    if (builderConfig.fileAssociations) {
        config.fileAssociations = (builderConfig.fileAssociations as any[]).concat();
    }

    //mac config
    if (builderConfig.mac) {
        config.mac = {
            category: builderConfig.mac.category,
            icon: builderConfig.mac.icon,
            type: "distribution",
            target: ["dir"],
            extendInfo: builderConfig.mac.extendInfo,
            extraResources: builderConfig.mac.extraResources,
        }
        if (builderConfig.mac.sign) {
            config.mac.identity = builderConfig.mac.sign.identity;
            config.mac.entitlements = builderConfig.mac.sign.entitlements;
            config.mac.entitlementsInherit = builderConfig.mac.sign.entitlements;
        }
    }

    //win config
    if (builderConfig.win) {
        config.win = {
            icon: builderConfig.win.appIcon,
            target: ["dir"]
        }
        if (builderConfig.win.sign) {
            config.win.certificateFile = builderConfig.win.sign.certificateFile;
            config.win.certificatePassword = builderConfig.win.sign.certificatePassword;
            config.win.timeStampServer = builderConfig.win.sign.timeStampServer;
            config.win.rfc3161TimeStampServer = builderConfig.win.sign.rfc3161TimeStampServer;
            config.win.signingHashAlgorithms = builderConfig.win.sign.signingHashAlgorithms;
        }
    }

    return config;
}

/**
 * 提取公证用的配置
 * @param builderConfig 
 */
export function extractNotarizeConfig(builderConfig: any): NotarizeConfig {
    if (builderConfig.mac?.notarize) {
        let config: NotarizeConfig = {
            appleId: builderConfig.mac.notarize.appleId,
            appleIdPassword: builderConfig.mac.notarize.appleIdPassword,
            teamId: builderConfig.mac.notarize.teamId,
            notarytoolPath: builderConfig.mac.notarize.notarytoolPath,
        };
        return config;
    }
    return null;
}
/**
 * 提取打包dmg的配置
 * @param builderConfig 
 * @returns 
 */
export function generatePackDmgConfig(builderConfig: any, packageConfig: any, projectDir: string, appPath: AppPath): AppDmgConfig {
    if (builderConfig.mac?.pack) {
        let windowWidth = builderConfig.mac.pack.window.width;
        let windowHeight = builderConfig.mac.pack.window.height;
        let iconSize = builderConfig.mac.pack.iconSize;
        let config: AppDmgConfig = {
            basepath: projectDir,
            target: path.join(projectDir, builderConfig.output, `${builderConfig.productName}-${packageConfig.version}-${appPath.arch == "x64" ? "intel" : "apple-silicon"}.dmg`),
            specification: {
                title: builderConfig.mac.pack.title ? builderConfig.mac.pack.title : `${builderConfig.productName} ${packageConfig.version}`,
                icon: builderConfig.mac.pack.icon ? builderConfig.mac.pack.icon : builderConfig.mac.icon,
                "icon-size": iconSize,
                background: builderConfig.mac.pack.background,
                window: {
                    size: {
                        width: windowWidth,
                        height: windowHeight
                    }
                },
                contents: [
                    { x: builderConfig.mac.pack.contents.from.x, y: builderConfig.mac.pack.contents.from.y, type: "file", path: appPath.path },
                    { x: builderConfig.mac.pack.contents.to.x, y: builderConfig.mac.pack.contents.to.y, type: "link", path: "/Applications" },
                    { x: 2760, y: 170, type: "position", path: ".VolumeIcon.icns" },
                    { x: 2610, y: 170, type: "position", path: ".DS_Store" },
                    { x: 2560, y: 170, type: "position", path: ".background" },
                    { x: 2710, y: 170, type: "position", path: ".Trashes" },
                    { x: 2660, y: 170, type: "position", path: ".fseventsd" }
                ]
            }
        };
        return config;
    }
    return null;
}

/**
 * 生成dmg打包的license配置
 * @param builderConfig 
 * @returns 
 */
export function generateDmgLicenseConfig(builderConfig: any, projectDir: string): any {
    if (builderConfig.mac?.pack?.license) {
        let licensePath = path.join(projectDir, builderConfig.mac.pack.license);
        if (!fs.existsSync(licensePath)) {
            throw `Folder ${licensePath} does not exist`
        } else if (!fs.statSync(licensePath).isDirectory) {
            throw `${licensePath} is not a folder`
        } else {
            const jsonFile: any = {
                $schema: "https://github.com/argv-minus-one/dmg-license/raw/master/schema.json",
                body: [],
                labels: [],
            };

            const licenseRegex = /^license\.([a-z]{2}_[A-Z]{2})\.txt$/;
            const licenseButtonsJsonRegex = /^license_buttons\.([a-z]{2}_[A-Z]{2})\.json$/;
            const licenseButtonsYmlRegex = /^license_buttons\.([a-z]{2}_[A-Z]{2})\.yml$/;

            let files = fs.readdirSync(licensePath);
            files.forEach((value) => {
                let filePath = path.join(licensePath, value);
                const licenseMatches = value.match(licenseRegex);
                if (licenseMatches && licenseMatches[1]) {
                    //协议文本文件
                    let lang = licenseMatches[1].replace("_", "-");
                    jsonFile.body.push({
                        file: filePath,
                        lang: lang,
                    });
                }

                let buttonsData: any = null;
                let buttonsLang: string = "";
                let buttonsType: "json" | "yml" = null

                const licenseButtonsJsonMatches = value.match(licenseButtonsJsonRegex);
                if (licenseButtonsJsonMatches && licenseButtonsJsonMatches[1]) {
                    buttonsLang = licenseButtonsJsonMatches[1].replace("_", "-");
                    let jsonContent = fs.readFileSync(filePath, 'utf8');
                    try {
                        buttonsData = JSON.parse(jsonContent);
                        buttonsType = "json";
                    } catch (error) {
                        throw `File ${filePath} cannot be parsed into Json. Please ensure that the file content is in the correct format and is UTF8 encoded.`
                    }
                }

                const licenseButtonsYmlMatches = value.match(licenseButtonsYmlRegex);
                if (licenseButtonsYmlMatches && licenseButtonsYmlMatches[1]) {
                    buttonsLang = licenseButtonsYmlMatches[1].replace("_", "-");
                    let ymlContent = fs.readFileSync(filePath, 'utf8');
                    try {
                        buttonsData = YAML.parse(ymlContent);
                        buttonsType = "yml";
                    } catch (error) {
                        throw `File ${filePath} cannot be parsed into Yml. Please ensure that the file content is in the correct format and is UTF8 encoded.`;
                    }
                }

                if (buttonsData) {
                    if ("agree" in buttonsData && typeof buttonsData["agree"] === 'string' &&
                        "disagree" in buttonsData && typeof buttonsData["disagree"] === 'string' &&
                        "print" in buttonsData && typeof buttonsData["print"] === 'string' &&
                        "save" in buttonsData && typeof buttonsData["save"] === 'string' &&
                        "message" in buttonsData && typeof buttonsData["message"] === 'string') {
                        jsonFile.labels.push(Object.assign({ lang: buttonsLang }, buttonsData));
                    } else {
                        throw `The content of file ${filePath} has a format error.
The json file template is:
{
    "agree": "Agree",
    "disagree": "Disagree",
    "print": "Print",
    "save": "Save",
    "message": "Here is my own message"
}

The yml file template is:
agree: Agree
disagree: Disagree
print: Print
save: Save
message: "Here is my own message"
`;
                    }
                }
            });
            if (jsonFile.body.length > 0) {
                return jsonFile;
            }
            return null;
        }
    }
    return null;
}




/**
 * 得到两个输出的app的路径
 * @param config 原始配置或打包配置都可以 
 * @param projectDir 
 */
export function getAppPaths(config: any, projectDir: string): AppPath[] {
    let output = config.output ? config.output : config.directories.output;
    let pathX64 = path.join(projectDir, output, "mac", config.productName + ".app")
    let pathArm64 = path.join(projectDir, output, "mac-arm64", config.productName + ".app")
    let apps: AppPath[] = [];
    if (fs.existsSync(pathX64)) {
        apps.push({
            path: pathX64,
            arch: "x64"
        });
    }
    if (fs.existsSync(pathArm64)) {
        apps.push({
            path: pathArm64,
            arch: "arm64"
        });
    }
    return apps;
}