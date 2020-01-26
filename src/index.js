import { useEffect, useState, useRef } from 'react';
import { Application, Texture, Sprite, filters } from 'pixi.js';
import video from './yangge_star.mp4';
import styles from './index.less';
// import Loading from './components/Loading';
import Header from './components/Header';
import Start from './components/Start';
import audio from './love_heart.mp3';
import Circle from './components/Circle';
import { throttle } from './utils';

const content = [
  '#2019#',
  '感谢有你',
  '相伴一年，未来可期'
];

const cards = [];
for (let i = 0; i < 6; i++) {
  cards.push({
    background: video,
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
    const { stage } = app;
    pixiContainer.current.appendChild(app.view);
    setFns({
      upload: src => {
        if (src === null) {
          return;
        }
        stage.removeChildren();
        const t = Texture.from(src);
        const s = new Sprite(t);
        s.name = 'background';
        const filter = new filters.BlurFilter();
        filter.blur = 8;
        s.filters = [filter];
        const { resource } = t.baseTexture;
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
