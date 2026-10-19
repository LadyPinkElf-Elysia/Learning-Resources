# PySide6-QWidget-Menus

---

## 前言：菜单体系的继承关系澄清
*在 PySide6 的菜单与工具栏架构中：*
- **`QAction`**：**真正继承自 `QObject`**。它不是控件，而是描述“一个动作”的抽象逻辑（如“保存”、“退出”）。
- **`QMenu`、`QMenuBar`、`QToolBar`**：**真正继承自 `QWidget`**。它们是承载 `QAction` 的可视化容器。
*本文件将它们归为一套完整的交互体系进行详解。*

---

## 第一部分：QAction —— 动作的抽象基类
**导入**：`from PySide6.QtGui import QAction`
*`QAction` 是菜单项、工具栏按钮背后的灵魂。无论是添加到菜单还是工具栏，实际上都是在操作同一个 `QAction` 对象。*

- **`QAction(icon: QIcon, text: str, parent: QObject = None)`**
- **`QAction(text: str, parent: QObject = None)`**
  **中文**：构造函数
  **参数**：`icon` – 图标；`text` – 显示的文字；`parent` – 父对象。
  ```python
  from PySide6.QtGui import QAction, QIcon
  
  save_action = QAction(QIcon("save.png"), "保存", self)
  ```

- **`setText(text: str)`** / **`text()`**
  **中文**：设置/获取动作显示的文本。
  ```python
  save_action.setText("另存为...")
  ```

- **`setIcon(icon: QIcon)`** / **`icon()`**
  **中文**：设置/获取动作的图标。
  ```python
  save_action.setIcon(QIcon("save_as.png"))
  ```

- **`setShortcut(key: str)`** / **`shortcut()`**
  **中文**：设置/获取触发该动作的键盘快捷键。
  **作用**：无论界面焦点在哪里，按下此组合键都会立即执行动作。
  ```python
  save_action.setShortcut("Ctrl+S")
  ```

- **`setCheckable(checkable: bool)`** / **`isCheckable()`**
  **中文**：设置/获取动作是否可以被勾选（开关模式）。
  **作用**：设为 `True` 后，这个菜单项会带有一个复选框或勾选状态。常用于显示/隐藏某些 UI 面板。
  ```python
  view_action.setCheckable(True)
  ```

- **`setChecked(checked: bool)`** / **`isChecked()`**
  **中文**：设置/获取勾选状态。前提是先开启 `setCheckable(True)`。
  ```python
  view_action.setChecked(True)
  ```

- **`setEnabled(enabled: bool)`** / **`isEnabled()`**
  **中文**：设置/获取动作是否可用（激活/变灰）。
  **作用**：当某些前置条件不满足时，禁用动作。
  ```python
  save_action.setEnabled(False) # 禁用“保存”，按钮变灰
  ```

- **`setVisible(visible: bool)`** / **`isVisible()`**
  **中文**：设置/获取动作是否可见。
  **作用**：隐藏动作会使对应的菜单项和工具栏按钮同时隐藏。

- **`setData(userData: Any)`** / **`data()`**
  **中文**：绑定/获取隐藏的任意类型数据。
  **作用**：在复杂的 UI 中，菜单项通常只是一个文字，你可以在触发后通过 `data()` 拿到隐藏的业务 ID 或配置对象。
  ```python
  file_action.setData("/path/to/file.txt")
  # 触发时：path = action._data()
  ```

- **`trigger()`**
  **中文**：编程方式强制触发该动作的 `triggered` 信号。

- **`setStatusTip(tip: str)`**
  **中文**：设置鼠标悬停在此动作上时，主窗口状态栏显示的文字。

### 🟢 QAction 的核心信号
- **`triggered(checked: bool = False)`**：用户点击动作时触发。如果动作可勾选，会返回当前的勾选状态。
- **`toggled(checked: bool)`**：仅当动作设置为 `setCheckable(True)` 时有效。勾选状态发生变化时触发。
- **`hovered()`**：鼠标悬停在菜单项上时触发。

---

## 第二部分：QActionGroup —— 动作互斥分组（进阶）
**导入**：`from PySide6.QtGui import QActionGroup`
*如果有多项动作需要在同一时间只允许选中一个（比如菜单里的“左对齐”、“居中”、“右对齐”），直接使用 `QActionGroup` 即可。*

