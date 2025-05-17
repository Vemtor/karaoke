## Project setup

### 🧱  Prerequisites

- [Node.js](https://nodejs.org/en/)
- npm or yarn

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

From the root directory run:

```bash
npm i
```

To setup the project locally skip the next section and go directly to **Local setup**.

### Docker Containerization Guide

This project can be run from a container. Follow steps below to do so.

#### 1. Install Docker

Download and install Docker for your operating system from the [official Docker website](https://docs.docker.com/get-docker/).

#### 2. Build the Java Application and run the Container

```bash
npm run container
```

> **Note:** The first build will take approximately 15 minutes. Subsequent starts will be much faster.

#### 3. Running Specific Services

The application consists of three services:

- `spring-service` (Java backend)
- `frontend` (Web UI)
- `flask-service` (Python service)

Dependencies:

- frontend → spring-service → flask-service

To run just one service:

```bash
docker compose up <service-name>
```

For example:

```bash
docker compose up frontend
```

#### 4. Run in Background Mode

To run containers in detached mode (background):

```bash
docker compose up -d
```

You can view logs in a separate terminal:

```bash
docker compose logs -f frontend
docker compose logs -f spring-service
docker compose logs -f flask-service
```

#### 5. Stopping the Application

To stop and remove all containers:

```bash
docker compose down
```

#### 6. Rebuilding Services

If you need to rebuild after making changes:

```bash
docker compose build <service-name>
```

Example:

```bash
docker compose build spring-service
docker compose build frontend
```

> **Important:** Avoid rebuilding the flask-service unnecessarily as it has many dependencies and takes a long time to build.

#### Troubleshooting

If you encounter issues:

1. Ensure Docker is running
2. Check service logs for errors
3. Verify all required ports are available
4. Make sure you're running commands from the project root directory

### Local setup

#### Backend setup (☕Java + 🐍Python)

Set up virtual env for python libraries

```bash
cd backend
python3.10 -m venv .venv
source .venv/bin/activate # On Windows use: .venv\Scripts\activate
```

Install dependencies:

```bash
cd scripts && pip install -r requirements.txt
```

Download [vocal remover](<https://github.com/tsurumeso/vocal-remover/releases/download/v5.1.1/vocal-remover-v5.1.1.zip>) and place it in backend/scripts.

```bash
wget https://github.com/tsurumeso/vocal-remover/releases/download/v5.1.1/vocal-remover-v5.1.1.zip -O vocal-remover.zip && \
unzip vocal-remover.zip -d scripts/ && \
rm vocal-remover.zip
```

Launch the servers from backend root:

```bash
python3 scripts/flask_server.py
```

Run Spring app from your IDE

#### Frontend setup (⚛️Expo)

**NOTICE:** The steps below have been verified to work on **Expo CLI + Android Phone/Web**. Both Windows and WSL enviroment were tested with successful outcome.
If you're using a different setup (e.g., iOS or custom workflow), please refer to the official [Expo documentation](https://docs.expo.dev/get-started/start-developing/) or relevant GitHub threads for help.

This project uses **[Expo](https://expo.dev/)**.

If you run into any problems, check the official [Expo docs](https://docs.expo.dev/get-started/start-developing/) or contact @galakitkkon.

---

##### 📦 Install Project Dependencies

Navigate to the frontend directory and install all dependencies:

```bash
cd frontend
npm install
```

---

##### 🧪 Start Development Server

To start the development server go to the `frontend` directory and choose one of those two options:

1. This will run a bare development server with clean cache and tunneling (for testing on tour own mobile device):

```bash
npm run start
```

- Press `a` to open in an Android emulator (e.g. via [Android Studio](https://developer.android.com/studio) - needs to be configured first!)
- Or scan the QR code with the [Expo Go app](https://play.google.com/store/apps/details?id=host.exp.exponent&pli=1) on your Android phone (**recommended**)

> 📘 For running on iOS or physical devices, follow the official [Expo device guide](https://docs.expo.dev/workflow/run-on-device/)

2. This will run a development server with clean cache and open the web-compiled instance in your primary browser (good for quick testing):

```bash
npm run web
```

---

## Team conclusions and rules

This section focuses on our common arrangements which we establish during retro meetings.

### PR reminding

We have noticed that delays in development are also by waiting for PR's review.
Now, it is the responsibility of the person who requests PR's to remind reviers of them. Preferably every 2 days.

### Task dependencies

Some of us prefer last-minute working. On the other hand, some of us perfer finish work earlier.
Now on planning meetings we will take this into consideration. The selection of tasks for particular person will also depend on deveoper's preferences.
