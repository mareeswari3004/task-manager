# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# AI-Powered Task Management & Admin Dashboard

A React.js based Task Management application with an integrated Admin Dashboard, 
featuring AI-powered task prioritization and description generation using Claude API.

## 🚀 Features

### Management (User) Side
- Kanban board with drag-and-drop functionality (To Do / In Progress / Done)
- Create, edit, and delete tasks
- **AI Task Prioritizer** – Uses Claude API to analyze all tasks and suggest priority order
- **AI Description Generator** – Auto-generates task descriptions from a task title
- Persistent storage using browser LocalStorage

### Admin Side
- Role-based login (Admin / User)
- Dashboard with live task statistics (Total, To Do, In Progress, Done)
- Complete task overview table
- User management (add/remove users)

## 🛠️ Tech Stack
- **Frontend:** React.js (Vite), HTML5, CSS3
- **Routing:** React Router DOM
- **Drag & Drop:** @dnd-kit
- **AI Integration:** Anthropic Claude API
- **State Management:** React Context API
- **Storage:** Browser LocalStorage

## 📁 Project Structure
\`\`\`
src/
 ├── components/
 │    ├── Kanban/       # Board, Column, TaskCard
 │    ├── Admin/        # Stats, UserList, TaskOverview
 │    └── Login/        # LoginPage
 ├── context/           # AuthContext, TaskContext
 ├── api/                # claudeApi.js (AI integration)
 ├── pages/              # ManagementPage, AdminPage
 └── App.jsx
\`\`\`

## ⚙️ Setup Instructions

1. Clone the repository
\`\`\`bash
git clone <repo-url>
cd task-manager-ai
\`\`\`

2. Install dependencies
\`\`\`bash
npm install
\`\`\`

3. Add your Anthropic API key
Create a \`.env\` file in the root directory:
\`\`\`
VITE_ANTHROPIC_API_KEY=your_api_key_here
\`\`\`

4. Run the development server
\`\`\`bash
npm run dev
\`\`\`

5. Open \`http://localhost:5173\` in your browser

## 🔑 How to Use
1. On the login screen, enter your name and select a role (User or Admin)
2. **As User:** Manage tasks on the Kanban board, use AI to prioritize tasks or 
   generate descriptions
3. **As Admin:** View task statistics, manage users, and monitor all tasks

## 🤖 AI Integration Details
This project uses the Anthropic Claude API (claude-sonnet-4-6) for two features:
- **Task Prioritization:** Sends the current task list to Claude and receives 
  a priority-ordered list back
- **Description Generation:** Sends a task title and receives an auto-generated, 
  professional description

## ⚠️ Note on Production Use
This project makes direct API calls from the browser for demonstration purposes. 
In a production environment, API calls should be routed through a backend server 
to keep the API key secure and prevent exposure on the client side.

## 🔮 Future Improvements
- Backend server (Node.js/Express) to secure API key
- Real authentication with JWT
- Database integration (MongoDB) instead of LocalStorage
- Email notifications for task deadlines
- Role-based route protection

## 👤 Author
Mareeswari Balakrishnan