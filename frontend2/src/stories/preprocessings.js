export function preprocessLatexText(txt) {
    const exceptions = ["•"]
    return txt.replace(/\n/g, " ")
}