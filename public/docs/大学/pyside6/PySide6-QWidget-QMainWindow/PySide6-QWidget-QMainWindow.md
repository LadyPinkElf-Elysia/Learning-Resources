# PySide6-QWidget-QMainWindow

---

## QMainWindow —— 主应用窗口框架
**导入**：`from PySide6.QtWidgets import QMainWindow`
*`QMainWindow` 是开发标准桌面应用程序的终极基础容器。它提供了完整的窗口框架，不仅具备 `QWidget` 的所有特性，还内置了菜单栏 (Menu Bar)、工具栏 (Tool Bar)、状态栏 (Status Bar) 以及可停靠窗口 (Dock Widget) 的区域布局管理系统。*

---

### 一、 对象的构造

- **`QMainWindow(parent: QWidget = None, flags: Qt.WindowFlags = Qt.WindowFlags())`**
  **中文**：构造函数
  **参数**：
  - `parent` – 父控件对象。
  - `flags` – 窗口标志位。
  **作用**：创建一个主窗口实例。
  ```python
  from PySide6.QtWidgets import QMainWindow
  
  window = QMainWindow()
  window.setWindowTitle("我的主程序")
  window.resize(800, 600)
  window.show()
  ```

---

### 二、 核心布局部件 —— “四大件”

#### 2.1 中央部件 (Central Widget)
*主窗口被划分为几个区域，中间最大的区域被称为“中央部件”或“中心控件”。你的主要业务界面（如文本编辑器、表格）必须放在这里。*

- **`setCentralWidget(widget: QWidget)`**
  **中文**：设置中央部件
  **参数**：`widget` – 继承自 `QWidget` 的任何控件。
  **作用**：将给定的控件作为主窗口的内容区域。这是 `QMainWindow` 启动后必须要设定的核心属性。
  ```python
  from PySide6.QtWidgets import QTextEdit
  text_editor = QTextEdit()
  window.setCentralWidget(text_editor)
  ```

- **`centralWidget()`**
  **中文**：获取当前中央部件
  **返回**：当前设定的中央控件对象。
  ```python
  central = window.centralWidget()
  print(type(central)) # <class 'PySide6.QtWidgets.QTextEdit'>
  ```

- **`takeCentralWidget()`**
  **中文**：取出中央部件
  **作用**：将当前的中央部件从主窗口中剥离出来，但**不会销毁**它。如果你需要对主窗口重置布局，但想保留中央部件对象留作他用，可以使用此方法。
  ```python
  old_central = window.takeCentralWidget()
  # old_central 仍然存在，你可以将其隐藏或重设给别的容器
  window.setCentralWidget(QWidget()) # 设置一个新的空部件
  ```

#### 2.2 菜单栏 (Menu Bar)
*菜单栏通常位于窗口顶部（标题栏下方）。`QMainWindow` 自动内置了一个空的菜单栏。*

- **`menuBar()`**
  **中文**：获取菜单栏对象
  **返回**：`QMenuBar` 对象。
  **作用**：获取指向主窗口菜单栏的指针。如果菜单栏尚未存在，它会自动创建一个。
  ```python
  menubar = window.menuBar()
  file_menu = menubar.addMenu("文件(&F)")
  edit_menu = menubar.addMenu("编辑(&E)")
  help_menu = menubar.addMenu("帮助(&H)")
  ```

- **`setMenuBar(menubar: QMenuBar)`**
  **中文**：设置自定义菜单栏
  **参数**：`menubar` – 自定义的 `QMenuBar` 对象。
  **作用**：用自己构造的菜单栏替换掉默认菜单栏。
  ```python
  custom_bar = QMenuBar()
  custom_bar.addMenu("自定义菜单")
  window.setMenuBar(custom_bar)
  ```

- **`menuWidget()`** / **`setMenuWidget(widget: QWidget)`**
  **中文**：获取/设置菜单栏位置的控件
  **作用**：这是一个高级替代方法。允许你将任意 `QWidget` 放置在菜单栏原本占据的位置。例如，你可以把一个包含几个自定义按钮的容器放在顶部，来代替传统的菜单栏。
  ```python
  custom_top_bar = QWidget()
  # ... 向 custom_top_bar 添加布局和按钮 ...
  window.setMenuWidget(custom_top_bar)
  ```

#### 2.3 工具栏 (Tool Bar)
*工具栏通常位于菜单栏下方或侧边，用于放置常用操作（如保存、撤销、重做）的快捷按钮。* 

