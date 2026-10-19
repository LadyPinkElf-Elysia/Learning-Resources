# PySide6-QWidget-Controls

---

## 第一部分：QPushButton —— 普通交互按钮
**导入**：`from PySide6.QtWidgets import QPushButton`
*`QPushButton` 是 GUI 程序中最常触发的交互控件，提供点击、按压、释放等操作反馈。*

- **`QPushButton(text: str, parent: QWidget = None)`**
- **`QPushButton(icon: QIcon, text: str, parent: QWidget = None)`**
  **中文**：构造函数
  **参数**：`text` – 按钮显示的文字；`icon` – 按钮左侧显示的图标对象；`parent` – 父控件。
  **作用**：创建一个带可选图标和文字的按钮。
  ```python
  from PySide6.QtWidgets import QPushButton
  from PySide6.QtGui import QIcon

  btn1 = QPushButton("普通按钮", self)
  btn2 = QPushButton(QIcon("save.png"), "保存", self)
  ```

- **`setText(text: str)`** / **`text()`**
  **中文**：设置/获取按钮文字
  ```python
  btn.setText("点击提交")
  print(btn.text())
  ```

- **`setIcon(icon: QIcon)`** / **`icon()`**
  **中文**：设置/获取按钮图标
  ```python
  btn.setIcon(QIcon("open.png"))
  ```

- **`setShortcut(key: str)`**
  **中文**：设置快捷键
  **参数**：`key` – 字符串，如 `"Ctrl+S"`、`"Alt+F4"`。
  **作用**：无论界面焦点在哪里，只要按下此组合键，就等同于点击了此按钮。
  ```python
  btn.setShortcut("Ctrl+Q")  # 按下 Ctrl+Q 触发按钮点击
  ```

- **`setEnabled(enabled: bool)`** / **`isEnabled()`**
  **中文**：设置/获取按钮是否可用
  **作用**：传入 `False` 会禁用按钮（变为灰色不可点击状态）。
  ```python
  btn.setEnabled(False)  # 禁用按钮
  ```

- **`setCheckable(checkable: bool)`** / **`isCheckable()`** / **`setChecked(checked: bool)`** / **`isChecked()`**
  **中文**：设置/获取按钮的“切换”状态
  **作用**：默认按钮按下后会自动弹起。开启 `setCheckable(True)` 后，按钮会变成“按下->保持按下->再次点击弹起”的切换模式（类似工具栏的锁定按钮）。
  ```python
  btn.setCheckable(True)
  btn.setChecked(True)   # 默认处于按下状态
  print(btn.isChecked()) # True
  ```

- **`setAutoRepeat(autoRepeat: bool)`** / **`setAutoRepeatDelay(ms: int)`** / **`setAutoRepeatInterval(ms: int)`**
  **中文**：设置按钮自动重复（长按触发）
  **作用**：常用于游戏、滑块微调等场景。开启后，长按按钮会不断触发 `clicked` 信号。
  ```python
  btn.setAutoRepeat(True)
  btn.setAutoRepeatDelay(300)   # 按下后 300ms 开始重复触发
  btn.setAutoRepeatInterval(100) # 之后每隔 100ms 触发一次
  ```

- **`setMenu(menu: QMenu)`** / **`menu()`** / **`showMenu()`**
  **中文**：为按钮绑定下拉菜单
  **作用**：为按钮绑定一个 `QMenu` 对象。点击按钮时，会在按钮下方弹出下拉菜单（类似大多数办公软件的“文件”按钮）。
  ```python
  from PySide6.QtWidgets import QMenu

  menu = QMenu(btn)
  menu.addAction("新建")
  menu.addAction("打开")
  
  btn.setMenu(menu)  # 绑定菜单
  ```

- **`setFlat(flat: bool)`**
  **中文**：设置扁平化样式
  **作用**：`True` 时按钮背景变为透明，文字无边框。鼠标悬停时才会显现边框，适合做工具条上的图标按钮。
  ```python
  btn.setFlat(True)
  ```

- **`setDefault(default: bool)`**
  **中文**：设置默认按钮
  **作用**：如果该按钮在对话框中（`QDialog`），且设置为默认按钮，按下键盘 `Enter` 回车键会自动触发此按钮的点击。
  ```python
  btn.setDefault(True)  # 在对话框按回车键相当于点击此按钮
  ```

