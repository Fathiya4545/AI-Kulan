import { friendStories } from '../data/events';

export default function Friendships() {
  return (
    <section className="section friend-wrap" id="friendships">
      <div className="friend-top">
        <h2>Friendships are made on Kulan</h2>
        <p>
          Since 2002, members have used Kulan to make new friends, meet like-minded people,
          spend time on hobbies, and connect with locals over shared interests.
        </p>
      </div>
      <div className="friend-grid">
        {friendStories.map((f, i) => (
          <div className="friend-card" key={i}>
            <img src={f.img} alt="" />
            <h3>{f.title}</h3>
            <p>{f.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
