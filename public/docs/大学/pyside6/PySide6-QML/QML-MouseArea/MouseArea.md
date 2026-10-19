# 卷 04：鼠标交互、事件传递与手势处理器深度剖解

> **本卷目标**：搞懂为什么点击子元素会触发父级事件、`preventStealing` 到底在预防什么、以及桌宠拖拽时如何避免误触按钮。
> **阅读时长**：约 35 分钟
> **涉及文件**：`main.qml`（单文件，全部可复制运行）

---

## 🧬 第 0 层：事件系统 API 总表与底层原理（Win32/X11 视角）

### 📋 MouseArea 核心属性速查

| 属性组 | 具体属性 | 作用 |
| :--- | :--- | :--- |
| **区域** | `anchors.fill`, `width`, `height`, `x`, `y` | 鼠标热区范围 |
| **按键** | `acceptedButtons` | 接受哪些鼠标键（`Qt.LeftButton` / `RightButton` / `MiddleButton`） |
| **悬停** | `hoverEnabled` | 是否启用悬停事件（`entered`/`exited`/`positionChanged`） |
| **拖拽** | `drag.target`, `drag.minimumX/Y`, `drag.maximumX/Y`, `drag.axis`, `drag.filterChildren` | 拖拽目标与约束 |
| **光标** | `cursorShape` | 鼠标样式（`Qt.PointingHandCursor` 等） |
| **事件控制** | `propagateComposedEvents`, `preventStealing` | 事件冒泡控制与抢断防护 |
| **信号** | `clicked`, `pressed`, `released`, `entered`, `exited`, `positionChanged`, `wheel` | 各种事件回调 |

### 📋 手势处理器（Qt 6 新组件）速查

| 处理器 | 用途 | 与 MouseArea 的区别 |
| :--- | :--- | :--- |
| `TapHandler` | 点击/轻触 | 不阻挡事件，支持多点触控，延迟执行 |
| `DragHandler` | 拖拽 | 原生支持惯性（`DragHandler.velocity`），不破坏子元素事件 |
| `PinchHandler` | 双指缩放/旋转 | 专为触摸板/触屏设计 |

### 🔬 第一性原理（必须刻进脑子里）
1. **事件来源**：操作系统（Windows/Win32 `WM_MOUSE*`，Linux/X11 `ButtonPress`）→ Qt 平台插件 → `QWindow` → `QQuickWindow` → 转换为 `QMouseEvent` → 传递给 QML 场景。
2. **传递顺序（事件过滤链）**：`QQuickWindow` 收到事件后，按照 **“后创建优先（视觉上层优先）”** 的顺序查询哪个元素接受了事件。
3. **`accepted` 属性的本质**：在底层 C++ 中，`mouse.accepted = false` 会让 `QQuickWindow` 继续向**父级元素**传递同一个 `QMouseEvent` 对象（而不是重新生成一个新事件）。

---

## 🧬 第 1 层：`propagateComposedEvents` —— 事件冒泡（Bubbling）的底层逻辑

### 🧠 底层机制
当子 `MouseArea` 收到事件时，如果它的 `onClicked` 处理完后执行了 `mouse.accepted = false`，事件会**沿着父链向上冒泡**，直到有父级 `MouseArea` 接受它。
**`propagateComposedEvents: true` 的作用**：让组合事件（如 `clicked`、`doubleClicked`）也能被冒泡。默认为 `false`，即 `clicked` 事件在子级被处理后**不会**冒泡到父级。

