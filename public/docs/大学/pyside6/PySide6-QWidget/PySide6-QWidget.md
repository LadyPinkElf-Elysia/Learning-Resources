# PySide6-QWidget

---

## QWidget —— 基础窗口/控件基类（所有UI对象的根基）
**导入**：`from PySide6.QtWidgets import QWidget`
*在 PySide6 中，几乎所有的控件（按钮、标签、输入框、主窗口 QMainWindow）都直接或间接继承自 `QWidget`。掌握它就是掌握 UI 的核心。*

---

### 一、 对象的构造与父子管理

- **`QWidget(parent: QWidget = None, flags: Qt.WindowFlags = Qt.WindowType)`**
  **中文**：构造函数
  **参数**：
  - `parent` – 父控件对象。如果指定了父对象，当前控件会自动成为父对象的孩子，并随父对象的销毁而销毁。如果是 `None` 则作为独立窗口出现。
  - `flags` – 窗口标志位（如 `Qt.WindowType.Window`、`Qt.WindowType.Dialog`、`Qt.WindowType.Tool` 等），用来决定控件是普通窗口、对话框还是工具窗口。
  **作用**：创建一个新的基础控件/窗口实例。
  ```python
  w = QWidget()
  w.show()
  ```

- **`parent()`** / **`setParent(parent)`**
  **中文**：获取/设置父控件
  **参数**：`parent` – 目标父控件对象。
  **作用**：动态修改控件的父子归属关系。
  ```python
  widget.setParent(new_parent_widget)
  ```

---

### 二、 几何、尺寸与位置属性

- **`resize(width: int, height: int)`**
  **中文**：调整大小
  **参数**：`width` – 新的像素宽度；`height` – 新的像素高度。
  **作用**：强制将控件的宽度和高度修改为指定值。
  ```python
  w.resize(800, 600)
  ```

- **`setFixedSize(width: int, height: int)`**
  **中文**：设置固定大小
  **作用**：锁定控件的大小，用户无法通过拖拽改变其大小，布局中也无法拉伸。
  ```python
  w.setFixedSize(300, 200)
  ```

- **`setMinimumSize(width: int, height: int)`** / **`setMaximumSize(width: int, height: int)`**
  **中文**：设置最小/最大尺寸
  **作用**：限制控件在缩放或布局拉伸时的尺寸极值。
  ```python
  w.setMinimumSize(400, 300)
  w.setMaximumSize(1000, 800)
  ```

- **`width()`** / **`height()`** / **`size()`**
  **中文**：获取当前尺寸
  **返回**：`QSize` 对象，包含 `width()` 和 `height()`。
  ```python
  print(f"当前窗口宽: {w.width()}, 高: {w.height()}")
  ```

- **`sizeHint()`** / **`minimumSizeHint()`**
  **中文**：获取建议尺寸 / 最小建议尺寸
  **作用**：`sizeHint()` 返回基于内容（如文字大小）自动计算出的最佳尺寸，`minimumSizeHint()` 返回允许的最小尺寸。
  ```python
  btn.resize(btn.sizeHint())
  ```

- **`move(x: int, y: int)`**
  **中文**：移动位置
  **参数**：`x`, `y` – 新坐标，相对于其父控件左上角的像素距离。
  **作用**：将控件移动到指定坐标。
  ```python
  w.move(100, 100)
  ```

- **`pos()`**
  **中文**：获取当前位置
  **返回**：`QPoint` 对象，包含 `x()` 和 `y()`。
  ```python
  print(w.pos().x())
  ```

- **`setGeometry(x: int, y: int, w: int, h: int)`**
  **中文**：同时设置位置和大小
  **作用**：相当于一次调用 `move()` 和 `resize()`。
  ```python
  w.setGeometry(200, 200, 500, 400)
  ```

- **`geometry()`**
  **中文**：获取内部几何区域
  **返回**：`QRect` 对象，包含 `x()`, `y()`, `width()`, `height()` 所有信息。
  ```python
  rect = w.geometry()
  ```

- **`frameGeometry()`**
  **中文**：获取包含标题栏和边框的几何区域
  **作用**：用来计算整个窗口（包括操作系统边框）占用的真实区域，常用于将窗口在屏幕正中心显示。
  ```python
  # 将窗口居中
  screen_geo = QApplication.primaryScreen().geometry()
  frame_geo = w.frameGeometry()
  frame_geo.moveCenter(screen_geo.center())
  w.move(frame_geo.topLeft())
  ```

---

### 三、 窗口外观、样式与行为

- **`setWindowTitle(title: str)`** / **`windowTitle()`**
  **中文**：设置/获取窗口标题
  **作用**：仅当控件作为顶级窗口（顶层无父控件）时有效。
  ```python
  w.setWindowTitle("我的应用")
  ```

