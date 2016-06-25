/**
 * Created by Aaron on 6/25/2016.
 */

import {EventEmitter} from "events";
import {ok as assert} from "assert";

/*
 * For a single pair of events, this will create a Promise that will resolve or reject when the associated event occurs.
 *
 * A good example is the 'end' event for resolving it, and the 'error' event for rejecting the Promise.
 *
 * This also cleans up after itself by removing the listeners once they have been triggered.
 * */
export function eventPromise( emitter, resolve_event = null, reject_event = null ) {
    assert( emitter instanceof EventEmitter );

    if( reject_event === null || reject_event === void 0 ) {
        return makeResolvablePromise( emitter, resolve_event );

    } else if( resolve_event === null || resolve_event === void 0 ) {
        return makeRejectablePromise( emitter, resolve_event );

    } else {
        return new Promise( ( resolve, reject ) => {
            function resolve_handler( ...args ) {
                emitter.removeListener( reject_event, reject_handler );
                emitter.removeListener( resolve_event, resolve_handler );

                resolve( ...args );
            }

            function reject_handler( ...args ) {
                emitter.removeListener( resolve_event, resolve_handler );
                emitter.removeListener( reject_event, reject_handler );

                reject( ...args );
            }

            emitter.addListener( resolve_event, resolve_handler );
            emitter.addListener( reject_event, reject_handler );
        } );
    }
}

function makeResolvablePromise( emitter, resolve_event ) {
    return new Promise( ( resolve ) => {
        function resolve_handler( ...args ) {
            emitter.removeListener( resolve_event, resolve_handler );

            resolve( ...args );
        }

        emitter.addListener( resolve_event, resolve_handler );
    } );
}

function makeRejectablePromise( emitter, reject_event ) {
    return new Promise( ( resolve ) => {
        function reject_handler( ...args ) {
            emitter.removeListener( reject_event, reject_handler );

            resolve( ...args );
        }

        emitter.addListener( reject_event, reject_handler );
    } );
}

/*
 * This is a more generic version of the above,
 * but also costs more to run because it has to loop through all the provided events.
 * */
export function multiEventPromise( emitter, resolve_events, reject_events ) {
    assert( emitter instanceof EventEmitter );

    return new Promise( ( resolve, reject ) => {
        function resolve_handler( ...args ) {
            for( let event of reject_events ) {
                emitter.removeListener( event, reject_handler );
            }

            for( let event of resolve_events ) {
                emitter.removeListener( event, resolve_handler );
            }

            resolve( ...args );
        }

        function reject_handler( ...args ) {
            for( let event of reject_events ) {
                emitter.removeListener( event, reject_handler );
            }

            for( let event of resolve_events ) {
                emitter.removeListener( event, resolve_handler );
            }

            reject( ...args );
        }

        for( let event of resolve_events ) {
            emitter.addListener( event, resolve_handler );
        }

        for( let event of reject_events ) {
            emitter.addListener( event, reject_handler );
        }
    } );
}