### ✅ 完整示例（事件冒泡实战）
```qml
import QtQuick 6.0
import QtQuick.Window 6.0

Window {
    visible: true
    width: 400
    height: 300
    title: "事件冒泡演示"

    // 父级矩形（红色背景）
    Rectangle {
        anchors.fill: parent
        color: "lightgray"

        // 父级 MouseArea
        MouseArea {
            anchors.fill: parent
            onClicked: {
                console.log("🔴 父级被点击（接收到了事件）")
            }
            onPressed: console.log("父级按下")
        }

        // 子级矩形（蓝色按钮）
        Rectangle {
            width: 150
            height: 80
            color: "blue"
            radius: 10
            anchors.centerIn: parent

            // 子级 MouseArea
            MouseArea {
                anchors.fill: parent
                propagateComposedEvents: true   // 👈 关键开关

                onClicked: (mouse) => {
                    console.log("🔵 子级被点击")
                    // 如果不加这一行，默认 mouse.accepted = true，事件到此为止
                    mouse.accepted = false      // 👈 放行！让父级也能收到点击
                }
            }

            Text {
                anchors.centerIn: parent
                text: "点击我（冒泡到父级）"
                color: "white"
                font.pixelSize: 14
            }
        }
    }
}
```
**🟢 运行效果**：点击蓝色区域，控制台先打印 `🔵 子级被点击`，紧接着打印 `🔴 父级被点击`（证明了事件成功冒泡）。
**💣 如果 `propagateComposedEvents: false`**，父级不会收到 `clicked`，只会收到 `pressed` 信号（`pressed` 默认会被冒泡）。

---

## 🧬 第 2 层：`preventStealing` —— 子元素拖拽时防止父级“抢走”事件

### 🧠 底层机制（这是桌宠开发最大的坑之一！）
想象一个场景：桌宠身上有一个可拖动的按钮（`Rectangle`），而桌宠整体也可以拖拽。
- 当你拖拽按钮时，鼠标按下后**父级**（桌宠）的 `MouseArea` 可能判定为“用户要拖拽整只宠物”，于是**抢走（Steal）** 了事件，导致按钮无法拖动。

**`preventStealing: true` 的作用**：告诉 QML 引擎“除非用户明确释放鼠标，否则不要把这个事件从我这里抢走”。

### ✅ 完整示例（按钮可拖拽 + 宠物不抢事件）
```qml
import QtQuick 6.0
import QtQuick.Window 6.0

Window {
    visible: true
    width: 300
    height: 300
    flags: Qt.FramelessWindowHint

    // ---- 父级（整个窗口可拖拽） ----
    MouseArea {
        id: parentDragArea
        anchors.fill: parent
        drag.target: parent
        drag.minimumX: 0
        drag.maximumX: Screen.width - parent.width
        drag.minimumY: 0
        drag.maximumY: Screen.height - parent.height

        // ---- 子级：小按钮（可独立拖拽） ----
        Rectangle {
            id: childButton
            width: 80
            height: 60
            color: "orange"
            radius: 10
            anchors.centerIn: parent

            // 关键：子级 MouseArea
            MouseArea {
                anchors.fill: parent
                drag.target: childButton
                drag.minimumX: -childButton.width / 2   // 限制在父级范围内
                drag.maximumX: parentDragArea.width - childButton.width / 2
                drag.minimumY: -childButton.height / 2
                drag.maximumY: parentDragArea.height - childButton.height / 2
                preventStealing: true   // 👈 核心！防止父级抢走拖拽事件

                onClicked: console.log("按钮被点击（拖拽不会误触点击）")
            }

            Text {
                anchors.centerIn: parent
                text: "拖我"
                color: "black"
            }
        }

        // 调试日志
        onPressed: console.log("父级按下了（但不会抢走子级拖拽）")
    }
}
```
**🟢 运行效果**：拖拽橙色按钮时，按钮在窗口中自由移动；拖拽窗口空白区域时，整个窗口移动。两者互不干扰。

### 💣 如果没有 `preventStealing: true`
当你快速拖拽按钮时，鼠标会瞬间被父级 `MouseArea` 判定为“拖拽窗口”，导致按钮停在原地，窗口却移动了。这是一个极其隐蔽的 Bug。

---

## 🧬 第 3 层：`drag` 对象的数学约束（`drag.minimumX` 的坐标系陷阱）

### 🧠 底层机制（坐标空间）
`drag.target` 的 `x` 和 `y` 是相对于**其父级**的坐标。
- 如果 `drag.target` 是窗口本身（`parent`），坐标系是屏幕坐标（因为窗口没有父级）。
- 如果 `drag.target` 是一个在父级内部的 `Rectangle`，坐标系是父级内部坐标系。

