# PySide6 核心组件速查手册（含示例）

---

## 1. QApplication —— 应用程序主控
**导入**：`from PySide6.QtWidgets import QApplication`

- **`QApplication(sys.argv)`**
  **参数**：`sys.argv` – 命令行参数列表（必须）。
  **作用**：创建应用程序实例，每个程序有且仅有一个。
  ```python
  app = QApplication(sys.argv)   # 必须放在所有窗口创建之前
  ```

- **`exec()`**
  **中文**：启动事件循环
  **参数**：无
  **作用**：进入主事件循环，等待用户操作，直到调用 `quit()` 退出。返回退出码。
  ```python
  import sys
  from PySide6.QtWidgets import QApplication
  app = QApplication(sys.argv)
  sys.exit(app.exec())   # 返回退出码给操作系统
  ```

- **`quit()`**
  **中文**：退出
  **参数**：无
  **作用**：主动结束事件循环，关闭程序。
  ```python
  btn.clicked.connect(app.quit)   # 点击按钮退出程序
  ```

- **`instance()`**
  **中文**：获取当前实例
  **参数**：无
  **返回**：`QApplication` 对象或 `None`（若还未创建）。
  ```python
  # 检查实例是否已存在
  if QApplication.instance() is None:
      app = QApplication(sys.argv)
  else:
      app = QApplication.instance()   # 复用已有实例
  ```

- **`setApplicationName(name)`**
  **中文**：设置应用名称
  **参数**：`name` – 字符串。
  ```python
  app.setApplicationName("我的应用")   # 影响设置文件保存位置等
  ```

- **`setOrganizationName(name)`**
  **中文**：设置组织名称
  **参数**：`name` – 字符串。
  ```python
  app.setOrganizationName("我的公司")
  ```

- **`clipboard()`**
  **中文**：获取剪贴板对象
  **返回**：`QClipboard`。
  ```python
  clipboard = app.clipboard()
  clipboard.setText("复制到剪贴板的内容")
  ```

---

## 2. QWidget —— 基础窗口/控件基类
**导入**：`from PySide6.QtWidgets import QWidget`

几乎所有可视部件都继承自 `QWidget`。

- **`resize(width, height)`**
  **参数**：`width` – 宽度（像素），`height` – 高度。
  **作用**：设置控件/窗口尺寸。
  ```python
  w = QWidget()
  w.resize(400, 300)    # 宽400，高300
  ```

- **`move(x, y)`**
  **参数**：`x` – 横坐标，`y` – 纵坐标（相对父控件左上角）。
  ```python
  w.move(100, 100)      # 放在屏幕坐标 (100, 100) 处
  ```

- **`setWindowTitle(title)`**
  **参数**：`title` – 字符串，窗口标题栏文字。
  ```python
  w.setWindowTitle("我的窗口")
  ```

- **`setGeometry(x, y, w, h)`**
  **参数**：`x, y` – 位置；`w, h` – 宽高。
  **作用**：同时设置位置和尺寸（等价于 `move` + `resize`）。
  ```python
  w.setGeometry(200, 200, 500, 400)
  ```

- **`setToolTip(text)`**
  **参数**：`text` – 字符串，支持简单 HTML。
  **作用**：鼠标悬停时显示的气泡提示。
  ```python
  w.setToolTip("这是 <b>粗体</b> 提示")
  ```

- **`show()`**
  **作用**：显示控件（窗口默认隐藏，必须调用才可见）。
  ```python
  w.show()   # 不加这一行窗口不会出现
  ```

- **`closeEvent(event)`**
  **参数**：`event` – `QCloseEvent`。
  **作用**：可重写，用于处理窗口关闭事件（如弹出保存确认）。
  ```python
  class MyWidget(QWidget):
      def closeEvent(self, event):
          print("窗口即将关闭")
          event.accept()    # 允许关闭
          # event.ignore()  # 阻止关闭
  ```

---

