import React from 'react';
import classnames from 'classnames';
import styles from './styles.less';
import comma from './comma.svg';
import { renderTitle } from '../../utils';

export default function Card(props) {
  const { title, content, dark, autoWrap } = props;
  return <div className={classnames(styles.container, dark && styles.dark)} >
    {title && <h4 className={classnames(styles.title, autoWrap && styles.autoWrap)}>{renderTitle(title)}</h4>}
    <div className={styles.content}>
      <img src={comma} alt="" />
      {content.map(p => {
        if (typeof p === 'string') {
          return <p key={p} >{renderTitle(p)}</p>;
        }
        const { word, style } = p;
        return <p key={word} style={style} >{renderTitle(word)}</p>;
      })}
    </div>
  </div>
};

Card.defaultProps = {
  content: [],
  autoWrap: true,
}; 