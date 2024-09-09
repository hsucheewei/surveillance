export function createUniqueId() {
    return Date.now() * Math.round(Math.random() * 1e3)
}