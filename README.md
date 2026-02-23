# Freely

**Freely** is a decentralized social posting platform built on the **Nostr protocol**, where users can:

* Create Posts
* Reply to Posts
* Like / Unlike Posts
* Publish content to Nostr relays
* Own their identity via cryptographic keys

Freely does **not rely on a centralized server** for content storage — posts are broadcasted and stored across **Nostr relays**.

## What is Nostr?

[Nostr](https://nostr.com) (Notes and Other Stuff Transmitted by Relays) is a decentralized protocol that enables censorship-resistant social networking using:

* Public/Private key cryptography
* Relay-based message distribution
* Event-based communication model

Freely leverages Nostr events to power decentralized social interactions.

## Architecture Overview

```
User (Public/Private Key)
        │
        ▼
 Freely Client (Web App)
        │
        ▼
   Nostr Relays (Distributed)
```

* Users sign events locally with their **private key**
* Signed events are published to multiple relays
* Other clients subscribe to relays to fetch posts

## Features

### Post Creation

* Users publish text posts (Nostr Kind `1`)
* Events are cryptographically signed
* Broadcasted to configured relays

### Reply System

* Replies are linked using `e` tags (event references)
* Threaded conversation support
* Fully relay-based

### Like / Unlike

* Likes are published as reaction events (Kind `7`)
* Unlike is handled by deleting or updating reaction events

### Decentralized Identity

* Login using Nostr private key
* No email, no password
* User identity = Public Key

## 📡 Supported Nostr Event Kinds

| Kind | Description              |
| ---- | ------------------------ |
| `0`  | User Metadata            |
| `1`  | Text Note (Post / Reply) |
| `7`  | Reaction (Like)          |
| `5`  | Delete Event             |

## Decentralization Benefits

* No central authority
* Censorship-resistant
* Portable identity
* Data ownership
* Interoperable with other Nostr clients

## Contributing

Contributions are welcome!

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Submit a Pull Request


## License

[MIT License](LICENSE)

## Vision

Freely aims to build a truly decentralized social layer where:

> Your identity is yours.
> Your content is yours.
> Your freedom is yours.

# WARNING / NOTE

1. This project is made for learning purpose.
2. Frontend is purely vibe coded (made with AI didn't care about UI/UX).
3. Private Keys are stored directly in "base64" format without encryption.
4. Importance is given to backend only but APIs can be still improved.
5. Nostr is not about privacy it's about freedom of speech without central authority.
