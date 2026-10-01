import styles from "./FogBackground.module.css";

/**
 * Fixed, full-viewport animated fog. Renders no client JS — the motion is
 * entirely CSS, so this stays a server component.
 */
export default function FogBackground() {
  return (
    <div className={styles.root} aria-hidden="true">
      <div className={`${styles.layer} ${styles.a}`} />
      <div className={`${styles.layer} ${styles.b}`} />
      <div className={`${styles.layer} ${styles.c}`} />
      <div className={`${styles.layer} ${styles.d}`} />
      <div className={styles.grain} />
      <div className={styles.vignette} />
    </div>
  );
}
