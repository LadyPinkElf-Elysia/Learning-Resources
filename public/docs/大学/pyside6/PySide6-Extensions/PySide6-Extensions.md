# PySide6-Extensions

---

## 前言：本文件涵盖范围
*本文件专门用于收录 PySide6 开发中无法归类到基础控件、菜单或基础绘图的“高频遗漏拼图”。涵盖**系统对话框**、**系统托盘**、**独立进程调用**、**大型数据模型（Model-View）**、**网页内嵌引擎**以及**现代 UI 特效**。*

---

## 一、 QColorDialog —— 标准颜色选择对话框
**导入**：`from PySide6.QtWidgets import QColorDialog`
*用于让用户从系统的调色板中直观地选择颜色。*

- **`QColorDialog.getColor(initial: QColor = Qt.black, parent: QWidget = None, title: str = "", options: QColorDialog.ColorDialogOptions = QColorDialog.ColorDialogOptions())`**
  **中文**：静态方法，弹出模态颜色选择框
  **返回**：`QColor` 对象。如果用户取消了操作，则返回一个无效的颜色对象（可通过 `color.isValid()` 判断）。
  ```python
  from PySide6.QtGui import QColor
  from PySide6.QtWidgets import QColorDialog

  color = QColorDialog.getColor(QColor(255, 0, 0), self, "选择字体颜色")
  if color.isValid():
      print(f"用户选择了颜色: R={color.red()}, G={color.green()}, B={color.blue()}")
  ```

- **`QColorDialog.getColor(initial: QColor, parent: QWidget, title: str, options)` 的 `options` 参数**
  - `QColorDialog.ShowAlphaChannel`：显示透明度（Alpha）调节滑块。
  - `QColorDialog.NoButtons`：不显示“确定”和“取消”按钮（在部分实时预览场景下使用）。
  ```python
  color = QColorDialog.getColor(Qt.red, self, "选择透明色", QColorDialog.ShowAlphaChannel)
  ```

- **`setCurrentColor(color: QColor)`** / **`currentColor()`**
  **中文**：在对话框实例化后动态设置/获取当前颜色。

- **`setOption(option: QColorDialog.ColorDialogOption, on: bool = True)`**
  **中文**：动态开启或关闭对话框的某个选项。

### 🟢 QColorDialog 的核心信号
- **`currentColorChanged(color: QColor)`**：用户在调色板上拖动或切换颜色时发射（用于实时预览）。
- **`colorSelected(color: QColor)`**：用户最终点击确定后发射。

---

## 二、 QFontDialog —— 标准字体选择对话框
**导入**：`from PySide6.QtWidgets import QFontDialog`
*用于让用户选择字体、字号、粗细和斜体等排版属性。*

- **`QFontDialog.getFont(initial: QFont = None, parent: QWidget = None, title: str = "")`**
  **中文**：静态方法，弹出模态字体选择框
  **返回**：一个元组 `(QFont, bool)`。如果用户点击了确定，返回字体实例和 `True`；如果点击取消，返回空字体和 `False`。
  ```python
  from PySide6.QtGui import QFont
  from PySide6.QtWidgets import QFontDialog

  font, ok = QFontDialog.getFont(QFont("Arial", 12), self, "选择编辑器字体")
  if ok:
      print(f"用户选择了字体: {font.family()}, 大小: {font.pointSize()}")
  ```

### 🟢 QFontDialog 的核心信号
- **`currentFontChanged(font: QFont)`**：用户在字体预览界面切换字体时实时发射。
- **`fontSelected(font: QFont)`**：用户点击确定后发射。

---

## 三、 QProgressDialog —— 模态进度对话框（处理耗时操作）
**导入**：`from PySide6.QtWidgets import QProgressDialog`
*相比于 `QProgressBar`，`QProgressDialog` 是一个独立的弹窗，自带“取消”按钮，专门用于处理**阻塞主线程的耗时同步操作**。*

