/**
 * ICulture
 */
interface ICulture {
    name: string,
    numberFormat: {
        pattern: Array<string>,
        decimals: number,
        ",": string,
        ".": string,
        groupSize: Array<number>,
        percent: {
            pattern: Array<string>,
            decimals: number,
            ",": string,
            ".": string,
            groupSize: Array<number>,
            symbol: string
        },
        currency: {
            name: string,
            abbr: string,
            pattern: Array<string>,
            decimals: number,
            ",": string,
            ".": string,
            groupSize: Array<number>,
            symbol: string
        }
    },
    calendars: {
        standard: {
            days: {
                names: Array<string>,
                namesAbbr: Array<string>,
                namesShort: Array<string>,
            },
            months: {
                names: Array<string>,
                namesAbbr: Array<string>,
            },
            AM: Array<string>,
            PM: Array<string>,
            patterns: Record<string, string>,
            "/": string,
            ":": string,
            firstDay: number,
            twoDigitYearMax?:number,
        }
    },
}

/**
 * Default export
 */
export default ICulture;