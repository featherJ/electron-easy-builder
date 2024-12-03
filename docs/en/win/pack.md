# easy-builder.yml WinPack
[中文](../../zh/win/pack.md) | English

Configuration for EXE Installer Packaging.

## verName?
`verName`: `undefined` | `string`

Application version name, e.g., `Application Name 1.0`. If not set, the `productName` from the root configuration will be used.

**Reference**: 
https://jrsoftware.org/ishelp/index.php?topic=setup_appvername

## setupIcon?
`setupIcon`: `undefined` | `string`

Installer package icon (currently only supports the ICO format).

## appUrl?
`appUrl`: `undefined` | `string`

The url of application.

## appId?
`appId`: `undefined` | `string`

Unique identifier for the app, used only for registry entries and matching during updates. It will not be displayed anywhere (recommended to set it in `UUID` format to avoid conflicts with other programs of the same name during update installations).
If not set, it will use the `appId` from the root configuration.

**Reference**: 
https://jrsoftware.org/ishelp/index.php?topic=setup_appid

## publisherName?
`publisherName`: `undefined` | `string`

Publisher name.

## friendlyAppName?
`friendlyAppName`: `undefined` | `string`

The content displayed in the right-click `"Open with"` menu. If not set, it defaults to the `productName` from the root configuration. Corresponds to the `FriendlyName` attribute.

**Reference**：
https://learn.microsoft.com/en-us/dotnet/api/system.appdomain.friendlyname

## regValueName
`regValueName`: `string`

The file name registered in the registry, used for associating files, etc. (must not contain spaces or special characters).

## wizardSmallImageFile?
`wizardSmallImageFile`: `undefined` | `string`

The small images required in the installer package.

**Reference**：
https://jrsoftware.org/ishelp/index.php?topic=setup_wizardsmallimagefile

## wizardImageFile?
`wizardImageFile`: `undefined` | `string`

The large images required in the installer package.

**Reference**：
https://jrsoftware.org/ishelp/index.php?topic=setup_wizardimagefile

## license?
`license`: `undefined` | `string`

The user agreement folder inside the `EXE` installer supports both `rtf` rich text format and `txt` text format, with multilingual support.

The `txt` files can use `utf-8` encoding, but `rtf` files should use the corresponding language's encoding format to avoid displaying garbled text.

### Reference: 
* `rtf` format: https://github.com/featherJ/editor-electron-template/tree/master/build/license/rtf-win
* `txt` format: https://github.com/featherJ/editor-electron-template/tree/master/build/license/txt
* Supported Languages: https://github.com/featherJ/electron-easy-builder/tree/master/lib/languages

### Naming Convention for Agreement Files: 
`license.[lang].[default?].[format]`
* lang: Language code, typically using international standards (e.g., `en`, `zh-CN`).
* default (optional): Indicates this file as the default version.
* format: File format, typically `rtf` or `txt`.