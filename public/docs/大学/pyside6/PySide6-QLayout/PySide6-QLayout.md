# PySide6-QLayout

---

## 前言：什么是布局管理器？
*布局管理器是 PySide6 中控制控件排版与尺寸的核心机制。它们**不继承自 QWidget**（不是视觉控件），而是继承自 `QLayout`。布局管理器接管控件的几何计算，让你无需手写 `move()` 和 `resize()`，完美实现界面自适应。*

---

## 一、 基类：QLayout —— 所有布局的抽象基类
**导入**：`from PySide6.QtWidgets import QLayout`
*作为一个抽象类，一般不直接实例化，但它的通用属性贯穿所有后续子布局。*

- **`setContentsMargins(left: int, top: int, right: int, bottom: int)`** / **`contentsMargins()`**
  **中文**：设置/获取布局**整体**与父控件边缘的距离（像素）。
  ```python
  layout.setContentsMargins(20, 20, 20, 20) # 上下左右各留 20px
  margins = layout.contentsMargins()
  ```

- **`getContentsMargins()`**
  **中文**：获取边距，返回一个包含 `(left, top, right, bottom)` 的元组。
  ```python
  l, t, r, b = layout.getContentsMargins()
  ```

- **`spacing()`** / **`setSpacing(spacing: int)`**
  **中文**：设置/获取布局内部**相邻控件**之间的像素间距。
  ```python
  layout.setSpacing(10) # 控件之间相距 10px
  ```

- **`parentWidget()`**
  **中文**：获取此布局所绑定的父 `QWidget` 对象。
  ```python
  widget = layout.parentWidget() # 拿到主窗口句柄
  ```

---

## 二、 直系子类：QBoxLayout —— 盒子布局（线性基类）
**导入**：`from PySide6.QtWidgets import QBoxLayout`
*由于 `QVBoxLayout` 和 `QHBoxLayout` 几乎一模一样，它们共同继承自 `QBoxLayout`，这里收纳了它们共同的核心方法。*

- **`addWidget(widget: QWidget, stretch: int = 0, alignment: Qt.AlignmentFlag = Qt.AlignmentFlag())`**
  **中文**：向布局尾部添加一个控件。
  **参数**：
  - `stretch` – 拉伸因子（整数）。决定了控件占据剩余空间的比例。例如两个控件，拉伸因子分别为 1 和 2，则第二个控件高度/宽度是第一项的 2 倍。
  - `alignment` – 对齐方式（如 `Qt.AlignCenter`、`Qt.AlignRight`）。
  ```python
  v_layout.addWidget(QPushButton("按钮1"), stretch=1, alignment=Qt.AlignCenter)
  ```

- **`insertWidget(index: int, widget: QWidget, stretch: int = 0, alignment: Qt.AlignmentFlag = Qt.AlignmentFlag())`**
  **中文**：在指定的索引位置插入一个控件，而不是追加在末尾。
  ```python
  layout.insertWidget(1, QPushButton("插入中间的按钮"))
  ```

- **`addLayout(layout: QLayout, stretch: int = 0)`** / **`insertLayout(index: int, layout: QLayout, stretch: int = 0)`**
  **中文**：在布局中嵌套另一个子布局，实现复杂的排版结构。
  ```python
  inner_h_layout = QHBoxLayout()
  inner_h_layout.addWidget(QPushButton("内嵌按钮1"))
  outer_v_layout.addLayout(inner_h_layout) # 垂直嵌套水平
  ```

- **`addStretch(stretch: int = 0)`** / **`insertStretch(index: int, stretch: int = 0)`**
  **中文**：添加一个“无形弹簧”。它会自动占据布局中剩余的全部空间，把其他可压缩的控件挤到一边。这是控制布局上下左右对齐最常用的工具。
  ```python
  # 两个按钮紧贴右侧
  layout.addStretch()     # 弹簧会占据左侧所有空间
  layout.addWidget(QPushButton("保存"))
  layout.addWidget(QPushButton("取消"))
  ```