- **`QProgressDialog(labelText: str, cancelButtonText: str, minimum: int, maximum: int, parent: QWidget = None)`**
  **中文**：构造函数
  **参数**：
  - `labelText` – 提示文字（如“正在复制文件...”）。
  - `cancelButtonText` – 取消按钮的文字（如“取消”）。
  - `minimum` / `maximum` – 进度条的范围。
  ```python
  progress_dialog = QProgressDialog("正在处理数据...", "取消", 0, 100, self)
  progress_dialog.setWindowModality(Qt.WindowModal) # 设置模态阻塞父窗口
  progress_dialog.setMinimumDuration(0) # 强制立刻显示，不延迟
  ```

- **`setValue(value: int)`**
  **中文**：更新进度值，并会自动更新百分比显示。
  ```python
  for i in range(101):
      progress_dialog.setValue(i)
      # 注意：如果是耗时计算，可以用 QApplication.processEvents() 保持界面响应
      if progress_dialog.wasCanceled():
          break
  progress_dialog.setValue(100) # 达到最大值，对话框会自动关闭
  ```

- **`wasCanceled()`**
  **中文**：判断用户是否点击了取消按钮。
  **作用**：在循环中每次更新进度时，必须检查此状态。如果返回 `True`，应立即跳出循环并中止操作。
  ```python
  if progress_dialog.wasCanceled():
      print("操作被用户主动取消")
      break
  ```

- **`setAutoClose(close: bool)`** / **`setAutoReset(reset: bool)`**
  **中文**：
  - `setAutoClose(True)`：进度达到 100% 时自动关闭对话框（默认开启）。
  - `setAutoReset(True)`：进度达到 100% 时重置进度条状态（默认开启）。

- **`setCancelButtonText(text: str)`**
  **中文**：动态修改取消按钮上的文字。

### 🟢 QProgressDialog 的核心信号
- **`canceled()`**：当用户点击“取消”按钮或按下 `ESC` 键时发射。

---

## 四、 QSystemTrayIcon —— 系统托盘图标（后台常驻程序）
**导入**：`from PySide6.QtWidgets import QSystemTrayIcon, QMenu`
*用于将桌面应用的最小化图标放入操作系统任务栏的托盘通知区域。*

- **`QSystemTrayIcon(parent: QWidget = None)`** / **`QSystemTrayIcon(icon: QIcon, parent: QWidget = None)`**
  **中文**：构造托盘图标对象。
  ```python
  from PySide6.QtWidgets import QSystemTrayIcon, QMenu
  from PySide6.QtGui import QIcon

  tray = QSystemTrayIcon(QIcon("app_icon.png"), self)
  ```

- **`setIcon(icon: QIcon)`** / **`icon()`**
  **中文**：设置/获取托盘的图标。

- **`setToolTip(tip: str)`** / **`toolTip()`**
  **中文**：设置/获取鼠标悬停在托盘图标上时显示的气泡提示文字。

- **`setContextMenu(menu: QMenu)`**
  **中文**：绑定右键点击托盘图标时弹出的上下文菜单。
  ```python
  menu = QMenu(self)
  menu.addAction("打开主窗口", self.showNormal)
  menu.addAction("退出程序", self.close)
  tray.setContextMenu(menu)
  ```

- **`show()`** / **`hide()`** / **`isVisible()`**
  **中文**：显示/隐藏/判断托盘图标是否可见。
  ```python
  tray.show()
  ```

- **`showMessage(title: str, message: str, icon: QSystemTrayIcon.MessageIcon = QSystemTrayIcon.MessageIcon.Information, millisecondsTimeoutHint: int = 10000)`**
  **中文**：在托盘区域弹出系统级的“气泡通知”（类似微信新消息提示）。
  **参数**：
  - `icon`：通知类型，如 `QSystemTrayIcon.Information`（信息）、`QSystemTrayIcon.Warning`（警告）、`QSystemTrayIcon.Critical`（错误）。
  - `millisecondsTimeoutHint`：显示的时间（毫秒），默认 10 秒。
  ```python
  tray.showMessage("同步完成", "您的文件已经备份到云端！")
  ```

