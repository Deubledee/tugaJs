
function getLogColors(remove, defaults, path) {
    let [type, color] = remove ?
        ['⚡\x1b[0m\x1b[31m unlink ✗', "\x1b[0m\x1b[1m\x1b[31m\x1b[7m"] :
        ['⚡\x1b[0m\x1b[32m link ✓', "\x1b[0m\x1b[1m\x1b[32m\x1b[7m"];
    return [
        ["\x1b[3m\x1b[1m\x1b[4m\x1b[34m\x1b[7m update \x1b[0m",
            `${color} ${type} ${color}\x1b[0m`,
            `\x1b[1m\x1b[4m\x1b[36m\x1b[7m ${path} \x1b[0m \x1b[1m\x1b[4m\x1b[36m\x1b[7m\x1b[0m`,
            `\x1b[1m\x1b[4m\x1b[33m\x1b[7m ${defaults.update}\x1b[0m \x1b[4m\x1b[36m\x1b[7m\x1b[0m`
        ],
        [`\x1b[1m\x1b[4m\x1b[35m\x1b[7m linked \x1b[0m \x1b[32m ⚡\x1b[0m\x1b[4m\x1b[36m\x1b[7m\x1b[0m`,
            `\x1b[1m\x1b[4m\x1b[36m\x1b[7m ${path} \x1b[0m \x1b[4m\x1b[36m\x1b[7m\x1b[0m`
        ]
    ];
}

exports.getLogColors = getLogColors;