- **`addSpacing(spacing: int)`** / **`insertSpacing(index: int, spacing: int)`**
  **中文**：在控件之间插入**固定像素值**的空白区域。
  ```python
  layout.addSpacing(40) # 强行插入 40px 的空隙
  ```

- **`setStretchFactor(widget: QWidget, stretch: int)`** / **`setStretchFactor(layout: QLayout, stretch: int)`**
  **中文**：在布局已经创建好后，动态修改某个特定控件或子布局的拉伸因子。
  ```python
  layout.setStretchFactor(my_button, 3) # 把拉伸权重动态改为 3
  ```

- **`removeWidget(widget: QWidget)`** / **`removeItem(item: QLayoutItem)`**
  **中文**：从布局中移除指定控件或布局项。注意：移除后控件依然存在，你需要手动调用 `widget.deleteLater()` 彻底销毁它以释放内存。

- **`setDirection(direction: QBoxLayout.Direction)`** / **`direction()`**
  **中文**：动态修改盒子的排列方向（从上到下、从左到右、从右到左、从下到上）。
  **参数**：`QBoxLayout.TopToBottom`（垂直向下）、`QBoxLayout.LeftToRight`（水平向右）、`QBoxLayout.RightToLeft`（水平向左）、`QBoxLayout.BottomToTop`（垂直向上）。
  ```python
  v_layout.setDirection(QBoxLayout.RightToLeft) # 瞬间变成从右向左排
  ```

---

## 三、 QVBoxLayout —— 垂直布局 & QHBoxLayout —— 水平布局
**导入**：`from PySide6.QtWidgets import QVBoxLayout, QHBoxLayout`
*这两个类直接继承自 `QBoxLayout`，除了构造函数不同，所有方法完全继承自上面的 `QBoxLayout`。*

- **`QVBoxLayout(parent: QWidget = None)`** / **`QHBoxLayout(parent: QWidget = None)`**
  **中文**：构造函数
  **参数**：`parent` – 绑定到的父 `QWidget`。也可以在创建后通过 `parent.setLayout(layout)` 绑定。
  ```python
  window = QWidget()
  v_layout = QVBoxLayout(window)    # 绑定父窗口
  v_layout.addWidget(QPushButton("顶部"))
  v_layout.addWidget(QPushButton("底部"))
  window.show()
  ```

---

## 四、 QGridLayout —— 网格布局
**导入**：`from PySide6.QtWidgets import QGridLayout`
*将空间划分为网格（行和列），允许指定控件跨越多个行和列。*

- **`QGridLayout(parent: QWidget = None)`**
  **中文**：构造函数
  ```python
  grid = QGridLayout()
  ```

- **`addWidget(widget: QWidget, row: int, column: int, rowSpan: int = 1, columnSpan: int = 1, alignment: Qt.AlignmentFlag = Qt.AlignmentFlag())`**
  **中文**：放置控件到网格的指定位置。
  **参数**：
  - `row` – 从 0 开始的行号。
  - `column` – 从 0 开始的列号。
  - `rowSpan` – 该控件纵向跨越几行。
  - `columnSpan` – 该控件横向跨越几列（类似 Excel 的合并单元格）。
  ```python
  grid.addWidget(QPushButton("(0,0)"), 0, 0)
  grid.addWidget(QPushButton("跨两行"), 1, 0, 2, 1) # 第1和第2行合并
  ```

- **`addLayout(layout: QLayout, row: int, column: int, rowSpan: int = 1, columnSpan: int = 1, alignment: Qt.AlignmentFlag = Qt.AlignmentFlag())`**
  **中文**：放置一个子布局到网格。

