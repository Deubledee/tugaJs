function setToolbar(kind, customColors, upload = undefined) {
    let colors = [{ "color": ["#000000", "#e60000", "#ff9900", "#ffff00", "#008a00", "#0066cc", "#9933ff", "#ffffff", "#facccc", "#ffebcc", "#ffffcc", "#cce8cc", "#cce0f5", "#ebd6ff", "#bbbbbb", "#f06666", "#ffc266", "#ffff66", "#66b966", "#66a3e0", "#c285ff", "#888888", "#a10000", "#b26b00", "#b2b200", "#006100", "#0047b2", "#6b24b2", "#444444", "#5c0000", "#663d00", "#666600", "#003700", "#002966", "#3d1466", "#374156", ...customColors] },
    { "background": ["#000000", "#e60000", "#ff9900", "#ffff00", "#008a00", "#0066cc", "#9933ff", "#ffffff", "#facccc", "#ffebcc", "#ffffcc", "#cce8cc", "#cce0f5", "#ebd6ff", "#bbbbbb", "#f06666", "#ffc266", "#ffff66", "#66b966", "#66a3e0", "#c285ff", "#888888", "#a10000", "#b26b00", "#b2b200", "#006100", "#0047b2", "#6b24b2", "#444444", "#5c0000", "#663d00", "#666600", "#003700", "#002966", "#3d1466", "#374156", ...customColors] }]
    let obj = {
        extended: {
            "toolbar": {
                container: [
                    ['clean'],
                    ["blockquote", "code-block"],
                    ["bold", "italic", "underline", "strike"],
                    [{ "header": [1, 2, 3, 4, 5, 6] }],
                    [{ "align": [] }],
                    [{ "list": "ordered" }, { "list": "bullet" }],
                    ["emoji"],
                    ["image"],
                    ["link"],
                    colors
                ]
            },
            "emoji-toolbar": true,
            "emoji-shortname": true,
            "emoji-textarea": false//,
            //"imageUploader": { upload: !!upload ? upload.bind(this) : function () { } }//!chek comments above \^\
        },
        small: {
            "toolbar": {
                "container": [
                    ["clean"],
                    ["bold", "italic", "underline", "strike"],
                    [{ "header": [1, 2] }],
                    [{ "align": [] }],
                    colors
                ]
            },
            "emoji-toolbar": false,
            "emoji-shortname": false,
            "emoji-textarea": false
        },
        notoolbar: {
            "toolbar": false
        }
    }
    return (kind in obj) ? obj[kind] : obj.extended
}

export { setToolbar }
