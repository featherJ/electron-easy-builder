import { requireDynamically } from "base/dynamicImport";
import { AppPath, BuildConfig } from "configs/common";
import fs from "fs";
import { extractElectronBuilderConfig, extractNotarizeConfig, generateDmgLicenseConfig } from "helpers/configHelper";
import { buildCustomRoute } from "next/dist/build";
import { setupDevBundler } from "next/dist/server/lib/router-utils/setup-dev-bundler";
import path from "path";
import {  runTask, runTasks } from "tasks/common";
import { AddBuildInfoMacTask } from "tasks/mac/addBuildInfoTask";
import { BuildMacTask } from "tasks/mac/buildTask";
import { ClearMacTask } from "tasks/mac/clearMacTask";
import { NotarizeMacTask } from "tasks/mac/notarizeTask";
import { PackDmgTask } from "tasks/mac/packDmgTask";
import { PackMacUpdateTask } from "tasks/mac/packUpdateTask";
import { SetUpdateConfigMacTask } from "tasks/mac/setUpdateConfigTask";
import { BuildWinTask } from "tasks/win/buildTask";
import YAML from 'yaml';


// const alias = requireDynamically('macos-alias');

// const aliasPath = '/Users/apple/Documents/FacnyGit/editor-electron-template/dist/Editor Electron Template-1.0.0-intel.dmg'; // DMG 的路径
// const aliasData = fs.readFileSync(aliasPath); // 读取 DMG 的数据

// // 解析别名数据
// const aliasInfo = alias.resolve(aliasData);
// console.log(aliasInfo); // 输出别名的信息，包括目标路径

// console.log("fuck");


let projectDir = "/Users/apple/Documents/FacnyGit/editor-electron-template";
const builderConfigPath = path.join(__dirname, '../test/easy-builder.yml');
const builderConfig = YAML.parse(fs.readFileSync(builderConfigPath, 'utf8'));

const packageConfigPath = path.join(projectDir,"package.json");
const packageConfig = JSON.parse(fs.readFileSync(packageConfigPath, 'utf8'))





const electronBuilderConfig = extractElectronBuilderConfig(builderConfig);
// const notarizeConfig = extractNotarizeConfig(builderConfig);


// console.log(electronBuilderConfig);
// console.log(notarizeConfig);
// console.log("fuck");

// const builderWin = new BuildWinTask();
// builderWin.init(electronBuilderConfig,"/Users/apple/Documents/FacnyGit/editor-electron-template");

// const buildMacTask = new BuildMacTask();
// buildMacTask.init(electronBuilderConfig,projectDir);
// const notarizeMacTask = new NotarizeMacTask();
// notarizeMacTask.init(electronBuilderConfig,notarizeConfig,"/Users/apple/Documents/FacnyGit/editor-electron-template");


// runTask(packDmgTask).then(outputs=>{
//     console.log(outputs);
// });

// const packMacUpdateTask = new PackMacUpdateTask();
// packMacUpdateTask.init(builderConfig,packageConfig,projectDir);
// runTask(packMacUpdateTask).then(outputs=>{
//         console.log(outputs);
// });


async function pack():Promise<void>{
    const clearMacTask = new ClearMacTask();
    clearMacTask.init(builderConfig,packageConfig,projectDir,true);
    await runTask(clearMacTask);

    const buildMacTask = new BuildMacTask();
    buildMacTask.init(electronBuilderConfig,projectDir);
    await runTask(buildMacTask);

    let addBuildInfoMacTask = new AddBuildInfoMacTask();
    addBuildInfoMacTask.init(builderConfig,projectDir);
    let config = (await runTask(addBuildInfoMacTask)) as BuildConfig

    const packDmgTask = new PackDmgTask();
    packDmgTask.init(builderConfig,packageConfig,projectDir);
    let dmgOutputs = (await runTask(packDmgTask)) as AppPath[];
    const packMacUpdateTask = new PackMacUpdateTask();
    packMacUpdateTask.init(builderConfig,packageConfig,projectDir);
    let updateOutputs = (await runTask(packMacUpdateTask)) as AppPath[];

    let setUpdateConfigTask = new SetUpdateConfigMacTask();
    setUpdateConfigTask.init(builderConfig,packageConfig,projectDir,dmgOutputs.concat(updateOutputs),config);
    runTask(setUpdateConfigTask);

    const clearMacAllTask = new ClearMacTask();
    clearMacAllTask.init(builderConfig,packageConfig,projectDir,false);
    await runTask(clearMacAllTask);
}

pack();


// generateDmgLicenseConfig(builderConfig,projectDir);

// let buttonsPath = "/Users/apple/Documents/FacnyGit/editor-electron-template/build/license/licenseButtons_en_US.json";
// const buttons = JSON.parse(fs.readFileSync(buttonsPath, 'utf8'))

// const jsonFile:any = {
//     $schema: "https://github.com/argv-minus-one/dmg-license/raw/master/schema.json",
//     body: [],
//     labels: [],
// };
// jsonFile.body.push({
//     file: "/Users/apple/Documents/FacnyGit/editor-electron-template/build/license/license_zh_CN.txt",
//     lang: "zh-CN",
// });
// jsonFile.body.push({
//     file: "/Users/apple/Documents/FacnyGit/editor-electron-template/build/license/license_en_US.txt",
//     lang: "en-US",
// });

// jsonFile.labels.push(Object.assign({
//     lang: "en-US",
// }, buttons));

// let dmgLicense = requireDynamically("dmg-license");
// dmgLicense.dmgLicenseFromJSON(
//     "/Users/apple/Documents/FacnyGit/editor-electron-template/dist/Editor Electron Template-1.0.0-intel.dmg",
//     jsonFile,
//     {
//         onNonFatalError: (error:any)=>{console.log(error)},
//     }
// )


// runTasks([buildMacTask])
// console.log(electronBuilderConfig);
// console.log("fuck");
// async function pack() {
//     const { build } = requireDynamically("electron-builder")
//     try {
//         await build({
//             config: electronBuilderConfig,
//             x64: true,
//             arm64: true,
//             projectDir: "/Users/apple/Documents/FacnyGit/editor-electron-template"
//         });
//         console.log('打包完成！');
//     } catch (error) {
//         console.error('打包失败:', error);
//     }
// }
// pack();

// var buildInfoTask = new BuildInfoMacTask();
// buildInfoTask.init(builderConfig,projectDir);
// runTask(buildInfoTask);





// build({
//     config: electronBuilderConfig,
//     x64: true,
//     arm64: true,
//     projectDir: "/Users/apple/Documents/FacnyGit/editor-electron-template",
//     // quiet: false, // 设置为 false 以确保输出信息
//     // verbose: true // 可以设置为 true 来获取更多详细信息
// });
