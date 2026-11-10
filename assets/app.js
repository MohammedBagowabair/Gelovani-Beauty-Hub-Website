(function(){
  var WA = "19296899094";
  document.documentElement.classList.remove("no-js");
  function waMsg(svc){
    var t = svc ? "Hi Gelovani Beauty Hub! I'd like to book: " + svc + ".\nPreferred day & time: "
                : "Hi Gelovani Beauty Hub! I'd like to book an appointment.\nService: \nPreferred day & time: ";
    return "https://wa.me/" + WA + "?text=" + encodeURIComponent(t);
  }
  document.querySelectorAll(".wa-link").forEach(function(a){ a.href = waMsg(a.getAttribute("data-svc")); });

  var nav = document.getElementById("nav"), dock = document.getElementById("dock");
  function onScroll(){ nav.classList.toggle("solid", window.scrollY > 30); dock.classList.toggle("away", window.scrollY < window.innerHeight * .6); }
  window.addEventListener("scroll", onScroll, {passive:true}); onScroll();

  var tabs = [].slice.call(document.querySelectorAll(".tab"));
  function select(tab, focus){
    tabs.forEach(function(t){
      var on = t === tab; t.setAttribute("aria-selected", on); t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute("aria-controls")).classList.toggle("on", on);
    });
    if (focus) tab.focus();
    var row = tab.parentNode; if (row.scrollWidth > row.clientWidth) row.scrollTo({left: tab.offsetLeft - row.clientWidth/2 + tab.offsetWidth/2, behavior:"smooth"});
  }
  tabs.forEach(function(t, i){
    t.addEventListener("click", function(){ select(t); });
    t.addEventListener("keydown", function(e){
      var k = e.key, n = null;
      if (k === "ArrowRight") n = tabs[(i+1) % tabs.length];
      if (k === "ArrowLeft") n = tabs[(i-1+tabs.length) % tabs.length];
      if (k === "Home") n = tabs[0]; if (k === "End") n = tabs[tabs.length-1];
      if (n){ e.preventDefault(); select(n, true); }
    });
  });

  // open now, salon time (America/New_York). Hours from the salon's Vagaro page.
  try {
    var H = {Sun:[600,1140],Mon:[540,1170],Tue:[540,1170],Wed:[600,1140],Thu:[600,1140],Fri:[600,1140],Sat:[600,1170]};
    var order = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
    var fmt = function(m){ var h = Math.floor(m/60), mm = m%60, ap = h >= 12 ? "PM" : "AM"; h = h%12 || 12; return h + (mm ? ":" + (mm<10?"0":"") + mm : "") + " " + ap; };
    var el = document.getElementById("openNow");
    var parts = new Intl.DateTimeFormat("en-US",{timeZone:"America/New_York",weekday:"short",hour:"numeric",minute:"numeric",hour12:false}).formatToParts(new Date());
    var get = function(t){ return (parts.filter(function(p){return p.type===t;})[0]||{}).value; };
    var day = get("weekday"), mins = (parseInt(get("hour"),10) % 24)*60 + parseInt(get("minute"),10), d = H[day];
    var open = mins >= d[0] && mins < d[1];
    if (open) el.textContent = "Open now · until " + fmt(d[1]);
    else if (mins < d[0]) el.textContent = "Closed now · opens " + fmt(d[0]);
    else el.textContent = "Closed now · opens tomorrow " + fmt(H[order[(order.indexOf(day)+1)%7]][0]);
    el.classList.toggle("is-open", open); el.hidden = false;
  } catch(e){}

  var els = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !/static=1/.test(location.search)) {
    var io = new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add("in"); io.unobserve(e.target); } }); }, {threshold:.12, rootMargin:"0px 0px -40px 0px"});
    els.forEach(function(el){ io.observe(el); });
  } else { els.forEach(function(el){ el.classList.add("in"); }); }
})();
