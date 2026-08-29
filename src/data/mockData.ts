import { ServiceItem, RepairStep, ProductItem, FeatureCard } from '../types';

export const COMPANY_INFO = {
  name: 'BOLT COMPUTER SERVICES',
  shortName: 'BOLT',
  tagline: 'SMART TECH. REAL SOLUTIONS.',
  subTagline: 'Computer services, repairs, upgrades and technology solutions built around your needs.',
  phone: '+234 803 123 4567',
  phoneAlt: '+234 701 987 6543',
  whatsapp: '+2348031234567',
  whatsappDisplay: '+234 803 123 4567',
  email: 'boltcybercafe@gmail.com',
  supportEmail: 'boltcybercafe@gmail.com',
  address: '18 Otigba Street, Opposite Slot Plaza, Computer Village, Ikeja, Lagos, Nigeria',
  shortAddress: 'Ikeja, Lagos, Nigeria',
  workingHours: 'Mon - Sat: 8:30 AM - 6:30 PM',
  weekendHours: 'Sunday: Closed (Emergency Hotline Active)'
};

export const SERVICES_DATA: ServiceItem[] = [
  {
    id: 'computer-repairs',
    title: 'Computer Repairs',
    category: 'repair',
    icon: 'Wrench',
    description: 'Comprehensive chip-level diagnostics, power troubleshooting, and precision hardware motherboard repairs.',
    fullDetails: 'Our state-of-the-art repair lab handles everything from no-power faults, short circuits, charging IC failures, and GPU reflow to liquid damage recovery. We use precision microscope inspection and ESD-safe stations.',
    turnaroundTime: '24 - 48 Hours',
    warranty: '90-Day Repair Warranty',
    keyFeatures: [
      'Micro-soldering & IC component replacement',
      'Liquid spill ultrasonic cleaning & restoration',
      'No-display and power rail diagnostic',
      'Bios chip reprogramming & recovery'
    ],
    color: 'purple'
  },
  {
    id: 'laptop-services',
    title: 'Laptop Services',
    category: 'repair',
    icon: 'Laptop',
    description: 'Broken screen replacement, damaged hinge fabrication, battery renewals, and precision keyboard repairs.',
    fullDetails: 'We service all major laptop brands including Dell, HP, Lenovo ThinkPad, Apple MacBook, ASUS, Acer, and MSI. Get authentic grade-A screens, original high-density batteries, and solid hinge reinforcements.',
    turnaroundTime: 'Same Day to 24 Hours',
    warranty: '90-Day Parts & Labor Warranty',
    keyFeatures: [
      'Original IPS, OLED & FHD screen replacements',
      'Hinge structural rebuilding & casing repairs',
      'OEM battery swaps with health calibration',
      'Spill-proof backlit keyboard replacements'
    ],
    color: 'purple'
  },
  {
    id: 'desktop-services',
    title: 'Desktop Services',
    category: 'hardware',
    icon: 'Cpu',
    description: 'Custom workstation builds, power supply unit diagnostics, thermal overhauls, and enterprise tower maintenance.',
    fullDetails: 'Specialized desktop services for gaming rigs, architecture & 3D rendering workstations, office towers, and trading terminals. We optimize airflow, apply high-performance thermal paste, and resolve bottlenecks.',
    turnaroundTime: '1 - 2 Business Days',
    warranty: '6-Month Comprehensive Warranty',
    keyFeatures: [
      'Custom PC design & precision cable routing',
      'Power supply (PSU) testing and replacement',
      'Liquid AIO & air cooler thermal optimization',
      'Motherboard socket repair & multi-GPU setup'
    ],
    color: 'purple'
  },
  {
    id: 'software-support',
    title: 'Software Support',
    category: 'support',
    icon: 'Terminal',
    description: 'OS clean installation, stubborn virus/malware eradication, driver optimization, and licensed software deployment.',
    fullDetails: 'Fix bluescreen loops, system freezes, corrupted boot sectors, and data bottlenecks. We provide licensed Windows 11 Pro, macOS Sonoma setups, accounting software installations, and proactive backup systems.',
    turnaroundTime: '2 - 4 Hours',
    warranty: '30-Day Configuration Guarantee',
    keyFeatures: [
      'Genuine Windows / macOS clean setup',
      'Advanced rootkit & ransomware removal',
      'Driver conflicts & BSOD error fixes',
      'Automatic cloud & NAS backup configurations'
    ],
    color: 'purple'
  },
  {
    id: 'hardware-upgrades',
    title: 'Hardware Upgrades',
    category: 'hardware',
    icon: 'Zap',
    description: 'Supercharge slow machines with blazing NVMe SSD storage, high-speed RAM expansions, and graphics acceleration.',
    fullDetails: 'Transform an aging slow laptop or desktop into a lightning-fast powerhouse. Upgrading from a mechanical hard drive to an ultra-fast PCIe NVMe SSD provides up to 15x faster boot and application load speeds.',
    turnaroundTime: '1 - 2 Hours (While you wait)',
    warranty: '1 to 3-Year Component Warranty',
    keyFeatures: [
      'PCIe Gen4 NVMe & SATA SSD cloning (0% data loss)',
      'DDR4 / DDR5 high-speed RAM memory kits',
      'Graphics card (GPU) and PSU power boosts',
      'CPU upgrade & high-grade thermal paste application'
    ],
    color: 'purple'
  },
  {
    id: 'it-support',
    title: 'IT Support',
    category: 'support',
    icon: 'Network',
    description: 'Structured LAN cabling, secure Wi-Fi deployment, printer networking, and enterprise IT maintenance contracts.',
    fullDetails: 'Empowering small to medium businesses across Nigeria with reliable IT infrastructure. We handle office networking, shared network storage (NAS), remote helpdesk support, and scheduled preventative maintenance.',
    turnaroundTime: 'On-Demand SLA & Scheduled Visits',
    warranty: 'Dedicated IT Support Agreements',
    keyFeatures: [
      'Office LAN, switch & Gigabit router configurations',
      'Multi-user network printer & scanner integration',
      'Secure remote desktop troubleshooting',
      'Regular maintenance visits & hardware audits'
    ],
    color: 'purple'
  },
  {
    id: 'computer-accessories',
    title: 'Computer Accessories',
    category: 'sales',
    icon: 'Headphones',
    description: 'Original high-power laptop chargers, multi-port USB-C hubs, mechanical keyboards, ergonomic mice, and adapters.',
    fullDetails: 'Never compromise with counterfeit chargers that fry logic boards. We stock verified original Type-C GaN adapters, durable HDMI/DisplayPort cables, surge protectors, laptop cooling stands, and high-precision peripherals.',
    turnaroundTime: 'Immediate Pick-up / Fast Courier Delivery',
    warranty: 'Replacement Warranty on Genuine Parts',
    keyFeatures: [
      'Original 45W, 65W, 90W, 100W+ GaN laptop chargers',
      'Heavy-duty surge suppressors & UPS units',
      'USB-C 8-in-1 4K HDMI docking hubs',
      'Ergonomic mice, mechanical keyboards & sleeves'
    ],
    color: 'purple'
  }
];

