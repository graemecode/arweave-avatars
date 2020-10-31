const Arweave = require("arweave");

const base64URL = (url) => {
    url = url.replace(/\-/g, "+").replace(/\_/g, "/");
    while (url.length % 4) {
        url += "=";
    }
    return url;
};

/**
 * Given an address, gets the associated avatars.
 * @param address
 * @returns {Promise<Object[]|*[]>}
 */
const imageFromAddress = async (address) => {
    const arweave = Arweave.init();

    let transactionIds = await arweave.arql({
        op: "and",
        expr1: {
            op: "equals",
            expr1: "from",
            expr2: address,
        },
        expr2: {
            op: "equals",
            expr1: "App-Name",
            expr2: "Avatars"
        },
    });

    if (transactionIds.length === 0) {
        return [];
    }

    const results = await Promise.all(
        transactionIds.map(async (transactionId) => {
            const data = await arweave.transactions.getData(txId);
            const transaction = await arweave.transactions.get(transactionId);

            let contentType;
            transaction.get("tags").forEach(tag => {
                let key = tag.get("name", {decode: true, string: true});
                let value = tag.get("value", {decode: true, string: true});

                if (key === "Content-Type") {
                    contentType = value;
                }
            });

            if (!contentType) {
                return;
            }

            const imageDataUrl = base64URL(data);

            return {
                contentType,
                src: `data:${contentType};base64,${imageDataUrl}`,
                rawData: data,
                transactionId,
            };
        }),
    );

    return results.filter(Boolean);
};

/**
 * Given an array, returns an array of image data.
 *
 * @example
 * await getAvatars("Ky1c1Kkt-jZ9sY1hvLF5nCf6WWdBhIU5Un_BMYh-t3c");
 * => [
 *      {
 *          contentType: "image/png",
 *          src: "data:image/png;base64,Ix...",
 *          rawData: "Ix..."
 *          transactionId: "..."
 *      }
 * ]
 *
 * @param address
 * @returns {Promise<Object[]>}
 */
exports.getAvatarsForAddress = (address) => {
    return new Promise((accept, reject) => {
        imageFromAddress(address).then(result => {
            accept(result);
        }).catch((e) => {
            reject(e);
        });
    });
};
