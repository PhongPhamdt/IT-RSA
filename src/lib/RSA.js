function RSA_modInvese(a, m) {
    var m0 = new SuperInteger(m);
    var x0 = new SuperInteger(0);
    var x1 = new SuperInteger(1);
    var c = new SuperInteger();
    var q = new SuperInteger();
    var t = new SuperInteger();
    
    var x0_signal = false;
    var x1_signal = false;
    var t_signal = false;
    
    if (m.eq(1)) return 0;
 
    while (a.greater(1)) {
        
        q = a.div(m);
        t = new SuperInteger(m);
 
        m = a.mod(m);
        a = new SuperInteger(t);
        
        t = new SuperInteger(x0);
        t_signal = x0_signal;
        
        c = q.times(x0);
        
        if (x1_signal == false) {
            if (x0_signal == false) {
                if (x1.greater(c)) {
                    x0 = x1.minus(c);
                } else {
                    x0_signal = true;
                    x0 = c.minus(x1);
                }
            } else {
                x0 = x1.add(c);
                x0_signal = false;
            } 
        } else {
            if (x0_signal == false) {
                x0 = x1.add(c);
                x0_signal = true;
            } else {
                if (x1.greater(c)) {
                    x0 = x1.minus(c);
                } else {
                    x0_signal = false;
                    x0 = c.minus(x1);
                }
            }
        }
        
        x1 = new SuperInteger(t);
        x1_signal = t_signal;
    }
 
    if (x1_signal)
       x1 = m0.minus(x1);
 
    return x1;
}

function RSA_generateKeys(bits) {
    var p = generatePrime(bits);
    var q = generatePrime(bits);
    var n = p.times(q);
    var phi = (p.minus(1)).times(q.minus(1));

    var tested = {};
    var e = new SuperInteger(0);
    do {
        tested[e] = 1;
        e = e.random(3, phi);
    } while (e in tested || e.gcd(phi).eq(1) == false);
    
    var d = RSA_modInvese(e, phi);
    
    return { e: e.removeZeros(), 
            d: d.removeZeros(), 
            n: n.removeZeros() };
};

function RSA_encrypt (msg, e, n) {
    if (msg == undefined) return "";
    let splitMsg = msg.match(/.{1,4}/g);
    let cipherTotal = []
    splitMsg.forEach(char => {
      let ciphertext = "";
      let m = new SuperInteger();
      for (let i = 0; i < char.length; i++) {
        let y = new SuperInteger(Math.pow(90, char.length-1-i));
        let x = new SuperInteger(char.charCodeAt(i)).times(y)
        m = m.add(x);
      }
      console.log("m: ",m)
      let c = new SuperInteger(m).powMod(e,n);
      console.log("c: ",c);
      let count = new SuperInteger(c);
      while (count.greater(0)) {
        let ch = c.mod(90).add(32);
        ciphertext += String.fromCharCode(ch.toString());
        c = c.div(90)
        count = count.div(90);
      }
      let result = ciphertext.split("").reverse().join('');
      cipherTotal.push(result);
    });
    // for (var i = 0; i < msg.length; i++) {
    //     var c = new SuperInteger(msg.charCodeAt(i)).powMod(e,n);
    //     var count = new SuperInteger(n);
    //     while (count.greater(0)) {
    //         var ch = c.mod(90).add(32);
    //         c = c.div(90);
    //         count = count.div(90);
    //         ciphertext += String.fromCharCode(ch.toString());
    //     }
    // }
    return cipherTotal.join('|');
};

function RSA_decrypt (cipher, d, n) {
    if (cipher == undefined) return "";
    var msg = "";
    var count = new SuperInteger(n);
    sum = new SuperInteger(0);
    for (var i = cipher.length-1; i >= 0; i--) {
        if (count == 0) {
            var c = sum.powMod(d,n);
            msg += String.fromCharCode(c.toString());
            count = new SuperInteger(n);
            sum = new SuperInteger(0);
        }
        sum = sum.times(90).add(cipher.charCodeAt(i)).minus(32);
        count = count.div(90);
    }
    var c = sum.powMod(d,n);
    msg += String.fromCharCode(c.toString());
    count = new SuperInteger(n);
    sum = new SuperInteger(0);
    return msg.split("").reverse().join("");;
};