export const REPAIR_PROCESS: RepairStep[] = [
  {
    stepNumber: '01',
    title: 'Motherboard Diagnostic',
    tag: 'Precise Circuit Inspection',
    description: 'We run multi-point oscilloscope, voltage rail, and thermal camera diagnostics on motherboards and power ICs.',
    details: 'Before opening, we test power draw patterns, detect shorted capacitors on 19V/12V/5V rails, and test BIOS & RAM logic.',
    icon: 'Search',
    accentColor: '#22c55e',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80'
  },
  {
    stepNumber: '02',
    title: 'Precision Repair',
    tag: 'Chip-Level Rework',
    description: 'Certified technicians carry out exact microsoldering, BGA rework, component renewal, or OEM replacements.',
    details: 'Performed in our ESD-safe workstation using genuine OEM components, high-grade solder paste, and temperature-controlled stations.',
    icon: 'Wrench',
    accentColor: '#10b981',
    image: 'https://images.unsplash.com/photo-1597733336794-12d05021d510?auto=format&fit=crop&w=800&q=80'
  },
  {
    stepNumber: '03',
    title: 'Hardware Testing',
    tag: 'Stress & Stability Audit',
    description: 'Every repaired board undergoes 100% CPU/GPU stress tests, MemTest memory diagnostics, and thermal validation.',
    details: 'We verify memory stability, clock frequencies, power efficiency, battery charging cycles, and port connectivity under maximum workload.',
    icon: 'CheckCircle2',
    accentColor: '#059669',
    image: 'https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=800&q=80'
  },
  {
    stepNumber: '04',
    title: 'Final Quality Pass',
    tag: 'Sanitized & Handover',
    description: 'Your machine is thoroughly cleaned, fitted with a warranty seal, and packaged for pickup or dispatch.',
    details: 'You receive your itemized diagnostic sheet, 90-day warranty certificate, and direct maintenance recommendations.',
    icon: 'Sparkles',
    accentColor: '#16a34a',
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=800&q=80'
  }
];

