# 卷 01-深度剖解：`property` 的七层境界（从语法到底层内存）

> **阅读时长**：约 25 分钟（建议边看边敲代码）
> **涉及文件**：`main.qml` + `MyComponent.qml`（双文件联动）

## 🧬 第 0 层：官方语法速览（先给总表）

| 写法 | 关键字 | 内存分配时机 | 是否支持绑定 `:` | 外部可否修改 |
| :--- | :--- | :--- | :--- | :--- |
| `property int a: 1` | `property` | 对象实例化时 | ✅ 是 | ✅ 是 |
| `readonly property int b: 2` | `readonly` | 对象实例化时 | ✅ 是（仅初始化） | ❌ 否（运行时报错） |
| `required property int c` | `required` | **外部传参时**（延迟） | ❌ 否（只能赋值） | ✅ 是（仅创建时） |
| `property alias d: other.value` | `alias` | **不分配新内存**（引用） | ✅ 是（转发） | ✅ 是（改别名即改原值） |
| `property var e: {x:1}` | `var` | 分配 `QVariant` 容器 | ✅ 是（存 JS 对象） | ✅ 是 |

> **你必须记住的硬核结论**：`alias` 不占内存，其他都占内存（`var` 占 16 字节，`int` 占 4 字节）。


## 🧬 第 1 层：`property int` 的底层内存模型（C++ 视角）

### 🧠 底层机制（必读）
在 QML 引擎底层，当你写下 `property int age: 18` 时，C++ 层生成了类似这样的代码：

```cpp
// 这是 Qt 编译器自动生成的元对象代码（伪代码）
class QML_MyComponent : public QObject {
    Q_PROPERTY(int age READ get_age WRITE set_age NOTIFY ageChanged)

private:
    int m_age;  // 👈 实际分配了 4 字节内存

    void set_age(int val) {
        if (m_age != val) {
            m_age = val;
            emit ageChanged();  // 👈 这就是绑定的“信号源”
        }
    }
}
```

**关键推论**：
1. 每个 `property` 都会生成一个 **`setter`**、一个 **`getter`** 和一个 **`xxxChanged` 信号**。
2. 你在 QML 里写 `age: 18` 时，引擎调用的是 `set_age(18)`。
3. 你在 QML 里写 `width: age * 2` 时，引擎向 `ageChanged` 信号注册了一个回调函数（即绑定表达式）。

### ✅ 完整示例（监控信号触发）
```qml
import QtQuick 6.0
import QtQuick.Window 6.0

Window {
    visible: true
    width: 400
    height: 300

    // 声明一个属性
    property int myAge: 18

    // 声明一个绑定属性（依赖 myAge）
    property int doubleAge: myAge * 2   // 👈 引擎在 myAgeChanged 信号上挂了回调

    Text {
        id: displayText
        anchors.centerIn: parent
        text: "年龄：" + myAge + "，双倍：" + doubleAge
    }

    Button {
        text: "增长 1 岁"
        anchors.bottom: parent.bottom
        anchors.horizontalCenter: parent.horizontalCenter
        onClicked: {
            myAge += 1   // 调用 set_age() -> 发射 ageChanged -> doubleAge 自动重算
        }
    }

    // 监听属性变化的打印
    onMyAgeChanged: console.log("检测到年龄变化，新值:", myAge)
    onDoubleAgeChanged: console.log("检测到双倍年龄变化，新值:", doubleAge)
}
```

**🟢 运行效果**：点击按钮，控制台会打印两条日志（`myAgeChanged` 先触发，`doubleAgeChanged` 随后触发）。

**💣 底层排错**：如果你在 JS 里写 `myAge = 18`（等号），虽然数值能变，但**如果值没变**，信号不会发射，依赖它的绑定也不会重算。这是优化机制，不是 Bug。


## 🧬 第 2 层：`readonly property` —— 常量但并非“编译期常量”

### 🧠 核心机制
`readonly` 只是在 **`setter` 里加了一把锁**（`if (isReadonly) return;`）。它只读的是 **QML 运行时**，不是 C++ 编译期。

**重点**：`readonly` 属性依然可以参与绑定（`:`），且绑定表达式中的右侧变量变化时，它依然会更新！它的“只读”是指**你不能手动用 `=` 去改它**。

