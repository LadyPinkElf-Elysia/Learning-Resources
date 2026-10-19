# PySide6-Enums

> 💡 **使用提示**：PySide6 是 C++ 的 Python 绑定，严格区分命名空间。  
> 在早期版本（或使用某些别名时），你可能会习惯写 `Qt.Window`，但标准写法是 `Qt.WindowType.Window`；写 `Qt.Key_S` 是错的，必须写 `Qt.Key.Key_S`。  
> **遇到 Pylance 的“属性未知”报错时，请按下面表格里的“标准写法”替换。**

---

## 一、 窗口、对话框与状态 (`Qt.WindowType` / `Qt.WindowState`)

| 标准枚举路径 | 中文释义 | 常用场景 |
| :--- | :--- | :--- |
| `Qt.WindowType.Window` | 标准窗口 | 默认顶级窗口属性 |
| `Qt.WindowType.Dialog` | 对话框 | 无最大/最小化按钮，通常用于模态弹出 |
| `Qt.WindowType.Popup` | 弹出式窗口 | 菜单、下拉框，点击窗口外自动消失 |
| `Qt.WindowType.Tool` | 工具窗口 | 通常是浮动小面板，不显示在系统任务栏 |
| `Qt.WindowType.FramelessWindowHint` | **无边框窗口** | 去掉系统自带的标题栏和边框，做“游戏启动器”、“自定义炫酷主界面”必用 |
| `Qt.WindowType.WindowStaysOnTopHint` | **窗口置顶** | 始终浮在所有应用上方（如截图工具） |
| `Qt.WindowType.WindowStaysOnBottomHint` | 窗口置底 | 始终在底层，用于辅助背景设计 |
| `Qt.WindowState.WindowNoState` | 恢复正常 | 窗口从全屏或最大化恢复默认大小 |
| `Qt.WindowState.WindowMaximized` | 最大化 | 窗口充满屏幕，不含任务栏遮盖 |
| `Qt.WindowState.WindowMinimized` | 最小化 | 窗口缩进任务栏 |
| `Qt.WindowState.WindowFullScreen` | 全屏 | 覆盖整个屏幕（包括任务栏），常用于视频播放器 |

---

## 二、 光标形状、焦点策略与鼠标按键

| 标准枚举路径 | 中文释义 | 所属模块 |
| :--- | :--- | :--- |
| `Qt.CursorShape.ArrowCursor` | 默认箭头 | `QWidget.setCursor()` |
| `Qt.CursorShape.PointingHandCursor` | 手形 | 悬停可点击的链接/按钮 |
| `Qt.CursorShape.IBeamCursor` | 文本录入竖线 | `QLineEdit` 输入框 |
| `Qt.CursorShape.WaitCursor` | 等待转圈 | 类似沙漏，表示正在处理耗时的同步操作 |
| `Qt.CursorShape.ForbiddenCursor` | 🚫 禁止符号 | 禁用状态下拖拽或悬停时 |
| `Qt.FocusPolicy.StrongFocus` | 鼠标 + Tab 可获焦 | `QWidget.setFocusPolicy()` 默认值 |
| `Qt.FocusPolicy.ClickFocus` | 仅鼠标点击可获焦 | 适合纯图形交互类组件 |
| `Qt.FocusPolicy.TabFocus` | 仅 Tab 键可获焦 | 方便键盘流操作，忽略鼠标点击 |
| `Qt.FocusPolicy.NoFocus` | **拒绝获得焦点** | 纯装饰性控件（如标签、分割线）彻底不可选中 |
| `Qt.MouseButton.LeftButton` | 鼠标左键 | `mousePressEvent(event.button())` |
| `Qt.MouseButton.RightButton` | 鼠标右键 | 触发上下文菜单 |
| `Qt.MouseButton.MiddleButton` | 鼠标中键 | 按下滚轮 |

---

## 三、 键盘按键与修饰符 (`Qt.Key` / `Qt.KeyboardModifier`)

| 标准枚举路径 | 中文释义 | 细节说明 |
| :--- | :--- | :--- |
| `Qt.Key.Key_Escape` | Esc 键 | 通常用于取消或关闭弹窗 |
| `Qt.Key.Key_Return` | 回车键（主键盘） | 常用于输入框确认 |
| `Qt.Key.Key_Enter` | 回车键（小键盘） | 数字键盘的 Enter |
| `Qt.Key.Key_Tab` | Tab 制表键 | 切换控件焦点 |
| `Qt.Key.Key_A` ~ `Qt.Key.Key_Z` | 字母 A ~ Z | 字母键 |
| `Qt.Key.Key_0` ~ `Qt.Key.Key_9` | 数字键 0 ~ 9 | 顶部数字区 |
| `Qt.Key.Key_F1` ~ `Qt.Key.Key_F12` | 功能键 F1-F12 | 常用于快捷帮助或系统功能 |
| `Qt.Key.Key_Up` / `Qt.Key.Key_Down` | 上/下方向键 | 移动选中项 |
| `Qt.Key.Key_Left` / `Qt.Key.Key_Right` | 左/右方向键 | 移动选中项 |
| `Qt.KeyboardModifier.ControlModifier` | **Ctrl 键** | 与 `event.key()` 配合检测组合键 |
| `Qt.KeyboardModifier.ShiftModifier` | **Shift 键** |  |
| `Qt.KeyboardModifier.AltModifier` | **Alt 键** |  |

