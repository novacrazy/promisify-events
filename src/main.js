/**
 * Created by Aaron on 6/25/2016.
 */

import {EventEmitter} from "events";
import {ok as assert} from "assert";

/*
 * Although the generated code for all this is hideous, at least it's as fast as possible.
 * */

//Just put this here to avoid any easy import mistakes
promisifyEvents.promisifyEvents = promisifyEvents;

export default function promisifyEvents( emitter, resolve_event, reject_event ) {
    assert( emitter instanceof EventEmitter );

    let resolveMany = Array.isArray( resolve_event );
    let rejectMany  = Array.isArray( reject_event );

    if( resolveMany || rejectMany ) {
        if( resolveMany && resolve_event.length < 2 ) {
            resolveMany   = false;
            resolve_event = resolve_event.length === 0 ? false : resolve_event[0];
        }

        if( rejectMany && reject_event.length < 2 ) {
            rejectMany   = false;
            reject_event = reject_event.length === 0 ? false : reject_event[0];
        }
    }

    if( resolveMany || rejectMany ) {
        if( resolveMany && rejectMany && (resolve_event.length > 0 && reject_event.length > 0 ) ) {
            return makeMultiBothPromise( emitter, resolve_event, reject_event );

        } else if( resolveMany && resolve_event.length > 0 ) {
            return makeMultiResolvablePromise( emitter, resolve_event, reject_event );

        } else if( rejectMany && reject_event.length > 0 ) {
            return makeMultiRejectablePromise( emitter, resolve_event, reject_event );
        }

    } else if( !resolve_event && reject_event ) {
        return makeRejectablePromise( emitter, reject_event );

    } else if( !reject_event && resolve_event ) {
        return makeResolvablePromise( emitter, resolve_event );

    } else if( reject_event && resolve_event ) {
        return makeBothPromise( emitter, resolve_event, reject_event );

    } else {
        throw new Error( "At least one event must be specified" );
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

function makeBothPromise( emitter, resolve_event, reject_event ) {
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

function makeMultiResolvablePromise( emitter, resolve_events, reject_event ) {
    if( !reject_event ) {
        return new Promise( ( resolve, reject ) => {
            function resolve_handler( ...args ) {
                for( let event of resolve_events ) {
                    emitter.removeListener( event, resolve_handler );
                }

                resolve( ...args );
            }

            for( let event of resolve_events ) {
                emitter.addListener( event, resolve_handler );
            }
        } );

    } else {
        return new Promise( ( resolve, reject ) => {
            function resolve_handler( ...args ) {
                emitter.removeListener( reject_event, reject_handler );

                for( let event of resolve_events ) {
                    emitter.removeListener( event, resolve_handler );
                }

                resolve( ...args );
            }

            function reject_handler( ...args ) {
                emitter.removeListener( reject_event, reject_handler );

                for( let event of resolve_events ) {
                    emitter.removeListener( event, resolve_handler );
                }

                reject( ...args );
            }

            for( let event of resolve_events ) {
                emitter.addListener( event, resolve_handler );
            }

            emitter.addListener( reject_event, reject_handler );
        } );
    }
}

function makeMultiRejectablePromise( emitter, resolve_event, reject_events ) {
    if( !resolve_event ) {
        return new Promise( ( resolve, reject ) => {
            function reject_handler( ...args ) {
                for( let event of reject_events ) {
                    emitter.removeListener( event, reject_handler );
                }

                reject( ...args );
            }

            for( let event of reject_events ) {
                emitter.addListener( event, reject_handler );
            }
        } );

    } else {
        return new Promise( ( resolve, reject ) => {
            function resolve_handler( ...args ) {
                emitter.removeListener( resolve_event, resolve_handler );

                for( let event of reject_events ) {
                    emitter.removeListener( event, resolve_handler );
                }

                resolve( ...args );
            }

            function reject_handler( ...args ) {
                emitter.removeListener( resolve_event, resolve_handler );

                for( let event of reject_events ) {
                    emitter.removeListener( event, reject_handler );
                }

                reject( ...args );
            }

            for( let event of reject_events ) {
                emitter.addListener( event, reject_handler );
            }

            emitter.addListener( resolve_event, resolve_handler );
        } );
    }
}

function makeMultiBothPromise( emitter, resolve_events, reject_events ) {
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
