/**
 * KERALA ODYSSEY — LUXURY HOTELS & SANCTUARIES DIRECTORY
 * Verified Accommodations Engine with Category Filters, Search & Bucket List Sync
 */

const keralaHotels = [
  ['Thiruvananthapuram','The Leela Kovalam','5','Kovalam','https://www.theraviz.com/the-leela-kovalam-a-raviz-hotel/','https://img.theweek.in/content/dam/week/week/news/tourism/images/2025/1/11/leela-raviz-kovalam.jpg.transform/schema-16x9/image.jpg','The Week'],
  ['Thiruvananthapuram','KTDC Samudra','3','Kovalam','https://www.ktdc.com/samudra','https://www.keralatourism.org/uploads/destination-wedding/images/large/exterior1-20230301102755484929.jpg','Kerala Tourism'],
  ['Kollam','The Quilon Beach Hotel & Convention Centre','5','Kollam Beach','https://www.thequilonbeachhotel.com/','https://www.holidify.com/images/cmsuploads/compressed/22333157_20230310220958.jpg','Holidify'],
  ['Kollam','The Raviz Ashtamudi','5','Thevally','https://www.theraviz.com/','https://storagelargeimg.imgix.net/the-leela-ashtamudi-a-raviz-hotel-kollam-01.jpg?auto=format&fit=crop&fm=jpg','Away Holidays'],
  ['Alappuzha','Ramada by Wyndham Alleppey','5','Nehru Trophy Finishing Point','https://www.wyndhamhotels.com/ramada/alleppey-india/','https://www.keralatourism.org/images/service-providers/photos/property-2671-Facilities-6667-20180715171139.jpg','Kerala Tourism'],
  ['Kottayam','Kumarakom Lake Resort','5','Kumarakom','https://www.kumarakomlakeresort.in/','https://d19lgisewk9l6l.cloudfront.net/assetbank/Meandering_Pool_Villa_Kumarakom_Lake_Resort_Kumarakom_Kerala_India_59261.jpg','The Luxury Holiday Company'],
  ['Kottayam','Backwater Ripples','5','Kumarakom','https://www.backwaterripples.com/','https://pbs.twimg.com/media/Fqh2nBBXsAESk3n.jpg','Backwater Ripples'],
  ['Kottayam','The Zuri Kumarakom','5','Kumarakom','https://www.thezurihotels.com/','https://www.luxuryindiatours.com/wp-content/uploads/2023/09/THE-ZURI.jpg','Luxury India Tours'],
  ['Idukki','Blanket Hotel & Spa','5','Munnar','https://www.blanketmunnar.com/','https://www.kayak.com/rimg/himg/a1/23/1a/expedia_group-2785166-8e221a-808245.jpg?crop=true&height=607&width=836','KAYAK'],
  ['Idukki','Spice Village','5','Thekkady','https://www.cghearth.com/spice-village','https://www.notintown.net/old/review_pic/2025/1-1744909941.jpg','NotInTown'],
  ['Ernakulam','Le Méridien Kochi','5','Maradu','https://www.marriott.com/en-us/hotels/cokmd-le-meridien-kochi/overview/','https://cache.marriott.com/is/image/marriotts7prod/md-cokmd-facade-day-21422:Wide-Hor?fit=constrain&wid=900','Marriott'],
  ['Thrissur','Hyatt Regency Thrissur','5','Puzhakkal','https://www.hyatt.com/','https://wanderon-images.gumlet.io/blogs/new/2024/03/f368bf13-e1fa-4ea9-80f0-ffa5f947aecf.jpg?auto=compress%2Cformat&w=1024','WanderOn'],
  ['Malappuram','The Raviz Kadavu','5','Feroke / Kadavu','https://www.theraviz.com/','https://i0.wp.com/currylines.com/wp-content/uploads/2017/09/IMG_2474.jpg?resize=768%2C512&ssl=1','Currylines'],
  ['Kozhikode','The Raviz Calicut','5','Mavoor Road','https://www.theraviz.com/','https://r1imghtlak.mmtcdn.com/0cdf73c2725011e7a95a025f77df004f.jpg','MakeMyTrip'],
  ['Wayanad','Vythiri Village','5','Vythiri','https://www.vythirivillage.com/','https://rukmini-ct.flixcart.com/q_auto%2Cf_auto/ct-hotel-images/places/hotels/cms/3141/314152/images/image_314152_9846cbdf-00b2-45e6-bf23-b47bb3c91c00_proc.jpeg','Cleartrip'],
  ['Kannur','Mascot Beach Resort','4','Burnassery','https://www.mascotbeachresort.com/','https://gos3.ibcdn.com/e98aff6a6fa011e78c5b0a4cef95d023.jpg','Goibibo'],
  ['Kasaragod','Taj Bekal Resort & Spa','5','Bekal','https://www.tajhotels.com/','https://r1imghtlak.mmtcdn.com/84c0268e220911e8a6d40a4cef95d023.jpg','MakeMyTrip']
];

