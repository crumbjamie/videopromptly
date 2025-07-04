'use client';

import { useState } from 'react';
import { ChevronDownIcon } from '@radix-ui/react-icons';
import { useCasesData } from '@/lib/use-cases-data';

export default function UseCases() {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (
    <section className="mb-16">
      <h2 className="text-3xl font-bold text-white mb-8">What Can You Create?</h2>
      <p className="text-lg text-white mb-8">
        Discover the endless possibilities of AI image transformation across personal, professional, and creative applications.
      </p>
      
      <div className="space-y-3">
        {useCasesData.map((useCase, index) => (
          <div
            key={index}
            className="bg-stone-900 rounded-lg overflow-hidden border border-stone-800"
          >
            <button
              onClick={() => toggleItem(index)}
              className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-stone-800 transition-colors"
              aria-expanded={openItems.includes(index)}
              aria-controls={`usecase-content-${index}`}
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl" aria-hidden="true">{useCase.icon}</span>
                <h3 className="text-lg font-medium text-white">
                  {useCase.title}
                </h3>
              </div>
              <ChevronDownIcon 
                className={`w-5 h-5 text-stone-400 transition-transform ${
                  openItems.includes(index) ? 'rotate-180' : ''
                }`}
                aria-hidden="true"
              />
            </button>
            
            <div
              id={`usecase-content-${index}`}
              className={`overflow-hidden transition-all duration-300 ${
                openItems.includes(index) ? 'max-h-96' : 'max-h-0'
              }`}
            >
              <div className="px-6 pb-4">
                <p className="text-white mb-3">
                  {useCase.description}
                </p>
                {useCase.examples.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-stone-400 mb-2">Popular prompts for this use case:</p>
                    <ul className="list-disc list-inside space-y-1">
                      {useCase.examples.map((example, exIndex) => (
                        <li key={exIndex} className="text-sm text-stone-400">
                          {example}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}