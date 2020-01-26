import { useState, useEffect, useRef } from 'react';
import classnames from 'classnames';
import styles from './header.less';
import { renderTitle } from '../../utils';

const Music = () => {
  return <svg t="1579937632177" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3947" width="200" height="200">
    <path d="M768.496 359.12L648.224 572a128 128 0 1 1-1.648-92.288l90.784-160.656A295.2 295.2 0 0 0 520 224C356.512 224 224 356.512 224 520S356.512 816 520 816C683.472 816 816 683.472 816 520c0-59.328-17.44-114.56-47.504-160.88zM600.272 562.352l-0.272-0.144 1.648-2.912a80 80 0 1 0-1.376 3.072zM864 520C864 709.984 709.984 864 520 864S176 709.984 176 520 330.016 176 520 176 864 330.016 864 520z" p-id="3948"></path>
  </svg>;
};

export default function Header({ header, src, setAudio }) {
  const [enable, setEnable] = useState(true);
  const audio = useRef(null);
  const handle = isStart => {
    if (audio && audio.current) {
      // console.log(audio.current);
      if (isStart) {
        audio.current.play();
      } else {
        audio.current.pause();
      }
    }
    setEnable(isStart);
  };
  useEffect(() => {
   setAudio({ handle });
  }, []);
  return <header className={styles.header}>
    <span className={styles.trans}>{renderTitle(header)}</span>
    <span title={enable ? '播放中' : '暂停中'} className={classnames(styles.music, !enable && styles.disabled)} onClick={() => handle(!enable)}>
      <Music />
      {src && <audio loop autoPlay ref={audio} src={src} />}
    </span>
  </header>;
}