(function () {
  'use strict';

  const container = document.getElementById('hotelGrid');
  const starFilterBtns = document.querySelectorAll('.star-filter-btn');
  const hotelSearchInput = document.getElementById('hotelSearchInput');

  let activeStar = 'all';
  let searchQuery = '';

  function renderHotels() {
    if (!container) return;

    const filtered = keralaHotels.filter(item => {
      const [district, name, stars, place] = item;
      const matchesStar = activeStar === 'all' || stars === activeStar;
      const matchesQuery = !searchQuery || 
        name.toLowerCase().includes(searchQuery) ||
        district.toLowerCase().includes(searchQuery) ||
        place.toLowerCase().includes(searchQuery);

      return matchesStar && matchesQuery;
    });

    if (filtered.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; padding: 60px 20px; text-align: center; color: var(--text-muted); background: #ffffff; border-radius: var(--radius-md); border: 1px dashed var(--border-subtle);">
          <p style="font-size: 16px; font-weight: 600;">No properties found matching your selection.</p>
          <p style="font-size: 13px; margin-top: 6px;">Try adjusting the star filter or searching for another district or hotel name.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map(h => {
      const [district, name, stars, place, url, image, source] = h;
      const starText = '★'.repeat(Number(stars)) + ` ${stars} STAR LUXURY`;
      
      return `
        <article class="hotel-card" data-stars="${stars}" data-hotel-name="${name}">
          <a class="hotel-thumb-link" href="${url}" target="_blank" rel="noopener">
            <img class="hotel-thumb" src="${image}" alt="${name} photograph" loading="lazy" referrerpolicy="no-referrer" onerror="this.closest('.hotel-card')?.remove()">
            <span class="hotel-star-badge">${starText}</span>
          </a>
          <div class="hotel-body">
            <div class="hotel-location">${place} · ${district}</div>
            <h3 class="hotel-name">${name}</h3>
            <div class="hotel-actions">
              <a class="hotel-book-btn" href="${url}" target="_blank" rel="noopener">
                Official Property <span>↗</span>
              </a>
              <button class="district-fav-btn" style="width: 32px; height: 32px; font-size: 14px;" title="Save to Bucket List" onclick="window.toggleWishlistItem('${name.replace(/'/g, "\\'")}', 'Hotel', event)">
                ♥
              </button>
            </div>
            <div style="font-size: 10.5px; color: var(--text-muted); margin-top: 10px;">Photo source: ${source}</div>
          </div>
        </article>
      `;
    }).join('');
  }

  // Setup star filters
  if (starFilterBtns) {
    starFilterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        starFilterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeStar = btn.dataset.star || 'all';
        renderHotels();
      });
    });
  }

  // Setup hotel search
  if (hotelSearchInput) {
    hotelSearchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim().toLowerCase();
      renderHotels();
    });
  }

  // Initial render
  renderHotels();
})();
