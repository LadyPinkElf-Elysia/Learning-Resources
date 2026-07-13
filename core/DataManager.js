// core/DataManager.js
export class DataManager {
    static getNodeAtPath(data, pathArray, autoCreate = false) {
        if (pathArray.length === 0) return data;

        let node = data;
        for (const folder of pathArray) {
            if (node[folder] === undefined) {
                if (autoCreate) {
                    node[folder] = {};
                } else {
                    return null;
                }
            } else if (Array.isArray(node[folder])) {
                const existingFiles = node[folder].slice();
                node[folder] = { _files: existingFiles };
            }
            node = node[folder];
        }
        return node;
    }

    static addFileToNode(data, pathArray, filename) {
        // 深度克隆，避免直接修改原数据
        const newData = structuredClone(data);
        const node = this.getNodeAtPath(newData, pathArray, true);
        
        if (!node) return newData;

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
        return newData;
    }

    static handleUpload(data, fileList) {
        const files = Array.from(fileList);
        if (files.length === 0) return data;

        // 依然是使用深拷贝保证绝对纯净
        let newData = structuredClone(data);

        const fileEntries = [];
        files.forEach(file => {
            let relPath = file.webkitRelativePath || file.name;
            let parts = relPath.split('/').filter(Boolean);
            let fileName = parts.pop();
            fileEntries.push({ parts, fileName });
        });

        fileEntries.forEach(({ parts, fileName }) => {
            newData = this.addFileToNode(newData, parts, fileName);
        });

        return newData;
    }
}