/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/seedrandom/index.js":
/*!******************************************!*\
  !*** ./node_modules/seedrandom/index.js ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// A library of seedable RNGs implemented in Javascript.
//
// Usage:
//
// var seedrandom = require('seedrandom');
// var random = seedrandom(1); // or any seed.
// var x = random();       // 0 <= x < 1.  Every bit is random.
// var x = random.quick(); // 0 <= x < 1.  32 bits of randomness.

// alea, a 53-bit multiply-with-carry generator by Johannes Baagøe.
// Period: ~2^116
// Reported to pass all BigCrush tests.
var alea = __webpack_require__(/*! ./lib/alea */ "./node_modules/seedrandom/lib/alea.js");

// xor128, a pure xor-shift generator by George Marsaglia.
// Period: 2^128-1.
// Reported to fail: MatrixRank and LinearComp.
var xor128 = __webpack_require__(/*! ./lib/xor128 */ "./node_modules/seedrandom/lib/xor128.js");

// xorwow, George Marsaglia's 160-bit xor-shift combined plus weyl.
// Period: 2^192-2^32
// Reported to fail: CollisionOver, SimpPoker, and LinearComp.
var xorwow = __webpack_require__(/*! ./lib/xorwow */ "./node_modules/seedrandom/lib/xorwow.js");

// xorshift7, by François Panneton and Pierre L'ecuyer, takes
// a different approach: it adds robustness by allowing more shifts
// than Marsaglia's original three.  It is a 7-shift generator
// with 256 bits, that passes BigCrush with no systmatic failures.
// Period 2^256-1.
// No systematic BigCrush failures reported.
var xorshift7 = __webpack_require__(/*! ./lib/xorshift7 */ "./node_modules/seedrandom/lib/xorshift7.js");

// xor4096, by Richard Brent, is a 4096-bit xor-shift with a
// very long period that also adds a Weyl generator. It also passes
// BigCrush with no systematic failures.  Its long period may
// be useful if you have many generators and need to avoid
// collisions.
// Period: 2^4128-2^32.
// No systematic BigCrush failures reported.
var xor4096 = __webpack_require__(/*! ./lib/xor4096 */ "./node_modules/seedrandom/lib/xor4096.js");

// Tyche-i, by Samuel Neves and Filipe Araujo, is a bit-shifting random
// number generator derived from ChaCha, a modern stream cipher.
// https://eden.dei.uc.pt/~sneves/pubs/2011-snfa2.pdf
// Period: ~2^127
// No systematic BigCrush failures reported.
var tychei = __webpack_require__(/*! ./lib/tychei */ "./node_modules/seedrandom/lib/tychei.js");

// The original ARC4-based prng included in this library.
// Period: ~2^1600
var sr = __webpack_require__(/*! ./seedrandom */ "./node_modules/seedrandom/seedrandom.js");

sr.alea = alea;
sr.xor128 = xor128;
sr.xorwow = xorwow;
sr.xorshift7 = xorshift7;
sr.xor4096 = xor4096;
sr.tychei = tychei;

module.exports = sr;


/***/ }),

/***/ "./node_modules/seedrandom/lib/alea.js":
/*!*********************************************!*\
  !*** ./node_modules/seedrandom/lib/alea.js ***!
  \*********************************************/
/***/ (function(module, exports, __webpack_require__) {

/* module decorator */ module = __webpack_require__.nmd(module);
var __WEBPACK_AMD_DEFINE_RESULT__;// A port of an algorithm by Johannes Baagøe <baagoe@baagoe.com>, 2010
// http://baagoe.com/en/RandomMusings/javascript/
// https://github.com/nquinlan/better-random-numbers-for-javascript-mirror
// Original work is under MIT license -

// Copyright (C) 2010 by Johannes Baagøe <baagoe@baagoe.org>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.



(function(global, module, define) {

function Alea(seed) {
  var me = this, mash = Mash();

  me.next = function() {
    var t = 2091639 * me.s0 + me.c * 2.3283064365386963e-10; // 2^-32
    me.s0 = me.s1;
    me.s1 = me.s2;
    return me.s2 = t - (me.c = t | 0);
  };

  // Apply the seeding algorithm from Baagoe.
  me.c = 1;
  me.s0 = mash(' ');
  me.s1 = mash(' ');
  me.s2 = mash(' ');
  me.s0 -= mash(seed);
  if (me.s0 < 0) { me.s0 += 1; }
  me.s1 -= mash(seed);
  if (me.s1 < 0) { me.s1 += 1; }
  me.s2 -= mash(seed);
  if (me.s2 < 0) { me.s2 += 1; }
  mash = null;
}

function copy(f, t) {
  t.c = f.c;
  t.s0 = f.s0;
  t.s1 = f.s1;
  t.s2 = f.s2;
  return t;
}

function impl(seed, opts) {
  var xg = new Alea(seed),
      state = opts && opts.state,
      prng = xg.next;
  prng.int32 = function() { return (xg.next() * 0x100000000) | 0; }
  prng.double = function() {
    return prng() + (prng() * 0x200000 | 0) * 1.1102230246251565e-16; // 2^-53
  };
  prng.quick = prng;
  if (state) {
    if (typeof(state) == 'object') copy(state, xg);
    prng.state = function() { return copy(xg, {}); }
  }
  return prng;
}

function Mash() {
  var n = 0xefc8249d;

  var mash = function(data) {
    data = String(data);
    for (var i = 0; i < data.length; i++) {
      n += data.charCodeAt(i);
      var h = 0.02519603282416938 * n;
      n = h >>> 0;
      h -= n;
      h *= n;
      n = h >>> 0;
      h -= n;
      n += h * 0x100000000; // 2^32
    }
    return (n >>> 0) * 2.3283064365386963e-10; // 2^-32
  };

  return mash;
}


if (module && module.exports) {
  module.exports = impl;
} else if (__webpack_require__.amdD && __webpack_require__.amdO) {
  !(__WEBPACK_AMD_DEFINE_RESULT__ = (function() { return impl; }).call(exports, __webpack_require__, exports, module),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
} else {
  this.alea = impl;
}

})(
  this,
   true && module,    // present in node.js
  __webpack_require__.amdD   // present with an AMD loader
);




/***/ }),

/***/ "./node_modules/seedrandom/lib/tychei.js":
/*!***********************************************!*\
  !*** ./node_modules/seedrandom/lib/tychei.js ***!
  \***********************************************/
/***/ (function(module, exports, __webpack_require__) {

/* module decorator */ module = __webpack_require__.nmd(module);
var __WEBPACK_AMD_DEFINE_RESULT__;// A Javascript implementaion of the "Tyche-i" prng algorithm by
// Samuel Neves and Filipe Araujo.
// See https://eden.dei.uc.pt/~sneves/pubs/2011-snfa2.pdf

(function(global, module, define) {

function XorGen(seed) {
  var me = this, strseed = '';

  // Set up generator function.
  me.next = function() {
    var b = me.b, c = me.c, d = me.d, a = me.a;
    b = (b << 25) ^ (b >>> 7) ^ c;
    c = (c - d) | 0;
    d = (d << 24) ^ (d >>> 8) ^ a;
    a = (a - b) | 0;
    me.b = b = (b << 20) ^ (b >>> 12) ^ c;
    me.c = c = (c - d) | 0;
    me.d = (d << 16) ^ (c >>> 16) ^ a;
    return me.a = (a - b) | 0;
  };

  /* The following is non-inverted tyche, which has better internal
   * bit diffusion, but which is about 25% slower than tyche-i in JS.
  me.next = function() {
    var a = me.a, b = me.b, c = me.c, d = me.d;
    a = (me.a + me.b | 0) >>> 0;
    d = me.d ^ a; d = d << 16 ^ d >>> 16;
    c = me.c + d | 0;
    b = me.b ^ c; b = b << 12 ^ d >>> 20;
    me.a = a = a + b | 0;
    d = d ^ a; me.d = d = d << 8 ^ d >>> 24;
    me.c = c = c + d | 0;
    b = b ^ c;
    return me.b = (b << 7 ^ b >>> 25);
  }
  */

  me.a = 0;
  me.b = 0;
  me.c = 2654435769 | 0;
  me.d = 1367130551;

  if (seed === Math.floor(seed)) {
    // Integer seed.
    me.a = (seed / 0x100000000) | 0;
    me.b = seed | 0;
  } else {
    // String seed.
    strseed += seed;
  }

  // Mix in string seed, then discard an initial batch of 64 values.
  for (var k = 0; k < strseed.length + 20; k++) {
    me.b ^= strseed.charCodeAt(k) | 0;
    me.next();
  }
}

function copy(f, t) {
  t.a = f.a;
  t.b = f.b;
  t.c = f.c;
  t.d = f.d;
  return t;
};

function impl(seed, opts) {
  var xg = new XorGen(seed),
      state = opts && opts.state,
      prng = function() { return (xg.next() >>> 0) / 0x100000000; };
  prng.double = function() {
    do {
      var top = xg.next() >>> 11,
          bot = (xg.next() >>> 0) / 0x100000000,
          result = (top + bot) / (1 << 21);
    } while (result === 0);
    return result;
  };
  prng.int32 = xg.next;
  prng.quick = prng;
  if (state) {
    if (typeof(state) == 'object') copy(state, xg);
    prng.state = function() { return copy(xg, {}); }
  }
  return prng;
}

if (module && module.exports) {
  module.exports = impl;
} else if (__webpack_require__.amdD && __webpack_require__.amdO) {
  !(__WEBPACK_AMD_DEFINE_RESULT__ = (function() { return impl; }).call(exports, __webpack_require__, exports, module),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
} else {
  this.tychei = impl;
}

})(
  this,
   true && module,    // present in node.js
  __webpack_require__.amdD   // present with an AMD loader
);




/***/ }),

/***/ "./node_modules/seedrandom/lib/xor128.js":
/*!***********************************************!*\
  !*** ./node_modules/seedrandom/lib/xor128.js ***!
  \***********************************************/
/***/ (function(module, exports, __webpack_require__) {

/* module decorator */ module = __webpack_require__.nmd(module);
var __WEBPACK_AMD_DEFINE_RESULT__;// A Javascript implementaion of the "xor128" prng algorithm by
// George Marsaglia.  See http://www.jstatsoft.org/v08/i14/paper

(function(global, module, define) {

function XorGen(seed) {
  var me = this, strseed = '';

  me.x = 0;
  me.y = 0;
  me.z = 0;
  me.w = 0;

  // Set up generator function.
  me.next = function() {
    var t = me.x ^ (me.x << 11);
    me.x = me.y;
    me.y = me.z;
    me.z = me.w;
    return me.w ^= (me.w >>> 19) ^ t ^ (t >>> 8);
  };

  if (seed === (seed | 0)) {
    // Integer seed.
    me.x = seed;
  } else {
    // String seed.
    strseed += seed;
  }

  // Mix in string seed, then discard an initial batch of 64 values.
  for (var k = 0; k < strseed.length + 64; k++) {
    me.x ^= strseed.charCodeAt(k) | 0;
    me.next();
  }
}

function copy(f, t) {
  t.x = f.x;
  t.y = f.y;
  t.z = f.z;
  t.w = f.w;
  return t;
}

function impl(seed, opts) {
  var xg = new XorGen(seed),
      state = opts && opts.state,
      prng = function() { return (xg.next() >>> 0) / 0x100000000; };
  prng.double = function() {
    do {
      var top = xg.next() >>> 11,
          bot = (xg.next() >>> 0) / 0x100000000,
          result = (top + bot) / (1 << 21);
    } while (result === 0);
    return result;
  };
  prng.int32 = xg.next;
  prng.quick = prng;
  if (state) {
    if (typeof(state) == 'object') copy(state, xg);
    prng.state = function() { return copy(xg, {}); }
  }
  return prng;
}

if (module && module.exports) {
  module.exports = impl;
} else if (__webpack_require__.amdD && __webpack_require__.amdO) {
  !(__WEBPACK_AMD_DEFINE_RESULT__ = (function() { return impl; }).call(exports, __webpack_require__, exports, module),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
} else {
  this.xor128 = impl;
}

})(
  this,
   true && module,    // present in node.js
  __webpack_require__.amdD   // present with an AMD loader
);




/***/ }),

/***/ "./node_modules/seedrandom/lib/xor4096.js":
/*!************************************************!*\
  !*** ./node_modules/seedrandom/lib/xor4096.js ***!
  \************************************************/
/***/ (function(module, exports, __webpack_require__) {

/* module decorator */ module = __webpack_require__.nmd(module);
var __WEBPACK_AMD_DEFINE_RESULT__;// A Javascript implementaion of Richard Brent's Xorgens xor4096 algorithm.
//
// This fast non-cryptographic random number generator is designed for
// use in Monte-Carlo algorithms. It combines a long-period xorshift
// generator with a Weyl generator, and it passes all common batteries
// of stasticial tests for randomness while consuming only a few nanoseconds
// for each prng generated.  For background on the generator, see Brent's
// paper: "Some long-period random number generators using shifts and xors."
// http://arxiv.org/pdf/1004.3115v1.pdf
//
// Usage:
//
// var xor4096 = require('xor4096');
// random = xor4096(1);                        // Seed with int32 or string.
// assert.equal(random(), 0.1520436450538547); // (0, 1) range, 53 bits.
// assert.equal(random.int32(), 1806534897);   // signed int32, 32 bits.
//
// For nonzero numeric keys, this impelementation provides a sequence
// identical to that by Brent's xorgens 3 implementaion in C.  This
// implementation also provides for initalizing the generator with
// string seeds, or for saving and restoring the state of the generator.
//
// On Chrome, this prng benchmarks about 2.1 times slower than
// Javascript's built-in Math.random().

(function(global, module, define) {

function XorGen(seed) {
  var me = this;

  // Set up generator function.
  me.next = function() {
    var w = me.w,
        X = me.X, i = me.i, t, v;
    // Update Weyl generator.
    me.w = w = (w + 0x61c88647) | 0;
    // Update xor generator.
    v = X[(i + 34) & 127];
    t = X[i = ((i + 1) & 127)];
    v ^= v << 13;
    t ^= t << 17;
    v ^= v >>> 15;
    t ^= t >>> 12;
    // Update Xor generator array state.
    v = X[i] = v ^ t;
    me.i = i;
    // Result is the combination.
    return (v + (w ^ (w >>> 16))) | 0;
  };

  function init(me, seed) {
    var t, v, i, j, w, X = [], limit = 128;
    if (seed === (seed | 0)) {
      // Numeric seeds initialize v, which is used to generates X.
      v = seed;
      seed = null;
    } else {
      // String seeds are mixed into v and X one character at a time.
      seed = seed + '\0';
      v = 0;
      limit = Math.max(limit, seed.length);
    }
    // Initialize circular array and weyl value.
    for (i = 0, j = -32; j < limit; ++j) {
      // Put the unicode characters into the array, and shuffle them.
      if (seed) v ^= seed.charCodeAt((j + 32) % seed.length);
      // After 32 shuffles, take v as the starting w value.
      if (j === 0) w = v;
      v ^= v << 10;
      v ^= v >>> 15;
      v ^= v << 4;
      v ^= v >>> 13;
      if (j >= 0) {
        w = (w + 0x61c88647) | 0;     // Weyl.
        t = (X[j & 127] ^= (v + w));  // Combine xor and weyl to init array.
        i = (0 == t) ? i + 1 : 0;     // Count zeroes.
      }
    }
    // We have detected all zeroes; make the key nonzero.
    if (i >= 128) {
      X[(seed && seed.length || 0) & 127] = -1;
    }
    // Run the generator 512 times to further mix the state before using it.
    // Factoring this as a function slows the main generator, so it is just
    // unrolled here.  The weyl generator is not advanced while warming up.
    i = 127;
    for (j = 4 * 128; j > 0; --j) {
      v = X[(i + 34) & 127];
      t = X[i = ((i + 1) & 127)];
      v ^= v << 13;
      t ^= t << 17;
      v ^= v >>> 15;
      t ^= t >>> 12;
      X[i] = v ^ t;
    }
    // Storing state as object members is faster than using closure variables.
    me.w = w;
    me.X = X;
    me.i = i;
  }

  init(me, seed);
}

function copy(f, t) {
  t.i = f.i;
  t.w = f.w;
  t.X = f.X.slice();
  return t;
};

function impl(seed, opts) {
  if (seed == null) seed = +(new Date);
  var xg = new XorGen(seed),
      state = opts && opts.state,
      prng = function() { return (xg.next() >>> 0) / 0x100000000; };
  prng.double = function() {
    do {
      var top = xg.next() >>> 11,
          bot = (xg.next() >>> 0) / 0x100000000,
          result = (top + bot) / (1 << 21);
    } while (result === 0);
    return result;
  };
  prng.int32 = xg.next;
  prng.quick = prng;
  if (state) {
    if (state.X) copy(state, xg);
    prng.state = function() { return copy(xg, {}); }
  }
  return prng;
}

if (module && module.exports) {
  module.exports = impl;
} else if (__webpack_require__.amdD && __webpack_require__.amdO) {
  !(__WEBPACK_AMD_DEFINE_RESULT__ = (function() { return impl; }).call(exports, __webpack_require__, exports, module),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
} else {
  this.xor4096 = impl;
}

})(
  this,                                     // window object or global
   true && module,    // present in node.js
  __webpack_require__.amdD   // present with an AMD loader
);


/***/ }),

/***/ "./node_modules/seedrandom/lib/xorshift7.js":
/*!**************************************************!*\
  !*** ./node_modules/seedrandom/lib/xorshift7.js ***!
  \**************************************************/
/***/ (function(module, exports, __webpack_require__) {

/* module decorator */ module = __webpack_require__.nmd(module);
var __WEBPACK_AMD_DEFINE_RESULT__;// A Javascript implementaion of the "xorshift7" algorithm by
// François Panneton and Pierre L'ecuyer:
// "On the Xorgshift Random Number Generators"
// http://saluc.engr.uconn.edu/refs/crypto/rng/panneton05onthexorshift.pdf

(function(global, module, define) {

function XorGen(seed) {
  var me = this;

  // Set up generator function.
  me.next = function() {
    // Update xor generator.
    var X = me.x, i = me.i, t, v, w;
    t = X[i]; t ^= (t >>> 7); v = t ^ (t << 24);
    t = X[(i + 1) & 7]; v ^= t ^ (t >>> 10);
    t = X[(i + 3) & 7]; v ^= t ^ (t >>> 3);
    t = X[(i + 4) & 7]; v ^= t ^ (t << 7);
    t = X[(i + 7) & 7]; t = t ^ (t << 13); v ^= t ^ (t << 9);
    X[i] = v;
    me.i = (i + 1) & 7;
    return v;
  };

  function init(me, seed) {
    var j, w, X = [];

    if (seed === (seed | 0)) {
      // Seed state array using a 32-bit integer.
      w = X[0] = seed;
    } else {
      // Seed state using a string.
      seed = '' + seed;
      for (j = 0; j < seed.length; ++j) {
        X[j & 7] = (X[j & 7] << 15) ^
            (seed.charCodeAt(j) + X[(j + 1) & 7] << 13);
      }
    }
    // Enforce an array length of 8, not all zeroes.
    while (X.length < 8) X.push(0);
    for (j = 0; j < 8 && X[j] === 0; ++j);
    if (j == 8) w = X[7] = -1; else w = X[j];

    me.x = X;
    me.i = 0;

    // Discard an initial 256 values.
    for (j = 256; j > 0; --j) {
      me.next();
    }
  }

  init(me, seed);
}

function copy(f, t) {
  t.x = f.x.slice();
  t.i = f.i;
  return t;
}

function impl(seed, opts) {
  if (seed == null) seed = +(new Date);
  var xg = new XorGen(seed),
      state = opts && opts.state,
      prng = function() { return (xg.next() >>> 0) / 0x100000000; };
  prng.double = function() {
    do {
      var top = xg.next() >>> 11,
          bot = (xg.next() >>> 0) / 0x100000000,
          result = (top + bot) / (1 << 21);
    } while (result === 0);
    return result;
  };
  prng.int32 = xg.next;
  prng.quick = prng;
  if (state) {
    if (state.x) copy(state, xg);
    prng.state = function() { return copy(xg, {}); }
  }
  return prng;
}

if (module && module.exports) {
  module.exports = impl;
} else if (__webpack_require__.amdD && __webpack_require__.amdO) {
  !(__WEBPACK_AMD_DEFINE_RESULT__ = (function() { return impl; }).call(exports, __webpack_require__, exports, module),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
} else {
  this.xorshift7 = impl;
}

})(
  this,
   true && module,    // present in node.js
  __webpack_require__.amdD   // present with an AMD loader
);



/***/ }),

/***/ "./node_modules/seedrandom/lib/xorwow.js":
/*!***********************************************!*\
  !*** ./node_modules/seedrandom/lib/xorwow.js ***!
  \***********************************************/
/***/ (function(module, exports, __webpack_require__) {

/* module decorator */ module = __webpack_require__.nmd(module);
var __WEBPACK_AMD_DEFINE_RESULT__;// A Javascript implementaion of the "xorwow" prng algorithm by
// George Marsaglia.  See http://www.jstatsoft.org/v08/i14/paper

(function(global, module, define) {

function XorGen(seed) {
  var me = this, strseed = '';

  // Set up generator function.
  me.next = function() {
    var t = (me.x ^ (me.x >>> 2));
    me.x = me.y; me.y = me.z; me.z = me.w; me.w = me.v;
    return (me.d = (me.d + 362437 | 0)) +
       (me.v = (me.v ^ (me.v << 4)) ^ (t ^ (t << 1))) | 0;
  };

  me.x = 0;
  me.y = 0;
  me.z = 0;
  me.w = 0;
  me.v = 0;

  if (seed === (seed | 0)) {
    // Integer seed.
    me.x = seed;
  } else {
    // String seed.
    strseed += seed;
  }

  // Mix in string seed, then discard an initial batch of 64 values.
  for (var k = 0; k < strseed.length + 64; k++) {
    me.x ^= strseed.charCodeAt(k) | 0;
    if (k == strseed.length) {
      me.d = me.x << 10 ^ me.x >>> 4;
    }
    me.next();
  }
}

function copy(f, t) {
  t.x = f.x;
  t.y = f.y;
  t.z = f.z;
  t.w = f.w;
  t.v = f.v;
  t.d = f.d;
  return t;
}

function impl(seed, opts) {
  var xg = new XorGen(seed),
      state = opts && opts.state,
      prng = function() { return (xg.next() >>> 0) / 0x100000000; };
  prng.double = function() {
    do {
      var top = xg.next() >>> 11,
          bot = (xg.next() >>> 0) / 0x100000000,
          result = (top + bot) / (1 << 21);
    } while (result === 0);
    return result;
  };
  prng.int32 = xg.next;
  prng.quick = prng;
  if (state) {
    if (typeof(state) == 'object') copy(state, xg);
    prng.state = function() { return copy(xg, {}); }
  }
  return prng;
}

if (module && module.exports) {
  module.exports = impl;
} else if (__webpack_require__.amdD && __webpack_require__.amdO) {
  !(__WEBPACK_AMD_DEFINE_RESULT__ = (function() { return impl; }).call(exports, __webpack_require__, exports, module),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
} else {
  this.xorwow = impl;
}

})(
  this,
   true && module,    // present in node.js
  __webpack_require__.amdD   // present with an AMD loader
);




/***/ }),

/***/ "./node_modules/seedrandom/seedrandom.js":
/*!***********************************************!*\
  !*** ./node_modules/seedrandom/seedrandom.js ***!
  \***********************************************/
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;/*
Copyright 2019 David Bau.

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

*/

(function (global, pool, math) {
//
// The following constants are related to IEEE 754 limits.
//

var width = 256,        // each RC4 output is 0 <= x < 256
    chunks = 6,         // at least six RC4 outputs for each double
    digits = 52,        // there are 52 significant digits in a double
    rngname = 'random', // rngname: name for Math.random and Math.seedrandom
    startdenom = math.pow(width, chunks),
    significance = math.pow(2, digits),
    overflow = significance * 2,
    mask = width - 1,
    nodecrypto;         // node.js crypto module, initialized at the bottom.

//
// seedrandom()
// This is the seedrandom function described above.
//
function seedrandom(seed, options, callback) {
  var key = [];
  options = (options == true) ? { entropy: true } : (options || {});

  // Flatten the seed string or build one from local entropy if needed.
  var shortseed = mixkey(flatten(
    options.entropy ? [seed, tostring(pool)] :
    (seed == null) ? autoseed() : seed, 3), key);

  // Use the seed to initialize an ARC4 generator.
  var arc4 = new ARC4(key);

  // This function returns a random double in [0, 1) that contains
  // randomness in every bit of the mantissa of the IEEE 754 value.
  var prng = function() {
    var n = arc4.g(chunks),             // Start with a numerator n < 2 ^ 48
        d = startdenom,                 //   and denominator d = 2 ^ 48.
        x = 0;                          //   and no 'extra last byte'.
    while (n < significance) {          // Fill up all significant digits by
      n = (n + x) * width;              //   shifting numerator and
      d *= width;                       //   denominator and generating a
      x = arc4.g(1);                    //   new least-significant-byte.
    }
    while (n >= overflow) {             // To avoid rounding up, before adding
      n /= 2;                           //   last byte, shift everything
      d /= 2;                           //   right using integer math until
      x >>>= 1;                         //   we have exactly the desired bits.
    }
    return (n + x) / d;                 // Form the number within [0, 1).
  };

  prng.int32 = function() { return arc4.g(4) | 0; }
  prng.quick = function() { return arc4.g(4) / 0x100000000; }
  prng.double = prng;

  // Mix the randomness into accumulated entropy.
  mixkey(tostring(arc4.S), pool);

  // Calling convention: what to return as a function of prng, seed, is_math.
  return (options.pass || callback ||
      function(prng, seed, is_math_call, state) {
        if (state) {
          // Load the arc4 state from the given state if it has an S array.
          if (state.S) { copy(state, arc4); }
          // Only provide the .state method if requested via options.state.
          prng.state = function() { return copy(arc4, {}); }
        }

        // If called as a method of Math (Math.seedrandom()), mutate
        // Math.random because that is how seedrandom.js has worked since v1.0.
        if (is_math_call) { math[rngname] = prng; return seed; }

        // Otherwise, it is a newer calling convention, so return the
        // prng directly.
        else return prng;
      })(
  prng,
  shortseed,
  'global' in options ? options.global : (this == math),
  options.state);
}

//
// ARC4
//
// An ARC4 implementation.  The constructor takes a key in the form of
// an array of at most (width) integers that should be 0 <= x < (width).
//
// The g(count) method returns a pseudorandom integer that concatenates
// the next (count) outputs from ARC4.  Its return value is a number x
// that is in the range 0 <= x < (width ^ count).
//
function ARC4(key) {
  var t, keylen = key.length,
      me = this, i = 0, j = me.i = me.j = 0, s = me.S = [];

  // The empty key [] is treated as [0].
  if (!keylen) { key = [keylen++]; }

  // Set up S using the standard key scheduling algorithm.
  while (i < width) {
    s[i] = i++;
  }
  for (i = 0; i < width; i++) {
    s[i] = s[j = mask & (j + key[i % keylen] + (t = s[i]))];
    s[j] = t;
  }

  // The "g" method returns the next (count) outputs as one number.
  (me.g = function(count) {
    // Using instance members instead of closure state nearly doubles speed.
    var t, r = 0,
        i = me.i, j = me.j, s = me.S;
    while (count--) {
      t = s[i = mask & (i + 1)];
      r = r * width + s[mask & ((s[i] = s[j = mask & (j + t)]) + (s[j] = t))];
    }
    me.i = i; me.j = j;
    return r;
    // For robust unpredictability, the function call below automatically
    // discards an initial batch of values.  This is called RC4-drop[256].
    // See http://google.com/search?q=rsa+fluhrer+response&btnI
  })(width);
}

//
// copy()
// Copies internal state of ARC4 to or from a plain object.
//
function copy(f, t) {
  t.i = f.i;
  t.j = f.j;
  t.S = f.S.slice();
  return t;
};

//
// flatten()
// Converts an object tree to nested arrays of strings.
//
function flatten(obj, depth) {
  var result = [], typ = (typeof obj), prop;
  if (depth && typ == 'object') {
    for (prop in obj) {
      try { result.push(flatten(obj[prop], depth - 1)); } catch (e) {}
    }
  }
  return (result.length ? result : typ == 'string' ? obj : obj + '\0');
}

//
// mixkey()
// Mixes a string seed into a key that is an array of integers, and
// returns a shortened string seed that is equivalent to the result key.
//
function mixkey(seed, key) {
  var stringseed = seed + '', smear, j = 0;
  while (j < stringseed.length) {
    key[mask & j] =
      mask & ((smear ^= key[mask & j] * 19) + stringseed.charCodeAt(j++));
  }
  return tostring(key);
}

//
// autoseed()
// Returns an object for autoseeding, using window.crypto and Node crypto
// module if available.
//
function autoseed() {
  try {
    var out;
    if (nodecrypto && (out = nodecrypto.randomBytes)) {
      // The use of 'out' to remember randomBytes makes tight minified code.
      out = out(width);
    } else {
      out = new Uint8Array(width);
      (global.crypto || global.msCrypto).getRandomValues(out);
    }
    return tostring(out);
  } catch (e) {
    var browser = global.navigator,
        plugins = browser && browser.plugins;
    return [+new Date, global, plugins, global.screen, tostring(pool)];
  }
}

//
// tostring()
// Converts an array of charcodes to a string
//
function tostring(a) {
  return String.fromCharCode.apply(0, a);
}

//
// When seedrandom.js is loaded, we immediately mix a few bits
// from the built-in RNG into the entropy pool.  Because we do
// not want to interfere with deterministic PRNG state later,
// seedrandom will not call math.random on its own again after
// initialization.
//
mixkey(math.random(), pool);

//
// Nodejs and AMD support: export the implementation as a module using
// either convention.
//
if ( true && module.exports) {
  module.exports = seedrandom;
  // When in node.js, try using crypto package for autoseeding.
  try {
    nodecrypto = __webpack_require__(/*! crypto */ "?d4c0");
  } catch (ex) {}
} else if (true) {
  !(__WEBPACK_AMD_DEFINE_RESULT__ = (function() { return seedrandom; }).call(exports, __webpack_require__, exports, module),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
} else {}


// End anonymous scope, and pass initial values.
})(
  // global: `self` in browsers (including strict mode and web workers),
  // otherwise `this` in Node and other environments
  (typeof self !== 'undefined') ? self : this,
  [],     // pool: entropy pool starts empty
  Math    // math: package containing random, pow, and seedrandom
);


/***/ }),

/***/ "./src/App.ts":
/*!********************!*\
  !*** ./src/App.ts ***!
  \********************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.resetBoard = exports.step = void 0;
const StockBird_1 = __webpack_require__(/*! ./StockBird */ "./src/StockBird.ts");
const Board_1 = __webpack_require__(/*! ./Board */ "./src/Board.ts");
const PieceGenerator_1 = __webpack_require__(/*! ./PieceGenerator */ "./src/PieceGenerator.ts");
const pieceGenerator = new PieceGenerator_1.PieceGenerator(123);
let board = Array(20).fill(0);
const lookahead = Array.from({ length: 5 }, () => pieceGenerator.getNextPiece());
console.log(lookahead);
function step() {
    // Cycle a new piece to piece LIFO.
    lookahead.push(pieceGenerator.getNextPiece());
    const nextPieceType = lookahead.shift();
    const [column, rotation, score] = (0, StockBird_1.findBestMove)(board, nextPieceType, StockBird_1.calcScore);
    let lost;
    [board, lost] = (0, Board_1.dropPiece)([...board], nextPieceType, rotation, column);
    board = (0, Board_1.clearLines)(board);
    return {
        board: board,
        piece: nextPieceType,
        isLost: lost,
        lookahead: lookahead,
    };
}
exports.step = step;
function resetBoard() {
    board = Array(20).fill(0);
}
exports.resetBoard = resetBoard;


/***/ }),

/***/ "./src/Board.ts":
/*!**********************!*\
  !*** ./src/Board.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.clearLines = exports.dropPiece = exports.printBoard = void 0;
const Tetriminos_1 = __webpack_require__(/*! ./Tetriminos */ "./src/Tetriminos.ts");
function printBoard(board) {
    const boardString = board
        .map((value, index) => {
        const row = `${index.toString().padStart(2)} |${value
            .toString(2)
            .padStart(10, "0")
            .replaceAll("0", "  ")
            .replaceAll("1", " ■")}`;
        return row;
    })
        .join("\n");
    console.log(boardString);
    console.log("------------------------");
    console.log("   | 0 1 2 3 4 5 6 7 8 9");
}
exports.printBoard = printBoard;
function dropPiece(board, piece, rotation, column) {
    const pieceShapes = Tetriminos_1.Tetriminos.get(piece);
    const pieceShape = pieceShapes[rotation];
    // console.log(pieceShape);
    // Shift piece to correct column.
    const pieceWidth = Math.floor(Math.log2(pieceShape.reduce((or, x) => or | x, 0))) + 1;
    let shiftedPiece = [...pieceShape];
    for (let i = 0; i < pieceShape.length; i++) {
        // shiftedPiece[i] = (pieceShape[i] << 10) >> Math.min(pieceWidth + column, 10);
        shiftedPiece[i] = pieceShape[i] << Math.max(10 - (pieceWidth + column), 0);
    }
    // console.log(`piece: ${piece} column: ${column} width: ${pieceWidth}`);
    // shiftedPiece.forEach((x) => {
    //     console.log(x.toString(2).padStart(10, "0").replace(/0/g, ".").replace(/1/g, "■"));
    // });
    // console.log("go to: ", board.length - pieceShape.length);
    // Find row before where piece overlaps with existing pieces.
    let y = 0;
    out: for (; y < board.length - pieceShape.length + 1; y++) {
        for (let pieceY = 0; pieceY < pieceShape.length; pieceY++) {
            if (board[y + pieceY] & shiftedPiece[pieceY]) {
                y--;
                break out;
            }
        }
    }
    y = Math.min(board.length - pieceShape.length, y);
    // Add new piece to the board.
    for (let i = 0; i < shiftedPiece.length; i++) {
        board[y + i] |= shiftedPiece[i];
    }
    return [board, y - pieceShape.length < 0];
}
exports.dropPiece = dropPiece;
function clearLines(board) {
    for (let i = 0; i < board.length; i++) {
        if (board[i] === 0b1111111111) {
            board[i] = 0;
        }
    }
    for (let i = board.length - 1; i >= 0; i--) {
        if (board[i] === 0) {
            for (let j = i - 1; j >= 0; j--) {
                if (board[j] !== 0) {
                    board[i] = board[j];
                    board[j] = 0;
                    break;
                }
            }
        }
    }
    return board;
}
exports.clearLines = clearLines;


/***/ }),

