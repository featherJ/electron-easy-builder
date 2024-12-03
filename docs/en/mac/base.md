# easy-builder.yml Mac
[中文](../../zh/mac/base.md) | English

Packaging configuration for application installer on macOS/

## category?
`category`: `undefined` | `string`

The application category, corresponding to the `LSApplicationCategoryType` property, which can be viewed in both Finder and the App Store.

**Reference**：
https://developer.apple.com/documentation/bundleresources/information-property-list/lsapplicationcategorytype

## icon?
`icon`: `undefined` | `string`

The application icon path (currently only supports the ICNS format).

## extendInfo?
`extendInfo`: `any`

 Extended information，this will be written to the Info.plist (optional). e.g. Request camera and microphone permissions.

**Example**：
```
NSCameraUsageDescription: "We need access to your camera."  
NSMicrophoneUsageDescription: "We need access to your microphone."
```


## extraResources?
`extraResources`: `{from: string, to: string}[]`

Extra resources, a glob patterns relative to the project, typically used for system-level multilingual resources.

**Example**：
```
extraResources:
  - from: build/darwin/resources/en.lproj
    to: en.lproj
  - from: build/darwin/resources/zh_CN.lproj
    to: zh_CN.lproj
```

## sign?
`sign`: `undefined` | [MacSign](sign.md)

Signing configuration.

## notarize?
`notarize`: `undefined` | [MacNotarize](notarize.md)

Notarization and stapling configuration

## pack
`pack`: `undefined` | [MacPack](pack.md)

DMG packaging configuration.