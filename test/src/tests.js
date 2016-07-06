/**
 * Created by Aaron on 7/1/2016.
 */

import {strictEqual} from "assert";
import {EventEmitter} from "events";
import {promisifyEvents} from "../../";

describe( "Existence", function() {
    it( "Should export the promisifyEvents function", function() {
        strictEqual( typeof promisifyEvents, 'function', 'promisifyEvents not exported as a function' );
    } );
} );

describe( "Basic event handling", function() {
    let emitter = new EventEmitter();

    it( "Should resolve on given event", function( done ) {
        promisifyEvents( emitter, 'good' ).then( value => {
            strictEqual( value[0], 42 );

            done();
        } ).catch( done );

        emitter.emit( 'good', 42 );
    } );

    it( "Should reject on given event", function( done ) {
        promisifyEvents( emitter, null, 'bad' ).catch( () => done() );

        emitter.emit( 'bad' );
    } );

    it( 'should resolve on any given event', function( done ) {
        promisifyEvents( emitter, ['good2', 'alsoGood'] ).then( () => done() ).catch( done );

        strictEqual( emitter.listeners( 'good2' ).length, 1 );
        strictEqual( emitter.listeners( 'alsoGood' ).length, 1 );

        emitter.emit( 'alsoGood' );
    } );

    it( "Should reject on any given event", function( done ) {
        promisifyEvents( emitter, null, ['bad2', 'alsoBad'] ).catch( () => done() );

        emitter.emit( 'alsoBad' );
    } );

    it( "Should remove any listeners once the event has been triggered", function( done ) {
        promisifyEvents( emitter, ['goody', 'goody2shoes'] ).then( function() {
            strictEqual( emitter.listeners( 'goody' ).length, 0 );
            strictEqual( emitter.listeners( 'goody2shoes' ).length, 0 );

            done();

        } ).catch( done );

        emitter.emit( 'goody' );
    } );
} );