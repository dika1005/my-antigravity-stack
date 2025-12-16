import { GalleryImage, Category } from './gallery'

// Sample gallery data with placeholder images
export const initialGalleryImages: GalleryImage[] = [
    { id: 1, src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80', title: 'Mountain Aurora', category: 'nature', featured: true },
    { id: 2, src: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&q=80', title: 'City Lights', category: 'architecture', featured: false },
    { id: 3, src: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&q=80', title: 'Portrait Study', category: 'portrait', featured: true },
    { id: 4, src: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80', title: 'Foggy Valley', category: 'nature', featured: false },
    { id: 5, src: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80', title: 'Modern Tower', category: 'architecture', featured: true },
    { id: 6, src: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&q=80', title: 'Natural Beauty', category: 'portrait', featured: false },
    { id: 7, src: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&q=80', title: 'Ocean Waves', category: 'nature', featured: false },
    { id: 8, src: 'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?w=800&q=80', title: 'Glass Building', category: 'architecture', featured: false },
    { id: 9, src: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&q=80', title: 'Smile', category: 'portrait', featured: true },
    { id: 10, src: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=800&q=80', title: 'Waterfall', category: 'nature', featured: false },
    { id: 11, src: 'https://images.unsplash.com/photo-1494526585095-c41746248156?w=800&q=80', title: 'Villa Resort', category: 'architecture', featured: true },
    { id: 12, src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80', title: 'Fashion Shot', category: 'portrait', featured: false },
]

export const categories: Category[] = [
    { id: 'all', name: 'Semua', icon: '✨' },
    { id: 'nature', name: 'Alam', icon: '🌿' },
    { id: 'architecture', name: 'Arsitektur', icon: '🏛️' },
    { id: 'portrait', name: 'Potret', icon: '👤' },
    { id: 'abstract', name: 'Abstrak', icon: '🎨' },
]
