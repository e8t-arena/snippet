import requests
import re
import urllib.parse
import uuid
# import os
import time
import shlex
import subprocess

header_str = """
accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9
accept-encoding: gzip, deflate, br
accept-language: en,zh-CN;q=0.9,zh;q=0.8,zh-TW;q=0.7,ja;q=0.6
cache-control: max-age=0
cookie: SINAGLOBAL=1713256803810.4102.1591104359560; TC-V5-G0=799b73639653e51a6d82fb007f218b2f; _s_tentry=login.sina.com.cn; Apache=609807496547.3055.1598970717051; ULV=1598970717719:3:1:1:609807496547.3055.1598970717051:1592754805937; Ugrow-G0=6fd5dedc9d0f894fec342d051b79679e; SSOLoginState=1599467193; login_sid_t=01e95c3ea8649e11c95198a204f76372; cross_origin_proto=SSL; UOR=,,login.sina.com.cn; TC-Page-G0=aadf640663623d805b6612f3dfe1e2c0|1600944260|1600944248; XSRF-TOKEN=g2_Faanamhhh7ZeZw5cZPV9a; WBtopGlobal_register_version=2020103022; TC-V-WEIBO-G0=35846f552801987f8c1e8f7cec0e2230; SUBP=0033WrSXqPxfM725Ws9jqgMF55529P9D9W5KciUg.5GhCB7P3pedcmMJ5JpX5KMhUgL.Foz7S0eXShe0eKB2dJLoIpjLxKqLBonLBonLxKnL12-LB.BLxK-L1-qL1-qt; ALF=1638799184; SCF=AqU4zgK2qbpEur6RZ4GFyeuUufLM056ZiULAtnqMpb9-9uQQf6aUojF1CapfLqXzVDB_HI88G3X2dPkcMhJIWok.; SUB=_2A25yyJODDeRhGeRO7FEV9C3PyjiIHXVRv4JLrDV8PUNbmtAKLXXHkW9NUHLfzCxFQvBknMWgfHovi0USr77RcGfa; wvr=6; wb_view_log_2073443314=1440*9002; webim_unReadCount=%7B%22time%22%3A1607313576085%2C%22dm_pub_total%22%3A0%2C%22chat_group_client%22%3A0%2C%22chat_group_notice%22%3A0%2C%22allcountNum%22%3A0%2C%22msgbox%22%3A0%7D
dnt: 1
referer: https://s.weibo.com/
sec-fetch-dest: document
sec-fetch-mode: navigate
sec-fetch-site: same-origin
sec-fetch-user: ?1
upgrade-insecure-requests: 1
user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36
"""

url = 'http://t.cn/Ehy0iHl'

def header_text_to_dict(header_text):
    header_list = list(filter(lambda elem: elem != '', header_text.split("\n")))
    return dict(list(map(lambda x: list(map(lambda x: x.strip(), x.split(":", 1))), header_list)))

# print(header_text_to_dict(header_str))

# res = requests.get(url, headers=header_text_to_dict(header_str), allow_redirects=True)

def fetch_url(url, number):
    res = requests.get(url, allow_redirects=True)
    print(res.url)

    wb_video_url = urllib.parse.parse_qs(res.url).get('url', [res.url])[0]

    s = requests.Session()

    parse_key_url = 'https://www.weibovideo.com'

    api_page = urllib.parse.urlparse(wb_video_url).path[3:]

    api_payload_oid = api_page.split('/')[-1]
    api_payload = {
      "data": '{"Component_Play_Playinfo":{"oid": "'+api_payload_oid+'"}}'
    }
    api_base = 'https://weibo.com/tv/api/component'

    headers=header_text_to_dict(header_str)
    api_res = s.post(
      api_base,
      params={'page': api_page},
      data=api_payload,
      headers=headers
    )
    try:
      video_url = list(api_res.json()['data']['Component_Play_Playinfo']['urls'].items())[0][1]
    except e:
      print(e)
    download_video(video_url, number)


def fetch_url1(url, number):
    res = requests.get(url, allow_redirects=True)
    print(res.url)

    wb_video_url = urllib.parse.parse_qs(res.url).get('url', [res.url])[0]

    s = requests.Session()

    parse_key_url = 'https://www.weibovideo.com'

    parse_key_res = s.get(
        parse_key_url, headers=header_text_to_dict(header_str))

    key_match = re.search(r'key:\"(.*?)\"', parse_key_res.text)

    if key_match:
        key = key_match.group(1)
        print(key)

        parse_api = 'https://www.weibovideo.com/controller.php'

        parse_res = s.post(parse_api, headers=header_text_to_dict(header_str), data={
            "weibourl": wb_video_url,
            "key": key
        })
        print(parse_res.text)
        download_video(parse_res.text, number)
    else:
        print("No parse key")

def download_video(url, number):
    cmd = f"wget -O {str(number).rjust(3, '0')}.mp4 https:{url}"
    print(cmd)
    subprocess.call(shlex.split(cmd))

def run():
    with open('video.txt') as f:
        # print(len(re.findall(r'(http://t.cn.*?)\s', f.read())))
        all_urls = re.findall(r'(http://t.cn.*?)\s', f.read())
        for index, url in enumerate(all_urls):
            number = index + 53
            print(number, url)
            fetch_url(url, number)
            time.sleep(5)

run()
