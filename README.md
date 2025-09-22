# Color Swatches

## Design Choice Considerations

The approach taken for this is Option 3: Exponential Jump + Binary Search. Since colors are grouped together, jumping exponentially reduces the number of API calls. When encountering a different color, we know that the last color in the group must exist within the search space. Using a binary search approach lets us reduce the number of API calls especially when the groupings are very large. Option 4 of combining both linear and binary search for finding the end of the group doesn't appear to be offering much gain in runtime.

For the frontend implementation, being able to cache data is helpful to reduce API calls. If we've already called the API for the given HSL values, then we shouldn't call it again. To give better feedback to the user, finding a new color will render it immediately. This is done by dispatching the event. If we had waited the entire time, users may not get any feedback for over 20 seconds which is poor user experience.

If we didn't care about reducing API calls, the brute force approach gives the fastest time to render. This is due to being able to call all the endpoints in parallel. If the endpoints fail, we can easily retry and the user might not even notice. However for the other approaches, endpoints failing will cause the final result to take longer because we are dependent on locating the positions of previous color groups.

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
 
S = 100%, L = 50% -> Total API calls: 360, 4.25s
S = 90%, L = 47% -> Total API calls: 360, 7.65s

## Option 2. Exponential Jump + Linear Backtracking

**Method:** When we encounter a new color, jump exponentially until we encounter a new color, and backtrack linearly until we hit the same color again so that we know where the start of the next color is.

Pros:
* Less API calls than Option 1 because we can skip forward

Cons:
* Can't run this in parallel because we need to know where the previous color ends before continuing onto the next.
* For large groupings, jumping too far leads to many API calls when backtracking

S = 100%, L = 50% -> Total API calls: 240, 23.05s
S = 90%, L = 47% -> Total API calls: 194, 24.48s

## Option 3. Exponential Jump + Binary Search

**Method:** When we encounter a new color, jump exponentially until we encounter a new color, and use binary search to find the last index of the color group.

Pros:
* Less API calls than Option 1 and 2
* Best when groups are large

Cons:
* Can't run this in parallel because we need to know where the previous color ends before continuing onto the next.
* If groupings are small, then this is less effective

S = 100%, L = 50% -> Total API calls: 215, 21.18s
S = 90%, L = 47% -> Total API calls: 184, 22.93s
S = 100%, L = 39% -> Total API calls: 197, 21.24s
S = 66%, L = 22% -> Total API calls: 139, 17.68s
S = 0%, L = 0% -> Total API calls: 11, 6.94s

## Option 4. Exponential Jump + Binary Search / Linear Backtrack

**Method:** This combines linear backtracking when we have a distance <= 4 and binary search when dealing with a larger search space. If all groups happen to be small, then we benefit from linear backtracking. Although in this case the number of API calls appear to be the same as Option 3.

S = 100%, L = 50% -> Total API calls: 215, 20.98s
S = 90%, L = 47% -> Total API calls: 184, 23.99s
S = 100%, L = 39% -> Total API calls: 197, 20.34s
S = 66%, L = 22% -> Total API calls: 139, 17.20s
S = 0%, L = 0% -> Total API calls: 11, 7.43s
