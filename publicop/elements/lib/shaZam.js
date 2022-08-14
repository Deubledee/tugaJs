/*
 * *****************************************************************
 * *****************************************************************
 * *****************************shaZam******************************
 * ***************************incomplete****************************
 * *****************************************************************
 * *****************************************************************
 * */

/**
 * @param {shaZam}
 * TODO *
 * ? shold  I continue*
 **/

export function shaZam(file = undefined) {
    let text = !!file.text ? file.text() : typeof file === 'string' ? file : false;
    if (!text)
        throw 'type not recognized expected Uint8Array or String got: ' + typeof file;
    let methods = {
        toSHA: (method) => file.text()
            .then(R_G_or_B => crypto.subtle
                .digest(method, new TextEncoder("utf-8").encode(R_G_or_B))
                .then(encoded => Promise
                    .resolve(Array.prototype.map
                        .call(new Uint8Array(encoded), bit => (('00' + bit.toString(16)).slice(-2))).join(''))
                )),
        verifyChecksum: (blob, chscksum, method) => shaZam(blob).toSHA(method)
            .then(blobChecksum => chscksum === blobChecksum ? Promise.resolve(true) : Promise.reject(false)),
        async encrypt() {
            return getKey()
                .then((key) => encryptMessage(key, file));
        },
        async decrypt(key, ciphertext) {
            return decryptMessage(key, ciphertext);
        }
    };
    return methods;
}

const encoderReturnTypes = {
    "AES-GCM": {
        set(iv) {
            this["AES-GCM"] = { name: "AES-GCM", iv };
        },
        get() {
            return this["AES-GCM"];
        }
    }
};

const decodeCache = {
    "AES-GCM": {
        set(ciphertext) {
            this["AES-GCM"][ciphertext] = encoderReturnTypes["AES-GCM"].get();
        },
        get(ciphertext) {
            return this["AES-GCM"][ciphertext];
        }
    }
};

function getMessageEncoding(message) {
    let enc = new TextEncoder();
    return enc.encode(message);
}

async function encryptMessage(encoder, key, message) {
    let encoded = getMessageEncoding(message);
    let iv = window.crypto.getRandomValues(new Uint8Array(12));

    encoderReturnTypes[encoder].set(iv);

    let ciphertext = await window.crypto.subtle.encrypt(encoderReturnTypes[encoder].get(), key, encoded);

    encoderReturnTypes[encoder].set(ciphertext);

    let [buffer, { byteLength }] = [new Uint8Array(ciphertext, 0, 5), ciphertext];

    return { dec: decodeCache[encoder].get(ciphertext), ciphertext, buffer, byteLength };
}

async function decryptMessage(encoder, key, ciphertext) {
    let decrypted = await window.crypto.subtle.decrypt(encoderReturnTypes[encoder][ciphertext].get(), key, ciphertext);
    let dec = new TextDecoder();
    return dec.decode(decrypted);
}

async function getKey() {
    return window.crypto.subtle.generateKey({ name: "AES-GCM", length: 256, }, true, ["encrypt", "decrypt"]);
}
