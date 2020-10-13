const utils = require('./utils');
const config = require('@/config').value;

module.exports = async (ctx) => {
    if (!config.twitter || !config.twitter.consumer_key || !config.twitter.consumer_secret) {
        throw 'Twitter RSS is disabled due to the lack of <a href="https://docs.rsshub.app/install/#%E9%83%A8%E5%88%86-rss-%E6%A8%A1%E5%9D%97%E9%85%8D%E7%BD%AE">relevant config</a>';
    }
    const { id, name } = ctx.params;

    const lists_data = await utils.getTwit().get('lists/list', {
        screen_name: id,
    });

    let cur_list = lists_data.data.filter((e) => e.name === name);
    if (cur_list.length === 1) {
        cur_list = cur_list[0];
    } else {
        ctx.throw(404, `list ${name} not found`);
    }

    const statuses = await utils.getTwit().get('lists/statuses', {
        list_id: cur_list.id_str,
        slug: cur_list.slug,
        tweet_mode: 'extended',
    });
    const data = statuses.data;

    ctx.state.data = {
        title: `Twitter List - ${id}/${name}`,
        link: `https://twitter.com/${id}/lists/${name}`,
        item: utils.ProcessFeed({
            data,
        }),
    };
};
