import React from 'react';
import classnames from 'classnames';
import styles from './styles.less';

export default function Loading() {
  const cubes = [];
  for (let i = 1; i < 10; i++) {
    cubes.push(<div key={i} className={classnames(styles.cube, styles[`cube${i}`])}></div>)
  }
  return <div className={styles.page}>
    <div className={styles.container}>
      {cubes}
    </div>
  </div>

};