/***/ "./src/Genetic.ts":
/*!************************!*\
  !*** ./src/Genetic.ts ***!
  \************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GeneticAlgorithm = void 0;
const Board_1 = __webpack_require__(/*! ./Board */ "./src/Board.ts");
const PieceGenerator_1 = __webpack_require__(/*! ./PieceGenerator */ "./src/PieceGenerator.ts");
const StockBird_1 = __webpack_require__(/*! ./StockBird */ "./src/StockBird.ts");
class Individual {
    constructor(genes) {
        this.genes = genes;
        this.fitness = {
            cleared: 0,
            scoreTotal: 0,
            lost: false,
        };
    }
    compare(other) {
        if (!this.fitness.lost && other.fitness.lost) {
            return -1;
        }
        else if (this.fitness.lost === other.fitness.lost) {
            if (this.fitness.cleared > other.fitness.cleared) {
                return -1;
            }
            else if (this.fitness.cleared === other.fitness.cleared) {
                if (this.fitness.scoreTotal > other.fitness.scoreTotal) {
                    return -1;
                }
                else if (this.fitness.scoreTotal === other.fitness.scoreTotal) {
                    return 0;
                }
                else {
                    return 1;
                }
            }
            else {
                return 1;
            }
        }
        else {
            return 1;
        }
    }
    normalize() {
        const norm = Math.sqrt(this.genes.reduce((acc, curr) => acc + curr * curr, 0));
        this.genes = this.genes.map((x) => x / norm);
    }
    mutate() {
        const quantity = Math.random() * 0.4 - 0.2;
        const index = Math.floor(Math.random() * 4);
        this.genes[index] += quantity;
    }
    calculateFitness(seed) {
        let counterSum = 0;
        let scoreTotalSum = 0;
        let lostSum = 0;
        const pieceGenerator = new PieceGenerator_1.PieceGenerator(seed);
        for (let i = 0; i < 3; i++) {
            let board = Array(20).fill(0);
            const lookahead = Array.from({ length: 5 }, () => pieceGenerator.getNextPiece());
            const scoreFunc = (board) => {
                return (0, StockBird_1.calcScoreOnParams)(board, this.genes);
            };
            let counter = 0;
            let scoreTotal = 0;
            let lost = false;
            while (!lost && counter < 1000) {
                lookahead.push(pieceGenerator.getNextPiece());
                const nextPieceType = lookahead.shift();
                const [column, rotation, score] = (0, StockBird_1.findBestMove)(board, nextPieceType, scoreFunc);
                scoreTotal += score;
                [board, lost] = (0, Board_1.dropPiece)([...board], nextPieceType, rotation, column);
                board = (0, Board_1.clearLines)(board);
                counter++;
            }
            counterSum += counter;
            scoreTotalSum = scoreTotal;
            lostSum += lost ? 1 : 0;
        }
        return [counterSum / 3, scoreTotalSum / 3, lostSum > 0 ? true : false];
    }
}
class GeneticAlgorithm {
    constructor(populationSize) {
        this.generation = 0;
        this.survivalChance = 0.1;
        this.populationSize = populationSize;
        this.population = [];
    }
    compare(some, other) {
        if (some.fitness.lost !== other.fitness.lost) {
            return some.fitness.lost ? 1 : -1;
        }
        if (some.fitness.cleared !== other.fitness.cleared) {
            return other.fitness.cleared - some.fitness.cleared;
        }
        if (some.fitness.scoreTotal !== other.fitness.scoreTotal) {
            return other.fitness.scoreTotal - some.fitness.scoreTotal;
        }
        return 0;
    }
    initializePopulation() {
        for (let i = 0; i < this.populationSize; i++) {
            const individual = new Individual(Array.from({ length: 4 }, () => Math.random()));
            this.population.push(individual);
        }
    }
    evaluateFitness(population) {
        for (let individual of population) {
            const [counter, scoreTotal, lost] = individual.calculateFitness(Math.random());
            individual.fitness = {
                cleared: counter,
                scoreTotal: scoreTotal,
                lost: lost,
            };
        }
    }
    selection() {
        const randomCandidates = new Set();
        for (let i = 0; i < this.population.length / 10; i++) {
            randomCandidates.add(this.population[Math.floor(Math.random() * this.population.length)]);
        }
        const sorted = Array.from(randomCandidates).sort(this.compare);
        return [sorted[0], sorted[1]];
    }
    // crossover(parent1: Individual, parent2: Individual): Individual {
    //     const genes = Array.from({ length: 4 }).map(
    //         (_, i) =>
    //             parent1.fitness.cleared * parent1.genes[i] +
    //             parent2.fitness.cleared * parent2.genes[i]
    //     );
    //     const child = new Individual(genes);
    //     child.normalize();
    //     return child;
    // }
    crossover(parent1, parent2) {
        const diff = parent1.fitness.cleared / parent2.fitness.cleared;
        const genes = Array.from({ length: 4 }).map((_, i) => Math.random() * diff > 0.5 ? parent1.genes[i] : parent2.genes[i]);
        const child = new Individual(genes);
        //child.normalize();
        return child;
    }
    deleteNLastReplacement(newCandidates) {
        this.population.splice(-newCandidates.length);
        this.population.push(...newCandidates);
        this.evaluateFitness(this.population);
        this.population.sort(this.compare);
    }
    run() {
        this.initializePopulation();
        this.evaluateFitness(this.population);
        this.population.sort(this.compare);
        let count = 0;
        while (count < 50) {
            console.log(`Generation ${count}`);
            const newCandidates = Array(Math.floor(this.population.length / 3));
            for (var i = 0; i < this.population.length / 3; i++) {
                const pair = this.selection();
                const candidate = this.crossover(pair[0], pair[1]);
                if (Math.random() < 0.05) {
                    candidate.mutate();
                }
                candidate.normalize();
                newCandidates[i] = candidate;
            }
            this.deleteNLastReplacement(newCandidates);
            console.log(`Average cleared: ${this.population.reduce((acc, curr) => curr.fitness.cleared + acc, 0) /
                this.population.length}`);
            console.log(`Average score: ${this.population.reduce((acc, curr) => curr.fitness.scoreTotal + acc, 0) /
                this.population.length}`);
            console.log("Fittest candidate = " + JSON.stringify(this.population[0]));
            count++;
        }
    }
    getBestIndividual() {
        return this.population.reduce((max, obj) => (obj.fitness > max.fitness ? obj : max));
    }
}
exports.GeneticAlgorithm = GeneticAlgorithm;


/***/ }),

/***/ "./src/PieceGenerator.ts":
/*!*******************************!*\
  !*** ./src/PieceGenerator.ts ***!
  \*******************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PieceGenerator = void 0;
const Tetriminos_1 = __webpack_require__(/*! ./Tetriminos */ "./src/Tetriminos.ts");
const seedrandom_1 = __importDefault(__webpack_require__(/*! seedrandom */ "./node_modules/seedrandom/index.js"));
class PieceGenerator {
    constructor(seed) {
        this._shuffledPieces = [];
        this._currentIndex = 0;
        this.rng = (0, seedrandom_1.default)(seed.toString());
    }
    shufflePieces() {
        this._shuffledPieces = [...Tetriminos_1.PieceLetters];
        for (let i = this._shuffledPieces.length - 1; i > 0; i--) {
            const randomIndex = Math.floor(this.rng() * (i + 1));
            [this._shuffledPieces[i], this._shuffledPieces[randomIndex]] = [
                this._shuffledPieces[randomIndex],
                this._shuffledPieces[i],
            ];
        }
        this._currentIndex = 0;
    }
    getNextPiece() {
        if (this._currentIndex >= this._shuffledPieces.length) {
            this.shufflePieces();
        }
        const nextPiece = this._shuffledPieces[this._currentIndex];
        this._currentIndex++;
        return nextPiece;
    }
}
exports.PieceGenerator = PieceGenerator;


/***/ }),

/***/ "./src/StockBird.ts":
/*!**************************!*\
  !*** ./src/StockBird.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.calcScore = exports.calcScoreOnParams = exports.findBestMove = void 0;
const Tetriminos_1 = __webpack_require__(/*! ./Tetriminos */ "./src/Tetriminos.ts");
const Board_1 = __webpack_require__(/*! ./Board */ "./src/Board.ts");
function findBestMove(board, pieceType, scoreFunc) {
    const pieceShapes = Tetriminos_1.Tetriminos.get(pieceType);
    const bestMove = {
        column: 0,
        rotation: 0,
        score: -1234,
    };
    for (let col = 0; col < 10; col++) {
        for (let r = 0; r < pieceShapes.length; r++) {
            const [newBoard, lost] = (0, Board_1.dropPiece)([...board], pieceType, r, col);
            if (lost)
                continue;
            const score = scoreFunc(newBoard);
            if (score > bestMove.score) {
                bestMove.column = col;
                bestMove.rotation = r;
                bestMove.score = score;
            }
        }
    }
    return [bestMove.column, bestMove.rotation, bestMove.score];
}
exports.findBestMove = findBestMove;
function calcScoreOnParams(matrix, weights) {
    const heights = clacHeights(matrix);
    const score = -weights[0] * clacTotalHeight(heights) +
        weights[1] * countCompleteLines(matrix) +
        -weights[2] * countHoles(matrix) +
        -weights[3] * calcBumpiness(heights);
    return score;
}
exports.calcScoreOnParams = calcScoreOnParams;
function calcScore(matrix) {
    const heights = clacHeights(matrix);
    // const score =
    //     -0.5 * clacTotalHeight(heights) +
    //     0.8 * countCompleteLines(matrix) +
    //     -1 * countHoles(matrix) +
    //     -0.2 * calcBumpiness(heights);
    const score = -0.01923576804514789 * clacTotalHeight(heights) +
        0.6242115366444645 * countCompleteLines(matrix) +
        -0.7805047117058082 * countHoles(matrix) +
        -0.02832556712058955 * calcBumpiness(heights);
    return score;
}
exports.calcScore = calcScore;
function clacHeights(matrix) {
    const heights = Array(10).fill(0);
    for (let y = 0; y < 20; y++) {
        for (let x = 0; x < 10; x++) {
            if (heights[x] === 0 && (matrix[y] << x) & 0b10000000000) {
                heights[x] = 20 - y;
            }
        }
    }
    return heights;
}
function clacTotalHeight(heights) {
    return heights.reduce((sum, x) => sum + x, 0);
}
function countCompleteLines(matrix) {
    let count = 0;
    matrix.forEach((row) => {
        if (row === 1023)
            count++;
    });
    return count;
}
function countHoles(matrix) {
    let count = 0;
    for (let y = 0; y < 19; y++) {
        for (let x = 0; x < 10; x++) {
            if ((matrix[y] >> x) & 1 && !((matrix[y + 1] >> x) & 1))
                count++;
        }
    }
    return count;
}
function calcBumpiness(heights) {
    let bumpiness = 0;
    for (let i = 0; i < heights.length - 1; i++) {
        bumpiness += Math.abs(heights[i] - heights[i + 1]);
    }
    return bumpiness;
}


/***/ }),

/***/ "./src/Tetriminos.ts":
/*!***************************!*\
  !*** ./src/Tetriminos.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Tetriminos = exports.PieceLetters = void 0;
exports.PieceLetters = ["I", "J", "L", "O", "S", "T", "Z"];
exports.Tetriminos = new Map([
    [
        "J",
        [
            [0b11, 0b10, 0b10],
            [0b01, 0b01, 0b11],
            [0b111, 0b001],
            [0b100, 0b111],
        ],
    ],
    [
        "L",
        [
            [0b10, 0b10, 0b11],
            [0b111, 0b100],
            [0b11, 0b01, 0b01],
            [0b001, 0b111],
        ],
    ],
    ["I", [[0b1, 0b1, 0b1, 0b1], [0b1111]]],
    ["O", [[0b11, 0b11]]],
    [
        "T",
        [
            [0b10, 0b11, 0b10],
            [0b111, 0b010],
            [0b010, 0b111],
            [0b01, 0b11, 0b01],
        ],
    ],
    [
        "S",
        [
            [0b10, 0b11, 0b01],
            [0b011, 0b110],
        ],
    ],
    [
        "Z",
        [
            [0b01, 0b11, 0b10],
            [0b110, 0b011],
        ],
    ],
]);


/***/ }),

/***/ "?d4c0":
/*!************************!*\
  !*** crypto (ignored) ***!
  \************************/
