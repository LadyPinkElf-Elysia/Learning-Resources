/**
 * 文件存储模块
 * 职责：存储用户上传的文件内容（Blob），生成并管理临时 URL。
 * 不涉及树形数据结构，只负责文件内容的管理。
 */
export class FileStorage {
    constructor() {
        /** @type {Map<string, { blob: Blob, url: string }>} */
        this._storage = new Map();
    }

    /**
     * 添加文件列表到存储中
     * @param {FileList} fileList - 用户上传的文件列表
     * @returns {string[]} 成功添加的文件路径列表
     */
    addFiles(fileList) {
        const files = Array.from(fileList);
        const addedPaths = [];

        files.forEach(file => {
            const fullPath = file.webkitRelativePath || file.name;
            if (!fullPath) return;

            // 如果已存在，先撤销旧 URL
            if (this._storage.has(fullPath)) {
                this.revokeUrl(fullPath);
            }

            const url = URL.createObjectURL(file);
            this._storage.set(fullPath, { blob: file, url });
            addedPaths.push(fullPath);
        });

        return addedPaths;
    }

    /**
     * 获取指定路径的临时 URL
     * @param {string} fullPath - 完整路径
     * @returns {string|null}
     */
    getUrl(fullPath) {
        const entry = this._storage.get(fullPath);
        return entry ? entry.url : null;
    }

    /**
     * 获取所有路径到 URL 的映射对象
     * @returns {Object<string, string>}
     */
    getUrlMap() {
        const map = {};
        for (const [path, entry] of this._storage) {
            map[path] = entry.url;
        }
        return map;
    }

    /**
     * 撤销指定路径的 Blob URL
     */
    revokeUrl(fullPath) {
        const entry = this._storage.get(fullPath);
        if (entry) {
            URL.revokeObjectURL(entry.url);
            this._storage.delete(fullPath);
        }
    }

    /**
     * 撤销所有 Blob URL
     */
    revokeAll() {
        for (const [path, entry] of this._storage) {
            URL.revokeObjectURL(entry.url);
        }
        this._storage.clear();
    }

    /**
     * 检查指定路径是否已有文件内容
     */
    has(fullPath) {
        return this._storage.has(fullPath);
    }

    /**
     * 获取存储的文件数量
     */
    get size() {
        return this._storage.size;
    }
}