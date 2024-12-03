# easy-builder.yml WinPack
中文 | [English](../../en/win/pack.md)

Exe 安装包打包的配置。

## verName?
`verName`: `undefined` | `string`

应用版本名，如：`Application Name 1.0`。 如果未设置则使用根配置中的 `productName`。

**参考**：
https://jrsoftware.org/ishelp/index.php?topic=setup_appvername

## setupIcon?
`setupIcon`: `undefined` | `string`

安装包的图标（目前仅支持 ico 格式）。

## appUrl?
`appUrl`: `undefined` | `string`

应用的网址。

## appId?
`appId`: `undefined` | `string`

App的唯一标识，仅用于注册表和覆盖安装时的对应等，不会在任何地方显示（推荐设置为`uuid`的形式，避免更新包覆盖安装时与其他同名程序冲突）。
如果没有设置的会使用根配置中的 `appId`。

**参考**：
https://jrsoftware.org/ishelp/index.php?topic=setup_appid

## publisherName?
`publisherName`: `undefined` | `string`

发布者名称。

## friendlyAppName?
`friendlyAppName`: `undefined` | `string`

右键 `"open with"` 里显示的内容，没有的话使用根配置的 `productName`。对应属性为 `FriendlyName`。

**参考**：
https://learn.microsoft.com/en-us/dotnet/api/system.appdomain.friendlyname

## regValueName
`regValueName`: `string`

注册表中被注册的文件名，用于关联文件等（不能存在空格和特殊字符）。

## wizardSmallImageFile?
`wizardSmallImageFile`: `undefined` | `string`

安装包中所需的小图。

**参考**：
https://jrsoftware.org/ishelp/index.php?topic=setup_wizardsmallimagefile

## wizardImageFile?
`wizardImageFile`: `undefined` | `string`

安装包中所需的大图。

**参考**：
https://jrsoftware.org/ishelp/index.php?topic=setup_wizardimagefile

## license?
`license`: `undefined` | `string`

Exe 安装包内的用户协议文件夹，支持 `rtf` 富文本格式，以及 `txt` 文本格式，支持多语言。

其中 `txt` 文件可以使用 `utf-8` 编码，但 `rtf` 文件请使用对应语言的编码格式，否则会呈现乱码。

### 参考：
* `rtf` 格式：https://github.com/featherJ/editor-electron-template/tree/master/build/license/rtf-win
* `txt` 格式：https://github.com/featherJ/editor-electron-template/tree/master/build/license/txt
* 支持的语言：https://github.com/featherJ/electron-easy-builder/tree/master/lib/languages

### 协议文件的命名规范：
`license.[lang].[default?].[format]`
* lang：语言代码，通常使用国际标准（如 `en`、`zh-CN`）。
* default（可选）：表示该文件是默认版本。
* format：文件格式，通常为 `rtf` 或 `txt`。