function isPrime(candidate) {
    if (typeof candidate != 'object') 
        candidate = new SuperInteger(candidate);
    
    if (candidate.eq(2) || candidate.eq(3))
        return true;
    
    if (candidate.mod(2).eq(0))
        return false;
    
    //Generate small primes (3 to 7919)
    //I could use the crive here, but there is no need, 
    //because the interval is too short..
    var smallPrimes = [];
    for (var i = 3; i <= 7919; i++) {
        var isPrime = true;
        for (var j = 0; j <= Math.sqrt(i); j++)
            if (i % j == 0) isPrime = false;
        if (isPrime == true) {
            smallPrimes.push(new SuperInteger(i));
            //
            console.log("Small prime: " + i);
            //
        }
    }
        
    //Test candidate against small primes
    for (var i = 0; i < smallPrimes.length; i++)
        if (candidate.mod(smallPrimes[i]).eq(zero))
            continue;
            
    //Generate a random number smaller than the candidate
    var random = new SuperInteger().random(3, candidate.minus(1));

    //Fermat Primality Test
    if(random.powMod(candidate.minus(1), candidate).eq(1) == false) 
        return false;

    var miller_test = true;
            
    //Miller-Rabin Primality Test --> 10 times
    for (var it = 0; it < 10; it++) {
        //Generate another random number smaller than the candidate
        random = new SuperInteger().random(3, candidate.minus(1));

        //Calculate r and d as (candidate-1) = 2^r * d
        var d = new SuperInteger(candidate.minus(1));
        var a = new SuperInteger(1);
        while (d.mod(2).eq(0)) {
            d = d.div(2);
            a = a.add(1);   
        }
    
        //Calculate x and test if it is one or candidate-1
        var x = random.powMod(d,candidate);
        if (x.eq(1) || x.eq(candidate.minus(1)))
            return true;

        for (var i = 0; i < parseInt(a.minus(1).toString()); i++) {
            x = x.pow(2).mod(candidate);
            if (x.eq(1)) {
                miller_test = false;
                return true;
            }
            if (x.eq(candidate.minus(1)))
                return true;
        }
    }    
    return false;
};

function generatePrime(bits) {
    var maxnumber = new SuperInteger(2).pow(bits).minus(1);
    var candidate = new SuperInteger(2);
    var tested = {};
    do {
        tested[candidate] = 1;
        candidate = candidate.random(3, maxnumber);
    } while (candidate in tested || isPrime(candidate) == false);
    return candidate;
};