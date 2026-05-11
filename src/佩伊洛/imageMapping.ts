const CDN_BASE = 'https://testingcf.jsdelivr.net/gh/uyse44846-cmd/tavern_helper_template/dist/佩伊洛';

const OUTFIT_MAP: Record<string, { folder: string; prefix: string }> = {
  校服: { folder: '少女白色水手服校服', prefix: '水手服' },
  便服: { folder: '奶白毛衣格子裙便服', prefix: '格子裙' },
  睡衣: { folder: '少女粉色长袖居家睡衣', prefix: '睡衣' },
  连衣裙: { folder: '淡蓝色V领长袖雪纺连衣裙', prefix: '连衣裙' },
};

export function getPortraitUrl(outfit: string, expression: string): string | null {
  const mapping = OUTFIT_MAP[outfit];
  if (!mapping) return null;
  return `${CDN_BASE}/角色立绘/${encodeURIComponent(mapping.folder)}/${encodeURIComponent(mapping.prefix + expression)}.png`;
}

type LocationEntry = {
  keywords: string[];
  resolve: (timeSuffix: string) => string;
};

const LOCATION_ENTRIES: LocationEntry[] = [
  {
    keywords: ['教室'],
    resolve: t => (t === '夜晚' ? `教室/教室夜晚开灯.jpg` : `教室/教室${t}.jpg`),
  },
  {
    keywords: ['屋顶'],
    resolve: t => `学校屋顶/学校屋顶${t}.jpg`,
  },
  {
    keywords: ['过道'],
    resolve: t => (t === '夜晚' ? `学校地上过道/学校地上过道夜晚开灯.jpg` : `学校地上过道/学校地上过道${t}.jpg`),
  },
  {
    keywords: ['阶梯', '楼梯'],
    resolve: t => (t === '夜晚' ? `学校阶梯/学校阶梯夜晚开灯.jpg` : `学校阶梯/学校阶梯${t}.jpg`),
  },
  {
    keywords: ['学校路', '上学', '放学'],
    resolve: t => (t === '夜晚' ? `学校路上/学校路上夜晚开灯.jpg` : `学校路上/学校路上${t}.jpg`),
  },
  {
    keywords: ['客厅'],
    resolve: t => (t === '夜晚' ? `家中客厅/家中客厅夜晚开灯.jpg` : `家中客厅/家中客厅${t}.jpg`),
  },
  {
    keywords: ['玄关'],
    resolve: t => (t === '夜晚' ? `家中玄关/家中玄关夜晚开灯.jpg` : `家中玄关/家中玄关${t}.jpg`),
  },
  {
    keywords: ['男生卧室', '男.*卧室'],
    resolve: t => (t === '夜晚' ? `男生卧室/男生卧室夜晚开灯.jpg` : `男生卧室/男生卧室${t}.jpg`),
  },
  {
    keywords: ['女生卧室', '佩伊洛.*卧室', '她.*卧室'],
    resolve: t => (t === '夜晚' ? `女生卧室/女生卧室夜晚开灯.jpg` : `女生卧室/女生卧室${t}.jpg`),
  },
  {
    keywords: ['公园'],
    resolve: t => (t === '白天' ? `公园/公园.jpg` : `公园/公园${t}.jpg`),
  },
  {
    keywords: ['商店', '商业', '商街'],
    resolve: t => `商店街/商业街${t}.jpg`,
  },
  {
    keywords: ['住宅'],
    resolve: t => (t === '夜晚' ? `住宅街/住宅街夜晚开灯.jpg` : `住宅街/住宅街${t}.jpg`),
  },
  {
    keywords: ['樱花'],
    resolve: t => `樱花街/樱花街${t}.jpg`,
  },
  {
    keywords: ['食堂'],
    resolve: t => `食堂/食堂${t}.jpg`,
  },
  {
    keywords: ['电车站'],
    resolve: () => `电车站.jpg`,
  },
  {
    keywords: ['电车'],
    resolve: t => `电车内/电车${t}.jpg`,
  },
  {
    keywords: ['海边', '沙滩'],
    resolve: t => `海边沙滩/海边沙滩${t}.jpg`,
  },
  {
    keywords: ['岛', '海上'],
    resolve: t => `海，岛屿/海上${t}.jpg`,
  },
  {
    keywords: ['浴室', '浴缸'],
    resolve: () => `浴室/浴缸无水.jpg`,
  },
  {
    keywords: ['书店'],
    resolve: () => `书店.jpg`,
  },
  {
    keywords: ['便利店'],
    resolve: () => `便利店内.jpg`,
  },
  {
    keywords: ['购物'],
    resolve: () => `购物中心.jpg`,
  },
  {
    keywords: ['超市'],
    resolve: () => `超市.jpg`,
  },
];

function getTimeSuffix(timeStage: string): string {
  if (['清晨', '上午', '正午', '午后'].includes(timeStage)) return '白天';
  if (timeStage === '傍晚') return '傍晚';
  return '夜晚';
}

export function getBackgroundUrl(location: string, timeStage: string): string | null {
  const timeSuffix = getTimeSuffix(timeStage);

  for (const entry of LOCATION_ENTRIES) {
    for (const keyword of entry.keywords) {
      const match = keyword.includes('.*') ? new RegExp(keyword).test(location) : location.includes(keyword);
      if (match) {
        const path = entry.resolve(timeSuffix);
        return `${CDN_BASE}/背景/${encodeURIComponent(path).replace(/%2F/g, '/')}`;
      }
    }
  }

  return null;
}
