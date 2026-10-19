# QML 学习完全手册（PySide6 整合版）

> QML 是 Qt 推出的**声明式 UI 语言**，专门用于设计流畅、动画丰富的界面。它与 Python（PySide6）配合，形成 **“前端 QML + 后端 Python”** 的黄金组合。本手册面向学生，提供最常用组件的用法、参数解释和实战示例，目标直指**桌面宠物**项目开发。

---

## 📖 目录

1. [QML 核心语法](#1-qml-核心语法)
2. [基础元素](#2-基础元素)
3. [交互控件](#3-交互控件)
4. [布局与定位](#4-布局与定位)
5. [信号与事件](#5-信号与事件)
6. [动画系统](#6-动画系统)
7. [列表模型与视图](#7-列表模型与视图)
8. [与 PySide6 整合](#8-与-pyside6-整合)
9. [桌面宠物必备技巧](#9-桌面宠物必备技巧)
10. [工具与调试](#10-工具与调试)
11. [常见问题速查](#11-常见问题速查)

---

## 1. QML 核心语法

### 📌 关于 import 版本的说明
PySide6 内置的 Qt 版本通常是 6.x。你可以在 Python 中执行以下命令查看版本：
```python
import PySide6.QtCore
print(PySide6.QtCore.__version__)
```
如果你的版本是 **6.4+**，建议将本文档中的 `2.15` 替换为 `6.0` 或 `6.2`（如 `import QtQuick 6.0`）。如果使用 `2.15` 报错，换成 `6.0` 即可。

---

### 1.1 声明对象
QML 使用 **花括号 `{}`** 定义对象，**属性名: 值** 来设定属性。

```qml
import QtQuick 6.0

Rectangle {
    width: 200
    height: 100
    color: "red"
}
```

| 语法元素 | 含义 |
|---------|------|
| `import` | 导入模块（必须），版本号与 Qt 版本对应 |
| `Rectangle` | 矩形元素，可设置宽高、颜色、边框等 |
| `属性: 值` | 冒号 `:` 表示属性绑定（不是等号），值可以是数字、字符串、颜色名等 |

---

### 1.2 属性绑定（Property Binding）
属性值可以依赖其他属性，且**动态更新**：

```qml
Rectangle {
    width: parent.width * 0.5   // 宽度始终为父级的一半
    height: width * 0.75        // 高度随宽度变化，保持 4:3
    color: parent.color         // 颜色跟随父级
}
```

---

### ⚠️ 致命陷阱：绑定（`:`） vs 赋值（`=`）

| 写法 | 含义 | 效果 |
|------|------|------|
| `属性: 值`（冒号） | **永久绑定** | 右边变了，左边自动更新。**推荐用于初始化。** |
| `属性 = 值`（等号） | **一次性赋值** | 仅用于 **JavaScript 代码块内部**（如 `onClicked: { ... }`），会**永久破坏**之前的绑定！ |

❌ **错误示例（绑定被破坏）**：
```qml
Rectangle {
    width: parent.width * 0.5  // 绑定：宽度随父窗口变化
    MouseArea {
        anchors.fill: parent
        onClicked: {
            width = 200        // 等号！这次点击后，width 变成固定值 200，
                               // 再也不会随父窗口变化了！
        }
    }
}
```

✅ **正确做法**：如果是临时改变尺寸，应该使用**动画**（`PropertyAnimation`）或**状态切换**（`State`），而不是用 `=` 粗暴赋值。

```qml
Rectangle {
    width: parent.width * 0.5
    MouseArea {
        anchors.fill: parent
        onClicked: {
            // 用动画改变宽度（不会破坏绑定）
            animation.start()
        }
    }
    PropertyAnimation {
        id: animation
        target: parent
        property: "width"
        to: 200
        duration: 300
    }
}
```

---

### 1.3 id（标识符）
给元素起一个唯一名字，方便在其他地方引用：

```qml
Rectangle {
    id: rect
    width: 100
    height: 100
    color: "blue"
}
Text {
    text: "宽度: " + rect.width   // 引用 rect 的宽度
    anchors.centerIn: rect       // 引用 rect 作为锚点
}
```

| 规则 | 说明 |
|------|------|
| `id` 必须唯一 | 同一个文件中不能有两个相同 `id` |
| `id` 以字母开头 | 不能以数字开头 |
| `id` 大小写敏感 | `myRect` 和 `myrect` 是不同的 |
| `id` 不能包含特殊字符 | 不要用 `-`、`.` 等符号 |

---

### 1.4 锚点（anchors）
锚点是 QML 中最主要的定位方式，替代传统布局管理器。

| 锚点属性 | 含义 |
|---------|------|
| `anchors.left` / `right` / `top` / `bottom` | 绑定到其他元素的相应边 |
| `anchors.horizontalCenter` / `verticalCenter` | 水平/垂直居中对齐 |
| `anchors.centerIn` | 完全居中于某元素 |
| `anchors.fill` | 填充某元素（等于四条边都绑定） |
| `anchors.margins` | 统一外边距（所有边） |
| `anchors.leftMargin` / `rightMargin` / `topMargin` / `bottomMargin` | 单独指定某边距 |

```qml
Rectangle {
    width: 400
    height: 300
    color: "lightgray"
    
    Rectangle {
        width: 100
        height: 50
        anchors.centerIn: parent        // 居中
        anchors.margins: 10             // 外边距（若与边绑定才生效）
        color: "blue"
    }
    
    Text {
        anchors.left: parent.left
        anchors.leftMargin: 20
        anchors.bottom: parent.bottom
        anchors.bottomMargin: 10
        text: "左下角文字"
    }
}
```

---

### 1.5 信号处理器（Signal Handlers）
QML 中事件通过 **`on<Signal>`** 形式处理，例如按钮点击用 `onClicked`。

```qml
Button {
    text: "点击我"
    onClicked: {
        console.log("按钮被点击")
    }
}
```

| 要点 | 说明 |
|------|------|
| `console.log()` | 输出到应用程序输出面板（调试用） |
| 大小写敏感 | `onClicked` 是对的，`onclicked` 是错的！ |
| 多个语句 | 用分号 `;` 或换行分隔 |

---

## 2. 基础元素

### 2.1 Rectangle（矩形）
- **用途**：绘制彩色或带边框的矩形，作为容器或背景。
- **常用属性**：

| 属性 | 类型 | 说明 |
|------|------|------|
| `width`, `height` | int | 尺寸（像素） |
| `color` | color | 填充色：`"red"`, `"#FF0000"`, `Qt.rgba(1,0,0,0.5)` |
| `border.color` | color | 边框颜色 |
| `border.width` | int | 边框宽度（像素） |
| `radius` | int | 圆角半径（像素） |
| `opacity` | real | 透明度（0.0 ~ 1.0） |
| `visible` | bool | 是否可见（默认 true） |
| `enabled` | bool | 是否启用（默认 true，false 时不可交互） |

```qml
Rectangle {
    width: 150
    height: 80
    color: "lightgray"
    border.color: "black"
    border.width: 2
    radius: 10
    opacity: 0.8
}
```

---

### 2.2 Text（文本）
- **用途**：显示静态或动态文字。
- **常用属性**：

| 属性 | 类型 | 说明 |
|------|------|------|
| `text` | string | 显示的字符串 |
| `color` | color | 文字颜色 |
| `font.pixelSize` | int | 字体大小（像素） |
| `font.pointSize` | int | 字体大小（点，与 DPI 相关） |
| `font.bold` | bool | 是否粗体 |
| `font.italic` | bool | 是否斜体 |
| `font.family` | string | 字体名称（如 `"Arial"`） |
| `horizontalAlignment` | enum | 水平对齐：`Text.AlignLeft` / `AlignHCenter` / `AlignRight` |
| `verticalAlignment` | enum | 垂直对齐：`Text.AlignTop` / `AlignVCenter` / `AlignBottom` |
| `wrapMode` | enum | 换行模式：`Text.WordWrap`（单词换行）, `Text.NoWrap`（不换行） |
| `elide` | enum | 超出省略号位置：`Text.ElideRight`（右边省略）等 |
| `style` | enum | 样式：`Text.Normal` / `Text.Outline` / `Text.Raised` / `Text.Sunken` |

```qml
Text {
    text: "Hello QML"
    font.pixelSize: 24
    color: "#333333"
    anchors.centerIn: parent
    font.bold: true
    font.family: "微软雅黑"
    style: Text.Outline
    styleColor: "white"
}
```

---

### 2.3 Image（图像）
- **用途**：显示本地或网络图片。
- **常用属性**：

| 属性 | 类型 | 说明 |
|------|------|------|
| `source` | url | 图片路径：本地 `"file:///C:/path/img.png"` 或相对路径 `"img.png"`；网络 `"http://..."` |
| `fillMode` | enum | 填充模式（见下表） |
| `width`, `height` | int | 显示尺寸（若不设置则使用原始尺寸） |
| `sourceSize.width`, `sourceSize.height` | int | 加载时缩放（优化内存） |
| `asynchronous` | bool | 是否异步加载（大图建议 true） |
| `opacity` | real | 透明度 |
| `rotation` | real | 旋转角度（度） |

| fillMode 值 | 含义 |
|-------------|------|
| `Image.Stretch` | 拉伸填满（可能变形） |
| `Image.PreserveAspectFit` | 等比完整显示（留白） |
| `Image.PreserveAspectCrop` | 等比裁剪填充（可能裁剪） |
| `Image.Tile` | 平铺（重复） |
| `Image.TileVertically` | 垂直平铺 |
| `Image.TileHorizontally` | 水平平铺 |

```qml
Image {
    source: "logo.png"
    width: 100
    height: 100
    fillMode: Image.PreserveAspectFit
    asynchronous: true
}
```

---

### 2.4 Item（基础容器）
- **用途**：最轻量级的容器，本身不可见，用于组织子元素。
- **特点**：没有视觉外观，仅提供坐标和尺寸管理。
- **常用属性**：`width`, `height`, `x`, `y`, `opacity`, `visible`, `enabled`。

```qml
Item {
    width: 200
    height: 200
    
    Rectangle {
        anchors.fill: parent
        color: "green"
        radius: 10
    }
    
    Text {
        anchors.centerIn: parent
        text: "嵌套在 Item 中"
        color: "white"
    }
}
```

---

## 3. 交互控件
**需导入**：`import QtQuick.Controls 6.0`

### 3.1 Button（按钮）
- **属性**：

| 属性 | 类型 | 说明 |
|------|------|------|
| `text` | string | 按钮文字 |
| `icon.name` | string | 图标名称（需主题支持） |
| `icon.source` | url | 图标图片路径 |
| `enabled` | bool | 是否可用（不可用时显示灰色） |
| `flat` | bool | 扁平风格（无背景） |
| `checkable` | bool | 是否可保持按下状态 |
| `checked` | bool | 是否被按下（需 `checkable: true`） |

- **信号**：`clicked`, `pressed`, `released`, `doubleClicked`。

```qml
Button {
    text: "提交"
    icon.source: "send.png"
    onClicked: {
        console.log("提交被点击")
    }
}
```

---

### 3.2 TextField（单行输入框）
- **属性**：

| 属性 | 类型 | 说明 |
|------|------|------|
| `text` | string | 当前输入内容 |
| `placeholderText` | string | 占位提示文字（灰色） |
| `echoMode` | enum | 显示模式：`TextField.Normal`（正常）/ `Password`（密码）/ `NoEcho`（不显示） |
| `inputMethodHints` | enum | 提示输入法：`Qt.ImhNumbersOnly`（数字）、`Qt.ImhNoPredictiveText`（无预测） |
| `validator` | Validator | 输入验证器（如 `IntValidator`, `RegExpValidator`） |
| `selectByMouse` | bool | 是否支持鼠标选中 |
| `readOnly` | bool | 只读模式 |

- **信号**：`textChanged`（内容变化）、`accepted`（按回车）、`editingFinished`（编辑完成）。

```qml
TextField {
    id: input
    placeholderText: "请输入用户名"
    selectByMouse: true
    onAccepted: {
        console.log("输入内容:", text)
    }
}
```

---

### 3.3 CheckBox（复选框）
- **属性**：`checked` (bool), `text` (string), `indicator`（自定义指示器）。
- **信号**：`checkedChanged`, `clicked`, `toggled`。

```qml
CheckBox {
    text: "记住我"
    onCheckedChanged: {
        console.log("选中状态:", checked)
    }
}
```

---

### 3.4 Slider（滑块）
- **属性**：

| 属性 | 类型 | 说明 |
|------|------|------|
| `from` | real | 最小值 |
| `to` | real | 最大值 |
| `value` | real | 当前值 |
| `stepSize` | real | 步长（0 表示连续滑动） |
| `orientation` | enum | `Qt.Horizontal` / `Qt.Vertical` |
| `live` | bool | 是否实时发送 `valueChanged`（默认 true） |

- **信号**：`valueChanged`, `positionChanged`。

```qml
Slider {
    id: volumeSlider
    from: 0
    to: 100
    value: 50
    onValueChanged: {
        console.log("音量:", value)
    }
}
```

---

### 3.5 MouseArea（鼠标交互区域）⭐ 桌宠核心组件
- **用途**：侦测鼠标事件，可以覆盖在任何元素之上（实现点击、拖拽、悬停）。
- **核心属性**：

| 属性 | 类型 | 说明 |
|------|------|------|
| `anchors.fill` | Item | 覆盖的目标元素 |
| `hoverEnabled` | bool | 是否启用悬停事件（默认 false） |
| `acceptedButtons` | enum | 接受哪个鼠标键：`Qt.LeftButton`, `Qt.RightButton` 等 |
| `cursorShape` | enum | 鼠标样式：`Qt.PointingHandCursor`, `Qt.OpenHandCursor` 等 |
| `drag.target` | Item | 拖拽目标（设置后可拖拽该元素） |
| `drag.minimumX`, `drag.maximumX` | real | X 轴拖拽范围 |
| `drag.minimumY`, `drag.maximumY` | real | Y 轴拖拽范围 |
| `drag.active` | bool | 是否正在拖拽（只读） |

- **核心信号**：`clicked`, `pressed`, `released`, `entered`（悬停进入）, `exited`（悬停离开）, `positionChanged`（鼠标移动）, `doubleClicked`。

🔥 **桌宠核心功能：拖拽移动**
```qml
Rectangle {
    id: pet
    width: 100
    height: 150
    color: "transparent"
    
    Image {
        anchors.fill: parent
        source: "pet.png"
        fillMode: Image.PreserveAspectFit
    }
    
    MouseArea {
        anchors.fill: parent
        drag.target: parent          // 拖拽时移动整个宠物
        drag.minimumX: 0
        drag.maximumX: 1920          // 限制在屏幕范围内
        drag.minimumY: 0
        drag.maximumY: 1080
        hoverEnabled: true
        
        onClicked: {
            console.log("单击宠物互动")
        }
        onDoubleClicked: {
            console.log("双击切换皮肤")
        }
        onEntered: {
            parent.opacity = 1.0      // 鼠标悬停时高亮
        }
        onExited: {
            parent.opacity = 0.8
        }
    }
}
```

---

## 4. 布局与定位

### 4.1 anchors（锚布局）
锚布局是 QML **首选**的布局方式，已在 [1.4](#14-锚点anchors) 中详细介绍。它灵活强大，大部分情况无需使用 Row/Column。

### 4.2 Row（水平排列）
- **用途**：将子项从左到右依次排列。
- **常用属性**：`spacing`（间距，像素）, `anchors` 可用于整体定位。

```qml
Row {
    spacing: 10
    anchors.centerIn: parent
    Button { text: "A" }
    Button { text: "B" }
    Button { text: "C" }
}
```

### 4.3 Column（垂直排列）
类似 Row，方向垂直。

```qml
Column {
    spacing: 5
    anchors.centerIn: parent
    TextField { placeholderText: "姓名" }
    TextField { placeholderText: "电话" }
    Button { text: "提交" }
}
```

### 4.4 Grid（网格布局）
- **属性**：`rows`（行数）, `columns`（列数）, `spacing`（统一间距）, `flow`（`Grid.LeftToRight` 行优先 / `Grid.TopToBottom` 列优先）。

```qml
Grid {
    columns: 3
    spacing: 10
    anchors.centerIn: parent
    
    Repeater {
        model: 6
        Rectangle {
            width: 50
            height: 50
            color: "lightblue"
            radius: 5
            Text {
                anchors.centerIn: parent
                text: index + 1
            }
        }
    }
}
```

---

## 5. 信号与事件

### 5.1 内置信号处理器
所有交互控件都提供信号，使用 `on<SignalName>` 格式连接，如 `onClicked`、`onTextChanged`、`onPressed` 等。

### 5.2 自定义信号
可以在 QML 文件中使用 `signal` 关键字定义自己的信号，并连接其他对象。

```qml
// MyComponent.qml
Rectangle {
    id: root
    width: 200
    height: 100
    
    signal greeting(string name)      // 定义信号，带字符串参数
    
    Button {
        text: "打招呼"
        onClicked: {
            root.greeting("QML")      // 发射信号
        }
    }
}

// 使用该组件时
MyComponent {
    onGreeting: {
        console.log("收到信号:", name)   // name 是信号传递的参数
    }
}
```

### 5.3 使用 Connections 连接外部信号
有时你需要连接一个未在当前文件中定义的对象信号，可使用 `Connections` 元素。

```qml
Connections {
    target: someOtherObject
    onSomeSignal: {
        console.log("收到外部信号")
    }
}
```

---

## 6. 动画系统

### 6.1 PropertyAnimation（属性动画）
- **用途**：在一段时间内改变一个或多个属性。
- **常用属性**：`target`（目标对象）、`property`（属性名）、`from`（起始值）、`to`（结束值）、`duration`（持续时间，毫秒）、`easing.type`（缓动曲线）。

| easing.type 常用值 | 含义 |
|-------------------|------|
| `Easing.Linear` | 匀速 |
| `Easing.InQuad` / `OutQuad` / `InOutQuad` | 二次缓动 |
| `Easing.InCubic` / `OutCubic` | 三次缓动 |
| `Easing.InOutElastic` | 弹性效果 |
| `Easing.InOutBounce` | 弹跳效果 |

```qml
Rectangle {
    id: rect
    width: 100
    height: 100
    color: "red"
    
    MouseArea {
        anchors.fill: parent
        onClicked: {
            anim.start()
        }
    }
    
    PropertyAnimation {
        id: anim
        target: rect
        property: "width"
        to: 200
        duration: 1000
        easing.type: Easing.InOutQuad
    }
}
```

### 6.2 NumberAnimation（数值动画）
`NumberAnimation` 是 `PropertyAnimation` 的简写，专门针对数值类型。

```qml
NumberAnimation {
    target: rect
    property: "opacity"
    from: 0
    to: 1
    duration: 500
}
```

### 6.3 状态与过渡（State & Transition）
- **State**：定义一组属性更改的集合。
- **Transition**：定义状态切换时的动画。

```qml
Rectangle {
    id: rect
    width: 200
    height: 200
    color: "lightblue"
    state: "default"

    states: [
        State {
            name: "expanded"
            PropertyChanges {
                target: rect
                width: 300
                height: 300
                color: "orange"
            }
        }
    ]
    
    transitions: [
        Transition {
            from: "default"
            to: "expanded"
            PropertyAnimation {
                properties: "width,height,color"
                duration: 500
            }
        },
        Transition {
            from: "expanded"
            to: "default"
            PropertyAnimation {
                properties: "width,height,color"
                duration: 300
            }
        }
    ]
    
    MouseArea {
        anchors.fill: parent
        onClicked: {
            parent.state = (parent.state === "default" ? "expanded" : "default")
        }
    }
}
```

---

## 7. 列表模型与视图

### 7.1 ListView（列表视图）
- **用途**：显示可滚动的项目列表。
- **常用属性**：

| 属性 | 说明 |
|------|------|
| `model` | 数据模型（ListModel 或 Python 模型） |
| `delegate` | 项目模板（每个列表项如何显示） |
| `orientation` | 方向：`ListView.Vertical`（默认）/ `ListView.Horizontal` |
| `spacing` | 项目间距（像素） |
| `currentIndex` | 当前选中项索引 |
| `snapMode` | 吸附模式：`ListView.NoSnap` / `SnapToItem` |

### 7.2 ListModel（列表模型）
在 QML 中直接定义数据。

```qml
ListView {
    width: 200
    height: 300
    anchors.centerIn: parent
    
    model: ListModel {
        ListElement { name: "苹果"; price: 5.0 }
        ListElement { name: "香蕉"; price: 3.5 }
        ListElement { name: "橙子"; price: 4.2 }
        ListElement { name: "西瓜"; price: 8.0 }
    }
    
    delegate: Rectangle {
        height: 40
        width: parent.width
        color: index % 2 ? "#eeeeee" : "#dddddd"
        
        Text {
            anchors.centerIn: parent
            text: name + "：¥" + price.toFixed(1)
            font.pixelSize: 14
        }
    }
}
```

**注意**：`delegate` 内可直接使用模型中的角色名（如 `name`、`price`），以及内置的 `index`（行号）。

### 7.3 Loader（动态加载器）⭐ 桌宠换装核心
- **用途**：按需加载并显示不同的 QML 组件，用于切换页面、弹窗或切换宠物皮肤。
- **核心属性**：

| 属性 | 说明 |
|------|------|
| `source` | 加载外部 QML 文件路径 |
| `sourceComponent` | 加载内联组件 |
| `item` | 获取加载出来的对象（只读） |
| `active` | 是否激活加载（默认 true） |
| `asynchronous` | 是否异步加载 |

🔥 **桌宠换装示例**：
```qml
import QtQuick 6.0
import QtQuick.Controls 6.0
import QtQuick.Window 6.0

Window {
    width: 400
    height: 500
    visible: true
    
    Loader {
        id: petLoader
        anchors.centerIn: parent
        width: 200
        height: 200
        source: "Dog.qml"          // 默认显示狗
    }
    
    Row {
        anchors.bottom: parent.bottom
        anchors.bottomMargin: 20
        anchors.horizontalCenter: parent.horizontalCenter
        spacing: 15
        
        Button {
            text: "🐱 猫咪"
            onClicked: {
                petLoader.source = "Cat.qml"
            }
        }
        Button {
            text: "🐶 狗狗"
            onClicked: {
                petLoader.source = "Dog.qml"
            }
        }
        Button {
            text: "🐰 兔子"
            onClicked: {
                petLoader.source = "Rabbit.qml"
            }
        }
    }
}
```

对应的 `Dog.qml`（简单示例）：
```qml
import QtQuick 6.0

Rectangle {
    width: 200
    height: 200
    color: "transparent"
    
    Image {
        anchors.fill: parent
        source: "dog.png"
        fillMode: Image.PreserveAspectFit
    }
    
    Text {
        anchors.bottom: parent.bottom
        anchors.horizontalCenter: parent.horizontalCenter
        text: "🐕 狗狗"
        font.pixelSize: 20
    }
}
```

---

## 8. 与 PySide6 整合

### 8.1 加载 QML 文件
使用 `QQmlApplicationEngine` 加载。

```python
import sys
from PySide6.QtQml import QQmlApplicationEngine
from PySide6.QtWidgets import QApplication

app = QApplication(sys.argv)
engine = QQmlApplicationEngine()
engine.load("main.qml")   # 加载当前目录下的 main.qml

if not engine.rootObjects():
    sys.exit(-1)

sys.exit(app.exec())
```

### 8.2 从 Python 暴露数据给 QML（上下文属性）
使用 `engine.rootContext().setContextProperty(name, object)`。

```python
from PySide6.QtCore import QObject, Property, Signal

class DataSource(QObject):
    def __init__(self):
        super().__init__()
        self._temperature = 25

    @Property(int, notify=temperatureChanged)   # 使 QML 可绑定
    def temperature(self):
        return self._temperature

    @temperature.setter
    def temperature(self, val):
        if self._temperature != val:
            self._temperature = val
            self.temperatureChanged.emit()

    temperatureChanged = Signal()

# 注册
data = DataSource()
engine.rootContext().setContextProperty("dataSource", data)
```

在 QML 中可直接使用 `dataSource.temperature`，且更新时会自动刷新绑定它的元素。

### 8.3 从 QML 调用 Python 方法（槽）
在 Python 类中定义 `@Slot` 装饰器的方法，然后通过上下文属性暴露。

```python
from PySide6.QtCore import Slot

class Backend(QObject):
    @Slot(str, result=str)
    def greet(self, name):
        return f"Hello, {name}!"

backend = Backend()
engine.rootContext().setContextProperty("backend", backend)
```

QML 中调用：
```qml
Button {
    text: "打招呼"
    onClicked: {
        var result = backend.greet("Alice")
        console.log(result)
    }
}
```

### 8.4 Python 列表模型对接 QML ListView ⭐ 核心进阶
如果要在 QML 中显示 Python 的列表数据（如背包、任务列表），需要继承 `QAbstractListModel`。

```python
from PySide6.QtCore import QAbstractListModel, Qt, Signal, Slot

class PetBackpackModel(QAbstractListModel):
    """Python 端的背包数据模型"""
    def __init__(self, parent=None):
        super().__init__(parent)
        self._items = ["🦴 骨头", "🥏 飞盘", "🐟 小鱼干"]

    def rowCount(self, parent):
        """告诉 QML 有多少行（必须重写）"""
        return len(self._items)

    def data(self, index, role):
        """告诉 QML 每行显示什么（必须重写）"""
        if not index.isValid():
            return None
        return self._items[index.row()]

    @Slot(str)
    def addItem(self, item):
        """暴露给 QML 调用的添加方法"""
        self.beginInsertRows(self.index(len(self._items)), len(self._items), len(self._items))
        self._items.append(item)
        self.endInsertRows()

    @Slot(int)
    def removeItem(self, index):
        """暴露给 QML 调用的删除方法"""
        if 0 <= index < len(self._items):
            self.beginRemoveRows(self.index(index), index, index)
            del self._items[index]
            self.endRemoveRows()

# 在 Python 主程序中：
model = PetBackpackModel()
engine.rootContext().setContextProperty("backendModel", model)
```

在 QML 中使用：
```qml
ListView {
    width: 200
    height: 300
    model: backendModel              // 直接绑定 Python 列表模型
    delegate: Rectangle {
        height: 40
        width: parent.width
        color: index % 2 ? "#eee" : "#ddd"
        Text {
            anchors.centerIn: parent
            text: model.display       // 默认角色名为 display
        }
    }
}

Button {
    text: "添加物品"
    onClicked: {
        backendModel.addItem("🎾 网球")
    }
}
```

### 8.5 信号互连（Python ↔ QML 双向通信）
- **QML 发射信号，Python 接收**：通过上下文属性的对象，在 Python 中连接其信号。
- **Python 发射信号，QML 接收**：在 QML 中使用 `Connections` 连接 Python 对象的信号。

```qml
// main.qml
Connections {
    target: backend
    onPetHungry: {
        console.log("Python 说宠物饿了！")
        // 显示喂食提示
    }
}
```

```python
# Python 端
class PetLogic(QObject):
    petHungry = Signal()

    def checkHunger(self):
        if self.hunger > 80:
            self.petHungry.emit()  # 触发 QML 显示提示
```

---

## 9. 桌面宠物必备技巧

### 9.1 透明窗口
```qml
import QtQuick 6.0
import QtQuick.Window 6.0

Window {
    color: "transparent"              // 关键：背景透明
    width: 300
    height: 300
    visible: true
    
    // ... 宠物内容
}
```

### 9.2 无边框 & 置顶
```qml
Window {
    flags: Qt.FramelessWindowHint | Qt.WindowStaysOnTopHint
    // Qt.FramelessWindowHint - 无边框
    // Qt.WindowStaysOnTopHint - 永远置顶
}
```

### 9.3 鼠标穿透（让鼠标点击穿透窗口）
```qml
Window {
    flags: Qt.FramelessWindowHint | Qt.WindowStaysOnTopHint | Qt.WindowTransparentForInputHint
    // 注意：此模式下无法点击宠物本身，适合纯展示
}
```

通常我们需要部分交互（如拖拽移动），可结合 `MouseArea` 实现（见 [3.5](#35-mousearea鼠标交互区域-)）。

### 9.4 完整桌宠窗口模板
```qml
import QtQuick 6.0
import QtQuick.Window 6.0
import QtQuick.Controls 6.0

Window {
    id: root
    width: 200
    height: 250
    color: "transparent"
    flags: Qt.FramelessWindowHint | Qt.WindowStaysOnTopHint
    
    // 宠物主体
    Rectangle {
        id: petBody
        width: 180
        height: 200
        anchors.centerIn: parent
        color: "transparent"
        
        Image {
            id: petImage
            anchors.fill: parent
            source: "pet_default.png"
            fillMode: Image.PreserveAspectFit
        }
        
        // 状态标签（显示心情/饥饿值）
        Rectangle {
            anchors.bottom: parent.bottom
            anchors.horizontalCenter: parent.horizontalCenter
            width: 80
            height: 25
            color: "rgba(0,0,0,0.6)"
            radius: 12
            
            Text {
                anchors.centerIn: parent
                text: "😊 开心"
                color: "white"
                font.pixelSize: 12
                id: statusText
            }
        }
    }
    
    // 鼠标交互：拖拽 + 点击
    MouseArea {
        anchors.fill: parent
        drag.target: parent
        drag.minimumX: 0
        drag.maximumX: Screen.width - root.width
        drag.minimumY: 0
        drag.maximumY: Screen.height - root.height
        hoverEnabled: true
        
        onClicked: {
            // 点击互动：切换表情
            console.log("点击宠物")
            petImage.source = "pet_happy.png"
            statusText.text = "😄 开心"
            
            // 1秒后恢复
            resetTimer.start()
        }
        
        onDoubleClicked: {
            // 双击：切换皮肤
            console.log("双击换装")
            petImage.source = "pet_cool.png"
            statusText.text = "😎 酷"
        }
        
        onEntered: {
            petBody.scale = 1.05        // 悬停放大
        }
        onExited: {
            petBody.scale = 1.0
        }
    }
    
    // 定时器：恢复默认状态
    Timer {
        id: resetTimer
        interval: 1000
        running: false
        repeat: false
        onTriggered: {
            petImage.source = "pet_default.png"
            statusText.text = "😊 开心"
        }
    }
    
    // 桌面宠物特有的“行走”动画
    NumberAnimation {
        id: walkAnimation
        target: root
        property: "x"
        duration: 3000
        easing.type: Easing.InOutQuad
        onFinished: {
            // 走到边界后反向
            if (root.x > Screen.width - root.width) {
                walkAnimation.to = 0
            } else {
                walkAnimation.to = Screen.width - root.width
            }
            walkAnimation.start()
        }
    }
    
    Component.onCompleted: {
        // 启动行走动画
        walkAnimation.to = Screen.width - root.width
        walkAnimation.start()
    }
}
```

---

## 10. 工具与调试

### 10.1 qmlscene（QML 预览器）
- **命令**：`qmlscene main.qml`
- **用途**：直接运行 QML 文件，无需 Python 代码，适合 UI 原型快速测试。

### 10.2 qmlformat（代码格式化）
- **命令**：`qmlformat -i main.qml`（`-i` 表示直接修改文件）
- **用途**：自动格式化 QML 代码（统一缩进、换行等）。

### 10.3 qmllint（静态检查）
- **命令**：`qmllint main.qml`
- **用途**：检查语法和潜在问题。
- **常见警告**：
  - `Unused import` → 删掉未使用的 import 行
  - `Unused property` → 删掉未使用的属性

### 10.4 Qt Creator 集成
- 在 Qt Creator 中打开 `.qml` 文件，可切换 **“设计”** 模式进行可视化编辑（前提是代码无语法错误）。
- **快捷键**：`Ctrl + R` 运行，`Ctrl + Shift + R` 运行并附加快捷键。

---

## 11. 常见问题速查

| 问题 | 解决办法 |
|------|----------|
| `QML module not found` | 检查 `import` 版本号是否与 Qt 安装版本匹配（如 `6.0` 或 `2.15`） |
| 设计模式灰色不可点 | 确保当前打开的是 `.qml` 文件且代码无编译错误 |
| 窗口显示但空白 | 检查 `visible: true` 是否设置，或窗口尺寸是否为 0 |
| 信号连接不上 | 检查名称拼写（`onClicked` vs `onclicked`），以及是否使用了正确的信号名 |
| 透明窗口有杂色 | 在 `Window` 中设置 `color: "transparent"`，并确保背景没有绘制任何不透明元素 |
| 绑定被破坏（属性不变了） | 检查是否在 JavaScript 中使用了 `=` 赋值，改用动画或状态切换 |
| 图片加载失败 | 检查路径是否正确，本地路径用 `file:///` 前缀或相对路径，网络图片检查网络 |
| Python 方法无法从 QML 调用 | 确认方法上有 `@Slot` 装饰器，且对象已通过 `setContextProperty` 注册 |
| ListView 不显示数据 | 检查 `model` 是否正确设置，`delegate` 中的属性名是否与模型角色匹配 |
| 窗口无法拖拽 | 检查 `MouseArea` 的 `drag.target` 是否设置为 `parent` 或正确的目标 |

---

## 📚 学习路径建议

1. **初级阶段**（第1-2天）：熟练掌握 `Rectangle`, `Text`, `Image`，理解锚点布局。
2. **中级阶段**（第3-5天）：掌握 `Button`, `TextField`, `MouseArea`，实现简单交互。
3. **进阶阶段**（第6-8天）：学习动画、状态切换、列表视图。
4. **实战阶段**（第9-12天）：结合 Python，完成一个完整的桌面宠物原型。
5. **优化阶段**（第13天+）：添加更多宠物交互、换装、AI 对话等高级功能。

---

**开始你的 QML 之旅**：建议先从 `qmlscene` 运行一个简单的 `Hello World` 开始，然后逐步添加控件和动画。结合 Python 后端，你就能开发出功能完整且界面华丽的桌面应用（包括你的桌面宠物）！🎉