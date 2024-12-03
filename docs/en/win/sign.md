# easy-builder.yml WinSign
[中文](../../zh/mac/sign.md) | English

Signing configuration on Windows.

## certificateFile
`certificateFile`: `string`

The path to the certificate file.

## certificatePassword
`certificatePassword`: `string`

The password for the certificate file.

## timeStampServer?
`timeStampServer`: `undefined` | `string`

The URL of the time stamp server.

**Default**：
`http://timestamp.digicert.com`

## rfc3161TimeStampServer?
`rfc3161TimeStampServer`: `undefined` | `string`

The URL of the RFC 3161 time stamp server.

**Default**：
`http://timestamp.digicert.com`

## signingHashAlgorithms?
`signingHashAlgorithms`: `undefined` | `("sha256" | "sha1")[]`

Array of signing algorithms used.

**Default**：
`['sha1', 'sha256']`