# PySide6-QWidget-Inputs

---

## 第一部分：QLineEdit —— 单行输入框
**导入**：`from PySide6.QtWidgets import QLineEdit`
*`QLineEdit` 是用户在界面中输入单行纯文本（如用户名、密码、搜索词）的最常用控件。*

- **`QLineEdit(parent: QWidget = None)`**
- **`QLineEdit(text: str, parent: QWidget = None)`**
  **中文**：构造函数
  **参数**：`text` – 初始默认内容；`parent` – 父控件。
  ```python
  line_edit = QLineEdit("默认内容", self)
  ```

- **`setText(text: str)`** / **`text()`**
  **中文**：设置/获取输入框中的文字。
  ```python
  line_edit.setText("修改后的内容")
  print(line_edit.text())
  ```

- **`setPlaceholderText(text: str)`** / **`placeholderText()`**
  **中文**：设置/获取占位符提示文字
  **作用**：当输入框为空时显示的一行浅灰色文字（提示用户该输入什么），用户一旦开始输入，提示文字自动消失。
  ```python
  line_edit.setPlaceholderText("请输入您的账号...")
  ```

- **`setEchoMode(mode: QLineEdit.EchoMode)`**
  **中文**：设置回显模式（输入内容的显示方式）
  **参数**：
  - `QLineEdit.EchoMode.Normal`：正常显示输入内容（默认）。
  - `QLineEdit.EchoMode.NoEcho`：不显示任何内容（完全空白，用于极高敏感信息）。
  - `QLineEdit.EchoMode.Password`：密码模式，输入内容显示为黑点或星号（*）。
  - `QLineEdit.EchoMode.PasswordEchoOnEdit`：编辑时短暂显示真实字符，光标离开或焦点转移后变回黑点。
  ```python
  pwd_edit.setEchoMode(QLineEdit.EchoMode.Password)
  ```

- **`setMaxLength(length: int)`** / **`maxLength()`**
  **中文**：设置/获取允许输入的最大字符长度。
  ```python
  line_edit.setMaxLength(20) # 最多输入 20 个字符
  ```

- **`setReadOnly(readOnly: bool)`** / **`isReadOnly()`**
  **中文**：设置/获取是否只读。
  **作用**：设为 `True` 后，输入框呈现灰色背景，用户只能复制其中的文本，无法修改。常用于显示系统路径或不可变更的数据。
  ```python
  line_edit.setReadOnly(True)
  ```

- **`setEnabled(enabled: bool)`** / **`isEnabled()`**
  **中文**：设置/获取是否可用。设为 `False` 时，不仅不可编辑，文本也会整体变灰，且无法选中。
  ```python
  line_edit.setEnabled(False)
  ```

- **`setInputMask(inputMask: str)`**
  **中文**：设置输入掩码（强制格式化输入）
  **作用**：强制用户按特定格式输入，不符合格式的字符会被直接拒绝。常用于输入日期、电话、IP 地址等固定格式。
  **常用掩码字符：**
  - `9`：只能输入数字，但不能为空。
  - `0`：只能输入数字，且必须填满。
  - `A`：只能输入字母数字（A-Z, a-z, 0-9）。
  - `_`：下划线，表示任意一个字符（填空位）。
  ```python
  # 让用户强制输入带区号的手机号，中间必须填满 10 位数字，括号会自动生成
  line_edit.setInputMask("(999) 0000-0000;_")
  ```

- **`setValidator(validator: QValidator)`** / **`validator()`**
  **中文**：设置输入验证器（校验最终内容的合法性）
  **作用**：与 `setInputMask` 不同，掩码限制输入过程，验证器允许用户输入任何值，但在输入框失去焦点或提交时判断内容是否合法（如判断是否为合法的邮箱格式或最小值）。
  ```python
  from PySide6.QtGui import QIntValidator
  
  line_edit.setValidator(QIntValidator(0, 100)) # 验证输入的数字必须在 0 到 100 之间
  ```

- **`setAlignment(alignment: Qt.AlignmentFlag)`**
  **中文**：设置文本的对齐方式。
  ```python
  line_edit.setAlignment(Qt.AlignmentFlag.AlignCenter) # 文字居中
  ```

- **`selectAll()`**
  **中文**：全选当前输入框内的所有文本。
  ```python
  line_edit.selectAll() # 方便用户一键替换内容
  ```

