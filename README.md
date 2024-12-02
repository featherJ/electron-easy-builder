# Electron Easy Builder

[![Donation](https://img.shields.io/static/v1?label=Donation&message=❤️&style=social)](https://ko-fi.com/V7V7141EHB)

[中文文档](README_CN.md) | English

This is a packaging tool for Electron applications. When used together with [electron-easy-updater](https://github.com/featherJ/electron-easy-updater), it simplifies implementing both **full updates** and **minimal updates** for Electron applications on **Windows** and **macOS**.


## Why Reinvent the Wheel?
The motivation for this comes from the limitations of the official `electron-builder` auto-update, which only supports full updates on macOS. It doesn't allow for updating specific files, causing each auto-update to be unnecessarily large. Additionally, the Squirrel auto-update used by Electron requires the update package to be fully signed on macOS.

While using the official `electron-builder`, I encountered the following issues:
* The Squirrel auto-update on macOS only supports full updates, and the update package must be signed.
* The local testing process for auto-updates is not intuitive and involves complicated steps.
* Too many configuration options, leading to a high learning curve.
* Documentation is lacking; for example, the process for adding a user agreement to a .dmg installer did not work as described in the docs and required reading the source code to complete.
* During .dmg packaging, it’s not possible to verify and notarize signed app files. Manual intervention is needed to manually package the notarized and signed app into a .dmg.
* Electron Forge enforces rigid structure and Webpack limitations, offering no flexibility.

As a result, I decided to write my own packaging tool and update plugin.


## Feature Overview
* Packaging for both **Windows** and **macOS** platforms.
* Automated **full updates** and **minimal updates** for both platforms.
* Multi-language support for installer packages and installation licenses.

	### Comparison with electron-builder
	| electron-easy-builder (this) | [electron-builder](https://www.electron.build/index.html) | 
	|----------|----------|
	| Supports delta updates on macOS without the need for signed update packages | Only supports full updates on macOS, and the update package must be signed |
	| Local testing is easy | Requires a `dev-app-update.yml` configuration file for local testing |
	| Simple functionality with bundled full template example | Documentation is unclear, and some features are not easy to use |
	| Automated packaging process that handles **signing**, **notarizing**, and **stapling** the `.app` into a `.dmg` after app stapling | On macOS, the **signing**, **notarization**, and **stapling** process requires splitting the original packaging flow and using additional tools for **notarization** and **stapling** |
	| Uses **Inno Setup** for Windows packaging, providing a simpler and more user-friendly installation and update interface, but requires packaging on Windows | Uses **NSIS** for Windows packaging, which has a steeper learning curve, higher maintenance cost, and requires additional plugins for customizations. However, NSIS can be used to cross-compile an `.exe` installer package on macOS |

## Implementation Principles
The core functionality of this tool still primarily relies on `electron-builder` (though for Windows packaging, it uses `InnoSetup` instead of the built-in `NSIS` in `electron-builder`). The entire functionality of `electron-builder` has been broken down, and the required configurations for each module are dynamically generated based on the content of the `easy-builder.yml` configuration file. These configurations are then applied via API calls to `electron-builder`.

The goal is to simplify the configuration required for `electron-builder` packaging. Additionally, the different functionality modules are separated and controlled individually to achieve the features supported by this packaging tool.

## How to Use
### Configuration File
You can refer to the full configuration file in [lib/easy-builder.template.yml](lib/easy-builder.template.yml).

Details about the configuration file:
* [easy-builder.yml](docs/en/base.md) - Overview of the configuration
	* [fileAssociations](docs/en/fileAssociation.md) - File associations for the application
	* [mac](docs/en/mac/base.md) - Configuration for macOS platform
		* [sign](docs/en/mac/sign.md) - Signing configuration
		* [notarize](docs/en/mac/notarize.md) - Notarization and stapling configuration
		* [pack](docs/en/mac/pack.md) - Packaging configuration
	* [win](docs/en/win/base.md) - Configuration for Windows platform
		* [sign](docs/en/win/sign.md) - Signing configuration
		* [pack](docs/en/win/pack.md) - Packaging configuration

### Command-Line Options
The specific commands are as follows:

* **Options**:
    * `easy-builder -V` - View the current command-line tool version.
    * `easy-builder -h` - View command help.
* **Commands**:
	* `easy-builder init [options] <string>` - Initialize the configuration file. This command will create an `easy-builder.yml` template file in the current working directory.
	**Optional Parameters** :
		* `-d, --dir <path>` - Specify the project directory. By default, the configuration file will be created in the current working directory. Use this option to create the configuration file in a specified path.
	* `easy-builder build [options] <string>` - Build the application.
	**Optional Parameters**:
		* `-d, --dir <path>` - Specify the project directory. The protocol files in this path will be compiled. If not specified, the current directory will be used by default.
		* `-m` - Compile the application for macOS platform.
		* `-w` - Compile the application for Windows platform.
    * `easy-builder help [command] ` - View help for a specific command. Use this to get detailed information on commands like init, build, etc.

## Others
* The current version of `electron-builder` being used is `24.6.3`. The latest version may cause issues where the tool can only run with administrator privileges due to https://github.com/electron-userland/electron-builder/issues/8149.
* On Windows, if you encounter the error "Unable to commit changes`, please refer to https://github.com/electron/packager/issues/590#issuecomment-1416237580 to disable your antivirus software and try again. This issue occurs because the antivirus software has protected the newly generated files and prevents other processes from modifying them.

## TODO
* Generation of `.icns` and `.ico` icon files.
* Support for the minimum required operating systems.

## Acknowledgments
A big thank you to [electron-builder](https://www.electron.build/index.html), a comprehensive packaging tool that supports API calls.

