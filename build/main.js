/****
 * The MIT License (MIT)
 *
 * Copyright (c) 2015-2016 Aaron Trent
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 ****/
"use strict";

exports.__esModule      = true;
exports.promisifyEvents = promisifyEvents;

var _events = require( "events" );

var _assert = require( "assert" );

/*
 * Although the generated code for all this is hideous, at least it's as fast as possible.
 * */

/**
 * Created by Aaron on 6/25/2016.
 */

function promisifyEvents( emitter, resolve_event, reject_event ) {
    (0, _assert.ok)( emitter instanceof _events.EventEmitter );

    var resolveMany = Array.isArray( resolve_event );
    var rejectMany  = Array.isArray( reject_event );

    if( resolveMany || rejectMany ) {
        if( resolveMany && rejectMany ) {
            return makeMultiBothPromise( emitter, resolve_event, reject_event );
        } else if( resolveMany ) {
            return makeMultiResolvablePromise( emitter, resolve_event, reject_event );
        } else {
            return makeMultiRejectablePromise( emitter, resolve_event, reject_event );
        }
    } else if( !resolve_event ) {
        return makeRejectablePromise( emitter, reject_event );
    } else if( !reject_event ) {
        return makeResolvablePromise( emitter, resolve_event );
    } else {
        return makeBothPromise( emitter, resolve_event, reject_event );
    }
}

function makeResolvablePromise( emitter, resolve_event ) {
    return new Promise( function( resolve ) {
        function resolve_handler() {
            emitter.removeListener( resolve_event, resolve_handler );

            resolve.apply( void 0, arguments );
        }

        emitter.addListener( resolve_event, resolve_handler );
    } );
}

function makeRejectablePromise( emitter, reject_event ) {
    return new Promise( function( resolve ) {
        function reject_handler() {
            emitter.removeListener( reject_event, reject_handler );

            resolve.apply( void 0, arguments );
        }

        emitter.addListener( reject_event, reject_handler );
    } );
}

function makeBothPromise( emitter, resolve_event, reject_event ) {
    return new Promise( function( resolve, reject ) {
        function resolve_handler() {
            emitter.removeListener( reject_event, reject_handler );
            emitter.removeListener( resolve_event, resolve_handler );

            resolve.apply( void 0, arguments );
        }

        function reject_handler() {
            emitter.removeListener( resolve_event, resolve_handler );
            emitter.removeListener( reject_event, reject_handler );

            reject.apply( void 0, arguments );
        }

        emitter.addListener( resolve_event, resolve_handler );
        emitter.addListener( reject_event, reject_handler );
    } );
}

function makeMultiResolvablePromise( emitter, resolve_events, reject_event ) {
    if( !reject_event ) {
        return new Promise( function( resolve, reject ) {
            function resolve_handler() {
                for( var _iterator = resolve_events, _isArray = Array.isArray(
                    _iterator ), _i                           = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator](); ; ) {
                    var _ref;

                    if( _isArray ) {
                        if( _i >= _iterator.length ) {
                            break;
                        }
                        _ref = _iterator[_i++];
                    } else {
                        _i = _iterator.next();
                        if( _i.done ) {
                            break;
                        }
                        _ref = _i.value;
                    }

                    var event = _ref;

                    emitter.removeListener( event, resolve_handler );
                }

                resolve.apply( void 0, arguments );
            }

            for( var _iterator2 = resolve_events, _isArray2 = Array.isArray(
                _iterator2 ), _i2                           = 0, _iterator2           = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator](); ; ) {
                var _ref2;

                if( _isArray2 ) {
                    if( _i2 >= _iterator2.length ) {
                        break;
                    }
                    _ref2 = _iterator2[_i2++];
                } else {
                    _i2 = _iterator2.next();
                    if( _i2.done ) {
                        break;
                    }
                    _ref2 = _i2.value;
                }

                var event = _ref2;

                emitter.addListener( event, resolve_handler );
            }
        } );
    } else {
        return new Promise( function( resolve, reject ) {
            function resolve_handler() {
                emitter.removeListener( reject_event, reject_handler );

                for( var _iterator3 = resolve_events, _isArray3 = Array.isArray(
                    _iterator3 ), _i3                           = 0, _iterator3           = _isArray3 ? _iterator3 : _iterator3[Symbol.iterator](); ; ) {
                    var _ref3;

                    if( _isArray3 ) {
                        if( _i3 >= _iterator3.length ) {
                            break;
                        }
                        _ref3 = _iterator3[_i3++];
                    } else {
                        _i3 = _iterator3.next();
                        if( _i3.done ) {
                            break;
                        }
                        _ref3 = _i3.value;
                    }

                    var event = _ref3;

                    emitter.removeListener( event, resolve_handler );
                }

                resolve.apply( void 0, arguments );
            }

            function reject_handler() {
                emitter.removeListener( reject_event, reject_handler );

                for( var _iterator4 = resolve_events, _isArray4 = Array.isArray(
                    _iterator4 ), _i4                           = 0, _iterator4 = _isArray4 ? _iterator4 : _iterator4[Symbol.iterator](); ; ) {
                    var _ref4;

                    if( _isArray4 ) {
                        if( _i4 >= _iterator4.length ) {
                            break;
                        }
                        _ref4 = _iterator4[_i4++];
                    } else {
                        _i4 = _iterator4.next();
                        if( _i4.done ) {
                            break;
                        }
                        _ref4 = _i4.value;
                    }

                    var event = _ref4;

                    emitter.removeListener( event, resolve_handler );
                }

                reject.apply( void 0, arguments );
            }

            for( var _iterator5 = resolve_events, _isArray5 = Array.isArray(
                _iterator5 ), _i5                           = 0, _iterator5           = _isArray5 ? _iterator5 : _iterator5[Symbol.iterator](); ; ) {
                var _ref5;

                if( _isArray5 ) {
                    if( _i5 >= _iterator5.length ) {
                        break;
                    }
                    _ref5 = _iterator5[_i5++];
                } else {
                    _i5 = _iterator5.next();
                    if( _i5.done ) {
                        break;
                    }
                    _ref5 = _i5.value;
                }

                var event = _ref5;

                emitter.addListener( event, resolve_handler );
            }

            emitter.addListener( reject_event, reject_handler );
        } );
    }
}

