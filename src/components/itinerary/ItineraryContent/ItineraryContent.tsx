import styles from './ItineraryContent.module.scss';

function formatItinerary(text: string) {
  const lines = text.split('\n');

  return lines.map((line, lineIndex) => {
    if (/^\*?\*?(Day \d+)/i.test(line)) {
      const clean = line.replace(/\*\*/g, '').trim();
      return <h2 key={lineIndex} className={styles.dayHeading}>{clean}</h2>;
    }
    if (/^(Morning|Afternoon|Evening|Travel Essentials|###)/i.test(line.replace(/\*\*/g, ''))) {
      const clean = line.replace(/\*\*/g, '').replace(/^###\s*/, '').trim();
      return <h3 key={lineIndex} className={styles.sectionHeading}>{clean}</h3>;
    }
    if (line.includes('**')) {
      const parts = line.split(/\*\*(.+?)\*\*/g);
      return (
        <p key={lineIndex} className={styles.paragraph}>
          {parts.map((part, partIndex) =>
            partIndex % 2 === 1 ? <strong key={partIndex}>{part}</strong> : part
          )}
        </p>
      );
    }
    if (/^[-•]\s/.test(line)) {
      return <li key={lineIndex} className={styles.listItem}>{line.replace(/^[-•]\s/, '')}</li>;
    }
    if (!line.trim()) return <br key={lineIndex} />;
    return <p key={lineIndex} className={styles.paragraph}>{line}</p>;
  });
}

interface Props {
  text: string;
  isStreaming?: boolean;
}

export default function ItineraryContent({ text, isStreaming = false }: Props) {
  return (
    <div aria-live="polite" aria-label="Your itinerary" className={styles.content}>
      {formatItinerary(text)}
      {isStreaming && <span className={styles.cursor} aria-hidden="true" />}
    </div>
  );
}