## 3. QPushButton —— 按钮
**导入**：`from PySide6.QtWidgets import QPushButton`

- **`QPushButton(text, parent)`**
  **参数**：`text` – 按钮文字；`parent` – 父控件。
  ```python
  btn = QPushButton("点我", None)
  ```

- **`setText(text)`** / **`text()`**
  **作用**：设置/获取按钮文字。
  ```python
  btn.setText("新文字")
  print(btn.text())   # 输出: 新文字
  ```

- **`clicked` 信号**
  **作用**：按钮被点击时发射。
  ```python
  btn.clicked.connect(lambda: print("被点击"))
  ```

- **`setToolTip(text)`**
  **作用**：设置悬浮提示。
  ```python
  btn.setToolTip("点击执行操作")
  ```

- **`sizeHint()`**
  **作用**：返回建议尺寸（根据文字和字体自动计算）。
  ```python
  btn.resize(btn.sizeHint())   # 让按钮刚好包住文字
  ```

---

## 4. QLabel —— 标签
**导入**：`from PySide6.QtWidgets import QLabel`

- **`QLabel(text, parent)`**
  **参数**：`text` – 显示的文本（可富文本）；`parent` – 父控件。
  ```python
  label = QLabel("你好世界", None)
  ```

- **`setText(text)`** / **`text()`**
  **作用**：设置/获取文本。
  ```python
  label.setText("更新文字")
  print(label.text())
  ```

- **`setPixmap(QPixmap)`**
  **作用**：显示图片。
  ```python
  from PySide6.QtGui import QPixmap
  label.setPixmap(QPixmap("picture.png"))
  ```

- **`setAlignment(Qt.AlignmentFlag.AlignCenter)`**
  **作用**：设置文本/图片的对齐方式。
  ```python
  from PySide6.QtCore import Qt
  label.setAlignment(Qt.AlignmentFlag.AlignCenter)
  ```

---

## 5. QLineEdit —— 单行输入框
**导入**：`from PySide6.QtWidgets import QLineEdit`

- **`QLineEdit(parent)`** / **`QLineEdit(text, parent)`**
  ```python
  line = QLineEdit("默认内容")
  ```

- **`text()`** / **`setText(text)`**
  **作用**：获取/设置输入框文字。
  ```python
  print(line.text())
  line.setText("修改后的文字")
  ```

- **`setPlaceholderText(text)`**
  **作用**：设置占位符（浅灰色提示，用户输入时消失）。
  ```python
  line.setPlaceholderText("请输入用户名...")
  ```

- **`setEchoMode(mode)`**
  **参数**：`QLineEdit.EchoMode.Password`（密码模式）、`Normal`（正常）等。
  ```python
  line.setEchoMode(QLineEdit.EchoMode.Password)   # 输入显示为圆点
  ```

- **`returnPressed` 信号**
  **作用**：用户在输入框中按下回车键时发射。
  ```python
  line.returnPressed.connect(lambda: print("回车被按下"))
  ```

- **`textChanged` 信号**
  **作用**：输入文字每次变化时发射。
  ```python
  line.textChanged.connect(lambda text: print("当前内容:", text))
  ```

---

## 6. QTextEdit —— 多行文本编辑器
**导入**：`from PySide6.QtWidgets import QTextEdit`

- **`setPlainText(text)`** / **`toPlainText()`**
  **作用**：设置/获取纯文本（无格式）。
  ```python
  editor = QTextEdit()
  editor.setPlainText("多行\n纯文本")
  print(editor.toPlainText())
  ```

- **`setHtml(html)`** / **`toHtml()`**
  **作用**：设置/获取富文本（HTML 格式）。
  ```python
  editor.setHtml("<h1>标题</h1><p>正文</p>")
  ```

- **`append(text)`**
  **作用**：在末尾追加一行纯文本。
  ```python
  editor.append("新的一行")
  ```

---

## 7. QCheckBox —— 复选框
**导入**：`from PySide6.QtWidgets import QCheckBox`