- **`setRowStretch(row: int, stretch: int)`** / **`setColumnStretch(column: int, stretch: int)`**
  **中文**：设置某一行/某一列的拉伸比例。
  **作用**：决定当窗口变大时，多余的空间如何分配给不同的行和列。
  ```python
  grid.setRowStretch(0, 1) # 第0行占 1 份高度
  grid.setRowStretch(1, 2) # 第1行占 2 份高度（所以它比第一行高）
  ```

- **`setRowMinimumHeight(row: int, min_size: int)`** / **`setColumnMinimumWidth(column: int, min_size: int)`**
  **中文**：强制指定某行的最低高度或某列的最低宽度，防止在窗口极度缩小时控件被压扁。
  ```python
  grid.setColumnMinimumWidth(0, 150) # 第0列永远不能小于 150px
  ```

---

## 五、 QFormLayout —— 表单布局
**导入**：`from PySide6.QtWidgets import QFormLayout`
*专门为“标签 + 输入框”这种两列排版设计的布局，自动左对齐标签、右对齐输入框。*

- **`QFormLayout(parent: QWidget = None)`**
  **中文**：构造函数
  ```python
  form = QFormLayout()
  ```

- **`addRow(label: QWidget / str, field: QWidget)`**
  **中文**：添加一行。`label` 可以是 `QLabel` 对象、字符串；`field` 是输入控件。
  ```python
  form.addRow("用户名：", QLineEdit())
  form.addRow("密 码：", QLineEdit())
  ```

- **`insertRow(row: int, label: QWidget / str, field: QWidget)`**
  **中文**：在指定行号前插入新的一行。

- **`removeRow(row: int)`** / **`removeRow(widget: QWidget)`**
  **中文**：通过行号或具体的控件对象删除某一行。

- **`setLabelAlignment(alignment: Qt.AlignmentFlag)`**
  **中文**：设置左侧标签列的对齐方式。
  **作用**：通常我们会将标签设为 `Qt.AlignRight`（右对齐），让“用户名：”紧贴输入框，看起来更专业。
  ```python
  form.setLabelAlignment(Qt.AlignmentFlag.AlignRight)
  ```

- **`setFormAlignment(alignment: Qt.AlignmentFlag)`**
  **中文**：设置整个表单在父窗口中的位置（如 `Qt.AlignCenter` 居中）。
  ```python
  form.setFormAlignment(Qt.AlignCenter | Qt.AlignVCenter)
  ```

- **`setHorizontalSpacing(spacing: int)`** / **`setVerticalSpacing(spacing: int)`**
  **中文**：单独设置标签与输入框之间的水平间距，以及不同行之间的垂直间距。

---

## 六、 QSizePolicy —— 控件尺寸策略（布局对控件的约束契约）
**导入**：`from PySide6.QtWidgets import QSizePolicy`
*布局之所以能拉伸或压缩一个控件，是因为控件自身带有 `QSizePolicy`。如果某个按钮死活拉伸不了，一定是它的策略没设对。*

- **`QSizePolicy(horizontal: QSizePolicy.Policy, vertical: QSizePolicy.Policy)`**
  **中文**：构造尺寸策略对象。
  **参数**（水平/垂直策略）：
  - `QSizePolicy.Fixed`：**固定尺寸**。永远不能变大或变小，强制保持 `sizeHint()` 返回的大小。
  - `QSizePolicy.Minimum`：**最小尺寸**。可以变大，但不能缩小。
  - `QSizePolicy.Maximum`：**最大尺寸**。可以缩小，但不能变大。
  - `QSizePolicy.Preferred`：**偏好尺寸**（默认）。既可以变大也可以缩小，但最佳大小是 `sizeHint()`。
  - `QSizePolicy.Expanding`：**膨胀尺寸**。它会拼命占满所有剩余空间（如 `QLineEdit`、`QTextEdit`）。
  - `QSizePolicy.MinimumExpanding`：最小膨胀，极少使用。
  - `QSizePolicy.Ignored`：无视控件自身定义的尺寸提示。

