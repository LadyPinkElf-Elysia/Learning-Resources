# PySide6-Advanced

---

## 前言：本文件涵盖范围
*本章节专门用于收录 PySide6 开发中无法单纯归类到某个 `QWidget` 或 `QLayout` 下的“骨干机制”与“高阶工具”。它们虽然不是直接的 UI 控件，但却是构建一个成熟桌面应用不可或缺的核心基础设施。*

---

## 一、 QPainter —— 自定义绘制引擎
**导入**：`from PySide6.QtGui import QPainter, QPen, QBrush, QColor, QLinearGradient`
*通常，我们把 `QPainter` 和 `paintEvent` 结合使用，来绘制自定义形状、图片、复杂曲线、图表，或者实现动画效果。*

### 1.1 基础绘制环境
- **`QPainter(widget: QPaintDevice)`**
  **中文**：构造绘制引擎对象
  **参数**：`widget` – 你要在上面绘制的那个继承了 `QWidget` 的控件实例（通常在 `paintEvent` 中传入 `self`）。
  ```python
  def paintEvent(self, event):
      painter = QPainter(self)
      # ... 绘制代码 ...
      painter.end() # 显式结束绘制，释放资源
  ```
  *注：更优雅的写法是利用 Python 上下文管理器自动调用 `begin` 和 `end`：*
  ```python
  with QPainter(self) as painter:
      painter.drawText(...) # 离开 with 块自动结束
  ```

- **`setRenderHint(hint: QPainter.RenderHint, on: bool = True)`**
  **中文**：设置渲染提示（抗锯齿等）
  **作用**：默认画出的线条和圆是带有像素锯齿的。开启抗锯齿可以让边缘变得平滑，尤其适合画圆、斜线和文字。
  ```python
  painter.setRenderHint(QPainter.RenderHint.Antialiasing) # 开启抗锯齿
  painter.setRenderHint(QPainter.RenderHint.TextAntialiasing) # 开启文字抗锯齿
  ```

- **`setPen(pen: QPen)`** / **`pen()`**
  **中文**：设置/获取画笔（控制线条颜色、粗细、样式）
  **参数**：`QPen` 可接受颜色字符串、`QColor`、或完整的 `QPen` 对象。
  ```python
  # 构造一个 2px 粗细的红色实线画笔
  pen = QPen(QColor("red"), 2, Qt.SolidLine, Qt.RoundCap, Qt.RoundJoin)
  painter.setPen(pen)
  ```

- **`setBrush(brush: QBrush)`** / **`brush()`**
  **中文**：设置/获取画刷（控制内部的填充颜色、纹理、渐变）
  ```python
  brush = QBrush(QColor("blue"), Qt.Dense1Pattern) # 蓝色密集点纹理
  painter.setBrush(brush)
  ```

### 1.2 坐标系统变换（终极核心，很多人忽略）
*默认 `(0,0)` 坐标在控件左上角。你可以“移动”画布坐标系，做平移、旋转、缩放，从而画出复杂的旋转图形。*

- **`save()`** / **`restore()`**
  **中文**：保存/恢复当前画笔状态。
  **作用**：在变换坐标之前调用 `save()`，变换完毕画完图形后调用 `restore()`，能让画布瞬间回到变换前的状态，避免影响后续的绘制。
  ```python
  painter.save()
  painter.translate(100, 100) # 平移
  painter.drawRect(0, 0, 50, 50) # 画在 (100,100) 处
  painter.restore() # 恢复原点回 (0,0)
  ```

- **`translate(dx: float, dy: float)`**
  **中文**：将坐标系原点平移指定的像素量。
  ```python
  painter.translate(50, 50) # 整个画布原点移到了 (50,50)
  ```

- **`rotate(angle: float)`**
  **中文**：以原点为中心，逆时针旋转指定的角度（度）。
  ```python
  painter.rotate(45) # 图形整体倾斜 45 度
  ```

- **`scale(sx: float, sy: float)`**
  **中文**：缩放坐标系的比例。
  ```python
  painter.scale(2, 2) # 之后画的所有东西都放大 2 倍
  ```