- **`QCheckBox(text, parent)`**
  ```python
  check = QCheckBox("我同意条款")
  ```

- **`setChecked(bool)`** / **`isChecked()`**
  **作用**：设置/获取选中状态。
  ```python
  check.setChecked(True)
  print(check.isChecked())   # True
  ```

- **`stateChanged` 信号**
  **作用**：勾选状态改变时发射，参数为 `Qt.CheckState`。
  ```python
  check.stateChanged.connect(lambda state: print("新状态码:", state))
  ```

---

## 8. QComboBox —— 下拉列表框
**导入**：`from PySide6.QtWidgets import QComboBox`

- **`addItem(text)`** / **`addItems(list)`**
  **作用**：添加单个/多个下拉选项。
  ```python
  combo = QComboBox()
  combo.addItem("北京")
  combo.addItems(["上海", "广州", "深圳"])
  ```

- **`currentText()`** / **`currentIndex()`**
  **作用**：获取当前选中的文本/索引。
  ```python
  print(combo.currentText())   # "北京"
  print(combo.currentIndex())  # 0
  ```

- **`currentTextChanged` 信号**
  **作用**：选中项改变时发射。
  ```python
  combo.currentTextChanged.connect(lambda text: print("选中:", text))
  ```

---

## 9. QSpinBox —— 数字调节框
**导入**：`from PySide6.QtWidgets import QSpinBox`

- **`setRange(min, max)`**
  **作用**：设置允许的最小/最大值。
  ```python
  spin = QSpinBox()
  spin.setRange(0, 100)
  ```

- **`setValue(value)`** / **`value()`**
  **作用**：设置/获取当前数值。
  ```python
  spin.setValue(25)
  print(spin.value())   # 25
  ```

- **`valueChanged` 信号**
  **作用**：数值改变时发射。
  ```python
  spin.valueChanged.connect(lambda v: print("当前值:", v))
  ```

---

## 10. QSlider —— 滑动条
**导入**：`from PySide6.QtWidgets import QSlider`
**额外导入**：`from PySide6.QtCore import Qt`

- **`QSlider(Qt.Orientation.Horizontal, parent)`**
  ```python
  slider = QSlider(Qt.Orientation.Horizontal)
  ```

- **`setRange(min, max)`** / **`setValue(v)`** / **`value()`**
  ```python
  slider.setRange(0, 100)
  slider.setValue(50)
  print(slider.value())   # 50
  ```

- **`valueChanged` 信号**
  ```python
  slider.valueChanged.connect(lambda v: print("滑块值:", v))
  ```

---

## 11. QProgressBar —— 进度条
**导入**：`from PySide6.QtWidgets import QProgressBar`

- **`setRange(min, max)`** / **`setValue(v)`** / **`value()`**
  ```python
  bar = QProgressBar()
  bar.setRange(0, 100)
  bar.setValue(70)   # 进度到70%
  ```

---

## 12. 布局管理器

### 12.1 QVBoxLayout —— 垂直布局
**导入**：`from PySide6.QtWidgets import QVBoxLayout`
```python
from PySide6.QtWidgets import QWidget, QVBoxLayout, QPushButton

w = QWidget()
layout = QVBoxLayout(w)         # 布局绑定到 w
layout.addWidget(QPushButton("顶部"))
layout.addWidget(QPushButton("中间"))
layout.addStretch()             # 弹性空间，把按钮向上推
layout.addWidget(QPushButton("底部"))
w.show()
```

### 12.2 QHBoxLayout —— 水平布局
**导入**：`from PySide6.QtWidgets import QHBoxLayout`
```python
from PySide6.QtWidgets import QHBoxLayout

layout = QHBoxLayout()
layout.addWidget(QPushButton("左"))
layout.addWidget(QPushButton("中"))
layout.addWidget(QPushButton("右"))
```

