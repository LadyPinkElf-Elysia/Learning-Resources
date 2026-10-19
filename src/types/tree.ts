/** 文件节点 */
export interface FileNode{
    /** name 文件名，如 '热学.html' */
    name:string
    /** url 从 docs 根到文件的相对路径，如 '物理/热学.html'。渲染时拼 /docs/${url} */
    url:string
}

/** 文件夹节点 根节点也是 FolderNode（匿名文件夹） */
export interface FolderNode{
    /** files 当前文件夹下的直接文件（不含子文件夹里的） */
    files:FileNode[]
    /** folders 子文件夹。键 = 文件夹名，值 = 子文件夹节点 */
    folders:Record<string,FolderNode>
}

/** 路径段数组，如 ['物理', '初等数学', '函数']，对应路径 '物理/初等数学/函数' */
export type PathArray=string[]

/** html 文件的完整相对路径数组，如 ['物理/热学.html', '物理/电磁学/法拉第.html'] */
export type FilePaths = string[]

/** 文件夹展开状态映射：键 = 文件夹名，值 = 是否展开 */
export type FolderOpenState = Record<string, boolean>