### 🟢 QSystemTrayIcon 的核心信号
- **`activated(reason: QSystemTrayIcon.ActivationReason)`**：用户在托盘图标上执行操作时发射。
  **参数**：判断用户做了什么，如 `QSystemTrayIcon.Trigger`（左键单击）、`QSystemTrayIcon.DoubleClick`（左键双击）、`QSystemTrayIcon.Context`（右键单击，菜单会由 `setContextMenu` 自动接管）。
  ```python
  # 经典用法：左键点击恢复主窗口
  tray.activated.connect(lambda reason: self.showNormal() if reason == QSystemTrayIcon.Trigger else None)
  ```

---

## 五、 QMovie —— 动态图片播放器（GIF 动画）
**导入**：`from PySide6.QtGui import QMovie`
*`QMovie` 不是控件，但它配合 `QLabel` 可以轻松播放动态 GIF 图片。*

- **`QMovie(filename: str, parent: QObject = None)`** / **`QMovie()`**
  **中文**：构造函数，可以传入本地 GIF 文件的路径，或稍后用 `setFileName()` 指定。
  ```python
  from PySide6.QtGui import QMovie
  from PySide6.QtWidgets import QLabel

  movie = QMovie("loading.gif") # 创建 GIF 播放器
  label = QLabel(self)
  label.setMovie(movie)         # 将标签和动画绑定
  movie.start()                 # 开始播放
  ```

- **`start()`** / **`stop()`**
  **中文**：开始播放 / 停止播放动画。

- **`setPaused(paused: bool)`**
  **中文**：暂停或恢复当前帧的显示。
  ```python
  movie.setPaused(True) # 暂停在当前帧
  ```

- **`setSpeed(percent: int)`**
  **中文**：设置播放速度。默认 `100`（正常速度），设为 `50` 则变慢一半，`200` 则快一倍。
  ```python
  movie.setSpeed(200) # 两倍速播放
  ```

- **`setFileName(filename: str)`** / **`fileName()`**
  **中文**：设置/获取播放的 GIF 文件路径。

- **`frameCount()`**
  **中文**：返回 GIF 动画的总帧数。如果无法读取，返回 `-1`。

- **`currentPixmap()`**
  **中文**：获取当前播放帧的 `QPixmap` 图片对象。
  **作用**：如果你不想用 `QLabel` 显示，而是想在 `QPainter` 的 `paintEvent` 中自己画出这一帧，调用此方法拿到原始图。
  ```python
  def paintEvent(self, event):
      if self.movie.state() == QMovie.Running:
          painter.drawPixmap(0, 0, self.movie.currentPixmap())
  ```

### 🟢 QMovie 的核心信号
- **`frameChanged(frameNumber: int)`**：每当动画切换到下一帧时触发。
- **`started()`** / **`finished()`**：动画开始播放 / 播放结束时触发。
- **`stateChanged(state: QMovie.MovieState)`**：播放状态（停止、暂停、播放）发生变化时触发。

---

## 六、 QWebEngineView —— 内嵌网页浏览器（需独立安装包）
**导入**：`from PySide6.QtWebEngineWidgets import QWebEngineView`
*⚠️ 警告：此模块不是 PySide6 默认核心库！需要手动安装：`pip install PySide6-WebEngine`。*
*它为你的桌面应用提供一个现代、全功能的 Chromium 浏览器内核。*

- **`QWebEngineView(parent: QWidget = None)`**
  **中文**：构造函数，创建一个独立的网页视图控件。
  ```python
  from PySide6.QtWebEngineWidgets import QWebEngineView
  from PySide6.QtCore import QUrl

  webview = QWebEngineView(self)
  webview.load(QUrl("https://www.baidu.com"))
  webview.show()
  ```

- **`load(url: QUrl)`** / **`setUrl(url: QUrl)`**
  **中文**：加载指定网址。通常用 `QUrl("https://...")` 包裹字符串。推荐使用 `load`，因为它支持参数传递。

- **`setHtml(html: str, baseUrl: QUrl = QUrl())`**
  **中文**：直接加载一段 HTML 字符串作为网页内容。常用于做复杂的富文本设置界面。
  ```python
  webview.setHtml("<h1>自定义界面</h1><button>点我</button>")
  ```

