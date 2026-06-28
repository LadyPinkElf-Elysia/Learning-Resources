/**
 * 渲染引擎
 * 职责：将树形数据递归渲染为 DOM 树。
 * 只读数据，不修改数据。
 */
export class RenderEngine {
    constructor(containerSelector) {
        this.containerSelector = containerSelector;
    }

    /**
     * 渲染整棵树
     * @param {Object} data - 树形数据根节点
     */
    render(data) {
        const container = document.querySelector(this.containerSelector);
        if (!container) return;
        container.innerHTML = '';
        this._renderNode(data, '', container);
    }

    /** 递归调度器 */
    _renderNode(node, path, container) {
        if (Array.isArray(node)) {
            this._renderFileList(node, path, container);
        } else {
            this._renderDirectory(node, path, container);
        }
    }

    /** 渲染文件列表 */
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

    /** 渲染文件夹 */
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

    /** 创建单个文件夹 DOM */
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

    /** 展开/折叠 + 空目录提示 */
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
}