### 🟢 QPushButton 的核心信号
- **`clicked(checked: bool = False)`**：按钮被点击时触发。如果开启了 `setCheckable(True)`，参数返回当前是否处于按下状态。
- **`pressed()`**：按钮被按下时（鼠标左键刚按下，未松开）触发。
- **`released()`**：按钮被释放时（鼠标左键松开）触发。
- **`toggled(checked: bool)`**：仅在 `setCheckable(True)` 时有效。按钮切换状态时触发，返回当前的开关状态。
  ```python
  btn.clicked.connect(lambda checked: print(f"被点击了，当前状态：{checked}"))
  ```

---

## 第二部分：QToolButton —— 工具按钮（常见于工具栏）
**导入**：`from PySide6.QtWidgets import QToolButton`
*`QToolButton` 通常用于 `QToolBar` 中。与 `QPushButton` 相比，它拥有更丰富的下拉菜单弹出方式和箭头指示支持。*

- **`QToolButton(parent: QWidget = None)`**
  **中文**：构造函数
  ```python
  tool_btn = QToolButton(self)
  tool_btn.setText("保存")
  ```

- **`setArrowType(type: Qt.ArrowType)`**
  **中文**：设置箭头方向
  **参数**：`Qt.UpArrow`、`Qt.DownArrow`、`Qt.LeftArrow`、`Qt.RightArrow`、`Qt.NoArrow`。
  ```python
  tool_btn.setArrowType(Qt.DownArrow)  # 按钮右侧出现一个向下的小箭头
  ```

- **`setPopupMode(mode: QToolButton.ToolButtonPopupMode)`**
  **中文**：设置下拉菜单弹窗模式
  **参数**：
  - `QToolButton.InstantPopup`：点击按钮会**直接弹出菜单**，不触发点击信号。
  - `QToolButton.MenuButtonPopup`：按钮被分成两半，点击主体触发点击信号，点击小箭头触发下拉菜单。
  - `QToolButton.DelayedPopup`：长按按钮一会才会弹出下拉菜单（普通点击依然触发信号）。
  ```python
  tool_btn.setMenu(menu)
  tool_btn.setPopupMode(QToolButton.MenuButtonPopup)
  ```

- **`setToolButtonStyle(style: Qt.ToolButtonStyle)`**
  **中文**：设置图标与文字的排列方式
  **参数**：`Qt.ToolButtonIconOnly`（仅图标）、`Qt.ToolButtonTextOnly`（仅文字）、`Qt.ToolButtonTextBesideIcon`（文字在图标旁）、`Qt.ToolButtonTextUnderIcon`（文字在图标下）。
  ```python
  tool_btn.setToolButtonStyle(Qt.ToolButtonTextUnderIcon)
  ```

### 🟢 QToolButton 的核心信号
- **`triggered(action: QAction)`**：当通过按钮弹出的菜单中点击了某个 `QAction` 时触发，返回被点击的 `QAction` 对象。

---

## 第三部分：QLabel —— 文本与图像显示标签
**导入**：`from PySide6.QtWidgets import QLabel`
*`QLabel` 是最常用的静态显示控件，用于显示文字、图片、富文本及 HTML，也可以作为链接使用。*

- **`QLabel(text: str = "", parent: QWidget = None)`**
- **`QLabel(parent: QWidget = None)`**
  ```python
  label = QLabel("你好，世界！", self)
  ```

- **`setText(text: str)`** / **`text()`**
  **中文**：设置/获取标签的纯文本内容。
  ```python
  label.setText("新内容")
  print(label.text())
  ```

- **`setPixmap(pixmap: QPixmap)`**
  **中文**：设置显示的图片
  **作用**：显示 `QPixmap` 对象。注意，使用此方法会自动清空以前的任何文字。
  ```python
  from PySide6.QtGui import QPixmap
  label.setPixmap(QPixmap("picture.png"))
  ```

- **`setScaledContents(scaled: bool)`**
  **中文**：设置图片是否按标签尺寸缩放
  **作用**：设为 `True` 后，图片会自动拉伸或缩小以适应 QLabel 的大小。如果不开启，图片将显示原始大小，超出部分会被裁剪。
  ```python
  label.setScaledContents(True)
  ```

- **`setAlignment(alignment: Qt.AlignmentFlag)`**
  **中文**：设置文本/图片的对齐方式
  **作用**：支持组合，如 `Qt.AlignCenter`（居中）、`Qt.AlignRight | Qt.AlignVCenter`（靠右垂直居中）。
  ```python
  from PySide6.QtCore import Qt
  label.setAlignment(Qt.AlignmentFlag.AlignCenter)
  ```

