"use strict";
exports.__esModule = true;
var nacl = require("tweetnacl");
var helpers = require("./helpers");
var contract = require("./contract");

var mnUrls = [
    'https://masternode0.anarchynet.io',
    'https://masternode1.anarchynet.io',
    'https://masternode2.anarchynet.io',
    'https://masternode3.anarchynet.io'
]

var nonceDisabled = true;

/**
 * @param Uint8Array(length: 32) seed
 *      seed:   A Uint8Array with a length of 32 to seed the keyPair with. This is advanced behavior and should be
 *              avoided by everyday users
 *
 * @return {Uint8Array(length: 32), Uint8Array(length: 32)} { vk, sk }
 *      sk:     Signing Key (SK) represents 32 byte signing key
 *      vk:     Verify Key (VK) represents a 32 byte verify key
 */
function generate_keys(seed) {
    if (seed === void 0) { seed = null; }
    var kp = null;
    if (seed == null) {
        kp = nacl.sign.keyPair();
    }
    else {
        kp = nacl.sign.keyPair.fromSeed(seed);
    }
    // In the JS implementation of the NaCL library the sk is the first 32 bytes of the secretKey
    // and the vk is the last 32 bytes of the secretKey as well as the publicKey
    // {
    //   'publicKey': <vk>,
    //   'secretKey': <sk><vk>
    // }
    return {
        sk: new Uint8Array(kp['secretKey'].slice(0, 32)),
        vk: new Uint8Array(kp['secretKey'].slice(32, 64))
    };
}
exports.generate_keys = generate_keys;
/**
 * @param String sk
 *      sk:     A 64 character long hex representation of a signing key (private key)
 *
 * @return String vk
 *      vk:     A 64 character long hex representation of a verify key (public key)
 */
function get_vk(sk) {
    var kp = format_to_keys(sk);
    var kpf = keys_to_format(kp);
    return kpf.vk;
}
exports.get_vk = get_vk;
/**
 * @param String sk
 *      sk:     A 64 character long hex representation of a signing key (private key)
 *
 * @return {Uint8Array(length: 32), Uint8Array(length: 32)} { vk, sk }
 *      sk:     Signing Key (SK) represents 32 byte signing key
 *      vk:     Verify Key (VK) represents a 32 byte verify key
 */
function format_to_keys(sk) {
    var skf = helpers.hex2buf(sk);
    var kp = generate_keys(skf);
    return kp;
}
exports.format_to_keys = format_to_keys;
/**
 * @param Object kp
 *      kp:     Object containing the properties sk and vk
 *          sk:     Signing Key (SK) represents 32 byte signing key
 *          vk:     Verify Key (VK) represents a 32 byte verify key
 *
 * @return {string, string} { sk, vk }
 *      sk:     Signing Key (SK) represented as a 64 character hex string
 *      vk:     Verify Key (VK) represented as a 64 character hex string
 */
function keys_to_format(kp) {
    return {
        vk: helpers.buf2hex(kp.vk),
        sk: helpers.buf2hex(kp.sk)
    };
}
exports.keys_to_format = keys_to_format;
/**
 * @param Uint8Array(length: 32) seed
 *      seed:   A Uint8Array with a length of 32 to seed the keyPair with. This is advanced behavior and should be
 *              avoided by everyday users
 *
 * @return {string, string} { sk, vk }
 *      sk:     Signing Key (SK) represented as a 64 character hex string
 *      vk:     Verify Key (VK) represented as a 64 character hex string
 */
function new_wallet(seed) {
    if (seed === void 0) { seed = null; }
    var keys = generate_keys(seed);
    return keys_to_format(keys);
}
exports.new_wallet = new_wallet;
/**
 * @param String sk
 * @param Uint8Array msg
 *      sk:     A 64 character long hex representation of a signing key (private key)
 *      msg:    A Uint8Array of bytes representing the message you would like to sign
 *
 * @return String sig
 *      sig:    A 128 character long hex string representing the message's signature
 */