- **`addToolBar(title: str)`** / **`addToolBar(toolbar: QToolBar)`**
  **中文**：添加工具栏
  **参数**：`title` – 工具栏的标题，或传一个 `QToolBar` 对象。
  **作用**：创建一个工具栏并将其加入到主窗口中。
  ```python
  from PySide6.QtWidgets import QToolBar
  toolbar1 = window.addToolBar("主工具栏")
  toolbar2 = QToolBar("侧边工具")
  window.addToolBar(toolbar2)
  ```

- **`addToolBar(area: Qt.ToolBarArea, toolbar: QToolBar)`**
  **中文**：在指定区域添加工具栏
  **参数**：`area` – `Qt.LeftToolBarArea` / `Qt.RightToolBarArea` / `Qt.TopToolBarArea` / `Qt.BottomToolBarArea`。
  ```python
  window.addToolBar(Qt.LeftToolBarArea, QToolBar("左侧工具"))
  ```

- **`insertToolBar(pos: QToolBar, before: QToolBar)`**
  **中文**：在指定的工具栏前面插入一个新的工具栏。
  ```python
  before_toolbar = window.addToolBar("前置工具")
  insert_toolbar = QToolBar("插入工具")
  window.insertToolBar(insert_toolbar, before_toolbar)
  ```

- **`removeToolBar(toolbar: QToolBar)`**
  **中文**：移除工具栏
  **作用**：将指定的工具栏从主窗口中移除，但并不会销毁它。
  ```python
  window.removeToolBar(toolbar1)
  ```

- **`addToolBarBreak(area: Qt.ToolBarArea = Qt.TopToolBarArea)`**
  **中文**：添加工具栏换行标记
  **作用**：如果你在一个区域放了多个工具栏，调用此方法，**会使之后添加的工具栏强制换到该区域的下一行**。
  ```python
  window.addToolBar("工具栏行1")
  window.addToolBarBreak() # 设置断点
  window.addToolBar("工具栏行2") # 这行会显示在上一行的正下方
  ```

- **`insertToolBarBreak(toolbar: QToolBar)`**
  **中文**：在指定工具栏后插入换行标记。
  ```python
  window.insertToolBarBreak(toolbar2) # 在 toolbat2 之后强制换行
  ```

- **`removeToolBarBreak(toolbar: QToolBar)`**
  **中文**：移除指定工具栏后面的换行标记。

- **`toolBarArea(toolbar: QToolBar)`**
  **中文**：获取工具栏当前所在的区域
  **返回**：`Qt.ToolBarArea` 枚举。
  ```python
  area = window.toolBarArea(toolbar1)
  ```

- **`setToolButtonStyle(style: Qt.ToolButtonStyle)`** / **`toolButtonStyle()`**
  **中文**：设置/获取工具栏上的按钮样式
  **参数**：
  - `Qt.ToolButtonIconOnly`：仅显示图标。
  - `Qt.ToolButtonTextOnly`：仅显示文字。
  - `Qt.ToolButtonTextBesideIcon`：文字在图标旁边。
  - `Qt.ToolButtonTextUnderIcon`：文字在图标下方。
  ```python
  window.setToolButtonStyle(Qt.ToolButtonTextUnderIcon)
  ```

- **`setIconSize(size: QSize)`** / **`iconSize()`**
  **中文**：设置/获取工具栏图标的统一尺寸
  ```python
  from PySide6.QtCore import QSize
  window.setIconSize(QSize(24, 24))
  ```

- **`setMovable(movable: bool)`** / **`isMovable()`**
  **中文**：设置/判断工具栏是否可以被用户手动拖动。某些工具条你可能不希望用户移动它们（比如主菜单下方的核心工具栏）。
  ```python
  toolbar1.setMovable(False) # 禁止用户拖动此工具栏
  ```

#### 2.4 状态栏 (Status Bar)
*状态栏位于窗口最底部，通常用于显示临时的信息提示（如“加载成功”）、永久状态（如“已就绪”）或进度条。*

- **`statusBar()`**
  **中文**：获取状态栏对象
  ```python
  statusbar = window.statusBar()
  statusbar.showMessage("程序加载完毕", 3000)
  ```

- **`setStatusBar(statusbar: QStatusBar)`**
  **中文**：设置自定义状态栏
  ```python
  custom_status = QStatusBar()
  custom_status.addWidget(QLabel("自定义状态项"))
  window.setStatusBar(custom_status)
  ```

- **`statusBar().showMessage(text: str, timeout: int = 0)`**
  **中文**：在状态栏显示临时信息。`timeout` 为毫秒数，0表示永久显示。
  ```python
  window.statusBar().showMessage("正在保存文件...", 2000)
  ```