- **`QActionGroup(parent: QObject = None)`**
  **中文**：构造函数，创建一个互斥的动作组。
  ```python
  from PySide6.QtGui import QActionGroup
  
  align_group = QActionGroup(self)
  align_group.setExclusive(True) # 设置为排他模式（互斥）
  ```

- **`addAction(action: QAction)`** / **`addAction(text: str)`**
  **中文**：向组内添加新动作。
  ```python
  left_act = QAction("左对齐", self)
  right_act = QAction("右对齐", self)
  align_group.addAction(left_act)
  align_group.addAction(right_act)
  ```

- **`setExclusive(exclusive: bool)`**
  **中文**：设为 `True` 则实现“单选”效果；设为 `False` 可以实现多选（多用于复选框组）。

- **`checkedAction()`** / **`checkedActions()`**
  **中文**：获取当前组内唯一被选中的动作，或者获取所有被选中的动作列表。

### 🟢 QActionGroup 的核心信号
- **`triggered(action: QAction)`**：组内任一动作被触发时发射，返回被触发的具体 `QAction` 对象，这在联动 UI 数据时非常实用。
  ```python
  align_group.triggered.connect(lambda action: print(f"点击了: {action.text()}"))
  ```

---

## 第三部分：QMenuBar —— 菜单栏容器
**导入**：`from PySide6.QtWidgets import QMenuBar`
*菜单栏通常位于 QMainWindow 的顶部。*

- **`QMenuBar(parent: QWidget = None)`**
  **中文**：构造函数
  ```python
  menubar = QMenuBar(self)
  ```

- **`addMenu(title: str)`** / **`addMenu(menu: QMenu)`**
  **中文**：在菜单栏中添加一个顶级菜单，并返回该 `QMenu` 对象。
  ```python
  file_menu = menubar.addMenu("文件(&F)")
  edit_menu = menubar.addMenu("编辑(&E)")
  ```

- **`addAction(action: QAction)`**
  **中文**：直接将动作添加到菜单栏（通常用于 Mac 系统下的程序名菜单或帮助菜单，不常用）。

- **`setNativeMenuBar(native: bool)`**
  **中文**：设置是否使用操作系统原生的菜单栏。
  **作用**：在 **macOS** 下非常重要。如果设为 `True`，你的菜单会跑到屏幕最顶部的系统菜单栏中，而不是在 Windows 窗口内。在 Windows/Linux 中默认为 `False`。
  ```python
  menubar.setNativeMenuBar(False) # 强制在窗口内部显示菜单
  ```

- **`clear()`**
  **中文**：清空菜单栏所有内容。

---

## 第四部分：QMenu —— 下拉菜单
**导入**：`from PySide6.QtWidgets import QMenu`
*代表一个下拉的菜单列表，内部可以包含动作、子菜单和分割线。*

- **`QMenu(title: str, parent: QWidget = None)`**
  **中文**：构造函数
  ```python
  menu = QMenu("文件", self)
  ```

- **`addAction(action: QAction)`** / **`addAction(text: str)`**
  **中文**：向菜单中加入一个动作。
  ```python
  menu.addAction(save_action)
  menu.addAction("退出", self.close) # 直接绑定槽函数
  ```

- **`addMenu(title: str)`** / **`addMenu(menu: QMenu)`**
  **中文**：在该菜单下添加一个**子菜单**。
  ```python
  recent_menu = menu.addMenu("最近打开的文件")
  recent_menu.addAction("文件1.txt")
  ```

- **`addSeparator()`**
  **中文**：在菜单项之间添加一条分割线。
  ```python
  menu.addAction("新建")
  menu.addSeparator()
  menu.addAction("保存")
  ```

- **`setTitle(title: str)`** / **`title()`**
  **中文**：设置/获取菜单的标题。

- **`clear()`**
  **中文**：清空菜单内所有动作，保留空菜单。

- **`exec(pos: QPoint, action: QAction = None)`**
  **中文**：在指定的全局屏幕坐标位置弹出此菜单。
  **作用**：这是实现 **右键菜单（上下文菜单）** 的终极核心！
  ```python
  # 通常在 contextMenuEvent 或 customContextMenuRequested 信号中调用
  def contextMenuEvent(self, event):
      menu = QMenu(self)
      menu.addAction("复制")
      menu.addAction("粘贴")
      # 在鼠标当前位置弹出，如果用户点了一个菜单项，返回该动作
      action = menu.exec(event.globalPos())
      if action:
          print(f"用户点击了: {action.text()}")
  ```

