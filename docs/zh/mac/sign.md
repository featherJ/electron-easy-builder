# easy-builder.yml MacSign
中文 | [English](../../en/mac/sign.md)

macOS 上的签名配置

## identity
`identity`: `string`

要使用的证书名称。

**例如**：
```
identity: "xxxxxxxxx (xxxxxx)"
```

## entitlements?
`entitlements`: `undefined` | `string`

指定应用程序需要的特定权限和能力。 

**参考**：
https://www.electron.build/app-builder-lib.interface.macconfiguration#entitlements


## entitlementsInherit?
`entitlementsInherit`: `undefined` | `string`

子程序的权限。

**参考**：
https://www.electron.build/app-builder-lib.interface.macconfiguration#entitlementsinherit