> ⚠️ **重要提示**：组合键检测必须用 **位与运算 `&`**，不要用 `==`！
> 正确写法：`(event.modifiers() & Qt.KeyboardModifier.ControlModifier)`
> 错误写法：`(event.modifiers() == Qt.KeyboardModifier.ControlModifier)`（用户按 Ctrl+Shift+S 时，等于号会判 False）。

---

## 四、 标准消息框与按钮角色

| 标准枚举路径 | 中文释义 | 适用组件 |
| :--- | :--- | :--- |
| `QMessageBox.StandardButton.Yes` | 是 | `QMessageBox` 询问框 |
| `QMessageBox.StandardButton.No` | 否 |  |
| `QMessageBox.StandardButton.Ok` | 确定 | 信息提示框 |
| `QMessageBox.StandardButton.Cancel` | 取消 | 退出或放弃操作 |
| `QMessageBox.StandardButton.Save` | 保存 |  |
| `QMessageBox.StandardButton.Discard` | 放弃修改 | 若不保存直接退出 |
| `QDialogButtonBox.StandardButton.Ok` | 确定 | `QDialogButtonBox` 自定义对话框 |
| `QDialogButtonBox.StandardButton.Cancel` | 取消 |  |
| `QDialogButtonBox.ButtonRole.AcceptRole` | 角色：接受 | 点击按钮将触发 `dialog.accept()` |
| `QDialogButtonBox.ButtonRole.RejectRole` | 角色：拒绝 | 点击按钮将触发 `dialog.reject()` |
| `QDialogButtonBox.ButtonRole.ActionRole` | 角色：执行动作 | 类似“应用”，不关闭对话框执行逻辑 |

---

## 五、 对齐方式与方向 (`Qt.AlignmentFlag` / `Qt.Orientation`)

| 标准枚举路径 | 中文释义 | 说明 |
| :--- | :--- | :--- |
| `Qt.AlignmentFlag.AlignLeft` | 左对齐 | 水平靠左 |
| `Qt.AlignmentFlag.AlignRight` | 右对齐 | 水平靠右 |
| `Qt.AlignmentFlag.AlignHCenter` | 水平居中 | 仅水平居中 |
| `Qt.AlignmentFlag.AlignTop` | 靠上 | 垂直靠上 |
| `Qt.AlignmentFlag.AlignBottom` | 靠下 | 垂直靠下 |
| `Qt.AlignmentFlag.AlignVCenter` | 垂直居中 | 仅垂直居中 |
| `Qt.AlignmentFlag.AlignCenter` | **完全居中** | 水平 + 垂直同时居中（极常用） |
| `Qt.Orientation.Horizontal` | 水平 | 适用于 `QSlider`、`QSplitter`、`QHBoxLayout` |
| `Qt.Orientation.Vertical` | 垂直 | 适用于 `QSlider`、`QSplitter`、`QVBoxLayout` |

---

## 六、 输入框与回显模式 (`QLineEdit.EchoMode`)

| 标准枚举路径 | 中文释义 | 说明 |
| :--- | :--- | :--- |
| `QLineEdit.EchoMode.Normal` | 正常显示 | 默认 |
| `QLineEdit.EchoMode.NoEcho` | **完全不显示** | 输入时连星号都没有，极高度敏感信息专用 |
| `QLineEdit.EchoMode.Password` | 密码掩码 | 输入内容显示为星号 / 圆点 |
| `QLineEdit.EchoMode.PasswordEchoOnEdit` | 编辑时暂显 | 输入过程中显示真实字符，聚焦丢失后变星号 |

---

## 七、 列表与表格控件交互模式

