/**
 * 渲染引擎
 * 职责：将树形数据递归渲染为 DOM 树。
 * 支持传入 fileUrlMap，如果有临时 URL 则使用，否则使用相对路径。
 */
export class RenderEngine {
    constructor(containerSelector) {
        this.containerSelector = containerSelector;
    }

    /**
     * 渲染整棵树
     * @param {Object} data - 树形数据根节点
     * @param {Object} fileUrlMap - 路径 → Blob URL 的映射
     */
    render(data, fileUrlMap = {}) {
        const container = document.querySelector(this.containerSelector);
        if (!container) return;
        container.innerHTML = '';
        this._renderNode(data, '', container, fileUrlMap);
    }

    _renderNode(node, path, container, fileUrlMap) {
        if (Array.isArray(node)) {
            this._renderFileList(node, path, container, fileUrlMap);
        } else {
            this._renderDirectory(node, path, container, fileUrlMap);
        }
    }

    _renderFileList(files, path, container, fileUrlMap) {
        const ul = document.createElement('ul');
        files.slice().sort().forEach(name => {
            const li = document.createElement('li');
            li.className = 'file';
            const a = document.createElement('a');

            const fullPath = path ? `${path}/${name}` : name;

            if (fileUrlMap[fullPath]) {
                a.href = fileUrlMap[fullPath];
                // 不加 download，让浏览器自行决定（PDF 预览、图片显示、其他下载）
            } else {
                a.href = fullPath;
            }

            a.target = '_blank';
            a.textContent = `📄 ${name}`;
            li.appendChild(a);
            ul.appendChild(li);
        });
        container.appendChild(ul);
    }

    _renderDirectory(node, path, container, fileUrlMap) {
        const ul = document.createElement('ul');
        const keys = Object.keys(node).filter(k => k !== '_files').sort();

        keys.forEach(key => {
            const li = this._createFolderItem(key, node[key], path, fileUrlMap);
            ul.appendChild(li);
        });

        if (node._files && Array.isArray(node._files)) {
            this._renderFileList(node._files, path, ul, fileUrlMap);
        }
        container.appendChild(ul);
    }

    _createFolderItem(folderName, childNode, parentPath, fileUrlMap) {
        const li = document.createElement('li');
        const span = document.createElement('span');
        span.className = 'folder';
        span.textContent = `📁 ${folderName}`;
        li.appendChild(span);

        const childDiv = document.createElement('div');
        childDiv.className = 'hidden';
        const newPath = parentPath ? `${parentPath}/${folderName}` : folderName;
        this._renderNode(childNode, newPath, childDiv, fileUrlMap);
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
}