# easy-builder.yml Win
中文 | [English](../../en/win/base.md)

Windows 上的安装包打包配置

## icon?
`icon`: `undefined` | `string`

应用程序的图标（目前仅支持 ico 格式）。

## extraResources?
`extraResources`: `{from: string, to: string}[]`

附加资源，符合 glob 模式的相对于项目的路径。

**例如**：
```
extraResources:
  - from: build/win/resources/test.txt
    to: test.txt
```

## sign?
`sign`: `undefined` | [WinSign](sign.md)

签名配置。

## pack
`pack`: [WinPack](pack.md)

Exe 安装包打包的配置