### 12.3 QGridLayout —— 网格布局
**导入**：`from PySide6.QtWidgets import QGridLayout`
```python
layout = QGridLayout()
layout.addWidget(QLabel("姓名"), 0, 0)       # 第0行第0列
layout.addWidget(QLineEdit(), 0, 1)          # 第0行第1列
layout.addWidget(QLabel("密码"), 1, 0)
layout.addWidget(QLineEdit(), 1, 1)
```

---

## 13. QGroupBox —— 分组框
**导入**：`from PySide6.QtWidgets import QGroupBox`

- **`QGroupBox(title, parent)`**
  **作用**：创建带标题的边框容器，内部可设置布局。
  ```python
  from PySide6.QtWidgets import QVBoxLayout, QRadioButton

  group = QGroupBox("性别")
  layout = QVBoxLayout(group)
  layout.addWidget(QRadioButton("男"))
  layout.addWidget(QRadioButton("女"))
  ```

---

## 14. QDialog —— 对话框基类
**导入**：`from PySide6.QtWidgets import QDialog`

- **`exec()`**
  **作用**：以模态方式显示对话框，返回 `QDialog.Accepted` 或 `QDialog.Rejected`。
  ```python
  class MyDialog(QDialog):
      def __init__(self):
          super().__init__()
          self.setWindowTitle("确认")
          btn = QPushButton("确定")
          btn.clicked.connect(self.accept)    # 返回 Accepted
          layout = QVBoxLayout(self)
          layout.addWidget(btn)

  dlg = MyDialog()
  if dlg.exec() == QDialog.Accepted:
      print("用户点击了确定")
  ```

- **`accept()`** / **`reject()`**
  **作用**：关闭对话框并设置返回码（分别对应 `Accepted` / `Rejected`）。

---

## 15. QMessageBox —— 标准消息框
**导入**：`from PySide6.QtWidgets import QMessageBox`

- **`about(parent, title, text)`**
  **作用**：显示“关于”信息框。
  ```python
  QMessageBox.about(None, "关于", "版本 1.0")
  ```

- **`information(parent, title, text, buttons, default)`**
  **作用**：显示信息提示框。
  ```python
  QMessageBox.information(None, "提示", "操作成功")
  ```

- **`question(parent, title, text, buttons, default)`**
  **作用**：显示询问对话框，返回用户点击的按钮。
  ```python
  reply = QMessageBox.question(
      None, "确认", "确定要删除吗？",
      QMessageBox.StandardButton.Yes | QMessageBox.StandardButton.No,
      QMessageBox.StandardButton.No
  )
  if reply == QMessageBox.StandardButton.Yes:
      print("选择了是")
  ```

- **`warning(...)`** / **`critical(...)`**
  ```python
  QMessageBox.warning(None, "警告", "磁盘空间不足")
  QMessageBox.critical(None, "错误", "文件损坏无法打开")
  ```

---

## 16. QFileDialog —— 文件对话框
**导入**：`from PySide6.QtWidgets import QFileDialog`

- **`getOpenFileName(parent, caption, dir, filter)`**
  **作用**：弹出打开文件对话框，返回 `(文件路径, 过滤器)` 元组。
  ```python
  path, _ = QFileDialog.getOpenFileName(
      None, "选择图片", "", "图片 (*.png *.jpg);;所有文件 (*.*)"
  )
  if path:
      print("选择了:", path)
  ```

- **`getSaveFileName(...)`**
  **作用**：弹出保存文件对话框。
  ```python
  path, _ = QFileDialog.getSaveFileName(None, "保存", "output.txt", "文本 (*.txt)")
  ```

- **`getExistingDirectory(...)`**
  **作用**：选择文件夹。
  ```python
  folder = QFileDialog.getExistingDirectory(None, "选择目录")
  ```

---

## 17. QMainWindow —— 主窗口框架
**导入**：`from PySide6.QtWidgets import QMainWindow`

提供菜单栏、工具栏、状态栏、中央部件。

