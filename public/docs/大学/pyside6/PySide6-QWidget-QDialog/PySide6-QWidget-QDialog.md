# PySide6-QWidget-QDialog

---

## QDialog —— 对话框基类（弹出窗口的核心）
**导入**：`from PySide6.QtWidgets import QDialog`
*`QDialog` 是所有弹出窗口（如消息提示、文件选择、设置面板）的基础。它最大的特点是**模态（Modal）**阻塞功能：调用 `exec()` 后，父窗口会被冻结，直到用户操作完对话框并关闭它。*

---

### 一、 QDialog 对象的构造与基础属性

- **`QDialog(parent: QWidget = None, flags: Qt.WindowFlags = Qt.WindowFlags())`**
  **中文**：构造函数
  **参数**：
  - `parent` – 父窗口对象。拥有父窗口的对话框，默认会居中显示在父窗口上方。
  - `flags` – 窗口标志，通常会默认带上 `Qt.Dialog` 标志。
  ```python
  from PySide6.QtWidgets import QDialog, QPushButton, QVBoxLayout

  class MyDialog(QDialog):
      def __init__(self, parent=None):
          super().__init__(parent)
          self.setWindowTitle("设置")
          self.resize(300, 200)
          
          layout = QVBoxLayout(self)
          btn = QPushButton("确定", self)
          layout.addWidget(btn)
          btn.clicked.connect(self.accept) # 点击按钮，返回 Accepted
  ```

- **`setModal(modal: bool)`**
  **中文**：设置是否模态
  **参数**：`True`（阻塞父窗口）或 `False`（非阻塞）。
  **作用**：控制对话框打开时，是否阻止用户操作其后面的父窗口。调用 `exec()` 时，`setModal(True)` 会自动生效。
  ```python
  dlg = MyDialog()
  dlg.setModal(True)  # 开启模态
  dlg.show()          # 模态显示
  ```

---

### 二、 对话框的生命周期与返回值（核心机制）

- **`exec()`**
  **中文**：模态执行
  **参数**：无。
  **返回**：整数值。通常返回 `QDialog.Accepted`（对应代码 1）或 `QDialog.Rejected`（对应代码 0）。
  **作用**：**模态阻塞执行**。当调用此方法时，程序会在这一行暂停，直到用户调用了 `accept()`、`reject()` 或 `done(result)` 关闭对话框后，才会继续向下执行。这是判断用户点了“确定”还是“取消”的最常用方法。
  ```python
  dlg = MyDialog()
  # 程序在此处暂停，等待对话框关闭
  if dlg.exec() == QDialog.Accepted:
      print("用户点了确定！")
  else:
      print("用户点了取消或直接关闭了窗口！")
  ```

- **`show()`**
  **中文**：非模态显示
  **作用**：**非阻塞显示**。对话框弹出后，程序会继续向下执行（父窗口仍然可操作）。如果想在函数内弹窗而不卡住界面，使用 `show()`，配合信号 `accepted` 或 `rejected` 来处理用户操作。
  ```python
  dlg = MyDialog()
  dlg.accepted.connect(lambda: print("用户点了确定（非模态方式）"))
  dlg.show() # 不阻塞代码
  ```

- **`accept()`**
  **中文**：确定关闭
  **作用**：设置返回值为 `QDialog.Accepted`（1），并立即关闭对话框。通常绑定在“确定”按钮上。

- **`reject()`**
  **中文**：取消关闭
  **作用**：设置返回值为 `QDialog.Rejected`（0），并立即关闭对话框。通常绑定在“取消”按钮上。点击窗口右上角 `X` 也会默认触发 `reject()`。

- **`done(result: int)`**
  **中文**：指定状态码关闭
  **作用**：用自定义的整数关闭对话框。例如 `self.done(100)`，后续用 `if dlg.exec() == 100` 判断。
  ```python
  def on_save(self):
      self.done(99) # 自定义返回码 99
  ```

- **`open()`**
  **中文**：非模态打开
  **作用**：与 `show()` 类似，不阻塞。但它在底层处理上更适合非模态对话框的事件循环。
  ```python
  dlg.open()
  ```

