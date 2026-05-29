/* ===========================================================
   CITTA. — Product Catalog
   Urban × Nautical Streetwear
   =========================================================== */

const products = [
    {
        id: 1,
        name: "Anchor Heavy Hoodie",
        category: "Hoodies",
        description: "هودي ثقيل بتطريز المرساة على الصدر. قطن 480gsm فاخر.",
        price: 8900,
        currency: "DA",
        image: "🧥",
        badge: "BESTSELLER",
        sizes: ["S", "M", "L", "XL", "XXL"],
        details: "هودي Citta. الموقع. صناعة من القطن البريمي بوزن 480gsm، تطريز يدوي للمرساة على الصدر بخيط فضي، شعار البراند مطبوع بتقنية puff print على الظهر. قصة Boxy oversize للحركة الحضرية. لون أسود مطفي بتشطيب premium يبقى دافئ بدون ثقل."
    },
    {
        id: 2,
        name: "Lighthouse Graphic Tee",
        category: "T-Shirts",
        description: "تيشيرت رسومي بمنارة سينمائية. قطن 240gsm.",
        price: 3500,
        currency: "DA",
        image: "👕",
        badge: "NEW DROP",
        sizes: ["S", "M", "L", "XL"],
        details: "تيشيرت Citta. Lighthouse Edition. قطن مصري 240gsm فائق النعومة. طباعة سينمائية بدقة عالية لمشهد المنارة على الساحل المتوسطي مع شعار البراند بنقطة سيان مميزة. قصة Regular fit بأكمام قصيرة منسدلة. متوفر بألوان: أسود، بيج، أزرق غامق."
    },
    {
        id: 3,
        name: "Captain Cap",
        category: "Headwear",
        description: "كاب بشعار المرساة المُطرز. قابلة للتعديل.",
        price: 2200,
        currency: "DA",
        image: "🧢",
        badge: null,
        sizes: ["One Size"],
        details: "كاب Citta. Captain Edition. قماش قطني سميك بقصة كلاسيكية 6-panel. تطريز ثلاثي الأبعاد للمرساة بخيط أبيض مع حلقة سيان حول الشعار. حزام جلدي خلفي بسبيكة معدنية مطلية بالذهب لتعديل المقاس. مبطنة من الداخل بقطن ناعم."
    },
    {
        id: 4,
        name: "Cargo Pants Wide",
        category: "Bottoms",
        description: "بنطلون كارجو واسع بجيوب جانبية. ستايل streetwear.",
        price: 6800,
        currency: "DA",
        image: "👖",
        badge: "TRENDING",
        sizes: ["28", "30", "32", "34", "36"],
        details: "بنطلون Citta. Wide Cargo. قماش ripstop ثقيل مقاوم للتآكل. قصة Wide-leg مع طي عميق. ستة جيوب وظيفية: جيبان جانبيان كبيران بأزرار معدنية، جيبان خلفيان، جيبان أماميان. شعار Citta. مطرز على الجيب الجانبي. حزام داخلي قابل للضبط."
    },
    {
        id: 5,
        name: "Coastal Crewneck",
        category: "Sweatshirts",
        description: "سويتشيرت بطباعة الساحل المتوسطي.",
        price: 6200,
        currency: "DA",
        image: "👔",
        badge: "LIMITED",
        sizes: ["S", "M", "L", "XL"],
        details: "سويتشيرت Citta. Coastal. مزيج قطن وبوليستر premium بوزن 380gsm. طباعة فنية للساحل الصخري المتوسطي بألوان دافئة (بني، بيج، أزرق غامق) على ظهر القطعة. شعار البراند مطرز على الصدر الأيسر. أكمام raglan لراحة الحركة."
    },
    {
        id: 6,
        name: "Mediterranean Shorts",
        category: "Bottoms",
        description: "شورت قصير بقصة فضفاضة. مثالي للصيف.",
        price: 3800,
        currency: "DA",
        image: "🩳",
        badge: null,
        sizes: ["S", "M", "L", "XL"],
        details: "شورت Citta. Mediterranean. قماش لينين-قطن خفيف مثالي لحرارة الساحل. قصة فضفاضة بطول فوق الركبة. حزام مطاطي مع حبل قطني. ثلاثة جيوب: اثنان جانبيان وواحد خلفي بسحاب. شعار البراند مطرز بخيط لايم على الجيب الأيسر."
    },
    {
        id: 7,
        name: "Anchor Chain Necklace",
        category: "Accessories",
        description: "سلسلة معدنية بميدالية المرساة. ستيل ستينلس.",
        price: 4500,
        currency: "DA",
        image: "⚓",
        badge: "EXCLUSIVE",
        sizes: ["50cm", "60cm"],
        details: "سلسلة Citta. Anchor Chain. ستيل ستينلس 316L مقاوم للصدأ والماء. ميدالية المرساة الشهيرة بقطر 4سم مع حلقة محيطة بنقش 'The world is yours'. سلسلة Cuban link سميكة بمظهر premium. تأتي في علبة مخملية سوداء مع شهادة أصالة."
    },
    {
        id: 8,
        name: "Lightning Bomber",
        category: "Outerwear",
        description: "جاكيت بومبر بتطريز البرق على الكم.",
        price: 12500,
        currency: "DA",
        image: "🧥",
        badge: "PREMIUM",
        sizes: ["S", "M", "L", "XL"],
        details: "جاكيت Citta. Lightning Bomber. قماش نايلون مقاوم للماء والرياح. بطانة كاملة من الساتان الأسود الفاخر. تطريز البرق ⚡ بخيط لايم على الكم الأيمن، شعار Citta. مطرز على الصدر. أزرار سحاب YKK ذهبية. ثلاثة جيوب داخلية و2 جيب خارجي بسحاب."
    }
];

// Helper to format price
function formatPrice(price) {
    return new Intl.NumberFormat('ar-DZ').format(price);
}