- **`setWordWrap(on: bool)`**
  **中文**：设置自动换行
  **作用**：如果文字长度超过 QLabel 的宽度，设为 `True` 会自动换行显示，而不是截断。
  ```python
  label.setWordWrap(True)
  ```

- **`setTextFormat(format: Qt.TextFormat)`**
  **中文**：设置文本格式
  **参数**：`Qt.PlainText`（纯文本）、`Qt.RichText`（富文本/HTML）、`Qt.AutoText`（自动检测，默认）。
  ```python
  label.setText("<h1>大标题</h1><p>正文内容</p>")
  label.setTextFormat(Qt.RichText) # 明确告诉标签这是 HTML
  ```

- **`setOpenExternalLinks(open: bool)`**
  **中文**：设置是否允许点击链接跳转浏览器
  **作用**：如果标签内包含 `<a href="...">` 的超链接，设为 `True` 时，用户点击链接会自动打开系统默认浏览器跳转。
  ```python
  label.setText('<a href="https://www.python.org">访问 Python 官网</a>')
  label.setOpenExternalLinks(True)
  ```

- **`setBuddy(buddy: QWidget)`**
  **中文**：设置伙伴控件
  **作用**：这是一个非常实用的隐藏功能。将标签与一个输入框（如 `QLineEdit`）绑定。用户点击这个标签时，键盘焦点会自动转移到绑定的输入框上，极大提升了表单的交互体验。
  ```python
  name_label = QLabel("姓名：")
  name_edit = QLineEdit()
  name_label.setBuddy(name_edit)  # 点击“姓名：”，光标会自动跳入 name_edit
  ```

---

## 第四部分：QCheckBox —— 复选框（多选）
**导入**：`from PySide6.QtWidgets import QCheckBox`
*常用于“开启/关闭”、“同意/不同意”等二选一，或者支持“部分选中”的三态状态。*

- **`QCheckBox(text: str, parent: QWidget = None)`**
  ```python
  check = QCheckBox("我已阅读并同意用户协议", self)
  ```

- **`setChecked(checked: bool)`** / **`isChecked()`**
  **中文**：设置/获取是否被勾选。
  ```python
  check.setChecked(True) # 默认勾选
  if check.isChecked():
      print("用户已勾选同意")
  ```

- **`setTristate(tristate: bool)`** / **`isTristate()`**
  **中文**：设置/获取是否开启三态模式
  **作用**：标准复选框只有“勾选”和“未勾选”两态。开启三态后，支持第三态“部分选中（半灰色状态）”。
  ```python
  check.setTristate(True)
  check.setCheckState(Qt.CheckState.PartiallyChecked) # 设置为部分选中
  ```

- **`setCheckState(state: Qt.CheckState)`** / **`checkState()`**
  **中文**：设置/获取具体的选中状态
  **参数**：`Qt.CheckState.Unchecked`（未选）、`Qt.CheckState.PartiallyChecked`（部分选中）、`Qt.CheckState.Checked`（选中）。
  ```python
  check.setCheckState(Qt.CheckState.Unchecked) 
  print(check.checkState()) # 输出 0 (Unchecked)
  ```

### 🟢 QCheckBox 的核心信号
- **`stateChanged(state: int)`**：状态发生改变时触发。参数是数字 `0`、`1`、`2`（分别对应未选、部分选、选中）。
- **`toggled(checked: bool)`**：状态改变时触发，但仅在“选中”和“未选中”之间切换时触发，不处理“部分选中”。返回布尔值。
  ```python
  check.stateChanged.connect(lambda state: print(f"当前状态码：{state}"))
  ```

---

## 第五部分：QRadioButton —— 单选框（排他性单选）
**导入**：`from PySide6.QtWidgets import QRadioButton`
*单选框最大的特点是**自动互斥**。放在同一个父控件（或同一个 `QButtonGroup`）下的多个单选框，同一时间**只能有一个被选中**。*

- **`QRadioButton(text: str, parent: QWidget = None)`**
  ```python
  radio_yes = QRadioButton("是", self)
  radio_no = QRadioButton("否", self)
  # 这两个按钮会自动互斥，只能选一个
  ```

- **`setChecked(checked: bool)`** / **`isChecked()`**
  **中文**：设置/获取是否被选中。如果选中某一个，其他同组的会自动取消选中。
  ```python
  radio_yes.setChecked(True)
  ```