- **`setCursorPosition(pos: int)`** / **`cursorPosition()`**
  **中文**：设置/获取光标在文本中的位置（按字符索引）。
  ```python
  line_edit.setCursorPosition(0) # 让光标回到最前面
  ```

### 🟢 QLineEdit 的核心信号
- **`textChanged(text: str)`**：输入框内的**任何内容变化**（包括用户每按下一个键或者用代码 `setText` 修改）都会发射此信号。
- **`textEdited(text: str)`**：仅在**用户手动交互**时发射，用代码 `setText` 修改内容**不会触发**此信号。
- **`returnPressed()`**：用户在输入框中按下**回车键**时发射。
- **`editingFinished()`**：用户结束编辑（通常指失去焦点或按下回车键）时发射，用来做最终的内容验证或数据保存。
  ```python
  line_edit.returnPressed.connect(lambda: print(f"最终输入: {line_edit.text()}"))
  ```

---

## 第二部分：QTextEdit —— 多行富文本编辑器
**导入**：`from PySide6.QtWidgets import QTextEdit`
*`QTextEdit` 不仅能输入多行文本，还能原生支持 HTML 富文本（加粗、变色、插入图片），是强大的文本录入和日志显示组件。*

- **`QTextEdit(parent: QWidget = None)`**
  ```python
  text_edit = QTextEdit(self)
  ```

- **`setPlainText(text: str)`** / **`toPlainText()`**
  **中文**：设置/获取**纯文本**内容。设置时会清除原有所有富文本格式。
  ```python
  text_edit.setPlainText("这是一行纯文本\n这是第二行")
  print(text_edit.toPlainText())
  ```

- **`setHtml(html: str)`** / **`toHtml()`**
  **中文**：设置/获取 HTML 富文本内容。
  ```python
  text_edit.setHtml("<h1>大标题</h1><p>这是<b>加粗</b>的正文</p>")
  ```

- **`append(text: str)`**
  **中文**：在末尾追加一行纯文本。`append` 自带换行效果，每次调用都会在新的一行写入。
  ```python
  text_edit.append("这是追加的第一行")
  text_edit.append("这是追加的第二行")
  ```

- **`setReadOnly(readOnly: bool)`**
  **中文**：设置为只读。设为 `True` 后，用户无法修改内容，非常适合用来显示运行日志。
  ```python
  text_edit.setReadOnly(True)
  ```

- **`setAcceptDrops(accept: bool)`**
  **中文**：设置是否接受外部拖入的文件
  **作用**：设 `True` 后，用户可以直接把电脑里的 `.txt` 等文件拖拽进文本编辑器，Qt 原生支持获取文件路径并打开。
  ```python
  text_edit.setAcceptDrops(True)
  ```

- **`insertPlainText(text: str)`** / **`insertHtml(html: str)`**
  **中文**：在当前光标位置插入纯文本/HTML，而不是替换全部内容。

- **`toPlainText()`** / **`toHtml()`**
  **中文**：获取当前全部内容。

### 🟢 QTextEdit 的核心信号
- **`textChanged()`**：文本内容发生任何变化时触发。
- **`cursorPositionChanged()`**：光标位置发生移动时触发。
  ```python
  text_edit.textChanged.connect(lambda: print("内容发生变化"))
  ```

---

## 第三部分：QSpinBox —— 整数调节框
**导入**：`from PySide6.QtWidgets import QSpinBox`
*专门用于输入和调节整数值的微调框，附带上下箭头，防止用户输入非法字符。*

- **`QSpinBox(parent: QWidget = None)`**
  ```python
  spin_box = QSpinBox(self)
  ```

- **`setRange(minimum: int, maximum: int)`** / **`range()`**
  **中文**：设置/获取数值的最小值和最大值。
  ```python
  spin_box.setRange(0, 100)
  ```

- **`setValue(value: int)`** / **`value()`**
  **中文**：设置/获取当前数值。
  ```python
  spin_box.setValue(25)
  print(spin_box.value())
  ```

- **`setSingleStep(val: int)`** / **`singleStep()`**
  **中文**：设置/获取每点击一次上下箭头所增减的步进值。
  ```python
  spin_box.setSingleStep(5) # 点击一下变为 5、10、15...
  ```

- **`setPrefix(prefix: str)`** / **`setSuffix(suffix: str)`**
  **中文**：在数值的前面或后面添加固定前缀/后缀字符串（如单位、符号）。
  ```python
  spin_box.setPrefix("￥")       # 显示 ￥25
  spin_box.setSuffix(" 元")      # 显示 ￥25 元
  ```

