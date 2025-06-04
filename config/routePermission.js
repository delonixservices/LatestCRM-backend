const routePermissions = {
  admin: {
    routes: [
      '/dashboard',
      '/leads',
      '/leads/add',
      '/leads/upload',
      '/leads/messages',
      '/leads/search',
      '/users',
      '/users/new',
      '/settings',
      '/reports',
      '/hr',
      '/config'
    ],
    description: 'Full access to all system features'
  },
  manager: {
    routes: [
      '/dashboard',
      '/leads',
      '/leads/upload',
      '/reports'
    ],
    description: 'Access to lead management and reporting features'
  },
  employee: {
    routes: [
      '/dashboard',
      '/leads/my-leads',
      '/profile'
    ],
    description: 'Basic access to own leads and profile'
  }
};

module.exports = routePermissions; 