### 1.3 基础几何图形与文本绘制
- **`drawPoint(x: int, y: int)`** / **`drawPoints(points: list)`**
  **中文**：绘制单个或多个点。
  ```python
  painter.drawPoint(10, 10)
  ```

- **`drawLine(x1, y1, x2, y2)`**
  **中文**：绘制线段。
  ```python
  painter.drawLine(0, 0, 100, 100)
  ```

- **`drawRect(x, y, w, h)`** / **`drawRoundedRect(x, y, w, h, xRadius, yRadius)`**
  **中文**：绘制直角矩形和圆角矩形。
  ```python
  painter.drawRoundedRect(50, 50, 100, 60, 10, 10) # 圆角半径 10px
  ```

- **`drawEllipse(x, y, w, h)`**
  **中文**：绘制椭圆形/正圆形。
  ```python
  painter.drawEllipse(100, 100, 50, 50) # 圆心在 100,100，半径 50 的正圆
  ```

- **`drawText(rect: QRect, flags: int, text: str)`**
  **中文**：在指定矩形区域内绘制格式化文字。
  **参数**：`flags` 控制对齐方式。如 `Qt.AlignCenter`（水平垂直居中）、`Qt.TextWordWrap`（自动换行）。
  ```python
  painter.drawText(self.rect(), Qt.AlignCenter | Qt.TextWordWrap, "这是一个居中且自动换行的长文本内容。")
  ```

### 1.4 高级工具：渐变填充与复杂路径
- **`QLinearGradient(x1, y1, x2, y2)`** / **`QRadialGradient(cx, cy, radius)`**
  **中文**：构造线性渐变和径向渐变填充对象。
  ```python
  from PySide6.QtGui import QLinearGradient
  
  grad = QLinearGradient(0, 0, 100, 100)
  grad.setColorAt(0, QColor("red"))
  grad.setColorAt(1, QColor("blue"))
  painter.setBrush(QBrush(grad)) # 将渐变设为画刷
  painter.drawRect(0, 0, 100, 100)
  ```

- **`QPainterPath()`**
  **中文**：构造一个复杂的绘制路径，可以将多个线条、曲线、图形组合成一个整体进行绘制或描边。
  ```python
  from PySide6.QtGui import QPainterPath
  
  path = QPainterPath()
  path.moveTo(0, 0)
  path.lineTo(50, 0)
  path.quadTo(75, 50, 50, 100) # 贝塞尔曲线
  path.lineTo(0, 100)
  path.closeSubpath() # 闭合路径
  painter.drawPath(path) # 一次性画出来
  ```

- **`drawPixmap(x, y, pixmap: QPixmap)`**
  **中文**：在控件上直接绘制一张图片。
  ```python
  from PySide6.QtGui import QPixmap
  pix = QPixmap("image.png").scaled(100, 100) # 缩放图片
  painter.drawPixmap(10, 10, pix)
  ```

### 1.5 裁剪区域
- **`setClipRect(rect: QRect)`** / **`setClipPath(path: QPainterPath)`**
  **中文**：设置绘图裁剪区域。在区域外的绘制将不可见（非常适合实现带圆角的异形图片裁剪）。
  ```python
  painter.setClipRect(10, 10, 100, 100) # 只能在 10-110 的区域内绘图
  ```

---

## 二、 控件的生命周期事件重写（进阶视角）
**导入**：`from PySide6.QtWidgets import QWidget`
*除了基础的 `closeEvent` 和 `keyPressEvent`，真正的界面交互依赖以下底层事件。*

- **`resizeEvent(event: QResizeEvent)`**
  **中文**：控件大小发生变化时触发
  **作用**：重写此方法，可以根据当前窗口的宽高动态计算绘制或布局。**经典用法：** 在自定义绘图控件中，当窗口大小改变时，重新计算元素位置。
  ```python
  def resizeEvent(self, event):
      self.radius = min(self.width(), self.height()) // 2
      self.update() # 触发重绘
  ```

