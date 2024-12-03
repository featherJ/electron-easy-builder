# easy-builder.yml
[中文](../zh/base.md) | English

Configuration file used by `electron-easy-builder` for packaging `electron` projects.

## appId
`appId`: `string`

Example: `appId: "com.example.app"`

Application ID. Used as the `CFBundleIdentifier` on macOS and `AppUserModelID` on Windows. On Windows, it is used for file type associations.

Reference:
* https://developer.apple.com/documentation/bundleresources/information-property-list/cfbundleidentifier
* https://learn.microsoft.com/zh-cn/windows/win32/shell/appids

## copyright?
`copyright`: `undefined` | `string`

Copyright information of the application (optional).

**Default**：
`Copyright © year ${author}`

## productName?
`productName`: `undefined` | `string`

The product name, which will also be the name of the final executable file. If not specified, it will default to the `name` field in `package.json`.

## asar?
`asar`: `undefined` | `boolean`

Specifies whether to package the source code into an `asar` archive (optional).

**Default**：
`true`

## asarUnpack?
`asarUnpack`: `undefined` | `string` | `string[]`

A [glob patterns](https://www.electron.build/file-patterns) relative to the project, defining which files should not be included in the `asar` package (optional).

## buildDependenciesFromSource?
`buildDependenciesFromSource`: `undefined` | `boolean`

Whether to build the application native dependencies from source.

**Default**：
`false`

## nodeGypRebuild?
`nodeGypRebuild`: `undefined` | `boolean`

Whether to execute `node-gyp rebuild` before starting to package the app.

**Default**：
`false`

## npmRebuild?
`npmRebuild`: `undefined` | `boolean`

Whether to rebuild native dependencies before starting to package the app.

**Default**：
`true`

## files
`files`: `undefined` | `string` | `string[]`

A [glob patterns](https://www.electron.build/file-patterns) relative to the project, defining which files should be included in the package.

Example:
```
files:
  - out/**/*
  - "!node_modules/**"   
```

## output?
`output`: `undefined` | `string`

Packaging output directory.

**Default**：
`dist`

## fileAssociations?
`fileAssociations`: `undefined` | [FileAssociation](fileAssociation.md)[]

Associated files, specifying which file formats can be opened with the current application.

## mac?
`mac`: `undefined` | [Mac](mac/base.md)

Packaging configuration for application installer on macOS.

## win?
`win`: `undefined` | [Win](win/base.md)

Packaging configuration for application installer on Windows.