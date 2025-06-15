export const formatDate = (value: number, isNano: boolean): string => {
    const ms = isNano ? Math.floor(value / 1e6) : value * 1000;
    const date = new Date(ms);
    return date.toLocaleString();
}