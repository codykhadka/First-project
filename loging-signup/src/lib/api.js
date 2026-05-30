// API utility library for handling requests
// Mock API endpoints - can be replaced with real backend later

// eslint-disable-next-line no-unused-vars
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Storage for users (mock database)
const mockDatabase = {
  users: JSON.parse(localStorage.getItem('mockUsers')) || [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      createdAt: new Date().toISOString(),
    },
  ],
};

// Save mock database to localStorage
const saveMockDatabase = () => {
  localStorage.setItem('mockUsers', JSON.stringify(mockDatabase.users));
};

// API calls
export const authAPI = {
  login: async (email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = mockDatabase.users.find(
          (u) => u.email === email && u.password === password
        );
        if (user) {
          const { password, ...userWithoutPassword } = user;
          const token = btoa(JSON.stringify({ id: user.id, email: user.email }));
          localStorage.setItem('authToken', token);
          localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
          resolve({
            success: true,
            token,
            user: userWithoutPassword,
          });
        } else {
          reject({
            success: false,
            message: 'Invalid email or password',
          });
        }
      }, 500);
    });
  },

  signup: async (name, email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const existingUser = mockDatabase.users.find((u) => u.email === email);
        if (existingUser) {
          reject({
            success: false,
            message: 'Email already exists',
          });
          return;
        }

        const newUser = {
          id: mockDatabase.users.length + 1,
          name,
          email,
          password,
          createdAt: new Date().toISOString(),
        };

        mockDatabase.users.push(newUser);
        saveMockDatabase();

        const { password: _, ...userWithoutPassword } = newUser;
        const token = btoa(JSON.stringify({ id: newUser.id, email: newUser.email }));
        localStorage.setItem('authToken', token);
        localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));

        resolve({
          success: true,
          token,
          user: userWithoutPassword,
        });
      }, 500);
    });
  },

  logout: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('currentUser');
        resolve({ success: true });
      }, 200);
    });
  },

  getCurrentUser: async () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const token = localStorage.getItem('authToken');
        const user = localStorage.getItem('currentUser');
        if (token && user) {
          resolve({
            success: true,
            user: JSON.parse(user),
          });
        } else {
          reject({
            success: false,
            message: 'No user found',
          });
        }
      }, 200);
    });
  },

  updateProfile: async (userId, updates) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = mockDatabase.users.find((u) => u.id === userId);
        if (user) {
          Object.assign(user, updates);
          saveMockDatabase();
          const { password, ...userWithoutPassword } = user;
          localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
          resolve({
            success: true,
            user: userWithoutPassword,
          });
        } else {
          reject({
            success: false,
            message: 'User not found',
          });
        }
      }, 300);
    });
  },

  getAllUsers: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const usersWithoutPasswords = mockDatabase.users.map((u) => {
          const { password, ...rest } = u;
          return rest;
        });
        resolve({
          success: true,
          users: usersWithoutPasswords,
        });
      }, 300);
    });
  },
};

export default authAPI;
