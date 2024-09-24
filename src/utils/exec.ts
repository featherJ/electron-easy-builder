import { requireDynamically } from 'base/dynamicImport';
import { ExecFileOptions } from 'child_process';


/**
 * 运行windows脚本，支持在mac下运行
 * @param file 
 * @param file64 
 * @param appArgs 
 * @param options 
 * @returns 
 */
export function execWine(file: string, file64?: string | null, appArgs?: Array<string>, options?: ExecFileOptions): Promise<string> {
    const { execWine } = requireDynamically("app-builder-lib/out/wine")
    return execWine(file, file64, appArgs, options);
}