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

export type MacArch = "x64" | "arm64";
export type MacArchUpdate = "x64-resource-update" | "x64-full-update" | "arm64-resource-update" | "arm64-full-update";
export type WinArch = "x64" | "x86";
export type WinArchUpdate = "x64-resource-update" | "x64-full-update" | "x86-resource-update" | "x86-full-update";
export type ArchAll = MacArch | MacArchUpdate | WinArch | WinArchUpdate;

/**
 * app路径
 */
export interface AppPath {
    path: string;
    arch: ArchAll;
}

/**
 * dmg打包配置
 */
export interface AppDmgConfig {
    basepath: string;
    target: string;
    specification: {
        title: string,
        icon: string,
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

export interface BaseBuildConfig {
    electron: string,
    build?: string,
}

export interface BuildConfig extends BaseBuildConfig {
    arch: MacArch | WinArch
}

export interface ArchUpdate{
    download: {
        url:string;
        size:number;
    };
    resource: {
        url:string;
        size:number;
    },
    full: {
        url:string;
        size:number;
    }
}

/**
 * 更新配置文件
 */
export interface UpdateConfig extends BaseBuildConfig {
    version: string;
    x64?: ArchUpdate;
    arm64?: ArchUpdate;
    x86?: ArchUpdate;
}