function makeMultiRejectablePromise( emitter, resolve_event, reject_events ) {
    if( !resolve_event ) {
        return new Promise( function( resolve, reject ) {
            function reject_handler() {
                for( var _iterator6 = reject_events, _isArray6 = Array.isArray(
                    _iterator6 ), _i6                          = 0, _iterator6 = _isArray6 ? _iterator6 : _iterator6[Symbol.iterator](); ; ) {
                    var _ref6;

                    if( _isArray6 ) {
                        if( _i6 >= _iterator6.length ) {
                            break;
                        }
                        _ref6 = _iterator6[_i6++];
                    } else {
                        _i6 = _iterator6.next();
                        if( _i6.done ) {
                            break;
                        }
                        _ref6 = _i6.value;
                    }

                    var event = _ref6;

                    emitter.removeListener( event, reject_handler );
                }

                reject.apply( void 0, arguments );
            }

            for( var _iterator7 = reject_events, _isArray7 = Array.isArray(
                _iterator7 ), _i7                          = 0, _iterator7          = _isArray7 ? _iterator7 : _iterator7[Symbol.iterator](); ; ) {
                var _ref7;

                if( _isArray7 ) {
                    if( _i7 >= _iterator7.length ) {
                        break;
                    }
                    _ref7 = _iterator7[_i7++];
                } else {
                    _i7 = _iterator7.next();
                    if( _i7.done ) {
                        break;
                    }
                    _ref7 = _i7.value;
                }

                var event = _ref7;

                emitter.addListener( event, reject_handler );
            }
        } );
    } else {
        return new Promise( function( resolve, reject ) {
            function resolve_handler() {
                emitter.removeListener( resolve_event, resolve_handler );

                for( var _iterator8 = reject_events, _isArray8 = Array.isArray(
                    _iterator8 ), _i8                          = 0, _iterator8          = _isArray8 ? _iterator8 : _iterator8[Symbol.iterator](); ; ) {
                    var _ref8;

                    if( _isArray8 ) {
                        if( _i8 >= _iterator8.length ) {
                            break;
                        }
                        _ref8 = _iterator8[_i8++];
                    } else {
                        _i8 = _iterator8.next();
                        if( _i8.done ) {
                            break;
                        }
                        _ref8 = _i8.value;
                    }

                    var event = _ref8;

                    emitter.removeListener( event, resolve_handler );
                }

                resolve.apply( void 0, arguments );
            }

            function reject_handler() {
                emitter.removeListener( resolve_event, resolve_handler );

                for( var _iterator9 = reject_events, _isArray9 = Array.isArray(
                    _iterator9 ), _i9                          = 0, _iterator9          = _isArray9 ? _iterator9 : _iterator9[Symbol.iterator](); ; ) {
                    var _ref9;

                    if( _isArray9 ) {
                        if( _i9 >= _iterator9.length ) {
                            break;
                        }
                        _ref9 = _iterator9[_i9++];
                    } else {
                        _i9 = _iterator9.next();
                        if( _i9.done ) {
                            break;
                        }
                        _ref9 = _i9.value;
                    }

                    var event = _ref9;

                    emitter.removeListener( event, reject_handler );
                }

                reject.apply( void 0, arguments );
            }

            for( var _iterator10 = reject_events, _isArray10 = Array.isArray(
                _iterator10 ), _i10                          = 0, _iterator10 = _isArray10 ? _iterator10 : _iterator10[Symbol.iterator](); ; ) {
                var _ref10;

                if( _isArray10 ) {
                    if( _i10 >= _iterator10.length ) {
                        break;
                    }
                    _ref10 = _iterator10[_i10++];
                } else {
                    _i10 = _iterator10.next();
                    if( _i10.done ) {
                        break;
                    }
                    _ref10 = _i10.value;
                }

                var event = _ref10;

                emitter.addListener( event, reject_handler );
            }

            emitter.addListener( resolve_event, resolve_handler );
        } );
    }
}

