# PySide6-QWidget-Containers

---

## 第一部分：QGroupBox —— 带标题的分组边框容器
**导入**：`from PySide6.QtWidgets import QGroupBox`
*`QGroupBox` 提供一组带标题的边框，常用于将一组相关的控件（特别是互斥的 `QRadioButton`）在视觉上归类到一个盒子中，提高用户界面的可读性。*

- **`QGroupBox(title: str, parent: QWidget = None)`**
  **中文**：构造函数
  **参数**：`title` – 分组框的标题文字；`parent` – 父控件。
  **作用**：创建一个带标题的边框容器。
  ```python
  from PySide6.QtWidgets import QGroupBox, QVBoxLayout, QRadioButton
  
  group = QGroupBox("性别选择", self)
  layout = QVBoxLayout(group)
  layout.addWidget(QRadioButton("男"))
  layout.addWidget(QRadioButton("女"))
  ```

- **`setTitle(title: str)`** / **`title()`**
  **中文**：设置/获取分组框的标题文字。
  ```python
  group.setTitle("国籍选择")
  ```

- **`setAlignment(alignment: Qt.AlignmentFlag)`**
  **中文**：设置标题文字在边框上的对齐方式。
  **参数**：常用 `Qt.AlignLeft`（左对齐，默认）、`Qt.AlignCenter`（居中）、`Qt.AlignRight`（右对齐）。
  ```python
  group.setAlignment(Qt.AlignmentFlag.AlignCenter) # 标题居中显示
  ```

- **`setFlat(flat: bool)`**
  **中文**：设置扁平化样式
  **作用**：设为 `True` 会去除分组框四周的常规粗边框线，仅保留标题下方一条细线，视觉上更现代简洁。
  ```python
  group.setFlat(True)
  ```

- **`setCheckable(checkable: bool)`**
  **中文**：设置分组框是否可勾选
  **作用**：设为 `True` 后，标题的左侧会出现一个复选框（或单选框）。取消勾选这个盒子，分组框内的所有控件会自动变成禁用状态（变灰、不可点击），非常适合做功能模块的“总开关”。
  ```python
  group.setCheckable(True)
  ```

- **`setChecked(checked: bool)`** / **`isChecked()`**
  **中文**：设置/获取分组框的勾选状态。前提是必须开启 `setCheckable(True)`。
  ```python
  group.setChecked(True) # 默认开启
  print(group.isChecked())
  ```

- **`setLayout(layout: QLayout)`**
  **中文**：为 QGroupBox 设置内部布局
  ```python
  layout = QVBoxLayout(group)
  layout.addWidget(QPushButton("按钮1"))
  ```

### 🟢 QGroupBox 的核心信号
- **`toggled(on: bool)`**：当分组框的勾选状态发生改变（开启或关闭）时发射，返回布尔值。
  ```python
  group.toggled.connect(lambda on: print(f"分组框状态：{'开启' if on else '关闭'}"))
  ```

---

## 第二部分：QTabWidget —— 选项卡容器
**导入**：`from PySide6.QtWidgets import QTabWidget`
*`QTabWidget` 提供多页选项卡切换的容器，在一个界面中隐藏大量信息，通过顶部的标签进行页面切换。*

- **`QTabWidget(parent: QWidget = None)`**
  **中文**：构造函数
  ```python
  tabs = QTabWidget(self)
  ```

- **`addTab(widget: QWidget, text: str)`** / **`addTab(widget: QWidget, icon: QIcon, text: str)`**
  **中文**：添加新选项卡
  **作用**：将给定的控件添加到选项卡中，并设置标签页的文字（及可选的图标）。
  ```python
  from PySide6.QtWidgets import QTextEdit, QWidget
  from PySide6.QtGui import QIcon
  
  tabs.addTab(QTextEdit(), "文本编辑页")
  tabs.addTab(QWidget(), QIcon("settings.png"), "设置页")
  ```

- **`insertTab(index: int, widget: QWidget, text: str)`** / **`insertTab(index: int, widget: QWidget, icon: QIcon, text: str)`**
  **中文**：在指定的索引位置插入一个新的选项卡。
  ```python
  tabs.insertTab(1, QWidget(), "中间插入页")
  ```