/***/ (() => {

/* (ignored) */

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/amd define */
/******/ 	(() => {
/******/ 		__webpack_require__.amdD = function () {
/******/ 			throw new Error('define cannot be used indirect');
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/amd options */
/******/ 	(() => {
/******/ 		__webpack_require__.amdO = {};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/node module decorator */
/******/ 	(() => {
/******/ 		__webpack_require__.nmd = (module) => {
/******/ 			module.paths = [];
/******/ 			if (!module.children) module.children = [];
/******/ 			return module;
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
const { step, resetBoard } = __webpack_require__(/*! ./App */ "./src/App.ts");
const { StockBird } = __webpack_require__(/*! ./StockBird */ "./src/StockBird.ts");
const { Tetriminos } = __webpack_require__(/*! ./Tetriminos */ "./src/Tetriminos.ts");
const { GeneticAlgorithm } = __webpack_require__(/*! ./Genetic */ "./src/Genetic.ts");

const canvas = document.getElementById("tetris-board");
const ctx = canvas.getContext("2d");

const blockWidth = canvas.width / 10;
const blockHeight = canvas.height / 20;

const colorMap = {
    I: "Cyan",
    O: "Yellow",
    T: "Magenta",
    J: "Blue",
    L: "Orange",
    S: "SpringGreen",
    Z: "Red",
};

let boardMatrix = Array(20)
    .fill("")
    .map(() => Array(10).fill(""));

let isRunning = false;
let sliderValue = 0;
let didLose = false;
let pieceCounter = 0;

const lookaheadSlots = Array.from(document.getElementsByClassName("lookahead"), (c) =>
    c.getContext("2d")
);

document.addEventListener("DOMContentLoaded", async () => {
    drawEmpty();

    const counter = document.getElementById("counter");
    function incrementCounter() {
        pieceCounter++;
        counter.innerText = pieceCounter;
    }
    function resetCounter() {
        pieceCounter = 0;
        counter.innerText = pieceCounter;
    }

    const slider = document.getElementById("speed-slider");
    sliderValue = (slider.value - 1) ** 4 * 1000;

    slider.addEventListener("input", function () {
        sliderValue = (slider.value - 1) ** 4 * 1000;
    });

    document.getElementById("drop-button").addEventListener("click", () => {
        stepOne();
    });

    // Kinda cursed but it works.
    document.getElementById("start-stop-button").addEventListener("click", async (event) => {
        if (didLose) {
            resetBoard();
            drawEmpty();
            resetCounter();
            didLose = false;
        }

        isRunning = !isRunning;
        event.target.innerText = isRunning ? "Stop" : "Start";

        while (isRunning) {
            const lost = stepOne();
            if (lost) {
                isRunning = false;
                event.target.innerText = "Start";
                didLose = true;
            }

            incrementCounter();
            await new Promise((r) => setTimeout(r, sliderValue));
        }
    });

    document.getElementById("reset-button").addEventListener("click", async () => {
        resetBoard();
        drawEmpty();
        resetCounter();
    });

    document.getElementById("train-button").addEventListener("click", async () => {
        const alg = new GeneticAlgorithm(100);
        alg.run();
    });
});

function stepOne() {
    const newBoard = step();
    drawBoard(newBoard.board, newBoard.piece);
    drawLookahead(newBoard.lookahead);
    return newBoard.isLost;
}

function drawBlock(canvas, x, y, color) {
    canvas.fillStyle = color;
    canvas.fillRect(x, y, blockWidth, blockHeight);
    canvas.strokeStyle = "#1a1a1a";
    canvas.strokeRect(x, y, blockWidth, blockHeight);
}

function drawBoard(board, piece) {
    for (let row = 0; row < 20; row++) {
        for (let col = 0; col < 10; col++) {
            const bit = (board[row] >> (9 - col)) & 1;
            if (bit !== 0 && boardMatrix[row][col] === "") {
                boardMatrix[row][col] = piece;
            } else if (bit === 0) {
                boardMatrix[row][col] = "";
            }
            const block = colorMap[boardMatrix[row][col]];
            const color = block ? block : "#0e0e0e";
            drawBlock(ctx, col * blockWidth, row * blockHeight, color);
        }
    }
}

function drawLookahead(lookahead) {
    for (let i = 0; i < lookaheadSlots.length; i++) {
        const slot = lookaheadSlots[i];
        slot.clearRect(0, 0, slot.canvas.width, slot.canvas.height);

        const piece = Tetriminos.get(lookahead[i])[0];
        const pieceWidth = Math.floor(Math.log2(piece.reduce((or, x) => or | x, 0))) + 1;

        const color = colorMap[lookahead[i]];

        for (let y = 0; y < piece.length; y++) {
            for (let x = 0; x < pieceWidth; x++) {
                const bit = (piece[y] >> x) & 1;
                if (bit !== 0) {
                    drawBlock(slot, y * blockHeight, x * blockWidth, color);
                }
            }
        }
    }
}

function drawEmpty() {
    for (let row = 0; row < 20; row++) {
        for (let col = 0; col < 10; col++) {
            drawBlock(ctx, col * blockWidth, row * blockHeight, "#0e0e0e");
        }
    }
    for (let i = 0; i < lookaheadSlots.length; i++) {
        const slot = lookaheadSlots[i];
        slot.clearRect(0, 0, slot.canvas.width, slot.canvas.height);
    }
}

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0JBQXNCLFVBQVU7QUFDaEMsMEJBQTBCLFVBQVU7QUFDcEM7QUFDQTtBQUNBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CLDJCQUEyQjtBQUMvQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLGtCQUFrQjtBQUMxQyw0QkFBNEIsZ0JBQWdCO0FBQzVDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0JBQXNCLFVBQVU7QUFDaEMsMEJBQTBCLFVBQVU7QUFDcEM7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CLDJCQUEyQjtBQUMvQztBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL3RldHJpc19zb2x2ZXIvLi9ub2RlX21vZHVsZXMvc2VlZHJhbmRvbS9pbmRleC5qcyIsIndlYnBhY2s6Ly90ZXRyaXNfc29sdmVyLy4vbm9kZV9tb2R1bGVzL3NlZWRyYW5kb20vbGliL2FsZWEuanMiLCJ3ZWJwYWNrOi8vdGV0cmlzX3NvbHZlci8uL25vZGVfbW9kdWxlcy9zZWVkcmFuZG9tL2xpYi90eWNoZWkuanMiLCJ3ZWJwYWNrOi8vdGV0cmlzX3NvbHZlci8uL25vZGVfbW9kdWxlcy9zZWVkcmFuZG9tL2xpYi94b3IxMjguanMiLCJ3ZWJwYWNrOi8vdGV0cmlzX3NvbHZlci8uL25vZGVfbW9kdWxlcy9zZWVkcmFuZG9tL2xpYi94b3I0MDk2LmpzIiwid2VicGFjazovL3RldHJpc19zb2x2ZXIvLi9ub2RlX21vZHVsZXMvc2VlZHJhbmRvbS9saWIveG9yc2hpZnQ3LmpzIiwid2VicGFjazovL3RldHJpc19zb2x2ZXIvLi9ub2RlX21vZHVsZXMvc2VlZHJhbmRvbS9saWIveG9yd293LmpzIiwid2VicGFjazovL3RldHJpc19zb2x2ZXIvLi9ub2RlX21vZHVsZXMvc2VlZHJhbmRvbS9zZWVkcmFuZG9tLmpzIiwid2VicGFjazovL3RldHJpc19zb2x2ZXIvLi9zcmMvQXBwLnRzIiwid2VicGFjazovL3RldHJpc19zb2x2ZXIvLi9zcmMvQm9hcmQudHMiLCJ3ZWJwYWNrOi8vdGV0cmlzX3NvbHZlci8uL3NyYy9HZW5ldGljLnRzIiwid2VicGFjazovL3RldHJpc19zb2x2ZXIvLi9zcmMvUGllY2VHZW5lcmF0b3IudHMiLCJ3ZWJwYWNrOi8vdGV0cmlzX3NvbHZlci8uL3NyYy9TdG9ja0JpcmQudHMiLCJ3ZWJwYWNrOi8vdGV0cmlzX3NvbHZlci8uL3NyYy9UZXRyaW1pbm9zLnRzIiwid2VicGFjazovL3RldHJpc19zb2x2ZXIvaWdub3JlZHxDOlxcVXNlcnNcXExlZXZpXFxwcm9qZWN0c1xcSlNcXHRldHJpc19zY29yZVxcbm9kZV9tb2R1bGVzXFxzZWVkcmFuZG9tfGNyeXB0byIsIndlYnBhY2s6Ly90ZXRyaXNfc29sdmVyL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3RldHJpc19zb2x2ZXIvd2VicGFjay9ydW50aW1lL2FtZCBkZWZpbmUiLCJ3ZWJwYWNrOi8vdGV0cmlzX3NvbHZlci93ZWJwYWNrL3J1bnRpbWUvYW1kIG9wdGlvbnMiLCJ3ZWJwYWNrOi8vdGV0cmlzX3NvbHZlci93ZWJwYWNrL3J1bnRpbWUvbm9kZSBtb2R1bGUgZGVjb3JhdG9yIiwid2VicGFjazovL3RldHJpc19zb2x2ZXIvLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gQSBsaWJyYXJ5IG9mIHNlZWRhYmxlIFJOR3MgaW1wbGVtZW50ZWQgaW4gSmF2YXNjcmlwdC5cbi8vXG4vLyBVc2FnZTpcbi8vXG4vLyB2YXIgc2VlZHJhbmRvbSA9IHJlcXVpcmUoJ3NlZWRyYW5kb20nKTtcbi8vIHZhciByYW5kb20gPSBzZWVkcmFuZG9tKDEpOyAvLyBvciBhbnkgc2VlZC5cbi8vIHZhciB4ID0gcmFuZG9tKCk7ICAgICAgIC8vIDAgPD0geCA8IDEuICBFdmVyeSBiaXQgaXMgcmFuZG9tLlxuLy8gdmFyIHggPSByYW5kb20ucXVpY2soKTsgLy8gMCA8PSB4IDwgMS4gIDMyIGJpdHMgb2YgcmFuZG9tbmVzcy5cblxuLy8gYWxlYSwgYSA1My1iaXQgbXVsdGlwbHktd2l0aC1jYXJyeSBnZW5lcmF0b3IgYnkgSm9oYW5uZXMgQmFhZ8O4ZS5cbi8vIFBlcmlvZDogfjJeMTE2XG4vLyBSZXBvcnRlZCB0byBwYXNzIGFsbCBCaWdDcnVzaCB0ZXN0cy5cbnZhciBhbGVhID0gcmVxdWlyZSgnLi9saWIvYWxlYScpO1xuXG4vLyB4b3IxMjgsIGEgcHVyZSB4b3Itc2hpZnQgZ2VuZXJhdG9yIGJ5IEdlb3JnZSBNYXJzYWdsaWEuXG4vLyBQZXJpb2Q6IDJeMTI4LTEuXG4vLyBSZXBvcnRlZCB0byBmYWlsOiBNYXRyaXhSYW5rIGFuZCBMaW5lYXJDb21wLlxudmFyIHhvcjEyOCA9IHJlcXVpcmUoJy4vbGliL3hvcjEyOCcpO1xuXG4vLyB4b3J3b3csIEdlb3JnZSBNYXJzYWdsaWEncyAxNjAtYml0IHhvci1zaGlmdCBjb21iaW5lZCBwbHVzIHdleWwuXG4vLyBQZXJpb2Q6IDJeMTkyLTJeMzJcbi8vIFJlcG9ydGVkIHRvIGZhaWw6IENvbGxpc2lvbk92ZXIsIFNpbXBQb2tlciwgYW5kIExpbmVhckNvbXAuXG52YXIgeG9yd293ID0gcmVxdWlyZSgnLi9saWIveG9yd293Jyk7XG5cbi8vIHhvcnNoaWZ0NywgYnkgRnJhbsOnb2lzIFBhbm5ldG9uIGFuZCBQaWVycmUgTCdlY3V5ZXIsIHRha2VzXG4vLyBhIGRpZmZlcmVudCBhcHByb2FjaDogaXQgYWRkcyByb2J1c3RuZXNzIGJ5IGFsbG93aW5nIG1vcmUgc2hpZnRzXG4vLyB0aGFuIE1hcnNhZ2xpYSdzIG9yaWdpbmFsIHRocmVlLiAgSXQgaXMgYSA3LXNoaWZ0IGdlbmVyYXRvclxuLy8gd2l0aCAyNTYgYml0cywgdGhhdCBwYXNzZXMgQmlnQ3J1c2ggd2l0aCBubyBzeXN0bWF0aWMgZmFpbHVyZXMuXG4vLyBQZXJpb2QgMl4yNTYtMS5cbi8vIE5vIHN5c3RlbWF0aWMgQmlnQ3J1c2ggZmFpbHVyZXMgcmVwb3J0ZWQuXG52YXIgeG9yc2hpZnQ3ID0gcmVxdWlyZSgnLi9saWIveG9yc2hpZnQ3Jyk7XG5cbi8vIHhvcjQwOTYsIGJ5IFJpY2hhcmQgQnJlbnQsIGlzIGEgNDA5Ni1iaXQgeG9yLXNoaWZ0IHdpdGggYVxuLy8gdmVyeSBsb25nIHBlcmlvZCB0aGF0IGFsc28gYWRkcyBhIFdleWwgZ2VuZXJhdG9yLiBJdCBhbHNvIHBhc3Nlc1xuLy8gQmlnQ3J1c2ggd2l0aCBubyBzeXN0ZW1hdGljIGZhaWx1cmVzLiAgSXRzIGxvbmcgcGVyaW9kIG1heVxuLy8gYmUgdXNlZnVsIGlmIHlvdSBoYXZlIG1hbnkgZ2VuZXJhdG9ycyBhbmQgbmVlZCB0byBhdm9pZFxuLy8gY29sbGlzaW9ucy5cbi8vIFBlcmlvZDogMl40MTI4LTJeMzIuXG4vLyBObyBzeXN0ZW1hdGljIEJpZ0NydXNoIGZhaWx1cmVzIHJlcG9ydGVkLlxudmFyIHhvcjQwOTYgPSByZXF1aXJlKCcuL2xpYi94b3I0MDk2Jyk7XG5cbi8vIFR5Y2hlLWksIGJ5IFNhbXVlbCBOZXZlcyBhbmQgRmlsaXBlIEFyYXVqbywgaXMgYSBiaXQtc2hpZnRpbmcgcmFuZG9tXG4vLyBudW1iZXIgZ2VuZXJhdG9yIGRlcml2ZWQgZnJvbSBDaGFDaGEsIGEgbW9kZXJuIHN0cmVhbSBjaXBoZXIuXG4vLyBodHRwczovL2VkZW4uZGVpLnVjLnB0L35zbmV2ZXMvcHVicy8yMDExLXNuZmEyLnBkZlxuLy8gUGVyaW9kOiB+Ml4xMjdcbi8vIE5vIHN5c3RlbWF0aWMgQmlnQ3J1c2ggZmFpbHVyZXMgcmVwb3J0ZWQuXG52YXIgdHljaGVpID0gcmVxdWlyZSgnLi9saWIvdHljaGVpJyk7XG5cbi8vIFRoZSBvcmlnaW5hbCBBUkM0LWJhc2VkIHBybmcgaW5jbHVkZWQgaW4gdGhpcyBsaWJyYXJ5LlxuLy8gUGVyaW9kOiB+Ml4xNjAwXG52YXIgc3IgPSByZXF1aXJlKCcuL3NlZWRyYW5kb20nKTtcblxuc3IuYWxlYSA9IGFsZWE7XG5zci54b3IxMjggPSB4b3IxMjg7XG5zci54b3J3b3cgPSB4b3J3b3c7XG5zci54b3JzaGlmdDcgPSB4b3JzaGlmdDc7XG5zci54b3I0MDk2ID0geG9yNDA5NjtcbnNyLnR5Y2hlaSA9IHR5Y2hlaTtcblxubW9kdWxlLmV4cG9ydHMgPSBzcjtcbiIsIi8vIEEgcG9ydCBvZiBhbiBhbGdvcml0aG0gYnkgSm9oYW5uZXMgQmFhZ8O4ZSA8YmFhZ29lQGJhYWdvZS5jb20+LCAyMDEwXG4vLyBodHRwOi8vYmFhZ29lLmNvbS9lbi9SYW5kb21NdXNpbmdzL2phdmFzY3JpcHQvXG4vLyBodHRwczovL2dpdGh1Yi5jb20vbnF1aW5sYW4vYmV0dGVyLXJhbmRvbS1udW1iZXJzLWZvci1qYXZhc2NyaXB0LW1pcnJvclxuLy8gT3JpZ2luYWwgd29yayBpcyB1bmRlciBNSVQgbGljZW5zZSAtXG5cbi8vIENvcHlyaWdodCAoQykgMjAxMCBieSBKb2hhbm5lcyBCYWFnw7hlIDxiYWFnb2VAYmFhZ29lLm9yZz5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuLy8gVEhFIFNPRlRXQVJFLlxuXG5cblxuKGZ1bmN0aW9uKGdsb2JhbCwgbW9kdWxlLCBkZWZpbmUpIHtcblxuZnVuY3Rpb24gQWxlYShzZWVkKSB7XG4gIHZhciBtZSA9IHRoaXMsIG1hc2ggPSBNYXNoKCk7XG5cbiAgbWUubmV4dCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciB0ID0gMjA5MTYzOSAqIG1lLnMwICsgbWUuYyAqIDIuMzI4MzA2NDM2NTM4Njk2M2UtMTA7IC8vIDJeLTMyXG4gICAgbWUuczAgPSBtZS5zMTtcbiAgICBtZS5zMSA9IG1lLnMyO1xuICAgIHJldHVybiBtZS5zMiA9IHQgLSAobWUuYyA9IHQgfCAwKTtcbiAgfTtcblxuICAvLyBBcHBseSB0aGUgc2VlZGluZyBhbGdvcml0aG0gZnJvbSBCYWFnb2UuXG4gIG1lLmMgPSAxO1xuICBtZS5zMCA9IG1hc2goJyAnKTtcbiAgbWUuczEgPSBtYXNoKCcgJyk7XG4gIG1lLnMyID0gbWFzaCgnICcpO1xuICBtZS5zMCAtPSBtYXNoKHNlZWQpO1xuICBpZiAobWUuczAgPCAwKSB7IG1lLnMwICs9IDE7IH1cbiAgbWUuczEgLT0gbWFzaChzZWVkKTtcbiAgaWYgKG1lLnMxIDwgMCkgeyBtZS5zMSArPSAxOyB9XG4gIG1lLnMyIC09IG1hc2goc2VlZCk7XG4gIGlmIChtZS5zMiA8IDApIHsgbWUuczIgKz0gMTsgfVxuICBtYXNoID0gbnVsbDtcbn1cblxuZnVuY3Rpb24gY29weShmLCB0KSB7XG4gIHQuYyA9IGYuYztcbiAgdC5zMCA9IGYuczA7XG4gIHQuczEgPSBmLnMxO1xuICB0LnMyID0gZi5zMjtcbiAgcmV0dXJuIHQ7XG59XG5cbmZ1bmN0aW9uIGltcGwoc2VlZCwgb3B0cykge1xuICB2YXIgeGcgPSBuZXcgQWxlYShzZWVkKSxcbiAgICAgIHN0YXRlID0gb3B0cyAmJiBvcHRzLnN0YXRlLFxuICAgICAgcHJuZyA9IHhnLm5leHQ7XG4gIHBybmcuaW50MzIgPSBmdW5jdGlvbigpIHsgcmV0dXJuICh4Zy5uZXh0KCkgKiAweDEwMDAwMDAwMCkgfCAwOyB9XG4gIHBybmcuZG91YmxlID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHBybmcoKSArIChwcm5nKCkgKiAweDIwMDAwMCB8IDApICogMS4xMTAyMjMwMjQ2MjUxNTY1ZS0xNjsgLy8gMl4tNTNcbiAgfTtcbiAgcHJuZy5xdWljayA9IHBybmc7XG4gIGlmIChzdGF0ZSkge1xuICAgIGlmICh0eXBlb2Yoc3RhdGUpID09ICdvYmplY3QnKSBjb3B5KHN0YXRlLCB4Zyk7XG4gICAgcHJuZy5zdGF0ZSA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gY29weSh4Zywge30pOyB9XG4gIH1cbiAgcmV0dXJuIHBybmc7XG59XG5cbmZ1bmN0aW9uIE1hc2goKSB7XG4gIHZhciBuID0gMHhlZmM4MjQ5ZDtcblxuICB2YXIgbWFzaCA9IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICBkYXRhID0gU3RyaW5nKGRhdGEpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgbiArPSBkYXRhLmNoYXJDb2RlQXQoaSk7XG4gICAgICB2YXIgaCA9IDAuMDI1MTk2MDMyODI0MTY5MzggKiBuO1xuICAgICAgbiA9IGggPj4+IDA7XG4gICAgICBoIC09IG47XG4gICAgICBoICo9IG47XG4gICAgICBuID0gaCA+Pj4gMDtcbiAgICAgIGggLT0gbjtcbiAgICAgIG4gKz0gaCAqIDB4MTAwMDAwMDAwOyAvLyAyXjMyXG4gICAgfVxuICAgIHJldHVybiAobiA+Pj4gMCkgKiAyLjMyODMwNjQzNjUzODY5NjNlLTEwOyAvLyAyXi0zMlxuICB9O1xuXG4gIHJldHVybiBtYXNoO1xufVxuXG5cbmlmIChtb2R1bGUgJiYgbW9kdWxlLmV4cG9ydHMpIHtcbiAgbW9kdWxlLmV4cG9ydHMgPSBpbXBsO1xufSBlbHNlIGlmIChkZWZpbmUgJiYgZGVmaW5lLmFtZCkge1xuICBkZWZpbmUoZnVuY3Rpb24oKSB7IHJldHVybiBpbXBsOyB9KTtcbn0gZWxzZSB7XG4gIHRoaXMuYWxlYSA9IGltcGw7XG59XG5cbn0pKFxuICB0aGlzLFxuICAodHlwZW9mIG1vZHVsZSkgPT0gJ29iamVjdCcgJiYgbW9kdWxlLCAgICAvLyBwcmVzZW50IGluIG5vZGUuanNcbiAgKHR5cGVvZiBkZWZpbmUpID09ICdmdW5jdGlvbicgJiYgZGVmaW5lICAgLy8gcHJlc2VudCB3aXRoIGFuIEFNRCBsb2FkZXJcbik7XG5cblxuIiwiLy8gQSBKYXZhc2NyaXB0IGltcGxlbWVudGFpb24gb2YgdGhlIFwiVHljaGUtaVwiIHBybmcgYWxnb3JpdGhtIGJ5XG4vLyBTYW11ZWwgTmV2ZXMgYW5kIEZpbGlwZSBBcmF1am8uXG4vLyBTZWUgaHR0cHM6Ly9lZGVuLmRlaS51Yy5wdC9+c25ldmVzL3B1YnMvMjAxMS1zbmZhMi5wZGZcblxuKGZ1bmN0aW9uKGdsb2JhbCwgbW9kdWxlLCBkZWZpbmUpIHtcblxuZnVuY3Rpb24gWG9yR2VuKHNlZWQpIHtcbiAgdmFyIG1lID0gdGhpcywgc3Ryc2VlZCA9ICcnO1xuXG4gIC8vIFNldCB1cCBnZW5lcmF0b3IgZnVuY3Rpb24uXG4gIG1lLm5leHQgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgYiA9IG1lLmIsIGMgPSBtZS5jLCBkID0gbWUuZCwgYSA9IG1lLmE7XG4gICAgYiA9IChiIDw8IDI1KSBeIChiID4+PiA3KSBeIGM7XG4gICAgYyA9IChjIC0gZCkgfCAwO1xuICAgIGQgPSAoZCA8PCAyNCkgXiAoZCA+Pj4gOCkgXiBhO1xuICAgIGEgPSAoYSAtIGIpIHwgMDtcbiAgICBtZS5iID0gYiA9IChiIDw8IDIwKSBeIChiID4+PiAxMikgXiBjO1xuICAgIG1lLmMgPSBjID0gKGMgLSBkKSB8IDA7XG4gICAgbWUuZCA9IChkIDw8IDE2KSBeIChjID4+PiAxNikgXiBhO1xuICAgIHJldHVybiBtZS5hID0gKGEgLSBiKSB8IDA7XG4gIH07XG5cbiAgLyogVGhlIGZvbGxvd2luZyBpcyBub24taW52ZXJ0ZWQgdHljaGUsIHdoaWNoIGhhcyBiZXR0ZXIgaW50ZXJuYWxcbiAgICogYml0IGRpZmZ1c2lvbiwgYnV0IHdoaWNoIGlzIGFib3V0IDI1JSBzbG93ZXIgdGhhbiB0eWNoZS1pIGluIEpTLlxuICBtZS5uZXh0ID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGEgPSBtZS5hLCBiID0gbWUuYiwgYyA9IG1lLmMsIGQgPSBtZS5kO1xuICAgIGEgPSAobWUuYSArIG1lLmIgfCAwKSA+Pj4gMDtcbiAgICBkID0gbWUuZCBeIGE7IGQgPSBkIDw8IDE2IF4gZCA+Pj4gMTY7XG4gICAgYyA9IG1lLmMgKyBkIHwgMDtcbiAgICBiID0gbWUuYiBeIGM7IGIgPSBiIDw8IDEyIF4gZCA+Pj4gMjA7XG4gICAgbWUuYSA9IGEgPSBhICsgYiB8IDA7XG4gICAgZCA9IGQgXiBhOyBtZS5kID0gZCA9IGQgPDwgOCBeIGQgPj4+IDI0O1xuICAgIG1lLmMgPSBjID0gYyArIGQgfCAwO1xuICAgIGIgPSBiIF4gYztcbiAgICByZXR1cm4gbWUuYiA9IChiIDw8IDcgXiBiID4+PiAyNSk7XG4gIH1cbiAgKi9cblxuICBtZS5hID0gMDtcbiAgbWUuYiA9IDA7XG4gIG1lLmMgPSAyNjU0NDM1NzY5IHwgMDtcbiAgbWUuZCA9IDEzNjcxMzA1NTE7XG5cbiAgaWYgKHNlZWQgPT09IE1hdGguZmxvb3Ioc2VlZCkpIHtcbiAgICAvLyBJbnRlZ2VyIHNlZWQuXG4gICAgbWUuYSA9IChzZWVkIC8gMHgxMDAwMDAwMDApIHwgMDtcbiAgICBtZS5iID0gc2VlZCB8IDA7XG4gIH0gZWxzZSB7XG4gICAgLy8gU3RyaW5nIHNlZWQuXG4gICAgc3Ryc2VlZCArPSBzZWVkO1xuICB9XG5cbiAgLy8gTWl4IGluIHN0cmluZyBzZWVkLCB0aGVuIGRpc2NhcmQgYW4gaW5pdGlhbCBiYXRjaCBvZiA2NCB2YWx1ZXMuXG4gIGZvciAodmFyIGsgPSAwOyBrIDwgc3Ryc2VlZC5sZW5ndGggKyAyMDsgaysrKSB7XG4gICAgbWUuYiBePSBzdHJzZWVkLmNoYXJDb2RlQXQoaykgfCAwO1xuICAgIG1lLm5leHQoKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBjb3B5KGYsIHQpIHtcbiAgdC5hID0gZi5hO1xuICB0LmIgPSBmLmI7XG4gIHQuYyA9IGYuYztcbiAgdC5kID0gZi5kO1xuICByZXR1cm4gdDtcbn07XG5cbmZ1bmN0aW9uIGltcGwoc2VlZCwgb3B0cykge1xuICB2YXIgeGcgPSBuZXcgWG9yR2VuKHNlZWQpLFxuICAgICAgc3RhdGUgPSBvcHRzICYmIG9wdHMuc3RhdGUsXG4gICAgICBwcm5nID0gZnVuY3Rpb24oKSB7IHJldHVybiAoeGcubmV4dCgpID4+PiAwKSAvIDB4MTAwMDAwMDAwOyB9O1xuICBwcm5nLmRvdWJsZSA9IGZ1bmN0aW9uKCkge1xuICAgIGRvIHtcbiAgICAgIHZhciB0b3AgPSB4Zy5uZXh0KCkgPj4+IDExLFxuICAgICAgICAgIGJvdCA9ICh4Zy5uZXh0KCkgPj4+IDApIC8gMHgxMDAwMDAwMDAsXG4gICAgICAgICAgcmVzdWx0ID0gKHRvcCArIGJvdCkgLyAoMSA8PCAyMSk7XG4gICAgfSB3aGlsZSAocmVzdWx0ID09PSAwKTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuICBwcm5nLmludDMyID0geGcubmV4dDtcbiAgcHJuZy5xdWljayA9IHBybmc7XG4gIGlmIChzdGF0ZSkge1xuICAgIGlmICh0eXBlb2Yoc3RhdGUpID09ICdvYmplY3QnKSBjb3B5KHN0YXRlLCB4Zyk7XG4gICAgcHJuZy5zdGF0ZSA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gY29weSh4Zywge30pOyB9XG4gIH1cbiAgcmV0dXJuIHBybmc7XG59XG5cbmlmIChtb2R1bGUgJiYgbW9kdWxlLmV4cG9ydHMpIHtcbiAgbW9kdWxlLmV4cG9ydHMgPSBpbXBsO1xufSBlbHNlIGlmIChkZWZpbmUgJiYgZGVmaW5lLmFtZCkge1xuICBkZWZpbmUoZnVuY3Rpb24oKSB7IHJldHVybiBpbXBsOyB9KTtcbn0gZWxzZSB7XG4gIHRoaXMudHljaGVpID0gaW1wbDtcbn1cblxufSkoXG4gIHRoaXMsXG4gICh0eXBlb2YgbW9kdWxlKSA9PSAnb2JqZWN0JyAmJiBtb2R1bGUsICAgIC8vIHByZXNlbnQgaW4gbm9kZS5qc1xuICAodHlwZW9mIGRlZmluZSkgPT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUgICAvLyBwcmVzZW50IHdpdGggYW4gQU1EIGxvYWRlclxuKTtcblxuXG4iLCIvLyBBIEphdmFzY3JpcHQgaW1wbGVtZW50YWlvbiBvZiB0aGUgXCJ4b3IxMjhcIiBwcm5nIGFsZ29yaXRobSBieVxuLy8gR2VvcmdlIE1hcnNhZ2xpYS4gIFNlZSBodHRwOi8vd3d3LmpzdGF0c29mdC5vcmcvdjA4L2kxNC9wYXBlclxuXG4oZnVuY3Rpb24oZ2xvYmFsLCBtb2R1bGUsIGRlZmluZSkge1xuXG5mdW5jdGlvbiBYb3JHZW4oc2VlZCkge1xuICB2YXIgbWUgPSB0aGlzLCBzdHJzZWVkID0gJyc7XG5cbiAgbWUueCA9IDA7XG4gIG1lLnkgPSAwO1xuICBtZS56ID0gMDtcbiAgbWUudyA9IDA7XG5cbiAgLy8gU2V0IHVwIGdlbmVyYXRvciBmdW5jdGlvbi5cbiAgbWUubmV4dCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciB0ID0gbWUueCBeIChtZS54IDw8IDExKTtcbiAgICBtZS54ID0gbWUueTtcbiAgICBtZS55ID0gbWUuejtcbiAgICBtZS56ID0gbWUudztcbiAgICByZXR1cm4gbWUudyBePSAobWUudyA+Pj4gMTkpIF4gdCBeICh0ID4+PiA4KTtcbiAgfTtcblxuICBpZiAoc2VlZCA9PT0gKHNlZWQgfCAwKSkge1xuICAgIC8vIEludGVnZXIgc2VlZC5cbiAgICBtZS54ID0gc2VlZDtcbiAgfSBlbHNlIHtcbiAgICAvLyBTdHJpbmcgc2VlZC5cbiAgICBzdHJzZWVkICs9IHNlZWQ7XG4gIH1cblxuICAvLyBNaXggaW4gc3RyaW5nIHNlZWQsIHRoZW4gZGlzY2FyZCBhbiBpbml0aWFsIGJhdGNoIG9mIDY0IHZhbHVlcy5cbiAgZm9yICh2YXIgayA9IDA7IGsgPCBzdHJzZWVkLmxlbmd0aCArIDY0OyBrKyspIHtcbiAgICBtZS54IF49IHN0cnNlZWQuY2hhckNvZGVBdChrKSB8IDA7XG4gICAgbWUubmV4dCgpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGNvcHkoZiwgdCkge1xuICB0LnggPSBmLng7XG4gIHQueSA9IGYueTtcbiAgdC56ID0gZi56O1xuICB0LncgPSBmLnc7XG4gIHJldHVybiB0O1xufVxuXG5mdW5jdGlvbiBpbXBsKHNlZWQsIG9wdHMpIHtcbiAgdmFyIHhnID0gbmV3IFhvckdlbihzZWVkKSxcbiAgICAgIHN0YXRlID0gb3B0cyAmJiBvcHRzLnN0YXRlLFxuICAgICAgcHJuZyA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gKHhnLm5leHQoKSA+Pj4gMCkgLyAweDEwMDAwMDAwMDsgfTtcbiAgcHJuZy5kb3VibGUgPSBmdW5jdGlvbigpIHtcbiAgICBkbyB7XG4gICAgICB2YXIgdG9wID0geGcubmV4dCgpID4+PiAxMSxcbiAgICAgICAgICBib3QgPSAoeGcubmV4dCgpID4+PiAwKSAvIDB4MTAwMDAwMDAwLFxuICAgICAgICAgIHJlc3VsdCA9ICh0b3AgKyBib3QpIC8gKDEgPDwgMjEpO1xuICAgIH0gd2hpbGUgKHJlc3VsdCA9PT0gMCk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcbiAgcHJuZy5pbnQzMiA9IHhnLm5leHQ7XG4gIHBybmcucXVpY2sgPSBwcm5nO1xuICBpZiAoc3RhdGUpIHtcbiAgICBpZiAodHlwZW9mKHN0YXRlKSA9PSAnb2JqZWN0JykgY29weShzdGF0ZSwgeGcpO1xuICAgIHBybmcuc3RhdGUgPSBmdW5jdGlvbigpIHsgcmV0dXJuIGNvcHkoeGcsIHt9KTsgfVxuICB9XG4gIHJldHVybiBwcm5nO1xufVxuXG5pZiAobW9kdWxlICYmIG1vZHVsZS5leHBvcnRzKSB7XG4gIG1vZHVsZS5leHBvcnRzID0gaW1wbDtcbn0gZWxzZSBpZiAoZGVmaW5lICYmIGRlZmluZS5hbWQpIHtcbiAgZGVmaW5lKGZ1bmN0aW9uKCkgeyByZXR1cm4gaW1wbDsgfSk7XG59IGVsc2Uge1xuICB0aGlzLnhvcjEyOCA9IGltcGw7XG59XG5cbn0pKFxuICB0aGlzLFxuICAodHlwZW9mIG1vZHVsZSkgPT0gJ29iamVjdCcgJiYgbW9kdWxlLCAgICAvLyBwcmVzZW50IGluIG5vZGUuanNcbiAgKHR5cGVvZiBkZWZpbmUpID09ICdmdW5jdGlvbicgJiYgZGVmaW5lICAgLy8gcHJlc2VudCB3aXRoIGFuIEFNRCBsb2FkZXJcbik7XG5cblxuIiwiLy8gQSBKYXZhc2NyaXB0IGltcGxlbWVudGFpb24gb2YgUmljaGFyZCBCcmVudCdzIFhvcmdlbnMgeG9yNDA5NiBhbGdvcml0aG0uXG4vL1xuLy8gVGhpcyBmYXN0IG5vbi1jcnlwdG9ncmFwaGljIHJhbmRvbSBudW1iZXIgZ2VuZXJhdG9yIGlzIGRlc2lnbmVkIGZvclxuLy8gdXNlIGluIE1vbnRlLUNhcmxvIGFsZ29yaXRobXMuIEl0IGNvbWJpbmVzIGEgbG9uZy1wZXJpb2QgeG9yc2hpZnRcbi8vIGdlbmVyYXRvciB3aXRoIGEgV2V5bCBnZW5lcmF0b3IsIGFuZCBpdCBwYXNzZXMgYWxsIGNvbW1vbiBiYXR0ZXJpZXNcbi8vIG9mIHN0YXN0aWNpYWwgdGVzdHMgZm9yIHJhbmRvbW5lc3Mgd2hpbGUgY29uc3VtaW5nIG9ubHkgYSBmZXcgbmFub3NlY29uZHNcbi8vIGZvciBlYWNoIHBybmcgZ2VuZXJhdGVkLiAgRm9yIGJhY2tncm91bmQgb24gdGhlIGdlbmVyYXRvciwgc2VlIEJyZW50J3Ncbi8vIHBhcGVyOiBcIlNvbWUgbG9uZy1wZXJpb2QgcmFuZG9tIG51bWJlciBnZW5lcmF0b3JzIHVzaW5nIHNoaWZ0cyBhbmQgeG9ycy5cIlxuLy8gaHR0cDovL2FyeGl2Lm9yZy9wZGYvMTAwNC4zMTE1djEucGRmXG4vL1xuLy8gVXNhZ2U6XG4vL1xuLy8gdmFyIHhvcjQwOTYgPSByZXF1aXJlKCd4b3I0MDk2Jyk7XG4vLyByYW5kb20gPSB4b3I0MDk2KDEpOyAgICAgICAgICAgICAgICAgICAgICAgIC8vIFNlZWQgd2l0aCBpbnQzMiBvciBzdHJpbmcuXG4vLyBhc3NlcnQuZXF1YWwocmFuZG9tKCksIDAuMTUyMDQzNjQ1MDUzODU0Nyk7IC8vICgwLCAxKSByYW5nZSwgNTMgYml0cy5cbi8vIGFzc2VydC5lcXVhbChyYW5kb20uaW50MzIoKSwgMTgwNjUzNDg5Nyk7ICAgLy8gc2lnbmVkIGludDMyLCAzMiBiaXRzLlxuLy9cbi8vIEZvciBub256ZXJvIG51bWVyaWMga2V5cywgdGhpcyBpbXBlbGVtZW50YXRpb24gcHJvdmlkZXMgYSBzZXF1ZW5jZVxuLy8gaWRlbnRpY2FsIHRvIHRoYXQgYnkgQnJlbnQncyB4b3JnZW5zIDMgaW1wbGVtZW50YWlvbiBpbiBDLiAgVGhpc1xuLy8gaW1wbGVtZW50YXRpb24gYWxzbyBwcm92aWRlcyBmb3IgaW5pdGFsaXppbmcgdGhlIGdlbmVyYXRvciB3aXRoXG4vLyBzdHJpbmcgc2VlZHMsIG9yIGZvciBzYXZpbmcgYW5kIHJlc3RvcmluZyB0aGUgc3RhdGUgb2YgdGhlIGdlbmVyYXRvci5cbi8vXG4vLyBPbiBDaHJvbWUsIHRoaXMgcHJuZyBiZW5jaG1hcmtzIGFib3V0IDIuMSB0aW1lcyBzbG93ZXIgdGhhblxuLy8gSmF2YXNjcmlwdCdzIGJ1aWx0LWluIE1hdGgucmFuZG9tKCkuXG5cbihmdW5jdGlvbihnbG9iYWwsIG1vZHVsZSwgZGVmaW5lKSB7XG5cbmZ1bmN0aW9uIFhvckdlbihzZWVkKSB7XG4gIHZhciBtZSA9IHRoaXM7XG5cbiAgLy8gU2V0IHVwIGdlbmVyYXRvciBmdW5jdGlvbi5cbiAgbWUubmV4dCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciB3ID0gbWUudyxcbiAgICAgICAgWCA9IG1lLlgsIGkgPSBtZS5pLCB0LCB2O1xuICAgIC8vIFVwZGF0ZSBXZXlsIGdlbmVyYXRvci5cbiAgICBtZS53ID0gdyA9ICh3ICsgMHg2MWM4ODY0NykgfCAwO1xuICAgIC8vIFVwZGF0ZSB4b3IgZ2VuZXJhdG9yLlxuICAgIHYgPSBYWyhpICsgMzQpICYgMTI3XTtcbiAgICB0ID0gWFtpID0gKChpICsgMSkgJiAxMjcpXTtcbiAgICB2IF49IHYgPDwgMTM7XG4gICAgdCBePSB0IDw8IDE3O1xuICAgIHYgXj0gdiA+Pj4gMTU7XG4gICAgdCBePSB0ID4+PiAxMjtcbiAgICAvLyBVcGRhdGUgWG9yIGdlbmVyYXRvciBhcnJheSBzdGF0ZS5cbiAgICB2ID0gWFtpXSA9IHYgXiB0O1xuICAgIG1lLmkgPSBpO1xuICAgIC8vIFJlc3VsdCBpcyB0aGUgY29tYmluYXRpb24uXG4gICAgcmV0dXJuICh2ICsgKHcgXiAodyA+Pj4gMTYpKSkgfCAwO1xuICB9O1xuXG4gIGZ1bmN0aW9uIGluaXQobWUsIHNlZWQpIHtcbiAgICB2YXIgdCwgdiwgaSwgaiwgdywgWCA9IFtdLCBsaW1pdCA9IDEyODtcbiAgICBpZiAoc2VlZCA9PT0gKHNlZWQgfCAwKSkge1xuICAgICAgLy8gTnVtZXJpYyBzZWVkcyBpbml0aWFsaXplIHYsIHdoaWNoIGlzIHVzZWQgdG8gZ2VuZXJhdGVzIFguXG4gICAgICB2ID0gc2VlZDtcbiAgICAgIHNlZWQgPSBudWxsO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBTdHJpbmcgc2VlZHMgYXJlIG1peGVkIGludG8gdiBhbmQgWCBvbmUgY2hhcmFjdGVyIGF0IGEgdGltZS5cbiAgICAgIHNlZWQgPSBzZWVkICsgJ1xcMCc7XG4gICAgICB2ID0gMDtcbiAgICAgIGxpbWl0ID0gTWF0aC5tYXgobGltaXQsIHNlZWQubGVuZ3RoKTtcbiAgICB9XG4gICAgLy8gSW5pdGlhbGl6ZSBjaXJjdWxhciBhcnJheSBhbmQgd2V5bCB2YWx1ZS5cbiAgICBmb3IgKGkgPSAwLCBqID0gLTMyOyBqIDwgbGltaXQ7ICsraikge1xuICAgICAgLy8gUHV0IHRoZSB1bmljb2RlIGNoYXJhY3RlcnMgaW50byB0aGUgYXJyYXksIGFuZCBzaHVmZmxlIHRoZW0uXG4gICAgICBpZiAoc2VlZCkgdiBePSBzZWVkLmNoYXJDb2RlQXQoKGogKyAzMikgJSBzZWVkLmxlbmd0aCk7XG4gICAgICAvLyBBZnRlciAzMiBzaHVmZmxlcywgdGFrZSB2IGFzIHRoZSBzdGFydGluZyB3IHZhbHVlLlxuICAgICAgaWYgKGogPT09IDApIHcgPSB2O1xuICAgICAgdiBePSB2IDw8IDEwO1xuICAgICAgdiBePSB2ID4+PiAxNTtcbiAgICAgIHYgXj0gdiA8PCA0O1xuICAgICAgdiBePSB2ID4+PiAxMztcbiAgICAgIGlmIChqID49IDApIHtcbiAgICAgICAgdyA9ICh3ICsgMHg2MWM4ODY0NykgfCAwOyAgICAgLy8gV2V5bC5cbiAgICAgICAgdCA9IChYW2ogJiAxMjddIF49ICh2ICsgdykpOyAgLy8gQ29tYmluZSB4b3IgYW5kIHdleWwgdG8gaW5pdCBhcnJheS5cbiAgICAgICAgaSA9ICgwID09IHQpID8gaSArIDEgOiAwOyAgICAgLy8gQ291bnQgemVyb2VzLlxuICAgICAgfVxuICAgIH1cbiAgICAvLyBXZSBoYXZlIGRldGVjdGVkIGFsbCB6ZXJvZXM7IG1ha2UgdGhlIGtleSBub256ZXJvLlxuICAgIGlmIChpID49IDEyOCkge1xuICAgICAgWFsoc2VlZCAmJiBzZWVkLmxlbmd0aCB8fCAwKSAmIDEyN10gPSAtMTtcbiAgICB9XG4gICAgLy8gUnVuIHRoZSBnZW5lcmF0b3IgNTEyIHRpbWVzIHRvIGZ1cnRoZXIgbWl4IHRoZSBzdGF0ZSBiZWZvcmUgdXNpbmcgaXQuXG4gICAgLy8gRmFjdG9yaW5nIHRoaXMgYXMgYSBmdW5jdGlvbiBzbG93cyB0aGUgbWFpbiBnZW5lcmF0b3IsIHNvIGl0IGlzIGp1c3RcbiAgICAvLyB1bnJvbGxlZCBoZXJlLiAgVGhlIHdleWwgZ2VuZXJhdG9yIGlzIG5vdCBhZHZhbmNlZCB3aGlsZSB3YXJtaW5nIHVwLlxuICAgIGkgPSAxMjc7XG4gICAgZm9yIChqID0gNCAqIDEyODsgaiA+IDA7IC0taikge1xuICAgICAgdiA9IFhbKGkgKyAzNCkgJiAxMjddO1xuICAgICAgdCA9IFhbaSA9ICgoaSArIDEpICYgMTI3KV07XG4gICAgICB2IF49IHYgPDwgMTM7XG4gICAgICB0IF49IHQgPDwgMTc7XG4gICAgICB2IF49IHYgPj4+IDE1O1xuICAgICAgdCBePSB0ID4+PiAxMjtcbiAgICAgIFhbaV0gPSB2IF4gdDtcbiAgICB9XG4gICAgLy8gU3RvcmluZyBzdGF0ZSBhcyBvYmplY3QgbWVtYmVycyBpcyBmYXN0ZXIgdGhhbiB1c2luZyBjbG9zdXJlIHZhcmlhYmxlcy5cbiAgICBtZS53ID0gdztcbiAgICBtZS5YID0gWDtcbiAgICBtZS5pID0gaTtcbiAgfVxuXG4gIGluaXQobWUsIHNlZWQpO1xufVxuXG5mdW5jdGlvbiBjb3B5KGYsIHQpIHtcbiAgdC5pID0gZi5pO1xuICB0LncgPSBmLnc7XG4gIHQuWCA9IGYuWC5zbGljZSgpO1xuICByZXR1cm4gdDtcbn07XG5cbmZ1bmN0aW9uIGltcGwoc2VlZCwgb3B0cykge1xuICBpZiAoc2VlZCA9PSBudWxsKSBzZWVkID0gKyhuZXcgRGF0ZSk7XG4gIHZhciB4ZyA9IG5ldyBYb3JHZW4oc2VlZCksXG4gICAgICBzdGF0ZSA9IG9wdHMgJiYgb3B0cy5zdGF0ZSxcbiAgICAgIHBybmcgPSBmdW5jdGlvbigpIHsgcmV0dXJuICh4Zy5uZXh0KCkgPj4+IDApIC8gMHgxMDAwMDAwMDA7IH07XG4gIHBybmcuZG91YmxlID0gZnVuY3Rpb24oKSB7XG4gICAgZG8ge1xuICAgICAgdmFyIHRvcCA9IHhnLm5leHQoKSA+Pj4gMTEsXG4gICAgICAgICAgYm90ID0gKHhnLm5leHQoKSA+Pj4gMCkgLyAweDEwMDAwMDAwMCxcbiAgICAgICAgICByZXN1bHQgPSAodG9wICsgYm90KSAvICgxIDw8IDIxKTtcbiAgICB9IHdoaWxlIChyZXN1bHQgPT09IDApO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG4gIHBybmcuaW50MzIgPSB4Zy5uZXh0O1xuICBwcm5nLnF1aWNrID0gcHJuZztcbiAgaWYgKHN0YXRlKSB7XG4gICAgaWYgKHN0YXRlLlgpIGNvcHkoc3RhdGUsIHhnKTtcbiAgICBwcm5nLnN0YXRlID0gZnVuY3Rpb24oKSB7IHJldHVybiBjb3B5KHhnLCB7fSk7IH1cbiAgfVxuICByZXR1cm4gcHJuZztcbn1cblxuaWYgKG1vZHVsZSAmJiBtb2R1bGUuZXhwb3J0cykge1xuICBtb2R1bGUuZXhwb3J0cyA9IGltcGw7XG59IGVsc2UgaWYgKGRlZmluZSAmJiBkZWZpbmUuYW1kKSB7XG4gIGRlZmluZShmdW5jdGlvbigpIHsgcmV0dXJuIGltcGw7IH0pO1xufSBlbHNlIHtcbiAgdGhpcy54b3I0MDk2ID0gaW1wbDtcbn1cblxufSkoXG4gIHRoaXMsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHdpbmRvdyBvYmplY3Qgb3IgZ2xvYmFsXG4gICh0eXBlb2YgbW9kdWxlKSA9PSAnb2JqZWN0JyAmJiBtb2R1bGUsICAgIC8vIHByZXNlbnQgaW4gbm9kZS5qc1xuICAodHlwZW9mIGRlZmluZSkgPT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUgICAvLyBwcmVzZW50IHdpdGggYW4gQU1EIGxvYWRlclxuKTtcbiIsIi8vIEEgSmF2YXNjcmlwdCBpbXBsZW1lbnRhaW9uIG9mIHRoZSBcInhvcnNoaWZ0N1wiIGFsZ29yaXRobSBieVxuLy8gRnJhbsOnb2lzIFBhbm5ldG9uIGFuZCBQaWVycmUgTCdlY3V5ZXI6XG4vLyBcIk9uIHRoZSBYb3Jnc2hpZnQgUmFuZG9tIE51bWJlciBHZW5lcmF0b3JzXCJcbi8vIGh0dHA6Ly9zYWx1Yy5lbmdyLnVjb25uLmVkdS9yZWZzL2NyeXB0by9ybmcvcGFubmV0b24wNW9udGhleG9yc2hpZnQucGRmXG5cbihmdW5jdGlvbihnbG9iYWwsIG1vZHVsZSwgZGVmaW5lKSB7XG5cbmZ1bmN0aW9uIFhvckdlbihzZWVkKSB7XG4gIHZhciBtZSA9IHRoaXM7XG5cbiAgLy8gU2V0IHVwIGdlbmVyYXRvciBmdW5jdGlvbi5cbiAgbWUubmV4dCA9IGZ1bmN0aW9uKCkge1xuICAgIC8vIFVwZGF0ZSB4b3IgZ2VuZXJhdG9yLlxuICAgIHZhciBYID0gbWUueCwgaSA9IG1lLmksIHQsIHYsIHc7XG4gICAgdCA9IFhbaV07IHQgXj0gKHQgPj4+IDcpOyB2ID0gdCBeICh0IDw8IDI0KTtcbiAgICB0ID0gWFsoaSArIDEpICYgN107IHYgXj0gdCBeICh0ID4+PiAxMCk7XG4gICAgdCA9IFhbKGkgKyAzKSAmIDddOyB2IF49IHQgXiAodCA+Pj4gMyk7XG4gICAgdCA9IFhbKGkgKyA0KSAmIDddOyB2IF49IHQgXiAodCA8PCA3KTtcbiAgICB0ID0gWFsoaSArIDcpICYgN107IHQgPSB0IF4gKHQgPDwgMTMpOyB2IF49IHQgXiAodCA8PCA5KTtcbiAgICBYW2ldID0gdjtcbiAgICBtZS5pID0gKGkgKyAxKSAmIDc7XG4gICAgcmV0dXJuIHY7XG4gIH07XG5cbiAgZnVuY3Rpb24gaW5pdChtZSwgc2VlZCkge1xuICAgIHZhciBqLCB3LCBYID0gW107XG5cbiAgICBpZiAoc2VlZCA9PT0gKHNlZWQgfCAwKSkge1xuICAgICAgLy8gU2VlZCBzdGF0ZSBhcnJheSB1c2luZyBhIDMyLWJpdCBpbnRlZ2VyLlxuICAgICAgdyA9IFhbMF0gPSBzZWVkO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBTZWVkIHN0YXRlIHVzaW5nIGEgc3RyaW5nLlxuICAgICAgc2VlZCA9ICcnICsgc2VlZDtcbiAgICAgIGZvciAoaiA9IDA7IGogPCBzZWVkLmxlbmd0aDsgKytqKSB7XG4gICAgICAgIFhbaiAmIDddID0gKFhbaiAmIDddIDw8IDE1KSBeXG4gICAgICAgICAgICAoc2VlZC5jaGFyQ29kZUF0KGopICsgWFsoaiArIDEpICYgN10gPDwgMTMpO1xuICAgICAgfVxuICAgIH1cbiAgICAvLyBFbmZvcmNlIGFuIGFycmF5IGxlbmd0aCBvZiA4LCBub3QgYWxsIHplcm9lcy5cbiAgICB3aGlsZSAoWC5sZW5ndGggPCA4KSBYLnB1c2goMCk7XG4gICAgZm9yIChqID0gMDsgaiA8IDggJiYgWFtqXSA9PT0gMDsgKytqKTtcbiAgICBpZiAoaiA9PSA4KSB3ID0gWFs3XSA9IC0xOyBlbHNlIHcgPSBYW2pdO1xuXG4gICAgbWUueCA9IFg7XG4gICAgbWUuaSA9IDA7XG5cbiAgICAvLyBEaXNjYXJkIGFuIGluaXRpYWwgMjU2IHZhbHVlcy5cbiAgICBmb3IgKGogPSAyNTY7IGogPiAwOyAtLWopIHtcbiAgICAgIG1lLm5leHQoKTtcbiAgICB9XG4gIH1cblxuICBpbml0KG1lLCBzZWVkKTtcbn1cblxuZnVuY3Rpb24gY29weShmLCB0KSB7XG4gIHQueCA9IGYueC5zbGljZSgpO1xuICB0LmkgPSBmLmk7XG4gIHJldHVybiB0O1xufVxuXG5mdW5jdGlvbiBpbXBsKHNlZWQsIG9wdHMpIHtcbiAgaWYgKHNlZWQgPT0gbnVsbCkgc2VlZCA9ICsobmV3IERhdGUpO1xuICB2YXIgeGcgPSBuZXcgWG9yR2VuKHNlZWQpLFxuICAgICAgc3RhdGUgPSBvcHRzICYmIG9wdHMuc3RhdGUsXG4gICAgICBwcm5nID0gZnVuY3Rpb24oKSB7IHJldHVybiAoeGcubmV4dCgpID4+PiAwKSAvIDB4MTAwMDAwMDAwOyB9O1xuICBwcm5nLmRvdWJsZSA9IGZ1bmN0aW9uKCkge1xuICAgIGRvIHtcbiAgICAgIHZhciB0b3AgPSB4Zy5uZXh0KCkgPj4+IDExLFxuICAgICAgICAgIGJvdCA9ICh4Zy5uZXh0KCkgPj4+IDApIC8gMHgxMDAwMDAwMDAsXG4gICAgICAgICAgcmVzdWx0ID0gKHRvcCArIGJvdCkgLyAoMSA8PCAyMSk7XG4gICAgfSB3aGlsZSAocmVzdWx0ID09PSAwKTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuICBwcm5nLmludDMyID0geGcubmV4dDtcbiAgcHJuZy5xdWljayA9IHBybmc7XG4gIGlmIChzdGF0ZSkge1xuICAgIGlmIChzdGF0ZS54KSBjb3B5KHN0YXRlLCB4Zyk7XG4gICAgcHJuZy5zdGF0ZSA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gY29weSh4Zywge30pOyB9XG4gIH1cbiAgcmV0dXJuIHBybmc7XG59XG5cbmlmIChtb2R1bGUgJiYgbW9kdWxlLmV4cG9ydHMpIHtcbiAgbW9kdWxlLmV4cG9ydHMgPSBpbXBsO1xufSBlbHNlIGlmIChkZWZpbmUgJiYgZGVmaW5lLmFtZCkge1xuICBkZWZpbmUoZnVuY3Rpb24oKSB7IHJldHVybiBpbXBsOyB9KTtcbn0gZWxzZSB7XG4gIHRoaXMueG9yc2hpZnQ3ID0gaW1wbDtcbn1cblxufSkoXG4gIHRoaXMsXG4gICh0eXBlb2YgbW9kdWxlKSA9PSAnb2JqZWN0JyAmJiBtb2R1bGUsICAgIC8vIHByZXNlbnQgaW4gbm9kZS5qc1xuICAodHlwZW9mIGRlZmluZSkgPT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUgICAvLyBwcmVzZW50IHdpdGggYW4gQU1EIGxvYWRlclxuKTtcblxuIiwiLy8gQSBKYXZhc2NyaXB0IGltcGxlbWVudGFpb24gb2YgdGhlIFwieG9yd293XCIgcHJuZyBhbGdvcml0aG0gYnlcbi8vIEdlb3JnZSBNYXJzYWdsaWEuICBTZWUgaHR0cDovL3d3dy5qc3RhdHNvZnQub3JnL3YwOC9pMTQvcGFwZXJcblxuKGZ1bmN0aW9uKGdsb2JhbCwgbW9kdWxlLCBkZWZpbmUpIHtcblxuZnVuY3Rpb24gWG9yR2VuKHNlZWQpIHtcbiAgdmFyIG1lID0gdGhpcywgc3Ryc2VlZCA9ICcnO1xuXG4gIC8vIFNldCB1cCBnZW5lcmF0b3IgZnVuY3Rpb24uXG4gIG1lLm5leHQgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgdCA9IChtZS54IF4gKG1lLnggPj4+IDIpKTtcbiAgICBtZS54ID0gbWUueTsgbWUueSA9IG1lLno7IG1lLnogPSBtZS53OyBtZS53ID0gbWUudjtcbiAgICByZXR1cm4gKG1lLmQgPSAobWUuZCArIDM2MjQzNyB8IDApKSArXG4gICAgICAgKG1lLnYgPSAobWUudiBeIChtZS52IDw8IDQpKSBeICh0IF4gKHQgPDwgMSkpKSB8IDA7XG4gIH07XG5cbiAgbWUueCA9IDA7XG4gIG1lLnkgPSAwO1xuICBtZS56ID0gMDtcbiAgbWUudyA9IDA7XG4gIG1lLnYgPSAwO1xuXG4gIGlmIChzZWVkID09PSAoc2VlZCB8IDApKSB7XG4gICAgLy8gSW50ZWdlciBzZWVkLlxuICAgIG1lLnggPSBzZWVkO1xuICB9IGVsc2Uge1xuICAgIC8vIFN0cmluZyBzZWVkLlxuICAgIHN0cnNlZWQgKz0gc2VlZDtcbiAgfVxuXG4gIC8vIE1peCBpbiBzdHJpbmcgc2VlZCwgdGhlbiBkaXNjYXJkIGFuIGluaXRpYWwgYmF0Y2ggb2YgNjQgdmFsdWVzLlxuICBmb3IgKHZhciBrID0gMDsgayA8IHN0cnNlZWQubGVuZ3RoICsgNjQ7IGsrKykge1xuICAgIG1lLnggXj0gc3Ryc2VlZC5jaGFyQ29kZUF0KGspIHwgMDtcbiAgICBpZiAoayA9PSBzdHJzZWVkLmxlbmd0aCkge1xuICAgICAgbWUuZCA9IG1lLnggPDwgMTAgXiBtZS54ID4+PiA0O1xuICAgIH1cbiAgICBtZS5uZXh0KCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gY29weShmLCB0KSB7XG4gIHQueCA9IGYueDtcbiAgdC55ID0gZi55O1xuICB0LnogPSBmLno7XG4gIHQudyA9IGYudztcbiAgdC52ID0gZi52O1xuICB0LmQgPSBmLmQ7XG4gIHJldHVybiB0O1xufVxuXG5mdW5jdGlvbiBpbXBsKHNlZWQsIG9wdHMpIHtcbiAgdmFyIHhnID0gbmV3IFhvckdlbihzZWVkKSxcbiAgICAgIHN0YXRlID0gb3B0cyAmJiBvcHRzLnN0YXRlLFxuICAgICAgcHJuZyA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gKHhnLm5leHQoKSA+Pj4gMCkgLyAweDEwMDAwMDAwMDsgfTtcbiAgcHJuZy5kb3VibGUgPSBmdW5jdGlvbigpIHtcbiAgICBkbyB7XG4gICAgICB2YXIgdG9wID0geGcubmV4dCgpID4+PiAxMSxcbiAgICAgICAgICBib3QgPSAoeGcubmV4dCgpID4+PiAwKSAvIDB4MTAwMDAwMDAwLFxuICAgICAgICAgIHJlc3VsdCA9ICh0b3AgKyBib3QpIC8gKDEgPDwgMjEpO1xuICAgIH0gd2hpbGUgKHJlc3VsdCA9PT0gMCk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcbiAgcHJuZy5pbnQzMiA9IHhnLm5leHQ7XG4gIHBybmcucXVpY2sgPSBwcm5nO1xuICBpZiAoc3RhdGUpIHtcbiAgICBpZiAodHlwZW9mKHN0YXRlKSA9PSAnb2JqZWN0JykgY29weShzdGF0ZSwgeGcpO1xuICAgIHBybmcuc3RhdGUgPSBmdW5jdGlvbigpIHsgcmV0dXJuIGNvcHkoeGcsIHt9KTsgfVxuICB9XG4gIHJldHVybiBwcm5nO1xufVxuXG5pZiAobW9kdWxlICYmIG1vZHVsZS5leHBvcnRzKSB7XG4gIG1vZHVsZS5leHBvcnRzID0gaW1wbDtcbn0gZWxzZSBpZiAoZGVmaW5lICYmIGRlZmluZS5hbWQpIHtcbiAgZGVmaW5lKGZ1bmN0aW9uKCkgeyByZXR1cm4gaW1wbDsgfSk7XG59IGVsc2Uge1xuICB0aGlzLnhvcndvdyA9IGltcGw7XG59XG5cbn0pKFxuICB0aGlzLFxuICAodHlwZW9mIG1vZHVsZSkgPT0gJ29iamVjdCcgJiYgbW9kdWxlLCAgICAvLyBwcmVzZW50IGluIG5vZGUuanNcbiAgKHR5cGVvZiBkZWZpbmUpID09ICdmdW5jdGlvbicgJiYgZGVmaW5lICAgLy8gcHJlc2VudCB3aXRoIGFuIEFNRCBsb2FkZXJcbik7XG5cblxuIiwiLypcbkNvcHlyaWdodCAyMDE5IERhdmlkIEJhdS5cblxuUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nXG5hIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcblwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xud2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvXG5wZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG9cbnRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcblxuVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmVcbmluY2x1ZGVkIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuXG5USEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELFxuRVhQUkVTUyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG5NRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuXG5JTiBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWVxuQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCxcblRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFXG5TT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxuKi9cblxuKGZ1bmN0aW9uIChnbG9iYWwsIHBvb2wsIG1hdGgpIHtcbi8vXG4vLyBUaGUgZm9sbG93aW5nIGNvbnN0YW50cyBhcmUgcmVsYXRlZCB0byBJRUVFIDc1NCBsaW1pdHMuXG4vL1xuXG52YXIgd2lkdGggPSAyNTYsICAgICAgICAvLyBlYWNoIFJDNCBvdXRwdXQgaXMgMCA8PSB4IDwgMjU2XG4gICAgY2h1bmtzID0gNiwgICAgICAgICAvLyBhdCBsZWFzdCBzaXggUkM0IG91dHB1dHMgZm9yIGVhY2ggZG91YmxlXG4gICAgZGlnaXRzID0gNTIsICAgICAgICAvLyB0aGVyZSBhcmUgNTIgc2lnbmlmaWNhbnQgZGlnaXRzIGluIGEgZG91YmxlXG4gICAgcm5nbmFtZSA9ICdyYW5kb20nLCAvLyBybmduYW1lOiBuYW1lIGZvciBNYXRoLnJhbmRvbSBhbmQgTWF0aC5zZWVkcmFuZG9tXG4gICAgc3RhcnRkZW5vbSA9IG1hdGgucG93KHdpZHRoLCBjaHVua3MpLFxuICAgIHNpZ25pZmljYW5jZSA9IG1hdGgucG93KDIsIGRpZ2l0cyksXG4gICAgb3ZlcmZsb3cgPSBzaWduaWZpY2FuY2UgKiAyLFxuICAgIG1hc2sgPSB3aWR0aCAtIDEsXG4gICAgbm9kZWNyeXB0bzsgICAgICAgICAvLyBub2RlLmpzIGNyeXB0byBtb2R1bGUsIGluaXRpYWxpemVkIGF0IHRoZSBib3R0b20uXG5cbi8vXG4vLyBzZWVkcmFuZG9tKClcbi8vIFRoaXMgaXMgdGhlIHNlZWRyYW5kb20gZnVuY3Rpb24gZGVzY3JpYmVkIGFib3ZlLlxuLy9cbmZ1bmN0aW9uIHNlZWRyYW5kb20oc2VlZCwgb3B0aW9ucywgY2FsbGJhY2spIHtcbiAgdmFyIGtleSA9IFtdO1xuICBvcHRpb25zID0gKG9wdGlvbnMgPT0gdHJ1ZSkgPyB7IGVudHJvcHk6IHRydWUgfSA6IChvcHRpb25zIHx8IHt9KTtcblxuICAvLyBGbGF0dGVuIHRoZSBzZWVkIHN0cmluZyBvciBidWlsZCBvbmUgZnJvbSBsb2NhbCBlbnRyb3B5IGlmIG5lZWRlZC5cbiAgdmFyIHNob3J0c2VlZCA9IG1peGtleShmbGF0dGVuKFxuICAgIG9wdGlvbnMuZW50cm9weSA/IFtzZWVkLCB0b3N0cmluZyhwb29sKV0gOlxuICAgIChzZWVkID09IG51bGwpID8gYXV0b3NlZWQoKSA6IHNlZWQsIDMpLCBrZXkpO1xuXG4gIC8vIFVzZSB0aGUgc2VlZCB0byBpbml0aWFsaXplIGFuIEFSQzQgZ2VuZXJhdG9yLlxuICB2YXIgYXJjNCA9IG5ldyBBUkM0KGtleSk7XG5cbiAgLy8gVGhpcyBmdW5jdGlvbiByZXR1cm5zIGEgcmFuZG9tIGRvdWJsZSBpbiBbMCwgMSkgdGhhdCBjb250YWluc1xuICAvLyByYW5kb21uZXNzIGluIGV2ZXJ5IGJpdCBvZiB0aGUgbWFudGlzc2Egb2YgdGhlIElFRUUgNzU0IHZhbHVlLlxuICB2YXIgcHJuZyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBuID0gYXJjNC5nKGNodW5rcyksICAgICAgICAgICAgIC8vIFN0YXJ0IHdpdGggYSBudW1lcmF0b3IgbiA8IDIgXiA0OFxuICAgICAgICBkID0gc3RhcnRkZW5vbSwgICAgICAgICAgICAgICAgIC8vICAgYW5kIGRlbm9taW5hdG9yIGQgPSAyIF4gNDguXG4gICAgICAgIHggPSAwOyAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICBhbmQgbm8gJ2V4dHJhIGxhc3QgYnl0ZScuXG4gICAgd2hpbGUgKG4gPCBzaWduaWZpY2FuY2UpIHsgICAgICAgICAgLy8gRmlsbCB1cCBhbGwgc2lnbmlmaWNhbnQgZGlnaXRzIGJ5XG4gICAgICBuID0gKG4gKyB4KSAqIHdpZHRoOyAgICAgICAgICAgICAgLy8gICBzaGlmdGluZyBudW1lcmF0b3IgYW5kXG4gICAgICBkICo9IHdpZHRoOyAgICAgICAgICAgICAgICAgICAgICAgLy8gICBkZW5vbWluYXRvciBhbmQgZ2VuZXJhdGluZyBhXG4gICAgICB4ID0gYXJjNC5nKDEpOyAgICAgICAgICAgICAgICAgICAgLy8gICBuZXcgbGVhc3Qtc2lnbmlmaWNhbnQtYnl0ZS5cbiAgICB9XG4gICAgd2hpbGUgKG4gPj0gb3ZlcmZsb3cpIHsgICAgICAgICAgICAgLy8gVG8gYXZvaWQgcm91bmRpbmcgdXAsIGJlZm9yZSBhZGRpbmdcbiAgICAgIG4gLz0gMjsgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgIGxhc3QgYnl0ZSwgc2hpZnQgZXZlcnl0aGluZ1xuICAgICAgZCAvPSAyOyAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgcmlnaHQgdXNpbmcgaW50ZWdlciBtYXRoIHVudGlsXG4gICAgICB4ID4+Pj0gMTsgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICB3ZSBoYXZlIGV4YWN0bHkgdGhlIGRlc2lyZWQgYml0cy5cbiAgICB9XG4gICAgcmV0dXJuIChuICsgeCkgLyBkOyAgICAgICAgICAgICAgICAgLy8gRm9ybSB0aGUgbnVtYmVyIHdpdGhpbiBbMCwgMSkuXG4gIH07XG5cbiAgcHJuZy5pbnQzMiA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gYXJjNC5nKDQpIHwgMDsgfVxuICBwcm5nLnF1aWNrID0gZnVuY3Rpb24oKSB7IHJldHVybiBhcmM0LmcoNCkgLyAweDEwMDAwMDAwMDsgfVxuICBwcm5nLmRvdWJsZSA9IHBybmc7XG5cbiAgLy8gTWl4IHRoZSByYW5kb21uZXNzIGludG8gYWNjdW11bGF0ZWQgZW50cm9weS5cbiAgbWl4a2V5KHRvc3RyaW5nKGFyYzQuUyksIHBvb2wpO1xuXG4gIC8vIENhbGxpbmcgY29udmVudGlvbjogd2hhdCB0byByZXR1cm4gYXMgYSBmdW5jdGlvbiBvZiBwcm5nLCBzZWVkLCBpc19tYXRoLlxuICByZXR1cm4gKG9wdGlvbnMucGFzcyB8fCBjYWxsYmFjayB8fFxuICAgICAgZnVuY3Rpb24ocHJuZywgc2VlZCwgaXNfbWF0aF9jYWxsLCBzdGF0ZSkge1xuICAgICAgICBpZiAoc3RhdGUpIHtcbiAgICAgICAgICAvLyBMb2FkIHRoZSBhcmM0IHN0YXRlIGZyb20gdGhlIGdpdmVuIHN0YXRlIGlmIGl0IGhhcyBhbiBTIGFycmF5LlxuICAgICAgICAgIGlmIChzdGF0ZS5TKSB7IGNvcHkoc3RhdGUsIGFyYzQpOyB9XG4gICAgICAgICAgLy8gT25seSBwcm92aWRlIHRoZSAuc3RhdGUgbWV0aG9kIGlmIHJlcXVlc3RlZCB2aWEgb3B0aW9ucy5zdGF0ZS5cbiAgICAgICAgICBwcm5nLnN0YXRlID0gZnVuY3Rpb24oKSB7IHJldHVybiBjb3B5KGFyYzQsIHt9KTsgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gSWYgY2FsbGVkIGFzIGEgbWV0aG9kIG9mIE1hdGggKE1hdGguc2VlZHJhbmRvbSgpKSwgbXV0YXRlXG4gICAgICAgIC8vIE1hdGgucmFuZG9tIGJlY2F1c2UgdGhhdCBpcyBob3cgc2VlZHJhbmRvbS5qcyBoYXMgd29ya2VkIHNpbmNlIHYxLjAuXG4gICAgICAgIGlmIChpc19tYXRoX2NhbGwpIHsgbWF0aFtybmduYW1lXSA9IHBybmc7IHJldHVybiBzZWVkOyB9XG5cbiAgICAgICAgLy8gT3RoZXJ3aXNlLCBpdCBpcyBhIG5ld2VyIGNhbGxpbmcgY29udmVudGlvbiwgc28gcmV0dXJuIHRoZVxuICAgICAgICAvLyBwcm5nIGRpcmVjdGx5LlxuICAgICAgICBlbHNlIHJldHVybiBwcm5nO1xuICAgICAgfSkoXG4gIHBybmcsXG4gIHNob3J0c2VlZCxcbiAgJ2dsb2JhbCcgaW4gb3B0aW9ucyA/IG9wdGlvbnMuZ2xvYmFsIDogKHRoaXMgPT0gbWF0aCksXG4gIG9wdGlvbnMuc3RhdGUpO1xufVxuXG4vL1xuLy8gQVJDNFxuLy9cbi8vIEFuIEFSQzQgaW1wbGVtZW50YXRpb24uICBUaGUgY29uc3RydWN0b3IgdGFrZXMgYSBrZXkgaW4gdGhlIGZvcm0gb2Zcbi8vIGFuIGFycmF5IG9mIGF0IG1vc3QgKHdpZHRoKSBpbnRlZ2VycyB0aGF0IHNob3VsZCBiZSAwIDw9IHggPCAod2lkdGgpLlxuLy9cbi8vIFRoZSBnKGNvdW50KSBtZXRob2QgcmV0dXJucyBhIHBzZXVkb3JhbmRvbSBpbnRlZ2VyIHRoYXQgY29uY2F0ZW5hdGVzXG4vLyB0aGUgbmV4dCAoY291bnQpIG91dHB1dHMgZnJvbSBBUkM0LiAgSXRzIHJldHVybiB2YWx1ZSBpcyBhIG51bWJlciB4XG4vLyB0aGF0IGlzIGluIHRoZSByYW5nZSAwIDw9IHggPCAod2lkdGggXiBjb3VudCkuXG4vL1xuZnVuY3Rpb24gQVJDNChrZXkpIHtcbiAgdmFyIHQsIGtleWxlbiA9IGtleS5sZW5ndGgsXG4gICAgICBtZSA9IHRoaXMsIGkgPSAwLCBqID0gbWUuaSA9IG1lLmogPSAwLCBzID0gbWUuUyA9IFtdO1xuXG4gIC8vIFRoZSBlbXB0eSBrZXkgW10gaXMgdHJlYXRlZCBhcyBbMF0uXG4gIGlmICgha2V5bGVuKSB7IGtleSA9IFtrZXlsZW4rK107IH1cblxuICAvLyBTZXQgdXAgUyB1c2luZyB0aGUgc3RhbmRhcmQga2V5IHNjaGVkdWxpbmcgYWxnb3JpdGhtLlxuICB3aGlsZSAoaSA8IHdpZHRoKSB7XG4gICAgc1tpXSA9IGkrKztcbiAgfVxuICBmb3IgKGkgPSAwOyBpIDwgd2lkdGg7IGkrKykge1xuICAgIHNbaV0gPSBzW2ogPSBtYXNrICYgKGogKyBrZXlbaSAlIGtleWxlbl0gKyAodCA9IHNbaV0pKV07XG4gICAgc1tqXSA9IHQ7XG4gIH1cblxuICAvLyBUaGUgXCJnXCIgbWV0aG9kIHJldHVybnMgdGhlIG5leHQgKGNvdW50KSBvdXRwdXRzIGFzIG9uZSBudW1iZXIuXG4gIChtZS5nID0gZnVuY3Rpb24oY291bnQpIHtcbiAgICAvLyBVc2luZyBpbnN0YW5jZSBtZW1iZXJzIGluc3RlYWQgb2YgY2xvc3VyZSBzdGF0ZSBuZWFybHkgZG91YmxlcyBzcGVlZC5cbiAgICB2YXIgdCwgciA9IDAsXG4gICAgICAgIGkgPSBtZS5pLCBqID0gbWUuaiwgcyA9IG1lLlM7XG4gICAgd2hpbGUgKGNvdW50LS0pIHtcbiAgICAgIHQgPSBzW2kgPSBtYXNrICYgKGkgKyAxKV07XG4gICAgICByID0gciAqIHdpZHRoICsgc1ttYXNrICYgKChzW2ldID0gc1tqID0gbWFzayAmIChqICsgdCldKSArIChzW2pdID0gdCkpXTtcbiAgICB9XG4gICAgbWUuaSA9IGk7IG1lLmogPSBqO1xuICAgIHJldHVybiByO1xuICAgIC8vIEZvciByb2J1c3QgdW5wcmVkaWN0YWJpbGl0eSwgdGhlIGZ1bmN0aW9uIGNhbGwgYmVsb3cgYXV0b21hdGljYWxseVxuICAgIC8vIGRpc2NhcmRzIGFuIGluaXRpYWwgYmF0Y2ggb2YgdmFsdWVzLiAgVGhpcyBpcyBjYWxsZWQgUkM0LWRyb3BbMjU2XS5cbiAgICAvLyBTZWUgaHR0cDovL2dvb2dsZS5jb20vc2VhcmNoP3E9cnNhK2ZsdWhyZXIrcmVzcG9uc2UmYnRuSVxuICB9KSh3aWR0aCk7XG59XG5cbi8vXG4vLyBjb3B5KClcbi8vIENvcGllcyBpbnRlcm5hbCBzdGF0ZSBvZiBBUkM0IHRvIG9yIGZyb20gYSBwbGFpbiBvYmplY3QuXG4vL1xuZnVuY3Rpb24gY29weShmLCB0KSB7XG4gIHQuaSA9IGYuaTtcbiAgdC5qID0gZi5qO1xuICB0LlMgPSBmLlMuc2xpY2UoKTtcbiAgcmV0dXJuIHQ7XG59O1xuXG4vL1xuLy8gZmxhdHRlbigpXG4vLyBDb252ZXJ0cyBhbiBvYmplY3QgdHJlZSB0byBuZXN0ZWQgYXJyYXlzIG9mIHN0cmluZ3MuXG4vL1xuZnVuY3Rpb24gZmxhdHRlbihvYmosIGRlcHRoKSB7XG4gIHZhciByZXN1bHQgPSBbXSwgdHlwID0gKHR5cGVvZiBvYmopLCBwcm9wO1xuICBpZiAoZGVwdGggJiYgdHlwID09ICdvYmplY3QnKSB7XG4gICAgZm9yIChwcm9wIGluIG9iaikge1xuICAgICAgdHJ5IHsgcmVzdWx0LnB1c2goZmxhdHRlbihvYmpbcHJvcF0sIGRlcHRoIC0gMSkpOyB9IGNhdGNoIChlKSB7fVxuICAgIH1cbiAgfVxuICByZXR1cm4gKHJlc3VsdC5sZW5ndGggPyByZXN1bHQgOiB0eXAgPT0gJ3N0cmluZycgPyBvYmogOiBvYmogKyAnXFwwJyk7XG59XG5cbi8vXG4vLyBtaXhrZXkoKVxuLy8gTWl4ZXMgYSBzdHJpbmcgc2VlZCBpbnRvIGEga2V5IHRoYXQgaXMgYW4gYXJyYXkgb2YgaW50ZWdlcnMsIGFuZFxuLy8gcmV0dXJucyBhIHNob3J0ZW5lZCBzdHJpbmcgc2VlZCB0aGF0IGlzIGVxdWl2YWxlbnQgdG8gdGhlIHJlc3VsdCBrZXkuXG4vL1xuZnVuY3Rpb24gbWl4a2V5KHNlZWQsIGtleSkge1xuICB2YXIgc3RyaW5nc2VlZCA9IHNlZWQgKyAnJywgc21lYXIsIGogPSAwO1xuICB3aGlsZSAoaiA8IHN0cmluZ3NlZWQubGVuZ3RoKSB7XG4gICAga2V5W21hc2sgJiBqXSA9XG4gICAgICBtYXNrICYgKChzbWVhciBePSBrZXlbbWFzayAmIGpdICogMTkpICsgc3RyaW5nc2VlZC5jaGFyQ29kZUF0KGorKykpO1xuICB9XG4gIHJldHVybiB0b3N0cmluZyhrZXkpO1xufVxuXG4vL1xuLy8gYXV0b3NlZWQoKVxuLy8gUmV0dXJucyBhbiBvYmplY3QgZm9yIGF1dG9zZWVkaW5nLCB1c2luZyB3aW5kb3cuY3J5cHRvIGFuZCBOb2RlIGNyeXB0b1xuLy8gbW9kdWxlIGlmIGF2YWlsYWJsZS5cbi8vXG5mdW5jdGlvbiBhdXRvc2VlZCgpIHtcbiAgdHJ5IHtcbiAgICB2YXIgb3V0O1xuICAgIGlmIChub2RlY3J5cHRvICYmIChvdXQgPSBub2RlY3J5cHRvLnJhbmRvbUJ5dGVzKSkge1xuICAgICAgLy8gVGhlIHVzZSBvZiAnb3V0JyB0byByZW1lbWJlciByYW5kb21CeXRlcyBtYWtlcyB0aWdodCBtaW5pZmllZCBjb2RlLlxuICAgICAgb3V0ID0gb3V0KHdpZHRoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgb3V0ID0gbmV3IFVpbnQ4QXJyYXkod2lkdGgpO1xuICAgICAgKGdsb2JhbC5jcnlwdG8gfHwgZ2xvYmFsLm1zQ3J5cHRvKS5nZXRSYW5kb21WYWx1ZXMob3V0KTtcbiAgICB9XG4gICAgcmV0dXJuIHRvc3RyaW5nKG91dCk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICB2YXIgYnJvd3NlciA9IGdsb2JhbC5uYXZpZ2F0b3IsXG4gICAgICAgIHBsdWdpbnMgPSBicm93c2VyICYmIGJyb3dzZXIucGx1Z2lucztcbiAgICByZXR1cm4gWytuZXcgRGF0ZSwgZ2xvYmFsLCBwbHVnaW5zLCBnbG9iYWwuc2NyZWVuLCB0b3N0cmluZyhwb29sKV07XG4gIH1cbn1cblxuLy9cbi8vIHRvc3RyaW5nKClcbi8vIENvbnZlcnRzIGFuIGFycmF5IG9mIGNoYXJjb2RlcyB0byBhIHN0cmluZ1xuLy9cbmZ1bmN0aW9uIHRvc3RyaW5nKGEpIHtcbiAgcmV0dXJuIFN0cmluZy5mcm9tQ2hhckNvZGUuYXBwbHkoMCwgYSk7XG59XG5cbi8vXG4vLyBXaGVuIHNlZWRyYW5kb20uanMgaXMgbG9hZGVkLCB3ZSBpbW1lZGlhdGVseSBtaXggYSBmZXcgYml0c1xuLy8gZnJvbSB0aGUgYnVpbHQtaW4gUk5HIGludG8gdGhlIGVudHJvcHkgcG9vbC4gIEJlY2F1c2Ugd2UgZG9cbi8vIG5vdCB3YW50IHRvIGludGVyZmVyZSB3aXRoIGRldGVybWluaXN0aWMgUFJORyBzdGF0ZSBsYXRlcixcbi8vIHNlZWRyYW5kb20gd2lsbCBub3QgY2FsbCBtYXRoLnJhbmRvbSBvbiBpdHMgb3duIGFnYWluIGFmdGVyXG4vLyBpbml0aWFsaXphdGlvbi5cbi8vXG5taXhrZXkobWF0aC5yYW5kb20oKSwgcG9vbCk7XG5cbi8vXG4vLyBOb2RlanMgYW5kIEFNRCBzdXBwb3J0OiBleHBvcnQgdGhlIGltcGxlbWVudGF0aW9uIGFzIGEgbW9kdWxlIHVzaW5nXG4vLyBlaXRoZXIgY29udmVudGlvbi5cbi8vXG5pZiAoKHR5cGVvZiBtb2R1bGUpID09ICdvYmplY3QnICYmIG1vZHVsZS5leHBvcnRzKSB7XG4gIG1vZHVsZS5leHBvcnRzID0gc2VlZHJhbmRvbTtcbiAgLy8gV2hlbiBpbiBub2RlLmpzLCB0cnkgdXNpbmcgY3J5cHRvIHBhY2thZ2UgZm9yIGF1dG9zZWVkaW5nLlxuICB0cnkge1xuICAgIG5vZGVjcnlwdG8gPSByZXF1aXJlKCdjcnlwdG8nKTtcbiAgfSBjYXRjaCAoZXgpIHt9XG59IGVsc2UgaWYgKCh0eXBlb2YgZGVmaW5lKSA9PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgZGVmaW5lKGZ1bmN0aW9uKCkgeyByZXR1cm4gc2VlZHJhbmRvbTsgfSk7XG59IGVsc2Uge1xuICAvLyBXaGVuIGluY2x1ZGVkIGFzIGEgcGxhaW4gc2NyaXB0LCBzZXQgdXAgTWF0aC5zZWVkcmFuZG9tIGdsb2JhbC5cbiAgbWF0aFsnc2VlZCcgKyBybmduYW1lXSA9IHNlZWRyYW5kb207XG59XG5cblxuLy8gRW5kIGFub255bW91cyBzY29wZSwgYW5kIHBhc3MgaW5pdGlhbCB2YWx1ZXMuXG59KShcbiAgLy8gZ2xvYmFsOiBgc2VsZmAgaW4gYnJvd3NlcnMgKGluY2x1ZGluZyBzdHJpY3QgbW9kZSBhbmQgd2ViIHdvcmtlcnMpLFxuICAvLyBvdGhlcndpc2UgYHRoaXNgIGluIE5vZGUgYW5kIG90aGVyIGVudmlyb25tZW50c1xuICAodHlwZW9mIHNlbGYgIT09ICd1bmRlZmluZWQnKSA/IHNlbGYgOiB0aGlzLFxuICBbXSwgICAgIC8vIHBvb2w6IGVudHJvcHkgcG9vbCBzdGFydHMgZW1wdHlcbiAgTWF0aCAgICAvLyBtYXRoOiBwYWNrYWdlIGNvbnRhaW5pbmcgcmFuZG9tLCBwb3csIGFuZCBzZWVkcmFuZG9tXG4pO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLnJlc2V0Qm9hcmQgPSBleHBvcnRzLnN0ZXAgPSB2b2lkIDA7XG5jb25zdCBTdG9ja0JpcmRfMSA9IHJlcXVpcmUoXCIuL1N0b2NrQmlyZFwiKTtcbmNvbnN0IEJvYXJkXzEgPSByZXF1aXJlKFwiLi9Cb2FyZFwiKTtcbmNvbnN0IFBpZWNlR2VuZXJhdG9yXzEgPSByZXF1aXJlKFwiLi9QaWVjZUdlbmVyYXRvclwiKTtcbmNvbnN0IHBpZWNlR2VuZXJhdG9yID0gbmV3IFBpZWNlR2VuZXJhdG9yXzEuUGllY2VHZW5lcmF0b3IoMTIzKTtcbmxldCBib2FyZCA9IEFycmF5KDIwKS5maWxsKDApO1xuY29uc3QgbG9va2FoZWFkID0gQXJyYXkuZnJvbSh7IGxlbmd0aDogNSB9LCAoKSA9PiBwaWVjZUdlbmVyYXRvci5nZXROZXh0UGllY2UoKSk7XG5jb25zb2xlLmxvZyhsb29rYWhlYWQpO1xuZnVuY3Rpb24gc3RlcCgpIHtcbiAgICAvLyBDeWNsZSBhIG5ldyBwaWVjZSB0byBwaWVjZSBMSUZPLlxuICAgIGxvb2thaGVhZC5wdXNoKHBpZWNlR2VuZXJhdG9yLmdldE5leHRQaWVjZSgpKTtcbiAgICBjb25zdCBuZXh0UGllY2VUeXBlID0gbG9va2FoZWFkLnNoaWZ0KCk7XG4gICAgY29uc3QgW2NvbHVtbiwgcm90YXRpb24sIHNjb3JlXSA9ICgwLCBTdG9ja0JpcmRfMS5maW5kQmVzdE1vdmUpKGJvYXJkLCBuZXh0UGllY2VUeXBlLCBTdG9ja0JpcmRfMS5jYWxjU2NvcmUpO1xuICAgIGxldCBsb3N0O1xuICAgIFtib2FyZCwgbG9zdF0gPSAoMCwgQm9hcmRfMS5kcm9wUGllY2UpKFsuLi5ib2FyZF0sIG5leHRQaWVjZVR5cGUsIHJvdGF0aW9uLCBjb2x1bW4pO1xuICAgIGJvYXJkID0gKDAsIEJvYXJkXzEuY2xlYXJMaW5lcykoYm9hcmQpO1xuICAgIHJldHVybiB7XG4gICAgICAgIGJvYXJkOiBib2FyZCxcbiAgICAgICAgcGllY2U6IG5leHRQaWVjZVR5cGUsXG4gICAgICAgIGlzTG9zdDogbG9zdCxcbiAgICAgICAgbG9va2FoZWFkOiBsb29rYWhlYWQsXG4gICAgfTtcbn1cbmV4cG9ydHMuc3RlcCA9IHN0ZXA7XG5mdW5jdGlvbiByZXNldEJvYXJkKCkge1xuICAgIGJvYXJkID0gQXJyYXkoMjApLmZpbGwoMCk7XG59XG5leHBvcnRzLnJlc2V0Qm9hcmQgPSByZXNldEJvYXJkO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmNsZWFyTGluZXMgPSBleHBvcnRzLmRyb3BQaWVjZSA9IGV4cG9ydHMucHJpbnRCb2FyZCA9IHZvaWQgMDtcbmNvbnN0IFRldHJpbWlub3NfMSA9IHJlcXVpcmUoXCIuL1RldHJpbWlub3NcIik7XG5mdW5jdGlvbiBwcmludEJvYXJkKGJvYXJkKSB7XG4gICAgY29uc3QgYm9hcmRTdHJpbmcgPSBib2FyZFxuICAgICAgICAubWFwKCh2YWx1ZSwgaW5kZXgpID0+IHtcbiAgICAgICAgY29uc3Qgcm93ID0gYCR7aW5kZXgudG9TdHJpbmcoKS5wYWRTdGFydCgyKX0gfCR7dmFsdWVcbiAgICAgICAgICAgIC50b1N0cmluZygyKVxuICAgICAgICAgICAgLnBhZFN0YXJ0KDEwLCBcIjBcIilcbiAgICAgICAgICAgIC5yZXBsYWNlQWxsKFwiMFwiLCBcIiAgXCIpXG4gICAgICAgICAgICAucmVwbGFjZUFsbChcIjFcIiwgXCIg4pagXCIpfWA7XG4gICAgICAgIHJldHVybiByb3c7XG4gICAgfSlcbiAgICAgICAgLmpvaW4oXCJcXG5cIik7XG4gICAgY29uc29sZS5sb2coYm9hcmRTdHJpbmcpO1xuICAgIGNvbnNvbGUubG9nKFwiLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXCIpO1xuICAgIGNvbnNvbGUubG9nKFwiICAgfCAwIDEgMiAzIDQgNSA2IDcgOCA5XCIpO1xufVxuZXhwb3J0cy5wcmludEJvYXJkID0gcHJpbnRCb2FyZDtcbmZ1bmN0aW9uIGRyb3BQaWVjZShib2FyZCwgcGllY2UsIHJvdGF0aW9uLCBjb2x1bW4pIHtcbiAgICBjb25zdCBwaWVjZVNoYXBlcyA9IFRldHJpbWlub3NfMS5UZXRyaW1pbm9zLmdldChwaWVjZSk7XG4gICAgY29uc3QgcGllY2VTaGFwZSA9IHBpZWNlU2hhcGVzW3JvdGF0aW9uXTtcbiAgICAvLyBjb25zb2xlLmxvZyhwaWVjZVNoYXBlKTtcbiAgICAvLyBTaGlmdCBwaWVjZSB0byBjb3JyZWN0IGNvbHVtbi5cbiAgICBjb25zdCBwaWVjZVdpZHRoID0gTWF0aC5mbG9vcihNYXRoLmxvZzIocGllY2VTaGFwZS5yZWR1Y2UoKG9yLCB4KSA9PiBvciB8IHgsIDApKSkgKyAxO1xuICAgIGxldCBzaGlmdGVkUGllY2UgPSBbLi4ucGllY2VTaGFwZV07XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwaWVjZVNoYXBlLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIC8vIHNoaWZ0ZWRQaWVjZVtpXSA9IChwaWVjZVNoYXBlW2ldIDw8IDEwKSA+PiBNYXRoLm1pbihwaWVjZVdpZHRoICsgY29sdW1uLCAxMCk7XG4gICAgICAgIHNoaWZ0ZWRQaWVjZVtpXSA9IHBpZWNlU2hhcGVbaV0gPDwgTWF0aC5tYXgoMTAgLSAocGllY2VXaWR0aCArIGNvbHVtbiksIDApO1xuICAgIH1cbiAgICAvLyBjb25zb2xlLmxvZyhgcGllY2U6ICR7cGllY2V9IGNvbHVtbjogJHtjb2x1bW59IHdpZHRoOiAke3BpZWNlV2lkdGh9YCk7XG4gICAgLy8gc2hpZnRlZFBpZWNlLmZvckVhY2goKHgpID0+IHtcbiAgICAvLyAgICAgY29uc29sZS5sb2coeC50b1N0cmluZygyKS5wYWRTdGFydCgxMCwgXCIwXCIpLnJlcGxhY2UoLzAvZywgXCIuXCIpLnJlcGxhY2UoLzEvZywgXCLilqBcIikpO1xuICAgIC8vIH0pO1xuICAgIC8vIGNvbnNvbGUubG9nKFwiZ28gdG86IFwiLCBib2FyZC5sZW5ndGggLSBwaWVjZVNoYXBlLmxlbmd0aCk7XG4gICAgLy8gRmluZCByb3cgYmVmb3JlIHdoZXJlIHBpZWNlIG92ZXJsYXBzIHdpdGggZXhpc3RpbmcgcGllY2VzLlxuICAgIGxldCB5ID0gMDtcbiAgICBvdXQ6IGZvciAoOyB5IDwgYm9hcmQubGVuZ3RoIC0gcGllY2VTaGFwZS5sZW5ndGggKyAxOyB5KyspIHtcbiAgICAgICAgZm9yIChsZXQgcGllY2VZID0gMDsgcGllY2VZIDwgcGllY2VTaGFwZS5sZW5ndGg7IHBpZWNlWSsrKSB7XG4gICAgICAgICAgICBpZiAoYm9hcmRbeSArIHBpZWNlWV0gJiBzaGlmdGVkUGllY2VbcGllY2VZXSkge1xuICAgICAgICAgICAgICAgIHktLTtcbiAgICAgICAgICAgICAgICBicmVhayBvdXQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgeSA9IE1hdGgubWluKGJvYXJkLmxlbmd0aCAtIHBpZWNlU2hhcGUubGVuZ3RoLCB5KTtcbiAgICAvLyBBZGQgbmV3IHBpZWNlIHRvIHRoZSBib2FyZC5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNoaWZ0ZWRQaWVjZS5sZW5ndGg7IGkrKykge1xuICAgICAgICBib2FyZFt5ICsgaV0gfD0gc2hpZnRlZFBpZWNlW2ldO1xuICAgIH1cbiAgICByZXR1cm4gW2JvYXJkLCB5IC0gcGllY2VTaGFwZS5sZW5ndGggPCAwXTtcbn1cbmV4cG9ydHMuZHJvcFBpZWNlID0gZHJvcFBpZWNlO1xuZnVuY3Rpb24gY2xlYXJMaW5lcyhib2FyZCkge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYm9hcmQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKGJvYXJkW2ldID09PSAwYjExMTExMTExMTEpIHtcbiAgICAgICAgICAgIGJvYXJkW2ldID0gMDtcbiAgICAgICAgfVxuICAgIH1cbiAgICBmb3IgKGxldCBpID0gYm9hcmQubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgaWYgKGJvYXJkW2ldID09PSAwKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBqID0gaSAtIDE7IGogPj0gMDsgai0tKSB7XG4gICAgICAgICAgICAgICAgaWYgKGJvYXJkW2pdICE9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGJvYXJkW2ldID0gYm9hcmRbal07XG4gICAgICAgICAgICAgICAgICAgIGJvYXJkW2pdID0gMDtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBib2FyZDtcbn1cbmV4cG9ydHMuY2xlYXJMaW5lcyA9IGNsZWFyTGluZXM7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuR2VuZXRpY0FsZ29yaXRobSA9IHZvaWQgMDtcbmNvbnN0IEJvYXJkXzEgPSByZXF1aXJlKFwiLi9Cb2FyZFwiKTtcbmNvbnN0IFBpZWNlR2VuZXJhdG9yXzEgPSByZXF1aXJlKFwiLi9QaWVjZUdlbmVyYXRvclwiKTtcbmNvbnN0IFN0b2NrQmlyZF8xID0gcmVxdWlyZShcIi4vU3RvY2tCaXJkXCIpO1xuY2xhc3MgSW5kaXZpZHVhbCB7XG4gICAgY29uc3RydWN0b3IoZ2VuZXMpIHtcbiAgICAgICAgdGhpcy5nZW5lcyA9IGdlbmVzO1xuICAgICAgICB0aGlzLmZpdG5lc3MgPSB7XG4gICAgICAgICAgICBjbGVhcmVkOiAwLFxuICAgICAgICAgICAgc2NvcmVUb3RhbDogMCxcbiAgICAgICAgICAgIGxvc3Q6IGZhbHNlLFxuICAgICAgICB9O1xuICAgIH1cbiAgICBjb21wYXJlKG90aGVyKSB7XG4gICAgICAgIGlmICghdGhpcy5maXRuZXNzLmxvc3QgJiYgb3RoZXIuZml0bmVzcy5sb3N0KSB7XG4gICAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodGhpcy5maXRuZXNzLmxvc3QgPT09IG90aGVyLmZpdG5lc3MubG9zdCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuZml0bmVzcy5jbGVhcmVkID4gb3RoZXIuZml0bmVzcy5jbGVhcmVkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAodGhpcy5maXRuZXNzLmNsZWFyZWQgPT09IG90aGVyLmZpdG5lc3MuY2xlYXJlZCkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmZpdG5lc3Muc2NvcmVUb3RhbCA+IG90aGVyLmZpdG5lc3Muc2NvcmVUb3RhbCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHRoaXMuZml0bmVzcy5zY29yZVRvdGFsID09PSBvdGhlci5maXRuZXNzLnNjb3JlVG90YWwpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9XG4gICAgfVxuICAgIG5vcm1hbGl6ZSgpIHtcbiAgICAgICAgY29uc3Qgbm9ybSA9IE1hdGguc3FydCh0aGlzLmdlbmVzLnJlZHVjZSgoYWNjLCBjdXJyKSA9PiBhY2MgKyBjdXJyICogY3VyciwgMCkpO1xuICAgICAgICB0aGlzLmdlbmVzID0gdGhpcy5nZW5lcy5tYXAoKHgpID0+IHggLyBub3JtKTtcbiAgICB9XG4gICAgbXV0YXRlKCkge1xuICAgICAgICBjb25zdCBxdWFudGl0eSA9IE1hdGgucmFuZG9tKCkgKiAwLjQgLSAwLjI7XG4gICAgICAgIGNvbnN0IGluZGV4ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogNCk7XG4gICAgICAgIHRoaXMuZ2VuZXNbaW5kZXhdICs9IHF1YW50aXR5O1xuICAgIH1cbiAgICBjYWxjdWxhdGVGaXRuZXNzKHNlZWQpIHtcbiAgICAgICAgbGV0IGNvdW50ZXJTdW0gPSAwO1xuICAgICAgICBsZXQgc2NvcmVUb3RhbFN1bSA9IDA7XG4gICAgICAgIGxldCBsb3N0U3VtID0gMDtcbiAgICAgICAgY29uc3QgcGllY2VHZW5lcmF0b3IgPSBuZXcgUGllY2VHZW5lcmF0b3JfMS5QaWVjZUdlbmVyYXRvcihzZWVkKTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAzOyBpKyspIHtcbiAgICAgICAgICAgIGxldCBib2FyZCA9IEFycmF5KDIwKS5maWxsKDApO1xuICAgICAgICAgICAgY29uc3QgbG9va2FoZWFkID0gQXJyYXkuZnJvbSh7IGxlbmd0aDogNSB9LCAoKSA9PiBwaWVjZUdlbmVyYXRvci5nZXROZXh0UGllY2UoKSk7XG4gICAgICAgICAgICBjb25zdCBzY29yZUZ1bmMgPSAoYm9hcmQpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gKDAsIFN0b2NrQmlyZF8xLmNhbGNTY29yZU9uUGFyYW1zKShib2FyZCwgdGhpcy5nZW5lcyk7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgbGV0IGNvdW50ZXIgPSAwO1xuICAgICAgICAgICAgbGV0IHNjb3JlVG90YWwgPSAwO1xuICAgICAgICAgICAgbGV0IGxvc3QgPSBmYWxzZTtcbiAgICAgICAgICAgIHdoaWxlICghbG9zdCAmJiBjb3VudGVyIDwgMTAwMCkge1xuICAgICAgICAgICAgICAgIGxvb2thaGVhZC5wdXNoKHBpZWNlR2VuZXJhdG9yLmdldE5leHRQaWVjZSgpKTtcbiAgICAgICAgICAgICAgICBjb25zdCBuZXh0UGllY2VUeXBlID0gbG9va2FoZWFkLnNoaWZ0KCk7XG4gICAgICAgICAgICAgICAgY29uc3QgW2NvbHVtbiwgcm90YXRpb24sIHNjb3JlXSA9ICgwLCBTdG9ja0JpcmRfMS5maW5kQmVzdE1vdmUpKGJvYXJkLCBuZXh0UGllY2VUeXBlLCBzY29yZUZ1bmMpO1xuICAgICAgICAgICAgICAgIHNjb3JlVG90YWwgKz0gc2NvcmU7XG4gICAgICAgICAgICAgICAgW2JvYXJkLCBsb3N0XSA9ICgwLCBCb2FyZF8xLmRyb3BQaWVjZSkoWy4uLmJvYXJkXSwgbmV4dFBpZWNlVHlwZSwgcm90YXRpb24sIGNvbHVtbik7XG4gICAgICAgICAgICAgICAgYm9hcmQgPSAoMCwgQm9hcmRfMS5jbGVhckxpbmVzKShib2FyZCk7XG4gICAgICAgICAgICAgICAgY291bnRlcisrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY291bnRlclN1bSArPSBjb3VudGVyO1xuICAgICAgICAgICAgc2NvcmVUb3RhbFN1bSA9IHNjb3JlVG90YWw7XG4gICAgICAgICAgICBsb3N0U3VtICs9IGxvc3QgPyAxIDogMDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gW2NvdW50ZXJTdW0gLyAzLCBzY29yZVRvdGFsU3VtIC8gMywgbG9zdFN1bSA+IDAgPyB0cnVlIDogZmFsc2VdO1xuICAgIH1cbn1cbmNsYXNzIEdlbmV0aWNBbGdvcml0aG0ge1xuICAgIGNvbnN0cnVjdG9yKHBvcHVsYXRpb25TaXplKSB7XG4gICAgICAgIHRoaXMuZ2VuZXJhdGlvbiA9IDA7XG4gICAgICAgIHRoaXMuc3Vydml2YWxDaGFuY2UgPSAwLjE7XG4gICAgICAgIHRoaXMucG9wdWxhdGlvblNpemUgPSBwb3B1bGF0aW9uU2l6ZTtcbiAgICAgICAgdGhpcy5wb3B1bGF0aW9uID0gW107XG4gICAgfVxuICAgIGNvbXBhcmUoc29tZSwgb3RoZXIpIHtcbiAgICAgICAgaWYgKHNvbWUuZml0bmVzcy5sb3N0ICE9PSBvdGhlci5maXRuZXNzLmxvc3QpIHtcbiAgICAgICAgICAgIHJldHVybiBzb21lLmZpdG5lc3MubG9zdCA/IDEgOiAtMTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoc29tZS5maXRuZXNzLmNsZWFyZWQgIT09IG90aGVyLmZpdG5lc3MuY2xlYXJlZCkge1xuICAgICAgICAgICAgcmV0dXJuIG90aGVyLmZpdG5lc3MuY2xlYXJlZCAtIHNvbWUuZml0bmVzcy5jbGVhcmVkO1xuICAgICAgICB9XG4gICAgICAgIGlmIChzb21lLmZpdG5lc3Muc2NvcmVUb3RhbCAhPT0gb3RoZXIuZml0bmVzcy5zY29yZVRvdGFsKSB7XG4gICAgICAgICAgICByZXR1cm4gb3RoZXIuZml0bmVzcy5zY29yZVRvdGFsIC0gc29tZS5maXRuZXNzLnNjb3JlVG90YWw7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIDA7XG4gICAgfVxuICAgIGluaXRpYWxpemVQb3B1bGF0aW9uKCkge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucG9wdWxhdGlvblNpemU7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgaW5kaXZpZHVhbCA9IG5ldyBJbmRpdmlkdWFsKEFycmF5LmZyb20oeyBsZW5ndGg6IDQgfSwgKCkgPT4gTWF0aC5yYW5kb20oKSkpO1xuICAgICAgICAgICAgdGhpcy5wb3B1bGF0aW9uLnB1c2goaW5kaXZpZHVhbCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZXZhbHVhdGVGaXRuZXNzKHBvcHVsYXRpb24pIHtcbiAgICAgICAgZm9yIChsZXQgaW5kaXZpZHVhbCBvZiBwb3B1bGF0aW9uKSB7XG4gICAgICAgICAgICBjb25zdCBbY291bnRlciwgc2NvcmVUb3RhbCwgbG9zdF0gPSBpbmRpdmlkdWFsLmNhbGN1bGF0ZUZpdG5lc3MoTWF0aC5yYW5kb20oKSk7XG4gICAgICAgICAgICBpbmRpdmlkdWFsLmZpdG5lc3MgPSB7XG4gICAgICAgICAgICAgICAgY2xlYXJlZDogY291bnRlcixcbiAgICAgICAgICAgICAgICBzY29yZVRvdGFsOiBzY29yZVRvdGFsLFxuICAgICAgICAgICAgICAgIGxvc3Q6IGxvc3QsXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfVxuICAgIHNlbGVjdGlvbigpIHtcbiAgICAgICAgY29uc3QgcmFuZG9tQ2FuZGlkYXRlcyA9IG5ldyBTZXQoKTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnBvcHVsYXRpb24ubGVuZ3RoIC8gMTA7IGkrKykge1xuICAgICAgICAgICAgcmFuZG9tQ2FuZGlkYXRlcy5hZGQodGhpcy5wb3B1bGF0aW9uW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHRoaXMucG9wdWxhdGlvbi5sZW5ndGgpXSk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgc29ydGVkID0gQXJyYXkuZnJvbShyYW5kb21DYW5kaWRhdGVzKS5zb3J0KHRoaXMuY29tcGFyZSk7XG4gICAgICAgIHJldHVybiBbc29ydGVkWzBdLCBzb3J0ZWRbMV1dO1xuICAgIH1cbiAgICAvLyBjcm9zc292ZXIocGFyZW50MTogSW5kaXZpZHVhbCwgcGFyZW50MjogSW5kaXZpZHVhbCk6IEluZGl2aWR1YWwge1xuICAgIC8vICAgICBjb25zdCBnZW5lcyA9IEFycmF5LmZyb20oeyBsZW5ndGg6IDQgfSkubWFwKFxuICAgIC8vICAgICAgICAgKF8sIGkpID0+XG4gICAgLy8gICAgICAgICAgICAgcGFyZW50MS5maXRuZXNzLmNsZWFyZWQgKiBwYXJlbnQxLmdlbmVzW2ldICtcbiAgICAvLyAgICAgICAgICAgICBwYXJlbnQyLmZpdG5lc3MuY2xlYXJlZCAqIHBhcmVudDIuZ2VuZXNbaV1cbiAgICAvLyAgICAgKTtcbiAgICAvLyAgICAgY29uc3QgY2hpbGQgPSBuZXcgSW5kaXZpZHVhbChnZW5lcyk7XG4gICAgLy8gICAgIGNoaWxkLm5vcm1hbGl6ZSgpO1xuICAgIC8vICAgICByZXR1cm4gY2hpbGQ7XG4gICAgLy8gfVxuICAgIGNyb3Nzb3ZlcihwYXJlbnQxLCBwYXJlbnQyKSB7XG4gICAgICAgIGNvbnN0IGRpZmYgPSBwYXJlbnQxLmZpdG5lc3MuY2xlYXJlZCAvIHBhcmVudDIuZml0bmVzcy5jbGVhcmVkO1xuICAgICAgICBjb25zdCBnZW5lcyA9IEFycmF5LmZyb20oeyBsZW5ndGg6IDQgfSkubWFwKChfLCBpKSA9PiBNYXRoLnJhbmRvbSgpICogZGlmZiA+IDAuNSA/IHBhcmVudDEuZ2VuZXNbaV0gOiBwYXJlbnQyLmdlbmVzW2ldKTtcbiAgICAgICAgY29uc3QgY2hpbGQgPSBuZXcgSW5kaXZpZHVhbChnZW5lcyk7XG4gICAgICAgIC8vY2hpbGQubm9ybWFsaXplKCk7XG4gICAgICAgIHJldHVybiBjaGlsZDtcbiAgICB9XG4gICAgZGVsZXRlTkxhc3RSZXBsYWNlbWVudChuZXdDYW5kaWRhdGVzKSB7XG4gICAgICAgIHRoaXMucG9wdWxhdGlvbi5zcGxpY2UoLW5ld0NhbmRpZGF0ZXMubGVuZ3RoKTtcbiAgICAgICAgdGhpcy5wb3B1bGF0aW9uLnB1c2goLi4ubmV3Q2FuZGlkYXRlcyk7XG4gICAgICAgIHRoaXMuZXZhbHVhdGVGaXRuZXNzKHRoaXMucG9wdWxhdGlvbik7XG4gICAgICAgIHRoaXMucG9wdWxhdGlvbi5zb3J0KHRoaXMuY29tcGFyZSk7XG4gICAgfVxuICAgIHJ1bigpIHtcbiAgICAgICAgdGhpcy5pbml0aWFsaXplUG9wdWxhdGlvbigpO1xuICAgICAgICB0aGlzLmV2YWx1YXRlRml0bmVzcyh0aGlzLnBvcHVsYXRpb24pO1xuICAgICAgICB0aGlzLnBvcHVsYXRpb24uc29ydCh0aGlzLmNvbXBhcmUpO1xuICAgICAgICBsZXQgY291bnQgPSAwO1xuICAgICAgICB3aGlsZSAoY291bnQgPCA1MCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coYEdlbmVyYXRpb24gJHtjb3VudH1gKTtcbiAgICAgICAgICAgIGNvbnN0IG5ld0NhbmRpZGF0ZXMgPSBBcnJheShNYXRoLmZsb29yKHRoaXMucG9wdWxhdGlvbi5sZW5ndGggLyAzKSk7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMucG9wdWxhdGlvbi5sZW5ndGggLyAzOyBpKyspIHtcbiAgICAgICAgICAgICAgICBjb25zdCBwYWlyID0gdGhpcy5zZWxlY3Rpb24oKTtcbiAgICAgICAgICAgICAgICBjb25zdCBjYW5kaWRhdGUgPSB0aGlzLmNyb3Nzb3ZlcihwYWlyWzBdLCBwYWlyWzFdKTtcbiAgICAgICAgICAgICAgICBpZiAoTWF0aC5yYW5kb20oKSA8IDAuMDUpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FuZGlkYXRlLm11dGF0ZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjYW5kaWRhdGUubm9ybWFsaXplKCk7XG4gICAgICAgICAgICAgICAgbmV3Q2FuZGlkYXRlc1tpXSA9IGNhbmRpZGF0ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuZGVsZXRlTkxhc3RSZXBsYWNlbWVudChuZXdDYW5kaWRhdGVzKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGBBdmVyYWdlIGNsZWFyZWQ6ICR7dGhpcy5wb3B1bGF0aW9uLnJlZHVjZSgoYWNjLCBjdXJyKSA9PiBjdXJyLmZpdG5lc3MuY2xlYXJlZCArIGFjYywgMCkgL1xuICAgICAgICAgICAgICAgIHRoaXMucG9wdWxhdGlvbi5sZW5ndGh9YCk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgQXZlcmFnZSBzY29yZTogJHt0aGlzLnBvcHVsYXRpb24ucmVkdWNlKChhY2MsIGN1cnIpID0+IGN1cnIuZml0bmVzcy5zY29yZVRvdGFsICsgYWNjLCAwKSAvXG4gICAgICAgICAgICAgICAgdGhpcy5wb3B1bGF0aW9uLmxlbmd0aH1gKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRml0dGVzdCBjYW5kaWRhdGUgPSBcIiArIEpTT04uc3RyaW5naWZ5KHRoaXMucG9wdWxhdGlvblswXSkpO1xuICAgICAgICAgICAgY291bnQrKztcbiAgICAgICAgfVxuICAgIH1cbiAgICBnZXRCZXN0SW5kaXZpZHVhbCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucG9wdWxhdGlvbi5yZWR1Y2UoKG1heCwgb2JqKSA9PiAob2JqLmZpdG5lc3MgPiBtYXguZml0bmVzcyA/IG9iaiA6IG1heCkpO1xuICAgIH1cbn1cbmV4cG9ydHMuR2VuZXRpY0FsZ29yaXRobSA9IEdlbmV0aWNBbGdvcml0aG07XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2ltcG9ydERlZmF1bHQgPSAodGhpcyAmJiB0aGlzLl9faW1wb3J0RGVmYXVsdCkgfHwgZnVuY3Rpb24gKG1vZCkge1xuICAgIHJldHVybiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSA/IG1vZCA6IHsgXCJkZWZhdWx0XCI6IG1vZCB9O1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuUGllY2VHZW5lcmF0b3IgPSB2b2lkIDA7XG5jb25zdCBUZXRyaW1pbm9zXzEgPSByZXF1aXJlKFwiLi9UZXRyaW1pbm9zXCIpO1xuY29uc3Qgc2VlZHJhbmRvbV8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCJzZWVkcmFuZG9tXCIpKTtcbmNsYXNzIFBpZWNlR2VuZXJhdG9yIHtcbiAgICBjb25zdHJ1Y3RvcihzZWVkKSB7XG4gICAgICAgIHRoaXMuX3NodWZmbGVkUGllY2VzID0gW107XG4gICAgICAgIHRoaXMuX2N1cnJlbnRJbmRleCA9IDA7XG4gICAgICAgIHRoaXMucm5nID0gKDAsIHNlZWRyYW5kb21fMS5kZWZhdWx0KShzZWVkLnRvU3RyaW5nKCkpO1xuICAgIH1cbiAgICBzaHVmZmxlUGllY2VzKCkge1xuICAgICAgICB0aGlzLl9zaHVmZmxlZFBpZWNlcyA9IFsuLi5UZXRyaW1pbm9zXzEuUGllY2VMZXR0ZXJzXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IHRoaXMuX3NodWZmbGVkUGllY2VzLmxlbmd0aCAtIDE7IGkgPiAwOyBpLS0pIHtcbiAgICAgICAgICAgIGNvbnN0IHJhbmRvbUluZGV4ID0gTWF0aC5mbG9vcih0aGlzLnJuZygpICogKGkgKyAxKSk7XG4gICAgICAgICAgICBbdGhpcy5fc2h1ZmZsZWRQaWVjZXNbaV0sIHRoaXMuX3NodWZmbGVkUGllY2VzW3JhbmRvbUluZGV4XV0gPSBbXG4gICAgICAgICAgICAgICAgdGhpcy5fc2h1ZmZsZWRQaWVjZXNbcmFuZG9tSW5kZXhdLFxuICAgICAgICAgICAgICAgIHRoaXMuX3NodWZmbGVkUGllY2VzW2ldLFxuICAgICAgICAgICAgXTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9jdXJyZW50SW5kZXggPSAwO1xuICAgIH1cbiAgICBnZXROZXh0UGllY2UoKSB7XG4gICAgICAgIGlmICh0aGlzLl9jdXJyZW50SW5kZXggPj0gdGhpcy5fc2h1ZmZsZWRQaWVjZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICB0aGlzLnNodWZmbGVQaWVjZXMoKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBuZXh0UGllY2UgPSB0aGlzLl9zaHVmZmxlZFBpZWNlc1t0aGlzLl9jdXJyZW50SW5kZXhdO1xuICAgICAgICB0aGlzLl9jdXJyZW50SW5kZXgrKztcbiAgICAgICAgcmV0dXJuIG5leHRQaWVjZTtcbiAgICB9XG59XG5leHBvcnRzLlBpZWNlR2VuZXJhdG9yID0gUGllY2VHZW5lcmF0b3I7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuY2FsY1Njb3JlID0gZXhwb3J0cy5jYWxjU2NvcmVPblBhcmFtcyA9IGV4cG9ydHMuZmluZEJlc3RNb3ZlID0gdm9pZCAwO1xuY29uc3QgVGV0cmltaW5vc18xID0gcmVxdWlyZShcIi4vVGV0cmltaW5vc1wiKTtcbmNvbnN0IEJvYXJkXzEgPSByZXF1aXJlKFwiLi9Cb2FyZFwiKTtcbmZ1bmN0aW9uIGZpbmRCZXN0TW92ZShib2FyZCwgcGllY2VUeXBlLCBzY29yZUZ1bmMpIHtcbiAgICBjb25zdCBwaWVjZVNoYXBlcyA9IFRldHJpbWlub3NfMS5UZXRyaW1pbm9zLmdldChwaWVjZVR5cGUpO1xuICAgIGNvbnN0IGJlc3RNb3ZlID0ge1xuICAgICAgICBjb2x1bW46IDAsXG4gICAgICAgIHJvdGF0aW9uOiAwLFxuICAgICAgICBzY29yZTogLTEyMzQsXG4gICAgfTtcbiAgICBmb3IgKGxldCBjb2wgPSAwOyBjb2wgPCAxMDsgY29sKyspIHtcbiAgICAgICAgZm9yIChsZXQgciA9IDA7IHIgPCBwaWVjZVNoYXBlcy5sZW5ndGg7IHIrKykge1xuICAgICAgICAgICAgY29uc3QgW25ld0JvYXJkLCBsb3N0XSA9ICgwLCBCb2FyZF8xLmRyb3BQaWVjZSkoWy4uLmJvYXJkXSwgcGllY2VUeXBlLCByLCBjb2wpO1xuICAgICAgICAgICAgaWYgKGxvc3QpXG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICBjb25zdCBzY29yZSA9IHNjb3JlRnVuYyhuZXdCb2FyZCk7XG4gICAgICAgICAgICBpZiAoc2NvcmUgPiBiZXN0TW92ZS5zY29yZSkge1xuICAgICAgICAgICAgICAgIGJlc3RNb3ZlLmNvbHVtbiA9IGNvbDtcbiAgICAgICAgICAgICAgICBiZXN0TW92ZS5yb3RhdGlvbiA9IHI7XG4gICAgICAgICAgICAgICAgYmVzdE1vdmUuc2NvcmUgPSBzY29yZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gW2Jlc3RNb3ZlLmNvbHVtbiwgYmVzdE1vdmUucm90YXRpb24sIGJlc3RNb3ZlLnNjb3JlXTtcbn1cbmV4cG9ydHMuZmluZEJlc3RNb3ZlID0gZmluZEJlc3RNb3ZlO1xuZnVuY3Rpb24gY2FsY1Njb3JlT25QYXJhbXMobWF0cml4LCB3ZWlnaHRzKSB7XG4gICAgY29uc3QgaGVpZ2h0cyA9IGNsYWNIZWlnaHRzKG1hdHJpeCk7XG4gICAgY29uc3Qgc2NvcmUgPSAtd2VpZ2h0c1swXSAqIGNsYWNUb3RhbEhlaWdodChoZWlnaHRzKSArXG4gICAgICAgIHdlaWdodHNbMV0gKiBjb3VudENvbXBsZXRlTGluZXMobWF0cml4KSArXG4gICAgICAgIC13ZWlnaHRzWzJdICogY291bnRIb2xlcyhtYXRyaXgpICtcbiAgICAgICAgLXdlaWdodHNbM10gKiBjYWxjQnVtcGluZXNzKGhlaWdodHMpO1xuICAgIHJldHVybiBzY29yZTtcbn1cbmV4cG9ydHMuY2FsY1Njb3JlT25QYXJhbXMgPSBjYWxjU2NvcmVPblBhcmFtcztcbmZ1bmN0aW9uIGNhbGNTY29yZShtYXRyaXgpIHtcbiAgICBjb25zdCBoZWlnaHRzID0gY2xhY0hlaWdodHMobWF0cml4KTtcbiAgICAvLyBjb25zdCBzY29yZSA9XG4gICAgLy8gICAgIC0wLjUgKiBjbGFjVG90YWxIZWlnaHQoaGVpZ2h0cykgK1xuICAgIC8vICAgICAwLjggKiBjb3VudENvbXBsZXRlTGluZXMobWF0cml4KSArXG4gICAgLy8gICAgIC0xICogY291bnRIb2xlcyhtYXRyaXgpICtcbiAgICAvLyAgICAgLTAuMiAqIGNhbGNCdW1waW5lc3MoaGVpZ2h0cyk7XG4gICAgY29uc3Qgc2NvcmUgPSAtMC4wMTkyMzU3NjgwNDUxNDc4OSAqIGNsYWNUb3RhbEhlaWdodChoZWlnaHRzKSArXG4gICAgICAgIDAuNjI0MjExNTM2NjQ0NDY0NSAqIGNvdW50Q29tcGxldGVMaW5lcyhtYXRyaXgpICtcbiAgICAgICAgLTAuNzgwNTA0NzExNzA1ODA4MiAqIGNvdW50SG9sZXMobWF0cml4KSArXG4gICAgICAgIC0wLjAyODMyNTU2NzEyMDU4OTU1ICogY2FsY0J1bXBpbmVzcyhoZWlnaHRzKTtcbiAgICByZXR1cm4gc2NvcmU7XG59XG5leHBvcnRzLmNhbGNTY29yZSA9IGNhbGNTY29yZTtcbmZ1bmN0aW9uIGNsYWNIZWlnaHRzKG1hdHJpeCkge1xuICAgIGNvbnN0IGhlaWdodHMgPSBBcnJheSgxMCkuZmlsbCgwKTtcbiAgICBmb3IgKGxldCB5ID0gMDsgeSA8IDIwOyB5KyspIHtcbiAgICAgICAgZm9yIChsZXQgeCA9IDA7IHggPCAxMDsgeCsrKSB7XG4gICAgICAgICAgICBpZiAoaGVpZ2h0c1t4XSA9PT0gMCAmJiAobWF0cml4W3ldIDw8IHgpICYgMGIxMDAwMDAwMDAwMCkge1xuICAgICAgICAgICAgICAgIGhlaWdodHNbeF0gPSAyMCAtIHk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGhlaWdodHM7XG59XG5mdW5jdGlvbiBjbGFjVG90YWxIZWlnaHQoaGVpZ2h0cykge1xuICAgIHJldHVybiBoZWlnaHRzLnJlZHVjZSgoc3VtLCB4KSA9PiBzdW0gKyB4LCAwKTtcbn1cbmZ1bmN0aW9uIGNvdW50Q29tcGxldGVMaW5lcyhtYXRyaXgpIHtcbiAgICBsZXQgY291bnQgPSAwO1xuICAgIG1hdHJpeC5mb3JFYWNoKChyb3cpID0+IHtcbiAgICAgICAgaWYgKHJvdyA9PT0gMTAyMylcbiAgICAgICAgICAgIGNvdW50Kys7XG4gICAgfSk7XG4gICAgcmV0dXJuIGNvdW50O1xufVxuZnVuY3Rpb24gY291bnRIb2xlcyhtYXRyaXgpIHtcbiAgICBsZXQgY291bnQgPSAwO1xuICAgIGZvciAobGV0IHkgPSAwOyB5IDwgMTk7IHkrKykge1xuICAgICAgICBmb3IgKGxldCB4ID0gMDsgeCA8IDEwOyB4KyspIHtcbiAgICAgICAgICAgIGlmICgobWF0cml4W3ldID4+IHgpICYgMSAmJiAhKChtYXRyaXhbeSArIDFdID4+IHgpICYgMSkpXG4gICAgICAgICAgICAgICAgY291bnQrKztcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gY291bnQ7XG59XG5mdW5jdGlvbiBjYWxjQnVtcGluZXNzKGhlaWdodHMpIHtcbiAgICBsZXQgYnVtcGluZXNzID0gMDtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGhlaWdodHMubGVuZ3RoIC0gMTsgaSsrKSB7XG4gICAgICAgIGJ1bXBpbmVzcyArPSBNYXRoLmFicyhoZWlnaHRzW2ldIC0gaGVpZ2h0c1tpICsgMV0pO1xuICAgIH1cbiAgICByZXR1cm4gYnVtcGluZXNzO1xufVxuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLlRldHJpbWlub3MgPSBleHBvcnRzLlBpZWNlTGV0dGVycyA9IHZvaWQgMDtcbmV4cG9ydHMuUGllY2VMZXR0ZXJzID0gW1wiSVwiLCBcIkpcIiwgXCJMXCIsIFwiT1wiLCBcIlNcIiwgXCJUXCIsIFwiWlwiXTtcbmV4cG9ydHMuVGV0cmltaW5vcyA9IG5ldyBNYXAoW1xuICAgIFtcbiAgICAgICAgXCJKXCIsXG4gICAgICAgIFtcbiAgICAgICAgICAgIFswYjExLCAwYjEwLCAwYjEwXSxcbiAgICAgICAgICAgIFswYjAxLCAwYjAxLCAwYjExXSxcbiAgICAgICAgICAgIFswYjExMSwgMGIwMDFdLFxuICAgICAgICAgICAgWzBiMTAwLCAwYjExMV0sXG4gICAgICAgIF0sXG4gICAgXSxcbiAgICBbXG4gICAgICAgIFwiTFwiLFxuICAgICAgICBbXG4gICAgICAgICAgICBbMGIxMCwgMGIxMCwgMGIxMV0sXG4gICAgICAgICAgICBbMGIxMTEsIDBiMTAwXSxcbiAgICAgICAgICAgIFswYjExLCAwYjAxLCAwYjAxXSxcbiAgICAgICAgICAgIFswYjAwMSwgMGIxMTFdLFxuICAgICAgICBdLFxuICAgIF0sXG4gICAgW1wiSVwiLCBbWzBiMSwgMGIxLCAwYjEsIDBiMV0sIFswYjExMTFdXV0sXG4gICAgW1wiT1wiLCBbWzBiMTEsIDBiMTFdXV0sXG4gICAgW1xuICAgICAgICBcIlRcIixcbiAgICAgICAgW1xuICAgICAgICAgICAgWzBiMTAsIDBiMTEsIDBiMTBdLFxuICAgICAgICAgICAgWzBiMTExLCAwYjAxMF0sXG4gICAgICAgICAgICBbMGIwMTAsIDBiMTExXSxcbiAgICAgICAgICAgIFswYjAxLCAwYjExLCAwYjAxXSxcbiAgICAgICAgXSxcbiAgICBdLFxuICAgIFtcbiAgICAgICAgXCJTXCIsXG4gICAgICAgIFtcbiAgICAgICAgICAgIFswYjEwLCAwYjExLCAwYjAxXSxcbiAgICAgICAgICAgIFswYjAxMSwgMGIxMTBdLFxuICAgICAgICBdLFxuICAgIF0sXG4gICAgW1xuICAgICAgICBcIlpcIixcbiAgICAgICAgW1xuICAgICAgICAgICAgWzBiMDEsIDBiMTEsIDBiMTBdLFxuICAgICAgICAgICAgWzBiMTEwLCAwYjAxMV0sXG4gICAgICAgIF0sXG4gICAgXSxcbl0pO1xuIiwiLyogKGlnbm9yZWQpICovIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHRpZDogbW9kdWxlSWQsXG5cdFx0bG9hZGVkOiBmYWxzZSxcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG5cdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiX193ZWJwYWNrX3JlcXVpcmVfXy5hbWREID0gZnVuY3Rpb24gKCkge1xuXHR0aHJvdyBuZXcgRXJyb3IoJ2RlZmluZSBjYW5ub3QgYmUgdXNlZCBpbmRpcmVjdCcpO1xufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLmFtZE8gPSB7fTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm5tZCA9IChtb2R1bGUpID0+IHtcblx0bW9kdWxlLnBhdGhzID0gW107XG5cdGlmICghbW9kdWxlLmNoaWxkcmVuKSBtb2R1bGUuY2hpbGRyZW4gPSBbXTtcblx0cmV0dXJuIG1vZHVsZTtcbn07IiwiY29uc3QgeyBzdGVwLCByZXNldEJvYXJkIH0gPSByZXF1aXJlKFwiLi9BcHBcIik7XHJcbmNvbnN0IHsgU3RvY2tCaXJkIH0gPSByZXF1aXJlKFwiLi9TdG9ja0JpcmRcIik7XHJcbmNvbnN0IHsgVGV0cmltaW5vcyB9ID0gcmVxdWlyZShcIi4vVGV0cmltaW5vc1wiKTtcclxuY29uc3QgeyBHZW5ldGljQWxnb3JpdGhtIH0gPSByZXF1aXJlKFwiLi9HZW5ldGljXCIpO1xyXG5cclxuY29uc3QgY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0ZXRyaXMtYm9hcmRcIik7XHJcbmNvbnN0IGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIik7XHJcblxyXG5jb25zdCBibG9ja1dpZHRoID0gY2FudmFzLndpZHRoIC8gMTA7XHJcbmNvbnN0IGJsb2NrSGVpZ2h0ID0gY2FudmFzLmhlaWdodCAvIDIwO1xyXG5cclxuY29uc3QgY29sb3JNYXAgPSB7XHJcbiAgICBJOiBcIkN5YW5cIixcclxuICAgIE86IFwiWWVsbG93XCIsXHJcbiAgICBUOiBcIk1hZ2VudGFcIixcclxuICAgIEo6IFwiQmx1ZVwiLFxyXG4gICAgTDogXCJPcmFuZ2VcIixcclxuICAgIFM6IFwiU3ByaW5nR3JlZW5cIixcclxuICAgIFo6IFwiUmVkXCIsXHJcbn07XHJcblxyXG5sZXQgYm9hcmRNYXRyaXggPSBBcnJheSgyMClcclxuICAgIC5maWxsKFwiXCIpXHJcbiAgICAubWFwKCgpID0+IEFycmF5KDEwKS5maWxsKFwiXCIpKTtcclxuXHJcbmxldCBpc1J1bm5pbmcgPSBmYWxzZTtcclxubGV0IHNsaWRlclZhbHVlID0gMDtcclxubGV0IGRpZExvc2UgPSBmYWxzZTtcclxubGV0IHBpZWNlQ291bnRlciA9IDA7XHJcblxyXG5jb25zdCBsb29rYWhlYWRTbG90cyA9IEFycmF5LmZyb20oZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcImxvb2thaGVhZFwiKSwgKGMpID0+XHJcbiAgICBjLmdldENvbnRleHQoXCIyZFwiKVxyXG4pO1xyXG5cclxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwgYXN5bmMgKCkgPT4ge1xyXG4gICAgZHJhd0VtcHR5KCk7XHJcblxyXG4gICAgY29uc3QgY291bnRlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY291bnRlclwiKTtcclxuICAgIGZ1bmN0aW9uIGluY3JlbWVudENvdW50ZXIoKSB7XHJcbiAgICAgICAgcGllY2VDb3VudGVyKys7XHJcbiAgICAgICAgY291bnRlci5pbm5lclRleHQgPSBwaWVjZUNvdW50ZXI7XHJcbiAgICB9XHJcbiAgICBmdW5jdGlvbiByZXNldENvdW50ZXIoKSB7XHJcbiAgICAgICAgcGllY2VDb3VudGVyID0gMDtcclxuICAgICAgICBjb3VudGVyLmlubmVyVGV4dCA9IHBpZWNlQ291bnRlcjtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBzbGlkZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNwZWVkLXNsaWRlclwiKTtcclxuICAgIHNsaWRlclZhbHVlID0gKHNsaWRlci52YWx1ZSAtIDEpICoqIDQgKiAxMDAwO1xyXG5cclxuICAgIHNsaWRlci5hZGRFdmVudExpc3RlbmVyKFwiaW5wdXRcIiwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHNsaWRlclZhbHVlID0gKHNsaWRlci52YWx1ZSAtIDEpICoqIDQgKiAxMDAwO1xyXG4gICAgfSk7XHJcblxyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJkcm9wLWJ1dHRvblwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xyXG4gICAgICAgIHN0ZXBPbmUoKTtcclxuICAgIH0pO1xyXG5cclxuICAgIC8vIEtpbmRhIGN1cnNlZCBidXQgaXQgd29ya3MuXHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInN0YXJ0LXN0b3AtYnV0dG9uXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBhc3luYyAoZXZlbnQpID0+IHtcclxuICAgICAgICBpZiAoZGlkTG9zZSkge1xyXG4gICAgICAgICAgICByZXNldEJvYXJkKCk7XHJcbiAgICAgICAgICAgIGRyYXdFbXB0eSgpO1xyXG4gICAgICAgICAgICByZXNldENvdW50ZXIoKTtcclxuICAgICAgICAgICAgZGlkTG9zZSA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaXNSdW5uaW5nID0gIWlzUnVubmluZztcclxuICAgICAgICBldmVudC50YXJnZXQuaW5uZXJUZXh0ID0gaXNSdW5uaW5nID8gXCJTdG9wXCIgOiBcIlN0YXJ0XCI7XHJcblxyXG4gICAgICAgIHdoaWxlIChpc1J1bm5pbmcpIHtcclxuICAgICAgICAgICAgY29uc3QgbG9zdCA9IHN0ZXBPbmUoKTtcclxuICAgICAgICAgICAgaWYgKGxvc3QpIHtcclxuICAgICAgICAgICAgICAgIGlzUnVubmluZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgZXZlbnQudGFyZ2V0LmlubmVyVGV4dCA9IFwiU3RhcnRcIjtcclxuICAgICAgICAgICAgICAgIGRpZExvc2UgPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpbmNyZW1lbnRDb3VudGVyKCk7XHJcbiAgICAgICAgICAgIGF3YWl0IG5ldyBQcm9taXNlKChyKSA9PiBzZXRUaW1lb3V0KHIsIHNsaWRlclZhbHVlKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyZXNldC1idXR0b25cIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGFzeW5jICgpID0+IHtcclxuICAgICAgICByZXNldEJvYXJkKCk7XHJcbiAgICAgICAgZHJhd0VtcHR5KCk7XHJcbiAgICAgICAgcmVzZXRDb3VudGVyKCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInRyYWluLWJ1dHRvblwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgYXN5bmMgKCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IGFsZyA9IG5ldyBHZW5ldGljQWxnb3JpdGhtKDEwMCk7XHJcbiAgICAgICAgYWxnLnJ1bigpO1xyXG4gICAgfSk7XHJcbn0pO1xyXG5cclxuZnVuY3Rpb24gc3RlcE9uZSgpIHtcclxuICAgIGNvbnN0IG5ld0JvYXJkID0gc3RlcCgpO1xyXG4gICAgZHJhd0JvYXJkKG5ld0JvYXJkLmJvYXJkLCBuZXdCb2FyZC5waWVjZSk7XHJcbiAgICBkcmF3TG9va2FoZWFkKG5ld0JvYXJkLmxvb2thaGVhZCk7XHJcbiAgICByZXR1cm4gbmV3Qm9hcmQuaXNMb3N0O1xyXG59XHJcblxyXG5mdW5jdGlvbiBkcmF3QmxvY2soY2FudmFzLCB4LCB5LCBjb2xvcikge1xyXG4gICAgY2FudmFzLmZpbGxTdHlsZSA9IGNvbG9yO1xyXG4gICAgY2FudmFzLmZpbGxSZWN0KHgsIHksIGJsb2NrV2lkdGgsIGJsb2NrSGVpZ2h0KTtcclxuICAgIGNhbnZhcy5zdHJva2VTdHlsZSA9IFwiIzFhMWExYVwiO1xyXG4gICAgY2FudmFzLnN0cm9rZVJlY3QoeCwgeSwgYmxvY2tXaWR0aCwgYmxvY2tIZWlnaHQpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBkcmF3Qm9hcmQoYm9hcmQsIHBpZWNlKSB7XHJcbiAgICBmb3IgKGxldCByb3cgPSAwOyByb3cgPCAyMDsgcm93KyspIHtcclxuICAgICAgICBmb3IgKGxldCBjb2wgPSAwOyBjb2wgPCAxMDsgY29sKyspIHtcclxuICAgICAgICAgICAgY29uc3QgYml0ID0gKGJvYXJkW3Jvd10gPj4gKDkgLSBjb2wpKSAmIDE7XHJcbiAgICAgICAgICAgIGlmIChiaXQgIT09IDAgJiYgYm9hcmRNYXRyaXhbcm93XVtjb2xdID09PSBcIlwiKSB7XHJcbiAgICAgICAgICAgICAgICBib2FyZE1hdHJpeFtyb3ddW2NvbF0gPSBwaWVjZTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChiaXQgPT09IDApIHtcclxuICAgICAgICAgICAgICAgIGJvYXJkTWF0cml4W3Jvd11bY29sXSA9IFwiXCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29uc3QgYmxvY2sgPSBjb2xvck1hcFtib2FyZE1hdHJpeFtyb3ddW2NvbF1dO1xyXG4gICAgICAgICAgICBjb25zdCBjb2xvciA9IGJsb2NrID8gYmxvY2sgOiBcIiMwZTBlMGVcIjtcclxuICAgICAgICAgICAgZHJhd0Jsb2NrKGN0eCwgY29sICogYmxvY2tXaWR0aCwgcm93ICogYmxvY2tIZWlnaHQsIGNvbG9yKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGRyYXdMb29rYWhlYWQobG9va2FoZWFkKSB7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxvb2thaGVhZFNsb3RzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgY29uc3Qgc2xvdCA9IGxvb2thaGVhZFNsb3RzW2ldO1xyXG4gICAgICAgIHNsb3QuY2xlYXJSZWN0KDAsIDAsIHNsb3QuY2FudmFzLndpZHRoLCBzbG90LmNhbnZhcy5oZWlnaHQpO1xyXG5cclxuICAgICAgICBjb25zdCBwaWVjZSA9IFRldHJpbWlub3MuZ2V0KGxvb2thaGVhZFtpXSlbMF07XHJcbiAgICAgICAgY29uc3QgcGllY2VXaWR0aCA9IE1hdGguZmxvb3IoTWF0aC5sb2cyKHBpZWNlLnJlZHVjZSgob3IsIHgpID0+IG9yIHwgeCwgMCkpKSArIDE7XHJcblxyXG4gICAgICAgIGNvbnN0IGNvbG9yID0gY29sb3JNYXBbbG9va2FoZWFkW2ldXTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgeSA9IDA7IHkgPCBwaWVjZS5sZW5ndGg7IHkrKykge1xyXG4gICAgICAgICAgICBmb3IgKGxldCB4ID0gMDsgeCA8IHBpZWNlV2lkdGg7IHgrKykge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgYml0ID0gKHBpZWNlW3ldID4+IHgpICYgMTtcclxuICAgICAgICAgICAgICAgIGlmIChiaXQgIT09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBkcmF3QmxvY2soc2xvdCwgeSAqIGJsb2NrSGVpZ2h0LCB4ICogYmxvY2tXaWR0aCwgY29sb3IpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBkcmF3RW1wdHkoKSB7XHJcbiAgICBmb3IgKGxldCByb3cgPSAwOyByb3cgPCAyMDsgcm93KyspIHtcclxuICAgICAgICBmb3IgKGxldCBjb2wgPSAwOyBjb2wgPCAxMDsgY29sKyspIHtcclxuICAgICAgICAgICAgZHJhd0Jsb2NrKGN0eCwgY29sICogYmxvY2tXaWR0aCwgcm93ICogYmxvY2tIZWlnaHQsIFwiIzBlMGUwZVwiKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxvb2thaGVhZFNsb3RzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgY29uc3Qgc2xvdCA9IGxvb2thaGVhZFNsb3RzW2ldO1xyXG4gICAgICAgIHNsb3QuY2xlYXJSZWN0KDAsIDAsIHNsb3QuY2FudmFzLndpZHRoLCBzbG90LmNhbnZhcy5oZWlnaHQpO1xyXG4gICAgfVxyXG59XHJcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==