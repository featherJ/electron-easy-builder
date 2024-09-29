import path from "path";

export function libDir(): string {
    let mainPath = eval(`require.main.path;`);
    return path.join(mainPath, "../lib");
}

export function nodeModulesDir(): string {
    let mainPath = eval(`require.main.path;`);
    return path.join(mainPath, "../node_modules");
}