- **`removeTab(index: int)`**
  **中文**：移除指定索引的选项卡。注意：移除的控件不会被销毁，只是从选项卡中剥离。
  ```python
  tabs.removeTab(0) # 删除第一个标签页
  ```

- **`clear()`**
  **中文**：清空所有选项卡。
  ```python
  tabs.clear()
  ```

- **`setCurrentIndex(index: int)`** / **`currentIndex()`**
  **中文**：设置/获取当前可见的选项卡索引（从 0 开始）。
  ```python
  tabs.setCurrentIndex(2) # 切换到第 3 页
  print(tabs.currentIndex())
  ```

- **`setCurrentWidget(widget: QWidget)`** / **`currentWidget()`**
  **中文**：通过控件对象来设置/获取当前可见的选项卡。
  ```python
  page3 = tabs.widget(2) # 获取索引 2 的控件对象
  tabs.setCurrentWidget(page3)
  ```

- **`setTabText(index: int, text: str)`** / **`tabText(index: int)`**
  **中文**：设置/获取指定索引选项卡的标题文字。
  ```python
  tabs.setTabText(0, "首页") # 将第一个标签页改为“首页”
  ```

- **`setTabIcon(index: int, icon: QIcon)`** / **`tabIcon(index: int)`**
  **中文**：设置/获取指定索引选项卡的图标。
  ```python
  tabs.setTabIcon(0, QIcon("home.png"))
  ```

- **`setTabsClosable(closable: bool)`**
  **中文**：设置选项卡是否显示关闭按钮（“×”）
  **作用**：设为 `True` 后，每个选项卡右侧会出现一个小“×”号，点击后可以通过信号 `tabCloseRequested` 处理关闭逻辑。
  ```python
  tabs.setTabsClosable(True)
  ```

- **`setTabPosition(position: QTabWidget.TabPosition)`**
  **中文**：设置选项卡标签的显示位置
  **参数**：`QTabWidget.North`（顶部，默认）、`QTabWidget.South`（底部）、`QTabWidget.West`（左侧）、`QTabWidget.East`（右侧）。
  ```python
  tabs.setTabPosition(QTabWidget.TabPosition.South) # 标签页放在底部
  ```

- **`setTabShape(shape: QTabWidget.TabShape)`**
  **中文**：设置选项卡标签的形状
  **参数**：`QTabWidget.Rounded`（圆角，默认，现代风格）、`QTabWidget.Triangular`（尖角，早期风格，类似老式笔记本）。
  ```python
  tabs.setTabShape(QTabWidget.TabShape.Triangular)
  ```

- **`setMovable(movable: bool)`**
  **中文**：设置是否允许用户拖拽改变选项卡的顺序。
  ```python
  tabs.setMovable(True)
  ```

- **`count()`**
  **中文**：获取当前选项卡的总页数。
  ```python
  print(tabs.count())
  ```

- **`widget(index: int)`**
  **中文**：获取指定索引选项卡中的控件对象，用于后续操作（如向内部添加控件）。
  ```python
  widget = tabs.widget(0)
  ```

### 🟢 QTabWidget 的核心信号
- **`currentChanged(index: int)`**：当切换选项卡页面时触发，返回新页面的索引。
- **`tabCloseRequested(index: int)`**：当用户点击了选项卡上的“×”关闭按钮时触发（必须提前开启 `setTabsClosable(True)`），返回关闭的索引号，你需要在此处理删除逻辑。
  ```python
  tabs.tabCloseRequested.connect(lambda idx: print(f"用户请求关闭第 {idx} 页"))
  ```

---

## 第三部分：QStackedWidget —— 堆叠容器（页面切换神器）
**导入**：`from PySide6.QtWidgets import QStackedWidget`
*`QStackedWidget` 和选项卡类似，但它**没有上方那个可视的标签栏**。它像一叠卡片一样，同一时刻只能显示一张卡片，非常适合做“向导”或“状态切换”的界面（比如登录成功切换到一个新界面）。*

- **`QStackedWidget(parent: QWidget = None)`**
  ```python
  stacked = QStackedWidget(self)
  ```

- **`addWidget(widget: QWidget)`** / **`insertWidget(index: int, widget: QWidget)`** / **`removeWidget(widget: QWidget)`**
  **中文**：添加、插入、移除堆叠的子控件。
  ```python
  page1 = QWidget()
  page2 = QWidget()
  stacked.addWidget(page1)
  stacked.addWidget(page2)
  ```

