import OpenXMLTemplate from "../OpenXMLTemplate";

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
const EN_US = "en-US";
const objectToString = {}.toString;

const argumentNameRegExp = /^\w+/,
    encodeRegExp = /\$\{([^}]*)}/g,
    escapedCurlyRegExp = /\\}/g,
    curlyRegExp = /__CURLY__/g,
    escapedSharpRegExp = /\\#/g,
    sharpRegExp = /__SHARP__/g,
    zeros = ["", "0", "00", "000", "0000"];

/**
 * escapeRegExp
 * polyfill for RegExp.escape
 * @see https://github.com/tc39/proposal-regex-escaping/blob/main/polyfill.js
 * @param s
 */
export function escapeRegExp(s: string){
    return s.replace(/[\\^$*+?.()|[\]{}]/g, '\\$&');
}

/**
 * getCulture
 * @param locale
 */
export function getCulture(locale: string = EN_US): Record<string, unknown> | undefined {
    return OpenXMLTemplate.cultures.get(locale);
}

/**
 * pad
 * @param number
 * @param digits
 * @param end
 */
export function pad(number: number | string, digits?: number, end?: number) {
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
/*
export function formatDate(date: Date, format: string, locale: string) {
    const culture = getCulture(locale);

    const calendar = culture?.calendars.standard,
        days = calendar.days,
        months = calendar.months;

    format = calendar.patterns[format] || format;

    return format.replace(dateFormatRegExp, function(match) {
        let minutes;
        let result: any;
        let sign;

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
            minutes = Math.abs(minutes) - (result * 60);

            result = (sign ? "+" : "-") + pad(result);
            result += ":" + pad(minutes);
        } else if (match === "zz" || match === "z") {
            result = date.getTimezoneOffset() / 60;
            sign = result < 0;

            result = Math.abs(result).toString().split(".")[0];
            result = (sign ? "+" : "-") + (match === "zz" ? pad(result) : result);
        }

        return result !== undefined ? result : match.slice(1, match.length - 1);
    });
}
*/

/**
 * formatNumber
 * @param number
 * @param format
 * @param locale
 */
/*
export function formatNumber(number, format, locale) {
    const culture = getCulture(locale);

    let numberFormat = culture.numberFormat,
        decimal = numberFormat[POINT],
        precision = numberFormat.decimals,
        pattern = numberFormat.pattern[0],
        literals = [],
        symbol,
        isCurrency, isPercent,
        customPrecision,
        formatAndPrecision,
        negative = number < 0,
        integer,
        fraction,
        integerLength,
        fractionLength,
        replacement = EMPTY,
        value = EMPTY,
        idx,
        length,
        ch,
        hasGroup,
        hasNegativeFormat,
        decimalIndex,
        sharpIndex,
        zeroIndex,
        hasZero, hasSharp,
        percentIndex,
        currencyIndex,
        startZeroIndex,
        start = -1,
        end;

    //return empty string if no number
    if (number === undefined) {
        return EMPTY;
    }

    if (!isFinite(number)) {
        return number;
    }

    //if no format then return number.toString() or number.toLocaleString() if culture.name is not defined
    if (!format) {
        return culture.name.length ? number.toLocaleString() : number.toString();
    }

    formatAndPrecision = standardFormatRegExp.exec(format);

    // standard formatting
    if (formatAndPrecision) {
        format = formatAndPrecision[1].toLowerCase();

        isCurrency = format === "c";
        isPercent = format === "p";

        if (isCurrency || isPercent) {
            //get specific number format information if format is currency or percent
            numberFormat = isCurrency ? numberFormat.currency : numberFormat.percent;
            decimal = numberFormat[POINT];
            precision = numberFormat.decimals;
            symbol = numberFormat.symbol;
            pattern = numberFormat.pattern[negative ? 0 : 1];
        }

        customPrecision = formatAndPrecision[2];

        if (customPrecision) {
            precision = +customPrecision;
        }

        //return number in exponential format
        if (format === "e") {
            const exp = customPrecision ? number.toExponential(precision) : number.toExponential(); // toExponential() and toExponential(undefined) differ in FF #653438.

            return exp.replace(POINT, numberFormat[POINT]);
        }

        // multiply if format is percent
        if (isPercent) {
            number *= 100;
        }

        number = round(number, precision);
        negative = number < 0;
        number = number.split(POINT);

        integer = number[0];
        fraction = number[1];

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

        number = EMPTY;

        for (idx = 0, length = pattern.length; idx < length; idx++) {
            ch = pattern.charAt(idx);

            if (ch === "n") {
                number += value;
            } else if (ch === "$" || ch === "%") {
                number += symbol;
            } else {
                number += ch;
            }
        }

        return number;
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

    format = format.split(";");
    if (negative && format[1]) {
        //get negative format
        format = format[1];
        hasNegativeFormat = true;
    } else if (number === 0 && format[2]) {
        //format for zeros
        format = format[2];
        if (format.indexOf(SHARP) == -1 && format.indexOf(ZERO) == -1) {
            //return format if it is string constant.
            return format;
        }
    } else {
        format = format[0];
    }

    percentIndex = format.indexOf("%");
    currencyIndex = format.indexOf("$");

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
        numberFormat = isCurrency ? numberFormat.currency : numberFormat.percent;
        decimal = numberFormat[POINT];
        precision = numberFormat.decimals;
        symbol = numberFormat.symbol;
    }

    hasGroup = format.indexOf(COMMA) > -1;
    if (hasGroup) {
        format = format.replace(commaRegExp, EMPTY);
    }

    decimalIndex = format.indexOf(POINT);
    length = format.length;

    if (decimalIndex != -1) {
        fraction = number.toString().split("e");
        if (fraction[1]) {
            fraction = round(number, Math.abs(fraction[1]));
        } else {
            fraction = fraction[0];
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

    number = round(number, idx, negative);

    sharpIndex = format.indexOf(SHARP);
    startZeroIndex = zeroIndex = format.indexOf(ZERO);

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
        value = number.toString().split(POINT);
        integer = value[0];
        fraction = value[1] || EMPTY;

        integerLength = integer.length;
        fractionLength = fraction.length;

        if (negative && (number * -1) >= 0) {
            negative = false;
        }

        number = format.substring(0, start);

        if (negative && !hasNegativeFormat) {
            number += "-";
        }

        for (idx = start; idx < length; idx++) {
            ch = format.charAt(idx);

            if (decimalIndex == -1) {
                if (end - idx < integerLength) {
                    number += integer;
                    break;
                }
            } else {
                if (zeroIndex != -1 && zeroIndex < idx) {
                    replacement = EMPTY;
                }

                if ((decimalIndex - idx) <= integerLength && decimalIndex - idx > -1) {
                    number += integer;
                    idx = decimalIndex;
                }

                if (decimalIndex === idx) {
                    number += (fraction ? decimal : EMPTY) + fraction;
                    idx += end - decimalIndex + 1;
                    continue;
                }
            }

            if (ch === ZERO) {
                number += ch;
                replacement = ch;
            } else if (ch === SHARP) {
                number += replacement;
            }
        }

        if (hasGroup) {
            number = groupInteger(number, start + (negative && !hasNegativeFormat ? 1 : 0), Math.max(end, (integerLength + start)), numberFormat);
        }

        if (end >= start) {
            number += format.substring(end + 1);
        }

        //replace symbol placeholders
        if (isCurrency || isPercent) {
            value = EMPTY;
            for (idx = 0, length = number.length; idx < length; idx++) {
                ch = number.charAt(idx);
                value += (ch === "$" || ch === "%") ? symbol : ch;
            }
            number = value;
        }

        length = literals.length;

        if (length) {
            for (idx = 0; idx < length; idx++) {
                number = number.replace(PLACEHOLDER, literals[idx]);
            }
        }
    }

    return number;
}
*/

/*
export function groupInteger(number, start, end, numberFormat) {
    var decimalIndex = number.indexOf(numberFormat[POINT]);
    var groupSizes = numberFormat.groupSize.slice();
    var groupSize = groupSizes.shift();
    var integer, integerLength;
    var idx, parts, value;
    var newGroupSize;

    end = decimalIndex !== -1 ? decimalIndex : end + 1;

    integer = number.substring(start, end);
    integerLength = integer.length;

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

        integer = parts.reverse().join(numberFormat[COMMA]);
        number = number.substring(0, start) + integer + number.substring(end);
    }

    return number;
};
*/

/*
export function round(value, precision, negative) {
    precision = precision || 0;

    value = value.toString().split('e');
    value = Math.round(+(value[0] + 'e' + (value[1] ? (+value[1] + precision) : precision)));

    if (negative) {
        value = -value;
    }

    value = value.toString().split('e');
    value = +(value[0] + 'e' + (value[1] ? (+value[1] - precision) : -precision));

    return value.toFixed(Math.min(precision, 20));
};
*/

/*
export function toString(value, fmt, culture) {
    if (fmt) {
        if (objectToString.call(value) === "[object Date]") {
            return formatDate(value, fmt, culture);
        } else if (typeof value === NUMBER) {
            return formatNumber(value, fmt, culture);
        }
    }
    return value !== undefined ? value : "";
}
*/

/**
 * format
 * @param fmt
 */
/*
export function format(fmt: string) {
    const values = arguments;
    return fmt.replace(formatRegExp, function(match, index, placeholderFormat) {
        const value = values[parseInt(index, 10) + 1];
        return toString(value, placeholderFormat ? placeholderFormat.substring(1) : '');
    });
}
*/

/*
export function compilePart(part, stringPart) {
    if (stringPart) {
        return "'" +
            part.split("'").join("\\'")
                .split('\\"').join('\\\\\\"')
                .replace(/\n/g, "\\n")
                .replace(/\r/g, "\\r")
                .replace(/\t/g, "\\t") + "'";
    } else {
        var first = part.charAt(0),
            rest = part.substring(1);

        if (first === "=") {
            return "+(" + rest + ")+";
        } else if (first === ":") {
            return "+$kendoHtmlEncode(" + rest + ")+";
        } else {
            return ";" + part + ";$kendoOutput+=";
        }
    }
}
*/

/*
const Template = {
    paramName: "data", // name of the parameter of the generated template
    useWithBlock: true, // whether to wrap the template in a with() block
    render: function(template, data) {
        var idx,
            length,
            html = "";

        for (idx = 0, length = data.length; idx < length; idx++) {
            html += template(data[idx]);
        }

        return html;
    },
    compile: function(template, options) {
        var settings = extend({}, this, options),
            paramName = settings.paramName,
            argumentName = paramName.match(argumentNameRegExp)[0],
            useWithBlock = settings.useWithBlock,
            functionBody = "var $kendoOutput, $kendoHtmlEncode = kendo.htmlEncode;",
            fn,
            parts,
            idx;

        if (isFunction(template)) {
            return template;
        }

        functionBody += useWithBlock ? "with(" + paramName + "){" : "";

        functionBody += "$kendoOutput=";

        parts = template
            .replace(escapedCurlyRegExp, "__CURLY__")
            .replace(encodeRegExp, "#=$kendoHtmlEncode($1)#")
            .replace(curlyRegExp, "}")
            .replace(escapedSharpRegExp, "__SHARP__")
            .split("#");

        for (idx = 0; idx < parts.length; idx ++) {
            functionBody += compilePart(parts[idx], idx % 2 === 0);
        }

        functionBody += useWithBlock ? ";}" : ";";

        functionBody += "return $kendoOutput;";

        functionBody = functionBody.replace(sharpRegExp, "#");

        try {
            fn = new Function(argumentName, functionBody);
            fn._slotCount = Math.floor(parts.length / 2);
            return fn;
        } catch (e) {
            throw new Error(kendo.format("Invalid template:'{0}' Generated code:'{1}'", template, functionBody));
        }
    }
};
 */

