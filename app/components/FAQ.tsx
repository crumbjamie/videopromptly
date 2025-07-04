'use client';

import { useState } from 'react';
import { ChevronDownIcon } from '@radix-ui/react-icons';
import { faqData } from '@/lib/faq-data';
import { generateFAQSchema } from '@/lib/schema';
import Script from 'next/script';

export default function FAQ() {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const faqSchema = generateFAQSchema(faqData);

  return (
    <section className="bg-stone-950 border-t border-stone-800 py-16" aria-labelledby="faq-heading">
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      
      <div className="container mx-auto px-4 max-w-4xl">
        <h2 id="faq-heading" className="text-3xl font-bold text-white text-center mb-12">
          Frequently Asked Questions
        </h2>
        
        <div>
          {faqData.map((faq, index) => (
            <div
              key={index}
              className="overflow-hidden border-b border-stone-800 last:border-b-0"
            >
              <button
                onClick={() => toggleItem(index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between group"
                aria-expanded={openItems.includes(index)}
                aria-controls={`faq-answer-${index}`}
              >
                <h3 className="text-lg font-medium text-white pr-4 group-hover:text-stone-200 transition-colors">
                  {faq.question}
                </h3>
                <ChevronDownIcon 
                  className={`w-5 h-5 text-stone-400 transition-transform group-hover:text-stone-200 ${
                    openItems.includes(index) ? 'rotate-180' : ''
                  }`}
                  aria-hidden="true"
                />
              </button>
              
              <div
                id={`faq-answer-${index}`}
                className={`overflow-hidden transition-all duration-300 ${
                  openItems.includes(index) ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <div className="px-6 pb-4 text-white">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}