- **`setSpecialValueText(text: str)`**
  **中文**：设置特殊值时的显示文本
  **作用**：当数值达到 `setRange` 设定的最小值时，**不显示数字，而是显示指定的文字**。常用于下拉框的“请选择”状态。
  ```python
  spin_box.setRange(0, 10)
  spin_box.setSpecialValueText("无限制") # 当值为 0 时，显示“无限制”
  ```

- **`setWrapping(wrap: bool)`**
  **中文**：设置循环（轮回）模式
  **作用**：设为 `True`，当数值达到最大值时，再点击上箭头会跳回最小值；反之亦然。
  ```python
  spin_box.setWrapping(True)
  ```

- **`setButtonSymbols(symbols: QAbstractSpinBox.ButtonSymbols)`**
  **中文**：设置上下箭头按钮的显示符号
  **参数**：`QAbstractSpinBox.UpDownArrows`（标准上下箭头）或 `QAbstractSpinBox.PlusMinus`（加减号 + 和 -）。
  ```python
  spin_box.setButtonSymbols(QAbstractSpinBox.ButtonSymbols.PlusMinus)
  ```

### 🟢 QSpinBox 的核心信号
- **`valueChanged(value: int)`**：数值发生改变时发射。
- **`textChanged(text: str)`**：显示的文本发生变化时发射。

---

## 第四部分：QDoubleSpinBox —— 浮点数调节框
**导入**：`from PySide6.QtWidgets import QDoubleSpinBox`
*与 `QSpinBox` 几乎完全一致，但专用于浮点数输入。*

- **`QDoubleSpinBox(parent: QWidget = None)`**
  ```python
  double_spin = QDoubleSpinBox(self)
  ```

- **`setDecimals(prec: int)`**
  **中文**：设置保留的小数点位数。
  **作用**：默认保留 2 位，且向上会按 `0.00`、`0.01` 的步进。
  ```python
  double_spin.setDecimals(3) # 保留 3 位小数
  ```

- **`setSingleStep(val: float)`**
  **中文**：设置每次点击的浮动步进。
  ```python
  double_spin.setSingleStep(0.1) # 每点一下增加 0.1
  ```

- **`setRange(minimum: float, maximum: float)`** / **`setValue(value: float)`** / **`value()`**
  **作用**：与整数框类似，支持浮点数设置。
  ```python
  double_spin.setRange(0.0, 100.0)
  double_spin.setValue(3.14)
  print(double_spin.value())
  ```

- **`setPrefix(prefix: str)`** / **`setSuffix(suffix: str)`**
  **中文**：同样支持前缀和后缀（如“%”或“mm”）。
  ```python
  double_spin.setSuffix("%")
  ```

### 🟢 QDoubleSpinBox 的核心信号
- **`valueChanged(value: float)`**：浮点数值改变时发射。

---

## 第五部分：QSlider —— 滑动条
**导入**：`from PySide6.QtWidgets import QSlider`; `from PySide6.QtCore import Qt`
*`QSlider` 通过水平和垂直拖动滑块，提供直观的数值调节体验，常用于音量控制、进度拖动等。*

- **`QSlider(orientation: Qt.Orientation, parent: QWidget = None)`**
  **参数**：`Qt.Orientation.Horizontal`（水平）或 `Qt.Orientation.Vertical`（垂直）。
  ```python
  slider = QSlider(Qt.Orientation.Horizontal, self)
  ```

- **`setRange(min: int, max: int)`** / **`setValue(value: int)`** / **`value()`**
  **中文**：设置滑块的数值范围和当前值。
  ```python
  slider.setRange(0, 100)
  slider.setValue(50)
  ```

- **`setPageStep(val: int)`** / **`setSingleStep(val: int)`**
  **中文**：设置鼠标点击滑块空白区域/键盘左右键（PageUp/PageDown）时的步进，以及键盘单次箭头键的步进。默认 `singleStep=1`, `pageStep=10`。
  ```python
  slider.setPageStep(10)
  slider.setSingleStep(1)
  ```

