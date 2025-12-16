// Type for gallery image
export interface GalleryImage {
    id: number
    src: string
    title: string
    category: string
    featured: boolean
    isUserUpload?: boolean // true if uploaded by user, false/undefined for sample images
}

// Category type
export interface Category {
    id: string
    name: string
    icon: string
}
