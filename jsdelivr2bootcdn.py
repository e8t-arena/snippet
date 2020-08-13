import re

link = 'https://cdn.bootcdn.net/ajax/libs/vue/2.6.11/vue.min.js'
# https://cdn.jsdelivr.net/gh/alpinejs/alpine@v2.3.5/dist/alpine.min.js
BOOTCDN_PREFIX='https://cdn.bootcdn.net'
JSDELIVR_PREFIX='https://cdn.jsdelivr.net'

prefix=BOOTCDN_PREFIX
re_part=rf'{prefix}/ajax/libs/(?P<pkg_name>)\w+)/(?P<pkg_version>)\w+)/(?P<pkg_file_name>)\w+)'
if link.startswith(BOOTCDN_PREFIX):
  print(link)
if link.startswith(JSDELIVR_PREFIX):
  print(link)
  prefix=JSDELIVR_PREFIX
  re_part=rf'{prefix}/(?P<pkg_src>)\w+)/(?P<pkg_name>)\w+)/(?P<pkg_version>)\w+)/(?P<pkg_file_name>)\w+)'


# rf'' f-string
m = re.match(re_part, link)