- **`enterEvent(event: QEnterEvent)`** / **`leaveEvent(event: QLeaveEvent)`**
  **中文**：鼠标进入/离开控件区域时触发
  **作用**：用来实现“悬浮高亮”效果（按钮背景变色）或“鼠标进入时弹出浮窗”。
  ```python
  def enterEvent(self, event):
      self.setStyleSheet("background-color: #e0e0e0;") # 进入变灰

  def leaveEvent(self, event):
      self.setStyleSheet("background-color: #ffffff;") # 离开恢复白
  ```

- **`wheelEvent(event: QWheelEvent)`**
  **中文**：鼠标滚轮滚动时触发
  **作用**：如果你想自定义一个“用滚轮缩放图片”的画板，重写此方法并读取 `event.angleDelta().y()`（滚轮滚动的步进值）。
  ```python
  def wheelEvent(self, event):
      angle = event.angleDelta().y()
      if angle > 0:
          self.zoom_in()
      else:
          self.zoom_out()
  ```

- **`showEvent(event: QShowEvent)`** / **`hideEvent(event: QHideEvent)`**
  **中文**：控件显示/隐藏时触发
  **作用**：非常适合用来做“延迟加载”：当控件在界面上出现时（比如切换到了某一页 Tab），才去执行加载数据的操作，而不是程序一打开就加载，消耗用户带宽。

---

## 三、 QSettings —— 持久化配置（保存用户习惯与系统状态）
**导入**：`from PySide6.QtCore import QSettings`
*`QSettings` 本质继承自 `QObject`，它是让软件记住用户每次打开界面的状态（如窗口大小、上次登录的账号）的终极利器。*

- **`QSettings(organization: str, application: str, parent: QObject = None)`**
  **中文**：构造函数
  **参数**：`organization` – 公司/组织名；`application` – 应用名。基于这两个名字，PySide6 会在本地生成符合操作系统规范的配置文件（Windows 下是注册表或 `.ini`，macOS 下是 `.plist`，Linux 下是 `.conf`）。
  ```python
  settings = QSettings("MyCompany", "MyApp")
  ```

- **`setValue(key: str, value: Any)`**
  **中文**：保存一个键值对
  **作用**：支持字符串、数字、布尔值、列表、`QSize`、`QPoint`、`QByteArray` 等。
  ```python
  settings.setValue("window_size", self.size())
  settings.setValue("user_name", "Admin")
  ```

- **`value(key: str, defaultValue: Any = None)`**
  **中文**：读取键对应的值。如果该键不存在，则返回 `defaultValue`。返回值类型是 `QVariant`，可以隐式转换为 Python 类型。
  ```python
  size = settings.value("window_size", QSize(800, 600))
  self.resize(size)
  ```

- **`contains(key: str)`**
  **中文**：判断配置文件内是否存在某个键。
  ```python
  if settings.contains("user_name"):
      print("用户之前登录过")
  ```

- **`remove(key: str)`**
  **中文**：从配置文件中删除指定键（常用来清除登录状态）。

- **`clear()`**
  **中文**：清空当前 `QSettings` 作用域下的所有配置。

- **`beginGroup(prefix: str)`** / **`endGroup()`**（极好用，防止键名混乱）
  **中文**：开启/关闭分组前缀。
  **作用**：如果你有很多键都属于“窗口”设置，这能省去重复写 `window_` 前缀。
  ```python
  settings.beginGroup("MainWindow")
  settings.setValue("width", 800)       # 自动保存为 MainWindow/width
  settings.setValue("height", 600)      # 自动保存为 MainWindow/height
  settings.endGroup()
  
  # 读取时：
  settings.beginGroup("MainWindow")
  w = settings.value("width", 800)      # 自动找 MainWindow/width
  settings.endGroup()
  ```

- **`sync()`**
  **中文**：强制将内存中的配置立刻同步写入硬盘（或注册表）。
  **作用**：默认情况下，QSettings 是写缓存延迟写入的。如果担心程序崩溃导致配置丢失（在保存关键状态时），调用 `sync()`。

- **`setFallbacksEnabled(enabled: bool)`**
  **中文**：设置是否启用备用配置。
  **作用**：设为 `False` 可以阻止 QSettings 读取系统级别的全局配置，强制从用户级配置中读取。

---

