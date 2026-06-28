/**
 * 数据管理器
 * 职责：存储树形数据，提供路径查找、文件添加、批量导入等操作。
 * 不涉及任何 DOM 或渲染逻辑。
 */
export class DataManager {
    constructor() {
        this.data = {
            "数学": {
                "初等数学": {
                    "函数": {
                        "抽象函数": ["函数.html"],
                        "导数": [],
                        "三角函数": ["三角函数.html"]
                    },
                    "立体几何": ["立体几何.html"],
                    "解三角": [],
                    "数列": ["数列.html"],
                    "不等式": [],
                    "圆锥曲线": [],
                    "概率": [],
                },
                "高等数学": {
                    "微分方程": ["化归.html"],
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
    }

    /** 获取根数据引用 */
    getData() {
        return this.data;
    }

    /**
     * 根据路径查找节点（核心引擎）
     * @param {string[]} pathArray - 路径片段，如 ['数学', '高等数学']
     * @param {boolean} autoCreate - 是否自动创建
     * @returns {Object|null}
     */
    getNodeAtPath(pathArray, autoCreate = false) {
        if (pathArray.length === 0) return this.data;

        let node = this.data;
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

    /**
     * 向节点添加文件（自动去重）
     */
    addFileToNode(node, filename) {
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

    // /**
    //  * 批量处理用户上传的文件/文件夹
    //  *
    //  * 利用 webkitRelativePath 解析相对路径，
    //  * 自动创建不存在的父级目录，将文件添加到对应的叶子节点。
    //  *
    //  * @param {FileList} fileList - 从 input[type=file] 获取的文件列表
    //  * @param {string[]} targetPath - 目标根路径（默认为空数组，即根目录）
    //  * @returns {number} 成功添加的文件数量
    //  */
    // handleUpload(fileList, targetPath = []) {
    //     const files = Array.from(fileList);
    //     if (files.length === 0) return 0;

    //     let addedCount = 0;

    //     const fileEntries = [];
    //     files.forEach(file => {
    //         let relPath = file.webkitRelativePath || file.name;
    //         let parts = relPath.split('/').filter(Boolean);
    //         let fileName = parts.pop();
    //         const fullParts = [...targetPath, ...parts];
    //         fileEntries.push({ parts: fullParts, fileName });
    //     });

    //     fileEntries.forEach(({ parts, fileName }) => {
    //         const node = this.getNodeAtPath(parts, true);
    //         if (node) {
    //             const before = Array.isArray(node) ? node.length : (node._files || []).length;
    //             this.addFileToNode(node, fileName);
    //             const after = Array.isArray(node) ? node.length : (node._files || []).length;
    //             if (after > before) addedCount++;
    //         }
    //     });

    //     return addedCount;
    // }

}