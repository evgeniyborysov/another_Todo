# Todo App

A modern Todo application built with React, TypeScript, and Firebase.

## Features

-   User authentication
-   Create, edit, and delete todo lists
-   Share todo lists with other users
-   Real-time updates
-   Modern UI with responsive design

## Getting Started

### Prerequisites

-   Node.js (v18 or later)
-   pnpm (v7 or later)
-   Firebase account

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/your-repo-name.git
cd your-repo-name
```

2. Install dependencies:

```bash
pnpm install
```

3. Create a `.env` file in the root directory and add your Firebase configuration:

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

You can find these values in your Firebase project settings.

4. Start the development server:

```bash
pnpm dev
```

## Environment Variables

The app uses the following environment variables:

-   `VITE_FIREBASE_API_KEY`: Your Firebase API Key
-   `VITE_FIREBASE_AUTH_DOMAIN`: Your Firebase Auth Domain
-   `VITE_FIREBASE_PROJECT_ID`: Your Firebase Project ID
-   `VITE_FIREBASE_STORAGE_BUCKET`: Your Firebase Storage Bucket
-   `VITE_FIREBASE_MESSAGING_SENDER_ID`: Your Firebase Messaging Sender ID
-   `VITE_FIREBASE_APP_ID`: Your Firebase App ID

Create a `.env` file based on `.env.example` and fill in your values.

## Development

```js
export default tseslint.config({
	extends: [
		// Remove ...tseslint.configs.recommended and replace with this
		...tseslint.configs.recommendedTypeChecked,
		// Alternatively, use this for stricter rules
		...tseslint.configs.strictTypeChecked,
		// Optionally, add this for stylistic rules
		...tseslint.configs.stylisticTypeChecked,
	],
	languageOptions: {
		// other options...
		parserOptions: {
			project: ["./tsconfig.node.json", "./tsconfig.app.json"],
			tsconfigRootDir: import.meta.dirname,
		},
	},
});
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default tseslint.config({
	plugins: {
		// Add the react-x and react-dom plugins
		"react-x": reactX,
		"react-dom": reactDom,
	},
	rules: {
		// other rules...
		// Enable its recommended typescript rules
		...reactX.configs["recommended-typescript"].rules,
		...reactDom.configs.recommended.rules,
	},
});
```