function sign(sk, msg) {
    var kp = format_to_keys(sk);
    // This is required due to the secretKey required to sign a transaction
    // in the js implementation of NaCL being the combination of the sk and
    // vk for some stupid reason. That being said, we still want the sk and
    // vk objects to exist in 32-byte string format (same as cilantro's
    // python implementation) when presented to the user.
    var jsnacl_sk = helpers.concatUint8Arrays(kp.sk, kp.vk);
    return helpers.buf2hex(nacl.sign.detached(msg, jsnacl_sk));
}
exports.sign = sign;
/**
 * @param String vk
 * @param Uint8Array msg
 * @param String sig
 *      vk:     A 64 character long hex representation of a verify key (public key)
 *      msg:    A Uint8Array (bytes) representation of a message that has been signed
 *      sig:    A 128 character long hex representation of a nacl signature
 *
 * @return Bool result
 *      result: true if verify checked out, false if not
 */
function verify(vk, msg, sig) {
    var vkb = helpers.hex2buf(vk);
    var sigb = helpers.hex2buf(sig);
    try {
        return nacl.sign.detached.verify(msg, sigb, vkb);
    } catch(e) {
        return false
    }
}
exports.verify = verify;

exports.get_balance = (pubKey) => {
    return new Promise(function(resolve, reject) {
        var xhr = new XMLHttpRequest();

        xhr.onload = function(){
            if (xhr.readyState === xhr.DONE) {
                if (xhr.status === 200) {
                    var data = JSON.parse(xhr.responseText);
                    resolve(data);
                }
            }            
        }

        xhr.ontimeout = function() {
            console.error("The request timed out");
        }

        console.log('starting xhr section');
        xhr.timeout = 60000;
        xhr.onerror = reject;
        
        var dest = get_mn_url() + '/contracts/currency/balances/' + pubKey;        
        xhr.open('GET', dest, true);
        xhr.send();

    });
}

function get_mn_url() {
    return mnUrls[Math.floor(Math.random()*mnUrls.length)];
}

exports.submit_tx_to_network = (txAmount, txStamps, txDestination, wallet_vk, wallet_sk) => {
    return new Promise(function(resolve, reject) {
        var nonce = "";

        if (nonceDisabled) {
            nonce = wallet_vk + 'B'.repeat(64); 
        } else {
            // TODO: request nonce from network
        }

        var cct = new contract.CurrencyContractTransaction();
        var tx = cct.create(wallet_sk, txStamps, nonce, txDestination, txAmount);
        var tc = new contract.CurrencyTransactionContainer();
        tc.create(tx);

        var tcbytes = tc.toBytesPacked();
        var xhr = new XMLHttpRequest();

        xhr.onload = function() {
            if (xhr.readyState == xhr.DONE) {
                if (xhr.status === 200) {
                    var data = JSON.parse(xhr.responseText);
                    resolve(data);
                }
            }
        }
        
        xhr.onerror = reject;
        xhr.timeout = 60000;
        xhr.open('POST', get_mn_url() + '/', true); 
        xhr.send(tcbytes);
    });
}

exports.check_tx = (txHash, tokenKey, pubKey) => {
    return new Promise(function(resolve, reject) {
        var xhr = new XMLHttpRequest();

        xhr.onload = function() {
            if (xhr.readyState === xhr.DONE) {
                var data = {};
                if (xhr.status === 200) {
                    data = JSON.parse(xhr.responseText);
                    data.txHash = txHash;
                    data.pubKey = pubKey;
                    data.tokenKey = tokenKey;
                    resolve(data);
                }else{
                    data.status = 'pending';
                    data.txHash = txHash;
                    resolve(data);
                }
            }
        }

        xhr.ontimeout = function() {
            console.error("The request timed out");
        }

        xhr.timeout = 60000;
        xhr.open('POST', get_mn_url() + '/transaction', true);
        xhr.setRequestHeader("content-type", "application/json");
        xhr.send(JSON.stringify({ "hash": txHash }));
    });
}