**公式**：
`约束后的 x = clamp(鼠标位移, drag.minimumX, drag.maximumX)`

### ✅ 完整示例（让按钮只能在左上角 200x200 区域内移动）
```qml
import QtQuick 6.0
import QtQuick.Window 6.0

Window {
    visible: true
    width: 400
    height: 400

    Rectangle {
        anchors.fill: parent
        color: "lightblue"

        Rectangle {
            id: draggableBox
            width: 60
            height: 60
            color: "red"
            x: 50
            y: 50

            MouseArea {
                anchors.fill: parent
                drag.target: draggableBox
                drag.minimumX: 10
                drag.maximumX: 200
                drag.minimumY: 10
                drag.maximumY: 200
                drag.axis: Drag.XAndYAxis   // 默认就是双向，可改为 Drag.XAxis 限制水平

                onClicked: console.log("位置: (" + draggableBox.x + ", " + draggableBox.y + ")")
            }
        }
    }
}
```
**🟢 运行效果**：红色方块只能在一个 200x200 的矩形区域内移动，无法超出。

---

## 🧬 第 4 层：`hoverEnabled` 的“性能陷阱”与状态机

### 🧠 底层机制（极其重要！）
`hoverEnabled: true` 会在底层调用 `QQuickWindow::setMouseGrabEnabled()`，强制操作系统持续报告鼠标位置（即使没有按下任何键）。
- **代价**：每秒会触发 60~100 次 `positionChanged` 信号。
- **桌宠场景**：如果你在桌宠上启用悬停，并且 `onPositionChanged` 里做了复杂计算（如眼睛跟随鼠标），会导致 **CPU 占用飙升 10%~20%**。

### ✅ 完整示例（高性能悬停 vs 低性能悬停）
```qml
import QtQuick 6.0
import QtQuick.Window 6.0

Window {
    visible: true
    width: 400
    height: 300

    Rectangle {
        id: targetBox
        anchors.centerIn: parent
        width: 150
        height: 150
        color: "green"

        MouseArea {
            id: hoverArea
            anchors.fill: parent
            hoverEnabled: true

            // ⚠️ 警告：下面这行在鼠标移动时会疯狂打印（证明频率）
            onPositionChanged: {
                // console.log("鼠标移动:", mouse.x, mouse.y) // 取消注释会看到刷屏
            }

            onEntered: {
                targetBox.color = "yellow"
                targetBox.scale = 1.1
            }
            onExited: {
                targetBox.color = "green"
                targetBox.scale = 1.0
            }
        }
    }

    Text {
        anchors.bottom: parent.bottom
        text: "悬停进入/退出会改变颜色和大小\n（打开控制台看 positionChanged 刷屏）"
    }
}
```

### 💣 优化方案：延时响应
如果你必须追踪鼠标位置（如桌宠眼睛跟随），不要直接用 `onPositionChanged` 直接操作 UI，而是用 `Timer` 做节流（Throttle），比如 **每 100ms 才更新一次眼睛坐标**，减少 UI 重绘。

---

## 🧬 第 5 层：`Keys` 事件 —— 键盘与鼠标的优先级

### 🧠 底层机制（键盘事件链）
键盘事件的传递顺序是：
1. 当前拥有**焦点（Focus）** 的项（如 `TextInput`）优先处理。
2. 如果没有焦点项，或者焦点项 `event.accepted = false`，事件沿父链向上传递。
3. 顶部父级（通常是 `Window`）作为最后一道防线。

**重要属性**：`focus: true` 必须在当前项上设置，它才能接收键盘事件。

