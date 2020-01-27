import React from 'react';
import classnames from 'classnames';
import styles from './styles.less';
import { renderTitle } from '../../utils';

const StartIcon = () => <svg t="1579946313917" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="13393" width="200" height="200"><path d="M512 896C299.936 896 128 724.064 128 512S299.936 128 512 128s384 171.936 384 384-171.936 384-384 384m0-832C264.96 64 64 264.96 64 512s200.96 448 448 448 448-200.96 448-448S759.04 64 512 64" p-id="13394"></path><path d="M416 345.728L704 512l-288 166.272V345.728zM800 512c0-11.84-6.72-21.728-16.256-27.264l0.256-0.448-384-221.728-0.256 0.48A30.912 30.912 0 0 0 384 258.304a32 32 0 0 0-32 32v443.392a32 32 0 0 0 32 32 30.912 30.912 0 0 0 15.744-4.736l0.256 0.448 384-221.696-0.256-0.448A31.584 31.584 0 0 0 800 512z" p-id="13395"></path></svg>;

export default function Start({ topic, autoWrap, start }) {
  return <div className={styles.page}>
    {topic && <h4 className={classnames(styles.topic, autoWrap && styles.autoWrap)}>{renderTitle(topic)}</h4>}
    {start && <a className={styles.icon} onClick={start}><StartIcon /></a>}
  </div>
}

Start.defaultProps = {
  autoWrap: true,
};