function makeMultiBothPromise( emitter, resolve_events, reject_events ) {
    return new Promise( function( resolve, reject ) {
        function resolve_handler() {
            for( var _iterator11 = reject_events, _isArray11 = Array.isArray(
                _iterator11 ), _i11                          = 0, _iterator11 = _isArray11 ? _iterator11 : _iterator11[Symbol.iterator](); ; ) {
                var _ref11;

                if( _isArray11 ) {
                    if( _i11 >= _iterator11.length ) {
                        break;
                    }
                    _ref11 = _iterator11[_i11++];
                } else {
                    _i11 = _iterator11.next();
                    if( _i11.done ) {
                        break;
                    }
                    _ref11 = _i11.value;
                }

                var event = _ref11;

                emitter.removeListener( event, reject_handler );
            }

            for( var _iterator12 = resolve_events, _isArray12 = Array.isArray(
                _iterator12 ), _i12                           = 0, _iterator12          = _isArray12 ? _iterator12 : _iterator12[Symbol.iterator](); ; ) {
                var _ref12;

                if( _isArray12 ) {
                    if( _i12 >= _iterator12.length ) {
                        break;
                    }
                    _ref12 = _iterator12[_i12++];
                } else {
                    _i12 = _iterator12.next();
                    if( _i12.done ) {
                        break;
                    }
                    _ref12 = _i12.value;
                }

                var _event = _ref12;

                emitter.removeListener( _event, resolve_handler );
            }

            resolve.apply( void 0, arguments );
        }

        function reject_handler() {
            for( var _iterator13 = reject_events, _isArray13 = Array.isArray(
                _iterator13 ), _i13                          = 0, _iterator13 = _isArray13 ? _iterator13 : _iterator13[Symbol.iterator](); ; ) {
                var _ref13;

                if( _isArray13 ) {
                    if( _i13 >= _iterator13.length ) {
                        break;
                    }
                    _ref13 = _iterator13[_i13++];
                } else {
                    _i13 = _iterator13.next();
                    if( _i13.done ) {
                        break;
                    }
                    _ref13 = _i13.value;
                }

                var event = _ref13;

                emitter.removeListener( event, reject_handler );
            }

            for( var _iterator14 = resolve_events, _isArray14 = Array.isArray(
                _iterator14 ), _i14                           = 0, _iterator14          = _isArray14 ? _iterator14 : _iterator14[Symbol.iterator](); ; ) {
                var _ref14;

                if( _isArray14 ) {
                    if( _i14 >= _iterator14.length ) {
                        break;
                    }
                    _ref14 = _iterator14[_i14++];
                } else {
                    _i14 = _iterator14.next();
                    if( _i14.done ) {
                        break;
                    }
                    _ref14 = _i14.value;
                }

                var _event2 = _ref14;

                emitter.removeListener( _event2, resolve_handler );
            }

            reject.apply( void 0, arguments );
        }

        for( var _iterator15 = resolve_events, _isArray15 = Array.isArray(
            _iterator15 ), _i15                           = 0, _iterator15 = _isArray15 ? _iterator15 : _iterator15[Symbol.iterator](); ; ) {
            var _ref15;

            if( _isArray15 ) {
                if( _i15 >= _iterator15.length ) {
                    break;
                }
                _ref15 = _iterator15[_i15++];
            } else {
                _i15 = _iterator15.next();
                if( _i15.done ) {
                    break;
                }
                _ref15 = _i15.value;
            }

            var event = _ref15;

            emitter.addListener( event, resolve_handler );
        }

        for( var _iterator16 = reject_events, _isArray16 = Array.isArray(
            _iterator16 ), _i16                          = 0, _iterator16         = _isArray16 ? _iterator16 : _iterator16[Symbol.iterator](); ; ) {
            var _ref16;

            if( _isArray16 ) {
                if( _i16 >= _iterator16.length ) {
                    break;
                }
                _ref16 = _iterator16[_i16++];
            } else {
                _i16 = _iterator16.next();
                if( _i16.done ) {
                    break;
                }
                _ref16 = _i16.value;
            }

            var _event3 = _ref16;

            emitter.addListener( _event3, reject_handler );
        }
    } );
}
