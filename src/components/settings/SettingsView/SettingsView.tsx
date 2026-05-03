import { useSettings } from '@/contexts/SettingsContext';
import { FormField } from '@/components/ui/FormField/FormField';
import styles from './SettingsView.module.css';

export function SettingsView() {
  const { settings, update } = useSettings();
  return (
    <section className={styles.view}>
      <header className={styles.head}>
        <h2>Настройки</h2>
        <p className={styles.subtitle}>Персонализирайте своето изживяване.</p>
      </header>

      <label className={styles.toggleRow}>
        <input
          type="checkbox"
          checked={settings.useProfileForDating}
          onChange={(e) => update({ useProfileForDating: e.target.checked })}
        />
        <span>Използвай профила за запознанства</span>
      </label>

      <div className={styles.grid}>
        <FormField label="Език по подразбиране">
          <select
            value={settings.language}
            onChange={(e) => update({ language: e.target.value as typeof settings.language })}
          >
            <option value="en">Английски</option>
            <option value="bg">Български</option>
            <option value="ro">Румънски</option>
            <option value="sv">Шведски</option>
            <option value="nl">Холандски</option>
          </select>
        </FormField>
        <FormField label="Предпочитана валута">
          <select
            value={settings.currency}
            onChange={(e) => update({ currency: e.target.value as typeof settings.currency })}
          >
            <option value="EUR">EUR</option>
            <option value="BGN">BGN</option>
            <option value="RON">RON</option>
          </select>
        </FormField>
      </div>
    </section>
  );
}