import { DataManager } from './core/DataManager.js';
import { RenderEngine } from './core/RenderEngine.js';
import { StatsEngine } from './core/StatsEngine.js';

/**
 * 主应用类（组合器）
 * 职责：持有 DataManager、RenderEngine，协调它们完成工作。
 * 负责 UI 事件绑定（按钮点击等）。
 */
export class App {
    constructor() {
        // 1. 初始化各模块
        this.dataManager = new DataManager();
        this.renderEngine = new RenderEngine('#tree-container');
        this.statsEngine = StatsEngine; // 静态类，直接引用

        // 2. 绑定 UI 事件
        this._bindUI();
    }

    /** 渲染入口（外部调用） */
    render() {
        const data = this.dataManager.getData();
        this.renderEngine.render(data);
        this._updateStats();
    }

    /** 更新统计显示 */
    _updateStats() {
        const data = this.dataManager.getData();
        const total = this.statsEngine.countFiles(data);
        this.statsEngine.updateDisplay('#file-count', total);
    }

    /** 绑定 UI 事件（按钮等） */
    _bindUI() {
        // 等待 DOM 就绪
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this._bindUIInternal());
        } else {
            this._bindUIInternal();
        }
    }

    _bindUIInternal() {
        // 首次渲染
        this.render();

        // 绑定添加按钮（预留）
        const fileInput = document.querySelector('#fileInput');
        const addBtn = document.querySelector('#addFileBtn');

        if (addBtn && fileInput) {
            addBtn.addEventListener('click', () => fileInput.click());

            fileInput.addEventListener('change', function () {
                if (this.files && this.files.length > 0) {
                    // 暂未启用：this.handleUpload(this.files);
                    this.value = '';
                }
            });
        }
    }

    // ========== 以下为预留接口（暂未启用） ==========
    // addFile(pathArray, filename) {
    //     const node = this.dataManager.getNodeAtPath(pathArray, true);
    //     if (node) {
    //         this.dataManager.addFileToNode(node, filename);
    //         this.render();
    //     }
    // }
}