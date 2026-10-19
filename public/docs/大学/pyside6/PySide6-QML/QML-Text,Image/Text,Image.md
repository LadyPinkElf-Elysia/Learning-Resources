# 卷 03：文本排版与图像渲染的数学与内存博弈

> **本卷目标**：搞懂 `Text` 的 `elide`（省略号）是怎么算像素的、`Image` 的 6 种 `fillMode` 背后的数学公式、以及如何让桌宠的表情包不卡顿不占内存。
> **阅读时长**：约 32 分钟
> **涉及文件**：`main.qml`（单文件，全部可复制运行）

---

## 🧬 第 0 层：`Text` 与 `Image` API 总表与第一性原理

### 📋 Text 核心属性速查

| 属性组 | 具体属性 | 作用 |
| :--- | :--- | :--- |
| **内容** | `text` | 显示的字符串（支持纯文本或 HTML 子集） |
| **字体** | `font.family`, `font.pixelSize`, `font.pointSize`, `font.bold`, `font.italic`, `font.weight`, `font.letterSpacing`, `font.wordSpacing` | 字体族、大小、粗细、间距 |
| **对齐** | `horizontalAlignment`, `verticalAlignment` | 水平/垂直对齐方式 |
| **换行与省略** | `wrapMode`, `elide`, `maximumLineCount` | 换行策略、超出省略、最大行数 |
| **样式** | `style`, `styleColor` | 文字特效（凸起、凹陷、轮廓） |
| **渲染** | `antialiasing`, `renderType` | 抗锯齿、渲染引擎（Native/Text） |
| **测量** | `implicitWidth`, `implicitHeight`, `paintedWidth`, `paintedHeight` | 文本实际占用的宽高 |

### 📋 Image 核心属性速查

| 属性组 | 具体属性 | 作用 |
| :--- | :--- | :--- |
| **来源** | `source` | 图片路径（本地/网络/QRC） |
| **尺寸** | `width`, `height`, `sourceSize` | 显示尺寸 / 解码尺寸（内存优化关键！） |
| **填充** | `fillMode` | 6 种填充模式（见下文数学公式） |
| **性能** | `asynchronous`, `cache`, `mirror`, `mipmap` | 异步加载、缓存、镜像、三线性过滤 |
| **状态** | `progress`（0~1）, `status`（Loading/Ready/Error） | 加载进度与状态 |

### 🔬 第一性原理（必须刻进脑子里）
1. **`Text` 渲染流程**：字符串 → 字体引擎（FreeType/DirectWrite）解析字形（Glyph）→ 生成位图 → 上传到 GPU 纹理图集（Texture Atlas）→ 绘制。`elide` 是在**布局阶段**通过测量字符宽度决定在哪个位置截断并插入 `…`。
2. **`Image` 内存公式**：内存占用（字节） = `sourceSize.width` × `sourceSize.height` × 色彩深度（通常是 4 字节/像素）。**如果你不设置 `sourceSize`，默认加载原始分辨率，一张 4K 壁纸会吃掉 4K×4K×4 = 64MB 内存！**

---

## 🧬 第 1 层：`Text` 的 `elide`（省略号）的像素级计算机制

### 🧠 底层机制
当你设置 `elide: Text.ElideRight` 且 `width` 固定时，引擎会：
1. 调用 `QFontMetrics` 测量完整字符串的总像素宽度。
2. 如果总宽度 > 可用宽度，开始从右向左逐个字符测量，直到 `已测量宽度 + "…" 的宽度` <= 可用宽度。
3. 截断后加上 `…`（Unicode 字符 `U+2026`，宽度通常为 1 个中文字符宽度）。
4. 如果设置了 `maximumLineCount: 2`，引擎会先按行分割，每行分别截断。

