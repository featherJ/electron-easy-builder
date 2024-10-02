import { AppDmgConfig, AppPath, NotarizeConfig, WinFileAssociation, WinSign } from "configs/common";
import { Configuration } from "electron-builder";
import fs from "fs";
import iconv from "iconv-lite";
import { tmpdir } from "os";
import path from "path";
import { libDir } from "utils/path";
import YAML from 'yaml';
import setupIss from '../../lib/setup.iss';
import updateIss from '../../lib/update.iss';
import { warn } from "utils/log";
import { json } from "stream/consumers";
import { removeSpace } from "utils/string";

/**
 * 提取electron-builder使用的yml配置
 * @param builderConfig 
 * @returns 
 */
export function extractElectronBuilderConfig(builderConfig: any, platform: "mac" | "win"): Configuration {
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
    config.extends = path.join(libDir(),"empty.json");//避免使用项目已经存在的electron-builder

    //file associations
    if (platform == "mac" && builderConfig.fileAssociations) {
        config.fileAssociations = [];
        for (var i = 0; i < builderConfig.fileAssociations.length; i++) {
            let curFile = builderConfig.fileAssociations[i];
            if ("iconMac" in curFile) {
                config.fileAssociations.push({
                    ext: curFile.ext,
                    name: curFile.name,
                    description: curFile.description,
                    icon: curFile.iconMac,
                    role: curFile.role ? curFile.role : "Editor"
                });
            } else {
                throw `Unable to find "iconMac" in "${curFile.name}" of "fileAssociations"`;
            }
        }
    }

    //mac config
    if (platform == "mac" && builderConfig.mac) {
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
    if (platform == "win" && builderConfig.win) {
        config.win = {
            icon: builderConfig.win.appIcon,
            extraResources: builderConfig.win.extraResources,
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
            target: path.join(projectDir, builderConfig.output, `${removeSpace(builderConfig.productName)}-${packageConfig.version}-${appPath.arch == "x64" ? "intel" : "apple-silicon"}.dmg`),
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
        let licenseDir = path.join(projectDir, builderConfig.mac.pack.license);
        if (!fs.existsSync(licenseDir)) {
            throw `Folder ${licenseDir} does not exist`
        } else if (!fs.statSync(licenseDir).isDirectory) {
            throw `${licenseDir} is not a folder`
        } else {
            const jsonFile: any = {
                $schema: "https://github.com/argv-minus-one/dmg-license/raw/master/schema.json",
                body: [],
                labels: [],
            };

            const licenseRegex = /^license\.([a-z]{2}(?:[-_][A-Z]{2})?)\.?(default)?\.txt$/;
            const licenseButtonsJsonRegex = /^license_buttons\.([a-z]{2}(?:[-_][A-Z]{2})?)\.json$/;
            const licenseButtonsYmlRegex = /^license_buttons\.([a-z]{2}(?:[-_][A-Z]{2})?)\.yml$/;

            let files = fs.readdirSync(licenseDir);
            files.forEach(value => {
                let filename = path.join(licenseDir, value);
                const licenseMatches = value.match(licenseRegex);
                if (licenseMatches && licenseMatches[1]) {
                    //协议文本文件
                    let lang = licenseMatches[1].replace("_", "-");
                    let isDefault = licenseMatches[2] == "default";
                    if (isDefault) {
                        jsonFile.body.unshift({
                            file: filename,
                            lang: lang,
                        });
                    } else {
                        jsonFile.body.push({
                            file: filename,
                            lang: lang,
                        });
                    }
                }

                let buttonsData: any = null;
                let buttonsLang: string = "";
                let buttonsType: "json" | "yml" = null

                const licenseButtonsJsonMatches = value.match(licenseButtonsJsonRegex);
                if (licenseButtonsJsonMatches && licenseButtonsJsonMatches[1]) {
                    buttonsLang = licenseButtonsJsonMatches[1].replace("_", "-");
                    let jsonContent = fs.readFileSync(filename, 'utf8');
                    try {
                        buttonsData = JSON.parse(jsonContent);
                        buttonsType = "json";
                    } catch (error) {
                        throw `File ${filename} cannot be parsed into Json. Please ensure that the file content is in the correct format and is UTF8 encoded.`
                    }
                }

                const licenseButtonsYmlMatches = value.match(licenseButtonsYmlRegex);
                if (licenseButtonsYmlMatches && licenseButtonsYmlMatches[1]) {
                    buttonsLang = licenseButtonsYmlMatches[1].replace("_", "-");
                    let ymlContent = fs.readFileSync(filename, 'utf8');
                    try {
                        buttonsData = YAML.parse(ymlContent);
                        buttonsType = "yml";
                    } catch (error) {
                        throw `File ${filename} cannot be parsed into Yml. Please ensure that the file content is in the correct format and is UTF8 encoded.`;
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
                        throw `The content of file ${filename} has a format error.
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
 * 得到mac两个输出的app的路径
 * @param config 原始配置或打包配置都可以 
 * @param projectDir 
 */
export function getMacAppPaths(config: any, projectDir: string): AppPath[] {
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

/**
 * 得到win两个输出的app的路径
 * @param config 原始配置或打包配置都可以 
 * @param projectDir 
 */
export function getWinAppPaths(config: any, projectDir: string): AppPath[] {
    let output = config.output ? config.output : config.directories.output;
    let pathX64 = path.join(projectDir, output, "win-unpacked")
    let pathX86 = path.join(projectDir, output, "win-ia32-unpacked")
    let apps: AppPath[] = [];
    if (fs.existsSync(pathX64)) {
        apps.push({
            path: pathX64,
            arch: "x64"
        });
    }
    if (fs.existsSync(pathX86)) {
        apps.push({
            path: pathX86,
            arch: "x86"
        });
    }
    return apps;
}


export function generateSetupIss(builderConfig: any, packageConfig: any, projectDir: string, appPath: AppPath, winFileAssociations: WinFileAssociation[],sign:boolean): {issFilename:string,outputFilename:string} {
    if (builderConfig.win?.pack) {
        let config = "";
        // define
        config += `#define AppId "${builderConfig.appId}"\n`;
        config += `#define AppName "${builderConfig.productName}"\n`;
        let nameVersion = builderConfig.win?.pack?.verName ? builderConfig.win?.pack?.verName : builderConfig.productName;
        config += `#define NameVersion "${nameVersion}"\n`;
        let publisher = builderConfig.win?.pack?.publisherName ? builderConfig.win?.pack?.publisherName : "";
        config += `#define Publisher "${publisher}"\n`;
        let publisherURL = builderConfig.win?.pack?.publisherName && builderConfig.win?.pack?.appUrl ? builderConfig.win?.pack?.appUrl : "";
        config += `#define PublisherURL "${publisherURL}"\n`;
        let supportURL = builderConfig.win?.pack?.appUrl ? builderConfig.win?.pack?.appUrl : "";
        config += `#define SupportURL "${supportURL}"\n`;
        let updatesURL = builderConfig.win?.pack?.appUrl ? builderConfig.win?.pack?.appUrl : "";
        config += `#define UpdatesURL "${updatesURL}"\n`;
        config += `#define OutputDir "${path.join(projectDir, builderConfig.output)}"\n`;
        let outputBasename = `${removeSpace(builderConfig.productName)}-${packageConfig.version}-${appPath.arch == "x64" ? "x64" : "x86"}`
        config += `#define OutputBasename "${outputBasename}"\n`;
        let outputFilename = path.join(projectDir, builderConfig.output,outputBasename+".exe");

        let wizardImageFile = builderConfig.win?.pack?.wizardImageFile ? path.join(projectDir, builderConfig.win?.pack?.wizardImageFile) : "";
        config += `#define WizardImageFile "${wizardImageFile}"\n`;
        let wizardSmallImageFile = builderConfig.win?.pack?.wizardSmallImageFile ? path.join(projectDir, builderConfig.win?.pack?.wizardSmallImageFile) : "";
        config += `#define WizardSmallImageFile "${wizardSmallImageFile}"\n`;
        let setupIcon = builderConfig.win?.pack?.setupIcon ? path.join(projectDir, builderConfig.win?.pack?.setupIcon) : "";
        config += `#define SetupIconFile "${setupIcon}"\n`;
        config += `#define ExeBasename "${builderConfig.productName + ".exe"}"\n`;
        config += `#define HasAssociations ${builderConfig.fileAssociations ? "yes" : "no"}\n`;
        config += `#define SourceDir "${appPath.path}"\n`;
        config += `#define Version "${packageConfig.version}"\n`;
        config += `#define ArchitecturesAllowed "${appPath.arch == "x64" ? "x64" : ""}"\n`;
        config += `#define DirName "${builderConfig.productName}"\n`;
        let appUserModelID = builderConfig.win?.pack?.appUserModelID ? builderConfig.win?.pack?.appUserModelID : "";
        config += `#define AppUserId "${appUserModelID}"\n`;
        config += `#define InstallTarget "user"\n`;
        let regValueName = builderConfig.win?.pack?.regValueName
        config += `#define RegValueName "${regValueName}"\n`;
        let friendlyAppName = builderConfig.win?.pack?.friendlyAppName ? builderConfig.win?.pack?.friendlyAppName : builderConfig.productName;
        config += `#define FriendlyName "${friendlyAppName}"\n`;
        config += `#define Sign "${sign ? "sign" : ""}"\n`;

        config += "\n";
        //languages
        type MessageItem = {
            langName: string,
            langCode: string,
            filename: string,
            isPreferred: boolean,
            license: string
        };

        //遍历已有的语言文件
        let languagesDir = path.join(libDir(), "languages");
        const islRegex = /^([A-Za-z]+)\.([a-z]{2}(?:[-_][A-Z]{2})?)\.isl$/;
        let files = fs.readdirSync(languagesDir);
        let messagesMap: { [langCode: string]: MessageItem } = {}
        files.forEach(value => {
            let filename = path.join(languagesDir, value);
            const islMatches = value.match(islRegex);
            if (islMatches && islMatches[1] && islMatches[2]) {
                let languageName = islMatches[1];
                languageName = languageName.charAt(0).toLowerCase() + languageName.slice(1);
                const languageCode = islMatches[2].replace("_", "-");
                messagesMap[languageCode] = {
                    langName: languageName,
                    langCode: languageCode,
                    filename: filename,
                    isPreferred: false,
                    license: ""
                };
            }
        });
        let firstMessage: MessageItem = null;
        let englishMessage: MessageItem = null;
        let defaultMessage: MessageItem = null;
        let langConfig = `[Languages]\n`;

        if (builderConfig.win?.pack?.license) {
            let licenseDir: string = path.join(projectDir, builderConfig.win?.pack?.license);
            if (!fs.existsSync(licenseDir)) {
                throw `Folder ${licenseDir} does not exist`
            } else if (!fs.statSync(licenseDir).isDirectory) {
                throw `${licenseDir} is not a folder`
            } else {
                const licenseRegex = /^license\.([a-z]{2}(?:[-_][A-Z]{2})?)\.?(default)?\.txt$/;
                let files = fs.readdirSync(licenseDir);

                files.forEach(value => {
                    let filename = path.join(licenseDir, value);
                    const licenseMatches = value.match(licenseRegex);
                    if (licenseMatches && licenseMatches[1]) {
                        //协议文本文件
                        let lang = licenseMatches[1].replace("_", "-");
                        let isDefault = licenseMatches[2] == "default";

                        let fileContent = fs.readFileSync(filename, { encoding: "utf8" });
                        // 检查并移除 BOM
                        if (fileContent.charCodeAt(0) === 0xFEFF) {
                            fileContent = fileContent.slice(1);
                        }
                        let output = path.join(tmpdir(), value);
                        let gbkBuffer = iconv.encode(fileContent, 'gbk');
                        fs.writeFileSync(output, gbkBuffer);
                        //查找对应的默认文本
                        let existMessage = messagesMap[lang];
                        if (!existMessage) {
                            let lang2 = lang.split("-")[0];
                            existMessage = messagesMap[lang2];
                        }
                        if (existMessage) {
                            existMessage.license = output;
                            if (!firstMessage) {
                                firstMessage = existMessage;
                            }
                            if (isDefault) {
                                defaultMessage = existMessage;
                            }
                            if (existMessage.langCode == "en") {
                                englishMessage = existMessage;
                            }
                        } else {
                            warn(`There is no built-in ${lang} language file yet`);
                        }
                    }
                });
                if (!defaultMessage) {
                    //没有配置任何多语言
                    if (englishMessage) {
                        //优先选择英语
                        defaultMessage = englishMessage;
                    } else {
                        //否则选择找到的第一个license作为默认
                        englishMessage = firstMessage;
                    }
                }
            }
        }

        if (defaultMessage) {
            defaultMessage.isPreferred = true;
            langConfig += `Name: "${defaultMessage.langName}"; MessagesFile: "${defaultMessage.filename}"; LicenseFile:"${defaultMessage.license}"\n`;
            //设置了协议文件
            for (let l in messagesMap) {
                let message = messagesMap[l];
                if (!message.isPreferred) {
                    if (message.license) {
                        langConfig += `Name: "${message.langName}"; MessagesFile: "${message.filename}"; LicenseFile:"${message.license}"\n`;
                    } else {
                        langConfig += `Name: "${message.langName}"; MessagesFile: "${message.filename}"; LicenseFile:"${defaultMessage.license}"\n`;
                    }
                }
            }
        } else {
            //没有设置任何的协议文件
            englishMessage = messagesMap["en"];
            langConfig += `Name: "${englishMessage.langName}"; MessagesFile: "${englishMessage.filename}"\n`;
            for (let l in messagesMap) {
                let message = messagesMap[l];
                if (l != "en") {
                    langConfig += `Name: "${message.langName}"; MessagesFile: "${message.filename}"\n`;
                }
            }
        }
        config += langConfig;
        config += "\n";

        //文件关联
        let fileTypeConfig = "[Registry]\n";
        fileTypeConfig += `#if "user" == InstallTarget\n`;
        fileTypeConfig += `  #define SoftwareClassesRootKey "HKCU"\n`;
        fileTypeConfig += `#else\n`;
        fileTypeConfig += `  #define SoftwareClassesRootKey "HKLM"\n`;
        fileTypeConfig += `#endif\n`;
        fileTypeConfig += "\n";

        fileTypeConfig += `; 注册当前应用程序\n`;
        fileTypeConfig += `Root: {#SoftwareClassesRootKey}; Subkey: "Software\\Classes\\Applications\\{#ExeBasename}"; ValueType: string; ValueName: "FriendlyAppName"; ValueData: "{#FriendlyName}"; Flags: uninsdeletekey\n`;
        fileTypeConfig += "\n";

        if (winFileAssociations) {
            for (var i = 0; i < winFileAssociations.length; i++) {
                let fileType = winFileAssociations[i];
                fileTypeConfig += `Root: {#SoftwareClassesRootKey}; Subkey: "Software\\Classes\\.${fileType.ext}\\OpenWithProgids"; ValueType: none; ValueName: "{#RegValueName}"; Flags: deletevalue uninsdeletevalue\n`;
                fileTypeConfig += `Root: {#SoftwareClassesRootKey}; Subkey: "Software\\Classes\\.${fileType.ext}\\OpenWithProgids"; ValueType: string; ValueName: "{#RegValueName}.${fileType.name}"; ValueData: ""; Flags: uninsdeletevalue\n`;
                fileTypeConfig += `Root: {#SoftwareClassesRootKey}; Subkey: "Software\\Classes\\{#RegValueName}.${fileType.name}"; ValueType: string; ValueName: ""; ValueData: "${fileType.description}"; Flags: uninsdeletekey\n`;
                fileTypeConfig += `Root: {#SoftwareClassesRootKey}; Subkey: "Software\\Classes\\{#RegValueName}.${fileType.name}"; ValueType: string; ValueName: "AppUserModelID"; ValueData: "{#AppUserId}"; Flags: uninsdeletekey\n`;
                fileTypeConfig += `Root: {#SoftwareClassesRootKey}; Subkey: "Software\\Classes\\{#RegValueName}.${fileType.name}\\DefaultIcon"; ValueType: string; ValueName: ""; ValueData: "{app}\\${fileType.icon}"\n`;
                fileTypeConfig += `Root: {#SoftwareClassesRootKey}; Subkey: "Software\\Classes\\{#RegValueName}.${fileType.name}\\shell\\open"; ValueType: string; ValueName: "Icon"; ValueData: """{app}\\{#ExeBasename}"""\n`;
                fileTypeConfig += `Root: {#SoftwareClassesRootKey}; Subkey: "Software\\Classes\\{#RegValueName}.${fileType.name}\\shell\\open\\command"; ValueType: string; ValueName: ""; ValueData: """{app}\\{#ExeBasename}"" ""%1"""\n`;
                fileTypeConfig += "\n";
            }
            config += fileTypeConfig;
        }
        let baseConfig: string = setupIss;
        // 检查并移除 BOM
        if (baseConfig.charCodeAt(0) === 0xFEFF) {
            baseConfig = baseConfig.slice(1);
        }
        config += baseConfig;


        let issFilename = path.join(tmpdir(), "setup.iss");
        const gbkBuffer = iconv.encode(config, 'gbk');
        fs.writeFileSync(issFilename, gbkBuffer);
        return {
            issFilename:issFilename,
            outputFilename:outputFilename
        };
    }
    return null;
}


export function generateResourceUpdateIss(builderConfig: any, packageConfig: any, projectDir: string, appPath: AppPath,sign:boolean): {
    issFilename:string,
    outputFilename:string
} {
    if (builderConfig.win?.pack) {
        let config = "";
        // define
        config += `#define AppId "${builderConfig.appId}"\n`;
        config += `#define AppName "${builderConfig.productName}"\n`;
        let nameVersion = builderConfig.win?.pack?.verName ? builderConfig.win?.pack?.verName : builderConfig.productName;
        config += `#define NameVersion "${nameVersion}"\n`;
        let publisher = builderConfig.win?.pack?.publisherName ? builderConfig.win?.pack?.publisherName : "";
        config += `#define Publisher "${publisher}"\n`;
        let publisherURL = builderConfig.win?.pack?.publisherName && builderConfig.win?.pack?.appUrl ? builderConfig.win?.pack?.appUrl : "";
        config += `#define PublisherURL "${publisherURL}"\n`;
        let supportURL = builderConfig.win?.pack?.appUrl ? builderConfig.win?.pack?.appUrl : "";
        config += `#define SupportURL "${supportURL}"\n`;
        let updatesURL = builderConfig.win?.pack?.appUrl ? builderConfig.win?.pack?.appUrl : "";
        config += `#define UpdatesURL "${updatesURL}"\n`;
        config += `#define OutputDir "${path.join(projectDir, builderConfig.output)}"\n`;
        let outputBasename = `${removeSpace(builderConfig.productName)}-${packageConfig.version}-${appPath.arch == "x64" ? "x64-resource-update" : "x86-resource-update"}`
        config += `#define OutputBasename "${outputBasename}"\n`;
        let outputFilename = path.join(projectDir, builderConfig.output,outputBasename+".exe");
        let setupIcon = builderConfig.win?.pack?.setupIcon ? path.join(projectDir, builderConfig.win?.pack?.setupIcon) : "";
        config += `#define SetupIconFile "${setupIcon}"\n`;
        config += `#define ExeBasename "${builderConfig.productName + ".exe"}"\n`;
        config += `#define SourceDir "${appPath.path}"\n`;
        config += `#define Version "${packageConfig.version}"\n`;
        config += `#define DirName "${builderConfig.productName}"\n`;
        config += `#define InstallTarget "user"\n`;
        config += `#define Sign "${sign ? "sign" : ""}"\n`;

        config += "\n";

         //languages
         type MessageItem = {
            langName: string,
            langCode: string,
            filename: string,
            isPreferred: boolean,
            license: string
        };

        //遍历已有的语言文件
        let languagesDir = path.join(libDir(), "languages");
        const islRegex = /^([A-Za-z]+)\.([a-z]{2}(?:[-_][A-Z]{2})?)\.isl$/;
        let files = fs.readdirSync(languagesDir);
        let messagesMap: { [langCode: string]: MessageItem } = {}
        files.forEach(value => {
            let filename = path.join(languagesDir, value);
            const islMatches = value.match(islRegex);
            if (islMatches && islMatches[1] && islMatches[2]) {
                let languageName = islMatches[1];
                languageName = languageName.charAt(0).toLowerCase() + languageName.slice(1);
                const languageCode = islMatches[2].replace("_", "-");
                messagesMap[languageCode] = {
                    langName: languageName,
                    langCode: languageCode,
                    filename: filename,
                    isPreferred: false,
                    license: ""
                };
            }
        });
        let englishMessage: MessageItem = null;
        let langConfig = `[Languages]\n`;

        englishMessage = messagesMap["en"];
        langConfig += `Name: "${englishMessage.langName}"; MessagesFile: "${englishMessage.filename}"\n`;
        for (let l in messagesMap) {
            let message = messagesMap[l];
            if (l != "en") {
                langConfig += `Name: "${message.langName}"; MessagesFile: "${message.filename}"\n`;
            }
        }
        config += langConfig;
        config += "\n";


        let baseConfig: string = updateIss;
        // 检查并移除 BOM
        if (baseConfig.charCodeAt(0) === 0xFEFF) {
            baseConfig = baseConfig.slice(1);
        }
        config += baseConfig;
        let issFilename = path.join(tmpdir(), "update.iss");
        const gbkBuffer = iconv.encode(config, 'gbk');
        fs.writeFileSync(issFilename, gbkBuffer);
        return {
            issFilename:issFilename,
            outputFilename:outputFilename
        };
    }
    return null;
}

/**
 * 打包配置
 * @param builderConfig 
 * @param projectDir 
 */
export function generateWinSign(builderConfig: any,projectDir:string):WinSign{
    if(builderConfig.win?.sign){
        let sourceSign = builderConfig.win?.sign;
        var sign:WinSign = {
            certificateFile: path.join(projectDir,sourceSign.certificateFile),
            certificatePassword:sourceSign.certificatePassword,
            timeStampServer:sourceSign.timeStampServer ? sourceSign.timeStampServer : "http://timestamp.digicert.com",
            rfc3161TimeStampServer:sourceSign.rfc3161TimeStampServer ? sourceSign.rfc3161TimeStampServer : "http://timestamp.digicert.com",
            signingHashAlgorithms: sourceSign.signingHashAlgorithms ? sourceSign.signingHashAlgorithms : ["sha1","sha256"]
        }
        return sign;
    }
    return null;
}