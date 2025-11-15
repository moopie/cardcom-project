# Improvements in provided code

```js
useEffect(() => {
    fetch("/api/data").then(res => res.json()).then(setData);
}, [data]);
```

## Problems

1. Dependency on a state that is later modified by the fetch forcing `useEffect` to re-render th calling component - circular dependency
2. No error handling in case the fetch returns an error from the api call

### Improvements

Remove the circular dependency and log the error

```js
useEffect(() => {
    fetch("/api/data").then(res => res.json()).then(setData).catch(err => console.error(err));
}, []);
```