- **`statusBar().addWidget(widget: QWidget)`** / **`statusBar().addPermanentWidget(widget: QWidget)`**
  **中文**：向状态栏添加控件。`addWidget` 加在左侧（会被信息覆盖），`addPermanentWidget` 加在最右侧（绝对固定）。
  ```python
  from PySide6.QtWidgets import QProgressBar
  progress = QProgressBar()
  window.statusBar().addWidget(progress)
  ```

---

### 三、 停靠窗口 (Dock Widgets) 与停靠控制
*QDockWidget (停靠窗口) 是 QMainWindow 独有的高级功能。它们是可以自由拖动、悬浮、且能停靠在主窗口四周的独立面板。*

- **`addDockWidget(area: Qt.DockWidgetArea, dockwidget: QDockWidget)`**
  **中文**：添加停靠窗口
  **参数**：`area` – `Qt.LeftDockWidgetArea` 等。`dockwidget` – `QDockWidget` 对象。
  ```python
  from PySide6.QtWidgets import QDockWidget, QListWidget
  dock = QDockWidget("文件列表")
  dock.setWidget(QListWidget())
  window.addDockWidget(Qt.LeftDockWidgetArea, dock)
  ```

- **`addDockWidget(area: Qt.DockWidgetArea, dockwidget: QDockWidget, orientation: Qt.Orientation)`**
  **中文**：添加停靠窗口并指定初始方向。控制同区域停靠窗口的排列方式。
  ```python
  dock2 = QDockWidget("控制面板")
  window.addDockWidget(Qt.LeftDockWidgetArea, dock2, Qt.Vertical)
  ```

- **`tabifyDockWidget(dock1: QDockWidget, dock2: QDockWidget)`**
  **中文**：将两个停靠窗口以标签页（Tab）的形式重叠放置。
  ```python
  window.tabifyDockWidget(dock, dock2)
  ```

- **`splitDockWidget(first: QDockWidget, second: QDockWidget, orientation: Qt.Orientation)`**
  **中文**：分割停靠窗口区域。在 `first` 和 `second` 之间添加分隔条。
  ```python
  window.splitDockWidget(dock, dock2, Qt.Horizontal)
  ```

- **`removeDockWidget(dockwidget: QDockWidget)`**
  **中文**：移除停靠窗口（不销毁对象）。

#### 🚀 QMainWindow 停靠系统的高级配置 (补充核心)：
以下是你之前版本忽略的**停靠系统终极控制权**：

- **`setDockOptions(options: QMainWindow.DockOptions)`**
  **中文**：设置停靠窗口的行为选项
  **参数**：支持按位或（`|`）连接。
  - `QMainWindow.DockOption.AllowTabbedDocks`：允许多个停靠窗口变成标签页形式（默认开启）。
  - `QMainWindow.DockOption.AllowNestedDocks`：允许停靠窗口在上下左右方向相互嵌套出分隔条（默认开启）。
  - `QMainWindow.DockOption.AnimatedDocks`：停靠拖动时带有平滑动画（默认开启）。
  - `QMainWindow.DockOption.ForceTabbedDocks`：**强制**所有拖拽过去的窗口自动变成标签页，而不允许它们分列排放。
  - `QMainWindow.DockOption.VerticalTabs`：标签页垂直放置在左侧或右侧。
  ```python
  # 停靠时禁止嵌套，一律变成标签页，且关闭动画
  window.setDockOptions(
      QMainWindow.DockOption.ForceTabbedDocks |
      QMainWindow.DockOption.VerticalTabs
  )
  ```

- **`setTabPosition(areas: Qt.DockWidgetAreas, position: QTabWidget.TabPosition)`**
  **中文**：设置指定区域的标签页显示位置（上方、下方、左侧、右侧）。
  ```python
  from PySide6.QtWidgets import QTabWidget
  # 将左侧区域和右侧区域的标签页，统一放在底部
  window.setTabPosition(Qt.LeftDockWidgetArea | Qt.RightDockWidgetArea, QTabWidget.TabPosition.South)
  ```

- **`setTabShape(shape: QTabWidget.TabShape)`**
  **中文**：设置标签页的形状。
  **参数**：`QTabWidget.TabShape.Rounded` (圆角，默认) 或 `QTabWidget.TabShape.Triangular` (尖角)。
  ```python
  window.setTabShape(QTabWidget.TabShape.Triangular)
  ```

