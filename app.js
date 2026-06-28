import { DataManager } from './core/DataManager.js';
import { RenderEngine } from './core/RenderEngine.js';
import { StatsEngine } from './core/StatsEngine.js';
import { FileStorage } from './core/FileStorage.js';

/**
 * 主应用类（组合器）
 * 职责：持有 DataManager、RenderEngine、FileStorage，协调它们完成工作。
 * 负责 UI 事件绑定（按钮点击等）。
 */
export class App {
    constructor() {
        this.dataManager = new DataManager();
        this.renderEngine = new RenderEngine('#tree-container');
        this.statsEngine = StatsEngine;
        this.fileStorage = new FileStorage();

        this._bindUI();
    }

    /** 渲染入口（外部调用） */
    render() {
        const data = this.dataManager.getData();
        const urlMap = this.fileStorage.getUrlMap();
        this.renderEngine.render(data, urlMap);
        this._updateStats();
    }

    /** 更新统计显示 */
    _updateStats() {
        const data = this.dataManager.getData();
        const total = this.statsEngine.countFiles(data);
        this.statsEngine.updateDisplay('#file-count', total);
    }

    /** 绑定 UI 事件 */
    _bindUI() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this._bindUIInternal());
        } else {
            this._bindUIInternal();
        }
    }

    _bindUIInternal() {
        this.render();

        const fileInput = document.querySelector('#fileInput');
        const addBtn = document.querySelector('#addFileBtn');

        if (addBtn && fileInput) {
            addBtn.addEventListener('click', () => fileInput.click());

            fileInput.addEventListener('change', (e) => {
                const files = e.target.files;
                if (files && files.length > 0) {
                    // 1. 更新树形结构
                    const added = this.dataManager.handleUpload(files, []);
                    
                    // 2. 存储文件内容（生成 Blob URL）
                    const stored = this.fileStorage.addFiles(files);

                    // 3. 重新渲染
                    this.render();

                    e.target.value = '';
                }
            });
        }
    }

    // ========== 预留接口（手动添加） ==========
    addFile(pathArray, filename) {
        const node = this.dataManager.getNodeAtPath(pathArray, true);
        if (node) {
            this.dataManager.addFileToNode(node, filename);
            this.render();
        }
    }

    addFolder(pathArray) {
        this.dataManager.getNodeAtPath(pathArray, true);
        this.render();
    }

    // ========== 清理（组件卸载时调用） ==========
    destroy() {
        this.fileStorage.revokeAll();
        this.renderEngine = null;
        this.dataManager = null;
    }
}