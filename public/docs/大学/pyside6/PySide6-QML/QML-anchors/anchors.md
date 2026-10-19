# 卷 02：锚点（anchors）与几何计算流水线深度剖解

> **本卷目标**：彻底搞懂为什么 `x/y` 写了对 `anchors` 无效、`anchors.fill` 和 `width/height` 打架时谁赢、以及布局（Layout）与锚点为什么不能混合使用。
> **阅读时长**：约 30 分钟
> **涉及文件**：`main.qml`（单文件，全部可复制运行）

---

## 🧬 第 0 层：锚点 API 总表与第一性原理

### 📋 官方 API 速查

| 锚点属性组 | 具体属性 | 绑定目标类型 |
| :--- | :--- | :--- |
| **边对边** | `left`, `right`, `top`, `bottom` | 另一个 Item 的对应边 |
| **居中对齐** | `horizontalCenter`, `verticalCenter` | 另一个 Item 的中心线 |
| **填充/居中** | `fill`, `centerIn` | 另一个 Item 本身 |
| **偏移微调** | `margins`（统一）, `leftMargin`/`rightMargin`/`topMargin`/`bottomMargin`（单独）, `horizontalCenterOffset`, `verticalCenterOffset` | 数值（像素） |
| **锚点基准线** | `baseline`（用于文本对齐） | 另一个 Item 的基线 |

### 🔬 第一性原理（必须刻进脑子里）
**QML 渲染引擎处理几何属性的流水线顺序是**：

1. **第一步**：组件构造，读取 `implicitWidth` / `implicitHeight`（隐式尺寸，如 Text 的文字宽度）。
2. **第二步**：应用显式赋值 `width` / `height` 和 `x` / `y`（如果有）。
3. **第三步**：执行 `anchors` 布局引擎。**这一步会无条件覆盖第二步中计算的 `x`、`y`、`width`、`height`**。
4. **第四步**：发射 `geometryChanged()` 信号，通知父级布局已定。

**核心结论**：`anchors` 是 **“最终裁决者”**。只要你在元素上设置了锚点绑定，该元素的 `x/y/width/height` 属性就变成**只读缓存**（改了也白改）。

---

## 🧬 第 1 层：`x`/`y` 与 `anchors` 的“覆盖战争”（附汇编级证明）

### 🧠 底层机制
在 Qt 源码（`qquickanchors.cpp`）中，当 `anchors` 检测到 `target`（目标父级）发生变化时，会强制调用 `QQuickItem::setX()` 和 `setY()`。这个调用发生在**布局传递阶段（Layout Pass）**，晚于你在 `Component.onCompleted` 中直接设置的 `x`。

**强制结论**：**永远不要在同一个 Item 上混用 `x/y` 和 `anchors`**，除非你打算用 `Offset` 微调。

### ✅ 完整示例（亲眼见证覆盖）
```qml
import QtQuick 6.0
import QtQuick.Window 6.0

Window {
    visible: true
    width: 500
    height: 400

    Rectangle {
        id: parentBox
        width: 300
        height: 200
        color: "lightgray"
        anchors.centerIn: parent

        Rectangle {
            id: childBox
            width: 100
            height: 100
            color: "orange"

            // 🔥 战争开始：下面三行代码同时存在
            x: 50               // ① 显式坐标
            y: 20               // ② 显式坐标
            anchors.centerIn: parentBox  // ③ 锚点居中

            // 实际运行结果：③ 生效！①和②被完全无视。
            // 但如果你在运行中打印 x，发现 x 被引擎强制改成了 (300-100)/2 = 100。
        }
    }

    Text {
        text: "橙色矩形的 x 坐标显示为: " + childBox.x + "（证明 50 被覆盖了）"
        anchors.bottom: parent.bottom
        anchors.horizontalCenter: parent.horizontalCenter
        font.pixelSize: 14
    }

    // 调试点击，打印当前 x 值
    MouseArea {
        anchors.fill: parent
        onClicked: console.log("当前子矩形 x:", childBox.x)
    }
}
```
**🟢 运行效果**：橙色矩形精准居中，而不是偏左上角。控制台打印 `x: 100`（`(300-100)/2`）。

