const constants = {
    delimiters: {
        start: '{{',
        end: '}}'
    },
    openChar: '}',
    closeChar: '}',
    openExpression: '{{',
    closeExpression: '}}',
    matchExpression: /{{[^{}]+}}/,
};

export default constants;