export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <span className="logo__mark" aria-hidden="true" />
          <span>Pulse — фитнес-клуб</span>
        </div>
        <div className="footer__cols">
          <span>Москва, ул. Движения, 14</span>
          <span>07:00 — 23:00 без выходных</span>
          <span>hello@pulse.club</span>
        </div>
      </div>
    </footer>
  )
}