- **`back()`** / **`forward()`** / **`reload()`** / **`stop()`**
  **中文**：控制网页导航：后退、前进、刷新、停止加载。

- **`page()`**
  **中文**：返回与视图绑定的 `QWebEnginePage` 对象。

- **`page().runJavaScript(script: str, callback: Callable)`**
  **中文**：在网页中注入并执行一段 JavaScript 代码，极其强大。
  **作用**：可以让你通过 JS 获取网页上的数据，并回调给 Python。
  ```python
  def handle_result(result):
      print(f"网页中获取到的标题是: {result}")

  webview.page().runJavaScript("document.title", handle_result)
  ```

### 🟢 QWebEngineView 的核心信号
- **`loadStarted()`**：网页开始加载时触发。
- **`loadFinished(ok: bool)`**：网页加载完成（或失败）时触发，`ok` 为布尔值。
- **`loadProgress(progress: int)`**：网页加载进度更新时触发（返回 0-100 的整数）。
- **`urlChanged(url: QUrl)`**：当前网页的 URL 发生跳转（如点击了链接）时触发。

---

## 七、 模型-视图架构（Model-View）—— 处理海量数据的终极武器
**导入**：`from PySide6.QtWidgets import QTreeView, QTableView` ; `from PySide6.QtCore import QFileSystemModel`
*我们之前学了 `QTreeWidget` 和 `QTableWidget`，它们是“便利类”，数据直接存在内存里。一旦要显示 10 万个文件，程序会直接卡死。真正的工业化方案是“模型-视图”架构（数据与显示彻底分离）。*

**经典案例：用 `QFileSystemModel` + `QTreeView` 做极速文件浏览器**

- **`QFileSystemModel(parent: QObject = None)`**
  **中文**：专门读取本地文件系统的数据模型，它是异步加载的，即使硬盘上有 10 万个文件，也**绝不会卡住主界面**。
  ```python
  from PySide6.QtWidgets import QTreeView
  from PySide6.QtCore import QFileSystemModel, QDir

  model = QFileSystemModel()
  model.setRootPath(QDir.currentPath()) # 设置要监视的根目录
  ```

- **`QTreeView(parent: QWidget = None)`**
  **中文**：与 `QTreeWidget` 不同，它只是纯粹负责“画”的视图。
  ```python
  treeview = QTreeView(self)
  treeview.setModel(model) # 将模型与视图绑定
  treeview.setRootIndex(model.index(QDir.currentPath())) # 设置显示的根节点
  ```

- **模型-视图的优势**：
  1. **占用内存极低**：模型只负责提供所需的那几行数据，不会把 10 万行数据全部读取到内存。
  2. **数据与界面隔离**：你可以随时替换 `QFileSystemModel` 为 `QStandardItemModel` 或自定义模型，视图完全不需要修改。
  3. **支持排序与过滤**：模型层提供了原生的 `sort()` 和 `QSortFilterProxyModel` 来过滤数据。

---

## 八、 QProcess —— 独立子进程管理（系统命令调用）
**导入**：`from PySide6.QtCore import QProcess`
*`QProcess` 与 `QThread` 是两条完全不同的技术线。它用于在程序中启动一个外部的操作系统程序（如 `cmd.exe`、`python.exe`、`ffmpeg.exe`），并向其发送数据或读取它的控制台输出。*

- **`QProcess(parent: QObject = None)`**
  **中文**：构造进程管理对象。
  ```python
  from PySide6.QtCore import QProcess

  process = QProcess(self)
  ```

- **`start(command: str, arguments: list = [])`**
  **中文**：启动外部程序，并带参数。
  ```python
  process.start("ping", ["www.baidu.com"]) # 执行 ping 命令
  ```

- **`waitForStarted(msecs: int = 30000)`**
  **中文**：阻塞等待，直到子进程成功启动。返回布尔值。
  ```python
  if process.waitForStarted():
      print("子进程启动成功")
  ```