## 四、 QTimer —— 定时器、超时与动画循环
**导入**：`from PySide6.QtCore import QTimer`
*`QTimer` 继承自 `QObject`，是轮询、心跳、自动保存等场景的核心组件。*

- **`QTimer(parent: QObject = None)`**
  **中文**：构造一个定时器对象。
  ```python
  timer = QTimer(self)
  ```

- **`start(interval: int = 0)`** / **`stop()`**
  **中文**：启动/停止定时器。
  **参数**：`interval` – 间隔时间，单位为毫秒。
  ```python
  timer.start(1000) # 每隔 1000ms（1秒）触发一次 timeout 信号
  ```

- **`setSingleShot(singleShot: bool)`**
  **中文**：设置仅触发一次（倒计时模式）。
  **作用**：设为 `True` 后，定时器执行一次 `timeout` 后就会自动停止，非常适合做延时执行。
  ```python
  timer.setSingleShot(True)
  ```

- **`setInterval(ms: int)`**
  **中文**：修改定时器的触发间隔。

- **`remainingTime()`**
  **中文**：返回距离下次 `timeout` 触发还剩余的毫秒数。如果定时器未启动，返回 `-1`。

- **`timerType(type: Qt.TimerType)`**
  **中文**：设置定时器精度。
  **参数**：
  - `Qt.PreciseTimer`：高精度定时器（毫秒级，默认）。
  - `Qt.CoarseTimer`：粗略定时器（约 5ms 精度），适合非苛刻场景，节省 CPU。
  - `Qt.VeryCoarseTimer`：极粗略定时器（约 500ms 精度），适合不需要精确触发的倒计时。

- **`isActive()`**
  **中文**：判断定时器是否正在运行。

- **`QTimer.singleShot(interval: int, receiver: QObject, member: str)`**
  **中文**：**静态方法**，无需实例化定时器，直接设定一个一次性的延时执行。这是最常用的“在一段时间后执行某段代码”的快捷方法。
  ```python
  from PySide6.QtCore import QTimer
  QTimer.singleShot(2000, self, self.close) # 2秒后自动关闭窗口
  ```

### 🟢 QTimer 的核心信号
- **`timeout()`**：每当间隔时间到达时发射。你需要将 `timeout` 信号连接到你要执行的函数上。
  ```python
  timer.timeout.connect(lambda: print("定时器滴答响了一次"))
  timer.start(1000)
  ```

---

## 五、 QClipboard —— 剪贴板操作与高级交互
**导入**：`from PySide6.QtGui import QClipboard`
*剪贴板通过 `QApplication.clipboard()` 获取，用于系统级的文本、图片及 HTML 交互。*

- **`QApplication.clipboard()`**
  **中文**：获取全局剪贴板单例对象。

- **`setText(text: str, mode: QClipboard.ClassicMode = QClipboard.ClassicMode.Clipboard)`**
  **中文**：将文本写入剪贴板。
  ```python
  QApplication.clipboard().setText("这段文字已经被复制到剪贴板了")
  ```

- **`text(mode: QClipboard.ClassicMode = QClipboard.ClassicMode.Clipboard)`**
  **中文**：读取剪贴板中的纯文本。
  ```python
  content = QApplication.clipboard().text()
  ```

- **`setPixmap(pixmap: QPixmap)`** / **`setImage(image: QImage)`**
  **中文**：将图片复制到剪贴板。
  ```python
  from PySide6.QtGui import QPixmap
  QApplication.clipboard().setPixmap(QPixmap("screenshot.png"))
  ```

- **`setMimeData(data: QMimeData)`**
  **中文**：高级用法，将携带复杂格式的数据（包含多种格式的文本、URL、图片）写入剪贴板。
  ```python
  from PySide6.QtCore import QMimeData, QUrl
  mime = QMimeData()
  mime.setText("文字")
  mime.setUrls([QUrl("http://www.python.org")])
  QApplication.clipboard().setMimeData(mime)
  ```

- **`clear(mode: QClipboard.ClassicMode = QClipboard.ClassicMode.Clipboard)`**
  **中文**：清空剪贴板内容。
  ```python
  QApplication.clipboard().clear()
  ```

