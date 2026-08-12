import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { TaskProvider } from './context/TaskContext';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';
import { UserProvider } from './context/UserContext';
import { ActivityProvider } from './context/ActivityContext';
import { CommentProvider } from './context/CommentContext';
import { NotificationProvider } from './context/NotificationContext';
import { AttachmentProvider } from './context/AttachmentContext';
import { ProjectProvider } from './context/ProjectContext';
import LoginPage from './components/Login/LoginPage';
import ManagementPage from './pages/ManagementPage';
import AdminPage from './pages/AdminPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <UserProvider>
            <ActivityProvider>
              <CommentProvider>
                <NotificationProvider>
                  <AttachmentProvider>
                    <ProjectProvider>
                      <TaskProvider>
                        <BrowserRouter>
                          <Routes>
                            <Route path="/" element={<LoginPage />} />
                            <Route
                              path="/management"
                              element={
                                <ProtectedRoute allowedRole="user">
                                  <ManagementPage />
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/admin"
                              element={
                                <ProtectedRoute allowedRole="admin">
                                  <AdminPage />
                                </ProtectedRoute>
                              }
                            />
                          </Routes>
                        </BrowserRouter>
                      </TaskProvider>
                    </ProjectProvider>
                  </AttachmentProvider>
                </NotificationProvider>
              </CommentProvider>
            </ActivityProvider>
          </UserProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;