### ✅ 完整示例（证明 readonly 可以动态更新）
```qml
import QtQuick 6.0
import QtQuick.Window 6.0

Window {
    visible: true
    width: 400
    height: 300

    property int baseValue: 10
    readonly property int doubled: baseValue * 2   // 虽然是 readonly，但依然跟随 baseValue 变化

    Text {
        text: "基础值: " + baseValue + "，只读双倍值: " + doubled
        anchors.centerIn: parent
    }

    Button {
        text: "改变基础值（只读属性自动变）"
        anchors.bottom: parent.bottom
        onClicked: baseValue += 5
    }

    Button {
        text: "尝试修改只读属性（会报错）"
        anchors.bottom: parent.bottom
        anchors.bottomMargin: 50
        onClicked: {
            // doubled = 100   // ❌ 取消注释后报错：Cannot assign to read-only property
            console.log("禁止修改，报错如上")
        }
    }
}
```


## 🧬 第 3 层：`required property` —— Qt 6 新增的“强制传参”

### 🧠 核心机制
`required` 属性**不提供初始值**，必须在创建组件时由父级传入。它的底层 C++ 代码**不会生成默认值**，而是生成一个 **`isInitialized`** 标记。如果父级忘记传，引擎会在运行时抛出 **`QML Error: Required property was not initialized`**。

**适用场景**：`ListView` 的 `delegate`（代理）组件。强制要求传入 `modelData`，防止漏传导致界面空白。

### ✅ 完整示例（双文件联动）

**文件 1：`UserCard.qml`（子组件）**
```qml
import QtQuick 6.0

// 强制要求外部传入 name 和 age
Rectangle {
    required property string userName   // 注意：名字不能和 id 冲突，这里用 userName
    required property int userAge

    width: 200
    height: 100
    color: "lightblue"
    radius: 10

    Text {
        anchors.centerIn: parent
        text: userName + "，年龄 " + userAge
        font.pixelSize: 18
    }

    // 组件创建完成时检查（虽然引擎会报错，但加个防御）
    Component.onCompleted: {
        console.log("用户卡片创建成功：" + userName)
    }
}
```

**文件 2：`main.qml`（父组件）**
```qml
import QtQuick 6.0
import QtQuick.Window 6.0

Window {
    visible: true
    width: 400
    height: 300

    Column {
        anchors.centerIn: parent
        spacing: 20

        // ✅ 正确：传入了全部 required 属性
        UserCard {
            userName: "张三"   // 必须传，否则报错
            userAge: 25
        }

        // ❌ 错误示范（刻意少传一个属性）
        // UserCard {
        //     userName: "李四"   // 忘记传 userAge -> 程序崩溃并报错
        // }
    }
}
```


## 🧬 第 4 层：`property alias` —— 零内存拷贝的“引用传递”

### 🧠 核心机制（极其重要！）
`alias` **不创建新属性**，它只是在当前组件的元对象表中**添加一个指向目标属性的“快捷方式”**。

- **修改 `alias`** 等价于直接修改目标属性（`setProperty` 指向同一块内存地址）。
- **读取 `alias`** 等价于读取目标属性（直接取地址值）。

**性能对比**：
| 写法 | 内存开销 | 读取速度 | 适用场景 |
| :--- | :--- | :--- | :--- |
| `property string myText: textInput.text` | **拷贝字符串**（分配新内存） | 慢（有拷贝） | 极少使用，易产生不同步 |
| `property alias myText: textInput.text` | **0 字节额外开销** | 极快（指针） | **强烈推荐**，暴露子控件属性 |

### ✅ 完整示例（alias  vs  property 拷贝）
```qml
import QtQuick 6.0
import QtQuick.Window 6.0
import QtQuick.Controls 6.0

Window {
    visible: true
    width: 400
    height: 250

    // ❌ 坏做法：用 property 去“拷贝”子控件的 text
    property string copiedText: input.text   // 仅在初始化时拷贝一次，之后 input 变了，copiedText 不变！

    // ✅ 好做法：用 alias 去“引用”子控件的 text
    property alias realText: input.text     // 实时同步，零拷贝

    Column {
        anchors.centerIn: parent
        spacing: 10

        TextField { id: input; placeholderText: "输入文字" }

        Text { text: "拷贝的值（不同步）: " + copiedText; color: "gray" }
        Text { text: "引用的值（实时同步）: " + realText; color: "green" }

        Button {
            text: "刷新拷贝（手动）"
            onClicked: {
                // 必须手动赋值才能让 copiedText 同步
                copiedText = input.text
                console.log("手动刷新拷贝")
            }
        }
    }
}
```
**🟢 运行效果**：输入文字时，绿色文本（alias）实时变化；灰色文本（property 拷贝）不变，直到点击按钮手动刷新。