- **`write(data: bytes)`**
  **中文**：向子进程的标准输入（stdin）写入数据。常用于与子程序进行实时交互。
  ```python
  process.write(b"hello\n") # 发送数据
  ```

- **`readAllStandardOutput()`** / **`readAllStandardError()`**
  **中文**：读取子进程的控制台输出（`stdout`）和错误流（`stderr`）。
  ```python
  process.waitForFinished() # 等待进程执行完毕
  output = process.readAllStandardOutput()._data().decode('utf-8')
  print(output)
  ```

- **`setWorkingDirectory(dir: str)`**
  **中文**：设置子进程的工作目录。

- **`kill()`** / **`terminate()`**
  **中文**：`terminate()` 会尝试安全关闭程序（发送终止信号）。`kill()` 会**强制、立即**暴力杀掉进程。

### 🟢 QProcess 的核心信号
- **`started()`**：进程成功启动时发射。
- **`readyReadStandardOutput()`**：子进程向控制台输出了新的内容时触发。可以配合 `readAllStandardOutput()` 抓取实时输出。
  ```python
  process.readyReadStandardOutput.connect(lambda: print(process.readAllStandardOutput()._data().decode()))
  ```
- **`finished(exitCode: int, exitStatus: QProcess.ExitStatus)`**：子进程执行完毕时发射。

---

## 九、 QShortcut —— 独立的键盘快捷方式
**导入**：`from PySide6.QtGui import QShortcut`
*与 `QAction` 不同，`QShortcut` 是一个纯粹的独立对象，不需要挂载到菜单栏或工具栏上。它可以在任何 `QWidget` 中捕获全局或局部的快捷键。*

- **`QShortcut(keySequence: QKeySequence, parent: QWidget)`**
  **中文**：构造一个绑定到特定 `parent` 控件的快捷键。
  **参数**：
  - `keySequence`：键盘序列，如 `"Ctrl+F"`，或 `Qt.Key_F5`。
  - `parent`：绑定的目标控件。快捷键仅在此控件或其子控件获得焦点时才生效。
  ```python
  from PySide6.QtGui import QShortcut
  from PySide6.QtCore import Qt

  shortcut = QShortcut(Qt.Key_F1, self) # 按 F1 键
  shortcut.activated.connect(lambda: print("帮组功能被触发"))
  ```

- **`setAutoRepeat(on: bool)`** / **`autoRepeat()`**
  **中文**：设置/获取按键长按时是否自动重复触发 `activated` 信号。

- **`setEnabled(on: bool)`** / **`isEnabled()`**
  **中文**：设置/获取是否启用此快捷方式。

- **`setContext(context: Qt.ShortcutContext)`**
  **中文**：设置快捷键的作用域。
  **参数**：
  - `Qt.WindowShortcut`：仅在当前窗口获得焦点时生效（默认）。
  - `Qt.ApplicationShortcut`：全局快捷键，即使应用在后台，按下也有效。
  - `Qt.WidgetShortcut`：仅在父控件获得焦点时生效。
  ```python
  global_shortcut = QShortcut("Ctrl+Alt+M", self)
  global_shortcut.setContext(Qt.ApplicationShortcut) # 全局唤起主窗口
  ```

### 🟢 QShortcut 的核心信号
- **`activated()`**：用户按下设定的快捷键组合时立即触发。

---

## 十、 QGraphicsEffect —— 现代 UI 特效引擎（阴影与透明）
**导入**：`from PySide6.QtWidgets import QGraphicsDropShadowEffect, QGraphicsOpacityEffect`
*这两个效果不是通过 `QPainter` 底层绘制出来的，它们是挂载在任何 `QWidget` 控件上的高阶外观装饰器。*

### 10.1 QGraphicsDropShadowEffect（投影阴影）
- **`QGraphicsDropShadowEffect(parent: QObject = None)`**
  **中文**：构造阴影特效对象。
  ```python
  from PySide6.QtWidgets import QGraphicsDropShadowEffect
  from PySide6.QtGui import QColor

  shadow = QGraphicsDropShadowEffect(self)
  widget.setGraphicsEffect(shadow) # 应用阴影特效
  ```

