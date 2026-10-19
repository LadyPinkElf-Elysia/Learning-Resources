# CSS
## 核心功能

### 默认样式重置

- 默认样式
    浏览器给很多元素自带默认样式，写页面前通常先清掉，否则每个组件都要单独覆盖
    | 元素 | 浏览器默认值 | 常见重置 |
    |:--|:--|:--|
    | `body` | `margin: 8px` | `margin: 0` |
    | `h1` ~ `h6` | 上下 `margin`、不同字号和字重 | `margin: 0; font-size: inherit; font-weight: inherit` |
    | `p` | 上下 `margin` | `margin: 0` |
    | `ul` / `ol` | `padding-left: 40px`、`list-style` | `padding: 0; list-style: none` |
    | `a` | 蓝色、下划线 | `color: inherit; text-decoration: none` |
    | `img` | 行内元素、底部有空隙 | `display: block; max-width: 100%` |
    | `button` | 灰色背景、边框、默认字体 | `background: none; border: none; font: inherit; cursor: pointer` |
    | `input` / `textarea` | 默认边框、默认字体 | `font: inherit; border: 1px solid #ccc` |
    | `table` | 单元格间距 | `border-collapse: collapse` |
    | `iframe` | 默认边框 | `border: none` |

- 最小重置
    现代项目常用的一段，只清最烦人的几项
    ```css
    *,
    *::before,
    *::after {
        box-sizing: border-box;
    }

    body {
        margin: 0;
    }

    h1, h2, h3, h4, h5, h6, p {
        margin: 0;
    }

    ul, ol {
        margin: 0;
        padding: 0;
        list-style: none;
    }

    a {
        color: inherit;
        text-decoration: none;
    }

    img {
        display: block;
        max-width: 100%;
    }

    button,
    input,
    select,
    textarea {
        font: inherit;
        color: inherit;
    }

    button {
        background: none;
        border: none;
        cursor: pointer;
    }
    ```
    不建议用 `* { margin: 0; padding: 0 }` 暴力重置，它会把所有间距清空，后面想用默认间距还得一个个加回来。

- `normalize.css` 和 `Reset` 的区别
    | 对比项 | `Reset` | `Normalize` |
    |:--|:--|:--|
    | 思路 | 把默认样式全部清掉 | 保留有用的默认值，只修正浏览器差异 |
    | 结果 | 所有元素从零开始 | 标题还是标题、列表还是列表，但跨浏览器一致 |
    | 适合 | 完全自定义的 UI 项目 | 内容型网站、需要保留语义默认样式的项目 |

### 基础语法

