// ================================================================
//  📦  LearningApp —— 所有功能封装
// ================================================================
class LearningApp {

    data = {
        "数学": {
            "初等数学": {
                "立体几何": [
                    "立体几何.html"
                ],
                "解三角": [],
                "数列": [],
                "不等式": [],
                "圆锥曲线": [],
                "概率": [],
                "函数": {
                    "抽象函数": [],
                    "导数": [],
                    "三角函数": []
                },
            },
            "高等数学": {
                "微分方程": [
                    "化归.html"
                ],
                "不定积分":[]
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

    constructor() {
        this.container = '#tree-container';
        this.fileInput = '#fileInput';
        this._bindUI();
    }

    // ======================== 渲染 ==========================

    render() {
        const container = document.querySelector(this.container);
        if (!container) return;
        container.innerHTML = '';
        this._renderNode(this.data, '', container);
    }

    _renderNode(node, path, container) {
        if (Array.isArray(node)) {
            this._renderFileList(node, path, container);
        } else {
            this._renderDirectory(node, path, container);
        }
    }

    _renderFileList(files, path, container) {
        const ul = document.createElement('ul');
        files.slice().sort().forEach(name => {
            const li = document.createElement('li');
            li.className = 'file';
            const a = document.createElement('a');
            a.href = path ? path + '/' + name : name;
            a.target = '_blank';
            a.textContent = '📄 ' + name;
            li.appendChild(a);
            ul.appendChild(li);
        });
        container.appendChild(ul);
    }

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

    _createFolderItem(folderName, childNode, parentPath) {
        const li = document.createElement('li');
        const span = document.createElement('span');
        span.className = 'folder';
        span.textContent = '📁 ' + folderName;
        li.appendChild(span);

        const childDiv = document.createElement('div');
        childDiv.className = 'hidden';
        const newPath = parentPath ? parentPath + '/' + folderName : folderName;
        this._renderNode(childNode, newPath, childDiv);
        li.appendChild(childDiv);

        span.addEventListener('click', (e) => {
            e.stopPropagation();
            this._toggleFolder(childDiv);
        });

        return li;
    }

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

    // ======================== 核心：路径查找/创建 ==========================

    /**
     * 根据路径数组查找节点，如果路径不存在则根据 autoCreate 决定是否创建
     * 正确处理数组 → 对象转换（合并文件）
     */
    _getNodeAtPath(pathArray, autoCreate) {
        if (pathArray.length === 0) return this.data;

        let node = this.data;
        for (let i = 0; i < pathArray.length; i++) {
            const folder = pathArray[i];
            const isLast = (i === pathArray.length - 1);

            if (node[folder] === undefined) {
                if (autoCreate) {
                    node[folder] = {};
                } else {
                    return null;
                }
            } else if (Array.isArray(node[folder])) {
                // 当前是文件数组，需要转为文件夹（保留原有文件）
                const existingFiles = node[folder];
                node[folder] = { _files: existingFiles };
            }
            // 进入下一层
            node = node[folder];
        }
        return node;
    }

    // ======================== 工具 ==========================

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

    // /** 手动添加文件 */
    // addFile(pathArray, filename) {
    //     const node = this._getNodeAtPath(pathArray, true);
    //     if (!node) return;
    //     this._addFileToNode(node, filename);
    //     this.render();
    // }

    // /** 手动添加文件夹 */
    // addFolder(pathArray) {
    //     this._getNodeAtPath(pathArray, true);
    //     this.render();
    // }

    // /**
    //  * 处理用户选择的文件/文件夹
    //  */
    // handleUpload(fileList, targetPath = []) {
    //     const files = Array.from(fileList);
    //     if (files.length === 0) return;

    //     const fileEntries = [];
    //     files.forEach(file => {
    //         let relPath = file.webkitRelativePath || file.name;
    //         let parts = relPath.split('/').filter(Boolean);
    //         let fileName = parts.pop();
    //         // 拼接目标路径（targetPath 是用户指定的前缀，目前默认空）
    //         const fullParts = [...targetPath, ...parts];
    //         fileEntries.push({ parts: fullParts, fileName });
    //     });

    //     // 按路径分组，批量添加
    //     fileEntries.forEach(({ parts, fileName }) => {
    //         const node = this._getNodeAtPath(parts, true);
    //         if (node) {
    //             this._addFileToNode(node, fileName);
    //         }
    //     });

    //     this.render();
    // }

    // ======================== UI 绑定 ==========================

    _bindUI() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this._bindUIInternal());
        } else {
            this._bindUIInternal();
        }
    }

    _bindUIInternal() {
        this.render();

        const fileInput = document.querySelector(this.fileInput);
        const addBtn = document.querySelector('#addFileBtn');

        if (addBtn && fileInput) {
            addBtn.addEventListener('click', () => fileInput.click());

            fileInput.addEventListener('change', function () {
                if (this.files && this.files.length > 0) {
                    window.app.handleUpload(this.files, []);
                    this.value = '';
                }
            });
        }
    }
}

// ================================================================
//  🚀  实例化
// ================================================================
const app = new LearningApp();
window.app = app;