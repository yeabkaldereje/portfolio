/* Amharic / English switch. English stays the source of truth in the HTML;
   Amharic is applied on top by swapping text and a few attributes. */
(function () {
  'use strict';
  const html = document.documentElement;
  const btn = document.getElementById('lang-btn');
  const norm = s => s.replace(/\s+/g, ' ').trim();

  /* ---- plain-text dictionary (English → Amharic) ---- */
  const T = {
    'Skip to work': 'ወደ ስራዎች ዝለል',
    'Work': 'ስራዎች', 'About': 'ስለ እኔ', 'Experience': 'ልምድ', 'Services': 'አገልግሎቶች', 'Contact': 'ያግኙኝ',
    'Selected work': 'የተመረጡ ስራዎች',
    'Addis Ababa, ET': 'አዲስ አበባ፣ ኢት', 'local': 'የአካባቢ ሰዓት',
    'Open to remote & freelance work': 'ለርቀት እና ለፍሪላንስ ስራ ዝግጁ ነኝ',
    'I design brands': 'ብራንዶችን እቀርጻለሁ', '& build the': 'ሰዎች የሚኖሩባቸውን',
    'interfaces': 'በይነገጾችን', 'they live in.': 'እገነባለሁ።',
    'See the work': 'ስራዎቹን ይመልከቱ', 'Download CV': 'ሲቪ ያውርዱ', 'Scroll': 'ወደ ታች',
    'years designing professionally': 'ዓመታት በሙያው',
    'roles across in-house, remote & freelance': 'በድርጅት፣ በርቀትና በፍሪላንስ የሰራሁባቸው ሚናዎች',
    'pieces in the archive below': 'ከታች በማህደሩ ውስጥ ያሉ ስራዎች',
    'Trusted by': 'የሚያምኑኝ ደንበኞች',
    '01 — Selected work': '01 — የተመረጡ ስራዎች',
    'Campaigns, systems & identities': 'ዘመቻዎች፣ ሥርዓቶችና ማንነቶች',
    'Projects where the design was a system rather than a single image. Drag the strips, or click any piece to open it full size.': 'ንድፉ ከአንድ ምስል ይልቅ ሥርዓት የሆነባቸው ፕሮጀክቶች። ስትሪፖቹን ይጎትቱ ወይም ማንኛውንም ስራ ጠቅ አድርገው በሙሉ መጠን ይክፈቱ።',
    'Case study': 'የጉዳይ ጥናት', 'Eske Fasika Bazaar': 'እስከ ፋሲካ ባዛር',
    'Print and event branding for an Awash Bank–sponsored bazaar.': 'በአዋሽ ባንክ ስፖንሰር ለተደረገ ባዛር የህትመትና የዝግጅት ብራንዲንግ።',
    'When': 'መቼ', 'March – April 2026': 'ማርች – ኤፕሪል 2026', 'Role': 'ሚና', 'Designer': 'ዲዛይነር',
    'Sponsor': 'ስፖንሰር', 'Awash Bank': 'አዋሽ ባንክ', 'Deliverables': 'የተሰጡ ስራዎች',
    'Banners, posters, flyers, event branding': 'ባነሮች፣ ፖስተሮች፣ ፍላየሮች፣ የዝግጅት ብራንዲንግ',
    'The brief': 'ጥያቄው',
    'Design every printed piece for the bazaar, and keep the event branding consistent with both the sponsor and the event theme.': 'ለባዛሩ የሚታተሙትን ሁሉንም ስራዎች መቅረጽ፣ የዝግጅቱን ብራንዲንግም ከስፖንሰሩና ከዝግጅቱ ጭብጥ ጋር ወጥ ማድረግ።',
    'The approach': 'አቀራረቡ',
    'Banners, posters and flyers were designed as one family that shares the same event branding, so each piece reads as part of the same event.': 'ባነሮች፣ ፖስተሮችና ፍላየሮች አንድ የዝግጅት ብራንዲንግ የሚጋሩ እንደ አንድ ቤተሰብ ተቀርጸዋል፤ ስለዚህ እያንዳንዱ ስራ የአንድ ዝግጅት አካል ሆኖ ይነበባል።',
    'The result': 'ውጤቱ',
    'A complete, consistent set of print-ready materials, delivered on time.': 'ሙሉና ወጥ የሆነ ለህትመት ዝግጁ የሆኑ ቁሳቁሶች፣ በጊዜው የተላኩ።',
    'The full archive': 'ሙሉው ማህደር',
    '02 — About': '02 — ስለ እኔ', 'Designer who reads the source': 'ምንጭ ኮዱን የሚያነብ ዲዛይነር',
    'Addis Ababa, Ethiopia': 'አዲስ አበባ፣ ኢትዮጵያ',
    'computer science': 'ኮምፒውተር ሳይንስ', 'and': 'እና',
    "I'm a senior graphic and UI/UX designer with more than five years of experience in branding, social media content, website interfaces, print and marketing campaigns.": 'ከአምስት ዓመታት በላይ በብራንዲንግ፣ በማህበራዊ ሚዲያ ይዘት፣ በድረ-ገጽ በይነገጾች፣ በህትመትና በግብይት ዘመቻዎች ልምድ ያለኝ ሲኒየር ግራፊክ እና UI/UX ዲዛይነር ነኝ።',
    'My degree in computer science (Unity University, 2018–2022) shapes how I work: I design in Figma with developers in mind, keep systems consistent, and can write the HTML, CSS and JavaScript myself, including this site. I work in Amharic and English, and I know the Ethiopian market from the inside.': 'በኮምፒውተር ሳይንስ ዲግሪዬ (ዩኒቲ ዩኒቨርሲቲ፣ 2018–2022) አሰራሬ ተቀርጿል፦ በFigma የምቀርጸው ገንቢዎችን በአእምሮ ይዤ ነው፣ ሥርዓቶችን ወጥ አደርጋለሁ፣ እንዲሁም ይህን ድረ-ገጽ ጨምሮ HTML፣ CSS እና JavaScript ራሴ መጻፍ እችላለሁ። በአማርኛና በእንግሊዝኛ እሰራለሁ፣ የኢትዮጵያንም ገበያ ከውስጥ አውቀዋለሁ።',
    'Design': 'ዲዛይን', 'Code & CS': 'ኮድ እና ኮምፒውተር ሳይንስ', 'Data structures': 'የዳታ መዋቅሮች',
    'Algorithms': 'አልጎሪዝሞች', 'Computer graphics': 'ኮምፒውተር ግራፊክስ', 'Mobile dev': 'የሞባይል ልማት',
    "Brands I've worked with": 'የሰራሁላቸው ብራንዶች',
    '03 — Experience': '03 — ልምድ', 'Commit history': 'የስራ ታሪክ',
    'Every role, newest first. Short hashes are decorative.': 'ሁሉም ሚናዎች፣ አዲሱ መጀመሪያ። አጫጭር ሃሽ ኮዶች ለማጌጫ ብቻ ናቸው።',
    '05/2026 – present': '05/2026 – አሁን', '04/2018 – present': '04/2018 – አሁን',
    'Addis Ababa': 'አዲስ አበባ', 'Remote': 'በርቀት',
    'Senior Graphic Designer': 'ሲኒየር ግራፊክ ዲዛይነር',
    'Senior Graphic Designer / UI/UX Designer': 'ሲኒየር ግራፊክ ዲዛይነር / UI/UX ዲዛይነር',
    'Brand Designer · Lead Graphics Designer': 'ብራንድ ዲዛይነር · ሊድ ግራፊክስ ዲዛይነር',
    'Senior Graphic Designer / Video Editor': 'ሲኒየር ግራፊክ ዲዛይነር / ቪዲዮ ኤዲተር',
    'Junior Graphic Designer': 'ጁኒየር ግራፊክ ዲዛይነር',
    'Senior Graphic Designer / UI/UX Designer / Video Editor': 'ሲኒየር ግራፊክ ዲዛይነር / UI/UX ዲዛይነር / ቪዲዮ ኤዲተር',
    'Freelance': 'ፍሪላንስ',
    'Design visuals for social media, branding, websites and marketing campaigns.': 'ለማህበራዊ ሚዲያ፣ ለብራንዲንግ፣ ለድረ-ገጾችና ለግብይት ዘመቻዎች ምስላዊ ስራዎችን እቀርጻለሁ።',
    'Work with marketing and development teams to deliver user-focused design solutions.': 'ተጠቃሚን ያማከሉ የዲዛይን መፍትሔዎችን ለማቅረብ ከግብይትና ከልማት ቡድኖች ጋር እሰራለሁ።',
    'Run several projects at once while holding quality and deadlines.': 'ጥራትንና የጊዜ ገደብን እየጠበቅሁ በአንድ ጊዜ ብዙ ፕሮጀክቶችን እመራለሁ።',
    'Led visual branding and creative strategy across print and digital platforms.': 'በህትመትና በዲጂታል መድረኮች ላይ የምስል ብራንዲንግንና የፈጠራ ስትራቴጂን መራሁ።',
    "Designed responsive, user-focused websites in Figma that fit each client's business goals.": 'ከእያንዳንዱ ደንበኛ የንግድ ግብ ጋር የሚስማሙ ምላሽ ሰጪና ተጠቃሚን ያማከሉ ድረ-ገጾችን በFigma ቀረጽሁ።',
    'Worked with developers so the UI shipped the way it was designed, and kept the brand consistent in every channel.': 'በይነገጹ እንደተቀረጸው እንዲገነባ ከገንቢዎች ጋር ሰራሁ፣ ብራንዱንም በሁሉም ሰርጦች ወጥ አደረግሁ።',
    'Led brand design with the Adobe Creative Suite, raising the visibility and consistency of the brand.': 'በAdobe Creative Suite የብራንድ ዲዛይንን መራሁ፤ የብራንዱን ታይነትና ወጥነት ጨመርኩ።',
    'HOPETECH is the sister company of Garad, one of the largest television retailers and technology importers in Ethiopia.': 'HOPETECH በኢትዮጵያ ከታላላቅ የቴሌቪዥን ቸርቻሪዎችና የቴክኖሎጂ አስመጪዎች አንዱ የሆነው የጋራድ እህት ኩባንያ ነው።',
    'Senior graphics designer, YouTube video editor and social media strategist in one role.': 'በአንድ ሚና ውስጥ ሲኒየር ግራፊክስ ዲዛይነር፣ የዩቲዩብ ቪዲዮ ኤዲተርና የማህበራዊ ሚዲያ ስትራቴጂስት።',
    'Built cohesive identities and high-impact visuals and videos that grew brand visibility and audience engagement.': 'የብራንድ ታይነትንና የተመልካች ተሳትፎን ያሳደጉ ወጥ ማንነቶችን እና ተጽዕኖ ፈጣሪ ምስሎችንና ቪዲዮዎችን ሰራሁ።',
    "Planned and executed branding strategies for Gishen Pharmacy, one of Ethiopia's top-ranked pharmacies, and other prominent companies.": 'በኢትዮጵያ ከፍተኛ ደረጃ ካላቸው ፋርማሲዎች አንዱ ለሆነው ለግሸን ፋርማሲና ለሌሎች ታዋቂ ኩባንያዎች የብራንዲንግ ስትራቴጂዎችን አቅጄ ተግባራዊ አደረግሁ።',
    'End-to-end branding and web design for clients.': 'ለደንበኞች ከጅምር እስከ ፍጻሜ የብራንዲንግና የድረ-ገጽ ዲዛይን።',
    'YouTube and social videos with a clear visual story that strengthens the brand message.': 'የብራንዱን መልዕክት የሚያጠናክር ግልጽ ምስላዊ ታሪክ ያላቸው የዩቲዩብና የማህበራዊ ሚዲያ ቪዲዮዎች።',
    'Also shipped': 'ሌሎች የተጠናቀቁ ስራዎች',
    '03/2026 – 04/2026': '03/2026 – 04/2026',
    'Banners, posters, flyers and event branding for the Awash Bank–sponsored bazaar, delivered print-ready and on time.': 'በአዋሽ ባንክ ለተደገፈው ባዛር ባነሮች፣ ፖስተሮች፣ ፍላየሮችና የዝግጅት ብራንዲንግ፣ ለህትመት ዝግጁ ሆነው በጊዜ ተላኩ።',
    'Skylink website': 'የSkylink ድረ-ገጽ',
    "A clean, modern site designed in Figma to showcase Skylink's digital services and tech products.": 'የSkylinkን ዲጂታል አገልግሎቶችና የቴክኖሎጂ ምርቶች ለማሳየት በFigma የተቀረጸ ንጹህና ዘመናዊ ድረ-ገጽ።',
    "Real-estate banners plus the layout of a full magazine, built to lift the brand's marketing appeal.": 'የሪል ስቴት ባነሮችና የአንድ ሙሉ መጽሔት አቀማመጥ፣ የብራንዱን የግብይት ማራኪነት ለማሳደግ የተሰሩ።',
    'Education': 'ትምህርት', 'BSc Computer Science': 'ቢኤስሲ ኮምፒውተር ሳይንስ',
    'Unity University, Addis Ababa. Data structures & algorithms, mobile app development, computer graphics.': 'ዩኒቲ ዩኒቨርሲቲ፣ አዲስ አበባ። የዳታ መዋቅሮችና አልጎሪዝሞች፣ የሞባይል መተግበሪያ ልማት፣ ኮምፒውተር ግራፊክስ።',
    'Languages': 'ቋንቋዎች', 'Amharic · English': 'አማርኛ · እንግሊዝኛ',
    'Amharic native, English fluent.': 'አማርኛ አፍ መፍቻዬ ነው፤ እንግሊዝኛ አቀላጥፌ እናገራለሁ።',
    '04 — Services': '04 — አገልግሎቶች', 'What I can do for you': 'ለእርስዎ ምን ማድረግ እችላለሁ',
    'From a first logo sketch to the page, post or poster it ends up on.': 'ከመጀመሪያው የሎጎ ንድፍ እስከሚቀመጥበት ገጽ፣ ፖስት ወይም ፖስተር ድረስ።',
    'Brand identity': 'የብራንድ ማንነት',
    'Logos, colour, type and guidelines that make a business instantly recognisable and easy to keep consistent.': 'ንግድን ወዲያውኑ የሚያስታውሱና ወጥነትን ለመጠበቅ ቀላል የሚያደርጉ ሎጎዎች፣ ቀለማት፣ ፊደላትና መመሪያዎች።',
    'Social & campaigns': 'ማህበራዊ ሚዲያና ዘመቻዎች',
    'Template systems and one-off posts for Instagram, Facebook, TikTok and Telegram, in Amharic and English.': 'ለኢንስታግራም፣ ፌስቡክ፣ ቲክቶክና ቴሌግራም በአማርኛና በእንግሊዝኛ የሚሆኑ የቴምፕሌት ሥርዓቶችና የተናጠል ፖስቶች።',
    'UI/UX & web': 'UI/UX እና ድረ-ገጽ',
    'Wireframes to responsive Figma designs, handed to developers with the details they need to build them well.': 'ከዋየርፍሬም እስከ ምላሽ ሰጪ የFigma ዲዛይን፤ ገንቢዎች በደንብ ለመገንባት የሚያስፈልጋቸውን ዝርዝር ጨምሮ ይተላለፋል።',
    'Print & large format': 'ህትመትና ትልልቅ ማተሚያዎች',
    'Banners, posters, flyers, brochures, magazines and event branding, prepared print-ready and delivered on schedule.': 'ባነሮች፣ ፖስተሮች፣ ፍላየሮች፣ ብሮሹሮች፣ መጽሔቶችና የዝግጅት ብራንዲንግ፤ ለህትመት ዝግጁ ሆነው በጊዜ ይደርሳሉ።',
    '05 — Kind words': '05 — የደንበኞች ምስክርነት', "From people I've worked with": 'አብረውኝ ከሰሩ ሰዎች',
    'I had the pleasure of working with Yeabkal Dereje on several projects, and I am truly impressed by his skills and professionalism. His creativity and attention to detail shine through in every design. From branding and logo creation to IT management, Yeabkal consistently delivers high-quality work that exceeds expectations.': 'ከYeabkal Dereje ጋር በብዙ ፕሮጀክቶች የመስራት እድል አግኝቻለሁ፤ በችሎታውና በሙያተኝነቱ በእጅጉ ተደንቄያለሁ። ፈጠራውና ለዝርዝር የሚሰጠው ትኩረት በእያንዳንዱ ዲዛይን ውስጥ ይታያል። ከብራንዲንግና ሎጎ ፈጠራ እስከ IT አስተዳደር ድረስ ከሚጠበቀው በላይ ጥራት ያለው ስራ ያለማቋረጥ ያቀርባል።',
    'Working with Yeabkal Dereje has been an amazing experience. His expertise in graphic design is exceptional, and he always brings fresh, creative ideas to the table. I\'ve seen him work on everything from logos to marketing materials, and each project showcases his skill and commitment to excellence. His dedication to delivering high-quality results and his ability to solve problems efficiently make him someone I would recommend without hesitation.': 'ከYeabkal Dereje ጋር መስራት አስደናቂ ተሞክሮ ነበር። በግራፊክ ዲዛይን ያለው ሙያ ልዩ ነው፣ ሁልጊዜም አዲስና ፈጠራ ያላቸው ሃሳቦችን ያመጣል። ከሎጎዎች እስከ የግብይት ቁሳቁሶች ድረስ ሲሰራ አይቻለሁ፤ እያንዳንዱ ፕሮጀክት ክህሎቱንና ለልህቀት ያለውን ቁርጠኝነት ያሳያል። ጥራት ያለው ውጤት ለማቅረብ ያለው ትጋትና ችግሮችን በብቃት የመፍታት ችሎታው ያለምንም ማመንታት የምመክረው ሰው ያደርገዋል።',
    'CEO, Mekhil Empowerment & Training Center': 'ዋና ሥራ አስፈጻሚ፣ Mekhil Empowerment & Training Center',
    'CEO, HOPETECH': 'ዋና ሥራ አስፈጻሚ፣ HOPETECH',
    '06 — Contact': '06 — ያግኙኝ',
    "Let's make something": 'አብረን እንስራ', 'memorable.': 'የማይረሳ ነገር።',
    'Hiring for a remote role, or have a brand, campaign or interface that needs care? Send a note. I\'ll get back to you.': 'ለርቀት ስራ እየቀጠሩ ነው፣ ወይስ እንክብካቤ የሚያስፈልገው ብራንድ፣ ዘመቻ ወይም በይነገጽ አለዎት? መልዕክት ይላኩልኝ፤ እመልስልዎታለሁ።',
    'Book a call': 'ጥሪ ይያዙ', 'Copy email': 'ኢሜይል ቅዳ', 'CV (PDF)': 'ሲቪ (PDF)',
    'Start a project': 'ፕሮጀክት ይጀምሩ', 'Tell me what you need and I will reply by email.': 'የሚፈልጉትን ይንገሩኝ፣ በኢሜይል እመልስልዎታለሁ።',
    'Your name': 'ስምዎ', 'Your email': 'ኢሜይልዎ', 'What do you need?': 'ምን ይፈልጋሉ?',
    'Brand identity or logo': 'የብራንድ ማንነት ወይም ሎጎ', 'Social media campaign': 'የማህበራዊ ሚዲያ ዘመቻ',
    'UI/UX or website design': 'UI/UX ወይም የድረ-ገጽ ዲዛይን', 'Print or event materials': 'የህትመት ወይም የዝግጅት ቁሳቁሶች',
    'Something else': 'ሌላ ነገር', 'Project details': 'የፕሮጀክት ዝርዝር', 'Send request': 'ጥያቄ ይላኩ',
    'Your message is sent through the FormSubmit service to my inbox. You can also write to ydereje1@gmail.com directly.': 'መልዕክትዎ በFormSubmit አገልግሎት በኩል ወደ ኢሜይሌ ይላካል። በቀጥታም ወደ ydereje1@gmail.com መጻፍ ይችላሉ።',
    'Campaigns': 'ዘመቻዎች', 'Web': 'ድረ-ገጽ', 'UI / UX': 'UI / UX', 'Brand identity': 'የብራንድ ማንነት',
    'Addis Ababa, Ethiopia (UTC+3)': 'አዲስ አበባ፣ ኢትዮጵያ (UTC+3)', 'Local time': 'የአካባቢ ሰዓት',
    'Hand-built with HTML, CSS & vanilla JS · no frameworks ·': 'በHTML፣ CSS እና vanilla JS በእጅ የተሰራ · ፍሬምወርክ የለም ·',
    'view source': 'ምንጩን ይመልከቱ',
    'to jump anywhere': 'ወደ ማንኛውም ቦታ ለመዝለል', 'Press': 'ይጫኑ',
    /* dynamic: gallery, chips, lightbox, palette, toasts */
    'All': 'ሁሉም', 'Social': 'ማህበራዊ', 'Branding': 'ብራንዲንግ', 'Print': 'ህትመት', 'Apparel': 'አልባሳት',
    'Social media': 'ማህበራዊ ሚዲያ', 'Branding & logos': 'ብራንዲንግና ሎጎዎች', 'Print & posters': 'ህትመትና ፖስተሮች',
    'Email copied to clipboard': 'ኢሜይል ተቀድቷል', 'Request sent': 'ጥያቄው ተልኳል', 'Sending…': 'በመላክ ላይ…',
    'Thank you. Your request is sent and I will reply by email.': 'አመሰግናለሁ። ጥያቄዎ ተልኳል፣ በኢሜይል እመልስልዎታለሁ።',
    'Navigate': 'ሂድ', 'Archive': 'ማህደር', 'Actions': 'ድርጊቶች', 'Links': 'አገናኞች',
    'Show only branding & logos': 'ብራንዲንግና ሎጎዎችን ብቻ አሳይ', 'Show only social media': 'ማህበራዊ ሚዲያን ብቻ አሳይ',
    'Show only print & posters': 'ህትመትና ፖስተሮችን ብቻ አሳይ', 'Show everything': 'ሁሉንም አሳይ',
    'Copy email address': 'ኢሜይል አድራሻ ቅዳ', 'Download CV (PDF)': 'ሲቪ አውርድ (PDF)',
    'Toggle light / dark theme': 'ብርሃን / ጨለማ ገጽታ ቀይር',
    'Open Telegram': 'ቴሌግራም ክፈት', 'Open Instagram': 'ኢንስታግራም ክፈት', 'Open LinkedIn': 'ሊንክድኢን ክፈት',
    'View source on GitHub': 'ምንጩን በGitHub ይመልከቱ',
    'No matches': 'ምንም አልተገኘም',
    /* projects */
    '100 Million Birr lottery campaign': 'የ100 ሚሊዮን ብር ሎተሪ ዘመቻ', 'Campaign': 'ዘመቻ', 'Amharic type': 'የአማርኛ ፊደል', 'Mobile & USSD promo': 'የሞባይልና USSD ማስተዋወቂያ',
    "Social posts for Ethiopia's national lottery and its 100 Million Birr draw: a weekly-chances message, a how-to-play guide for the 8989 USSD line and the website, all in one gold-and-red look.": 'ለኢትዮጵያ ብሔራዊ ሎተሪና ለ100 ሚሊዮን ብር እጣው የተሰሩ ማህበራዊ ሚዲያ ፖስቶች፦ ሳምንታዊ የእድል መልዕክት፣ ለ8989 USSD መስመርና ለድረ-ገጹ የአጫወት መመሪያ፣ ሁሉም በአንድ የወርቅና ቀይ ገጽታ።',
    'Lottery launch campaign': 'የሎተሪ ማስጀመሪያ ዘመቻ', 'Scratch-card promo': 'የመፋቂያ ካርድ ማስተዋወቂያ', 'Bilingual type': 'ሁለት ቋንቋ ፊደል',
    'A multi-post campaign for a South Sudan scratch-card lottery: relaunch, prize and winners messaging, and a sales-point map, all built on one bold blue-and-gold look.': 'ለደቡብ ሱዳን የመፋቂያ ካርድ ሎተሪ የተሰራ ባለብዙ ፖስት ዘመቻ፦ ዳግም ማስጀመር፣ የሽልማትና የአሸናፊዎች መልዕክት እና የመሸጫ ቦታዎች ካርታ፣ ሁሉም በአንድ ደማቅ የሰማያዊና ወርቅ ገጽታ ላይ የተመሰረቱ።',
    'Social media system': 'የማህበራዊ ሚዲያ ሥርዓት', 'Campaigns': 'ዘመቻዎች', 'Pattern language': 'የቅርጽ ቋንቋ',
    'Posts for a coffee brand: roast education, a Coffee Fest event poster, and Ramadan, Easter and holiday greetings in Amharic and English, all held together by one colourful pattern-driven identity.': 'ለቡና ብራንድ የተሰሩ ፖስቶች፦ የቡና አጠባበስ ትምህርት፣ የCoffee Fest ዝግጅት ፖስተር፣ እና በአማርኛና በእንግሊዝኛ የረመዳን፣ የፋሲካና የበዓል ሰላምታዎች፤ ሁሉም በአንድ ባለቀለም በቅርጽ የተመራ ማንነት የተያያዙ።',
    'Brand, social & web UI/UX': 'ብራንድ፣ ማህበራዊ ሚዲያና የድረ-ገጽ UI/UX', 'Figma website': 'የFigma ድረ-ገጽ', 'Brand consistency': 'የብራንድ ወጥነት',
    'Visual branding across print and digital for a tech company, from CCTV promos to national-day posts, plus the responsive website designed in Figma and handed to developers.': 'ለቴክኖሎጂ ኩባንያ በህትመትና በዲጂታል የተሰራ የምስል ብራንዲንግ፣ ከCCTV ማስተዋወቂያዎች እስከ የብሔራዊ በዓል ፖስቶች፣ እንዲሁም በFigma ተቀርጾ ለገንቢዎች የተላለፈው ምላሽ ሰጪ ድረ-ገጽ።',
    'Festive & seasonal posts': 'የበዓልና የወቅት ፖስቶች', 'Greetings': 'ሰላምታዎች', 'Cultural events': 'ባህላዊ ዝግጅቶች', 'Product-led': 'በምርት ላይ ያተኮረ',
    "Greeting and commemoration posts for a coffee shop: Eid al-Fitr and al-Adha, Adwa victory day and Labour Day, each tying the brand's coffee and café world to the occasion.": 'ለቡና ቤት የተሰሩ የሰላምታና የመታሰቢያ ፖስቶች፦ ኢድ አል-ፈጥር እና ኢድ አል-አድሃ፣ የአድዋ ድል በዓል እና የሠራተኞች ቀን፤ እያንዳንዱ የብራንዱን የቡናና የካፌ ዓለም ከበዓሉ ጋር ያዛምዳል።',
    'App launch campaign': 'የመተግበሪያ ማስጀመሪያ ዘመቻ', 'App promo': 'የመተግበሪያ ማስተዋወቂያ', 'Mockups': 'ሞክአፖች', 'Photo collage': 'የፎቶ ኮላጅ',
    'Launch posts for a location-guide app that helps people discover venues across Addis Ababa.': 'በአዲስ አበባ ያሉ ቦታዎችን ለማግኘት የሚረዳ የአካባቢ መመሪያ መተግበሪያ የማስጀመሪያ ፖስቶች።',
    'Course promos & quote series': 'የኮርስ ማስታወቂያዎችና የጥቅስ ተከታታይ', 'Education': 'ትምህርት', 'Series design': 'የተከታታይ ዲዛይን',
    'A repeatable template system for a training centre: course adverts, quote cards and awareness-month posts.': 'ለስልጠና ማዕከል የተሰራ ተደጋጋሚ የቴምፕሌት ሥርዓት፦ የኮርስ ማስታወቂያዎች፣ የጥቅስ ካርዶችና የግንዛቤ ወር ፖስቶች።'
  };
  T['Education'] = 'ትምህርት';

  /* ---- element-level (mixed markup) overrides, keyed by normalised innerHTML ---- */
  const H = {};
  const addH = (en, am) => { H[norm(en)] = am; };
  addH('I\'m <strong>Yeabkal Dereje</strong>, a senior graphic and UI/UX designer with a computer science degree. For 5+ years I\'ve turned briefs into brand identities, campaigns and websites for businesses across Ethiopia, and I care as much about how a design is built as how it looks.',
       'እኔ <strong>Yeabkal Dereje</strong> ነኝ፤ የኮምፒውተር ሳይንስ ዲግሪ ያለኝ ሲኒየር ግራፊክ እና UI/UX ዲዛይነር። ከ5 ዓመታት በላይ በኢትዮጵያ ላሉ ንግዶች ጥያቄዎችን ወደ ብራንድ ማንነቶች፣ ዘመቻዎችና ድረ-ገጾች ቀይሬያለሁ፤ ዲዛይኑ ምን እንደሚመስል ብቻ ሳይሆን እንዴት እንደተገነባም እጨነቃለሁ።');
  addH('2', '2');
  addH('I started in design, studied <em>computer science</em>, and ended up in the space between: a designer who understands layout grids <em>and</em> data structures.',
       'በዲዛይን ጀመርኩ፣ <em>ኮምፒውተር ሳይንስ</em> ተማርኩ፣ በሁለቱ መካከል ባለው ቦታ ደረስኩ፦ የአቀማመጥ ግሪዶችን <em>እና</em> የዳታ መዋቅሮችን የሚረዳ ዲዛይነር።');
  addH('Press <kbd class="mono">Ctrl/⌘ K</kbd> to jump anywhere',
       '<kbd class="mono">Ctrl/⌘ K</kbd> በመጫን ወደ ማንኛውም ቦታ ይዝለሉ');
  addH('languages, <span lang="am">አማርኛ</span> &amp; English', 'ቋንቋዎች፣ <span lang="am">አማርኛ</span> እና English');

  /* ---- attributes ---- */
  const ATTRS = ['aria-label', 'title', 'placeholder', 'data-cursor'];
  const A = {
    'Yeabkal Dereje — home': 'Yeabkal Dereje — መነሻ', 'Primary': 'ዋና', 'Open command menu': 'የትዕዛዝ ማውጫ ክፈት',
    'Command menu (Ctrl/⌘ K)': 'የትዕዛዝ ማውጫ (Ctrl/⌘ K)', 'Toggle light and dark theme': 'ብርሃንና ጨለማ ገጽታ ቀይር',
    'Menu': 'ማውጫ', 'Summary of skills, written as code': 'የክህሎቶች ማጠቃለያ፣ በኮድ መልክ',
    'Filter work by type': 'ስራዎችን በአይነት አጣራ',
    'What is it for, when do you need it, and any links or examples.': 'ለምን ነው፣ መቼ ይፈልጉታል፣ እንዲሁም ማንኛውም አገናኝ ወይም ምሳሌ።',
    'Image viewer': 'የምስል መመልከቻ', 'Close': 'ዝጋ', 'Previous': 'ቀዳሚ', 'Next': 'ቀጣይ', 'Command menu': 'የትዕዛዝ ማውጫ',
    'Jump to a section, copy email, toggle theme…': 'ወደ ክፍል ይሂዱ፣ ኢሜይል ይቅዱ፣ ገጽታ ይቀይሩ…', 'Search commands': 'ትዕዛዞችን ፈልግ',
    'View': 'ክፈት'
  };

  const store = new WeakMap(); // node -> {en, am}
  let lang = 'en', busy = false;

  function trText(s) {
    const n = norm(s);
    if (!n) return null;
    if (T[n] !== undefined) return T[n];
    let m = n.match(/^View (\d+) pieces$/);
    if (m) return m[1] + ' ስራዎችን ይመልከቱ';
    if (n.indexOf(' · ') > 0) {
      const parts = n.split(' · '), out = parts.map(p => T[p] !== undefined ? T[p] : p);
      if (out.some((p, i) => p !== parts[i])) return out.join(' · ');
    }
    return null;
  }
  function trAttr(v) {
    const n = norm(v);
    if (A[n] !== undefined) return A[n];
    let m = n.match(/^Open (.+)$/); if (m) return m[1] + ' ክፈት';
    m = n.match(/^(.+) work$/); if (m) return m[1] + ' ስራዎች';
    return null;
  }

  function doText(node) {
    const cur = node.data, rec = store.get(node);
    if (rec && rec.am === cur) return;
    const am = trText(cur);
    if (am == null) return;
    const lead = cur.match(/^\s*/)[0], trail = cur.match(/\s*$/)[0];
    const val = lead + am + trail;
    store.set(node, { en: cur, am: val });
    node.data = val;
  }
  function doAttrs(el) {
    for (const a of ATTRS) {
      if (!el.hasAttribute(a)) continue;
      const cur = el.getAttribute(a), key = '__' + a, rec = el[key];
      if (rec && rec.am === cur) continue;
      const am = trAttr(cur);
      if (am == null) continue;
      el[key] = { en: cur, am };
      el.setAttribute(a, am);
    }
  }
  function walk(node) {
    if (node.nodeType === 3) { doText(node); return; }
    if (node.nodeType !== 1) return;
    const tag = node.tagName;
    if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'TEXTAREA') { doAttrs(node); return; }
    doAttrs(node);
    if (node.firstElementChild && node.children.length < 6 && node.innerHTML.length < 900) {
      const rec = node.__html, cur = node.innerHTML;
      if (!(rec && rec.am === cur)) {
        const am = H[norm(cur)];
        if (am !== undefined && am !== cur) { node.__html = { en: cur, am }; node.innerHTML = am; return; }
      } else return;
    }
    for (let c = node.firstChild; c; c = c.nextSibling) walk(c);
  }
  function restore(node) {
    if (node.nodeType === 3) {
      const rec = store.get(node);
      if (rec && node.data === rec.am) node.data = rec.en;
      store.delete(node); return;
    }
    if (node.nodeType !== 1) return;
    for (const a of ATTRS) {
      const rec = node['__' + a];
      if (rec && node.getAttribute(a) === rec.am) node.setAttribute(a, rec.en);
      node['__' + a] = null;
    }
    const h = node.__html;
    if (h) { if (node.innerHTML === h.am) node.innerHTML = h.en; node.__html = null; return; }
    for (let c = node.firstChild; c; c = c.nextSibling) restore(c);
  }

  const obs = new MutationObserver(muts => {
    if (lang !== 'am' || busy) return;
    busy = true;
    for (const m of muts) {
      if (m.type === 'characterData') doText(m.target);
      else m.addedNodes.forEach(n => walk(n));
    }
    obs.takeRecords(); busy = false;
  });

  const origTitle = document.title;
  function set(next, persist) {
    lang = next;
    busy = true;
    if (next === 'am') {
      walk(document.body);
      document.title = 'Yeabkal Dereje — ግራፊክ እና UI/UX ዲዛይነር';
      obs.observe(document.body, { childList: true, subtree: true, characterData: true });
    } else {
      obs.disconnect();
      restore(document.body);
      document.title = origTitle;
    }
    obs.takeRecords(); busy = false;
    html.lang = next;
    if (btn) {
      btn.textContent = next === 'am' ? 'EN' : 'አማ';
      btn.setAttribute('aria-label', next === 'am' ? 'ወደ እንግሊዝኛ ቀይር' : 'Switch language to Amharic');
      btn.title = next === 'am' ? 'English' : 'አማርኛ';
    }
    if (persist) { try { localStorage.setItem('lang', next); } catch (e) {} }
  }

  if (btn) btn.addEventListener('click', () => set(lang === 'am' ? 'en' : 'am', true));
  let saved = null;
  try { saved = localStorage.getItem('lang'); } catch (e) {}
  if (!saved && /^am\b/i.test(navigator.language || '')) saved = 'am';
  if (saved === 'am') set('am', false);
  window.__setLang = set;
})();
