// api/generate.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userData, lang } = req.body;
    if (!userData) {
      return res.status(400).json({ error: 'Missing userData' });
    }

    const country = userData.country || 'الدولة';
    const COUNTRIES = [
// Africa
  { nameAr: "مصر", nameEn: "Egypt", flag: "https://flagcdn.com/w40/eg.png" },
  { nameAr: "الجزائر", nameEn: "Algeria", flag: "https://flagcdn.com/w40/dz.png" },
  { nameAr: "المغرب", nameEn: "Morocco", flag: "https://flagcdn.com/w40/ma.png" },
  { nameAr: "تونس", nameEn: "Tunisia", flag: "https://flagcdn.com/w40/tn.png" },
  { nameAr: "ليبيا", nameEn: "Libya", flag: "https://flagcdn.com/w40/ly.png" },
  { nameAr: "السودان", nameEn: "Sudan", flag: "https://flagcdn.com/w40/sd.png" },
  { nameAr: "جنوب السودان", nameEn: "South Sudan", flag: "https://flagcdn.com/w40/ss.png" },
  { nameAr: "إريتريا", nameEn: "Eritrea", flag: "https://flagcdn.com/w40/er.png" },
  { nameAr: "جيبوتي", nameEn: "Djibouti", flag: "https://flagcdn.com/w40/dj.png" },
  { nameAr: "الصومال", nameEn: "Somalia", flag: "https://flagcdn.com/w40/so.png" },
  { nameAr: "جزر القمر", nameEn: "Comoros", flag: "https://flagcdn.com/w40/km.png" },
  { nameAr: "موريتانيا", nameEn: "Mauritania", flag: "https://flagcdn.com/w40/mr.png" },
  { nameAr: "السنغال", nameEn: "Senegal", flag: "https://flagcdn.com/w40/sn.png" },
  { nameAr: "غامبيا", nameEn: "Gambia", flag: "https://flagcdn.com/w40/gm.png" },
  { nameAr: "غينيا", nameEn: "Guinea", flag: "https://flagcdn.com/w40/gn.png" },
  { nameAr: "غينيا بيساو", nameEn: "Guinea-Bissau", flag: "https://flagcdn.com/w40/gw.png" },
  { nameAr: "غينيا الاستوائية", nameEn: "Equatorial Guinea", flag: "https://flagcdn.com/w40/gq.png" },
  { nameAr: "سيراليون", nameEn: "Sierra Leone", flag: "https://flagcdn.com/w40/sl.png" },
  { nameAr: "ليبيريا", nameEn: "Liberia", flag: "https://flagcdn.com/w40/lr.png" },
  { nameAr: "ساحل العاج", nameEn: "Ivory Coast", flag: "https://flagcdn.com/w40/ci.png" },
  { nameAr: "غانا", nameEn: "Ghana", flag: "https://flagcdn.com/w40/gh.png" },
  { nameAr: "توغو", nameEn: "Togo", flag: "https://flagcdn.com/w40/tg.png" },
  { nameAr: "بنين", nameEn: "Benin", flag: "https://flagcdn.com/w40/bj.png" },
  { nameAr: "بوركينا فاسو", nameEn: "Burkina Faso", flag: "https://flagcdn.com/w40/bf.png" },
  { nameAr: "مالي", nameEn: "Mali", flag: "https://flagcdn.com/w40/ml.png" },
  { nameAr: "النيجر", nameEn: "Niger", flag: "https://flagcdn.com/w40/ne.png" },
  { nameAr: "تشاد", nameEn: "Chad", flag: "https://flagcdn.com/w40/td.png" },
  { nameAr: "نيجيريا", nameEn: "Nigeria", flag: "https://flagcdn.com/w40/ng.png" },
  { nameAr: "الكاميرون", nameEn: "Cameroon", flag: "https://flagcdn.com/w40/cm.png" },
  { nameAr: "جمهورية أفريقيا الوسطى", nameEn: "Central African Republic", flag: "https://flagcdn.com/w40/cf.png" },
  { nameAr: "الكونغو", nameEn: "Congo", flag: "https://flagcdn.com/w40/cg.png" },
  { nameAr: "الكونغو الديمقراطية", nameEn: "DR Congo", flag: "https://flagcdn.com/w40/cd.png" },
  { nameAr: "رواندا", nameEn: "Rwanda", flag: "https://flagcdn.com/w40/rw.png" },
  { nameAr: "بوروندي", nameEn: "Burundi", flag: "https://flagcdn.com/w40/bi.png" },
  { nameAr: "أوغندا", nameEn: "Uganda", flag: "https://flagcdn.com/w40/ug.png" },
  { nameAr: "كينيا", nameEn: "Kenya", flag: "https://flagcdn.com/w40/ke.png" },
  { nameAr: "تنزانيا", nameEn: "Tanzania", flag: "https://flagcdn.com/w40/tz.png" },
  { nameAr: "موزمبيق", nameEn: "Mozambique", flag: "https://flagcdn.com/w40/mz.png" },
  { nameAr: "مالاوي", nameEn: "Malawi", flag: "https://flagcdn.com/w40/mw.png" },
  { nameAr: "زامبيا", nameEn: "Zambia", flag: "https://flagcdn.com/w40/zm.png" },
  { nameAr: "زيمبابوي", nameEn: "Zimbabwe", flag: "https://flagcdn.com/w40/zw.png" },
  { nameAr: "بوتسوانا", nameEn: "Botswana", flag: "https://flagcdn.com/w40/bw.png" },
  { nameAr: "ناميبيا", nameEn: "Namibia", flag: "https://flagcdn.com/w40/na.png" },
  { nameAr: "جنوب أفريقيا", nameEn: "South Africa", flag: "https://flagcdn.com/w40/za.png" },
  { nameAr: "إسواتيني", nameEn: "Eswatini", flag: "https://flagcdn.com/w40/sz.png" },
  { nameAr: "ليسوتو", nameEn: "Lesotho", flag: "https://flagcdn.com/w40/ls.png" },
  { nameAr: "مدغشقر", nameEn: "Madagascar", flag: "https://flagcdn.com/w40/mg.png" },
  { nameAr: "سيشل", nameEn: "Seychelles", flag: "https://flagcdn.com/w40/sc.png" },
  { nameAr: "موريشيوس", nameEn: "Mauritius", flag: "https://flagcdn.com/w40/mu.png" },
  { nameAr: "الرأس الأخضر", nameEn: "Cape Verde", flag: "https://flagcdn.com/w40/cv.png" },
  { nameAr: "ساو تومي وبرينسيب", nameEn: "Sao Tome and Principe", flag: "https://flagcdn.com/w40/st.png" },
  { nameAr: "أنغولا", nameEn: "Angola", flag: "https://flagcdn.com/w40/ao.png" },

  // Asia
  { nameAr: "السعودية", nameEn: "Saudi Arabia", flag: "https://flagcdn.com/w40/sa.png" },
  { nameAr: "الكويت", nameEn: "Kuwait", flag: "https://flagcdn.com/w40/kw.png" },
  { nameAr: "الإمارات", nameEn: "United Arab Emirates", flag: "https://flagcdn.com/w40/ae.png" },
  { nameAr: "قطر", nameEn: "Qatar", flag: "https://flagcdn.com/w40/qa.png" },
  { nameAr: "البحرين", nameEn: "Bahrain", flag: "https://flagcdn.com/w40/bh.png" },
  { nameAr: "عمان", nameEn: "Oman", flag: "https://flagcdn.com/w40/om.png" },
  { nameAr: "اليمن", nameEn: "Yemen", flag: "https://flagcdn.com/w40/ye.png" },
  { nameAr: "الأردن", nameEn: "Jordan", flag: "https://flagcdn.com/w40/jo.png" },
  { nameAr: "لبنان", nameEn: "Lebanon", flag: "https://flagcdn.com/w40/lb.png" },
  { nameAr: "سوريا", nameEn: "Syria", flag: "https://flagcdn.com/w40/sy.png" },
  { nameAr: "العراق", nameEn: "Iraq", flag: "https://flagcdn.com/w40/iq.png" },
  { nameAr: "فلسطين", nameEn: "Palestine", flag: "https://flagcdn.com/w40/ps.png" },
  { nameAr: "تركيا", nameEn: "Turkey", flag: "https://flagcdn.com/w40/tr.png" },
  { nameAr: "إيران", nameEn: "Iran", flag: "https://flagcdn.com/w40/ir.png" },
  { nameAr: "أفغانستان", nameEn: "Afghanistan", flag: "https://flagcdn.com/w40/af.png" },
  { nameAr: "باكستان", nameEn: "Pakistan", flag: "https://flagcdn.com/w40/pk.png" },
  { nameAr: "الهند", nameEn: "India", flag: "https://flagcdn.com/w40/in.png" },
  { nameAr: "نيبال", nameEn: "Nepal", flag: "https://flagcdn.com/w40/np.png" },
  { nameAr: "بوتان", nameEn: "Bhutan", flag: "https://flagcdn.com/w40/bt.png" },
  { nameAr: "بنغلاديش", nameEn: "Bangladesh", flag: "https://flagcdn.com/w40/bd.png" },
  { nameAr: "ميانمار", nameEn: "Myanmar", flag: "https://flagcdn.com/w40/mm.png" },
  { nameAr: "الصين", nameEn: "China", flag: "https://flagcdn.com/w40/cn.png" },
  { nameAr: "تايوان", nameEn: "Taiwan", flag: "https://flagcdn.com/w40/tw.png" },
  { nameAr: "منغوليا", nameEn: "Mongolia", flag: "https://flagcdn.com/w40/mn.png" },
  { nameAr: "كوريا الشمالية", nameEn: "North Korea", flag: "https://flagcdn.com/w40/kp.png" },
  { nameAr: "كوريا الجنوبية", nameEn: "South Korea", flag: "https://flagcdn.com/w40/kr.png" },
  { nameAr: "اليابان", nameEn: "Japan", flag: "https://flagcdn.com/w40/jp.png" },
  { nameAr: "فيتنام", nameEn: "Vietnam", flag: "https://flagcdn.com/w40/vn.png" },
  { nameAr: "لاوس", nameEn: "Laos", flag: "https://flagcdn.com/w40/la.png" },
  { nameAr: "كمبوديا", nameEn: "Cambodia", flag: "https://flagcdn.com/w40/kh.png" },
  { nameAr: "تايلاند", nameEn: "Thailand", flag: "https://flagcdn.com/w40/th.png" },
  { nameAr: "ماليزيا", nameEn: "Malaysia", flag: "https://flagcdn.com/w40/my.png" },
  { nameAr: "سنغافورة", nameEn: "Singapore", flag: "https://flagcdn.com/w40/sg.png" },
  { nameAr: "إندونيسيا", nameEn: "Indonesia", flag: "https://flagcdn.com/w40/id.png" },
  { nameAr: "الفلبين", nameEn: "Philippines", flag: "https://flagcdn.com/w40/ph.png" },
  { nameAr: "بروناي", nameEn: "Brunei", flag: "https://flagcdn.com/w40/bn.png" },
  { nameAr: "تيمور الشرقية", nameEn: "East Timor", flag: "https://flagcdn.com/w40/tl.png" },
  { nameAr: "سريلانكا", nameEn: "Sri Lanka", flag: "https://flagcdn.com/w40/lk.png" },
  { nameAr: "جزر المالديف", nameEn: "Maldives", flag: "https://flagcdn.com/w40/mv.png" },
  { nameAr: "كازاخستان", nameEn: "Kazakhstan", flag: "https://flagcdn.com/w40/kz.png" },
  { nameAr: "قيرغيزستان", nameEn: "Kyrgyzstan", flag: "https://flagcdn.com/w40/kg.png" },
  { nameAr: "طاجيكستان", nameEn: "Tajikistan", flag: "https://flagcdn.com/w40/tj.png" },
  { nameAr: "أوزبكستان", nameEn: "Uzbekistan", flag: "https://flagcdn.com/w40/uz.png" },
  { nameAr: "تركمانستان", nameEn: "Turkmenistan", flag: "https://flagcdn.com/w40/tm.png" },
  { nameAr: "أذربيجان", nameEn: "Azerbaijan", flag: "https://flagcdn.com/w40/az.png" },
  { nameAr: "جورجيا", nameEn: "Georgia", flag: "https://flagcdn.com/w40/ge.png" },
  { nameAr: "أرمينيا", nameEn: "Armenia", flag: "https://flagcdn.com/w40/am.png" },

  // Europe
  { nameAr: "روسيا", nameEn: "Russia", flag: "https://flagcdn.com/w40/ru.png" },
  { nameAr: "أوكرانيا", nameEn: "Ukraine", flag: "https://flagcdn.com/w40/ua.png" },
  { nameAr: "بيلاروسيا", nameEn: "Belarus", flag: "https://flagcdn.com/w40/by.png" },
  { nameAr: "بولندا", nameEn: "Poland", flag: "https://flagcdn.com/w40/pl.png" },
  { nameAr: "التشيك", nameEn: "Czech Republic", flag: "https://flagcdn.com/w40/cz.png" },
  { nameAr: "سلوفاكيا", nameEn: "Slovakia", flag: "https://flagcdn.com/w40/sk.png" },
  { nameAr: "المجر", nameEn: "Hungary", flag: "https://flagcdn.com/w40/hu.png" },
  { nameAr: "رومانيا", nameEn: "Romania", flag: "https://flagcdn.com/w40/ro.png" },
  { nameAr: "بلغاريا", nameEn: "Bulgaria", flag: "https://flagcdn.com/w40/bg.png" },
  { nameAr: "مولدوفا", nameEn: "Moldova", flag: "https://flagcdn.com/w40/md.png" },
  { nameAr: "صربيا", nameEn: "Serbia", flag: "https://flagcdn.com/w40/rs.png" },
  { nameAr: "الجبل الأسود", nameEn: "Montenegro", flag: "https://flagcdn.com/w40/me.png" },
  { nameAr: "البوسنة والهرسك", nameEn: "Bosnia and Herzegovina", flag: "https://flagcdn.com/w40/ba.png" },
  { nameAr: "كرواتيا", nameEn: "Croatia", flag: "https://flagcdn.com/w40/hr.png" },
  { nameAr: "سلوفينيا", nameEn: "Slovenia", flag: "https://flagcdn.com/w40/si.png" },
  { nameAr: "ألبانيا", nameEn: "Albania", flag: "https://flagcdn.com/w40/al.png" },
  { nameAr: "مقدونيا الشمالية", nameEn: "North Macedonia", flag: "https://flagcdn.com/w40/mk.png" },
  { nameAr: "اليونان", nameEn: "Greece", flag: "https://flagcdn.com/w40/gr.png" },
  { nameAr: "قبرص", nameEn: "Cyprus", flag: "https://flagcdn.com/w40/cy.png" },
  { nameAr: "مالطا", nameEn: "Malta", flag: "https://flagcdn.com/w40/mt.png" },
  { nameAr: "إيطاليا", nameEn: "Italy", flag: "https://flagcdn.com/w40/it.png" },
  { nameAr: "إسبانيا", nameEn: "Spain", flag: "https://flagcdn.com/w40/es.png" },
  { nameAr: "البرتغال", nameEn: "Portugal", flag: "https://flagcdn.com/w40/pt.png" },
  { nameAr: "فرنسا", nameEn: "France", flag: "https://flagcdn.com/w40/fr.png" },
  { nameAr: "بلجيكا", nameEn: "Belgium", flag: "https://flagcdn.com/w40/be.png" },
  { nameAr: "هولندا", nameEn: "Netherlands", flag: "https://flagcdn.com/w40/nl.png" },
  { nameAr: "لوكسمبورغ", nameEn: "Luxembourg", flag: "https://flagcdn.com/w40/lu.png" },
  { nameAr: "ألمانيا", nameEn: "Germany", flag: "https://flagcdn.com/w40/de.png" },
  { nameAr: "سويسرا", nameEn: "Switzerland", flag: "https://flagcdn.com/w40/ch.png" },
  { nameAr: "النمسا", nameEn: "Austria", flag: "https://flagcdn.com/w40/at.png" },
  { nameAr: "ليختنشتاين", nameEn: "Liechtenstein", flag: "https://flagcdn.com/w40/li.png" },
  { nameAr: "المملكة المتحدة", nameEn: "United Kingdom", flag: "https://flagcdn.com/w40/gb.png" },
  { nameAr: "أيرلندا", nameEn: "Ireland", flag: "https://flagcdn.com/w40/ie.png" },
  { nameAr: "آيسلندا", nameEn: "Iceland", flag: "https://flagcdn.com/w40/is.png" },
  { nameAr: "الدنمارك", nameEn: "Denmark", flag: "https://flagcdn.com/w40/dk.png" },
  { nameAr: "النرويج", nameEn: "Norway", flag: "https://flagcdn.com/w40/no.png" },
  { nameAr: "السويد", nameEn: "Sweden", flag: "https://flagcdn.com/w40/se.png" },
  { nameAr: "فنلندا", nameEn: "Finland", flag: "https://flagcdn.com/w40/fi.png" },
  { nameAr: "إستونيا", nameEn: "Estonia", flag: "https://flagcdn.com/w40/ee.png" },
  { nameAr: "لاتفيا", nameEn: "Latvia", flag: "https://flagcdn.com/w40/lv.png" },
  { nameAr: "ليتوانيا", nameEn: "Lithuania", flag: "https://flagcdn.com/w40/lt.png" },
  { nameAr: "موناكو", nameEn: "Monaco", flag: "https://flagcdn.com/w40/mc.png" },
  { nameAr: "أندورا", nameEn: "Andorra", flag: "https://flagcdn.com/w40/ad.png" },
  { nameAr: "سان مارينو", nameEn: "San Marino", flag: "https://flagcdn.com/w40/sm.png" },
  { nameAr: "الفاتيكان", nameEn: "Vatican City", flag: "https://flagcdn.com/w40/va.png" },

  // Americas
  { nameAr: "كندا", nameEn: "Canada", flag: "https://flagcdn.com/w40/ca.png" },
  { nameAr: "الولايات المتحدة", nameEn: "United States", flag: "https://flagcdn.com/w40/us.png" },
  { nameAr: "المكسيك", nameEn: "Mexico", flag: "https://flagcdn.com/w40/mx.png" },
  { nameAr: "غواتيمالا", nameEn: "Guatemala", flag: "https://flagcdn.com/w40/gt.png" },
  { nameAr: "بليز", nameEn: "Belize", flag: "https://flagcdn.com/w40/bz.png" },
  { nameAr: "هندوراس", nameEn: "Honduras", flag: "https://flagcdn.com/w40/hn.png" },
  { nameAr: "السلفادور", nameEn: "El Salvador", flag: "https://flagcdn.com/w40/sv.png" },
  { nameAr: "نيكاراغوا", nameEn: "Nicaragua", flag: "https://flagcdn.com/w40/ni.png" },
  { nameAr: "كوستاريكا", nameEn: "Costa Rica", flag: "https://flagcdn.com/w40/cr.png" },
  { nameAr: "بنما", nameEn: "Panama", flag: "https://flagcdn.com/w40/pa.png" },
  { nameAr: "كوبا", nameEn: "Cuba", flag: "https://flagcdn.com/w40/cu.png" },
  { nameAr: "جامايكا", nameEn: "Jamaica", flag: "https://flagcdn.com/w40/jm.png" },
  { nameAr: "هايتي", nameEn: "Haiti", flag: "https://flagcdn.com/w40/ht.png" },
  { nameAr: "جمهورية الدومينيكان", nameEn: "Dominican Republic", flag: "https://flagcdn.com/w40/do.png" },
  { nameAr: "بورتوريكو", nameEn: "Puerto Rico", flag: "https://flagcdn.com/w40/pr.png" },
  { nameAr: "البهاما", nameEn: "Bahamas", flag: "https://flagcdn.com/w40/bs.png" },
  { nameAr: "ترينيداد وتوباغو", nameEn: "Trinidad and Tobago", flag: "https://flagcdn.com/w40/tt.png" },
  { nameAr: "باربادوس", nameEn: "Barbados", flag: "https://flagcdn.com/w40/bb.png" },
  { nameAr: "سانت لوسيا", nameEn: "Saint Lucia", flag: "https://flagcdn.com/w40/lc.png" },
  { nameAr: "غرينادا", nameEn: "Grenada", flag: "https://flagcdn.com/w40/gd.png" },
  { nameAr: "سانت فينسنت والغرينادين", nameEn: "Saint Vincent and the Grenadines", flag: "https://flagcdn.com/w40/vc.png" },
  { nameAr: "أنتيغوا وباربودا", nameEn: "Antigua and Barbuda", flag: "https://flagcdn.com/w40/ag.png" },
  { nameAr: "دومينيكا", nameEn: "Dominica", flag: "https://flagcdn.com/w40/dm.png" },
  { nameAr: "سانت كيتس ونيفيس", nameEn: "Saint Kitts and Nevis", flag: "https://flagcdn.com/w40/kn.png" },
  { nameAr: "كولومبيا", nameEn: "Colombia", flag: "https://flagcdn.com/w40/co.png" },
  { nameAr: "فنزويلا", nameEn: "Venezuela", flag: "https://flagcdn.com/w40/ve.png" },
  { nameAr: "غيانا", nameEn: "Guyana", flag: "https://flagcdn.com/w40/gy.png" },
  { nameAr: "سورينام", nameEn: "Suriname", flag: "https://flagcdn.com/w40/sr.png" },
  { nameAr: "غويانا الفرنسية", nameEn: "French Guiana", flag: "https://flagcdn.com/w40/gf.png" },
  { nameAr: "الإكوادور", nameEn: "Ecuador", flag: "https://flagcdn.com/w40/ec.png" },
  { nameAr: "بيرو", nameEn: "Peru", flag: "https://flagcdn.com/w40/pe.png" },
  { nameAr: "بوليفيا", nameEn: "Bolivia", flag: "https://flagcdn.com/w40/bo.png" },
  { nameAr: "البرازيل", nameEn: "Brazil", flag: "https://flagcdn.com/w40/br.png" },
  { nameAr: "باراغواي", nameEn: "Paraguay", flag: "https://flagcdn.com/w40/py.png" },
  { nameAr: "الأوروغواي", nameEn: "Uruguay", flag: "https://flagcdn.com/w40/uy.png" },
  { nameAr: "الأرجنتين", nameEn: "Argentina", flag: "https://flagcdn.com/w40/ar.png" },
  { nameAr: "تشيلي", nameEn: "Chile", flag: "https://flagcdn.com/w40/cl.png" },

  // Oceania
  { nameAr: "أستراليا", nameEn: "Australia", flag: "https://flagcdn.com/w40/au.png" },
  { nameAr: "نيوزيلندا", nameEn: "New Zealand", flag: "https://flagcdn.com/w40/nz.png" },
  { nameAr: "بابوا غينيا الجديدة", nameEn: "Papua New Guinea", flag: "https://flagcdn.com/w40/pg.png" },
  { nameAr: "فيجي", nameEn: "Fiji", flag: "https://flagcdn.com/w40/fj.png" },
  { nameAr: "جزر سليمان", nameEn: "Solomon Islands", flag: "https://flagcdn.com/w40/sb.png" },
  { nameAr: "فانواتو", nameEn: "Vanuatu", flag: "https://flagcdn.com/w40/vu.png" },
  { nameAr: "كاليدونيا الجديدة", nameEn: "New Caledonia", flag: "https://flagcdn.com/w40/nc.png" },
  { nameAr: "بولينزيا الفرنسية", nameEn: "French Polynesia", flag: "https://flagcdn.com/w40/pf.png" },
  { nameAr: "ساموا", nameEn: "Samoa", flag: "https://flagcdn.com/w40/ws.png" },
  { nameAr: "تونغا", nameEn: "Tonga", flag: "https://flagcdn.com/w40/to.png" },
  { nameAr: "كيريباتي", nameEn: "Kiribati", flag: "https://flagcdn.com/w40/ki.png" },
  { nameAr: "ولايات ميكرونيسيا المتحدة", nameEn: "Micronesia", flag: "https://flagcdn.com/w40/fm.png" },
  { nameAr: "جزر مارشال", nameEn: "Marshall Islands", flag: "https://flagcdn.com/w40/mh.png" },
  { nameAr: "بالاو", nameEn: "Palau", flag: "https://flagcdn.com/w40/pw.png" },
  { nameAr: "ناورو", nameEn: "Nauru", flag: "https://flagcdn.com/w40/nr.png" },
  { nameAr: "توفالو", nameEn: "Tuvalu", flag: "https://flagcdn.com/w40/tv.png" }
    ];
    
    // Get English country name for prompt (if available, otherwise use original)
    const foundCountry = COUNTRIES.find(c => c.nameAr === country || c.nameEn === country);
    const countryForPrompt = foundCountry ? (lang === 'ar' ? foundCountry.nameAr : foundCountry.nameEn) : country;

    // Calculate health metrics
    const weight = parseFloat(userData.current_weight) || 80;
    const height = parseFloat(userData.height) || 170;
    const age = parseInt(userData.age) || 30;
    const gender = userData.gender;
    
    let bmr = (gender === "ذكر" || gender === "Male") 
      ? (10 * weight + 6.25 * height - 5 * age + 5) 
      : (10 * weight + 6.25 * height - 5 * age - 161);
    
    let activityMultiplier = 1.2;
    const activity = userData.activity;
    if (activity?.includes("خفيف") || activity?.includes("Light")) activityMultiplier = 1.375;
    else if (activity?.includes("متوسط") || activity?.includes("Moderate")) activityMultiplier = 1.55;
    else if (activity?.includes("عالي") || activity?.includes("Active")) activityMultiplier = 1.725;
    
    let targetCalories = Math.round(bmr * activityMultiplier - 500);
    if (targetCalories < 1200) targetCalories = 1200;
    if (targetCalories > 2500) targetCalories = 2500;
    
    let weightToLose = userData.current_weight && userData.target_weight 
      ? Math.max(1, Math.round(userData.current_weight - userData.target_weight)) 
      : 10;
    let weeks = Math.ceil(weightToLose / 0.5);

    // ========== SYSTEM PROMPT with local/affordable requirement ==========
    const sysPrompt = lang === 'ar'
      ? `أنت أخصائي تغذية. أعد JSON صارم بالهيكل التالي. استخدم المفاتيح الإنجليزية فقط (breakfast, lunch, dinner, snack). كل يوم 4 وجبات مختلفة مع 2-3 بدائل. الروتين الرياضي مفصّل جداً يومياً وليس نصاً عاماً. 5 نصائح طبية مخصصة. جميع النصوص بالعربية.

**مهم جداً: جميع الوجبات يجب أن تعتمد على مكونات رخيصة جدا ومتوفرة جدا في بلد المستخدم (${countryForPrompt}). تجنب الأطعفة المستوردة أو الغالية أو النادرة. استخدم البدائل المحلية الشائعة مثل الأرز، العدس، الفول، الخبز المحلي، الدجاج، الخضروات الموسمية، والأسماك المحلية.**

هيكل JSON:
{
  "human_intro": " رسالة ترحيب",
  "target_calories": ${targetCalories},
  "daily_macros": { "protein": "100g", "carbs": "150g", "fats": "50g" },
  "weight_to_lose": ${weightToLose},
  "expected_weeks": ${weeks},
  "weekly_plan": [
    {
      "day": "الأحد",
      "breakfast": { "options": ["خيار 1", "خيار 2", "خيار 3"], "macros": "بروتين: Xg | كارب: Xg | دهون: Xg" },
      "lunch": { "options": ["خيار 1", "خيار 2", "خيار 3"], "macros": "..." },
      "dinner": { "options": ["خيار 1", "خيار 2", "خيار 3"], "macros": "..." },
      "snack": { "options": ["خيار 1", "خيار 2"], "macros": "..." }
    },
    ... (7 أيام مختلفة تماماً)
  ],
  "home_workout": "روتين رياضي يومي مفصل (كل يوم له تمارينه)",
  "tips": ["نصيحة 1", "نصيحة 2", "نصيحة 3", "نصيحة 4", "نصيحة 5"],
  "specialist_notes": "ملاحظات طبية"
}`
      : `You are a nutritionist. Output strict JSON with ENGLISH keys only. Each day has 4 different meals with 2-3 options. Detailed daily home workout. 5 personalized health tips. All text in English.

**Very important: All meals must use ingredients that are very cheap and commonly available in the user's country (${countryForPrompt}). Avoid imported, expensive, or rare foods. Use common local alternatives such as local rice, beans, bread, chicken, seasonal vegetables, local fish, etc.**

JSON structure:
{
  "human_intro": "Welcome message",
  "target_calories": ${targetCalories},
  "daily_macros": { "protein": "100g", "carbs": "150g", "fats": "50g" },
  "weight_to_lose": ${weightToLose},
  "expected_weeks": ${weeks},
  "weekly_plan": [
    {
      "day": "Sunday",
      "breakfast": { "options": ["Opt1", "Opt2", "Opt3"], "macros": "Protein: Xg | Carbs: Xg | Fats: Xg" },
      "lunch": { "options": ["Opt1", "Opt2", "Opt3"], "macros": "..." },
      "dinner": { "options": ["Opt1", "Opt2", "Opt3"], "macros": "..." },
      "snack": { "options": ["Opt1", "Opt2"], "macros": "..." }
    },
    ... (7 completely different days)
  ],
  "home_workout": "Detailed daily home workout (different each day)",
  "tips": ["Tip1", "Tip2", "Tip3", "Tip4", "Tip5"],
  "specialist_notes": "Medical notes"
}`;

    // ========== USER PROMPT with emphasis on country ==========
    const fullUserPrompt = lang === 'ar'
      ? `البيانات: الاسم: ${userData.first_name || ''}، العمر: ${age}، الجنس: ${gender || ''}، الوزن: ${weight}كجم، الطول: ${height}سم، الهدف: ${userData.target_weight || ''}كجم، الأمراض: ${[userData.health_conditions].flat().join(', ')}، الحساسية: ${[userData.allergies].flat().join(', ') || 'لا'}، النشاط: ${activity || ''}، تفضيلات الطعام: ${[userData.food_pref].flat().join(', ') || 'كل شيء'}، البلد: ${countryForPrompt}. (مهم جداً: استخدم مكونات رخيصة ومتوفرة في هذا البلد)`
      : `Data: Name: ${userData.first_name || ''}, Age: ${age}, Gender: ${gender || ''}, Weight: ${weight}kg, Height: ${height}cm, Goal: ${userData.target_weight || ''}kg, Health: ${[userData.health_conditions].flat().join(', ')}, Allergies: ${[userData.allergies].flat().join(', ') || 'None'}, Activity: ${activity || ''}, Food Prefs: ${[userData.food_pref].flat().join(', ') || 'Everything'}, Country: ${countryForPrompt}. (Very important: use cheap, locally available ingredients from this country)`;

    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Missing DEEPSEEK_API_KEY' });
    }

    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        max_tokens: 3000,
        messages: [
          { role: 'system', content: sysPrompt },
          { role: 'user', content: fullUserPrompt }
        ]
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      return res.status(500).json({ error: `DeepSeek API error: ${response.status}`, details: errText });
    }

    const data = await response.json();
    if (data.error) {
      return res.status(500).json({ error: data.error.message || JSON.stringify(data.error) });
    }

    const raw = data.choices[0].message.content;
    let planJson = extractJSON(raw);
    if (!planJson) {
      // Fallback to default plan
      planJson = generateFallbackPlan(lang, userData, targetCalories, weightToLose, weeks);
    }

    // Ensure required fields exist and add workout/tips if missing
    if (!planJson.home_workout || planJson.home_workout.length < 20) {
      planJson.home_workout = generateWorkout(lang, activity);
    }
    if (!planJson.tips || !Array.isArray(planJson.tips) || planJson.tips.length === 0) {
      planJson.tips = generateTips(lang, userData);
    }

    const standardized = robustStandardizePlan(planJson, userData, lang, targetCalories, weightToLose, weeks);
    res.status(200).json({ plan: JSON.stringify(standardized) });
  } catch (error) {
    console.error('Generate error:', error);
    return res.status(500).json({ error: error.message });
  }
}

