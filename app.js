/**
 * 📚 学习资料管理应用
 *
 * 基于树形数据结构渲染可交互的目录导航页面。
 * 支持无限层级的文件夹嵌套、文件链接跳转、空目录状态提示，
 * 并提供路径查找与动态合并的核心引擎。
 *
 * ─── 公开方法 ───────────────────────────────────────────────
 *  render()            → 渲染整棵树到页面
 *  addFile(path, file) → 手动添加文件（暂未启用）
 *  addFolder(path)     → 手动创建文件夹（暂未启用）
 *  handleUpload(list)  → 处理用户上传（暂未启用）
 *
 * ─── 内部方法（供类内部使用）───────────────────────────────
 *  渲染相关：
 *    _renderNode()        → 判断节点类型，分流渲染
 *    _renderFileList()    → 渲染文件列表
 *    _renderDirectory()   → 渲染文件夹（含子目录）
 *    _createFolderItem()  → 创建单个文件夹 DOM
 *    _toggleFolder()      → 展开/折叠 + 空目录提示
 *
 *  统计相关：
 *    _countFiles()        → 递归统计文件总数
 *    _updateStats()       → 更新页面统计显示
 *
 *  数据操作：
 *    _getNodeAtPath()     → 路径查找/自动创建（核心引擎）
 *    _addFileToNode()     → 向节点添加文件（自动去重）
 *
 *  UI绑定：
 *    _bindUI()            → 等待 DOM 就绪，启动绑定
 *    _bindUIInternal()    → 实际绑定事件
 *
 * @example
 * const app = new LearningApp();
 * app.render();
 */
export class LearningApp {

    /**
     * 树形数据根节点（单一数据源）
     *
     * - 键 (Key) 为字符串时，代表**文件夹**名称。
     * - 值为数组 (Array) 时，代表该文件夹下的**文件列表**。
     * - 值为对象 (Object) 时，代表**子文件夹**。
     * - 特殊键 `_files` 用于当文件夹下同时存在子文件夹和文件时存放文件。
     *
     * @type {Object.<string, Object|Array>}
     */
    data = {
        "数学": {
            "初等数学": {
                "函数": {
                    "抽象函数": [],
                    "导数": [],
                    "三角函数": []
                },
                "立体几何": [
                    "立体几何.html"
                ],
                "解三角": [],
                "数列": [
                    "数列.html"
                ],
                "不等式": [],
                "圆锥曲线": [],
                "概率": [],
            },
            "高等数学": {
                "微分方程": [
                    "化归.html"
                ],
                "不定积分": []
            }
        },
        "物理": {
            "电磁学": {
                "电学": [],
                "磁学": [],
                "电磁感应": []
            },
            "热力学": [],
            "运动学": []
        }
    };

    /**
     * 创建应用实例，自动绑定 UI 事件并渲染初始界面。
     */
    constructor() {
        this.container = '#tree-container';
        this.fileInput = '#fileInput';
        this._bindUI();
    }

    // ======================== 渲染 ==========================

    /**
     * 渲染整个目录树到页面容器中。
     *
     * 清空容器并递归遍历 data，重建所有 DOM 节点。
     * 渲染完成后自动更新页面顶部的文件统计数量。
     *
     * @returns {void}
     *
     * @example
     * // 修改数据后调用刷新
     * app.data.数学.初等数学.立体几何.push('新文件.pdf');
     * app.render();
     */
    render() {
        const container = document.querySelector(this.container);
        if (!container) return;
        container.innerHTML = '';
        this._renderNode(this.data, '', container);
        this._updateStats();
    }

    /**
     * 递归渲染节点（内部调度器）
     *
     * 判断节点类型后分发给对应的渲染函数：
     * - 数组 → _renderFileList（文件列表）
     * - 对象 → _renderDirectory（文件夹）
     *
     * @param {Object|Array} node - 当前节点
     * @param {string} path - 从根到当前节点的路径字符串（如 "数学/初等数学"）
     * @param {HTMLElement} container - 挂载容器
     * @private
     */
    _renderNode(node, path, container) {
        if (Array.isArray(node)) {
            this._renderFileList(node, path, container);
        } else {
            this._renderDirectory(node, path, container);
        }
    }

    /**
     * 渲染文件列表（数组节点）
     *
     * 生成带链接的 `<ul><li><a>` 结构，点击在新窗口打开。
     * 文件名自动排序。
     *
     * @param {string[]} files - 文件名数组
     * @param {string} path - 当前目录路径（用于拼接 href）
     * @param {HTMLElement} container - 挂载容器
     * @private
     */
    _renderFileList(files, path, container) {
        const ul = document.createElement('ul');
        files.slice().sort().forEach(name => {
            const li = document.createElement('li');
            li.className = 'file';
            const a = document.createElement('a');
            a.href = path ? `${path}/${name}` : name;
            a.target = '_blank';
            a.textContent = `📄 ${name}`;
            li.appendChild(a);
            ul.appendChild(li);
        });
        container.appendChild(ul);
    }

