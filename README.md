# Electron打包工具与更新器

[![Donation](https://img.shields.io/static/v1?label=Donation&message=❤️&style=social)](https://ko-fi.com/V7V7141EHB)

## 介绍
这是一个更简单的 electron 程序的打包工具，同时配合 [electron-easy-updater](https://github.com/featherJ/electron-easy-updater) 可以更好的实现 electron 程序在 Windows 和 Mac OS 上的的全量更新与最小体积更新。

## 为什么重复造轮子
出发点是因为官方的 electron-builder 的自动更新在 Mac OS 上只能全量更新，无法只更新指定的文件，导致每次自动更新的尺寸会非常大。而且 electron 使用的 squirrel 的自动更新在 Mac OS 上会验证更新包是否进行了完整的签名。

而后在使用官方的 electron-builder 的过程中，发现了存在如下问题：
* 使用的 Squirrel 自动更新，Mac OS 上只能全量更新，且要求更新包必须是签名过的。
* 本地测试自动更新过程不够直观，且操作繁琐。
* 配置参数太多，使用门槛较高。
* 文档不够全面，如为dmg安装包增加用户协议过程就没能按照文档顺利完成，只能通过阅读源码来完成。
* dmg 的打包过程中无法对已签名的 app 文件进行认证与装订。只能手动干预打包流程，手动将已签名公证并且装订的 app 文件打包为 dmg。
* Electron Forge 对于程序的结构以及 webpack 限制的过于死板，没有灵活性。

所以最终导致我决定自己重写一套打包工具和更新插件。

## 功能简介
* Windows 与 Mac OS 平台的打包。
* 两个平台自动化的全量更新与最小体积更新。
* 安装包与安装协议的多语言支持。

	### 与 Electron-builder 的差异对比
	| electron-easy-builder (this) | [electron-builder](https://www.electron.build/index.html) | 
	|----------|----------|
	| Mac OS 支持最小更新，且小更新包无需签名 | Mac OS 上只能全量更新，且更新包必须签名 |
	| 本地测试方便 | 需要 dev-app-update.yml 配置文件进行本地测试 |
	| 功能简单，附带全量模板示例 | 文档不清晰，很多功能不知道如何使用 |
	| 自动化打包流程，在打包app之后可自动进行签名公证和装订，并将装订的app打包成dmg | 在 Mac OS 上对于app的签名公证装订过程需要额外的工具 |
	| Windows 打包使用的 Inno Setup，安装与更新界面更简洁且易用，但需要在 Windows 上进行打包。 | Windows 打包使用的 NSIS。其脚本的学习成本会更高，维护成本大，对于一些定制化需要额外的插件。但使用 NSIS 可以在 Mac OS 交叉编译为 exe 安装包， |

## 如何使用


### 配置文件


### 命令行参数

## TODO
* icon的生成
* 更新日志字段的生成
* 最低需要的操作系统的支持
