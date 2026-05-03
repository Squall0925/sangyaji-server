"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const TASK_TEMPLATES = [
    { stageId: 'egg', title: '观察蚕卵颜色', titleJunior: '看看蚕卵变成什么颜色了', description: '每天观察蚕卵颜色是否加深，记录变化', descriptionJunior: '蚕卵有没有变得更深色呢？仔细看看', taskType: 'observation', suggestedTime: 'anytime', requiredRecordType: 'photo', isDaily: true, priority: 2, isWarning: false },
    { stageId: 'egg', title: '保持环境安静', titleJunior: '小声一点哦', description: '蚕卵孵化需要安静环境', descriptionJunior: '蚕宝宝还在睡觉，要安安静静的', taskType: 'observation', suggestedTime: 'anytime', requiredRecordType: 'none', isDaily: true, priority: 3, isWarning: false },
    { stageId: 'egg', title: '观察是否有蚁蚕孵化', titleJunior: '有没有小蚕出来啦', description: '蚕卵颜色最深时即将孵化', descriptionJunior: '蚕卵变得很深的时候，小蚕宝宝就要出来啦！', taskType: 'milestone', suggestedTime: 'morning', requiredRecordType: 'photo', isDaily: true, priority: 1, isWarning: false },
    { stageId: 'instar_1', title: '桑叶切成细丝', titleJunior: '给桑叶剪细细的丝', description: '将新鲜桑叶切成1-2cm细丝', descriptionJunior: '用剪刀把桑叶剪成细细的丝', taskType: 'feeding', suggestedTime: 'morning', requiredRecordType: 'none', isDaily: true, priority: 1, isWarning: false },
    { stageId: 'instar_1', title: '不要用手抓蚁蚕', titleJunior: '不要用手抓蚕宝宝', description: '蚁蚕极小极脆弱，请用毛笔轻轻拨动', descriptionJunior: '蚕宝宝太小了，用手抓会伤到它', taskType: 'observation', suggestedTime: 'anytime', requiredRecordType: 'none', isDaily: true, priority: 1, isWarning: true },
    { stageId: 'instar_1', title: '确保桑叶无水珠', titleJunior: '擦干桑叶上的水', description: '喂食前检查桑叶上无水珠', descriptionJunior: '桑叶上有水珠要擦干哦', taskType: 'feeding', suggestedTime: 'morning', requiredRecordType: 'none', isDaily: true, priority: 1, isWarning: true },
    { stageId: 'molt_1', title: '不要触碰蚕！', titleJunior: '蚕宝宝在睡觉，不要碰！', description: '蚕在眠期正在蜕皮，触碰会导致蜕皮失败', descriptionJunior: '蚕宝宝在换新衣服，碰它会疼的！', taskType: 'observation', suggestedTime: 'anytime', requiredRecordType: 'none', isDaily: true, priority: 1, isWarning: true },
    { stageId: 'molt_1', title: '不要投放桑叶', titleJunior: '不用喂桑叶', description: '眠期蚕不吃食', descriptionJunior: '蚕宝宝睡觉时不吃东西', taskType: 'feeding', suggestedTime: 'morning', requiredRecordType: 'none', isDaily: true, priority: 1, isWarning: true },
    { stageId: 'molt_1', title: '观察蜕皮过程', titleJunior: '看看蚕怎么换衣服', description: '远距离观察蚕的蜕皮', descriptionJunior: '悄悄看看蚕宝宝的旧皮怎么脱下来的', taskType: 'observation', suggestedTime: 'anytime', requiredRecordType: 'photo', isDaily: true, priority: 2, isWarning: false },
    { stageId: 'molt_2', title: '不要触碰蚕！', titleJunior: '蚕宝宝在睡觉，不要碰！', description: '蚕在眠期正在蜕皮', descriptionJunior: '蚕宝宝在换衣服，不要碰！', taskType: 'observation', suggestedTime: 'anytime', requiredRecordType: 'none', isDaily: true, priority: 1, isWarning: true },
    { stageId: 'molt_2', title: '观察蜕皮', titleJunior: '看看蚕怎么换衣服', description: '远距离观察蜕皮', descriptionJunior: '悄悄看看蚕宝宝的旧皮怎么脱下来的', taskType: 'observation', suggestedTime: 'anytime', requiredRecordType: 'photo', isDaily: true, priority: 2, isWarning: false },
    { stageId: 'molt_3', title: '不要触碰蚕！', titleJunior: '蚕宝宝在睡觉，不要碰！', description: '蚕在眠期正在蜕皮', descriptionJunior: '蚕宝宝在换衣服，不要碰！', taskType: 'observation', suggestedTime: 'anytime', requiredRecordType: 'none', isDaily: true, priority: 1, isWarning: true },
    { stageId: 'molt_3', title: '眠前清理蚕沙', titleJunior: '帮蚕宝宝打扫房间', description: '三眠前做一次彻底蚕沙清理', descriptionJunior: '趁蚕宝宝还没睡着，帮它把房间打扫干净', taskType: 'cleaning', suggestedTime: 'morning', requiredRecordType: 'none', isDaily: true, priority: 2, isWarning: false },
    { stageId: 'molt_4', title: '不要触碰蚕！', titleJunior: '蚕宝宝在最后一次睡觉，不要碰！', description: '四眠是最后一次蜕皮，绝不要触碰', descriptionJunior: '蚕宝宝在最后一次换衣服，不要碰它！', taskType: 'observation', suggestedTime: 'anytime', requiredRecordType: 'none', isDaily: true, priority: 1, isWarning: true },
    { stageId: 'molt_4', title: '蚕没有死，只是在眠', titleJunior: '蚕宝宝没有死，它在睡觉！', description: '四眠时间较长，蚕不动可能被误认为死亡', descriptionJunior: '蚕宝宝一动不动不是死了哦，它在很认真地换衣服呢', taskType: 'observation', suggestedTime: 'anytime', requiredRecordType: 'none', isDaily: true, priority: 1, isWarning: true },
    { stageId: 'instar_2', title: '桑叶切小块', titleJunior: '把桑叶剪小块', description: '将桑叶切成2-3cm小块', descriptionJunior: '把桑叶剪成小块，蚕宝宝吃得方便', taskType: 'feeding', suggestedTime: 'morning', requiredRecordType: 'none', isDaily: true, priority: 1, isWarning: false },
    { stageId: 'instar_2', title: '观察体色变化', titleJunior: '看看蚕宝宝变白了没', description: '二龄蚕体色从黑色转为青白色', descriptionJunior: '蚕宝宝是不是比之前白了一些？', taskType: 'observation', suggestedTime: 'afternoon', requiredRecordType: 'photo', isDaily: true, priority: 2, isWarning: false },
    { stageId: 'instar_3', title: '可用整片嫩桑叶', titleJunior: '蚕宝宝可以吃整片叶子啦', description: '三龄蚕已可用整片嫩桑叶喂养', descriptionJunior: '蚕宝宝长大了，可以吃整片新鲜桑叶了！', taskType: 'feeding', suggestedTime: 'morning', requiredRecordType: 'none', isDaily: true, priority: 1, isWarning: false },
    { stageId: 'instar_3', title: '清理蚕沙', titleJunior: '帮蚕宝宝倒垃圾', description: '每日清理蚕沙防止病害', descriptionJunior: '把蚕宝宝的便便清走，保持房间干净', taskType: 'cleaning', suggestedTime: 'evening', requiredRecordType: 'none', isDaily: true, priority: 2, isWarning: false },
    { stageId: 'instar_4', title: '增加桑叶供给', titleJunior: '多放些桑叶', description: '四龄蚕食量大增，确保充足', descriptionJunior: '蚕宝宝现在是大孩子了，吃得很多', taskType: 'feeding', suggestedTime: 'morning', requiredRecordType: 'none', isDaily: true, priority: 1, isWarning: false },
    { stageId: 'instar_4', title: '保持通风', titleJunior: '给蚕宝宝透气', description: '大蚕期需要良好通风', descriptionJunior: '蚕宝宝需要新鲜空气', taskType: 'observation', suggestedTime: 'morning', requiredRecordType: 'none', isDaily: true, priority: 2, isWarning: false },
    { stageId: 'instar_5', title: '足量供给桑叶', titleJunior: '放好多好多桑叶', description: '五龄蚕食量最大', descriptionJunior: '蚕宝宝要吃好多好多桑叶', taskType: 'feeding', suggestedTime: 'morning', requiredRecordType: 'none', isDaily: true, priority: 1, isWarning: false },
    { stageId: 'instar_5', title: '观察身体是否发亮', titleJunior: '看看蚕宝宝有没有变得亮亮的', description: '身体发亮=即将结茧', descriptionJunior: '如果蚕宝宝变得亮亮的，就是它要吐丝啦！', taskType: 'observation', suggestedTime: 'afternoon', requiredRecordType: 'photo', isDaily: true, priority: 1, isWarning: false },
    { stageId: 'instar_5', title: '准备结茧架', titleJunior: '给蚕宝宝准备小房子', description: '五龄第4天开始准备结茧架', descriptionJunior: '准备一个小架子，蚕宝宝会自己爬上去吐丝盖房子', taskType: 'preparation', suggestedTime: 'anytime', requiredRecordType: 'photo', isDaily: false, dayOffset: 4, priority: 1, isWarning: false },
    { stageId: 'cocoon', title: '观察吐丝过程', titleJunior: '看蚕宝宝吐丝', description: '观察蚕头部8字形摆动吐丝', descriptionJunior: '蚕宝宝的头在画8字呢！那就是在吐丝', taskType: 'observation', suggestedTime: 'anytime', requiredRecordType: 'video', isDaily: true, priority: 1, isWarning: false },
    { stageId: 'cocoon', title: '不要移动蚕茧', titleJunior: '不要动蚕宝宝的小房子', description: '结茧期间不要移动或触碰蚕茧', descriptionJunior: '蚕宝宝正在盖房子，不能动它的小房子', taskType: 'observation', suggestedTime: 'anytime', requiredRecordType: 'none', isDaily: true, priority: 1, isWarning: true },
    { stageId: 'cocoon', title: '记录结茧数量', titleJunior: '数数有几个蚕茧', description: '记录已完成的蚕茧数量和颜色', descriptionJunior: '数一数有几个蚕茧啦？', taskType: 'measurement', suggestedTime: 'evening', requiredRecordType: 'photo', isDaily: true, priority: 2, isWarning: false },
    { stageId: 'pupa', title: '轻摇蚕茧感受重量', titleJunior: '轻轻摇一摇蚕茧', description: '每天轻摇蚕茧，感受重量变化', descriptionJunior: '轻轻摇一摇蚕茧，里面还在动就说明蚕蛾在长大', taskType: 'observation', suggestedTime: 'afternoon', requiredRecordType: 'none', isDaily: true, priority: 2, isWarning: false },
    { stageId: 'pupa', title: '耐心等待', titleJunior: '耐心等一等', description: '蛹期10-14天，外观无变化属正常', descriptionJunior: '蚕宝宝在里面变魔法呢，我们要耐心等一等', taskType: 'observation', suggestedTime: 'anytime', requiredRecordType: 'none', isDaily: true, priority: 3, isWarning: false },
    { stageId: 'moth', title: '观察蚕蛾破茧', titleJunior: '看蚕蛾钻出来', description: '观察蚕蛾如何从茧中钻出', descriptionJunior: '蚕蛾从茧里钻出来啦！', taskType: 'milestone', suggestedTime: 'morning', requiredRecordType: 'video', isDaily: true, priority: 1, isWarning: false },
    { stageId: 'moth', title: '不要帮助蚕蛾出茧', titleJunior: '不要帮蚕蛾出来', description: '蚕蛾需要自己挣破茧口', descriptionJunior: '蚕蛾要自己努力钻出来，不能帮它哦', taskType: 'observation', suggestedTime: 'anytime', requiredRecordType: 'none', isDaily: true, priority: 1, isWarning: true },
    { stageId: 'moth', title: '分辨雌雄', titleJunior: '看看谁是男谁是女', description: '雌蛾肚子大，雄蛾肚子小', descriptionJunior: '肚子大的是妈妈蚕蛾，肚子小的是爸爸蚕蛾', taskType: 'observation', suggestedTime: 'afternoon', requiredRecordType: 'photo', isDaily: true, priority: 2, isWarning: false },
    { stageId: 'lay_eggs', title: '铺产卵纸', titleJunior: '铺好白纸等蚕蛾生宝宝', description: '在饲养盒底部铺白纸', descriptionJunior: '在盒子底下铺一张白纸，蚕蛾要在上面生宝宝', taskType: 'preparation', suggestedTime: 'morning', requiredRecordType: 'none', isDaily: false, dayOffset: 0, priority: 1, isWarning: false },
    { stageId: 'lay_eggs', title: '观察产卵过程', titleJunior: '看蚕蛾生宝宝', description: '观察蚕蛾产卵，记录数量', descriptionJunior: '蚕蛾在生小宝宝啦！数数有多少个小蚕卵', taskType: 'observation', suggestedTime: 'afternoon', requiredRecordType: 'photo', isDaily: true, priority: 1, isWarning: false },
    { stageId: 'lay_eggs', title: '收集保存蚕卵', titleJunior: '把蚕卵收好', description: '产卵结束后收集蚕卵冷藏保存', descriptionJunior: '把蚕卵收集起来放进冰箱，明年春天又能养蚕啦', taskType: 'preparation', suggestedTime: 'anytime', requiredRecordType: 'photo', isDaily: false, dayOffset: 3, priority: 2, isWarning: false },
];
async function main() {
    console.log('🌱 开始播种养蚕任务模板数据...');
    await prisma.taskLog.deleteMany();
    await prisma.taskTemplate.deleteMany();
    let count = 0;
    for (const tmpl of TASK_TEMPLATES) {
        await prisma.taskTemplate.create({
            data: {
                stageId: tmpl.stageId,
                title: tmpl.title,
                titleJunior: tmpl.titleJunior,
                description: tmpl.description,
                descriptionJunior: tmpl.descriptionJunior,
                taskType: tmpl.taskType,
                suggestedTime: tmpl.suggestedTime,
                requiredRecordType: tmpl.requiredRecordType,
                isDaily: tmpl.isDaily,
                dayOffset: tmpl.dayOffset ?? null,
                priority: tmpl.priority,
                isWarning: tmpl.isWarning,
                sortOrder: count,
            },
        });
        count++;
    }
    console.log(`✅ 已播种 ${count} 条任务模板`);
}
main()
    .catch((e) => {
    console.error('❌ 播种失败:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map