export const PRODUCTS_DATA: ProductItem[] = [
  {
    id: 'dell-latitude-5420',
    name: 'Dell Latitude 5420 Enterprise Laptop',
    category: 'laptops',
    brand: 'Dell',
    condition: 'Brand New',
    priceDisplay: 'Contact for Daily Best Price',
    specs: [
      'Intel Core i7-1185G7 (Up to 4.80 GHz)',
      '16GB DDR4 3200MHz RAM',
      '512GB PCIe NVMe M.2 SSD',
      '14.0" FHD (1920x1080) Anti-Glare IPS',
      'Backlit Keyboard, Wi-Fi 6 & Thunderbolt 4'
    ],
    image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=800&q=80',
    badge: 'Enterprise Best-Seller',
    description: 'Rugged, ultra-reliable business workhorse designed for seamless multitasking, high-security tasks, and long battery life in office and field environments.',
    inStock: true,
    idealFor: 'Professionals, Corporate Offices, Software Developers'
  },
  {
    id: 'lenovo-thinkpad-t14',
    name: 'Lenovo ThinkPad T14 Gen 3',
    category: 'laptops',
    brand: 'Lenovo',
    condition: 'Brand New',
    priceDisplay: 'Contact for Daily Best Price',
    specs: [
      'Intel Core i7 12th Gen 10-Core Processor',
      '16GB High-Speed DDR4 RAM',
      '1TB PCIe Gen4 NVMe Solid State Drive',
      '14.0" WUXGA (1920x1200) 16:10 Display',
      'Legendary Spill-Resistant Keyboard & TrackPoint'
    ],
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=800&q=80',
    badge: 'Durability Champion',
    description: 'MIL-SPEC tested durability with best-in-class keyboard ergonomics, dual heat pipe thermal design, and robust security architecture.',
    inStock: true,
    idealFor: 'Engineers, Data Analysts, Frequent Travelers'
  },
  {
    id: 'hp-elitebook-840-g8',
    name: 'HP EliteBook 840 G8 Slim Ultrabook',
    category: 'laptops',
    brand: 'HP',
    condition: 'Certified Refurbished',
    priceDisplay: 'Contact for Daily Best Price',
    specs: [
      'Intel Core i5-1135G7 Processor',
      '16GB Dual-Channel RAM',
      '512GB NVMe High-Speed SSD',
      '14" Full HD IPS Narrow-Bezel Display',
      'Bang & Olufsen Premium Audio & Aluminum Body'
    ],
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
    badge: 'Executive Aluminum',
    description: 'Sleek all-metal chassis with privacy shutter camera, crisp Bang & Olufsen audio, and rapid charging support for on-the-go productivity.',
    inStock: true,
    idealFor: 'Managers, Students, Remote Workers'
  },
  {
    id: 'bolt-creator-workstation',
    name: 'BOLT Pro Custom Creator Desktop Workstation',
    category: 'desktops',
    brand: 'BOLT Custom',
    condition: 'Brand New',
    priceDisplay: 'Configured on Request',
    specs: [
      'Intel Core i7-14700K 20-Core / AMD Ryzen 9',
      '32GB DDR5 6000MHz RGB RAM',
      '1TB PCIe 4.0 NVMe + 2TB Secondary Storage',
      'NVIDIA GeForce RTX 4070 12GB Dedicated GPU',
      '750W 80+ Gold Certified Modular PSU & Mesh Case'
    ],
    image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=800&q=80',
    badge: 'High Performance',
    description: 'Handcrafted, stress-tested powerhouse tailored for 4K video rendering, AutoCAD/Revit engineering, Blender 3D, and heavy creative computing.',
    inStock: true,
    idealFor: '3D Artists, Architects, Video Editors, Gamers'
  },
  {
    id: 'samsung-980-pro-nvme',
    name: 'Samsung 980 Pro 1TB / 2TB PCIe 4.0 NVMe SSD',
    category: 'storage-ram',
    brand: 'Samsung',
    condition: 'Brand New',
    priceDisplay: 'Inquire for Stock Rates',
    specs: [
      'Read speeds up to 7,000 MB/s',
      'Write speeds up to 5,000 MB/s',
      'Nickel-coated controller with Dynamic Thermal Guard',
      'M.2 2280 form factor with 5-year manufacturer warranty'
    ],
    image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=800&q=80',
    badge: 'Ultra Fast Upgrade',
    description: 'Top-tier solid state drive to eliminate boot delays, instantly load large files, and revitalize any compatible PC or laptop.',
    inStock: true,
    idealFor: 'Instant System Speed Upgrades'
  },
  {
    id: 'kingston-fury-ddr4-ddr5',
    name: 'Kingston FURY Impact RAM Upgrade Kits (16GB / 32GB)',
    category: 'storage-ram',
    brand: 'Kingston',
    condition: 'Brand New',
    priceDisplay: 'Inquire for Stock Rates',
    specs: [
      'Available in SODIMM (Laptop) & UDIMM (Desktop)',
      'Frequencies from 3200MHz DDR4 to 5600MHz DDR5',
      'Low latency Plug N Play automatic overclocking',
      '100% factory tested at speed'
    ],
    image: 'https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=800&q=80',
    badge: 'Multitasking Boost',
    description: 'Eliminate browser tab lag and memory crashes. Includes free on-the-spot installation and memory integrity testing.',
    inStock: true,
    idealFor: 'Heavy Browser Multitasking, Virtual Machines'
  },
  {
    id: 'dell-ultrasharp-27-4k',
    name: 'Dell UltraSharp 27" 4K USB-C Hub Monitor (U2723QE)',
    category: 'monitors',
    brand: 'Dell',
    condition: 'Brand New',
    priceDisplay: 'Inquire for Stock Rates',
    specs: [
      '27" 4K UHD (3840 x 2160) IPS Black Technology',
      '98% DCI-P3 & VESA DisplayHDR 400 Color Accuracy',
      '90W USB-C Power Delivery with RJ45 Ethernet Hub',
      'Height, Tilt, Swivel and Pivot Adjustable Stand'
    ],
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80',
    badge: 'Color Precision',
    description: 'Stunning 4K clarity with IPS Black technology delivering 2000:1 contrast ratio, serving as a single-cable docking station for your laptop.',
    inStock: true,
    idealFor: 'Designers, Programmers, Clean Desk Setups'
  },
  {
    id: 'anker-gan-charger-hub',
    name: 'Anker Prime 67W / 100W Multi-Port GaN Laptop Fast Charger',
    category: 'accessories',
    brand: 'Anker',
    condition: 'Brand New',
    priceDisplay: 'Inquire for Stock Rates',
    specs: [
      'GaNPrime intelligent active temperature monitoring',
      '2x USB-C + 1x USB-A Simultaneous High-Speed Charging',
      'Compact foldable plug design (53% smaller than standard)',
      'Universal compatibility with MacBook, Dell, HP, Lenovo & Phones'
    ],
    image: 'https://images.unsplash.com/photo-1618410320928-25228d811631?auto=format&fit=crop&w=800&q=80',
    badge: 'Essential Gear',
    description: 'Replace bulky power bricks with a safe, ultra-compact GaN charger capable of powering your laptop and smartphone simultaneously.',
    inStock: true,
    idealFor: 'Mobile Executives, Power Users'
  }
];

