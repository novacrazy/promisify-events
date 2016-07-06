/**
 * Created by Aaron on 6/25/2016.
 */

import {EventEmitter} from "events";
import {ok as assert} from "assert";

export function promisifyEvents( emitter, resolve_events, reject_events ) {
    assert( emitter instanceof EventEmitter );

    if( !Array.isArray( resolve_events ) ) {
        resolve_events = resolve_events ? [resolve_events] : [];

    } else {
        resolve_events = resolve_events.filter( x => !!x );
    }

    if( !Array.isArray( reject_events ) ) {
        reject_events = reject_events ? [reject_events] : [];

    } else {
        reject_events = reject_events.filter( x => !!x );
    }

    return new Promise( ( resolve, reject ) => {
        function resolve_handler( ...args ) {
            for( let event of reject_events ) {
                emitter.removeListener( event, reject_handler );
            }

            for( let event of resolve_events ) {
                emitter.removeListener( event, resolve_handler );
            }

            resolve( args );
        }

        function reject_handler( ...args ) {
            for( let event of reject_events ) {
                emitter.removeListener( event, reject_handler );
            }

            for( let event of resolve_events ) {
                emitter.removeListener( event, resolve_handler );
            }

            reject( args );
        }

        for( let event of resolve_events ) {
            emitter.addListener( event, resolve_handler );
        }

        for( let event of reject_events ) {
            emitter.addListener( event, reject_handler );
        }
    } );
}