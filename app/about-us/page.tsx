import Link from 'next/link';
import styles from './about-us.module.css';

export default function AboutUs() {
  return (
    <div className={styles.heroBg}>
      <div className={styles.card}>
        <Link href="/">
          <div className={styles.logoCircle} tabIndex={0}>
            <img src="/logo.svg" alt="AI Trip Planner" className={styles.logo} />
          </div>
        </Link>
        <h1 className={styles.title}>Meet AI Trip Planner</h1>
        <p className={styles.intro}>
          <span role="img" aria-label="sparkle">✨</span>
          Your smart travel companion powered by AI! <span role="img" aria-label="plane">🛫</span>
        </p>
        <div className={styles.grid}>
          <div className={styles.feature}>
            <span className={styles.featureIcon} role="img" aria-label="magic wand">🪄</span>
            <h2>Effortless Itineraries</h2>
            <p>Get personalized plans with a single click—no stress, just destinations.</p>
          </div>
          <div className={styles.feature}>
            <span className={styles.featureIcon} role="img" aria-label="location">📍</span>
            <h2>Local Insights</h2>
            <p>Discover hidden gems curated by AI and fellow travelers.</p>
          </div>
          <div className={styles.feature}>
            <span className={styles.featureIcon} role="img" aria-label="handshake">🤝</span>
            <h2>Human Touch</h2>
            <p>Built by wanderers for wanderers, we care about your journey!</p>
          </div>
        </div>
        <p className={styles.footer}>
          Adventure awaits. Thank you for choosing us! <span role="img" aria-label="mountain">🏔️</span>
        </p>
      </div>
    </div>
  );
}
