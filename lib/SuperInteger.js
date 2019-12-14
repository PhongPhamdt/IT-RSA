//Constructor
function SuperInteger(value) {
    this.value = '0';
    if (typeof value == 'object') {
        this.value = value.toString();
        return;
    } else if (typeof value == 'string') {
        for (var i = 0; i < value.length; i++) {
            var code = value[i].charCodeAt(0);
            if (code < 48 || code > 57) {
                console.log('ERROR! String has a non-numeric character.');
                return;
            }
        }
        this.value = value;
    } else if (typeof value == 'number') {
        if (value < 0) {
            console.log('ERROR! Negative number.');
            return;
        } else if (value == 0) {
            this.value = "0";
            return;
        }
        var reverseValue = '';
        while (value > 0) {
            reverseValue += String.fromCharCode(48 + (value % 10));
            value = parseInt(value/10);
        }  
        this.value = '';
        for (var i = reverseValue.length-1; i >= 0; i--)
            this.value += reverseValue[i];
    }
    
    return this.value;
};

//Utils - Greater
SuperInteger.prototype.greater = function(num2) {
    if (typeof num2 != 'object')
        num2 = new SuperInteger(num2);
    
    var num1 = this.toString();
    var num2 = num2.toString();
    
    if (num1.length > num2.length) return true;
    if (num2.length > num1.length) return false;
    
    for (var i = 0; i < num1.length; i++)
        if (num1[i] != num2[i])
            return num1[i] > num2[i];
    
    return false;
};

//Utils - Smaller 
SuperInteger.prototype.smaller = function(num2) {
    if (typeof num2 != 'object')
        num2 = new SuperInteger(num2);
    
    var num1 = this.toString();
    var num2 = num2.toString();
    
    if (num1.length < num2.length) return true;
    if (num2.length > num1.length) return false;
    
    for (var i = 0; i < num1.length; i++)
        if (num1[i] != num2[i])
            return num1[i] < num2[i];
    return false;
};

//Utils - Equals
SuperInteger.prototype.eq = function(num2) {
    if (typeof num2 != 'object')
        num2 = new SuperInteger(num2);
    
    var num1 = this.toString();
    var num2 = num2.toString();
    
    return num1.localeCompare(num2) == 0;
};

//Utils - Truncate
SuperInteger.prototype.truncate = function(n) {
    var l = this.toString().length;
    while (l < n) {
        this.value = "0" + this.toString();
        l++;
    }
    return this.toString().substring(l-n, l);
};

//Utils - Remove Zeros
SuperInteger.prototype.removeZeros = function() {
    var result = new SuperInteger(this.toString().replace(/^0+/, ''));
    if (result.toString() == "") result = new SuperInteger(0);
    return result;
};

//Sum
SuperInteger.prototype.add = function(num2) {
    if (typeof num2 != 'object')
        num2 = new SuperInteger(num2);
    
    var l = Math.max(this.toString().length, num2.toString().length);
    this.truncate(l); num2.truncate(l);
    
    var num1 = this.toString();
    var num2 = num2.toString();
    
    var result = '';
    var carry = 0;
    
    for (var i = 0; i < l; i++) {
        var dig1 = num1.charCodeAt(l-1-i)-48;
        var dig2 = num2.charCodeAt(l-1-i)-48;
        result += String.fromCharCode(48 + (dig1 + dig2 + carry)%10);
        carry = parseInt((dig1 + dig2 + carry)/10);
    }
    if (carry == 1)
        result += carry;
    result = result.split("").reverse().join("");
    return new SuperInteger(result).removeZeros();
};

//Subtraction
SuperInteger.prototype.minus = function(num2) {
    if (typeof num2 != 'object')
        num2 = new SuperInteger(num2);
    
    var num1 = this;
    
    var l = Math.max(num1.toString().length, num2.toString().length);
    num1.truncate(l); num2.truncate(l);
    
    var num2 = num2.toString();
    var comp2 = "";
    for (var i = 0; i < num2.length; i++)
        comp2 = comp2 + (57-num2.charCodeAt(i)); // 9 - dig
    
    
    num2 = new SuperInteger(comp2);
    num2 = num2.add(1);
    
    var result = new SuperInteger(num1.add(num2).truncate(l));
    return result.removeZeros();
};

