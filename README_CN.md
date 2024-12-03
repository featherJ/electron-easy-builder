# Electron Easy Builder

[![Donation](https://img.shields.io/static/v1?label=Donation&message=❤️&style=social)](https://ko-fi.com/V7V7141EHB)

中文文档 | [English](README.md)

这是一个的 Electron 程序的打包工具，同时配合 [electron-easy-updater](https://github.com/featherJ/electron-easy-updater) 可以更简单的实现 Electron 程序在 **Windows** 和 **macOS** 上的的**全量更新**与**最小更新**。

## 为什么重复造轮子？
出发点是因为官方的 `electron-builder` 的自动更新在 macOS 上只能全量更新，无法只更新指定的文件，导致每次自动更新的尺寸会非常大。而且 Electron 使用的 Squirrel 的自动更新在 macOS 上会验证更新包是否进行了完整的签名。

而后在使用官方的 `electron-builder` 的过程中，发现了存在如下问题：
* 使用的 Squirrel 自动更新，macOS 上只能全量更新，且要求更新包必须是签名过的。
* 本地测试自动更新过程不够直观，且操作繁琐。
* 配置参数太多，使用门槛较高。
* 文档不够全面，如为dmg安装包增加用户协议过程就没能按照文档顺利完成，只能通过阅读源码来完成。
* dmg 的打包过程中无法对已签名的 app 文件进行认证与装订。只能手动干预打包流程，手动将已签名公证并且装订的 app 文件打包为 dmg。
* Electron Forge 对于程序的结构以及 Webpack 限制的过于死板，没有灵活性。

所以最终导致我决定自己重写一套打包工具和更新插件。

## 功能简介
* **Windows** 与 **macOS** 平台的打包。
* 两个平台自动化的**全量更新**与**最小更新**。
* 安装包与安装协议的多语言支持。

	### 与 electron-builder 的差异对比
	| electron-easy-builder (this) | [electron-builder](https://www.electron.build/index.html) | 
	|----------|----------|
	| macOS 支持最小更新，且小更新包无需签名 | macOS 上只能全量更新，且更新包必须签名 |
	| 本地测试方便 | 需要 `dev-app-update.yml` 配置文件进行本地测试 |
	| 功能简单，附带全量模板示例 | 文档不清晰，部分功能不知道如何使用 |
	| 自动化打包流程，在打包app之后可自动进行**签名**、**公证**和**装订**，并将**装订**的 `.app` 打包成 `dmg`  | 在 macOS 上对于app的签名公证装订过程需要将原有打包流程拆开，并通过额外的工具来进行公正与装订。 |
	| Windows 打包使用的 **Inno Setup**，安装与更新界面更简洁且易用，但需要在 Windows 上进行打包。 | Windows 打包使用的 **NSIS**。其脚本的学习成本会更高，维护成本大，对于一些定制化需要额外的插件。但使用 NSIS 可以在 macOS 交叉编译为 exe 安装包。 |

## 实现原理
这个工具的内部的主要功能实际还是调用的 `electron-builder`（但 Windows 打包部分使用的是 `InnoSetup`，而非 `electron-builder` 内置的 `NSIS`）。将 `electron-builder` 的全部功能都拆开了，然后通过 `easy-builder.yml` 配置的内容，动态生成 `electron-builder` 在各功能模块里所需的配置，然后通过 `api` 的方式调用 `electron-builder`。

目的是简化 `electron-builder` 打包所需的配置。并将各个功能模块拆开分别控制，以实现本打包工具所支持的功能。

## 如何使用
### 配置文件
配置文件的全貌可以参考 [lib/easy-builder.template.yml](lib/easy-builder.template.yml).

配置文件的详情介绍：
* [easy-builder.yml](docs/zh/base.md) - 配置全貌
	* [fileAssociations](docs/zh/fileAssociation.md) - 应用程序的关联文件
	* [mac](docs/zh/mac/base.md) - macOS 平台的配置
		* [sign](docs/zh/mac/sign.md) - 签名配置
		* [notarize](docs/zh/mac/notarize.md) - 公正与装订配置
		* [pack](docs/zh/mac/pack.md) - 打包配置
	* [win](docs/zh/win/base.md) - Windows 平台的配置
		* [sign](docs/zh/win/sign.md) - 签名配置
		* [pack](docs/zh/win/pack.md) - 打包配置

### 命令行参数介绍
具体命令可以参考如下：

* **选项**:
    * `easy-builder -V` - 查看当前命令行编译工具版本号。
    * `easy-builder -h` - 查看命令帮助。
* **命令**:
	* `easy-builder init [options] <string>` - 初始化配置文件，此命令会在当前工作空间创建一个 easy-builder.yml 的配置模板。

		**可选参数** :
		* `-d, --dir <path>` - 指定项目的目录。默认情况下，配置文件将在当前工作目录下创建。使用此参数可以为指定的路径创建配置文件。
		
	* `easy-builder build [options] <string>` - 构建应用程序。

		**可选参数**:
		* `-d, --dir <path>` - 指定项目的目录。此路径下的协议文件将被编译。如果未指定，默认使用当前目录。
		* `-m` - 编译为 macOS 平台的应用程序。
		* `-w` - 编译为 Windows 平台的应用程序。
		* `easy-builder help [command] ` - 查看对指定命令的帮助，使用此命令可以获取有关 init、build 等命令的详细信息。

## 其他
* 目前使用的 `electron-builder` 版本为 `24.6.3` 。最新版本会因 https://github.com/electron-userland/electron-builder/issues/8149 导致只能在管理员身份下才能正常运行。
* 在 Windows 上如果遇到 Unable to commit changes 报错，请参考 https://github.com/electron/packager/issues/590#issuecomment-1416237580 关闭杀毒软件后重试。这是由于杀毒软件将刚生成的文件保护了起来，拒绝其他进程对其修改导致的。

## TODO
* 对于命名中应该支持 File Macros https://www.electron.build/file-patterns#file-macros，比如win.pack.verName
* 规范配置文件中到底哪些是可选配置，哪些是必须配置。同时修改common.ts中的buildConfigSchema。
* `.icns` 和 `.ico` 图标文件的生成。
* 最低需要的操作系统的支持。

## 致谢
非常感谢 [electron-builder](https://www.electron.build/index.html)，一个功能这么全面，且支持 api 调用的的打包工具。