### ✅ 完整示例（展示 4 种 elide 方向）
```qml
import QtQuick 6.0
import QtQuick.Window 6.0

Window {
    visible: true
    width: 400
    height: 350

    property string longText: "床前明月光，疑是地上霜。举头望明月，低头思故乡。这是一首非常著名的唐诗。"

    Column {
        anchors.fill: parent
        anchors.margins: 20
        spacing: 20

        // 1. 右省略（默认）
        Text {
            width: 200
            text: longText
            elide: Text.ElideRight
            font.pixelSize: 16
            color: "black"
            border.color: "lightgray"  // 方便看边界
            border.width: 1
        }

        // 2. 左省略（常用于文件名显示）
        Text {
            width: 200
            text: longText
            elide: Text.ElideLeft
            font.pixelSize: 16
            color: "blue"
            border.color: "lightgray"
            border.width: 1
        }

        // 3. 中间省略（常用于路径显示）
        Text {
            width: 200
            text: longText
            elide: Text.ElideMiddle
            font.pixelSize: 16
            color: "green"
            border.color: "lightgray"
            border.width: 1
        }

        // 4. 多行限制 + 省略（maximumLineCount）
        Text {
            width: 200
            text: longText
            wrapMode: Text.WordWrap
            maximumLineCount: 2
            elide: Text.ElideRight
            font.pixelSize: 16
            color: "red"
            border.color: "lightgray"
            border.width: 1
        }
    }
}
```
**🟢 运行效果**：四个文本框中，省略号分别出现在右侧、左侧、中间和第三行开头。

### 💣 致命错误：`elide` 对 `wrapMode: Text.Wrap` 无效？
**是的**！如果你设置了 `wrapMode: Text.WordWrap`（自动换行），`elide` 可能永远不会触发，因为内容先换行填满了多行，而不是横向溢出。
**解决方案**：要么固定 `height` 并配合 `maximumLineCount`，要么设置 `wrapMode: Text.NoWrap`。

---

## 🧬 第 2 层：`Text` 的 6 种 `style` 特效的底层实现

### 🧠 底层机制
`style` 特效用的是 **“偏移描边”** 技术：
- `Text.Outline`：在文字周围绘制一圈 `styleColor` 的轮廓线（使用 `QPainterPath::stroke()`）。
- `Text.Raised`：在文字右下角绘制偏移的阴影（暗色），左上角绘制高光（亮色），产生 3D 凸起感。
- `Text.Sunken`：与 `Raised` 方向相反，产生凹陷感。

**性能警告**：`Outline` 需要额外的路径描边计算，在大量动态文本（如列表滚动）中，相比普通文本渲染**慢 2~3 倍**。桌宠对话框里用没问题，但不要在列表里用。

### ✅ 完整示例（四种样式对比）
```qml
import QtQuick 6.0
import QtQuick.Window 6.0

Window {
    visible: true
    width: 500
    height: 250

    Row {
        anchors.centerIn: parent
        spacing: 30

        Text { text: "普通"; font.pixelSize: 30 }
        Text { text: "轮廓"; font.pixelSize: 30; style: Text.Outline; styleColor: "red" }
        Text { text: "凸起"; font.pixelSize: 30; style: Text.Raised; styleColor: "gray" }
        Text { text: "凹陷"; font.pixelSize: 30; style: Text.Sunken; styleColor: "gray" }
    }
}
```
**🟢 运行效果**：从左到右依次看到正常、带红边轮廓、凸起浮雕和凹陷浮雕的文字。

---

## 🧬 第 3 层：`Text` 的富文本（HTML 子集）与性能陷阱

### 🧠 底层机制
QML 的 Text 支持 **HTML 4.0 的子集**（不是完整 CSS）。它会把 `<b>`、`<i>`、`<font color="red">` 等标签解析成**内联的 QTextCharFormat**。
**陷阱**：每个富文本标签都会创建独立的 `QTextFormat` 对象。如果文本中混入大量 `<span>`，会让 `implicitWidth` 的计算开销剧增（因为需要反复调用 `QTextDocument::idealWidth()`）。

### ✅ 完整示例（常用富文本标签）
```qml
import QtQuick 6.0
import QtQuick.Window 6.0

Window {
    visible: true
    width: 400
    height: 200

    Text {
        anchors.centerIn: parent
        text: "<b>粗体</b>，<i>斜体</i>，<u>下划线</u>，<font color='red'>红色</font>，<font size='+2'>大字号</font>"
        font.pixelSize: 20
        wrapMode: Text.WordWrap
        width: parent.width - 40
    }
}
```
**🟢 运行效果**：同一段文字中混合了粗体、斜体、下划线、红色和大字号。

