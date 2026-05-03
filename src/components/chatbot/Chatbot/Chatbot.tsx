import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { askChatbot, extractAnswer } from '@/api/chatbot';
import styles from './Chatbot.module.css';

interface Message {
  id: number;
  role: 'user' | 'bot' | 'error' | 'typing';
  text: string;
}

export function Chatbot() {
  const { user, openAuth } = useAuth();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [pending, setPending] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!user && open) setOpen(false);
  }, [user, open]);

  useEffect(() => {
    if (!open) return;
    if (messages.length === 0) {
      setMessages([
        { id: Date.now(), role: 'bot', text: 'Здравейте! С какво мога да помогна?' }
      ]);
    }
    setTimeout(() => inputRef.current?.focus(), 60);
  }, [open, messages.length]);

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages]);

  if (!user) return null;

  const send = async () => {
    if (pending) return;
    if (!user) {
      setOpen(false);
      openAuth('Влез');
      return;
    }
    const question = input.trim();
    if (!question) return;

    const userMsg: Message = { id: Date.now(), role: 'user', text: question };
    const typingMsg: Message = { id: Date.now() + 1, role: 'typing', text: 'Пише…' };
    setMessages((prev) => [...prev, userMsg, typingMsg]);
    setInput('');
    if (inputRef.current) inputRef.current.style.height = 'auto';
    setPending(true);

    try {
      const payload = await askChatbot(question);
      const answer = extractAnswer(payload as any) || 'Няма отговор.';
      setMessages((prev) =>
        prev
          .filter((m) => m.id !== typingMsg.id)
          .concat({ id: Date.now() + 2, role: 'bot', text: answer })
      );
    } catch (e) {
      console.error(e);
      setMessages((prev) =>
        prev
          .filter((m) => m.id !== typingMsg.id)
          .concat({
            id: Date.now() + 2,
            role: 'error',
            text: 'Възникна грешка. Моля, опитайте отново.'
          })
      );
    } finally {
      setPending(false);
      setTimeout(() => inputRef.current?.focus(), 60);
    }
  };

  const onKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const onInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
  };

  return (
    <>
      <button
        type="button"
        className={`${styles.toggle} ${open ? styles.open : ''}`}
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Затвори чат-бот' : 'Отвори чат-бот'}
      >
        {open ? '×' : '💬'}
      </button>

      {open && (
        <section className={styles.panel} role="dialog" aria-label="Чат-бот">
          <header className={styles.header}>
            <div className={styles.headerInfo}>
              <span className={styles.dot} aria-hidden="true" />
              <h3>UnitedSeeds асистент</h3>
            </div>
            <button
              type="button"
              className={styles.close}
              onClick={() => setOpen(false)}
              aria-label="Затвори"
            >
              ×
            </button>
          </header>
          <div ref={listRef} className={styles.messages}>
            {messages.map((m) => (
              <div key={m.id} className={`${styles.message} ${styles[m.role]}`}>
                {m.text}
              </div>
            ))}
          </div>
          <form
            className={styles.inputRow}
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
          >
            <textarea
              ref={inputRef}
              rows={1}
              value={input}
              onChange={onInput}
              onKeyDown={onKey}
              placeholder="Задайте въпрос..."
              aria-label="Вашето съобщение"
            />
            <button
              type="submit"
              className={styles.sendBtn}
              disabled={pending || !input.trim()}
              aria-label="Изпрати"
            >
              ➤
            </button>
          </form>
        </section>
      )}
    </>
  );
}