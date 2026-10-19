<script setup lang="ts">
import type { FolderNode, FolderOpenState } from '@/types/tree';
import { ref } from 'vue';

defineOptions({
    name: "TreeNode"
})

const props = defineProps<{
    node: FolderNode
    forceOpen?: boolean
}>()

const expandedFolders = ref<FolderOpenState>({})

const toggleFolder = (folderName: string): void => {
    expandedFolders.value[folderName] = !expandedFolders.value[folderName]
}

const fileUrl = (url: string): string => `/docs/${url}`
</script>

<template>
    <ul class="tree-ul">
        <!-- 先递归渲染子文件夹 -->
        <li v-for="(folder, folderName) in node.folders" :key="folderName" class="tree-li">
            <div class="tree-row" @click="toggleFolder(folderName)">
                <span class="tree-text">
                    {{ expandedFolders[folderName] || forceOpen ? "📂" : "📁" }} {{ folderName }}
                </span>
            </div>
            <div v-show="expandedFolders[folderName] || forceOpen" class="tree-children">
                <TreeNode :node="folder" :force-open></TreeNode>
            </div>
        </li>

        <!-- 再渲染当前文件夹下的文件 -->
        <li v-for="file in node.files" :key="file.name" class="tree-li">
            <div class="tree-row">
                <a :href="fileUrl(file.url)" target="_blank" rel="noopener noreferrer" class="tree-link">
                    📄 {{ file.name }}
                </a>
            </div>
        </li>
    </ul>
</template>

<style scoped>
/* 1. 基础重置：去掉 ul 默认缩进，缩进全交由 tree-children 控制 */
.tree-ul {
    list-style: none;
    margin: 0;
    padding: 0;
}

.tree-li {
    margin: 2px 0;
}

/* 2. 行样式 */
.tree-row {
    padding: 4px 8px;
    border-radius: 6px;
    cursor: pointer;
    line-height: 1.6;
}

.tree-row:hover {
    background-color: #e2e8f0;
}

.tree-text,
.tree-link {
    color: #0f172a;
    text-decoration: none;
    font-size: 15px;
}

.tree-link {
    color: #2563eb;
}

/* =========================================
   3. 核心：利用 tree-children 的左边框画出对齐线
   ========================================= */
.tree-children {
    /* 就是这条边框构成了你要的竖线 | */
    border-left: 1px solid #cbd5e1;

    /* 竖线的位置：16px 刚好在父级 emoji 📁 的正中间下方 */
    margin-left: 16px;

    /* 子级内容距离线条的间距 */
    padding-left: 12px;
}
</style>