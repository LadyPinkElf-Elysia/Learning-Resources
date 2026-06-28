/**
 * 统计引擎
 * 职责：递归统计文件数量，更新统计显示。
 * 纯函数风格，不持有状态。
 */
export class StatsEngine {
    /**
     * 递归统计文件总数
     */
    static countFiles(node) {
        if (Array.isArray(node)) {
            return node.length;
        }
        let total = 0;
        for (const key of Object.keys(node)) {
            if (key === '_files') {
                total += node._files.length;
            } else {
                total += this.countFiles(node[key]);
            }
        }
        return total;
    }

    /**
     * 更新页面统计显示
     */
    static updateDisplay(selector, total) {
        const el = document.querySelector(selector);
        if (el) {
            el.textContent = total;
        }
    }
}