## 🧬 第 5 层：`property var` —— 存对象、数组、函数的万能容器

### 🧠 核心机制
`var` 类型底层使用 **`QVariant`**（Qt 的万能容器）。它可以存储任意 JS 对象、数组，甚至函数。

**⚠️ 致命缺陷**：`QVariant` 存储的 JS 对象**不进行深度拷贝**，只保存指针。如果存储的是临时创建的 JS 对象，且被垃圾回收，QML 端可能访问到野指针（极难排查的偶发崩溃）。

### ✅ 完整示例（var 存储对象和数组）
```qml
import QtQuick 6.0
import QtQuick.Window 6.0

Window {
    visible: true
    width: 400
    height: 300

    // 1. 存储对象
    property var petInfo: {"name": "小黑", "weight": 5.2}

    // 2. 存储数组
    property var skillList: ["跳跃", "翻滚", "卖萌"]

    // 3. 存储函数（高级操作）
    property var calcFunc: function(a, b) { return a + b }

    Column {
        anchors.centerIn: parent
        spacing: 10

        Text { text: "宠物名：" + petInfo.name }
        Text { text: "体重：" + petInfo.weight }

        Text { text: "技能列表：" + skillList.join("、") }

        Button {
            text: "调用存储的函数（3+5）"
            onClicked: {
                var result = calcFunc(3, 5)
                console.log("计算结果:", result)
            }
        }

        Button {
            text: "修改对象内容"
            onClicked: {
                petInfo.weight += 0.5   // ✅ 对象内的属性可以改
                console.log("新体重:", petInfo.weight)
            }
        }

        Button {
            text: "重新赋值整个对象（会丢失绑定）"
            onClicked: {
                petInfo = {"name": "小白", "weight": 3.0}  // ⚠️ 赋新对象，会触发 petInfo 本身的绑定量
                // 但如果其他地方写了 petInfoChanged 信号，会触发
            }
        }
    }
}
```


## 🧬 第 6 层：绑定的“脏值标记”与“收束”（防止死循环）

### 🧠 核心机制
如果 `A` 绑定 `B`，`B` 又绑定 `A`，引擎会检测出**绑定循环（Binding Loop）**。
```qml
property int a: b + 1
property int b: a + 1   // ❌ 引擎报错：Binding loop detected for property "a"
```
引擎的检测机制是**“计数器收束”**：同一个绑定表达式在**单次信号触发**中只重算 **5 次**（硬编码限制），超过则报错并停止。

### ✅ 完整示例（故意制造循环并捕获日志）
```qml
import QtQuick 6.0
import QtQuick.Window 6.0

Window {
    visible: true
    width: 400
    height: 300

    property int a: 1
    property int b: a + 1   // b 绑定 a
    property int c: b + 1   // c 绑定 b

    // ❌ 取消注释下面两行，立即触发 Binding Loop 报错
    // property int d: c + 1
    // a: d + 1             // a 又绑定 d，形成闭环

    Text {
        anchors.centerIn: parent
        text: "a:" + a + " b:" + b + " c:" + c
    }

    Button {
        text: "改变 a（正常传递）"
        anchors.bottom: parent.bottom
        onClicked: a += 1
    }
}
```


## 🧬 第 7 层：`Component.onCompleted` 与属性绑定的“致命时序”

### 🧠 核心机制（这就是你之前点不亮设计模式的根源之一！）
**重要顺序**：
1. **第一步**：引擎解析所有的 `属性: 值`（绑定）并建立依赖关系。
2. **第二步**：引擎调用 `Component.onCompleted`。

**这意味着**：如果你在 `onCompleted` 里用 `=` 赋值，**会破坏第一步建立的绑定**。