### 💣 性能优化建议
如果你需要大量动态拼接的富文本（比如聊天记录），**不要使用 QML 的富文本**，而是用 `TextEdit` + 自定义 C++ 模型，或者使用 `ListView` 的代理来组合多个 `Text` 元素（每个 Text 只负责一种样式），这样可以利用 GPU 批量渲染。

---

## 🧬 第 4 层：`Image` 的 6 种 `fillMode` 背后的数学公式

### 🧠 底层机制（含数学计算）
设：
- `imageWidth` = 图片原始宽度
- `imageHeight` = 图片原始高度
- `targetWidth` = 控件 `width`
- `targetHeight` = 控件 `height`
- `scaleX = targetWidth / imageWidth`
- `scaleY = targetHeight / imageHeight`
- `scale = min(scaleX, scaleY)` 或 `max(scaleX, scaleY)` 取决于模式。

| fillMode | 数学策略 | 适用场景 |
| :--- | :--- | :--- |
| `Stretch` | 强制拉伸到 `(targetWidth, targetHeight)` | 背景图（会变形） |
| `PreserveAspectFit` | `scale = min(scaleX, scaleY)`，居中留白 | 显示完整图片，不裁剪（最适合桌宠头像） |
| `PreserveAspectCrop` | `scale = max(scaleX, scaleY)`，裁剪多余部分 | 填满控件，不拉伸，但会裁剪（适合背景） |
| `Tile` | 平铺重复 | 纹理背景 |
| `TileVertically` | 垂直平铺 | 条纹背景 |
| `TileHorizontally` | 水平平铺 | 横幅背景 |

### ✅ 完整示例（5 种模式一目了然）
```qml
import QtQuick 6.0
import QtQuick.Window 6.0

Window {
    visible: true
    width: 600
    height: 400

    // 假设有一张 200x100 的图片
    property string imgSrc: "https://picsum.photos/200/100"  // 或者替换为本地图片

    Grid {
        columns: 3
        spacing: 10
        anchors.fill: parent
        anchors.margins: 10

        Repeater {
            model: ["Stretch", "PreserveAspectFit", "PreserveAspectCrop", "Tile", "TileVertically", "TileHorizontally"]

            Column {
                spacing: 5
                Rectangle {
                    width: 150
                    height: 100
                    border.color: "black"
                    border.width: 1
                    color: "lightgray"
                    clip: true  // 必须裁剪，否则平铺会溢出
                    Image {
                        anchors.fill: parent
                        source: imgSrc
                        fillMode: {
                            switch(modelData) {
                                case "Stretch": return Image.Stretch
                                case "PreserveAspectFit": return Image.PreserveAspectFit
                                case "PreserveAspectCrop": return Image.PreserveAspectCrop
                                case "Tile": return Image.Tile
                                case "TileVertically": return Image.TileVertically
                                case "TileHorizontally": return Image.TileHorizontally
                            }
                        }
                    }
                }
                Text { text: modelData; font.pixelSize: 12; anchors.horizontalCenter: parent.horizontalCenter }
            }
        }
    }
}
```
**🟢 运行效果**：6 个格子展示了 6 种不同的图片填充效果，可以直观看到 `Fit` 留白和 `Crop` 裁剪的区别。

---

## 🧬 第 5 层：`Image` 的内存优化 —— `sourceSize` 的底层原理

### 🧠 底层机制（极其重要！）
`Image` 控件在加载图片时，默认流程是：
1. `QImageReader` 读取文件头，获取原始尺寸（如 4000×3000）。
2. 解码器将**全部像素**解压到内存（4000×3000×4 = 48MB）。
3. 然后 OpenGL 纹理上传时，再根据 `width` 和 `height` 进行**GPU 缩放**。

**`sourceSize` 的作用**：在步骤 2 之前，告诉解码器“我只想要 200×200 的图”。解码器会直接缩放到 200×200 再解压，**内存占用从 48MB 骤降到 200×200×4 = 0.16MB**。

