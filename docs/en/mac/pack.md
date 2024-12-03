# easy-builder.yml MacPack
[中文](../../zh/mac/pack.md) | English

DMG packaging configuration.

## background?
`category`: `undefined` | `string`

Background image of the DMG package.

## iconSize?
`category`: `undefined` | `number`

Icon size within the DMG package.

**Default**: 
`80`

## license?
`license`: `undefined` | `string`

Folder for the user agreement files within the DMG installer. Supports both `rtf` rich text format and `txt` plain text format, with multi-language support.

### Reference:
`rtf` format: https://github.com/featherJ/editor-electron-template/tree/master/build/license/rtf-mac

`txt` format: https://github.com/featherJ/editor-electron-template/tree/master/build/license/txt

Supported Languages: https://github.com/argv-minus-one/dmg-license/blob/master/docs/Supported%20Language%20Tags.md

### Naming Convention for Agreement Files:
`license.[lang].[default?].[format]`
* lang: Language code, typically using international standards (e.g., `en`, `zh-CN`).
* default (optional): Indicates this file as the default version.
* format: File format, typically `rtf` or `txt`.

### UI Text Naming Convention (Optional):
If not set, default UI text is used.

`license_buttons.[lang].json`
* lang: Language code, typically using international standards (e.g., `en`, `zh-CN`).

**Example**: 
File: `license_buttons.en-US.json`:
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

DMG window size.

## contents
`contents`: `{from: {x:number, y:number}, to: {x:number, y:number}}`

The positions of the two icons inside the DMG: "from" is the icon of the program to be installed, and "to" is the icon linking to the system's Applications folder.
