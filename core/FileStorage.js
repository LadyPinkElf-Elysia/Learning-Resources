// core/FileStorage.js
export class FileStorage {
    static addFiles(store, fileList) {
        const newStore = { ...store };
        const files = Array.from(fileList);

        files.forEach(file => {
            const fullPath = file.webkitRelativePath || file.name;
            if (!fullPath) return;

            if (newStore[fullPath]) {
                URL.revokeObjectURL(newStore[fullPath]);
            }

            const url = URL.createObjectURL(file);
            newStore[fullPath] = url;
        });

        return newStore;
    }

    static getUrl(store, fullPath) {
        return store[fullPath] || null;
    }

    static getUrlMap(store) {
        return { ...store };
    }

    static revokeUrl(store, fullPath) {
        const newStore = { ...store };
        if (newStore[fullPath]) {
            URL.revokeObjectURL(newStore[fullPath]);
            delete newStore[fullPath];
        }
        return newStore;
    }

    static revokeAll(store) {
        Object.values(store).forEach(url => URL.revokeObjectURL(url));
        return {};
    }

    static hasFile(store, fullPath) {
        return !!store[fullPath];
    }
}