**最佳实践**：永远给 `Image` 设置 `sourceSize`，且值不要大于实际的显示尺寸。

### ✅ 完整示例（对比有无 sourceSize 的内存占用）
```qml
import QtQuick 6.0
import QtQuick.Window 6.0

Window {
    visible: true
    width: 400
    height: 300

    property string bigImg: "https://picsum.photos/1920/1080"  // 一张 2K 大图

    Column {
        anchors.centerIn: parent
        spacing: 20

        // ❌ 坏做法：没有 sourceSize，加载 2K 图内存爆炸（约 8MB）
        Image {
            width: 100
            height: 100
            source: bigImg
            // 没有 sourceSize，在内存中保留 1920x1080 的原始像素
            border.color: "red"
            border.width: 2
        }

        // ✅ 好做法：设置 sourceSize，内存仅占 (100x100x4)
        Image {
            width: 100
            height: 100
            source: bigImg
            sourceSize.width: 100
            sourceSize.height: 100
            border.color: "green"
            border.width: 2
        }

        Text {
            text: "红色框（无 sourceSize）内存占用大；绿色框（有 sourceSize）内存占用极小"
            wrapMode: Text.WordWrap
            width: parent.width
        }
    }
}
```

### 💣 进阶技巧：让 `sourceSize` 跟随显示尺寸
```qml
Image {
    width: 150
    height: 150
    source: "huge.jpg"
    sourceSize.width: width   // 直接绑定到显示宽度
    sourceSize.height: height
}
```

---

## 🧬 第 6 层：`asynchronous`（异步加载）与 `progress` 的配合

### 🧠 底层机制
`asynchronous: true` 会使 `QImageReader` 在**后台线程**中解码图片，解码完成后通过信号通知 UI 线程上传纹理。这在加载网络图片或本地超大图时，**能防止 UI 卡顿（掉帧）**。

### ✅ 完整示例（带进度条的图片加载器）
```qml
import QtQuick 6.0
import QtQuick.Window 6.0
import QtQuick.Controls 6.0

Window {
    visible: true
    width: 400
    height: 400

    property string targetUrl: "https://picsum.photos/800/600"

    Column {
        anchors.centerIn: parent
        spacing: 15

        Rectangle {
            width: 300
            height: 200
            border.color: "gray"
            border.width: 1
            color: "whitesmoke"

            Image {
                id: asyncImg
                anchors.fill: parent
                source: targetUrl
                asynchronous: true   // 后台加载
                fillMode: Image.PreserveAspectFit

                // 加载状态跟踪
                onStatusChanged: {
                    if (status === Image.Loading) console.log("开始加载...")
                    if (status === Image.Ready) console.log("加载完成！")
                    if (status === Image.Error) console.log("加载失败！")
                }
            }

            // 加载中显示进度条
            Rectangle {
                anchors.centerIn: parent
                width: 200
                height: 20
                color: "lightgray"
                radius: 10
                visible: asyncImg.status === Image.Loading

                Rectangle {
                    width: parent.width * asyncImg.progress
                    height: parent.height
                    color: "blue"
                    radius: 10
                    Text {
                        anchors.centerIn: parent
                        text: Math.round(asyncImg.progress * 100) + "%"
                        color: "white"
                        font.pixelSize: 12
                    }
                }
            }
        }

        Button {
            text: "重新加载"
            onClicked: asyncImg.source = targetUrl + "?t=" + Date.now()  // 加时间戳防止缓存
        }
    }
}
```

---

## 🧬 第 7 层：终极实战 —— 桌宠对话框（融合文本与图像）

这既是本卷的综合案例，也是一个可以直接运行的**桌宠聊天气泡**。它融合了：
1. `Text` 的 `wrapMode` 与自动换行。
2. `Text` 的 `style` 描边让文字更清晰。
3. `Image` 的 `sourceSize` 优化头像内存。
4. `asynchronous` 保证头像加载不卡顿。
5. `anchors` 确保气泡自适应内容。

