---
title: "Selenium控制已打开的浏览器抓取公开跨境电商数据"
slug: "selenium-scrape-cross-border-ecommerce"
author: "九歌999"
digest: "将一个某电商大数据网站后台公开的几千条商品数据给抓取下来,并将数据保存到Excel中，以便进行数据分析使用。"
article_id: "hqGm86U3OG8yWVP3kOp1Ksh_q9rLdKbtS1p18W9ccgQ4q2YgSlJ6m0-YivVJI3gr"
publish_time: "2021-01-02"
update_time: "2021-01-02"
wechat_url: "http://mp.weixin.qq.com/s?__biz=MjM5NTgwODEzMg==&mid=110000179&idx=1&sn=2b7a1280e0436d999c7e47393e71df72&chksm=25880ed812ff87ce63d6ce828e19cf2f76a92bba282d0c9d633dfac0e616e588b77ce839fab9#rd"
source_url: "https://mianbaoduo.com/o/bread/YZWclZty"
cover_url: "http://mmbiz.qpic.cn/mmbiz_jpg/5lSCKSPLcXly0qB9loO2HZdViclI3g42zIPiaCkaDfE4gWP2V2d9l6BrmrcBONuOxm6Ke3xT7rv4Fw2kpfQ5rqsw/0?wx_fmt=jpeg"
---

# Selenium控制已打开的浏览器抓取公开跨境电商数据

## 声明  

1.请正确使用网页爬虫，不得使用爬虫爬取非法数据，不得影响他人服务器的正常工作。

2.本文爬取的数据为跨境网站商品公开信息，本文仅用于学习交流。

3.本文附带源码爬取时间间隔为10s,数据获取量为2000余条。

*点击下方阅读原文，获取本文源码*

## 任务目标

将一个某电商大数据网站后台公开的几千条商品数据给抓取下来,并将数据保存到Excel中，以便进行数据分析使用。

## 难度分析

1.  需要登录网站会员账户，在后台中查看数据。网站已经设置了反爬，模拟登录比较困难。
    
2.  使用Selenium控制Chrome浏览器，在测试模式下，能够被该网站识别，不能正常登录帐号。
    
3.  数据需要刷新页面后，才能正常显示。
    

## 难点解决

1.网上搜索各种隐藏Selenium特征的方法，都失败，所以通过Selenium新打开浏览器的方法行不通。而且很多网站可以通过多个特征来识别出你使用了Selenium。

  2.通过研究得知，通过在Selenium 中添加 debuggerAddress 可以控制该端口打开的浏览器。

（1）进入chrome.exe所在的文件夹，在地址栏中输入"CMD”，在该路径下打开CMD窗口。

（2）在CMD窗口中，输入下方命令，新打开一个Chrome浏览器窗口，并在该窗口中打开目标网站，登录会员账号。

（3）在Python代码中，为selenium加入选项。此处添加的端口地址要与上文中CMD命令中的端口一致。

```
chrome_options = webdriver.ChromeOptions()
```

3.通过每次访问页面并刷新，可以获取整个页面的Html代码，然后使用BeatifulSoup进行网页分析，提取商品有用信息。

```
driver.get(url)
```

## 程序逻辑

1.通过已打开的浏览器，访问目标网站，登录会员账号，并转至数据页。

```
# 使用网页驱动来运行chrome浏览器
```

2.通过浏览器F12分析需要获取字段的HTMl代码，能够通过BeautifulSoup库解析到想要换取的数据字段。

```
#产品标题
```

3.将获取的数据及时保存到CSV文件中。

```
 #打开csv文件
```

4.优化代码，使其能够完成100多个网页的循环访问。

5.查看获取到的跨境电商商品数据。

*![](./assets/007.png)点击下方阅读原文，获取本文源码*