- **`setCurrentIndex(index: int)`** / **`currentIndex()`** / **`setCurrentWidget(widget: QWidget)`** / **`currentWidget()`**
  **中文**：通过索引或控件对象设置/获取当前显示的页面。
  ```python
  stacked.setCurrentIndex(1) # 切换显示 page2
  stacked.setCurrentWidget(page1) # 切换回 page1
  ```

- **`count()`** / **`widget(index: int)`**
  **中文**：获取总页数/获取特定索引的控件对象。

- **`indexOf(widget: QWidget)`**
  **中文**：获取特定控件在堆叠内的索引号。

### 🟢 QStackedWidget 的核心信号
- **`currentChanged(index: int)`**：当切换显示的页面时触发。

### 💡 进阶技巧：`QStackedWidget` 配合 `QComboBox` 做类似安卓的页面切换
因为没有自带的标签，我们通常用外部下拉框或按钮来控制它的切换。
```python
stacked = QStackedWidget()
combo = QComboBox()
combo.addItem("页面 1")
combo.addItem("页面 2")

# 将下拉框的选择与堆叠窗口绑定
combo.currentIndexChanged.connect(stacked.setCurrentIndex)
```

---

## 第四部分：QScrollArea —— 滚动区域容器
**导入**：`from PySide6.QtWidgets import QScrollArea`
*当一个控件（如巨大的图片或大量的按钮）超出了窗口的显示范围时，将图片放入 `QScrollArea` 中，它会自动提供横向和纵向的滚动条。*

- **`QScrollArea(parent: QWidget = None)`**
  ```python
  scroll = QScrollArea(self)
  ```

- **`setWidget(widget: QWidget)`**
  **中文**：设置滚动区域内的内容控件
  **作用**：将一个大的控件放在滚动区域内，所有超出滚动区域尺寸的部分会被裁切，并在边缘自动出现滚动条。
  ```python
  from PySide6.QtWidgets import QLabel
  
  big_label = QLabel("这是一段极其长的文本...") # 假设文本很长
  big_label.setFixedSize(500, 500) # 强制设大尺寸
  
  scroll.setWidget(big_label)
  ```

- **`takeWidget()`**
  **中文**：取出当前的内置控件（剥离出来，不销毁）。

- **`setWidgetResizable(resizable: bool)`**
  **中文**：设置内容控件是否随滚动区域缩放
  **作用**：设为 `True` 时，内嵌的控件会自动伸展或缩小以适应滚动窗口的宽度/高度（内容控件的尺寸会动态变化，但滚动条依然会在尺寸溢出时出现）。
  ```python
  scroll.setWidgetResizable(True)
  ```

- **`setHorizontalScrollBarPolicy(policy: Qt.ScrollBarPolicy)`** / **`setVerticalScrollBarPolicy(policy: Qt.ScrollBarPolicy)`**
  **中文**：设置横向/纵向滚动条的显示策略
  **参数**：
  - `Qt.ScrollBarAsNeeded`：根据内容自动显示（默认）。
  - `Qt.ScrollBarAlwaysOn`：强制始终显示滚动条。
  - `Qt.ScrollBarAlwaysOff`：强制永远隐藏滚动条。
  ```python
  scroll.setHorizontalScrollBarPolicy(Qt.ScrollBarAlwaysOff) # 禁止横向滚动
  ```

---

## 第五部分：QListWidget —— 列表容器
**导入**：`from PySide6.QtWidgets import QListWidget, QListWidgetItem`
*`QListWidget` 是一个用于展示一列可点击、可选择的条目列表的控件。类似于手机里的设置列表。*

- **`QListWidget(parent: QWidget = None)`**
  ```python
  list_widget = QListWidget(self)
  ```

- **`addItem(text: str)`** / **`addItems(texts: list)`**
  **中文**：向列表底部添加单一文本项，或批量添加多个文本项。
  ```python
  list_widget.addItem("北京")
  list_widget.addItems(["上海", "广州", "深圳"])
  ```

- **`insertItem(row: int, text: str)`** / **`insertItems(row: int, texts: list)`**
  **中文**：在指定索引位置插入新项。

- **`removeItem(row: int)`** / **`clear()`**
  **中文**：移除特定索引的项，或清空整个列表。

