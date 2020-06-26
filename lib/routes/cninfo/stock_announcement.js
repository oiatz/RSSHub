const got = require('@/utils/got');

module.exports = async (ctx) => {
    const code = ctx.params.code;
    const orgId = ctx.params.orgId;

    const url = `http://www.cninfo.com.cn/new/disclosure/stock?plate=szse&stockCode=${code}`;
    const apiUrl = `http://www.cninfo.com.cn/new/hisAnnouncement/query?stock=${code},${orgId}&tabName=fulltext&pageSize=30&pageNum=1&column=&category=&plate=&seDate=&searchkey=&secid=&sortName=&sortType=`;

    const response = await got.post(apiUrl, {
        headers: {
            Referer: url,
        },
    });
    const classifiedList = response.data.announcements;

    let announcementsList = [];
    for (let i = 0; i < classifiedList.length; i++) {
        announcementsList = announcementsList.concat(classifiedList[i]);
    }

    let name = '';
    const out = announcementsList.map((item) => {
        const title = item.announcementTitle;
        const date = item.announcementTime;
        const link = `http://static.cninfo.com.cn/${item.adjunctUrl}`;
        name = item.secName;

        const single = {
            title,
            link,
            pubDate: new Date(date).toUTCString(),
        };

        return single;
    });
    ctx.state.data = {
        title: `${name}公司公告-巨潮资讯`,
        link: url,
        item: out,
    };
};
