export default function NoticeCard({ title, children }) {
  return (
    <section className="notice-card">
      <h3>{title}</h3>
      <div>{children}</div>
    </section>
  );
}