- **`mimeData(mode: QClipboard.ClassicMode = QClipboard.ClassicMode.Clipboard)`**
  **中文**：获取剪贴板中的 `QMimeData` 对象，用于判断里面是文本还是图片。

### 剪贴板监听信号
- **`dataChanged`**：当剪贴板内容发生改变（其他任何程序复制了东西）时发射。
  ```python
  QApplication.clipboard().dataChanged.connect(lambda: print("系统剪贴板内容更新了！"))
  ```

---

## 六、 QDrag —— 高级自定义拖拽与放置（非 UI 控件拖动）
**导入**：`from PySide6.QtGui import QDrag`
*前面我们提过 `setAcceptDrops` 和 `dropEvent`（接收端），现在我们讲 **发送端**：如何把拖拽的东西从一个控件发出去。*

- **`QDrag(source: QWidget)`**
  **中文**：构造拖拽操作对象。
  **参数**：`source` – 发起拖拽的控件（通常是 `self`）。

- **`setMimeData(data: QMimeData)`**
  **中文**：设置拖拽携带的数据。
  ```python
  drag = QDrag(self)
  mime = QMimeData()
  mime.setText("这是要拖出去的数据")
  drag.setMimeData(mime)
  ```

- **`setPixmap(pixmap: QPixmap)`**
  **中文**：设置鼠标跟随拖动的图标（如一个半透明的图标）。
  ```python
  drag.setPixmap(QPixmap("drag_icon.png").scaled(32, 32))
  ```

- **`setHotSpot(point: QPoint)`**
  **中文**：设置热区（跟随鼠标的图标相对于鼠标箭头的偏移）。

- **`exec_(supportedActions: Qt.DropActions, defaultAction: Qt.DropAction = Qt.MoveAction)`**
  **中文**：**执行拖拽动作**，阻塞在此处直到用户松开鼠标。
  **返回**：用户最终选择的放置行为（如 `Qt.MoveAction`、`Qt.CopyAction` 或 `Qt.IgnoreAction`）。
  ```python
  # 一般在鼠标按下事件 (mousePressEvent) 中触发：
  def mousePressEvent(self, event):
      if event.button() == Qt.LeftButton:
          drag = QDrag(self)
          mime = QMimeData()
          mime.setText(self.text())
          drag.setMimeData(mime)
          # 执行拖拽
          result = drag.exec_(Qt.CopyAction | Qt.MoveAction)
          if result == Qt.MoveAction:
              self.setText("") # 如果是移动操作，拖完后清空自身文字
  ```

---

## 七、 多线程 UI 更新与界面防卡死机制
**导入**：`from PySide6.QtCore import QThread, Signal, QObject`

### 7.1 QThread + 信号槽（标准安全跨线程通信）
*绝对不要在工作线程内部直接调用 `ui_label.setText("xx")`，这会引发崩溃！必须用 信号/槽 机制。*
```python
class Worker(QThread):
    progress = Signal(int)
    def run(self):
        for i in range(101):
            self.progress.emit(i)
            self.msleep(50)

class MainWindow(QMainWindow):
    def __init__(self):
        super().__init__()
        self.worker = Worker()
        self.worker.progress.connect(self.update_ui) # 跨线程自动转为排队连接
        self.worker.start()
    
    def update_ui(self, val):
        self.ui.progressBar.setValue(val) # 安全！
```

### 7.2 极底层跨线程安全调用 QMetaObject.invokeMethod
*在某些复杂场景下，如果你需要在非 UI 线程中直接**强制**在主线程执行一个函数，或者你需要让工作线程去操作不属于它的 UI，使用此“万金油”手法。*

**导入**：`from PySide6.QtCore import QMetaObject, Qt`

- **`QMetaObject.invokeMethod(obj: QObject, method: str, connectionType: Qt.ConnectionType, ...)`**
  **中文**：强制将一个对象的某个方法，在指定的线程上下文（UI 线程）中执行。
  ```python
  # 在子线程的某个地方：
  import functools
  # 使用 functools.partial 封装带参函数
  QMetaObject.invokeMethod(self.main_window, 
                           "update_text", 
                           Qt.QueuedConnection,
                           Q_ARG(str, "这是子线程推上来的数据"))
  ```
  *注：`Q_ARG` 是 PySide6 的类型包装机制。*

