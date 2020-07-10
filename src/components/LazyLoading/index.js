// import ErrLoading from './ErrLoading'
// import Loading from './Loading'

// 加载路由有效，加载组件无效 LazyLoadingHandler(()=>import('views/home'))
let LazyLoadingHandler = (asyncComponent) => {
  let AsyncLoadComponent = () => ({
    // 需要加载的组件 (应该是一个 `Promise` 对象)
    // component: import(ComponetPath.indexOf('@') >= 0 ? ComponetPath : `@${ComponetPath}`),
    component: asyncComponent(), // import(`@/views/${ComponetPath}`),
    // 异步组件加载时使用的组件
    loading: require('components/LazyLoading/Loading.vue').default, // Loading,
    // 加载失败时使用的组件
    error: require('components/LazyLoading/ErrLoading.vue').default, // ErrLoading,
    // 展示加载时组件的延时时间。默认值是 200 (毫秒)
    delay: 200,
    // 如果提供了超时时间且组件加载也超时了
    // 则使用加载失败时使用的组件。默认值是：`Infinity`
    timeout: 3000
  })
  return {
    render (h, { data, children }) {
      console.log(this, h, arguments)
      return h(AsyncLoadComponent, data, children)
      // return AsyncLoadComponent
    }
  }
}
// 返回Vue懒加载{component,loading,error,delay,timeout}对象
let LazyLoadingObj = (asyncComponent) => {
  return () => ({
    // 需要加载的组件 (应该是一个 `Promise` 对象)
    // component: import(ComponetPath.indexOf('@') >= 0 ? ComponetPath : `@${ComponetPath}`),
    component: asyncComponent(), // import(`@/views/${ComponetPath}`),
    // 异步组件加载时使用的组件
    loading: () => import('components/LazyLoading/Loading.vue'), // Loading,
    // 加载失败时使用的组件
    error: () => import('components/LazyLoading/ErrLoading.vue'), // ErrLoading,
    // 展示加载时组件的延时时间。默认值是 200 (毫秒)
    delay: 200,
    // 如果提供了超时时间且组件加载也超时了
    // 则使用加载失败时使用的组件。默认值是：`Infinity`
    timeout: 3000
  })
}
// 懒加载Promise形式 ()=>LazyLoadingView(import('views/home'))
let LazyLoadingPromise = (AsyncView) => {
  const AsyncHandler = () => ({
    component: AsyncView,
    // A component to use while the component is loading.
    loading: require('components/LazyLoading/Loading.vue').default,
    // A fallback component in case the timeout is exceeded
    // when loading the component.
    error: require('components/LazyLoading/ErrLoading.vue').default,
    // Delay before showing the loading component.
    // Default: 200 (milliseconds).
    delay: 200,
    // Time before giving up trying to load the component.
    // Default: Infinity (milliseconds).
    timeout: 3000
  })

  return Promise.resolve({
    functional: true,
    render (h, { data, children }) {
      // Transparently pass any props or children
      // to the view component.
      return h(AsyncHandler, data, children)
    }
  })
}
// export default _LazyLoadingPromise
export {
  LazyLoadingPromise as default,
  LazyLoadingHandler,
  LazyLoadingObj
}
