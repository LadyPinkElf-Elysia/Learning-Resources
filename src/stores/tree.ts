import type { FolderNode, PathArray } from "@/types/tree";
import { countFiles, createFolderNode, filterTree, findNode } from "@/utils/tree";
import { defineStore } from "pinia";
import { computed, ref, shallowRef } from "vue";
import docsPaths from "@/data/docs-paths.json";

export const useTreeStore=defineStore('treeStore',()=>{
    const tree = shallowRef<FolderNode>(createFolderNode(docsPaths))

    const searchQuery=ref('')

    const filteredTree=computed(()=>searchQuery.value.length===0 ? tree.value:filterTree(tree.value,searchQuery.value))

    const totalFileCount=computed(()=>docsPaths.length)

    const filteredFileCount=computed(()=>countFiles(filteredTree.value))

    const getNode=(path:PathArray):FolderNode|null=>findNode(tree.value,path)

    return {
        tree,searchQuery,
        filteredTree,totalFileCount,filteredFileCount,
        getNode
    }
})