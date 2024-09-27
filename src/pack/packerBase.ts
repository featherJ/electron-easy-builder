import fs from "fs";
import { extractElectronBuilderConfig, extractNotarizeConfig } from "helpers/configHelper";
import path from "path";
import YAML from 'yaml';


export class PackerBase {

    private _builderConfig: any;
    public get builderConfig(): any {
        return this._builderConfig;
    }
    private _packageConfig: any;
    private _electronBuilderConfig: any;
    private _notarizeConfig: any;
    private _projectDir: string;
    
    constructor(projectDir: string) {
        this._projectDir = projectDir;

        let builderConfigPath = path.join(projectDir, 'easy-builder.yml');
        this._builderConfig = YAML.parse(fs.readFileSync(builderConfigPath, 'utf8'));

        let packageConfigPath = path.join(projectDir, "package.json");
        this._packageConfig = JSON.parse(fs.readFileSync(packageConfigPath, 'utf8'))

        this._electronBuilderConfig = extractElectronBuilderConfig(this._builderConfig);
        this._notarizeConfig = extractNotarizeConfig(this._builderConfig);
    }
}