- **`menuBar()`** → 返回菜单栏。
- **`addToolBar(title)`** → 创建工具栏。
- **`statusBar()`** → 返回状态栏。
- **`setCentralWidget(widget)`** → 设置中心控件。

```python
from PySide6.QtWidgets import QMainWindow, QTextEdit
from PySide6.QtGui import QAction

class MainWin(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("编辑器")

        # 中央部件
        self.setCentralWidget(QTextEdit())

        # 菜单栏
        file_menu = self.menuBar().addMenu("文件")
        exit_act = QAction("退出", self)
        exit_act.triggered.connect(self.close)
        file_menu.addAction(exit_act)

        # 工具栏
        toolbar = self.addToolBar("快捷")
        toolbar.addAction(exit_act)

        # 状态栏
        self.statusBar().showMessage("就绪")

win = MainWin()
win.show()
```

---

## 18. QAction —— 动作
**导入**：`from PySide6.QtGui import QAction, QIcon`

- **`QAction(icon, text, parent)`**
- **`setShortcut("Ctrl+X")`** — 设置快捷键。
- **`setCheckable(bool)`** / **`setChecked(bool)`** / **`isChecked()`**
- **`triggered` 信号**（点击时发射）。
- **`toggled` 信号**（勾选状态改变时发射）。

```python
act = QAction(QIcon("open.png"), "打开", self)
act.setShortcut("Ctrl+O")
act.setStatusTip("打开文件")
act.triggered.connect(lambda: print("执行打开"))

# 可勾选动作
toggle_act = QAction("显示侧栏", self)
toggle_act.setCheckable(True)
toggle_act.setChecked(True)
toggle_act.toggled.connect(lambda checked: print("勾选状态:", checked))
```

---

## 19. QMenu —— 菜单

- **`addMenu(title)`** → 添加子菜单。
- **`addAction(text/action)`** → 添加动作。
- **`addSeparator()`** → 分隔线。
- **`exec(pos)`** → 在指定屏幕坐标弹出菜单（用于右键菜单）。

```python
# 下拉菜单
menubar = self.menuBar()
file_menu = menubar.addMenu("文件")
file_menu.addAction("新建")
file_menu.addSeparator()
file_menu.addAction("退出")

# 子菜单
recent = file_menu.addMenu("最近打开")
recent.addAction("文件1.txt")

# 右键菜单
def contextMenuEvent(self, event):
    menu = QMenu(self)
    menu.addAction("复制")
    menu.addAction("粘贴")
    action = menu.exec(event.globalPos())
    if action and action.text() == "复制":
        print("执行复制")
```

---

## 20. QToolBar —— 工具栏

- **`addAction(action)`** → 添加动作。
- **`addWidget(widget)`** → 嵌入自定义控件。

```python
tb = self.addToolBar("工具")
tb.addAction(save_act)
# 添加搜索框
tb.addWidget(QLineEdit("搜索..."))
```

---

## 21. QTableWidget —— 表格
**导入**：`from PySide6.QtWidgets import QTableWidget, QTableWidgetItem`

- **`setRowCount(n)`** / **`setColumnCount(n)`**
- **`setItem(row, col, QTableWidgetItem(text))`**
- **`item(row, col)`** → 获取单元格对象。

```python
table = QTableWidget(3, 2)           # 3行2列
table.setHorizontalHeaderLabels(["姓名", "年龄"])
table.setItem(0, 0, QTableWidgetItem("张三"))
table.setItem(0, 1, QTableWidgetItem("25"))
print(table.item(0, 0).text())       # 输出: 张三
```

---

## 22. QThread —— 工作线程
**导入**：`from PySide6.QtCore import QThread, Signal`

- 继承 `QThread`，重写 `run()` 方法。
- 通过自定义信号与 UI 线程通信。

