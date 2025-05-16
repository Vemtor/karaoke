## ⚛️ React Native Setup (with Expo)

**NOTICE:** The steps below have been verified to work on **Expo CLI + Android Phone**.  
If you're using a different setup (e.g., iOS, custom workflow, or bare React Native), please refer to the official [Expo documentation](https://docs.expo.dev/get-started/start-developing/) or relevant GitHub threads for help.

This project uses **[Expo](https://expo.dev/)** — a framework and platform for universal React apps — to streamline development and deployment.

If you run into any problems, check the official [Expo docs](https://docs.expo.dev/get-started/start-developing/).

---

### 🧱 Prerequisites

- [Node.js](https://nodejs.org/en/)
- npm or yarn
- Expo CLI

You can install Node.js using any package manager. Below is an example setup using [`fnm`](https://github.com/Schniz/fnm) and Node.js v22:

```bash
# Install fnm (Fast Node Manager)
curl -o- https://fnm.vercel.app/install | bash

# Install Node.js v22
fnm install 22

# Check Node.js version
node -v # Should print something like "v22.14.0"

# Check npm version
npm -v # Should print something like "10.9.2"
```

---

### 📦 Install Project Dependencies

Navigate to the frontend directory and install all dependencies:

```bash
cd frontend
npm install
```

---

### 🚀 Install Expo CLI

To install Expo CLI globally:

```bash
npm install -g expo-cli
```

> 📘 Official Expo CLI installation guide: [https://docs.expo.dev/get-started/installation/](https://docs.expo.dev/get-started/installation/)

---

### 🧪 Start Development Server

To start the Expo development server:

```bash
npx expo start
```

Once the server is running, you can preview the app using one of the following methods:

- Press `a` to open in an Android emulator (e.g. via [Android Studio](https://developer.android.com/studio))
- Or scan the QR code with the [Expo Go app](https://play.google.com/store/apps/details?id=host.exp.exponent&pli=1) on your Android phone (**recommended**)

> 📘 For running on iOS or physical devices, follow the official [Expo device guide](https://docs.expo.dev/workflow/run-on-device/)

---

## Team conclusions and rules 
This section focuses on our common arrangements which we establish during retro meetings.
### PR reminding
We have noticed that delays in development are also by waiting for PR's review.
Now, it is the responsibility of the person who requests PR's to remind reviers of them. Preferably every 2 days.
### Task dependencies
Some of us prefer last-minute working. On the other hand, some of us perfer finish work earlier. 
Now on planning meetings we will take this into consideration. The selection of tasks for particular person will also depend on deveoper's preferences.
