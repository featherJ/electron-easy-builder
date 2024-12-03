# easy-builder.yml MacSign
[中文](../../zh/mac/sign.md) | English

Signing configuration for macOS

## identity
`identity`: `string`

The certificate name to be used.

**Example**：
```
identity: "xxxxxxxxx (xxxxxx)"
```

## entitlements?
`entitlements`: `undefined` | `string`

Specify the specific permissions and capabilities required by the application.

**Reference**：
https://www.electron.build/app-builder-lib.interface.macconfiguration#entitlements

## entitlementsInherit?
`entitlementsInherit`: `undefined` | `string`

Subprogram permissions.

**Reference**：
https://www.electron.build/app-builder-lib.interface.macconfiguration#entitlementsinherit