### 7.3 QApplication.processEvents —— 强制处理事件防止界面冻结
*如果你有一个非常耗时的循环（如 100 万次计算），可以直接用 `for` 循环。这时候为了保证 UI 界面不彻底卡死，可以在循环里定期抛出处理权。*
```python
def long_running_task(self):
    for i in range(1000000):
        # ... 繁重计算 ...
        if i % 1000 == 0:
            QApplication.processEvents() # 让 UI 喘口气，保持界面响应
```

---

## 八、 QGraphicsScene 与 QGraphicsView —— 2D 图形视图框架（高阶绘图）
**导入**：`from PySide6.QtWidgets import QGraphicsScene, QGraphicsView, QGraphicsRectItem`
*为了绘制**成百上千**个可交互的复杂图形（像画图板、地图编辑器、流程图），用 `QWidget` 和 `QPainter` 会非常卡顿，而 `QGraphicsView` 和 `QGraphicsScene` 是 Qt 专门为此设计的终极利器。*

- **`QGraphicsScene(parent: QObject = None)`**
  **中文**：2D 图形场景，一个用于容纳（图元）Item 的虚拟画布（坐标是无限的）。
  ```python
  scene = QGraphicsScene()
  ```

- **`QGraphicsView(scene: QGraphicsScene, parent: QWidget = None)`**
  **中文**：图形视图，它是一个 `QWidget`，用于显示场景的画布，并提供了强大的缩放、旋转、拖拽查看功能。
  ```python
  view = QGraphicsView(scene, self)
  ```

- **`scene.addItem(item: QGraphicsItem)`**
  **中文**：向场景中添加图元。图元可以是 `QGraphicsRectItem`（矩形）、`QGraphicsEllipseItem`（圆形）、`QGraphicsLineItem`（线）、`QGraphicsTextItem`（文字）甚至你自定义继承的 `QGraphicsItem`。
  ```python
  rect = QGraphicsRectItem(0, 0, 50, 50)
  rect.setBrush(QBrush(QColor("red")))
  rect.setFlags(QGraphicsItem.ItemIsMovable) # 允许图元被鼠标拖拽移动
  scene.addItem(rect)
  ```

- **`view.setRenderHint(QPainter.Antialiasing)`** (开启抗锯齿)
  ```python
  view.setRenderHint(QPainter.Antialiasing)
  ```

- **`view.setDragMode(mode: QGraphicsView.DragMode)`**
  **中文**：设置视图拖拽模式（当在视图中没有点击到图元时发生什么）。
  **参数**：
  - `QGraphicsView.NoDrag`：无操作。
  - `QGraphicsView.ScrollHandDrag`：鼠标变为手型，可拖拽平移画布（类似地图App）。
  - `QGraphicsView.RubberBandDrag`：鼠标拖拽出一个矩形框，可选择框内的所有图元。
  ```python
  view.setDragMode(QGraphicsView.ScrollHandDrag)
  ```

---

## 九、 信号与槽高级用法扩充
**导入**：`from PySide6.QtCore import QObject, Signal, Slot`

- **`Signal(类型1, 类型2, ...)`**
  **中文**：定义多参数自定义信号，允许信号携带多个数据。
  ```python
  class Worker(QObject):
      progress_updated = Signal(str, int)
  ```

- **`@Slot()` 装饰器**
  **中文**：显式声明槽函数（强调一下这是严格绑定用的）。
  **作用**：虽然不是强制要求的，但加上 `@Slot` 能让 PySide6 在绑定信号时进行类型检查和优化，尤其是涉及多线程 `Qt.QueuedConnection` 时，强烈推荐。
  ```python
  from PySide6.QtCore import Slot
  
  class MainWindow(QWidget):
      def __init__(self):
          super().__init__()
          self.worker = Worker()
          self.worker.progress_updated.connect(self.on_progress)
          
      @Slot(str, int)  # 显式注明槽接收的参数类型
      def on_progress(self, msg, val):
          print(f"{msg}: {val}%")
  ```

