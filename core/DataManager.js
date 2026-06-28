/**
 * 数据管理器
 * 职责：存储树形数据，提供路径查找、文件添加等操作。
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

    // 预留：批量上传处理
    // handleUpload(fileList, targetPath) { ... }
}