### 💣 唯一的微调方式（Offset）
既然混用 `x` 会失效，想挪动位置只能用 `anchors.horizontalCenterOffset` 和 `anchors.verticalCenterOffset`。
```qml
// ✅ 正确微调：在不破坏锚点的情况下偏移
Rectangle {
    width: 100; height: 100; color: "blue"
    anchors.centerIn: parent
    anchors.horizontalCenterOffset: 30   // 往右挪 30px
    anchors.verticalCenterOffset: -10    // 往上挪 10px
}
```

---

## 🧬 第 2 层：`anchors.fill` + `margins` 的“外扩/内缩”计算机制

### 🧠 底层机制
`anchors.fill: target` 在底层生成了四个边绑定：
```
left: target.left
right: target.right
top: target.top
bottom: target.bottom
```
当你加上 `margins: 10` 时，引擎实际上是给**四条边**同时添加了偏移：
```
left: target.left + 10
right: target.right - 10
top: target.top + 10
bottom: target.bottom - 10
```
**关键规则**：`leftMargin` 等单独属性**优先**于统一的 `margins`。如果同时存在，单独属性覆盖统一边距。

### ✅ 完整示例（边距覆盖链）
```qml
import QtQuick 6.0
import QtQuick.Window 6.0

Window {
    visible: true
    width: 400
    height: 300

    Rectangle {
        id: parentRect
        anchors.fill: parent
        color: "white"
        border.color: "black"
        border.width: 2

        Rectangle {
            id: innerRect
            color: "red"
            anchors.fill: parentRect
            anchors.margins: 20           // 统一缩进 20
            anchors.leftMargin: 50        // 👈 单独覆盖左缩进为 50（优先于统一的 20）
            // 最终结果：左缩进 50，右/上/下缩进 20
        }
    }

    Text {
        text: "左边距 50，其他边距 20"
        anchors.bottom: parent.bottom
        anchors.horizontalCenter: parent.horizontalCenter
    }
}
```
**🟢 运行效果**：红色矩形距离父边框左侧明显更远（50px），其他边距均匀 20px。

---

## 🧬 第 3 层：锚点死循环（Binding Loop）的 3 种检测手段

### 🧠 底层机制
当 A 的左边绑定 B 的右边，B 的右边绑定 A 的左边时，引擎在单次事件循环中最多容忍 **5 次属性重算**（硬编码保护），超过则报错 `QML Binding Loop detected` 并停止。

### ❌ 错误示例（制造死循环）
```qml
import QtQuick 6.0
import QtQuick.Window 6.0

Window {
    visible: true
    width: 400
    height: 300

    Rectangle {
        id: leftRect
        width: 50; height: 50; color: "blue"
        x: 100; y: 100
        // ❌ 死循环触发点：自己的 right 绑定到 rightRect 的 left
        anchors.right: rightRect.left
    }

    Rectangle {
        id: rightRect
        width: 50; height: 50; color: "red"
        x: 200; y: 100
        // ❌ 死循环触发点：自己的 left 绑定到 leftRect 的 right
        anchors.left: leftRect.right
    }

    // 引擎报错：Binding loop detected for property "anchors.right"
}
```

### 🛠️ 3 种检测手段
1. **查看控制台输出**：直接显示 `Binding loop detected`，精确指出哪个属性出了问题。
2. **使用 `Component.onCompleted` 打印**：如果组件完成时还在反复重算，说明有循环。
3. **禁用绑定，改用 `onXXXChanged` 手动赋值**（逃逸方案）：
```qml
// 逃逸方案：不用锚点绑定，用信号手动控制
Rectangle {
    id: a
    x: 100
}
Rectangle {
    id: b
    x: 200
    Connections {
        target: a
        onXChanged: b.x = a.x + 50  // 手动赋值，不会触发绑定循环（但有性能损耗）
    }
}
```