- **`setTickPosition(position: QSlider.TickPosition)`**
  **中文**：设置刻度线的位置（在滑块上方/下方/两侧）。
  **参数**：
  - `QSlider.NoTicks`：不显示刻度（默认）。
  - `QSlider.TicksAbove`：刻度在水平滑块上方。
  - `QSlider.TicksBelow`：刻度在水平滑块下方。
  - `QSlider.TicksLeft` / `TicksRight`：对应垂直滑块。
  - `QSlider.TicksBothSides`：两侧都有。
  ```python
  slider.setTickPosition(QSlider.TickPosition.TicksBelow)
  slider.setTickInterval(10) # 每隔 10 显示一根刻度
  ```

- **`setOrientation(orientation: Qt.Orientation)`**
  **中文**：动态修改滑块的横竖方向。
  ```python
  slider.setOrientation(Qt.Orientation.Vertical) # 变成垂直
  ```

- **`sliderPosition()`** 与 **`value()`**
  **中文**：`value()` 返回逻辑设定值。`sliderPosition()` 返回滑块实际指示的位置。在大多数情况下它们相同，除非你重写了滑块交互逻辑。

### 🟢 QSlider 的核心信号
- **`valueChanged(value: int)`**：滑动条的值发生改变时发射（持续拖拽过程中会不断触发）。
- **`sliderPressed()`**：滑块被鼠标按下时触发。
- **`sliderReleased()`**：鼠标松开滑块时触发（适合做确定生效的操作，避免过程中频繁引起后台重计算）。
- **`sliderMoved(position: int)`**：滑块被拖动时触发，传递当前物理位置。
  ```python
  slider.valueChanged.connect(lambda v: print(f"当前值：{v}"))
  ```

---

## 第六部分：QDial —— 旋钮式拨号盘
**导入**：`from PySide6.QtWidgets import QDial`
*`QDial` 是一个旋钮形式的值调节器，风格复古，特别适合用于音量、阻尼等旋钮调节。*

- **`QDial(parent: QWidget = None)`**
  ```python
  dial = QDial(self)
  ```

- **`setRange(min: int, max: int)`** / **`setValue(value: int)`** / **`value()`**
  **中文**：与滑块基本一致。
  ```python
  dial.setRange(0, 100)
  dial.setValue(50)
  ```

- **`setWrapping(wrap: bool)`**
  **中文**：设置是否允许循环（旋钮转了一圈可以继续转）。
  ```python
  dial.setWrapping(True) # 开启循环
  ```

- **`setNotchesVisible(visible: bool)`**
  **中文**：设置是否显示刻度点（类似家电旋钮上的小圆点）。
  ```python
  dial.setNotchesVisible(True)
  ```

- **`setNotchTarget(target: float)`**
  **中文**：设置每多少个单位出现一个刻度点。如果不设置，刻度会自动智能分布。
  ```python
  dial.setNotchTarget(10) # 每 10 单位一个刻度
  ```

### 🟢 QDial 的核心信号
- **`valueChanged(value: int)`**：旋钮数值发生旋转改变时触发。
- **`sliderMoved(value: int)`**：旋转旋钮时持续触发。

---

## 第七部分：QProgressBar —— 进度条
**导入**：`from PySide6.QtWidgets import QProgressBar`
*`QProgressBar` 用于向用户直观展示耗时任务的完成进度。*

- **`QProgressBar(parent: QWidget = None)`**
  ```python
  progress = QProgressBar(self)
  ```

- **`setRange(minimum: int, maximum: int)`** / **`setValue(value: int)`** / **`value()`**
  **中文**：设置进度条的最小值、最大值和当前值。默认范围是 `0-100`。
  ```python
  progress.setRange(0, 100)
  progress.setValue(70) # 显示 70%
  ```

- **`reset()`**
  **中文**：重置进度条，将值重置为最小值，并隐藏进度文本（如果开启了 `setTextVisible`）。
  ```python
  progress.reset()
  ```

- **`setTextVisible(visible: bool)`**
  **中文**：设置是否在进度条上方显示文本（如 `50%`）。默认为 `True`。
  ```python
  progress.setTextVisible(False) # 隐藏百分比文字
  ```

- **`setFormat(format: str)`**
  **中文**：设置进度条上显示的文本格式
  **参数**：支持占位符 `%p`（百分比）、`%v`（当前值）、`%m`（最大值）、`%b`（极值范围，仅在某些情况下）。
  **作用**：允许自定义显示内容，如 `当前进度: 70%`。
  ```python
  progress.setFormat("已下载: %p%") # 显示“已下载: 70%”
  ```

- **`setInvertedAppearance(invert: bool)`**
  **中文**：设置进度条是否反向显示。设为 `True` 后进度从左向右变为从右向左填充（对于水平进度条）。
  ```python
  progress.setInvertedAppearance(True)
  ```

