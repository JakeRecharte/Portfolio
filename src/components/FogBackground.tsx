import styles from "./FogBackground.module.css";

/**
 * Fixed, full-viewport animated fog. The GIF animates on its own, so this
 * renders no client JS and stays a server component. Under reduced motion the
 * browser picks a still frame instead, and never downloads the GIF.
 */
export default function FogBackground() {
  return (
    <div className={styles.root} aria-hidden="true">
      {/*
        Plain <img>, not next/image: the optimizer does not animate GIFs, and
        the file is already the exact size it ships at, so there is nothing for
        it to optimize. eager + high priority because this is the page's
        backdrop, not something that should fade in late.
      */}
      <picture>
        <source
          media="(prefers-reduced-motion: reduce)"
          srcSet="/portfoliobg-still.jpg"
        />
        <img
          src="/portfoliobg.gif"
          alt=""
          className={styles.image}
          loading="eager"
          fetchPriority="high"
        />
      </picture>
    </div>
  );
}