- **`finished(result: int)`**、**`accepted()`**、**`rejected()`**
  **中文**：QDialog 的核心信号。
  - `finished`: 对话框无论以何种方式关闭时，都会发射此信号，传递关闭时的结果码。
  - `accepted`: 仅当用户调用 `accept()` 时触发。
  - `rejected`: 仅当用户调用 `reject()` 或点击窗口 `X` 按钮时触发。
  ```python
  dlg.finished.connect(lambda r: print(f"对话框关闭，返回码: {r}"))
  ```

---

### 三、 `QDialogButtonBox` —— 标准对话框按钮盒
*在实际开发中，几乎不会手动去创建“确定”、“取消”按钮并绑定 `accept`，Qt 官方提供了标准组件 `QDialogButtonBox` 来自动管理这些平台统一的按钮。*

- **`QDialogButtonBox(buttons: QDialogButtonBox.StandardButtons, parent: QWidget = None)`**
  **中文**：构造标准按钮盒
  **参数**：`buttons` – 多个标准按钮的位或组合。
  **作用**：自动创建一个符合当前操作系统（Windows/macOS）UI 规范的按钮组（比如 Windows 的按钮顺序通常是“确定”在左，“取消”在右）。
  ```python
  from PySide6.QtWidgets import QDialogButtonBox, QPushButton, QVBoxLayout
  
  class MyDialog(QDialog):
      def __init__(self):
          super().__init__()
          # 设置【OK】和【Cancel】标准按钮，会自动适配系统风格
          self.button_box = QDialogButtonBox(
              QDialogButtonBox.StandardButton.Ok | 
              QDialogButtonBox.StandardButton.Cancel
          )
          # 绑定标准按钮的点击信号
          self.button_box.accepted.connect(self.accept)
          self.button_box.rejected.connect(self.reject)
          
          layout = QVBoxLayout(self)
          layout.addWidget(QPushButton("这里是其他内容"))
          layout.addWidget(self.button_box) # 将按钮盒放在底部
  ```
  **标准按钮枚举 (QDialogButtonBox.StandardButton)**：
  `Ok`、`Cancel`、`Yes`、`No`、`Save`、`Close`、`Apply`、`Reset`、`Help` 等等。在 Windows 上，`Ok` 会在左边，在 macOS 上 `Ok` 会在右边。

- **`button(which: QDialogButtonBox.StandardButton)`**
  **中文**：获取标准按钮对象
  **作用**：如果你想动态改变某个标准按钮的文字或者状态，需要先通过此方法拿到按钮实例。
  ```python
  ok_btn = button_box.button(QDialogButtonBox.StandardButton.Ok)
  ok_btn.setText("提交") # 将默认的 OK 改为“提交”
  ```

---

### 四、 QMessageBox —— 标准系统消息框
*这是最常用到的 `QDialog` 子类，用于向用户展示各种信息、警告、错误和询问。*

#### 4.1 静态简便方法（一行代码调用）
*不必实例化 `QMessageBox`，直接使用类静态方法弹窗。*

- **`QMessageBox.about(parent, title: str, text: str)`**
  **中文**：关于对话框
  **作用**：显示带有特定信息图标的窗口，通常用于程序版本信息。
  ```python
  QMessageBox.about(self, "关于", "这是我的 PySide6 程序，版本 1.0")
  ```

- **`QMessageBox.information(parent, title: str, text: str, buttons: QMessageBox.StandardButtons = Ok, defaultButton: QMessageBox.StandardButton = NoButton)`**
  **中文**：信息提示框（带蓝色 `i` 图标）

- **`QMessageBox.question(parent, title: str, text: str, buttons: QMessageBox.StandardButtons = StandardButtons(Yes|No), defaultButton: QMessageBox.StandardButton = NoButton)`**
  **中文**：询问对话框（带绿色 `?` 图标）
  **作用**：询问用户，返回用户点击的按钮值。
  ```python
  reply = QMessageBox.question(
      self, 
      "确认删除", 
      "确定要删除这条数据吗？", 
      QMessageBox.StandardButton.Yes | QMessageBox.StandardButton.No,
      QMessageBox.StandardButton.No # 默认高亮“否”
  )
  
  if reply == QMessageBox.StandardButton.Yes:
      print("执行删除操作")
  ```