- **`setOrientation(orientation: Qt.Orientation)`**
  **中文**：设置进度条为水平或垂直显示。
  ```python
  progress.setOrientation(Qt.Orientation.Vertical)
  ```

- **`isIndeterminate()`** 与 **`setRange(0, 0)`**（或者直接让进度保持 0）
  **中文**：不确定进度状态
  **作用**：如果网络延迟或任务无法精确估算进度，将进度条设置为 `最小值=0, 最大值=0`，进度条会呈现出**不断向右流动/滚动的波浪动画**，表示“正在处理中，没有具体进度”。
  ```python
  progress.setRange(0, 0) # 自动变成“正在加载...”的流动动画
  ```

### 🟢 QProgressBar 的核心信号
- **`valueChanged(value: int)`**：进度条数值更新时触发。

---

## 第八部分：QScrollBar —— 滚动条控件
**导入**：`from PySide6.QtWidgets import QScrollBar`
*通常自动内置于文本框或列表的侧边，不需要手动创建，但如果你要自己画一个自定义滚动条，`QScrollBar` 的作用与 `QSlider` 极其类似。*

- **`QScrollBar(orientation: Qt.Orientation, parent: QWidget = None)`**
  **作用**：构造一个单独的滚动条。
  ```python
  scroll = QScrollBar(Qt.Orientation.Horizontal)
  ```

- **`setRange(min: int, max: int)`** / **`setValue(value: int)`** / **`value()`** / **`setPageStep(val: int)`** / **`setSingleStep(val: int)`**
  **中文**：属性与 `QSlider` 完全一样，但通常 `pageStep` 固定值为 `max / 10` 左右，`singleStep` 为 1。
  ```python
  scroll.setRange(0, 1000)
  scroll.setValue(200)
  ```

- **`setTracking(enable: bool)`**
  **中文**：设置是否跟踪释放。
  **作用**：与 `QSlider` 不同，`QScrollBar` 默认 `setTracking(True)`。如果设为 `False`，只有在用户**松开鼠标后**才会触发 `valueChanged` 信号，避免滑动过程中大量刷新数据。

### 🟢 QScrollBar 的核心信号
- **`valueChanged(value: int)`**：数值变动时触发。
- **`sliderMoved(position: int)`**：滑块位置变动时持续触发。

---

## 第九部分、 每个输入类的高阶隐藏细节补充

### QLineEdit 补充细节
- **`setClearButtonEnabled(enable: bool)`** / **`isClearButtonEnabled()`**
  **中文**：设置/获取是否显示一键清空按钮
  **作用**：设为 `True` 后，只要输入框里有内容，右侧就会出现一个“×”的小按钮。点击它，可以直接清空输入框的所有文本。这是提升现代 UI 操作体验的极佳细节。
  ```python
  line_edit.setClearButtonEnabled(True) # 用户鼠标悬停时会自动出现清空按钮
  ```

- **`hasAcceptableInput()`**
  **中文**：判断当前输入是否通过验证器
  **作用**：如果你给输入框绑定了 `setValidator`，可以通过此方法实时判断输入框当前的文本是否符合验证规则。常用于表单提交前动态禁用“确定”按钮。
  ```python
  line_edit.setText("12a")
  if line_edit.hasAcceptableInput():
      print("符合规则") # 输出：False
  ```

- **`textMargins()`** / **`setTextMargins(left, top, right, bottom)`**
  **中文**：设置文本内部边距
  **作用**：控制输入框内部的文字距离边框的像素距离。常用于需要自定义输入框高度、让文字靠下或留出更多内部空白的设计场景。
  ```python
  line_edit.setTextMargins(10, 5, 10, 5)
  ```

### QTextEdit 补充细节
- **`setTabStopDistance(distance: int)`** / **`tabStopDistance()`**
  **中文**：设置 Tab 键的缩进宽度
  **作用**：默认按下 Tab 键会输入一个制表符。如果你在写代码编辑器，设置此值可以让缩进呈现出特定数量的像素宽度（效果等同于 4 个空格），体验更好。
  ```python
  text_edit.setTabStopDistance(20)  # 设置缩进距离为 20 像素
  ```

- **`setPlaceholderText(text: str)`** / **`placeholderText()`**
  **中文**：设置多行文本框的占位符
  **作用**：注意，`QTextEdit` 从父类 `QAbstractScrollArea` 继承了占位符功能。与单行输入框一样，可以在文本为空时显示浅灰色的提示。
  ```python
  text_edit.setPlaceholderText("请在此处输入详细的内容描述...")
  ```

