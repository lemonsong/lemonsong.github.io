#!/usr/bin/env python
# -*- coding: utf-8 -*- #
from __future__ import unicode_literals

AUTHOR = u'Yilin Wei'
SITENAME = u'Le Jardin de Yilin'
SITEURL = 'http://yilinwei.com/blog'

PATH = 'content'

TIMEZONE = 'US/Eastern'

DEFAULT_LANG = u'en'
DISQUS_SITENAME = u"yilinwei"
# Feed generation is usually not desired when developing
FEED_ALL_ATOM = None
CATEGORY_FEED_ATOM = None
TRANSLATION_FEED_ATOM = None
AUTHOR_FEED_ATOM = None
AUTHOR_FEED_RSS = None

# Blogroll
LINKS = (('Pelican', 'http://getpelican.com/'),
         ('Python.org', 'http://python.org/'),
         ('Jinja2', 'http://jinja.pocoo.org/'),
         ('You can modify those links in your config file', '#'),)

# Social widget
SOCIAL = (('LinkedIn', 'https://www.linkedin.com/in/yilinwei'),
         ('Twitter', 'https://twitter.com/lemonsonglynn'),
         ('Github', 'https://github.com/lemonsong'),)

DEFAULT_PAGINATION = 20
#plugin
PLUGIN_PATHS = ["pelican-plugins"]
PLUGINS = ["sitemap"]
# 配置sitemap 插件
SITEMAP = {
    "format": "xml",
    "priorities": {
        "articles": 0.7,
        "indexes": 0.5,
        "pages": 0.3,
    },
    "changefreqs": {
        "articles": "monthly",
        "indexes": "daily",
        "pages": "monthly",
    }
}
# theme
THEME = 'foundation-default-colours'
FOUNDATION_FRONT_PAGE_FULL_ARTICLES = False
FOUNDATION_ALTERNATE_FONTS = False
FOUNDATION_TAGS_IN_MOBILE_SIDEBAR = False
FOUNDATION_NEW_ANALYTICS = False
FOUNDATION_ANALYTICS_DOMAIN = ''
FOUNDATION_FOOTER_TEXT = 'Powered by <a href="http://getpelican.com">Pelican</a> and <a href="http://foundation.zurb.com/">Zurb Foundation</a>. Theme by <a href="http://hamaluik.com">Kenton Hamaluik</a>.'
FOUNDATION_PYGMENT_THEME = 'monokai'
MONTH_ARCHIVE_SAVE_AS = 'posts/{date:%Y}/{date:%m}/index.html'
# URL setting
ARTICLE_URL = 'pages/{date:%Y}/{date:%m}/{date:%d}/{slug}/'
ARTICLE_SAVE_AS = 'pages/{date:%Y}/{date:%m}/{date:%d}/{slug}/index.html'
# path to images
STATIC_PATHS = [u"imgs"]
#GA
GOOGLE_ANALYTICS = 'UA-45111796-1'


# Uncomment following line if you want document-relative URLs when developing
#RELATIVE_URLS = True