- **`QMessageBox.warning(parent, title: str, text: str, ...)`**
  **中文**：警告框（带黄色 `!` 图标）

- **`QMessageBox.critical(parent, title: str, text: str, ...)`**
  **中文**：错误框（带红色 `X` 图标）

#### 4.2 面向对象的用法（极细化控制）
*如果静态方法无法满足你的定制需求（比如需要加详细文本、自定义图标或按钮文字），需要实例化 `QMessageBox`。*

- **`QMessageBox(icon, title, text, buttons, parent)`**
  **中文**：通过构造函数详细定制。
  ```python
  msg = QMessageBox()
  msg.setWindowTitle("错误警告")
  msg.setText("发生了严重的网络错误。") # 主提示文
  msg.setInformativeText("请检查您的网络连接是否正常。") # 次要提示文
  msg.setDetailedText("Error Code: 404 Not Found\nStack Trace: ...") # 点击“显示详情”按钮后展示的详细报错
  msg.setIcon(QMessageBox.Icon.Critical)
  msg.setStandardButtons(QMessageBox.StandardButton.Retry | QMessageBox.StandardButton.Cancel)
  msg.setDefaultButton(QMessageBox.StandardButton.Retry)
  
  ret = msg.exec()
  if ret == QMessageBox.StandardButton.Retry:
      print("重试网络请求")
  ```

- **`setDetailedText(text)`**
  **中文**：设置详细文本
  **作用**：添加后，消息框左下角会出现一个“显示详情”的按钮。展开后可以展示完整的代码错误栈或日志，对开发调试非常有用。

---

### 五、 QFileDialog —— 文件与目录选择
*用于让用户选择打开、保存文件或选择目录。*

#### 5.1 最常用静态方法
- **`QFileDialog.getOpenFileName(parent, caption: str = "", directory: str = "", filter: str = "", selectedFilter: str = None, options: QFileDialog.Options = Options())`**
  **中文**：打开单个文件对话框
  **返回**：返回一个元组 `(文件绝对路径, 用户选中的过滤器)`。如果用户取消，返回 `('', '')`。
  ```python
  from PySide6.QtWidgets import QFileDialog
  
  file_path, selected_filter = QFileDialog.getOpenFileName(
      self,
      "选择一张图片",
      "C:/Users/Desktop", # 默认打开目录
      "图片文件 (*.png *.jpg *.jpeg);;所有文件 (*.*)", # 多类型过滤
      options=QFileDialog.Option.DontUseNativeDialog # 强制使用 Qt 自带的对话框而非系统对话框
  )
  if file_path:
      print(f"选中了文件: {file_path}, 过滤器: {selected_filter}")
  ```

- **`QFileDialog.getOpenFileNames(parent, caption, directory, filter, selectedFilter, options)`**
  **中文**：打开多个文件对话框
  **返回**：返回一个元组 `(路径列表, 过滤器)`。支持使用 `Ctrl` 或 `Shift` 多选。
  ```python
  files, _ = QFileDialog.getOpenFileNames(self, "选择多个文件", "", "文本文件 (*.txt)")
  for f in files:
      print(f"选中的文件: {f}")
  ```

- **`QFileDialog.getSaveFileName(parent, caption, directory, filter, selectedFilter, options)`**
  **中文**：保存文件对话框
  **作用**：通常用于获取用户想要保存的路径。**注意**：它只是返回路径，**不会**真的替你保存文件，你需要自己写代码把数据写入这个路径。

- **`QFileDialog.getExistingDirectory(parent, caption, directory, options)`**
  **中文**：选择文件夹对话框
  **返回**：返回选中的文件夹路径（字符串），取消则返回空字符串。
  ```python
  folder = QFileDialog.getExistingDirectory(self, "选择保存目录", "C:/Users")
  ```

#### 5.2 面向对象用法（高级定制）
*当你需要预设文件名、或者配置对话框的显示选项时，可以实例化 `QFileDialog`。*

