export const Common_Styles = {
    btnSmall: { fontSize: '0.85rem', padding: '0.35rem 0.5rem' },
    smallText: { fontSize: '0.85rem' },
    smallLabel: { fontSize: '0.8rem' }
};

export const QUICK_DATES = [
    { id: 'today', label: 'Today', offset: 0 },
    { id: 'tomorrow', label: 'Tomorrow', offset: 1 },
    { id: 'nextWeek', label: 'Next Week', offset: 7 },
    { id: 'nextMonth', label: 'Next Month', offset: null }
] as const;

export const DAYS_ABBREV = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
export const DAYS_FULL = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];