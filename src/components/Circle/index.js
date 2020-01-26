import classnames from 'classnames';
import styles from './circle.less';
import Card from '../Card';

export default function Circle({ setBackground, current, next, cards, children }) {
  const { length } = cards;
  const angle = 360 / length;
  const zLen = 1.2 * (50 + 10 * length);
  return <div onClick={next} style={{ transform: current <= -1 ? 'rotateX(-90deg) rotateY(270deg)' : `rotateY(-${angle * current}deg) translateY(-${(current % 2) * 80}vw)` }} className={classnames(styles.container, current > -1 && styles.anime)}>
    <div className={styles.background} style={current > -1 ? { transform: `rotateY(${angle * current}deg) translateY(${(current % 2) * 80}vw)` } : {}} >{children}</div>
    {cards.map((card, index) => {
      const isCurrent = index === current % length;
      const props = { ...card };
      if (isCurrent) {
        props.setBackground = setBackground;
      }
      return (
        <div className={classnames(styles.card, isCurrent && styles.current)} key={card.key || card.title} style={{ transform: `rotateY(${angle * index}deg) translateZ(${zLen}vw) translateY(${(index % 2) * 80}vw)` }}>
          <Card {...props} />
        </div>
      );
    })}
  </div>
};