- **`setCurrentRow(row: int)`** / **`setCurrentItem(item: QListWidgetItem)`** / **`currentRow()`** / **`currentItem()`**
  **中文**：设置/获取当前选中的行号或项对象。
  ```python
  list_widget.setCurrentRow(2) # 选中第3项
  item = list_widget.currentItem()
  if item:
      print(item.text())
  ```

- **`item(row: int)`**
  **中文**：获取指定行的 `QListWidgetItem` 对象。

- **`count()`**
  **中文**：获取条目总数。

### 🟢 QListWidget 的核心信号
- **`itemClicked(item: QListWidgetItem)`**：点击列表中某一项时发射。
- **`itemDoubleClicked(item: QListWidgetItem)`**：双击列表某一项时发射（常用来执行打开操作）。
- **`currentItemChanged(current: QListWidgetItem, previous: QListWidgetItem)`**：当前选中的项发生变化时发射（提供当前项和上一个项）。
- **`currentRowChanged(row: int)`**：当前选中的行发生变化时发射。

### 🔵 进阶用法：`QListWidgetItem` （列表项的深入封装）
列表中的每一项实际上都是 `QListWidgetItem` 对象。你可以为这个对象绑定隐藏数据、图标，甚至改变它的大小。

```python
item = QListWidgetItem("选项1")
item.setIcon(QIcon("icon.png"))  # 加上图标
item.setSizeHint(QSize(50, 50))  # 设置该项的高度为 50
item.setData(Qt.UserRole, "隐藏的ID")  # 绑定隐藏数据

list_widget.addItem(item)

# 获取隐藏数据
selected_item = list_widget.currentItem()
print(selected_item._data(Qt.UserRole))
```

---

## 第六部分：QTableWidget —— 表格容器
**导入**：`from PySide6.QtWidgets import QTableWidget, QTableWidgetItem`
*`QTableWidget` 是展示二维数据（行和列）最强大的标准控件，完美地模拟了 Excel 表格的样式。*

- **`QTableWidget(rows: int, columns: int, parent: QWidget = None)`**
  **中文**：构造函数
  **参数**：`rows` – 初始化行数；`columns` – 初始化列数。
  ```python
  table = QTableWidget(3, 2, self) # 3行 2列
  ```

- **`setRowCount(rows: int)`** / **`setColumnCount(columns: int)`** / **`rowCount()`** / **`columnCount()`**
  **中文**：动态设置/获取表格的行数和列数。
  ```python
  table.setRowCount(5)
  ```

- **`setHorizontalHeaderLabels(labels: list)`** / **`setVerticalHeaderLabels(labels: list)`**
  **中文**：设置表格顶部横轴（列头）和左侧纵轴（行头）的显示文字。
  ```python
  table.setHorizontalHeaderLabels(["姓名", "年龄"])
  table.setVerticalHeaderLabels(["1", "2", "3"])
  ```

- **`setItem(row: int, column: int, item: QTableWidgetItem)`**
  **中文**：将数据填入指定的单元格中。
  ```python
  table.setItem(0, 0, QTableWidgetItem("张三"))
  table.setItem(0, 1, QTableWidgetItem("25"))
  ```

- **`item(row: int, column: int)`**
  **中文**：获取指定单元格的 `QTableWidgetItem` 对象，用于提取其中的数据。
  ```python
  name_item = table.item(0, 0)
  if name_item:
      print(name_item.text()) # 输出: 张三
  ```

- **`clearContents()`** / **`clear()`**
  **中文**：`clearContents()` 只清空数据，保留行列结构。`clear()` 会同时删除所有行、列和数据（变成一个空表）。

- **`setCurrentCell(row: int, column: int)`**
  **中文**：选中指定坐标的单元格。
  ```python
  table.setCurrentCell(2, 1) # 选中第三行第二列
  ```

- **`setSelectionBehavior(behavior: QAbstractItemView.SelectionBehavior)`**
  **中文**：设置选择模式
  **参数**：
  - `QAbstractItemView.SelectItems`：默认，选择单个单元格。
  - `QAbstractItemView.SelectRows`：点击单元格时选中一整行。
  - `QAbstractItemView.SelectColumns`：点击单元格时选中一整列。
  ```python
  table.setSelectionBehavior(QAbstractItemView.SelectionBehavior.SelectRows)
  ```