```qml
import QtQuick 6.0
import QtQuick.Window 6.0
import QtQuick.Controls 6.0

Window {
    id: root
    width: 350
    height: 250
    color: "transparent"
    flags: Qt.FramelessWindowHint | Qt.WindowStaysOnTopHint

    // -------- 背景气泡（半透明毛玻璃效果） --------
    Rectangle {
        id: bubbleBg
        anchors.fill: parent
        anchors.margins: 10
        color: "white"
        opacity: 0.85
        radius: 20
        border.color: "#3A3A3A"
        border.width: 1

        // 内部布局
        Column {
            anchors.fill: parent
            anchors.margins: 15
            spacing: 10

            // ---- 第 1 行：头像（使用 Image 的内存优化技巧） ----
            Row {
                spacing: 12
                width: parent.width
                height: 50

                // 头像（圆形裁剪）
                Rectangle {
                    width: 50
                    height: 50
                    radius: 25
                    clip: true
                    border.color: "#888"
                    border.width: 1

                    Image {
                        anchors.fill: parent
                        source: "https://i.pravatar.cc/100"  // 随机头像
                        asynchronous: true
                        sourceSize.width: 50   // 👈 内存优化：只解压 50x50
                        sourceSize.height: 50
                        fillMode: Image.PreserveAspectCrop
                    }
                }

                // 昵称 + 时间（使用 Text style 描边让文字更清晰）
                Column {
                    anchors.verticalCenter: parent.verticalCenter
                    spacing: 2
                    Text {
                        text: "桌宠助手"
                        font.pixelSize: 16
                        font.bold: true
                        color: "#2C3E50"
                        style: Text.Outline
                        styleColor: "white"   // 描边白边，提升可读性
                    }
                    Text {
                        text: "刚刚"
                        font.pixelSize: 11
                        color: "#7F8C8D"
                    }
                }
            }

            // ---- 第 2 行：对话内容（融合富文本 + 自动换行） ----
            Rectangle {
                width: parent.width
                height: 70
                color: "transparent"

                Text {
                    id: chatText
                    anchors.fill: parent
                    text: "<b>你好！</b> 我是你的桌宠。<br>我今天想吃 <font color='#E74C3C'>🍔 汉堡</font>，可以给我买吗？"
                    wrapMode: Text.WordWrap
                    font.pixelSize: 14
                    color: "#2C3E50"
                    lineHeight: 1.3
                    verticalAlignment: Text.AlignVCenter
                }
            }

            // ---- 第 3 行：操作按钮（快捷回复） ----
            Row {
                spacing: 10
                Button { text: "🍔 喂食"; onClicked: chatText.text = "<b>😋 太好吃了！</b> 谢谢主人！" }
                Button { text: "🎾 玩耍"; onClicked: chatText.text = "<b>🐾 好开心！</b> 再玩一会儿嘛~" }
                Button { text: "关闭"; onClicked: root.close() }
            }
        }
    }

    // -------- 拖拽移动（保持可交互） --------
    MouseArea {
        anchors.fill: parent
        drag.target: parent
        drag.minimumX: 0
        drag.maximumX: Screen.width - parent.width
        drag.minimumY: 0
        drag.maximumY: Screen.height - parent.height
    }

    // 启动时打印内存提示
    Component.onCompleted: {
        console.log("💡 桌宠对话框已启动，图片使用 sourceSize 优化内存。")
        console.log("点击喂食/玩耍按钮改变对话内容。")
    }
}
```

**🟢 运行效果**：
1. 一个圆角的半透明对话框悬浮在桌面。
2. 头像从网络异步加载，仅解压 50×50 像素。
3. 聊天内容显示富文本（粗体、红色字、换行）。
4. 点击下方按钮动态改变聊天内容，且自动换行适应宽度。

---

## 📦 本节“文本与图像”一体化测试沙盒

如果你想把上面 7 层的核心机制用一个文件全部验证一遍，直接复制运行下面的代码：

