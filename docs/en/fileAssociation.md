# easy-builder.yml FileAssociation
[中文](../zh/fileAssociation.md) | English

Associated files, specifying which file formats can be opened with the current application.

## ext
`ext`: `string`

File extension. e.g. `png`.

## name?
`name`: `undefined` | `string`

The associated file type name. If not set, it will use the `ext`.

## description?
`description`: `undefined` | `string`

Description of the associated file (Windows only).

## role?
`role`: `undefined` | `"Editor"` | `"Viewer"` | `"Shell"` | `"None"`

Used to define the role of the application when handling a specific file type, corresponding to the property CFBundleTypeRole (macOS only).

**Default**：
`Editor`

**Reference**：
https://developer.apple.com/documentation/bundleresources/information-property-list/cfbundleurltypes/cfbundletyperole

## iconMac?
`iconMac`: `undefined` | `string`

The icon for the currently associated file on macOS (currently only supports ICNS format).

## iconWin?
`iconWin`: `undefined` | `string`

The icon for the currently associated file on Windows (currently only supports ICO format).
