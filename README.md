promisify-events
================

[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][npm-url]
[![MIT License][license-image]][npm-url]

# Intro

While many solutions like this exist, this is my take on it. It provides a single clean function to listen to an
EventEmitter and return a Promise instance that will be resolved or rejected based on the event names given.

# Quickstart
```javascript
import {createServer} from 'http';
import {promisifyEvents} from 'promisify-events';

let server = createServer(function(req, res) {
    res.end("Hello, World!");
});

promisifyEvent(server, 'listening').then(function() {
    console.log("Listening on port 8080").
});

server.listen(8080);
```

or something like

```javascript
//...
import {promisifyEvents} from 'promisify-events';
import {createWriteStream} from 'fs';
//...

let stream = createWriteStream("save.dat");

promisiftEvents(stream, 'end', 'error').then(function() {
    console.log("Save complete.");
}).catch(function(err) {
    console.error("Error saving:", err);
});

```

You can even use multiple events or a combination of single and multiple events.

```javascript
promisifyEvents(someEmitter, ['success', 'end', 'done'], 'error').then(function() {
    console.log("Finished");
}).catch(function(err) {
    console.error("Error: ", err);
});
```

# Reference

##### `promisifyEvents(emitter: EventEmitter, resolve_events?: string|array<string>, reject_events?: string|array<string>) -> Promise<any>`

If any of the events produce more than one value, they will be resolved as an array, since only one value can be resolved.

# Support
* [Github issues for bugs and feature requests](/issues)
* Email me at [novacrazy@gmail.com](mailto://novacrazy@gmail.com) for help and advice.

# License
The MIT License (MIT)

Copyright (c) 2015-2016 Aaron Trent

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.


[npm-image]: https://img.shields.io/npm/v/promisify-events.svg?style=flat
[npm-url]: https://npmjs.org/package/promisify-events
[downloads-image]: https://img.shields.io/npm/dm/promisify-events.svg?style=flat
[license-image]: https://img.shields.io/npm/l/promisify-events.svg?style=flat