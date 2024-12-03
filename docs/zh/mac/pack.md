# easy-builder.yml MacPack
中文 | [English](../../en/mac/pack.md)

Dmg 打包的配置

## background?
`category`: `undefined` | `string`

Dmg 包的背景图片。

## iconSize?
`category`: `undefined` | `number`

Dmg 包内的图标尺寸。

**默认值**：
`80`

## license?
`license`: `undefined` | `string`

Dmg 安装包内的用户协议文件夹，支持 `rtf` 富文本格式，以及 `txt` 文本格式，支持多语言。

### 参考：
`rtf` 格式：https://github.com/featherJ/editor-electron-template/tree/master/build/license/rtf-mac

`txt` 格式：https://github.com/featherJ/editor-electron-template/tree/master/build/license/txt

支持的语言：https://github.com/argv-minus-one/dmg-license/blob/master/docs/Supported%20Language%20Tags.md

### 协议文件的命名规范：
`license.[lang].[default?].[format]`
* lang：语言代码，通常使用国际标准（如 `en`、`zh-CN`）。
* default（可选）：表示该文件是默认版本。
* format：文件格式，通常为 `rtf` 或 `txt`。

### 协议对话框中UI文字命名规范格：
如果未设置，则使用默认UI文案

`license_buttons.[lang].json`
* lang：语言代码，通常使用国际标准（如 `en`、`zh-CN`）。

**例如**：
文件 `license_buttons.en-US.json`:
```
{
    "agree": "Custom Agree",
    "disagree": "Custom Disagree",
    "print": "Custom Print",
    "save": "Custom Save",
    "message": "Here is my own message"
}
```

## window
`window`: `{width: number, height: number}`

Dmg 的窗口尺寸。

## contents
`contents`: `{from: {x:number, y:number}, to: {x:number, y:number}}`

Dmg 内两个图标的位置，from 是要安装的程序图标，to 是系统 Applications 链接的图标。