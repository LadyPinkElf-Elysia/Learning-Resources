import type { FileNode, FilePaths, FolderNode, PathArray } from "@/types/tree"

const sortFolder = (node: FolderNode): void => {
    /** 按名字比较 localeCompare 
     * 数字自然排序 '2' < '10'
     * 中文按拼音排 '阿' < '波'
     */
    const compareByName = (a: string, b: string): number => a.localeCompare(b);

    node.files.sort((fileA, fileB) => compareByName(fileA.name, fileB.name))

    node.folders = Object.fromEntries(
        Object.entries(node.folders).sort(([nameA], [nameB]) =>
            compareByName(nameA, nameB)
        )
    )

    //递归处理子文件夹
    for (const child of Object.values(node.folders)) {
        sortFolder(child)
    }
}

/** 创建文件节点 */
export const createFileNode = (name: string, url: string): FileNode => ({
    name, url
})

/** 创建空的文件夹节点 */
export const createEmptyFolderNode = (): FolderNode => ({
    files: [],
    folders: {}
})

/** 根据路径数组创建文件夹节点 */
export const createFolderNode = (paths: FilePaths): FolderNode => {
    const root: FolderNode = createEmptyFolderNode()

    for (const raw of paths) {
        // 1. 拆路径：'物理/电磁学/法拉第.html' → ['物理', '电磁学', '法拉第.html']
        //filter(Boolean) 过滤掉数组里的"假值"（false、0、''、null、undefined、NaN）
        const parts = raw.split('/').filter(Boolean)
        const fileName = parts.pop()
        if (!fileName) continue

        let node = root
        for (const folderName of parts) {
            if (!node.folders[folderName]) {
                node.folders[folderName] = createEmptyFolderNode();
            }
            node = node.folders[folderName];
        }

        if (!node.files.some(f => f.name === fileName)) {
            node.files.push(createFileNode(fileName, raw))
        }
    }

    sortFolder(root)
    return root
}

/**
 * 按路径查节点，找不到返回 null。
 * 根节点传 [] 返回自身。
 */
export const findNode = (root: FolderNode, path: PathArray): FolderNode | null => {
    let node = root
    for (const folderName of path) {
        const child = node.folders[folderName]
        if (!child) return null
        node = child
    }
    return node
}


export const filterTree = (node: FolderNode, keyword: string): FolderNode => {
    if (!keyword.trim()) return createEmptyFolderNode()

    const kw=keyword.toLowerCase()

    const matchedFiles=node.files.filter(f=>f.name.toLowerCase().includes(kw))
    
    const matchedFolders:Record<string,FolderNode>={}
    for(const [name,child] of Object.entries(node.folders)){
        const isNameMatched=name.toLowerCase().includes(kw)
        const filteredChild=filterTree(child,keyword)
        const hasMatchedContent=filteredChild.files.length>0||Object.keys(filteredChild.folders).length>0
        if(isNameMatched){
            matchedFolders[name]=child
        }else if(hasMatchedContent){
            matchedFolders[name]=filteredChild
        }
    }

    return {
        files:matchedFiles,
        folders:matchedFolders
    }
}

export const countFiles=(node:FolderNode):number=>{
    let count =node.files.length
    for(const child of Object.values(node.folders)){
        count+=countFiles(child)
    }
    return count
}