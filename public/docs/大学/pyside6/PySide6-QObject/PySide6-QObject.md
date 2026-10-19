# PySide6-QObject

---

## 一、 QObject —— 所有 Qt 对象的基类
**导入**：`from PySide6.QtCore import QObject`
*QObject 是 Qt 框架的核心。所有可视化控件（QWidget）、应用程序（QApplication）、线程（QThread）最终都继承自它。*

- **`objectName()`** / **`setObjectName(name)`**
  **中文**：获取/设置对象名称
  **参数**：`name` – 字符串。
  **作用**：为对象分配一个唯一标识名。在 Qt Designer 里设置的 `objectName` 就是这个属性。这对于在代码中通过名字查找特定控件至关重要。
  ```python
  self.setObjectName("main_window")
  ```

- **`parent()`** / **`setParent(parent)`**
  **中文**：获取/设置父对象
  **参数**：`parent` – 另一个 `QObject` 派生对象。
  **作用**：建立对象的父子关系。当一个父对象被销毁时，它所有的子对象也会被自动销毁，这能有效防止内存泄漏。
  ```python
  btn = QPushButton("点我", self)  # 将 self 设为父对象
  ```

- **`children()`**
  **中文**：获取所有直接子对象
  **参数**：无
  **返回**：包含所有直接子对象引用的列表。
  ```python
  for child in self.children():
      print(child.objectName())
  ```

- **`findChild(type, name, options)`** / **`findChildren(type, name, options)`**
  **中文**：递归查找子对象
  **参数**：`type` – 要找的类（如 `QPushButton`）；`name` – 对象名（可选）。
  **作用**：在对象树里向下深度查找特定类型或名字的子对象。这是动态操作 UI 的得力工具。
  ```python
  # 查找名为 "submit_btn" 的按钮
  btn = self.findChild(QPushButton, "submit_btn")
  if btn:
      btn.setText("提交")
  ```

- **`setProperty(name, value)`** / **`property(name)`**
  **中文**：设置/获取动态属性
  **参数**：`name` – 属性名字符串；`value` – 任意类型的数据。
  **作用**：在运行时为对象动态绑定属性（支持 QML 样式或复杂状态绑定）。
  ```python
  widget.setProperty("is_logged_in", True)
  print(widget.property("is_logged_in"))  # 输出: True
  ```

- **`deleteLater()`**
  **中文**：安全延迟删除
  **参数**：无
  **作用**：安排对象在当前事件循环结束后被安全销毁。用于在非主线程或事件回调中安全地释放 UI 资源。
  ```python
  widget.deleteLater()  # 不会立即删除，但很安全
  ```

- **`blockSignals(block)`**
  **中文**：阻塞对象信号的发射
  **参数**：`block` – `True`（阻止发射）或 `False`（恢复发射）。
  **作用**：临时阻止对象发射所有信号，用于防止在批量更新属性时触发无限循环事件。
  ```python
  combo.blockSignals(True)
  combo.addItems(["上海", "广州"])
  combo.blockSignals(False)  # 恢复信号发射
  ```

- **`inherits(class_name)`**
  **中文**：判断是否继承自指定类
  **参数**：`class_name` – 类的字符串名称（如 `"QWidget"`）。
  **作用**：判断当前对象是否为某个类的子类对象。
  ```python
  if obj.inherits("QPushButton"):
      print("这是一个按钮")
  ```

---

## 二、 QApplication —— 应用程序主控（派生自 QObject）
**导入**：`from PySide6.QtWidgets import QApplication`

- **`QApplication(sys.argv)`**
  **参数**：`sys.argv` – 命令行参数列表（必须）。
  **作用**：创建应用程序实例，每个程序有且仅有一个。
  ```python
  import sys
  app = QApplication(sys.argv)   # 必须放在所有窗口创建之前
  ```

- **`exec()`**
  **中文**：启动事件循环
  **参数**：无
  **作用**：进入主事件循环，等待用户操作，直到调用 `quit()` 退出。返回退出码。
  ```python
  sys.exit(app.exec())   # 返回退出码给操作系统
  ```

