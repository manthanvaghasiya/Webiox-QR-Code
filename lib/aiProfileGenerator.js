/**
 * AI Profile Generator
 * Smart template-based content generation for business profiles.
 * No external API keys required — 100% free for all users.
 */

// ── Category Definitions ──────────────────────────────────────────────────────

const CATEGORIES = {
  restaurant: {
    label: 'Restaurant / Café',
    taglineTemplates: [
      'Where every meal is a celebration of flavor.',
      'Taste the passion in every dish.',
      'Great food, warm vibes, unforgettable memories.',
      'Crafting dishes that bring people together.',
      'From our kitchen to your table — with love.',
    ],
    aboutTemplates: [
      `{name} is a beloved {category} known for its exceptional culinary experience. Located in the heart of our community, we take pride in serving carefully crafted dishes made from the freshest ingredients. Our team of passionate chefs brings {keywords} to life in every plate, creating a dining experience that's both memorable and satisfying. Whether you're joining us for a quick bite or a special occasion, we promise great food and even better company.`,
      `Welcome to {name}, where food is more than just sustenance — it's an experience. We specialize in {keywords}, crafted with skill and served with heart. Our warm, welcoming atmosphere makes every visit feel like coming home. From breakfast through dinner, we're committed to quality, freshness, and flavors that keep you coming back.`,
    ],
    defaultServices: [
      { title: 'Dine-In', description: 'Enjoy a relaxed meal in our welcoming dining space.' },
      { title: 'Takeaway', description: 'Order your favorites to enjoy at home.' },
      { title: 'Home Delivery', description: 'Fresh meals delivered right to your door.' },
      { title: 'Party Orders', description: 'Bulk orders for celebrations and events.' },
    ],
  },
  salon: {
    label: 'Salon / Beauty',
    taglineTemplates: [
      'Where beauty meets expertise.',
      'You deserve to look and feel your best.',
      'Transforming looks, boosting confidence.',
      'Your beauty is our canvas.',
      'Expert care for your hair, skin, and soul.',
    ],
    aboutTemplates: [
      `{name} is a premium {category} dedicated to helping you look and feel your absolute best. Our skilled stylists and beauty experts specialize in {keywords}, using top-quality products and the latest techniques. We believe beauty is a personal journey, and we're here to guide yours with expertise, care, and creativity. Step in and let us transform your look.`,
      `At {name}, beauty is our passion and precision is our promise. We offer a full range of {keywords} services in a relaxing, stylish environment. Our experienced team stays ahead of the latest trends so you always leave looking fresh and fabulous. Book your appointment today and discover the difference true expertise makes.`,
    ],
    defaultServices: [
      { title: 'Haircut & Styling', description: 'Expert cuts and styles for all hair types.' },
      { title: 'Hair Color & Highlights', description: 'Vibrant colors using premium products.' },
      { title: 'Facial & Skincare', description: 'Rejuvenating treatments for glowing skin.' },
      { title: 'Bridal Makeup', description: 'Perfect looks for your special day.' },
    ],
  },
  retail: {
    label: 'Retail Shop',
    taglineTemplates: [
      'Quality products you can trust.',
      'Your one-stop shop for everything you need.',
      'Great products, great prices, every day.',
      'Shop smart. Shop local.',
      'Where quality meets value.',
    ],
    aboutTemplates: [
      `{name} is your trusted local {category} offering a carefully curated selection of {keywords}. We're committed to bringing you the best products at fair prices, backed by friendly and knowledgeable service. Whether you're a regular or a first-time visitor, you'll always find what you need — and more — at {name}.`,
      `Welcome to {name}, where quality shopping meets personal service. Our store stocks an extensive range of {keywords} to meet all your needs. We take pride in offering genuine products, competitive pricing, and a hassle-free shopping experience. Visit us today and see why our customers keep coming back.`,
    ],
    defaultServices: [
      { title: 'In-Store Shopping', description: 'Browse our full range of quality products.' },
      { title: 'Home Delivery', description: 'Get your purchases delivered to your door.' },
      { title: 'Custom Orders', description: 'Special orders for specific needs.' },
      { title: 'After-Sale Service', description: 'Support even after your purchase.' },
    ],
  },
  clinic: {
    label: 'Clinic / Healthcare',
    taglineTemplates: [
      'Your health is our highest priority.',
      'Compassionate care, trusted expertise.',
      'Healing with heart, treating with skill.',
      'Where wellness begins.',
      'Expert care when you need it most.',
    ],
    aboutTemplates: [
      `{name} is a trusted {category} dedicated to providing exceptional healthcare services. Our team of qualified professionals specializes in {keywords}, offering compassionate and personalized care to every patient. We believe in treating the whole person — not just the condition — and are committed to your long-term health and well-being.`,
      `At {name}, your health is our mission. We provide comprehensive {keywords} services with a patient-first approach. Our experienced medical team combines clinical expertise with genuine care, ensuring every visit is comfortable and every treatment is effective. Trust us to be your partner in health.`,
    ],
    defaultServices: [
      { title: 'Consultation', description: 'Expert diagnosis and medical advice.' },
      { title: 'Diagnostic Tests', description: 'Accurate tests and health screenings.' },
      { title: 'Follow-up Care', description: 'Ongoing monitoring and treatment.' },
      { title: 'Emergency Services', description: 'Prompt care when you need it urgently.' },
    ],
  },
  gym: {
    label: 'Gym / Fitness',
    taglineTemplates: [
      'Transform your body, transform your life.',
      'Where champions train.',
      'Push your limits. Exceed your goals.',
      'Fitness is not a goal — it\'s a lifestyle.',
      'Your strongest self starts here.',
    ],
    aboutTemplates: [
      `{name} is a premier {category} center designed to help you achieve your health and fitness goals. Our state-of-the-art facility offers {keywords}, supported by certified trainers who are passionate about your progress. Whether you're a beginner or a seasoned athlete, we have the equipment, expertise, and energy to take you to the next level.`,
      `Welcome to {name}, where fitness meets community. We offer {keywords} in a motivating, welcoming environment. Our expert trainers create personalized programs to suit every fitness level and goal. Join our growing family of members who've discovered that the best investment you can make is in your own health.`,
    ],
    defaultServices: [
      { title: 'Personal Training', description: 'One-on-one sessions with certified trainers.' },
      { title: 'Group Classes', description: 'High-energy classes for all fitness levels.' },
      { title: 'Diet & Nutrition', description: 'Expert guidance on nutrition and meal plans.' },
      { title: 'Membership Plans', description: 'Flexible plans to fit your lifestyle.' },
    ],
  },
  hotel: {
    label: 'Hotel / Hospitality',
    taglineTemplates: [
      'Your home away from home.',
      'Where comfort meets elegance.',
      'Exceptional stays, unforgettable experiences.',
      'Rest, relax, and rejuvenate.',
      'Hospitality at its finest.',
    ],
    aboutTemplates: [
      `{name} is a distinguished {category} offering guests an unparalleled experience of comfort and luxury. From our thoughtfully designed rooms to our world-class amenities including {keywords}, every aspect of your stay is crafted to exceed expectations. Our dedicated team ensures that every guest feels valued, welcome, and truly at home.`,
      `At {name}, we redefine hospitality. Our {category} combines elegant design, premium amenities, and heartfelt service to create stays that guests remember long after checkout. With offerings including {keywords}, we cater to both leisure and business travelers. Let us be your destination of choice.`,
    ],
    defaultServices: [
      { title: 'Deluxe Rooms', description: 'Comfortable, well-appointed rooms for a restful stay.' },
      { title: 'Restaurant & Bar', description: 'Culinary delights and refreshing beverages.' },
      { title: 'Conference Facilities', description: 'Modern venues for business events.' },
      { title: 'Spa & Wellness', description: 'Relaxing treatments to rejuvenate body and mind.' },
    ],
  },
  education: {
    label: 'Education / Coaching',
    taglineTemplates: [
      'Empowering minds, shaping futures.',
      'Where learning never stops.',
      'Excellence in education, every day.',
      'Building tomorrow\'s leaders today.',
      'Quality education that makes a difference.',
    ],
    aboutTemplates: [
      `{name} is a leading {category} institution committed to academic excellence and holistic development. We specialize in {keywords}, offering expert instruction, personalized attention, and a nurturing learning environment. Our experienced educators are dedicated to unlocking every student's potential and preparing them for a bright future.`,
      `At {name}, education is more than just teaching — it's inspiration. We offer comprehensive {keywords} programs designed to challenge, engage, and empower learners of all levels. With a proven track record of excellence and a passionate team of educators, we're the trusted choice for families seeking quality education.`,
    ],
    defaultServices: [
      { title: 'Regular Classes', description: 'Structured courses for consistent learning.' },
      { title: 'Doubt Clearing Sessions', description: 'One-on-one sessions to address challenges.' },
      { title: 'Mock Tests & Practice', description: 'Test preparation and performance tracking.' },
      { title: 'Online Learning', description: 'Flexible digital classes from anywhere.' },
    ],
  },
  realEstate: {
    label: 'Real Estate',
    taglineTemplates: [
      'Finding you the perfect place to call home.',
      'Where dreams become addresses.',
      'Your property goals are our mission.',
      'Expert guidance for every real estate decision.',
      'Turning keys to your future.',
    ],
    aboutTemplates: [
      `{name} is a trusted {category} agency with deep expertise in {keywords}. We help buyers, sellers, and investors navigate the property market with confidence. Our team of experienced agents provides honest advice, transparent dealings, and unmatched local knowledge to ensure every transaction is smooth, successful, and stress-free.`,
      `Welcome to {name}, your trusted partner in all things real estate. Specializing in {keywords}, we bring a combination of market insight, negotiation expertise, and genuine care to every client relationship. Whether you're buying your first home or growing your investment portfolio, we're with you every step of the way.`,
    ],
    defaultServices: [
      { title: 'Property Sale', description: 'Expert assistance in selling your property at best value.' },
      { title: 'Property Purchase', description: 'Find your dream home with our guidance.' },
      { title: 'Rental Services', description: 'Property rentals for residential and commercial needs.' },
      { title: 'Property Valuation', description: 'Accurate market valuations and assessments.' },
    ],
  },
  technology: {
    label: 'Technology / IT Services',
    taglineTemplates: [
      'Powering your digital future.',
      'Technology solutions that work for you.',
      'Innovation delivered, results guaranteed.',
      'Smarter technology, better business.',
      'Your tech partner, every step of the way.',
    ],
    aboutTemplates: [
      `{name} is a forward-thinking {category} company specializing in {keywords}. We partner with businesses of all sizes to deliver innovative, reliable, and scalable technology solutions. Our team of skilled engineers and consultants brings technical excellence and creative problem-solving to every project, ensuring your technology works as hard as you do.`,
      `At {name}, we bridge the gap between technology and business success. Our expertise in {keywords} enables us to deliver solutions that drive real results. From initial consultation to ongoing support, we're committed to understanding your unique needs and exceeding your expectations at every stage.`,
    ],
    defaultServices: [
      { title: 'Software Development', description: 'Custom software built to your specifications.' },
      { title: 'IT Consulting', description: 'Strategic technology advice for your business.' },
      { title: 'Cloud Services', description: 'Scalable cloud solutions for modern businesses.' },
      { title: 'Tech Support', description: '24/7 support to keep your systems running smoothly.' },
    ],
  },
  general: {
    label: 'Business',
    taglineTemplates: [
      'Quality service, every time.',
      'Your satisfaction is our commitment.',
      'Trusted, reliable, and always here for you.',
      'Excellence in everything we do.',
      'Building relationships, delivering results.',
    ],
    aboutTemplates: [
      `{name} is a reputable {category} committed to delivering exceptional value to our customers. We take pride in offering {keywords} with a focus on quality, reliability, and customer satisfaction. Our experienced team works hard every day to meet and exceed your expectations. We look forward to serving you.`,
      `Welcome to {name}. We're dedicated to providing top-quality {keywords} services with a personal touch. Our approach combines expertise with a genuine commitment to customer care, ensuring every interaction is positive and every outcome exceeds expectations. Thank you for choosing {name}.`,
    ],
    defaultServices: [
      { title: 'Consultation', description: 'Expert advice tailored to your needs.' },
      { title: 'Core Services', description: 'Our primary offerings, delivered with care.' },
      { title: 'Custom Solutions', description: 'Tailored solutions for unique requirements.' },
      { title: 'After-Service Support', description: 'Ongoing support and assistance.' },
    ],
  },
};

