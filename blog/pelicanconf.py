#!/usr/bin/env python
# -*- coding: utf-8 -*- #
from __future__ import unicode_literals

AUTHOR = u'Yilin Wei'
SITENAME = u'Le Jardin de Yilin'
SITEURL = ''

PATH = u'content'

TIMEZONE = u'UTC'

DEFAULT_LANG = u'en'
IGNORE_FILES = ['._*']

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
SOCIAL = (('You can add links in your config file', '#'),
          ('Another social link', '#'),)

DEFAULT_PAGINATION = 20
#THEME = 'pelican-themes/blue-penguin'
DISQUS_SITENAME = u'yilinwei'

PLUGIN_PATHS = ['pelican-plugins']
PLUGINS = ['asciidoc_reader','sitemap']
SITEMAP = {
    'format': 'xml',
    'priorities': {
        'articles': 0.5,
        'indexes': 0.5,
        'pages': 0.5
        },
    'changefreqs': {
        'articles': 'weekly',
        'indexes': 'daily',
        'pages': 'monthly'
        }
    }

# Uncomment following line if you want document-relative URLs when developing
#RELATIVE_URLS = True
