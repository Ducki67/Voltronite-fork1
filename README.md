# Voltronite

Voltronite is an **OGFN backend** used to simulate or emulate Fortnite
services, allowing connections on older versions of the game.

---

## 🚀 Features

- Simulates Fortnite services for older clients
- Simple setup and lightweight
- Runs on [Bun](https://bun.sh) for speed and efficiency

---

## 📦 Installation

1.  **Install Bun**\
    Download and install Bun from https://bun.sh.

2.  **Setup .env**\
    Rename .env.example to .env and fill it up to your liking.

3.  **Install dependencies**

    ```bash
    bun install
    ```

4.  **Run the backend**

    ```bash
    bun run src/index.ts
    ```

---
## How to set up matchmaking
1. **Load up a OG build**\
    Get any builds from [*here*](https://github.com/llamaqwerty/fortnite-builds-archive)
2. **Use Erbium GameServer**\
    Make sure to use Erbium ot Other GS that supports your version(s)
3. **Ip & port** (for each user)\
    In lobby make sure to click on *Custom key* and type: **`127.0.0.1:7777`**. So **`IP:GsPort`**\
    <img width="350" height="375" alt="image" src="https://github.com/user-attachments/assets/42e477df-4470-4e2e-9215-410020cf0578" /> \
    After that click on *Accept* and start queing / MatchMaking to any gamemode. (it will depend on the GS and its playlist)

Yay! you made it now you should get into your match :)

---
## 🛠️ Support & Compatibility

Voltronite currently provides multi-chapter Fortnite support with
varying levels of stability and feature completeness:

### ✔️ Support for Chapters

- **Chapter 1** --- Fully working (tested on 7.40)
- **Chapter 2** --- Working but limited testing.
- **Chapter 3** --- Fully working (tested on 19.10)
- **Chapter 4** --- Fully working, except some matchmaking limitations on some version. (Tested on 23.50 and 27.11)
- **Chapter 5** --- Fully working (tested on 28.30)

**Recomended to use [*Erbium*](https://github.com/plooshi/Erbium) as GameServer for chapters 3+ and for to matchmake to.**
---

## 📜 License

This project is licensed for **free personal and educational use only**.

- ✅ You may use, modify, and run this backend for your own personal
  or educational purposes.
- ❌ Commercial use, resale, or redistribution of this project is not
  permitted without explicit permission from the author.

By using this software, you agree to the above terms.

---
