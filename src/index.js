import React, { useEffect, useState, useRef } from 'react';
import { Application, Texture, Sprite, filters } from 'pixi.js';
import styles from './index.less';
import Loading from './components/Loading';
import Header from './components/Header';
import Start from './components/Start';
import Circle from './components/Circle';
import { throttle } from './utils';

// TODO: 设置 加载资源H
import audioLoveHeart from './loveHeart.mp3';
import videoZhaohe from './zhaohe.mp4';
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
    background: i % 2 === 0 ? videoZhaohe : videoYangge,
    title: `#伴我同行#STAND BY ME#${i}#`,
    content,
  });
}

const FPS = 30;

const setDarkAnimation = (ticker, gotoDark, callback) => {
  const darkFilter = new filters.ColorMatrixFilter();
  let t = FPS;
  const setBrightness = gotoDark ? step => darkFilter.brightness(step) : step => darkFilter.brightness(1 - step);
  const animate = delta => {
    if (t < 0) {
      return;
    }
    t -= delta;
    if (t <= 0) {
      if (typeof callback === 'function') {
        callback();
      }
      setBrightness(0);
      ticker.remove(animate);
    }
    setBrightness(t / FPS);
  };
  ticker.add(animate);
  return darkFilter;
};

function throttleWindow(type, name) {
  let running = false;
  const func = () => {
    if (running) { return; }
    running = true;
    requestAnimationFrame(() => {
      window.dispatchEvent(new CustomEvent(name));
      running = false;
    });
  };
  window.addEventListener(type, func);
};

/* init - you can init any event */
throttleWindow('resize', 'optimizedResize');

let backgroundSources = null;
let backgroundTextures = {};
let setBackground = null;
let resizeHandler = null;

export default function GreetingCards({ header, audio, topic, cards }) {
  const [current, setCurrent] = useState(-2);
  const [setAudio, setAudioSource] = useState(null);
  const pixiContainer = useRef(null);
  const backgrounds = new Set();
  cards.forEach(c => {
    if (c.background) {
      backgrounds.add(c.background);
    }
  });
  useEffect(() => {
    if (!pixiContainer || !pixiContainer.current) {
      return;
    }
    // 设置
    const { innerWidth: width, innerHeight: height } = window;
    document.body.style = 'margin: 0;';
    document.body.parentNode.style = `font-size: ${Math.floor(Math.min(width, height) / 25) + 2 * window.devicePixelRatio}px`;

    const app = new Application({ width, height });
    const { stage, ticker, loader, view } = app;
    //判断手机横竖屏状态
    const orientationTest = () => {
      if (window.orientation === 180 || window.orientation === 0) {
        alert('请先切换至横屏以播放!');
      }
      const { innerWidth: cWidth, innerHeight: cHeight } = window;
      view.width = cWidth;
      view.height = cHeight;
      if (typeof resizeHandler === 'function') {
        resizeHandler(cWidth, cHeight);
      }
    };
    orientationTest();
    if ('onorientationchange' in window) {
      window.addEventListener('orientationchange', orientationTest, false);
    }
    window.addEventListener('optimizedResize', orientationTest, false);
    backgrounds.forEach(v => loader.add(v));
    loader.load((_, resources) => {
      console.log(_, resources);
      Object.keys(resources).forEach(r => {
        const source = resources[r].data;
        source.muted = true;
        source.loop = true;
        source.autoplay = true;
        source.playsInline = true;
        backgroundTextures[r] = Texture.from(source);
      });
      backgroundSources = resources;
      setCurrent(-1);
    });
    setBackground = src => {
      if (src === null) {
        return;
      }
      const nextBackground = () => {
        stage.removeChildren();
        if (!backgroundTextures || !(src in backgroundTextures)) {
          throw new Error(`${src} is not loaded!`);
        }
        const texture = backgroundTextures[src];
        const s = new Sprite(texture);
        s.name = 'background';
        const blurFilter = new filters.BlurFilter();

        blurFilter.blur = 8;
        s.filters = [blurFilter, setDarkAnimation(ticker, false)];
        const { resource } = texture.baseTexture;
        resizeHandler = (cWidth, cHeight) => {
          const { width: sWidth, height: sHeight } = resource;
          if (sWidth === 0) {
            s.width = cWidth;
            s.height = cHeight;
          } else {
            const scale = Math.max(cWidth / sWidth, cHeight / sHeight);
            s.width = sWidth * scale;
            s.height = sHeight * scale;
          }
        };
        resizeHandler(width, height);
        stage.addChild(s);
      };
      const last = stage.getChildByName('background');
      if (last) {
        last.filters[1] = setDarkAnimation(ticker, true, nextBackground);
      } else {
        nextBackground();
      }
    };
    pixiContainer.current.appendChild(view);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className={styles.normal}>
      <Header header={header} src={audio} setAudio={setAudioSource} />
      {current === -2 ? <Loading /> : <Start topic={topic} start={current === -1 ? () => {
        setCurrent(0);
        setBackground(cards[0].background);
        if (backgroundSources) {
          Object.keys(backgroundSources).forEach(r => {
            const source = backgroundSources[r].data;
            if (typeof source.play === 'function') {
              source.play();
            }
          });
        }
        if (setAudio && setAudio.handle) {
          setAudio.handle(true);
        }
      } : null} />}
      <Circle current={current} next={throttle(() => {
        setCurrent(current + 1);
        const card = cards[(current + 1) % cards.length];
        setBackground(card.background);
      }, 'current', 1000)} cards={cards} >
        <div ref={pixiContainer} className={styles.background}></div>
      </Circle>
    </div>
  );
}

GreetingCards.defaultProps = {
  header: defaultHeader,
  topic: defaultTopic,
  cards: defaultCards,
  audio: audioLoveHeart,
};
