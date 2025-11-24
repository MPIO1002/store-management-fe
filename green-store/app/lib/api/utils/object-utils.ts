

export const trimAll = (object: Record<string, any>) => {
    for (let key in object) {
        let value = object[key];
        if (!value) continue;

        if (typeof value === "string") {
            object[key] = value.trim();
        }
    }
}