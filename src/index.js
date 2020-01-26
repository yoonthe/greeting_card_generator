import { useEffect, useState, useRef } from 'react';
import { Application, Texture, Sprite, filters } from 'pixi.js';
import video from './yangge_star.mp4';
import video1 from './zhaohe.mp4';
import styles from './index.less';
// import Loading from './components/Loading';
import Header from './components/Header';
import Start from './components/Start';
import audio from './love_heart.mp3';
import Circle from './components/Circle';
import { throttle } from './utils';

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

const content = [
  '#2019#',
  '感谢有你',
  '相伴一年，未来可期'
];

const cards = [];
for (let i = 0; i < 6; i++) {
  cards.push({
    background: i % 2 === 1 ? video1 : video,
    title: `#伴我同行#STAND BY ME#${i}#`,
    content,
  });
}

export default function GreetingCards() {
  const [fns, setFns] = useState(null);
  const [current, setCurrent] = useState(-1);
  const [videoSource, setVideoSource] = useState(null);
  const [setAudio, setAudioSource] = useState(null);
  const pixiContainer = useRef(null);
  useEffect(() => {
    if (!pixiContainer || !pixiContainer.current) {
      return;
    }
    // 设置
    document.body.style = 'margin: 0;';
    document.body.parentNode.style = `font-size: ${18 + 4 * window.devicePixelRatio}px`;
    const { innerWidth: width, innerHeight: height } = window;
    const app = new Application({ width, height });
    const { stage, ticker } = app;
    pixiContainer.current.appendChild(app.view);
    setFns({
      upload: src => {
        if (src === null) {
          return;
        }
        const nextBackground = () => {
          stage.removeChildren();
          const texture = Texture.from(src);
          const s = new Sprite(texture);
          s.name = 'background';
          const blurFilter = new filters.BlurFilter();
          
          blurFilter.blur = 8;
          s.filters = [blurFilter, setDarkAnimation(ticker, false)];
          const { resource } = texture.baseTexture;
          if (resource && resource.source) {
            const { source } = resource;
            source.muted = true;
            source.loop = true;
            source.autoplay = true;
            setVideoSource(source);
          }
          s.width = width;
          s.height = height;
          stage.addChild(s);
        };
        const last = stage.getChildByName('background');
        if (last) {
          last.filters[1] = setDarkAnimation(ticker, true, nextBackground);
        } else {
          nextBackground();
        }
      },
    });
  }, []);
  return (
    <div className={styles.normal}>
      <Header header="2019" src={audio} setAudio={setAudioSource} />
      <Start topic="#伴我同行#STAND BY ME" start={current === -1 ? () => {
        setCurrent(0);
        if (videoSource) {
          videoSource.play();
        }
        if (setAudio && setAudio.handle) {
          setAudio.handle(true);
        }
      } : null} />
      <Circle current={current} next={throttle(() => setCurrent(current + 1), 'current', 2500)} fns={fns} cards={cards} >
        <div ref={pixiContainer} className={styles.background}></div>
      </Circle>
    </div>
  );
}

GreetingCards.defaultProps = {
  header: '2019',
};