// ── Helper Functions ──────────────────────────────────────────────────────────

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function formatKeywords(keywords) {
  if (!keywords || keywords.length === 0) return 'quality services';
  if (keywords.length === 1) return keywords[0];
  if (keywords.length === 2) return keywords.join(' and ');
  return keywords.slice(0, -1).join(', ') + ', and ' + keywords[keywords.length - 1];
}

function interpolate(template, vars) {
  return template.replace(/\{(\w+)\}/g, (_, key) => vars[key] || '');
}

// ── Main Generator ────────────────────────────────────────────────────────────

/**
 * Generate AI content for a business profile.
 * @param {object} params
 * @param {string} params.businessName
 * @param {string} params.category
 * @param {string[]} params.keywords
 * @returns {{ taglines: string[], about: string, services: object[] }}
 */
export function generateProfileContent({ businessName, category = 'general', keywords = [] }) {
  const catKey = Object.keys(CATEGORIES).find(
    (k) => k === category || CATEGORIES[k]?.label?.toLowerCase() === category?.toLowerCase()
  ) || 'general';

  const catData = CATEGORIES[catKey] || CATEGORIES.general;
  const catLabel = catData.label;
  const kwStr = formatKeywords(keywords);

  const vars = {
    name: businessName || 'Our Business',
    category: catLabel,
    keywords: kwStr,
  };

  // Generate 3 tagline options
  const shuffled = [...catData.taglineTemplates].sort(() => Math.random() - 0.5);
  const taglines = shuffled.slice(0, 3);

  // Generate about (pick template, interpolate)
  const aboutTemplate = pickRandom(catData.aboutTemplates);
  const about = interpolate(aboutTemplate, vars);

  // Default services for this category
  const services = catData.defaultServices.map((s, i) => ({
    title: s.title,
    description: s.description,
    price: '',
    currency: 'INR',
    imageUrl: '',
    order: i,
  }));

  return { taglines, about, services };
}

// ── Categories list for frontend dropdowns ────────────────────────────────────

export const CATEGORY_OPTIONS = [
  { value: 'restaurant', label: '🍽️ Restaurant / Café' },
  { value: 'salon', label: '💇 Salon / Beauty' },
  { value: 'retail', label: '🛍️ Retail Shop' },
  { value: 'clinic', label: '🏥 Clinic / Healthcare' },
  { value: 'gym', label: '💪 Gym / Fitness' },
  { value: 'hotel', label: '🏨 Hotel / Hospitality' },
  { value: 'education', label: '🎓 Education / Coaching' },
  { value: 'realEstate', label: '🏠 Real Estate' },
  { value: 'technology', label: '💻 Technology / IT Services' },
  { value: 'general', label: '🏪 Other Business' },
];