可利用这个网址[练习](https://css-speedrun.netlify.app/)

- 选择器
    选择器决定样式作用在哪些元素上，是 CSS 的地基
    | 类型 | 写法 | 含义 |
    |:--|:--|:--|
    | 标签选择器 | `div` | 所有 `<div>` |
    | 类选择器 | `.box` | `class="box"` 的元素 |
    | ID 选择器 | `#app` | `id="app"` 的元素，页面内唯一 |
    | 通配选择器 | `*` | 所有元素 |
    | 属性选择器 | `[type="text"]` | 有该属性的元素 |
    | 伪类 | `:hover` | 特定状态的元素 |
    | 伪元素 | `::before` | 元素的一部分，如首行、前后插入内容 |

    ```css
    div { 
        color: red; 
    }
    .box { 
        color: red; 
    }
    #app {
        color: red; 
    }
    * { 
        box-sizing: border-box; 
    }
    input[type="text"] { 
        border: 1px solid #ccc; 
    }
    a:hover { 
        text-decoration: underline; 
    }
    p::first-line { 
        font-weight: bold; 
    }
    ```

- 组合器
    用符号连接多个选择器，表达元素之间的关系
    | 写法 | 名称 | 含义 |
    |:--|:--|:--|
    | `.a .b` | 后代选择器 | `.a` 内部所有 `.b`，不管嵌套多深 |
    | `.a > .b` | 子代选择器 | `.a` 的直接子元素 `.b` |
    | `.a + .b` | 相邻兄弟 | 紧跟在 `.a` 后面的同级 `.b` |
    | `.a ~ .b` | 通用兄弟 | `.a` 后面所有同级 `.b` |
    | `.a, .b` | 并集 | 同时选中 `.a` 和 `.b` |
    ```css
    .nav a { color: #333; }        /* 后代 */
    .nav > li { list-style: none; } /* 直接子元素 */
    h2 + p { margin-top: 0; }       /* 紧邻的下一个 p */
    h2 ~ p { color: #666; }         /* 后面所有 p */
    h1, h2, h3 { font-weight: 600; } /* 并集 */
    ```

- 伪类
    选中元素的某种状态或位置，常用前缀 `:`（单冒号）
    | 选项值 | 释义 |
    |:--|:--|
    | `:hover` | 鼠标悬停 |
    | `:focus` | 获得焦点 |
    | `:focus-visible` | 键盘聚焦时触发，鼠标点击不触发 |
    | `:active` | 被按下 |
    | `:visited` | 访问过的链接 |
    | `:first-child` / `:last-child` | 父元素下第一个 / 最后一个子元素 |
    | `:nth-child(n)` | 第 n 个子元素，`2n` 表示偶数，`odd` / `even` 也行 |
    | `:not(.a)` | 不匹配 `.a` 的元素 |
    | `:is(.a, .b)` | 匹配其中任一选择器 |
    | `:where(.a, .b)` | 同 `:is()`，但权重为 0 |
    ```css
    .button:hover { background: #3d5ce0; }
    .button:focus-visible { outline: 2px solid #4f6ef7; }
    li:first-child { margin-top: 0; }
    li:nth-child(2n) { background: #f9f9f9; }
    input:not([type="hidden"]) { border: 1px solid #ccc; }
    ```

- 伪元素
    选中元素的一部分或生成虚拟内容，常用双冒号 `::`
    | 选项值 | 释义 |
    |:--|:--|
    | `::before` / `::after` | 在元素内容前后插入内容，必须配合 `content` |
    | `::first-line` | 第一行文字 |
    | `::first-letter` | 第一个字母 |
    | `::placeholder` | 输入框占位文字 |
    | `::selection` | 用户选中的文字 |
    ```css
    .tooltip::after {
        content: attr(data-tip);
        position: absolute;
        top: 100%;
        left: 50%;
        transform: translateX(-50%);
    }
    p::first-letter { font-size: 2em; }
    input::placeholder { color: #9ca3af; }
    ::selection { background: #4f6ef7; color: #fff; }
    ```

- 颜色值
    常用四种写法，效果都是指定颜色
    | 写法 | 示例 | 说明 |
    |:--|:--|:--|
    | 颜色关键字 | `red`、`transparent`、`currentColor` | 可读性好，数量有限 |
    | 十六进制 | `#f9f9f9`、`#fff` | 两位一组 RGB，`#fff` 是 `#ffffff` 的缩写 |
    | RGB / RGBA | `rgb(249, 249, 249)`、`rgba(0, 0, 0, 0.5)` | 第四个参数是透明度 0～1 |
    | HSL / HSLA | `hsl(0, 0%, 98%)`、`hsla(0, 0%, 0%, 0.5)` | 色相 0～360、饱和度、亮度 |
    ```css
    .box {
        color: red;
        color: #f9f9f9;
        color: rgb(249, 249, 249);
        color: rgba(0, 0, 0, 0.5); /* 半透明黑 */
        background: currentColor;   /* 跟随当前 color */
        border-color: transparent;  /* 透明 */
    }
    ```
    `currentColor` 是一个特殊关键字，等于当前元素的 `color` 值，做图标、边框跟随文字颜色时很方便。`transparent` 等于完全透明的黑色。

- 单位
    分绝对单位、相对单位、函数三类
    | 单位 | 类型 | 说明 |
    |:--|:--|:--|
    | `px` | 绝对 | 像素，最常用 |
    | `%` | 相对 | 相对于父元素对应属性，`padding` / `margin` 的百分比始终按宽度算 |
    | `em` | 相对 | 相对于当前元素字号，会层层嵌套放大 |
    | `rem` | 相对 | 相对于根元素（`html`）字号，全局一致，推荐 |
    | `vw` / `vh` | 相对 | 视口宽 / 高的 1% |
    | `vmin` / `vmax` | 相对 | 视口宽高中较小 / 较大值的 1% |
    | `ch` | 相对 | 当前字体 `0` 字符的宽度 |
    | `fr` | 相对 | Grid 中按比例分配剩余空间 |
    | `deg` / `turn` | 角度 | `rotate`、`hue` 等使用 |
    | `s` / `ms` | 时间 | `transition`、`animation` 使用 |
    ```css
    .box {
        width: 100%;
        font-size: 1rem;
        height: 100vh;
        margin: 2em;
        transform: rotate(45deg);
        transition: opacity 0.3s;
    }
    ```

- 长度函数
    在一组值里计算或取极值
    | 函数 | 说明 |
    |:--|:--|
    | `calc()` | 混合计算，`+` `-` 两边必须有空格 |
    | `min(a, b)` | 取较小值 |
    | `max(a, b)` | 取较大值 |
    | `clamp(min, val, max)` | 限制在最小和最大之间 |
    ```css
    .box {
        width: calc(100% - 32px); /* 减号两边空格 */
        width: min(100%, 600px);
        font-size: clamp(1rem, 2.5vw, 2rem);
    }
    ```

- 层叠与优先级
    同一个元素被多条规则命中时，按优先级决定谁生效
    | 优先级 | 选择器类型 | 权重 |
    |:--|:--|:--|
    | 1 | 行内样式 `style="..."` | 最高 |
    | 2 | ID 选择器 `#id` | 较高 |
    | 3 | 类、属性、伪类 `.a` `[type]` `:hover` | 中等 |
    | 4 | 标签、伪元素 `div` `::before` | 较低 |
    | 5 | 通配 `*`、组合器 `>` `+` `~` | 最低，权重为 0 |
    ```css
    /* 权重 0,0,1 */
    div { color: red; }

    /* 权重 0,1,0，覆盖上面的 */
    .box { color: blue; }

    /* 权重 1,0,0，覆盖上面的 */
    #app { color: green; }

    /* 权重 0,1,1 */
    div.box { color: purple; }
    ```
    `!important` 会强制覆盖其他规则，优先级最高，但会破坏正常的层叠逻辑，能不用就不用。
    ```css
    .box {
        color: red !important;
    }
    ```
    后写的规则覆盖先写的，前提是权重相同。
    ```css
    .box { color: red; }
    .box { color: blue; } /* 生效 */
    ```

- 继承
    部分属性会从父元素自动传给子元素，不用重复写
    | 属性类型 | 是否继承 | 常见属性 |
    |:--|:--|:--|
    | 文本相关 | 是 | `color`、`font-family`、`font-size`、`line-height`、`text-align` |
    | 盒模型相关 | 否 | `width`、`height`、`margin`、`padding`、`border` |
    | 定位相关 | 否 | `position`、`top`、`z-index` |
    | 背景相关 | 否 | `background-*` |
    ```css
    body {
        color: #333;
        font-family: Arial, sans-serif;
    }
    /* 子元素自动继承 color 和 font-family */
    ```
    四个显式控制继承的关键字：
    | 关键字 | 作用 |
    |:--|:--|
    | `inherit` | 强制继承父元素的值 |
    | `initial` | 恢复为该属性的默认值 |
    | `unset` | 可继承属性等于 `inherit`，不可继承属性等于 `initial` |
    | `revert` | 回退到浏览器默认样式 |
    ```css
    .box {
        border: inherit;   /* 强制继承父级 border */
        color: initial;    /* 恢复默认黑色 */
        margin: unset;     /* margin 不可继承，等于 initial */
    }
    ```

### 尺寸操作

- `width` 宽度 `height` 高度
    | 属性 | 作用 | 默认值 | 常用值 |
    |:--|:--|:--|:--|
    | `width` | 控制元素宽度 | `auto`，块级元素撑满父容器 | `px`、`%`、`calc()`、`fit-content` |
    | `height` | 控制元素高度 | `auto`，由内容撑开 | `px`、`%`、`100vh` |
    | `max-width` / `min-width` | 限制宽度范围 | `none` / `auto` | `px`、`%` |
    | `max-height` / `min-height` | 限制高度范围 | `none` / `auto` | `px`、`vh` |

    ```css
    .box {
        width: 500px;          /* 固定宽度 */
        /* width: 50%; */            /* 父容器的一半 */
        /* width: calc(100% - 32px); */ /* 计算，减号两边要有空格 */
        max-width: 1200px;
        min-height: 200px;
    }
    ```

- `aspect-ratio` 宽高比
    固定元素的宽高比，高度由宽度自动推算
    | 写法 | 说明 |
    |:--|:--|
    | `16 / 9` | 宽 16，高 9 |
    | `1 / 1` | 正方形 |
    | `4 / 3` | 传统照片比例 |
    | `auto` | 默认，不限制 |
    ```css
    .video {
        width: 100%;
        aspect-ratio: 16 / 9;
    }
    .avatar {
        width: 80px;
        aspect-ratio: 1 / 1;
        border-radius: 50%;
    }
    ```
    配 `object-fit: cover` 做图片、视频卡片，图片不会变形。以前用 `padding-top: 56.25%` 做，现在一行搞定。

- `border` 边框
    | 参数 | 子属性 | 说明 |
    |:--|:--|:--|
    | 第一个 | `border-width` | 边框宽度，可单独设置 |
    | 第二个 | `border-style` | 边框样式，默认 `none`，可单独设置 |
    | 第三个 | `border-color` | 边框颜色，英文名 / 十六进制 / RGB |

    `border-style` 常用值：
    |选项值|释义|
    |:--|:--|
    |`none`|无边框|
    |`solid`|单实线|
    |`dashed`|虚线|
    |`dotted`|点线|
    |`double`|双实线|

    ```css
    .box{
        border:1px dotted grey; 
        /*边框宽度 边框样式 边框颜色*/
    }
    ```

- `border-radius` 边框圆角
    可以控制边框的圆角
    | 值个数 | 含义 |
    |:--|:--|
    | `1` | 四角相同 |
    | `2` | 左上右下 / 右上左下 |
    | `3` | 左上 / 右上左下 / 右下 |
    | `4` | 左上 / 右上 / 右下 / 左下 |
    | `50%` | 圆形（宽高相等时） |
    | `50% / 20%` | 椭圆角：水平半径 / 垂直半径 |
    ```css
    .box{
        border-radius:8px; 
        /*以8px为半径画圆使得该圆内切于边框，则圆弧为边框的圆角*/
    }
    ```

- `outline` 轮廓
    画在元素边框外侧的线，不占布局空间
    | 参数 | 子属性 | 说明 |
    |:--|:--|:--|
    | 第一个 | `outline-width` | 轮廓宽度 |
    | 第二个 | `outline-style` | 轮廓样式，常用 `solid` / `dashed` / `dotted` |
    | 第三个 | `outline-color` | 轮廓颜色 |

    `outline-style` 常用值：
    | 选项值 | 释义 |
    |:--|:--|
    | `none` | 无轮廓（默认） |
    | `solid` | 单实线 |
    | `dashed` | 虚线 |
    | `dotted` | 点线 |
    | `double` | 双实线 |

    ```css
    .box {
        outline: 2px solid #4f6ef7;
        outline-offset: 2px; /* 轮廓与边框的距离 */
    }
    ```
    和 `border` 的区别：
    | 对比项 | `border` | `outline` |
    |:--|:--|:--|
    | 占布局空间 | 是 | 否 |
    | 能否单独设某一边 | 能 | 不能，四边统一 |
    | 能否圆角 | 能 | 不能 |
    | 典型用途 | 边框装饰 | 焦点环、调试高亮 |

- `padding` 内边距
    可以控制边框和内容之间的距离
    如果仅有一个参数，那么表示四个方向的距离均为该值
    如果有两个参数，那么第一个值表示上下，第二个值表示左右
    如果有三个参数，那么第一个值表示上，第二个值表示左右，第三个值表示下
    如果有四个参数，那么第一个值表示上，第二个值表示右，第三个值表示下，第四个值表示左（从上开始，顺时针转）
    上述规则为**值复制原则**
    |值个数|值表示|
    |:--|:--|
    |`1`|上下左右|
    |`2`|上下 左右|
    |`3`|上 左右 下|
    |`4`|上 右 下 左|

    ```css
    .box{
        padding: 15px;                    
        /* 四边都是 15px */
        padding: 10px 20px;               
        /* 上下 10px，左右 20px */
        padding: 10px 20px 30px;          
        /* 上 10px，左右 20px，下 30px */
        padding: 10px 20px 30px 40px;     
        /* 上 10px，右 20px，下 30px，左 40px */
    }
    ```
    也可以直接指定单边，可读性较好，`padding-top`(上),`padding-right`(右),`padding-bottom`(下),`padding-left`(左)
    ```css
    .box{
        padding-top: 10px; /*上*/
        padding-right: 20px; /*右*/
        padding-bottom: 30px; /*下*/
        padding-left: 40px; /*左*/
    }
    ```
- `margin` 外边距
    可以控制边框外面和其他元素之间的距离，和`padding`差不多，参数也是值复制原则，也可以直接指定单边
    `margin`支持负值，`padding`不支持
    外边距合并：垂直相邻的两个块级元素，上下`margin`会取较大值，不是相加
    | 对比项 | `padding` | `margin` |
    |:--|:--|:--|
    | 位置 | 边框内侧，内容与边框之间 | 边框外侧，元素与元素之间 |
    | 背景 | 会被背景覆盖 | 透明 |
    | 负值 | 不支持 | 支持 |
    | 百分比基准 | 包含块宽度 | 包含块宽度 |
    | 外边距合并 | 不涉及 | 垂直相邻块级元素会合并 |

    常用写法
    ```css
    .box{
        margin:0 auto; /*块级元素可以用这个实现水平居中,auto为自动计算*/
    }
    ```

- `box-sizing` 盒模型
    | 选项值 | 别名 | `width` 含义 | 总宽计算 |
    |:--|:--|:--|:--|
    | `content-box` | 标准盒 | 只代表内容区宽度 | `width + padding + border` |
    | `border-box` | 怪异盒 | 代表边框盒总宽度 | 等于 `width`，`padding` 和 `border` 从里面扣 |

    ```text
    content-box:
    ┌─────────────────────────────┐
    │ border 5px                  │
    │ ┌─────────────────────────┐ │
    │ │ padding 20px            │ │
    │ │ ┌─────────────────────┐ │ │
    │ │ │ content 200px       │ │ │
    │ │ └─────────────────────┘ │ │
    │ └─────────────────────────┘ │
    └─────────────────────────────┘
    总宽 = 200 + 40 + 10 = 250px

    border-box:
    ┌─────────────────────┐
    │ border 5px          │
    │ ┌─────────────────┐ │
    │ │ padding 20px    │ │
    │ │ ┌─────────────┐ │ │
    │ │ │ content 150 │ │ │
    │ │ └─────────────┘ │ │
    │ └─────────────────┘ │
    └─────────────────────┘
    总宽 = 200px
    ```

### 背景处理

- `background` 简写属性
    是 `background-color`、`background-image`、`background-position`、`background-size`、`background-repeat`、`background-attachment` 的简写
    顺序比较灵活，但常见写法如下：
    | 位置 | 属性 | 默认值 | 作用 |
    |:--|:--|:--|:--|
    | 第一个 | `background-color` | `transparent` | 背景颜色 |
    | 第二个 | `background-image` | `none` | 背景图片 |
    | 第三个 | `background-position` | `0% 0%` | 背景位置 |
    | 第四个（斜杠后） | `background-size` | `auto` | 背景尺寸 |
    | 第五个 | `background-repeat` | `repeat` | 平铺方式 |
    | 第六个 | `background-attachment` | `scroll` | 滚动行为 |

    `background-position` 常用值：

    | 选项值 | 释义 |
    |:--|:--|
    | `0% 0%` | 默认，左上角 |
    | `center` | 居中 |
    | `center center` | 水平垂直都居中 |
    | `top right` | 右上角 |
    | `50% 50%` | 水平垂直各 50% |
    | `20px 40px` | 距左 20px，距上 40px |

    `background-size` 常用值：

    | 选项值 | 释义 |
    |:--|:--|
    | `auto` | 默认，保持图片原始尺寸 |
    | `cover` | 裁剪填满容器，不变形 |
    | `contain` | 完整显示图片，可能留白 |
    | `100% 100%` | 拉伸填满，会变形 |
    | `200px 100px` | 指定宽高，可能变形 |

    `background-repeat`：

    | 选项值 | 释义 |
    |:--|:--|
    | `repeat` | 默认，两个方向平铺 |
    | `no-repeat` | 不平铺 |
    | `repeat-x` | 只水平平铺 |
    | `repeat-y` | 只垂直平铺 |
    | `space` | 平铺，但图片之间留等距空隙 |
    | `round` | 平铺，图片缩放以完整铺满 |

    `background-attachment`：

    | 选项值 | 释义 |
    |:--|:--|
    | `scroll` | 默认，背景随元素滚动 |
    | `fixed` | 背景固定，不随滚动条滚动 |
    | `local` | 背景随元素内容滚动 |

    `background-position` 和 `background-size` 之间必须用斜杠 `/` 分隔，斜杠前是位置，斜杠后是尺寸
    简写里没写的属性会被重置为默认值，之前单独设置的 `background-image` 等会被清掉
    多层背景用逗号分隔，先写的在上层
    ```css
    .box {
        background: #f9f9f9 url(./bg.jpg) center / cover no-repeat;
        /* 颜色 图片 位置 / 尺寸 重复方式 */

        background: #f9f9f9; /* 只有颜色 */
        background: url(./bg.jpg) no-repeat; /* 只有图片和重复方式 */
        background: url(./bg.jpg) center / cover no-repeat; /* 图片铺满 */
        background: #f9f9f9 url(./bg.jpg) center / cover no-repeat fixed; /* 完整写法 */

        /* 多层背景，先写的在上层 */
        background:
            url(./front.png) center / cover no-repeat,
            url(./back.jpg) center / cover no-repeat;
    }
    ```

- `box-shadow` 阴影效果
    可以控制元素的阴影效果
    | 参数 | 属性 | 说明 |
    |:--|:--|:--|
    | 第一个 | 水平偏移 | 正值向右 |
    | 第二个 | 竖直偏移 | 正值向下 |
    | 第三个 | 模糊半径 | 边缘羽化程度，值越大越柔和 |
    | 第四个 | 扩展半径 | 正值放大阴影，负值收缩，默认 `0` |
    | 第五个 | 颜色 | 颜色值 |
    | `inset` | 内阴影 | 可写在开头或结尾，不写就是外阴影 |
    ```css
    .box{
        box-shadow: 5px 5px 5px 0 grey;
        /* 水平偏移 竖直偏移 模糊半径 扩展半径 颜色 */
    }
    ```

### 文本处理

- `color` 文字颜色
    文字的颜色
    ```css
    .box{
        color:red;
    }
    ```
- `text-indent` 文字缩进
    可以控制文字的缩进
    ```css
    .box{
        text-indent:2em; /*em是当前元素的文字大小，可以自动计算*/
    }
    ```
- `text-align` 文字水平偏移
    可以控制文字的水平偏移
    | 选项值 | 释义 |
    |:--|:--|
    | `left` | 左对齐（默认） |
    | `center` | 居中 |
    | `right` | 右对齐 |
    | `justify` | 两端对齐，单词间自动加空格 |
    | `start` / `end` | 按文字方向的对齐起点/终点 |

    ```css
    .box{
        text-align:center;
    }
    ```
- `text-shadow` 文字阴影
    参数和 `box-shadow` 类似，但没有扩展半径和 `inset`
    ```css
    .box {
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
        /* 水平偏移 竖直偏移 模糊半径 颜色 */
    }
    ```
- `text-decoration` 文字装饰
    可以控制文字的装饰效果
    | 选项值 | 释义 |
    |:--|:--|
    | `none` | 无装饰，常用于去掉链接下划线 |
    | `underline` | 下划线 |
    | `line-through` | 删除线 |
    | `overline` | 上划线 |
    | `underline dotted` | 下划线 + 点线样式 |
    | `underline wavy red` | 下划线 + 波浪线 + 颜色 |

    `text-decoration` 是 `text-decoration-line`、`text-decoration-style`、`text-decoration-color`、`text-decoration-thickness` 的简写
    | 子属性 | 常用值 | 作用 |
    |:--|:--|:--|
    | `text-decoration-line` | `none` / `underline` / `line-through` / `overline` | 装饰线类型 |
    | `text-decoration-style` | `solid` / `dashed` / `dotted` / `wavy` / `double` | 装饰线样式 |
    | `text-decoration-color` | 颜色值 | 装饰线颜色 |
    | `text-decoration-thickness` | `px` / `auto` | 装饰线粗细 |

    `text-decoration-line` 常用值：
    | 选项值 | 释义 |
    |:--|:--|
    | `none` | 无装饰，常用于去掉链接下划线 |
    | `underline` | 下划线 |
    | `line-through` | 删除线 |
    | `overline` | 上划线 |

    `text-decoration-style` 常用值：
    | 选项值 | 释义 |
    |:--|:--|
    | `solid` | 实线 |
    | `double` | 双线 |
    | `dotted` | 点线 |
    | `dashed` | 虚线 |
    | `wavy` | 波浪线 |

    ```css
    .link {
        text-decoration: underline wavy red;
        /* 线类型 样式 颜色 */
        text-decoration-thickness: 2px;
        text-underline-offset: 4px; /* 下划线距文字距离 */
    }
    ```

- `text-overflow` 文字溢出
    控制文字溢出时的显示方式，必须配合 `overflow: hidden` 和 `white-space: nowrap` 才生效
    | 选项值 | 释义 |
    |:--|:--|
    | `clip` | 默认，直接裁掉 |
    | `ellipsis` | 溢出部分显示省略号 `…` |
    ```css
    .ellipsis {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
    ```

- `white-space` 空白和换行处理
    控制文本中的空格、换行符怎么处理
    | 选项值 | 释义 |
    |:--|:--|
    | `normal` | 默认，连续空格合并，自动换行 |
    | `nowrap` | 不换行，常配省略号 |
    | `pre` | 保留空格和换行，不自动换行 |
    | `pre-wrap` | 保留空格和换行，自动换行 |
    | `pre-line` | 合并空格，保留换行，自动换行 |
    ```css
    .ellipsis {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
    ```

- `letter-spacing` 字间距
    控制字符之间的距离
    ```css
    .title {
        letter-spacing: 1px;   /* 拉开 */
        letter-spacing: -0.5px; /* 收紧 */
    }
    ```

- `word-spacing` 词间距
    控制单词之间的距离，主要对英文有效
    ```css
    .text {
        word-spacing: 4px;
    }
    ```

- `text-transform` 大小写转换
    控制文本的大小写显示，不改变原始内容
    | 选项值 | 释义 |
    |:--|:--|
    | `none` | 默认，不转换 |
    | `uppercase` | 全部大写 |
    | `lowercase` | 全部小写 |
    | `capitalize` | 每个单词首字母大写 |
    ```css
    .button {
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }
    ```

- `line-height` 行高
    可以控制多行文字之间的行间距，也影响单行文字的垂直居中
    | 写法 | 释义 |
    |:--|:--|
    | `1.5` | 字号的 1.5 倍，**推荐**，子元素按各自字号计算 |
    | `24px` | 固定行高，字号变了会不协调 |
    | `150%` | 相对当前字号计算成固定值，子元素继承固定值 |
    | `normal` | 默认，由浏览器决定，通常约 1.2 |
    ```css
    .box {
        line-height: 1.5;  /* 推荐：无单位，按字号倍数算 */
        line-height: 24px; /* 固定值，不推荐 */
    }
    ```
- `font` 简写属性
    是 `font-style`、`font-variant`、`font-weight`、`font-size`、`line-height`、`font-family` 的简写
    顺序比较灵活，但常见写法如下：
    | 位置 | 属性 | 默认值 | 作用 |
    |:--|:--|:--|:--|
    | 第一个 | `font-style` | `normal` | 字体风格 |
    | 第二个 | `font-variant` | `normal` | 小型大写字母等变体 |
    | 第三个 | `font-weight` | `normal` | 字重 |
    | 第四个 | `font-size` | 必填 | 字号 |
    | 第四个（斜杠后） | `line-height` | `normal` | 行高 |
    | 第五个 | `font-family` | 必填 | 字体族 |

    `font-style` 常用值：
    | 选项值 | 释义 |
    |:--|:--|
    | `normal` | 默认，正常 |
    | `italic` | 斜体 |
    | `oblique` | 倾斜，和 `italic` 类似但算法不同 |

    `font-variant` 常用值：
    | 选项值 | 释义 |
    |:--|:--|
    | `normal` | 默认，正常 |
    | `small-caps` | 小型大写字母 |

    `font-weight` 常用值：
    | 选项值 | 释义 |
    |:--|:--|
    | `100` ~ `300` | 细体 |
    | `400` / `normal` | 正常 |
    | `500` | 中等 |
    | `600` | 半粗 |
    | `700` / `bold` | 粗体 |
    | `800` / `900` | 特粗 |

    `font-size` 常用单位：
    | 单位 | 释义 |
    |:--|:--|
    | `px` | 固定像素 |
    | `rem` | 相对根元素字号，推荐 |
    | `em` | 相对当前元素字号，会层层嵌套放大 |
    | `%` | 相对父元素字号 |

    `line-height` 常用写法：
    | 写法 | 释义 |
    |:--|:--|
    | `1.5` | 字号倍数，推荐，子元素按各自字号重算 |
    | `24px` | 固定行高，字号变了会不协调 |
    | `150%` | 相对当前字号计算成固定值，子元素继承固定值 |
    | `normal` | 默认，通常约 `1.2` |

    `font-family` 通用字体族：
    | 选项值 | 释义 | 典型场景 |
    |:--|:--|:--|
    | `serif` | 衬线字体，笔画末端有小装饰 | 正文、书籍 |
    | `sans-serif` | 无衬线字体，笔画平滑 | 网页正文、UI，最常用 |
    | `monospace` | 等宽字体 | 代码块、终端 |
    | `cursive` | 手写体 | 签名、装饰标题 |
    | `fantasy` | 装饰字体 | 艺术标题、海报 |
    | `system-ui` | 系统默认 UI 字体 | 现代 Web 应用 |

    `font-size` 和 `font-family` 是必填项，缺任何一个整条简写都会失效
    `line-height` 必须写在 `font-size` 后面，用斜杠 `/` 分隔
    ```css
    .box {
        font: 700 16px/1.5 Arial, sans-serif;
        /* 字重 字号/行高 字体族 */

        font: italic bold 14px/1.4 "Helvetica Neue", Arial, sans-serif;
        /* 风格 字重 字号/行高 字体族 */

        font: 16px Arial, sans-serif;
        /* 只写字号和字体族，其他用默认值 */
    }
    ```

    系统字体关键字：`font` 可以直接用一个关键字表示整套系统字体
    | 关键字 | 作用 |
    |:--|:--|
    | `caption` | 控件标题字体 |
    | `icon` | 图标字体 |
    | `menu` | 菜单字体 |
    | `message-box` | 对话框字体 |
    | `small-caption` | 小控件标题字体 |
    | `status-bar` | 窗口状态栏字体 |

    ```css
    .box {
        font: menu; /* 使用系统菜单字体 */
    }
    ```

### 其他常用属性

- `overflow` 溢出处理
    控制内容超出元素盒子时怎么处理
    | 选项值 | 释义 |
    |:--|:--|
    | `visible` | 默认，溢出部分显示 |
    | `hidden` | 裁掉溢出内容 |
    | `scroll` | 始终显示滚动条 |
    | `auto` | 需要时显示滚动条 |
    | `clip` | 裁掉溢出，且不允许滚动 |
    ```css
    .box {
        overflow: hidden;
        overflow: auto;
        overflow-x: auto; /* 只控制水平方向 */
        overflow-y: hidden; /* 只控制垂直方向 */
    }
    ```
    单行省略号必须配合 `overflow: hidden`、`white-space: nowrap`、`text-overflow: ellipsis` 三件套

- `opacity` 透明度
    控制元素整体透明度，包括内容和背景
    | 值 | 释义 |
    |:--|:--|
    | `1` | 默认，完全不透明 |
    | `0` | 完全透明 |
    | `0.5` | 半透明 |
    ```css
    .box {
        opacity: 0.5;
    }
    .box:hover {
        opacity: 1;
    }
    ```
    `opacity: 0` 的元素仍然可点击、可被读屏，需要配合 `pointer-events: none` 或 `visibility: hidden`

- `visibility` 可见性
    控制元素是否可见，但保留布局占位
    | 选项值 | 释义 |
    |:--|:--|
    | `visible` | 默认，可见 |
    | `hidden` | 不可见，但保留占位 |
    | `collapse` | 用于表格行/列，合并边框 |
    ```css
    .box {
        visibility: hidden;
    }
    ```
    和 `display: none` 的区别：
    | 对比项 | `display: none` | `visibility: hidden` |
    |:--|:--|:--|
    | 占布局空间 | 否 | 是 |
    | 可交互 | 否 | 否 |
    | 可被读屏 | 否 | 否 |
    | 子元素能否覆盖 | 不能 | 可以，子元素设 `visibility: visible` 可显示 |
    | 过渡动画 | 不支持 | 支持 |

- `cursor` 鼠标指针样式
    控制鼠标悬停在元素上时的指针形状
    | 选项值 | 释义 |
    |:--|:--|
    | `default` | 默认箭头 |
    | `pointer` | 手型，常用于可点击元素 |
    | `text` | 文本输入光标 |
    | `not-allowed` | 禁止符号，常用于禁用态 |
    | `grab` / `grabbing` | 抓取 / 抓取中，常用于拖拽 |
    | `wait` | 等待，加载中 |
    | `help` | 帮助，问号 |
    ```css
    .button {
        cursor: pointer;
    }
    .button:disabled {
        cursor: not-allowed;
    }
    ```

- `pointer-events` 鼠标事件响应
    控制元素是否响应鼠标事件
    | 选项值 | 释义 |
    |:--|:--|
    | `auto` | 默认，正常响应 |
    | `none` | 不响应鼠标事件，事件穿透到下层 |
    ```css
    .mask {
        pointer-events: none; /* 遮罩层不影响下面点击 */
    }
    .button:disabled {
        pointer-events: none;
    }
    ```
    `opacity: 0` 的元素仍然可点击，配合 `pointer-events: none` 才能彻底禁用。

- `user-select` 文本选中
    控制用户能否选中文本
    | 选项值 | 释义 |
    |:--|:--|
    | `auto` | 默认，可选中 |
    | `none` | 不可选中 |
    | `text` | 可选中文本 |
    | `all` | 点击一次选中全部 |
    ```css
    .button {
        user-select: none; /* 按钮文字不可选中 */
    }
    ```

- `list-style` 列表样式简写
    是 `list-style-type`、`list-style-position`、`list-style-image` 的简写
    | 子属性 | 常用值 | 作用 |
    |:--|:--|:--|
    | `list-style-type` | `disc` / `circle` / `square` / `decimal` / `none` | 列表项标记 |
    | `list-style-position` | `outside` / `inside` | 标记在内容内还是外 |
    | `list-style-image` | `url()` | 用图片做标记 |
    ```css
    ul {
        list-style: none; /* 去掉圆点，导航常用 */
    }
    ol {
        list-style: decimal inside;
    }
    ```

- `filter` 滤镜
    对元素应用图形效果
    | 函数 | 说明 |
    |:--|:--|
    | `blur(px)` | 模糊 |
    | `brightness(%)` | 亮度，`100%` 为原始 |
    | `contrast(%)` | 对比度 |
    | `grayscale(%)` | 灰度，`100%` 完全灰色 |
    | `sepia(%)` | 褐色 |
    | `saturate(%)` | 饱和度 |
    | `hue-rotate(deg)` | 色相旋转 |
    | `invert(%)` | 反色 |
    | `drop-shadow(...)` | 阴影，类似 `box-shadow` |
    ```css
    .blur {
        filter: blur(4px);
    }
    .disabled {
        filter: grayscale(100%);
    }
    .image {
        filter: brightness(1.1) contrast(1.1);
    }
    ```
    多个滤镜用空格分隔。滤镜会创建新的层叠上下文，也会影响子元素。

- `object-fit` 替换内容填充方式
    控制图片、视频等内容在盒子内的填充方式
    | 选项值 | 释义 |
    |:--|:--|
    | `fill` | 默认，拉伸填满，会变形 |
    | `contain` | 完整显示，可能留白 |
    | `cover` | 裁剪填满，不变形 |
    | `none` | 保持原尺寸，不缩放 |
    | `scale-down` | `none` 或 `contain` 中较小的那个 |
    ```css
    .cover {
        width: 100%;
        height: 200px;
        object-fit: cover;
    }
    ```

- `object-position` 替换内容位置
    控制 `object-fit` 裁剪后的显示位置
    | 值 | 释义 |
    |:--|:--|
    | `50% 50%` | 默认，居中 |
    | `top` | 顶部 |
    | `left center` | 左侧居中 |
    | `20% 80%` | 距左 20%，距上 80% |
    ```css
    .cover {
        object-fit: cover;
        object-position: center top; /* 裁剪时保留顶部 */
    }
    ```

### 定位

可利用这个网址[练习](https://anchoreum.com/)

- `position` 定位模式
    可以控制定位的模式，有 `static`（默认定位）、`absolute`（绝对定位）、`relative`（相对定位）、`fixed`（固定定位）、`sticky`（粘性定位）
    
    - `static`是所有元素的默认定位，元素处于正常文档流，设置`top`/`right`/`bottom`/`left`无效，忽略`z-index`
    - `relative`是相对定位，参照物是元素自身的原始位置，不脱离文档流，视觉上移动，布局位置不变。可用于微调图标，作为绝对定位的定位祖先，创建`hover`(鼠标悬停在元素上)动效偏移，配合`z-index`调整层叠顺序
    - `absolute`是绝对定位，参照物是最近的position非static的祖先元素（有定位祖先就参照定位祖先，无就参照视口），脱离文档流，默认宽度由内容决定（除非指定宽度），可创建新的层叠上下文。可用于模态框，弹窗，下拉菜单，图标角标，自定义滚动条，轮播图指示器
    - `fixed`是固定定位，参照物是浏览器视口，脱离文档流，不随滚动条滚动，可用于导航栏，侧边栏，广告条
    - `sticky`是粘性定位，参照物是最近的滚动祖先，混合定位（`relative`和`fixed`），条件触发，达到阈值（需指定）后变为`fixed`，可用于表头固定，分类导航，阅读进度条

    | 定位类型 | 参照物 | 脱离文档流 | 视觉 vs 布局 | `top/right/bottom/left` | `z-index` | 典型用途 |
    |---|---|---|---|---|---|---|
    | `static` | 无（正常文档流） | 否 | 一致 | 无效 | 忽略 | 所有元素的默认值 |
    | `relative` | 元素自身原始位置 | 否 | 视觉移动，布局位置不变 | 有效 | 有效 | 微调图标、作为 absolute 的定位祖先、hover 偏移、调层叠顺序 |
    | `absolute` | 最近的非 static 祖先；没有则参照视口 | 是 | 完全脱离，不占原位置 | 有效 | 有效，可创建层叠上下文 | 模态框、弹窗、下拉菜单、图标角标、自定义滚动条、轮播指示器 |
    | `fixed` | 浏览器视口 | 是 | 不随滚动条滚动 | 有效 | 有效 | 固定导航栏、侧边栏、广告条 |
    | `sticky` | 最近的滚动祖先 | 否（阈值内仍占位） | 阈值内像 relative，超过阈值像 fixed | 有效（必须指定阈值） | 有效 | 表头固定、分类导航、阅读进度条 |

- `inset` 偏移简写
    是 `top`、`right`、`bottom`、`left` 的简写，遵守值复制原则
    | 值个数 | 值表示 |
    |:--|:--|
    | `1` | 上下左右 |
    | `2` | 上下 / 左右 |
    | `3` | 上 / 左右 / 下 |
    | `4` | 上 / 右 / 下 / 左 |

    ```css
    .mask {
        position: absolute;
        inset: 0; /* 四边都是 0，铺满父容器 */
    }
    .box {
        position: relative;
        inset: 10px 20px; /* 上下 10，左右 20 */
    }
    ```
    `inset` 只对已定位元素（`relative` / `absolute` / `fixed` / `sticky`）生效，`static` 上写无效。

### CSS 变量

- 自定义属性
    以 `--` 开头，用 `var()` 引用，可以存任意值
    ```css
    :root {
        --primary: #4f6ef7;
        --radius: 8px;
        --gap: 16px;
    }

    .button {
        background: var(--primary);
        border-radius: var(--radius);
        padding: var(--gap);
    }
    ```
    变量名区分大小写，`--primary` 和 `--Primary` 是两个变量。

- `var()` 回退值
    变量不存在时使用回退值，第二个参数开始都是回退
    ```css
    .box {
        color: var(--text-color, #333);
        padding: var(--padding, var(--gap, 16px)); /* 嵌套回退 */
    }
    ```

- 作用域
    变量遵循 CSS 层叠规则，定义在哪个选择器上，就作用于该元素及其后代
    | 定义位置 | 作用范围 |
    |:--|:--|
    | `:root` | 全局，整个文档 |
    | `.container` | 该容器及其后代 |
    | 行内 `style="--x: 1"` | 该元素及其后代 |
    ```css
    :root {
        --color: red;
    }

    .dark {
        --color: white; /* 只覆盖 .dark 内部 */
    }

    .box {
        color: var(--color); /* :root 下是红，.dark 下是白 */
    }
    ```

- 主题切换
    只改变量，不重复写规则
    ```css
    :root {
        --bg: #fff;
        --text: #1f2937;
    }

    [data-theme="dark"] {
        --bg: #111827;
        --text: #e5e7eb;
    }

    body {
        background: var(--bg);
        color: var(--text);
    }
    ```
    ```js
    document.documentElement.dataset.theme = 'dark';
    ```

- 和 `prefers-color-scheme` 配合
    ```css
    :root {
        --bg: #fff;
        --text: #1f2937;
    }

    @media (prefers-color-scheme: dark) {
        :root {
            --bg: #111827;
            --text: #e5e7eb;
        }
    }
    ```

- 注意事项
    | 注意点 | 说明 |
    |:--|:--|
    | 变量本身不是值 | `--x: 10px` 存的是字符串，`var(--x)` 才解析成值 |
    | 不能用于属性名 | `var(--prop): red` 无效，只能用于属性值 |
    | 回退值可以是变量 | `var(--a, var(--b, 16px))` |
    | 调试 | 开发者工具里可以直接改变量值，实时预览 |
    | 不支持 IE | 现代浏览器都支持，不需要前缀 |

### 媒体查询

- `@media` 媒体查询
    根据设备特性（屏幕宽度、颜色偏好、输入方式等）条件性地应用样式，是响应式设计的基础
    基本语法：`@media 媒体类型 and (媒体特性) { ... }`
    | 组成部分 | 说明 |
    |:--|:--|
    | 媒体类型 | `all`（默认）、`screen`（屏幕）、`print`（打印） |
    | 媒体特性 | 设备的具体条件，如宽度、方向、颜色偏好 |
    | 逻辑运算符 | `and`、`or`、`not`、逗号（等价于 `or`） |
    ```css
    @media screen and (min-width: 768px) {
        .box { padding: 24px; }
    }

    @media print {
        .no-print { display: none; }
    }
    ```

- 媒体类型
    | 选项值 | 释义 |
    |:--|:--|
    | `all` | 默认，所有设备 |
    | `screen` | 屏幕设备，最常用 |
    | `print` | 打印预览、打印机 |

- 媒体特性
    最常用的几个，都可以配合 `min-` / `max-` 前缀使用
    | 特性 | 说明 | 常用值 |
    |:--|:--|:--|
    | `width` | 视口宽度 | `min-width: 768px` |
    | `height` | 视口高度 | `min-height: 600px` |
    | `orientation` | 屏幕方向 | `portrait` 竖屏、`landscape` 横屏 |
    | `prefers-color-scheme` | 系统颜色偏好 | `light`、`dark` |
    | `prefers-reduced-motion` | 是否减少动画 | `reduce`、`no-preference` |
    | `hover` | 主输入设备是否支持悬停 | `hover`、`none` |
    | `pointer` | 主输入设备的精度 | `fine`（鼠标）、`coarse`（触摸） |
    ```css
    @media (orientation: landscape) { ... }
    @media (prefers-color-scheme: dark) { ... }
    @media (hover: hover) { .card:hover { transform: translateY(-4px); } }
    @media (pointer: coarse) { .button { padding: 12px 20px; } }
    ```

- 宽度断点：移动优先
    默认写移动端样式，用 `min-width` 逐步增强，更容易维护
    ```css
    /* 默认：移动端 */
    .card {
        padding: 16px;
    }

    /* 平板及以上 */
    @media (min-width: 768px) {
        .card { padding: 24px; }
    }

    /* 桌面 */
    @media (min-width: 1200px) {
        .card { max-width: 1200px; margin: 0 auto; }
    }
    ```
    桌面优先则反过来，用 `max-width` 从大往小覆盖，但维护成本更高，不推荐新项目使用
    ```css
    /* 桌面优先：不推荐 */
    @media (max-width: 1199px) { ... }
    @media (max-width: 767px) { ... }
    ```

- 常用断点
    断点没有标准答案，取决于设计稿和内容，下面是常见参考
    | 设备 | 断点 |
    |:--|:--|
    | 手机 | `< 768px` |
    | 平板 | `768px` ~ `1023px` |
    | 桌面 | `1024px` ~ `1439px` |
    | 大屏 | `>= 1440px` |

- 范围语法
    现代浏览器支持 `min-width <= width < max-width` 的范围写法，比 `and` 拼接更直观
    ```css
    /* 旧写法 */
    @media (min-width: 768px) and (max-width: 1023px) { ... }

    /* 新写法 */
    @media (768px <= width < 1024px) { ... }
    ```

- 逻辑运算符
    | 运算符 | 说明 | 示例 |
    |:--|:--|:--|
    | `and` | 同时满足 | `@media (min-width: 768px) and (orientation: landscape)` |
    | `,` | 满足任一，等价 `or` | `@media (max-width: 600px), (orientation: portrait)` |
    | `not` | 取反 | `@media not print` |
    | `or` | 满足任一 | `@media (max-width: 600px) or (orientation: portrait)` |
    ```css
    @media (min-width: 768px) and (max-width: 1023px) { ... }
    @media (max-width: 600px), (orientation: portrait) { ... }
    @media not print { ... }
    ```

- 深色模式
    用 `prefers-color-scheme` 配合 CSS 变量，只改变量不重复写规则
    ```css
    :root {
        --bg: #fff;
        --text: #1f2937;
    }

    @media (prefers-color-scheme: dark) {
        :root {
            --bg: #111827;
            --text: #e5e7eb;
        }
    }

    body {
        background: var(--bg);
        color: var(--text);
    }
    ```

- `prefers-reduced-motion`
    尊重用户系统的“减少动态效果”设置，做动效时加上
    ```css
    @media (prefers-reduced-motion: reduce) {
        *,
        *::before,
        *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
        }
    }
    ```

- `@media` 嵌套
    新规范允许 `@media` 嵌套在其他规则里，减少重复
    ```css
    .card {
        padding: 16px;

        @media (min-width: 768px) {
            padding: 24px;
        }
    }
    ```
    如果工具链不支持，退回成普通写法：
    ```css
    .card { padding: 16px; }
    @media (min-width: 768px) {
        .card { padding: 24px; }
    }
    ```

- 注意事项
    | 注意点 | 说明 |
    |:--|:--|
    | `min-width` 包含等于 | `min-width: 768px` 匹配宽度 `>= 768px` |
    | `max-width` 包含等于 | `max-width: 767px` 匹配宽度 `<= 767px` |
    | 断点不要写太密 | 每加一个断点，维护成本翻倍，按内容需要加 |
    | 移动优先 | 默认写小屏，用 `min-width` 逐步增强 |
    | 媒体查询本身不增加优先级 | 后写的规则覆盖先写的，权重仍然按选择器计算 |
    | 打印样式 | `@media print` 要单独测试，隐藏导航、展开链接地址等 |

## 布局处理

### 基本属性

- `display` 显示类型
    控制元素以什么方式参与布局
    | 选项值 | 释义 |
    |:--|:--|
    | `block` | 块级元素，独占一行，可设宽高 |
    | `inline` | 行内元素，不换行，宽高由内容决定 |
    | `inline-block` | 行内块，不换行但可设宽高 |
    | `none` | 不显示，不占布局空间 |
    | `flex` | 弹性容器 |
    | `grid` | 网格容器 |
    | `contents` | 元素本身不生成盒子，子元素直接参与父级布局 |

    ```css
    .box {
        display: block;        /* 块级 */
        /* display: inline-block; */ /* 行内块，每次只用其中一个 */
        /* display: none; */         /* 不显示 */
        /* display: flex; */         /* 弹性容器 */
        /* display: grid; */         /* 网格容器 */
    }
    ```
    `display: none` 和 `visibility: hidden` 的区别：前者不占位、不可交互；后者保留占位、不可交互

- `vertical-align` 垂直对齐
    控制行内元素、行内块元素、表格单元格的垂直对齐
    | 选项值 | 释义 |
    |:--|:--|
    | `baseline` | 默认，按基线对齐 |
    | `top` / `bottom` | 顶部 / 底部对齐 |
    | `middle` | 中线对齐 |
    | `text-top` / `text-bottom` | 对齐文字顶部 / 底部 |
    | `px` / `%` | 相对基线偏移 |
    ```css
    img {
        vertical-align: middle; /* 图片和文字垂直居中对齐 */
    }
    td {
        vertical-align: top;
    }
    ```
    只对行内、行内块、表格单元格生效，块级元素上写无效。`inline-block` 元素底部默认有基线空隙，用 `vertical-align: top` 或 `middle` 消除。

### 弹性布局(Flex)

可利用这个网址[练习](https://flexboxfroggy.com/)

- `display`
    当使用弹性布局时，先把`display`的值改成`flex`(块级弹性容器)或者`inline-flex`(行内弹性容器)，使得子元素自动变成弹性项目
    ```css
    .box{
        display:flex;
    }
    ```

- `flex-direction` 主轴方向
    主轴：项目排列的主要方向
    交叉轴：垂直于主轴的轴
    | 选项值 | 释义 |
    |:--|:--|
    | `row` | 默认，左到右 |
    | `row-reverse` | 右到左 |
    | `column` | 上到下 |
    | `column-reverse` | 下到上 |

    ```css
    .container {
        flex-direction: row; /* 默认：左到右 */
        flex-direction: row-reverse; /* 右到左 */
        flex-direction: column; /* 上到下 */
        flex-direction: column-reverse; /* 下到上 */
    }
    ```
- `justify-content` 主轴对齐
    | 选项值 | 释义 |
    |:--|:--|
    | `flex-start` | 默认，主轴起点对齐 |
    | `flex-end` | 主轴终点对齐 |
    | `center` | 主轴居中 |
    | `space-between` | 两端对齐，项目间等距 |
    | `space-around` | 每个项目两侧等距 |
    | `space-evenly` | 项目与项目、项目与边界都等距 |
    ```css
    .container {
        justify-content: flex-start; /* 默认：主轴起点对齐 */
        justify-content: flex-end; /* 主轴终点对齐 */
        justify-content: center; /* 主轴居中对齐 */
        justify-content: space-between; /* 两端对齐，项目间等距 */
        justify-content: space-around; /* 每个项目两侧等距 */
        justify-content: space-evenly; /* 项目与项目、项目与边界等距 */
    }
    ```

- `align-items` 交叉轴对齐
    作用于每一行中的单个项目，相当于为所有子项统一设置`align-self`(单个项目对齐，继承`align-items`)
    | 选项值 | 释义 |
    |:--|:--|
    | `stretch` | 默认，拉伸填满交叉轴 |
    | `flex-start` | 交叉轴起点对齐 |
    | `flex-end` | 交叉轴终点对齐 |
    | `center` | 交叉轴居中 |
    | `baseline` | 按文字基线对齐 |

    ```css
    .container {
        align-items: stretch; /* 默认 */
        align-items: flex-start; /* 交叉轴起点对齐 */
        align-items: flex-end; /* 交叉轴终点对齐 */
        align-items: center; /* 交叉轴居中对齐 */
        align-items: baseline; /* 基线对齐 */
    }
    .item {
        align-self: auto; /* 默认：继承align-items */
        align-self: flex-start;
        align-self: flex-end;
        align-self: center;
        align-self: baseline;
        align-self: stretch;
    }
    ```

- `align-content` 多轴线对齐
    将多行项目作为一个整体，在交叉轴上分配空间。**只在多行时生效**，单行 flex 里写它无效。
    | 选项值 | 释义 |
    |:--|:--|
    | `stretch` | 默认，多行拉伸填满容器 |
    | `flex-start` | 多行整体靠交叉轴起点 |
    | `flex-end` | 多行整体靠交叉轴终点 |
    | `center` | 多行整体居中 |
    | `space-between` | 首行贴起点，末行贴终点，中间均分 |
    | `space-around` | 每行两侧等距 |
    | `space-evenly` | 行与行、行与边界都等距 |
    ```css
    .container {
        align-content: stretch; /* 默认：拉伸填满 */
        align-content: flex-start; /* 交叉轴起点对齐 */
        align-content: flex-end; /* 交叉轴终点对齐 */
        align-content: center; /* 交叉轴居中对齐 */
        align-content: space-between; /* 交叉轴两端对齐 */
        align-content: space-around; /* 交叉轴等距分布 */
    }
    ```

- `flex-wrap` 换行控制
    | 选项值 | 释义 |
    |:--|:--|
    | `nowrap` | 默认，不换行 |
    | `wrap` | 换行，第一行在上 |
    | `wrap-reverse` | 换行，第一行在下 |
    ```css
    .container {
        flex-wrap: nowrap; /* 默认：不换行 */
        flex-wrap: wrap; /* 换行，第一行在上 */
        flex-wrap: wrap-reverse; /* 换行，第一行在下 */
    }
    ```
- `flex-flow` 简写属性
    `flex-direction`和`flex-wrap`的简写属性，
    第一个参数是`flex-direction`
    第二个参数是`flex-wrap`
    ```css
    .container{
        display:flex;
        flex-flow:column wrap;
    }
    ```

- `flex` 简写属性
    是 `flex-grow`、`flex-shrink`、`flex-basis` 的简写，控制项目如何分配主轴空间
    | 参数 | 属性 | 默认值 | 作用 |
    |:--|:--|:--|:--|
    | 第一个 | `flex-grow` | `0` | 放大比例。`0` 不放大；多个项目都设 `1` 时等分剩余空间 |
    | 第二个 | `flex-shrink` | `1` | 缩小比例。`0` 空间不足也不缩小；`1` 按比例缩小 |
    | 第三个 | `flex-basis` | `auto` | 初始大小。`auto` 由内容或 `width` 决定；`0%` 配合 `grow` 才能等分 |
    ```css
    .item {
        flex: none; /* 0 0 auto */
        flex: auto; /* 1 1 auto */
        flex: 1; /* 1 1 0% */
        flex: 0 0 200px; /* flex-grow flex-shrink flex-basis */
    }
    ```
- `order` 排列顺序
    | 值 | 效果 |
    |:--|:--|
    | `0` | 默认，按文档流顺序 |
    | `正数` | 数值越大越靠后 |
    | `负数` | 数值越小越靠前 |
    ```css
    .item {
        order: 0; /* 默认：按文档流顺序 */
        order: 1; /* 数值越大，排列越靠后 */
        order: -1; /* 数值越小，排列越靠前 */
    }
    ```

### 网格布局(Grid)

可利用这个网址[练习](https://cssgridgarden.com/)

- `display`
    当使用网格布局时，先把`display`的值改成`grid`(块级网格容器)或`inline-grid`(行内网格容器)
    ```css
    .container{
        display:grid
    }
    ```
- `grid-template-columns` 每一列的列宽
    | 值 | 释义 |
    |:--|:--|
    | `100px` | 固定列宽 |
    | `33.33%` | 百分比 |
    | `1fr` | 按比例分配剩余空间 |
    | `repeat(3, 1fr)` | 重复 3 次 |
    | `repeat(auto-fill, 100px)` | 自动填充，空格子也占位 |
    | `repeat(auto-fit, 100px)` | 自动填充，尽量扩大单元格 |
    | `minmax(100px, 1fr)` | 最小 `100px`，最大 `1fr` |
    | `auto` | 由浏览器决定 |
    | `[c1] 100px [c2]` | 方括号给网格线命名 |
    ```css
    .container {
        display: grid;
        grid-template-columns: 100px 100px 100px;
        /* 可以用px*/
        grid-template-columns: 33.33% 33.33% 33.33%; 
        /* 也可以用百分比*/
        grid-template-columns: repeat(3, 33.33%);
        /* 可用repeat函数简化  repeat接收两个参数，第一个参数是重复的次数，第二个参数是所要重复的值*/
        grid-template-columns:  repeat(auto-fill, 100px);
        /* 上面表示每列宽度100px，然后自动填充，直到容器不能放置更多的列。*/
        grid-template-columns: 150px 1fr 2fr;
        /* fr可以与绝对长度的单位结合使用，这时会非常方便，上面表示：第一列的宽度为150像素，第二列的宽度是第三列的一半*/
        grid-template-columns: 1fr 1fr minmax(100px,1fr);
        /* 上面代码中，minmax(100px, 1fr)表示列宽不小于100px，不大于1fr*/
        grid-template-columns: 100px auto 100px;
        /* 上面代码中，第二列的宽度，基本上等于该列单元格的最大宽度，除非单元格内容设置了min-width，且这个值大于最大宽度。*/
        grid-template-columns: [c1] 100px [c2] 100px [c3];
    }
    ```

- `grid-template-rows` 每一行的行高
    和`grid-template-columns`属性类似

- `gap` 简写属性
    `gap`属性是`row-gap`(行间距)和`column-gap`(列间距)的合并简写形式，接受1-2个值
    ```css
    .container {
        gap: 20px;        /* 行间距和列间距都是 20px */
        gap: 10px 20px;   /* 行间距 10px，列间距 20px */
    }
    ```
- `grid-template-areas` 网格区域
    网格布局允许指定"区域"（area），一个区域由单个或多个单元格组成。
    ```css
    .container {
        display: grid;
        grid-template-columns: 100px 100px 100px;
        grid-template-rows: 100px 100px 100px;
        grid-template-areas: "header header header" "main main sidebar" "footer footer footer";
    }
    ```
- `grid-auto-flow`
    划分网格后，子元素按顺序自动放置。默认先填满一行再换下一行。
    | 选项值 | 释义 |
    |:--|:--|
    | `row` | 默认，先行后列 |
    | `column` | 先列后行 |
    | `row dense` | 先行后列，尽可能填满空格 |
    | `column dense` | 先列后行，尽可能填满空格 |

- `place-items` 简写属性
    `place-items`属性是`align-items`属性和`justify-items`属性的合并简写形式，接受1-2个属性
    `justify-items`属性设置网格项目在单元格内的水平位置（左中右）
    `align-items`属性设置网格项目在单元格内的垂直位置（上中下）
    |属性值|释义|
    |:--|:--|
    |`start`|对齐单元格的起始边缘|
    |`end`|对齐单元格的结束边缘|
    |`center`|单元格内部居中|
    |`stretch`|拉伸，占满整个单元格（默认值）|

    ```css
    .container{
        place-items: center center;
        /* 第一个是align-items 第二个是justify-items */
    }
    ```
- `place-content` 简写属性
    `place-content`属性是`align-content`属性和`justify-content`属性的合并简写形式，接受1-2个属性
    `justify-content`属性是整个内容区域在容器里面的水平位置（左中右）
    `align-content`属性是整个内容区域的垂直位置（上中下）
    |属性值|释义|
    |:--|:--|
    |`start`|对齐容器的起始边框|
    |`end`|对齐容器的结束边框|
    |`center`|容器内部居中|
    |`stretch`|项目大小没有指定时，拉伸占据整个网格容器|
    |`space-around`|每个项目两侧的间隔相等，项目之间的间隔比项目与容器边框的间隔大一倍|
    |`space-between`|项目与项目的间隔相等，项目与容器边框之间没有间隔|

    ```css
    .container{
        place-content: center center;
        /* 第一个是align-content 第二个是justify-content */
    }
    ```
- `grid-auto-rows` 和 `grid-auto-columns`
    没有被显式地定义行高或列宽的网格元素，就需要使用`grid-auto-rows`和`grid-auto-columns`属性来指定它们的默认尺寸
    ```css
    .grid-container {
        display: grid;
        grid-auto-rows: 100px;
    }
    ```
- `grid-column` 和 `grid-row` 简写属性
    `grid-column`属性是`grid-column-start`和`grid-column-end`的合并简写形式
    `grid-row`属性是`grid-row-start`属性和`grid-row-end`的合并简写形式
    | 写法 | 含义 |
    |:--|:--|
    | `1 / 3` | 从第 1 条线到第 3 条线 |
    | `1 / span 2` | 从第 1 条线开始跨 2 格 |
    | `1` | 省略结束线，默认跨 1 格 |

    ```css
    /*1.指定为第几个网格线*/
    /* grid-row: 1 / 2 占据第 1 行 */
    /* grid-column: 1 / 3 从第 1 条列线到第 3 条列线，跨第 1、2 列 */
    .item-1 {
        grid-column: 1 / 3;
        grid-row: 1 / 2;
    }
    /* 等同于 */
    .item-1 {
        grid-column-start: 1;
        grid-column-end: 3;
        grid-row-start: 1;
        grid-row-end: 2;
    }
    /*2.也可以使用span关键字，表示跨越多少个网格。*/
    /*项目item-1占据的区域，包括第一行 + 第二行、第一列 + 第二列。*/
    .item-1 {
        background: #b03532;
        grid-column: 1 / 3;
        grid-row: 1 / 3;
    }
    /* 等同于 */
    .item-1 {
        background: #b03532;
        grid-column: 1 / span 2;
        grid-row: 1 / span 2;
    }
    /*3.斜杠以及后面的部分可以省略，默认跨越一个网格。*/
    /*项目item-1占据左上角第一个网格*/
    .item-1 {
        grid-column: 1;
        grid-row: 1;
    }
    ```

- `grid-area` 简写属性
    `grid-area`属性指定项目放在哪一个区域。
    ```css
    .item-1 {
        /*1号项目位于header区域*/
        grid-area: header;
    }
    ```
    `grid-area`属性还可用作`grid-row-start`、`grid-row-end`、`grid-column-start`、`grid-column-end`的合并简写形式，直接指定项目的位置。
    | 顺序 | 对应属性 |
    |:--|:--|
    | 第一个 | `grid-row-start` |
    | 第二个 | `grid-column-start` |
    | 第三个 | `grid-row-end` |
    | 第四个 | `grid-column-end` |
    ```css
    /*示例：
    grid-area: <row-start> / <column-start> / <row-end> / 
    <column-end>;
    */
    .item-1 {
        grid-area: 1 / 1 / 3 / 3;
    }
    ```
- `place-self` 简写属性
    `place-self`属性是`align-self`属性和`justify-self`属性的合并简写形式，接受1-2个值
    `justify-self`属性设置单元格内容的水平位置（左中右），跟`justify-items`属性的用法完全一致，但只作用于单个项目。
    `align-self`属性设置单元格内容的垂直位置（上中下），跟`align-items`属性的用法完全一致，也是只作用于单个项目。
    |属性值|释义|
    |:--|:--|
    |`start`|对齐单元格的起始边缘|
    |`end`|对齐单元格的结束边缘|
    |`center`|单元格内部居中|
    |`stretch`|拉伸，占满整个单元格（默认值）|
    ```css
    .item{
        place-self: center center;
        /* 第一个是align-self 第二个是justify-self */
    }
    ```

## 变换与过渡和动画

### 变换(Transform)

- `transform` 变换函数
    对元素进行位移、缩放、旋转、倾斜，不改变文档流，不影响其他元素布局
    多个函数用空格分隔，按**从右到左**的顺序依次应用
    | 函数 | 作用 | 常用值 |
    |:--|:--|:--|
    | `translate(x, y)` | 位移 | `px`、`%` |
    | `translateX(x)` / `translateY(y)` | 单轴位移 | `px`、`%` |
    | `scale(x, y)` | 缩放 | 无单位数字，`1` 为原始大小 |
    | `scaleX(x)` / `scaleY(y)` | 单轴缩放 | 无单位数字 |
    | `rotate(angle)` | 旋转 | `deg`、`turn` |
    | `skew(x, y)` | 倾斜 | `deg` |
    | `skewX(x)` / `skewY(y)` | 单轴倾斜 | `deg` |
    | `matrix(a, b, c, d, e, f)` | 矩阵变换，上面函数的底层形式 | 六个数字 |
    ```css
    .box {
        transform: translateX(20px);
        transform: translate(-50%, -50%); /* 常配 absolute 做居中 */
        transform: scale(1.1);
        transform: rotate(45deg);
        transform: translateY(-4px) scale(1.02); /* 多个函数，先 scale 再 translate */
    }
    ```
    `%` 位移相对于**元素自身尺寸**，不是父容器。`translate(-50%, -50%)` 是把元素向左上移动自身宽高的一半，配合 `position: absolute; top: 50%; left: 50%` 做居中。

    `transform` 的注意事项：
    | 注意点 | 说明 |
    |:--|:--|
    | 不脱离文档流 | 变换后元素仍占原位置，不影响周围布局 |
    | 创建层叠上下文 | 有 `transform` 且值不为 `none` 时，元素形成新的层叠上下文 |
    | 影响 `fixed` 子元素 | 祖先有 `transform` 时，子元素的 `fixed` 改为相对该祖先定位 |
    | 性能 | `transform` 和 `opacity` 由合成器处理，动画性能好，优先用它们做动效 |

- `transform-origin` 变换原点
    控制 `rotate`、`scale`、`skew` 围绕哪个点进行
    | 值 | 释义 |
    |:--|:--|
    | `50% 50%` | 默认，元素中心 |
    | `0 0` | 左上角 |
    | `100% 100%` | 右下角 |
    | `center top` | 顶部居中 |
    | `20px 40px` | 距左 20px，距上 40px |
    ```css
    .box {
        transform-origin: center;
        transform-origin: left top;
        transform-origin: 0 0;
    }
    ```

### 过渡(Transition)

- `transition` 简写属性
    是 `transition-property`、`transition-duration`、`transition-timing-function`、`transition-delay` 的简写
    | 位置 | 属性 | 默认值 | 作用 |
    |:--|:--|:--|:--|
    | 第一个 | `transition-property` | `all` | 参与过渡的属性 |
    | 第二个 | `transition-duration` | `0s` | 持续时间 |
    | 第三个 | `transition-timing-function` | `ease` | 缓动函数 |
    | 第四个 | `transition-delay` | `0s` | 延迟时间 |

    `transition-timing-function` 常用值：
    | 选项值 | 释义 |
    |:--|:--|
    | `ease` | 默认，慢-快-慢 |
    | `linear` | 匀速 |
    | `ease-in` | 慢进 |
    | `ease-out` | 慢出 |
    | `ease-in-out` | 慢进慢出 |
    | `cubic-bezier(x1, y1, x2, y2)` | 自定义贝塞尔曲线 |
    | `steps(n, end)` | 分 n 步完成，用于逐帧动画 |

    多个属性用逗号分隔
    `transition: all 0.3s` 会监听所有属性，性能不如明确指定
    ```css
    .button {
        background: #4f6ef7;
        transition: background-color 0.2s ease, transform 0.1s ease;
    }
    .button:hover {
        background: #3d5ce0;
        transform: translateY(-1px);
    }

    .box {
        transition: all 0.3s; /* 不推荐 */
        /* transition: opacity 0.3s, transform 0.3s; */ /* 推荐，后一条会覆盖前一条 */
    }
    ```
    `transition` 只对可过渡属性生效。`display` 这类离散属性，以及 `width: auto` 到具体值这种无法插值的情况，都不支持平滑过渡。需要做 `display` 切换动画时，通常用 `opacity` + `visibility`，或者 `@keyframes`。

### 动画(Animation)

- `@keyframes` 定义关键帧
    定义动画在不同时间点的状态，用 `%` 或 `from` / `to` 表示进度
    ```css
    @keyframes fade-in {
        from { opacity: 0; }
        to { opacity: 1; }
    }

    @keyframes bounce {
        0%   { transform: translateY(0); }
        50%  { transform: translateY(-20px); }
        100% { transform: translateY(0); }
    }
    ```

- `animation` 简写属性
    是 `animation-name`、`animation-duration`、`animation-timing-function`、`animation-delay`、`animation-iteration-count`、`animation-direction`、`animation-fill-mode`、`animation-play-state` 的简写
    | 位置 | 属性 | 默认值 | 作用 |
    |:--|:--|:--|:--|
    | 第一个 | `animation-name` | `none` | 关键帧名称 |
    | 第二个 | `animation-duration` | `0s` | 持续时间 |
    | 第三个 | `animation-timing-function` | `ease` | 缓动函数 |
    | 第四个 | `animation-delay` | `0s` | 延迟时间 |
    | 第五个 | `animation-iteration-count` | `1` | 播放次数 |
    | 第六个 | `animation-direction` | `normal` | 播放方向 |
    | 第七个 | `animation-fill-mode` | `none` | 动画外的状态 |
    | 第八个 | `animation-play-state` | `running` | 播放状态 |

    顺序不严格固定，只要不冲突即可。常见写法是名称在前，时长在后。

    `animation-iteration-count` 常用值：
    | 选项值 | 释义 |
    |:--|:--|
    | `1` | 默认，播放一次 |
    | `3` | 播放三次 |
    | `infinite` | 无限循环 |

    `animation-direction` 常用值：
    | 选项值 | 释义 |
    |:--|:--|
    | `normal` | 默认，正向播放 |
    | `reverse` | 反向播放 |
    | `alternate` | 正反交替 |
    | `alternate-reverse` | 反反正交替 |

    `animation-fill-mode` 常用值：
    | 选项值 | 释义 |
    |:--|:--|
    | `none` | 默认，动画前后不保留样式 |
    | `forwards` | 动画结束后保留最后一帧 |
    | `backwards` | 动画开始前应用第一帧 |
    | `both` | 同时应用 `forwards` 和 `backwards` |

    `animation-play-state` 常用值：
    | 选项值 | 释义 |
    |:--|:--|
    | `running` | 默认，播放中 |
    | `paused` | 暂停 |

    多个动画用逗号分隔
    ```css
    .box {
        animation: fade-in 0.3s ease 0.1s 1 normal both;
        /* 名称 时长 缓动 延迟 次数 方向 填充模式 */

        animation: bounce 1s ease infinite alternate;
        /* 名称 时长 缓动 无限循环 交替方向 */

        animation: fade-in 0.3s, bounce 1s 0.3s infinite; /* 多个动画 */
    }

    .box:hover {
        animation-play-state: paused; /* 悬停时暂停 */
    }
    ```

- `transition` 和 `animation` 的区别
    | 对比项 | `transition` | `animation` |
    |:--|:--|:--|
    | 触发条件 | 属性变化时触发，需要状态切换（如 `:hover`） | 自动播放，不需要状态变化 |
    | 关键帧 | 只有起点和终点 | 可以定义多个中间状态 |
    | 循环 | 不支持 | 支持 `infinite` |
    | 方向控制 | 不支持 | 支持 `alternate`、`reverse` |
    | 暂停 | 不支持 | 支持 `animation-play-state` |
    | 适用场景 | 悬停、聚焦等交互反馈 | 加载动画、循环动效、复杂序列 |

- `prefers-reduced-motion` 减少动画
    尊重用户系统的“减少动态效果”设置，关闭或简化动画
    ```css
    @media (prefers-reduced-motion: reduce) {
        *,
        *::before,
        *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
        }
    }
    ```
    做动效时加上这段，对晕动症用户更友好，也是无障碍规范的要求。

## 进阶

- `scroll-behavior` 平滑滚动
    控制滚动容器的滚动行为
    | 选项值 | 释义 |
    |:--|:--|
    | `auto` | 默认，立即跳转 |
    | `smooth` | 平滑滚动 |
    ```css
    html {
        scroll-behavior: smooth;
    }
    ```
    尊重用户“减少动态效果”设置：
    ```css
    @media (prefers-reduced-motion: reduce) {
        html {
            scroll-behavior: auto;
        }
    }
    ```

- `@supports` 特性检测
    根据浏览器是否支持某个 CSS 特性来应用样式
    ```css
    @supports (display: grid) {
        .layout {
            display: grid;
        }
    }

    @supports not (display: grid) {
        .layout {
            display: flex;
        }
    }
    ```
    可以和 `and`、`or` 组合：
    ```css
    @supports (display: grid) and (gap: 16px) {
        .layout { display: grid; gap: 16px; }
    }
    ```

- `@font-face` 自定义字体
    引入字体文件，用 `font-family` 命名后使用
    ```css
    @font-face {
        font-family: "MyFont";
        src: url("./fonts/myfont.woff2") format("woff2"),
             url("./fonts/myfont.woff") format("woff");
        font-weight: 400;
        font-style: normal;
        font-display: swap;
    }

    body {
        font-family: "MyFont", sans-serif;
    }
    ```
    | 描述符 | 说明 |
    |:--|:--|
    | `font-family` | 自定义名称，后面用这个引用 |
    | `src` | 字体文件地址，多个格式做回退 |
    | `font-weight` / `font-style` | 这个文件对应的字重和风格 |
    | `font-display` | 加载策略，`swap` 先用回退字体，加载完替换 |

- `@layer` 级联层
    把样式分层，控制优先级，低层永远被高层覆盖，不管选择器权重
    ```css
    @layer reset, base, components, utilities;

    @layer reset {
        * { margin: 0; padding: 0; }
    }

    @layer base {
        a { color: blue; }
    }

    @layer components {
        .button { color: red; }
    }

    @layer utilities {
        .text-red { color: red !important; }
    }
    ```
    层顺序由第一次声明决定，后声明的层优先级更高。`!important` 在层里的规则会反转，低层的 `!important` 反而优先。

- `@container` 容器查询
    根据父容器尺寸而不是视口尺寸应用样式，组件级响应式
    ```css
    .card-wrapper {
        container-type: inline-size;
        container-name: card;
    }

    @container card (min-width: 400px) {
        .card {
            display: flex;
        }
    }
    ```
    | 属性 | 说明 |
    |:--|:--|
    | `container-type` | `inline-size`（宽度查询）、`size`（宽高查询）、`normal` |
    | `container-name` | 给容器命名，查询时指定 |
    和媒体查询的区别：媒体查询看视口，容器查询看父容器。做组件库、可复用卡片时，容器查询比媒体查询更合适。