- **`setWindowIcon(icon: QIcon)`** / **`windowIcon()`**
  **中文**：设置/获取窗口图标
  **参数**：`QIcon` 对象。
  ```python
  from PySide6.QtGui import QIcon
  w.setWindowIcon(QIcon("logo.png"))
  ```

- **`setWindowOpacity(level: float)`**
  **中文**：设置窗口透明度
  **参数**：范围 `0.0`（完全透明）到 `1.0`（完全不透明）。
  ```python
  w.setWindowOpacity(0.8)
  ```

- **`setWindowFlags(flags: Qt.WindowType)`** / **`windowFlags()`**
  **中文**：设置/获取窗口标志位
  **参数**：位运算组合（详见附录）。
  ```python
  # 窗口置顶且无边框
  w.setWindowFlags(Qt.WindowType.WindowStaysOnTopHint | Qt.WindowType.FramelessWindowHint)
  w.show()
  ```

- **`setWindowState(state: Qt.WindowState)`** / **`windowState()`**
  **中文**：设置/获取窗口状态
  **参数**：`Qt.WindowState.WindowNoState`、`Qt.WindowState.WindowMaximized`、`Qt.WindowState.WindowMinimized`、`Qt.WindowState.WindowFullScreen`。
  ```python
  w.setWindowState(Qt.WindowState.WindowFullScreen) # 进入全屏
  ```

- **`showMaximized()`** / **`showMinimized()`** / **`showFullScreen()`** / **`showNormal()`**
  **中文**：以特定状态显示窗口（最大化、最小化、全屏、普通大小）。
  ```python
  def on_click():
      w.showFullScreen()
  ```

- **`setStyleSheet(styleSheet: str)`**
  **中文**：设置样式表（类似 CSS）
  **作用**：允许像写网页一样改变控件的外观（颜色、圆角、边框、背景图）。
  ```python
  w.setStyleSheet("QWidget { background-color: #2b2b2b; border-radius: 15px; }")
  ```

- **`setAutoFillBackground(enable: bool)`** / **`autoFillBackground()`**
  **中文**：设置/获取自动填充背景
  **作用**：如果控件使用自定义的调色板或样式表改变了背景色，需要设为 `True` 才能让背景色正确填充，而不透出底下的颜色。
  ```python
  widget.setAutoFillBackground(True)
  ```

---

### 四、 控件显示、隐藏与生命周期

- **`show()`**
  **中文**：显示控件
  **作用**：默认创建的控件是隐藏的。调用此方法，控件和它所有的子控件才会出现在屏幕上。（递归调用）
  ```python
  w.show()
  ```

- **`hide()`**
  **中文**：隐藏控件
  **作用**：隐藏控件，但不会销毁它。再次调用 `show()` 可以重新显示。
  ```python
  w.hide()
  ```

- **`close()`**
  **中文**：关闭控件
  **作用**：关闭控件，并自动触发 `closeEvent`。
  ```python
  w.close()
  ```

- **`isVisible()`** / **`isHidden()`**
  **中文**：判断控件是否可见 / 是否隐藏
  **返回**：布尔值。
  ```python
  if w.isVisible():
      print("窗口已打开")
  ```

- **`isActiveWindow()`**
  **中文**：判断当前窗口是否处于激活状态（获得焦点）。
  ```python
  if w.isActiveWindow():
      print("当前在操作此窗口")
  ```

---

### 五、 布局、边距与间距

- **`setLayout(layout: QLayout)`** / **`layout()`**
  **中文**：设置/获取布局管理器。
  **作用**：将布局管理器应用到控件中，以管理内部子控件的排版。
  ```python
  from PySide6.QtWidgets import QVBoxLayout
  layout = QVBoxLayout(self)
  layout.addWidget(QPushButton("按钮"))
  self.setLayout(layout)
  ```

- **`setContentsMargins(left, top, right, bottom)`** / **`contentsMargins()`**
  **中文**：设置/获取内容边距（像素值）
  **作用**：控制控件内部的内容与控件边缘之间的距离。如不设置，默认通常是 9 像素。
  ```python
  w.setContentsMargins(20, 20, 20, 20)
  ```

---

### 六、 交互、光标与鼠标

- **`setCursor(cursor: Qt.CursorShape)`**
  **中文**：设置鼠标悬停时的光标形状
  **常用参数**：
  - `Qt.PointingHandCursor`：手形（通常用于可点击的按钮或链接）。
  - `Qt.IBeamCursor`：文本选择光标。
  - `Qt.WaitCursor`：等待转圈（通常用于进度加载时）。
  - `Qt.ForbiddenCursor`：禁止标志。
  ```python
  w.setCursor(Qt.CursorShape.PointingHandCursor)
  ```

