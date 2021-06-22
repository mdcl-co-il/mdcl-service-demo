export const makeUtilsService = () => {
    const formatTimeStampToString = (timestamp) => {
        return new Intl.DateTimeFormat(
            'en',
            {
                weekday: 'long',
                month: 'long',
                year: 'numeric',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                hourCycle: 'h23'
            }
        ).format(new Date(timestamp * 1000))
    };

    return Object.freeze({
        formatTimeStampToString
    });
};

