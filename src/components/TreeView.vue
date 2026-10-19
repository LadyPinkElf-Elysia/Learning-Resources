<script setup lang="ts">
import TreeNode from '@/components/TreeNode.vue';
import type { FolderNode } from '@/types/tree';

defineProps<{
    tree:FolderNode
    totalCount: number
    filteredCount: number
}>()

const search = defineModel<string>('search')
</script>

<template>
    <div id="tree-container">
        <input v-model="search" type="text" placeholder="🔍 搜索资料..." class="search-input">

        <div class="status-bar">
            <span v-if="search">
                找到 <strong class="highlight">{{ filteredCount }}</strong> 份资料📚
            </span>
            <span v-else>
                总共 <strong class="highlight">{{ totalCount }}</strong> 份资料📚
            </span>
        </div>

        <div v-if="filteredCount === 0" class="empty-state">
            <span>📭 未找到匹配的资料</span>
        </div>
        <TreeNode v-else :node="tree" :force-open="Boolean(search)"></TreeNode>
    </div>
</template>

<style scoped>
/* 搜索框：占满宽度，更加圆润 */
.search-input {
    width: 100%;
    box-sizing: border-box;
    padding: 12px 16px;
    font-size: 15px;
    color: #1e293b;
    background-color: #f8fafc;
    border: 2px solid #e2e8f0;
    border-radius: 10px;
    outline: none;
    transition: all 0.2s ease;
}

.search-input:hover {
    border-color: #cbd5e1;
}

.search-input:focus {
    background-color: #ffffff;
    border-color: #3b82f6;
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
}

.search-input::placeholder {
    color: #94a3b8;
}

/* 状态栏 */
.status-bar {
    margin: 16px 0;
    color: #64748b;
    font-size: 0.95rem;
}

.highlight {
    color: #3b82f6;
    font-size: 1.1rem;
    margin: 0 4px;
}

/* 空状态 */
.empty-state {
    padding: 40px 0;
    text-align: center;
    color: #94a3b8;
    background: #f8fafc;
    border-radius: 8px;
    font-size: 15px;
}
</style>