- **`unsetCursor()`**
  **中文**：恢复光标为默认样式。
  ```python
  w.unsetCursor()
  ```

- **`setMouseTracking(enable: bool)`** / **`hasMouseTracking()`**
  **中文**：设置/判断是否启用鼠标追踪
  **作用**：默认只有在**按下鼠标键**时，`mouseMoveEvent` 才会触发。启用鼠标追踪（设为 `True`）后，**只要鼠标在控件上滑动**，就会不断触发 `mouseMoveEvent`。
  ```python
  widget.setMouseTracking(True)
  ```

---

### 七、 键盘输入与焦点管理

- **`setFocus()`**
  **中文**：强制获取键盘焦点
  **作用**：如果控件是可输入的（如输入框），光标会立刻闪烁在此控件上。
  ```python
  line_edit.setFocus()
  ```

- **`hasFocus()`**
  **中文**：判断是否拥有焦点
  ```python
  if line_edit.hasFocus():
      print("正在输入状态")
  ```

- **`setFocusPolicy(policy: Qt.FocusPolicy)`**
  **中文**：设置焦点获取策略
  **常用参数**：
  - `Qt.StrongFocus`：鼠标点击和 Tab 键都能获取焦点（默认）。
  - `Qt.ClickFocus`：只能通过鼠标点击获取焦点。
  - `Qt.TabFocus`：只能通过 Tab 键获取焦点。
  - `Qt.NoFocus`：永远不会获取焦点（无法被选中）。
  ```python
  widget.setFocusPolicy(Qt.FocusPolicy.NoFocus)
  ```

---

### 八、 坐标系统映射

- **`mapToGlobal(pos: QPoint)`** / **`mapFromGlobal(pos: QPoint)`**
  **中文**：将控件内的坐标转换到整个屏幕的绝对坐标 / 反向转换。
  **作用**：常用于处理跨控件坐标、右键菜单弹出位置、全屏截图等场景。
  ```python
  # 获取控件左上角在屏幕上的物理坐标
  global_pos = widget.mapToGlobal(QPoint(0, 0))
  ```

- **`mapToParent(pos: QPoint)`** / **`mapFromParent(pos: QPoint)`**
  **中文**：将控件内坐标转换为相对于父控件的坐标 / 反向转换。

---

### 九、 拖放文件支持 (Drag and Drop)

- **`setAcceptDrops(enable: bool)`** / **`acceptDrops()`**
  **中文**：设置/获取是否接受拖入事件。
  **作用**：如果设为 `True`，外部文件（或数据）拖拽到控件上时，会触发 `dragEnterEvent` 和 `dropEvent` 事件。
  ```python
  widget.setAcceptDrops(True)
  ```

- **`dragEnterEvent(event: QDragEnterEvent)`**
  **作用**：当外部拖拽进入控件区域时触发。在此处调用 `event.acceptProposedAction()` 允许接收。
  ```python
  def dragEnterEvent(self, event):
      if event.mimeData().hasUrls():
          event.acceptProposedAction()
  ```

- **`dropEvent(event: QDropEvent)`**
  **作用**：当用户在控件上松开鼠标放下数据时触发。
  ```python
  def dropEvent(self, event):
      for url in event.mimeData().urls():
          file_path = url.toLocalFile()
  ```

---

### 十、 事件重写与处理 (Event Handlers)

- **`closeEvent(event: QCloseEvent)`**
  **作用**：用户点击关闭按钮时触发。可做拦截操作。
  ```python
  def closeEvent(self, event):
      reply = QMessageBox.question(
          self, '退出', '确定要退出吗？',
          QMessageBox.StandardButton.Yes | QMessageBox.StandardButton.No,
          QMessageBox.StandardButton.No
      )
      if reply == QMessageBox.StandardButton.Yes:
          event.accept()
      else:
          event.ignore()
  ```

- **`keyPressEvent(event: QKeyEvent)`** / **`keyReleaseEvent(event: QKeyEvent)`**
  **作用**：捕获键盘按键。
  🔐 **重要**：若重写此方法，务必在末尾调用 `super().keyPressEvent(event)` 放行未被拦截的按键，否则输入框将无法正常输入。
  ```python
  def keyPressEvent(self, event):
      if event.key() == Qt.Key.Key_Escape:
          self.close()
      elif event.key() == Qt.Key.Key_S and (event.modifiers() & Qt.KeyboardModifier.ControlModifier):
          print("按下了 Ctrl+S")
      else:
          super().keyPressEvent(event)
  ```