- **`ensureCursorVisible()`**
  **中文**：确保光标可见
  **作用**：如果你用代码往文本框里追加了很长的内容，或者改变了光标的位置，调用此方法可以强制将视图滚动到光标所在位置。非常适合做“自动滚屏日志”功能。
  ```python
  text_edit.append("新增的日志行...")
  text_edit.ensureCursorVisible() # 视图自动滚动到底部
  ```

### QSpinBox / QDoubleSpinBox 补充细节
- **`setAccelerated(enable: bool)`**
  **中文**：开启鼠标滚轮加速
  **作用**：默认在数字框上滚动鼠标滚轮，数值只会极其缓慢地变化。开启此属性后，长按滚轮，数字的变化速度会呈指数级加速，极大提升用户大范围调节数值时的体验。
  ```python
  spin_box.setAccelerated(True) # 滚轮滚动越快，数值变化越快
  ```

- **`setCorrectionMode(mode: QAbstractSpinBox.CorrectionMode)`**
  **中文**：设置输入非法数值时的修正策略
  **参数**：
  - `QAbstractSpinBox.CorrectionMode.CorrectToPreviousValue`：恢复到修改前的合法值（默认）。
  - `QAbstractSpinBox.CorrectionMode.CorrectToNearestValue`：修正到最接近的合法值。例如输入 `150`（范围 0-100），自动变成 `100`。
  ```python
  spin_box.setRange(0, 100)
  spin_box.setCorrectionMode(QAbstractSpinBox.CorrectionMode.CorrectToNearestValue)
  ```

### QSlider / QDial 补充细节
- **`setInvertedAppearance(invert: bool)`** (QSlider)
  **中文**：反转外观显示
  **作用**：水平滑动条默认左边是最小值，右边是最大值。设为 `True` 后，左边变成最大值，右边变成最小值。`QDial` 也同样支持此属性。
  ```python
  slider.setInvertedAppearance(True) # 最左边为最大，最右边为最小
  ```

- **`setInvertedControls(invert: bool)`**
  **中文**：反转键盘控制方向
  **作用**：默认情况下，按键盘的“上箭头”或“右箭头”会使值变大。设为 `True` 后，这些按键会让值变小，这与某些游戏或调节器的习惯相符。
  ```python
  slider.setInvertedControls(True) # 按右箭头数值变小
  ```

- **`QPlainTextEdit(parent: QWidget = None)`**
  **中文**：高性能纯文本编辑器。
  **作用**：与 `QTextEdit` 不同，它**不支持**富文本（HTML、图片嵌入），但它专门针对纯文本处理进行了极致优化。如果你要打开并显示一个**100 MB 以上的超大日志文件**，必须用 `QPlainTextEdit`，绝不会卡死。
  ```python
  from PySide6.QtWidgets import QPlainTextEdit
  plain_edit = QPlainTextEdit(self)
  plain_edit.setPlainText("这是极高性能的多行文本...")
  ```

- **`QLineEdit.addAction(action: QAction, position: QLineEdit.ActionPosition)`**
  **中文**：在输入框内部添加操作图标（左侧或右侧）。
  **作用**：非常实用的现代 UI 细节。例如在搜索框内加一个放大镜图标，或者在密码框里加一个“显示/隐藏密码”的小眼睛图标。图标本身可以响应点击（通过 `QAction` 的 `triggered` 信号）。
  ```python
  from PySide6.QtWidgets import QLineEdit
  from PySide6.QtGui import QAction, QIcon

  line = QLineEdit()
  eye_action = QAction(QIcon("eye.png"), "显示密码", line)
  eye_action.setCheckable(True)
  eye_action.triggered.connect(lambda checked: line.setEchoMode(QLineEdit.Normal if checked else QLineEdit.Password))
  line.addAction(eye_action, QLineEdit.ActionPosition.TrailingPosition) # 加在右侧
  ```

- **`QSpinBox.setGroupSeparatorShown(show: bool)`**
  **中文**：设置/获取是否显示千位分隔符。
  **作用**：设 `True` 后，超过千位的数字会显示分隔逗号（如 `1,000,000`），极大提升财务、数据统计界面的可读性。
  ```python
  spin.setGroupSeparatorShown(True)
  ```
---

