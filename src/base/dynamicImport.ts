/**
 * 同步require
 * @param path 
 * @returns 
 */
export function requireDynamically(path: string): any {
    path = path.split('\\').join('/');
    return eval(`require('${path}');`);
}