- **`QFileDialog(parent, caption, directory, filter)`**
  ```python
  dlg = QFileDialog(self, "保存文件", "C:/Users/Desktop", "Python脚本 (*.py)")
  dlg.setAcceptMode(QFileDialog.AcceptMode.AcceptSave) # 设置为保存模式
  dlg.setDefaultSuffix("py") # 如果用户没写后缀，自动补全 .py
  dlg.setFileMode(QFileDialog.FileMode.AnyFile) # 任何文件均可
  
  if dlg.exec() == QFileDialog.DialogCode.Accepted:
      # 获取文件路径
      selected_files = dlg.selectedFiles()
      file_path = selected_files[0]
      print(file_path)
  ```

- **`QFileDialog.setNameFilters(list)`**
  **中文**：设置过滤器的另一种方式。
  ```python
  dlg.setNameFilters(["Image Files (*.png *.jpg)", "Text Files (*.txt)"])
  ```

---

### 六、 QInputDialog —— 便捷输入对话框
*当你不想要复杂界面，仅仅需要让用户输入一个“字符串”、“整数”、“浮点数”或者“下拉选择一项”时，这是最快捷的方法。*

- **`QInputDialog.getText(parent, title, label, text, echoMode, flags)`**
  **中文**：获取文本（单行输入框）
  **返回**：`(输入的字符串, 布尔值)`。布尔值 `True` 代表点了确定，`False` 代表取消。
  ```python
  from PySide6.QtWidgets import QInputDialog
  
  text, ok = QInputDialog.getText(self, "输入姓名", "请输入您的名字：", text="默认名字")
  if ok:
      print(f"您输入了: {text}")
  ```

- **`QInputDialog.getInt(self, title, label, value, min, max, step, flags)`**
  **中文**：获取整数（带上下调节按钮）
  ```python
  # 获取一个 1 到 100 之间的整数，默认 18，步进 1
  age, ok = QInputDialog.getInt(self, "设置年龄", "请输入年龄：", value=18, min=1, max=100, step=1)
  ```

- **`QInputDialog.getDouble(self, title, label, value, min, max, decimals, step, flags)`**
  **中文**：获取浮点数
  ```python
  # 获取浮点数，保留 2 位小数
  price, ok = QInputDialog.getDouble(self, "价格", "设定单价：", value=19.99, decimals=2)
  ```

- **`QInputDialog.getItem(self, title, label, items, current, editable, flags)`**
  **中文**：从下拉列表中选择一项
  **参数**：`items` – 字符串列表。`current` – 当前选中的索引。`editable` – 是否允许用户手动输入不在列表里的值。
  ```python
  items = ["深圳", "北京", "上海", "广州"]
  city, ok = QInputDialog.getItem(self, "选择城市", "请选择您所在的城市：", items, current=0, editable=False)
  if ok:
      print(f"你选择了: {city}")
  ```

---

### 七、 QDialog 家族的高级事件重写

- **`acceptEvent()`** / **`rejectEvent()`**
  **中文**：接受/拒绝事件
  **作用**：类似于 `QWidget.closeEvent`，你可以重写这两个方法，在用户点“确定”或“取消”时，额外执行一些校验逻辑（比如检查输入框是否为空）。
  ```python
  class MyDialog(QDialog):
      def acceptEvent(self, event):
          # 检查输入是否合法
          if self.line_edit.text().strip() == "":
              QMessageBox.warning(self, "提示", "输入不能为空！")
              event.ignore() # 阻止确定关闭
          else:
              event.accept() # 允许确定并关闭
  ```

---

## 八、 QDialog 核心机制隐藏细节补充

- **`setResult(result: int)`** / **`result()`**
  **中文**：设置/获取对话框的返回结果码
  **作用**：在对话框代码逻辑的中间，提前预设 `exec()` 将会返回的值。调用 `accept()` 本质等于 `self.done(QDialog.Accepted)`，调用 `reject()` 等于 `self.done(QDialog.Rejected)`。
  ```python
  class MyDialog(QDialog):
      def __init__(self):
          super().__init__()
          self.setResult(999) # 预设好返回码
      def closeEvent(self, event):
          self.done(self.result()) # 关闭时返回 999

  # 外部调用
  if dlg.exec() == 999:
      print("触发了预设的 999 逻辑")
  ```

