# easy-builder.yml FileAssociation
中文 | [English](../en/fileAssociation.md)

关联文件，指定哪些文件格式可以使用当前应用程序打开。

## ext
`ext`: `string`

文件扩展名，如 `png`。

## name?
`name`: `undefined` | `string`

关联文件类型名，如果未设置则使用 `ext`。

## description?
`description`: `undefined` | `string`

关联文件的描述（仅限 Windows）

## role?
`role`: `undefined` | `"Editor"` | `"Viewer"` | `"Shell"` | `"None"`

用来定义应用在处理特定文件类型时的角色，对应属性为CFBundleTypeRole（仅限 macOS）

**默认值**：
`Editor`

**参考**：
https://developer.apple.com/documentation/bundleresources/information-property-list/cfbundleurltypes/cfbundletyperole

## iconMac?
`iconMac`: `undefined` | `string`

macOS 上当前关联文件的图标（目前仅支持icns）格式。

## iconWin?
`iconWin`: `undefined` | `string`

Windows 上当前关联文件的图标（目前仅支持ico）格式。
