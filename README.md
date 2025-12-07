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

## 🛠️ Support & Compatibility

Voltronite currently provides multi-chapter Fortnite support with
varying levels of stability and feature completeness:

### ✔️ Fully Supported & Stable

- **Chapter 3** --- Fully working (tested on 19.10)
- **Chapter 4** --- Fully working, except some matchmaking limitations on some version. (Tested on 23.50 and 27.11)
- **Chapter 5** --- Fully working (tested on 28.30)

### ⚠️ Partially Supported

- **Chapter 2** --- Fully working but with limited testing.

### 🔬 Experimental

- **Chapter 1** --- Not fully tested yet; and missing some mcp operations.

---

## 📜 License

This project is licensed for **free personal and educational use only**.

- ✅ You may use, modify, and run this backend for your own personal
  or educational purposes.
- ❌ Commercial use, resale, or redistribution of this project is not
  permitted without explicit permission from the author.

By using this software, you agree to the above terms.

---
