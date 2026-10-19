<script setup lang="ts">
import TreeView from './components/TreeView.vue';
import { useTreeStore } from './stores/tree';

const treeStore = useTreeStore()
</script>

<template>
    <div class="page-layout">
        <header>
            <h1>📚 学习资料库</h1>
            <h2>点击 📁 文件夹展开 / 收起</h2>
        </header>
        <main class="content-card">
            <TreeView :filtered-count="treeStore.filteredFileCount" :total-count="treeStore.totalFileCount"
                :tree="treeStore.filteredTree" v-model:search="treeStore.searchQuery">
            </TreeView>
        </main>
        <footer>
            <a href="https://github.com/ladypinkelf-elysia/Learning-Resources" target="_blank">GitHub 仓库</a>
        </footer>
    </div>
</template>

<style scoped>

</style>