- **`connect(slot, type: Qt.ConnectionType)`**
  **中文**：指定连接类型进行绑定。对多线程安全性至关重要。
  **参数（非常重要）**：
  - `Qt.AutoConnection`：默认。如果信号和槽属于同一线程，同步调用；如果跨线程，自动排队。
  - `Qt.DirectConnection`：同步直接调用（发射后立刻执行，常有线程安全风险，除非用锁）。
  - `Qt.QueuedConnection`：跨线程安全。信号发射后，槽会在接收者所在线程的事件循环中被调用。
  ```python
  self.worker.progress_updated.connect(self.on_progress, Qt.QueuedConnection)
  ```

---

## 十、 官方工具集成：Qt Designer + `pyside6-uic`
*这是 PySide6 工业化开发的标配：界面用拖拽设计，逻辑用 Python 写。*

### 10.1 快速命令行转换（最常用）
**命令**：`pyside6-uic 你的界面.ui -o ui_你的界面.py`
**作用**：将在 `Qt Designer` 中画好的 `.ui` 文件，直接转化为纯 Python 类代码文件。

### 10.2 经典加载方法（在 main.py 中集成）
*不要直接修改 `ui_你的界面.py`！推荐采用“继承加载法”：*
```python
from PySide6.QtWidgets import QApplication, QMainWindow
from ui_你的界面 import Ui_MainWindow

class MyWindow(QMainWindow, Ui_MainWindow):
    def __init__(self):
        super().__init__()
        self.setupUi(self)  # 核心：调用 UI 类的方法初始化界面
        self.pushButton.clicked.connect(self.on_btn_click)

    def on_btn_click(self):
        print("业务逻辑触发")
```

### 10.3 QUiLoader 动态加载法（无需生成代码）
**导入**：`from PySide6.QtUiTools import QUiLoader`
*如果你不想每次修改 UI 后重新运行 `pyside6-uic`，可以使用 QUiLoader 动态加载 `.ui` 文件。*
```python
loader = QUiLoader()
file = QFile("my_interface.ui")
file.open(QFile.ReadOnly)
window = loader.load(file)
file.close()

window.pushButton.clicked.connect(lambda: print("动态加载的按钮"))
window.show()
```

### 10.4 在 Designer 中“提升”自定义控件（Promoted Widgets）
*你在 Designer 里拖了一个基础 `QWidget`，但你想在 Python 里把它变为你自己写的 `MyCustomWidget`，需要在 Designer 里进行“提升”。*
1. 右键点击该控件 -> `Promote to...`。
2. 填写 `Base class name`（如 `QWidget`）和 `Promoted class name`（如 `MyCustomWidget`）。
3. 保存 `.ui`。转换出的代码会自动把类型替换为 `MyCustomWidget`，你只需要在项目中定义好这个类即可。

---

## 附录：PySide6 官方内置可视化工具汇总
*这些工具是通过 `pip install PySide6` 自动安装到你的 `venv\Scripts` 目录下的，直接打开终端输入命令即可。*

- **`pyside6-designer`**：**界面设计器**。鼠标拖拽生成 `.ui` 文件。
- **`pyside6-uic 界面.ui -o ui_界面.py`**：**UI 转代码工具**。将 `.ui` 转成 Python 类。
- **`pyside6-rcc 资源.qrc -o 资源_rc.py`**：**资源转换工具**。将图标和图片打包成代码。
- **`pyside6-linguist`**：**国际化翻译工具**。管理多语言翻译文件。
- **`pyside6-assistant`**：**离线文档阅读器**。如果你从官网下载了 Qt 文档，可以放在里面离线阅读类说明。

---

## 十一、 高级补充遗漏细节（动画与性能计时）

