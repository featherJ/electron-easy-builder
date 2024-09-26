/**
 * 公证配置
 */
export interface NotarizeConfig {
    /** 苹果id */
    appleId: string;
    /** 苹果id密码 */
    appleIdPassword: string;
    /** 开发者团队id */
    teamId: string;
    /** 自定义的公证工具路径 */
    notarytoolPath?: string;
}

export type MacArch = "x64" | "arm64" | "x64-resource-update" | "x64-full-update" | "arm64-resource-update" | "arm64-full-update";

/**
 * app路径
 */
export interface AppPath {
    path: string;
    arch: MacArch;
}

/**
 * dmg打包配置
 */
export interface AppDmgConfig {
    basepath:string;
    target:string;
    specification: {
        title: string,
        icon:string,
        "icon-size": number,
        background: number,
        window: {
            size: {
                width: number,
                height: number
            }
        },
        contents: { x: number, y: number, type: string, path: string }[]
    }
}