- **`quit()`**
  **中文**：退出程序
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
  if QApplication.instance() is None:
      app = QApplication(sys.argv)
  ```

- **`setApplicationName(name)`** / **`applicationName()`**
  **中文**：设置/获取应用名称
  **参数**：`name` – 字符串。
  **作用**：影响系统配置文件的保存路径，供 QSettings 读取使用。
  ```python
  app.setApplicationName("我的应用")
  ```

- **`setOrganizationName(name)`** / **`organizationName()`**
  **中文**：设置/获取组织名称
  **参数**：`name` – 字符串。
  **作用**：影响系统配置文件的保存路径（与 `setApplicationName` 配合使用）。
  ```python
  app.setOrganizationName("我的公司")
  ```

- **`setApplicationDisplayName(name)`**
  **中文**：设置应用显示名称
  **参数**：`name` – 字符串。
  **作用**：用户界面（如任务栏、消息框）中显示的易读名称。
  ```python
  app.setApplicationDisplayName("全能工具箱")
  ```

- **`clipboard()`**
  **中文**：获取剪贴板对象
  **返回**：`QClipboard`
  **作用**：用于读取/写入系统剪贴板（文本、图片、HTML 等）。
  ```python
  clipboard = app.clipboard()
  clipboard.setText("复制到剪贴板的内容")
  ```

- **`desktop()`**
  **中文**：获取桌面屏幕信息
  **返回**：`QDesktopWidget`
  **作用**：获取屏幕的数量、尺寸、可用空间等信息。
  ```python
  screen = app.desktop().screenGeometry()  # 获取主屏幕分辨率
  print(f"屏幕宽: {screen.width()}, 高: {screen.height()}")
  ```

- **`focusWidget()`**
  **中文**：获取当前拥有键盘焦点的控件
  **参数**：无
  **返回**：当前获得焦点的 `QWidget`，若无则返回 `None`。
  ```python
  current_focus = app.focusWidget()
  if current_focus:
      print(f"当前焦点控件名为: {current_focus.objectName()}")
  ```

- **`processEvents()`**
  **中文**：强制处理所有待处理事件
  **参数**：无
  **作用**：在执行耗时操作（如大循环、网络请求）时，主动让界面刷新响应，防止界面卡死。
  ```python
  for i in range(1000000):
      ... # 耗时计算
      if i % 100 == 0:
          app.processEvents() # 保持界面响应
  ```

---

## 三、 QThread —— 工作线程（派生自 QObject）
**导入**：`from PySide6.QtCore import QThread, Signal`

- **`start()`**
  **作用**：启动线程，自动执行 `run()` 方法。
  ```python
  worker = Worker()
  worker.start()
  ```

- **`quit()`**
  **作用**：通知线程事件循环退出。
  ```python
  worker.quit()
  ```

- **`wait()`**
  **作用**：阻塞当前线程，直到目标线程终止执行。
  ```python
  worker.wait()
  ```

- **`isRunning()`**
  **作用**：判断线程当前是否正在运行。
  ```python
  if worker.isRunning():
      print("线程正在运行中...")
  ```

- **`started` 信号**
  **作用**：线程启动之前立即发射。

- **`finished` 信号**
  **作用**：线程执行完毕退出时发射。
  ```python
  worker.finished.connect(lambda: print("任务执行完毕"))
  ```

- **`msleep(ms)`**（实例方法）
  **作用**：让当前线程强制睡眠指定的毫秒数。只能在 `run()` 方法内部通过 `self.msleep()` 调用。
  ```python
  self.msleep(50)   # 每隔 50ms 循环一次
  ```

*注：通常需继承 `QThread` 并重写 `run()`，再通过自定义 `Signal` 将数据发射到主线程。*
```python
class Worker(QThread):
    progress = Signal(int)   # 定义自定义信号，携带一个整数
    def run(self):
        for i in range(101):
            self.progress.emit(i)  # 将进度发射出去给主界面刷新进度条
            self.msleep(50)
```

---

## 四、 信号与槽机制（QObject 核心特性）
**导入**：`from PySide6.QtCore import QObject, Signal`

- **`widget.signal.connect(slot_function)`**
  **中文**：连接信号与槽
  **作用**：将某个控件的信号（如按钮点击）绑定到一个函数上。当信号发射时，函数自动执行。
  ```python
  btn.clicked.connect(self.do_something)
  ```

- **`widget.signal.disconnect(slot_function)`**
  **中文**：断开信号与槽的连接
  **作用**：解除绑定，断开后即使信号发射，指定的函数也不会再执行。
  ```python
  btn.clicked.disconnect(self.do_something)
  ```

- **`Signal(类型1, 类型2, ...)`**
  **中文**：定义自定义信号
  **作用**：在子类中声明信号，用于线程与主界面通信或自定义事件的触发。
  ```python
  class MyObject(QObject):
      custom_signal = Signal(str, int)  # 携带字符串和整数
  ```

- **`self.custom_signal.emit(data1, data2)`**
  **中文**：发射自定义信号
  **作用**：在条件满足时，把特定数据发射出去，由外面连接的槽函数去处理。
  ```python
  obj = MyObject()
  obj.custom_signal.connect(lambda name, count: print(f"收到: {name}, 数量: {count}"))
  obj.custom_signal.emit("苹果", 5)
  # 输出: 收到: 苹果, 数量: 5
  ```

---

## 五、 QObject 补充遗漏细节

- **`installEventFilter(filterObj: QObject)`** / **`removeEventFilter(filterObj: QObject)`** / **`eventFilter(watched: QObject, event: QEvent)`**
  **中文**：安装/移除事件过滤器，以及重写过滤器方法。
  **作用**：这是 Qt 底层最强大的拦截机制。对象 A 可以对对象 B 调用 `B.installEventFilter(A)`，此后对象 B 发生的**所有**事件（鼠标点击、按键、窗口移动等）在发送给 B 自己处理之前，都会**先发送给对象 A 的 `eventFilter` 方法**。A 可以在里面拦截、吃掉事件，或者修改后放行。
  **经典应用**：全局禁用某个按钮的右键菜单、在任意子控件中捕获“Ctrl+F”全局搜索、防误触拦截。
  ```python
  class Monitor(QObject):
      def eventFilter(self, watched, event):
          if event.type() == QEvent.Type.MouseButtonPress:
              print(f"拦截到子控件 {watched} 的鼠标点击！")
              return True  # 返回 True 表示事件被拦截，不再往下传递
          return False      # 返回 False 继续正常传递事件

  monitor = Monitor()
  btn = QPushButton("按钮")
  btn.installEventFilter(monitor)  # 监控按钮的所有事件
  ```

- **`tr(text: str)`**
  **中文**：国际化翻译方法（Qt 多语言系统的核心入口）。
  **参数**：`text` – 源码中需要支持多语言的文本。
  **作用**：所有继承自 `QObject` 的类都具备此方法。在写代码时，用 `self.tr("保存文件")` 而不是直接写中文。在后续使用 `pyside6-linguist` 生成翻译文件时，`tr` 里面的文本会自动被提取出来供翻译成英文、日文等。
  ```python
  class MyWidget(QWidget):
      def __init__(self):
          super().__init__()
          btn = QPushButton(self.tr("保存"), self) # 支持多语言的写法
  ```
