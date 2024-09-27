import chalk from "chalk";
import fs from "fs";
import path from "path";
import { error, info } from "utils/log";
import YAML from 'yaml';

import { buildConfigSchema, packageConfigSchema } from "configs/common";
import { checkWithSchema } from "helpers/schemaHelper";

/**
 * 检查配置，并初始化
 */
export class Initer {

    private _projectDir: string;
    /**
     * 项目路径
     */
    public get projectDir(): string {
        return this._projectDir;
    }

    private builderConfigFilename: string;
    private packageConfigFilename: string;
    constructor(projectDir?: string) {
        this._projectDir = projectDir ? projectDir : __dirname;
        info(`Easy init ${chalk.blue("projectDir")}=${this._projectDir}`);
        this.builderConfigFilename = path.join(this.projectDir, 'easy-builder.yml');
        this.packageConfigFilename = path.join(this.projectDir, "package.json");
    }

    private _builderConfig: any;
    /** 打包配置文件 */
    public get builderConfig(): any {
        return this._builderConfig;
    }
    private _packageConfig: any;
    /** 项目配置文件 */
    public get packageConfig(): any {
        return this._packageConfig;
    }

    /**
     * 初始化
     * @returns 
     */
    public init(): boolean {
        //判断文件是否存在
        if (!fs.existsSync(this.builderConfigFilename)) {
            error("The build configuration file 'easy-builder.yml' does not exist");
            return false;
        }
        if (!fs.existsSync(this.packageConfigFilename)) {
            error("The project configuration file 'package.json' does not exist");
            return false;
        }
        //解析配置文件
        try {
            this._builderConfig = YAML.parse(fs.readFileSync(this.builderConfigFilename, 'utf8'));
        } catch (error) {
            error("Error parsing file 'easy-builder.yml'. Please check the syntax and ensure the encoding format is UTF-8.");
            return false;
        }
        try {
            this._packageConfig = JSON.parse(fs.readFileSync(this.packageConfigFilename, 'utf8'))
        } catch (error) {
            error("Error parsing file 'package.json'. Please check the syntax and ensure the encoding format is UTF-8.");
            return false;
        }

        //校验配置文件内容
        let success1 = checkWithSchema("easy-builder.yml", this._builderConfig, buildConfigSchema);
        let success2 = checkWithSchema("package.json", this._packageConfig, packageConfigSchema);

        //检查是否包含electron
        let electronFilename = path.join(this.projectDir,"node_modules/electron");
        if(!fs.existsSync(electronFilename)){
            error(`Electron not found in the project's 'node_modules'.`);
            return false;
        }

        return success1 && success2;
    }
}