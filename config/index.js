export default {
  /**
   * @description 配置显示在浏览器标签的title
   */
  title: '惠城帮帮',
  /**
   * @description 是否使用国际化，默认为false
   *              如果不使用，则需要在路由中给需要在菜单中展示的路由设置meta: {title: 'xxx'}
   *              用来在菜单中显示文字
   */
  useI18n: false,
  /**
   * @description 存储的天数，采用毫秒，默认1天，1秒为1000，即一天为86400000
   */
  storageExpires: 86400000,
  /**
   * @description 默认打开的首页的路由name值，默认为home
   */
  homeName: "index",
  /**
   * @description 需要加载的插件
   */
  plugin: {
    'error-store': {
      showInHeader: true, // 设为false后不会在顶部显示错误日志徽标
      developmentOff: true // 设为true后在开发环境不会收集错误信息，方便开发中排查错误
    }
  }
}
