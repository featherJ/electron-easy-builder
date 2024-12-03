# easy-builder.yml Mac
中文 | [English](../../en/mac/base.md)

macOS 上的安装包打包配置。

## category?
`category`: `undefined` | `string`

应用程序类别，对应的属性为 `LSApplicationCategoryType`，在 Finder 和应用商店中都可查看该分类

**参考**：
https://developer.apple.com/documentation/bundleresources/information-property-list/lsapplicationcategorytype

## icon?
`icon`: `undefined` | `string`

应用程序的图标路径（目前仅支持 icns 格式）。

## extendInfo?
`extendInfo`: `any`

扩展信息，这会写入到 Info.plist 中。例如：请求摄像头与麦克风权限。

**例如**：
```
NSCameraUsageDescription: "We need access to your camera."  
NSMicrophoneUsageDescription: "We need access to your microphone."
```

## extraResources?
`extraResources`: `{from: string, to: string}[]`

附加资源，符合 glob 模式的相对于项目的路径，通常用于系统级的多语言资源。

**例如**：
```
extraResources:
  - from: build/darwin/resources/en.lproj
    to: en.lproj
  - from: build/darwin/resources/zh_CN.lproj
    to: zh_CN.lproj
```

## sign?
`sign`: `undefined` | [MacSign](sign.md)

签名配置。

## notarize?
`notarize`: `undefined` | [MacNotarize](notarize.md)

公证装订配置。

## pack
`pack`: [MacPack](pack.md)

Dmg 打包的配置。