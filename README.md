# CyberCTF - The Capture The Flag Arena

Welcome, Operative, to the **CyberCTF Arena** — an immersive, competitive cybersecurity proving ground inspired by platforms like **PicoCTF**. Whether you are taking your first steps into ethical hacking or stress-testing your binary exploitation skills, this arena is built to challenge your analytical intuition, terminal prowess, and problem-solving speed.

---

## The Mission

In a Capture The Flag (CTF) competition, your objective is straightforward: **infiltrate targets, reverse-engineer proprietary algorithms, crack cryptographic ciphers, analyze corrupted digital evidence, and capture hidden flags**.

### Standard Flag Format
Flags in this competition follow the standard wrapper format:
```text
CTF{sample_flag_content_here}
```
* Every flag begins with `CTF{` and ends with `}`.
* Submissions are case-sensitive. Copy the exact string into the challenge modal on your dashboard.

---

## Challenge Categories

The arena features **20 battle-tested challenges** across 5 specialized domains:

### 1. Web Exploitation
* **What to expect:** Inspecting client-side source code, manipulating authentication session cookies, analyzing crawler directives (`robots.txt`), executing SQL injection (SQLi) authentication bypasses, and forging JSON Web Tokens (`alg: none` exploits).
* **Skills tested:** Browser Developer Tools, HTTP headers, Base64 encoding, SQL query structure, token validation logic.

### 2. Cryptography
* **What to expect:** Cracking historical shift ciphers (ROT13 Caesar), peeling back multi-layered encodings (Base64 + Hex + ASCII), bitwise single-byte XOR transformations, exploiting small exponent RSA ($e = 3$), and calculating discrete logarithm shared keys in Diffie-Hellman exchanges.
* **Skills tested:** Frequency analysis, modular arithmetic, XOR bitwise operations, mathematical reasoning.

### 3. Forensics & Steganography
* **What to expect:** Repairing corrupted file headers and PNG magic bytes, extracting hidden EXIF camera metadata, carving human-readable ASCII tokens from memory dump binary blobs, and decoding sequential DNS exfiltration tunnels.
* **Skills tested:** Hex editors, `exiftool`, Unix `strings`, packet and log analysis.

### 4. Reverse Engineering & Binary Exploitation (Pwn)
* **What to expect:** Disassembling JavaScript validation functions, deobfuscating array lookup routines, analyzing custom stack-based Virtual Machine (VM) bytecode, and crafting stack overflow payloads (Ret2Win) to hijack instruction pointers.
* **Skills tested:** Code tracing, stack layout understanding, assembly/bytecode analysis, payload crafting.

### 5. General Skills & Misc
* **What to expect:** Sanity checks for flag submission pipeline verification, and parsing security log streams with regular expression (Regex) token matchers.
* **Skills tested:** Pattern matching, attention to detail, command-line fundamentals.

---

## Scoring & Hint Mechanics

Every challenge is assigned a point value based on its difficulty tier:

| Difficulty Tier | Typical Points | Complexity |
|---|---|---|
| **Easy** | 25 - 100 PTS | Foundational concepts, straightforward analysis, direct inspection. |
| **Medium** | 125 - 200 PTS | Multi-step problem solving, custom decoding scripts, logical exploits. |
| **Hard** | 300 - 350 PTS | Deep analysis, protocol exploitation, mathematical attacks, binary hijacking. |

### Dynamic Hint System
Need a nudge in the right direction? Hints are available for challenges, but intelligence has a cost:
* **0 Hints Unlocked:** **100% of challenge points awarded** (1.0x multiplier)
* **1 Hint Unlocked:** **90% of challenge points awarded** (0.9x multiplier)
* **2 Hints Unlocked:** **75% of challenge points awarded** (0.75x multiplier)
* **3+ Hints Unlocked:** **50% of challenge points awarded** (0.5x multiplier)

*Choose wisely — solve challenges cleanly on your own to maximize your total score!*

---

## Real-Time Standings & Tie-Breaking

The **Global Leaderboard** ranks operatives dynamically in real time:
1. **Total Points:** The operative with the highest score takes the top position.
2. **Timestamp Tie-Breaker:** If two operatives hold the exact same score, the operative who achieved that score **earlier in time** ranks higher.

---

## Getting Started: How to Compete

1. **Create Your Operative Account:** Head to the registration portal, select your unique callsign/username, and enlist.
2. **Access the Dashboard:** Explore all 20 active challenges simultaneously. Use the difficulty filter (All, Easy, Medium, Hard) or search bar to target challenges in your domain of strength.
3. **Analyze & Exploit:** Read the mission brief, inspect provided data or code, and craft your solution.
4. **Submit Your Flag:** Paste your `CTF{...}` flag into the submission box to claim points and ascend the leaderboard.
5. **Track Your Dossier:** Check the **Profile** tab to view your solved challenges history, total score, and unlocked intelligence.

---

## Rules of Engagement

* **Respect the Infrastructure:** Do not attack, flood, or attempt denial-of-service on the platform backend or database.
* **Fair Play:** Solve challenges independently and enjoy the learning journey.
* **Have Fun & Hack Responsibly:** Think creatively, read documentation, and enjoy capturing flags!
