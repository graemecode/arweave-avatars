# ArweaveAvatars

ArweaveAvatars is a library that makes it easy to load avatars for given Arweave addresses into your app.

## Install

Add the current release to your project:

```
$ npm install --save arweave-avatars
```

Or, using Yarn:

```
$ yarn add arweave-avatars
```

## Usage

Use the library to pull an Avatar from the Arweave network:

```javascript
const { getAvatarsForAddress } = require("arweave-avatars");

let address = "Ky1c1Kkt-jZ9sY1hvLF5nCf6WWdBhIU5Un_BMYh-t3c";
let avatars = await getAvatarsForAddress(address);
console.log(avatars);
 // => [
 //   {
 //       contentType: "image/png",
 //       src: "data:image/png;base64,Ix...",
 //       rawData: "Ix..."
 //       transactionId: "..."
 //   }
 // ]

const [latestAvatar] = avatars;
```

Given a response, use the `src` field to display the Avatar in your image element:
```jsx harmony
<div>
    <img src={latestAvatar.src}/>
</div>
```
