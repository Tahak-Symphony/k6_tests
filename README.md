# K6 Performance Testing Repository

This repository contains performance tests written for the [k6](https://k6.io/) load testing tool. The tests are written in JavaScript and bundled using Webpack to handle modules and environment variables.

## Prerequisites

Before you begin, ensure you have the following installed:

* [Node.js and npm](https://nodejs.org/)
* [k6](https://k6.io/docs/getting-started/installation/)

---

## Getting Started

Follow these steps to set up and run the tests.

### 1. Clone the Repository

Clone this repository to your local machine:

```bash
git clone <your-repository-url>
cd <your-repository-name>
```

### 2. Install DEpendencies
Install the necessary npm packages, which include Webpack, Babel, and other development dependencies:
```bash
npm install
```

### 3. Configure Environment Variables
This project uses a .env file to manage environment-specific variables like API URLs, keys, and authentication tokens. This keeps sensitive information out of the version-controlled code.

Create a copy of this file and name it .env:

```bash
cp .env_example .env
```
and then change the place holder with the real needed values


### 4. Bundle the Test Scripts
The test scripts in the src/ directory need to be bundled by Webpack before they can be run by k6. This process transpiles the code and injects the environment variables from your .env file.

To bundle the scripts, run:
```bash
npm run build
```

### 5. Run the Tests
You can now run any of the bundled test scripts using the k6 run command.

For example, to run a login test:

k6 run dist/test.js