- **`setAutoExclusive(exclusive: bool)`**
  **中文**：设置是否开启自动互斥
  **作用**：默认 `True`。如果在同一父控件下，你想让多个单选框可以同时被选中（不复选），可以设为 `False`，但这通常不建议，除非你有特殊需求。

### 🔵 进阶用法：`QButtonGroup`（分组管理器）
**导入**：`from PySide6.QtWidgets import QButtonGroup`
*如果你想在同一个界面中做**多组单选**（比如“性别一组”、“年级一组”），就不能只用父容器来互斥。你需要使用 `QButtonGroup` 来管理逻辑组。*

- **`QButtonGroup(parent: QObject = None)`**
- **`addButton(button: QAbstractButton, id: int = -1)`**：将单选框加入特定组并分配 ID。
- **`checkedButton()`**：获取当前组内被选中的按钮对象。
- **`checkedId()`**：获取当前组内被选中按钮的 ID。
  ```python
  from PySide6.QtWidgets import QButtonGroup

  gender_group = QButtonGroup(self)
  gender_group.addButton(QRadioButton("男"), 1)
  gender_group.addButton(QRadioButton("女"), 2)

  age_group = QButtonGroup(self)
  age_group.addButton(QRadioButton("18岁以下"), 1)
  age_group.addButton(QRadioButton("18-30岁"), 2)

  # 这两个组互不干扰！
  ```

### 🟢 QRadioButton 的核心信号
- **`toggled(checked: bool)`**：选中状态改变时触发。由于互斥机制，当一个按钮被选中，同组的上一个被选中的按钮也会触发 `toggled(False)`。

---

## 第六部分：QComboBox —— 下拉选择框
**导入**：`from PySide6.QtWidgets import QComboBox`
*用于在有限的选项列表中展示并选择一个条目。支持字符串、图标以及绑定隐藏数据。*

- **`QComboBox(parent: QWidget = None)`**
  ```python
  combo = QComboBox(self)
  ```

- **`addItem(text: str, userData: Any = None)`** / **`addItems(texts: List[str])`**
  **中文**：添加下拉项。`addItems` 接受一个字符串列表一次性批量添加。
  ```python
  combo.addItem("北京")
  combo.addItem("上海", 1001) # 可以绑定一个隐藏的数据（如城市代码）
  combo.addItems(["广州", "深圳", "杭州"])
  ```

- **`insertItem(index: int, text: str, userData: Any = None)`** / **`insertItems(index: int, texts: List[str])`**
  **中文**：在指定的索引位置插入下拉项。
  ```python
  combo.insertItem(2, "武汉") # 在第二项之后插入
  ```

- **`removeItem(index: int)`** / **`clear()`**
  **中文**：移除指定索引的项，或者清空所有选项。
  ```python
  combo.removeItem(0) # 删除第一个
  combo.clear()       # 全清空
  ```

- **`count()`**
  **中文**：获取选项的总数量。
  ```python
  print(combo.count())
  ```

- **`setCurrentIndex(index: int)`** / **`currentIndex()`** / **`setCurrentText(text: str)`** / **`currentText()`**
  **中文**：设置/获取当前选中的索引或文本。
  ```python
  combo.setCurrentIndex(2)     # 选中第 3 项
  combo.setCurrentText("上海")  # 选中文本为“上海”的项
  print(combo.currentText())
  ```

- **`currentData(role: int = Qt.UserRole)`**
  **中文**：获取当前选中项绑定的隐藏数据
  **作用**：如果添加项目时使用 `addItem(text, userData)` 绑定了数据，使用此方法取出数据（常用于不依赖文本存储逻辑 ID）。
  ```python
  code = combo.currentData()
  print(code) # 输出 1001
  ```

- **`setEditable(editable: bool)`**
  **中文**：设置下拉框是否允许编辑
  **作用**：设为 `True` 后，下拉框变成可手动输入文字的输入框，当输入的文本匹配列表项时会自动锁定匹配项。
  ```python
  combo.setEditable(True)
  ```

- **`setInsertPolicy(policy: QComboBox.InsertPolicy)`**
  **中文**：设置可编辑模式下，用户输入新文本时的处理策略
  **参数**：
  - `QComboBox.NoInsert`：不添加。
  - `QComboBox.InsertAtBottom`：添加到底部。
  - `QComboBox.InsertAtCurrent`：添加到当前位置并替换。
  ```python
  combo.setInsertPolicy(QComboBox.InsertAtBottom)
  ```

