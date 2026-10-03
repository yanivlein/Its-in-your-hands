/* זה בידיים שלך – התנהגות האתר.
   נוצר מהעיצוב ב־Claude Design: כל בלוק כאן מקביל ללוגיקה של הסקשן באותו שם (design/<Name>.dc.html).
   הנתונים (קלפים, שערים, כותרות) מוזרקים בבנייה מתוך קבצי העיצוב – לא לערוך את assets/js/site.js ידנית,
   אלא את tools/src/site.js ואז להריץ python3 tools/build.py. */
(function () {
  'use strict';
  window.__lbReady = true;

  var DATA = {"kitGlow":{"1":"#acc3cf","2":"#c9c7ba","3":"#caa0c6","4":"#f3a9c8","5":"#e2bd62","6":"#c6cd86"},"tasteGates":{"1":{"name":"התבוננות ושחרור","band":"#acc3cf","deep":"#3f6678"},"2":{"name":"דיוק עצמי","band":"#c5c4b9","deep":"#5b5a4c"},"3":{"name":"איזון בעשייה","band":"#c087bb","deep":"#7a3f76"},"4":{"name":"בריאות הגוף והנפש","band":"#f193bb","deep":"#a3336f"},"5":{"name":"מערכות יחסים","band":"#d6aa3c","deep":"#7d5a10"},"6":{"name":"צמיחה והתרחבות","band":"#bbc374","deep":"#5f6a2e"}},"tasteCards":[{"n":3,"g":1,"t":"לפשט דברים","face":"assets/img/face-03-800.webp","back":"assets/img/text-03-800.webp","x":"לרוב אנחנו עצמנו מסבכים דברים – מניחים הנחות ומשלימים פערי מידע כדי להימנע מאי-ודאות. במקום להפריד בין עובדות לרגשות ולהמתין שדברים יתבהרו ואולי אף יסתדרו מעצמם, אנו נוטים להסתבך בחשיבת יתר, פרשנויות דרמטיות ומערבולות רגשיות. האפשרות לפשט את ההתמודדות עם מצבים מורכבים ולפעול מתוך אורך נשימה, שקט פנימי ואופטימיות – היא בידינו.","q":["מה מרוויחים מפשטות, הרפיה והמתנה שדברים יתבהרו?","באלו מצבים את נוטה להסתבך מחשבתית ורגשית ובאילו לפשט?","איזו גישה היית רוצה לפתח ומה יעזור לך בזה?"]},{"n":19,"g":2,"t":"להשוות רק לעצמי","face":"assets/img/face-19-800.webp","back":"assets/img/text-19-800.webp","x":"השוואה למי שהיינו בעבר מאפשרת לנו להכיר בדרך שעשינו ולזהות הישגים. לעומת זאת, השוואה לאחרים עלולה להקטין אותנו ולעורר תחושת נחיתות, במיוחד כשהיא ניזונה מהצלחות מלוטשות ברשתות החברתיות. גם לו הכרנו את הרקע לאותן הצלחות, המסע הרלוונטי עבורנו הוא זה הנמדד מול עצמנו; זה המעיד על ההתפתחות שלנו ועל מימוש הפוטנציאל הייחודי שבנו.","q":["על מה את גאה בדרך שעשית במהלך השנים?","מה קורה לך כשאת משווה עצמך למישהי אחר?","מה יעזור לך להתמקד בציר ההתפתחות שלך?"]},{"n":26,"g":3,"t":"להמתין ולהשהות תגובה","face":"assets/img/face-26-800.webp","back":"assets/img/text-26-800.webp","x":"להמתנה לפני תגובה יש תועלת רבה. מילה שנאמרה או פעולה שנעשתה, קשה לעיתים לתקן. בעוד שתגובה אימפולסיבית מופעלת לעיתים על ידי דחף הישרדותי ועלולה להוביל לחרטה, השהיית התגובה מאפשרת לאזורי ההיגיון במוח להיכנס לפעולה. התגברות על הצורך לפרוק רגשות באופן מיידי ותרגול איפוק תורמים להתנהלות שקולה, לשמירה על מערכות יחסים ולחיים שלווים יותר.","q":["כמה את מרוצה מזמן התגובה הטבעי שלך במצבים שונים?","מה נכון לך לשפר בנוגע לזמן התגובה שלך?","מה יכול לעזור לך לדייק תגובות שלך?"]},{"n":37,"g":4,"t":"להזין בכבוד את הנפש","face":"assets/img/face-37-800.webp","back":"assets/img/text-37-800.webp","x":"הבחירה במה להזין את נפשנו היא בידינו. הנפש זקוקה ל״מזון״ איכותי בדיוק כמו הגוף שלנו. יופי, תרבות, השראה ומילים טובות הם דוגמאות לאבות המזון שלה. כבוד לנפש משמעו בחירת מקורות הזנה מעצימים, לצד הגבלה של צריכת תכנים שיכולים להחליש או לרוקן כמו חדשות או רשתות חברתיות. תשומת לב בבחירה של התפריט הרגשי שלנו מבטאת אחריות, כבוד ודאגה לבריאותנו הנפשית.","q":["אילו תכנים ממלאים אותך באנרגיה, ואילו מרוקנים?","עד כמה את מקפידה לבחור תכנים שמיטיבים איתך?","אילו פעולות דרושות לך כדי לנקות את התפריט הרגשי-רוחני שלך?"]},{"n":54,"g":5,"t":"להיענות לאחרים ללא ריצוי","face":"assets/img/face-54-800.webp","back":"assets/img/text-54-800.webp","x":"היענות לאחרים יכולה לבטא נדיבות, כל עוד היא נובעת מבחירה כנה ולא מתוך צורך לרצות. ריצוי הוא דפוס מרוקן שבו שני הצדדים מפסידים: הצד המרצה צובר תסכול ומרמור, והצד השני אמנם מקבל מחווה אך ממניע כוזב. ריצוי שגורם לביטול עצמי אינו מביא ברכה. נתינה אמיתית ומיטיבה מתקיימת רק כשהיא נובעת ממקום אותנטי בתוכנו.","q":["מה את עושה כשמבקשים ממך משהו שלא בדיוק מתאים לך?","מה זה בשבילך לאכזב אחרים?","כמה מהנתינה שלך היא אותנטית?"]},{"n":64,"g":6,"t":"לכבד את הקצב הטבעי","face":"assets/img/face-64-800.webp","back":"assets/img/text-64-800.webp","x":"הטבע הוא השראה ומורה לסבלנות ולהקשבה לקצב פנימי. התבוננות בטבע מלמדת שבכל תהליך יש סדר ויש שלבים הדורשים תנאים להבשלה כדי להתפתח משלב לשלב: מהזרע השוהה בחושך ועד ללבלוב. כך גם אצלנו, כחלק מהטבע, התפתחות מתרחשת על פי סדר של שלבים ובקצב אישי שלא נותר לנו אלא לכבד.","q":["איך היית מגדירה את הקצב האישי שלך?","באיזו מידה את מכבדת את הקצב הטבעי שלך?","מה קורה כשאת מנסה להאיץ או להאט את הקצב הטבעי שלך?"]}],"howPhoto":{"1":"wood","2":"ronit1","3":"ronit2","4":"table","5":"welcome","6":"wood","7":"people2","8":"people1","9":"hero"},"howTitles":["שליפה אקראית","בחירה מודעת","קלף ליום או לשבוע","שער אחד בכל פעם","הגדרת מטרות","סיכום תהליך או תקופה","פתיחת שיחה","בעבודה טיפולית-אימונית","השראה יומיומית"]};
  var doc = document;
  var root = doc.documentElement;
  var mq = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  var reduce = !!(mq && mq.matches);
  var hasIO = 'IntersectionObserver' in window;
  // the head script switched motion on (unless reduced motion, no IntersectionObserver or a very slow load)
  var motion = root.getAttribute('data-motion') === 'on' && !reduce && hasIO;
  if (!motion) root.removeAttribute('data-motion');

  function each(list, fn) { Array.prototype.forEach.call(list, fn); }
  function ref(sec, name) { return sec.querySelector('[data-ref="' + name + '"]'); }
  function bound(sec, name) { return sec.querySelector('[data-bind="' + name + '"]'); }
  function setText(el, text) { if (el && el.textContent !== text) el.textContent = text; }
  function swap(el, pair, on) {
    if (!el) return;
    pair.forEach(function (c) { if (c !== on) el.classList.remove(c); });
    if (on) el.classList.add(on);
  }
  function shuffle(a) {
    var b = a.slice();
    for (var i = b.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = b[i]; b[i] = b[j]; b[j] = t; }
    return b;
  }

  var C = {};

  /* ---------- Nav: תפריט עליון, פס התקדמות, סימון הסקשן הנוכחי, תפריט בטלפון ---------- */
  C.Nav = function (sec) {
    var links = ref(sec, 'links');
    var pill = ref(sec, 'pill');
    var prog = ref(sec, 'prog');
    var menuBtn = ref(sec, 'menuBtn');
    var panel = ref(sec, 'panel');
    var navLinks = links ? links.querySelectorAll('a[href^="#"]') : [];
    var st = { scrolled: false, open: false, active: '', bar: false };
    var hovering = false;
    var raf = 0;

    function activeLink() { return links ? links.querySelector('a.is-active') : null; }
    function movePill(el) {
      if (!pill || !links) return;
      if (!el || !el.offsetWidth) { pill.style.opacity = '0'; return; }
      var lr = links.getBoundingClientRect(), r = el.getBoundingClientRect();
      pill.style.width = r.width.toFixed(1) + 'px';
      pill.style.transform = 'translateX(' + (r.left - lr.left).toFixed(1) + 'px)';
      pill.style.opacity = '1';
    }
    function render() {
      sec.classList.toggle('is-scrolled', st.scrolled);
      sec.classList.toggle('is-open', st.open);
      sec.classList.toggle('show-bar', st.bar);
      each(navLinks, function (a) {
        var on = !!st.active && a.getAttribute('href') === '#' + st.active;
        a.classList.toggle('is-active', on);
        a.setAttribute('aria-current', on ? 'location' : 'false');
      });
      if (menuBtn) {
        menuBtn.setAttribute('aria-expanded', st.open ? 'true' : 'false');
        menuBtn.setAttribute('aria-label', st.open ? 'סגירת התפריט' : 'פתיחת התפריט');
      }
    }
    function update() {
      var y = window.scrollY || window.pageYOffset || 0;
      var vh = window.innerHeight;
      var sh = root.scrollHeight;
      var p = sh - vh > 0 ? Math.min(1, Math.max(0, y / (sh - vh))) : 0;
      if (prog) prog.style.transform = 'scaleX(' + p.toFixed(4) + ')';
      var active = '';
      each(doc.querySelectorAll('[data-nav]'), function (s) {
        var r = s.getBoundingClientRect();
        if (r.top <= vh * 0.38 && r.bottom > vh * 0.2) active = s.getAttribute('data-nav');
      });
      var scrolled = y > 24;
      var bar = y > vh * 0.8;
      if (scrolled !== st.scrolled || active !== st.active || bar !== st.bar) {
        var moved = active !== st.active;
        st.scrolled = scrolled; st.active = active; st.bar = bar;
        render();
        if (moved && !hovering) setTimeout(function () { if (!hovering) movePill(activeLink()); }, 60);
      }
    }
    function onScroll() {
      if (raf) return;
      raf = requestAnimationFrame(function () { raf = 0; update(); });
    }
    function close(silent) {
      if (!st.open) return;
      st.open = false;
      render();
      if (!silent) setTimeout(function () { if (menuBtn) menuBtn.focus(); }, 60);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', function () {
      onScroll();
      if (st.open && window.innerWidth > 1200) close(true);
      setTimeout(function () { if (!hovering) movePill(activeLink()); }, 80);
    });
    if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(function () { if (!hovering) movePill(activeLink()); });
    render();
    update();
    setTimeout(update, 1200);

    return {
      onLinkEnter: function (e, el) { hovering = true; movePill(el); },
      onLinksLeave: function () { hovering = false; movePill(activeLink()); },
      toggle: function () {
        st.open = !st.open;
        render();
        if (st.open) setTimeout(function () { var a = panel && panel.querySelector('a'); if (a) a.focus(); }, 120);
      },
      close: function () { close(false); },
      onSheetKey: function (e) { if (e.key === 'Escape') { e.stopPropagation(); close(false); } }
    };
  };

  /* ---------- Hero: תזוזה עדינה של התמונה עם העכבר ---------- */
  C.Hero = function (sec) {
    var stage = ref(sec, 'stage');
    return {
      onMove: function (e) {
        if (!stage || reduce) return;
        var r = stage.getBoundingClientRect();
        var mx = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / (r.width / 2)));
        var my = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height / 2)) / (r.height / 2)));
        stage.style.setProperty('--mx', mx.toFixed(3));
        stage.style.setProperty('--my', my.toFixed(3));
      },
      onLeave: function () {
        if (!stage) return;
        stage.style.setProperty('--mx', '0');
        stage.style.setProperty('--my', '0');
      }
    };
  };

  /* ---------- Kit: ששת השערים מחוברים למניפת הקלפים ---------- */
  C.Kit = function (sec) {
    var g = 1;
    var intro = motion;
    var stage = sec.querySelector('.kf-stage');
    var glow = sec.querySelector('.kf-glow');
    function render() {
      each(sec.querySelectorAll('[data-g]'), function (el) {
        var on = +el.getAttribute('data-g') === g;
        el.classList.toggle('is-on', on);
        el.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
      if (glow && DATA.kitGlow) glow.style.backgroundColor = DATA.kitGlow[g];
      if (stage) stage.classList.toggle('is-intro', intro);
    }
    render();
    return {
      onCard: function (e, el) { g = +el.getAttribute('data-g'); intro = false; render(); },
      reveal: function (blk) { if (blk === 'f') setTimeout(function () { intro = false; render(); }, 1700); }
    };
  };

  /* ---------- Taste: שליפה והיפוך של קלף ---------- */
  C.Taste = function (sec) {
    var CARDS = DATA.tasteCards || [];
    var GATES = DATA.tasteGates || {};
    if (!CARDS.length) return {};
    var all = CARDS.map(function (c, i) { return i; });
    var order = [0].concat(shuffle(all.slice(1)));
    var pos = 0, flipped = false, deal = '', deck = '', waiting = false, loaded = false;
    var tilt = ref(sec, 'tilt');
    var deckEl = sec.querySelector('.tc-deck');
    var slot = sec.querySelector('.tc-slot');
    var card = sec.querySelector('.tc-card');
    var front = sec.querySelector('.tc-front');
    var back = sec.querySelector('.tc-back');
    var frontImg = front && front.querySelector('img');
    var backImg = back && back.querySelector('img');
    var dots = sec.querySelectorAll('.tc-gdot');

    function setSrc(img, src) { if (img && img.getAttribute('src') !== src) img.setAttribute('src', src); }
    function render(live) {
      var c = CARDS[order[pos]], g = GATES[c.g] || {};
      setSrc(frontImg, c.face);
      setSrc(backImg, c.back);
      setText(bound(sec, 'card.x'), c.x);
      setText(bound(sec, 'card.q1'), c.q[0]);
      setText(bound(sec, 'card.q2'), c.q[1]);
      setText(bound(sec, 'card.q3'), c.q[2]);
      if (card) {
        card.setAttribute('aria-label', 'קלף ' + c.n + ', ' + c.t + ', שער ' + g.name);
        card.classList.toggle('is-flipped', flipped);
      }
      if (front) front.setAttribute('aria-hidden', flipped ? 'true' : 'false');
      if (back) back.setAttribute('aria-hidden', flipped ? 'false' : 'true');
      setText(bound(sec, 'flipLabel'), flipped ? 'חזרה לחזית' : 'הפכו את הקלף');
      swap(slot, ['deal-a', 'deal-b'], deal);
      swap(deckEl, ['sh-a', 'sh-b'], deck);
      each(dots, function (d, i) {
        var on = i + 1 === +c.g;
        d.classList.toggle('is-on', on);
        d.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
      if (live !== undefined) setText(bound(sec, 'live'), live);
    }
    function preload() {
      if (loaded) return;
      loaded = true;
      CARDS.forEach(function (c) { var a = new Image(); a.src = c.face; var b = new Image(); b.src = c.back; });
    }
    // the other cards load once the section is close, so the first draw is instant
    if (hasIO) {
      var near = new IntersectionObserver(function (entries) {
        if (entries.some(function (e) { return e.isIntersecting; })) { preload(); near.disconnect(); }
      }, { rootMargin: '600px 0px' });
      near.observe(sec);
    } else {
      setTimeout(preload, 3500);
    }

    return {
      draw: function () {
        if (waiting) return;
        preload();
        var go = function () {
          waiting = false;
          var p = pos + 1;
          if (p >= order.length) {
            var last = order[order.length - 1];
            do { order = shuffle(all); } while (order[0] === last);
            p = 0;
          }
          pos = p;
          flipped = false;
          deal = deal === 'deal-a' ? 'deal-b' : 'deal-a';
          deck = deck === 'sh-a' ? 'sh-b' : 'sh-a';
          var c = CARDS[order[pos]];
          render('נשלף קלף ' + c.n + ': ' + c.t + ', מהשער ' + (GATES[c.g] || {}).name + '.');
        };
        if (flipped && !reduce) { flipped = false; waiting = true; render(); setTimeout(go, 420); }
        else go();
      },
      // a gate dot shows the sample card of that gate
      pick: function (e, el) {
        if (waiting) return;
        var g = +el.getAttribute('data-g'), idx = -1;
        CARDS.some(function (c, i) { if (+c.g === g) { idx = i; return true; } return false; });
        if (idx < 0) return;
        preload();
        if (order[pos] === idx) {
          if (flipped) { flipped = false; render('הצד של הפרקטיקה: ' + CARDS[idx].t); }
          return;
        }
        var go = function () {
          waiting = false;
          pos = order.indexOf(idx);
          flipped = false;
          deal = deal === 'deal-a' ? 'deal-b' : 'deal-a';
          deck = deck === 'sh-a' ? 'sh-b' : 'sh-a';
          var c = CARDS[idx];
          render('נבחר קלף ' + c.n + ': ' + c.t + ', מהשער ' + (GATES[c.g] || {}).name + '.');
        };
        if (flipped && !reduce) { flipped = false; waiting = true; render(); setTimeout(go, 420); }
        else go();
      },
      flip: function () {
        var c = CARDS[order[pos]];
        flipped = !flipped;
        render(flipped ? 'הצד השני של הקלף ' + c.t + ': הרחבה ושלוש שאלות.' : 'הצד של הפרקטיקה: ' + c.t);
      },
      onTilt: function (e) {
        if (!tilt || reduce) return;
        var r = tilt.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        var k = flipped ? 0.35 : 1;
        tilt.style.setProperty('--ry', ((px - 0.5) * 14 * k).toFixed(2) + 'deg');
        tilt.style.setProperty('--rx', ((0.5 - py) * 12 * k).toFixed(2) + 'deg');
        tilt.style.setProperty('--gx', (px * 100).toFixed(1) + '%');
        tilt.style.setProperty('--gy', (py * 100).toFixed(1) + '%');
      },
      onTiltEnd: function () {
        if (!tilt) return;
        tilt.style.setProperty('--rx', '0deg');
        tilt.style.setProperty('--ry', '0deg');
      }
    };
  };

  /* ---------- About: תזוזה קלה של התמונות בגלילה ---------- */
  C.About = function (sec) {
    var media = ref(sec, 'media');
    if (!motion || !media) return {};
    var raf = 0;
    function onScroll() {
      if (raf) return;
      raf = requestAnimationFrame(function () {
        raf = 0;
        var r = media.getBoundingClientRect();
        var vh = window.innerHeight || 800;
        var p = Math.max(-1, Math.min(1, ((r.top + r.height / 2) - vh / 2) / (vh / 2 + r.height / 2)));
        media.style.setProperty('--sp', p.toFixed(3));
      });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return {};
  };

  /* ---------- How: הרעיון שבאמצע המסך מחליף את התמונה והמונה ---------- */
  C.How = function (sec) {
    var list = ref(sec, 'list');
    var counter = sec.querySelector('.how-counter');
    var cur = 1, k = '';
    function render() {
      each(sec.querySelectorAll('.how-item[data-i]'), function (li) { li.classList.toggle('is-active', +li.getAttribute('data-i') === cur); });
      var ph = DATA.howPhoto ? DATA.howPhoto[cur] : '';
      each(sec.querySelectorAll('.how-ph[data-ph]'), function (img) { img.classList.toggle('is-on', img.getAttribute('data-ph') === ph); });
      setText(bound(sec, 'cur'), String(cur));
      if (DATA.howTitles) setText(bound(sec, 'curTitle'), DATA.howTitles[cur - 1]);
      swap(counter, ['k-a', 'k-b'], k);
    }
    if (motion && list) {
      var spy = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          var i = +e.target.getAttribute('data-i');
          if (i && i !== cur) { cur = i; k = k === 'k-a' ? 'k-b' : 'k-a'; render(); }
        });
      }, { rootMargin: '-42% 0px -48% 0px', threshold: 0 });
      requestAnimationFrame(function () { each(list.querySelectorAll('[data-i]'), function (el) { spy.observe(el); }); });
    }
    return {};
  };

  /* ---------- Voices: ההמלצות בשורה אחת שגוללים הצידה, ו"להמשך קריאה" בהמלצה ארוכה ---------- */
  C.Voices = function (sec) {
    var track = ref(sec, 'track');
    if (!track) return {};
    var car = sec.querySelector('.vx-car');
    var cards = track.querySelectorAll('.vx-card');
    var dots = sec.querySelectorAll('.vx-dot');
    var prevB = sec.querySelector('[data-on-click="prev"]');
    var nextB = sec.querySelector('[data-on-click="next"]');
    var open = 0, long = {}, raf = 0, rt = 0, st = 0;
    function render() {
      each(cards, function (c, i) {
        var k = i + 1;
        c.classList.toggle('is-long', !!long[k]);
        c.classList.toggle('is-open', open === k);
        var b = c.querySelector('.vx-more');
        if (b) {
          b.setAttribute('aria-expanded', open === k ? 'true' : 'false');
          setText(b, open === k ? 'סגירה' : 'להמשך קריאה');
        }
      });
    }
    function edge(btn, off) {
      if (!btn) return;
      btn.classList.toggle('is-off', off);
      btn.setAttribute('aria-disabled', off ? 'true' : 'false');
    }
    function sync() {
      var max = track.scrollWidth - track.clientWidth;
      var x = Math.abs(track.scrollLeft);
      var tr = track.getBoundingClientRect();
      each(cards, function (c, i) {
        var r = c.getBoundingClientRect();
        if (dots[i]) dots[i].classList.toggle('is-on', r.left >= tr.left - 6 && r.right <= tr.right + 6);
      });
      edge(prevB, x <= 6);
      edge(nextB, x >= max - 6);
    }
    function measure() {
      each(cards, function (c, i) {
        var k = i + 1;
        if (open === k) { long[k] = true; return; }
        var q = c.querySelector('.vx-q');
        long[k] = !!q && q.scrollHeight > q.clientHeight + 4;
      });
      render();
    }
    function step(dir) {
      var c = cards[0];
      var gap = parseFloat(getComputedStyle(track).columnGap) || 24;
      var w = c ? c.getBoundingClientRect().width + gap : track.clientWidth;
      track.scrollBy({ left: dir * w, behavior: reduce ? 'auto' : 'smooth' });
      clearTimeout(st);
      st = setTimeout(sync, 500);
    }
    if (car) car.classList.add('is-ready');
    requestAnimationFrame(function () { requestAnimationFrame(function () { measure(); sync(); }); });
    window.addEventListener('resize', function () {
      clearTimeout(rt);
      rt = setTimeout(function () { measure(); sync(); }, 150);
    });
    if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(function () { measure(); sync(); });
    return {
      prev: function () { step(1); },
      next: function () { step(-1); },
      onScroll: function () {
        if (raf) return;
        raf = requestAnimationFrame(function () { raf = 0; sync(); });
      },
      toggle: function (e, el) {
        var k = +el.getAttribute('data-i');
        open = open === k ? 0 : k;
        render();
        setTimeout(sync, 60);
      }
    };
  };

  /* ---------- Faq: אקורדיון, שאלה אחת פתוחה בכל פעם ---------- */
  C.Faq = function (sec) {
    var open = 1;
    function render() {
      each(sec.querySelectorAll('[data-q]'), function (btn) {
        var on = +btn.getAttribute('data-q') === open;
        btn.setAttribute('aria-expanded', on ? 'true' : 'false');
        var item = btn.closest('.fq-item');
        if (item) item.classList.toggle('is-open', on);
      });
    }
    return {
      onQ: function (e, el) { var q = +el.getAttribute('data-q'); open = open === q ? 0 : q; render(); }
    };
  };

  /* ---------- חשיפה בגלילה (כמו בעיצוב: כל בלוק data-blk נחשף כשהוא נכנס למסך) ---------- */
  function reveal(sec, ctrl) {
    if (!motion) return;
    var blocks = sec.querySelectorAll('[data-blk]');
    if (!blocks.length) return;
    var opt = (sec.getAttribute('data-reveal') || '0px 0px -12% 0px|0.12').split('|');
    function show(b) {
      if (b.getAttribute('data-in') === '1') return;
      b.setAttribute('data-in', '1');
      if (ctrl && ctrl.reveal) ctrl.reveal(b.getAttribute('data-blk'));
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { show(e.target); io.unobserve(e.target); } });
    }, { rootMargin: opt[0], threshold: +opt[1] });
    requestAnimationFrame(function () { each(blocks, function (b) { io.observe(b); }); });
    setTimeout(function () {
      each(blocks, function (b) {
        var r = b.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) show(b);
      });
    }, 2500);
  }

  /* ---------- חיבור האירועים (onClick וכו' מהעיצוב נשמרו כ־data-on-*) ---------- */
  var EVENTS = ['click', 'mouseenter', 'mouseleave', 'mousemove', 'focus', 'blur', 'keydown', 'scroll'];
  function wire(sec, ctrl) {
    EVENTS.forEach(function (ev) {
      var attr = 'data-on-' + ev;
      var els = Array.prototype.slice.call(sec.querySelectorAll('[' + attr + ']'));
      if (sec.hasAttribute(attr)) els.push(sec);
      els.forEach(function (el) {
        var fn = ctrl[el.getAttribute(attr)];
        if (typeof fn === 'function') el.addEventListener(ev, function (e) { fn(e, el); });
      });
    });
  }

  each(doc.querySelectorAll('[data-sec]'), function (sec) {
    var make = C[sec.getAttribute('data-sec')];
    var ctrl = {};
    try { ctrl = make ? make(sec) || {} : {}; } catch (err) { if (window.console) console.error(err); }
    wire(sec, ctrl);
    reveal(sec, ctrl);
  });
})();
