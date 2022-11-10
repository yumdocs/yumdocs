import { getCulture } from "../cultures/cultureUtils";
import constants from "../constants";
import ICulture from "../cultures/ICulture";

const formatRegExp = /\{(\d+)(:[^}]+)?}/g;
// const numberRegExp = /^(\+|-?)\d+(\.?)\d*$/;
const dateFormatRegExp = /dddd|ddd|dd|d|MMMM|MMM|MM|M|yyyy|yy|HH|H|hh|h|mm|m|fff|ff|f|tt|ss|s|zzz|zz|z|"[^"]*"|'[^']*'/g;
const standardFormatRegExp = /^(n|c|p|e)(\d*)$/i;
const literalRegExp = /(\\.)|(['][^']*[']?)|(["][^"]*["]?)/g;
const commaRegExp = /,/g;
const EMPTY = "";
const POINT = ".";
const COMMA = ",";
const SHARP = "#";
const ZERO = "0";
const PLACEHOLDER = "??";
const objectToString = {}.toString;

/**
 * pad
 * @param number
 * @param digits
 * @param end
 */
export function pad(number: number | string, digits?: number, end?: number) {
    const zeros = ["", "0", "00", "000", "0000"]
    const ret = number + '';
    digits = digits || 2;
    end = digits - ret.length;
    if (end) {
        return zeros[digits].substring(0, end) + ret;
    }
    return ret;
}

/**
 * formatDate
 * @param date
 * @param format
 * @param locale
 */
export function formatDate(date: Date, format: string, locale: string = constants.locale): string {
    const culture = <ICulture>getCulture(locale);

    const calendar = culture.calendars.standard,
        days = calendar.days,
        months = calendar.months;

    format = calendar.patterns[format] || format;

    return format.replace(dateFormatRegExp, function(match): string {
        let minutes: number;
        let result: number | string | undefined;
        let sign: boolean;

        if (match === "d") {
            result = date.getDate();
        } else if (match === "dd") {
            result = pad(date.getDate());
        } else if (match === "ddd") {
            result = days.namesAbbr[date.getDay()];
        } else if (match === "dddd") {
            result = days.names[date.getDay()];
        } else if (match === "M") {
            result = date.getMonth() + 1;
        } else if (match === "MM") {
            result = pad(date.getMonth() + 1);
        } else if (match === "MMM") {
            result = months.namesAbbr[date.getMonth()];
        } else if (match === "MMMM") {
            result = months.names[date.getMonth()];
        } else if (match === "yy") {
            result = pad(date.getFullYear() % 100);
        } else if (match === "yyyy") {
            result = pad(date.getFullYear(), 4);
        } else if (match === "h" ) {
            result = date.getHours() % 12 || 12;
        } else if (match === "hh") {
            result = pad(date.getHours() % 12 || 12);
        } else if (match === "H") {
            result = date.getHours();
        } else if (match === "HH") {
            result = pad(date.getHours());
        } else if (match === "m") {
            result = date.getMinutes();
        } else if (match === "mm") {
            result = pad(date.getMinutes());
        } else if (match === "s") {
            result = date.getSeconds();
        } else if (match === "ss") {
            result = pad(date.getSeconds());
        } else if (match === "f") {
            result = Math.floor(date.getMilliseconds() / 100);
        } else if (match === "ff") {
            result = date.getMilliseconds();
            if (result > 99) {
                result = Math.floor(result / 10);
            }
            result = pad(result);
        } else if (match === "fff") {
            result = pad(date.getMilliseconds(), 3);
        } else if (match === "tt") {
            result = date.getHours() < 12 ? calendar.AM[0] : calendar.PM[0];
        } else if (match === "zzz") {
            minutes = date.getTimezoneOffset();
            sign = minutes < 0;

            result = Math.abs(minutes / 60).toString().split(".")[0];
            minutes = Math.abs(minutes) - (+result * 60);

            result = (sign ? "+" : "-") + pad(result);
            result += ":" + pad(minutes);
        } else if (match === "zz" || match === "z") {
            result = date.getTimezoneOffset() / 60;
            sign = result < 0;

            result = Math.abs(result).toString().split(".")[0];
            result = (sign ? "+" : "-") + (match === "zz" ? pad(result) : result);
        }

        return result !== undefined ?
            result as string :
            match.slice(1, match.length - 1) as string;
    });
}


/**
 * groupInteger
 * @param number
 * @param start
 * @param end
 * @param numberFormat
 */
export function groupInteger(number: string, start: number, end: number, numberFormat: Record<string, unknown>) {
    const decimalIndex = number.indexOf(<string>numberFormat[POINT]);
    const groupSizes = (numberFormat.groupSize as Array<number>).slice();
    let groupSize = groupSizes.shift() as number;
    let idx, parts, value;
    let newGroupSize;

    end = decimalIndex !== -1 ? decimalIndex : end + 1;

    let integer = number.substring(start, end);
    const integerLength = integer.length;

    if (integerLength >= groupSize) {
        idx = integerLength;
        parts = [];

        while (idx > -1) {
            value = integer.substring(idx - groupSize, idx);
            if (value) {
                parts.push(value);
            }
            idx -= groupSize;
            newGroupSize = groupSizes.shift();
            groupSize = newGroupSize !== undefined ? newGroupSize : groupSize;

            if (groupSize === 0) {
                if (idx > 0) {
                    parts.push(integer.substring(0, idx));
                }
                break;
            }
        }

        integer = parts.reverse().join(numberFormat[COMMA] as string);
        number = number.substring(0, start) + integer + number.substring(end);
    }

    return number;
}

/**
 * round
 * @param value
 * @param precision
 * @param negative
 */
export function round(value: number, precision: number, negative= false) {
    precision = precision || 0;

    let strValue = value.toString().split('e');
    let numValue = Math.round(+(strValue[0] + 'e' + (strValue[1] ? (+strValue[1] + precision) : precision)));

    if (negative) {
        numValue = -numValue;
    }

    strValue = numValue.toString().split('e');
    numValue = +(strValue[0] + 'e' + (strValue[1] ? (+strValue[1] - precision) : -precision));

    return numValue.toFixed(Math.min(precision, 20));
};

/**
 * formatNumber
 * @param number
 * @param format
 * @param locale
 */
export function formatNumber(number: number, format: string, locale: string = constants.locale): string {
    const culture = <ICulture>getCulture(locale);
    const literals: Array<string> = [];
    let numString: string,
        numberFormat: Record<string, unknown> = culture.numberFormat,
        decimal = numberFormat[POINT] as string,
        precision = numberFormat.decimals as number,
        pattern = (numberFormat.pattern as Array<string>)[0],
        symbol = EMPTY,
        isCurrency: boolean, isPercent: boolean,
        customPrecision,
        negative = number < 0,
        integer,
        fraction,
        integerLength: number,
        // fractionLength: number,
        replacement = EMPTY,
        value = EMPTY,
        idx = 0,
        length: number,
        ch: string,
        hasNegativeFormat,
        decimalIndex,
        sharpIndex,
        zeroIndex,
        hasZero, hasSharp,
        start = -1,
        end;

    //return empty string if no number
    if (number === undefined) {
        return EMPTY;
    }

    if (!isFinite(number)) {
        return number.toString();
    }

    //if no format then return number.toString() or number.toLocaleString() if culture.name is not defined
    if (!format) {
        return culture.name.length ? number.toLocaleString() : number.toString();
    }

    const formatAndPrecision = standardFormatRegExp.exec(format);

    // standard formatting
    if (formatAndPrecision) {
        format = formatAndPrecision[1].toLowerCase();

        isCurrency = format === "c";
        isPercent = format === "p";

        if (isCurrency || isPercent) {
            //get specific number format information if format is currency or percent
            numberFormat = isCurrency ?
                numberFormat.currency as Record<string, unknown> :
                numberFormat.percent as Record<string, unknown>;
            decimal = numberFormat[POINT] as string;
            precision = numberFormat.decimals as number;
            symbol = numberFormat.symbol as string;
            pattern = (numberFormat.pattern as Array<string>)[negative ? 0 : 1];
        }

        customPrecision = formatAndPrecision[2];

        if (customPrecision) {
            precision = +customPrecision;
        }

        //return number in exponential format
        if (format === "e") {
            const exp = customPrecision ? number.toExponential(precision) : number.toExponential(); // toExponential() and toExponential(undefined) differ in FF #653438.
            return exp.replace(POINT, numberFormat[POINT] as string);
        }

        // multiply if format is percent
        if (isPercent) {
            number *= 100;
        }

        numString = round(number, precision);
        // TODO negative = numString < 0;
        negative = number < 0;
        const numArray = numString.split(POINT);

        integer = numArray[0];
        fraction = numArray[1];

        //exclude "-" if number is negative.
        if (negative) {
            integer = integer.substring(1);
        }

        value = groupInteger(integer, 0, integer.length, numberFormat);

        if (fraction) {
            value += decimal + fraction;
        }

        if (format === "n" && !negative) {
            return value;
        }

        numString = EMPTY;

        for (idx = 0, length = pattern.length; idx < length; idx++) {
            ch = pattern.charAt(idx);

            if (ch === "n") {
                numString += value;
            } else if (ch === "$" || ch === "%") {
                numString += symbol;
            } else {
                numString += ch;
            }
        }

        return numString;
    }

    //custom formatting
    //
    //separate format by sections.

    if (format.indexOf("'") > -1 || format.indexOf("\"") > -1 || format.indexOf("\\") > -1) {
        format = format.replace(literalRegExp, function(match) {
            const quoteChar = match.charAt(0).replace("\\", ""),
                literal = match.slice(1).replace(quoteChar, "");

            literals.push(literal);

            return PLACEHOLDER;
        });
    }

    const formatArray = format.split(";");
    if (negative && format[1]) {
        //get negative format
        format = formatArray[1];
        hasNegativeFormat = true;
    } else if (number === 0 && format[2]) {
        //format for zeros
        format = formatArray[2];
        if (format.indexOf(SHARP) == -1 && format.indexOf(ZERO) == -1) {
            //return format if it is string constant.
            return format;
        }
    } else {
        format = formatArray[0];
    }

    const percentIndex = format.indexOf("%");
    const currencyIndex = format.indexOf("$");

    isPercent = percentIndex != -1;
    isCurrency = currencyIndex != -1;

    //multiply number if the format has percent
    if (isPercent) {
        number *= 100;
    }

    if (isCurrency && format[currencyIndex - 1] === "\\") {
        format = format.split("\\").join("");
        isCurrency = false;
    }

    if (isCurrency || isPercent) {
        //get specific number format information if format is currency or percent
        numberFormat = isCurrency ?
            numberFormat.currency as Record<string, unknown> :
            numberFormat.percent as Record<string, unknown>;
        decimal = numberFormat[POINT] as string;
        precision = numberFormat.decimals as number;
        symbol = numberFormat.symbol as string;
    }

    const hasGroup = format.indexOf(COMMA) > -1;
    if (hasGroup) {
        format = format.replace(commaRegExp, EMPTY);
    }

    decimalIndex = format.indexOf(POINT);
    length = format.length;

    if (decimalIndex != -1) {
        const fractionArray = number.toString().split("e");
        if (fractionArray[1]) {
            fraction = round(number, Math.abs(+fractionArray[1]));
        } else {
            fraction = fractionArray[0];
        }
        fraction = fraction.split(POINT)[1] || EMPTY;
        zeroIndex = format.lastIndexOf(ZERO) - decimalIndex;
        sharpIndex = format.lastIndexOf(SHARP) - decimalIndex;
        hasZero = zeroIndex > -1;
        hasSharp = sharpIndex > -1;
        idx = fraction.length;

        if (!hasZero && !hasSharp) {
            format = format.substring(0, decimalIndex) + format.substring(decimalIndex + 1);
            length = format.length;
            decimalIndex = -1;
            idx = 0;
        }

        if (hasZero && zeroIndex > sharpIndex) {
            idx = zeroIndex;
        } else if (sharpIndex > zeroIndex) {
            if (hasSharp && idx > sharpIndex) {
                let rounded = round(number, sharpIndex, negative);

                while (rounded.charAt(rounded.length - 1) === ZERO && sharpIndex > 0 && sharpIndex > zeroIndex) {
                    sharpIndex--;

                    rounded = round(number, sharpIndex, negative);
                }

                idx = sharpIndex;
            } else if (hasZero && idx < zeroIndex) {
                idx = zeroIndex;
            }
        }
    }

    numString = round(number, idx as number, negative);

    sharpIndex = format.indexOf(SHARP);
    // const startZeroIndex = zeroIndex = format.indexOf(ZERO);
    zeroIndex = format.indexOf(ZERO);

    //define the index of the first digit placeholder
    if (sharpIndex == -1 && zeroIndex != -1) {
        start = zeroIndex;
    } else if (sharpIndex != -1 && zeroIndex == -1) {
        start = sharpIndex;
    } else {
        start = sharpIndex > zeroIndex ? zeroIndex : sharpIndex;
    }

    sharpIndex = format.lastIndexOf(SHARP);
    zeroIndex = format.lastIndexOf(ZERO);

    //define the index of the last digit placeholder
    if (sharpIndex == -1 && zeroIndex != -1) {
        end = zeroIndex;
    } else if (sharpIndex != -1 && zeroIndex == -1) {
        end = sharpIndex;
    } else {
        end = sharpIndex > zeroIndex ? sharpIndex : zeroIndex;
    }

    if (start == length) {
        end = start;
    }

    if (start != -1) {
        const valArray = numString.toString().split(POINT);
        integer = valArray[0];
        fraction = valArray[1] || EMPTY;

        integerLength = integer.length;
        // fractionLength = fraction.length;

        if (negative && (+numString * -1) >= 0) {
            negative = false;
        }

        numString = format.substring(0, start);

        if (negative && !hasNegativeFormat) {
            numString += "-";
        }

        for (idx = start; idx < length; idx++) {
            ch = format.charAt(idx);

            if (decimalIndex == -1) {
                if (end - idx < integerLength) {
                    numString += integer;
                    break;
                }
            } else {
                if (zeroIndex != -1 && zeroIndex < idx) {
                    replacement = EMPTY;
                }

                if ((decimalIndex - idx) <= integerLength && decimalIndex - idx > -1) {
                    numString += integer;
                    idx = decimalIndex;
                }

                if (decimalIndex === idx) {
                    numString += (fraction ? decimal : EMPTY) + fraction;
                    idx += end - decimalIndex + 1;
                    continue;
                }
            }

            if (ch === ZERO) {
                numString += ch;
                replacement = ch;
            } else if (ch === SHARP) {
                numString += replacement;
            }
        }

        if (hasGroup) {
            numString = groupInteger(numString, start + (negative && !hasNegativeFormat ? 1 : 0), Math.max(end, (integerLength + start)), numberFormat);
        }

        if (end >= start) {
            numString += format.substring(end + 1);
        }

        //replace symbol placeholders
        if (isCurrency || isPercent) {
            value = EMPTY;
            for (idx = 0, length = numString.length; idx < length; idx++) {
                ch = numString.charAt(idx);
                value += (ch === "$" || ch === "%") ? symbol : ch;
            }
            numString = value;
        }

        length = literals.length;

        if (length) {
            for (idx = 0; idx < length; idx++) {
                numString = numString.replace(PLACEHOLDER, literals[idx]);
            }
        }
    }

    return numString;
}

/**
 * toString
 * @param value
 * @param fmt
 * @param culture
 */
export function toString(value: unknown, fmt: string | undefined, culture = constants.locale): string {
    if (fmt) {
        if (objectToString.call(value) === "[object Date]") {
            return formatDate(value as Date, fmt, culture);
        } else if (typeof value === "number") {
            return formatNumber(value, fmt, culture);
        }
    }
    return value !== undefined ? value as string : EMPTY;
}

/**
 * format
 * @param fmt
 */
export function format(fmt: string, ...values : Array<unknown>) {
    return fmt.replace(formatRegExp, function(match, index, placeholderFormat): string {
        const value = values[parseInt(index, 10)];
        return toString(value, placeholderFormat ? placeholderFormat.substring(1) : '');
    });
}
