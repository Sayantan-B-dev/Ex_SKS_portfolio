import Image from "next/image";

const SONGS = [
  { seed: "song1", title: "AAO HUZOOR" },
  { seed: "song2", title: "MERE SUKH BHI TERE NEIN" },
  { seed: "song3", title: "TUM ITNI KHOOBSURAT HO" },
  { seed: "song4", title: "BICHDE" },
  { seed: "song5", title: "DIL DI DHADKAN" },
  { seed: "song6", title: "MAJHIRE MAJHI" },
  { seed: "song7", title: "LINES" },
];

export default function SongsSection() {
  return (
    <section className="songs" id="songs">
      <div className="wrap">
        <h2 className="sec-heading">SONGS THAT TOUCH HEARTS</h2>
        <div className="sec-underline" />

        <div className="song-grid">
          {SONGS.map((song) => (
            <div className="song-card" key={song.seed}>
              <Image
                src={`https://picsum.photos/seed/${song.seed}/240/320`}
                alt={song.title}
                fill
                sizes="(max-width: 768px) 28vw, 130px"
              />
              <div className="song-title">{song.title}</div>
            </div>
          ))}
        </div>

        <a href="#songs" className="btn-outline-pink">
          EXPLORE ALL SONGS
        </a>
      </div>
    </section>
  );
}