- **`setEditTriggers(triggers: QAbstractItemView.EditTrigger)`**
  **中文**：设置单元格被双击进入编辑模式的触发条件。
  **参数**：
  - `QAbstractItemView.NoEditTriggers`：禁止用户通过界面修改内容（相当于只读）。
  - `QAbstractItemView.DoubleClicked`：双击进入编辑模式。
  - `QAbstractItemView.EditKeyPressed`：选中时按某个键进入编辑。
  ```python
  table.setEditTriggers(QAbstractItemView.EditTrigger.NoEditTriggers) # 禁止修改
  ```

### 🟢 QTableWidget 的核心信号
- **`itemClicked(item: QTableWidgetItem)`**：点击单元格时发射。
- **`itemDoubleClicked(item: QTableWidgetItem)`**：双击单元格时发射。
- **`itemSelectionChanged()`**：选中的区域发生改变时发射。
- **`currentItemChanged(current: QTableWidgetItem, previous: QTableWidgetItem)`**：当前选中的单元格发生改变时发射。

---

## 第七部分：QTreeWidget —— 树形结构容器
**导入**：`from PySide6.QtWidgets import QTreeWidget, QTreeWidgetItem`
*`QTreeWidget` 用于展示具有层级关系的树状数据，如文件资源管理器中的文件夹与子文件。*

- **`QTreeWidget(parent: QWidget = None)`**
  ```python
  tree = QTreeWidget(self)
  ```

- **`setHeaderLabel(label: str)`** / **`setHeaderLabels(labels: list)`**
  **中文**：设置树状结构最顶部的列头。若有多列（类似详细信息展示），可以使用 `setHeaderLabels`。
  ```python
  tree.setHeaderLabel("文件列表")
  tree.setHeaderLabels(["文件名", "大小"])
  ```

- **`addTopLevelItem(item: QTreeWidgetItem)`** / **`addTopLevelItems(items: list)`**
  **中文**：添加根节点（最顶层级的项）。
  ```python
  root = QTreeWidgetItem(tree)
  root.setText(0, "我的电脑")
  ```

- **`insertTopLevelItem(index: int, item: QTreeWidgetItem)`**
  **中文**：在指定索引处插入根节点。

- **`takeTopLevelItem(index: int)`**
  **中文**：从列表中取出指定索引的根节点项。

### 🔵 进阶用法：`QTreeWidgetItem` （树节点的深入封装）
`QTreeWidgetItem` 是树形结构的基本组成单位，根节点与子节点的本质都是它。
```python
# 创建节点
root_item = QTreeWidgetItem(tree)
root_item.setText(0, "C盘")

# 创建子节点并加入根节点
child_item1 = QTreeWidgetItem(root_item)
child_item1.setText(0, "Program Files")

child_item2 = QTreeWidgetItem(root_item)
child_item2.setText(0, "Windows")

# 展开/折叠状态
root_item.setExpanded(True) # 默认展开
```

- **`setText(column: int, text: str)`** / **`text(column: int)`**
  **中文**：设置/获取该节点在特定列显示的文本。
- **`setIcon(column: int, icon: QIcon)`** / **`icon(column: int)`**
  **中文**：设置/获取该节点的图标。
- **`addChild(child: QTreeWidgetItem)`** / **`insertChild(index: int, child: QTreeWidgetItem)`**
  **中文**：添加子节点。
- **`childCount()`** / **`child(index: int)`**
  **中文**：获取子节点总数 / 获取特定索引的子节点。
- **`takeChild(index: int)`**
  **中文**：剥离特定的子节点（不销毁）。

### 🟢 QTreeWidget 的核心信号
- **`itemClicked(item: QTreeWidgetItem, column: int)`**：点击节点时发射。
- **`itemDoubleClicked(item: QTreeWidgetItem, column: int)`**：双击节点时发射。
- **`currentItemChanged(current: QTreeWidgetItem, previous: QTreeWidgetItem)`**：当前选中的节点发生改变时发射。
- **`itemExpanded(item: QTreeWidgetItem)`**：节点被展开时发射。
- **`itemCollapsed(item: QTreeWidgetItem)`**：节点被折叠时发射。

---

## 第八部分、 容器组件的高阶隐藏细节补充