### ✅ 完整示例（验证时序）
```qml
import QtQuick 6.0
import QtQuick.Window 6.0

Window {
    visible: true
    width: 400
    height: 300

    property int baseVal: 10
    property int bindVal: baseVal * 2   // 绑定：期待 20

    Text {
        anchors.centerIn: parent
        text: "期望 20，实际：" + bindVal
    }

    Component.onCompleted: {
        console.log("初始化完成时的 bindVal:", bindVal)  // 此时显示 20

        // 🔥 致命操作：用 = 赋值破坏绑定
        bindVal = 999
        console.log("onCompleted 赋值后:", bindVal)   // 显示 999

        // 注意：此后 baseVal 再变化，bindVal 永远停留在 999！
    }

    Button {
        text: "改变 baseVal（验证绑定是否被破坏）"
        anchors.bottom: parent.bottom
        onClicked: {
            baseVal += 10
            console.log("baseVal 变了，但 bindVal 没变:", bindVal) // ❌ 永远是 999
        }
    }
}
```

---

## 📦 本节所有代码汇总（一键复制测试）

我把上面 7 层涉及的完整代码收拢成了一个**一体化测试文件**，你可以直接复制整个 `main.qml` 运行，通过点击不同按钮观察控制台输出，亲自验证每一个机制。

```qml
import QtQuick 6.0
import QtQuick.Window 6.0
import QtQuick.Controls 6.0

Window {
    visible: true
    width: 600
    height: 500
    title: "属性深度测试"

    // ---- 第1层：基础属性 ----
    property int testAge: 18
    property int testDouble: testAge * 2

    // ---- 第2层：readonly ----
    property int testBase: 10
    readonly property int testReadonly: testBase * 3

    // ---- 第4层：alias vs 拷贝 ----
    property string testCopied: testInput.text
    property alias testAlias: testInput.text

    // ---- 第5层：var ----
    property var testObj: {"name": "测试", "score": 95}

    // ---- 第7层：时序验证 ----
    property int sequenceVal: 1
    property int sequenceBind: sequenceVal * 10

    Column {
        spacing: 15
        anchors.fill: parent
        anchors.margins: 20

        // 第1层测试
        Text { text: "[第1层] 年龄: " + testAge + "，双倍: " + testDouble }
        Button { text: "增长年龄(触发绑定)"; onClicked: testAge += 1 }

        Rectangle { height: 2; width: parent.width; color: "gray" }

        // 第2层测试
        Text { text: "[第2层] 基础: " + testBase + "，只读三倍: " + testReadonly }
        Button { text: "改变基础值(只读跟随)"; onClicked: testBase += 2 }

        Rectangle { height: 2; width: parent.width; color: "gray" }

        // 第4层测试
        TextField { id: testInput; placeholderText: "输入文字测试别名"; width: parent.width }
        Text { text: "[第4层] 拷贝值(不同步): " + testCopied + " (点下方按钮刷新)" }
        Text { text: "[第4层] 别名引用(实时同步): " + testAlias; color: "green" }
        Row { spacing: 10; Button { text: "刷新拷贝"; onClicked: testCopied = testInput.text } }

        Rectangle { height: 2; width: parent.width; color: "gray" }

        // 第5层测试
        Text { text: "[第5层] 对象: " + testObj.name + " 得分:" + testObj.score }
        Row {
            spacing: 10
            Button { text: "加分"; onClicked: testObj.score += 1 }
            Button { text: "重赋对象"; onClicked: testObj = {"name": "新对象", "score": 0} }
        }

        Rectangle { height: 2; width: parent.width; color: "gray" }

        // 第7层测试
        Text { text: "[第7层] 序列基础: " + sequenceVal + "，绑定值: " + sequenceBind + " (尝试在onCompleted中破坏绑定)" }
        Button { text: "改变序列基础(验证绑定)"; onClicked: sequenceVal += 1 }
    }

    Component.onCompleted: {
        console.log("====== 启动完成 ======")
        console.log("第7层验证：初始化时 sequenceBind =", sequenceBind)
        // 故意破坏第7层的绑定，让你亲眼看到后果
        sequenceBind = 888
        console.log("在 onCompleted 中用 = 破坏后，sequenceBind =", sequenceBind, "，绑定已永久失效！")
    }
}
```

