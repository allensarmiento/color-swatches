# Color Swatches

## How To Run

### Run With Docker

```
docker-compose up --build
# Go to http://localhost:5173/
```

### Without Docker

**Prerequisites:**
* Node Version: 24.4.1

```
npm install
npm run dev
# Go to http://localhost:5173/
```

## Approach

### Option 1. Brute Force

**Method:** Fetch all colors for the 360 hue values.

This results in the worst time complexity and most API calls.

Pros:
* Since we're not being rate limited, all the API calls can be made in parallel and the time for a full render of all colors is fast
* No slowdown when endpoints fail. We can just retry the call again. If the color where the endpoint fails has already been seen, then no updates occur on the UI side

Cons:
* Excessive API calls, could be subject to rate limiting

## Option 2. Exponential Jump + Linear Backtracking

**Method:** When we encounter a new color, jump exponentially until we encounter a new color, and backtrack linearly until we hit the same color again so that we know where the start of the next color is.

Pros:
* Less API calls than Option 1 because we can skip forward

Cons:
* Can't run this in parallel because we need to know where the previous color ends before continuing onto the next.
* For large groupings, jumping too far leads to many API calls

S = 100%, L = 50% -> Total API calls: 240
S = 90%, L = 47% -> Total API calls: 194
S = 40%, L = 87% -> Total API calls: 179

## Option 3. Exponential Jump + Binary Search

**Method:** When we encounter a new color, jump exponentially until we encounter a new color, and use binary search to find the last index of the color group.

Pros:
* Less API calls than Option 1 and 2
* Best when groups are large

Cons:
* Can't run this in parallel because we need to know where the previous color ends before continuing onto the next.
* If groupings are small, then this is less effective

S = 100%, L = 50% -> Total API calls: 215
S = 90%, L = 47% -> Total API calls: 184
S = 90%, L = 47% -> Total API calls: 118

## 4. Exponential Jump + Binary Search / Linear Backtrack

S = 100%, L = 50% -> Total API calls: 215
S = 90%, L = 47% -> Total API calls: 184
S = 90%, L = 47% -> Total API calls: 118

## Additional Improvements

* Cache the results so when the user wants to search again, then no API calls are needed because the data was already fetched