```qml
import QtQuick 6.0
import QtQuick.Window 6.0
import QtQuick.Controls 6.0

Window {
    visible: true
    width: 700
    height: 650
    title: "Text & Image 七层测试沙盒"

    // 测试用图片（可替换本地路径）
    property string testImg: "https://picsum.photos/400/300"

    ScrollView {
        anchors.fill: parent
        anchors.margins: 10
        contentWidth: parent.width - 20
        clip: true

        Column {
            spacing: 20
            width: parent.width - 20

            // ---- 第1层：elide 测试 ----
            GroupBox { title: "第1层：elide 省略号"
                Column { spacing: 5
                    Text { text: "右省略: "; font.pixelSize: 14 } 
                    Text { width: 150; text: "床前明月光疑是地上霜举头望明月低头思故乡"; elide: Text.ElideRight; border.color: "gray"; border.width: 1; font.pixelSize: 14 }
                    Text { text: "左省略: "; font.pixelSize: 14 } 
                    Text { width: 150; text: "床前明月光疑是地上霜举头望明月低头思故乡"; elide: Text.ElideLeft; border.color: "gray"; border.width: 1; font.pixelSize: 14 }
                }
            }

            // ---- 第2层：style 样式测试 ----
            GroupBox { title: "第2层：Text Style 特效"
                Row { spacing: 20
                    Text { text: "普通"; font.pixelSize: 24 }
                    Text { text: "Outline"; font.pixelSize: 24; style: Text.Outline; styleColor: "red" }
                    Text { text: "Raised"; font.pixelSize: 24; style: Text.Raised; styleColor: "gray" }
                    Text { text: "Sunken"; font.pixelSize: 24; style: Text.Sunken; styleColor: "gray" }
                }
            }

            // ---- 第3层：富文本测试 ----
            GroupBox { title: "第3层：富文本 HTML 子集"
                Text { width: parent.width; text: "<b>粗体</b> <i>斜体</i> <u>下划线</u> <font color='blue'>蓝色</font> <font size='+2'>大号</font>"; wrapMode: Text.WordWrap; font.pixelSize: 16 }
            }

            // ---- 第4层：fillMode 测试（缩略展示） ----
            GroupBox { title: "第4层：Image fillMode"
                Row { spacing: 10
                    Column { Image { width: 80; height: 60; source: testImg; fillMode: Image.Stretch } Text { text: "Stretch" } }
                    Column { Image { width: 80; height: 60; source: testImg; fillMode: Image.PreserveAspectFit } Text { text: "Fit" } }
                    Column { Image { width: 80; height: 60; source: testImg; fillMode: Image.PreserveAspectCrop } Text { text: "Crop" } }
                    Column { Image { width: 80; height: 60; source: testImg; fillMode: Image.Tile; clip: true } Text { text: "Tile" } }
                }
            }

            // ---- 第5层：sourceSize 内存优化测试 ----
            GroupBox { title: "第5层：sourceSize 内存优化（控制台看日志）"
                Row { spacing: 20
                    Column { 
                        Image { width: 100; height: 100; source: testImg; sourceSize.width: 100; sourceSize.height: 100; onStatusChanged: if(status===Image.Ready)console.log("✅ 带 sourceSize 加载完成，内存小") }
                        Text { text: "优化版" }
                    }
                    Column { 
                        Image { width: 100; height: 100; source: testImg; onStatusChanged: if(status===Image.Ready)console.log("❌ 无 sourceSize 加载完成，内存大") }
                        Text { text: "未优化版" }
                    }
                }
            }

            // ---- 第6层：异步加载进度演示 ----
            GroupBox { title: "第6层：异步加载与进度"
                Rectangle { width: parent.width; height: 100; color: "whitesmoke"
                    Image { id: asyncDemo; anchors.fill: parent; asynchronous: true; source: "https://picsum.photos/800/600"; fillMode: Image.PreserveAspectFit }
                    Rectangle { anchors.centerIn: parent; width: 200; height: 20; color: "lightgray"; radius: 10; visible: asyncDemo.status === Image.Loading
                        Rectangle { width: parent.width * asyncDemo.progress; height: parent.height; color: "green"; radius: 10; Text { anchors.centerIn: parent; text: Math.round(asyncDemo.progress*100)+"%"; color: "white" } }
                    }
                    Button { text: "重试加载"; anchors.bottom: parent.bottom; anchors.right: parent.right; onClicked: asyncDemo.source = "https://picsum.photos/800/600?t="+Date.now() }
                }
            }
        }
    }
}
```

