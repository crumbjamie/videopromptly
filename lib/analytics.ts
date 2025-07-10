// Google Tag Manager Analytics Utility
// This utility provides a type-safe interface for pushing events to GTM's dataLayer

interface GTMEvent {
  event: string;
  category?: string;
  action?: string;
  label?: string;
  value?: number;
  [key: string]: string | number | undefined;
}

interface ConversionEvent extends GTMEvent {
  event: 'conversion';
  conversion_type: 'chatgpt_click' | 'copy_prompt' | 'view_prompt' | 'search' | 'category_browse' | 'tag_browse';
  prompt_id?: string;
  prompt_title?: string;
  category?: string;
  search_query?: string;
}

declare global {
  interface Window {
    dataLayer: GTMEvent[];
  }
}

class Analytics {
  private static instance: Analytics;

  private constructor() {
    // Initialize dataLayer if it doesn't exist
    if (typeof window !== 'undefined' && !window.dataLayer) {
      window.dataLayer = [];
    }
  }

  static getInstance(): Analytics {
    if (!Analytics.instance) {
      Analytics.instance = new Analytics();
    }
    return Analytics.instance;
  }

  // Push event to GTM dataLayer
  private pushEvent(eventData: GTMEvent): void {
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push(eventData);
    }
  }

  // Track ChatGPT button click
  trackChatGPTClick(promptId: string, promptTitle: string): void {
    this.pushEvent({
      event: 'conversion',
      conversion_type: 'chatgpt_click',
      prompt_id: promptId,
      prompt_title: promptTitle,
      category: 'engagement',
      action: 'click',
      label: 'chatgpt_integration'
    } as ConversionEvent);
  }

  // Track copy prompt action
  trackCopyPrompt(promptId: string, promptTitle: string): void {
    this.pushEvent({
      event: 'conversion',
      conversion_type: 'copy_prompt',
      prompt_id: promptId,
      prompt_title: promptTitle,
      category: 'engagement',
      action: 'copy',
      label: 'prompt_text'
    } as ConversionEvent);
  }

  // Track prompt view
  trackPromptView(promptId: string, promptTitle: string, category?: string): void {
    this.pushEvent({
      event: 'conversion',
      conversion_type: 'view_prompt',
      prompt_id: promptId,
      prompt_title: promptTitle,
      category: category || 'content',
      action: 'view',
      label: 'prompt_detail'
    } as ConversionEvent);
  }

  // Track search
  trackSearch(searchQuery: string, resultsCount: number): void {
    this.pushEvent({
      event: 'conversion',
      conversion_type: 'search',
      search_query: searchQuery,
      category: 'search',
      action: 'search',
      label: searchQuery,
      value: resultsCount
    } as ConversionEvent);
  }

  // Track category browse
  trackCategoryBrowse(category: string): void {
    this.pushEvent({
      event: 'conversion',
      conversion_type: 'category_browse',
      category: category,
      action: 'browse',
      label: `category_${category}`
    } as ConversionEvent);
  }

  // Track tag browse
  trackTagBrowse(tag: string): void {
    this.pushEvent({
      event: 'conversion',
      conversion_type: 'tag_browse',
      category: 'navigation',
      action: 'browse',
      label: `tag_${tag}`
    } as ConversionEvent);
  }

  // Generic event tracking
  trackEvent(category: string, action: string, label?: string, value?: number): void {
    this.pushEvent({
      event: 'custom_event',
      category,
      action,
      label,
      value
    });
  }

  // Page view tracking (useful for SPA route changes)
  trackPageView(pagePath: string, pageTitle?: string): void {
    this.pushEvent({
      event: 'page_view',
      page_path: pagePath,
      page_title: pageTitle || document.title
    });
  }
}

// Export singleton instance
export const analytics = Analytics.getInstance();

// Export types for use in components
export type { ConversionEvent, GTMEvent };