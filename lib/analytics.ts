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
  conversion_type: 'veo3_click' | 'copy_prompt' | 'view_video' | 'search' | 'category_browse' | 'tag_browse' | 'video_play' | 'video_pause' | 'hover_preview';
  prompt_id?: string;
  prompt_title?: string;
  category?: string;
  search_query?: string;
  video_duration?: number;
  video_resolution?: string;
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

  // Track Veo3 button click
  trackVeo3Click(promptId: string, promptTitle: string): void {
    this.pushEvent({
      event: 'conversion',
      conversion_type: 'veo3_click',
      prompt_id: promptId,
      prompt_title: promptTitle,
      category: 'engagement',
      action: 'click',
      label: 'veo3_integration'
    } as ConversionEvent);
  }

  // Legacy method for backwards compatibility
  trackChatGPTClick(promptId: string, promptTitle: string): void {
    this.trackVeo3Click(promptId, promptTitle);
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

  // Track video view
  trackVideoView(promptId: string, promptTitle: string, category?: string, duration?: number, resolution?: string): void {
    this.pushEvent({
      event: 'conversion',
      conversion_type: 'view_video',
      prompt_id: promptId,
      prompt_title: promptTitle,
      category: category || 'content',
      action: 'view',
      label: 'video_detail',
      video_duration: duration,
      video_resolution: resolution
    } as ConversionEvent);
  }

  // Legacy method for backwards compatibility
  trackPromptView(promptId: string, promptTitle: string, category?: string): void {
    this.trackVideoView(promptId, promptTitle, category);
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

  // Track video play
  trackVideoPlay(promptId: string, promptTitle: string): void {
    this.pushEvent({
      event: 'conversion',
      conversion_type: 'video_play',
      prompt_id: promptId,
      prompt_title: promptTitle,
      category: 'engagement',
      action: 'play',
      label: 'video_interaction'
    } as ConversionEvent);
  }

  // Track video pause
  trackVideoPause(promptId: string, promptTitle: string): void {
    this.pushEvent({
      event: 'conversion',
      conversion_type: 'video_pause',
      prompt_id: promptId,
      prompt_title: promptTitle,
      category: 'engagement',
      action: 'pause',
      label: 'video_interaction'
    } as ConversionEvent);
  }

  // Track hover preview
  trackHoverPreview(promptId: string, promptTitle: string): void {
    this.pushEvent({
      event: 'conversion',
      conversion_type: 'hover_preview',
      prompt_id: promptId,
      prompt_title: promptTitle,
      category: 'engagement',
      action: 'hover',
      label: 'video_preview'
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