### ✅ 完整示例（方向键控制方块移动 + ESC 退出）
```qml
import QtQuick 6.0
import QtQuick.Window 6.0

Window {
    visible: true
    width: 400
    height: 400

    Rectangle {
        id: box
        width: 60
        height: 60
        color: "purple"
        x: 100
        y: 100

        // 必须设置 focus: true 才能接收键盘
        focus: true

        Keys.onLeftPressed: x -= 10
        Keys.onRightPressed: x += 10
        Keys.onUpPressed: y -= 10
        Keys.onDownPressed: y += 10
        Keys.onEscapePressed: Qt.quit()

        // 键盘组合键（Ctrl+Shift+A）
        Keys.onPressed: (event) => {
            if (event.modifiers & Qt.ControlModifier && event.modifiers & Qt.ShiftModifier && event.key === Qt.Key_A) {
                color = "cyan"
                console.log("Ctrl+Shift+A 按下")
                event.accepted = true
            }
        }

        Text { anchors.centerIn: parent; text: "方向键移动"; color: "white" }
    }

    // 点击窗口其他地方，让方块失去焦点（此时键盘控制失效）
    MouseArea {
        anchors.fill: parent
        onClicked: box.focus = false   // 点击空白，方块失焦，键盘失效
        Text {
            anchors.bottom: parent.bottom
            text: "点击空白处让方块失焦（键盘失效），点击方块重新聚焦"
        }
    }
}
```

---

## 🧬 第 6 层：`TapHandler`（现代手势处理器）VS `MouseArea` 的核心差异

### 🧠 底层机制（Qt 6 新架构）
`MouseArea` 是 **“独占型”** 事件处理器：一旦按下，它会独占鼠标抓取（`grab`），直到松开。
`TapHandler` 是 **“非独占型”** 处理器：它不会长期抓取鼠标，只识别瞬时的点击/滑动。这使得多个 `TapHandler` 可以**同时监听同一个区域**，且互相不干扰（适合移动端多指手势）。

**差异对比**：

| 特性 | MouseArea | TapHandler |
| :--- | :--- | :--- |
| 事件独占 | ✅ 是 | ❌ 否（可共享） |
| 多点触控 | 不支持（只能单指） | ✅ 原生支持（`pointCount`） |
| 延迟识别 | 即时 | 可设置 `longPressThreshold` 延时 |
| 阻止子级事件 | 默认会阻止（需 `propagate...`） | 默认不阻止，透明穿透 |

### ✅ 完整示例（TapHandler 同时检测点击和长按）
```qml
import QtQuick 6.0
import QtQuick.Window 6.0

Window {
    visible: true
    width: 300
    height: 300

    Rectangle {
        anchors.fill: parent
        color: "lightgray"

        Text {
            id: displayText
            anchors.centerIn: parent
            text: "点击或长按我"
            font.pixelSize: 24
        }

        // 👇 两个 Handler 同时存在于同一区域，互不干扰
        TapHandler {
            onTapped: {
                displayText.text = "👆 单次点击"
                displayText.color = "blue"
                console.log("点击")
            }
        }

        TapHandler {
            onLongPressed: {
                displayText.text = "👊 长按识别（延时 800ms）"
                displayText.color = "red"
                console.log("长按")
            }
            longPressThreshold: 800  // 毫秒
        }
    }
}
```
**🟢 运行效果**：轻触文本显示“点击”，长按 0.8 秒显示“长按”。两个事件互不干扰（MouseArea 做不到，因为会被独占）。

---

## 🧬 第 7 层：终极实战 —— 桌宠右键菜单 + 防误触拖拽

这是本卷的**大综合案例**，实现了：
1. 左键拖拽移动宠物（整体）。
2. 右键点击弹出上下文菜单。
3. 单击宠物身体触发动画（非拖拽时）。
4. 使用 `preventStealing` 防止按钮误触拖拽。

