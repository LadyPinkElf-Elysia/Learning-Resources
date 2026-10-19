# 📘 PySide6 桌面开发：从入门到进阶完整知识体系

这份知识体系由 12 份核心文档构成，梳理了 PySide6 开发的完整脉络。建议你**按照下方的顺序**进行学习，熟练掌握后，你就能独立完成具有企业级水准的桌面应用程序开发。

> 💡 **使用提示**：所有文档均存放在 `html/` 文件夹下，点击文档标题即可直接跳转阅读。

[简要介绍](./PySide6/PySide6.html)

---

## 🧱 第一阶段：地基与核心基类（必须掌握）
这一阶段主要理解 PySide6 的底层逻辑和所有可视化控件的根基。如果你不懂信号与槽，或者不懂 `QWidget` 的工作原理，后面的代码都将无法理解。

- **[QObject 家族](./PySide6-QObject/PySide6-QObject.html)**
  - **要点**：理解 `QObject` 是所有对象的祖先；掌握 `QApplication` 的单例管理模式；学会使用 `QThread` 处理耗时任务而不卡死界面；**重中之重是彻底消化“信号与槽（Signal & Slot）”**，这是 PySide6 事件通信的灵魂。

- **[QWidget 基类](./PySide6-QWidget/PySide6-QWidget.html)**
  - **要点**：掌握尺寸、位置（`geometry`、`move`）、显示与隐藏（`show`）、事件拦截（`keyPressEvent`、`closeEvent`）的基础操作。这是所有 UI 控件的底层支撑。

---

## 🏗️ 第二阶段：窗口结构与框架（搭建骨架）
有了基础之后，你需要了解怎么搭建标准的桌面软件骨架。软件的主体是主窗口（菜单、工具条）和对话框（弹窗提示）。

- **[QMainWindow 主窗口框架](./PySide6-QWidget-QMainWindow/PySide6-QWidget-QMainWindow.html)**
  - **要点**：理解中心部件（`centralWidget`）、菜单栏、工具栏和状态栏的布局，以及 `QDockWidget`（可停靠窗口）的拖拽交互。

- **[QDialog 对话框家族](./PySide6-QWidget-QDialog/PySide6-QWidget-QDialog.html)**
  - **要点**：掌握模态与非模态对话框；学会使用标准的 `QMessageBox` 提示框、`QFileDialog` 文件选择器，以及如何创建自定义弹窗。

---

## 🧩 第三阶段：基础控件与容器排布（拼装零件）
这是日常开发中花费时间最长的阶段：把按钮、输入框用“布局管理器”组合到一起。

- **[基础控件家族](./PySide6-QWidget-Controls/PySide6-QWidget-Controls.html)**
  - **要点**：`QPushButton`、`QLabel`、`QCheckBox`、`QComboBox`、`QGroupBox` 的常用属性与信号。

- **[输入与调节家族](./PySide6-QWidget-Inputs/PySide6-QWidget-Inputs.html)**
  - **要点**：`QLineEdit`、`QTextEdit` 的文本读取与过滤；`QSpinBox`、`QSlider`、`QProgressBar` 的数值控制；以及性能极佳的 `QPlainTextEdit`。

- **[容器与数据展示](./PySide6-QWidget-Containers/PySide6-QWidget-Containers.html)**
  - **要点**：`QTabWidget` 多页面切换、`QStackedWidget` 堆叠卡片、`QSplitter` 拖拽分割面板；以及展示数据的 `QListWidget`、`QTableWidget` 和树形结构 `QTreeWidget`。

- **[布局管理器家族](./PySide6-QLayout/PySide6-QLayout.html)**
  - **要点**：你必须抛弃手写坐标（`move`），学会使用 `QVBoxLayout`、`QHBoxLayout`、`QGridLayout` 和 `QFormLayout` 实现自适应界面。**理解 `QSizePolicy` 是掌控控件如何伸缩的核心精髓。**

---

## ⚙️ 第四阶段：高级交互与底层机制（进阶实战）
掌握了上面的拼图后，就可以做商业级桌面软件的核心交互了。

- **[菜单与动作体系](./PySide6-QWidget-Menus/PySide6-QWidget-Menus.html)**
  - **要点**：`QAction` 将菜单、工具栏统一管理，实现全局快捷键（菜单栏代替散落的界面按钮）。

- **[高阶与进阶机制](./PySide6-Advanced/PySide6-Advanced.html)**
  - **要点**：学习 `QPainter` 进行自定义绘制（抗锯齿、画矩形/圆）；使用 `QSettings` 保存用户配置（窗口大小、历史记录）；掌握 `QTimer` 定时器、`QDrag` 拖动事件，以及 Qt Designer 可视化工具的配合使用。

- **[扩展与补充模块](./PySide6-Extensions/PySide6-Extensions.html)**
  - **要点**：系统托盘图标（`QSystemTrayIcon`），调用外部子进程（`QProcess`），内嵌网页（`QWebEngineView`），播放 GIF 动图（`QMovie`），以及为控件添加阴影特效（`QGraphicsDropShadowEffect`）。

---

## 🧰 第五阶段：开发助手（弹药库）

- **[核心枚举速查手册](./PySide6-Enums/PySide6-Enums.html)**
  - **要点**：解决 Pylance 时常报错“`Qt.xxx` 属性未知”的问题。在这里你可以快速查到 `Qt.WindowType`、`Qt.KeyboardModifier`、`QMessageBox.StandardButton` 等枚举的标准写法，避免硬编码数字。

---

## 📖 推荐学习策略

1. **先看 `QWidget` 和 `QMainWindow`**：先建立界面的可视化轮廓。
2. **再攻 `QObject` 的信号与槽**：理解事件是如何传递的，这是打通 PySide6 任督二脉的关键。
3. **多练 `QLayout` 与 `QWidget-Controls`**：抛弃手动计算坐标，把界面搭出来。
4. **善用 `PySide6-Enums.html`**：如果代码里出现不明原因的黄线报错，优先查这个文件。由于 PySide6 底层是 C++ 的绑定，枚举的路径经常不是直觉中的 `Qt.ControlModifier`，而是 `Qt.KeyboardModifier.ControlModifier`。
5. **最后研究 `Advanced`**：当界面能用后，再去研究自定义绘图、保存配置和进程调用，你的开发能力将跃升至专业水平。

