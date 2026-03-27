export const SIDEBAR_ROUTES = [
  '/', 
  '/leads', 
  '/customers', 
  '/services', 
  '/compliances', 
  '/addinvoice', 
  '/invoices', 
  '/recurringinvoices', 
  '/payments', 
  '/templates', 
  '/accountantjobs', 
  '/users', 
  '/compliance-settings', 
  '/settings'
];

export const isSidebarRoute = (pathname) => {
  // Ensure we compare without trailing slashes for robustness
  const cleanPath = pathname.length > 1 && pathname.endsWith('/') 
    ? pathname.slice(0, -1) 
    : pathname;
  return SIDEBAR_ROUTES.includes(cleanPath);
};
