// src/app.js
import { DataManager } from './core/DataManager.js';
import { RenderEngine } from './core/RenderEngine.js';
import { StatsEngine } from './core/StatsEngine.js';
import { FileStorage } from './core/FileStorage.js';

const DEFAULT_DATA = {
    "数学": {
        "初等数学": {
            "函数": {
                "抽象函数": ["函数.html"],
                //"导数": [],
                "三角函数": ["三角函数.html"]
            },
            "立体几何": ["立体几何.html"],
            //"解三角": [],
            "数列": ["数列.html"],
            //"不等式": [],
            //"圆锥曲线": [],
            //"概率": [],
        },
        "高等数学": {
            "微分方程": ["化归.html","作者感言.html"],
            //"不定积分": []
        }
    },
    // "物理": {
    //     "电磁学": {
    //         "电学": [],
    //         "磁学": [],
    //         "电磁感应": []
    //     },
    //     "热力学": [],
    //     "运动学": []
    // },
    "化学":{
        "无机化学":{
            "因果推断":["因果推断.html"],
            "元素推断":["元素周期律.html"]
        },
        "有机化学":{
            "有机物推断":["有机推断.html"]
        }
    }
};

export class App {
    constructor() {
        this.data = DEFAULT_DATA;
        this.blobStore = {};
        
        // 缓存 DOM 节点，避免每次都去 document.querySelector
        this.container = document.querySelector('#tree-container');
        this.statsEl = document.querySelector('#file-count');
        this.fileInput = document.querySelector('#fileInput');
        this.addBtn = document.querySelector('#addFileBtn');

        this._bindUI();
    }

    render() {
        // 传入缓存的 DOM 节点，直接渲染
        RenderEngine.render(this.container, this.data, this.blobStore);
        this._updateStats();
    }

    _updateStats() {
        const total = StatsEngine.countFiles(this.data);
        StatsEngine.updateDisplay(this.statsEl, total);
    }

    _bindUI() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this._bindUIInternal());
        } else {
            this._bindUIInternal();
        }
    }

    _bindUIInternal() {
        this.render();

        if (this.addBtn && this.fileInput) {
            this.addBtn.addEventListener('click', () => this.fileInput.click());

            this.fileInput.addEventListener('change', (e) => {
                const files = e.target.files;
                if (files && files.length > 0) {
                    // DataManager 现在返回全新的数据对象
                    this.data = DataManager.handleUpload(this.data, files);
                    this.blobStore = FileStorage.addFiles(this.blobStore, files);
                    
                    this.render();
                    e.target.value = '';
                }
            });
        }
    }

    addFile(pathArray, filename) {
        this.data = DataManager.addFileToNode(this.data, pathArray, filename);
        this.render();
    }

    addFolder(pathArray) {
        DataManager.getNodeAtPath(this.data, pathArray, true);
        this.render();
    }

    destroy() {
        this.blobStore = FileStorage.revokeAll(this.blobStore);
        this.data = null;
        this.container = null;
        this.statsEl = null;
    }
}