<script setup lang="ts">
import TreeView from './components/TreeView.vue';
import { useTreeStore } from './stores/tree';

const treeStore = useTreeStore()
</script>

<template>
    <div class="page-layout">
        <header class="app-header">
            <h1>📚 学习资料库</h1>
            <h2>点击 📁 文件夹展开 / 收起</h2>
        </header>
        
        <main class="content-card">
            <TreeView 
                :filtered-count="treeStore.filteredFileCount" 
                :total-count="treeStore.totalFileCount"
                :tree="treeStore.filteredTree" 
                v-model:search="treeStore.searchQuery">
            </TreeView>
        </main>
        
        <footer class="app-footer">
            <a href="https://github.com/ladypinkelf-elysia/Learning-Resources" target="_blank">GitHub 仓库</a>
        </footer>
    </div>
</template>

<style scoped>
/* 铺满屏幕的背景 */
.page-layout {
    min-height: 100vh;
    background: #f1f5f9; /* 现代浅灰蓝背景 */
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 40px 20px;
    box-sizing: border-box;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "PingFang SC", sans-serif;
}

/* 头部排版 */
.app-header {
    text-align: center;
    margin-bottom: 24px;
}

.app-header h1 {
    margin: 0 0 8px 0;
    font-size: 2rem;
    color: #1e293b;
    font-weight: 700;
    letter-spacing: 1px;
}

.app-header h2 {
    margin: 0;
    font-size: 0.95rem;
    color: #64748b;
    font-weight: 400;
}

/* 主内容区（白色卡片） */
.content-card {
    width: 100%;
    max-width: 800px; /* 限制卡片最大宽度 */
    background: #ffffff;
    border-radius: 16px;
    padding: 32px;
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01);
    box-sizing: border-box;
}

/* 页脚 */
.app-footer {
    margin-top: auto; /* 自动推到最底部 */
    padding-top: 40px;
    font-size: 0.9rem;
}

.app-footer a {
    color: #94a3b8;
    text-decoration: none;
    transition: color 0.2s;
}

.app-footer a:hover {
    color: #2563eb;
}
</style>