//Multiplication
SuperInteger.prototype.times = function(num2) {
    if (typeof num2 != 'object')
        num2 = new SuperInteger(num2);
    var num1 = this;
    
    num1 = num1.removeZeros();
    num2 = num2.removeZeros();
    
    var zero = new SuperInteger(0);
    var result = new SuperInteger(zero);
    while(num2.greater(zero)) {
        var x = new SuperInteger(num1);
        var i = new SuperInteger(1)
        while (i.add(i).greater(num2) == false) {
            i = i.add(i);
            x = x.add(x);
        }
        result = result.add(x);
        num2 = num2.minus(i);
    }
    return result;
};

//Division
SuperInteger.prototype.div = function(num2) {
    if (typeof num2 != 'object')
        num2 = new SuperInteger(num2);
    var num1 = this;
    
    num1 = num1.removeZeros();
    num2 = num2.removeZeros();
    
    var zero = new SuperInteger(0);
    var result = new SuperInteger(zero);
    
    while(num2.greater(num1) == false) {
        var x = new SuperInteger(num2);
        var i = new SuperInteger(1)
        while (x.add(x).greater(num1) == false) {
            x = x.add(x);
            i = i.add(i);
        }
        result = result.add(i);
        num1 = num1.minus(x);
    }
    return result;
};

//Mod
SuperInteger.prototype.mod = function(n) {
    return this.minus(this.div(n).times(n));
};

//Exponentiation
SuperInteger.prototype.pow = function(num2) {
    if (typeof num2 != 'object')
        num2 = new SuperInteger(num2);
    var num1 = this;
    
    num1 = num1.removeZeros();
    num2 = num2.removeZeros();
    
    var zero = new SuperInteger(0);
    var one = new SuperInteger(1);
    var result = new SuperInteger(one);
    
    while(num2.greater(zero)) {
        var x = new SuperInteger(num1);
        var i = new SuperInteger(1)
        while (i.add(i).greater(num2) == false) {
            i = i.add(i);
            x = x.times(x);
        }
        result = result.times(x);
        num2 = num2.minus(i);
    }
    return result;
};

//Exponentiation with mod
SuperInteger.prototype.powMod = function(num2, m) {
    num1 = new SuperInteger(this).mod(m).removeZeros();
    num2 = new SuperInteger(num2).mod(m).removeZeros();
    
    var zero = new SuperInteger(0);
    var one = new SuperInteger(1);
    var result = new SuperInteger(one);
    
    var values = {};
    while(num2.greater(zero)) {
        var x = new SuperInteger(num1);
        var i = new SuperInteger(1)
        while (i.add(i).greater(num2) == false) {
            i = i.add(i);
            if (i in values)
                x = values[i];
            else {
                x = x.times(x).mod(m);
                values[i] = x;
            }
        }
        result = result.times(x).mod(m);
        num2 = num2.minus(i);
    }
    return result;
};

//Greatest Common Divisor
SuperInteger.prototype.gcd = function(num2) {
    var num1 = new SuperInteger(this);
    var num2 = new SuperInteger(num2);
    var num3 = null;
    
    while (num2.eq(0) == false) {
        num3 = num1.mod(num2);
        num1 = num2;
        num2 = num3;
    }
    
    return num1;
};

//Generate a rondom number between minN and maxN (inclusive)
SuperInteger.prototype.random = function(minN, maxN) {
    if (typeof minN != 'object') minN = new SuperInteger(minN);
    if (typeof maxN != 'object') maxN = new SuperInteger(maxN);
    
    minN = minN.removeZeros().toString();
    maxN = maxN.removeZeros().toString();
    
    var result;
    do {
        result = "";
        result += Math.floor(Math.random() * (maxN.charCodeAt(0)-46));
        for (var i = 1; i < maxN.length; i++) {
            result += Math.floor(Math.random() * 10);
        }
        result = new SuperInteger(result).removeZeros();
    } while (result.greater(maxN) || result.smaller(minN));
    return new SuperInteger(result);
};

SuperInteger.prototype.toString = function() {
    return this.value;
};