- **`open()`** (补充说明)
  **中文**：非模态打开（与 `show()` 的区别）
  **作用**：`open()` 和 `show()` 都是非阻塞弹窗。区别在于，`open()` 内部会调用 `setWindowModality(Qt.ApplicationModal)`，它会将这个对话框变成**应用程序级别的模态**，即虽然不阻塞当前代码，但用户**依然无法点击主窗口**。而 `show()` 是完全自由的非模态。通常用于需要半模态的复杂场景。

- **`setSizeGripEnabled(enabled: bool)`** / **`isSizeGripEnabled()`**
  **中文**：设置/获取是否启用右下角的“抓手”大小调整功能。
  **作用**：默认 `QDialog` 是**无法**拖拽改变大小的（只能通过代码设置）。设为 `True` 后，对话框右下角会多出一个由斜线组成的“抓手”区域，用户可以用鼠标拖拽抓手来自由拉伸对话框的大小。
  ```python
  dlg.setSizeGripEnabled(True)  # 开启对话框的拉伸功能
  ```

- **`QMessageBox.setCheckBox(checkBox: QCheckBox)`**
  **中文**：在系统消息框中内嵌一个复选框。
  **作用**：这是一项极具商业软件细节的功能。例如在弹出“是否删除文件”的询问框时，在底部加一个“下次不再询问”的复选框，提升用户体验。
  ```python
  msg = QMessageBox(QMessageBox.Icon.Question, "警告", "确认删除此文件？")
  never_ask = QCheckBox("下次不再询问")
  msg.setCheckBox(never_ask)  # 把复选框塞进弹窗里
  
  ret = msg.exec()
  if msg.checkBox().isChecked():
      print("用户选择了不再提醒")
  ```

---

## 九、 QDialogButtonBox 高级交互扩展

- **`buttonBox.clicked.connect(self.on_button_clicked)`**
  **中文**：捕获实际点击的按钮对象
  **作用**：传统的 `accepted.connect(self.accept)` 无法区分用户点了“应用”还是“保存”。连接 `clicked` 信号可以直接获取被点击的按钮对象。
  ```python
  def __init__(self):
      self.button_box = QDialogButtonBox(QDialogButtonBox.Save | QDialogButtonBox.Discard)
      self.button_box.clicked.connect(self.handle_button_click)

  def handle_button_click(self, button):
      # standardButton 判断点击的是哪一个标准按钮
      role = self.button_box.standardButton(button)
      if role == QDialogButtonBox.StandardButton.Save:
          print("用户点了保存")
          # 如果不想在此时立即关闭，可以不调用 accept，而是执行自己的逻辑
      elif role == QDialogButtonBox.StandardButton.Discard:
          print("用户点了丢弃")
          self.reject()
  ```

- **`buttonBox.button(which: QDialogButtonBox.StandardButton).setEnabled(False)`**
  **中文**：动态禁用按钮
  **作用**：在验证逻辑不满足时，禁止用户点击“确定”按钮。
  ```python
  # 刚打开对话框时，禁用“确定”按钮
  ok_btn = self.button_box.button(QDialogButtonBox.StandardButton.Ok)
  ok_btn.setEnabled(False) 
  
  # 当输入框内容发生变化时，启用按钮
  def on_text_changed(self):
      if self.line_edit.text().strip():
          ok_btn.setEnabled(True)
  ```

---

## 十、 QMessageBox 自定义按钮与信号扩展

