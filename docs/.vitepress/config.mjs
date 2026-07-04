import { defineConfig } from 'vitepress'

export default defineConfig({
    title: '超星学习通修改教程',
    description: '使用MT管理器修改超星学习通的详细教程',
    lang: 'zh-CN',
    base: '/chaoxing/',
    lastUpdated: true,

    themeConfig: {
        logo: false,

        nav: [
            { text: '首页', link: '/' },
            { text: '备份与恢复', link: '/backup-restore' },
            { text: '修改教程', link: '/guide/unpack-repair' },
            { text: 'App JS', link: '/app-js-guide' },
        ],

        sidebar: [
            { text: '首页', link: '/' },
            {
                text: '备份与恢复',
                link: '/backup-restore'
            },
            {
                text: '修改教程',
                collapsed: false,
                items: [
                    { text: '脱壳修复', link: '/guide/unpack-repair' },
                    { text: '章节视频快进、倍速', link: '/guide/video-speedup' },
                    {
                        text: '多端登录',
                        collapsed: true,
                        items: [
                            { text: '不理会下线', link: '/guide/ignore-kickoff' },
                            { text: '阻止挤别人下线', link: '/guide/prevent-kick-others' }
                        ]
                    },
                    { text: '考试脱控', link: '/guide/exam-control' },
                    { text: '一机多签', link: '/guide/multi-device-sign' },
                    { text: '去除开屏广告', link: '/guide/remove-splash-ad' },
                    { text: '去除更新', link: '/guide/remove-update' },
                    { text: '默认我学的课', link: '/guide/default-student-courses' },
                    {
                        text: '转交战场',
                        collapsed: true,
                        items: [
                            { text: '添加自定义js', link: '/guide/inject-custom-js' },
                            { text: '默认开启网页调试', link: '/guide/enable-web-debug' }
                        ]
                    }
                ]
            },
            {
                text: 'App JS 使用教程',
                link: '/app-js-guide'
            }
        ],

        prevNext: true,
        docFooter: {
            prev: '上一篇',
            next: '下一篇'
        },

        socialLinks: [
            { icon: 'github', link: 'https://github.com/qcxs/chaoxing' }
        ],

        footer: {
            message: '仅供学习参考，请勿用于违法用途',
            copyright: 'MIT License'
        },

        search: {
            provider: 'local'
        },

        outline: {
            level: [2, 3]
        },

        lastUpdatedText: '最后更新'
    },

    head: [
        ['meta', { name: 'theme-color', content: '#3eaf7c' }]
    ]
})