/**
 * 公证配置
 */
export interface NotarizeConfig{
    /** 苹果id */
    appleId: string;
    /** 苹果id密码 */
    appleIdPassword: string;
    /** 开发者团队id */
    teamId: string;
    /** 自定义的公证工具路径 */
    notarytoolPath?: string;
}