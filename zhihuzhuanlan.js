// https://www.npmjs.com/package/node-fetch node-fetch - npm

const fetch = require('node-fetch');

const getPage = (json, field) => json['paging'] && json['paging'][field]

const crawle = url => {
  fetch(url, {
    "headers": {
      "accept": "*/*",
      "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-site",
      "x-ab-param": "tsp_hotlist_ui=1;ug_follow_topic_1=2;zr_training_first=false;li_video_section=0;tp_sft=a;li_paid_answer_exp=0;tp_topic_tab_new=0-0-0;top_test_4_liguangyi=1;se_entity22=0;tp_topic_tab=0;se_searchwiki=0;se_hi_trunc=0;top_universalebook=1;li_car_meta=0;se_return_1=0;tp_m_intro_re_topic=1;ug_newtag=1;li_vip_verti_search=0;li_sp_mqbk=0;pf_adjust=0;zr_intervene=0;zr_expslotpaid=1;se_merge=0;se_recommend=0;pf_fuceng=1;li_topics_search=0;se_auth_src2=0;zw_sameq_sorce=999;se_topicfeed=0;li_answer_card=0;pf_profile2_tab=0;se_college=default;tp_zrec=0;se_guess=0;tp_discover=0;tp_fenqu_wei=0;pf_creator_card=1;ls_recommend_test=0;qap_question_visitor= 0;li_svip_tab_search=1;zr_slot_training=1;se_sug_term=0;tp_header_style=1;li_panswer_topic=0;se_usercard=0;tp_meta_card=0;tp_dingyue_video=0;top_v_album=1;li_pl_xj=0;se_colorfultab=1;zr_training_boost=false;se_adsrank=4;se_club_ui=0;tp_topic_style=0;tp_clubhyb=0;zr_slotpaidexp=1;li_edu_page=old;pf_foltopic_usernum=50;qap_question_author=0;tp_contents=2;top_ebook=0;qap_labeltype=1;top_quality=0;se_auth_src=0;li_viptab_name=0;zr_sim3=0;top_root=0;pf_newguide_vertical=0;li_yxzl_new_style_a=1;se_col_boost=0;se_whitelist=0;se_ffzx_jushen1=0;pf_noti_entry_num=0;li_catalog_card=1;li_ebook_gen_search=0;zr_rec_answer_cp=open;soc_notification=1;ls_video_commercial=0;li_svip_cardshow=1",
      // "x-ab-pb": "Cia0CucKDAsSC5wK3gonChAL4wrsCiUK7QrkCusK1wqbCg8LAQsmCxITAAAAAAEABgAAAAUAAAAAAAAAAA==",
      "x-requested-with": "fetch",
      "x-zse-83": "3_2.0",
      // "x-zse-86": "1.0_aRF0UJXBUqFXU9Y0TgYqnh9qgqYpk0Nqhgtq2HL0NC2p",
      // "x-zst-81": "3_2.0ae3TnRUTEvOOUCNMTQnTSHUZo02p-HNMZBO8YD_q2Xtuo_Y0K6P0E6uy-LS9-hp1DufI-we8gGHPgJO1xuPZ0GxCTJHR7820XM20cLRGDJXfgGCBxupMuD_Ic4cpr4w0mRPO7HoY70SfquPmz93mhDQyiqV9ebO1hwOYiiR0ELYuUrxmtDomqU7ynXtOnAoTh_PhRDSTFeOpeUY9v9w1cHc8ZbO99qHMw939TvgK2XcMHGXy3qo0xDCGLgo8n9LK_USTv43G1uc9HCgBcGoCwrLf8wxO9hLq0UY9yuO0XUt1PwYYwULCNhpmpupBoTCqABX1r0pCFqYKV9wOiwV_ahXMqUFKwwgfWCLBgbuGuh3x6UoYfCH_VvO0VqkwCBOOFJHYCrH1uUgKngXOyq2BXbUBqBL8Arx9f_xKQTSMTCcM0BC9wbXY9GRMOUSxwDxBfMcCLJpBUqe_iDgYGiOC9uS8Q8xs6_V_BvN_jDpKQXXK-rSC"
    },
    "referrer": "https://zhuanlan.zhihu.com/self-discipline",
    "referrerPolicy": "no-referrer-when-downgrade",
    "body": null,
    "method": "GET",
    "mode": "cors",
    "credentials": "include"
  }).then(res => res.json())
    .then(json => {
      let nextUrl = getPage(json, 'next')
      let isEnd = getPage(json, 'is_end')
      let data = json['data'].map(entity => entity.title)
      console.log(
        data
      )
      console.log(`nextUrl: [${nextUrl}] isEnd: [${isEnd}]`)
      if (!isEnd)
        crawle(nextUrl)
    })
    .catch(console.error);
}

// {
//   is_end: false,
//   totals: 98,
//   previous: 'http://www.zhihu.com/api/v4/columns/self-discipline/items?limit=10&offset=0',
//   is_start: false,
//   next: 'http://www.zhihu.com/api/v4/columns/self-discipline/items?limit=10&offset=20'
// }

let startUrl = 'http://www.zhihu.com/api/v4/columns/self-discipline/items?limit=10&offset=0'
crawle(startUrl)



/*

爬取 1
  proxy pool
- 输入链接 (zhihu 专栏)
- 获取文章列表
- 保存文章列表到数据库

用户设置
- 文章数量
- 模板/主题

爬取 2
- 获取文章内容
- 保存文章内容到数据库/云存储

格式化
- TOC
- PDF
- 水印

*/
