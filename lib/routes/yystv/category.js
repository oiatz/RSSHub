const got = require('@/utils/got');
const cheerio = require('cheerio');
const date = require('@/utils/date');

module.exports = async (ctx) => {
    const category = ctx.params.category;
    const url = `http://www.yystv.cn/b/${category}`;
    const response = await got({
        method: 'get',
        url: url,
    });

    const data = response.data;
    const $ = cheerio.load(data);

    const items = $('.list-container li')
        .map(function () {
            const info = {
                title: $(this).find('.list-article-title').text(),
                link: 'http://www.yystv.cn' + $(this).find('a').attr('href'),
                description: $(this).find('.list-article-intro').text(),
                pubDate: date($(this).find('.c-999').text()),
                author: $(this).find('.handler-author-link').text(),
            };
            return info;
        })
        .get();

    ctx.state.data = {
        title: '游研社-' + $('title').text(),
        link: 'http://www.yystv.cn/b/recommend',
        item: items,
    };
};
