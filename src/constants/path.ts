const path = {
  home: '/',
  login: '/login',
  logout: '/logout',
  register: '/register',
  user: '/user',
  profile: '/user/profile',
  changePassword: '/user/password',
  historyPurchase: '/user/historyPurchase',
  productDetail: ':nameId',
  cart: '/cart'
} as const

export default path
