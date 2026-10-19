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
.tree-ul {
    list-style: none;
    margin: 0;
    padding: 0;
}

.tree-li {
    margin: 2px 0;
}

/* 行交互效果 */
.tree-row {
    padding: 6px 10px; /* 加大一点点内边距，更好点按 */
    border-radius: 6px;
    cursor: pointer;
    line-height: 1.6;
    transition: background-color 0.15s ease;
    display: block; /* 确保整行都能点，且高度安全 */
}

.tree-row:hover {
    background-color: #f1f5f9;
}

.tree-text,
.tree-link {
    color: #334155;
    text-decoration: none;
    font-size: 15px;
    font-weight: 500;
}

.tree-link {
    color: #2563eb;
    font-weight: 400;
}

.tree-link:hover {
    text-decoration: underline;
}

/* 连线部分（最稳的竖线） */
.tree-children {
    border-left: 1px solid #e2e8f0; /* 颜色调浅一点，更精致 */
    margin-left: 18px;
    padding-left: 12px;
}
</style>