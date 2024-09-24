import fs from "fs";
import { extractElectronBuilderConfig, extractNotarizeConfig } from "helpers/configHelper";
import path from "path";
import {  runTasks } from "tasks/common";
import { BuildMacTask } from "tasks/mac/buildTask";
import { NotarizeMacTask } from "tasks/mac/notarizeTask";
import { BuildWinTask } from "tasks/win/buildTask";
import YAML from 'yaml';

const filePath = path.join(__dirname, '../test/easy-builder.yml');
const file = fs.readFileSync(filePath, 'utf8');
const config = YAML.parse(file);

const electronBuilderConfig = extractElectronBuilderConfig(config);
const notarizeConfig = extractNotarizeConfig(config);


// console.log(electronBuilderConfig);
// console.log(notarizeConfig);
// console.log("fuck");

// const builderWin = new BuildWinTask();
// builderWin.init(electronBuilderConfig,"/Users/apple/Documents/FacnyGit/editor-electron-template");

const buildMacTask = new BuildMacTask();
buildMacTask.init(electronBuilderConfig,"/Users/apple/Documents/FacnyGit/editor-electron-template");
const notarizeMacTask = new NotarizeMacTask();
notarizeMacTask.init(electronBuilderConfig,notarizeConfig,"/Users/apple/Documents/FacnyGit/editor-electron-template");


runTasks([buildMacTask,notarizeMacTask])

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






// build({
//     config: electronBuilderConfig,
//     x64: true,
//     arm64: true,
//     projectDir: "/Users/apple/Documents/FacnyGit/editor-electron-template",
//     // quiet: false, // 设置为 false 以确保输出信息
//     // verbose: true // 可以设置为 true 来获取更多详细信息
// });
