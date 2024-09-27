import { SomeJTDSchemaType } from "ajv/dist/core";

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

export interface ArchUpdate {
    download: {
        url: string;
        size: number;
    };
    resource: {
        url: string;
        size: number;
    },
    full: {
        url: string;
        size: number;
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


/**
 * 验证打包配置文件的规则
 */
export const buildConfigSchema = {
    type: 'object',
    properties: {
        appId: { type: 'string' },
        copyright: { type: 'string' },
        productName: { type: 'string' },
        asar: { type: 'boolean' },
        asarUnpack: {
            type: "array",
            items: {
                type: "string"
            },
            uniqueItems: true
        },
        buildDependenciesFromSource: { type: "boolean" },
        nodeGypRebuild: { type: "boolean" },
        npmRebuild: { type: "boolean" },
        files: {
            type: "array",
            items: {
                type: "string"
            },
            uniqueItems: true
        },
        output: { type: 'string' },
        fileAssociations: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    ext: { type: "string" },
                    name: { type: "string" },
                    description: { type: "string" },
                    icon: { type: "string" },
                },
                required: ["ext", "name", "description", "icon"],
                additionalProperties: false
            }
        },
        mac: {
            type: "object",
            properties: {
                icon: { type: "string" },
                category: { type: "string" },
                extendInfo: {
                    type: "object",
                    additionalProperties: {
                        "type": "string"
                    }
                },
                extraResources: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            from: { type: "string" },
                            to: { type: "string" },
                        },
                        required: ["from", "to"],
                        additionalProperties: false
                    }
                },
                sign: {
                    type: "object",
                    properties: {
                        identity: { type: "string" },
                        entitlements: { type: "string" },
                        entitlementsInherit: { type: "string" },
                    },
                    additionalProperties: false
                },
                notarize: {
                    type: "object",
                    properties: {
                        appleId: { type: "string" },
                        appleIdPassword: { type: "string" },
                        teamId: { type: "string" },
                        notarytoolPath: { type: "string" },
                    },
                    required: ["appleId", "appleIdPassword"],
                    additionalProperties: false
                },
                pack: {
                    type: "object",
                    properties: {
                        title: { type: "string" },
                        background: { type: "string" },
                        icon: { type: "string" },
                        license: { type: "string" },
                        iconSize: { type: "integer" },
                        window: {
                            type: "object",
                            properties: {
                                width: { type: "integer" },
                                height: { type: "integer" }
                            },
                            required: ["width", "height"],
                            additionalProperties: false
                        },
                        contents: {
                            type: "object",
                            properties: {
                                from: {
                                    type: "object",
                                    properties: {
                                        x: { type: "integer" },
                                        y: { type: "integer" }
                                    },
                                    required: ["x", "y"],
                                    additionalProperties: false
                                },
                                to: {
                                    type: "object",
                                    properties: {
                                        x: { type: "integer" },
                                        y: { type: "integer" }
                                    },
                                    required: ["x", "y"],
                                    additionalProperties: false
                                }
                            },
                            required: ["from", "to"],
                            additionalProperties: false
                        }
                    },
                    required: ["window", "contents"],
                    additionalProperties: false
                }
            },
            required: ["icon", "pack"],
            additionalProperties: false
        },
        win: {
            type: "object"
        },
    },
    required: ['appId', 'productName'],
    additionalProperties: false,
}




/**
 * 项目配置文件的规则
 */
export const packageConfigSchema = {
    type: 'object',
    properties: {
        version: {
            type: "string",
            pattern: "^\\d+\\.\\d+\\.\\d+$",
            errorMessage: {
                pattern: 'Version must be in the format x.y.z (e.g., 10.1.1)',
            }
        }
    },
    required: ['version'],
    additionalProperties: true,
}