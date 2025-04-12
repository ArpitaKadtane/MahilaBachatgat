export interface NavLink {
  label: string;
  path: string;
}

export const HEADER_NAV_LINKS: NavLink[] = [
  { label: 'मुख्य पृष्ठ', path: '/home' },
  { label: 'आमच्याबद्दल', path: '/about' },
  { label: 'पारदर्शक व्यवहार', path: '/transactions' },
  { label: 'बचत आणि कर्ज', path: '/savings-loans' },
  { label: 'संपर्क', path: '/contact' }
];

export const LOGO = {
  src: 'assets/images/logo.png',
  alt: 'महिला बचत गट'
};

export const LOGIN_BUTTON = {
  label: 'लॉगिन',
  path: '/login',
  styleClass: 'btn-orange'
};
