import { useState, useEffect } from 'react';
import { Calendar, Sparkles } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ProductCard } from '@/components/ProductCard';
import { eventCollections, getEventProducts } from '@/data/eventProducts';

export const EventMerchSection = () => {
  const [selectedEvent, setSelectedEvent] = useState<string>('All');
  const [currentSlide, setCurrentSlide] = useState(0);
  const products = getEventProducts(selectedEvent);
  const activeEvents = eventCollections.filter(e => e.isActive);

  // Auto-advance the carousel when "All" is selected
  useEffect(() => {
    if (selectedEvent !== 'All' || activeEvents.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % activeEvents.length);
    }, 4000); // 4 seconds per slide
    
    return () => clearInterval(interval);
  }, [selectedEvent, activeEvents.length]);

  return (
    <section className="py-12 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-3 mb-2">
          <Calendar className="h-8 w-8 text-primary" />
          <h2 className="text-3xl font-bold text-foreground">Event Merchandise</h2>
        </div>
        <p className="text-muted-foreground mb-8">
          Exclusive collections for campus events and celebrations
        </p>

        <Tabs value={selectedEvent} onValueChange={setSelectedEvent} className="w-full">
          <TabsList className="flex-wrap h-auto gap-2 bg-transparent mb-8 justify-start">
            <TabsTrigger 
              value="All" 
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Sparkles className="h-4 w-4 mr-1" />
              All Events
            </TabsTrigger>
            {activeEvents.map(event => (
              <TabsTrigger 
                key={event.id} 
                value={event.name}
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                {event.name}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={selectedEvent} className="mt-0">
            {/* Dynamic Carousel for "All Events" */}
            {selectedEvent === 'All' && activeEvents.length > 0 && (
              <div className="mb-8 relative rounded-xl overflow-hidden h-64 group shadow-lg">
                {activeEvents.map((event, index) => (
                  <div 
                    key={event.id}
                    className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                  >
                    <img
                      src={event.image}
                      alt={event.name}
                      className="w-full h-full object-cover transition-transform duration-10000 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-transparent flex items-center">
                      <div className="p-8 md:p-12 text-primary-foreground max-w-lg">
                        <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-semibold mb-3">
                          Featured Event
                        </span>
                        <h3 className="text-3xl md:text-4xl font-bold mb-3 drop-shadow-md">{event.name}</h3>
                        <p className="opacity-90 mb-6 text-lg drop-shadow-sm">
                          {event.description}
                        </p>
                        <button 
                          onClick={() => setSelectedEvent(event.name)}
                          className="bg-primary-foreground text-primary px-6 py-2 rounded-md font-semibold hover:bg-white hover:scale-105 transition-all shadow-md"
                        >
                          View Collection
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Carousel Indicators */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                  {activeEvents.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`h-2.5 rounded-full transition-all duration-300 ${index === currentSlide ? 'bg-white w-8' : 'bg-white/50 w-2.5 hover:bg-white/80'}`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Event Banner (when specific event selected) */}
            {selectedEvent !== 'All' && (
              <div className="mb-8 relative rounded-xl overflow-hidden h-48 shadow-md">
                <img
                  src={activeEvents.find(e => e.name === selectedEvent)?.image || ''}
                  alt={selectedEvent}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-transparent flex items-center">
                  <div className="p-8 text-primary-foreground max-w-lg">
                    <h3 className="text-2xl font-bold mb-2">{selectedEvent}</h3>
                    <p className="opacity-90">
                      {activeEvents.find(e => e.name === selectedEvent)?.description}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Products Grid */}
            {products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Calendar className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-muted-foreground">No products available for this event yet.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};