- **`popup(pos: QPoint, action: QAction = None)`**
  **中文**：与 `exec` 类似，但它是**非阻塞**的，立即返回。

- **`setTearOffEnabled(enable: bool)`**
  **中文**：设置菜单是否可以“撕下来”作为一个独立的浮动窗口（撕扯菜单）。
  **作用**：一些复杂应用（如 Photoshop）的菜单可以通过点击菜单顶部的虚线横条，变成一个独立的悬浮面板。可在 Qt 中利用此特性实现。
  ```python
  menu.setTearOffEnabled(True) # 开启撕扯功能
  ```

### 🟢 QMenu 的核心信号
- **`aboutToShow()`**：菜单即将显示前触发（常用来动态加载数据，避免数据早于 UI 准备好）。
- **`aboutToHide()`**：菜单即将隐藏前触发。
- **`triggered(action: QAction)`**：菜单内的某项动作被触发时发射，返回被点击的动作对象。

---

## 第五部分：QToolBar —— 工具栏
**导入**：`from PySide6.QtWidgets import QToolBar`
*工具栏通常位于菜单栏下方或四周，用于放置高频率操作的快捷按钮。*

- **`QToolBar(title: str, parent: QWidget = None)`** / **`QToolBar(parent: QWidget = None)`**
  **中文**：构造函数
  ```python
  toolbar = QToolBar("主工具栏", self)
  ```

- **`addAction(action: QAction)`**
  **中文**：将动作作为按钮添加到工具栏。
  ```python
  toolbar.addAction(save_action)
  ```

- **`addWidget(widget: QWidget)`**
  **中文**：将任意控件（如 `QLineEdit` 搜索框、`QComboBox` 下拉框）直接嵌入到工具栏中。
  ```python
  search_box = QLineEdit()
  search_box.setPlaceholderText("搜索...")
  toolbar.addWidget(search_box)
  ```

- **`addSeparator()`**
  **中文**：在工具栏按钮之间添加分割线。

- **`setMovable(movable: bool)`** / **`isMovable()`**
  **中文**：设置工具栏是否允许用户用鼠标拖拽移动（浮动或停靠到其他边缘）。默认是允许的。
  ```python
  toolbar.setMovable(False) # 禁止用户移动此工具栏
  ```

- **`setFloatable(floata ble: bool)`**
  **中文**：设置工具栏是否可以被拖拽出来成为独立的浮动窗口。
  ```python
  toolbar.setFloatable(False) # 禁止此工具栏脱离主窗口
  ```

- **`setAllowedAreas(areas: Qt.ToolBarAreas)`**
  **中文**：限制工具栏可以停靠的区域。
  **参数**：`Qt.LeftToolBarArea`、`Qt.RightToolBarArea`、`Qt.TopToolBarArea`、`Qt.BottomToolBarArea`，可以用位或 `|` 连接。
  ```python
  toolbar.setAllowedAreas(Qt.TopToolBarArea) # 只允许停在顶部
  ```

- **`setOrientation(orientation: Qt.Orientation)`**
  **中文**：设置工具栏的初始方向（水平或垂直）。
  ```python
  toolbar.setOrientation(Qt.Vertical)
  ```

- **`toggleViewAction()`**
  **中文**：创建一个用于切换此工具栏显示/隐藏的 `QAction` 对象。
  **作用**：这个动作非常贴心！你可以直接把 `toolbar.toggleViewAction()` 添加到菜单的“视图”中，这样用户就可以在菜单里随心所欲地开启或关闭工具栏。
  ```python
  view_menu.addAction(toolbar.toggleViewAction()) # 自动生成“显示 主工具栏”菜单项
  ```

- **`clear()`**
  **中文**：清空工具栏上的所有内容。

### 🟢 QToolBar 的核心信号
- **`visibilityChanged(visible: bool)`**：工具栏的可见状态发生变化时发射（通常由用户点击菜单里的“隐藏”开关引起）。
- **`toolButtonStyleChanged(style: Qt.ToolButtonStyle)`**：工具栏按钮的样式（图标/文字排版）发生改变时发射。
- **`orientationChanged(orientation: Qt.Orientation)`**：工具栏被用户拖拽导致方向发生改变时发射。

---