### QTabWidget 补充细节
- **`setDocumentMode(enable: bool)`**
  **中文**：开启文档模式（极度推荐）
  **作用**：设为 `True` 后，选项卡区域的外围背景会变成透明，标签页会和内容区域完全连成一片，没有突兀的边框。这使得界面看起来更像现代浏览器（如 Chrome）或者 IDE，**UI 高级感瞬间提升**。
  ```python
  tabs.setDocumentMode(True)
  ```

- **`setTabBarAutoHide(enable: bool)`**
  **中文**：隐藏单页时的标签栏
  **作用**：默认情况下，就算只有一个页面，标签栏也会显示。设为 `True` 后，如果选项卡数量小于等于 1，标签栏会自动隐藏，显得界面更加清爽。
  ```python
  tabs.setTabBarAutoHide(True)
  ```

- **`tabBar().setExpanding(expanding: bool)`**
  **中文**：控制标签栏是否占满宽度
  **作用**：通过 `tabBar()` 拿到底层的标签栏对象，调用 `setExpanding(True)` 可以让标签页均匀地铺满整个顶部区域，而不会全部挤在左边。
  ```python
  tabs.tabBar().setExpanding(True)
  ```

### QStackedWidget 补充细节
- **`setCurrentIndex(index)`** (备注过渡动画)
  **作用**：`QStackedWidget` 原生**不包含**切换动画。如果你想实现类似“Tab 页从右向左划入”的效果，需要用到 `QPropertyAnimation` 或 `QGraphicsOpacityEffect`。但有一个简单的 Qt 内置模式：将 `QStackedWidget` 作为 `QTabWidget` 的隐藏逻辑使用。

### QScrollArea 补充细节
- **`ensureWidgetVisible(widget: QWidget, xMargin: int = 0, yMargin: int = 0)`**
  **中文**：确保特定子控件在视口中可见
  **作用**：如果你的滚动区域里内容极其复杂，你可以传入一个内部的控件对象，滚动条会自动滚动到这个控件的位置让它显示出来。非常适合做“滚动到定位”功能。
  ```python
  scroll_area.ensureWidgetVisible(target_widget)
  ```

- **`viewport()`**
  **中文**：获取视口控件
  **作用**：`QScrollArea` 内部显示内容的那个窗口叫做“视口”。你可以用它来设置视口的背景色，或者给视口加边框、监听鼠标事件等。
  ```python
  scroll_area.viewport().setStyleSheet("background-color: #f0f0f0;")
  ```

- **`setAlignment(alignment: Qt.AlignmentFlag)`**
  **中文**：设置内容在滚动区域中的对齐方式
  **作用**：如果内容控件比滚动区域小，默认靠左上角显示。可以通过此属性让内容在滚动区域中居中。
  ```python
  scroll_area.setAlignment(Qt.AlignmentFlag.AlignCenter)
  ```

### QListWidget 补充细节
- **`setSelectionMode(mode: QAbstractItemView.SelectionMode)`**
  **中文**：设置选择模式（实现多项选）
  **参数**：
  - `QAbstractItemView.SelectionMode.SingleSelection`：只能单选（默认）。
  - `QAbstractItemView.SelectionMode.ExtendedSelection`：按住 Ctrl 可多选，按住 Shift 可连续选。
  - `QAbstractItemView.SelectionMode.MultiSelection`：点击即可多选（无需按 Ctrl）。
  ```python
  list_widget.setSelectionMode(QAbstractItemView.SelectionMode.ExtendedSelection) # 允许用户多选
  ```

- **`sortItems(order: Qt.SortOrder)`**
  **中文**：对列表中的字符串进行排序
  ```python
  list_widget.sortItems(Qt.SortOrder.AscendingOrder) # 正序排序
  ```

- **`setAlternatingRowColors(enable: bool)`**
  **中文**：开启隔行变色
  **作用**：设为 `True` 后，列表的行会呈现“白—浅灰—白—浅灰”交替的斑马纹，极大降低用户阅读长列表时的视觉疲劳。
  ```python
  list_widget.setAlternatingRowColors(True)
  ```

- **`takeItem(row: int)`**
  **中文**：从列表中剥离特定项（不销毁对象，只是拿走）
  ```python
  item = list_widget.takeItem(0) # 把第一项拿出来，列表里消失
  ```

