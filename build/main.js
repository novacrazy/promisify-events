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

/**
 * Created by Aaron on 6/25/2016.
 */

function promisifyEvents( emitter, resolve_events, reject_events ) {
    (0, _assert.ok)( emitter instanceof _events.EventEmitter );

    if( !Array.isArray( resolve_events ) ) {
        resolve_events = resolve_events ? [resolve_events] : [];
    } else {
        resolve_events = resolve_events.filter( function( x ) {
            return !!x;
        } );
    }

    if( !Array.isArray( reject_events ) ) {
        reject_events = reject_events ? [reject_events] : [];
    } else {
        reject_events = reject_events.filter( function( x ) {
            return !!x;
        } );
    }

    return new Promise( function( resolve, reject ) {
        function resolve_handler() {
            for( var _iterator = reject_events, _isArray = Array.isArray( _iterator ), _i = 0, _iterator = _isArray ?
                                                                                                           _iterator :
                                                                                                           _iterator[Symbol.iterator](); ; ) {
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

                emitter.removeListener( event, reject_handler );
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

                var _event = _ref2;

                emitter.removeListener( _event, resolve_handler );
            }

            for( var _len = arguments.length, args = Array( _len ), _key = 0; _key < _len; _key++ ) {
                args[_key] = arguments[_key];
            }

            resolve( args );
        }

        function reject_handler() {
            for( var _iterator3 = reject_events, _isArray3 = Array.isArray(
                _iterator3 ), _i3                          = 0, _iterator3          = _isArray3 ? _iterator3 : _iterator3[Symbol.iterator](); ; ) {
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

                emitter.removeListener( event, reject_handler );
            }

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

                var _event2 = _ref4;

                emitter.removeListener( _event2, resolve_handler );
            }

            for( var _len2 = arguments.length, args = Array( _len2 ), _key2 = 0; _key2 < _len2; _key2++ ) {
                args[_key2] = arguments[_key2];
            }

            reject( args );
        }

        for( var _iterator5 = resolve_events, _isArray5 = Array.isArray( _iterator5 ), _i5 = 0, _iterator5 = _isArray5 ?
                                                                                                             _iterator5 :
                                                                                                             _iterator5[Symbol.iterator](); ; ) {
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

        for( var _iterator6 = reject_events, _isArray6 = Array.isArray( _iterator6 ), _i6 = 0, _iterator6 = _isArray6 ?
                                                                                                            _iterator6 :
                                                                                                            _iterator6[Symbol.iterator](); ; ) {
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

            var _event3 = _ref6;

            emitter.addListener( _event3, reject_handler );
        }
    } );
}