## 第六部分：QToolButton 与菜单的结合（补充细节）
**导入**：`from PySide6.QtWidgets import QToolButton`
*虽然 `QToolButton` 属于基础控件家族，但它与菜单结合的应用非常广泛。*

- **`setMenu(menu: QMenu)`** / **`menu()`**
  **中文**：绑定一个弹出菜单到按钮上。
  ```python
  tool_btn = QToolButton(self)
  tool_btn.setText("更多选项")
  
  menu = QMenu(tool_btn)
  menu.addAction("选项A")
  menu.addAction("选项B")
  tool_btn.setMenu(menu)
  ```

- **`setPopupMode(mode: QToolButton.ToolButtonPopupMode)`**
  **中文**：设置菜单弹出的模式。
  **参数**：
  - `QToolButton.InstantPopup`：点击按钮时**只弹出菜单，不触发按钮本身的点击信号**。
  - `QToolButton.MenuButtonPopup`：按钮分为两半，主图标部分触发点击信号，小箭头部分触发菜单（最常用）。
  - `QToolButton.DelayedPopup`：长按按钮才弹出菜单，普通点击触发点击信号。
  ```python
  tool_btn.setPopupMode(QToolButton.MenuButtonPopup)
  ```

---

## 第七部分：实战模板（右键菜单与工具栏组合）
*演示如何在一个 `QMainWindow` 中完美结合上述所有元素。*

```python
from PySide6.QtWidgets import (QMainWindow, QTextEdit, QToolBar, QMenu, 
                               QToolButton, QApplication, QWidget, QVBoxLayout)
from PySide6.QtGui import QAction, QIcon
from PySide6.QtCore import Qt

class MyMainWindow(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("菜单与工具栏演示")
        
        # 中央部件
        text_edit = QTextEdit()
        self.setCentralWidget(text_edit)
        
        # 1. 菜单栏与动作
        menubar = self.menuBar()
        file_menu = menubar.addMenu("文件")
        
        new_act = QAction(QIcon("new.png"), "新建", self)
        new_act.setShortcut("Ctrl+N")
        new_act.triggered.connect(lambda: print("新建文件"))
        file_menu.addAction(new_act)
        
        exit_act = QAction("退出", self)
        exit_act.setShortcut("Ctrl+Q")
        exit_act.triggered.connect(self.close)
        file_menu.addAction(exit_act)
        
        # 2. 工具栏
        toolbar = QToolBar("主工具栏")
        self.addToolBar(toolbar)
        toolbar.addAction(new_act)
        toolbar.addSeparator()
        toolbar.addAction(exit_act)
        
        # 工具栏中添加下拉按钮
        tool_btn = QToolButton(toolbar)
        tool_btn.setText("导出")
        tool_btn.setPopupMode(QToolButton.MenuButtonPopup)
        exp_menu = QMenu(tool_btn)
        exp_menu.addAction("导出为 PDF")
        exp_menu.addAction("导出为 TXT")
        tool_btn.setMenu(exp_menu)
        toolbar.addWidget(tool_btn)
        
        # 3. 实现全局右键菜单（上下文菜单）
        # 需要 setContextMenuPolicy(Qt.CustomContextMenu) 和连接信号
        self.setContextMenuPolicy(Qt.CustomContextMenu)
        self.customContextMenuRequested.connect(self.open_context_menu)
        
    def open_context_menu(self, pos):
        # 在鼠标屏幕坐标位置弹出菜单
        context_menu = QMenu(self)
        context_menu.addAction("撤销")
        context_menu.addAction("重做")
        context_menu.exec(self.mapToGlobal(pos))

if __name__ == "__main__":
    app = QApplication([])
    window = MyMainWindow()
    window.show()
    app.exec()
```

---

## 第八部分、 菜单与工具栏体系的高阶隐藏细节补充

### QAction 补充细节
- **`setShortcutContext(context: Qt.ShortcutContext)`**
  **中文**：设置快捷键的作用域
  **参数**：
  - `Qt.WindowShortcut`：快捷键仅在当前窗口激活时生效（默认）。
  - `Qt.ApplicationShortcut`：快捷键在**整个应用程序**中全局生效，无论当前聚焦在哪个窗口（非常适合“退出”、“新建”等高优先级动作）。
  ```python
  exit_action.setShortcutContext(Qt.ApplicationShortcut) # 在任意界面按 Ctrl+Q 都能退出
  ```

