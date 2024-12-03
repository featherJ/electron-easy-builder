# easy-builder.yml
中文 | [English](../en/base.md)

用于 `electron-easy-builder` 打包 `electron` 项目的配置文件。

## appId
`appId`: `string`

应用程序 ID。用作 macOS 的 `CFBundleIdentifier` 和 Windows 的 `AppUserModelID`。在 Windows 上被用于文件关联文件。

**例如**：`appId: "com.example.app"`

**参考**：
* https://developer.apple.com/documentation/bundleresources/information-property-list/cfbundleidentifier
* https://learn.microsoft.com/zh-cn/windows/win32/shell/appids

## copyright?
`copyright`: `undefined` | `string`

程序的版权信息（可选）。

**默认值**：
`Copyright © year ${author}`

## productName?
`productName`: `undefined` | `string`

产品名称，也是最终可执行文件的名称。如果未指定，则会读取 `package.json` 中的 `name` 字段。

## asar？
`asar`: `undefined` | `boolean`

是否将源码打包为 `asar`（可选）。

**默认值**：
`true`

## asarUnpack?
`asarUnpack`: `undefined` | `string` | `string[]`

符合 [glob 模式](https://www.electron.build/file-patterns)的相对于项目的路径，定义哪些文件不会被打包进 `asar` 包内。

## buildDependenciesFromSource?
`buildDependenciesFromSource`: `undefined` | `boolean`

是否从源代码构建应用程序的本地依赖项。

**默认值**：
`false`

## nodeGypRebuild?
`nodeGypRebuild`: `undefined` | `boolean`

是否在开始打包应用程序之前执行 `node-gyp rebuild`。

**默认值**：
`false`

## npmRebuild?
`npmRebuild`: `undefined` | `boolean`

是否在开始打包应用程序之前重新构建本地依赖项。

**默认值**：
`true`

## files
`files`: `undefined` | `string` | `string[]`

符合 [glob 模式](https://www.electron.build/file-patterns)的相对于项目的路径，定义打包哪些文件。

**例如**：
```
files:
  - out/**/*
  - "!node_modules/**"   
```

## output?
`output`: `undefined` | `string`

打包输出目录。

**默认值**：
`dist`

## fileAssociations?
`fileAssociations`: `undefined` | [FileAssociation](fileAssociation.md)[]

关联文件，指定哪些文件格式可以使用当前应用程序打开。

## mac?
`mac`: `undefined` | [Mac](mac/base.md)

macOS 上的安装包打包配置。

## win?
`win`: `undefined` | [Win](win/base.md)

Windows 上的安装包打包配置。