```qml
import QtQuick 6.0
import QtQuick.Window 6.0
import QtQuick.Controls 6.0

Window {
    id: root
    width: 200
    height: 200
    color: "transparent"
    flags: Qt.FramelessWindowHint | Qt.WindowStaysOnTopHint

    // -------- 宠物身体 --------
    Rectangle {
        id: petBody
        anchors.fill: parent
        anchors.margins: 10
        radius: 20
        color: "#FF6B6B"
        border.color: "#C0392B"
        border.width: 2

        // 宠物表情
        Text {
            id: emoji
            anchors.centerIn: parent
            text: "😺"
            font.pixelSize: 70
        }

        // 状态标签（悬停提示）
        Text {
            id: statusLabel
            anchors.bottom: parent.bottom
            anchors.horizontalCenter: parent.horizontalCenter
            text: "拖拽移动 | 右键菜单"
            color: "white"
            font.pixelSize: 10
            visible: false
        }
    }

    // -------- 交互层（左键拖拽整个窗口） --------
    DragHandler {
        id: dragHandler
        acceptedButtons: Qt.LeftButton
        target: root
        // 只有在按住左键且移动距离 > 5px 时才认为是拖拽（防止点击误触）
        threshold: 5
        onActiveChanged: {
            if (!active) {
                // 如果拖拽距离很小，视为点击而非拖拽
                if (dragHandler.translation.x < 5 && dragHandler.translation.y < 5) {
                    onClickAction()
                }
            }
        }
    }

    // -------- 右键菜单（TapHandler 替代传统的 MouseArea） --------
    TapHandler {
        acceptedButtons: Qt.RightButton
        onTapped: {
            // 弹出简易菜单（使用 Popup）
            menuPopup.open()
        }
    }

    // 右键菜单弹窗
    Popup {
        id: menuPopup
        x: root.x + 10
        y: root.y + 10
        width: 120
        height: 100
        modal: false
        focus: true
        closePolicy: Popup.CloseOnPressOutside

        Column {
            spacing: 5
            Button { text: "😡 生气"; onClicked: { emoji.text = "😡"; menuPopup.close() } }
            Button { text: "😴 睡觉"; onClicked: { emoji.text = "😴"; menuPopup.close() } }
            Button { text: "🎉 开心"; onClicked: { emoji.text = "🎉"; menuPopup.close() } }
            Button { text: "关闭宠物"; onClicked: { root.close(); menuPopup.close() } }
        }
    }

    // -------- 悬停显示提示（鼠标进入宠物区域） --------
    TapHandler {
        acceptedButtons: Qt.NoButton  // 不响应点击，只响应悬停/触摸
        hoverEnabled: true
        onHoveredChanged: {
            statusLabel.visible = hovered
            if (hovered) {
                petBody.scale = 1.03
            } else {
                petBody.scale = 1.0
            }
        }
    }

    // -------- 点击处理逻辑（防误触） --------
    function onClickAction() {
        console.log("单击宠物，触发互动")
        emoji.text = "😻"
        // 制作一个闪烁动画
        var colorAnim = Qt.createQmlObject(
            'import QtQuick 6.0; PropertyAnimation { target: petBody; property: "color"; to: "#FFD93D"; duration: 200; onFinished: { target.color = "#FF6B6B" } }',
            parent, "colorAnim")
        colorAnim.start()
    }

    // 启动日志
    Component.onCompleted: {
        console.log("🐱 桌宠已启动：左键拖拽 | 右键菜单 | 单击互动")
    }
}
```

**🟢 运行效果**：
1. **左键拖拽**：按住宠物任意区域移动，窗口跟随（阈值 5px 防止点击误触）。
2. **右键点击**：弹出菜单，切换表情或关闭。
3. **悬停**：宠物轻微放大，底部出现提示标签。
4. **单击**：变色闪烁，切换为“😻”表情。

---

## 📦 本节“事件与交互”一体化测试沙盒

如果你想把上面 7 层的核心机制用一个文件全部验证一遍，直接复制运行下面的代码：