export const WHY_BOLT_FEATURES: FeatureCard[] = [
  {
    id: 'reliable-service',
    title: 'Reliable Service',
    tagline: 'Predictable Turnaround Times',
    description: 'We respect your time and work deadlines. Get transparent diagnostic updates, clear milestones, and realistic timelines you can count on.',
    icon: 'Clock',
    colorScheme: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-700',
      badge: 'bg-blue-600'
    },
    bulletPoints: [
      'Same-day rapid turnaround on standard repairs & upgrades',
      'Real-time WhatsApp & SMS progress status updates',
      'Upfront transparent price estimates before any repair begins'
    ]
  },
  {
    id: 'professional-support',
    title: 'Professional Support',
    tagline: 'Certified Hardware Technicians',
    description: 'Our repair specialists and IT engineers possess deep component-level expertise across all PC and Mac platforms.',
    icon: 'ShieldCheck',
    colorScheme: {
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      text: 'text-purple-700',
      badge: 'bg-purple-600'
    },
    bulletPoints: [
      'Microscope-equipped ESD-protected diagnostic workstations',
      'Experienced in logic board circuitry & firmware recovery',
      'Dedicated enterprise SLA support for corporate clients'
    ]
  },
  {
    id: 'quality-work',
    title: 'Quality Work',
    tagline: 'Authentic Parts & Real Warranties',
    description: 'We never compromise on cheap knockoff parts that overheat or cause logic board damage. Every repair uses verified grade-A components.',
    icon: 'Award',
    colorScheme: {
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      text: 'text-emerald-700',
      badge: 'bg-emerald-600'
    },
    bulletPoints: [
      'Genuine OEM batteries, screens, ICs, and power modules',
      'Comprehensive 90-day parts & labor replacement warranty',
      'Rigorous stress testing and thermal benchmarks prior to release'
    ]
  },
  {
    id: 'customer-focus',
    title: 'Customer Focus',
    tagline: 'Honest Advice & Personalized Care',
    description: 'We treat your tech like our own. If a machine is not cost-effective to repair, we will honestly tell you rather than waste your funds.',
    icon: 'HeartHandshake',
    colorScheme: {
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      text: 'text-orange-700',
      badge: 'bg-orange-600'
    },
    bulletPoints: [
      'Free initial diagnostic consultation at our Ikeja workshop',
      'Direct WhatsApp chat with the technician handling your device',
      'Dedicated post-repair follow-up and maintenance guidance'
    ]
  }
];