    /**
     * 渲染文件夹（对象节点）
     *
     * 先遍历所有子文件夹（非 _files 键），再渲染当前目录下的文件（_files）。
     * 文件夹和文件都按名称排序。
     *
     * @param {Object} node - 文件夹节点对象
     * @param {string} path - 当前目录路径
     * @param {HTMLElement} container - 挂载容器
     * @private
     */
    _renderDirectory(node, path, container) {
        const ul = document.createElement('ul');
        const keys = Object.keys(node).filter(k => k !== '_files').sort();

        keys.forEach(key => {
            const li = this._createFolderItem(key, node[key], path);
            ul.appendChild(li);
        });

        if (node._files && Array.isArray(node._files)) {
            this._renderFileList(node._files, path, ul);
        }

        container.appendChild(ul);
    }

    /**
     * 创建单个文件夹的 DOM 元素（带展开/折叠功能）
     *
     * 文件夹默认折叠（`hidden` 类），点击文件夹名触发切换。
     * 子内容在创建时即递归渲染完毕，但通过 CSS 控制显示/隐藏。
     *
     * @param {string} folderName - 文件夹名称
     * @param {Object|Array} childNode - 子节点数据
     * @param {string} parentPath - 父路径
     * @returns {HTMLLIElement} 文件夹列表项
     * @private
     */
    _createFolderItem(folderName, childNode, parentPath) {
        const li = document.createElement('li');
        const span = document.createElement('span');
        span.className = 'folder';
        span.textContent = `📁 ${folderName}`;
        li.appendChild(span);

        const childDiv = document.createElement('div');
        childDiv.className = 'hidden';
        const newPath = parentPath ? `${parentPath}/${folderName}` : folderName;
        this._renderNode(childNode, newPath, childDiv);
        li.appendChild(childDiv);

        span.addEventListener('click', (e) => {
            e.stopPropagation();
            this._toggleFolder(childDiv);
        });

        return li;
    }

    /**
     * 切换文件夹的展开/折叠状态
     *
     * 展开时自动检查是否有内容（文件或子文件夹），
     * 若为空则显示 "📭 目前暂无资料" 占位提示。
     *
     * @param {HTMLElement} container - 文件夹的子容器（childDiv）
     * @private
     */
    _toggleFolder(container) {
        const isHidden = container.classList.contains('hidden');
        if (isHidden) {
            container.classList.remove('hidden');
            const ulElem = container.querySelector('ul');
            const hasContent = ulElem && ulElem.children.length > 0;
            const oldHint = container.querySelector('.empty-hint');
            if (oldHint) oldHint.remove();
            if (!hasContent) {
                const hint = document.createElement('div');
                hint.className = 'empty-hint';
                hint.textContent = '📭 目前暂无资料';
                container.appendChild(hint);
            }
        } else {
            container.classList.add('hidden');
        }
    }

    // ======================== 统计 ==========================

    /**
     * 递归统计节点下的文件总数
     *
     * - 数组 → 返回数组长度
     * - 对象 → 遍历所有键，累加 `_files` 长度和子节点的文件数
     *
     * @param {Object|Array} node - 当前节点
     * @returns {number} 文件总数
     * @private
     */
    _countFiles(node) {
        if (Array.isArray(node)) {
            return node.length;
        }
        let total = 0;
        for (const key of Object.keys(node)) {
            if (key === '_files') {
                total += node._files.length;
            } else {
                total += this._countFiles(node[key]);
            }
        }
        return total;
    }

    /**
     * 更新页面上的文件统计显示
     *
     * 查找 `#file-count` 元素，将 `_countFiles` 的结果渲染进去。
     *
     * @private
     */
    _updateStats() {
        const countEl = document.querySelector('#file-count');
        if (countEl) {
            const total = this._countFiles(this.data);
            countEl.textContent = total;
        }
    }


    // ======================== 核心：路径查找/创建 ==========================

