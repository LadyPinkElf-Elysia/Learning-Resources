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

        <p v-if="search">
            找到 <strong>{{ filteredCount }}</strong> 份资料📚
        </p>
        <p v-else>
            总共 <strong>{{ totalCount }}</strong> 份资料📚
        </p>

        <p v-if="filteredCount===0">📭 未找到匹配的资料</p>
        <TreeNode v-else :node="tree" :force-open="Boolean(search)"></TreeNode>
    </div>
</template>

<style scoped>
/* 搜索框美化 */
.search-input {
    width: 100%;
    max-width: 320px;         /* 控制最大宽度，不会拉得满屏都是 */
    box-sizing: border-box;   /* 防止 padding 撑破宽度 */
    padding: 10px 16px;       /* 上下左右的内边距，让输入框更饱满 */
    margin-bottom: 16px;      /* 和下方文字留出呼吸空间 */
    
    font-size: 14px;
    color: #0f172a;
    background-color: #f8fafc; /* 浅浅的灰蓝色背景 */
    
    border: 1px solid #cbd5e1; /* 默认灰色边框 */
    border-radius: 8px;        /* 圆角 */
    
    outline: none;             /* 去掉浏览器默认的丑陋黑框 */
    transition: all 0.2s ease; /* 状态切换时平滑过渡 */
}

/* 鼠标悬浮时边框加深 */
.search-input:hover {
    border-color: #94a3b8;
}

/* 聚焦（点击输入）时的高亮效果 */
.search-input:focus {
    background-color: #ffffff;
    border-color: #2563eb;     /* 变蓝 */
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15); /* 外加一圈淡淡的蓝色光晕 */
}

/* 美化提示文字（Placeholder）的颜色 */
.search-input::placeholder {
    color: #94a3b8;
}
</style>