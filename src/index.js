import React from 'react';
import GreetingCard from './component';

// TODO: 设置 加载资源H
import audioLoveHeart from './loveHeart.mp3';
import videoShowa from './Showa.mp4';
import videoYangge from './yangge_star.mp4';

// TODO: 设置 抬头
const defaultHeader = '#2020# HAPPY NEW YEAR';

// TODO 设置 主题
const defaultTopic = '#伴我同行#STAND BY ME';

// TODO: 设置 cards 内容
const content = [
  '#2019#',
  '感谢有你',
  '相伴一年，未来可期'
];

const defaultCards = [];
for (let i = 0; i < 6; i += 1) {
  defaultCards.push({
    background: i % 2 === 0 ? videoShowa : videoYangge,
    title: `#伴我同行#STAND BY ME#${i}#`,
    content,
  });
}

export default function Card() {
  return <GreetingCard header={defaultHeader} topic={defaultTopic} cards={defaultCards} audio={audioLoveHeart} />;
}