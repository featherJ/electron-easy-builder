# easy-builder.yml Win
[中文](../../zh/win/base.md) | English

Packaging configuration for application installer on Windows.

## icon?
`icon`: `undefined` | `string`

The application icon (currently only supports the ICO format) .

## extraResources?
`extraResources`: `{from: string, to: string}[]`

Extra resources, a glob patterns relative to the project.

**Example**：
```
extraResources:
  - from: build/win/resources/test.txt
    to: test.txt
```

## sign?
`sign`: `undefined` | [WinSign](sign.md)

Signing configuration.

## pack
`pack`: [WinPack](pack.md)

Configuration for EXE Installer Packaging