// Demo details. Baad me real information se replace kar lena.
window.WEDDING = {
  groom: "Satish",
  bride: "Geeta",
  tagline: "Two hearts, one beautiful journey",
  weddingDate: "2026-12-10T19:00:00",
  dateLabel: "10 December 2026",

  // ===== VENUE (yahin se badalna hai) =====
  venue: "The Royal Palace, Jaipur",                                  // hero + "The venue" card ka naam + calendar location
  address: "Demo Road, Near City Palace, Jaipur, Rajasthan 302001",   // "The venue" card ka address
  mapsUrl: "https://maps.google.com/?q=Jaipur+City+Palace",           // "Open in Google Maps" button ka link

  theme: "royal", // royal | emerald | midnight | rose
  song: "assets/wedding-song.mp3",
  photos: ["assets/photo1.jpg", "assets/photo2.jpg"],

  // ===== EVENTS (har card ki date, time, venue) =====
  events: [
    { name: "Haldi Ceremony",         date: "8 December 2026",  time: "10:00 AM", venue: "The Royal Palace, Jaipur" },
    { name: "Mehendi Ceremony",       date: "8 December 2026",  time: "4:00 PM",  venue: "The Royal Palace, Jaipur" },
    { name: "Lagan / Tilak Ceremony", date: "9 December 2026",  time: "11:00 AM", venue: "The Royal Palace, Jaipur" },
    { name: "Wedding / Vivah",        date: "10 December 2026", time: "7:00 PM",  venue: "The Royal Palace, Jaipur" },
    { name: "Reception",              date: "11 December 2026", time: "8:00 PM",  venue: "The Royal Palace, Jaipur" }
  ]
};