- **`setCorner(corner: Qt.Corner, area: Qt.DockWidgetArea)`**
  **中文**：设置窗口四个角落的停靠区域归属。
  **作用**：比如默认左上角属于 `TopArea`，你可以把它改为 `LeftArea`。这在窗口包含多个复杂停靠面板时非常重要。
  ```python
  # 将左上角归属权划归给左侧停靠区
  window.setCorner(Qt.TopLeftCorner, Qt.LeftDockWidgetArea)
  # 将右上角归属权划归给右侧停靠区
  window.setCorner(Qt.TopRightCorner, Qt.RightDockWidgetArea)
  ```

- **`setDocumentMode(enabled: bool)`**
  **中文**：设置文档模式
  **参数**：`True` 或 `False`。
  **作用**：开启后，菜单栏和工具栏在 macOS 或现代 Windows 主题下会显得更加扁平化、紧凑，类似现代浏览器（Chrome/Firefox）的顶部布局，更适合追求极简现代风格的应用。
  ```python
  window.setDocumentMode(True)
  ```

- **`setAnimated(enabled: bool)`**
  **中文**：设置工具条/停靠窗口拖拽动画
  **作用**：允许程序通过代码整体开启或关闭停靠时的视觉滑动动画。
  ```python
  window.setAnimated(True)
  ```

---

### 四、 窗口状态与布局的持久化保存
*以下方法使你可以保存用户的个性化布局（下次打开时恢复到用户之前拖拽的位置）。*

- **`saveState(version: int = 0)`**
  **中文**：保存主窗口所有工具栏、停靠窗口的状态、位置和标签页状态，返回 `QByteArray` 二进制数据。
  ```python
  from PySide6.QtCore import QSettings
  settings = QSettings("MyCompany", "MyApp")
  state = window.saveState()
  settings.setValue("window_state", state)
  ```

- **`restoreState(state: QByteArray, version: int = 0)`**
  **中文**：恢复主窗口状态。返回布尔值表示成功或失败。
  ```python
  state = settings.value("window_state")
  if state:
      window.restoreState(state)
  ```

- **`saveGeometry()`**
  **中文**：保存窗口大小和屏幕位置二进制数据。
  ```python
  settings.setValue("window_geometry", window.saveGeometry())
  ```

- **`restoreGeometry(geometry: QByteArray)`**
  **中文**：恢复窗口大小和屏幕位置。
  ```python
  geometry = settings.value("window_geometry")
  if geometry:
      window.restoreGeometry(geometry)
  ```

---

### 五、 上下文菜单与右键处理 (Context Menu)
*QMainWindow 提供了一种标准机制，以便用户在工具栏或停靠窗口上点击右键时弹出默认菜单。*

- **`createPopupMenu()`**
  **中文**：创建弹出菜单
  **作用**：此方法是一个虚函数。默认情况下，用户在工具栏和停靠窗口上点击右键时，Qt 会调用此方法生成一个包含所有工具栏和停靠窗口可见性开关的弹出菜单。
  **重写方法**：如果你不希望用户通过右键隐藏工具栏，或者想添加自定义的右键菜单，可以重写此方法。
  ```python
  def createPopupMenu(self):
      # 禁止用户通过右键隐藏工具栏
      return None 
  ```

---

### 六、 主窗口常用信号 (Signals)

- **`iconSizeChanged(size: QSize)`**
  **中文**：当工具栏的图标大小发生改变时发射。

- **`toolButtonStyleChanged(style: Qt.ToolButtonStyle)`**
  **中文**：当工具栏按钮显示样式发生改变时发射。

- **`tabifiedDockWidgetActivated(dockwidget: QDockWidget)`**
  **中文**：当处于标签页状态下的某个停靠窗口被激活时发射。
  ```python
  window.tabifiedDockWidgetActivated.connect(lambda dw: print(f"激活了: {dw.windowTitle()}"))
  ```

---

## 七、 QMainWindow 补充遗漏细节（跨平台支持）

- **`setUnifiedTitleAndToolBarOnMac(enable: bool)`**
  **中文**：设置 macOS 上的融合标题栏与工具栏模式（仅 macOS 生效）。
  **作用**：设为 `True` 后，在苹果系统 Mac 上运行时，`QMainWindow` 的**工具栏会和窗口标题栏无缝融合成一体**（类似 Safari、Chrome 和现代 macOS 应用的头部），整体视觉更加扁平高端。在 Windows 和 Linux 上无效。
  ```python
  window.setUnifiedTitleAndToolBarOnMac(True)  # 让 Mac 版 UI 紧跟系统潮流
  ```