- **`QPropertyAnimation(target: QObject = None, propertyName: bytes = b"", parent: QObject = None)`**
  **中文**：属性动画引擎。
  **作用**：这是 Qt 实现现代桌面应用丝滑过渡动画的核心工具。它可以让任何一个 `QWidget` 的属性（例如 `geometry` 位置与大小、`pos` 坐标、`rotation` 旋转角度、`opacity` 透明度）随着时间**平滑插值过渡**。例如让一个控件从左边**滑入**，或者实现平滑的**淡入淡出**效果。
  ```python
  from PySide6.QtCore import QPropertyAnimation, QPoint, QRect
  from PySide6.QtWidgets import QPushButton

  btn = QPushButton("飞入按钮", self)
  
  # 1. 构造动画对象，目标设定为按钮，属性为 "geometry"
  anim = QPropertyAnimation(btn, b"geometry")
  anim.setDuration(1000)                            # 动画持续 1000毫秒（1秒）
  anim.setStartValue(QRect(btn.x(), btn.y(), 0, 0)) # 起始宽高为 0
  anim.setEndValue(QRect(100, 100, 100, 40))        # 结束时在 (100,100) 处，宽100 高40
  anim.start()                                      # 开始播放
  ```

- **`setTargetObject(target: QObject)`** / **`setPropertyName(propertyName: bytes)`** / **`setStartValue(value: QVariant)`** / **`setEndValue(value: QVariant)`** / **`setDuration(msecs: int)`** / **`setLoopCount(count: int)`**
  **中文**：属性动画的完整参数配置链。`setLoopCount(-1)` 可以设置无限循环。
  ```python
  # 示例：让一个按钮无限循环上下浮动
  anim = QPropertyAnimation(btn, b"pos")
  anim.setDuration(2000)
  anim.setStartValue(QPoint(100, 100))
  anim.setEndValue(QPoint(100, 300))
  anim.setLoopCount(-1) # 无限循环
  anim.start()
  ```

- **`QParallelAnimationGroup(parent: QObject = None)`**
  **中文**：并行动画组。
  **作用**：用于同时播放多个动画。你可以将多个 `QPropertyAnimation` 对象添加到这个组中，调用 `start()` 时，**所有子动画会同步并发执行**。常用来做复杂的进场特效（比如窗口背景渐变的同时，内部的按钮同时飞入）。
  ```python
  from PySide6.QtCore import QParallelAnimationGroup

  anim1 = QPropertyAnimation(btn1, b"geometry")
  anim2 = QPropertyAnimation(btn2, b"geometry")

  group = QParallelAnimationGroup(self)
  group.addAnimation(anim1)
  group.addAnimation(anim2)
  group.start() # 两个按钮同时飞入
  ```

- **`QSequentialAnimationGroup(parent: QObject = None)`**
  **中文**：串行动画组。
  **作用**：如果你希望一个动画**执行完毕后**，再接着执行下一个动画，使用这个组。它还提供了 `addPause(msecs: int)`，可以在两个动画之间加入一段停顿。
  ```python
  from PySide6.QtCore import QSequentialAnimationGroup
  
  seq_group = QSequentialAnimationGroup(self)
  seq_group.addAnimation(anim1)   # 先执行 anim1
  seq_group.addPause(500)         # 暂停 500ms
  seq_group.addAnimation(anim2)   # 再执行 anim2
  seq_group.start()
  ```

- **`QElapsedTimer()`**
  **中文**：高精度性能计时器（单例模式）。
  **作用**：用于快速测算两段代码执行之间的耗时。它是基于操作系统的底层高精度时钟实现的，比 Python 原生的 `time.time()` 更精准，且完全融入 Qt 的事件循环体系，非常适合用于性能优化定位卡顿。
  ```python
  from PySide6.QtCore import QElapsedTimer

  timer = QElapsedTimer()
  timer.start()
  
  # 执行一段需要测试耗时的复杂代码...
  for i in range(1000000):
      pass
  
  # 获取已经过的毫秒数
  elapsed = timer.elapsed()
  print(f"代码执行耗时: {elapsed} 毫秒")
  
  # 也可以调用 restart()，它会先重置计时器，并返回自上次启动以来的时间
  # interval = timer.restart()
  ```

- **`hasExpired(msecs: int)`**
  **中文**：判断自启动/上次重置以来，是否已经超过了指定的 `msecs` 毫秒数。
  ```python
  if timer.hasExpired(2000):
      print("已经过去 2 秒了")
  ```

---

