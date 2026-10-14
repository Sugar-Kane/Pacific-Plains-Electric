import Image from "next/image";
export default function HeroBeach({ spanish = false }: { spanish?: boolean }) {
  return <><Image className="hero-beach" src="/images/pismo-beach.webp" alt="" fill sizes="100vw" preload quality={80} />
    <div className="hero-beach-shade" aria-hidden="true" />
    <p className="hero-photo-credit">{spanish ? "Pismo Beach · Foto: " : "Pismo Beach · Photo: "}<a href="https://commons.wikimedia.org/wiki/File:Pismobeach02032022.jpg">Soundsfancy</a>{" · "}<a href="https://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA 4.0</a></p>
  </>;
}