- **`setSizeAdjustPolicy(policy: QComboBox.SizeAdjustPolicy)`**
  **中文**：设置下拉框如何根据内容调整自身尺寸
  **参数**：
  - `QComboBox.AdjustToContents`：下拉框根据当前最短或最长文本自动调整宽度（推荐）。
  - `QComboBox.AdjustToContentsOnFirstShow`：仅在第一次显示时根据内容调整。
  - `QComboBox.AdjustToMinimumContentsLength`：根据预设的最小长度调整。
  ```python
  combo.setSizeAdjustPolicy(QComboBox.SizeAdjustPolicy.AdjustToContents)
  ```

### 🟢 QComboBox 的核心信号
- **`currentTextChanged(text: str)`**：当用户改变选中的文本时触发，返回文本字符串。
- **`currentIndexChanged(index: int)`**：当用户改变选中项的索引时触发，返回整型索引。
- **`activated(index: int)`**：用户在下拉列表选中的时候触发（**注意：包含当前项**）。
- **`highlighted(index: int)`**：用户鼠标在下拉列表滑动时触发（常用来实时预览效果）。
  ```python
  combo.currentTextChanged.connect(lambda text: print(f"选中：{text}"))
  ```

---

## 第七部分：QGroupBox —— 带标题的分组边框容器
**导入**：`from PySide6.QtWidgets import QGroupBox`
*常用作一个带边框和标题的容器，将相关的控件（特别是互斥的 QRadioButton）视觉上归类到一个盒子里。*

- **`QGroupBox(title: str, parent: QWidget = None)`**
  ```python
  group = QGroupBox("性别", self)
  ```

- **`setLayout(layout: QLayout)`**
  **中文**：为 QGroupBox 设置内部布局
  **作用**：把各种控件作为子部件添加进去。
  ```python
  group_layout = QVBoxLayout(group)
  group_layout.addWidget(QRadioButton("男"))
  group_layout.addWidget(QRadioButton("女"))
  ```

- **`setFlat(flat: bool)`**
  **中文**：设置扁平化样式
  **作用**：设为 `True` 会去除分组框的常规边框线，仅保留标题周围的一条边框，视觉上更现代简洁。
  ```python
  group.setFlat(True)
  ```

- **`setCheckable(checkable: bool)`**
  **中文**：设置分组框是否可勾选
  **作用**：设为 `True` 后，标题的左侧会出现一个复选框（或单选框）。取消勾选这个盒子，分组框内的所有控件会自动变成禁用状态（变灰）。
  ```python
  group.setCheckable(True)
  group.setChecked(False) # 刚开始处于未勾选状态，内部所有控件不可用
  ```

- **`setChecked(checked: bool)`** / **`isChecked()`**
  **中文**：设置/获取分组框的勾选状态（需先开启 `setCheckable`）。

### 🟢 QGroupBox 的核心信号
- **`toggled(on: bool)`**：当分组框的勾选状态发生改变时发射。

---

## 第八部分、 每个类的进阶细节补充（官方文档隐藏角落）

### QPushButton 补充细节
- **`animateClick(ms: int = 100)`**
  **中文**：模拟动画点击
  **作用**：以编程方式触发按钮的“按下并弹起”的视觉动画效果（按钮会下陷并弹起），持续指定毫秒数。常用于在脚本或定时器中给用户“操作成功”的视觉反馈。
  ```python
  btn.animateClick(200) # 按钮会闪烁一下动画
  ```

- **`click()`**
  **中文**：直接触发点击信号
  **作用**：以编程方式触发 `clicked` 信号，但**没有视觉反馈**。适合在后台逻辑中直接调用按钮绑定的功能。
  ```python
  btn.click() # 触发逻辑，按钮不会闪烁
  ```

- **`setAutoExclusive(exclusive: bool)`**
  **中文**：设置自动排他性
  **作用**：当一个按钮被 `setCheckable(True)` 设为切换模式后，如果 `setAutoExclusive(True)` 且它们处于同一个父容器中，那么它们会变成**单选模式**：同一时间只能按下其中一个（常见于 Photoshop 的工具栏）。
  ```python
  btn1.setCheckable(True); btn1.setAutoExclusive(True)
  btn2.setCheckable(True); btn2.setAutoExclusive(True) # 这俩现在互斥
  ```

### QToolButton 补充细节
- **`setIconSize(size: QSize)`**
  **中文**：自定义图标尺寸
  **作用**：强制指定按钮图标的像素大小，而不依赖工具栏的全局配置。
  ```python
  tool_btn.setIconSize(QSize(32, 32))
  ```