### QTableWidget 补充细节
- **`setColumnWidth(column: int, width: int)`** / **`setRowHeight(row: int, height: int)`**
  **中文**：设置特定列宽/特定行高。
  ```python
  table.setColumnWidth(0, 150) # 第一列宽度 150 像素
  table.setRowHeight(2, 40)    # 第三行高度 40 像素
  ```

- **`resizeColumnsToContents()`** / **`resizeRowsToContents()`**
  **中文**：自动将列宽/行高调整到刚好容纳内部文字的最短尺寸。
  ```python
  table.resizeColumnsToContents() # 自适应列宽
  ```

- **`setSpan(row: int, column: int, rowSpan: int, colSpan: int)`**
  **中文**：合并单元格（类似 Excel 的合并居中）
  **作用**：将从 `(row, column)` 开始的 `rowSpan` 行和 `colSpan` 列的单元格合并成一个。
  ```python
  table.setSpan(0, 0, 1, 2) # 将第一行第一列和第一行第二列合并为一格
  ```

- **`setSortingEnabled(enable: bool)`**
  **中文**：开启列头点击排序
  **作用**：设为 `True` 后，用户点击表格的列标题，整个表格就会自动按照该列的数据进行升序或降序排列。
  ```python
  table.setSortingEnabled(True)
  ```

- **`cellClicked(row: int, column: int)` 信号**
  **中文**：专用获取行列坐标的信号
  **作用**：`itemClicked` 给的是 `QTableWidgetItem` 对象，如果你更关心点击的具体行列坐标（通常配合作图或网格定位），监听 `cellClicked` 信号更直接。
  ```python
  table.cellClicked.connect(lambda row, col: print(f"点击了第{row}行，第{col}列"))
  ```

- **`setAlternatingRowColors(enable: bool)`**
  **中文**：表格隔行变色，防视觉疲劳。
  ```python
  table.setAlternatingRowColors(True)
  ```

### QTreeWidget 补充细节
- **`header().setStretchLastSection(stretch: bool)`**
  **中文**：设置表头最后一列自动拉伸填满剩余空间。
  ```python
  tree.header().setStretchLastSection(True)
  ```

- **`sortItems(column: int, order: Qt.SortOrder)`**
  **中文**：按特定列的字符对树进行排序。启用前最好先调用 `setSortingEnabled(True)`。
  ```python
  tree.sortItems(0, Qt.SortOrder.AscendingOrder)
  ```

- **`setAlternatingRowColors(enable: bool)`**
  **中文**：树状结构一样可以隔行变色。
  ```python
  tree.setAlternatingRowColors(True)
  ```

- **`setColumnWidth(column: int, width: int)`**
  **中文**：强制规定树形结构表格各列的宽度。
  ```python
  tree.setColumnWidth(0, 150)
  ```

## 第九部分、 容器类补充遗漏细节（极其常用）

- **`QSplitter(orientation: Qt.Orientation, parent: QWidget = None)`**
  **中文**：可拖动的分割面板。
  **作用**：这是一个极其重要但却被遗漏的容器！它提供了由一条“分割线”隔开的左右（或上下）两个面板。用户可以**按住并拖动中间的分割线**，自由调整两侧面板的宽度。这是开发资源管理器（左侧目录、右侧文件列表）或者布局编辑器的必备组件。
  ```python
  from PySide6.QtWidgets import QSplitter, QTextEdit
  from PySide6.QtCore import Qt

  splitter = QSplitter(Qt.Orientation.Horizontal, self)
  splitter.addWidget(QTextEdit()) # 左面板
  splitter.addWidget(QTextEdit()) # 右面板
  splitter.setSizes([300, 500])   # 初始宽窄比例
  ```

- **`QTableWidget.setCellWidget(row: int, column: int, widget: QWidget)`**
  **中文**：将任意 `QWidget` 控件嵌入到表格的特定单元格中。
  **作用**：让表格的数据显示不再只是死板的文本。你可以在单元格里直接放入一个 **`QPushButton`（操作按钮）**、`QCheckBox`（开关状态）、`QProgressBar`（进度条），甚至是一个 `QComboBox`。
  ```python
  table = QTableWidget(3, 2, self)
  # 在 0行0列 里放进一个按钮
  btn = QPushButton("点击删除")
  table.setCellWidget(0, 0, btn)
  
  # 在 0行1列 里放进一个复选框
  check = QCheckBox()
  table.setCellWidget(0, 1, check)
  ```
---