---

## 🧬 第 4 层：`anchors` 与 `Layout`（布局器）的“致命冲突”

### 🧠 底层机制（这是桌宠开发中最大的坑）
`RowLayout` / `ColumnLayout` / `GridLayout` 属于 **`QtQuick.Layouts`** 模块。它们**不依赖锚点**，而是使用 **`Layout.fillWidth`** 和 **`Layout.preferredWidth`** 等属性来控制尺寸。

**冲突根源**：布局器（Layout）在**布局传递阶段**会强制调用 `setWidth()` 和 `setX()`。而锚点也在**布局传递阶段**强制调用 `setX()`。**谁写在后，谁生效**。但顺序不可控，导致 **“闪现式”错位**。

**官方禁忌**：**永远不要将 `anchors` 用于 `Layout` 管理的子项**（除非给子项设置了 `Layout.alignment`，这只是调整位置，依然会覆盖锚点）。

### ✅ 完整示例（Layout 与 anchors 打架）
```qml
import QtQuick 6.0
import QtQuick.Window 6.0
import QtQuick.Layouts 6.0

Window {
    visible: true
    width: 400
    height: 300

    ColumnLayout {
        anchors.fill: parent
        spacing: 10

        // ✅ 正确：纯 Layout 控制
        Rectangle {
            Layout.fillWidth: true
            Layout.preferredHeight: 50
            color: "lightgreen"
            Text { anchors.centerIn: parent; text: "Layout控制（正常）" }
        }

        // ❌ 错误：Layout 控制 + anchors 混用
        Rectangle {
            Layout.fillWidth: true
            Layout.preferredHeight: 50
            color: "lightcoral"
            anchors.margins: 30          // 👈 这一行会引发布局错乱或失效！
            Text { anchors.centerIn: parent; text: "加了 anchors.margins（异常）" }
            // 结果：这个矩形可能溢出边界，或者 `Layout.fillWidth` 失效。
        }
    }
}
```
**🟢 运行效果**：第一个绿色矩形正常铺满，第二个红色矩形可能出现溢出、边距混乱或填满失效。

### ✅ 正确做法：纯 Layout 专用调整属性
```qml
// ✅ 正确：用 Layout.margins 代替 anchors.margins
Rectangle {
    Layout.fillWidth: true
    Layout.preferredHeight: 50
    Layout.margins: 30          // 👈 专属于 Layout 的边距
    color: "gold"
    Text { anchors.centerIn: parent; text: "Layout.margins（正确）" }
}
```

---

## 🧬 第 5 层：`anchors.baseline` —— 文本对齐的特殊通道

### 🧠 底层机制
`baseline` 专门用于文本控件（`Text`、`TextField`）的**字母基线**对齐。普通矩形没有 `baseline`，绑定会失效。
**适用场景**：让两个字号不同的文本控件的文字底部对齐（而不是控件底部对齐）。

### ✅ 完整示例（基线与垂直中心对比）
```qml
import QtQuick 6.0
import QtQuick.Window 6.0

Window {
    visible: true
    width: 400
    height: 200

    Row {
        anchors.centerIn: parent
        spacing: 20

        Text {
            id: bigText
            text: "大字号"
            font.pixelSize: 40
            color: "blue"
        }

        Text {
            text: "小字号"
            font.pixelSize: 16
            color: "red"
            // ⚠️ 使用 baseline 对齐，让文字底部严格对齐
            anchors.baseline: bigText.baseline
        }

        // 对比组：使用 verticalCenter 的效果（控件中线对齐，但文字底部不对齐）
        Text {
            text: "对比组"
            font.pixelSize: 20
            color: "gray"
            anchors.verticalCenter: bigText.verticalCenter
        }
    }
}
```
**🟢 运行效果**：蓝色大字和红色小字严格“底部”对齐；灰色文字虽然整体居中，但文字底部明显不平。