```python
class Worker(QThread):
    progress = Signal(int)

    def run(self):
        for i in range(101):
            self.progress.emit(i)
            self.msleep(50)   # 模拟耗时

# 使用
worker = Worker()
bar = QProgressBar()
worker.progress.connect(bar.setValue)
worker.start()
```

---

## 23. 信号与槽机制
**导入**：`from PySide6.QtCore import QObject, Signal`

- **连接**：`widget.signal.connect(slot_function)`
- **断开**：`widget.signal.disconnect(slot_function)`
- **自定义信号**：`my_signal = Signal(str)` → `my_signal.emit(data)`

```python
class MyObject(QObject):
    finished = Signal(str)

obj = MyObject()
obj.finished.connect(lambda msg: print("收到:", msg))
obj.finished.emit("任务完成")
# 输出: 收到: 任务完成
```

## 24. 自定义组件

### 是什么
自定义组件就是你通过继承现有控件（如 `QWidget`、`QPushButton`），把多个子控件组合在一起，或者重写绘制逻辑，形成一个新的、可复用的界面模块。它可以：
- 把重复的 UI 结构封装成一个类，提高代码复用
- 对外只暴露必要的接口（方法、信号），隐藏内部细节
- 实现标准控件没有的外观和行为

### 创建自定义组件的基本模式
1. 继承 `QWidget`（或其他控件）
2. 在 `__init__` 中创建子控件并设置布局
3. 定义公共方法，供外部读取或修改状态
4. 可选：自定义信号，通知外部内部事件发生
5. 可选：重写 `paintEvent` 实现自定义绘制

---

### 常用方法 / 信号（自定义组件中自行添加的公共成员）

|          成员 |    中文意思    | 说明                                 |
|------------:|:----------:|:-----------------------------------|
|    `Signal` |     信号     | 在类中定义，用于通知外部事件发生                   |
| `emit(...)` |    发射信号    | 发射信号，可携带参数                         |
|       自定义方法 |            | 暴露给外部的公共接口，如 `text()`、`setValue()` |
|  `update()` |    请求重绘    | 调用后会自动触发 `paintEvent`（用于自定义绘制）     |

---

### 示例1：组合控件（带标签的输入框）

```python
from PySide6.QtWidgets import QWidget, QLabel, QLineEdit, QHBoxLayout

class LabeledInput(QWidget):
    """标签 + 输入框的组合控件"""
    def __init__(self, label_text, parent=None):
        super().__init__(parent)                   # parent：父控件
        self.label = QLabel(label_text, self)      # label_text：标签文字
        self.edit = QLineEdit(self)
        layout = QHBoxLayout(self)
        layout.addWidget(self.label)
        layout.addWidget(self.edit)

    def text(self):
        """获取输入框文字"""
        return self.edit.text()

    def setText(self, text):
        """设置输入框文字"""
        self.edit.setText(text)
```

**使用：**
```python
name_input = LabeledInput("姓名：")
name_input.setText("张三")
print(name_input.text())  # 张三
```

---

### 示例2：带信号的自定义组件（搜索框）

```python
from PySide6.QtCore import Signal
from PySide6.QtWidgets import QWidget, QLineEdit, QPushButton, QHBoxLayout

class SearchBox(QWidget):
    search_clicked = Signal(str)   # 自定义信号，携带搜索关键词

    def __init__(self, parent=None):
        super().__init__(parent)
        self.edit = QLineEdit(self)
        self.edit.setPlaceholderText("输入关键词")
        self.btn = QPushButton("搜索", self)

        layout = QHBoxLayout(self)
        layout.addWidget(self.edit)
        layout.addWidget(self.btn)

        self.btn.clicked.connect(self._on_search)
        self.edit.returnPressed.connect(self._on_search)

    def _on_search(self):
        keyword = self.edit.text().strip()
        if keyword:
            self.search_clicked.emit(keyword)   # 发射信号
```

**使用：**
```python
box = SearchBox()
box.search_clicked.connect(lambda kw: print("搜索:", kw))
```

---