| 标准枚举路径 | 中文释义 | 效果 |
| :--- | :--- | :--- |
| `QAbstractItemView.SelectionMode.SingleSelection` | 单选 | 默认，只能选中一行/一个单元格 |
| `QAbstractItemView.SelectionMode.ExtendedSelection` | 扩展多选 | 按住 Ctrl 可跳选，按住 Shift 可连选 |
| `QAbstractItemView.SelectionMode.MultiSelection` | 鼠标多选 | 不需要按 Ctrl，鼠标点击即可多选 |
| `QAbstractItemView.SelectionMode.NoSelection` | 禁止选中 | 仅供查看，防篡改 |
| `QAbstractItemView.EditTrigger.NoEditTriggers` | **禁止编辑** | 用户无法修改表格内容 |
| `QAbstractItemView.EditTrigger.DoubleClicked` | 双击编辑 | 常见的单元格内容修改方式 |
| `QAbstractItemView.SelectionBehavior.SelectRows` | 点击整行 | 点击任意单元格，整行高亮 |
| `QAbstractItemView.SelectionBehavior.SelectColumns` | 点击整列 | 点击任意单元格，整列高亮 |

---

## 八、 图形、颜色与字体引擎

| 标准枚举路径 | 中文释义 | 说明 |
| :--- | :--- | :--- |
| `Qt.GlobalColor.black` | 黑色 | `QColor` |
| `Qt.GlobalColor.white` | 白色 |  |
| `Qt.GlobalColor.red` | 红色 |  |
| `Qt.GlobalColor.green` | 绿色 |  |
| `Qt.GlobalColor.blue` | 蓝色 |  |
| `QFont.Weight.Normal` | 正常字重 | `QFont.setWeight()` |
| `QFont.Weight.Bold` | 粗体 |  |
| `QPainter.RenderHint.Antialiasing` | **开启抗锯齿** | `QPainter.setRenderHint()`，绘制曲线和斜线平滑必开 |
| `QPainter.RenderHint.TextAntialiasing` | 文字抗锯齿 | 让文字的边缘更平滑 |

---

## 九、 布局约束与滚动条策略

| 标准枚举路径 | 中文释义 | 说明 |
| :--- | :--- | :--- |
| `QLayout.SizeConstraint.SetFixedSize` | 锁定包裹尺寸 | `QLayout.setSizeConstraint()`，弹出窗口大小自动紧贴内部控件 |
| `Qt.ScrollBarPolicy.ScrollBarAlwaysOn` | 始终显示滚动条 | `QScrollArea.setVerticalScrollBarPolicy()` |
| `Qt.ScrollBarPolicy.ScrollBarAlwaysOff` | 始终隐藏滚动条 | 禁止滚动，超出的部分被裁切 |
| `Qt.ScrollBarPolicy.ScrollBarAsNeeded` | 根据内容自动显示 | 默认值，内容多时显示，少时隐藏 |

---

## 十、 拖拽动作与文件对话框行为

| 标准枚举路径 | 中文释义 | 说明 |
| :--- | :--- | :--- |
| `Qt.DropAction.CopyAction` | 复制拖拽 | `drag.exec_()` 返回值，表示用户希望复制 |
| `Qt.DropAction.MoveAction` | 移动拖拽 | 拖拽后删除原数据 |
| `QFileDialog.AcceptMode.AcceptOpen` | 打开模式 | `QFileDialog.setAcceptMode()`，按钮显示“打开” |
| `QFileDialog.AcceptMode.AcceptSave` | 保存模式 | 按钮显示“保存”，允许选择不存在的文件名 |
| `QFileDialog.FileMode.ExistingFile` | 只选单个现有文件 | 限制用户必须选中一个已经存在的文件 |
| `QFileDialog.FileMode.Directory` | 选文件夹 | 只允许选目录，不能选文件 |
| `QFileDialog.FileMode.AnyFile` | 任何文件 | 允许用户输入一个不存在的文件名 |
| `QFileDialog.Option.DontUseNativeDialog` | 不使用系统原生弹窗 | 强制用 Qt 自己画的文件选择窗口（便于定制界面） |

---

## 附录：为什么 `Qt.WindowType` 和 `Qt.Window` 不通用？

在 PySide6 中，底层 C++ 的 `Qt` 命名空间被拆分成了 Python 的各个枚举子类。严格来说：
- `Qt.WindowType` 是一个 **枚举类**。
- `Qt.WindowType.Window` 是这个枚举类里的一个 **枚举值**。
- 你在旧教程里可能看到过 `Qt.Window`，它是为了兼容老版本保留下来的“别名”。但 Python 的静态检查（Pylance）不喜欢别名，它只认官方标准路径。

**总结**：以后遇到任何 `Qt.xxx` 报错，先怀疑是不是**枚举层级少了一级**。最常见的情况是：
- ❌ 原写法：`Qt.Key_Escape`
- ✅ 修正为：`Qt.Key.Key_Escape`
- ❌ 原写法：`Qt.ControlModifier`
- ✅ 修正为：`Qt.KeyboardModifier.ControlModifier`
- ❌ 原写法：`Qt.LeftButton`
- ✅ 修正为：`Qt.MouseButton.LeftButton`