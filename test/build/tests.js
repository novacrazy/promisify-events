'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function( obj ) {
    return typeof obj;
} : function( obj ) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
};
/**
 * Created by Aaron on 7/1/2016.
 */

var _assert = require( 'assert' );

var _events = require( 'events' );

var _ = require( '../../' );

describe( "Existence", function() {
    it( "Should export the promisifyEvents function", function() {
        (0, _assert.strictEqual)( typeof _.promisifyEvents === 'undefined' ? 'undefined' : _typeof( _.promisifyEvents ),
            'function', 'promisifyEvents not exported as a function' );
    } );
} );

describe( "Basic event handling", function() {
    var emitter = new _events.EventEmitter();

    it( "Should resolve on given event", function( done ) {
        (0, _.promisifyEvents)( emitter, 'good' ).then( function( value ) {
            (0, _assert.strictEqual)( value[0], 42 );

            done();
        } ).catch( done );

        emitter.emit( 'good', 42 );
    } );

    it( "Should reject on given event", function( done ) {
        (0, _.promisifyEvents)( emitter, null, 'bad' ).catch( function() {
            return done();
        } );

        emitter.emit( 'bad' );
    } );

    it( 'should resolve on any given event', function( done ) {
        (0, _.promisifyEvents)( emitter, ['good2', 'alsoGood'] ).then( function() {
            return done();
        } ).catch( done );

        (0, _assert.strictEqual)( emitter.listeners( 'good2' ).length, 1 );
        (0, _assert.strictEqual)( emitter.listeners( 'alsoGood' ).length, 1 );

        emitter.emit( 'alsoGood' );
    } );

    it( "Should reject on any given event", function( done ) {
        (0, _.promisifyEvents)( emitter, null, ['bad2', 'alsoBad'] ).catch( function() {
            return done();
        } );

        emitter.emit( 'alsoBad' );
    } );

    it( "Should remove any listeners once the event has been triggered", function( done ) {
        (0, _.promisifyEvents)( emitter, ['goody', 'goody2shoes'] ).then( function() {
            (0, _assert.strictEqual)( emitter.listeners( 'goody' ).length, 0 );
            (0, _assert.strictEqual)( emitter.listeners( 'goody2shoes' ).length, 0 );

            done();
        } ).catch( done );

        emitter.emit( 'goody' );
    } );
} );