### 示例3：自定义绘制（圆形进度条）

```python
from PySide6.QtWidgets import QWidget
from PySide6.QtGui import QPainter, QColor, QPen, QFont
from PySide6.QtCore import Qt, QRectF

class CircleProgress(QWidget):
    """圆形进度条（0-100）"""
    def __init__(self, parent=None):
        super().__init__(parent)
        self._value = 0
        self.setFixedSize(120, 120)   # 固定尺寸

    def value(self):
        return self._value

    def setValue(self, v):
        """设置进度值（0-100），并刷新显示"""
        self._value = max(0, min(100, v))
        self.update()                 # 触发 paintEvent

    def paintEvent(self, event):
        """重写绘制事件，绘制圆形进度条"""
        painter = QPainter(self)
        painter.setRenderHint(QPainter.RenderHint.Antialiasing)

        # 背景圆环
        pen = QPen(QColor("#E0E0E0"), 10)
        painter.setPen(pen)
        painter.drawEllipse(15, 15, 90, 90)

        # 进度弧
        pen.setColor(QColor("#4CAF50"))
        painter.setPen(pen)
        span = int(self._value * 360 / 100) * 16
        painter.drawArc(QRectF(15, 15, 90, 90), 90 * 16, -span)

        # 百分比文字
        painter.setPen(QColor("#333333"))
        painter.setFont(QFont("Arial", 14, QFont.Weight.Bold))
        painter.drawText(self.rect(), Qt.AlignmentFlag.AlignCenter, f"{self._value}%")
        painter.end()
```

**使用：**
```python
bar = CircleProgress()
bar.setValue(75)   # 显示 75%
```

---

## PySide6 官方内置可视化工具

在安装了 PySide6 后，除了代码，官方还提供了几款可视化的辅助工具。它们通常位于你的 `venv\Scripts\` 目录下，推荐直接在某 IDE（如 VS Code 或 PyCharm）的**终端 (Terminal)** 里输入命令来启动。

**1. 界面设计器（Qt Designer）**
*   **启动命令：** `pyside6-designer`
*   **用途：** 核心可视化工具。**不需要手写代码**，通过鼠标拖拽按钮、文本框等组件，直接画出软件界面。画好后保存为 `.ui` 文件。

**2. 翻译助手（Qt Linguist）**
*   **启动命令：** `pyside6-linguist`
*   **用途：** 处理**软件多语言国际化**的可视化工具。如果你希望做出来的软件能切换成英文、日文或繁体中文，就需要用它来翻译界面上的文字。它打开后是一个专门的翻译编辑器。

**3. 帮助文档助手（Qt Assistant）**
*   **启动命令：** `pyside6-assistant`
*   **用途：** 一个可视化的**离线帮助文档查看器**。你把 Qt 官方文档配置进去后，可以像看书一样在离线状态下查阅各种类（如 QWidget, QPushButton）的详细说明。

***

### 💡 两个“隐形的”命令行工具
虽然它们**不是可视化界面**，但却是配合 `Designer` 跑起来**必不可少的骨干工具**（也建议记下来）：

1.  **`pyside6-uic` （UI转代码工具）**
    *   **作用：** 将 Qt Designer 画出来的 `.ui` 文件，**转换成 Python 能读懂的 `.py` 代码**。
    *   **用法：** 在终端执行 `pyside6-uic 你的界面.ui -o ui_界面.py`。
2.  **`pyside6-rcc` （资源转换工具）**
    *   **作用：** 如果你在界面里加了**图片、图标**，你需要把它们编写进一个 `.qrc` 资源文件里，然后用这个命令行工具将图片资源**转成 Python 文件**打包进程序里。
    *   **用法：** 在终端执行 `pyside6-rcc 你的资源.qrc -o 资源_rc.py`。

*(新手提示：别怕，你平时只需要记住 `designer` 画图，然后跑一次 `uic` 转成代码，就可以在 `main.py` 里写了。)*