---

## 🧬 第 6 层：`Item` 的 `childrenRect` 与锚点计算的关系

### 🧠 核心机制
`childrenRect` 是一个只读属性，返回所有子元素共同占据的矩形范围（`x, y, width, height`）。
当你用锚点把子元素塞满父容器时，父容器如果想自动适配子元素大小，**不能用 `anchors`**（因为锚点是父控子），必须用 `childrenRect` 反过来推父容器宽度。

### ✅ 完整示例（让父容器“包裹”子元素内容）
```qml
import QtQuick 6.0
import QtQuick.Window 6.0

Window {
    visible: true
    width: 400
    height: 300

    // 父容器：宽度和高度由子元素撑开
    Rectangle {
        id: wrapper
        color: "lightyellow"
        border.color: "gray"
        width: childrenRect.width + 40   // 左右各留 20 边距
        height: childrenRect.height + 40
        anchors.centerIn: parent

        // 子元素使用 anchors 定位在父容器内部
        Text {
            id: label
            text: "这段文字撑开父容器"
            font.pixelSize: 24
            anchors.centerIn: parent     // 注意：这里锚点在父容器中心
            // 父容器的宽高依赖 childrenRect，而 childrenRect 依赖子元素的位置和尺寸
        }

        // 为了验证包裹效果，再加一个按钮
        Button {
            text: "再长一点的内容"
            anchors.top: label.bottom
            anchors.topMargin: 10
            anchors.horizontalCenter: parent.horizontalCenter
        }
    }
}
```
**🟢 运行效果**：黄色矩形完美包裹住文字和按钮，不留多余空白。

---

## 🧬 第 7 层：终极实战 —— 桌宠悬浮球（融合全部锚点技巧）

这是本卷的**大综合案例**，实现了：
1. 可拖拽移动（`MouseArea.drag.target`）。
2. 自动吸附屏幕边缘（利用锚点 + `Timer` 动态修改）。
3. 内部控件自适应（`anchors.fill` + `margins`）。

```qml
import QtQuick 6.0
import QtQuick.Window 6.0
import QtQuick.Controls 6.0

Window {
    id: root
    width: 120
    height: 120
    color: "transparent"
    flags: Qt.FramelessWindowHint | Qt.WindowStaysOnTopHint

    // ---- 圆形宠物悬浮球 ----
    Rectangle {
        id: ball
        anchors.fill: parent
        anchors.margins: 5
        radius: width / 2
        color: "#4CAF50"
        border.color: "#388E3C"
        border.width: 3

        // 内部表情
        Text {
            anchors.centerIn: parent
            text: "🐱"
            font.pixelSize: 50
        }

        // 悬停放大特效（Behavior 配合锚点内部属性）
        Behavior on scale {
            NumberAnimation { duration: 150 }
        }
        property bool hovered: false
        scale: hovered ? 1.1 : 1.0
    }

    // ---- 拖拽交互（锚点 + MouseArea 完美配合） ----
    MouseArea {
        id: dragArea
        anchors.fill: parent          // 覆盖整个窗口
        drag.target: root             // 拖拽整个窗口
        hoverEnabled: true

        onEntered: ball.hovered = true
        onExited: ball.hovered = false

        onDoubleClicked: {
            // 双击随机切换颜色（演示 anchors 内部属性修改）
            ball.color = Qt.rgba(Math.random(), Math.random(), Math.random(), 1)
        }
    }

    // ---- 智能吸附屏幕边缘（利用锚点计算的经典应用） ----
    Timer {
        interval: 100
        running: true
        repeat: true
        onTriggered: {
            // 如果窗口靠近右边缘，吸过去
            if (root.x + root.width > Screen.width - 20) {
                root.x = Screen.width - root.width
            }
            // 如果窗口靠近左边缘，吸过去
            if (root.x < 20) {
                root.x = 0
            }
            // 靠近底部
            if (root.y + root.height > Screen.height - 20) {
                root.y = Screen.height - root.height
            }
            // 靠近顶部
            if (root.y < 20) {
                root.y = 0
            }
        }
    }

    // ---- 调试信息（验证锚点动态修改） ----
    Component.onCompleted: {
        console.log("桌宠已启动，请双击变色，拖拽移动")
    }
}
```
**🟢 运行效果**：
1. 绿色圆形小猫悬浮在桌面。
2. 鼠标悬停时放大，移出恢复。
3. 双击变随机颜色。
4. 拖拽到屏幕边缘会自动吸边（类似 MacOS 的 Dock 栏效果）。
5. 窗口透明，不影响点击桌面图标（需配合 `propagateComposedEvents`，但此处无遮挡）。

