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
    let splitMsg=[];
    newMsg = msg.split("").reverse().join('');
    let temp = '';
    let pow = 0;
    let sum = new SuperInteger(0);
    for (let i=0; i < newMsg.length; i++){
      let y = new SuperInteger(Math.pow(91, pow));
      let x = new SuperInteger(newMsg.charCodeAt(i)).times(y);
      sum = sum.add(x);
      pow ++;
      if (sum.greater(n) && newMsg[i] != ' ') {
        sum = new SuperInteger(0);
        pow = 0;
        temp = temp.split("").reverse().join('');
        splitMsg.push(temp);
        temp = '';
        let y = new SuperInteger(Math.pow(91, pow));
        let x = new SuperInteger(newMsg.charCodeAt(i)).times(y);
        sum = sum.add(x);
        pow ++;
        temp += newMsg[i]
        if (i == newMsg.length - 1){
          temp = temp.split("").reverse().join('');
          splitMsg.push(temp);
        } 
      } else {
        temp += newMsg[i];
        if (i == newMsg.length - 1){
          temp = temp.split("").reverse().join('');
          splitMsg.push(temp);
        }
      }
    }
    let cipherTotal = []
    splitMsg.reverse().forEach(char => {
      let ciphertext = "";
      let m = new SuperInteger();
      let result = '';
      if (char[0] == ' ') result += '~';
      for (let i = 0; i < char.length; i++) {
        let y = new SuperInteger(Math.pow(91, char.length-1-i));
        let x = new SuperInteger(char.charCodeAt(i)).minus(32).times(y)
        m = m.add(x);
      }
      let c = new SuperInteger(m).powMod(e,n);
      let count = new SuperInteger(c);
      while (count.greater(0)) {
        let ch = c.mod(91).add(32);
        ciphertext += String.fromCharCode(ch.toString());
        c = c.div(91)
        count = count.div(91);
      }
      result += ciphertext.split("").reverse().join('');
      cipherTotal.push(result);
    });
    return cipherTotal.join('|');
};

function RSA_decrypt (cipher, d, n) {
    if (cipher == undefined) return "";
    let splitCipher = cipher.split('|');
    let total = [];
    splitCipher.forEach(char => {
      let msg = "";
      let c_decrypt = new SuperInteger(0);
      let result = '';
      if (char[0] == '~') {
        char = char.slice(1);
        result = ' '
      }
      for (let i = 0; i < char.length; i++) {
        let y = new SuperInteger(Math.pow(91, char.length-1-i));
        let x = new SuperInteger(char.charCodeAt(i)).minus(32).times(y)
        c_decrypt = c_decrypt.add(x);
      }
      let m = new SuperInteger(c_decrypt).powMod(d,n);
      let count = new SuperInteger(m);
      while (count.greater(0)) {
        let ch = m.mod(91).add(32);
        msg += String.fromCharCode((ch).toString());
        m = m.div(91)
        count = count.div(91);
      }
      result += msg.split("").reverse().join('');
      total.push(result)
    });
    return total.join("");
};

