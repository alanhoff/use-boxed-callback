Boxed Callback
==============

This package provides a custom hook for creating immutable callback references,
similar to [pointers][0] or [bound class fields][3].

### The problem

Currently [`useCallback`][1] will return a new function whenever a dependency
updates thus triggering a rerender for all components that are receiving it as
a prop, even if the component is wrapped with the [`memo` HOC][2]. Example:

```javascript
function ClickCounter({onClick}) {
  const [clicks, setClicks] = useState(0);
  const onClick = useCallback(() => {
    setClicks(clicks + 1);
  }, [clicks]);

  return (
    <>
      <p>Clicked {clicks} times</p>
      <MyButton onClick={onClick} />
    </>
  );
}
```

Here, `<MyButton>` will always rerender when the amount of clicks changes
because we need `clicks` as a dependency inside the `onClick` callback for it
to work properly. We could easily solve this by passing a reducer to `setClicks`
instead of incrementing a variable from outside our callback:

```javascript
const onClick = useCallback(() => setClicks(amount => amount + 1, []));
```

The problem is that it's not always that easy, specially when intercepting
and forwarding props from the parent/context to the children.

### The solution

This package acts in a similar way to `useCallback` but it stores your callback
inside a mutable reference and returns an immutable function that calls the
last function stored in that reference when triggered, thus providing the same
functionality as `useCallback` with the benefit that the generated callback is
always the same:


```javascript
import useBoxedCallback from 'use-boxed-callback';

function ClickCounter({onClick}) {
  const [clicks, setClicks] = useState(0);

  // This works as expected and <MyButton> will only render a single time
  // during the whole life cycle of the component
  const onClick = useBoxedCallback(() => {
    setClicks(clicks + 1);
  });

  return (
    <>
      <p>Clicked {clicks} times</p>
      <MyButton onClick={onClick} />
    </>
  );
}
```

You can also pass additional arguments after the callback, they will be
provided as additional arguments to the callback when triggered:

```javascript
// The first arguments are the ones provided by the caller, the rest
// are the ones provided by useBoxedCallback
function incrementClicks(event, clicks, setClicks) {
  event.preventDefault();

  setClicks(clicks + 1);
}

function ClickCounter({onClick}) {
  const [clicks, setClicks] = useState(0);
  const onClick = useBoxedCallback(incrementClicks, clicks, setClicks);

  return (
    <>
      <p>Clicked {clicks} times</p>
      <button onClick={onClick}>Click me</button>
    </>
  );
}
```


### ISC License

Copyright 2019 Alan Hoffmeister

Permission to use, copy, modify, and/or distribute this software for any purpose
with or without fee is hereby granted, provided that the above copyright notice
and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND
FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS
OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER
TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF
THIS SOFTWARE.

[0]: https://en.wikipedia.org/wiki/Pointer_(computer_programming)
[1]: https://reactjs.org/docs/hooks-reference.html#usecallback
[2]: https://reactjs.org/docs/react-api.html#reactmemo
[3]: https://github.com/tc39/proposal-class-fields