// Helper to extract JSON from AI response
function extractJSON(raw) {
  let cleaned = raw.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  if (firstBrace === -1 || lastBrace === -1) return null;
  cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  cleaned = cleaned.replace(/,\s*}/g, '}').replace(/,\s*\]/g, ']');
  try {
    return JSON.parse(cleaned);
  } catch (e) {
    // Attempt to fix missing closing braces/quotas
    const opens = [];
    for (const ch of cleaned) {
      if (ch === '{') opens.push('}');
      else if (ch === '[') opens.push(']');
      else if (ch === '}' || ch === ']') opens.pop();
    }
    cleaned += opens.reverse().join('');
    const quoteCount = (cleaned.match(/(?<!\\)"/g) || []).length;
    if (quoteCount % 2 !== 0) cleaned += '"';
    try {
      return JSON.parse(cleaned);
    } catch (e2) {
      return null;
    }
  }
}

// Fallback plan when AI fails
function generateFallbackPlan(lang, userData, targetCalories, weightToLose, weeks) {
  const days = lang === 'ar' 
    ? ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت']
    : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  const weeklyPlan = days.map(day => ({
    day: day,
    breakfast: { options: ['شوفان مع حليب', 'بيض مسلوق مع خبز أسمر'], macros: 'بروتين: 20g | كارب: 30g | دهون: 10g' },
    lunch: { options: ['صدر دجاج مشوي مع أرز بني', 'سمك مشوي مع خضار'], macros: 'بروتين: 35g | كارب: 40g | دهون: 12g' },
    dinner: { options: ['زبادي يوناني مع مكسرات', 'جبنة قريش مع خيار'], macros: 'بروتين: 25g | كارب: 15g | دهون: 8g' },
    snack: { options: ['تفاحة', 'لوز'], macros: 'بروتين: 5g | كارب: 15g | دهون: 6g' }
  }));

  const workout = generateWorkout(lang, userData.activity);
  const tips = generateTips(lang, userData);

  return {
    human_intro: lang === 'ar' ? `مرحباً ${userData.first_name || ''}! هذه خطتك الأسبوعية.` : `Hello ${userData.first_name || ''}! This is your weekly plan.`,
    target_calories: targetCalories,
    daily_macros: { protein: '120g', carbs: '150g', fats: '60g' },
    weight_to_lose: weightToLose,
    expected_weeks: weeks,
    weekly_plan: weeklyPlan,
    home_workout: workout,
    tips: tips,
    specialist_notes: ''
  };
}

function generateWorkout(lang, activity) {
  if (lang === 'ar') {
    return `السبت: إحماء 5 دقائق، قفز بالحبل 3 مجموعات × 30 ثانية، ضغط 3×10، قرفصاء 3×15، بلانك 3×30 ثانية، تمدد 5 دقائق.
الأحد: إحماء، طعنات 3×12 لكل رجل، بيربيز 3×10، رفع الساقين 3×20، كارديو خفيف 10 دقائق.
الإثنين: راحة.
الثلاثاء: إحماء، تمارين مقاومة باستخدام زجاجات ماء 3×15، خطف 3×12، مشي في المكان 15 دقيقة.
الأربعاء: إحماء، يوغا أو تمدد عميق 20 دقيقة.
الخميس: إحماء، قفز مع رفع الركبة 3×20، ضغط على الحائط 3×15، تمارين بطن دراجة 3×20، بلانك جانبي 3×20 ثانية.
الجمعة: إحماء، تمارين كارديو (قفز النجم، ركض في المكان) 15 دقيقة، تهدئة 5 دقائق.`;
  } else {
    return `Saturday: Warm up 5min, jump rope 3x30sec, push-ups 3x10, squats 3x15, plank 3x30sec, cool down 5min.
Sunday: Warm up, lunges 3x12 per leg, burpees 3x10, leg raises 3x20, light cardio 10min.
Monday: Rest.
Tuesday: Warm up, resistance exercises with water bottles 3x15, snatch 3x12, march in place 15min.
Wednesday: Warm up, yoga/deep stretch 20min.
Thursday: Warm up, high knee jumps 3x20, wall push-ups 3x15, bicycle crunches 3x20, side plank 3x20sec.
Friday: Warm up, cardio (star jumps, jog in place) 15min, cool down 5min.`;
  }
}

function generateTips(lang, userData) {
  const conditions = userData.health_conditions?.join?.(',') || '';
  if (lang === 'ar') {
    return [
      'تناول 4 وجبات صغيرة يومياً بدلاً من 2 وجبة كبيرة.',
      'اشرب كوباً من الماء قبل كل وجبة بـ 10 دقائق.',
      conditions.includes('سكري') ? 'تجنب الفواكه العالية بالسكر مثل العنب والمانجو.' : 'تناول الفواكه الكاملة بدلاً من العصائر.',
      'استخدم طبقاً أصغر للتحكم في كمية الطعام.',
      'قم بالمشي 10 دقائق بعد كل وجبة.',
    ];
  } else {
    return [
      'Eat 4 small meals daily instead of 2 large ones.',
      'Drink a glass of water 10 minutes before each meal.',
      conditions.includes('Diabetes') ? 'Avoid high-sugar fruits like grapes and mango.' : 'Eat whole fruits instead of juices.',
      'Use a smaller plate to control portions.',
      'Walk for 10 minutes after each meal.',
    ];
  }
}

function robustStandardizePlan(plan, userData, lang, targetCalories, weightToLose, weeks) {
  const MEAL_KEY_MAP = {
    'الإفطار': 'breakfast', 'افطار': 'breakfast', 'فطور': 'breakfast',
    'الغداء': 'lunch', 'غداء': 'lunch',
    'العشاء': 'dinner', 'عشاء': 'dinner',
    'وجبة خفيفة': 'snack', 'سناك': 'snack', 'وجبات خفيفة': 'snack',
  };

  const daysAr = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
  const daysEn = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const days = lang === 'ar' ? daysAr : daysEn;

  let weeklyPlan = [];
  let rawPlan = plan.weekly_plan || [];
  if (Array.isArray(rawPlan)) {
    weeklyPlan = rawPlan.slice(0, 7).map((day, i) => {
      let dayObj = { day: day.day || days[i], breakfast: null, lunch: null, dinner: null, snack: null };
      Object.keys(day).forEach(key => {
        const mapped = MEAL_KEY_MAP[key] || key;
        if (['breakfast', 'lunch', 'dinner', 'snack'].includes(mapped)) {
          let meal = day[key];
          if (!meal) meal = day[mapped];
          if (meal) {
            dayObj[mapped] = {
              options: Array.isArray(meal.options) ? meal.options : (Array.isArray(meal) ? meal : [meal]),
              macros: meal.macros || ''
            };
          }
        }
      });
      ['breakfast', 'lunch', 'dinner', 'snack'].forEach(slot => {
        if (!dayObj[slot] || !dayObj[slot].options || dayObj[slot].options.length === 0) {
          dayObj[slot] = { options: [lang === 'ar' ? 'وجبة مقترحة' : 'Suggested meal'], macros: '' };
        } else {
          dayObj[slot].options = dayObj[slot].options.map(opt => typeof opt === 'string' ? opt : (opt.name || opt.meal || JSON.stringify(opt)));
        }
      });
      return dayObj;
    });
  } else {
    for (let i = 0; i < 7; i++) {
      weeklyPlan.push({
        day: days[i],
        breakfast: { options: [lang === 'ar' ? 'وجبة مقترحة' : 'Suggested meal'], macros: '' },
        lunch: { options: [lang === 'ar' ? 'وجبة مقترحة' : 'Suggested meal'], macros: '' },
        dinner: { options: [lang === 'ar' ? 'وجبة مقترحة' : 'Suggested meal'], macros: '' },
        snack: { options: [lang === 'ar' ? 'وجبة مقترحة' : 'Suggested meal'], macros: '' }
      });
    }
  }

  let homeWorkout = plan.home_workout || '';
  if (!homeWorkout || homeWorkout.length < 20) {
    homeWorkout = generateWorkout(lang, userData.activity);
  }

  let tips = plan.tips || [];
  if (!Array.isArray(tips) || tips.length === 0) {
    tips = generateTips(lang, userData);
  }

  return {
    human_intro: plan.human_intro || (lang === 'ar' ? `مرحباً ${userData.first_name || ''}!` : `Welcome ${userData.first_name || ''}!`),
    target_calories: plan.target_calories || targetCalories,
    daily_macros: plan.daily_macros || { protein: '120g', carbs: '150g', fats: '60g' },
    weight_to_lose: plan.weight_to_lose || weightToLose,
    expected_weeks: plan.expected_weeks || weeks,
    weekly_plan: weeklyPlan,
    home_workout: homeWorkout,
    tips: tips,
    specialist_notes: plan.specialist_notes || ''
  };
}
