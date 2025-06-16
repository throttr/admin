import type {Column} from "@tanstack/vue-table";
import UButton from '@nuxt/ui/components/Button.vue';
import { h } from 'vue'

export const formatDate = (value: number, isNano: boolean): string => {
    const ms = isNano ? Math.floor(value / 1e6) : value * 1000;
    const date = new Date(ms);
    return date.toLocaleString();
}


export function getHeader(column: Column<any>, label: string) {
    const isSorted = column.getIsSorted()

    return h(
        UButton,
        {
            variant: "ghost",
            content: {
                align: 'start'
            },
            icon: isSorted
                ? isSorted === 'asc'
                    ? 'i-lucide-arrow-up-narrow-wide'
                    : 'i-lucide-arrow-down-wide-narrow'
                : 'i-lucide-arrow-up-down',
            class: '-mx-2.5 data-[state=open]:bg-elevated',
            'aria-label': `Sort by ${isSorted === 'asc' ? 'descending' : 'ascending'}`,
            onClick() {
                if (isSorted === 'asc') {
                    column.toggleSorting(true)
                } else if (isSorted === 'desc') {
                    column.clearSorting()
                } else {
                    column.toggleSorting(false)
                }
            },
            label,
        }
    )
}