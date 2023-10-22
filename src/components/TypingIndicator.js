import React from 'react';
import styles from '@/styles/Home.module.css';

export default function ({ members }) {
  // 1
  const names = members.map((m) => m.clientData.username);
  if (names.length === 0) {
    return <div className={styles.typingIndicator}></div>;
  }
  // 2
  if (names.length === 1) {
    return <div className={styles.typingIndicator}>{names[0]} piše...</div>;
  }
  // 3
  const string = names.slice(0, -1).join(', ') + ' and ' + names.slice(-1);
  return <div className={styles.typingIndicator}>{string} are typing</div>;
}
