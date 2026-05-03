// "use client";
import Image from "next/image";

export function MainIllustration() {
  return (
    <div
      className="w-full h-full select-none pointer-events-none"
      aria-hidden="true"
    >
      <Image
        src="/Loginactor.png"
        alt=""
        className="absolute bottom-0 right-[-320px] -translate-x-1/2 h-100 w-auto object-contain drop-shadow-2xl z-40"
        aria-hidden="true"
        width={500}
        height={600}
        loading="eager"
      />
    </div>
  );
}
 
// ─── Inline SVG: small secondary character (boy with book) ───────────────────
 
// export function SecondaryIllustration() {
//   return (
//     <div
//       className="absolute bottom-3 left-4 w-20 h-20 select-none pointer-events-none"
//       aria-hidden="true"
//     >
//       {/* eslint-disable-next-line @next/next/no-img-element */}
//       <img
//         src="/illustrations/login-boy.png"
//         alt=""
//         className="h-full w-auto object-contain"
//         aria-hidden="true"
//         loading="eager"
//         onError={(e) => {
//           (e.currentTarget as HTMLImageElement).style.display = "none";
//         }}
//       />
//     </div>
//   );
// }