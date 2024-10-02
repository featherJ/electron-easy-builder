#!/usr/bin/env node
import chalk from "chalk";
import { program } from "commander";
import fs from "fs";
import { Initer } from "pack/initer";
import { MacPacker } from "pack/macPacker";
import { WinPacker } from "pack/winPacker";
import path from "path";
import { error } from "utils/log";
import { promptToContinue } from "utils/program";
import { ensureElevated } from "utils/elevate";
//todo 改成动态读取
import templateContent from '../lib/easy-builder.template.yml';
//todo 改成动态读取
import curPackage from "../package.json";


program
    .name("easy-builder")
    .description(curPackage.description)
    .version(curPackage.version)
    .on('--help', () => {
        console.log('');
        console.log('Examples:');
        // console.log('  $ protobytes -h');
        // console.log('  $ protobytes support');
        // console.log('  $ protobytes create proto -o ./templates');
        // console.log('  $ protobytes create config -o ./templates');
        // console.log('  $ protobytes compile -s ./my-protos -t java -o ./my-generate/java/com/myprotos -p com.myprotos -a MyName -c');
        // console.log('  $ protobytes compile -s ./my-protos -t java -o ./my-generate/java/com/myprotos -p com.myprotos');
        // console.log('  $ protobytes compile -config ./proto-config.json');
    });

program.command('init')
    .description('Initialize the packaging configuration template: easy-builder.yml')
    .option('-d, --dir <string>', 'Project path.')
    .action(async (options) => {
        let projectDir: string = options.dir ? options.dir : __dirname;
        let basename = "easy-builder2.yml";
        let basenameBackup = "easy-builder2.backup.yml";
        let filename = path.join(projectDir, basename);
        let backupFilename = path.join(projectDir, basenameBackup);
        if (fs.existsSync(filename)) {
            const shouldContinue = await promptToContinue(`File ${chalk.blue(basename)} already exists. Would you like to continue to back it up while creating a new template file?`);
            if (shouldContinue) {
                fs.cpSync(filename, backupFilename)
                fs.writeFileSync(filename, templateContent, { encoding: 'utf-8' });
                console.log(`File ${chalk.blue(basename)} has been created.`);
            } else {
                console.log('Aborted file creation.');
            }
        } else {
            fs.writeFileSync(filename, templateContent, { encoding: 'utf-8' });
            console.log(`File ${chalk.blue(basename)} has been created.`);
        }
    });


program.command('build')
.description('Build and package the project')
.option('-d, --dir <string>', 'Project path.')
.option('-m, --mac', 'Build and package for macOS.',false)
.option('-w, --win', 'Build and package for Windows.',false)
.action(async (options) => {
    let projectDir: string = options.dir ? options.dir : __dirname;
    let mac:boolean = options.mac;
    let win:boolean = options.win;
    
    const initer = new Initer(projectDir);
    let valid = initer.init();
    if(!valid){
        return;
    }
    if(mac){
        if(!initer.builderConfig.mac){
            error(`The file 'easy-builder.yml' does not contain 'mac' configuration. Please add it and try again.`);
            return;
        }
        let macPacker = new MacPacker(initer);
        try {
            await macPacker.pack();
        } catch (e) {
            error(e);
            return;
        }
    }
    if(win){
        if(!initer.builderConfig.win){
            error(`The file 'easy-builder.yml' does not contain 'win' configuration. Please add it and try again.`);
            return;
        }
        await ensureElevated();
        let winPacker = new WinPacker(initer);
        try {
            await winPacker.pack();
        } catch (e) {
            error(e);
            return;
        }
    }

});


program.parse(process.argv);

// const initer = new Initer("C:\\Users\\Agua.L\\Documents\\project\\editor-electron-template");
// let valid = initer.init();
// let winPacker = new WinPacker(initer);
// winPacker.pack();

// const initer = new Initer("/Users/apple/Documents/FacnyGit/editor-electron-template/");
// let valid = initer.init();
// let macPacker = new MacPacker(initer);
// macPacker.pack();