- **`setBlurRadius(blurRadius: float)`**
  **中文**：设置阴影的模糊半径（像素）。数值越大，阴影越飘散；数值越小，阴影越硬。
  ```python
  shadow.setBlurRadius(20)
  ```

- **`setColor(color: QColor)`**
  **中文**：设置阴影的颜色。默认是半透明黑色 `Qt.black`，你可以改成带透明度的红色、蓝色等。
  ```python
  shadow.setColor(QColor(0, 0, 0, 100)) # 黑色带 100 的透明度
  ```

- **`setOffset(dx: float, dy: float)`** / **`setXOffset(x: float)`** / **`setYOffset(y: float)`**
  **中文**：设置阴影相对于控件的偏移量（像素）。
  ```python
  shadow.setOffset(5, 5) # 向右下方偏移 5 像素
  ```

### 10.2 QGraphicsOpacityEffect（透明度/淡入淡出）
- **`QGraphicsOpacityEffect(parent: QObject = None)`**
  **中文**：构造透明度特效对象。
  ```python
  from PySide6.QtWidgets import QGraphicsOpacityEffect

  opacity = QGraphicsOpacityEffect(self)
  widget.setGraphicsEffect(opacity)
  ```

- **`setOpacity(opacity: float)`**
  **中文**：设置控件的透明度。范围 `0.0`（完全透明/消失）到 `1.0`（完全不透明）。
  ```python
  opacity.setOpacity(0.5) # 让控件变成半透明
  ```

- **`setOpacityMask(mask: QBitmap)`**
  **中文**：设置透明度遮罩位图。
  **作用**：让你可以传入一个黑白的 `QBitmap`，让控件呈现出被裁切或渐变透明的复杂异形效果（如手电筒探照灯效果）。

---

## 十一、 QFile、QDir 与 QFileInfo —— 底层文件系统操作
**导入**：`from PySide6.QtCore import QFile, QDir, QFileInfo`
*虽然 Python 原生提供了强大的文件操作，但在 PySide6 环境中，结合 `QFileDialog` 获取的路径，使用 Qt 原生封装类能够提供更好的跨平台兼容性和信号槽事件支持。*

- **`QFile(fileName: str)`**
  **中文**：构造一个文件操作对象。
  ```python
  file = QFile("C:/Users/test.txt")
  ```

- **`open(mode: QIODeviceBase.OpenModeFlag)`**
  **中文**：以指定模式打开文件。
  **常用参数**：`QIODeviceBase.ReadOnly`（只读）、`QIODeviceBase.WriteOnly`（只写/覆盖）、`QIODeviceBase.ReadWrite`（读写）、`QIODeviceBase.Append`（追加）、`QIODeviceBase.Text`（文本模式）。
  ```python
  if file.open(QIODeviceBase.ReadOnly | QIODeviceBase.Text):
      # 读取文件...
  ```

- **`readAll()`**
  **中文**：读取文件所有内容，返回 `QByteArray`。
  ```python
  content = file.readAll()
  text = content._data().decode('utf-8') # 转为字符串
  ```

- **`write(data: bytes)`** / **`write(data: QByteArray)`**
  **中文**：向文件写入二进制或文本数据。
  ```python
  file.write("这是写入的内容".encode('utf-8'))
  ```

- **`close()`**
  **中文**：关闭文件句柄，释放系统资源（务必在读写后调用，或使用 Python 上下文管理器 `with`）。

- **`exists(fileName: str)`**
  **中文**：**静态方法**，判断指定路径的文件是否存在。
  ```python
  if QFile.exists("config.ini"):
      print("配置文件存在")
  ```

- **`remove()`** / **`rename(newName: str)`** / **`copy(newName: str)`**
  **中文**：删除、重命名或复制当前文件对象所指向的文件。

- **`QDir(path: str)`**
  **中文**：构造一个目录操作对象。
  ```python
  dir = QDir("C:/Users")
  ```