- **`mousePressEvent(event: QMouseEvent)`** / **`mouseReleaseEvent(event: QMouseEvent)`**
  **作用**：捕获鼠标按下/松开。使用 `event.button()` 判断左右键（`Qt.LeftButton`，`Qt.RightButton`）。
  ```python
  def mousePressEvent(self, event):
      if event.button() == Qt.MouseButton.RightButton:
          print("右键被点击")
  ```

- **`mouseMoveEvent(event: QMouseEvent)`**
  **作用**：捕获鼠标滑动。需先用 `setMouseTracking(True)` 启用追踪。
  ```python
  def mouseMoveEvent(self, event):
      print(f"鼠标移动至: {event.pos()}")
  ```

- **`mouseDoubleClickEvent(event: QMouseEvent)`**
  **作用**：捕获鼠标双击。

- **`contextMenuEvent(event: QContextMenuEvent)`**
  **作用**：默认情况下右键会弹出操作系统的上下文菜单。重写此事件可以自定义弹出菜单，或屏蔽右键。
  ```python
  def contextMenuEvent(self, event):
      menu = QMenu(self)
      menu.addAction("复制")
      menu.exec(event.globalPos())
  ```

- **`paintEvent(event: QPaintEvent)`** 与 **`update()`**
  **作用**：`paintEvent` 用于使用 `QPainter` 进行**自定义绘图**（画圆、矩形、自绘控件）。当需要更新画面时，不要直接调 `paintEvent`，而是调用 `self.update()`，系统会自动触发一次 `paintEvent`。
  ```python
  def paintEvent(self, event):
      painter = QPainter(self)
      painter.drawRect(10, 10, 100, 100)

  def refresh(self):
      self.update()
  ```

---

### 十一、 QWidget 特有信号

- **`windowTitleChanged(title: str)`**
  **中文**：当窗口标题发生变化时发射。

- **`windowIconChanged(icon: QIcon)`**
  **中文**：当窗口图标发生变化时发射。

- **`windowStateChanged(state: Qt.WindowState)`**
  **中文**：当窗口状态改变（最大化、最小化、全屏、恢复等）时发射。

- **`customContextMenuRequested(pos: QPoint)`**
  **中文**：当用户请求上下文菜单（右键点击）时发射，与 `contextMenuEvent` 类似，但这个信号更现代化，推荐使用信号连接槽函数的方式处理。
  ```python
  widget.customContextMenuRequested.connect(self.show_context_menu)
  
  def show_context_menu(self, pos):
      menu = QMenu(self)
      menu.addAction("动作1")
      menu.exec(widget.mapToGlobal(pos))
  ```

---

### 十二、 QWidget 补充遗漏细节

- **`setFont(font: QFont)`** / **`font()`**
  **中文**：设置/获取控件所采用的字体。
  **作用**：全局修改控件的字体、字号和粗细。如果不设置，会继承父控件的字体。
  ```python
  from PySide6.QtGui import QFont
  w.setFont(QFont("Consolas", 12))  # 指定等宽字体 12号
  ```

- **`setMask(mask: QBitmap)`** / **`clearMask()`**
  **中文**：设置/清除控件的不规则遮罩。
  **作用**：传入一个黑白位图（`QBitmap`），黑色部分会变透明（不响应点击），白色部分正常显示（响应点击）。这是实现**异形窗口**（如圆形悬浮球、不规则形状的 PS 吸管工具）的核心技术。
  ```python
  from PySide6.QtGui import QBitmap, QPainter
  # 用一张透明 PNG 生成遮罩
  mask = QBitmap("circle_shape.png")
  w.setMask(mask)  # 窗口变成 PNG 的形状
  ```

- **`grabMouse()`** / **`releaseMouse()`** / **`grabKeyboard()`** / **`releaseKeyboard()`**
  **中文**：强制抓取/释放鼠标或键盘输入焦点。
  **作用**：调用 `grabMouse()` 后，即使鼠标离开了当前控件的边界，**所有的鼠标事件依然只会发给当前控件**。常用于实现窗口拖拽的最后阶段、或者交互式画板（防止鼠标拖出边缘丢失捕捉）。
  ```python
  # 在 mousePressEvent 中抓取，在 mouseReleaseEvent 中释放
  def mousePressEvent(self, event):
      self.grabMouse()

  def mouseReleaseEvent(self, event):
      self.releaseMouse()
  ```

- **`window()`**
  **中文**：获取当前控件的顶级顶层窗口。
  **作用**：在复杂嵌套布局（如按钮在 Tab 页里的 GroupBox 里）的深处，调用 `self.window()` 可以直接拿到该控件所属的顶级 `QWidget`（通常是主窗口）。非常方便执行“让主窗口变透明”等操作。
  ```python
  # 在任何一个子控件里：
  main_win = self.window()           # 拿到主窗口
  main_win.setWindowTitle("标题被修改") # 直接操作主窗口
  ```

---