- **`setDefaultAction(action: QAction)`**
  **中文**：绑定默认动作
  **作用**：`QToolButton` 最强大的功能之一。当把一个 `QAction` 传给它时，它会**自动读取 Action 的图标、文字、快捷键和工具提示**，并且点击按钮会自动触发 Action 的 `triggered` 信号。极大简化了界面与动作的绑定。
  ```python
  save_act = QAction(QIcon("save.png"), "保存", self)
  save_act.setShortcut("Ctrl+S")
  tool_btn.setDefaultAction(save_act) # 绑定后，按钮自动显示图标和“保存”
  ```

### QLabel 补充细节
- **`setTextInteractionFlags(flags: Qt.TextInteractionFlag)`**
  **中文**：设置文本交互方式（让 QLabel 变成可复制的）
  **作用**：默认 `QLabel` 的文本是**无法选中和复制**的。如果你用于显示日志或者报错信息，需要让用户复制，打开这个选项非常关键。
  ```python
  from PySide6.QtCore import Qt
  label.setTextInteractionFlags(Qt.TextInteractionFlag.TextSelectableByMouse) # 鼠标可以选中复制
  ```

- **`setMargin(margin: int)`**
  **中文**：设置标签内部边距
  **作用**：在文字/图片的外围和内边框之间添加空白像素。
  ```python
  label.setMargin(10) # 内容离边缘 10 像素
  ```

- **`setNum(num: int)`** / **`setNum(num: float)`**
  **中文**：直接显示数字
  **作用**：完全等同于 `setText(str(num))`，属于一种便捷写法。
  ```python
  label.setNum(3.14159) # 直接显示 "3.14159"
  ```

### QComboBox 补充细节
- **`setMaxVisibleItems(max_items: int)`**
  **中文**：设置最大可见下拉项数量
  **作用**：如果你的下拉列表有 100 项，不设置的话会拉得极长。设置此数值，下拉框会自动出现滚动条。
  ```python
  combo.setMaxVisibleItems(10) # 每次最多展开显示 10 项，其余滚动查看
  ```

- **`setDuplicatesEnabled(enable: bool)`**
  **中文**：设置是否允许列表中存在重复文本
  **作用**：默认不允许。如果确定会出现同名选项，必须打开此开关。
  ```python
  combo.setDuplicatesEnabled(True)
  ```

- **`setCompleter(completer: QCompleter)`**
  **中文**：开启输入自动补全
  **作用**：必须配合 `setEditable(True)` 使用。输入文本时，下拉框会根据输入的字符自动弹出匹配的最优补全建议。
  ```python
  from PySide6.QtWidgets import QCompleter
  
  combo.setEditable(True)
  completer = QCompleter(["北京", "上海", "广州"], self)
  combo.setCompleter(completer) # 输入“北”，自动出现“北京”建议
  ```

### QGroupBox 补充细节
- **`setAlignment(alignment: Qt.AlignmentFlag)`**
  **中文**：设置标题文字对齐方式
  **作用**：允许标题左对齐、居中或右对齐（默认是左对齐）。
  ```python
  group.setAlignment(Qt.AlignmentFlag.AlignCenter) # 标题居中显示
  ```

- **`QCommandLinkButton(text: str, parent: QWidget = None)`** / **`QCommandLinkButton(text: str, description: str, parent: QWidget = None)`**
  **中文**：命令链接按钮（常见于 Windows 7/10 及现代向导界面）。
  **作用**：这是一种特殊的按钮，它自带一个指向右上的箭头图标，并且支持“主标题 + 副描述”。视觉层级分明，非常适合用于多选项的向导界面（如软件安装程序的“典型安装”和“自定义安装”）。
  ```python
  from PySide6.QtWidgets import QCommandLinkButton
  btn = QCommandLinkButton("快速安装", "以默认路径快速安装最新版本", self)
  ```

- **`QComboBox.setView(view: QAbstractItemView)`**
  **中文**：为下拉列表指定一个自定义的视图。
  **作用**：默认情况下，下拉框只是一个弹出单列文本的列表框。通过此方法，你可以传入一个 `QListView` 或者 `QTableView`，从而在弹出时显示**包含图标、多列数据的复杂下拉菜单**（类似 Photoshop 的笔刷下拉面板）。
  ```python
  combo = QComboBox()
  custom_view = QListView()
  custom_view.setIconSize(QSize(24, 24))  # 设置下拉项中的图标大小
  combo.setView(custom_view)             # 应用自定义视图
  ```
---