```qml
import QtQuick 6.0
import QtQuick.Window 6.0
import QtQuick.Controls 6.0

Window {
    visible: true
    width: 700
    height: 600
    title: "事件交互七层测试沙盒"

    // ----- 多层嵌套的点击区域 -----
    Rectangle {
        anchors.fill: parent
        anchors.margins: 10
        color: "#f0f0f0"

        // 第1层：绿色区域（父级）
        Rectangle {
            id: layer1
            width: 600
            height: 200
            color: "#A8D5BA"
            anchors.horizontalCenter: parent.horizontalCenter
            radius: 10

            MouseArea {
                anchors.fill: parent
                onClicked: console.log("🟢 第1层（绿色）被点击")
            }

            // 第2层：蓝色区域（子级）- 测试 propagateComposedEvents
            Rectangle {
                id: layer2
                width: 400
                height: 100
                color: "#74B9FF"
                anchors.centerIn: parent
                radius: 8

                MouseArea {
                    id: layer2Mouse
                    anchors.fill: parent
                    propagateComposedEvents: true
                    onClicked: (mouse) => {
                        console.log("🔵 第2层（蓝色）被点击 - 放行事件")
                        mouse.accepted = false
                    }
                }

                // 第3层：红色小方块（最内层）- 测试 preventStealing 和 drag
                Rectangle {
                    id: layer3
                    width: 60
                    height: 60
                    color: "#FF6B6B"
                    radius: 5
                    x: 50
                    y: 20

                    MouseArea {
                        anchors.fill: parent
                        preventStealing: true
                        drag.target: layer3
                        drag.minimumX: 0
                        drag.maximumX: layer2.width - layer3.width
                        drag.minimumY: 0
                        drag.maximumY: layer2.height - layer3.height

                        onClicked: console.log("🔴 第3层（红色）被点击 - 不冒泡")
                    }

                    Text { anchors.centerIn: parent; text: "拖我"; color: "white"; font.pixelSize: 12 }
                }

                Text { anchors.bottom: parent.bottom; text: "点击蓝色（冒泡到绿色） | 红色可拖拽"; font.pixelSize: 12; color: "#333" }
            }
        }

        // ----- 第4层：hover 性能测试 -----
        Rectangle {
            id: hoverTest
            width: 200
            height: 100
            color: "#FFEAA7"
            radius: 10
            anchors.top: layer1.bottom
            anchors.topMargin: 20
            anchors.horizontalCenter: parent.horizontalCenter

            MouseArea {
                anchors.fill: parent
                hoverEnabled: true
                onEntered: hoverTest.color = "#FDCB6E"
                onExited: hoverTest.color = "#FFEAA7"
                // 注释掉下面的打印以节省性能
                // onPositionChanged: console.log("x:", mouse.x, "y:", mouse.y)
            }
            Text { anchors.centerIn: parent; text: "悬停变色（开控制台看刷屏）"; font.pixelSize: 12 }
        }

        // ----- 第6层：TapHandler 对比测试 -----
        Rectangle {
            id: handlerTest
            width: 200
            height: 100
            color: "#DFE6E9"
            radius: 10
            anchors.top: hoverTest.bottom
            anchors.topMargin: 20
            anchors.horizontalCenter: parent.horizontalCenter

            Text { id: tapDisplay; anchors.centerIn: parent; text: "点击/长按我"; font.pixelSize: 14 }

            TapHandler {
                onTapped: { tapDisplay.text = "👆 点击"; tapDisplay.color = "blue" }
            }
            TapHandler {
                onLongPressed: { tapDisplay.text = "👊 长按"; tapDisplay.color = "red" }
                longPressThreshold: 600
            }
        }

        // ----- 第5层：Keys 键盘测试 -----
        Rectangle {
            id: keyTest
            width: 200
            height: 100
            color: "#74B9FF"
            radius: 10
            anchors.top: handlerTest.bottom
            anchors.topMargin: 20
            anchors.horizontalCenter: parent.horizontalCenter
            focus: true  // 必须聚焦

            property int counter: 0

            Keys.onPressed: (event) => {
                if (event.key === Qt.Key_Space) {
                    counter += 1
                    keyTest.color = counter % 2 ? "#74B9FF" : "#E17055"
                    console.log("空格按了", counter, "次")
                    event.accepted = true
                }
                if (event.key === Qt.Key_Escape) {
                    console.log("ESC 按下，退出程序")
                    Qt.quit()
                }
            }

            Text { anchors.centerIn: parent; text: "点击我后按【空格】变色"; color: "white"; font.pixelSize: 14 }
        }
    }
}
```
**🟢 运行效果**：
- **红色方块**：可在蓝色区域内拖拽，点击不会触发父级。
- **蓝色区域**：点击后冒泡到绿色区域（控制台两条日志）。
- **黄色区域**：悬停变色，体验高频 `positionChanged`。
- **灰色区域**：点击显示“点击”，长按显示“长按”。
- **蓝色键盘测试**：点击后按空格变色，按 ESC 退出。

---