- **`msgBox.addButton(text: str, role: QMessageBox.ButtonRole)`**
  **中文**：添加自定义文本的按钮
  **作用**：当标准按钮无法满足需求时，创建自定义按钮。`role` 决定按钮在对话框中的显示顺序和逻辑类型（如 `ActionRole`、`AcceptRole`、`RejectRole`）。
  ```python
  msg = QMessageBox(QMessageBox.Icon.Question, "确认", "请问要执行什么操作？")
  btn_upload = msg.addButton("上传文件", QMessageBox.ButtonRole.ActionRole)
  btn_delete = msg.addButton("删除文件", QMessageBox.ButtonRole.ActionRole)
  msg.addButton(QMessageBox.StandardButton.Cancel)
  
  msg.exec()
  if msg.clickedButton() == btn_upload:
      print("执行上传")
  elif msg.clickedButton() == btn_delete:
      print("执行删除")
  ```

- **`setEscapeButton(button: QAbstractButton)`** / **`escapeButton()`**
  **中文**：设置按下键盘 ESC 键时触发的按钮
  **作用**：一般消息框按下 ESC 默认触发的是 `Cancel` 或 `Close`，你可以自定义让它按下 ESC 触发“确定”按钮。
  ```python
  msg.setEscapeButton(msg.button(QMessageBox.StandardButton.Ok))
  ```

- **`msgBox.buttonClicked.connect(self.on_msg_button_click)`**
  **中文**：信号捕获具体按钮（比 `exec()` 更友好）
  **作用**：当用户点击消息框的任何按钮时，提前获取按钮信息。
  ```python
  def on_msg_button_click(self, button):
      if button.text() == "上传文件":
          # 避免阻塞界面，直接执行对应逻辑
          self.upload_file()
  ```

---

## 十一、 QFileDialog 高级过滤与视图扩展

- **`setFilter(filters: QDir.Filters)`**
  **中文**：设置高级系统文件过滤条件
  **作用**：不仅可以过滤后缀，还可以过滤文件属性（如隐藏文件、文件夹、驱动器）。
  ```python
  dlg = QFileDialog(self, "选择配置文件")
  dlg.setNameFilters(["GameConfigKey (*.conf)"])
  # 过滤掉系统隐藏文件，并强制只显示文件（不显示文件夹）
  dlg.setFilter(QDir.Filter.Files | QDir.Filter.NoDotAndDotDot)
  ```

- **`setViewMode(mode: QFileDialog.ViewMode)`**
  **中文**：设置文件视图模式
  **作用**：控制文件列表显示为“大图标”还是“详细信息表格”。
  ```python
  dlg.setViewMode(QFileDialog.ViewMode.Detail)  # 显示详细信息（如文件大小、创建时间）
  # QFileDialog.ViewMode.List 表示以列表形式只显示文件名
  ```

- **`setSidebarUrls(urls: list)`**
  **中文**：自定义左侧侧边栏的快捷路径
  **作用**：允许在你的文件对话框中，强制添加一些企业内部的共享目录或者常用的网络盘。
  ```python
  from PySide6.QtCore import QUrl
  dlg.setSidebarUrls([QUrl.fromLocalFile("Z:/共享文件夹")])
  ```

---

## 十二、 QInputDialog 面向对象用法（高级控制）

*除了静态方法 `getInt`/`getText`，直接实例化 `QInputDialog` 可以让你彻底控制对话框的 UI。*

- **`QInputDialog(parent)`**
  **中文**：实例化输入框对象
  **作用**：允许在调用 `exec()` 之前，逐个属性进行精细化设置。
  ```python
  dlg = QInputDialog(self)
  dlg.setWindowTitle("自定义登录")
  dlg.setLabelText("请输入您的用户名：")
  dlg.setTextValue("Admin")
  dlg.setOkButtonText("登录")
  dlg.setCancelButtonText("取消")
  
  if dlg.exec() == QInputDialog.DialogCode.Accepted:
      username = dlg.textValue()
      print(f"登录用户为: {username}")
  ```

- **`QInputDialog.setComboBoxItems(items: list)`**
  **中文**：设置下拉列表项
  **作用**：虽然 `getItem` 静态方法也有此功能，但通过实例化 `QInputDialog` 可以在后续动态替换列表项。
  ```python
  dlg = QInputDialog(self)
  dlg.setComboBoxItems(["Python", "Java", "C++"])
  dlg.setInputMode(QInputDialog.InputMode.TextInput) # 切换到文本输入模式
  ```


---