    /**
     * 根据路径数组查找节点（核心引擎）
     *
     * 逐级深入树形数据，如果路径中的某一级不存在：
     * - autoCreate = true  → 自动创建空对象（文件夹）
     * - autoCreate = false → 返回 null
     *
     * 若路径中途遇到数组（文件列表），自动将其转换为对象 `{ _files: 原数组 }`，
     * 实现"文件升级为文件夹"的动态演变，这是递归合并成功的基础。
     *
     * @param {string[]} pathArray - 路径片段数组，如 `['数学', '初等数学']`
     * @param {boolean} autoCreate - 是否自动创建不存在的中间节点
     * @returns {Object|null} 找到或创建的节点对象；若未找到且 autoCreate 为 false，则返回 null
     *
     * @example
     * // 查找 '数学/高等数学' 节点，不存在则自动创建
     * const node = app._getNodeAtPath(['数学', '高等数学'], true);
     *
     * @example
     * // 仅查找，不创建（返回 null 如果不存在）
     * const node = app._getNodeAtPath(['物理', '量子力学'], false);
     */
    _getNodeAtPath(pathArray, autoCreate) {
        if (pathArray.length === 0) return this.data;

        let node = this.data;
        for (let i = 0; i < pathArray.length; i++) {
            const folder = pathArray[i];

            if (node[folder] === undefined) {
                if (autoCreate) {
                    node[folder] = {};
                } else {
                    return null;
                }
            } else if (Array.isArray(node[folder])) {
                // 修复：复制数组，而不是直接引用，避免多处共享同一数组
                const existingFiles = node[folder].slice();
                node[folder] = { _files: existingFiles };
            }
            node = node[folder];
        }
        return node;
    }

    // ======================== 工具 ==========================

    /**
     * 向指定节点添加文件（自动去重并排序）
     *
     * 自动识别节点类型：
     * - 数组 → 直接 push
     * - 对象 → 存入 `_files` 数组
     *
     * @param {Object|Array} node - 目标节点（由 _getNodeAtPath 返回）
     * @param {string} filename - 要添加的文件名
     *
     * @example
     * const node = app._getNodeAtPath(['数学', '初等数学'], true);
     * app._addFileToNode(node, '新讲义.pdf');
     */
    _addFileToNode(node, filename) {
        if (Array.isArray(node)) {
            if (!node.includes(filename)) {
                node.push(filename);
                node.sort();
            }
        } else {
            if (!node._files) node._files = [];
            if (!node._files.includes(filename)) {
                node._files.push(filename);
                node._files.sort();
            }
        }
    }

    // ======================== 文件操作 ==========================
    // ⚠️ 以下方法暂未启用，预留供未来扩展

    // /**
    //  * 手动向指定路径添加文件
    //  *
    //  * @param {string[]} pathArray - 目标文件夹路径
    //  * @param {string} filename - 文件名
    //  */
    // addFile(pathArray, filename) {
    //     const node = this._getNodeAtPath(pathArray, true);
    //     if (!node) return;
    //     this._addFileToNode(node, filename);
    //     this.render();
    // }

    // /**
    //  * 手动创建空文件夹
    //  *
    //  * @param {string[]} pathArray - 要创建的文件夹路径
    //  */
    // addFolder(pathArray) {
    //     this._getNodeAtPath(pathArray, true);
    //     this.render();
    // }

    // /**
    //  * 批量处理用户上传的文件/文件夹
    //  *
    //  * 利用 webkitRelativePath 解析相对路径，
    //  * 自动创建不存在的父级目录，将文件添加到对应的叶子节点。
    //  *
    //  * @param {FileList} fileList - 从 input[type=file] 获取的文件列表
    //  * @param {string[]} targetPath - 目标根路径（默认为空数组，即根目录）
    //  */
    // handleUpload(fileList, targetPath = []) {
    //     const files = Array.from(fileList);
    //     if (files.length === 0) return;

    //     const fileEntries = [];
    //     files.forEach(file => {
    //         let relPath = file.webkitRelativePath || file.name;
    //         let parts = relPath.split('/').filter(Boolean);
    //         let fileName = parts.pop();
    //         const fullParts = [...targetPath, ...parts];
    //         fileEntries.push({ parts: fullParts, fileName });
    //     });

    //     fileEntries.forEach(({ parts, fileName }) => {
    //         const node = this._getNodeAtPath(parts, true);
    //         if (node) {
    //             this._addFileToNode(node, fileName);
    //         }
    //     });

    //     this.render();
    // }

    // ======================== UI 绑定 ==========================

    /**
     * 绑定 UI 事件（内部启动入口）
     *
     * 等待 DOM 就绪后调用 _bindUIInternal。
     *
     * @private
     */
    _bindUI() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this._bindUIInternal());
        } else {
            this._bindUIInternal();
        }
    }

    /**
     * UI 事件绑定（实际执行）
     *
     * - 渲染初始目录树
     * - 绑定"添加文件"按钮 → 触发隐藏的 file input
     * - 监听 file input 的 change 事件 → 调用 handleUpload
     *
     * ⚠️ 当前 handleUpload 已被注释，添加功能暂未开放。
     *
     * @private
     */
    _bindUIInternal() {
        this.render();

        const fileInput = document.querySelector(this.fileInput);
        const addBtn = document.querySelector('#addFileBtn');

        if (addBtn && fileInput) {
            addBtn.addEventListener('click', () => fileInput.click());

            fileInput.addEventListener('change', function () {
                if (this.files && this.files.length > 0) {
                    // ⚠️ handleUpload 当前已注释，如需启用请取消注释
                    // window.app.handleUpload(this.files, []);
                    this.value = '';
                }
            });
        }
    }
}