---

## 📦 本节“锚点机制”一体化测试沙盒

如果你想把上面 7 层的核心机制用一个文件全部验证一遍，直接复制运行下面的代码：

```qml
import QtQuick 6.0
import QtQuick.Window 6.0
import QtQuick.Controls 6.0

Window {
    visible: true
    width: 700
    height: 600
    title: "锚点七层测试沙盒"

    // 切换开关
    property bool useAnchors: true

    Column {
        anchors.fill: parent
        anchors.margins: 20
        spacing: 15

        // ---- 第1层测试：x/y 与 anchors 覆盖 ----
        Rectangle {
            width: parent.width
            height: 60
            color: "whitesmoke"
            border.color: "gray"
            Rectangle {
                id: layer1box
                width: 40
                height: 40
                color: "orange"
                // 开关切换
                x: useAnchors ? 0 : 200
                anchors.centerIn: useAnchors ? parent : undefined
            }
            Text { text: "第1层：橙色方块 " + (useAnchors ? "被锚点居中（x被覆盖）" : "用x:200固定"); anchors.centerIn: parent }
        }

        // ---- 第4层测试：Layout vs anchors ----
        Rectangle {
            width: parent.width
            height: 80
            color: "lavender"
            border.color: "gray"
            RowLayout {
                anchors.fill: parent
                anchors.margins: 5
                Rectangle {
                    Layout.fillWidth: true
                    Layout.preferredHeight: 40
                    color: "lightgreen"
                    Text { anchors.centerIn: parent; text: "纯Layout" }
                }
                Rectangle {
                    Layout.fillWidth: true
                    Layout.preferredHeight: 40
                    color: "lightcoral"
                    anchors.margins: 10  // ❌ 故意混入 anchors
                    Text { anchors.centerIn: parent; text: "Layout+anchors(冲突)" }
                }
            }
        }

        // ---- 第6层测试：childrenRect ----
        Rectangle {
            width: parent.width
            height: 80
            color: "lightyellow"
            border.color: "gray"
            Rectangle {
                id: wrapTarget
                anchors.centerIn: parent
                color: "transparent"
                width: childrenRect.width + 30
                height: childrenRect.height + 20
                border.color: "blue"
                Text { text: "包裹文本"; font.pixelSize: 18; anchors.centerIn: parent }
                Button { text: "扩展按钮"; anchors.top: parent.top; anchors.topMargin: 40 }
            }
        }

        // ---- 第7层：吸附演示（移动窗口感受边缘吸附） ----
        Text { text: "第7层：把本窗口拖到屏幕边缘，观察是否吸附（需配合 Timer）" }

        // ---- 控制开关 ----
        Button {
            text: "切换第1层：锚点/坐标模式"
            onClicked: useAnchors = !useAnchors
        }
    }

    // 第7层吸附逻辑（简易版）
    Timer {
        interval: 50
        running: true
        repeat: true
        onTriggered: {
            if (x < 20) x = 0
            if (x + width > Screen.width - 20) x = Screen.width - width
            if (y < 20) y = 0
            if (y + height > Screen.height - 20) y = Screen.height - height
        }
    }
}
```

