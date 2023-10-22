import TypingIndicator from '@/components/TypingIndicator';
import Members from '@/components/Members';
import Input from '@/components/Input';
import Messages from '@/components/Messages';
import Head from 'next/head';
import styles from '@/styles/Home.module.css';
import Script from 'next/script';

import { useState, useEffect, useRef } from 'react';
let drone = null;

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [members, setMembers] = useState([]);
  const [me, setMe] = useState({
    username: randomName(),
    color: randomColor(),
  });
  const messagesRef = useRef();
  messagesRef.current = messages;
  const membersRef = useRef();
  membersRef.current = members;
  const meRef = useRef();
  meRef.current = me;

  function connectToScaledrone() {
    drone = new window.Scaledrone('c9tDOhHqK2OIkDdh', {
      data: meRef.current,
    });

    drone.on('open', (error) => {
      if (error) {
        return console.error(error);
      }
      meRef.current.id = drone.clientId;
      setMe(meRef.current);
    });
    const room = drone.subscribe('observable-room');

    room.on('message', (message) => {
      const { data, member } = message;
      if (typeof data === 'object' && typeof data.typing === 'boolean') {
        const newMembers = [...membersRef.current];
        const index = newMembers.findIndex((m) => m.id === member.id);
        newMembers[index].typing = data.typing;
        setMembers(newMembers);
      } else {
        setMessages([...messagesRef.current, message]);
      }
    });
    room.on('members', (members) => {
      setMembers(members);
    });
    room.on('member_join', (member) => {
      setMembers([...membersRef.current, member]);
    });
    room.on('member_leave', ({ id }) => {
      const index = membersRef.current.findIndex((m) => m.id === id);
      const newMembers = [...membersRef.current];
      newMembers.splice(index, 1);
      setMembers(newMembers);
    });
  }
  useEffect(() => {
    if (drone === null) {
      connectToScaledrone();
    }
  }, []);
  function randomName() {
    const adjectives = [
      'Mali',
      'Veliki',
      'Tuzni',
      'Veseli',
      'Smireni',
      'Gorki',
      'Ljuti',
      'Slatki',
      'Slani',
      'Zabrinuti',
      'Podli',
      'Surovi',
      'Mlaki',
      'Dosadni',
      'Neozbiljni',
      'Stakleni',
      'Zimski',
      'Ljetni',
      'Proljetni',
      'Ruzni',
      'Zgodni',
      'Troglavi',
      'Plasticni',
      'Kuhani',
      'Peceni',
      'Smrdljivi',
      'Mirisni',
      'Zanosni',
      'Tajanstveni',
      'Glasni',
      'Tihi',
      'Sporki',
      'Sterilni',
      'Sanjivi',
      'Morski',
      'Dlakavi',
      'Glatki',
      'Hrapavi',
      'Kruti',
      'Mlohavi',
      'Debeli',
      'Mrsavi',
      'Tvoj',
      'Mamin',
      'Sigurni',
      'Nesigurni',
      'Ludi',
      'Pametni',
      'Umisljeni',
      'Gotovi',
      'Testni',
      'Saljivi',
      'Stari',
      'Mladi',
      'Ponosni',
      'Nemirni',
      'Umorni',
      'Bozanstveni',
      'Krivi',
      'Glamurozni',
      'Vrazji',
      'Prolazni',
      'Sklizavi',
    ];
    const nouns = [
      'profesor',
      'doktor',
      'brk',
      'slucaj',
      'smijeh',
      'put',
      'sin',
      'oblak',
      'krastavac',
      'krumpir',
      'znanstvenik',
      'televizor',
      'traktor',
      'lisac',
      'galeb',
      'poljubac',
      'puž',
      'programer',
      'glupan',
      'pametnjakovic',
      'skakavac',
      'instrument',
      'stih',
      'sumrak',
      'jastreb',
      'hrast',
      'kamen',
      'sir',
      'lutak',
      'macak',
      'pas',
      'klokan',
      'smrdljivac',
      'prasac',
      'konj',
      'magarac',
      'zmaj',
      'vaojer',
      'mis',
      'viking',
      'ratnik',
      'patuljak',
      'yogi',
      'Spiderman',
      'pupak',
      'ninja',
      'tvor',
      'ljenivac',
      'samuraj',
      'car',
      'divljak',
      'kralj',
      'princ',
      'zrak',
      'rob',
      'slon',
      'klon',
      'kapetan',
      'izvor',
      'glasonosa',
      'slinavac',
      'zabac',
      'miks',
      'orao',
    ];
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    return adjective.concat(' ', noun);
  }

  function randomColor() {
    return '#' + Math.floor(Math.random() * 0xffffff).toString(16);
  }

  function onSendMessage(message) {
    drone.publish({
      room: 'observable-room',
      message,
    });
  }
  function onChangeTypingState(isTyping) {
    drone.publish({
      room: 'observable-room',
      message: { typing: isTyping },
    });
  }
  return (
    <>
      <Head>
        <title>Moja chat aplikacija</title>
        <meta name='description' content='Moja chat aplikacija' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
        <script
          type='text/javascript'
          src='https://cdn.scaledrone.com/scaledrone.min.js'
        />
      </Head>
      <main className={styles.app}>
        <div className={styles.appContent}>
          <Members members={members} me={me} />
          <Messages messages={messages} me={me} />
          <TypingIndicator
            members={members.filter((m) => m.typing && m.id !== me.id)}
          />
          <Input
            onSendMessage={onSendMessage}
            onChangeTypingState={onChangeTypingState}
          />
        </div>
      </main>
    </>
  );
}
