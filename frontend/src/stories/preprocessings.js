export function preprocessLatexText(txt) {
    const exceptions = ["•"]
    let t = txt.replace(/\n/g, " ")
    t = t.trim();
    return t;
}