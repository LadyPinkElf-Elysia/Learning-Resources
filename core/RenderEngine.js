// core/RenderEngine.js
export class RenderEngine {
    static render(container, data, urlMap) {
        if (!container) return;
        container.innerHTML = '';
        this._renderNode(data, '', container, urlMap);
    }

    static _renderNode(node, path, container, urlMap) {
        if (Array.isArray(node)) {
            this._renderFileList(node, path, container, urlMap);
        } else {
            this._renderDirectory(node, path, container, urlMap);
        }
    }

    static _renderFileList(files, path, container, urlMap) {
        const ul = document.createElement('ul');
        files.slice().sort().forEach(name => {
            const li = document.createElement('li');
            li.className = 'file';
            const a = document.createElement('a');

            const fullPath = path ? `${path}/${name}` : name;
            a.href = urlMap[fullPath] || fullPath;
            a.target = '_blank';
            a.textContent = `📄 ${name}`;

            li.appendChild(a);
            ul.appendChild(li);
        });
        container.appendChild(ul);
    }

    static _renderDirectory(node, path, container, urlMap) {
        const ul = document.createElement('ul');
        const keys = Object.keys(node).filter(k => k !== '_files').sort();

        keys.forEach(key => {
            const li = this._createFolderItem(key, node[key], path, urlMap);
            ul.appendChild(li);
        });

        if (node._files && Array.isArray(node._files)) {
            this._renderFileList(node._files, path, ul, urlMap);
        }
        container.appendChild(ul);
    }

    static _createFolderItem(folderName, childNode, parentPath, urlMap) {
        const li = document.createElement('li');
        const span = document.createElement('span');
        span.className = 'folder';
        span.textContent = `📁 ${folderName}`;
        li.appendChild(span);

        const childDiv = document.createElement('div');
        childDiv.className = 'hidden';
        const newPath = parentPath ? `${parentPath}/${folderName}` : folderName;
        this._renderNode(childNode, newPath, childDiv, urlMap);
        li.appendChild(childDiv);

        // 隐藏状态下，占位提示符
        const hint = document.createElement('div');
        hint.className = 'empty-hint hidden';
        hint.textContent = '📭 目前暂无资料';
        childDiv.appendChild(hint);

        span.addEventListener('click', (e) => {
            e.stopPropagation();
            this._toggleFolder(childDiv);
        });

        return li;
    }

    static _toggleFolder(container) {
        const isHidden = container.classList.contains('hidden');
        if (isHidden) {
            container.classList.remove('hidden');
            const ulElem = container.querySelector('ul');
            const hasContent = ulElem && ulElem.children.length > 0;
            const hint = container.querySelector('.empty-hint');
            if (!hasContent && hint) {
                hint.classList.remove('hidden');
            }
        } else {
            container.classList.add('hidden');
            // 收起时顺带把提示也隐藏
            const hint = container.querySelector('.empty-hint');
            if (hint) {
                hint.classList.add('hidden');
            }
        }
    }
}