- **`entryList(filters: QDir.Filters = QDir.Filters.NoFilter)`**
  **中文**：获取该目录下的所有文件名和目录名列表，返回 `QStringList`。
  ```python
  for file_name in dir.entryList(QDir.Files):
      print(file_name)
  ```

- **`exists(path: str)`** / **`mkdir(path: str)`** / **`rmdir(path: str)`**
  **中文**：静态检查目录是否存在、创建新目录、删除空目录。

- **`QFileInfo(file: str)`**
  **中文**：构造一个文件信息查询对象。
  ```python
  info = QFileInfo("C:/Users/test.txt")
  ```

- **常用属性获取方法**：
  - `exists()`：是否存在。
  - `size()`：文件大小（字节）。
  - `fileName()`：文件名（包含后缀）。
  - `baseName()`：不含后缀的文件名。
  - `suffix()`：文件后缀（如 "txt"）。
  - `absoluteFilePath()`：文件的绝对路径。
  - `lastModified()`：最后修改时间。
  - `isDir()` / `isFile()`：判断是目录还是文件。


## 十二、 QUndoStack —— 撤销与重做栈（商业级应用必备）
**导入**：`from PySide6.QtCore import QUndoStack, QUndoCommand`
*在文本编辑器、画图板等软件中，允许用户撤销（Ctrl+Z）和重做（Ctrl+Y）操作是最核心的功能。QT 提供了完美的 `QUndoStack` 来管理这些状态。*

- **`QUndoStack(parent: QObject = None)`**
  **中文**：构造一个撤销栈对象。
  ```python
  undo_stack = QUndoStack(self)
  ```

- **`push(command: QUndoCommand)`**
  **中文**：向栈中压入一个新的操作（动作）。这个动作会被执行，并记录进栈中。
  ```python
  from PySide6.QtWidgets import QUndoCommand
  
  class InsertTextCommand(QUndoCommand):
      def __init__(self, document, text, pos):
          super().__init__("插入文字")
          self.doc = document
          self.text = text
          self.pos = pos
  
      def redo(self):  # 执行操作
          self.doc.insert(self.pos, self.text)
  
      def undo(self):  # 撤销操作
          self.doc.remove(self.pos, len(self.text))
  
  # 在业务代码中：
  cmd = InsertTextCommand(document, "Hello", cursor_pos)
  undo_stack.push(cmd) # 自动执行 cmd.redo()
  ```

- **`undo()`** / **`redo()`**
  **中文**：手动执行撤销/重做操作（通常绑定到菜单的 `Undo` 和 `Redo` 动作上）。
  ```python
  undo_action = undo_stack.createUndoAction(self, "撤销(&U)")
  redo_action = undo_stack.createRedoAction(self, "重做(&R)")
  edit_menu.addAction(undo_action)
  edit_menu.addAction(redo_action)
  ```

- **`createUndoAction(parent: QObject, prefix: str)`** / **`createRedoAction(parent: QObject, prefix: str)`**
  **中文**：直接生成绑定好的 `QAction` 对象，可以直接塞进菜单栏或工具栏，它会自动处理快捷键并使能/禁用的状态。
  ```python
  # 下面的动作会自动变灰禁用（当栈为空时）
  menu.addAction(undo_stack.createUndoAction(self, "撤销"))
  ```

- **`isUndoAvailable()`** / **`isRedoAvailable()`**
  **中文**：判断当前是否还可以撤销/重做。

- **`setUndoLimit(limit: int)`**
  **中文**：限制撤销步数（防止内存溢出，默认无限制，但建议设为 `100` 或 `50`）。

- **`clear()`**
  **中文**：清空整个撤销栈（通常在打开新文件时调用）。

### 🟢 QUndoStack 的核心信号
- **`canUndoChanged(canUndo: bool)`**：是否可撤销状态发生改变时发射。
- **`canRedoChanged(canRedo: bool)`**：是否可重做状态发生改变时发射。
- **`indexChanged(idx: int)`**：当前栈指针位置发生变化时发射。
- **`cleanChanged(clean: bool)`**：文件是否处于“已保存未修改”的干净状态发生改变时发射。
```

---