**用法示例：**
```python
btn = QPushButton("固定按钮")
# 构造一个水平/垂直都固定的策略
sp = QSizePolicy(QSizePolicy.Policy.Fixed, QSizePolicy.Policy.Fixed)
btn.setSizePolicy(sp)
```

- **`setHorizontalPolicy(policy: QSizePolicy.Policy)`** / **`setVerticalPolicy(policy: QSizePolicy.Policy)`**
  **中文**：分别单独修改水平或垂直方向的控制策略。
  ```python
  btn.setSizePolicy(QSizePolicy.Expanding, QSizePolicy.Fixed) # 水平一直拉宽，高度固定
  ```

- **`setHorizontalStretch(stretch: int)`** / **`setVerticalStretch(stretch: int)`**
  **中文**：直接指定该控件的拉伸权重。相当于给控件自身定了一个固定的伸缩比重。
  ```python
  btn.setSizePolicy(QSizePolicy.Expanding, QSizePolicy.Expanding)
  btn.setHorizontalStretch(2) # 拉伸时该控件占据 2 份宽度
  ```

- **`setRetainSizeWhenHidden(hidden: bool)`** / **`retainSizeWhenHidden()`**
  **中文**：设置当控件被隐藏（`hide()`）时，是否还在布局中**占据原来的空间位置**。
  **作用**：默认隐藏后会折叠空间。设为 `True` 可以避免视觉上的跳变。
  ```python
  sp = btn.sizePolicy()
  sp.setRetainSizeWhenHidden(True) # 即使隐藏，也留下空白位置
  btn.setSizePolicy(sp)
  ```

---

## 七、 高阶实战：嵌套布局范例（商业软件标配）
*90% 的界面的终极形态，都是垂直布局包裹水平布局，再包裹网格。*

```python
from PySide6.QtWidgets import QWidget, QVBoxLayout, QHBoxLayout, QPushButton, QTextEdit, QGridLayout

class MyWindow(QWidget):
    def __init__(self):
        super().__init__()
        
        # 1. 主容器：垂直布局
        main_layout = QVBoxLayout(self)
        
        # 2. 顶部工具栏：水平布局
        top_layout = QHBoxLayout()
        top_layout.addWidget(QPushButton("新建"))
        top_layout.addWidget(QPushButton("保存"))
        top_layout.addStretch()          # 弹簧把前面按钮挤到左边
        top_layout.addWidget(QPushButton("关于"))
        main_layout.addLayout(top_layout) # 嵌入主容器
        
        # 3. 中间功能区：网格布局
        grid = QGridLayout()
        grid.addWidget(QPushButton("功能A"), 0, 0)
        grid.addWidget(QPushButton("功能B"), 0, 1)
        grid.addWidget(QTextEdit(), 1, 0, 1, 2) # 一个文本框占满下方两列
        main_layout.addLayout(grid)
        
        # 4. 底部状态栏：水平布局
        bottom_layout = QHBoxLayout()
        bottom_layout.addStretch()
        bottom_layout.addWidget(QPushButton("退出"))
        main_layout.addLayout(bottom_layout)
```

---

## 八、 布局类补充遗漏细节

- **`setSizeConstraint(constraint: QLayout.SizeConstraint)`**
  **中文**：设置布局对所在容器尺寸的约束策略。
  **作用**：这是控制弹窗尺寸的超级利器。默认布局只是把控件塞进去。
  **参数**：
  - `QLayout.SizeConstraint.SetFixedSize`：**极常用**。布局会**自动计算包裹内部所有子控件所需的最小尺寸**，并强制把父 `QWidget` 锁定在这个最小尺寸上。
  ```python
  layout.setSizeConstraint(QLayout.SizeConstraint.SetFixedSize) 
  # 效果：这个容器的窗口会刚好紧紧包裹住内部的按钮和文本框，没有多余留白
  ```
---

