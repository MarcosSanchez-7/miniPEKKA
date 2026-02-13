import React, { useState, useEffect } from 'react';

interface HeroSlide {
    id: number;
    title: string;
    subtitle: string;
    description: string;
    image: string;
    cta: string;
    ctaLink: string;
    bgGradient: string;
}

const heroSlides: HeroSlide[] = [
    {
        id: 1,
        title: '¡SUPER OFERTAS!',
        subtitle: 'Hasta 50% OFF',
        description: 'En electrodomésticos seleccionados. Aprovechá los mejores precios del año.',
        image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&h=600&fit=crop',
        cta: 'Ver Ofertas',
        ctaLink: '#ofertas',
        bgGradient: 'from-orange-500 to-red-500'
    },
    {
        id: 2,
        title: 'ENVÍO GRATIS',
        subtitle: 'En compras mayores a $50.000',
        description: 'Recibí tus productos en la puerta de tu casa sin costo adicional.',
        image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&h=600&fit=crop',
        cta: 'Comprar Ahora',
        ctaLink: '#productos',
        bgGradient: 'from-blue-500 to-cyan-500'
    },
    {
        id: 3,
        title: 'FINANCIACIÓN',
        subtitle: '12 cuotas sin interés',
        description: 'Llevá el electrodoméstico que necesitás y pagalo en cómodas cuotas.',
        image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop',
        cta: 'Conocer Más',
        ctaLink: '#financiacion',
        bgGradient: 'from-purple-500 to-pink-500'
    }
];

const HeroCarousel: React.FC = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    useEffect(() => {
        if (!isAutoPlaying) return;

        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [isAutoPlaying]);

    const goToSlide = (index: number) => {
        setCurrentSlide(index);
        setIsAutoPlaying(false);
        setTimeout(() => setIsAutoPlaying(true), 10000);
    };

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
    };

    const slide = heroSlides[currentSlide];

    return (
        <div className="relative h-[500px] md:h-[600px] overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0">
                <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-full h-full object-cover opacity-30 transition-all duration-1000"
                    key={slide.id}
                />
                <div className={`absolute inset-0 bg-gradient-to-r ${slide.bgGradient} opacity-60 mix-blend-multiply`}></div>
            </div>

            {/* Content */}
            <div className="relative h-full max-w-7xl mx-auto px-6 flex items-center">
                <div className="max-w-2xl animate-slide-up" key={`content-${slide.id}`}>
                    <div className="inline-block bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-4 py-2 mb-6">
                        <span className="text-white text-sm font-semibold">✨ {slide.subtitle}</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                        {slide.title}
                    </h1>

                    <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed">
                        {slide.description}
                    </p>

                    <div className="flex flex-wrap gap-4">
                        <a
                            href={slide.ctaLink}
                            className="bg-white hover:bg-slate-100 text-slate-900 px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-2xl hover:shadow-white/20 active:scale-95 inline-flex items-center gap-2"
                        >
                            {slide.cta}
                            <span className="material-icons">arrow_forward</span>
                        </a>
                        <button className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all active:scale-95">
                            Más Información
                        </button>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-white/20">
                        <div>
                            <p className="text-3xl font-bold text-white mb-1">+1000</p>
                            <p className="text-sm text-white/70">Productos</p>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-white mb-1">24/7</p>
                            <p className="text-sm text-white/70">Atención</p>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-white mb-1">⭐ 4.9</p>
                            <p className="text-sm text-white/70">Valoración</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Arrows */}
            <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 rounded-full flex items-center justify-center transition-all group"
            >
                <span className="material-icons text-white group-hover:scale-110 transition-transform">chevron_left</span>
            </button>
            <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 rounded-full flex items-center justify-center transition-all group"
            >
                <span className="material-icons text-white group-hover:scale-110 transition-transform">chevron_right</span>
            </button>

            {/* Dots Indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
                {heroSlides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`transition-all ${index === currentSlide
                                ? 'w-12 h-3 bg-white'
                                : 'w-3 h-3 bg-white/40 hover:bg-white/60'
                            } rounded-full`}
                    />
                ))}
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-20 right-20 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-float"></div>
            <div className="absolute bottom-20 left-20 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        </div>
    );
};

export default HeroCarousel;
