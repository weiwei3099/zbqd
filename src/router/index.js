import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const singleRoutes = [
  {
    path: '/product/show_design/:id',
    name: '装配成品',
    // component: () => import('../pages/product/show_design'),
    component: () => import('../pages/design/play/play.vue'),
    meta: { nav: 'product' }
  }
]


export default new Router({
    //mode: 'history',
    routes: [
        ...singleRoutes,
        {
            path: '/login',
            name: '登录',
            component: () => import('../pages/ucenter/login'),
        },
        {
            path: '/register',
            name: '注册',
            component: () => import('../pages/ucenter/register'),
        },
		{
            path: '/edit/:mid',
            name: '内容编辑',
            component: () => import('../pages/edit/bb'),
        },
        {
            path: '/gallery/items/show',
            component: () => import('../components/layout'),
            children: [
                {path: ':id', name: '画册翻页', component: () => import('../pages/gallery/GalleryShow'), meta: { nav: 'gallery' }}
            ]
        },
        {
            path: '/gallery/edit',
            component: () => import('../components/layout'),
            children: [
                {path: ':id', name: '编辑画册', component: () => import('../pages/gallery/EditGallery'), meta: { nav: 'gallery' }},
            ]
        },
        // {
        //     path: '/product/detail/:productId/design',
        //     name: '编辑装配',
        //     component: () => import('../pages/product/ProductDesign'),
        //     meta: { nav: 'product' }
        // },
        {
            path: '/design',
            component: () => import('../components/layout/alive'),
            children: [
                {path: ':productId/playground', name: '编辑装配', component: () => import('../pages/design/product/product.vue'), meta: { nav: 'product' }},
                {
                    path: 'image', component: () => import('../pages'), meta: { nav: 'image' },
                    children: [
                        {
                            path: 'list', component: () => import('../pages/Layout'), meta: { nav: 'image' },
                            children: [
                                {path: ':status', name: '装配选择图库', component: () => import('../pages/image/ImageList'), meta: { nav: 'image' },}
                            ]
                        }
                    ]
                },
            ]
        },
        {
            path: '/',
            name: '首页',
            redirect: '/home',
            component: () => import('../pages'),
            children: [
                {
                    path: 'home', name: '控制台', component: () => import('../pages/home'), meta: { title: '用户登录', nav: 'home' },
                },
                {
                    path: '/gallery',
                    name: '画册',
                    redirect: '/gallery/items',
                    component: () => import('../pages/Layout'),
                    children: [
                        { path: 'items', name: '画册列表', component: () => import('../pages/album/list'), meta: { nav: 'gallery' } },
                        { path: 'items/:id', name: '画册详情', component: () => import('../pages/album/pics'), meta: { nav: 'gallery' } },
                        // { path: 'items', name: '画册列表', component: () => import('../pages/gallery/GalleryList'), meta: { nav: 'gallery' } },
                        // { path: 'items/:id', name: '画册详情', component: () => import('../pages/gallery/GalleryDetail'), meta: { nav: 'gallery' } },
                    ]
                },
                {
                    path: '/product',
                    name: '产品',
                    redirect: '/product/line',
                    component: () => import('../pages/Layout'),
                    children: [
                        {
                            path: 'line', name: '产品系列', component: () => import('../pages/product/ProductLine'), meta: { nav: 'product' },
                            children: [
                                { path: ':lineId?', name: '产品系列详细', component: () => import('../pages/product/ProductList'), meta: { nav: 'product' } },
                            ]
                        },
                        { path: 'detail/:productId', name: '产品详细', component: () => import('../pages/product/ProductDetail'), meta: { nav: 'product' } },
                    ]
                },
                {
                    path: '/video',
                    name: '视频',
                    redirect: '/video/index',
                    component: () => import('../pages/Layout'),
                    children: [
                        {
                            path: 'index', name: '视频系列', component: () => import('../pages/video/index'), meta: { nav: 'video' }
                        }
                    ]
                },
                // {
                //     path: '/product/design',
                //     component: () => import('../pages/product/ProductDesign'),
                //     children: [
                //         {path: ':productId', name: '编辑装配', component: () => import('../components/product/design/playground'), meta: { nav: 'product' }},
                //     ],
                // },
                {
                    path: '/360',
                    name: '360',
                    redirect: '/360/list',
                    component: () => import('../pages/Layout'),
                    children: [
                       { path: 'list', name: '360列表', component: () => import('../pages/360/360Main'), meta: { nav: 'show360' },
                          // children: [
                          //   {path: 'show/:id', name: '360详细', component: () => import('../pages/360/360Detail'), meta: {nav: 'show360'}}
                          // ]
                       },
                        // { path: 'list/:id', name: '360详细', component: () => import('../pages/360/360Detail'), meta: { nav: 'show360' } },
                    ]
                },
                {
                    path: '/image',
                    name: '图库',
                    redirect: '/image/list',
                    component: () => import('../pages/Layout'),
                    children: [
                        { path: 'list/:status?', component: () => import('../pages/image/ImageList'), meta: { nav: 'image' },
                          children: [
                            { path: 'items', name: '图库列表', component: () => import('../pages/image/list'), meta: { nav: 'image' } },
                            // { path: 'background', name: '背景图库', component: () => import('../pages/image/Background'), meta: { nav: 'image' } },
                            { path: 'background', name: '背景图库', component: () => import('../pages/design/background/background.vue'), meta: { nav: 'image' } },
                            { path: 'product', name: '产品图库详情', component: () => import('../pages/image/ProductDetail'), meta: { nav: 'image' } },
                            { path: '360/:id', name: '360图库详情', component: () => import('../pages/image/360Detail'), meta: { nav: 'image' } },
                          ] },
                        // { path: 'list/:status?', name: '图库列表', component: () => import('../pages/image/ImageList'), meta: { nav: 'image' } },
                        // { path: 'background', name: '背景图库', component: () => import('../pages/image/Background'), meta: { nav: 'image' } },
                        // { path: 'product', name: '产品图库详情', component: () => import('../pages/image/ProductDetail'), meta: { nav: 'image' } },
                        // { path: '360/:id', name: '360图库详情', component: () => import('../pages/image/360Detail'), meta: { nav: 'image' } },
                    ]
                },
                {
                    path: '/publish',
                    name: '发布',
                    redirect: '/publish/do',
                    component: () => import('../pages/Layout'),
                    children: [
                        { path: 'do', name: '发布列表', component: () => import('../pages/publish/Publish'), meta: { nav: 'publish' } },
                    ]
                },
                {
                    path: '/order',
                    name: '订单',
                    redirect: '/order/list',
                    component: () => import('../pages/Layout'),
                    children: [
                        { path: 'list', name: '订单列表', component: () => import('../pages/order/OrderList'), meta: { nav: 'order' } },
                    ]
                },
                {
                    path: '/ucenter',
                    name: '用户中心',
                    redirect: '/ucenter/home',
                    component: () => import('../pages/Layout'),
                    children: [
                        { path: 'home', name: '用户首页', component: () => import('../pages/ucenter'), meta: { nav: 'ucenter' } },
                    ]
                },
                {
                  path: '/apply',
                  name: '下载申请',
                  redirect: '/apply/home',
                  component: () => import('../pages/Layout'),
                  children: [
                      { path: 'home', name: '下载首页', component: () => import('../pages/apply'), meta: { nav: 'apply' } },
                  ]
                }
            ]
        },
        // {
        //     path: 'ucenter',
        //     component: () => import('../views/mizu'),
        //     children: [
        //         {
        //             path: 'all',
        //             name: 'mizu-fang-all',
        //             component: () => import('../views/mizu/items')
        //         }
        //     ]
        // }
    ]
})
