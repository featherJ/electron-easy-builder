import { release } from "os";
import path from "path";

export function libDir(): string {
    let mainPath = eval(`require.main.path;`);
    return path.join(mainPath, "../lib");
}

export function nodeModulesDir(): string {
    let mainPath = eval(`require.main.path;`);
    return path.join(mainPath, "../node_modules");
}

function isOldWin6() {
    const winVersion = release();
    return winVersion.startsWith("6.") && !winVersion.startsWith("6.3");
}
export function signToolFilename(): string {
    if (isOldWin6()) {
        return path.join(libDir(), "signtool", "windows-6", "signtool.exe");
    }
    else {
        if (process.arch == "x64") {
            return path.join(libDir(), "signtool", "windows-10", "x64", "signtool.exe");
        }
        return path.join(libDir(), "signtool", "windows-10", "ia32", "signtool.exe");
    }
}