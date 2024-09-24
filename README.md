# ProtoBytes

[![NPM Version](http://img.shields.io/npm/v/protobytes.svg?style=flat)](https://www.npmjs.org/package/protobytes)
[![Install Size](https://packagephobia.now.sh/badge?p=protobytes)](https://packagephobia.now.sh/result?p=protobytes)


ProtoBytes 用于二进制通信协议序列化与反序列化，可用于二进制通信或本地持久化存储等。
ProtoBytes 由命令行编译工具和相应语言的运行时解析库库组成。

## 介绍
可由当前命令行工具将指定格式的 `proto` 协议文件所描述的自定义数据类型，编译为指定语言的数据对象的具体代码实现。借由当前底层依赖库，实现自定义数据类型对象的序列化与反序列化。

### 特点
- 在实际工程通信协议格式的更新迭代过程中，一端对 `proto` 中某个具体类型的从末端增加新的属性，在不改变已存在属性的类型和顺序的前提下。另一端不需要更新协议文件以及重新编译，也不会对已存在的所有程序逻辑造成影响，不会在实体数据对象序列化与反序列化过程中报错，只会导致在数据对象解析时不对应的属性丢失。

- 在不改变 `proto` 协议文件中属性的类型与顺序的前提下，可以任意修改任何属性名而不会导致序列化与反序列化过程中二进制的改变。序列化后的二进制不依赖任何节点的属性名，只依赖顺序和类型。即多端通信过程中，一段对协议中的属性名的修改，丝毫不会影响另一端对于数据的解析过程。

- 足够精简，只包含实体对象的序列化与反序列化过程，不关联任何其他功能。

## 安装
### 命令行编译工具的安装
编译工具为使用 Node.js 开发，可以通过如下命令进行全局安装。

通过npm安装：
```
npm install protobytes -g
```

### 运行时库的安装
ProtoBytes 目前还只支持如下语言的实现，对于不同的语言您可以从源文件中找到对应的具体实现以及相关说明

| 语言                             | 源文件                                       |
|---------------------------------|---------------------------------------------|
| Java                            | [java](java)                                |
| Dart                            | [dart](dart)                                |

未来 ProtoBytes 会支持更多语言版本的实现。


## 原理
从二进制到最终的数据对象分为三层：
### 二进制层
这一层是最基本的二进制数据，其中基本数据类型包括如下：
* `bool`: 8位有符号整数，非零为 true 零为 false。
* `byte`: 8位有符号整数。
* `short`: 16位有符号整数。
* `int`: 32位有符号整数。
* `int64`: 64位有符号整数。
* `ubyte`: 8位无符号整数。
* `ushort`: 16位无符号整数。
* `uint`: 32位无符号整数。
* `float`: IEEE 754 单精度（32 位）浮点数。
* `double`: IEEE 754 双精度（64 位）浮点数。
* `string`: 一串 UTF-8 字符串，字符串的前缀是 16 位无符号整数表示长度。
* `longstring`: 一串 UTF-8 字符串，字符串的前缀是 32 位有符号整数表示长度。
* `bytes`: 一串二进制数据，前缀是 32 位有符号整数表示长度。

初次之外，还提供了 `list` 类型和 `object` 类型，分别标识数组和自定义对象。而其内部也均有上述基本类型所实现。

### 数据交换层
以上所有基本数据类型均有对应的一个数据交换对象类型，该层负责对上述二进制基本类型到数据交换对象的相互转换，即对数据交换对象的序列化与反序列化。

所有数据交换对象的二进制形式均为一个8位整数标识数据交换类型加具体数据值，如：
```
BuffByte <-----> type(8-bit) + value(bytes)
```

数据交换层可以满足由上述基本二进制类型所组合以及嵌套形成的复杂数据形式的序列化与反序列化过程，其数据结构形式类似于json，但是树状结构中没有任何节点的名称，只有节点的类型。

对于数据交换层到二进制层的相互转化的具体实现过程可以参考类 `BuffBytesUtil`。

### 实体对象层
由于数据交换层中，数据树中只包含每一个节点的类型和值不包含节点名称，每一个同层的子节点的存储形式列表形式。虽然序列化与反序列化过程灵活，但无法满足实际使用，即：无法通过属性名直接得到某个节点的属性值。

所以该层是将数据交换对象转换为实体对象，将数据交换节点中子节点与实体对象中具体的属性对应起来，这样才能方便开发过程中使用。

实体对象的具体代码实现，是由当前命令行编译工具对指定格式的 `proto` 协议文件所描述的自定义数据类型编译得到的。

## Proto语法
proto的语法很简单，可以参考如下示例文件：
```proto
/// Example information description
vo ExampleInfo
{	
	byte byteProp;				/// Property of byte format. A 8-bit signed integer between -128 and 127.
	short shortProp;			/// Property of short format. A 16-bit signed integer between -32768 and 32767.
	int intProp;				/// Property of int format. A 32-bit signed integer between -2147483648 and 2147483647.
	ubyte byteProp;				/// Property of byte format. A 8-bit unsigned integer between 0 and 255.
	ushort shortProp;			/// Property of short format. A 16-bit unsigned integer between 0 and 65535.
	uint intProp;				/// Property of int format. A 32-bit unsigned integer between 0 and 4294967295.
	float floatProp;			/// Property of float format. A single-precision (32-bit) floating-point number.
	double doubleProp;			/// Property of double format. A double-precision (64-bit) floating-point number.
	bool boolProp;				/// Property of bool format. An 8-bit signed integer
	string stringProp;			/// Property of string format. A UTF-8 string from the byte stream. The string is assumed to be prefixed with an short indicating the length in bytes.
	longstring longstringProp;	/// Property of longstring format. A UTF-8 string from the byte stream. The string is assumed to be prefixed with an int indicating the length in bytes.
	bytes bytesProp;			/// Property of bytes format. An 8-bit signed integer
	
	AttInfo att1Prop;			/// Property of AttInfo.
	AttInfo att2Prop;			/// Property of AttInfo.

	List<byte> byteListProp;				/// Byte list property.
	List<short> shortListProp;				/// Short list property.
	List<int> intListProp;					/// Int list property.
	List<ubyte> byteListProp;				/// Ubyte list property.
	List<ushort> shortListProp;				/// Ushort list property.
	List<uint> intListProp;					/// Uint list property.
	List<float> floatListProp;				/// Float list property.
	List<double> doubleListProp;			/// Double list property.
	List<bool> boolListProp;				/// Bool list property.
	List<string> stringListProp;			/// String list property.
	List<longstring> longstringListProp;	/// Longstring list property.
	List<bytes> bytesListProp;				/// Bytes list property.

	List<AttInfo> attInfo1ListProp;			/// AttInfo list property.
	List<AttInfo> attInfo2ListProp;			/// AttInfo list property.
}

/// An Attribute Info example
vo AttInfo{
	short attId;			/// Property of short format. A 16-bit signed integer between -32768 and 32767.
	string attName;			/// Property of string format. A UTF-8 string from the byte stream. The string is assumed to be prefixed with an short indicating the length in bytes.
	string attDesc;			/// Property of string format. A UTF-8 string from the byte stream. The string is assumed to be prefixed with an short indicating the length in bytes.
	int attValue;			/// Property of int format. A 32-bit signed integer between -2147483648 and 2147483647.
}
```

## 命令行参数介绍
您可以通过当前命令行创建 `proto` 协议模板文件或创建编译配置末班文件，可以将指定 `proto` 文件夹编译为指定的语言，具体命令可以参考如下：

* **选项**:
    * `protobytes -V` - 查看当前命令行编译工具版本号
    * `protobytes -h` - 查看命令帮助
* **命令**:
    * `protobytes create [options] <string>` - 创建协议或编译配置示例文件
    * `protobytes compile [options]` - 编译协议文件为指定语言
    * `support` - 查看当前支持的语言
    * `help [command] ` - 查看对命令的帮助