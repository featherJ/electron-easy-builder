# easy-builder.yml WinSign
中文 | [English](../../en/win/sign.md)

Windows 上的签名配置。

## certificateFile
`certificateFile`: `string`

证书文件的路径。

## certificatePassword
`certificatePassword`: `string`

证书文件的密码。

## timeStampServer?
`timeStampServer`: `undefined` | `string`

时间戳服务的URL。

**默认值**：
`http://timestamp.digicert.com`

## rfc3161TimeStampServer?
`rfc3161TimeStampServer`: `undefined` | `string`

RFC 3161 时间戳服务的URL。

**默认值**：
`http://timestamp.digicert.com`

## signingHashAlgorithms?
`signingHashAlgorithms`: `undefined` | `("sha256" | "sha1")[]`

签名使用的算法。

**默认值**：
`['sha1', 'sha256']`
