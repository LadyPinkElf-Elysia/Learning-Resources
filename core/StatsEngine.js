// core/StatsEngine.js
export class StatsEngine {
    static countFiles(node) {
        let total = 0;
        const stack = [node];

        // 使用循环而非递归，避免层级过深导致栈溢出
        while (stack.length > 0) {
            const current = stack.pop();
            if (Array.isArray(current)) {
                total += current.length;
            } else {
                for (const key of Object.keys(current)) {
                    if (key === '_files') {
                        total += current._files.length;
                    } else {
                        stack.push(current[key]);
                    }
                }
            }
        }
        return total;
    }

    static updateDisplay(el, total) {
        if (el) {
            el.textContent = total;
        }
    }
}