- **`setMenuRole(role: QAction.MenuRole)`**
  **中文**：设置菜单在 macOS 系统菜单中的特殊角色
  **作用**：由于 macOS 会将菜单栏放在屏幕最上方，如果不设置这个，你的“退出”和“关于”选项可能会乱套。
  **参数**：
  - `QAction.TextHeuristicRole`：自动判断（默认）。
  - `QAction.ApplicationSpecificRole`：应用特定角色。
  - `QAction.AboutRole`：将此动作设为系统的“关于”菜单项。
  - `QAction.QuitRole`：将此动作设为系统的“退出”菜单项（macOS 会自动映射到 `Cmd+Q`）。
  - `QAction.PreferencesRole`：将此动作设为系统的“设置/偏好设置”菜单项。
  ```python
  # 如果你在写跨平台应用，建议加上这个
  about_action.setMenuRole(QAction.MenuRole.AboutRole)
  ```

- **`setIconText(text: str)`** / **`iconText()`**
  **中文**：设置动作的图标文字
  **作用**：当工具栏（`QToolBar`）被设置为 `Qt.ToolButtonTextUnderIcon`（文字在图标下方）或 `Qt.ToolButtonTextOnly`（仅文字）模式时，显示的将是 `setIconText` 中的文字，而不是主标题文字。
  ```python
  save_action.setText("保存文件")
  save_action.setIconText("保存") # 工具栏按钮上显示更短的文字
  ```

- **`setWhatsThis(text: str)`** / **`whatsThis()`**
  **中文**：设置“这是什么？”帮助文本
  **作用**：当用户按下 `Shift + F1` 时，鼠标会变成问号，点击此动作会弹出设置的帮助气泡，对面向非技术用户的专业软件非常有用。
  ```python
  save_action.setWhatsThis("点击此按钮可将当前编辑的内容保存到本地硬盘。")
  ```

### QMenu 补充细节
- **`setIcon(icon: QIcon)`** / **`icon()`**
  **中文**：为菜单本身设置图标
  **作用**：在现代 UI 设计中，顶级菜单（如“文件”、“编辑”）通常不显示图标。但如果在子菜单或复杂的工具栏中，菜单本身加上图标会让层级更清晰。
  ```python
  file_menu = menu.addMenu("文件")
  file_menu.setIcon(QIcon("folder.png"))
  ```

- **`menuAction()`**
  **中文**：获取代表此菜单本身的 QAction
  **作用**：非常实用。你可以把这个菜单自身作为一个“按钮”直接添加到工具栏中。点击工具栏上的这个按钮，就会弹出这个下拉菜单。
  ```python
  file_menu = menubar.addMenu("文件")
  self.toolbar.addAction(file_menu.menuAction()) # 直接把“文件”菜单加到工具栏里！
  ```

- **`setDefaultAction(action: QAction)`**
  **中文**：设置默认动作
  **作用**：如果在双击菜单中的选项时（或者在某些极特殊的 `QMenu` 用法中），可以预设一个默认被触发的动作。
  ```python
  file_menu.setDefaultAction(save_action)
  ```

### QToolBar 补充细节
- **`widgetForAction(action: QAction)`**
  **中文**：获取工具栏中代表此动作的控件（通常是 `QToolButton`）
  **作用**：绝对的神器！当你把动作加到工具栏后，如果你想修改这个按钮的背景色、填充方式、或者给它应用定制的 `QSS` 样式，你必须通过这个方法来拿到真实的按钮对象。
  ```python
  toolbar.addAction(save_action)
  btn_widget = toolbar.widgetForAction(save_action) # 拿到实际的 QToolButton
  btn_widget.setStyleSheet("QToolButton { background-color: #4CAF50; color: white; }")
  ```

- **`addSeparator(action: QAction)`**
  **中文**：添加带有动作属性的分隔线
  **作用**：此重载方法允许你将分割线作为一个可交互的项（例如用于“折叠”工具栏）。
  ```python
  sep = toolbar.addSeparator()
  # 实际上你可以把自定义分隔符视为布局的一部分
  ```

- **`setOrientation(orientation: Qt.Orientation)`** (再次强调)
  **中文**：动态改变方向
  **作用**：这是极少数可以动态旋转工具栏的方法，如果在程序运行过程中将其从 `Qt.Horizontal` 变为 `Qt.Vertical`，会有平滑动画效果（配合 `QPropertyAnimation` 可以做很酷的收起/展开效果）。

---

